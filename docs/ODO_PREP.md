# ODO Prep Pack (docs only)

Last updated: 2026-08-11  
Status: **Prep only** — no marketplace build until founder unlocks  
Owner: Edgardo Castro  

Companion to `docs/ECOSYSTEM_REPO_TREE.md`. Does **not** start ODO coding.  
Deeper Vera/MVP detail (July 2026 audit): `katiwala-owner-os-/docs/ODO_MVP_PHASE_RECONCILIATION.md`.

---

## 1. Locked place in the tree

```text
FOS
├── RideVerified     ← ownership app — later (≠ ODO)
├── ODO              ← THIS PILLAR — marketplace — later
│   ├── Property ODO
│   └── Vehicle ODO  ← vehicle marketplace only (≠ RideVerified)
└── Dipstify / Station ← Phase A now
```

| Rule | Meaning |
|---|---|
| ODO ≠ RideVerified | Marketplace vs ownership. Never nest RV under ODO. |
| Vera ≠ Ver | Vera = ODO marketplace agent. Ver = FOS cockpit. |
| Phase A | Station only until founder unlocks ODO. |

---

## 2. What ODO is (plain language)

**ODO** = trust-layer **marketplace** for Property and Vehicle deals: discover → trust signals → Vera guides next step → (later) escrow / OFW / partners.

**Not:** gas-station ops, Owner’s Lens daily loop, or RideVerified garage/identity.

---

## 3. Known surfaces (as of docs — verify live when unlocked)

| Item | Value |
|---|---|
| Public / product | `ownerdirect.online` (per PORTFOLIO_MAP) |
| Supabase | Own project `qhjhsdsluxgyjevbhfmk` — **not** Lens `jbhfd…` or Ops `wtwgsy…` |
| FOS light read | `TVGSUOS/api/odo-status.js` (needs `ODO_SUPABASE_SERVICE_ROLE_KEY` on `tvgsuosweb`) |
| Tracker mirrors in Lens DB | `vera_capability_status`, `vera_pulse_snapshots` (manual/mirror — not live ODO query from KOS) |
| Repo | OwnerDirect / ODO app (separate from `katiwala-owner-os-` and `Fuel-ops`) — **confirm path at unlock** |

---

## 4. Honest maturity (from July 2026 reconciliation — re-audit at unlock)

| Area | Status |
|---|---|
| Listings / marketplace core | Treat as MVP_BUILD — re-verify against live ODO repo |
| Vera chat widget + `/api/vera` | Real but partial (prompt funnel, not full RAG/tools) |
| `/admin/vera` intelligence | Real aggregates + manual suggestion board |
| Similar listings + demand gaps | Lightweight, real |
| Full RAG / escrow / bankers / developers | Phase 2–3 — not MVP-complete |
| Security boundary if tools added | Must lock **before** tool-calling into live data |

---

## 5. Unlock criteria (founder)

Unlock ODO build only when **at least one** is true:

1. Cash / GTM needs marketplace traction this month.  
2. Station Phase A is “done enough” (your call) and bandwidth frees.  
3. A concrete buyer/seller pilot is waiting on a named ODO feature.

Until then: Station Phase A continues; this pack stays reference-only.

---

## 6. First session plan when unlocked (not now)

| Step | Where | How |
|---|---|---|
| 1 | Risk table | Auth, payments/escrow, PII, Vera tool-calling, listing fraud |
| 2 | Live audit | Clone ODO repo + query `qhjhsd…` — refresh §4 |
| 3 | Scope cut | Property vs Vehicle — which vertical ships first |
| 4 | Vera boundary | No tools until redaction/access layer designed |
| 5 | FOS pipe | Confirm `odo-status` + env on `tvgsuosweb` |
| 6 | Success check | One Helium-quality “founder can demo” path on `ownerdirect.online` |

Phrase to start build later: `odo unlocked — run until done`  
Prep-only phrase (this doc): already granted 2026-08-11.

---

## 7. Explicitly out of this prep

1. Writing ODO app code / migrations.  
2. Merging ODO DB into Station or Ops.  
3. Building RideVerified under ODO.  
4. Stealing Claude from Station Phase D/F1.

---

## 8. Related docs

| Doc | Role |
|---|---|
| `ECOSYSTEM_REPO_TREE.md` | Locked 3-pillar map |
| `PHASE_A_STATION_BOUNDARY.md` | Keeps ODO out of Station sessions |
| `DIPSTIFY_SCALE_PLAN.md` | ODO PH-first clock |
| `katiwala-owner-os-/docs/ODO_MVP_PHASE_RECONCILIATION.md` | Vera MVP phase truth (July 2026) |
| `PORTFOLIO_MAP.md` / `MASTER_DIRECTION.md` | Portfolio rows + Vera under Ver |
