// Vercel serverless function — pulls recent commit activity from
// GitHub for the Daily Baseline Check "Regenerate" button, since the
// scheduled Claude Routine that's supposed to fill this in daily has
// proven unreliable (silent stalls). Ported from katiwala-owner-os-'s
// api/generate-baseline-status.js (Founder OS consolidation, Task 7)
// — that app's own Regenerate button was removed once this landed
// here, so this stays the one place the manual escape hatch lives.
// Added TVGSUOS itself to the repo list, since Ver's own home repo's
// activity is as relevant to "app/repo status" as KOS's.
//
// No npm dependencies; uses the global fetch available in Vercel's
// Node.js runtime. Optional GITHUB_TOKEN environment variable raises
// the GitHub API rate limit and is required if any of these repos is
// private — never hardcode it here, and never expose it to
// client-side code.
//
// Also returns `priorities` — a deterministic (not AI-synthesized)
// cross-repo summary, as a manual-regenerate fallback for the
// priorities field the scheduled "Daily Baseline Check — Ver" Routine
// is supposed to write. This is intentionally simpler than what the
// Routine produces (no reasoning, just facts) — labeled as such in
// the UI. Reads the pending ver_queries count via
// SUPABASE_SERVICE_ROLE_KEY (same shared project ask-ver.js already
// uses) — no new credential needed.

const REPOS = [
  { owner: 'hdashadm-afk', name: 'TVGSUOS', label: 'TVGSUOS' },
  { owner: 'hdashadm-afk', name: 'katiwala-owner-os-', label: 'KOS' },
  { owner: 'hdashadm-afk', name: 'staffverified-app', label: 'StaffVerified' },
  { owner: 'hdashadm-afk', name: 'fuel-ops', label: 'Station Verified' },
];
const LOOKBACK_HOURS = 48;
const SUPABASE_URL = 'https://jbhfdmujqrtqkhacfegl.supabase.co';

async function fetchRecentTitles(owner, name, headers, since) {
  const url = `https://api.github.com/repos/${owner}/${name}/commits?sha=main&since=${since}&per_page=20`;
  const ghRes = await fetch(url, { headers });
  if (!ghRes.ok) return { ok: false, titles: [] };
  const commits = await ghRes.json();
  const titles = [];
  for (const c of commits) {
    const title = (c.commit && c.commit.message ? c.commit.message.split('\n')[0] : '').trim();
    if (title && !titles.includes(title)) titles.push(title);
    if (titles.length >= 3) break;
  }
  return { ok: true, titles };
}

async function fetchPendingVerQueryCount() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) return null;
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/ver_queries?status=eq.pending&select=id`, {
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
        Prefer: 'count=exact',
      },
    });
    if (!res.ok) return null;
    const rows = await res.json();
    return Array.isArray(rows) ? rows.length : null;
  } catch {
    return null;
  }
}

module.exports = async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const since = new Date(Date.now() - LOOKBACK_HOURS * 60 * 60 * 1000).toISOString();
  const headers = { Accept: 'application/vnd.github+json' };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  try {
    const [firstResult, ...rest] = await Promise.all(REPOS.map(r => fetchRecentTitles(r.owner, r.name, headers, since)));

    if (!firstResult.ok) {
      res.status(502).json({ error: `GitHub API error fetching ${REPOS[0].name}. If this repo is private, set a GITHUB_TOKEN environment variable on Vercel.` });
      return;
    }

    const appStatus = firstResult.titles.length
      ? `Recent changes: ${firstResult.titles.join('; ')}.`
      : `No app/repo changes in the last ${LOOKBACK_HOURS}h.`;

    const perRepoLines = REPOS.map((r, i) => {
      const result = i === 0 ? firstResult : rest[i - 1];
      if (!result.ok) return `${r.label}: couldn't fetch (GitHub API error).`;
      if (!result.titles.length) return `${r.label}: no changes in the last ${LOOKBACK_HOURS}h.`;
      return `${r.label}: ${result.titles.join('; ')}.`;
    });

    const pendingVerQueries = await fetchPendingVerQueryCount();
    if (pendingVerQueries !== null && pendingVerQueries > 0) {
      perRepoLines.push(`${pendingVerQueries} Ver ${pendingVerQueries === 1 ? 'query' : 'queries'} awaiting an answer.`);
    }

    const priorities = `[Quick regenerate — facts only, not reasoned] ${perRepoLines.join(' ')}`;

    res.status(200).json({ appStatus, priorities });
  } catch (err) {
    console.error('[generate-baseline-status] error:', err);
    res.status(500).json({ error: 'Failed to fetch recent commit activity.' });
  }
};
