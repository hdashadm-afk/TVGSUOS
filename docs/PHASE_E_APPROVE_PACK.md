# Phase E — Approve pack (1 page)

**Ask:** Approve design only — **no RLS / no DB changes** in Phase E.  
**Full doc:** `Fuel-ops/docs/PHASE_E_CLIENT_BOUNDARY_GAP.md`

---

## What Phase A already fixed

SPA client boundary (Overview / View-As / zero Helium flash) — **screen leak closed**.

## What is still open

Ops uses **anon key**; scope is enforced in the **browser**. Direct Supabase calls can still cross clients until RLS + real identity exist.

## Phase E delivers

1. Honest gap statement (this pack + full doc).  
2. E+1 sketch only (tables + auth dependency).  
3. No policies applied.

## Phase E+1 later (separate unlock)

Ops project `wtwgsygwofyqmxgckmjc` only — never Lens `jbhfd…`.  
Needs auth-model decision first (Fuel-ops is largely PIN/`USER_DB`, not Supabase Auth).  
Then RLS on `smp_shiftlogs`, `smp_dsr`, drafts, photo metadata, cash receipts, etc.

## Risks if you skip approval and jump to E+1

| Risk | Why it matters |
|---|---|
| RLS without identity | App goes dark for TLs |
| Wrong Supabase project | Lens DB damaged / Ops unchanged |
| Partial table lock | Silent Overview failures |

## Approve

Paste to Claude / Cursor:

```text
phase e design approved
```

Then: **do not** run E+1 until you say `run phase e+1`.  
Next Station product move after D: **F1 Ops→Lens** (`docs/PHASE_F1_DEPLOY_CHECKLIST.md`).
