// Every api/ route is founder-only. These tests prove it, route by route.
//
// Run: node --test tests/
//
// fetch is replaced with a fake that plays Supabase Auth, app_users and
// every upstream (GitHub, Anthropic, Notion, Supabase REST/Management,
// Resend). "Upstream" means any call that is not the caller check itself;
// a rejected caller must cause ZERO upstream calls, so no credential is
// ever used on a stranger's behalf.

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname, '..');
const API_DIR = path.join(ROOT, 'api');

const FOUNDER = 'founder-token';
const STAFF = 'staff-token'; // a real signed-in user whose role is not founder
const NO_ROW = 'no-row-token'; // a real auth user with no app_users row

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
    expect: (r) => assert.equal(typeof r.body.business, 'object'),
  },
  'security-check': {
    method: 'POST',
    env: { SUPABASE_MANAGEMENT_TOKEN: 'test-mgmt', SUPABASE_SERVICE_ROLE_KEY: 'test-service' },
    expect: (r) => assert.ok(Array.isArray(r.body.findings)),
  },
  'send-pos-checklist': {
    method: 'POST',
    body: { email: 'owner@example.com', leadType: 'gasstation' },
    env: { RESEND_API_KEY: 'test-resend', SUPABASE_SERVICE_ROLE_KEY: 'test-service' },
    expect: (r) => assert.equal(r.body.ok, true),
  },
};

const ENV_KEYS = [
  'ANTHROPIC_API_KEY', 'SUPABASE_SERVICE_ROLE_KEY', 'ODO_SUPABASE_SERVICE_ROLE_KEY',
  'NOTION_API_KEY', 'SUPABASE_MANAGEMENT_TOKEN', 'RESEND_API_KEY', 'GITHUB_TOKEN', 'SUPABASE_ANON_KEY',
];

function json(status, body) {
  return { ok: status >= 200 && status < 300, status, json: async () => body, text: async () => JSON.stringify(body) };
}

function installFakeFetch({ authDown = false } = {}) {
  const calls = { auth: 0, role: 0, upstream: [] };
  global.fetch = async (url, opts = {}) => {
    const u = String(url);
    const headers = opts.headers || {};
    if (u.endsWith('/auth/v1/user')) {
      calls.auth++;
      if (authDown) throw new Error('auth outage');
      const token = String(headers.Authorization || '').replace(/^Bearer /, '');
      if (token === FOUNDER) return json(200, { id: 'u-founder' });
      if (token === STAFF) return json(200, { id: 'u-staff' });
      if (token === NO_ROW) return json(200, { id: 'u-norow' });
      return json(401, { msg: 'invalid JWT' });
    }
    if (u.includes('/rest/v1/app_users')) {
      calls.role++;
      if (u.includes('u-founder')) return json(200, [{ role: 'founder' }]);
      if (u.includes('u-staff')) return json(200, [{ role: 'client_owner' }]);
      return json(200, []);
    }
    calls.upstream.push(u);
    if (u.includes('api.anthropic.com')) return json(200, { content: [{ type: 'text', text: '1. Test — ok' }] });
    if (u.includes('api.notion.com')) return json(200, { results: [], has_more: false });
    if (u.includes('/advisors/')) return json(200, { lints: [] });
    if (u.includes('api.resend.com')) return json(200, { id: 'email-1' });
    if (u.includes('/contents/')) return { ok: true, status: 200, text: async () => '# doc', json: async () => ({}) };
    if (u.includes('/users/hdashadm-afk/repos')) return json(200, [{ name: 'TVGSUOS', private: false, default_branch: 'main', pushed_at: '2026-10-28T00:00:00Z' }]);
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

async function call(name, { token, env } = {}) {
  const spec = ROUTES[name];
  for (const k of ENV_KEYS) delete process.env[k];
  Object.assign(process.env, env || {});
  const req = {
    method: spec.method,
    headers: token ? { authorization: 'Bearer ' + token } : {},
    query: spec.query || {},
    body: spec.body || {},
  };
  const res = fakeRes();
  await load(name)(req, res);
  return res;
}

const originalFetch = global.fetch;
const quiet = console.error;
test.beforeEach(() => { console.error = () => {}; });
test.afterEach(() => { global.fetch = originalFetch; console.error = quiet; });

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
    const r = await call(name, { token: 'forged', env: spec.env });
    assert.equal(r.statusCode, 401);
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
    assert.ok(calls.upstream.length > 0, 'the founder call reaches its upstream');
    spec.expect(r);
  });
}

test('assistant (Ask Ver) answers the founder and records the answer', async () => {
  const calls = installFakeFetch();
  const r = await call('ask-ver', { token: FOUNDER, env: ROUTES['ask-ver'].env });
  assert.equal(r.statusCode, 200);
  assert.equal(r.body.answer, '1. Test — ok');
  assert.ok(calls.upstream.some((u) => u.includes('api.anthropic.com')));
  assert.ok(calls.upstream.some((u) => u.includes('/rest/v1/ver_queries')));
});

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
