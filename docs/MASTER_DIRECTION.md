# HMC Founder OS — Master Direction

Last updated: 2026-10-29
Status: Active — current founder direction for TVGSUOS
Owner: Edgardo Castro

**Source:** authored from the founder's self-contained written direction of 2026-10-29 (PR #74).
**Supersedes:** the previous MASTER text, kept at
[`docs/history/MASTER_DIRECTION_superseded_2026-10-28.md`](history/MASTER_DIRECTION_superseded_2026-10-28.md).
**Provenance (exact):** that file preserves `docs/MASTER_DIRECTION.md` as it stood on **this PR's
branch at commit `0eb9a4f`**, not as it stands on `main`. Compared with `main`'s MASTER (`1f75dcb`,
§0–§10), `git diff` shows **107 inserted lines** in the history file: an 8-line history header,
plus 99 lines from the branch — §A (dated 2026-10-28) and 2 rewritten preamble lines that replace
`main`'s "Last updated: 2026-08-22" line and its §0 note. **§A never reached `main`.** Below the
header, the file matches `0eb9a4f` byte for byte.
Where the two conflict, this document wins. Where this document is silent, the history file is
reference only.

**Companion documents**
- Target architecture: [`docs/FOUNDER_OS_TARGET_ARCHITECTURE.md`](FOUNDER_OS_TARGET_ARCHITECTURE.md) — target state, not as-built.
- Current-state evidence: [`docs/audits/FOUNDER_OS_PHASE0_AUDIT_2026-10-28.md`](audits/FOUNDER_OS_PHASE0_AUDIT_2026-10-28.md).

**Scope:** this document governs the Founder OS layer. It does not replace any venture's own
product MASTER; venture product rules (for example the Verifos law files in `docs/VERIFOS_*.md`)
stay in force for that venture's product.

---

## 1. HMC and Founder OS

1. **HMC is the legal holding company.**
2. **TVGSUOS is the single Founder OS application.** No second Founder OS is created, in any repo or tool.
3. Founder OS is the portfolio **command, reporting, learning, governance, scheduling and decision** layer.
4. **Venture operating systems retain operational records** — shift logs, dips, listings, deals, payments, IDs, messages, campaign-level detail.
5. **Founder OS stores** executive reports, evidence references, decisions, learning, guardrails, schedules, direction history, freshness and audit records.
6. **The system owns durable memory; agents do not.**
7. No critical learning may remain only in chat, agent memory, a local machine, or an uncommitted branch. If it is not written to the repository or to Founder OS records, it did not happen.

## 2. Five portfolio nodes

| # | Node | Role in the portfolio | Status |
|---|---|---|---|
| 1 | **Helium Fuels** | Enabling energy and shared-infrastructure layer | active |
| 2 | **Dipstify** | Operations and P&L discipline | active |
| 3 | **ODO Vehicles** | Vehicle operations, demand, and transaction learning | active |
| 4 | **DinkKada** | Membership, participation, and retention learning | early |
| 5 | **ODO Property** | Separate node | **PARKED** |

Rules:
- **ODO Vehicles** retains its operational flywheel: **Sangla → Restore → Buy & Sell → Recovery**, around **Helium Yard**.
- **ODO Vehicles and ODO Property never share performance metrics.** Each is measured on its own evidence.
- **Helium Fuels does not borrow ODO Vehicles economics or operating signals.** Helium reports on its own evidence.
- **Universal separation (every node: Helium Fuels, Dipstify, ODO Vehicles, DinkKada, ODO Property).**
  No metric, cash figure, customer outcome, performance claim, or evidence from one node is
  attributed to another node unless **both** exist: (a) a validated source for the figure, and
  (b) an explicitly recorded relationship between the two nodes (what links them, who recorded it,
  when). Without both, each node's numbers stay on that node. A shared customer, shared
  infrastructure or shared ownership is not by itself a recorded relationship. The two rules above
  are instances of this one.
- **ODO Property stays parked:** it carries no vehicle-derived performance (no ODO Vehicles listings,
  deals, leads or cash shown as Property results). no activation, no advertising, no spend, no invented performance. Future plans may be drafted; nothing is launched or claimed while parked.

## 3. Verifos — open classification decision

The superseded MASTER (§0, 21 Aug 2026) classifies **Verifos** as **Phase 1A, live** (verifos.co,
trust/service layer for stations). Verifos does not appear among the five nodes above.

This is an **unresolved portfolio-classification decision.** Until the founder decides, explicitly
and in writing:
- Verifos is **not** erased, closed, or treated as historical.
- Verifos is **not** added as a sixth UI node.
- Verifos is **not** mapped into Helium Fuels or any other node without evidence and explicit direction.
- **Operational status** (whether Verifos runs as a product — governed by its own law files) is
  kept separate from **Founder OS presentation membership** (whether and where it appears in the
  five-node view). The second is the open question; the first is unchanged.

## 4. Notion and Google Drive — retired

Notion and Google Drive are **retired** from:
- active HMC operations;
- reporting;
- durable memory;
- scheduled backups;
- canonical authority.

Existing content is **legacy-only**, pending preservation, export, or migration. It is not deleted
silently, and no new dual-authority record is created there.

Current Notion routes and dependencies in TVGSUOS (for example `api/founder-os-notion.js`) are
implementation findings for a later approved batch (Phase 0 audit §9). This direction does not
modify them.

## 5. Universal V-Loop

**Canonical loop:** **Direction → Action → Signal → Review → Updated Direction**

**Departmental shorthand:** **Measure → Assess effectiveness → Enhance → Apply → Measure again**

| Shorthand | Canonical step |
|---|---|
| Measure | produces **Signal** |
| Assess effectiveness | is **Review** |
| Enhance | forms the proposed **Updated Direction** |
| Apply | is the next approved **Action** |
| Measure again | starts the next evidence cycle |

The loop applies to **every department in every venture**:
1. marketing and advertising;
2. sales and relationships;
3. operations;
4. finance and P&L;
5. product and engineering;
6. customer service;
7. people and training;
8. compliance and security;
9. founder and executive priorities.

**Raw departmental detail stays in the responsible venture OS.** Founder OS retains executive
evidence, learning, decisions, schedules and updated direction.

## 6. Advertising and growth

Advertising is a **continuous improvement cycle**, not "launch and report clicks." Every cycle preserves:

| Group | Fields |
|---|---|
| Intent | objective · audience · offer · channel |
| Plan | baseline · target · measurement window · review/application cadence |
| Limits | budget cap · prohibited actions |
| Version | campaign · creative · audience · offer · landing page · process version |
| Measures (as available) | spend · impressions · reach · clicks · leads · qualified leads · conversions · attributed revenue · collected cash |
| Provenance | source · timezone · attribution method and window · timestamp · freshness · evidence |
| Review | effectiveness assessment · data limitations |
| Next | enhancement hypothesis · approval · next application · next measurement |

Rules:
- **Never invent a missing measurement.** Missing is recorded as missing.
- **ROAS is not profit.** Platform-attributed revenue is **not** automatically collected cash. A lead is **not** automatically a qualified customer.
- Cross-venture learning transfers as a **testable hypothesis**, not a guaranteed result.
- Assessment **does not** launch campaigns, scale budgets, or spend money. Each needs separate approval.

## 7. Pre-scheduled operation

Where applicable, recurring V-Loops are **pre-scheduled in Founder OS**. Nobody should need to prompt
Claude, Cursor, Grok, Kimi Claw, Ver or any other agent to start a due cycle.

The Founder OS scheduler must:
1. start due runs;
2. collect or ingest available scheduled measurements;
3. calculate authorized native metrics;
4. check freshness;
5. assess effectiveness;
6. prepare enhancement proposals;
7. create the next review/application task;
8. send configured notifications;
9. write run evidence;
10. schedule the next run.

Rules:
- **Kimi Claw and Ver** are optional notification/briefing channels — **not** required triggers or schedulers.
- Missing inputs produce a **due, stale, blocked, or failed** state. A successful measurement or assessment is **never** synthesized.
- Where reporting is still manual, Founder OS still **creates the due task automatically.**
- Every schedule records: owner · cadence · timezone · next run · inputs · evidence requirements · automated steps · approval boundaries · failure behaviour.
- **Scheduling does not independently authorize** spending, campaign launching, budget increases, deployment, migration, deletion, or domain connection.

*Status at 2026-10-29: no scheduler exists in TVGSUOS. This section is direction, not a description of running behaviour.*

## 8. Executive reporting contract

Every venture reports:

| # | Field |
|---|---|
| 1 | What moved |
| 2 | Cash or portfolio impact |
| 3 | Signals |
| 4 | Learning and mistakes |
| 5 | Risks and blockers |
| 6 | Founder decision / action needed |
| 7 | Executor action |
| 8 | Recommended next priority |
| 9 | Evidence references |
| 10 | Source |
| 11 | Source timestamp |
| 12 | Freshness and verification status |

**Unknown, stale, not applicable, and not supplied are four distinct states** and are never collapsed.
Reporting is **manual/imported** initially. **Imported does not mean live.**

## 9. Agent and tool roles

| Actor | Role |
|---|---|
| **Claude** | Architecture, MASTER amendments, implementation specifications, code, tests, PR evidence |
| **Cursor** | Development workspace and coding executor |
| **Grok** | Independent architecture, security, evidence and cold-start review |
| **Kimi Design** | Visual and communication assets |
| **Kimi Swarm** | Parallel read-only research and evidence analysis |
| **Kimi Claw** | Optional notifications, drafts, briefings; later, secured assistant access |
| **Ver** | Optional presentation layer — never the owner or source of truth |
| **Founder** | Direction, approvals, canonical-authority selection, migration confirmation, merge/release, domain connection |
| **TVGSUOS / Founder OS** | Durable system of record |

- **One executor owns an implementation batch at a time.**
- **Executors open and update PRs and never merge them.** The founder releases.
- No credentials are supplied to Kimi Claw, Ver or any other assistant.

## 10. Privacy governance blocker

**No canonical HMC privacy policy has been supplied or identified in TVGSUOS.** This is a governance
blocker. A policy must be drafted or identified, founder-approved, and stored in active repository /
Founder OS records.

Until then:
- **no** customer-level cross-portfolio matching or activation;
- **no** unrestricted sharing of personal data;
- cross-portfolio learning is limited to appropriately **aggregate or de-identified** executive learning.

**Relationship opportunities are not measured conversions.**

## 11. Security and release guardrails

1. Tokens are **never** printed in chat, logs, docs, or PRs.
2. An open `USING (true)` policy does **not** count as adequate RLS.
3. Every API route requires **explicit caller verification and authorization tests.**
4. **No service-role key may reach the browser.**
5. **Approval is not execution.**
6. **No autonomous** deployment, migration, deletion, spending, or domain connection.
7. **No PR requiring a migration ships until the founder confirms the SQL ran.**
8. **No production claim without production verification.**
9. **No live cross-project service-role reporting** in the initial implementation.

## 12. Application and deployment

| Item | Value |
|---|---|
| Application | existing **TVGSUOS** |
| Approved external UI baseline | **`a79c240`** — not currently evidenced in the repository (Phase 0 audit §10) |
| Vercel project | **`tvgsuosweb`** |
| Intended Founder OS domain | **`os.hmcmarketing.tech`** |
| Not approved | **`theverifiedgroup.org`** is not the Founder OS domain and must not be substituted |
| This phase | **No domain is connected** |

## 13. Implementation sequence

| Phase | Scope | Gate to leave the phase |
|---|---|---|
| **0** | Read-only audit; docs-only direction and target architecture | Founder accepts PR #74 |
| **1** | API authorization, security tests, RLS review, removal of prohibited live reads | Every route caller-verified with positive and negative tests; live cross-project ODO read removed; RLS reviewed. **PR #73 is the existing candidate — open, unmerged, not accepted** |
| **2** | Reporting contract, schema reuse, manual imports, persistence | Reports stored with evidence, source, timestamp and freshness; migrations confirmed run by the founder |
| **3** | Port UI baseline `a79c240`; wire secured stored data | UI reads only secured stored data |
| **4** | V-Loop write-back and approved scheduling | A scheduled departmental cycle runs without an agent prompt and writes run evidence |
| **5** | Independent audit and fresh-agent cold-start challenge | A fresh agent reaches the correct state from the repository alone |
| **6** | Founder release and production verification | Production evidence recorded (e.g. anonymous requests denied) |
| **7** | Domain connection | Only after Phases 1 and 6 are verified |

## 14. Standing session preference — Founder's Lens

Carried forward unchanged from the superseded MASTER §10 (founder-confirmed 2026-07-21): a session
opens with a baseline-grounded status table, item / priority / effort / purpose, exhaustive not
curated, grounded in current repository state. Full text in the history file.
