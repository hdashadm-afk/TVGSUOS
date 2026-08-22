# Verifos Dev Build — reconciled with live app

**Source draft:** `Downloads/Verifos_Dev_Build.md` (22 Aug 2026)  
**Locked against live:** `station-rescue` @ verifos.co · Vite + React Router · Supabase  
**Masterplan:** `docs/MASTER_DIRECTION.md` §0 · `docs/VERIFOS_OPERATING_LOCK.md`  
**Updated:** 22 Aug 2026

---

## Standard practice — numbered lock refs

Every keep / reject / defer table in Verifos master docs gets a **stable item number**. Chat, commits, and Cursor cite the code — not a paraphrase of the whole row.

| Prefix | Meaning | Example |
|--------|---------|---------|
| **K#** | Keep / implement | “Ship K2” |
| **R#** | Reject / do not build as written | “Don’t do R1” |
| **D#** | Defer (allowed later, not now) | “D3 = phone OTP later” |

Rules: never renumber silently (append new IDs; mark old rows retired if needed). New reconcile tables continue the series or start a dated block (`R12+`). Full reject list = **R1–R11** below; keep list = **K1–K11**.

---

## Discussion — consistent & implementable (keep)

Cite as **K#**.

| # | Dev Build idea | Live status | Action |
|---|----------------|-------------|--------|
| **K1** | 5-tab bottom nav | Live: Registry · Knowledge · Parts+Tech · Compliance · Account | Keep. Account **last** (not centered). |
| **K2** | Registry = station assets | Live: Helium PMP units + condition + history | Upgrade UI: collapsible station → units/nozzles, “Brand not logged”, sticky “Open a request / Log repair” |
| **K3** | Compliance calendar + colors | Live: DOE · DENR · Fire · equipment · facility calendar + facilitators | Polish status cards (overdue / due soon / upcoming) |
| **K4** | Knowledge = owner shares | Live: `/app/knowledge` | Keep; no rewrite |
| **K5** | Account tab | Live: `/app/account` | Keep |
| **K6** | Mobile-first | Live PWA | Keep |
| **K7** | Supabase Auth + Postgres | Live | Keep (email auth now; phone OTP later) |
| **K8** | Graduation / never fake Verified | Locked in STANDARD | Keep |
| **K9** | Facilitator-first for compliance | Live Compliance tab | Keep |
| **K10** | Parts + techs directory | Live Parts+Tech | Keep (maps to “Suppliers” intent without a 6th tab) |
| **K11** | Request → apply → pick + fees | Live | Keep (not in Dev Build Week 1–4 — still ship path) |

---

## Not consistent — do **not** implement as written

Cite as **R#** (e.g. “don’t do R1”).

| # | Dev Build says | Why not | Lock instead |
|---|----------------|---------|--------------|
| **R1** | **Next.js 14 + Tailwind + shadcn + Zustand** | Live app is Vite + custom CSS. Greenfield rewrite kills verifos.co momentum. | Stay on **Vite + React Router**. |
| **R2** | **next-pwa** | Vite PWA already | Keep current PWA. |
| **R3** | **Phone OTP only** | Live email/password + confirm | Keep email; OTP = later. |
| **R4** | **Account centered** in 5 tabs | Live Account last; center squeezes labels | **Account last.** |
| **R5** | **Separate Suppliers tab** | We already have Parts+Tech + Compliance facilitators | One directory lane: Parts+Tech; compliance facilitators stay under Compliance. |
| **R6** | **Full L1–L4 RepairRecord schema now** | Conflicts with Phase A tech_jobs (symptom → assess → quote) | Keep **tech_jobs** Phase A; L2–L4 photos later per STANDARD. |
| **R7** | **Gold / Verified badges on seed suppliers** | Never fake Verified | Claimed / seed only; no gold Verified. |
| **R8** | **Mock-only then backend** | Backend already live | Improve UI on real Helium + local compliance. |
| **R9** | **Book a Supplier CTA / paid booking** | Checkout not live; owner pick is auth | CTA = open request / call facilitator. |
| **R10** | **Upgrade to Pro CTA** | Owners free at Phase A | Soft “coming” only if needed — no fake paywall. |
| **R11** | **Vehicle in RepairRecord now** | 1B after 1A | Stations only. |

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
