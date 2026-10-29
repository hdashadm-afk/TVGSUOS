# Runbook — critical RLS correction (decision_log, weekly_innovation_summary)

**Project:** Supabase `jbhfdmujqrtqkhacfegl` · **SQL:**
[`2026-10-29_critical_rls_decision_log_weekly_innovation_summary.sql`](2026-10-29_critical_rls_decision_log_weekly_innovation_summary.sql)
**Status:** prepared, **not executed**. The founder runs it after independent review.

**Merge rule:** this PR does not merge until the founder confirms, in writing on the PR, that
the SQL ran and that step 3 below returned the expected rows. (MASTER §11.7: no PR requiring a
migration ships until the founder confirms the SQL ran.)

## Why

Both tables have a `{public}` `USING (true)` policy. Anyone holding the anon key shipped in the page
can read and write them. The dependency check on 2026-10-29 found the only browser consumer is the
signed-in founder:

- `index.html:6044` reads `decision_log`.
- `index.html:4327` and `index.html:4368` select and upsert `weekly_innovation_summary`.
- katiwala `app.html:6663-6676` has console-only helpers with no UI.
- The daily Ver routine reads `decision_log` with admin rights that bypass RLS, so it is unaffected.

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

If anything differs, **stop**. The SQL's own preflight would refuse anyway and change nothing.

## 2. Run the SQL

Paste the whole file into the SQL Editor and run it once. It is one transaction:

1. **Preflight:** raises unless RLS is on for both tables, `public.is_founder_or_unrestricted()`
   exists, and the 5 policies above are exactly as listed.
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
   - RLS is still on.

   Any exception rolls the whole transaction back.

Success ends with `COMMIT`. An error means nothing changed: copy the error text to the PR and stop.

**There is no "restore public access" rollback.** If the founder editor breaks after this runs,
fix it with a founder-scoped policy, never with `USING (true)`.

## 3. After running — verify `pg_policies`

Run the query from step 1 again. Expected — exactly these 3 rows:

| tablename | policyname | roles | cmd | qual | with_check |
|---|---|---|---|---|---|
| decision_log | founder can read decision_log | {authenticated} | SELECT | is_founder_or_unrestricted() | |
| weekly_innovation_summary | founder can read weekly_innovation_summary | {authenticated} | SELECT | is_founder_or_unrestricted() | |
| weekly_innovation_summary | founder manages weekly_innovation_summary | {authenticated} | ALL | is_founder_or_unrestricted() | is_founder_or_unrestricted() |

Paste the result on the PR.

## 4. Access tests (a separate gate, after step 3)

Use the real deployed app and the Supabase REST endpoint. Record the timestamp and result of each.
Never paste a token.

| # | Caller | Action | Expected |
|---|---|---|---|
| 1 | Anonymous (anon key only) | `GET /rest/v1/decision_log?select=id&limit=1` | `[]` (no rows) |
| 2 | Anonymous | `POST /rest/v1/decision_log` with a test body | 401/403, RLS violation |
| 3 | Anonymous | `GET /rest/v1/weekly_innovation_summary?select=id&limit=1` | `[]` |
| 4 | Anonymous | `POST /rest/v1/weekly_innovation_summary` with a test body | 401/403, RLS violation |
| 5 | Signed-in non-founder (client account) | Same 4 requests with that user's token | No rows; writes refused |
| 6 | Founder, in TVGSUOS | Daily check → Regenerate (reads `decision_log` when no closed decision exists) | Works |
| 7 | Founder, in TVGSUOS | Weekly Innovation Summary → load, then save this week's row twice | Both saves succeed; the second updates the same row |
| 8 | Founder | Any write to `decision_log` from the browser | Refused (intended: no browser writes) |

Delete any test row a test created only if it was written by the founder in test 7, and only that row.

## 5. Evidence already produced (not production)

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

This is evidence that the SQL is correct **on a model** of the live database. It is not evidence about
the live database itself. Steps 3 and 4 are.
