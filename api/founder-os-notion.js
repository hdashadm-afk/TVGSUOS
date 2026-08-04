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
// enough. Returns a clear "not configured" shape (same pattern every
// other api/*.js file here uses for a missing credential) rather than
// crashing the tile grid if the key is absent.
//
// 2026-08-04 fix: originally pointed at these databases' page-level
// IDs (what you get back after Notion "moves" a database into a
// parent page) and queried the classic /v1/databases/{id}/query
// endpoint on API version 2022-06-28. That 404'd with "could not find
// database" even once sharing was correctly set up on the right
// integration/workspace — the page-level ID isn't a queryable data
// source. Switched to the actual data source IDs (captured at
// creation time, confirmed via direct fetch) and the current
// /v1/data_sources/{id}/query endpoint on API version 2025-09-03,
// which is what this workspace's multi-source-database model
// actually expects.

const NOTION_VERSION = '2025-09-03';

// Data source IDs (not the databases' own page-level IDs — see the
// note above), for the Issues/Decisions databases created under
// Notion's "Founder OS Home" page.
const DATA_SOURCE = {
  issues: '20f17e4c-a5b0-4b60-8b18-23171fdfc3d0',
  decisions: '27165119-b76f-4169-a647-f7e6bcbfe7ca',
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
async function notionQueryAll(dataSourceId, filter, apiKey, { maxPages = 5 } = {}) {
  const results = [];
  let cursor;
  for (let page = 0; page < maxPages; page++) {
    const res = await fetch(`https://api.notion.com/v1/data_sources/${dataSourceId}/query`, {
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
      const pages = await notionQueryAll(DATA_SOURCE.issues, filter, apiKey);
      res.status(200).json({ count: pages.length, items: pages.map(pageToIssue) });
      return;
    }

    if (tile === 'open-decisions') {
      // Spec calls this "Ventures contains selected venture" — today's
      // Decisions.Venture is a single-select, not multi-select/relation,
      // so equals and "contains a single value" are the same filter.
      // Written as equals here rather than introducing a schema change
      // this pass; revisit if Venture ever becomes multi-valued.
      const filter = {
        and: [
          statusIsOneOf('Status', OPEN_DECISION_STATUSES),
          ...(venture ? [selectEq('Venture', venture)] : []),
        ],
      };
      const pages = await notionQueryAll(DATA_SOURCE.decisions, filter, apiKey);
      res.status(200).json({ count: pages.length, items: pages.map(pageToDecision) });
      return;
    }

    res.status(400).json({ error: `Unknown or unwired tile "${tile}". Only critical-alerts and open-decisions are wired to Notion — see the header comment in this file for why the other tiles aren't.` });
  } catch (err) {
    console.error('[founder-os-notion] error:', err);
    res.status(502).json({ error: 'Failed to query Notion.', detail: String(err.message || err) });
  }
};
