# TVGSUOS — The Verified Group Single Unified OS

Layer 1 of The Verified Group's three-layer ecosystem. Founder-only. No public pages, no client access.

**TVGSUOS *is* Founder's OS** — not a separate layer sitting elsewhere. Earlier docs modeled a four-layer ecosystem with Founder's OS as its own Layer 2, embedded inside `katiwala-owner-os-`, "migrating here long-term." That's resolved now: Founder's Space (Ver, the Daily Baseline Check, the cross-venture dashboard) is one of TVGSUOS's own 9 governance areas, built and live in this repo's `index.html`, not a distinct layer to migrate later.

## Ecosystem map

| Layer | System | Domain | Role |
|---|---|---|---|
| 1 | **TVGSUOS** (this repo) | `theverifiedgroup.org` | Umbrella governance — strategy, security, continuity, cross-venture command. Includes Founder's Space (Ver, Daily Baseline Check) as one of its 9 governance areas, not a separate layer. |
| 2 | Katiwala AI / KOS | `katiwalaai.app` | Gas station SME operating system |
| 3 | ODO / OwnerDirect Online | `ownerdirect.online` | Property/vehicle trust marketplace |

TVGSUOS governs from the top. KOS and OWDO sit below it as governed ventures — they execute their own domains and report up through the agent hierarchy below.

## Governance areas

TVGSUOS is organized into 9 connected-but-modular governance areas. No area is hard-dependent on another unless explicitly required.

- **Founder's Space**
- **Strategy**
- **Finance**
- **Marketing**
- **Product**
- **R&D**
- **Security / Privacy / Compliance**
- **Intelligence**
- **People / Admin / Governance**

See `docs/GOVERNANCE_MODEL.md` for what each area actually owns and `docs/PORTFOLIO_MAP.md` for build status per area.

## Agents

- **Ver** — chief of staff (TVGSUOS layer), above Kath and Vera. Security posture, data privacy compliance, business continuity, escalation, cross-venture alignment, daily baseline review.
- **Kath** — KOS agent. Owner decision support for gas stations.
- **Vera** — ODO agent. Trust marketplace coordination.

Kath and Vera report to Ver. Full role spec: `docs/GOVERNANCE_MODEL.md` (this repo) and `docs/FOUNDER_OS_AGENT_ARCHITECTURE.md` / `docs/MASTER_DIRECTION_FAST_REFERENCE.md` (`katiwala-owner-os-`).

## Tech stack

- Single-file `index.html` — same pattern as the KOS MVP (`katiwala-owner-os.vercel.app`), no build step.
- Same Supabase project as `katiwala-owner-os-` (project ref `jbhfdmujqrtqkhacfegl`) — no new database, this reads/writes the existing one.
- Vercel serverless functions under `api/*.js` where server-side logic is needed (credential-gated, same graceful-degradation pattern as `katiwala-owner-os-`'s `api/` directory).
- Deploy target: Vercel project `tvgsuosweb` → `theverifiedgroup.org` (DNS not wired yet — live today at `tvgsuosweb.vercel.app`, GitHub-connected, auto-deploys from `main`). Two earlier orphaned deployments (`tvgsuos-hdashadm-afks-projects.vercel.app`, `tvg-founder-os-hdashadm-afks-projects.vercel.app`) exist from a direct file-deploy tool and should be ignored — `tvgsuosweb` is the real one.

**Current phase: Phase 4 — all 9 governance areas live.** Real app code exists: a login-gated `index.html` (Founder Cockpit dashboard, all 9 governance-area sections, floating Ver assistant) plus `api/ask-ver.js`, `api/security-check.js`, `api/odo-status.js`, and `vercel.json`. Deployed to `tvgsuosweb.vercel.app` (GitHub-connected, auto-deploys from `main`). See `FOUNDER_OS.md` for the full dated build log — including what's verified live vs. shipped-but-not-yet-confirmed — and `docs/PORTFOLIO_MAP.md` for build status per area.

## Repos in this ecosystem

- **TVGSUOS** (this repo) — Layer 1, umbrella governance, including Founder's Space.
- [`katiwala-owner-os-`](https://github.com/hdashadm-afk/katiwala-owner-os-) — Layer 2, KOS/Katiwala AI. Still runs the Daily Baseline Check's actual scheduled routine (a separate, still-open technical question from the layer model itself — see `docs/PORTFOLIO_MAP.md` §4).
- [`staffverified-app`](https://github.com/hdashadm-afk/staffverified-app) — KOS's HR & Payroll module.
- ODO/OwnerDirect Online — separate repo/Supabase project (Layer 3).

## Setup

1. `cp .env.example .env.local` and fill in real values (see that file for what each key is for and where it comes from).
2. This is a static single-file app — no install/build step. Open `index.html` directly for local iteration, or `vercel dev` to exercise the `api/` functions locally.
3. Deploy: connect this repo to Vercel under the `hdashadm-afks-projects` team (same team as `katiwala-owner-os-`/`staffverified`/`staffverified-app`, so there's one login across the whole ecosystem).

## Key docs

- `FOUNDER_OS.md` — running, dated implementation log. Read this first in any new session.
- `docs/MASTER_DIRECTION.md` — the baseline: mission, ecosystem, governance areas, ventures, working rules.
- `docs/GOVERNANCE_MODEL.md` — how governance actually operates: agent responsibilities, decision rights, escalation.
- `docs/PORTFOLIO_MAP.md` — the real portfolio: every layer/venture, its repo/domain/data store/stage, and what's built vs. planned.
- `docs/HANDOFF_PROTOCOL.md` — the two-Claude continuity protocol: what to read on session start, what to leave behind on session end.
