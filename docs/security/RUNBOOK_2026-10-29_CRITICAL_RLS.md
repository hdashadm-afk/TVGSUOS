# Runbook — critical RLS correction (decision_log, weekly_innovation_summary)

**Project:** Supabase `jbhfdmujqrtqkhacfegl` · **SQL:**
[`2026-10-29_critical_rls_decision_log_weekly_innovation_summary.sql`](2026-10-29_critical_rls_decision_log_weekly_innovation_summary.sql)
**Status:** prepared, **not executed**. The founder runs it after independent review.

**Merge rule:** this PR does not merge until the founder confirms on the PR that the SQL ran and
that step 3 below returned the expected rows. A screenshot is enough (see "Screenshots" below). (MASTER §11.7: no PR requiring a
migration ships until the founder confirms the SQL ran.)

## Why

Both tables have a `{public}` `USING (true)` policy. Anyone holding the anon key shipped in the page
can read and write them. The dependency check on 2026-10-29 found the only browser consumer is the
signed-in founder:

- `index.html:6044` reads `decision_log`.
- `index.html:4327` and `index.html:4368` select and upsert `weekly_innovation_summary`.
- katiwala `app.html:6663-6676` has console-only helpers with no UI.
- The daily Ver routine reads `decision_log` with admin rights that bypass RLS, so it is unaffected.

## Screenshots — how to report a result

The founder never copies or retypes error text, keys or tokens.
- To report any step, take a **screenshot of the SQL Editor results or messages panel only**, and
  attach it to the PR or send it to the agent.
- Crop it to that panel. Make sure no other browser tab, the API-keys page, the project settings,
  or table rows with customer or lead data are visible.
- The queries in steps 1 and 3 return policy metadata only (names, roles, expressions). They show
  no customer data and no secrets.
- An authorized agent reads the screenshot and records the outcome on the PR.

**Out of scope:** `internal_admin`, FORCE RLS, form-insert abuse controls, service-role
replacement, grants, and every other table.

## 1. Before running — confirm the live policies

Run in the Supabase SQL Editor (read only):

```sql
select tablename, policyname, roles, cmd, qual, with_check
from pg_policies
where schemaname = 'public' and tablename in ('decision_log', 'weekly_innovation_summary')
order by tablename, policyname;
```

Expected — exactly these 5 rows (as read on 2026-10-29):

| tablename | policyname | roles | cmd | qual |
|---|---|---|---|---|
| decision_log | authenticated can manage decision_log | {public} | ALL | true |
| decision_log | founder can read decision_log | {authenticated} | SELECT | is_founder_or_unrestricted() |
| weekly_innovation_summary | founder can read weekly_innovation_summary | {authenticated} | SELECT | is_founder_or_unrestricted() |
| weekly_innovation_summary | public can manage weekly_innovation_summary | {public} | ALL | true |
| weekly_innovation_summary | public can read weekly_innovation_summary | {public} | SELECT | true |

If anything differs, **stop** and send a screenshot of the result. The SQL's own preflight would
refuse anyway and change nothing.

## 2. Run the SQL

Paste the whole file into the SQL Editor and run it once. It is one transaction:

1. **Preflight:** raises unless all of these hold:
   - RLS is on for both tables.
   - The 5 policies above are exactly as listed, the kept ones PERMISSIVE.
   - `public.is_founder_or_unrestricted()` is exactly the reviewed definition: SECURITY DEFINER,
     `search_path=public`, definition md5 `f938327d85ca3682993d8e42eb0746e5`.
   - Both tables' grants are exactly the reviewed ACL
     `{postgres=arwdDxtm/postgres,anon=arwdDxtm/postgres,authenticated=arwdDxtm/postgres,service_role=arwdDxtm/postgres}`.
2. **Changes:**
   ```sql
   drop policy "authenticated can manage decision_log" on public.decision_log;
   drop policy "public can manage weekly_innovation_summary" on public.weekly_innovation_summary;
   drop policy "public can read weekly_innovation_summary" on public.weekly_innovation_summary;
   create policy "founder manages weekly_innovation_summary" on public.weekly_innovation_summary
     for all to authenticated
     using (public.is_founder_or_unrestricted())
     with check (public.is_founder_or_unrestricted());
   ```
3. **Postflight:** raises unless:
   - no `true` qual or check remains;
   - no `{public}` or `anon` policy remains;
   - `decision_log` has only its founder SELECT policy;
   - `weekly_innovation_summary` has exactly the founder SELECT and founder ALL policies;
   - every remaining policy is PERMISSIVE;
   - both tables' grants are byte-for-byte what they were before the run (no grant is changed);
   - RLS is still on.

   Any exception rolls the whole transaction back.

Success ends with `COMMIT`. An error means nothing changed: take a screenshot of the messages panel
(see "Screenshots"), send it, and stop.

**There is no "restore public access" rollback.** If the founder editor breaks after this runs,
fix it with a founder-scoped policy, never with `USING (true)`.

## 3. After running — verify `pg_policies`

Run the query from step 1 again. Expected — exactly these 3 rows:

| tablename | policyname | roles | cmd | qual | with_check |
|---|---|---|---|---|---|
| decision_log | founder can read decision_log | {authenticated} | SELECT | is_founder_or_unrestricted() | |
| weekly_innovation_summary | founder can read weekly_innovation_summary | {authenticated} | SELECT | is_founder_or_unrestricted() | |
| weekly_innovation_summary | founder manages weekly_innovation_summary | {authenticated} | ALL | is_founder_or_unrestricted() | is_founder_or_unrestricted() |

Send a screenshot of the result (see "Screenshots").

## 4. Access tests (a separate gate, after step 3) — run by an authorized agent or staff member

The founder does **not** handle the anon key, access tokens or any credential.
- An authorized agent or staff member runs these tests using the existing secure test process, with
  test accounts and credentials that process already holds. They are never pasted into chat, a PR
  or a document.
- The tester records the timestamp and result of each test and posts a **summary** on the PR.
- The founder only reviews and confirms that summary.

| # | Caller | Action | Expected |
|---|---|---|---|
| 1 | Anonymous (no sign-in) | Read `decision_log` | No rows |
| 2 | Anonymous | Write to `decision_log` | Refused (RLS violation) |
| 3 | Anonymous | Read `weekly_innovation_summary` | No rows |
| 4 | Anonymous | Write to `weekly_innovation_summary` | Refused |
| 5 | Signed-in non-founder test account | Tests 1–4 | No rows; writes refused |
| 6 | Founder session, TVGSUOS | Daily check → Regenerate (reads `decision_log` when no closed decision exists) | Works |
| 7 | Founder session, TVGSUOS | Weekly Innovation Summary → load, then save this week's row twice | Both saves succeed; the second updates the same row |
| 8 | Founder session | Any browser write to `decision_log` | Refused (intended: no browser writes) |

Tests 6–8 need the founder's own signed-in session. The founder clicks through them in the app,
and the tester confirms the outcome from the app's response or the request logs. No token is
copied. Remove only a test row the tester created, and only that row.

## 5. Helper verification — `public.is_founder_or_unrestricted()` (read-only, 2026-10-29)

Read from `pg_proc`, `pg_policies`, `information_schema` and `pg_class` on the live project. Counts
only; no row contents.

| Property | Live value | Assessment |
|---|---|---|
| Security | `SECURITY DEFINER`, owner `postgres`, `LANGUAGE sql`, `STABLE`, returns `boolean` | It runs as the owner, so it can read `app_users` regardless of the caller's RLS. Expected for a role check |
| `search_path` | `public` (exactly; set on the function) | Set, so not caller-controlled. `pg_temp` is not listed (see residual risk) |
| Overloads | 1, in `public` only | No ambiguity |
| Founder / "unrestricted" condition | Row in `app_users` with `id = auth.uid()`, `role in ('founder','internal_admin')`, `department_id is null`, and the user is not in `app_user_departments` | "Unrestricted" means a founder or internal admin with no department scoping |
| `NOT IN` null trap | `app_user_departments.user_id` is `uuid NOT NULL`; 0 null rows | `NOT IN` cannot turn into "unknown → false for everyone" |
| Anonymous caller | `auth.uid()` is null, so false | Anon never passes |
| `internal_admin` | Passes the same as the founder; **0 such accounts today** | Out of scope here (founder decision). No current account gains access |
| Existing founder account | 1 founder row; 1 passes | The founder editor and read keep working |
| Self-promotion | `app_users` has no INSERT/UPDATE/ALL policy; `grant_user_access` is gated to the founder's JWT email | A signed-in user cannot give themselves `founder` through the API |
| Execute rights | `anon`, `authenticated`, `service_role`, PUBLIC | Calling it reveals only true/false about the caller |
| Definition md5 | `f938327d85ca3682993d8e42eb0746e5` | Pinned by the preflight. Any later change makes the SQL refuse to run |

**Residual risk (low, not a blocker; not changed in this PR).** `search_path=public` without a
trailing `pg_temp` means a session that could create a temp table named `app_users` could shadow
the real one inside this SECURITY DEFINER function. `anon` and `authenticated` do hold `TEMP` on the
database. But PostgREST offers no way to run `CREATE TEMP TABLE`, and no SECURITY DEFINER function
callable by `authenticated` runs dynamic SQL (0 found). So this is not reachable through the API.
Recommended separately: `set search_path = ''` with schema-qualified names, or
`public, pg_temp` — a helper change for its own reviewed PR.

**Verdict: nothing in the helper makes this migration unsafe.** The new policy grants nothing beyond
what the existing founder SELECT policies already rely on.

## 6. Evidence already produced (not production)

The SQL was run against a **throwaway local PostgreSQL 16**. It held a fixture that recreated these
two tables' live policies, grants, `auth.uid()` and the exact `is_founder_or_unrestricted()`
definition. Results, all as expected:

- the migration commits;
- the resulting policies match the step 3 table;
- anon and non-founder get 0 rows and refused writes;
- the founder can read both tables, and upsert-insert and upsert-update work on
  `weekly_innovation_summary`;
- `decision_log` writes are refused for the founder too;
- a second run is refused by the preflight, with nothing changed;
- an extra drifted policy is refused by the preflight, with nothing changed;
- a deliberately broken create step is caught by the postflight and fully rolled back.

**Re-run after the review remediation (2026-10-29).** The fixture reproduced the helper's exact live
definition (its md5 matched `f938327d…`) and the live grants. All of these passed:

1. The run commits. All 3 resulting policies are PERMISSIVE and the grants are unchanged.
2. The anon, non-founder and founder access results are as before.
3. A re-run is refused by the preflight.
4. A drifted extra policy, a drifted grant, and a drifted helper are each refused by the preflight,
   with nothing changed.
5. A grant changed mid-run, a RESTRICTIVE create, and an open `using (true)` create are each caught
   by the postflight and fully rolled back. The original 5 policies and the ACL stay intact.

One limit: local PostgreSQL 16 has no `MAINTAIN` privilege (`m`, added in 17). So the test copy used
`arwdDxt` where the committed SQL pins the live `arwdDxtm`; that is the only difference between them.

This is evidence that the SQL is correct **on a model** of the live database. It is not evidence about
the live database itself. Steps 3 and 4 are.
