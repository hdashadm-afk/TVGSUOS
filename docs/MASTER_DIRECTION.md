# TVGSUOS — Master Direction

Last updated: 2026-10-28  
Status: Active — baseline source of truth for this repo  
Owner: Edgardo Castro

**Founder OS architecture (28 Oct 2026) sits in §A.** It governs how this app is built: its nodes, its data, its learning loop and its security gate. It does **not** replace any venture's own MASTER (ODO `docs/ODO_MASTER.md`, Dipstify `katiwala-owner-os-/docs/KATIWALA_GAS_STATION_MASTER_DIRECTION.md`, Fuel-ops, Verifos). Those still decide their own product rules.

**Current operating masterplan (20–22 Aug 2026) sits in §0.** Sections 2–10 below are the July 18 repo-creation baseline (FOS as Layer 1). They are not deleted. Where they fight §0, **§0 wins.** Where §0–§10 fight §A on Founder OS architecture, **§A wins**. The conflicts known on 28 Oct are listed in §A.10 and are **open**, not resolved by this amendment.

**Customer-facing name:** **Verifos** (Stations now). **Station Rescue / SR / Vero** are retired in product copy. Repo may still be `station-rescue`; that is engineering only.

Tree: `docs/ECOSYSTEM_REPO_TREE.md`. Continuity log: `FOUNDER_OS.md`.

---

## A) Founder OS architecture — founder-approved 28 Oct 2026

Scope: the TVGSUOS Founder OS app (`index.html` + `api/` in this repo, Supabase project `jbhfdmujqrtqkhacfegl`). One app. No replacement app.

### A.1 UI baseline

- The approved UI baseline is **mockup `a79c240`**.
- **Source not located.** On 28 Oct, `a79c240` was not a commit in TVGSUOS, katiwala-owner-os-, odo or fuel-ops (GitHub `get_commit` returned "No commit found"), and not in the local clones. `hmcmarketing` was not reachable from the session.
- Until the founder names where `a79c240` lives, no UI work may claim to match it.

### A.2 Five nodes, one app

TVGSUOS Founder OS is one app with five distinct nodes, in this order:

| # | Node | Role | Status |
|---|---|---|---|
| 1 | **Helium Fuels** | Enabling energy and infrastructure layer: the stations, the yard, the floor the other nodes run on | active |
| 2 | **Dipstify** | Station operating system (owner daily ops, variance, books) | active |
| 3 | **ODO Vehicles** | Vehicle marketplace (ownerdirect.ph Vehicles door) | active |
| 4 | **DinkKada** | HMC white-label Club OS for PH pickleball clubs | early |
| 5 | **ODO Property** | Property marketplace | **parked** |

- ODO Vehicles and ODO Property are **separate nodes**. ODO Property stays parked until the founder unparks it in ODO's own MASTER.
- A node is a reporting and decision lane in Founder OS, not a merged product. Nothing here merges products, brands, databases or workflows.

### A.3 The system learns; agents do not remember

- No critical state may exist only in chat, an agent's context, a local machine, or an uncommitted branch.
- Every decision, report, guardrail and direction change that matters is written to the repo (Markdown) or to the Founder OS tables (§A.5), with its date and source.
- A fresh agent must be able to rebuild current state from the repo plus stored data alone. Conversation history is not an input.

### A.4 What each layer keeps

| Layer | Keeps | Does not keep |
|---|---|---|
| **Venture OSs** (Dipstify / Fuel-ops, ODO, DinkKada) | Operational evidence: shift logs, dips, listings, deals, payments, IDs, messages | Founder-level direction |
| **Founder OS** (this app) | Executive reports, distilled learning, decisions, guardrails, playbooks, updated direction | Raw operational records, customer personal data |

### A.5 The learning loop

**Direction → Action → Signal → Review → Updated Direction.**

| Step | Means | Stored in |
|---|---|---|
| Direction | What the founder set | This doc, venture MASTERs, `decisions` |
| Action | What was done against it | Venture repos, PRs, `founder_tasks` |
| Signal | What the venture reported back | Executive report rows (imported) |
| Review | What the founder or Ver concluded | `decisions`, `improvement_signals` |
| Updated Direction | The new rule, written down | This doc / venture MASTER, committed |

- An updated direction only exists once committed. Approval in chat is not a write.
- The reporting contract is mapped to the existing tables first (`decisions`, `decision_log`, `improvement_signals`, `weekly_updates`, `daily_baseline_checks`, `founder_tasks`, `projects`). A new table is proposed only where none fits, and only with founder approval (schema gate).

### A.6 Data boundary

- **Start with manual or imported reports.** A venture produces a report; Founder OS stores it.
- **No live cross-Supabase service-role reads**, and no duplicated operational databases.
- `api/odo-status.js` does that today: it reads ODO's database with ODO's service-role key. It is the first thing this rule retires (§A.10 #3).
- HMC's data privacy policy governs any use of relationships across nodes. Each node's operational records stay in that node's own system.

### A.7 Ver

- Ver is **optional**. Ver reads stored reports and decisions; Ver is **not** the source of truth.
- When Ver and a stored record disagree, the record wins.
- Ver's answers are not decisions until written back (§A.5).

### A.8 Approval is not execution

- "Approved" means permission to do the work. It is not evidence the work happened.
- A row is done only with its evidence: commit SHA, PR link, migration read-back or deployment ID.
- Founder OS shows approved-but-not-executed as its own state. It never shows it as done.

### A.9 Security gate before the domain

- Every TVGSUOS API route must be secured before `os.hmcmarketing.tech` is connected. Secured means authentication, authorization, and positive and negative tests.
- The order is: security merged → deployed → verified live (a logged-out call returns 401). Only then is the domain connected.
- Status 28 Oct: PR #73 (founder-only check on all 7 routes, 53 tests) is **open, not merged**.

### A.10 Open contradictions — flagged, not resolved here

| # | Conflict | Where | Needs |
|---|---|---|---|
| 1 | §0 phases are Verifos 1A/1B → Dipstify → ODO-V → ODO-P. The five nodes leave out Verifos and add Helium Fuels and DinkKada. | §0 vs §A.2 | Founder: is Verifos a sixth node, folded into Helium/Dipstify, or out of Founder OS? |
| 2 | §4 makes Ver chief of staff that owns governance; §A.7 makes Ver optional and not the source of truth | §4 vs §A.7 | Founder: retire §4's ownership wording |
| 3 | `api/odo-status.js` reads ODO live with a service-role key | code vs §A.6 | Replace with an imported ODO report (implementation task 2–3) |
| 4 | §2 domain is `theverifiedgroup.org`; the approved target is `os.hmcmarketing.tech` | §2 vs §A.9 | Founder: confirm one domain |
| 5 | §10 says multi-step instructions go in an HTML artifact. That was superseded 23 Jul 2026 by the Standard Instruction Form (markdown table in chat). | §10 vs `katiwala-owner-os-/CLAUDE.md` | Update §10 |
| 6 | No single HMC data privacy policy exists to point at. There are three per-brand policies (`docs/npc/`). | §A.6 | Founder: name the governing policy |
| 7 | DinkKada has no doc in any repo; this row is the first written record. The 28 Oct chat spelled it "ddnkada" and called it a Founder OS doc gap. LA Pickleball Court is the design partner. | all repos (grep 28 Oct) | Founder: confirm the spelling; write a DinkKada one-pager |
| 8 | Founder OS tables with open policies (read 28 Oct): `weekly_innovation_summary` (role `public`, `USING (true)`, read and write), `decision_log` (role `public`, write `true`). Plus `daily_baseline_checks`, `ver_queries`, `accepted_suggestions` and `odo_leads_snapshots`: any signed-in user, including `client_owner` / `client_staff`, can read and write. | Supabase `jbhfdmujqrtqkhacfegl` | Security task: founder-only RLS, after a "who goes dark" read |
| 9 | `FOUNDER_OS.md` continuity log stops at 21 Aug 2026 | `FOUNDER_OS.md` | Resume the log (this PR adds 28 Oct) |
| 10 | No schema files in this repo; tables exist only in Supabase | repo vs DB | Commit a schema snapshot (read-only dump of the tables above) |

---

## 0) Current masterplan — 21 Aug 2026

HMC is legal. Founder OS (this repo / Ver) orchestrates. Ventures execute. Do not merge products.

| Phase | Product | Public | Job |
|---|---|---|---|
| **1A** | **Verifos Stations** | **verifos.co** (also station-rescue.vercel.app) | **Trust / service layer** for stations. Pain first: right tech + part when the pump is down. Every job builds registry and service history. Helium first. **Live.** |
| **1B** | **Verifos Vehicles** | verifos.co (vehicles lane, later) | Same trust layer for vehicles — protect owners, guide technicians. **Not** the vehicle marketplace. **After 1A.** |
| **2** | **Dipstify Station** | dipstify.com | Owner daily ops / books. Sibling. Not Verifos free tier. |
| **3A** | **ODO-Vehicles** | ownerdirect.online | **Marketplace** — vehicle buyer/seller transactions. **Not Verifos.** |
| **3B** | **ODO-Properties** | ownerdirect.online | **Marketplace** — property transactions. Mandatory `/` triage. **Not Verifos.** |

**Verifos vs ODO (locked 20 Aug 2026):** **ODO** = marketplace (3A Vehicles, 3B Properties). **Verifos** = service and transaction **trust layer** — evidence, verified work, owner protection. **1A Stations** is live at verifos.co. **1B Vehicles** = same trust layer for vehicles **after Stations** — does **not** replace ODO-Vehicles marketplace.

**Verifos locks**

- Owners free. Tech ₱500/mo after first month free. Supplier ₱1,000/mo after L2. Assessment ₱500 (₱250 / ₱250). Txn ₱250. **No % of job value.** Pay placeholder.
- **Graduation, not a gate:** accept the minimum. The standard is written once (`docs/VERIFOS_STANDARD.md`). Who follows it is rewarded (badge now; credits when named). Never fake Verified.
- Phase A (now): **1A Verifos Stations** — Helium field jobs may save on symptom. Prompt serial, pre-service, work, post-test. Photos = Phase B. **1B Verifos Vehicles** = after Stations — do not build now. **3A ODO-Vehicles** / **3B ODO-Properties** = marketplaces — separate products.
- Public URL **verifos.co** (DNS live 20 Aug). Repo still `station-rescue`. DB `phqncq…` stays. Separate from Dipstify.
- Product inbox **support@verifos.co**. Do not publish stationrescue.com support.
- Do not score Verifos on Dipstify conversion.
- Landing leads with repair/parts pain; registry compounds from the work.

**Dipstify:** Basic ₱9,999 · Staff+PnL ₱9,999, collect EOM. Quiz HOLD until founder unpauses. Do not put the quiz on Verifos.

**Assistants:** Ver (FOS) · Lens (Dipstify Station) · Vera (ODO). Chairman + 3 CEOs = briefing loop, not companies. CEO lanes: **Verifos** · **Dipstify** · **ODO** (not “SR”).

**Full Verifos law:** `docs/VERIFOS_VERIFICATION_FRAMEWORK.md` · `docs/VERIFOS_OPERATING_LOCK.md` · `docs/VERIFOS_STANDARD.md`.

**Dev Build (22 Aug 2026):** `docs/VERIFOS_DEV_BUILD.md`. Cite **K#** / **R#** / **D#**. Forever reject R1/R2/R4/R5/R7/R8. Defer **D1** vehicles Phase 2 · **D2** phone OTP · **D3** L2–L4 · **D4** paid booking · **D5** Pro CTA. **K10/R5:** one **Suppliers** tab = techs · parts · oil · facilitators · fixers · trainers. Compliance = DOE · DENR · Fire · equipment · facility. **Phase 1a UI + locks: Done** (Registry/Compliance/Suppliers shipped; #10 Helium phone test still founder).

---

## 1) Mission

TVGSUOS (The Verified Group Single Unified OS) is the top governance and operating layer above the ventures and products below it. It is the founder command layer for **strategy, execution, control, and continuity** — not one product app, and not a dashboard bolted onto one.

TVGSUOS governs. Ventures execute below it.

---

## 2) Three-layer ecosystem

**TVGSUOS *is* Founder's OS** — not a separate layer. An earlier four-layer model (Founder's OS as its own Layer 2, embedded in `katiwala-owner-os-`, "migrating here long-term") is superseded: Founder's Space is one of TVGSUOS's 9 governance areas (§3), built and live here, not a layer still to migrate.

| Layer | System | Domain | Repo |
|---|---|---|---|
| 1 | TVGSUOS (incl. Founder's Space) | `theverifiedgroup.org` | `TVGSUOS` (this repo) |
| 2 | Katiwala AI / KOS | `katiwalaai.app` | `katiwala-owner-os-` |
| 3 | ODO / OwnerDirect Online | `ownerdirect.online` | separate repo (not yet in this session's scope) |

TVGSUOS sits at Layer 1. Layers 2–3 are governed, not peers — they execute their own domains and report upward through the agent hierarchy (§4).

---

## 3) Governance areas

- **Founder's Space** — the founder's own operating view: priorities, decisions, daily baseline.
- **Strategy** — direction-setting, positioning, portfolio sequencing across ventures.
- **Finance** — cash position, runway, cross-venture financial visibility.
- **Marketing** — brand, positioning, and go-to-market oversight across ventures.
- **Product** — cross-venture product direction and consistency (not venture-specific feature work, which stays with Kath/Vera).
- **R&D** — exploratory/early-stage work not yet assigned to a governed venture.
- **Security / Privacy / Compliance** — posture, data privacy, access control, audit readiness across the whole ecosystem.
- **Intelligence** — signal synthesis from the ventures below (what Ver reads from Kath and Vera to form founder priorities).
- **People / Admin / Governance** — founder-level org structure, admin operations, and the governance rules in this doc and `docs/GOVERNANCE_MODEL.md`.

These areas are **connected but modular** — no area is hard-dependent on another unless explicitly required. The system stays usable in partial form and becomes more powerful as more areas are connected.

**Build status:** all 9 areas are named and scoped by this doc, and — as of 2026-07-18 — all 9 have real, live implementation in this repo's `index.html`. See `FOUNDER_OS.md` for the dated build log and `docs/PORTFOLIO_MAP.md` for what's verified live vs. shipped-but-not-yet-confirmed.

---

## 4) Agent hierarchy

```text
TVGSUOS
└── Ver  (chief of staff / founder-level governance)
    ├── Kath  (KOS / Katiwala AI)
    └── Vera  (OWDO / ODO)
```

- **Ver** — chief of staff. Owns founder-level governance, security posture, data privacy compliance, business continuity, escalation, cross-venture alignment, and continuity of execution.
- **Kath** — KOS/Katiwala AI venture agent. Reports to Ver.
- **Vera** — OWDO/ODO venture agent. Reports to Ver.

Full responsibilities and the non-redundancy rule (Ver must not duplicate Kath/Vera domain reasoning, and vice versa) are in `docs/GOVERNANCE_MODEL.md`.

---

## 5) Governed ventures

- **KOS / Katiwala AI** — owner-space business system (CEO's Space, HR & Payroll, Simple P&L, Ops/industry modules). Lives in `hdashadm-afk/katiwala-owner-os-`.
- **OWDO / ODO** — property/vehicle trust marketplace. Own repo and own Supabase project, separate from KOS.

Venture-specific logic stays in each venture's own repo/domain. Cross-venture governance belongs here.

---

## 6) Working rules

1. Treat repo Markdown files as canonical memory.
2. Treat this doc, `docs/GOVERNANCE_MODEL.md`, `docs/PORTFOLIO_MAP.md`, `docs/HANDOFF_PROTOCOL.md`, and each governed venture's own master docs as governing references.
3. Do not drift from the agreed direction.
4. Do not introduce new strategy unless the founder explicitly asks for it.
5. Finalized direction takes priority over suggestions.
6. Save important implementation logic in Markdown so future sessions and other Claude accounts can resume instantly.
7. Keep outputs simple, trackable, reusable, and founder-readable.
8. Prefer stable structure over cleverness.
9. Do not redesign just for style. Preserve working structure unless change is necessary.
10. Every meaningful change should strengthen continuity, clarity, or execution.

---

## 7) Two-Claude continuity

The founder uses two Claude accounts interchangeably. Full protocol — what to read on session start, what to leave behind on session end — is in `docs/HANDOFF_PROTOCOL.md`. This doc is the baseline that protocol resumes from.

---

## 8) Current build status (2026-07-18, not aspirational)

This section covered only the first few hours of this repo's existence (Phase 0, docs-only) and was never updated as the same day's work continued past it — see `FOUNDER_OS.md`'s dated log for what actually happened next. Corrected below rather than left to mislead a future session:

- **Built:** all Phase 0 docs (README, this file, `docs/GOVERNANCE_MODEL.md`, `docs/PORTFOLIO_MAP.md`, `docs/HANDOFF_PROTOCOL.md`) — plus real app code: a login-gated `index.html` (Founder Cockpit dashboard, all 9 governance-area sections as a collapsed accordion, a floating "Ask Ver" assistant), `api/ask-ver.js`, `api/security-check.js`, `api/odo-status.js`, and `vercel.json`. Deployed to `tvgsuosweb.vercel.app` (GitHub-connected, auto-deploys from `main`).
- **Not built here:** `theverifiedgroup.org` DNS is not wired yet (still Vercel-assigned URL only). The Daily Baseline Check's actual scheduled routine (Ver's daily orchestration loop, run on a schedule, writing to the shared `daily_baseline_checks` table) still executes via `katiwala-owner-os-` — that's a routine-execution detail, separate from the layer model above (§2), which is already resolved: Founder's Space is a TVGSUOS governance area, not a layer still to migrate.
- **Several pieces are shipped but not yet founder-verified live**, and a few required secrets (`ANTHROPIC_API_KEY`, `SUPABASE_MANAGEMENT_TOKEN`, `ODO_SUPABASE_SERVICE_ROLE_KEY`) still need adding to `tvgsuosweb`'s Vercel project — see `FOUNDER_OS.md`'s most recent entries for the exact current list, since that changes faster than this doc should.
- No longer out of scope: app code now exists and is the primary thing this repo does. Future sessions should read `FOUNDER_OS.md` first (per `docs/HANDOFF_PROTOCOL.md`) rather than assume this §8 snapshot is current.

---

## 9) Relationship to `katiwala-owner-os-`'s existing docs

`katiwala-owner-os-` has its own prior baseline docs covering this same umbrella-layer ground under different names, written before this repo existed:

- `docs/VERIFIED_GROUP_MASTER_DIRECTION.md` — established the four-layer model this doc's §2 restates, under the name "The Verified Group" / "Founder's OS."
- `docs/TVGSUOS_MASTER_DIRECTION.md` — an earlier attempt at this exact doc, written directly into `katiwala-owner-os-` before this repo existed (still sitting on an unmerged branch there), using the name "TVGSUOS" and later revised mid-conversation to "TVG-Founder OS."

**This file is now the canonical Layer-1 master direction.** `katiwala-owner-os-`'s `docs/TVGSUOS_MASTER_DIRECTION.md` should be treated as superseded by this repo once that's reconciled — it has not yet been edited to point here; flagging that as an open item rather than silently resolving it, since editing another repo's docs wasn't in this pass's explicit scope.

---

## 10) Session-start operating preference — "Founder's Lens"

Confirmed by the founder 2026-07-21 (same rule already propagated to `katiwala-owner-os-`'s `docs/MASTER_DIRECTION.md` §11, `staffverified-app`'s `AGENTS.md`, `pnlverified`'s `AGENTS.md`, and `fuel-ops`'s `AGENTS.md` — applies across the whole portfolio, not just the KOS/Dipstify layer): deliver a baseline-grounded status automatically at the start of a session — don't wait to be asked "what's on my plate." Named **Founder's Lens** by the founder — same naming family as Lens (KOS/Dipstify's assistant, formerly Kath) and Owner's Lens (KOS's top-level dashboard): "get to see everything before deciding to start the day," applied to how Claude opens a session, not specific to one product. Check current repo state, don't assume from memory. Format is always a table: item / priority / effort / purpose (why it matters), with 🔴/🟡/🟢 for urgency (plain chat text can't render literal color) and Low/Medium/High for effort (the founder's rough read on how much work the item is, to help him triage what to greenlight now vs. schedule for later). Coverage must be exhaustive, not curated — every open PR, every unmerged/unactioned item, every decision still waiting on the founder, across every repo the session has touched, not a top-3. Opening line: **"Boss, here's your Lens today"** (or equivalent), then straight into the full table — not a re-explanation of what Founder's Lens is each time.

**Also confirmed the same day:** multi-step setup instructions that span more than one external site (e.g. Vercel + Supabase + a domain registrar) go in a small published HTML artifact with a table — columns URL / Topic / Steps, one row per step, a checkbox per row (persisted via localStorage), and tap-to-copy chips for exact literal values (env var names, keys, secrets) instead of chat-paragraph instructions the founder has to retype. Apply whenever a task has 3+ sequential steps across more than one external dashboard/site — same rule as `katiwala-owner-os-`'s `docs/MASTER_DIRECTION.md` §11.
