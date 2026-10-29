// Every api/ route is founder-only, and the privileged routes are constrained.
//
// Run: node --test tests/route-auth.test.js
//
// MOCKED UNIT TESTS. fetch is replaced with a fake that plays Supabase Auth,
// app_users, Supabase REST, the Management API, GitHub, Anthropic, Notion and
// Resend. No real Supabase, RLS, Preview or production call is made, so a pass
// here is not evidence of RLS or of deployed behaviour
// (docs/SECURITY_PRIVILEGE_INVENTORY.md §4).
//
// "Upstream" means any call that is not the caller check itself; a rejected
// caller must cause ZERO upstream calls, so no credential is ever used on a
// stranger's behalf.

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname, '..');
const API_DIR = path.join(ROOT, 'api');
const ISSUER = 'https://jbhfdmujqrtqkhacfegl.supabase.co/auth/v1';

function b64url(obj) {
  return Buffer.from(JSON.stringify(obj)).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
// JWT-shaped token. The signature is fake: the real check is Supabase Auth,
// played here by the fake fetch, keyed on `sub`.
function jwt(sub, { exp = Math.floor(Date.now() / 1000) + 3600, iss = ISSUER } = {}) {
  return `${b64url({ alg: 'HS256', typ: 'JWT' })}.${b64url({ sub, exp, iss, aud: 'authenticated', role: 'authenticated' })}.sig`;
}

const FOUNDER = jwt('u-founder');
const STAFF = jwt('u-staff'); // a real signed-in user whose role is not founder
const NO_ROW = jwt('u-norow'); // a real auth user with no app_users row
const FORGED = jwt('u-forged'); // well-formed, but Supabase Auth rejects it
const EXPIRED = jwt('u-founder', { exp: Math.floor(Date.now() / 1000) - 60 });
const OTHER_PROJECT = jwt('u-founder', { iss: 'https://qhjhsdsluxgyjevbhfmk.supabase.co/auth/v1' });

const LEAD_ID = '11111111-2222-4333-8444-555555555555';
const LEAD_EMAIL = 'lead.owner@example.com';

// One row per route: how a legitimate founder call looks, and the env it needs.
const ROUTES = {
  'ask-ver': {
    method: 'POST',
    body: { question: 'What should I do first today?' },
    env: { ANTHROPIC_API_KEY: 'test-anthropic', SUPABASE_SERVICE_ROLE_KEY: 'test-service' },
    expect: (r) => assert.equal(typeof r.body.answer, 'string'),
  },
  'founder-os-notion': {
    method: 'GET',
    query: { tile: 'critical-alerts' },
    env: { NOTION_API_KEY: 'test-notion', SUPABASE_SERVICE_ROLE_KEY: 'test-service' },
    expect: (r) => assert.equal(r.body.count, 0),
  },
  'generate-baseline-status': {
    method: 'GET',
    env: { SUPABASE_SERVICE_ROLE_KEY: 'test-service' },
    expect: (r) => assert.equal(typeof r.body.priorities, 'string'),
  },
  'generate-repo-tree': {
    method: 'GET',
    env: { SUPABASE_SERVICE_ROLE_KEY: 'test-service' },
    expect: (r) => assert.equal(typeof r.body.treeMarkdown, 'string'),
  },
  'odo-status': {
    method: 'GET',
    env: { ODO_SUPABASE_SERVICE_ROLE_KEY: 'test-odo', SUPABASE_SERVICE_ROLE_KEY: 'test-service' },
    noUpstream: true,
    expect: (r) => assert.equal(r.body.manualImportRequired, true),
  },
  'security-check': {
    method: 'POST',
    env: { SUPABASE_MANAGEMENT_TOKEN: 'test-mgmt', SUPABASE_SERVICE_ROLE_KEY: 'test-service', SECURITY_CHECK_ENABLED: 'true' },
    expect: (r) => assert.ok(Array.isArray(r.body.findings)),
  },
  'send-pos-checklist': {
    method: 'POST',
    body: { leadTable: 'leads_gas_station', leadId: LEAD_ID },
    env: { RESEND_API_KEY: 'test-resend', SUPABASE_SERVICE_ROLE_KEY: 'test-service' },
    expect: (r) => assert.equal(r.body.ok, true),
  },
};

const ENV_KEYS = [
  'ANTHROPIC_API_KEY', 'SUPABASE_SERVICE_ROLE_KEY', 'ODO_SUPABASE_SERVICE_ROLE_KEY',
  'NOTION_API_KEY', 'SUPABASE_MANAGEMENT_TOKEN', 'RESEND_API_KEY', 'GITHUB_TOKEN', 'SUPABASE_ANON_KEY',
  'SECURITY_CHECK_ENABLED', 'POS_CHECKLIST_FROM_EMAIL',
];

function json(status, body) {
  return { ok: status >= 200 && status < 300, status, json: async () => body, text: async () => JSON.stringify(body) };
}

// `over` lets a test replace one upstream answer: over(url, opts) → response | undefined.
function installFakeFetch({ authDown = false, over = null } = {}) {
  const calls = { auth: 0, role: 0, upstream: [], requests: [] };
  global.fetch = async (url, opts = {}) => {
    const u = String(url);
    const headers = opts.headers || {};
    if (u.endsWith('/auth/v1/user')) {
      calls.auth++;
      if (authDown) throw new Error('auth outage');
      const token = String(headers.Authorization || '').replace(/^Bearer /, '');
      const sub = JSON.parse(Buffer.from(token.split('.')[1] || '', 'base64').toString('utf8') || '{}').sub;
      if (token === FOUNDER) return json(200, { id: 'u-founder' });
      if (token === STAFF) return json(200, { id: 'u-staff' });
      if (token === NO_ROW) return json(200, { id: 'u-norow' });
      if (sub === 'u-founder') return json(200, { id: 'u-founder' }); // only reached if a pre-check is missing
      return json(401, { msg: 'invalid JWT' });
    }
    if (u.includes('/rest/v1/app_users')) {
      calls.role++;
      if (u.includes('u-founder')) return json(200, [{ role: 'founder' }]);
      if (u.includes('u-staff')) return json(200, [{ role: 'client_owner' }]);
      return json(200, []);
    }
    calls.upstream.push(u);
    calls.requests.push({ url: u, method: opts.method || 'GET', body: opts.body ? JSON.parse(opts.body) : null });
    const custom = over && over(u, opts);
    if (custom) return custom;
    if (u.includes('api.anthropic.com')) return json(200, { content: [{ type: 'text', text: '1. Test — ok' }] });
    if (u.includes('api.notion.com')) return json(200, { results: [], has_more: false });
    if (u.includes('/advisors/')) return json(200, { lints: [{ level: 'ERROR', title: 'RLS disabled', detail: 'table public.secret_stuff', remediation: 'https://x', metadata: { schema: 'public' } }] });
    if (u.includes('api.resend.com')) return json(200, { id: 'email-1' });
    if (u.includes('/contents/')) return { ok: true, status: 200, text: async () => '# doc', json: async () => ({}) };
    if (u.includes('/users/hdashadm-afk/repos')) return json(200, [{ name: 'TVGSUOS', private: false, default_branch: 'main', pushed_at: '2026-10-28T00:00:00Z' }]);
    if (u.includes('/rest/v1/leads_') && (opts.method || 'GET') === 'GET' && u.includes('id=eq.')) {
      return json(200, [{ id: LEAD_ID, email: LEAD_EMAIL, business_name: 'Helium <b>Station</b>', owner_name: 'Ana Cruz', pos_checklist_sent_at: null }]);
    }
    if (u.includes('/rest/v1/leads_') && opts.method === 'PATCH') return json(200, [{ id: LEAD_ID }]);
    return json(200, []);
  };
  return calls;
}

function fakeRes() {
  return {
    statusCode: 200,
    body: undefined,
    status(code) { this.statusCode = code; return this; },
    json(b) { this.body = b; return this; },
  };
}

function load(name) {
  const file = path.join(API_DIR, name + '.js');
  delete require.cache[require.resolve(file)];
  delete require.cache[require.resolve(path.join(API_DIR, '_founder-auth.js'))];
  return require(file);
}

async function call(name, { token, env, body, method } = {}) {
  const spec = ROUTES[name];
  for (const k of ENV_KEYS) delete process.env[k];
  Object.assign(process.env, env || {});
  const req = {
    method: method || spec.method,
    headers: token ? { authorization: 'Bearer ' + token } : {},
    query: spec.query || {},
    body: body !== undefined ? body : (spec.body || {}),
  };
  const res = fakeRes();
  await load(name)(req, res);
  return res;
}

const originalFetch = global.fetch;
const quiet = console.error;
test.beforeEach(() => { console.error = () => {}; });
test.afterEach(() => { global.fetch = originalFetch; console.error = quiet; });

// ── Caller check, every route ────────────────────────────────────────────────
for (const name of Object.keys(ROUTES)) {
  const spec = ROUTES[name];

  test(`${name}: anonymous caller is rejected 401, no upstream call`, async () => {
    const calls = installFakeFetch();
    const r = await call(name, { env: spec.env });
    assert.equal(r.statusCode, 401);
    assert.equal(calls.auth, 0, 'no token means no auth call either');
    assert.deepEqual(calls.upstream, []);
  });

  test(`${name}: invalid token is rejected 401, no upstream call`, async () => {
    const calls = installFakeFetch();
    const r = await call(name, { token: FORGED, env: spec.env });
    assert.equal(r.statusCode, 401);
    assert.deepEqual(calls.upstream, []);
  });

  test(`${name}: malformed token is rejected 401 without calling Supabase`, async () => {
    const calls = installFakeFetch();
    const r = await call(name, { token: 'not-a-jwt', env: spec.env });
    assert.equal(r.statusCode, 401);
    assert.equal(calls.auth, 0);
    assert.deepEqual(calls.upstream, []);
  });

  test(`${name}: expired token is rejected 401 without calling Supabase`, async () => {
    const calls = installFakeFetch();
    const r = await call(name, { token: EXPIRED, env: spec.env });
    assert.equal(r.statusCode, 401);
    assert.equal(calls.auth, 0, 'an expired token never reaches Supabase Auth');
    assert.deepEqual(calls.upstream, []);
  });

  test(`${name}: token from another Supabase project is rejected 401 without calling Supabase`, async () => {
    const calls = installFakeFetch();
    const r = await call(name, { token: OTHER_PROJECT, env: spec.env });
    assert.equal(r.statusCode, 401);
    assert.equal(calls.auth, 0, 'a wrong-project token never reaches Supabase Auth');
    assert.deepEqual(calls.upstream, []);
  });

  test(`${name}: signed-in non-founder is rejected 403, no upstream call`, async () => {
    const calls = installFakeFetch();
    const r = await call(name, { token: STAFF, env: spec.env });
    assert.equal(r.statusCode, 403);
    assert.deepEqual(calls.upstream, []);
  });

  test(`${name}: auth user with no app_users row is rejected 403`, async () => {
    const calls = installFakeFetch();
    const r = await call(name, { token: NO_ROW, env: spec.env });
    assert.equal(r.statusCode, 403);
    assert.deepEqual(calls.upstream, []);
  });

  test(`${name}: auth outage fails closed (401), no upstream call`, async () => {
    const calls = installFakeFetch({ authDown: true });
    const r = await call(name, { token: FOUNDER, env: spec.env });
    assert.equal(r.statusCode, 401);
    assert.deepEqual(calls.upstream, []);
  });

  test(`${name}: missing service-role key fails closed (403) even for the founder`, async () => {
    const calls = installFakeFetch();
    const env = { ...spec.env };
    delete env.SUPABASE_SERVICE_ROLE_KEY;
    const r = await call(name, { token: FOUNDER, env });
    assert.equal(r.statusCode, 403);
    assert.deepEqual(calls.upstream, []);
  });

  test(`${name}: founder call still works`, async () => {
    const calls = installFakeFetch();
    const r = await call(name, { token: FOUNDER, env: spec.env });
    assert.equal(r.statusCode, 200, JSON.stringify(r.body));
    if (spec.noUpstream) assert.deepEqual(calls.upstream, [], 'this route makes no upstream call at all');
    else assert.ok(calls.upstream.length > 0, 'the founder call reaches its upstream');
    spec.expect(r);
  });
}

// ── odo-status: no cross-project access ──────────────────────────────────────
test('odo-status: no ODO fetch even with ODO credentials configured; honest manual-import answer', async () => {
  const calls = installFakeFetch();
  const r = await call('odo-status', { token: FOUNDER, env: { ...ROUTES['odo-status'].env, ODO_SUPABASE_SERVICE_ROLE_KEY: 'configured-odo-key' } });
  assert.equal(r.statusCode, 200);
  assert.deepEqual(calls.upstream, []);
  assert.equal(r.body.manualImportRequired, true);
  assert.equal(r.body.status, 'not_supplied');
  for (const key of ['business', 'health', 'signalsCount', 'gmvPhp', 'negativeCount']) assert.equal(key in r.body, false, `no ${key} number is invented`);
  const src = fs.readFileSync(path.join(API_DIR, 'odo-status.js'), 'utf8');
  assert.doesNotMatch(src, /\bfetch\(/, 'odo-status makes no network call');
  assert.doesNotMatch(src, /process\.env\.ODO_SUPABASE_SERVICE_ROLE_KEY/);
  assert.doesNotMatch(src, /qhjhsdsluxgyjevbhfmk\.supabase\.co/);
});

// ── send-pos-checklist: recipients and abuse controls ────────────────────────
const POS = ROUTES['send-pos-checklist'];

test('send-pos-checklist: approved recipient is the stored lead email, never the request', async () => {
  const calls = installFakeFetch();
  const r = await call('send-pos-checklist', { token: FOUNDER, env: POS.env });
  assert.equal(r.statusCode, 200, JSON.stringify(r.body));
  const sent = calls.requests.filter((q) => q.url.includes('api.resend.com'));
  assert.equal(sent.length, 1);
  assert.deepEqual(sent[0].body.to, [LEAD_EMAIL]);
  assert.match(sent[0].body.html, /Helium &lt;b&gt;Station&lt;\/b&gt;/, 'stored lead text is escaped in the email');
  const claim = calls.requests.find((q) => q.method === 'PATCH');
  assert.ok(claim, 'the lead is stamped by the server');
  assert.match(claim.url, /or=\(pos_checklist_sent_at\.is\.null,pos_checklist_sent_at\.lt\./);
});

test('send-pos-checklist: a recipient in the request is refused, nothing sent', async () => {
  for (const body of [{ email: 'stranger@evil.test', leadTable: 'leads_hotel', leadId: LEAD_ID }, { to: 'x@y.z', leadTable: 'leads_hotel', leadId: LEAD_ID }]) {
    const calls = installFakeFetch();
    const r = await call('send-pos-checklist', { token: FOUNDER, env: POS.env, body });
    assert.equal(r.statusCode, 400);
    assert.deepEqual(calls.upstream, []);
  }
});

test('send-pos-checklist: unknown table, bad id and missing body are refused before any read', async () => {
  for (const body of [{ leadTable: 'app_users', leadId: LEAD_ID }, { leadTable: 'leads_hotel', leadId: '1 or 1=1' }, {}, null]) {
    const calls = installFakeFetch();
    const r = await call('send-pos-checklist', { token: FOUNDER, env: POS.env, body });
    assert.equal(r.statusCode, 400, JSON.stringify(body));
    assert.deepEqual(calls.upstream, []);
  }
});

test('send-pos-checklist: missing lead, missing and malformed stored email are refused', async () => {
  const cases = [
    { rows: [], status: 404 },
    { rows: [{ id: LEAD_ID, email: null }], status: 422 },
    { rows: [{ id: LEAD_ID, email: 'not an email' }], status: 422 },
    { rows: [{ id: LEAD_ID, email: 'a@b.c, other@evil.test' }], status: 422 },
  ];
  for (const c of cases) {
    const calls = installFakeFetch({ over: (u, o) => (u.includes('/rest/v1/leads_') && (o.method || 'GET') === 'GET' && u.includes('id=eq.') ? json(200, c.rows) : undefined) });
    const r = await call('send-pos-checklist', { token: FOUNDER, env: POS.env });
    assert.equal(r.statusCode, c.status, JSON.stringify(c.rows));
    assert.equal(calls.upstream.some((u) => u.includes('api.resend.com')), false);
  }
});

test('send-pos-checklist: per-lead cooldown — second send in 24h is 429, nothing sent', async () => {
  const calls = installFakeFetch({ over: (u, o) => (o.method === 'PATCH' ? json(200, []) : undefined) });
  const r = await call('send-pos-checklist', { token: FOUNDER, env: POS.env });
  assert.equal(r.statusCode, 429);
  assert.equal(calls.upstream.some((u) => u.includes('api.resend.com')), false);
});

test('send-pos-checklist: daily cap — 25 sends in 24h is 429, nothing sent', async () => {
  const { DAILY_CAP } = load('send-pos-checklist');
  const full = Array.from({ length: DAILY_CAP }, (_, i) => ({ id: String(i) }));
  const calls = installFakeFetch({ over: (u) => (u.includes('pos_checklist_sent_at=gte.') && u.includes('leads_coffeeshop') ? json(200, full) : undefined) });
  const r = await call('send-pos-checklist', { token: FOUNDER, env: POS.env });
  assert.equal(r.statusCode, 429);
  assert.equal(calls.requests.some((q) => q.method === 'PATCH'), false);
  assert.equal(calls.upstream.some((u) => u.includes('api.resend.com')), false);
});

test('send-pos-checklist: missing send ledger (column absent today) fails closed 503, nothing sent', async () => {
  const missing = json(400, { code: '42703', message: 'column leads_gas_station.pos_checklist_sent_at does not exist' });
  const calls = installFakeFetch({ over: (u) => (u.includes('/rest/v1/leads_') ? missing : undefined) });
  const r = await call('send-pos-checklist', { token: FOUNDER, env: POS.env });
  assert.equal(r.statusCode, 503);
  assert.match(r.body.error, /send-limit ledger/);
  assert.equal(calls.upstream.some((u) => u.includes('api.resend.com')), false);
});

test('send-pos-checklist: provider failure is 502 and the lead stamp is given back', async () => {
  const calls = installFakeFetch({ over: (u) => (u.includes('api.resend.com') ? json(422, { message: 'internal provider detail' }) : undefined) });
  const r = await call('send-pos-checklist', { token: FOUNDER, env: POS.env });
  assert.equal(r.statusCode, 502);
  assert.equal(r.body.error.includes('internal provider detail'), false);
  const patches = calls.requests.filter((q) => q.method === 'PATCH');
  assert.equal(patches.length, 2);
  assert.deepEqual(patches[1].body, { pos_checklist_sent_at: null });
});

// ── ask-ver: validation, bounds, abuse control ───────────────────────────────
const VER = ROUTES['ask-ver'];
const anthropicCalls = (calls) => calls.requests.filter((q) => q.url.includes('api.anthropic.com'));

test('ask-ver: malformed bodies are refused 400 before any upstream call', async () => {
  for (const body of [null, [], 'text', { question: 42 }, { question: '   ' }, { question: 'ok', model: 'claude-opus-5-5' }, { question: 'ok', max_tokens: 100000 }, { question: 'ok', table: 'app_users' }]) {
    const calls = installFakeFetch();
    const r = await call('ask-ver', { token: FOUNDER, env: VER.env, body });
    assert.equal(r.statusCode, 400, JSON.stringify(body));
    assert.deepEqual(calls.upstream, []);
  }
});

test('ask-ver: oversized question is 413, model not called', async () => {
  const calls = installFakeFetch();
  const r = await call('ask-ver', { token: FOUNDER, env: VER.env, body: { question: 'x'.repeat(501) } });
  assert.equal(r.statusCode, 413);
  assert.deepEqual(calls.upstream, []);
});

test('ask-ver: fixed model and token budget; grounding docs are capped', async () => {
  const big = 'y'.repeat(50000);
  const calls = installFakeFetch({ over: (u) => (u.includes('/contents/') ? { ok: true, status: 200, text: async () => big, json: async () => ({}) } : undefined) });
  const r = await call('ask-ver', { token: FOUNDER, env: VER.env });
  assert.equal(r.statusCode, 200);
  const [req] = anthropicCalls(calls);
  const { LIMITS } = load('ask-ver');
  assert.equal(req.body.model, LIMITS.MODEL);
  assert.equal(req.body.max_tokens, LIMITS.MAX_TOKENS);
  assert.ok(req.body.system.length < 7 * (LIMITS.MAX_DOC_CHARS + 200) + 10000, 'system prompt stays bounded');
});

test('ask-ver: hourly limit reached is 429, model not called', async () => {
  const { LIMITS } = load('ask-ver');
  const full = Array.from({ length: LIMITS.HOURLY_LIMIT }, (_, i) => ({ id: String(i) }));
  const calls = installFakeFetch({ over: (u, o) => (u.includes('/rest/v1/ver_queries') && (o.method || 'GET') === 'GET' ? json(200, full) : undefined) });
  const r = await call('ask-ver', { token: FOUNDER, env: VER.env });
  assert.equal(r.statusCode, 429);
  assert.equal(anthropicCalls(calls).length, 0);
});

test('ask-ver: unreadable usage count fails closed 503, model not called', async () => {
  const calls = installFakeFetch({ over: (u, o) => (u.includes('/rest/v1/ver_queries') && (o.method || 'GET') === 'GET' ? json(500, {}) : undefined) });
  const r = await call('ask-ver', { token: FOUNDER, env: VER.env });
  assert.equal(r.statusCode, 503);
  assert.equal(anthropicCalls(calls).length, 0);
});

test('ask-ver: logs at most one validated task; bad tool input is dropped', async () => {
  const content = [
    { type: 'text', text: '1. A — b' },
    { type: 'tool_use', name: 'log_follow_up_task', input: { ecosystem: 'DROP TABLE', title: 'x', priority: 'high', phase: 'mvp' } },
    { type: 'tool_use', name: 'log_follow_up_task', input: { ecosystem: 'ODO', title: 'Real task', priority: 'high', phase: 'mvp', notes: 'n', extra: 'ignored' } },
    { type: 'tool_use', name: 'log_follow_up_task', input: { ecosystem: 'KOS', title: 'Second task', priority: 'low', phase: 'mvp' } },
  ];
  const calls = installFakeFetch({ over: (u) => (u.includes('api.anthropic.com') ? json(200, { content }) : undefined) });
  const r = await call('ask-ver', { token: FOUNDER, env: VER.env });
  assert.equal(r.statusCode, 200);
  assert.deepEqual(r.body.loggedTasks, ['Real task']);
  const inserts = calls.requests.filter((q) => q.url.includes('/rest/v1/founder_tasks'));
  assert.equal(inserts.length, 1);
  assert.deepEqual(Object.keys(inserts[0].body).sort(), ['ecosystem', 'notes', 'phase', 'priority', 'status', 'title']);
});

test('ask-ver: an upstream failure does not leak its text', async () => {
  installFakeFetch({ over: (u) => (u.includes('api.anthropic.com') ? json(500, { error: 'secret upstream detail' }) : undefined) });
  const r = await call('ask-ver', { token: FOUNDER, env: VER.env });
  assert.equal(r.statusCode, 502);
  assert.equal(JSON.stringify(r.body).includes('secret upstream detail'), false);
});

// ── security-check: restrictive treatment ────────────────────────────────────
const SEC = ROUTES['security-check'];

test('security-check: disabled by default — 403, Management API never called', async () => {
  for (const flag of [undefined, 'false', '1', 'TRUE']) {
    const env = { ...SEC.env };
    if (flag === undefined) delete env.SECURITY_CHECK_ENABLED; else env.SECURITY_CHECK_ENABLED = flag;
    const calls = installFakeFetch();
    const r = await call('security-check', { token: FOUNDER, env });
    assert.equal(r.statusCode, 403, String(flag));
    assert.equal(r.body.disabled, true);
    assert.deepEqual(calls.upstream, []);
  }
});

test('security-check: enabled output is minimal — no detail, remediation or metadata', async () => {
  installFakeFetch();
  const r = await call('security-check', { token: FOUNDER, env: SEC.env });
  assert.equal(r.statusCode, 200);
  assert.deepEqual(r.body.counts, { ERROR: 2, WARN: 0 });
  for (const f of r.body.findings) assert.deepEqual(Object.keys(f).sort(), ['level', 'title']);
  assert.equal(JSON.stringify(r.body).includes('secret_stuff'), false);
});

test('security-check: an upstream error is 502 with no status code or token detail', async () => {
  installFakeFetch({ over: (u) => (u.includes('/advisors/') ? json(401, { message: 'token sbp_x is invalid' }) : undefined) });
  const r = await call('security-check', { token: FOUNDER, env: SEC.env });
  assert.equal(r.statusCode, 502);
  assert.doesNotMatch(JSON.stringify(r.body), /401|sbp_|token/i);
});

// ── Structure ────────────────────────────────────────────────────────────────
test('no endpoint was missed: every api/ route is covered here and calls requireFounder', () => {
  const routes = fs.readdirSync(API_DIR)
    .filter((f) => f.endsWith('.js') && !f.startsWith('_'))
    .map((f) => f.replace(/\.js$/, ''))
    .sort();
  assert.deepEqual(routes, Object.keys(ROUTES).sort(), 'a route was added or removed: add it to ROUTES with its auth decision');
  for (const r of routes) {
    const src = fs.readFileSync(path.join(API_DIR, r + '.js'), 'utf8');
    assert.match(src, /if \(!\(await requireFounder\(req, res\)\)\) return;/, `${r} must call requireFounder`);
  }
});

test('no machine caller exists to preserve: vercel.json declares no cron', () => {
  // If a cron is added, this fails on purpose. Give that route its own
  // machine check (Vercel's CRON_SECRET) and a test before removing this.
  const cfg = JSON.parse(fs.readFileSync(path.join(ROOT, 'vercel.json'), 'utf8'));
  assert.equal(cfg.crons, undefined);
});

test('every /api/ call in the pages sends the session token (authFetch)', () => {
  for (const page of fs.readdirSync(ROOT).filter((f) => f.endsWith('.html'))) {
    const html = fs.readFileSync(path.join(ROOT, page), 'utf8');
    const bare = html.match(/(?<![A-Za-z])fetch\(\s*['"`]\/api\//g) || [];
    assert.equal(bare.length, 0, `${page} calls /api/ without authFetch`);
  }
  const index = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  assert.match(index, /async function authFetch\(url, opts = \{\}\)/);
  assert.match(index, /Authorization: `Bearer \$\{token\}`/);
});

test('no browser service-role exposure: every key in a page is the anon key; no server secret names', () => {
  for (const page of fs.readdirSync(ROOT).filter((f) => f.endsWith('.html'))) {
    const html = fs.readFileSync(path.join(ROOT, page), 'utf8');
    for (const token of html.match(/eyJ[A-Za-z0-9_-]+\.eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/g) || []) {
      const claims = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString('utf8'));
      assert.notEqual(claims.role, 'service_role', `${page} contains a service-role key`);
    }
    assert.doesNotMatch(html, /sb_secret_[A-Za-z0-9]/, `${page} contains a Supabase secret key`);
    assert.doesNotMatch(html, /\bsbp_[A-Za-z0-9]{10,}/, `${page} contains a Supabase personal access token`);
    assert.doesNotMatch(html, /\bsk-ant-[A-Za-z0-9-]{10,}/, `${page} contains an Anthropic key`);
    assert.doesNotMatch(html, /\bre_[A-Za-z0-9]{20,}/, `${page} contains a Resend key`);
  }
});

test('send-pos-checklist page sends a lead reference, not an address', () => {
  const index = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  const call = index.slice(index.indexOf("authFetch('/api/send-pos-checklist'"), index.indexOf("authFetch('/api/send-pos-checklist'") + 600);
  assert.match(call, /leadTable: btn\.dataset\.table/);
  assert.match(call, /leadId: btn\.dataset\.id/);
  assert.doesNotMatch(call, /email:/);
});
