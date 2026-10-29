// Vercel serverless function — on-demand security/compliance check
// for TVGSUOS's Security/Privacy/Compliance governance area.
//
// Calls the Supabase Management API's advisors endpoints (security +
// performance) for the shared KOS Supabase project.
//
// RESTRICTIVE TREATMENT (2026-10-29, PR #73 remediation). This route holds
// SUPABASE_MANAGEMENT_TOKEN, a personal access token for the whole Supabase
// ACCOUNT — far wider than any one project's service-role key. So, beyond the
// founder gate:
//   1. OFF BY DEFAULT. It runs only when the server sets
//      SECURITY_CHECK_ENABLED=true. Unset or anything else returns 403
//      { disabled: true } and the token is never read.
//   2. FIXED OPERATION. Two GETs, to one hard-coded project's advisors. No
//      caller input reaches the Management API (no project, path or type).
//   3. MINIMAL OUTPUT. Level, a short title and counts only. No lint detail,
//      remediation text, metadata, upstream status code or token hint.
//   4. FAILS CLOSED. Auth failure, a missing token, or an upstream error
//      returns an error and no findings.
// Auth decision: founder only (api/_founder-auth.js), checked before anything.

const { requireFounder } = require('./_founder-auth');

const PROJECT_REF = 'jbhfdmujqrtqkhacfegl';
const MANAGEMENT_API = 'https://api.supabase.com/v1';
const MAX_FINDINGS = 50;
const MAX_TITLE = 120;

async function fetchAdvisors(type, token) {
  const res = await fetch(`${MANAGEMENT_API}/projects/${PROJECT_REF}/advisors/${type}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return { ok: false };
  const data = await res.json();
  return { ok: true, lints: Array.isArray(data.lints) ? data.lints : [] };
}

function securityCheckEnabled(env = process.env) {
  return env.SECURITY_CHECK_ENABLED === 'true';
}

module.exports = async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  if (!(await requireFounder(req, res))) return;

  if (!securityCheckEnabled()) {
    res.status(403).json({
      disabled: true,
      notConfigured: true,
      error: 'Security check is off on this deployment. It runs only when the server enables it.',
    });
    return;
  }

  const token = process.env.SUPABASE_MANAGEMENT_TOKEN;
  if (!token) {
    res.status(200).json({ notConfigured: true, error: 'Security check is enabled but not configured on this deployment.' });
    return;
  }

  try {
    const [security, performance] = await Promise.all([
      fetchAdvisors('security', token),
      fetchAdvisors('performance', token),
    ]);
    if (!security.ok || !performance.ok) {
      res.status(502).json({ error: 'The advisor check could not be completed.' });
      return;
    }

    const kept = [...security.lints, ...performance.lints].filter((l) => l && (l.level === 'ERROR' || l.level === 'WARN'));
    const counts = { ERROR: kept.filter((l) => l.level === 'ERROR').length, WARN: kept.filter((l) => l.level === 'WARN').length };
    const findings = kept.slice(0, MAX_FINDINGS).map((l) => ({
      level: l.level,
      title: String(l.title || l.name || 'Unlabeled issue').slice(0, MAX_TITLE),
    }));
    res.status(200).json({ findings, counts, truncated: kept.length > MAX_FINDINGS, checkedAt: new Date().toISOString() });
  } catch (err) {
    console.error('[security-check] failed');
    res.status(500).json({ error: 'The advisor check could not be completed.' });
  }
};

module.exports.securityCheckEnabled = securityCheckEnabled;
