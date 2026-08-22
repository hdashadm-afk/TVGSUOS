# Verifos — operating lock

Locked: 21 Aug 2026  
Owner: Edgar “Best” Dada · HMC  
Framework: `docs/VERIFOS_VERIFICATION_FRAMEWORK.md`  
Masterplan: `docs/MASTER_DIRECTION.md` §0

**Customer brand:** **Verifos**. Station Rescue / SR / Vero retired in product copy. Engineering repo may still be `station-rescue`.

**How we use the framework:** sections 1–5 and 11 are the job file for a Helium pump this year. TAM, Garage, insurance, and banks stay in the framework as later. They are not this week’s build.

**Graduation, not a gate (locked 20 Aug 2026):** This is a new space. There is **no hard gate** on the Verifos record. Accept the **minimum**. The **standard** is the goal. Who follows the standard is **rewarded** (badge now; credits when the ledger is named). Incomplete still saves. We never fake Verified.

**The standard (written) and the phases (what we ask):** `docs/VERIFOS_STANDARD.md`. The standard does not shrink. The ask is phased.

---

## Names

| Layer | Name | Now |
|---|---|---|
| Legal | HMC | Contracts, PIC |
| Master brand | **Verifos** | Trust / service layer — protect owners, guide technicians |
| **2026 product line** | **Verifos Stations** (Phase **1A**) | Stations: pumps, verified tech, suppliers. Same app at verifos.co. **Ship now.** |
| **Next product line** | **Verifos Vehicles** (Phase **1B**) | Same trust layer for vehicles — **not** the vehicle marketplace. **After 1A.** Do not build now. |
| Public URL | **verifos.co** | Live (20 Aug 2026). Alias: station-rescue.vercel.app |
| Product inbox | **support@verifos.co** | Routes to shared ops Gmail (`hmcp119105@gmail.com`). Not Lens. Not `support@stationrescue.com`. |
| Deploy / engineering | Vercel project `station-rescue` · repo `station-rescue` | Engineering names only — customer brand is Verifos |
| Badge | Verifos Verified | Earned when the standard is met — never a lockout |

Registered ≠ verified. Protection = evidence, not insurance. Minimum in → standard as the goal → badge/credits for who gets there.

## Graduation (no hard gate)

Full text: `docs/VERIFOS_STANDARD.md`.

| Rung | Meaning | What we do |
|---|---|---|
| **Minimum** | Job / asset can exist with whatever they have today | Save it. No block. |
| **Standard** | Written once — serial, pre-service, who did it, work + part, post-test (then photos, history, compliance by phase) | Prompt. Reward (badge; credits later) |
| **Verified** | All 5 asset parameters, including compliance when it exists | Never fake this because BIR is missing |

Do not lock a tech out of a Helium job for a missing serial, photo, or cert.

---

## Phases (ask only)

| Phase | Ask now | Not yet |
|---|---|---|
| **A — now** | Save on symptom. Prompt serial + before-note + work + post-test | Photos required, GPS, e-sign, BIR, credits |
| **B — next** | Photos. Timeline by serial | Government API |
| **C** | Owner ack. Compliance upload/link. Credits if ledger named | Insurer / bank |
| **D — 2027+** | Gold / GPS / Garage | — |

---

**2026 commercial (unchanged):** owners free + verified. Tech ₱500/mo after first month free. Supplier ₱1,000/mo after first month free, L2 to list. Assessment ₱500 (₱250 Verifos / ₱250 tech). Job txn ₱250. **No % of job value.** Pay placeholder. This sheet wins over Garage prices in the framework.

**Verifos Ops this year** = the job/inventory record on **Verifos Stations (1A)**. **Not** Dipstify books. **Verifos Vehicles (1B)** = after Stations. **ODO-Vehicles (3A)** and **ODO-Properties (3B)** = marketplaces — separate products.

---

## Ecosystem phase sequence (locked 20 Aug 2026)

| Phase | Product | Role |
|---|---|---|
| **1A** | Verifos Stations | Trust layer — stations. **Now.** |
| **1B** | Verifos Vehicles | Trust layer — vehicles. After 1A. |
| **2** | Dipstify | Owner daily ops / books. Sibling. |
| **3A** | ODO-Vehicles | Marketplace — vehicle transactions. |
| **3B** | ODO-Properties | Marketplace — property transactions. |

Masterplan: `docs/MASTER_DIRECTION.md` §0.

---

## Framework → live Verifos Stations

| Framework | Live today | Gap this year |
|---|---|---|
| Asset identity | Serial field on new job + diagnose screen; brand, station, unit | Install date optional; non-Helium custody fields |
| Asset history | Owner history groups by serial; event count on diagnose | Full timeline UI per unit (Phase B) |
| Event docs | Four protections tracked + progress bar; pre/post fields | Photos (Phase B) |
| Compliance | Points to Dipstify books | Do not duplicate BIR in Verifos |
| Chain of custody | Helium cluster seed | Owner name / tax / lease when others join |
| Pre-service state | Dedicated `pre_service_note` — separate from symptom | Photos when Phase B |
| Provider identity | L1/L2/L3 + logged-in tech on job | Already the right model |
| Work + parts | `part_needed`, `work_report` | Part number / supplier when known |
| Post-service test | `post_test_note` on diagnose screen | — |
| Trust explainer | `/trust` — 5 asset params + 4 protections + listing states | — |
| Transaction record | Assessment + quote + txn fee flags | Full §5 file on one screen |
| Public domain | **verifos.co** live | PC DNS cache may lag; phone confirmed |

---

## First Helium job (Phase A)

On `/provider/field` a job may start on symptom alone. The **standard** (see `docs/VERIFOS_STANDARD.md`) is still serial, before-note, who did it, work + part, post-test. Prompt those. Do not block. Badge path when they are present.

That is Verifos Station. Not Garage. Not a new app. Customer name is **Verifos** — not Station Rescue / SR.

---

## Domain

**Done (20 Aug 2026):** `verifos.co` + `www` on Vercel project `station-rescue`. Namecheap A `@` → `76.76.21.21`, CNAME `www` → `cname.vercel-dns.com`. Live on phone.

**Still founder:** Supabase Auth Site URL / Redirect URLs → `https://verifos.co` (and `https://verifos.co/**`). Optional: redirect stationrescue.com → verifos.co.

Do not build Garage, buyer reports, or bank/insurance streams.

## Dev Build reconcile (22 Aug 2026)

`docs/VERIFOS_DEV_BUILD.md` is the Cursor build order **mapped to live Vite**.

**Standard practice:** keep/reject/defer rows use stable codes — **K#** keep, **R#** reject, **D#** defer. Cite codes in chat (“don’t do R1”, “ship K2”, “D1 = vehicles Phase 2”). Never renumber silently. Forever reject **R1, R2, R4, R5, R7, R8**. Defer **D1–D5**. Keep **K1–K11**.

**K10 / R5:** One suppliers lane for **all** — techs · parts · oil · facilitators · fixers · trainers. Live tab = Suppliers. Reject only an extra/split 6th tab. **Founder: R4 + R5 must keep; R2 agree; D3 gradual; D4 later; D5 agree.**

Ship on `station-rescue` against those codes — not a Next rewrite (R1).

**ICP gap mitigations (direction-consistent):** `docs/VERIFOS_MITIGATE_ICP.md` (M1–M10). Priority: auth/pick truth → supplier lane honesty → compliance cloud.
