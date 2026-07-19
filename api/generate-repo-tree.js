// Vercel serverless function — on-demand repo tree/status snapshot for
// the "Repo Tree — Ver" card. Same pattern as generate-baseline-status.js:
// no npm dependencies, uses the global fetch available in Vercel's
// Node.js runtime, optional GITHUB_TOKEN env var for rate limit/private
// repo access — never hardcoded, never exposed client-side.
//
// Deliberately lists every repo live from the GitHub API rather than a
// hardcoded categorization (KOS ecosystem / ODO ecosystem / etc.) —
// that curation lives in docs (docs/MASTER_DIRECTION_FAST_REFERENCE.md
// and friends) and in one-off Artifacts, not here, so this snapshot
// can't silently go stale when a repo is added/renamed/removed.

const OWNER = 'hdashadm-afk';

module.exports = async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const headers = { Accept: 'application/vnd.github+json' };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  try {
    const ghRes = await fetch(`https://api.github.com/users/${OWNER}/repos?per_page=100&sort=pushed`, { headers });
    if (!ghRes.ok) {
      const body = await ghRes.text();
      console.error('[generate-repo-tree] GitHub API error:', ghRes.status, body);
      res.status(502).json({ error: `GitHub API returned ${ghRes.status}. If repos are private, set a GITHUB_TOKEN environment variable on Vercel.` });
      return;
    }

    const repos = await ghRes.json();
    if (!Array.isArray(repos) || !repos.length) {
      res.status(200).json({ treeMarkdown: `No repos found for ${OWNER}.` });
      return;
    }

    const lines = [`**${OWNER}** — ${repos.length} repos, most recently pushed first (live from GitHub, generated ${new Date().toISOString()})`, ''];
    for (const r of repos) {
      const pushedAt = r.pushed_at ? new Date(r.pushed_at).toISOString().split('T')[0] : 'never';
      const desc = r.description ? ` — ${r.description}` : '';
      const flags = [r.private ? 'private' : 'public', r.archived ? 'archived' : null].filter(Boolean).join(', ');
      lines.push(`- **${r.name}** (${flags}, last push ${pushedAt}, default branch \`${r.default_branch}\`)${desc}`);
    }

    res.status(200).json({ treeMarkdown: lines.join('\n') });
  } catch (err) {
    console.error('[generate-repo-tree] fatal:', err);
    res.status(500).json({ error: 'Server error generating repo tree.' });
  }
};
