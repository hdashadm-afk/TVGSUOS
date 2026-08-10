// Vercel serverless function — "Ask Ver": immediate Q&A, not the
// async submit-then-answered-later queue katiwala-owner-os-'s
// api/answer-ver-query.js implements (that one waits for a scheduled
// Routine or a manual "Answer now" click on a pending row). This is
// the synchronous version — ask, get an answer in the same request —
// Grounded in TVGSUOS governance docs plus live loop inputs:
// today's daily_baseline_checks row, open decisions, open/bottleneck
// signals, and open founder_tasks (Lens/Helium catch when logged).
// Answer is saved into ver_queries afterward (same table as the
// async answer-ver-query path in katiwala-owner-os-).
//
// Requires ANTHROPIC_API_KEY and SUPABASE_SERVICE_ROLE_KEY. Not
// configured until the founder adds them — returns a clear "not
// configured" error rather than crashing, same pattern as every
// other credential-gated endpoint in this ecosystem.

const SUPABASE_URL = 'https://jbhfdmujqrtqkhacfegl.supabase.co';
const REPO_OWNER = 'hdashadm-afk';
const REPO_NAME = 'TVGSUOS';

// TVGSUOS's own governing docs — kept short and specific rather than
// pulling every doc in the repo, so grounding stays relevant.
const GROUNDING_DOCS = [
  'docs/ECOSYSTEM_REPO_TREE.md',
  'docs/PHASE_A_STATION_BOUNDARY.md',
  'docs/DIPSTIFY_SCALE_PLAN.md',
  'docs/MASTER_DIRECTION.md',
  'docs/GOVERNANCE_MODEL.md',
  'docs/PORTFOLIO_MAP.md',
  'FOUNDER_OS.md',
  'docs/VER_BEHAVIOR.md',
];

// Local mirror of Command Center focus (edit with FOUNDER_OS_COCKPIT in index.html).
// Notion SoT when MCP/API available: Founder OS Command Center + Strategic Charter.
const MASTERPLAN_CONTEXT = `
## Current masterplan focus (Aug 2026 — tree locked 2026-08-10)
Three pillars under FOS/Ver:
1. RideVerified — ownership app (+ riderslamp.org) — LATER; code hmcmarketing/ride-verified-ph. NOT a marketplace. NOT under ODO.
2. ODO — Property + Vehicle MARKETPLACE — later. ≠ RideVerified.
3. Dipstify — Station (Phase A NOW) · StationRescue · Delivery · Franchise.

Phase A (Claude): Dipstify/Station only — Owner’s Lens + Admin/Ops/Staff/PnL. See docs/PHASE_A_STATION_BOUNDARY.md.
Gas Ops = Dipstify/Station OpsVerified workstream. Helium pricing = Dipstify commercial (₱7k + ₱1k/station, start Aug, collect every month-end).
Delivery MVP parked for supplier. Franchise = map only. Scale: 2 shiftlogs + ≥50 photos/station/day; build next gate only (docs/DIPSTIFY_SCALE_PLAN.md).
Do NOT nest RV under ODO. Do NOT treat “Gas Ops finish whole app this week” as top priority.
`;

async function fetchDoc(path, headers) {
  const res = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}`, {
    headers: { ...headers, Accept: 'application/vnd.github.raw' },
  });
  if (!res.ok) return null;
  return res.text();
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!anthropicKey || !serviceRoleKey) {
    res.status(200).json({
      notConfigured: true,
      error: `Not configured — missing ${!anthropicKey ? 'ANTHROPIC_API_KEY' : 'SUPABASE_SERVICE_ROLE_KEY'} on this Vercel project (tvgsuosweb).`,
    });
    return;
  }

  const { question } = req.body || {};
  if (!question || !question.trim()) {
    res.status(400).json({ error: 'question is required.' });
    return;
  }

  const sbHeaders = { apikey: serviceRoleKey, Authorization: `Bearer ${serviceRoleKey}`, 'Content-Type': 'application/json' };
  const ghHeaders = { Accept: 'application/vnd.github+json' };
  if (process.env.GITHUB_TOKEN) ghHeaders.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

  try {
    const manilaDate = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Manila', year: 'numeric', month: '2-digit', day: '2-digit',
    }).format(new Date());

    const [docs, decisionsRes, signalsRes, baselineRes, tasksRes] = await Promise.all([
      Promise.all(GROUNDING_DOCS.map(path => fetchDoc(path, ghHeaders))),
      fetch(`${SUPABASE_URL}/rest/v1/decisions?status=eq.open&select=title,context,status,created_at&order=created_at.desc&limit=10`, { headers: sbHeaders }),
      fetch(`${SUPABASE_URL}/rest/v1/improvement_signals?status=eq.open&select=project_scope,feature_area,signal_summary,bottleneck_flag,status&order=attention_score.desc&limit=10`, { headers: sbHeaders }),
      // Same grounding as legacy answer-ver-query.js — Ver's own loop output
      // for today (Manila), falling back to latest row if today is empty.
      fetch(`${SUPABASE_URL}/rest/v1/daily_baseline_checks?check_date=eq.${manilaDate}&select=*&limit=1`, { headers: sbHeaders }),
      fetch(`${SUPABASE_URL}/rest/v1/founder_tasks?status=eq.not_done&select=ecosystem,title,priority,phase,notes,created_at&order=priority.asc&limit=15`, { headers: sbHeaders }),
    ]);

    let baselineRow = null;
    if (baselineRes.ok) {
      const todayRows = await baselineRes.json();
      if (Array.isArray(todayRows) && todayRows.length) baselineRow = todayRows[0];
    }
    if (!baselineRow) {
      const latestRes = await fetch(
        `${SUPABASE_URL}/rest/v1/daily_baseline_checks?select=*&order=check_date.desc&limit=1`,
        { headers: sbHeaders },
      );
      if (latestRes.ok) {
        const latest = await latestRes.json();
        if (Array.isArray(latest) && latest.length) baselineRow = latest[0];
      }
    }

    const docsContext = GROUNDING_DOCS.map((path, i) => docs[i] ? `\n\n## ${path}\n${docs[i]}` : `\n\n## ${path}\n(couldn't fetch)`).join('');

    let liveContext = '';
    if (baselineRow) {
      liveContext += `\n\n## Daily Baseline Check (${baselineRow.check_date || 'latest'})\n`
        + `- app_status: ${baselineRow.app_status || '—'}\n`
        + `- notion_status: ${baselineRow.notion_status || '—'}\n`
        + `- vera_status: ${baselineRow.vera_status || '—'}\n`
        + `- last_direction: ${baselineRow.last_direction || '—'}\n`
        + `- priorities: ${baselineRow.priorities || '—'}\n`
        + `- governance_risk_note: ${baselineRow.governance_risk_note || '—'}\n`
        + `- discussion_question: ${baselineRow.discussion_question || '—'}\n`;
    } else {
      liveContext += `\n\n## Daily Baseline Check\nNo baseline row found — prioritize regenerating Baseline in Ver's drawer if asked what to do first.\n`;
    }
    if (decisionsRes.ok) {
      const decisions = await decisionsRes.json();
      if (decisions.length) liveContext += `\n\n## Open Strategy decisions right now\n${decisions.map(d => `- ${d.title}${d.context ? ` — ${d.context}` : ''}`).join('\n')}`;
    }
    if (signalsRes.ok) {
      const signals = await signalsRes.json();
      if (signals.length) liveContext += `\n\n## Open Intelligence signals right now\n${signals.map(s => `- [${s.project_scope || 'unscoped'}] ${s.signal_summary}${s.bottleneck_flag ? ' (BOTTLENECK)' : ''}`).join('\n')}`;
    }
    if (tasksRes.ok) {
      const tasks = await tasksRes.json();
      if (tasks.length) {
        liveContext += `\n\n## Open Task Inventory (includes Lens/Helium catch when logged)\n`
          + tasks.map(t => `- [${t.ecosystem}/${t.priority}] ${t.title}${t.notes ? ` — ${t.notes}` : ''}`).join('\n');
      }
    }

    const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': anthropicKey,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-5',
        max_tokens: 600,
        output_config: { effort: 'low' },
        system: `You are Ver, the founder-level chief of staff for Founder OS (TVGSUOS) — cockpit for three pillars: RideVerified (ownership, later), ODO (marketplace, later), and Dipstify (Station Phase A now · StationRescue · Delivery · Franchise). You sit ABOVE Lens (Dipstify/Station) and Vera (ODO marketplace) — do not do their domain work; synthesize what they surface into founder actions. RideVerified ≠ ODO.

Answer format — STRICT:
1. Reply with exactly **3 numbered actions**, nothing else before them.
2. Each line: \`N. [Action] — [one-line why / where to tap]\`
3. Prioritize in this order ONLY:
   Step 1: Critical security / trust / governance risks (baseline governance_risk_note, Security status, bottleneck signals).
   Step 2: Dipstify / Station Phase A (Owner’s Lens + Admin/Ops/Staff/PnL; Helium prove). Prefer Lens/Helium live signals when Task Inventory or baseline mentions them.
   Step 3: StationRescue pilot / Delivery supplier-gated next steps only if they do not displace Station Phase A unless the founder redirected.
   Step 4: ODO marketplace or RideVerified ownership only when they do not displace Steps 1–3 — never nest RV under ODO.
   Step 5: Only then other ecosystem tasks still active in the masterplan.
4. Never promote stale sprint wording (Gas Ops finish-this-week) or “RV under ODO” into the top 3.
5. No long report, no essay, no preamble, no closing pep talk. Max ~120 words total.
6. If nothing is open, say so in one line, then still give 3 light next moves grounded in Steps 1–3.
7. Prefer the Daily Baseline Check section when present — it is Ver's own loop output for the day.

Ground every action in the live baseline, open items, masterplan focus, and docs below. If data doesn't cover the ask, say so in one short line after the 3 actions — do not invent counts.
${MASTERPLAN_CONTEXT}${docsContext}${liveContext}`,
        tools: [{
          name: 'log_follow_up_task',
          description: 'Log a concrete, actionable follow-up task to the founder\'s Task Inventory. Only call this for something genuinely new and specific — not for every question.',
          input_schema: {
            type: 'object',
            properties: {
              ecosystem: { type: 'string', enum: ['FOUNDER', 'KOS', 'ODO'], description: 'FOUNDER for TVGSUOS/infra-level items, KOS (Dipstify/Lens/Helium) or ODO for venture-specific ones.' },
              title: { type: 'string', description: 'Short, specific task title.' },
              priority: { type: 'string', enum: ['high', 'medium', 'low'] },
              phase: { type: 'string', enum: ['mvp', 'phase2', 'phase3'] },
              notes: { type: 'string', description: 'One or two sentences of context — why this matters, what it unblocks.' },
            },
            required: ['ecosystem', 'title', 'priority', 'phase'],
          },
        }],
        messages: [{ role: 'user', content: question }],
      }),
    });

    if (!anthropicRes.ok) {
      const body = await anthropicRes.text();
      console.error('[ask-ver] Anthropic API error:', anthropicRes.status, body);
      res.status(502).json({ error: `Anthropic API returned ${anthropicRes.status}.` });
      return;
    }

    const anthropicData = await anthropicRes.json();
    const content = anthropicData.content || [];
    const answer = content.filter(b => b.type === 'text').map(b => b.text || '').join('').trim() || 'No answer text returned.';
    if (answer === 'No answer text returned.') {
      console.error('[ask-ver] empty answer, raw response:', JSON.stringify(anthropicData));
    }

    // Fire-and-forget: Ver identified a real follow-up via the tool
    // call above. No need to send a tool_result back — this isn't a
    // multi-turn tool loop, just a side effect of answering. Logged
    // best-effort; a failure here shouldn't fail the whole answer.
    const loggedTasks = [];
    for (const block of content) {
      if (block.type !== 'tool_use' || block.name !== 'log_follow_up_task') continue;
      const { ecosystem, title, priority, phase, notes } = block.input || {};
      if (!ecosystem || !title || !priority || !phase) continue;
      try {
        const taskRes = await fetch(`${SUPABASE_URL}/rest/v1/founder_tasks`, {
          method: 'POST',
          headers: { ...sbHeaders, Prefer: 'return=minimal' },
          body: JSON.stringify({ ecosystem, title, priority, phase, notes: notes || null, status: 'not_done' }),
        });
        if (taskRes.ok) loggedTasks.push(title);
        else console.error('[ask-ver] Could not log follow-up task:', await taskRes.text());
      } catch (err) {
        console.error('[ask-ver] log_follow_up_task error:', err);
      }
    }

    const insertRes = await fetch(`${SUPABASE_URL}/rest/v1/ver_queries`, {
      method: 'POST',
      headers: { ...sbHeaders, Prefer: 'return=minimal' },
      body: JSON.stringify({ question, status: 'answered', answer, answered_at: new Date().toISOString() }),
    });
    if (!insertRes.ok) console.error('[ask-ver] Could not save to ver_queries:', await insertRes.text());

    res.status(200).json({ answer, loggedTasks });
  } catch (err) {
    console.error('[ask-ver] error:', err);
    res.status(500).json({ error: err.message || 'Failed to answer the question.' });
  }
};
