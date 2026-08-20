# FOS Ecosystem Repo Tree

Last updated: 2026-08-20  
Status: Active — single map for Claude and Cursor  
Owner: Edgardo Castro

Canonical hierarchy under Founder OS (TVGSUOS / Ver). Docs and navigation align to this tree. Physical repo merges are **not** implied.

---

## Locked tree (3 pillars)

```text
FOS  (TVGSUOS / Ver — Founder OS cockpit)
├── RideVerified         ← ownership app (garage / identity / trust) — NOT a marketplace
│   └── riderslamp.org   ← owned domain (ownership / rider surface)
├── ODO                  ← marketplace / owner-direct transactions
│   ├── Property ODO
│   └── Vehicle ODO      ← vehicle marketplace (≠ RideVerified)
└── Dipstify
    ├── Station          ← Phase A focus (Claude)
    │   ├── Owner's Lens     (Station Control / katiwala-owner-os-)
    │   ├── AdminVerified
    │   ├── OpsVerified      (fuel-ops)
    │   ├── StaffVerified
    │   └── PnLVerified
    ├── Verifos           ← 2026 live marketplace (pumps + verified tech). Public URL verifos.co. Repo still station-rescue
    ├── Delivery         ← Dipstify Delivery Module (MVP parked for supplier)
    └── Franchise        ← map only until scoped
```

---

## Design rules

1. **FOS is the umbrella only** — Ver orchestrates; does not absorb venture DBs.
2. **RideVerified ≠ ODO** — ownership app vs marketplace. Do not nest RV under ODO.
3. **riderslamp.org** under RideVerified, not ODO.
4. **ODO** = Property ODO + Vehicle ODO (marketplace verticals only).
5. **Dipstify** = Station / Verifos / Delivery / Franchise (siblings).
6. **Station ≠ Verifos** — Station = owner daily ops; Verifos = services/parts/contractors.
6a. **Verifos** = master brand (HMC legal). **2026 product = Verifos** = this marketplace node. **Verifos Garage = 2027** — do not build it here; vehicle marketplace stays ODO. Operating lock: `docs/VERIFOS_OPERATING_LOCK.md`.
7. **No mega-monorepo move now** — map first; merges only if founder greenlights.
8. **2026 live work** — Verifos Phase A (Helium field jobs, graduation not a gate) + Dipstify Station ops. Station fence: `docs/PHASE_A_STATION_BOUNDARY.md`. Do not merge the two. Garage / insurers = 2027+.
9. Scale ambition and volume gates: `docs/DIPSTIFY_SCALE_PLAN.md`.

---

## Repo map (current → label)

| Tree node | Repo / asset today | FOS label |
|---|---|---|
| FOS | `TVGSUOS` | Founder OS |
| Station / Owner’s Lens | `katiwala-owner-os-` | Dipstify / Station / Owner’s Lens |
| AdminVerified | `adminverified` | Dipstify / Station / AdminVerified |
| OpsVerified | `fuel-ops` | Dipstify / Station / OpsVerified |
| StaffVerified | `staffverified-app` | Dipstify / Station / StaffVerified |
| PnLVerified | `pnlverified` | Dipstify / Station / PnLVerified |
| Verifos | `station-rescue` · **verifos.co** (deploy: station-rescue.vercel.app) | Dipstify sibling / Verifos marketplace |
| Delivery | `dipstify-delivery-mvp` + `TVGSUOS/delivery-mvp.html` | Dipstify / Delivery |
| Franchise | none yet | Dipstify / Franchise (docs-only) |
| RideVerified | [hmcmarketing](https://github.com/hdashadm-afk/hmcmarketing) → `ride-verified-ph/` | FOS / RideVerified — **later** |
| riderslamp.org | domain owned | FOS / RideVerified / riderslamp.org |
| Property ODO | ODO / OwnerDirect | ODO / Property ODO — marketplace |
| Vehicle ODO | ODO / OwnerDirect | ODO / Vehicle ODO — marketplace |
| ShopVerified | `hmcmarketing` → `shop-verified-ph/` | Own brand — later; ≠ Dipstify |
| `admin-verified-ph` in hmcmarketing | RV + ShopVerified back office | **≠** Dipstify `adminverified` |

---

## Supabase (today — not 1M)

- Org Pro; founder recent charge ~$79.
- Known projects (5 live): Station shared (`jbhfd…` — Lens + FOS + AdminVerified), Ops separate (`wtwgsy…`), Staff (`ttytdu…`), ODO (`qhjhsd…`), Verifos (`phqncq…`, repo still station-rescue).
- **Goal = 4 DBs:** merge Ops → Station shared. Staff (+ PnL when built) stays separate. ODO + Verifos stay separate.
- PnL/Acctg seats: may be same Admin as HR **or** a separate position — product supports combine or split. **Locked 2026-08-19:** Basic ₱9,999 · Staff+PnL (Admin Pack) ₱9,999 — see `docs/DIPSTIFY_STATION_PLAN.md`.
- Ops merge: design-only until founder approves `docs/OPS_STATION_DB_MERGE_RISK_PACK.md`. Map does not change billing by itself.
- **Verifos + Dipstify combine:** design-only until founder picks a phrase in `docs/SR_DIPSTIFY_MERGE_RISK_PACK.md`. Default remains siblings, not one DB.

---

## Proceed sequence

1. Keep this map + FOS UI / Notion aligned.
2. **Verifos (20 Aug 2026):** registrar points **verifos.co** at the existing Vercel project. Do not build Verifos Garage.
3. Claude: Verifos Phase A + Dipstify Station ops. Do not merge. Do not start Garage.
4. Parked: Delivery (supplier), Franchise (scope), RideVerified, ODO marketplace depth, Ops DB merge (own session).
5. Unlock next pillar only when cash / GTM needs it.
6. **ODO prep (docs only, 2026-08-11):** `docs/ODO_PREP.md` — no build until founder says `odo unlocked — run until done`.
7. **RideVerified prep (docs only, 2026-08-11):** `docs/RIDEVERIFIED_PREP.md` — no build until founder says `rideverified unlocked — run until done`.
8. **Phase E approve pack:** `docs/PHASE_E_APPROVE_PACK.md` — design only; phrase `phase e design approved`.
