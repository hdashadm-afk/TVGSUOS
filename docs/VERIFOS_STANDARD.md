# Verifos Station — the standard, phased

Locked: 20 Aug 2026  
Owner: Edgar “Best” Dada · HMC  
Product: Verifos Station (live Verifos)  
Parent: `docs/VERIFOS_VERIFICATION_FRAMEWORK.md` · `docs/VERIFOS_OPERATING_LOCK.md`

**The standard is written once. It does not shrink.**  
**What we ask this month is phased.** Minimum is accepted. Who reaches the standard is rewarded (badge now; credits when the ledger is named). No hard gate. We never fake Verified.

---

## The standard (full)

This is the goal for every pump and every service event. Phase does not delete a line. Phase only decides what we **prompt**, what we **reward**, and what we **do not block**.

### A. Asset — 5 parameters

Without all 5 the asset is **registered**. With all 5 it is **verified**.

| # | Parameter | Standard (pump) |
|---|-----------|-----------------|
| 1 | **Identity** | Model, **serial from the plate**, install date if known, station + unit |
| 2 | **History** | Timeline of events on that serial: install → service → calibration → … |
| 3 | **Event documentation** | Photos, diagnosis, parts, test results on each event |
| 4 | **Compliance** | BIR cal / DOE / environmental — on file or linked. Verifos does not invent the cert |
| 5 | **Chain of custody** | Who owns/operates it now (Helium cluster today; owner name / tax / lease when others join) |

### B. Every service event — 4 owner protections

Protection = evidence. Not insurance. Not warranty.

| # | Parameter | Standard |
|---|-----------|----------|
| 1 | **Pre-service state** | Condition **before anyone opened it** (note; photos when that phase is on) |
| 2 | **Provider identity** | Logged-in tech. Listing trust stays L1/L2/L3. Referral ≠ verified |
| 3 | **Work + parts** | What was done, part named (number / supplier when known) |
| 4 | **Post-service test** | What was tested before handoff (flow, cal, function) |

### C. Everyone who touches the asset — 3 provider parameters

| # | Parameter | Standard | Gold (later) |
|---|-----------|----------|----------------|
| 1 | Identity & credentials | Government ID, trade / business docs (L2) | Factory / TESDA / OEM certs |
| 2 | Track record | Completed jobs + honest rating | High volume, clean complaints, specialty badges |
| 3 | Insurance / bond | Not required to start | Liability / bond / warranty backing |

### D. Event record — fields at standard

When an **event** is at standard it can show:

- Asset ID (serial + station + unit + brand)  
- Event type (install / repair / PM / calibration / inspection)  
- Time (saved timestamp is enough at first)  
- Provider (logged-in tech; L2 when they list for paid search)  
- Pre-service note  
- Diagnosis + parts + labor/quote the owner approved  
- Post-service test  
- Quoted vs actual as text  

**Later on the same record (not deleted from the standard):** min 2 before photos, during/after photos, GPS, digital owner ack, cert number, gold provider level.

---

## How we phase the ask

| Phase | When | We accept (minimum) | We prompt toward standard | We reward | We do not ask yet |
|---|---|---|---|---|---|
| **A** | Now — Helium `/provider/field` | Station, equipment, brand, symptom. Job saves. | Serial, pre-service note, part/work, post-test | Bar on the job. “Standard — badge path” when those four + serial are present | Required photos, GPS, e-sign, BIR, credits ledger, Garage |
| **B** | Next | Same | Phase A + **photos** (before / after). Jobs **grouped by serial** (history) | Badge on the event. Name **credits** | Government API, gold/bond |
| **C** | After B is in use | Same | Owner acknowledgment. Compliance as **upload or link**, not a fake cert | Credits on complete-standard events (once ledger exists) | Insurer / bank / buyer report |
| **D** | 2027+ | Same | GPS, gold provider, Garage, other assets | Full **Verifos Verified** on the asset when all 5 exist | — |

Phase A is live in the field job file. Phases B–D are not built until that phase starts. The table above is the backlog, not a permission to skip A.

---

## Rewards

| Reward | When | Note |
|---|---|---|
| Progress bar / “on the way” | Phase A | Always visible. Incomplete is OK |
| **Badge path** on the event | Event hits standard (Phase A definition, then B adds photos) | Not the same as asset **Verified** |
| **Credits** | Phase C, after the founder names the ledger | Do not invent a second points brand |
| **Verifos Verified** (asset) | All 5 asset parameters actually on file | Never award because BIR is missing |

---

## What does not move with phase

- Owners free. Tech ₱500 / supplier ₱1,000 after first month free. Assessment ₱500. Txn ₱250. No % of job value.  
- Three ICPs only this year. Dipstify remains owner books. Garage 2027.  
- Listing L2 stays a marketplace trust step until the founder changes it — not a Verifos-record lockout.
