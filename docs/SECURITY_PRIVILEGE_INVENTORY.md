# TVGSUOS — privileged-operation inventory and open dependencies

**Written:** 2026-10-29 · **PR:** #73 (`claude/secure-api-routes`) · **Status:** evidence record,
not a sign-off. JavaScript changes in PR #73 narrow what each route does. They do **not** make the
database least-privilege: every server route below still uses the project-wide service-role key,
and RLS on the tables the page reads has not been reviewed. Those are listed in §3 as
founder-approved dependencies. Nothing here was run.

## 1. Every remaining privileged operation (after PR #73)

| # | Route / file | Credential | Operation (fixed; no caller-chosen table, path or query) | Why it stays |
|---|---|---|---|---|
| 1 | `api/_founder-auth.js` | `SUPABASE_SERVICE_ROLE_KEY` | `GET app_users?id=eq.<verified user id>&select=role` | The founder check itself. See §3.3 |
| 2 | `api/ask-ver.js` | `SUPABASE_SERVICE_ROLE_KEY` | Read open `decisions` (title, context, status, created_at; 10 rows). Read open `improvement_signals` (5 columns; 10 rows). Count `ver_queries` answered in the last hour (limit check). Insert one `ver_queries` row. Insert at most one `founder_tasks` row with enum-checked fields | Grounding plus the durable usage limit |
| 3 | `api/ask-ver.js` | `ANTHROPIC_API_KEY` | One Messages call: fixed model, `max_tokens` 600, question ≤ 500 chars, each grounding doc ≤ 12,000 chars, ≤ 20 answers per hour | The feature |
| 4 | `api/send-pos-checklist.js` | `SUPABASE_SERVICE_ROLE_KEY` | Read one lead row by id from one of three fixed lead tables. Count recent sends. Conditional `PATCH` of that lead's `pos_checklist_sent_at` | Recipient from a stored lead, plus durable limits. **Fails closed today**, see §3.1 |
| 5 | `api/send-pos-checklist.js` | `RESEND_API_KEY` | One email to the stored lead's address. Cooldown 24h per lead; cap 25 per 24h overall | The feature |
| 6 | `api/generate-baseline-status.js` | `SUPABASE_SERVICE_ROLE_KEY` | Count pending `ver_queries` | Baseline line |
| 7 | `api/security-check.js` | `SUPABASE_MANAGEMENT_TOKEN` (account-wide personal token) | Two GETs, advisors for one hard-coded project. **Off by default** (`SECURITY_CHECK_ENABLED=true` required). Output: level, title and counts only | On-demand advisor read. See §3.4 |
| 8 | `api/generate-repo-tree.js`, `api/generate-baseline-status.js`, `api/ask-ver.js` | `GITHUB_TOKEN` (optional) | Read-only GitHub contents and repo list | Docs and repo tree |
| 9 | `api/founder-os-notion.js` | `NOTION_API_KEY` | Notion data-source queries | **Retired direction** (MASTER §4). See §3.5 |

**Removed in PR #73:**
- `api/odo-status.js` no longer reads ODO's project. There is no ODO URL, no
  `ODO_SUPABASE_SERVICE_ROLE_KEY` read, and no fetch.
- `send-pos-checklist` no longer accepts a recipient from the request.
- `ask-ver` no longer returns raw upstream error text.

All routes call `requireFounder` first. That check refuses expired and other-project tokens before
any network call, then verifies the token with Supabase Auth and the role in `app_users`.

## 2. Browser exposure

`index.html` carries only the publishable anon key. No service-role key, Management token or other
server credential is present in any `.html` file (checked by `tests/route-auth.test.js`,
"no browser service-role exposure").

## 3. Dependencies that JavaScript cannot fix (founder-approved, separate step)

1. **Send-limit ledger (blocks checklist sending).** `information_schema` on 2026-10-29 shows no
   `pos_checklist_sent_at` column on `leads_coffeeshop`, `leads_hotel` or `leads_gas_station`.
   (The page's old client-side write to it could never have succeeded.) Until it exists,
   `send-pos-checklist` returns 503 and sends nothing. Proposed SQL — **not run, needs founder
   approval**:
   ```sql
   alter table public.leads_coffeeshop  add column if not exists pos_checklist_sent_at timestamptz;
   alter table public.leads_hotel       add column if not exists pos_checklist_sent_at timestamptz;
   alter table public.leads_gas_station add column if not exists pos_checklist_sent_at timestamptz;
   ```
2. **RLS review of the tables `index.html` reads and writes with the signed-in user's token**
   (`founder_tasks`, `decisions`, `improvement_signals`, `ver_queries`, `projects`,
   `daily_baseline_checks`, `decision_log`, `waitlist_leads`, the three lead tables, and others
   listed in the Phase 0 audit §4). Not verified in this PR. A `USING (true)` policy is not adequate
   RLS.
3. **Narrower database role for server routes.** Every server read and write above uses the
   service-role key, which bypasses RLS. Least privilege would use the caller's own token, under
   founder-scoped RLS policies, or a dedicated role with grants on the listed tables only.
   This needs SQL policies and grants, which are not part of this PR.
4. **Management token.** Leave `SECURITY_CHECK_ENABLED` unset unless the check is needed. Consider
   removing `SUPABASE_MANAGEMENT_TOKEN` from Vercel entirely and running advisors from an
   interactive session instead.
5. **Notion retirement.** `api/founder-os-notion.js` and `NOTION_API_KEY` remain (founder-gated).
   Retiring them is a separate approved batch (MASTER §4; Phase 0 audit C3).
6. **ODO key.** `ODO_SUPABASE_SERVICE_ROLE_KEY` is no longer read. The founder should delete it from
   the `tvgsuosweb` Vercel project and rotate it in ODO's Supabase project, because it was held by
   another app.
7. **Rate limits on other routes.** `generate-repo-tree`, `generate-baseline-status` and
   `founder-os-notion` are founder-only and read-only, with no per-call spend. They have no usage
   limit yet.

## 4. Test evidence boundary

`tests/route-auth.test.js` is a **mocked unit test**: `fetch` is replaced, and no real Supabase,
RLS, Resend, Anthropic, Preview or production call is made. A passing run is not evidence of RLS,
of a deployed route, or of production behaviour. Those need a Preview probe (anonymous request →
401 per route) and a read of `pg_policies`, recorded separately.
