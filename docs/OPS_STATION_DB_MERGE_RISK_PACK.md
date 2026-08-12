# Ops → Station shared DB — Risk Pack

Last updated: 2026-08-12  
Status: **Design only — do not execute until founder approves**  
Owner: Edgardo Castro  
Goal: Supabase projects **5 → 4** (merge Ops `wtwgsy…` into Station shared `jbhfd…`)

Claude Station Phase A (D.1 → F1) is **not** this work. Run this only after Helium Ops→Lens attach is stable, in a dedicated session.

---

## 1) Objective

Move OpsVerified (Fuel-ops) data home from:

- **From:** `wtwgsygwofyqmxgckmjc`  
- **To:** `jbhfdmujqrtqkhacfegl` (Lens + AdminVerified already here)

So Station minimum bundle shares one DB: **Lens + Admin + Ops**.

**Cash impact:** ~**$10/mo** (one Micro compute line) if both stay in the same Pro org. Main win = streamline + fewer bridges — not a large bill cut.

**Out of scope:** Staff DB, ODO, StationRescue, PnL→Station shared, GitHub renames.

---

## 2) Risks

| # | Risk | Severity | Blocks start? |
|---|---|---|---|
| R1 | **Helium downtime** during cutover (live stations on Fuel-ops) | High | Yes — need maintenance window |
| R2 | **Auth model mismatch** — Fuel-ops uses custom username/PIN (`USER_DB` / station-scoped), not Supabase Auth like Lens | High | Yes — must design identity map before data move |
| R3 | **RLS / client_id bleed** — wrong policies expose station A to station B | High | Yes |
| R4 | **Photo / storage** — `smp_photo_metadata` + object storage paths still point at Ops project | High | Yes — migrate refs or dual-read period |
| R5 | **Edge secrets / F1 bridge** — `ops-lens-summary`, `LENS_SYNC_SECRET`, Vercel env become wrong or double | Medium | Yes — rewrite to same-project after merge |
| R6 | **localStorage leftovers** in Fuel-ops still not fully on any DB | Medium | Soft — inventory before cutover |
| R7 | **Irreversible delete** of Ops project before soak | High | Yes — soak then pause, don’t delete day-1 |
| R8 | **Scope creep** into Staff/PnL/Rescue “while we’re here” | Medium | Process — hard stop list |

---

## 3) Mitigations

| Risk | Mitigation | Owner |
|---|---|---|
| R1 | Announce window; read-only Ops optional; rollback = keep Ops project live until soak pass | Founder + agent |
| R2 | Written identity plan: map PIN users ↔ profiles/`station_id`; no silent Auth swap mid-flight | Agent drafts; founder approves |
| R3 | All Ops tables get `station_id`; RLS mirror Lens patterns; staging dry-run or branch DB if available | Agent |
| R4 | Photos stay in object storage; update metadata URLs/project; never copy blobs into Postgres | Agent |
| R5 | After merge: Lens reads Ops tables in-process or same-project function; retire cross-project secret when green | Agent |
| R6 | Checklist of Fuel-ops localStorage keys still dirty — fix or accept before cutover | Agent |
| R7 | Ops project **paused** after 14-day soak, deleted only on explicit founder phrase | Founder |
| R8 | This pack’s out-of-scope list is binding | Founder interrupt |

---

## 4) Step / Where / How (execute only after approve)

| Step | Where | How |
|---|---|---|
| 0 | Both projects | Schema inventory: Ops tables/functions/storage vs Lens; conflict names |
| 1 | Doc | Identity + RLS plan signed off (R2/R3) |
| 2 | `jbhfd…` | Create Ops schemas/tables (additive); no drop on Ops yet |
| 3 | Dual-write or one-way sync | Backfill Ops → Station; verify row counts / Helium station |
| 4 | Fuel-ops app | Point `SUPABASE_URL` to Station shared; verify login + shift log + photos |
| 5 | Lens | Point Ops signal to same-project source; F1 cross-project bridge deprecated |
| 6 | Soak | ≥14 days Helium production on Station shared only |
| 7 | Founder | Pause Ops project; delete only with phrase: `ops project delete approved` |

---

## 5) Success check

- [ ] Helium operator: shift log + photos work on Station shared  
- [ ] Helium owner: Lens Ops signal still live (same or better than F1)  
- [ ] AdminVerified unchanged on `jbhfd…`  
- [ ] No cross-station data in spot checks  
- [ ] Org billing shows one fewer Micro compute (~$10) after Ops paused  
- [ ] Staff / ODO / SR projects untouched  

---

## 6) Founder decision

Reply with one:

- `ops merge risk accepted — run until done` → execute this pack end-to-end  
- `ops merge deferred` → keep dual DB; Claude continues Station product only  
- `ops merge revise` + note → adjust pack, don’t start  

**Do not start on silence or on F1 pass alone.**
