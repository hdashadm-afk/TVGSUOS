# Verifos Dev Build — reconciled with live app

**Source draft:** `Downloads/Verifos_Dev_Build.md` (22 Aug 2026)  
**Locked against live:** `station-rescue` @ verifos.co · Vite + React Router · Supabase  
**Masterplan:** `docs/MASTER_DIRECTION.md` §0 · `docs/VERIFOS_OPERATING_LOCK.md`  
**Updated:** 22 Aug 2026

---

## Discussion — consistent & implementable (keep)

| Dev Build idea | Live status | Action |
|----------------|-------------|--------|
| 5-tab bottom nav | Live: Registry · Knowledge · Parts+Tech · Compliance · Account | Keep. Account **last** (not centered). |
| Registry = station assets | Live: Helium PMP units + condition + history | Upgrade UI: collapsible station → units/nozzles, “Brand not logged”, sticky “Open a request / Log repair” |
| Compliance calendar + colors | Live: DOE · DENR · Fire · equipment · facility calendar + facilitators | Polish status cards (overdue / due soon / upcoming) |
| Knowledge = owner shares | Live: `/app/knowledge` | Keep; no rewrite |
| Account tab | Live: `/app/account` | Keep |
| Mobile-first | Live PWA | Keep |
| Supabase Auth + Postgres | Live | Keep (email auth now; phone OTP later) |
| Graduation / never fake Verified | Locked in STANDARD | Keep |
| Facilitator-first for compliance | Live Compliance tab | Keep |
| Parts + techs directory | Live Parts+Tech | Keep (maps to “Suppliers” intent without a 6th tab) |
| Request → apply → pick + fees | Live | Keep (not in Dev Build Week 1–4 — still ship path) |

---

## Not consistent — do **not** implement as written

| Dev Build says | Why not | Lock instead |
|----------------|---------|--------------|
| **Next.js 14 + Tailwind + shadcn + Zustand** | Live app is Vite + custom CSS. Greenfield rewrite kills verifos.co momentum. | Stay on **Vite + React Router**. |
| **next-pwa** | Vite PWA already | Keep current PWA. |
| **Phone OTP only** | Live email/password + confirm | Keep email; OTP = later. |
| **Account centered** in 5 tabs | Live Account last; center squeezes labels | **Account last.** |
| **Separate Suppliers tab** | We already have Parts+Tech + Compliance facilitators | One directory lane: Parts+Tech; compliance facilitators stay under Compliance. |
| **Full L1–L4 RepairRecord schema now** | Conflicts with Phase A tech_jobs (symptom → assess → quote) | Keep **tech_jobs** Phase A; L2–L4 photos later per STANDARD. |
| **Gold / Verified badges on seed suppliers** | Never fake Verified | Claimed / seed only; no gold Verified. |
| **Mock-only then backend** | Backend already live | Improve UI on real Helium + local compliance. |
| **Book a Supplier CTA / paid booking** | Checkout not live; owner pick is auth | CTA = open request / call facilitator. |
| **Upgrade to Pro CTA** | Owners free at Phase A | Soft “coming” only if needed — no fake paywall. |
| **Vehicle in RepairRecord now** | 1B after 1A | Stations only. |

---

## Tab map (locked)

| Tab | Route | Job |
|-----|-------|-----|
| Registry | `/app` | Assets: stations → units/nozzles, condition, history |
| Knowledge | `/app/knowledge` | War stories / owner shares |
| Parts+Tech | `/app/discover` | Technicians + parts directory |
| Compliance | `/app/compliance` | Pain calendar + facilitators (DOE · DENR · Fire · equipment · facility) |
| Account | `/app/account` | Profile / settings |

---

## Build order (on Vite app)

1. **Registry UX** — collapsible pumps/nozzles, education blurb, sticky repair CTA  
2. **Compliance polish** — color status cards + score-ish progress on pain items  
3. **Parts+Tech** — keep; no Accordion rewrite required for MVP  
4. **Knowledge + Account** — already present; light polish only when asked  

---

## Definition of done (Phase 1a on live stack)

| # | Feature | Target |
|---|---------|--------|
| 1 | 5 tabs Account last | Done |
| 2 | Registry collapsible units + sticky CTA | Done (22 Aug) |
| 3 | Compliance color status + pain focus | Done (22 Aug) |
| 4 | Parts+Tech directory | Done |
| 5 | Knowledge stories | Done |
| 6 | Account | Done |
| 7 | PWA installable | Done |
| 8 | Owner request → apply → pick | Done |
| 9 | Never fake Verified | Locked |
| 10 | 3 Helium owners can use on phone | Founder test |

---

*Reconciled from Verifos_Dev_Build.md · HMC · Verifos*
