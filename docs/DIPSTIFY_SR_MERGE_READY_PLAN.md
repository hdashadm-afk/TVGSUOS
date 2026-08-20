# Dipstify first, Rescue first — merge-ready plan

Last updated: 2026-08-17  
Status: **Design only. No merge. No rush.**  
Owner: Edgardo Castro  

Intent: Clean **Dipstify Station** until it is one coherent OS. Clean **Station Rescue** until it is one coherent marketplace. Only then is a merge even discussable. Until both pass the ready gate, the products stay siblings.

Flow bar on every step: **clean, fast, easy.**  
Path stays: Rescue → book → diagnostic → Lens. Two doors. One Hook.

Companions: `STATION_RISK_REGISTRY.md` · `SR_DIPSTIFY_MERGE_RISK_PACK.md` · `OPS_STATION_DB_MERGE_RISK_PACK.md` · `GRADUAL_PLAN_AFTER_PHASE_A.md`

---

## Landing — two owner mindsets

Owners do not arrive the same way. **One Hook.** Two entries.

| Mindset | What they need | Door |
|---|---|---|
| **Prime me** | The week has to sound like theirs before they type liters. | The **book**. Then diagnostic. |
| **Let’s go** | They already feel the leak. Story is delay. | **Diagnostic** now. Book stays a link, not a gate. |

Never force one through the other. Never two calculators.

**dipstify.com** — Dipstify only. Pain is short on the home; the long pain is the book. Hero = diagnostic (let’s go). Second = book (prime me). Early access / demo **after** they have seen their number, not as the first button. Live today is the opposite (access + email demo first; Hook as “not ready”). Change that only when you say ship the home.

**stationrescue.com** — Rescue only. **Most station owners will see this as the marketplace** (tech, part, pump). That is correct. Do not dress it as Owner’s Lens or a second Dipstify home.

For **owners**, two small exits **below** the marketplace job, not a second hero: book if they need the story, diagnostic if they already know fuel walked. Technicians and suppliers see neither as the main CTA.

Founder preview (2026-08-17): **looks good.** **Shipped** on Station Rescue `master` (`5e604ef`): owner strip on home → `/week` handoff → dipstify.com diagnostic or letter. Live: stationrescue.com / station-rescue.vercel.app.

They communicate through those two exits. Not through a merged landing. Not through both homes telling the nine-station story.

**Transition (preview, 2026-08-17):** After Rescue (marketplace), an owner who also needs the week sees a **handoff page** — keep Rescue, add Dipstify. Not a third product. Not one mega-home. **Founder (same day):** owners **can** share one login later. Features stay on their own site. Technician never opens Lens. Not built. Mock: `katiwala-owner-os-/sr-transition-preview.html`.

---

## 1) What “ready” means (and what it does not)

**Ready** = each product can stand alone, with a clear identity, a clear DB, and a funnel that does not lie.

**Not ready** = folding folders because mornings have too many logins.

A later merge (if ever) is **Option B** (shared owner login) or **Option C** (one repo, two DBs) from the merge pack. **Option D** (one DB) stays last and still needs new privacy notices. This plan does **not** execute B, C, or D.

---

## 2) Order (binding)

```text
Dipstify clean  →  Rescue clean  →  ready gate  →  merge only if you still want it
```

Do not start Rescue depth to “help” Dipstify. Do not start a merge to “help” logins. One unlock at a time.

---

## 3) Dipstify first — make Station one OS

Goal: Helium runs on a Station that is boring, scoped, and honest about login. Staff stays its own DB.

| Step | What | Effort | Unlock | Done when |
|---|---|---|---|---|
| **D0** | Confirm two doors, one Hook. Diagnostic stays on dipstify.com. | S — talk | `two doors one hook` | Phrase. Zero code. |
| **D1** | Ship owner book. Live `/book` = letter. SOP = `/field-kit`. CTAs = diagnostic, not email. | S — 1–2 hrs | `ship owner book` | You open dipstify.com/book and the letter is there. |
| **D2** | Identity, design only. Rec: **hybrid** — PIN on the floor, email Auth for owner/Admin. | S — 1 session | `identity model approved — hybrid` (or pin / supabase) | One paragraph in this doc + Notion. No schema yet. |
| **D3** | E+1 RLS on **Ops DB only** (`wtwgsy…`). Second client hard gate. | M | `run phase e+1` | `phase e+1 smoke pass` — TL sees only own station via API. |
| **D4** | Ops → Station shared (Q5). Additive copy, point fuel-ops, 14-day soak, pause old project. | L | `ops merge risk accepted — run until done` | Lens + Admin + Ops on `jbhfd…`. Staff still `ttytdu…`. Rescue untouched. |
| **D5** | Optional: Lens → Staff token handoff (design exists). Still two DBs. | M — 2–4 days | After D4 is boring. Separate phrase when you want it. | Owner opens Staff without a second password. Ops PIN unchanged. |

**Dipstify clean gate**

- [ ] Book live; Hook is `/variance-diagnostic` only
- [ ] Identity written (hybrid unless you picked otherwise)
- [ ] E+1 smoke pass
- [ ] Helium close + photos + Lens signal on Station shared (after D4)
- [ ] Staff / Rescue projects not touched
- [ ] You are not still fighting daily fires on Helium

Do not start D3–D4 until Helium daily use is boring. D5 is optional. D5 is **not** Rescue SSO.

---

## 4) Rescue first — after Dipstify is clean

Goal: marketplace that only does tech / part / pump. Three ICPs. No tank data. Funnel handoff is a link, not a merged app.

| Step | What | Effort | Unlock | Done when |
|---|---|---|---|---|
| **R0** | Do not collect dips, cash, payroll, or Lens accounts on Rescue. | — | Standing | Form still matches the SR privacy notice. |
| **R1** | Funnel link: Rescue owner path can open the **book** (then diagnostic). Not the Hook on the Rescue home. | S — 1–2 hrs copy | After D1 live. Phrase: `sr funnel link book` | Owner who came for a tech can read the letter in one tap. Technician/supplier do not hit the book as the CTA. |
| **R2** | Identity hygiene: owner / technician / supplier are three roles in data, not one “user.” Owner email may match a Lens email later. Tech/supplier never live on Station shared. | S–M — design | After D2. No code until you ask. | Written map. ID/cert files stay SR storage. |
| **R3** | Marketplace stays on `phqncq…`. Checkout still not live. No cut of job value. | — | SR lock | Pilot form (or later catalog) writes only to SR. |

**Rescue clean gate**

- [ ] Three ICPs only
- [ ] Book link for **owners** only (after D1)
- [ ] No wet-stock in SR DB
- [ ] Roles named; tech IDs not in Station shared
- [ ] Privacy notice still SR-only
- [ ] Dipstify D-gate already passed

---

## 5) Ready gate (only after both cleans)

Open this list when Dipstify **and** Rescue gates are checked. Then pick — or walk away.

| If you still want | Phrase | What you get | Still forbidden |
|---|---|---|---|
| Stop here | `sr dipstify keep — funnel only` | Two products, one path. **This is success.** | Nothing to merge. |
| Shared owner login | `sr dipstify shared login later` | Owner email opens both. Two DBs. Techs/suppliers stay SR. | Login **after** diagnostic, never before. |
| One repo, two DBs | `sr dipstify one repo two db — run until done` | One git tree. Two Supabase URLs. | One deploy must not take Helium down. |
| One DB | `sr dipstify one db risk accepted — run until done` | Last. New notices first. | Marketplace role reading tanks/cash/payroll. |

If Helium is still noisy, the ready gate is **closed** even if the checklists look green.

---

## 6) Out of this plan (hard stop)

- Merging Rescue into Station shared **now**
- Putting the variance Hook on stationrescue.com home
- One password for floor PIN + owner + technician
- Staff, PnL, Delivery, checkout “while we’re here”
- Shipping the book without `ship owner book`
- Running D4 and R1 in the same week

---

## 7) Pace

No calendar rush. Clock is **Helium boring**, not a date.

Typical solo pace if you only work this when the stations are quiet:

- D0–D1: this week if you want the funnel live  
- D2: one sitting  
- D3–D4: after that, when you can book a window  
- R1–R2: after D1, and after Dipstify is not on fire  
- Merge: only if you still care once both are clean

---

## 8) Founder next (pick one)

- `two doors one hook` — lock Q3  
- `ship owner book` — D1  
- `identity model approved — hybrid` — D2 (or pin / supabase)  
- `merge ready plan accepted — dipstify first` — this file is the sequence; still no merge  

Silence = keep designing, do not start D3–D5 or Rescue depth.
