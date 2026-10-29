// Vercel serverless function — "Ask Ver": immediate Q&A, not the
// async submit-then-answered-later queue katiwala-owner-os-'s
// api/answer-ver-query.js implements (that one waits for a scheduled
// Routine or a manual "Answer now" click on a pending row). This is
// the synchronous version — ask, get an answer in the same request —
// grounded in TVGSUOS's own governance docs plus live open items
// (Strategy's open decisions, Intelligence's open/bottleneck
// signals), so the answer reflects what's actually happening right
// now, not just static documentation. The answer is still saved into
// ver_queries afterward, same table katiwala-owner-os- already uses,
// so there's a persistent history either way it's answered.
//
// Requires ANTHROPIC_API_KEY and SUPABASE_SERVICE_ROLE_KEY. Not
// configured until the founder adds them — returns a clear "not
// configured" error rather than crashing, same pattern as every
// other credential-gated endpoint in this ecosystem.

// CONSTRAINTS (2026-10-29, PR #73 remediation). One fixed operation:
// answer one founder question. The caller supplies only `question`
// (string, 1–MAX_QUESTION chars, no other fields). It cannot choose a
// model, token budget, table, query or tool. Spend is bounded by a fixed
// MODEL and MAX_TOKENS, grounding docs capped at MAX_DOC_CHARS each, live
// decision/signal text capped per field (L2), and an hourly limit enforced
// by an ATOMIC RESERVATION taken BEFORE the paid call (M1, re-review
// 2026-10-29): one call to the database function ver_reserve_call, which
// locks, counts and inserts a ledger row in one transaction. Two parallel
// requests cannot both take the last slot. A failed, missing or malformed
// reservation returns 503 and Anthropic is never called.
// DEPENDENCY: ver_reserve_call and its ledger do NOT exist yet (checked
// 2026-10-29: no reservation function in public). Until the founder-approved
// SQL in docs/SECURITY_PRIVILEGE_INVENTORY.md §3.2 runs, Ask Ver is
// effectively DISABLED (every request fails closed). No SQL is run here.
// Service-role use: the reservation RPC; read open decisions/signals (fixed
// columns, capped); insert one ver_queries row; insert at most one validated
// founder_tasks row.
// Ver is optional and never the source of truth (MASTER §9).

const { requireFounder } = require('./_founder-auth');

const MODEL = 'claude-sonnet-5';
const MAX_TOKENS = 600;
const MAX_QUESTION = 500;
const MAX_DOC_CHARS = 12000;
const HOURLY_LIMIT = 20;
const MAX_TASKS = 1;
// L2: caps on text read from the database before it reaches the prompt,
// and on task fields from the model. Oversized task fields are rejected.
const FIELD_CAPS = { decisionTitle: 200, decisionContext: 500, signalScope: 60, signalSummary: 500, taskTitle: 120, taskNotes: 300 };
const MAX_LIVE_CHARS = 8000;
const RESERVATION_UNAVAILABLE = 'Ask Ver is unavailable: its spending limit could not be reserved. Nothing was sent to the model.';
const TASK_ENUMS = {
  ecosystem: ['FOUNDER', 'KOS', 'ODO'],
  priority: ['high', 'medium', 'low'],
  phase: ['mvp', 'phase2', 'phase3'],
};

// { question } or { status, error }. Strict: unknown fields are refused.
function validateRequest(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return { status: 400, error: 'Send a JSON body with a question.' };
  const extra = Object.keys(body).filter((key) => key !== 'question');
  if (extra.length) return { status: 400, error: 'Only "question" is accepted.' };
  if (typeof body.question !== 'string') return { status: 400, error: 'question must be text.' };
  const question = body.question.trim();
  if (!question) return { status: 400, error: 'question is required.' };
  if (question.length > MAX_QUESTION) return { status: 413, error: `question is too long (max ${MAX_QUESTION} characters).` };
  return { question };
}

// One atomic reservation (database function ver_reserve_call). Returns
// 'reserved' | 'limit' | null (null = could not be enforced → fail closed).
async function reserveCall(headers) {
  try {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/rpc/ver_reserve_call`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ p_hourly_limit: HOURLY_LIMIT }),
    });
    if (!r.ok) return null;
    const out = await r.json();
    if (!out || typeof out !== 'object' || typeof out.reserved !== 'boolean') return null;
    if (out.reserved && typeof out.reservation_id !== 'string') return null;
    return out.reserved ? 'reserved' : 'limit';
  } catch {
    return null;
  }
}

function cap(value, max) {
  if (typeof value !== 'string') return '';
  const text = value.replace(/\s+/g, ' ').trim();
  return text.length > max ? `${text.slice(0, max)}…` : text;
}

function validTask(input) {
  if (!input || typeof input !== 'object') return null;
  const { ecosystem, title, priority, phase, notes } = input;
  if (!TASK_ENUMS.ecosystem.includes(ecosystem) || !TASK_ENUMS.priority.includes(priority) || !TASK_ENUMS.phase.includes(phase)) return null;
  if (typeof title !== 'string' || !title.trim() || title.trim().length > FIELD_CAPS.taskTitle) return null;
  if (notes != null && (typeof notes !== 'string' || notes.trim().length > FIELD_CAPS.taskNotes)) return null;
  return {
    ecosystem, priority, phase,
    title: title.trim(),
    notes: typeof notes === 'string' && notes.trim() ? notes.trim() : null,
    status: 'not_done',
  };
}

const SUPABASE_URL = 'https://jbhfdmujqrtqkhacfegl.supabase.co';
const REPO_OWNER = 'hdashadm-afk';
const REPO_NAME = 'TVGSUOS';

// TVGSUOS's own governing docs — kept short and specific rather than
// pulling every doc in the repo, so grounding stays relevant.
const GROUNDING_DOCS = [
  'docs/MASTER_DIRECTION.md',
  'docs/GOVERNANCE_MODEL.md',
  'docs/PORTFOLIO_MAP.md',
  'FOUNDER_OS.md',
  'docs/VER_BEHAVIOR.md',
  'docs/VERIFOS_OPERATING_LOCK.md',
  'docs/VERIFOS_STANDARD.md',
];

// Local mirror of Command Center focus (edit with FOUNDER_OS_COCKPIT in index.html).
// Notion SoT when MCP/API available: Founder OS Command Center + Strategic Charter.
const MASTERPLAN_CONTEXT = `
## Current masterplan focus (21 Aug 2026) — MASTER_DIRECTION.md §0
Active: Verifos, Dipstify, ODO. HMC legal. FOS/Ver orchestrates. Do not merge products.
Master brand and public URL: **Verifos / verifos.co** (live). Engineering repo may still be station-rescue — customer name is Verifos, not Station Rescue / SR.
Graduation, not a gate: accept the minimum; standard is written; reward who follows it. Never fake Verified.
Verifos Garage = 2027. Do not build a vehicle vault in this product. Vehicle marketplace stays ODO.
Chairman + 3 CEOs = a briefing loop inside FOS/Ver. Not a new org chart. Ver, Lens, Vera stay.
Venture map: Gas Ops = Dipstify workstream; Helium pricing = Dipstify commercial (Basic ₱9,999 · Staff+PnL ₱9,999, collect EOM). RV is not the market CEO (franchise = later program, not a dashboard).
Field Kit pricing decision locked (hardware add-on); public/site revisit scheduled Sep 1.
Do NOT treat stale sprint wording (“Gas Ops finish whole app this week”) as top priority — Gas Ops itself is Dipstify.
Do NOT score Verifos on Dipstify conversion.
Dipstify quiz HOLD until founder unpauses. Do not put the quiz on Verifos.
₱50K auto-approve is a proposal, not a lock.

Phases:
1. Verifos CEO — marketplace (owners, techs, suppliers) + owner-only knowledge. Helium first. Coalition not a trojan horse. No “Powered by Dipstify.”
2. Dipstify CEO — ops sibling. Basic ₱9,999 · Staff+PnL ₱9,999. Owner funnel from marketplace = later, owners only.
3. ODO-Vehicles CEO — listings published, HPG certify, unlocks, LTO checklist. Property still exists. No % of vehicle price. Not RideVerified marketplace.

Verifos status (dashboard SoT): Auth migration live; profiles schema-cache smoke deferred; waitlist OK. DNS for verifos.co still founder work.
`;

async function fetchDoc(path, headers) {
  const res = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}`, {
    headers: { ...headers, Accept: 'application/vnd.github.raw' },
  });
  if (!res.ok) return null;
  const text = await res.text();
  return text.length > MAX_DOC_CHARS ? `${text.slice(0, MAX_DOC_CHARS)}\n(truncated)` : text;
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  // Founder only (api/_founder-auth.js), checked before any credential or
  // upstream call so an anonymous caller learns nothing, not even config.
  if (!(await requireFounder(req, res))) return;

  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!anthropicKey || !serviceRoleKey) {
    res.status(200).json({
      notConfigured: true,
      error: `Not configured — missing ${!anthropicKey ? 'ANTHROPIC_API_KEY' : 'SUPABASE_SERVICE_ROLE_KEY'} on this Vercel project (tvgsuosweb).`,
    });
    return;
  }

  const checked = validateRequest(req.body);
  if (checked.error) {
    res.status(checked.status).json({ error: checked.error });
    return;
  }
  const { question } = checked;

  const sbHeaders = { apikey: serviceRoleKey, Authorization: `Bearer ${serviceRoleKey}`, 'Content-Type': 'application/json' };

  // M1: reserve before any paid call. No reservation, no Anthropic request.
  const reservation = await reserveCall(sbHeaders);
  if (reservation == null) {
    res.status(503).json({ error: RESERVATION_UNAVAILABLE });
    return;
  }
  if (reservation === 'limit') {
    res.status(429).json({ error: `Ask Ver limit reached (${HOURLY_LIMIT} answers per hour).` });
    return;
  }
  const ghHeaders = { Accept: 'application/vnd.github+json' };
  if (process.env.GITHUB_TOKEN) ghHeaders.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

  try {
    const [docs, decisionsRes, signalsRes] = await Promise.all([
      Promise.all(GROUNDING_DOCS.map(path => fetchDoc(path, ghHeaders))),
      fetch(`${SUPABASE_URL}/rest/v1/decisions?status=eq.open&select=title,context,status,created_at&order=created_at.desc&limit=10`, { headers: sbHeaders }),
      fetch(`${SUPABASE_URL}/rest/v1/improvement_signals?status=eq.open&select=project_scope,feature_area,signal_summary,bottleneck_flag,status&order=attention_score.desc&limit=10`, { headers: sbHeaders }),
    ]);

    const docsContext = GROUNDING_DOCS.map((path, i) => docs[i] ? `\n\n## ${path}\n${docs[i]}` : `\n\n## ${path}\n(couldn't fetch)`).join('');

    let liveContext = '';
    if (decisionsRes.ok) {
      const decisions = await decisionsRes.json();
      if (Array.isArray(decisions) && decisions.length) liveContext += `\n\n## Open Strategy decisions right now\n${decisions.map(d => { const title = cap(d && d.title, FIELD_CAPS.decisionTitle); const context = cap(d && d.context, FIELD_CAPS.decisionContext); return `- ${title}${context ? ` — ${context}` : ''}`; }).join('\n')}`;
    }
    if (signalsRes.ok) {
      const signals = await signalsRes.json();
      if (Array.isArray(signals) && signals.length) liveContext += `\n\n## Open Intelligence signals right now\n${signals.map(s => `- [${cap(s && s.project_scope, FIELD_CAPS.signalScope) || 'unscoped'}] ${cap(s && s.signal_summary, FIELD_CAPS.signalSummary)}${s && s.bottleneck_flag === true ? ' (BOTTLENECK)' : ''}`).join('\n')}`;
    }
    if (liveContext.length > MAX_LIVE_CHARS) liveContext = `${liveContext.slice(0, MAX_LIVE_CHARS)}\n(truncated)`;

    const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': anthropicKey,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: MAX_TOKENS,
        output_config: { effort: 'low' },
        system: `You are Ver, the founder-level chief of staff for Founder OS (TVGSUOS) — cockpit for Verifos, Dipstify, and ODO. Chairman + 3 CEOs is a briefing loop you run, not the companies. The founder is asking what to do first today.

Answer format — STRICT:
1. Reply with exactly **3 numbered actions**, nothing else before them.
2. Each line: \`N. [Action] — [one-line why / where to tap]\`
3. Prioritize in this order ONLY:
   Step 1: Critical security / trust / governance risks (Security status, bottleneck signals).
   Step 2: Verifos Phase 1A CEO work (Stations trust layer; public URL verifos.co live). Pain first: tech + parts; registry compounds from jobs. 1B Vehicles after 1A — do not build now. Graduation not a gate. Never score Verifos on Dipstify conversion. Do not build Garage.
   Step 3: Dipstify Phase 2 CEO work (Helium stations on ops; Field Kit revisit Sep 1; Basic ₱9,999 · Staff+PnL ₱9,999 EOM collect; Gas Ops as Dipstify workstream; quiz HOLD).
   Step 4: ODO Phase 3A CEO (Vehicles marketplace: listings, HPG, unlocks, LTO) only when it does not displace Steps 1–3. 3B Properties still exists. RV is not the market CEO.
   Step 5: Only then other ecosystem tasks still active in the masterplan (e.g. KOS→Dipstify rename if pending execution).
4. Never promote stale sprint wording (Gas Ops finish-this-week), Dipstify-conversion-as-Verifos-KPI, or a RideVerified marketplace CEO into the top 3.
5. Voice when briefing: “Status is X. Action needed: Y. Owner: Z.” Never “I think.”
6. No long report, no essay, no preamble, no closing pep talk. Max ~120 words total.
7. If nothing is open, say so in one line, then still give 3 light next moves grounded in Steps 1–3.

Ground every action in the live open items, masterplan focus, and docs below. If data doesn't cover the ask, say so in one short line after the 3 actions — do not invent counts.
${MASTERPLAN_CONTEXT}${docsContext}${liveContext}`,
        tools: [{
          name: 'log_follow_up_task',
          description: 'Log a concrete, actionable follow-up task to the founder\'s Task Inventory. Only call this for something genuinely new and specific — not for every question.',
          input_schema: {
            type: 'object',
            properties: {
              ecosystem: { type: 'string', enum: ['FOUNDER', 'KOS', 'ODO'], description: 'FOUNDER for TVGSUOS/infra-level items, KOS or ODO for venture-specific ones.' },
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
      console.error('[ask-ver] Anthropic API error:', anthropicRes.status);
      res.status(502).json({ error: 'Ver could not answer right now.' });
      return;
    }

    const anthropicData = await anthropicRes.json();
    const content = anthropicData.content || [];
    const answer = content.filter(b => b.type === 'text').map(b => b.text || '').join('').trim() || 'No answer text returned.';
    if (answer === 'No answer text returned.') {
      console.error('[ask-ver] empty answer');
    }

    // Fire-and-forget: Ver identified a real follow-up via the tool
    // call above. No need to send a tool_result back — this isn't a
    // multi-turn tool loop, just a side effect of answering. Logged
    // best-effort; a failure here shouldn't fail the whole answer.
    const loggedTasks = [];
    for (const block of content) {
      if (loggedTasks.length >= MAX_TASKS) break;
      if (block.type !== 'tool_use' || block.name !== 'log_follow_up_task') continue;
      const task = validTask(block.input);
      if (!task) continue;
      try {
        const taskRes = await fetch(`${SUPABASE_URL}/rest/v1/founder_tasks`, {
          method: 'POST',
          headers: { ...sbHeaders, Prefer: 'return=minimal' },
          body: JSON.stringify(task),
        });
        if (taskRes.ok) loggedTasks.push(task.title);
        else console.error('[ask-ver] Could not log follow-up task:', taskRes.status);
      } catch (err) {
        console.error('[ask-ver] log_follow_up_task error:', err);
      }
    }

    const insertRes = await fetch(`${SUPABASE_URL}/rest/v1/ver_queries`, {
      method: 'POST',
      headers: { ...sbHeaders, Prefer: 'return=minimal' },
      body: JSON.stringify({ question, status: 'answered', answer, answered_at: new Date().toISOString() }),
    });
    if (!insertRes.ok) console.error('[ask-ver] Could not save to ver_queries:', insertRes.status);

    res.status(200).json({ answer, loggedTasks });
  } catch (err) {
    console.error('[ask-ver] failed');
    res.status(500).json({ error: 'Failed to answer the question.' });
  }
};

module.exports.validateRequest = validateRequest;
module.exports.LIMITS = { MODEL, MAX_TOKENS, MAX_QUESTION, MAX_DOC_CHARS, HOURLY_LIMIT, MAX_TASKS, FIELD_CAPS, MAX_LIVE_CHARS };
module.exports.RESERVATION_UNAVAILABLE = RESERVATION_UNAVAILABLE;
