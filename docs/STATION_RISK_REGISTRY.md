# Station funnel — question / risk registry

Last updated: 2026-08-17  
Status: **Discussion list. One row at a time. No build on silence.**  
Owner: Edgardo Castro  

Morning dump (2026-08-17): Rescue as funnel, combine?, logins, two landings. Take them individually. Flow bar applies to every row: **clean, fast, easy**.

| Pack | Use when |
|---|---|
| `docs/DIPSTIFY_SR_MERGE_READY_PLAN.md` | Clean Dipstify first, then Rescue, then a ready gate. No rush. |
| `docs/SR_DIPSTIFY_MERGE_RISK_PACK.md` | Q1 merge options A–D |
| `docs/OPS_STATION_DB_MERGE_RISK_PACK.md` | Ops DB → Station shared (different merge) |
| `docs/GRADUAL_PLAN_AFTER_PHASE_A.md` | Station identity (PIN vs Auth) |

**Effort** = calendar time for you + one agent, not a team. S = hours. M = days. L = weeks. XL = month+.

---

## Standing rule (not a question)

**Path:** Station Rescue → owner book → diagnostic → Owner’s Lens.  
**Flow:** Rescue = fire they can see. Book = relate. Diagnostic = their leak (not email). Lens = answer.  
**Veto:** extra login, mega-home, or product tour before they have used their own week.

**GTM (locked 2026-08-17):** two programs. Dipstify social = the Hook (letter / diagnostic / leak). Station Rescue = existing 90-day marketplace plan (`station-rescue/docs/outreach/PLAN_90_DAY.md`). They meet on `/week` for owners who need both. They do not share a Facebook calendar. SR already pauses 6–10 Oct for Dipstify commercial.

---

## 1) Triage (do vs wait)

Score = **hurt if we wait** vs **hurt if we rush**. Sequence follows that, not “biggest idea.”

| # | Hurt if we wait | Hurt if we rush | Priority | When |
|---|---|---|---|---|
| **Q3** Two doors / one Hook | Low. Already true. Confusion only if we *change* it. | High. One landing mixes tech-seekers with tank math. | **P0 confirm** | Today. Talk only. |
| **Q4** Ship owner book | Med. Live `/book` may still be the old SOP. Funnel dead until ship. | Low–med. You already said it landed. Wrong live copy is reversible. | **P1 ship** | This week, after you say `ship owner book`. |
| **Q1** Combine Rescue + Dipstify | Low. Extra tabs. Funnel does not need one DB. | **High.** Data blast, privacy, Helium, months. | **P2 decide** | **A locked 2026-08-17.** Owner same login later. Not C/D. |
| **Q2** One Station login | Med. You type passwords every morning. Solo friction. | **High.** Floor PIN ≠ owner email. Wrong SSO locks a shift. | **P3 design** | After book is live. Identity phrase first. No Rescue in this. |
| **Q5** Ops → Station DB | Low. ~$10/mo + a bridge. Helium already runs. | **High.** Live close downtime. Needs Q2 first. | **P4 park** | After Q2. Own session. |

**Do not start:** Q1 C/D, Q2 SSO, Q5 — until their phrase. **Do start when phrased:** Q4 ship.

---

## Security (two domains, owner handoff)

What is **live now** is links only. `/week` on Rescue does not log anyone in, does not send tank numbers, does not copy a session to Dipstify.

| # | Risk | Now (links) | If we share login | If we share one DB |
|---|---|---|---|---|
| **S1** | Technician or supplier opens Lens / wet-stock | None. Separate apps. | **High** if one password means one role. Owner SSO only. | **Critical.** Same Postgres, one bad RLS row. |
| **S2** | Owner tank/cash data on Rescue | None. Diagnostic stays on dipstify.com | Still keep numbers off Rescue. | Do not store dips on `phqncq…` |
| **S3** | Token in the URL (email, magic link, `?token=`) | We did not do this | **High.** Leaks in logs, Referer, chat. Cookie / code-exchange only. | Same |
| **S4** | Fake “Dipstify” on a Rescue-looking page (phishing the owner) | Low. We send them to **dipstify.com** | Medium if SSO popup is sloppy | — |
| **S5** | Diagnostic form (anon insert) | Existing Dipstify Hook. Insert-only. No public read of other owners. | Unchanged | Do not point the Hook at SR DB |
| **S6** | Helium live ops | Untouched | Untouched if SSO is owner-only | Cutover risk — Q5 / Q1 D |

**Rule:** two domains can share an **owner**. They must not share a **role**. A technician login never becomes an owner session.

**Live ship is S3–S5 clean** as long as handoff stays `https://dipstify.com/...` with no query secrets. **Owner same login:** founder allowed (2026-08-17). Not built. Shared DB stays last.

---

## 2) Effort (recommended path vs heavy path)

| # | Recommended | Effort | Heavy path | Effort | You in the loop |
|---|---|---|---|---|---|
| **Q3** | Lock “two doors, one Hook.” Rescue may deep-link the book (one line). | **S** — 1 conversation. Optional: 1–2 hrs copy on Rescue. | Merge landings or put diagnostic on Rescue home. | **M** — and it fails the flow veto. | Confirm phrase. |
| **Q4** | Commit / push book + field-kit swap. Check live `/book` → diagnostic. Check SR link. | **S** — 1–2 hrs including your read of live. | Rewrite again / PDF kit / Notion clone. | **S–M** | Must say ship. You spot-check live. |
| **Q1 A** | Keep siblings. Funnel only. | **S** — phrase. Zero code. | — | — | Phrase. |
| **Q1 C** | One repo, two DBs. | — | Monorepo, two env URLs, soak Helium after first SR deploy. | **L** — 1–2 weeks. Deploy blast. | Approve tree + soak. |
| **Q1 D** | — | — | One DB. Privacy rewrite, identity map, RLS, 14-day soak. | **XL** — 4–8 weeks. Highest risk. | Notices + window. Not a weekend. |
| **Q2 hybrid** | PIN stays on the floor. Email Auth for owner/Admin. Later: Lens → Staff token handoff (design exists). | **M** — 2–4 days for Lens↔Staff. Hybrid lock = 1 session. | One password for Ops + Lens + Staff + PnL, including PIN users. | **L–XL** — weeks. Blocks Q5 if done wrong. | Pick `pin` / `supabase` / `hybrid`. Test one Helium close. |
| **Q5** | After Q2. Dual-write, point fuel-ops, 14-day soak, pause Ops project. | **L** — 2+ weeks + 14-day soak. | Same merge + Rescue + Staff “while we’re here.” | **XL** + out of pack | Maintenance window. Rollback = keep Ops project. |

Cash: Q5 saves ~$10/mo. Q1 D does **not** pay for itself. Q2/Q4 are time, not compute.

---

## 3) Registry (facts)

| # | Question | Fact today | Rec | Unlock | Status |
|---|---|---|---|---|---|
| **Q1** | Combine Rescue + Dipstify | Two products, two DBs, two notices. | **A — funnel only.** | `sr dipstify keep — funnel only` (or merge-pack C/D) | Open — pack written, no merge |
| **Q2** | Same login Lens / Ops / Admin / Staff / PnL | **No.** Different Auth/PIN/projects. Seat ≠ SSO. | Station identity later. Not Rescue. | `identity model approved — pin\|supabase\|hybrid` | Open — different logins by design |
| **Q3** | Two landings? Two Hooks? | Two landings. **One** Hook (`/variance-diagnostic`). | Two doors. One path. Hook stays on Dipstify. | `two doors one hook` | Open — awaiting confirm |
| **Q4** | Owner book live? | Local only. Live `/book` still old SOP until ship. | Preview until ship. | `ship owner book` | **Shipped 2026-08-17** — dipstify.com/book + two-mindset home. Rescue landing still preview only. |
| **Q5** | Ops DB into Station shared | Separate pack. PIN vs Auth. | After Q2. | `ops merge risk accepted — run until done` | Parked |

---

## 4) How we use this

1. You name a row (**Q1…Q5**).
2. We discuss only that row.
3. Nothing starts until the phrase in that row.
4. Q1 C/D does not unlock Q2. Q2 does not unlock Q1. Q5 is never “while we’re here.”

**Work order from this triage:** Q3 confirm → Q4 when you ship → Q1 keep → Q2 later → Q5 last.

Prep toward a *later* merge (still no merge now): `docs/DIPSTIFY_SR_MERGE_READY_PLAN.md` — Dipstify clean → Rescue clean → ready gate.
