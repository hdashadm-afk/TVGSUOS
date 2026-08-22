# Verifos — mitigate ICP gaps (direction-consistent)

**Source:** ICP self-audit 22 Aug 2026 · Locks: `MASTER_DIRECTION` §0 · `VERIFOS_OPERATING_LOCK` · `VERIFOS_DEV_BUILD` (K/R/D)  
**Rule:** Fix on live Vite (`station-rescue`). Do **not** do R1/R2/R4/R5/R7/R8. Defer D1–D5 as written.

---

## Principle

| Do | Don’t |
|----|--------|
| Strengthen **request → apply → pick → field** (K11) | Greenfield Next (R1) |
| One **Suppliers** tab (K10) | 6th tab / Account-centered (R5/R4) |
| Claimed / Rated only until earned | Fake Verified / gold (R7) |
| Hybrid → cloud for jobs/compliance | Mock-first rewrite (R8) |
| WhatsApp for Gas & Dsl quotes | In-app pump prices / paid booking now (D4) |

---

## Mitigation map (audit → action)

### Now (Phase 1A — ship on Vite)

| # | Gap | Mitigation | Lock |
|---|-----|------------|------|
| **M1** | No role guards | Require auth on `/app` and `/provider`; route by profile role; block cross-shell | K7 · K11 |
| **M2** | Walk-up fights owner-pick | Soft-gate: walk-up = draft only until owner links/picks; copy says covering tech | K11 |
| **M3** | Supplier = preview only | Keep **one** Suppliers directory for owners (K10). On `/provider`, `kind=supplier` home: My listing + inquiries — still same shell, no 6th tab | K10 · R5 |
| **M4** | verify defaults to technician | Pass `?kind=` from signup / profile `provider_kind` | K10 |
| **M5** | Issues buried for owners | Keep 5 tabs (R4). Add Registry + Account deep links only — or one “Requests” entry under Registry CTA (already sticky) | K1 · K2 · R4 |
| **M6** | Discover = seed | Phase A: founder-curated seed OK. Next: list from live `providers` where `listed_in_search` + Claimed/Rated — **no** fake Verified | K8 · K10 · R7 · R8 |
| **M7** | Compliance local-only | Upsert compliance rows to Supabase when signed in (same schema shape as local) | K3 · K7 |
| **M8** | Jobs device-local | Confirm/run `tech_jobs` + service_requests SQL; show “saved on this device only” when cloud missing | K11 |
| **M9** | PayMongo theatrical | Keep **placeholder** copy (honest). Do not fake charge. Real checkout = D4 | D4 · R9 |
| **M10** | L1 vs L2 list copy | One line in STANDARD + landing: list after Light (L1); L2 later reward — never invent Verified | K8 |

### Gradual (already D#)

| Gap | Mitigation | Code |
|-----|------------|------|
| L2–L4 photos / richer record | Step photos into field job after Phase A proven | **D3** |
| Phone OTP | Add beside email; never OTP-only | **D2** |
| Paid booking / Book supplier | After checkout real | **D4** |
| Pro CTA | After owners-free Phase A | **D5** |
| Vehicles | Phase 2 / 1B | **D1** |

### Explicitly do **not** mitigate by…

| Temptation | Why not |
|------------|---------|
| Rebuild in Next/shadcn | **R1** |
| Center Account / add Suppliers as 6th tab | **R4 · R5** |
| Show Premium/ULD/DSL ₱ on app | K10 Gas & Dsl lock |
| Seed gold Verified badges | **R7** |
| Full L1–L4 schema rewrite now | **D3** / **R6** retired |

---

## ICP priority (direction order)

Pain first = pump down → tech + part. So:

1. **M1 + M2 + M8** — authorization truth (owners + techs)  
2. **M3 + M4 + M6** — suppliers usable without a second product  
3. **M7** — compliance compounds (registry sibling)  
4. **M9–M10** — honesty / copy alignment  

Suppliers stay **directory + WA quote + rating**, not a marketplace checkout (D4).

---

## Definition of mitigated (Phase 1A)

| Check | Done when |
|-------|-----------|
| Owner | Signed-in only on `/app`; pick still authorizes; Registry CTA → requests |
| Tech | Apply → wait → pick; walk-up cannot look like owner-authorized without link |
| Supplier | Correct verify kind; listing Claimed/Rated; Gas & Dsl = WA only |
| System | No new tab; no fake Verified; no Next rewrite |

---

*HMC · Verifos · align with `VERIFOS_DEV_BUILD.md`*
