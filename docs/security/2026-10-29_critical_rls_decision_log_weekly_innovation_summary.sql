-- ============================================================================
-- CRITICAL RLS CORRECTION — decision_log, weekly_innovation_summary
-- Supabase project: jbhfdmujqrtqkhacfegl (shared KOS / TVGSUOS project)
-- Prepared 2026-10-29 · NOT EXECUTED by the agent · founder runs it in the
-- Supabase SQL Editor after independent review. Runbook:
-- docs/security/RUNBOOK_2026-10-29_CRITICAL_RLS.md
--
-- Why: both tables carry a {public} USING (true) policy, so anyone holding the
-- anon key shipped in the page could read and write them (RLS review,
-- 2026-10-29). The dependency check of 2026-10-29 found no consumer that needs
-- that access; the only browser user is the signed-in founder.
--
-- Scope — exactly these operations, nothing else:
--   A. decision_log: drop "authenticated can manage decision_log".
--      Keeps "founder can read decision_log" (SELECT). Browser writes are refused.
--   B. weekly_innovation_summary: drop "public can manage …" and "public can read …".
--      Keeps "founder can read weekly_innovation_summary" (SELECT).
--      Adds "founder manages weekly_innovation_summary" (ALL, authenticated,
--      USING and WITH CHECK public.is_founder_or_unrestricted()), so the founder
--      editor's select + upsert keeps working.
-- No grant, role, function, other table or other policy is touched.
--
-- Review remediation (2026-10-29, PR #75 review): the preflight also pins the
-- reviewed helper (definition md5, SECURITY DEFINER, search_path=public) and
-- the exact table ACLs; the postflight asserts the ACLs are unchanged and every
-- resulting policy is PERMISSIVE. The four policy statements are unchanged.
--
-- Safety: one transaction. The preflight raises (and nothing changes) unless the
-- live policies are exactly as reviewed. The postflight raises (and the whole
-- transaction rolls back) unless the result is exactly as intended. There is no
-- "restore public access" rollback: if this fails, the tables stay as they were
-- and the failure is investigated; if it succeeds and something breaks, the fix
-- is a founder-scoped policy, never USING (true) again.
-- ============================================================================

begin;

-- ---------------------------------------------------------------------------
-- PREFLIGHT — the live state must match what was reviewed.
-- ---------------------------------------------------------------------------
do $preflight$
declare
  n int;
begin
  -- RLS is on for both tables.
  select count(*) into n from pg_class
   where relnamespace = 'public'::regnamespace
     and relname in ('decision_log', 'weekly_innovation_summary')
     and relrowsecurity;
  if n <> 2 then raise exception 'preflight: RLS is not enabled on both tables (found %)', n; end if;

  -- The helper the new policy uses exists and is exactly the reviewed definition
  -- (read 2026-10-29: SQL, STABLE, SECURITY DEFINER, owner postgres,
  -- search_path=public; definition md5 f938327d85ca3682993d8e42eb0746e5).
  if to_regprocedure('public.is_founder_or_unrestricted()') is null then
    raise exception 'preflight: public.is_founder_or_unrestricted() is missing';
  end if;
  if not exists (select 1 from pg_proc p
                  where p.oid = to_regprocedure('public.is_founder_or_unrestricted()')
                    and p.prosecdef
                    and p.proconfig = array['search_path=public']
                    and p.prorettype = 'boolean'::regtype
                    and md5(pg_get_functiondef(p.oid)) = 'f938327d85ca3682993d8e42eb0746e5') then
    raise exception 'preflight: public.is_founder_or_unrestricted() differs from the reviewed definition';
  end if;

  -- Table grants are exactly the reviewed ACLs; snapshot them for the postflight.
  if exists (select 1 from pg_class
              where relnamespace = 'public'::regnamespace
                and relname in ('decision_log', 'weekly_innovation_summary')
                and relacl::text is distinct from '{postgres=arwdDxtm/postgres,anon=arwdDxtm/postgres,authenticated=arwdDxtm/postgres,service_role=arwdDxtm/postgres}') then
    raise exception 'preflight: table grants on decision_log / weekly_innovation_summary differ from the reviewed ACL';
  end if;
  create temp table rls_acl_before on commit drop as
    select relname, relacl::text as acl from pg_class
     where relnamespace = 'public'::regnamespace and relname in ('decision_log', 'weekly_innovation_summary');

  -- A. decision_log: exactly the two reviewed policies.
  select count(*) into n from pg_policies where schemaname = 'public' and tablename = 'decision_log';
  if n <> 2 then raise exception 'preflight: decision_log has % policies, expected 2', n; end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'decision_log'
                  and policyname = 'authenticated can manage decision_log'
                  and cmd = 'ALL' and roles = '{public}' and qual = 'true') then
    raise exception 'preflight: "authenticated can manage decision_log" is not the reviewed {public} ALL USING (true) policy';
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'decision_log'
                  and policyname = 'founder can read decision_log' and permissive = 'PERMISSIVE'
                  and cmd = 'SELECT' and roles = '{authenticated}' and qual ~ '^(public\.)?is_founder_or_unrestricted\(\)$') then
    raise exception 'preflight: "founder can read decision_log" is missing or changed';
  end if;

  -- B. weekly_innovation_summary: exactly the three reviewed policies.
  select count(*) into n from pg_policies where schemaname = 'public' and tablename = 'weekly_innovation_summary';
  if n <> 3 then raise exception 'preflight: weekly_innovation_summary has % policies, expected 3', n; end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'weekly_innovation_summary'
                  and policyname = 'public can manage weekly_innovation_summary'
                  and cmd = 'ALL' and roles = '{public}' and qual = 'true') then
    raise exception 'preflight: "public can manage weekly_innovation_summary" is not the reviewed {public} ALL USING (true) policy';
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'weekly_innovation_summary'
                  and policyname = 'public can read weekly_innovation_summary'
                  and cmd = 'SELECT' and roles = '{public}' and qual = 'true') then
    raise exception 'preflight: "public can read weekly_innovation_summary" is not the reviewed {public} SELECT USING (true) policy';
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'weekly_innovation_summary'
                  and policyname = 'founder can read weekly_innovation_summary' and permissive = 'PERMISSIVE'
                  and cmd = 'SELECT' and roles = '{authenticated}' and qual ~ '^(public\.)?is_founder_or_unrestricted\(\)$') then
    raise exception 'preflight: "founder can read weekly_innovation_summary" is missing or changed';
  end if;
end
$preflight$;

-- ---------------------------------------------------------------------------
-- A. decision_log
-- ---------------------------------------------------------------------------
drop policy "authenticated can manage decision_log" on public.decision_log;

-- ---------------------------------------------------------------------------
-- B. weekly_innovation_summary
-- ---------------------------------------------------------------------------
drop policy "public can manage weekly_innovation_summary" on public.weekly_innovation_summary;
drop policy "public can read weekly_innovation_summary" on public.weekly_innovation_summary;
create policy "founder manages weekly_innovation_summary" on public.weekly_innovation_summary
  for all to authenticated
  using (public.is_founder_or_unrestricted())
  with check (public.is_founder_or_unrestricted());

-- ---------------------------------------------------------------------------
-- POSTFLIGHT — the result must be exactly as intended, or everything rolls back.
-- ---------------------------------------------------------------------------
do $postflight$
declare
  n int;
begin
  -- No open policy and no {public}/anon policy remains on either table.
  select count(*) into n from pg_policies
   where schemaname = 'public' and tablename in ('decision_log', 'weekly_innovation_summary')
     and (qual = 'true' or with_check = 'true' or 'public' = any(roles) or 'anon' = any(roles));
  if n <> 0 then raise exception 'postflight: % open or public policies remain', n; end if;

  -- A. decision_log: only the founder SELECT policy.
  select count(*) into n from pg_policies where schemaname = 'public' and tablename = 'decision_log';
  if n <> 1 then raise exception 'postflight: decision_log has % policies, expected 1', n; end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'decision_log'
                  and policyname = 'founder can read decision_log' and cmd = 'SELECT'
                  and roles = '{authenticated}' and qual ~ '^(public\.)?is_founder_or_unrestricted\(\)$') then
    raise exception 'postflight: decision_log founder SELECT policy not as expected';
  end if;

  -- B. weekly_innovation_summary: founder SELECT + founder ALL, both scoped.
  select count(*) into n from pg_policies where schemaname = 'public' and tablename = 'weekly_innovation_summary';
  if n <> 2 then raise exception 'postflight: weekly_innovation_summary has % policies, expected 2', n; end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'weekly_innovation_summary'
                  and policyname = 'founder can read weekly_innovation_summary' and cmd = 'SELECT'
                  and roles = '{authenticated}' and qual ~ '^(public\.)?is_founder_or_unrestricted\(\)$') then
    raise exception 'postflight: weekly_innovation_summary founder SELECT policy not as expected';
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'weekly_innovation_summary'
                  and policyname = 'founder manages weekly_innovation_summary' and cmd = 'ALL'
                  and roles = '{authenticated}' and qual ~ '^(public\.)?is_founder_or_unrestricted\(\)$'
                  and with_check ~ '^(public\.)?is_founder_or_unrestricted\(\)$') then
    raise exception 'postflight: weekly_innovation_summary founder ALL policy not as expected';
  end if;

  -- Every remaining policy on both tables is PERMISSIVE (no RESTRICTIVE policy appeared).
  select count(*) into n from pg_policies
   where schemaname = 'public' and tablename in ('decision_log', 'weekly_innovation_summary')
     and permissive is distinct from 'PERMISSIVE';
  if n <> 0 then raise exception 'postflight: % non-PERMISSIVE policies', n; end if;

  -- Table grants are unchanged.
  select count(*) into n from pg_class c join rls_acl_before b on b.relname = c.relname
   where c.relnamespace = 'public'::regnamespace and c.relacl::text = b.acl;
  if n <> 2 then raise exception 'postflight: table grants changed on % of 2 tables', 2 - n; end if;

  -- RLS still on.
  select count(*) into n from pg_class
   where relnamespace = 'public'::regnamespace
     and relname in ('decision_log', 'weekly_innovation_summary')
     and relrowsecurity;
  if n <> 2 then raise exception 'postflight: RLS not enabled on both tables'; end if;
end
$postflight$;

commit;
