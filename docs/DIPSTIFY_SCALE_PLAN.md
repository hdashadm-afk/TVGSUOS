# Dipstify Scale Plan (+ ODO / RideVerified clocks)

Last updated: 2026-08-10  
Status: Active — planning gates, not a build-for-1M mandate  
Owner: Edgardo Castro

Companion to `docs/ECOSYSTEM_REPO_TREE.md`.

---

## Geographic clocks

```text
Dipstify     →  Philippines  →  SEA  →  World
RideVerified →  Philippines first (ownership app) — later
ODO          →  Philippines first (marketplace: Property + Vehicle)
```

Market anchor (planning only): DOE ~12k liquid fuel retail outlets in PH (2022).  
**~10k stations ≈ near PH category coverage**; **100k+ needs multi-country**; **1M = global ambition**.

---

## RideVerified vs ODO (do not conflate)

| Brand | Job |
|---|---|
| **RideVerified** | Ownership app — garage / identity / trust. Code: `hmcmarketing` / `ride-verified-ph/`. |
| **ODO** | Marketplace — Property ODO + Vehicle ODO transactions. |
| **Vehicle ODO** | Vehicle marketplace only — **≠** RideVerified. |

---

## Station unit load (locked)

Per station per day (minimum planning load):

1. **2 shift logs** (structured — cheap)
2. **≥50 pictures** (blobs — expensive)

| Stations | Shift logs / day | Photos / day | Rough photos / year |
|---|---|---|---|
| 1 | 2 | 50 | ~18k |
| 100 | 200 | 5,000 | ~1.8M |
| 1,000 | 2,000 | 50,000 | ~18M |
| 10,000 | 20,000 | 500,000 | ~180M |
| 100,000 | 200,000 | 5M | ~1.8B |
| 1,000,000 | 2M | 50M | ~18B |

**Rule:** Postgres (or equiv) for shiftlogs / P&L / variance; **object storage + CDN for photos**. Never store evidence photos as DB blobs. Owner’s Lens shows **signals / exceptions**, not raw 50 photos.

---

## Scale gates

| Gate | Geography | Product unlock | Architecture unlock |
|---|---|---|---|
| 1–10 | Helium prove | Owner’s Lens daily loop works | Photo upload + retention from day 1 |
| 100 | PH early GTM | Multi-station owner dashboard; Staff + Ops attach | `station_id` everywhere; thumbs/compress |
| 1,000 | Real PH footprint | Franchise playbook; Delivery density 1–2 regions | Async photo pipeline; retention tiers |
| 10,000 | Near PH TAM / SEA entry | Country pack; Franchise OS live | Region DB / CDN; storage cost alerts |
| 100,000 | SEA / multi-country | Per-country ops + compliance | Multi-region; residency; aggregate AGI |
| 1,000,000 | World | Category OS + partners | Global edge; media lifecycle; DaaS |

**Plan for 1M; build only to the next gate.**

---

## Foundations now (even in Station Phase A)

1. Every Station row keyed by `station_id` (+ future `country_code`)
2. Shiftlog = structured event; photo = object URL + metadata
3. Evidence retention policy written (full-res → thumb → archive/delete)
4. Franchise stays on the map — required for 1k → 10k without linear founder labor
5. ODO and RideVerified stay on separate schemas/products from Station

---

## Present cost note

Founder recent Supabase charge ~$79 (Pro org). Streamlined **map** does not by itself cut that bill. See `ECOSYSTEM_REPO_TREE.md` Supabase section.
