# Station Rescue ↔ Dipstify — Risk Pack

Last updated: 2026-08-17  
Status: **A locked (2026-08-17).** Products stay separate. **Owner same login later (B)** — not built. Not C/D.  
Owner: Edgardo Castro  
Trigger: Solo-founder question — SR is now the funnel/marketplace; combine with Dipstify for one codebase, one DB, one maintenance surface.

Index of this plus logins / landings / book: `docs/STATION_RISK_REGISTRY.md` (discuss one row at a time).

Prep without rushing: `docs/DIPSTIFY_SR_MERGE_READY_PLAN.md` — clean Dipstify, then clean Rescue, then a ready gate. This pack is still not a green light to merge.

Companion: `docs/OPS_STATION_DB_MERGE_RISK_PACK.md` (Ops → Station shared). That pack is a **different** merge. Do not run both in one session.

---

## 1) What is locked today

| Lock | Where | Meaning |
|---|---|---|
| Station ≠ StationRescue | `docs/ECOSYSTEM_REPO_TREE.md` | Station = owner daily ops. Rescue = services / parts / contractors. |
| Dipstify = ops sibling of SR | `.cursor/rules/station-rescue-venture-gate.mdc` | Same owner life. **Do not merge products.** |
| SR depth out of Phase A | `docs/PHASE_A_STATION_BOUNDARY.md` | Claude stays inside Station until founder unlocks. |
| Two privacy notices | `docs/npc/PRIVACY_STATIONRESCUE_HMC_2026-08-14.md` · `docs/npc/PRIVACY_DIPSTIFY_HMC_2026-08-13.md` | Two Data Processing Systems. **Do not merge notices.** |
| DB goal = 4 projects | Ecosystem tree | Ops → Station shared only. **SR stays its own project** (`phqncq…`). |

The funnel we already designed does **not** require a merge:

**Station Rescue** (tech / part / pump) → **owner book** → **variance diagnostic** → **Owner’s Lens**.

One owner journey. Two jobs. Two systems.

**Flow bar (always):** clean, fast, easy. Same bar as every owner-facing surface. A merge that saves you tabs but makes the owner think, wait, or log in twice **fails this pack** even if the schema is tidy.

---

## 2) Current state (facts)

| | Station Rescue | Dipstify Station |
|---|---|---|
| Job | Marketplace: owner, technician, supplier. Catalog → install. | Owner OS: variance, cash, ops signal, Lens. |
| Live surface | stationrescue.com / station-rescue.vercel.app (pilot interest form) | dipstify.com / ops.dipstify.com (Helium live ops) |
| Repo | Station RESQ (separate) | `katiwala-owner-os-` + fuel-ops + admin / staff / pnl modules |
| DB | `phqncq…` | Station shared `jbhfd…` + Ops `wtwgsy…` + Staff `ttytdu…` |
| Who is in the data | Owners + technicians + suppliers. Optional technician ID / cert files (sensitive). No tank readings. | Owner accounts, wet-stock, shift logs, cash, staff/payroll, Helium multi-station. |
| HMC role | PIC for the pilot form | PIC for owner accounts / waitlist / billing. **PIP** for station staff/ops/HR the owner enters. |
| Auth | Pilot form (no full marketplace auth yet) | Lens = Supabase Auth. Ops = custom username/PIN. Staff = own project. |

Helium is already running on Dipstify. SR is still a pilot form. Those are not the same maturity.

---

## 3) What “combine” can mean (pick one)

Do not treat “one maintenance” as one move. Four different jobs. Score **you** (tabs) and **them** (flow: clean / fast / easy):

| Option | What you actually get | Your tabs | Owner flow |
|---|---|---|---|
| **A — Funnel only** | Keep two products. SR → book → diagnostic → Lens. | Path, not mega-app. | **Clean:** one job per page. **Fast:** book then numbers, no email. **Easy:** their logbook, same visit. |
| **B — Shared owner login later** | Same email/session can open both. Two DBs stay. | One password later. | Extra account wall before they have felt the leak. Fails “fast / easy” if you put login *before* diagnostic. |
| **C — One repo, two DBs** | Monorepo / one Vercel project. Data stays split. | One `git pull`. | Owner still sees two jobs. Risk: one nav, two purposes — not clean. |
| **D — One repo + one DB** | Marketplace people in the same Postgres as Helium tanks/cash/staff. | Fewest tabs. | Slowest to ship. Easy to dump a mega-home on a person who only wanted a technician. **Fails clean.** |

**Recommendation:** **A**. It is the only option that is already clean, fast, and easy for the owner. C/D make *your* folder simpler and *their* week heavier.

### Flow rules (veto)

Any option that does this is a no, including A if we break it later:

1. **Clean** — Rescue = visible fire. Book = relate. Diagnostic = see the leak. Lens = answer. No mega-menu. No “also sign up here” in the middle of the letter.
2. **Fast** — Next step is a link, not an inbox. Diagnostic uses the logbook they already have. Two minutes, not a call.
3. **Easy** — One station is enough. No training. If the leak is there, the page says so.

Login, pricing, and demo sit **after** they have seen their own number — on the diagnostic result — not in the book, not as a merge of the two apps.

---

## 4) Risks (if B, C, or D)

| # | Risk | Hits | Severity | Blocks start? |
|---|---|---|---|---|
| R1 | **Blast radius** — one leak / one bad RLS row. A technician or supplier can see another station’s tanks, cash, or payroll. | D | High | Yes |
| R2 | **Role mix** — SR has three ICPs. Dipstify is owner (+ station staff). One `profiles` table cannot mean “owner” in both products without a written identity model. | B, C, D | High | Yes |
| R3 | **PIC vs PIP** — SR: HMC is controller of marketplace leads. Dipstify: HMC is processor of the owner’s staff/ops data. One DB blurs who is legally responsible for a row. | D | High | Yes |
| R4 | **NPC / notices** — two DPS, two public policies, “do not merge.” A combined product without new notices is a filing miss. | C (if one domain pretends to be one product), D | High | Yes |
| R5 | **Helium downtime** — Dipstify is live ops. Folding SR into `jbhfd…` is a cutover on stations that already dip and close. | D (also C if one deploy) | High | Yes |
| R6 | **Auth mismatch** — Lens Auth ≠ Ops PIN ≠ SR form. Silent “one login” will strand crew or open the wrong door. | B, D | High | Yes |
| R7 | **Sensitive SR files** — technician government ID / certs in the same project as Helium wet-stock. | D | High | Yes |
| R8 | **Heavy flow** — merged UI, extra login, email CTA, or a product tour before they have used their own week. Breaks clean / fast / easy. | B (if login first), C, D | High | Yes — flow veto, same weight as schema |
| R9 | **Solo-founder rewrite** — one codebase still has two jobs. You debug marketplace and variance in the same tree. Typical cost: months, not a weekend. | C, D | Medium | Process — do not start without a time box |
| R10 | **Scope creep** — “while we’re here” pull Staff, Ops merge, Delivery, checkout into the same move. | All except A | Medium | Process — hard stop list |
| R11 | **Cursor / agent gate** — SR rule says do not merge. A merge session without rewriting that rule will fight itself mid-build. | C, D | Low | Yes — rewrite rule only after founder phrase |

Cash: combining SR + Station shared does **not** save the ~$10/mo that Ops→Station would. SR project cost is not the reason to merge.

---

## 5) Mitigations

| Risk | Mitigation | Owner |
|---|---|---|
| R1 | Keep SR data in `phqncq…`. If D is ever approved: separate schemas, `station_id` + `role`, RLS dry-run, no shared service-role from the marketplace app into ops tables. | Agent drafts; founder approves |
| R2 | Written identity map: owner / technician / supplier / station staff. No row is “just a user.” | Agent; founder signs |
| R3–R4 | New or updated NPC notices **before** any combined DB. Do not reuse the Dipstify Station policy for technicians. | Founder + DPO inbox |
| R5 | No Helium cutover in the same session as SR work. Maintenance window only if D. Rollback = SR project stays live. | Founder + agent |
| R6 | Do not put SSO in front of the diagnostic. Owner same login is **later**, Rescue ↔ Dipstify only. Technician/supplier never open Lens. Floor PIN stays off this SSO. | Agent |
| R7 | ID/cert files stay SR-only storage. Never copy into Station shared. | Agent |
| R8 | Keep the path: Rescue → book → diagnostic (their numbers) → Lens. No email as the next step. No login before the leak. No combined home screen. | Founder (copy already in local `book.html`) |
| R9 | If C or D: time-box and success check in this pack. Stop if the first week is “rewrite the world.” | Founder interrupt |
| R10 | Out of scope list below is binding. | Founder interrupt |
| R11 | Rule file changes only after a decision phrase, not after a chat opinion. | Agent |

---

## 6) Out of scope (binding)

Do **not** pull these into this decision:

- Ops → Station shared DB (`docs/OPS_STATION_DB_MERGE_RISK_PACK.md`) — separate pack, separate phrase
- Staff DB, payroll, PnL
- Delivery, Franchise
- Live checkout / taking a cut of job value (SR lock: not live until built; no cut of job value)
- Physical mega-monorepo of all Dipstify modules
- Changing Helium as first cluster or HMC as operator
- Shipping the owner book to dipstify.com (that is a **ship** phrase, not this pack)

---

## 7) If founder still wants C or D — Step / Where / How

Execute **only** after a decision phrase in §8. Option A needs no steps.

### Option C (one repo, two DBs) — if chosen

| Step | Where | How |
|---|---|---|
| 0 | This pack | Founder accepts C risks (R5 deploy, R8, R9) |
| 1 | Rule + tree | Rewrite SR gateway: siblings in one repo, **still two DBs** |
| 2 | Git | New repo or subtree. Two env URLs. Two Supabase projects. |
| 3 | Deploy | Separate Vercel projects **or** one project with isolated build paths — write which, then freeze |
| 4 | Soak | Helium Lens/ops still green after first SR deploy from the new tree |
| 5 | Funnel | Book + diagnostic links unchanged |

### Option D (one DB) — if chosen

| Step | Where | How |
|---|---|---|
| 0 | This pack + privacy | Founder + notice rewrite plan signed. **Do not start schema without R3/R4.** |
| 1 | Doc | Identity + RLS + PIC/PIP map (R1–R3, R6) |
| 2 | `jbhfd…` or a **new** shared project | Additive SR schema. Do not drop `phqncq…` |
| 3 | Dual-write / backfill | Interest rows + files. Row counts. No wet-stock in SR schemas |
| 4 | Apps | Point SR at new project; Helium still on Station path until soak |
| 5 | Soak | ≥14 days. Helium close + SR form both work |
| 6 | Founder | Pause `phqncq…` only with an explicit delete/pause phrase |

**Do not use Station shared as the dump for technician IDs.** If D happens, prefer a dedicated schema with no SELECT from the marketplace role onto ops/staff tables.

---

## 8) Success check (by option)

**A**

- [ ] SR still three ICPs only
- [ ] Book still sends to `/variance-diagnostic`, not email
- [ ] Owner can finish Rescue → book → diagnostic without a call, a login, or a second product tour
- [ ] Dipstify DB untouched
- [ ] No new combined login / mega-home

**C**

- [ ] Two Supabase URLs still in env
- [ ] Helium daily close works after the repo move
- [ ] SR form still writes only to `phqncq…`
- [ ] Owner path still Rescue → book → diagnostic (no combined home, no login before the leak)

**D**

- [ ] Marketplace role cannot read wet-stock / cash / payroll in spot checks
- [ ] Helium operator + owner Lens still live
- [ ] Public privacy pages match the new DPS story
- [ ] `phqncq…` not deleted on day one
- [ ] Flow bar still holds: clean / fast / easy — same four steps, not a mega-app front door

---

## 9) Founder decision

**Locked 2026-08-17:** **A** (funnel only — two products, two DBs) **plus** same login **later for owners** (B). Phrase in chat: “A.” then “they can have same login.”

- Rescue stays the marketplace. Dipstify stays the engine/ops sibling.
- Same email can later open **both sites for an owner**.
- Technician and supplier stay on Rescue. They never get a Dipstify / Lens session.
- Do not put that login in front of the diagnostic.
- Do not merge databases. Do not rebrand the Rescue app as Dipstify.
- Do not say “one login” on the live landing until SSO actually works.

Not C. Not D.
