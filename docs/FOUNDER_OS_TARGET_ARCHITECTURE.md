# HMC Founder OS — Target Architecture

Last updated: 2026-10-29 · Owner: Edgardo Castro
**Source:** authored from the founder's self-contained written direction of 2026-10-29 (PR #74).
Governing direction: [`docs/MASTER_DIRECTION.md`](MASTER_DIRECTION.md).

## 1. Evidence status

**This is a target architecture. It is not an as-built description and not a production report.**

- Current state is recorded only in [`docs/audits/FOUNDER_OS_PHASE0_AUDIT_2026-10-28.md`](audits/FOUNDER_OS_PHASE0_AUDIT_2026-10-28.md).
- Nothing below is implemented unless a later PR, its test evidence, and — for production claims — production verification say so.
- Object names in §4 are **logical**. They are **not** approved table names, column lists, or migrations.

## 2. System context

```
                         ┌──────────────────────────── HMC (legal holding company) ───────────────────────────┐
                         │                                                                                      │
  Founder ──(sign-in)──► │  TVGSUOS — Founder OS  (Vercel: tvgsuosweb · intended domain os.hmcmarketing.tech,  │
                         │                         NOT connected)                                               │
                         │                                                                                      │
                         │   Browser UI ──► Secured API routes (caller-verified, founder-authorized)            │
                         │                        │                                                             │
                         │                        ▼                                                             │
                         │   Founder OS store: reports · evidence refs · decisions · learning · direction ·      │
                         │                     schedules · runs · work items · audit events  (RLS-scoped)        │
                         │                        ▲                                                             │
                         │                        │  manual / imported reports (validated, timestamped)         │
                         └────────────────────────┼─────────────────────────────────────────────────────────────┘
                                                  │
      ┌─────────────────┬─────────────────┬───────┴─────────┬──────────────────┬──────────────────────┐
      │ Helium Fuels OS │ Dipstify OS     │ ODO Vehicles OS │ DinkKada OS      │ ODO Property (PARKED)│
      │ (infra/energy)  │ (ops + P&L)     │ (flywheel)      │ (membership)     │ no activation        │
      └─────────────────┴─────────────────┴─────────────────┴──────────────────┴──────────────────────┘
        Each venture OS keeps its own operational records. No live cross-project service-role read.

  Supporting actors (outside the system of record):
    Claude / Cursor ── PRs only ──► repository          Grok ── independent review (read)
    Kimi Design / Swarm ── assets, read-only research    Kimi Claw / Ver ── optional notify / present (no trigger role)
```

Verifos is **not drawn** as a node: its presentation membership is an open founder decision (§14).

## 3. Responsibility boundaries and system of record

| Data / responsibility | System of record | Founder OS holds | Never |
|---|---|---|---|
| Operational records (shift logs, dips, listings, deals, payments, IDs, messages) | Each **venture OS** | Evidence **references** only | Copied wholesale into Founder OS |
| Executive reports | **Founder OS** | Full report + source + timestamp + freshness | Pulled live with service-role from venture projects |
| Decisions, learning, direction history, guardrails | **Founder OS** | Full record | Held only in chat, agent memory, Notion, Drive |
| Schedules, scheduled runs, work items | **Founder OS** | Full record + run evidence | Triggered by an agent prompt |
| Campaign-level advertising detail | Venture OS | Executive measurements + evidence refs | Invented when missing |
| Audit events | **Founder OS** | Append-only | Edited or deleted silently |
| Legacy Notion / Google Drive content | Legacy (read-only) | Preservation / migration register | New authoritative records |
| Product rules per venture | Venture's own MASTER / law files | Links | Overridden by Founder OS |

## 4. Conceptual objects (logical — not tables, not migrations)

| Object | Purpose | Key attributes (logical) |
|---|---|---|
| **PortfolioNode** | One of the five nodes | name · role · status (active / early / parked) · owner |
| **ExecutiveReport** | One venture's report for a period | node · period · the 12 contract fields (MASTER §8) · state per field (value / unknown / stale / not applicable / not supplied) |
| **EvidenceReference** | Pointer to proof held elsewhere | system · locator · captured_at · verification status |
| **Decision** | A founder decision | question · options · decision · decided_by · decided_at · evidence refs |
| **Learning** | Distilled lesson (not raw data) | statement · node(s) · confidence · source cycle · evidence refs |
| **DirectionUpdate** | A change to standing direction | prior · new · reason · approved_by · effective_from |
| **ImprovementCycle** | One V-Loop pass for a node/department | node · department · objective · baseline · target · window · version · assessment · hypothesis · next action |
| **Measurement** | One observed value | metric · value or missing-state · source · timezone · attribution method/window · timestamp · freshness |
| **Schedule** | A recurring due cycle | owner · cadence · timezone · next run · inputs · evidence requirements · automated steps · approval boundaries · failure behaviour |
| **ScheduledRun** | One execution of a Schedule | schedule · started/finished · state (due / running / succeeded / stale / blocked / failed) · run evidence |
| **WorkItem** | A task created for a human | type (review / apply / supply input) · assignee · due · linked cycle/run |
| **AuditEvent** | Append-only record of a change | actor · action · object · before/after reference · timestamp |

Existing tables that may later serve some of these are listed in the Phase 0 audit §7. Reuse is a
Phase 2 decision with founder-confirmed migrations.

## 5. Initial reporting flow (manual / imported)

```
Venture owner / executor prepares report (venture OS export or form)
  → POST to Founder OS API
      1. Authenticate: verify bearer token with Supabase Auth (expired / wrong-project → deny)
      2. Authorize: caller role and node scope (founder, or the venture's reporter for its own node only)
      3. Validate: contract fields present or explicitly marked unknown / stale / not applicable / not supplied
      4. Persist under RLS (no USING (true); scoped by node and role)
      5. Stamp: source · source timestamp · received_at · freshness window · verification status = "imported"
      6. Write AuditEvent
  → Founder OS shows the report with its freshness. "Imported" is never displayed as "live".
Any auth or validation error → deny / reject; nothing is partially written.
```

## 6. V-Loop write-back

```
Direction ──► Action (WorkItem, approved) ──► Signal (Measurements + EvidenceReferences)
     ▲                                                   │
     │                                                   ▼
Updated Direction (DirectionUpdate, founder-approved) ◄── Review (ImprovementCycle.assessment)
                                                         │
                                                         └─► Learning (distilled, de-identified where required)
```

- **Raw evidence** stays in the venture OS; Founder OS stores **references** to it.
- **Distilled learning** is a separate object with its own evidence links and confidence.
- No Updated Direction takes effect without founder approval (approval is not execution).

## 7. Departmental and advertising improvement cycle

```
Measure ──► Assess effectiveness ──► Enhance ──► Apply ──► Measure again
(Signal)    (Review)                 (proposed     (approved
                                      Updated       Action)
                                      Direction)
```

Applies to all nine departments (MASTER §5). For advertising, each ImprovementCycle carries the
fields in MASTER §6. Rules enforced by design:
- missing measures are stored as missing, never estimated;
- attributed revenue, collected cash, leads and qualified leads are separate measurements;
- cross-venture transfer creates a **hypothesis** in the target node's cycle, not a result;
- ODO Property cycles may be drafted but cannot move to Apply while the node is parked;
- no cycle step spends, launches or scales anything.

## 8. Scheduler behaviour

| Step | Behaviour | On missing / failed input |
|---|---|---|
| 1 Start due run | Schedule reaches next run → ScheduledRun created | — |
| 2 Collect / ingest | Read stored imports and permitted native sources | Run → **blocked** (input absent) or **stale** (input older than freshness window) |
| 3 Calculate | Only authorized native metrics | Metric marked missing |
| 4 Freshness check | Compare source timestamps to window | **stale** |
| 5 Assess | Rule-based or reviewer assessment | Not produced → run not marked succeeded |
| 6 Propose enhancement | Draft hypothesis for review | — |
| 7 Create next task | WorkItem for review/application (and for manual input if reporting is manual) | Always created |
| 8 Notify | Configured channels (Kimi Claw / Ver optional) | Notification failure logged; run continues |
| 9 Write run evidence | Inputs, outputs, states, timings | — |
| 10 Schedule next run | From cadence + timezone | — |

**Never** synthesizes a successful measurement or assessment. **Controlled actions are excluded**:
spending, campaign launch, budget increase, deployment, migration, deletion and domain connection
are never scheduler steps; each needs separate explicit authority, scope, limits and evidence.

## 9. Agent integration boundaries

| Agent | May | May not |
|---|---|---|
| Claude / Cursor | Open/update PRs; write specs, code, tests | Merge; deploy; run migrations; hold credentials beyond the batch |
| Grok | Read repository and evidence; publish reviews | Write to Founder OS records |
| Kimi Design | Produce assets | Act as a record |
| Kimi Swarm | Read-only research | Write records |
| Kimi Claw | Receive notifications, draft briefings; later secured read access | Trigger runs; hold service-role credentials |
| Ver | Present stored data | Own data; trigger runs; be the source of truth |

One executor per implementation batch.

## 10. Security requirements

- **API:** every route verifies the caller (bearer token via Supabase Auth) and authorizes by role and node scope; fails closed on any error; has positive and negative tests (Phase 0 audit §12).
- **Browser:** only the anon key; never a service-role, management, Anthropic, Notion, GitHub or Resend credential.
- **Server:** privileged credentials used only after authorization, with least privilege per route.
- **RLS:** every Founder OS table scoped by role and node; `USING (true)` is not acceptable.
- **Cross-project:** no live service-role read of any venture project in the initial implementation.
- **Email / outbound:** recipients restricted; no caller-chosen destinations.
- **Secrets:** never printed in chat, logs, docs or PRs.

## 11. UI-to-system mapping

| UI area (baseline `a79c240`, not yet located) | Reads | Writes |
|---|---|---|
| Five-node dashboard | PortfolioNode · latest ExecutiveReport · freshness | — |
| Reports | ExecutiveReport · EvidenceReference | Imports (Phase 2) |
| Decisions | Decision · DirectionUpdate | Decision (founder) |
| V-Loop | ImprovementCycle · Measurement · Learning | Assessment · approvals |
| Schedules | Schedule · ScheduledRun · WorkItem | Schedule config (founder) |
| Ver (optional) | Same stored objects, read-only | none |

## 12. Deployment and domain gates

1. Phase 1 complete: all routes caller-verified and tested; prohibited live reads removed; RLS reviewed.
2. Founder merges and releases; production evidence recorded (anonymous requests denied).
3. Only then: `os.hmcmarketing.tech` connected to `tvgsuosweb`. `theverifiedgroup.org` is not substituted.

## 13. Not in scope of this document

Table DDL, migrations, environment variables, deployment steps, campaign execution, scheduler code.

## 14. Known open issues

| Issue | Status |
|---|---|
| **Verifos** presentation membership vs five nodes | Open founder decision (MASTER §3) |
| **Dipstify canonical MASTER** — `katiwala-owner-os-` holds four master-direction documents that each claim authority (`MASTER_DIRECTION.md`, `KATIWALA_GAS_STATION_MASTER_DIRECTION.md`, `VERIFIED_GROUP_MASTER_DIRECTION.md`, `MASTER_DIRECTION_FAST_REFERENCE.md`) | Open founder decision |
| **Privacy policy** — none canonical | Governance blocker (MASTER §10) |
| **ODO Property** | Parked; no activation |
| **STATUS / QUEUE evidence** — not present in TVGSUOS | Missing; location to be confirmed |
| UI baseline `a79c240` | Not located in the repository |
| PR #73 | Open Phase 1 candidate; does not yet remove the live ODO read |

## 15. Architecture acceptance tests

| # | Test | Pass condition |
|---|---|---|
| A1 | Anonymous request to every API route | Denied; no upstream call |
| A2 | Expired token; token from another Supabase project | Denied |
| A3 | Signed-in non-founder on a founder route | Denied |
| A4 | Auth service unavailable | Denied (fail closed) |
| A5 | Browser bundle scan | No service-role or other privileged credential |
| A6 | Any API path to a venture project | No live service-role read exists |
| A7 | Import a report with a field missing | Stored as "not supplied", not defaulted |
| A8 | Import a report older than its freshness window | Displayed as **stale**, not current |
| A9 | ODO Vehicles and ODO Property metrics | Never combined in any calculation or view |
| A10 | **Scheduled departmental cycle with no agent prompt** | At its due time the run starts, ingests what exists, writes run evidence, creates the next WorkItem, schedules the next run — with no message to Claude, Cursor, Grok, Kimi Claw or Ver |
| A11 | Scheduled run with an input missing | Run ends **blocked** or **stale**; no success recorded; WorkItem created for the input |
| A12 | Scheduler and controlled actions | No path from a scheduled run to spend, launch, budget change, deploy, migration, deletion or domain change |
| A13 | ODO Property cycle | Cannot reach Apply while parked |
| A14 | Fresh-agent cold start | A new agent reaches the correct current state from the repository alone |
