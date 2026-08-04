// Vercel serverless function — reads the new Notion-based Founder OS
// (Ventures / Issues / Decisions databases, built 2026-08-04 out of
// katiwala-owner-os-'s docs/founder-os/ reconciliation work) so
// index.html's "Needs Your Attention" tile grid can show a combined
// Supabase + Notion view for Critical Alerts and Open Decisions.
//
// Deliberately scoped to those two tiles only. Access Requests,
// High-Priority Tasks, and Compliance Due Soon were investigated and
// NOT wired here — they already read real, populated, purpose-built
// Supabase sources (list_pending_users RPC, founder_tasks, 17 rows;
// compliance_items, 17 rows) that mean something different from a
// generic "Issue" row, and the new Notion Issues database only has a
// couple of seed rows today. Pointing those three tiles at Notion
// would have silently hidden real signal, not added to it — see the
// founder's own 2026-08-04 call on this before extending further.
//
// Requires NOTION_API_KEY (an internal Notion integration token) as a
// Vercel env var, AND that integration must be explicitly shared on
// the Issues and Decisions databases inside Notion — API integrations
// only see what's shared with them, this repo's env var alone isn't
// enough. Neither is set up yet as of this commit; returns a clear
// "not configured" shape (same pattern every other api/*.js file here
// uses for a missing credential) rather than crashing the tile grid.

const NOTION_VERSION = '2022-06-28';

// Database IDs (not data source IDs — these are single-source
// databases, so Notion's classic /v1/databases/{id}/query endpoint
// takes the database id directly), from the Ventures/Issues/Decisions
// databases created under Notion's "Founder OS Home" page.
const DB = {
  issues: 'dedf21d4-9853-43f8-b470-a9c1516aad89',
  decisions: 'e70202a5-f2d6-4d1a-b6c0-02e2008378c6',
};

const OPEN_ISSUE_STATUSES = ['New', 'In analysis', 'New decision needed'];
const OPEN_DECISION_STATUSES = ['Proposed', 'Approved', 'Implemented'];

function selectEq(property, value) {
  return { property, select: { equals: value } };
}

function statusIsOneOf(property, values) {
  return { or: values.map((v) => selectEq(property, v)) };
}

// Notion's query endpoint paginates (max page_size 100, no direct
// "total count" field) — these databases are tiny today (single
// digits to low tens of rows), so a bounded pagination loop is enough
// to get an exact count/list without assuming a hard cap.
async function notionQueryAll(databaseId, filter, apiKey, { maxPages = 5 } = {}) {
  const results = [];
  let cursor;
  for (let page = 0; page < maxPages; page++) {
    const res = await fetch(`https://api.notion.com/v1/databases/${databaseId}/query`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Notion-Version': NOTION_VERSION,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        filter,
        page_size: 100,
        ...(cursor ? { start_cursor: cursor } : {}),
      }),
    });
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(`Notion API ${res.status}: ${text.slice(0, 300)}`);
    }
    const body = await res.json();
    results.push(...(body.results || []));
    if (!body.has_more) break;
    cursor = body.next_cursor;
  }
  return results;
}

function plainTitle(prop) {
  return (prop && prop.title && prop.title[0] && prop.title[0].plain_text) || 'Untitled';
}
function plainSelect(prop) {
  return (prop && prop.select && prop.select.name) || null;
}

function pageToIssue(page) {
  const p = page.properties;
  return {
    id: page.id,
    source: 'notion',
    title: plainTitle(p.Name),
    status: plainSelect(p.Status),
    venture: plainSelect(p.Venture),
    severity: plainSelect(p.Severity),
  };
}

function pageToDecision(page) {
  const p = page.properties;
  return {
    id: page.id,
    source: 'notion',
    title: plainTitle(p.Name),
    status: plainSelect(p.Status),
    venture: plainSelect(p.Venture),
  };
}

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const apiKey = process.env.NOTION_API_KEY;
  if (!apiKey) {
    res.status(200).json({ error: 'not_configured', message: 'Not connected — missing NOTION_API_KEY on Vercel.' });
    return;
  }

  const tile = String(req.query.tile || '');
  const ventureParam = req.query.venture ? String(req.query.venture) : null;
  const venture = ventureParam && ventureParam !== 'All' ? ventureParam : null;

  try {
    if (tile === 'critical-alerts') {
      const filter = {
        and: [
          selectEq('Severity', 'Red'),
          statusIsOneOf('Status', OPEN_ISSUE_STATUSES),
          ...(venture ? [selectEq('Venture', venture)] : []),
        ],
      };
      const pages = await notionQueryAll(DB.issues, filter, apiKey);
      res.status(200).json({ count: pages.length, items: pages.map(pageToIssue) });
      return;
    }

    if (tile === 'open-decisions') {
      const filter = {
        and: [
          statusIsOneOf('Status', OPEN_DECISION_STATUSES),
          ...(venture ? [selectEq('Venture', venture)] : []),
        ],
      };
      const pages = await notionQueryAll(DB.decisions, filter, apiKey);
      res.status(200).json({ count: pages.length, items: pages.map(pageToDecision) });
      return;
    }

    res.status(400).json({ error: `Unknown or unwired tile "${tile}". Only critical-alerts and open-decisions are wired to Notion — see the header comment in this file for why the other tiles aren't.` });
  } catch (err) {
    console.error('[founder-os-notion] error:', err);
    res.status(502).json({ error: 'Failed to query Notion.', detail: String(err.message || err) });
  }
};
