# Founder OS Phase 0 — Read-Only Architecture & API-Security Audit

**Date of inspection:** 2026-10-28 (UTC) · **Repository:** `hdashadm-afk/TVGSUOS`
**Recorded on:** PR #74 branch `claude/founder-os-amendment` (docs only)
**Status of this document:** point-in-time evidence record. It is not an approval, not a
security sign-off, and not a production verification.

> **Source documents not received.** The founder's prompts of 2026-10-28 referred to two
> attachments — "Founder OS Master Direction.md" and "HMC Founder OS Architecture.md".
> Neither reached the executing session (not in the message, not on disk). Their contents
> were **not** applied to `docs/MASTER_DIRECTION.md` and `docs/FOUNDER_OS_TARGET_ARCHITECTURE.md`
> was **not** created. Where this audit cites "founder direction", it means the direction
> written into the prompt text itself (§6), not the attachments.

---

## 1. Scope and evidence inspected

| Evidence | Ref | How |
|---|---|---|
| `main` | `1f75dcb` (2026-08-22) | shallow clone, depth 50 |
| `api/` — all 7 routes | `main` | source read |
| `index.html` | `main` | grep only: API calls, table names, browser key role, auth calls |
| `vercel.json`, `.env.example`, `README.md` | `main` | read |
| `docs/MASTER_DIRECTION.md`, `FOUNDER_OS.md` | `main` and PR #74 branch | read (structure + relevant sections) |
| PR #73 branch `claude/secure-api-routes` | `0cac843` | diff vs `main`; `api/_founder-auth.js`; `tests/route-auth.test.js` |
| PR #74 branch `claude/founder-os-amendment` | `2368d5b` | diff vs `main` |
| PR list | GitHub API | numbers, state, branch, title |

**Not inspected — see §10:** database tables, RLS policies and functions (no SQL was run);
the Vercel project `tvgsuosweb` and any deployment; production HTTP behaviour; Notion and
Google Drive content; git history older than the 50 most recent commits; the approved UI
baseline `a79c240` (not present in the inspected history).

## 2. Application map (code-confirmed on `main`)

| Part | Finding |
|---|---|
| Framework | None. `vercel.json`: `framework: null`, `buildCommand: null`, `outputDirectory: "."` — static files plus Vercel Node functions in `api/`. |
| Entry points | `index.html` (single-file app), `delivery-mvp.html` (not analysed). |
| Browser data client | Supabase JS with the project URL and an **anon** key at `index.html:3283–3284`. Decoded role: `anon`. Login: `auth.signInWithPassword` (`:3678`), `onAuthStateChange` (`:6479`), `getSession` (`:6491`). |
| Server functions | 7 routes in `api/` (§3). All read credentials from server environment variables. |
| Deployment config | Repo only: `vercel.json` above. `FOUNDER_OS.md` *states* the Vercel project is `tvgsuosweb`, auto-deploying from `main` — documentation, **not verified here**. |
| Implemented vs documented | Implemented: the page, the 7 routes, browser reads/writes to 18 tables (§4). Documented only: the target architecture, scheduler, imported reporting model, domain `os.hmcmarketing.tech`. |

## 3. API and authorization inventory (`main` @ `1f75dcb`)

No route on `main` checks who is calling: no bearer-token verification, no role check, no
`PUBLIC_ROUTE` marker. Each route holds server-side credentials and answers any caller that
reaches it. **This is a source-code finding.** Whether the deployed `tvgsuosweb` serves these
routes this way today was **not verified**.

| Route | Methods | Intended caller (per code comments/UI) | Caller check | Credentials / data reached | Input validation | Tests on `main` |
|---|---|---|---|---|---|---|
| `api/security-check.js` | GET, POST | Founder UI (`index.html`, 2 call sites) | none | `SUPABASE_MANAGEMENT_TOKEN` → Supabase Management API advisors (security + performance) for the shared project; returns the findings list | none needed | none |
| `api/ask-ver.js` | POST | Founder UI "Ask Ver" | none | `ANTHROPIC_API_KEY`; `SUPABASE_SERVICE_ROLE_KEY` → **reads** `decisions`, `improvement_signals`; **writes** `founder_tasks`, `ver_queries`; optional `GITHUB_TOKEN` | request body used in model prompt | none |
| `api/odo-status.js` | GET, POST | Founder UI venture panel (2 call sites) | none | `ODO_SUPABASE_SERVICE_ROLE_KEY` → **live cross-project, full-rights read** of ODO's separate project: `vera_signals`, `health_snapshots`, `listings`, `transactions` (`total_php`, `escrow_state`), `waitlist_signups` | none | none |
| `api/send-pos-checklist.js` | POST | Founder UI | none | `RESEND_API_KEY` → sends email; recipient `to: [email]` taken from `req.body.email` | `email` must be a non-empty string; recipient is otherwise unrestricted | none |
| `api/founder-os-notion.js` | GET | Founder UI (`index.html:4793`) | none | `NOTION_API_KEY` → Notion data-source queries; returns Notion Founder OS records | query params | none |
| `api/generate-baseline-status.js` | GET, POST | Founder UI | none | optional `GITHUB_TOKEN`; `SUPABASE_SERVICE_ROLE_KEY` → counts pending `ver_queries` | none | none |
| `api/generate-repo-tree.js` | GET, POST | Founder UI | none | optional `GITHUB_TOKEN` → lists owner's repos | none | none |

Browser/server boundary: the full-rights database credentials are server-side only (env vars);
none was found in `index.html`. The anon key in the page is expected to be public and is
**not** a service-role exposure.

## 4. Schema, RLS and data map

**No schema files exist in this repo** (no `supabase/`, `migrations/`, `*.sql`). TVGSUOS uses
the **shared** Supabase project with `katiwala-owner-os-` (`.env.example`; ref `jbhf…`).

Tables the browser reaches with the signed-in user's anon-key session (`index.html`, by count of `.from('…')`):
`improvement_signals` 14 · `projects` 13 · `founder_tasks` 13 · `decisions` 8 · `daily_baseline_checks` 5 ·
`compliance_items` 3 · `accepted_suggestions` 3 · `weekly_updates` 2 · `weekly_innovation_summary` 2 ·
`waitlist_leads` 2 · `ver_queries` 1 · `project_status` 1 · `odo_leads_snapshots` 1 · `leads_hotel` 1 ·
`leads_gas_station` 1 · `leads_coffeeshop` 1 · `decision_log` 1 · `app_users` 1.

Browser **writes**: `founder_tasks` (insert ×3, update, delete ×3), `improvement_signals` (insert ×2),
`decisions` (insert), `accepted_suggestions` (insert, update), `daily_baseline_checks` (upsert),
`weekly_innovation_summary` (upsert), `weekly_updates` (upsert).

**RLS evidence: none collected.** No policy was read and no SQL was run. The only RLS
statements available are documentary and unverified:
- `FOUNDER_OS.md` (2026-07-18 entry) states `projects`/`decisions` have "RLS open to any authenticated user".
- The KOS/Fuel-ops repo instructions record (dated 2026-08-25) tables with `USING (true)` policies on a *different* project (Fuel-ops). That is not evidence about this project.
- A Supabase advisor read on 2026-10-05 for the shared project listed 15 `SECURITY DEFINER`
  functions executable by `anon`, including `grant_user_access` and `set_user_departments`.
  **Historical — not rechecked for this audit.**

An open `USING (true)` policy would not count as adequate RLS. Whether any of the tables above
has one is **unknown** until the policies are read.

## 5. Prioritised findings

Severity reflects what the code on `main` permits. "Reproduction" is the source evidence;
**no request was sent to any deployment.**

| # | Severity | Finding | Reproduction evidence (source) | Required remediation |
|---|---|---|---|---|
| F1 | Critical | `security-check` returns the shared database's security/performance advisor findings to any caller | `api/security-check.js`: handler reads `SUPABASE_MANAGEMENT_TOKEN`, fetches advisors, `res.status(200).json({ findings, … })`; no caller check | Founder-only, fail-closed; consider whether this needs to be an HTTP route at all |
| F2 | Critical | `ask-ver` lets any caller spend Anthropic credit, read `decisions`/`improvement_signals` and **write** `founder_tasks`/`ver_queries` with full database rights | `api/ask-ver.js:67–195`: POST handler, service-role headers, inserts at `:183`, `:195`; no caller check | Founder-only; least-privilege writes; rate limit |
| F3 | Critical | `odo-status` performs a **live, full-rights, cross-project** read of ODO's database (incl. transaction totals) and returns aggregates to any caller | `api/odo-status.js:29–47` | **Disable or replace** with the approved manual/imported reporting model. A founder check alone does **not** meet the direction (§6). |
| F4 | High | `send-pos-checklist` sends email from the configured sender to any address the caller supplies | `api/send-pos-checklist.js`: `to: [email]` from `req.body` | Founder-only **and** recipient restricted (allow-list or server-side lookup) |
| F5 | High | `founder-os-notion` returns Notion Founder OS data to any caller and is an active Notion dependency | `api/founder-os-notion.js`; called at `index.html:4793` | Founder-only now; retire under the Notion legacy plan (§9) in a separate approved batch |
| F6 | Medium | `generate-baseline-status` / `generate-repo-tree` act with the GitHub token and service-role key for any caller | route sources above | Founder-only |
| F7 | Medium | No automated tests for any route on `main` | no test directory on `main` | Tests per §12 |
| F8 | Unknown | RLS on the 18 browser-reached tables | not inspected | Read policies; reject `USING (true)` |
| F9 | Historical (2026-10-05) | 15 anon-executable `SECURITY DEFINER` functions on the shared project | advisor read 2026-10-05, not rechecked | Re-run advisors; revoke `EXECUTE` from `anon` where unintended |

## 6. Current state vs target state

Target state as written in the founder's prompt of 2026-10-28 (attachments not received):

| Target (prompt) | Current (code on `main`) | Gap |
|---|---|---|
| TVGSUOS is the single Founder OS; HMC is the holding company | TVGSUOS exists; MASTER on `main` is titled "TVGSUOS — Master Direction" | MASTER replacement pending attachment |
| Five nodes: Helium Fuels, Dipstify, ODO Vehicles, DinkKada, ODO Property (parked) | PR #74 §A lists the five; `main` §0 lists Verifos 1A, Dipstify, ODO-V, ODO-P | Verifos classification open (§8 C1) |
| Reporting manual/imported; **no live cross-project service-role aggregation** | `api/odo-status.js` does exactly that | F3 |
| Notion/Drive retired from active operations | `api/founder-os-notion.js` live in code; PRs #70–#72 (2026-08-04) wired Notion in | §9 |
| System owns durable memory; scheduled V-Loops run without agent prompting | No scheduler in code; no schedule/run/evidence tables found in repo | Not started; out of scope for Phase 0/1 |
| Advertising measured as a continuous V-Loop with source, window, attribution, freshness | No advertising measurement structures in repo | Not started |
| All API routes secured before `os.hmcmarketing.tech` is connected (`FOUNDER_OS.md` on PR #74) | None secured on `main`; PR #73 open | Phase 1 |
| UI baseline `a79c240` | Commit not in inspected history; `FOUNDER_OS.md` on PR #74: "source not located" | Unknown (§10) |

## 7. Existing-schema reuse map (by name and code usage only — columns/policies not verified)

| Founder OS need | Existing structure seen in code | Reuse status |
|---|---|---|
| Portfolio nodes | `projects` (13 refs), `project_status` | Candidate; needs node list reconciled to the five |
| Decisions | `decisions`, `decision_log` | Candidate |
| Learning / signals | `improvement_signals`, `weekly_innovation_summary`, `accepted_suggestions` | Candidate |
| Work queue | `founder_tasks`, `ver_queries` | Candidate; currently written by an unauthenticated route (F2) |
| Executive status / freshness | `daily_baseline_checks`, `weekly_updates` | Candidate |
| Compliance / guardrails | `compliance_items` | Candidate |
| Leads (venture detail) | `waitlist_leads`, `leads_*`, `odo_leads_snapshots` | Venture-operational data; ownership vs Founder OS to be decided |
| Identity / role | `app_users` (used by PR #73 for `role = 'founder'`) | Candidate |
| Schedules, runs, evidence references, audit records, advertising measurements | none found | New design needed in a later approved batch |

## 8. Contradiction register (unresolved — no winner selected)

| ID | Contradiction | Sources | Needs |
|---|---|---|---|
| C1 | **Verifos.** `main` MASTER §0 classifies Verifos as Phase 1A and live (verifos.co). The five-node Founder OS presentation does not include it. PR #74 §A flags the same question. Operational status (live product, per MASTER) is distinct from Founder OS presentation membership. | `main` `docs/MASTER_DIRECTION.md` §0; PR #74 §A | Founder decision |
| C2 | **Node wording.** Prompt: Dipstify "operations and P&L discipline", DinkKada "membership, participation, and retention learning". PR #74 §A: Dipstify "station operating system", DinkKada "white-label Club OS for PH pickleball clubs". | prompt; PR #74 §A | Founder decision |
| C3 | **Notion.** PRs #70–#72 (merged 2026-08-04) made Notion the Founder OS data source; the new direction retires Notion. | merged PRs; `api/founder-os-notion.js`; prompt | Approved retirement batch |
| C4 | **Live ODO read.** `api/odo-status.js` (and PR #73's version of it) does a live full-rights cross-project read; the direction forbids it. | code; prompt | Phase 1 |
| C5 | **Requested files absent.** `ARCHITECTURE_OVERALL.md`, STATUS and QUEUE documents do not exist in TVGSUOS. Not created, not invented. | repo listing | Founder: confirm intended location (may live in another repo) |
| C6 | **MASTER source.** The founder instructed MASTER to be replaced with an attachment that was not received. PR #74 currently carries §A written 28 Oct by an earlier session. | this session | Re-send attachments |

## 9. Legacy Notion / Google Drive register

No Notion or Google Drive content was accessed. Code and repo-document references only:

| Item | Type | Disposition (proposed, not executed) |
|---|---|---|
| `api/founder-os-notion.js` (`NOTION_API_KEY`) | **Active code dependency** | Founder-only now (Phase 1); retire after Notion content is exported/migrated |
| `index.html:4784–4998` Notion-backed Critical Alerts / Open Decisions / venture filter | Active UI dependency | Replace with Founder OS tables in a later approved batch |
| PRs #70, #71, #72 (2026-08-04) | History | Preserve as history |
| References in `FOUNDER_OS.md`, `api/ask-ver.js`, and docs `DIPSTIFY_SR_MERGE_READY_PLAN`, `GRADUAL_PLAN_AFTER_PHASE_A`, `PRIVACY_ODO_VS_DIPSTIFY`, `STATION_RISK_REGISTRY`, `NPC_APPLICATION_PACK`, `ORG_CHART`, `PRIVACY_LAUNCH_GATES`, `npc/PRIVACY_ODO_HMC_2026-08-13`, `HMC_CTO_Unified_System_Prompt_v1.1`, `VER_BEHAVIOR`, `DIPSTIFY_QUIZ_THIN_MVP`, `ECOSYSTEM_REPO_TREE` | Mentions of Notion and/or Google Drive | Review each for active-authority or backup assumptions; mark legacy; do not delete |
| Notion workspace content; Google Drive content | Unknown — not accessed | Inventory, export and migration plan needed; no new records there |

## 10. Unknowns and inaccessible evidence

1. RLS policies, functions and grants on every table in §4 — not read; no SQL run.
2. Whether `tvgsuosweb` currently deploys `main`, and with which environment variables set — Vercel not inspected.
3. Production reachability of any route — no request sent.
4. The 2026-10-05 advisor findings (F9) — not rechecked.
5. Secrets in git history older than the last 50 commits — not scanned. The repo is **public**.
6. UI baseline `a79c240` — not found in inspected history.
7. Contents of the two source attachments — not received.
8. `delivery-mvp.html` — not analysed.

## 11. Phase 1 review plan

**PR #73 (`claude/secure-api-routes`) is the existing Phase 1 security implementation
candidate — open, unmerged, and not yet accepted or production-verified.** It is not
duplicated or modified by this PR.

What PR #73 does (branch evidence): adds `api/_founder-auth.js` (verify bearer token with
Supabase Auth → read `app_users.role` with the service-role key → only `founder` proceeds;
errors and a missing key deny); adds the check as the first statement of all 7 routes; adds
`tests/route-auth.test.js` (236 lines); sets `vercel.json` `buildCommand` to run those tests.

What PR #73 does **not** do (branch evidence):
- `api/odo-status.js` still performs the live full-rights ODO read — now founder-only. **That
  does not satisfy the direction.** Phase 1 must disable it or replace it with the
  manual/imported reporting model.
- `api/send-pos-checklist.js` still sends to any recipient the (now founder) caller supplies.
- No repository CI (`.github/` absent); tests run only in the Vercel build step.

## 12. Required authorization tests (Phase 1)

For **every** route:
1. **Allow:** signed-in founder (`app_users.role = 'founder'`) gets the expected response.
2. **Deny:** no credentials → 401, no upstream call. *(present in #73)*
3. **Deny:** invalid token → 401. *(present)*
4. **Deny:** **expired** token → 401. *(not explicitly present — add)*
5. **Deny:** signed-in non-founder → 403. *(present)*
6. **Deny:** auth user with no `app_users` row → 403. *(present)*
7. **Deny:** valid token from a **different Supabase project** → 401. *(not explicitly present — add)*
8. **Fail closed:** auth service error/outage → deny. *(present)*
9. **Fail closed:** missing server key → deny. *(present)*

Route-specific:
10. `send-pos-checklist`: a recipient outside the allow-list is refused even for the founder.
11. `odo-status`: no request reaches ODO's project; the route serves imported/manual data or is removed.
12. `security-check` and other privileged routes: explicit decision recorded (keep founder-only, or remove the HTTP route).
13. `ask-ver`: writes to `founder_tasks` / `ver_queries` limited to the minimum columns and rows; reads of `decisions` / `improvement_signals` limited to what the answer needs.
14. No service-role credential appears in any browser-delivered file.

## 13. Required Phase 1 completion evidence

1. PR link and diff showing the changes above.
2. Test output showing every test in §12 passing (CI or build log), with test names visible.
3. Evidence that `odo-status` no longer reads ODO's project (code + test).
4. Recipient restriction proven by test (§12.10).
5. Grep evidence: no service-role key in `index.html` or any static file.
6. **After the founder merges and releases** (separate step): an anonymous request to each
   route on the live deployment returns 401, recorded with timestamp. Until then, production
   is **unverified**.
7. A re-read of the shared project's advisors (F9) and RLS policies for the §4 tables.

---

*No application code, dependency, schema, SQL, migration, deployment, environment, production
integration, or domain change was made in producing this document.*
