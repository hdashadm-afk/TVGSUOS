# RideVerified Prep Pack (docs only)

Last updated: 2026-08-11  
Status: **Prep only** — no ownership-app build until founder unlocks  
Owner: Edgardo Castro  

Companion to `docs/ECOSYSTEM_REPO_TREE.md` and `docs/ODO_PREP.md`.

---

## 1. Locked place in the tree

```text
FOS
├── RideVerified     ← THIS PILLAR — ownership app — later
│   └── riderslamp.org
├── ODO              ← marketplace — later (≠ RV)
└── Dipstify / Station ← Phase A now
```

| Rule | Meaning |
|---|---|
| RideVerified ≠ ODO | Ownership / garage / identity vs marketplace transactions |
| riderslamp.org | Under RideVerified — not under ODO |
| `admin-verified-ph` in hmcmarketing | RV + ShopVerified back office — **≠** Dipstify `adminverified` |
| Phase A | Station only until founder unlocks RV |

---

## 2. What RideVerified is (plain language)

**RideVerified** = vehicle **ownership** app: garage, identity, trust, verified rides / records surface — daily rider identity, not buying/selling.

**Vehicle ODO** = marketplace for vehicle deals.  
**ShopVerified** = shop trust (later; own brand under hmcmarketing).

---

## 3. Known surfaces (as of docs — verify live when unlocked)

| Item | Value |
|---|---|
| Code | [hmcmarketing](https://github.com/hdashadm-afk/hmcmarketing) → `ride-verified-ph/` |
| Domain | `riderslamp.org` (owned) |
| Status | Later pillar — not Station Phase A |
| FOS | Map / mode links only — no RV product build in TVGSUOS |
| Related | RideRecords as major feature *inside* RV (Strava-layer) per family memory — confirm in repo at unlock |

---

## 4. Unlock criteria (founder)

Unlock RV build only when **at least one** is true:

1. GTM / launch needs ownership app this month.  
2. Station Phase A is done enough and bandwidth frees.  
3. A named pilot (riders / LGU / club) is blocked on RV.

Until then: Station Phase A + ODO prep docs only.

---

## 5. First session plan when unlocked (not now)

| Step | Where | How |
|---|---|---|
| 1 | Risk table | Auth, PII, verification claims, LTO/data partners |
| 2 | Live audit | Clone `hmcmarketing` / `ride-verified-ph/` — inventory tabs vs locked 5-tab structure |
| 3 | Domain | Confirm riderslamp.org DNS / deploy target |
| 4 | Boundary | Re-assert ≠ ODO Vehicle marketplace; no nesting |
| 5 | FOS | Optional status card — read-only, no DB merge |
| 6 | Success | One demo path: open garage / identity flow on phone |

Phrase to start build later: `rideverified unlocked — run until done`

---

## 6. Explicitly out of this prep

1. Writing RV / hmcmarketing code.  
2. Nesting RV under ODO or Vera.  
3. Confusing Dipstify AdminVerified with `admin-verified-ph`.  
4. Stealing Station Phase D / F1 focus.

---

## 7. Related docs

| Doc | Role |
|---|---|
| `ECOSYSTEM_REPO_TREE.md` | Locked 3-pillar map |
| `ODO_PREP.md` | Marketplace sibling prep |
| `PHASE_A_STATION_BOUNDARY.md` | Keeps RV out of Station sessions |
| `DIPSTIFY_SCALE_PLAN.md` | RV PH-first clock |
| `MASTER_DIRECTION.md` / `VER_BEHAVIOR.md` | Pillar rules |
