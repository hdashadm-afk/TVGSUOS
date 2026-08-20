# NPC application pack — HMC (ODO + Dipstify)

Locked: 2026-08-13  
Status: Founder pack (not legal advice)  
Portal: https://npcregistration.privacy.gov.ph  
Guide: https://privacy.gov.ph/pips-and-pics/register/

## One application, two systems

Do **not** file two company registrations. NPC registers the **juridical entity**.

| Field | Value |
|---|---|
| PIC / PIP | **Helium Marketing Corporation (HMC)** |
| Head of organization | Edgardo Castro (confirm exact name on SEC papers) |
| DPO | Edgardo Castro (until you appoint someone else) |
| Official DPO email | **`dpo@hmcmarketing.tech`** — NPC requires a *position* mailbox, not `ed.castro@` or Gmail |
| Public privacy inbox | `privacy@hmcmarketing.tech` (can forward to `operations@`; DPO mail stays `dpo@`) |
| Data Processing Systems | **1. ODO / OwnerDirect.online** · **2. Dipstify Station** |

Why file: both products are customer-facing and process **sensitive personal information** (government IDs; Dipstify may process SSS / PhilHealth / Pag-IBIG). File even if you are still under 1,000 individuals.

HMC is **PIC** for ODO users and Dipstify owner accounts. HMC is also **PIP** for station employee/ops data entered by the station owner.

---

## Documents to gather (corporation)

From NPC Circular 2022-04 §11 — upload clear scans:

1. **SEC Certificate of Registration** — Helium Marketing Corporation  
2. **Certified true copy of latest GIS** (General Information Sheet)  
3. **Valid business permit**  
4. **Notarized Secretary’s Certificate** (or equivalent) **appointing/designating** the DPO — NPC wants the word **appointed** or **designated**, not just “authorized”  
5. After you encode in NPCRS: **system-generated DPO form** — print, DPO + Head of Org sign, **notarize**, scan, upload (only the NPCRS PDF counts)

Fee after NPC validates: typically **₱1,000** (Metro Manila / cities) or **₱2,500** (national). Pay in NPCRS; then download Certificate + Seal. Valid **1 year**.

---

## NPCRS steps

1. Create `dpo@hmcmarketing.tech` (forward to `ed.castro@` / Gmail for now).  
2. Sign up at https://npcregistration.privacy.gov.ph with that DPO email.  
3. Encode HMC org details + Head of Org.  
4. Add **both** DPS below (priority: online apps + sensitive data).  
5. Upload SEC / GIS / permit / DPO appointment.  
6. Save → export DPO form → notarize → upload.  
7. Wait for validation → pay → download seal.  
8. After Sept 8: put seal + “NPC Registration No. ___” on both privacy pages (replace “in progress”).

Register **within 20 days of launch / DPO appointment** if you are covered. Aim to **submit before 8 Sept** even if the certificate is still pending.

---

## DPS 1 — paste into NPCRS

**Name:** ODO / OwnerDirect.online  
**URL:** https://ownerdirect.online  
**Role:** Personal Information Controller  
**Purpose:** Owner-direct verification marketplace for Property and Vehicles, built first for OFWs buying or checking Philippine assets from abroad. Verify listing and parties before money is sent. No bank/law-office escrow in the current MVP.

**Personal data (current MVP):** account (email, name, role, country/province); Google Drive **link** to government ID; Property and Vehicle listing data and photos; poke / unlock / booking records; PayMongo payment **references** (no card PAN); OFW loan-checker leads if consented; VERA chat messages.

**Sensitive data:** government-issued ID (via Drive link); title / OR-CR documents when provided for certify.

**Processors:** Supabase (typically Singapore), Vercel, PayMongo, AI provider for VERA, Google (user’s Drive).

**Not in this DPS:** escrow custody, wire of purchase funds, Dipstify station data.

---

## DPS 2 — paste into NPCRS

**Name:** Dipstify Station (Owner’s Lens, OpsVerified, AdminVerified, StaffVerified, PnLVerified, cold quiz)  
**URLs:** https://dipstify.com · https://dipstify.com/quiz · https://ops.dipstify.com  
**Role:** PIC for owner/admin accounts, waitlist, billing, support, **anonymous quiz sessions**. **PIP** for station staff, payroll, shift, tank, and photo data entered by the station owner (Helium Fuels is pilot).

**Personal data:** owner emails/passwords/roles; PIN staff identity; shift logs; tank/variance; evidence photos; permits metadata; onboarding; Lens AI chats; HR/payroll numbers when Staff module is used; **quiz answers + session_id + tier** (no name until CTA).

**Sensitive data:** SSS / PhilHealth / Pag-IBIG when payroll is used; PINs; government IDs if collected in onboarding.

**Processors:** Supabase (multiple Station-family projects today), Vercel, Anthropic (Lens), Telegram if assist bot is on.

**Not in this DPS:** ODO marketplace users.

---

## After filing

| When | Action |
|---|---|
| Submitted | Privacy pages may say “NPC registration: filed, pending certificate” |
| Certificate issued | Add registration number + display Seal on ODO `/privacy` and dipstify.com/privacy.html |
| +1 year | Renew in NPCRS (~30 days before expiry) |
| New product / escrow / new DB | Minor amendment — add/update DPS; don’t file a second company |

## You still do (cannot be done from this repo)

- Create `dpo@hmcmarketing.tech`  
- Pull SEC / GIS / business permit  
- Notarize DPO appointment + NPCRS form  
- Click submit and pay on NPCRS
