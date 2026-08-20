# Gradual plan — after Station Phase A

Last updated: 2026-08-12  
Status: Active  
Owner: Edgardo Castro  

Station Phase A prove path is **done**. No strategic crisis. This plan sequences the leftovers so nothing big-bangs Helium.

Companion: `DIPSTIFY_STATION_PLAN.md` · `OPS_STATION_DB_MERGE_RISK_PACK.md` · `ECOSYSTEM_REPO_TREE.md` · `STATION_RISK_REGISTRY.md` (funnel / login / landing questions, 2026-08-17)

---

## Principle

1. **Ship Helium GTM before infra surgery.**  
2. **One unlock at a time** — founder phrase required.  
3. **Client #2 is the hard deadline** for real RLS (E+1).  
4. **Ops merge** = streamline + ~$10/mo — not urgent cash.  
5. **GitHub rename** = brand optics — last, after product/DB stable.

---

## Stages

### Stage 0 — Now (no unlock phrase)
**Owner ops / GTM (you + light Claude help)**

| # | Item | Done when |
|---|---|---|
| 0.1 | Run branch-delete scripts (187) | Repos clean |
| 0.2 | Telegram bot token → human-assist | Requests reach Telegram |
| 0.3 | GA staff email list → bulk create | Accounts exist; PIN 8888 + reset |
| 0.4 | Fuel-ops forced PIN-change on login | Session with fuel-ops access |
| 0.5 | Helium EOM collect (Basic ₱9,999 · Staff+PnL ₱9,999) | Cash in |
| 0.6 | Optional: Stocks kL / reorder | Separate ask |

**Exit:** Helium daily use is boringly reliable; onboarding assist works.

---

### Stage 1 — Identity decision (design only)
**Phrase:** `identity model approved — pin|supabase|hybrid`

Fuel-ops today = custom PIN / `USER_DB`. Lens = Supabase Auth.  
E+1 and Ops merge both need this decided first.

| Option | Meaning |
|---|---|
| Keep PIN | RLS uses station-scoped tokens / custom claims bridge |
| Move to Supabase Auth | TLs get real accounts; bigger change, cleaner long-term |
| Hybrid | PIN for operator floor; Auth for owner/admin |

**Exit:** One paragraph locked in Notion + this doc. **No DB policies yet.**

---

### Stage 2 — E+1 RLS (Ops project only)
**Phrase:** `run phase e+1`  
**When:** After Stage 1 · **before second client** (hard)

- Apply RLS on Ops `wtwgsy…` tables only — never Lens `jbhfd…` in this stage  
- Helium smoke: TL sees only own station via API, not just UI  
- Rollback plan ready  

**Exit:** `phase e+1 smoke pass`

---

### Stage 3 — Ops → Station shared (5→4 DBs)
**Phrase:** `ops merge risk accepted — run until done`  
**When:** After Stage 2 stable · **Helium maintenance window** booked

Follow `OPS_STATION_DB_MERGE_RISK_PACK.md`:
- Additive schema on `jbhfd…` → backfill → point Fuel-ops → soak ≥14 days → pause Ops project  

**Exit:** Org shows 4 DBs; Helium green; ~$10/mo compute line gone.

---

### Stage 4 — KOS → Dipstify GitHub rename
**Phrase:** `run dipstify github rename`  
**When:** After Stage 3 (or after Stage 0 if you only need pitch optics — higher split-brain risk)

- Rename remotes / Vercel / docs / CLAUDE pointers in one dedicated session  
- No product feature work mixed in  

**Exit:** Public/private repos and deploy URLs match Dipstify naming.

---

### Stage 5 — Station “done enough” → next pillar
**Phrase:** `Station done enough` (your call)

Then unlock **one**: StationRescue depth · Delivery · ODO · RideVerified — never all at once.

---

## Parallel (does not block stages)

| Item | Note |
|---|---|
| Admin Pack ₱9,999 (Staff + PnL) | Commercial; seats combine or split |
| PnL on Staff DB | When PnL is real — not Station shared |
| Ver daily loop | Retry when MCP stable |
| Lens UI “as of last shift date” | Small UX so morning “nothing flagged” isn’t misread |

---

## What not to do

- Don’t run E+1 without identity lock  
- Don’t merge Ops without maintenance window + risk pack phrase  
- Don’t rename GitHub in the same session as DB merge  
- Don’t take client #2 live on screen-filter-only Ops  

---

## Suggested calendar (flexible)

| Window | Focus |
|---|---|
| This week | Stage 0 (Telegram, GA emails, PIN, billing, branch deletes) |
| When identity is clear | Stage 1 lock (30–60 min decision) |
| Before client #2 | Stage 2 E+1 |
| Quiet weekend / overnight | Stage 3 Ops merge |
| After soak | Stage 4 rename (optional) |

---

## Founder quick replies

```text
gradual plan accepted
```

Then unlock one stage at a time with the phrases above.
