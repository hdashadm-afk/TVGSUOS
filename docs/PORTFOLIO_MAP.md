# TVGSUOS — Portfolio Map

Last updated: 2026-07-18
Status: Active
Owner: Edgardo Castro

The real portfolio as it actually exists today — repos, domains, data stores, stage, and reporting lines. Not aspirational; update this file when something's stage genuinely changes, don't let it silently go stale.

---

## 1) Layers and ventures

| Layer | System | Repo | Domain | Data store | Stage | Reports to |
|---|---|---|---|---|---|---|
| 1 | TVGSUOS | `TVGSUOS` (this repo) | `theverifiedgroup.org` (not wired yet) / `tvgsuosweb.vercel.app` (live today, GitHub-connected — deploys from `main` automatically) | Reads/writes the KOS Supabase project — no dedicated database. `api/odo-status.js` also reads ODO's own separate project (`qhjhsdsluxgyjevbhfmk`) via service-role key. | Phase 4 — all 9 governance areas live | Founder direct |
| 2 | Founder's OS | `katiwala-owner-os-` (embedded, not a separate deploy) | *(none — a tab inside the KOS app)* | KOS Supabase project (`jbhfdmujqrtqkhacfegl`) | Live — Daily Baseline Check, Founder Crossroads | Ver |
| 3 | Katiwala AI / KOS | `katiwala-owner-os-` | `katiwalaai.app` (target) / `katiwala-owner-os.vercel.app` (live today) | KOS Supabase project (`jbhfdmujqrtqkhacfegl`) | MVP_BUILD | Kath → Ver |
| 4 | ODO / OwnerDirect Online | separate repo (not in this session's scope) | `ownerdirect.online` | Own, separate Supabase project | MVP_BUILD (Phase 1: buyer-side trust flow) | Vera → Ver |

## 2) Shared services (not a layer on their own)

| System | Repo | Data store | Stage | Reports to |
|---|---|---|---|---|
| StaffVerified (KOS's HR & Payroll module) | `staffverified-app` | Own, separate Supabase project | Built — Tier 1 (employee records, time/attendance, payroll, PH statutory contributions, payslips) live | Kath → Ver |

---

## 3) Governance-area build order

Founder-confirmed 2026-07-18 (in the `katiwala-owner-os-` session that led to this repo). After Founder's Space (already built, Layer 2), the next areas to get real UI/workflows, in priority order:

1. Strategy
2. Product
3. Security / Privacy / Compliance
4. Marketing
5. R&D

Then, unordered: Finance, Intelligence, People/Admin/Governance.

This was the priority order used to build them. As of 2026-07-18, all 9 governance areas — the 5 ranked above plus Finance, Intelligence, and People/Admin/Governance, built unordered afterward — have real, live implementation in this repo's `index.html`. See `FOUNDER_OS.md`'s dated log for the build order actually followed and which pieces are founder-verified live vs. shipped-but-not-yet-confirmed.

---

## 4) Open items

- **For the current, fast-moving list of shipped-but-not-yet-verified-live items and required env vars/secrets** (e.g. `ANTHROPIC_API_KEY`, `SUPABASE_MANAGEMENT_TOKEN`, `ODO_SUPABASE_SERVICE_ROLE_KEY`), see `FOUNDER_OS.md`'s most recent dated entries rather than this file — that log changes every session and this one shouldn't try to duplicate it.
- **ODO's actual repo is not yet in this session's scope** — its row above is filled from what's documented in `katiwala-owner-os-`'s prior baseline docs, not verified directly against a live ODO repo/Supabase project from this session.
- **`theverifiedgroup.org` DNS is not wired.** Live today only at the Vercel-assigned `tvgsuosweb.vercel.app`.
- **Two orphaned Vercel deployments exist and should be ignored**: `tvgsuos-hdashadm-afks-projects.vercel.app` and `tvg-founder-os-hdashadm-afks-projects.vercel.app` — both created via a direct file-deploy tool that doesn't register as a real, dashboard-manageable project (confirmed: didn't appear in the team's project list despite a live URL). The real project is `tvgsuosweb`, created via Vercel's standard Import Git Repository flow.
- **Founder's Space migration timeline is undecided** — whether it moves to this repo before or after the 5 priority governance areas above get built, and what its data architecture looks like once here (own Supabase project vs. cross-repo reads of the existing KOS one), is not decided. See `docs/MASTER_DIRECTION.md` §8–9 and `docs/GOVERNANCE_MODEL.md` §5.
- **`katiwala-owner-os-`'s own `docs/TVGSUOS_MASTER_DIRECTION.md`** (written before this repo existed, still on an unmerged branch there) has not been updated to point here. Flagged, not fixed, in this pass.
