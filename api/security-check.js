// Vercel serverless function — on-demand security/compliance check
// for TVGSUOS's Security/Privacy/Compliance governance area.
//
// Calls the Supabase Management API's advisors endpoints (security +
// performance) for the shared KOS Supabase project — same checks
// the `get_advisors` Supabase MCP tool runs in an interactive Claude
// session, exposed here as a REST call for the deployed app.
// Ecosystem-wide posture belongs to TVGSUOS, not KOS, so this lives
// here rather than being borrowed from katiwala-owner-os-'s own
// api/generate-governance-risk.js (same pattern, ported, returns
// full lint detail instead of one collapsed string since this is a
// dedicated security page, not a one-line daily-check field).
//
// Requires SUPABASE_MANAGEMENT_TOKEN — a personal access token from
// the Supabase account (Settings → Access Tokens), NOT a project
// service-role key. This is a SEPARATE Vercel project from
// katiwala-owner-os-, so its env vars don't carry over even though
// it might already be set there — must be added to tvgsuosweb's own
// Vercel project settings. Not configured until then — returns a
// clear "not configured" error rather than crashing.

const PROJECT_REF = 'jbhfdmujqrtqkhacfegl';
const MANAGEMENT_API = 'https://api.supabase.com/v1';

async function fetchAdvisors(type, token) {
  const res = await fetch(`${MANAGEMENT_API}/projects/${PROJECT_REF}/advisors/${type}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return { ok: false, status: res.status };
  const data = await res.json();
  return { ok: true, lints: Array.isArray(data.lints) ? data.lints : [] };
}

module.exports = async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const token = process.env.SUPABASE_MANAGEMENT_TOKEN;
  if (!token) {
    res.status(200).json({
      notConfigured: true,
      error: 'SUPABASE_MANAGEMENT_TOKEN is not set on this Vercel project — add it under tvgsuosweb’s own Settings → Environment Variables.',
    });
    return;
  }

  try {
    const [security, performance] = await Promise.all([
      fetchAdvisors('security', token),
      fetchAdvisors('performance', token),
    ]);

    if (!security.ok || !performance.ok) {
      res.status(502).json({ error: `Supabase Management API returned an error (security: ${security.ok ? 'ok' : security.status}, performance: ${performance.ok ? 'ok' : performance.status}).` });
      return;
    }

    const findings = [...security.lints, ...performance.lints]
      .filter(l => l.level === 'ERROR' || l.level === 'WARN')
      .map(l => ({
        level: l.level,
        title: l.title || l.name || l.description || 'Unlabeled issue',
        detail: l.detail || l.description || null,
        remediation: l.remediation || null,
      }));

    res.status(200).json({ findings, checkedAt: new Date().toISOString() });
  } catch (err) {
    console.error('[security-check] error:', err);
    res.status(500).json({ error: 'Failed to fetch Supabase advisors.' });
  }
};
