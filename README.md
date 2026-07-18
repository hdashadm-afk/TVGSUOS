# TVGSUOS — The Verified Group Single Unified OS

Layer 1 of The Verified Group's four-layer ecosystem. Founder-only. No public pages, no client access.

## Ecosystem map

| Layer | System | Domain | Role |
|---|---|---|---|
| 1 | **TVGSUOS** (this repo) | `theverifiedgroup.org` | Umbrella governance — strategy, security, continuity, cross-venture command |
| 2 | Founder's OS | *(currently inside `katiwala-owner-os-`, migrating here long-term)* | Founder-internal operating layer — Ver, Daily Baseline Check |
| 3 | Katiwala AI / KOS | `katiwalaai.app` | Gas station SME operating system |
| 4 | ODO / OwnerDirect Online | `ownerdirect.online` | Property/vehicle trust marketplace |

TVGSUOS governs from the top. Layers 2–4 execute their own domains and report up through the agent hierarchy below.

## Agents

- **Ver** — chief of staff (TVGSUOS layer). Security posture, data privacy compliance, business continuity, escalation, cross-venture alignment, daily baseline review.
- **Kath** — KOS agent. Owner decision support for gas stations.
- **Vera** — ODO agent. Trust marketplace coordination.

Kath and Vera report to Ver. Full hierarchy/role spec lives in `katiwala-owner-os-`'s `docs/FOUNDER_OS_AGENT_ARCHITECTURE.md` and `docs/MASTER_DIRECTION_FAST_REFERENCE.md` — not duplicated here.

## Tech stack

- Single-file `index.html` — same pattern as the KOS MVP (`katiwala-owner-os.vercel.app`), no build step.
- Same Supabase project as `katiwala-owner-os-` (project ref `jbhfdmujqrtqkhacfegl`) — no new database, this reads/writes the existing one.
- Vercel serverless functions under `api/*.js` where server-side logic is needed (credential-gated, same graceful-degradation pattern as `katiwala-owner-os-`'s `api/` directory).
- Deploy target: Vercel → `theverifiedgroup.org` (no custom domain wired yet — deploys to its Vercel-assigned URL until DNS is pointed).

## Repos in this ecosystem

- **TVGSUOS** (this repo) — Layer 1, umbrella governance.
- [`katiwala-owner-os-`](https://github.com/hdashadm-afk/katiwala-owner-os-) — Layers 2 (Founder's OS, for now) + 3 (KOS/Katiwala AI).
- [`staffverified-app`](https://github.com/hdashadm-afk/staffverified-app) — KOS's HR & Payroll module.
- ODO/OwnerDirect Online — separate repo/Supabase project (Layer 4).

## Setup

1. `cp .env.example .env.local` and fill in real values (see that file for what each key is for and where it comes from).
2. This is a static single-file app — no install/build step. Open `index.html` directly for local iteration, or `vercel dev` to exercise `api/` functions locally.
3. Deploy: connect this repo to Vercel under the `hdashadm-afks-projects` team (same team as `katiwala-owner-os-`/`staffverified`/`staffverified-app`, so there's one login across the whole ecosystem).

## Key docs

- `FOUNDER_OS.md` — running, dated implementation log. Read this first in any new session.
- `docs/` — architecture and governance docs as they're added (mirrors the `katiwala-owner-os-` convention: Markdown is canonical memory, not source-of-truth-by-assumption).
