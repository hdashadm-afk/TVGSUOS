# Dipstify Station — Plan

Last updated: 2026-08-12  
Status: Active plan (Phase A)  
Owner: Edgardo Castro  

Companion to `docs/ECOSYSTEM_REPO_TREE.md`. Execution stays inside **Dipstify / Station** until founder says Station is done enough.

---

## 1) Job of Station

Daily ground truth for 1–2 station Smart Stations (Helium first): variance, ops signals, compliance, people, and simple money — without stuffing everything into one mega-app or one mega-DB.

---

## 2) Min crew (product assumption)

| Role | Count (1–2 stations) | Primary module |
|---|---|---|
| Owner | 1 | Owner’s Lens |
| Operator | 1 | OpsVerified (Fuel-ops) |
| Admin | 1 | AdminVerified + **can** hold Staff + PnL/Acctg |

**Seat rule (locked this session):** PnL/Acctg **can** be the same person as HR Admin, **or** a separate position if the owner decides. Product must support combine **or** split.

**Commercial (proposed, not yet SKU-live):** Admin Pack = StaffVerified + PnLVerified at **₱9,999** (entry). Station Core (Lens + Ops + AdminVerified) priced separately.

---

## 3) Module map

| Module | Repo today | DB today | Plan |
|---|---|---|---|
| Owner’s Lens | `katiwala-owner-os-` | Station shared `jbhfd…` | Daily loop home |
| AdminVerified | `adminverified` | Same `jbhfd…` | Compliance / gov’t |
| OpsVerified | `fuel-ops` | Ops `wtwgsy…` | Attach signals → Lens; **later** merge DB → Station shared |
| StaffVerified | `staffverified-app` | Staff `ttytdu…` | Keep separate; Admin Pack |
| PnLVerified | thin / Excel OK | none required | Lives with Staff DB when built; flexible seats |

**Out of Station Phase A:** StationRescue depth, Delivery, Franchise, RideVerified, ODO marketplace, KOS→Dipstify GitHub rename.

---

## 4) Database target

| Now | Ideal |
|---|---|
| Station shared + Ops + Staff (+ ODO + SR outside) | Station shared = Lens + Admin + **Ops merged** |
| | Staff (+ PnL) = one Admin DB |
| | ODO / SR stay separate pillars |

Ops→Station merge ≈ **~$10/mo** compute; main win = streamline + less bridge risk. **Do not start merge without risk pack + founder approve.**

---

## 5) Execution sequence (Station only)

| Step | What | Who | Pass / unlock |
|---|---|---|---|
| **A — Prove Helium daily** | Lens opens; Ops signal live; no “not configured” | Claude + founder env | `batch f1 smoke pass` |
| **B — Attach modules** | F2 Staff summary → Lens; F3 Admin signals → Lens; F4 PnL summary when ready | Claude | `batch f2/f3/f4 smoke pass` |
| **C — Photo path** | ≥50 photos/day in **object storage**, not DB blobs; metadata on Ops until merge | Claude | D.1 done → no D.2 delete until proven |
| **D — Admin Pack** | Staff solid + light PnL (cash/daily); combine/split seats | Claude after Station Core works | Founder prices ₱9,999 live when ready |
| **E — Ops DB merge** | `wtwgsy…` → `jbhfd…` | Own Cursor session | Risk pack → `approve` → run until done |
| **F — Scale gate** | 1–10 Helium → 100 PH early GTM | Founder GTM | See scale gates in Scale Plan |

Suggested Claude order (from 2026-08-11 handoff): finish **D.1** → Phase E design approve → **F1** Ops→Lens → F2/F3 → Helium E2E (G).

---

## 6) Scale load (don’t break)

Per station / day: **2 shift logs** + **≥50 photos**.  
Postgres = structured; **object storage + CDN = photos**. Lens = exceptions/signals, not raw photo dumps.

---

## 7) Success (Station “done enough”)

1. Helium owner: Lens daily loop works (variance / ops signal / next action).  
2. Operator: Shift log + photos path reliable.  
3. Admin: compliance visible; Staff usable; PnL light or Excel with clear seat assign.  
4. No critical auth/RLS holes on Station paths.  
5. Founder says **Station done enough** → unlock next pillar.

---

## 8) Founder actions only

- Env secrets for F1 (Ops edge + Vercel dipstify)  
- Helium EOM billing (₱7k + ₱1k/station)  
- Approve Phase E design / Ops merge risk pack  
- Unlock phrases when ready (not Claude’s call)
