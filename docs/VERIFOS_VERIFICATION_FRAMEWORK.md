# VERIFOS — Verification-as-a-Service Platform
**Master Brand Architecture | Universal Verification Framework**

**Locked:** Aug 20, 2026 | **HMC Legal Entity**

**How we use this (20 Aug 2026):** §§1–5 and §11 are the 2026 job file for **Verifos Station**. §12 fences Garage to 2027. §§6–10 and §13 are direction, not a build list.

**Graduation, not a gate:** new space. Accept the minimum. The standard is the goal. Who follows it is rewarded (badge / credits). No hard lockout on an incomplete record. **Written standard + phases:** `docs/VERIFOS_STANDARD.md`. Operating map: `docs/VERIFOS_OPERATING_LOCK.md`.

---

## 1. BRAND ARCHITECTURE

| Level | Name | Role |
|-------|------|------|
| **Legal** | HMC (Helium Mktg Corporation) | Holding company, contracts, liability |
| **Master Brand** | **Verifos** | Customer-facing platform |
| **Product** | Verifos Station | Pump registry + verified tech |
| **Product** | Verifos Garage | Vehicle vault + self-diagnostic |
| **Product** | Verifos Ops | Backend SaaS (inventory, scheduling, invoicing) |
| **Badge** | Verifos Verified | Universal trust signal signal across all assets |

---

## 2. THE 5 UNIVERSAL VERIFICATION PARAMETERS

Every asset that enters the system must have:

| # | Parameter | What It Is | Example (Pump) | Example (Vehicle) | Example (Generator) |
|---|-----------|-----------|----------------|-------------------|----------------------|
| **1** | **Asset Identity** | Unique fingerprint | Model, serial, install date, station location | VIN, plate, engine number, color | Model, kVA rating, serial, site location |
| **2** | **Asset History** | Timeline of all events | Install → Service #1 → Service #2 → Calibration | Purchase → Service #1 → Accident → Sale | Install → PM #1 → Overhaul → Transfer |
| **3** | **Event Documentation** | Proof of what happened | Photos, diagnosis, parts used, test results | Photos, repair type, parts, odometer | Photos, hours run, parts, load test |
| **4** | **Compliance Status** | Regulatory standing | BIR cal cert, DOE record, environmental permit | LTO registration, emission cert, insurance | Environmental permit, noise cert, safety inspection |
| **5** | **Chain of Custody** | Who owns/operates it now | Station owner name, tax ID, lease status | Registered owner, OR/CR, encumbrance | Site operator, lease agreement, maintenance contract |

**Without all 5, the asset is "registered." With all 5, it is "verified."**

---

## 3. THE 4 OWNER PROTECTION PARAMETERS

Every service event must generate documentation that protects the owner:

| # | Parameter | Why It Protects | What Happens Without It |
|---|-----------|----------------|-------------------------|
| **1** | **Pre-Service State** | Proves condition before anyone touched it | Tech claims "it was already broken" — owner has no proof |
| **2** | **Service Provider Identity** | Accountability — who did what | Anonymous work — no one to hold responsible |
| **3** | **Work Performed + Parts Used** | Proof of what was actually done | Tech says "replaced pulser" — actually just reset error code |
| **4** | **Post-Service Test** | Proof the fix worked before handoff | Pump fails 2 hours after tech leaves — was it ever fixed? |

**Protection = documentation. Not insurance. Not warranty. Evidence.**

---

## 4. THE 3 SERVICE PROVIDER VERIFICATION PARAMETERS

Anyone who touches the asset must be verifiable:

| # | Parameter | Minimum Standard | Gold Standard |
|---|-----------|-----------------|---------------|
| **1** | **Identity & Credentials** | Government ID, trade license, business registration | Industry certification, factory training, continuing education |
| **2** | **Track Record** | 10+ completed jobs, 4.0+ rating | 100+ jobs, 4.8+ rating, zero complaints, specialization badges |
| **3** | **Insurance / Bond** | General liability coverage | Performance bond, errors & omissions insurance, warranty backing |

---

## 5. THE TRANSACTION RECORD STANDARD

Every service event, regardless of asset type, must capture:

```
VERIFICATION RECORD
├── Asset ID: [unique identifier]
├── Event Type: [install | repair | PM | calibration | inspection | accident]
├── Timestamp: [date + time, immutable]
├── Location: [GPS coordinates or site ID]
│
├── SERVICE PROVIDER
│   ├── Name / Business
│   ├── Verification Level [basic | verified | gold]
│   ├── License / Cert Numbers
│   └── Insurance Policy (if applicable)
│
├── PRE-SERVICE
│   ├── Condition Photos [min 2]
│   ├── Meter Reading / Hours Run / Odometer
│   ├── Error Codes / Fault Indicators
│   └── Owner Complaint / Reported Issue
│
├── WORK PERFORMED
│   ├── Diagnosis [standardized taxonomy]
│   ├── Parts Used [part number, serial, supplier]
│   ├── Labor Hours
│   ├── Photos [before, during, after — min 3]
│   └── Quotation [pre-approved by owner]
│
├── POST-SERVICE
│   ├── Test Results [calibration, flow, load, function]
│   ├── Final Meter Reading / Hours / Odometer
│   ├── Warranty Terms [part + labor]
│   └── Owner Acknowledgment [digital signature]
│
├── COMPLIANCE
│   ├── Cert Generated [BIR, DOE, LTO, etc.]
│   ├── Cert Number
│   └── Expiry Date
│
└── COST
    ├── Labor
    ├── Parts
    ├── Platform Fee
    └── Total [quoted vs. actual]
```

---

## 6. VEHICLE DIAGNOSTIC TAXONOMY (Verifos Garage)

### ICE Motorcycle

| System | Common Failures | Diagnostic Trigger | Standard Code |
|--------|----------------|-------------------|---------------|
| **Engine** | Overheating, oil leak, piston wear, valve clearance | Temp light, smoke, power loss, knocking | ENG-01 to ENG-20 |
| **Fuel** | Clogged carb, dirty injector, fuel pump failure | Hard start, stall at idle, poor acceleration | FUL-01 to FUL-15 |
| **Electrical** | Battery drain, regulator failure, starter motor | No crank, dim lights, charging light | ELE-01 to ELE-20 |
| **Brake** | Worn pads, fluid leak, master cylinder | Spongy lever, squeal, fluid low | BRK-01 to BRK-12 |
| **Transmission** | Clutch slip, gear jump, chain wear | Jerky shift, noise, chain slack | TRN-01 to TRN-15 |
| **Cooling** | Radiator leak, thermostat stuck, fan failure | Overheat, coolant loss, temp spike | COO-01 to COO-10 |
| **Tires/Wheels** | Puncture, bearing wear, alignment | Vibration, wobble, uneven wear | TIR-01 to TIR-08 |

### ICE 4-Wheel (Car/SUV)

| System | Common Failures | Diagnostic Trigger | Standard Code |
|--------|----------------|-------------------|---------------|
| **Engine** | Timing belt, head gasket, spark plugs, sensor failure | Check engine, rough idle, overheating, power loss | ENG-01 to ENG-30 |
| **Transmission** | ATF leak, clutch slip, CVT belt wear, solenoid | Jerky shift, delayed engagement, whining | TRN-01 to TRN-25 |
| **Brake** | Pad wear, rotor warp, ABS sensor, caliper seize | Squeal, vibration, ABS light, pull | BRK-01 to BRK-18 |
| **Suspension** | Shock leak, bushing wear, tie rod, ball joint | Bounce, noise, uneven tire wear, loose steering | SUS-01 to SUS-15 |
| **Electrical** | Alternator, battery, starter, ECU, wiring | No start, dim lights, erratic gauges, codes | ELE-01 to ELE-25 |
| **Fuel** | Pump failure, injector clog, filter, EVAP leak | Hard start, stall, poor mileage, gas smell | FUL-01 to FUL-18 |
| **Cooling** | Radiator, water pump, thermostat, hose | Overheat, coolant loss, heater cold | COO-01 to COO-15 |
| **AC** | Compressor, condenser, refrigerant leak, fan | Warm air, noise, clutch not engaging | AIR-01 to AIR-12 |
| **Exhaust** | Catalytic converter, O2 sensor, muffler leak | Loud noise, check engine, failed emission | EXH-01 to EXH-10 |

---

## 7. TAM ANALYSIS

### Pumps (Verifos Station) — B2B

| Metric | Low | Mid | High |
|--------|-----|-----|------|
| Revenue per station/year | $800 | $1,700 | $2,800 |
| Global TAM (3M stations) | **$2.4B** | **$5.1B** | **$8.4B** |
| SAM Emerging (2.1M) | **$1.68B** | **$3.57B** | **$5.88B** |

### Vehicles (Verifos Garage) — B2C with Education Layer

| Segment | Assets | Conversion | TAM (Mid) |
|---------|--------|-----------|-----------|
| **Motorcycles** | 300M | 6% | **$3.5B** |
| **Cars/4W** | 120M | 12% | **$2.8B** |
| **Commercial** | 80M | 20% | **$3.1B** |
| **EV (current)** | 5M | 15% | **$147M** |
| **EV (projected 2030)** | 50M+ | 15% | **~$1.5B** |
| **TOTAL EMERGING** | | | **$13.7B** |

### By Region (Vehicle TAM)

| Region | TAM |
|--------|-----|
| **Philippines** | **$262M** |
| **ASEAN** | **$3.8B** |
| **All Emerging Markets** | **$9.7B** |

---

## 8. PRICING TIERS (Verifos Garage)

| Tier | What They Get | Price |
|------|--------------|-------|
| **Verifos Garage Free** | Basic registry, manual log | ₱0 |
| **Verifos Garage Plus** | Self-diagnostic tool, code library, symptom checker | ₱300–₱500/mo |
| **Verifos Garage Pro** | Plus + verified mechanic dispatch + auto-docs | ₱800–₱1,200/mo |
| **Verifos Garage Fleet** | Multi-vehicle, PM scheduling, compliance reports | ₱2,000–₱5,000/mo |

**Blended average: ₱900/mo = $196/yr**

---

## 9. THE VERIFOS FLYWHEEL

```
Free Registry (Verifos Station/Garage) → Trust Builds
    ↓
Verified Service Provider Network → Accountability
    ↓
Paid Intelligence Tiers (Plus/Pro/Fleet) → Revenue
    ↓
Supplier Data Intelligence → Platform Stickiness
    ↓
Network Effects → More Assets → Better Data → More Suppliers
```

---

## 10. COMPETITIVE LANDSCAPE

| Competitor | Has | Missing |
|------------|-----|---------|
| **Gilbarco** | Hardware + basic platform | Free registry, verified tech, content, supplier intel |
| **Bluesky / Joyfueling** | Station ops (400 stations) | Trust layer, verification, content |
| **SmartEquip** | Parts procurement | Registry, ops, compliance, two-sided marketplace |
| **KSB Guard** | Predictive maintenance | Independent, free registry, marketplace |
| **Carfax** | Vehicle history (US only) | Emerging markets, pumps, equipment, ops layer |

**No one has the full stack. Verifos is creating the category.**

---

## 11. LIABILITY FRAMEWORK

| Party | Liable For | Not Liable For |
|-------|-----------|----------------|
| **HMC / Verifos** | Verification accuracy, docs processing, platform bugs | Vehicle/pump condition, repair quality, post-sale issues |
| **Service Provider** | Work performed, parts installed, diagnosis accuracy | Platform bugs, data errors |
| **Asset Owner** | Maintenance schedule, accurate reporting, payment | Provider's workmanship (if unverified) |

**Verifos verifies. Verifos documents. Verifos does not insure, warranty, or guarantee outcomes.**

---

## 12. PHASE ROADMAP

| Year | Focus | Product | TAM |
|------|-------|---------|-----|
| **2026** | Prove model | Verifos Station (pumps) + Verifos Ops | $5B |
| **2027** | Expand vertical | Verifos Garage (ICE vehicles) | $13.7B |
| **2028** | Scale | EV chargers, generators | +$2B |
| **2029+** | Platform | Industrial equipment, HVAC, agri | +$50B+ |

---

*Locked: Aug 20, 2026 | HMC | Verifos*


---

## 13. FUTURE REVENUE STREAMS (2027+)

**Same data. Multiple payers. Trust infrastructure for physical assets.**

### The Multi-Party Flywheel

| Party | Why They Need Verifos Data | Revenue Stream | Timeline |
|-------|------------------------|----------------|----------|
| **Owner** | Protection, proof, resale value | Subscription (₱200–₱1,500/mo) | 2026 (now) |
| **Buyer** | Know what they're buying | One-time report (₱500–₱1,500) | 2027 |
| **Insurance** | Price risk accurately | Data partnership (₱100–₱300/policy) | 2028 |
| **Bank / Lender** | Verify asset before loan | Verification fee (₱300–₱500/loan) | 2028 |

### Buyer Report Scenario
> *"I'm buying a 2019 Vios. Seller says 'well-maintained.' I pull the Verifos Report for ₱800. Full history: 12 services, last brake job 8K km ago, no accidents. Or — 3 services, last one 2 years ago, pending recall. I know what I'm paying for."*

**Revenue:** ₱500–₱1,500 per report. Generated from owner's existing vault data.

### Insurance Integration Scenario
> *"Verifos-verified vehicles with complete service history get 15% discount on comprehensive insurance. Insurer pays Verifos ₱100 per verified policy."*

**Revenue:** ₱100–₱300 per policy. Recurring as policies renew.
**Requirement:** Partnership with 1–2 major insurers (Malayan, Pioneer, AXA).

### Bank Verification Scenario
> *"Metro Bank requires Verifos Report for all used car loans above ₱500K. Verifos charges ₱300 per verification. Bank reduces default risk. Buyer gets approved faster."*

**Revenue:** ₱300–₱500 per loan. High volume, low friction.
**Requirement:** Partnership with 2–3 major banks (BDO, BPI, Metrobank).

### The Expanded Revenue Model

| Stream | Who Pays | Price | Frequency | Est. % of Revenue |
|--------|----------|-------|-----------|-------------------|
| Owner subscription | Owner | ₱200–₱1,500/mo | Recurring | 40% |
| Buyer report | Buyer | ₱500–₱1,500 | One-time | 20% |
| Insurance data | Insurer | ₱100–₱300/policy | Per policy | 20% |
| Bank verification | Lender | ₱300–₱500/loan | Per loan | 15% |
| Supplier intel | Supplier | $5K–$20K/yr | Annual | 5% |

**The same asset record generates 4+ revenue events over its lifecycle.**

### Market Maturity Assessment

| Market | Buyer Reports | Insurance | Bank Verification |
|--------|--------------|-----------|-------------------|
| **Philippines** | 🟡 Medium (growing used car market) | 🟡 Medium (insurers price on risk) | 🔴 Low (banks don't yet require service history) |
| **ASEAN** | 🟢 High (Thailand, Indonesia large used markets) | 🟡 Medium | 🟡 Medium |
| **US/Europe** | 🟢 High (Carfax standard) | 🟢 High (insurers use telematics + history) | 🟢 High (lenders require vehicle history) |

**PH is 3–5 years behind US on insurance/bank integration. But the direction is clear. Verifos owns the data when the market matures.**

### The Vision

> *"Verifos is not a consumer app. Verifos is the trust infrastructure for physical assets. Owners log. Buyers verify. Insurers price. Banks lend. All from the same dataset."*

**This is the $13B+ TAM.** Not just subscriptions. Trust infrastructure for emerging markets.

---

*Updated: Aug 20, 2026 | HMC | Verifos*
