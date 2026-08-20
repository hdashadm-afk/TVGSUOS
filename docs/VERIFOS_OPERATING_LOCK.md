# Verifos — operating lock

Locked: 20 Aug 2026  
Owner: Edgar “Best” Dada · HMC  
Framework: `docs/VERIFOS_VERIFICATION_FRAMEWORK.md`  
Masterplan: `docs/MASTER_DIRECTION.md` §0

**How we use the framework:** sections 1–5 and 11 are the job file for a Helium pump this year. TAM, Garage, insurance, and banks stay in the framework as later. They are not this week’s build.

**Graduation, not a gate (locked 20 Aug 2026):** This is a new space. There is **no hard gate** on the Verifos record. Accept the **minimum**. The **standard** is the goal. Who follows the standard is **rewarded** (badge now; credits when the ledger is named). Incomplete still saves. We never fake Verified.

**The standard (written) and the phases (what we ask):** `docs/VERIFOS_STANDARD.md`. The standard does not shrink. The ask is phased.

---

## Names

| Layer | Name | Now |
|---|---|---|
| Legal | HMC | Contracts, PIC |
| Master brand | **Verifos** | Customer-facing |
| 2026 product | **Verifos** | Pumps + verified tech. Same app. |
| Public URL | **verifos.co** | Canonical |
| Deploy URL | station-rescue.vercel.app | Until DNS is attached |
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

**Verifos Ops this year** = the Rescue job/inventory record. **Not** Dipstify books. **Verifos Garage = 2027.**

---

## Framework → live Rescue

| Framework | Live today | Gap this year |
|---|---|---|
| Asset identity | Helium station + nozzle label + brand + year | **Serial from the plate** |
| Asset history | Field jobs list per tech/phone | Timeline on the **unit**, not only the job |
| Event docs | Symptom, checks, error code, parts, quote, report | Pre photos (min 2) + after photos |
| Compliance | Owner knowledge articles; Dipstify books | Do not duplicate BIR in Rescue. Point, don’t rebuild |
| Chain of custody | Helium cluster seed | Owner name / tax / lease when a non-Helium station joins |
| Pre-service state | Symptom details on arrival | Written **before anyone opened the head** |
| Provider identity | L1/L2/L3 + logged-in tech | Already the right model. Referral ≠ verified |
| Work + parts | `part_needed`, `work_report` | Part number / supplier when known |
| Post-service test | Missing | Flow/cal/function note before handoff |
| Transaction record | Assessment + quote + txn fee flags | Full §5 file comes job by job, not as one screen |

---

## First Helium job (Phase A)

On `/provider/field` a job may start on symptom alone. The **standard** (see `docs/VERIFOS_STANDARD.md`) is still serial, before-note, who did it, work + part, post-test. Prompt those. Do not block. Badge path when they are present.

That is Verifos Station. Not Garage. Not a new app.

---

## Domain (you, at the registrar)

1. Open the account that registered **verifos.co**.  
2. Add the domain to the **station-rescue** Vercel project (same as station-rescue.vercel.app).  
3. Put the A / CNAME records Vercel shows.  
4. Tell me when the domain answers — I wire redirect from stationrescue.com and the privacy URL list.

Do not build Garage, buyer reports, or bank/insurance streams.
