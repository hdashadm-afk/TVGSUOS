# TVGSUOS — Master Direction

Last updated: 2026-07-18
Status: Active — baseline source of truth for this repo
Owner: Edgardo Castro

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
