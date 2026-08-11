# FOS Ecosystem Repo Tree

Last updated: 2026-08-10  
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
    ├── StationRescue    ← services, parts, contractors
    ├── Delivery         ← Dipstify Delivery Module (MVP parked for supplier)
    └── Franchise        ← map only until scoped
```

---

## Design rules

1. **FOS is the umbrella only** — Ver orchestrates; does not absorb venture DBs.
2. **RideVerified ≠ ODO** — ownership app vs marketplace. Do not nest RV under ODO.
3. **riderslamp.org** under RideVerified, not ODO.
4. **ODO** = Property ODO + Vehicle ODO (marketplace verticals only).
5. **Dipstify** = Station / StationRescue / Delivery / Franchise (siblings).
6. **Station ≠ StationRescue** — Station = owner daily ops; Rescue = services/parts/contractors.
7. **No mega-monorepo move now** — map first; merges only if founder greenlights.
8. **Phase A** — Claude works **Dipstify / Station** only until founder says Station is done enough. See `docs/PHASE_A_STATION_BOUNDARY.md`.
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
| StationRescue | Station RESQ (separate) | Dipstify / StationRescue |
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
- Known projects: Station shared (`jbhfd…` — Lens + FOS + AdminVerified), Ops separate (`wtwgsy…`), ODO (`qhjhsd…`).
- Target (decided, not done): Ops merges into Station shared. Map does not change billing by itself.

---

## Proceed sequence

1. Keep this map + FOS UI / Notion aligned.
2. Claude: Dipstify / Station until founder unlocks next.
3. Parked: Delivery (supplier), Franchise (scope), RideVerified, ODO marketplace depth, Ops DB merge (own session).
4. Unlock next pillar only when cash / GTM needs it.
5. **ODO prep (docs only, 2026-08-11):** `docs/ODO_PREP.md` — no build until founder says `odo unlocked — run until done`.
6. **RideVerified prep (docs only, 2026-08-11):** `docs/RIDEVERIFIED_PREP.md` — no build until founder says `rideverified unlocked — run until done`.
7. **Phase E approve pack:** `docs/PHASE_E_APPROVE_PACK.md` — design only; phrase `phase e design approved`.
