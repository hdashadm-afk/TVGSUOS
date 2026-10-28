// Founder-only caller check for every api/ route in TVGSUOS.
//
// Written 2026-10-28. TVGSUOS is founder-only (README: "Founder-only. No
// public pages, no client access."), and index.html already gates the
// screen on app_users.role === 'founder'. But the 7 routes in this
// directory held service-role, Anthropic, GitHub, Notion, Supabase
// Management and Resend credentials and checked only the HTTP method, so
// anyone who knew a URL got the answer the founder gets. A gated screen is
// presentation, not access control; this is the server half of the gate.
//
// Same pattern as katiwala-owner-os-'s api/_lens-auth.js (same Supabase
// project, same app_users table):
//   1. the caller's own Supabase access token is verified against
//      /auth/v1/user;
//   2. that user's app_users.role is read with the service-role key;
//   3. only role === 'founder' proceeds.
//
// FAILS CLOSED: no token, a bad token, an auth outage, a missing
// service-role key or a missing app_users row all deny. An outage must not
// reopen a route.
//
// No machine caller exists today: vercel.json has no crons, and the
// scheduled "Daily Baseline Check — Ver" routine writes through the
// Supabase MCP, not these routes (checked 2026-10-28). So there is no
// shared secret path here on purpose. If a cron is ever added, give it its
// own check in that route and a test; tests/route-auth.test.js fails while
// vercel.json declares a cron, so the decision cannot be skipped.

const SUPABASE_URL = 'https://jbhfdmujqrtqkhacfegl.supabase.co';

// The publishable anon key, already shipped in index.html. It is only the
// `apikey` Supabase needs to validate the CALLER's token; the gate is the
// caller's token, never this key.
const SUPABASE_PUBLISHABLE_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpiaGZkbXVqcXJ0cWtoYWNmZWdsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMzOTE0NjksImV4cCI6MjA5ODk2NzQ2OX0.yjGuawybNLSCCbviGJ7hXiNLyG6OZ7_RthdTuUulDX8';

function anonKey() {
  const fromEnv = (process.env.SUPABASE_ANON_KEY || '').trim();
  return /^(eyJ|sb_publishable_)/.test(fromEnv) ? fromEnv : SUPABASE_PUBLISHABLE_KEY;
}

function bearerToken(req) {
  const raw = (req.headers && (req.headers.authorization || req.headers.Authorization)) || '';
  return String(raw).replace(/^Bearer\s+/i, '').trim();
}

// The caller's Supabase auth user, or null. Never throws.
async function resolveCaller(req) {
  try {
    const token = bearerToken(req);
    if (!token) return null;
    const r = await fetch(SUPABASE_URL + '/auth/v1/user', {
      headers: { Authorization: 'Bearer ' + token, apikey: anonKey() },
    });
    if (!r.ok) return null;
    const u = await r.json();
    return u && u.id ? u : null;
  } catch (err) {
    console.error('[_founder-auth] token check failed:', err);
    return null;
  }
}

// app_users.role for a verified user id, or null. Never throws.
async function callerRole(userId) {
  try {
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!serviceRoleKey) {
      console.error('[_founder-auth] SUPABASE_SERVICE_ROLE_KEY missing — denying');
      return null;
    }
    const r = await fetch(
      SUPABASE_URL + '/rest/v1/app_users?id=eq.' + encodeURIComponent(userId) + '&select=role',
      { headers: { apikey: serviceRoleKey, Authorization: 'Bearer ' + serviceRoleKey } }
    );
    if (!r.ok) return null;
    const rows = await r.json();
    return Array.isArray(rows) && rows[0] ? rows[0].role : null;
  } catch (err) {
    console.error('[_founder-auth] role lookup failed:', err);
    return null;
  }
}

// Returns true when the request may proceed. Writes the 401/403 itself
// when it may not, so a route only needs:
//     if (!(await requireFounder(req, res))) return;
async function requireFounder(req, res) {
  const user = await resolveCaller(req);
  if (!user) {
    res.status(401).json({ error: 'Sign in required.' });
    return false;
  }
  const role = await callerRole(user.id);
  if (role !== 'founder') {
    res.status(403).json({ error: 'Not available for this account.' });
    return false;
  }
  return true;
}

module.exports = { requireFounder, resolveCaller, callerRole, SUPABASE_URL };
