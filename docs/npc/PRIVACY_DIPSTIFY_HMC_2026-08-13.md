# Privacy Policy — Dipstify Station

**Operator:** Helium Marketing Corporation (HMC), Philippines  
**Product:** Dipstify Station (Owner’s Lens, OpsVerified, AdminVerified, StaffVerified, PnLVerified)  
**URLs:** https://dipstify.com/privacy.html · https://dipstify.com · https://ops.dipstify.com  
**Last updated / effective:** 13 August 2026  
**Law:** Data Privacy Act of 2012 (RA 10173)

For NPC: this is Data Processing System **Dipstify Station**. HMC is PIC for owner accounts, waitlist, billing, and support. HMC is PIP for station staff/ops/HR data entered by the station owner. One HMC registration covers this DPS and ODO (separate notice).

**Contacts**
- Privacy / data-subject requests: privacy@hmcmarketing.tech  
- Data Protection Officer: dpo@hmcmarketing.tech  
- General: edc.helium@gmail.com  

NPC registration: in progress / to be filed under HMC.  
Public launch (Helium commercial): targeted 8 October 2026. Second paying client requires E+1 RLS + DPA.

---

## 1. Who we are

This policy covers Dipstify Station products operated by Helium Marketing Corporation (HMC): Owner’s Lens (Station Control), OpsVerified (Fuel-ops), AdminVerified, StaffVerified, and PnLVerified (including Excel/intake where used). StationRescue and Delivery have or will have their own notices when those products collect data differently.

Dipstify is HMC’s fuel-station operating system brand for independent Philippine stations (Helium Fuels is the pilot client). Domains in use include dipstify.com and ops.dipstify.com.

## 2. Controller vs processor (important)

**Station owner (customer)** is generally the Personal Information Controller for employee/HR data, payroll figures, and day-to-day station operations data entered for their stations.

**HMC / Dipstify** acts as Personal Information Processor for that customer data when we host and process it in our apps — and as Controller for our own business accounts (owner logins, waitlist, billing, support, product telemetry).

A Data Processing Agreement (DPA) should be signed for StaffVerified payroll / government-number processing; until then, this policy + your subscription terms describe the relationship.

## 3. What we actually collect

**Owner’s Lens (Station shared DB)**
- Owner/admin account: email, password (Supabase Auth), display name, role
- Multi-station account structure (e.g. Helium Hb/Ht/Hsj/Hd/Hq/Hbani/Hc)
- Operational KPIs and notes you enter (cash, variance summaries, decisions, tasks)
- Waitlist / onboarding intake: company/owners, permits metadata, package selection, tank details, manpower
- Human-assist requests (and Telegram delivery when a bot token is configured)
- Lens AI chat prompts/responses when Ask Lens / onboarding guidance is used

**OpsVerified (Fuel-ops / Ops DB today)**
- Team Leader / staff identity in-app: username, PIN (custom auth — not always Supabase Auth), station assignment, level (e.g. L1–L5)
- Shift logs (structured text and fields), completion status, overrides
- Wet-stock / tank / variance / stock operational readings
- Evidence photos (≥50/day planning load) and photo metadata — images in object storage, not as Postgres blobs
- Draft shift logs and related ops tables

**AdminVerified**
- Compliance item types/records (permits, clearances, due dates, status history) tied to stations
- Account auth for Admin app users

**StaffVerified**
- Employee names, roles, schedules/attendance as used in product
- Sensitive personal data when payroll modules are used: SSS / PhilHealth / Pag-IBIG numbers and remittance-related amounts
- PINs / credentials created at onboarding (e.g. initial PIN with forced-reset flag when that flow is live)

**PnLVerified / accounting**
- Cash and P&L figures you enter or import (may remain Excel/intake if not yet fully in-app)
- May be handled by the same Admin person as HR or by a separate assignee — product supports either

We do not intentionally collect customer payment card PANs inside Dipstify Station apps (subscription billing, when live, should use a payment processor).

## 4. Why we collect it

- **Contract** — provide Station software to the owning business
- **Legitimate interests** — prevent fraud/ghost dipping, secure multi-station access, improve Lens answers, keep the service reliable
- **Legal obligation** — where employment/tax/compliance records must be retained by the customer; we support retention on their behalf
- **Consent** — optional AI features, Telegram assist, marketing waitlists

## 5. How we use it

- Authenticate owners and station staff; enforce station scoping in the product UI
- Run daily ops: shift logs, variance, stock signals into Owner’s Lens
- Show compliance and (when attached) staff/payroll summary signals to the owner
- Onboard new stations/staff; route human-assist requests
- Improve AI guidance (Lens) using prompts and operational context you provide
- Bill and support the customer account

## 6. Who sees it

- **Your station users** — per role (owner, operator/TL, admin/HR)
- **HMC operators** — only as needed for pilot support, abuse, or onboarding assist
- **Processors:** Supabase (multiple projects today: Station shared, Ops, Staff), Vercel (hosting), Anthropic (Lens AI), Telegram (if human-assist bot enabled), Google (only if you paste Drive links)

Data hosting is typically on Supabase regions such as AWS ap-southeast-1 (Singapore) — a cross-border transfer from the Philippines that we disclose here.

We do not sell station employee or fuel-ops data to advertisers.

## 7. Cross-module flows (real)

- Ops → Lens: ops-lens-summary style signals (variance/stock) so owners see exceptions, not raw photo dumps
- Staff → Lens: payroll/team summary bridges when enabled
- Admin → Lens: compliance signals from shared Station DB when enabled
- Onboarding wizard may bulk-create staff accounts that later sign into Ops/Staff

**Honest limitation:** station separation in Ops is enforced strongly in the app UI today; database-level RLS for multi-client isolation is designed (Phase E) and not fully applied until identity model + Phase E+1. With a single pilot client this residual risk is limited; it must be closed before a second client goes live.

## 8. Security (honest current state)

- HTTPS, Supabase Auth for owner apps, PIN auth for many Ops floor users
- Photos in object storage; metadata in DB
- Secrets for Lens↔Ops bridges; admin elevated keys only on servers
- PINs and payroll numbers are sensitive — customers must limit Admin seats and rotate initial PINs

## 9. Retention

- Operational logs & photos — while the customer subscription is active and as needed for disputes; customers should set retention for evidence photos
- HR / government numbers — per customer’s legal retention duties (often years for remittance records)
- AI chats — retained as needed for safety/quality then deleted or aggregated
- On account termination — customer may request export/deletion; we delete or return processor data subject to legal holds

## 10. Your rights

**Employees / TLs:** request access/correction via your station Admin/owner first (they are usually the Controller). You may also contact HMC at privacy@hmcmarketing.tech; we will route appropriately.

**Owners:** RA 10173 rights of information, access, correction, erasure, objection, portability, and NPC complaint.

NPC: www.privacy.gov.ph

## 11. Contact

Helium Marketing Corporation — Dipstify  
Privacy / data requests: privacy@hmcmarketing.tech  
Data Protection Officer: dpo@hmcmarketing.tech  
General: edc.helium@gmail.com  
Products: Owner’s Lens · OpsVerified · AdminVerified · StaffVerified · PnLVerified
