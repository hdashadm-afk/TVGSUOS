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
| 2 | `api/ask-ver.js` | `SUPABASE_SERVICE_ROLE_KEY` | One call to `rpc/ver_reserve_call`, the atomic spend reservation **before** the paid call (§3.2). Read open `decisions` (title, context, status, created_at; 10 rows; text capped). Read open `improvement_signals` (5 columns; 10 rows; text capped). Insert one `ver_queries` row. Insert at most one `founder_tasks` row with enum- and length-checked fields | Grounding plus the spend limit. **Fails closed today** (§3.2) |
| 3 | `api/ask-ver.js` | `ANTHROPIC_API_KEY` | One Messages call, made only after a successful reservation. Fixed model, `max_tokens` 600, question ≤ 500 chars, each grounding doc ≤ 12,000 chars, live context ≤ 8,000 chars, ≤ 20 reservations per hour | The feature |
| 4 | `api/send-pos-checklist.js` | `SUPABASE_SERVICE_ROLE_KEY` | Read one lead row by id from one of three fixed lead tables (pre-check). One call to `rpc/claim_checklist_send`: per-lead cooldown, daily cap and ledger insert in one transaction (§3.1) | Recipient from a stored lead, plus atomic limits. **Fails closed today** (§3.1) |
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

1. **Atomic checklist-send claim (blocks checklist sending).** No reservation function exists in
   `public` (`pg_proc` checked 2026-10-29), and the lead tables have no send column. Until the SQL
   below runs, `send-pos-checklist` returns 503 and sends nothing. It replaces the earlier
   proposal: one column, plus a separate count and update, which raced on the daily cap.
   **Not run. Needs founder approval.**
   ```sql
   create table if not exists public.checklist_sends (
     id uuid primary key default gen_random_uuid(),
     lead_table text not null check (lead_table in ('leads_coffeeshop','leads_hotel','leads_gas_station')),
     lead_id uuid not null,
     reserved_at timestamptz not null default now()
   );
   create index if not exists checklist_sends_reserved_at on public.checklist_sends (reserved_at);
   create index if not exists checklist_sends_lead on public.checklist_sends (lead_table, lead_id, reserved_at);
   alter table public.checklist_sends enable row level security;
   revoke all on public.checklist_sends from anon, authenticated;

   create or replace function public.claim_checklist_send(
     p_lead_table text, p_lead_id uuid, p_cooldown_hours int, p_daily_cap int
   ) returns jsonb language plpgsql security definer set search_path = public as $$
   declare v_email text; v_id uuid;
   begin
     -- One lock for every claim, so the cooldown and the daily cap are checked and taken together.
     perform pg_advisory_xact_lock(hashtext('claim_checklist_send'));
     if p_lead_table = 'leads_coffeeshop' then select email into v_email from leads_coffeeshop where id = p_lead_id;
     elsif p_lead_table = 'leads_hotel' then select email into v_email from leads_hotel where id = p_lead_id;
     elsif p_lead_table = 'leads_gas_station' then select email into v_email from leads_gas_station where id = p_lead_id;
     else raise exception 'unknown lead table';
     end if;
     if v_email is null then raise exception 'lead not found'; end if;
     if exists (select 1 from checklist_sends where lead_table = p_lead_table and lead_id = p_lead_id
                and reserved_at > now() - make_interval(hours => least(greatest(p_cooldown_hours, 24), 168))) then
       return jsonb_build_object('status', 'cooldown');
     end if;
     if (select count(*) from checklist_sends where reserved_at > now() - interval '24 hours') >= least(p_daily_cap, 25) then
       return jsonb_build_object('status', 'cap');
     end if;
     insert into checklist_sends (lead_table, lead_id) values (p_lead_table, p_lead_id) returning id into v_id;
     return jsonb_build_object('status', 'claimed', 'claim_id', v_id, 'email', v_email);
   end $$;
   revoke all on function public.claim_checklist_send(text, uuid, int, int) from public, anon, authenticated;
   grant execute on function public.claim_checklist_send(text, uuid, int, int) to service_role;
   ```
   Any error inside the function rolls the whole transaction back, and the route treats it as 503.
2. **Atomic Ask Ver spend reservation (blocks Ask Ver).** Same evidence. Until this runs, Ask Ver
   returns 503 and never calls Anthropic. **Not run. Needs founder approval.**
   ```sql
   create table if not exists public.ver_call_ledger (
     id uuid primary key default gen_random_uuid(),
     reserved_at timestamptz not null default now()
   );
   create index if not exists ver_call_ledger_reserved_at on public.ver_call_ledger (reserved_at);
   alter table public.ver_call_ledger enable row level security;
   revoke all on public.ver_call_ledger from anon, authenticated;

   create or replace function public.ver_reserve_call(p_hourly_limit int)
   returns jsonb language plpgsql security definer set search_path = public as $$
   declare v_id uuid;
   begin
     perform pg_advisory_xact_lock(hashtext('ver_reserve_call'));
     if (select count(*) from ver_call_ledger where reserved_at > now() - interval '1 hour') >= least(p_hourly_limit, 20) then
       return jsonb_build_object('reserved', false);
     end if;
     insert into ver_call_ledger default values returning id into v_id;
     return jsonb_build_object('reserved', true, 'reservation_id', v_id);
   end $$;
   revoke all on function public.ver_reserve_call(int) from public, anon, authenticated;
   grant execute on function public.ver_reserve_call(int) to service_role;
   ```
   The hard ceilings (20 per hour; 25 per day; cooldown of at least 24h) are inside the functions,
   so a caller passing a larger number gets no more.
3. **RLS review of the tables `index.html` reads and writes with the signed-in user's token**
   (`founder_tasks`, `decisions`, `improvement_signals`, `ver_queries`, `projects`,
   `daily_baseline_checks`, `decision_log`, `waitlist_leads`, the three lead tables, and others
   listed in the Phase 0 audit §4). Not verified in this PR. A `USING (true)` policy is not adequate
   RLS.
4. **Narrower database role for server routes.** Every server read and write above uses the
   service-role key, which bypasses RLS. Least privilege would use the caller's own token, under
   founder-scoped RLS policies, or a dedicated role with grants on the listed tables only.
   This needs SQL policies and grants, which are not part of this PR.
5. **Management token.** Leave `SECURITY_CHECK_ENABLED` unset unless the check is needed. Consider
   removing `SUPABASE_MANAGEMENT_TOKEN` from Vercel entirely and running advisors from an
   interactive session instead.
6. **Notion retirement.** `api/founder-os-notion.js` and `NOTION_API_KEY` remain (founder-gated).
   Retiring them is a separate approved batch (MASTER §4; Phase 0 audit C3).
7. **ODO key.** `ODO_SUPABASE_SERVICE_ROLE_KEY` is no longer read. The founder should delete it from
   the `tvgsuosweb` Vercel project and rotate it in ODO's Supabase project, because it was held by
   another app.
8. **Rate limits on other routes.** `generate-repo-tree`, `generate-baseline-status` and
   `founder-os-notion` are founder-only and read-only, with no per-call spend. They have no usage
   limit yet.

## 4. Test evidence boundary

`tests/route-auth.test.js` is a **mocked unit test**: `fetch` is replaced, and no real Supabase,
RLS, Resend, Anthropic, Preview or production call is made. The "competing reservation" tests
prove only that the **route** never calls a paid service unless the database function grants the
slot. They do not prove the SQL in §3.1–§3.2 is concurrency-safe. That needs the functions
installed and a real parallel test against a non-production database. A passing run is not evidence of RLS,
of a deployed route, or of production behaviour. Those need a Preview probe (anonymous request →
401 per route) and a read of `pg_policies`, recorded separately.
