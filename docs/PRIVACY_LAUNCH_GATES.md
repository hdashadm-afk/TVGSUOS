# Privacy + HMC mail — launch gates

Locked: 2026-08-13  
Status: Founder lock (not legal advice)  
Companion: `docs/PRIVACY_ODO_VS_DIPSTIFY.md`

## Launch dates

| Product | Date | What ships publicly |
|---|---|---|
| **ODO Property V1** | **8 September 2026** | Property verification marketplace (OFW-first). No escrow. |
| **Dipstify Station** | **8 October 2026** | Station OS (Helium pilot commercial). Second paying client is a **separate gate** (E+1). |

HMC company site can come later. It does **not** block either launch. Both products stay under Helium Marketing Corporation.

## Product locks (do not “helpfully” cut)

- **ODO** = Property **and** Vehicles in the app. `/` triage shows both every visit. Sept 8 **campaign** = Property V1 only. Vehicles lane stays live; vehicles GTM = after Property V1 (date TBD).
- **Not MVP / not Sept 8:** bank escrow, seller success fee, Bundle close.
- **Privacy:** two product pages, one HMC privacy inbox. Do not merge ODO + Dipstify into one policy.
- **Dipstify:** owner = Controller for staff/ops data; HMC = Processor (+ Controller for owner accounts).

## Mail (final)

**Ops bucket (shared):** `hmcp119105@gmail.com`. You + Rojelyn + later assists use this inbox. **Not** `rojelyndv07@gmail.com`.

**2FA / recovery phone = Ed only.** If someone leaves, you change the password. Do not use this box for `dpo@` or founder contracts.

| Address | Who | Lands in |
|---|---|---|
| `ed.castro@hmcmarketing.tech` | Founder only | Workspace (you). Optional extra: forward to `edc.helium@gmail.com` |
| `dpo@hmcmarketing.tech` | Ed (NPC) | Alias on `ed.castro@` — **not** the shared Gmail |
| `operations@hmcmarketing.tech` | Shared ops | `hmcp119105@gmail.com` |
| `privacy@hmcmarketing.tech` | Public privacy | `hmcp119105@gmail.com` |
| `hello@hmcmarketing.tech` | HMC inbound | `hmcp119105@gmail.com` |
| `support@ownerdirect.online` | ODO users | `hmcp119105@gmail.com` |
| `support@dipstify.com` | Dipstify users | `hmcp119105@gmail.com` |

**Rojelyn (from the shared Gmail) sends to `ed.castro@` if:** NPC/lawyer, payment dispute, scam / “wire to escrow”, ID/PIN/payroll leak, press/bank/partner asking for the founder.

---

## Shared HMC — before ODO Sept 8

Hard = launch cannot go public without it.

| # | Gate | Hard? | Now (13 Aug) |
|---|---|---|---|
| H1 | Create `ed.castro@`, `operations@`, `privacy@` on `hmcmarketing.tech` | **Hard** | Not created |
| H2 | Forward `ed.castro@` → `edc.helium@gmail.com` | **Hard** | Not set |
| H3 | Shared ops Gmail `hmcp119105@gmail.com` created; route privacy/operations/hello + both support@ there; share login with Rojelyn (2FA on Ed’s phone) | **Hard** | Gmail created; routing not set |
| H4 | Send a test mail to `privacy@` and confirm it arrives | **Hard** | Not done |
| H5 | Rojelyn one-pager: triage rules above (Telegram or Notion — she has no Desktop folder) | Soft | Not written |
| H6 | **NPC: submit one HMC registration** (two DPS: ODO + Dipstify) — pack: `docs/NPC_APPLICATION_PACK.md` | **Hard = filed before 8 Sept.** Certificate in hand is soft (NPC review time). | Not filed |
| H7 | HMC company website | Not a launch gate | Later |
| H8 | Counsel skim of both policies | Soft | Not done |

---

## ODO — Property V1 · 8 Sept 2026

| # | Gate | Hard? | Now (13 Aug) |
|---|---|---|---|
| O1 | Privacy page = current MVP: OFW-first, Property **and** Vehicles disclosed, **no escrow** | **Hard** | File rewritten locally (`00a501e` + later `privacy@hmcmarketing.tech` edits). **Live site still 26 June (escrow / property-only).** |
| O2 | Commit + push + Vercel deploy; https://ownerdirect.online/privacy matches the rewrite | **Hard** | Not live |
| O3 | Footer + signup + loan-checker + Terms use `privacy@hmcmarketing.tech` | **Hard** | In working copy; not live |
| O4 | Signup checkbox: Privacy Policy link | **Hard** | Link exists; confirm copy after deploy |
| O5 | Campaign + ads = **Property V1 / OFW**. Do not sell escrow. Do not hide Vehicles on `/` | **Hard** | Product lock already |
| O6 | Forward `support@ownerdirect.online` → `operations@` (create alias if missing) | Soft if privacy@ works; **Hard** if you publish a support address | Check DNS |
| O7 | Settings deletion request still works | Soft | Already in product |
| O8 | Vehicles GTM / “V1 vehicles” | **Not Sept 8** | Same app, later push |

**ODO go / no-go (Sept 8):** H1–H4 + O1–O5 all green. If live `/privacy` still mentions escrow, **do not launch**.

---

## Dipstify — 8 Oct 2026

| # | Gate | Hard? | Now (13 Aug) |
|---|---|---|---|
| D1 | `https://dipstify.com/privacy.html` live | **Hard** | **Done** |
| D2 | Login / footer / Ops login links to that URL | **Hard** | **Done** (Lens + Fuel-ops). Re-check after next deploys. |
| D3 | Privacy contact = `privacy@hmcmarketing.tech` on that page | **Hard** | Edited locally; **not pushed** |
| D4 | Push + deploy Dipstify `privacy.html` contact change | **Hard** | Waiting |
| D5 | Forward `support@dipstify.com` → `operations@` | Same as O6 | Check DNS |
| D6 | Helium TL one-pager: “ask Admin first; HMC privacy@ if needed” | Soft | Not written |
| D7 | Photo retention default named in policy (e.g. 90/180 days) | Soft | Still “customer-driven” |
| D8 | Staff/payroll **DPA** template (HMC = processor) | Soft for Helium-only · **Hard before client #2 Staff** | Not drafted |
| D9 | **E+1 RLS** (DB multi-client isolation) | **Hard before client #2** · not required if Oct 8 = Helium only | Phase E designed, not fully on |
| D10 | Name billing processor in ToS when subscriptions charge | When billing goes live | TBD |
| D11 | Update policy if Ops DB merge changes “3 Station-family DBs” | When merge ships | Not merged |

**Dipstify go / no-go (Oct 8, Helium commercial):** H1–H4 + D1–D4 green.  
**Second station client:** D8 + D9 green — do not market multi-tenant until then.

---

## Sequence (this week → Oct 8)

1. **This week:** create `ed.castro@`, `operations@`, `privacy@`, **`dpo@`** + forwards; test `privacy@` and `dpo@`.  
2. **This week:** gather SEC / GIS / business permit; appoint DPO; start NPCRS (see `docs/NPC_APPLICATION_PACK.md`).  
3. **This week:** commit/push ODO privacy + HMC email; confirm live `/privacy`.  
4. **This week:** push Dipstify `privacy.html` contact line; confirm live page.  
5. **Before Sept 8:** **submit** NPC application (notarized NPCRS form). Property V1 copy only; no escrow; `/` still shows both lanes.  
6. **Sept 8:** ODO Property V1 live.  
7. **Before Oct 8:** Dipstify contact + ops forward; Helium TL note.  
8. **Oct 8:** Dipstify Helium commercial. E+1 still blocks client #2.

## Out of this task

- Building the HMC website  
- Merging the two privacy policies  
- Turning on ODO escrow  
- Hiding Vehicles from ODO  
- Ops DB merge / GitHub rename (Station plan, not a privacy gate)
