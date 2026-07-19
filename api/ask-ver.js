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
];

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
    const [docs, decisionsRes, signalsRes] = await Promise.all([
      Promise.all(GROUNDING_DOCS.map(path => fetchDoc(path, ghHeaders))),
      fetch(`${SUPABASE_URL}/rest/v1/decisions?status=eq.open&select=title,context,status,created_at&order=created_at.desc&limit=10`, { headers: sbHeaders }),
      fetch(`${SUPABASE_URL}/rest/v1/improvement_signals?status=eq.open&select=project_scope,feature_area,signal_summary,bottleneck_flag,status&order=attention_score.desc&limit=10`, { headers: sbHeaders }),
    ]);

    const docsContext = GROUNDING_DOCS.map((path, i) => docs[i] ? `\n\n## ${path}\n${docs[i]}` : `\n\n## ${path}\n(couldn't fetch)`).join('');

    let liveContext = '';
    if (decisionsRes.ok) {
      const decisions = await decisionsRes.json();
      if (decisions.length) liveContext += `\n\n## Open Strategy decisions right now\n${decisions.map(d => `- ${d.title}${d.context ? ` — ${d.context}` : ''}`).join('\n')}`;
    }
    if (signalsRes.ok) {
      const signals = await signalsRes.json();
      if (signals.length) liveContext += `\n\n## Open Intelligence signals right now\n${signals.map(s => `- [${s.project_scope || 'unscoped'}] ${s.signal_summary}${s.bottleneck_flag ? ' (BOTTLENECK)' : ''}`).join('\n')}`;
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
        max_tokens: 4096,
        output_config: { effort: 'medium' },
        system: `You are Ver, the founder-level chief of staff and governance agent for TVGSUOS (The Verified Group Single Unified OS) — the umbrella layer above KOS/Katiwala AI and OWDO/ODO. A founder is asking you a question to help navigate their day.

Below is your actual current knowledge base: TVGSUOS's real governance docs, plus what's genuinely open right now across Strategy and Intelligence. Ground your answer in this real information — reference it directly where relevant. If it doesn't cover what's being asked, say so plainly rather than guessing or giving generic advice. Keep the answer practical and direct — this is a founder trying to get through their day, not a report.

If your answer surfaces a genuinely new, concrete, actionable follow-up (something that needs to be built, fixed, or configured — not just discussed), log it with log_follow_up_task. Most questions don't need this — only call it when there's a real, specific action item that isn't already covered by what you can see above.
${docsContext}${liveContext}`,
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
