# Dipstify quiz — thin MVP (locked)

Last updated: 2026-08-19  
Status: **Founder approved** · **Virality parked** · **HOLD (19 Aug, founder)** — check later, do not iterate until he unpauses.  
Owner: Edgardo Castro  
Build repo: **dipstify.com** (`katiwala-owner-os-` / Owner’s Lens site that already serves `/book` and `/variance-diagnostic`)  
Not this repo. Not Station Rescue.

## HOLD — founder check later (19 Aug 2026, 13:31 PHT)

Do not change `/quiz` or `/simulate` until the founder unpauses. Live on **dipstify.com** (`katiwala-owner-os-` `main` **290d389**).

**Check when you come back**

| URL | Job |
|---|---|
| https://dipstify.com/quiz | Step 1 — score, not a buy screen |
| https://dipstify.com/simulate?tier=A | Given (locked) vs write opex → P&L → “your data?” → diagnostic |
| https://dipstify.com/simulate?tier=B | Same sample. Cannot produce given numbers → human |
| https://dipstify.com/variance-diagnostic?from=simulate&tier=A | “Were you given the right data?” Stick vs pumps. No accountant to see missing liters |

**Funnel lock (do not reopen on hold)**

1. Quiz  
2. Sample: given volume / pump price / COGS **cannot touch**; owner **writes** salary, rent, other → **now you have a P&L**  
3. A: can you do it with yours? Then they can be happy. B: human (blind)  
4. A: are you sure you were given the right data? → diagnostic closes → onboard. Human still available.

Companion: `Downloads/Dipstify_Quiz_Detailed_Spec.md` (full spec — **parked extras**). App lock in Notion. Price: Basic ₱9,999 · Staff+PnL ₱9,999.

---

## Cut

Results screen is a **diagnosis**, not a buy screen. No ₱9,999. No setup call. No share button.

**Funnel (founder 19 Aug, after trying the quiz):**

| Step | What | Who |
|---|---|---|
| **1** | Quiz — “How healthy is your station? Let’s run the numbers.” | A and B |
| **2** | Simulation: **given data you cannot touch** (volume, pump price, COGS) + **what you write** (salary, rent, other) → **now you have a P&L**. No accountant for this picture. | A and B, same sandbox. Not Helium live. |
| **3** | **Can you do it with YOUR data?** A unlocks the given fields and types theirs, then can be happy with the picture. **B** cannot produce the given numbers — human. | A self-serve. B human. |
| **4 (A only)** | **Are you sure you were given the right data?** Variance diagnostic. Stick vs pumps. **No accountant needed to know if something is missing.** **This closes.** Then **onboard**. **A can still go to a human** if stuck. | B’s default is human. A’s default is diagnostic → onboard. |

Letter `/book` is optional story, not the step after the score.

| In by 29 Sep (soft live, no ads) | After ads (not virality) | **Parked — founder unlock** |
|---|---|---|
| `/quiz` Q1–Q6, anonymous | FingerprintJS | Share-card PNG (Stories / Feed) |
| `session_id` localStorage + URL | Mixpanel / PostHog dashboard | “Share your result” button |
| Answers in sessionStorage until submit | A/B tests | QR on share card or pump nozzle |
| `POST /api/quiz/submit` — **server** score | Tagalog | Viral coefficient / share analytics |
| Results: X/14, insight, **step 2** → `/simulate` | Automated Day 0–7 WhatsApp machine | CMO “share this score” posts |
| Step 3 A → “can you do it with YOUR data?” unlocks given fields. Human still available. | | |
| Step 4 A → “were you given the right data?” `/variance-diagnostic?from=simulate&tier=A` then onboard. Human still available. | | |
| Step 3 B → human (blind) | | Rescue embed / conversion KPI |
| Privacy + NPC before first DB row | | |

**Virality stays parked.** Do not build it after Oct ads unless the founder says `quiz virality unlocked`. Paid ads to `/quiz` are not virality — those still run 6–10 Oct.

Helium 3 numbers (morning dip, evening dip, sales) **continues**. Quiz is October cold traffic.

---

## How they reach `/quiz` (locked 19 Aug)

**Only URL:** `https://dipstify.com/quiz`  
Not Rescue. Not a widget. Not a QR. Not a share card.

| Door | Who | Rule |
|---|---|---|
| **Ads** | Cold owners, 6–10 Oct | Dipstify Page paid ads **land on `/quiz`**, not home |
| **Dipstify Page organic** | Same Page, any week | Caption may use the `/quiz` link. Rescue Page never does |
| **You send it** | Helium friends, WhatsApp | Paste `dipstify.com/quiz` |
| **dipstify.com home / nav** | Organic site visitors | When `/quiz` ships: one line **“2-minute station check”** → `/quiz`. First-party. Not virality |

**Not a quiz door (keep as they are):**

| URL | Job |
|---|---|
| `/variance-diagnostic` | They have a logbook. Stick vs pumps. |
| `/book` | They want the letter first. |
| Rescue `/week` | Letter or diagnostic. **Never** `/quiz`. |
| `/app` | Helium already running. Skip the quiz. |

**Parked (not access):** pump QR, share cards, “Share your result,” Rescue embed.

---

## Scoring (from spec — do not change)

Q1–Q5 only. Range **−7 to +14**. Q6 is UX density, not the grade.

| Tier | Rule | CTA |
|---|---|---|
| **A** | Score ≥ 5 | Step 2 locked given + write opex → P&L. Step 3 own given numbers. Step 4 diagnostic (missing without accountant) → onboard. Human still available. |
| **B** | Score < 5 | Step 2: same `/simulate`. Step 3: human — they are blind. |

Edge cases:

- Score exactly 5 → A **only if** Q1 is A or B; else B.
- All Ds on Q1–Q5 → force B + `high_touch_flag`.
- Score ≥ 5 and Q6 = D → still A; flag `time_constraint` (2-minute reminder copy).
- Score < 5 but Q1 = A **and** (Q4 or Q5 = D) → B.

Never trust client-side tier. Recalculate on the server.

**Do not show ₱3,000.** Do not show fake 87% / 3x. Price on pay wall only: ₱9,999 / ₱9,999. Same catalog for A and B.

---

## Questions (copy lock)

1. Do you currently record your daily fuel dipstick readings?  
   A +3 every day · B +1 sometimes · C 0 know I should · D −1 don’t know what a dip is
2. How do you track your station's sales and inventory right now?  
   A +3 digital · B +2 paper · C 0 mental · D −1 don’t track
3. In the last 30 days, have you run out of fuel unexpectedly?  
   A +2 never · B 0 once · C −1 two–three · D −2 more than three
4. Do you know your exact fuel stock level at closing yesterday?  
   A +3 to the liter · B +1 approx · C 0 guess · D −1 no idea
5. If I asked for your last 7 days of sales data, how long would it take to produce?  
   A +3 under 2 min · B +1 5–10 · C 0 30+ · D −2 can’t
6. How many minutes per day could you or your attendant spare for a simple daily check-in?  
   A/B/C all +1 for UX only (10+ / 5 / 2 min) · D 0 none — not graded

---

## Store (after privacy + NPC addendum)

Anonymous until CTA. Store: `session_id`, answers Q1–Q6, server `raw_score`, `detected_tier`, `worst_question`, `ux_density`, `high_touch_flag`, `created_at`, optional UTM.  
Contact (name/phone/email) **only** if they start trial or tap WhatsApp.

Do not write a row until `dipstify.com/privacy.html` names this quiz.

---

## Sequence

19–22 Aug lock + privacy · 25–29 Aug UI + API · 1–5 Sep results/CTAs · 8–12 Sep NPC in scope · 15–19 Sep Helium dry run · 22–29 Sep soft live · **6–10 Oct ads on Dipstify Page only**.
