# Privacy Policy — ODO (OwnerDirect.online)

**Operator:** Helium Marketing Corporation (HMC), Philippines  
**Product:** ODO / OwnerDirect.online  
**URL:** https://ownerdirect.online/privacy  
**Last updated / effective:** 13 August 2026  
**Law:** Data Privacy Act of 2012 (RA 10173)

For NPC: this is Data Processing System **ODO / OwnerDirect.online**. HMC is the Personal Information Controller. One HMC registration covers this DPS and Dipstify Station (separate notice).

**Contacts**
- Privacy / data-subject requests: privacy@hmcmarketing.tech  
- Data Protection Officer: dpo@hmcmarketing.tech  
- General: edc.helium@gmail.com  

NPC registration: in progress / to be filed under HMC.

---

## 1. Who We Are

ODO (OwnerDirect.online) is operated by Helium Marketing Corporation (HMC), Philippines.

ODO is an owner-direct verification marketplace for Property and Vehicles. It is built first for OFWs buying or checking assets in the Philippines from abroad — verify the listing and the people before you send money. Local PH buyers, owner-sellers, and licensed providers also use the same platform. ODO is not a broker, not a bank, and not an escrow custodian.

For data privacy, HMC / ODO is the Personal Information Controller (PIC) for data collected on OwnerDirect.online.

## 2. Current Product Status (What This Policy Covers)

This policy matches the live MVP only. It does not describe future bank, escrow, or closing features.

**Live today**
- Two lanes every visit: Property and Vehicles (motorcycle / car / truck). You choose at the front door.
- Primary user we designed for: OFW (passport / overseas residence, SPA or relative on the ground).
- Also on the product: local PH buyer, seller/owner (creator), licensed provider.
- Trust flow: government ID via Google Drive link → admin verify → poke / unlock / book / list.
- Optional certify badges: LRA (property) or HPG (vehicles) when you pay to certify.
- Fees collected in-app via PayMongo: unlock/contact-reveal, certify, prepaid provider consults.
- Free OFW loan-readiness checker for housing and vehicle financing (lead form if you ask to be contacted).

**Not live — do not treat as current practice**
- No bank or law-office escrow inside ODO. We do not hold purchase money, do not run title-transfer escrow, and do not process overseas wires for a sale.
- No AMLA / BSP-regulated escrow operations.
- No automatic filing of your data with LRA, BIR, HPG, or Registry of Deeds. Certify uses documents/results you and ODO arrange for a badge — it is not a government filing service.
- Legal transfer of a house, lot, or vehicle remains between buyer and seller (and their own counsel / LTO / Registry). ODO does not guarantee the close.

Public launch of **Property V1** is targeted 8 September 2026. Vehicles remain in the product; they are not the Sept 8 campaign.

## 3. What We Actually Collect

We collect only what the live product needs today.

**Account & profile**
- Email and password (Supabase Auth)
- Display name; role (OFW buyer, local buyer, seller-creator, or provider — stored as buyer / creator / provider)
- Country of residence (OFW countries listed at onboarding) and PH province
- Optional waitlist / early-bird flags

**Identity** (gate for poke, unlock, book, list, post a requirement)
- A Google Drive link to your government ID (passport is typical for OFW; PhilSys, UMID, driver’s license, etc. also accepted)
- ODO stores the link and an admin verification flag — the ID file stays in your Drive as the primary flow
- Admin reviewers open the link you shared to approve or reject

**Listings — Property**
- Headline, location/province, price, property type, title/CTC status, owner or SPA authority
- Photos (ODO storage and/or Drive links)
- Optional: CTC, tax declaration, SPA link, LRA certify artifacts when paid

**Listings — Vehicles**
- Headline, location/province, price, class (motorcycle / car / truck), OR/CR status, owner or SPA authority
- Photos (ODO storage and/or Drive links)
- Optional: OR/CR Drive link, HPG certify artifacts when paid

**OFW / buyer activity**
- Pokes (interest) on Property or Vehicle listings
- Unlock / contact-reveal payments and status
- Bookings of licensed providers (lawyer, geodetic, mechanic, LTO, insurance, etc.)
- Requirements you post (province, property type or vehicle class, budget)
- Optional local representative / SPA details you enter so someone on the ground can coordinate — they do not get your account password or payment card

**Provider profiles**
- Service types, provinces covered, bio, credentials for admin approval, consult availability

**Payments (PayMongo)**
- We do not store full card numbers. PayMongo processes payment; we store references, amounts, purpose (unlock, certify, consult), and status

**Loan checker (OFW tool)**
- Name, email, mobile, province, vertical (property / vehicle), mode (Pag-IBIG / bank / auto / financing), checklist score, consent flag — only if you ask to be contacted

**Assistant (VERA / Ask Vera)**
- Messages you send in-product and page context used to answer
- Operational logs for product quality — not sold for ads

**Technical**
- Session / auth cookies, including odo_vertical (Property or Vehicles after triage)
- IP and basic device/browser signals via Vercel / Supabase for security

We do not intentionally collect: bank login credentials, full card PAN/CVV, remittance PINs, or biometrics.

## 4. Why We Collect It (Legal Bases)

- **Contract** — to run your account, listings, ID verification, unlocks, certify badges, and provider bookings.
- **Legitimate interests** — trust and fraud prevention for remote OFW buyers (ID review, certify badges, abuse prevention), product security, and improving VERA answers.
- **Consent** — loan-checker follow-up, optional marketing/referral features, and any sharing beyond a flow you started.
- **Legal obligation** — where Philippine law requires retention of payment/accounting records for fees we actually collect (PayMongo unlock / certify / consult). We do not claim escrow or property-close retention schedules for money we do not hold.

We do not sell personal data. We do not sell listing contact data to agents for cold outreach.

## 5. How We Use It

- Create and secure your account and role (OFW buyer, local buyer, seller, provider)
- Show Property or Vehicles after you choose a lane at the front door
- Verify identity before poke / unlock / book / submit listing / post requirement
- Publish and review Property and Vehicle listings; issue optional LRA or HPG certify badges
- Reveal seller contact only after paid unlock (when that flow applies)
- Collect PayMongo fees for unlock, certify, and consult bookings; pay out providers per platform rules
- Attribute referrals when a creator/seller link is used
- Admin moderation (ID review, listing review, provider approval)
- Support and abuse response — including reports that someone asked you to bypass verify-first and wire money directly

## 6. Who Sees Your Data

**Inside ODO**
- You — your profile and your content
- Counterparties — only what a completed flow allows (unlocked contact, booking details)
- A representative you name — only what you choose to share for on-the-ground coordination; they are not an escrow payee
- ODO admins — ID links, listings, and payment refs needed to operate trust and support

**Processors / infrastructure**
- Supabase — database, auth, storage (typically Singapore / ap-southeast-1)
- Vercel — website hosting
- PayMongo — payment processing for in-app fees
- OpenAI / Anthropic (or configured model provider) — VERA when enabled
- Google — only because you host ID/docs on Drive and share a link; Google’s terms apply to your Drive files

**Not current practice**
- No escrow law office or partner bank receives your ID or funds through ODO
- We do not automatically submit your personal data to LRA / BIR / HPG / Registry of Deeds
- We do not share data with marketing list brokers or real-estate agents for cold outreach

## 7. OFW-Specific Protections (Current MVP)

ODO was built so an OFW can check a house, lot, motorcycle, car, or truck from abroad without sending money on trust.

- Same RA 10173 rights whether you are overseas or in the Philippines. A relative or SPA on the ground does not waive your rights over your account data.
- ID-verified buyers only past the free layer. Contact is not auto-released.
- Verify first: listing + people. Do not wire purchase money to a seller because of photos or chat on ODO.
- ODO does not hold your purchase funds and does not run escrow. If anyone claiming to be ODO asks you to send the buy price to a “custodian” or personal account, report it to privacy@hmcmarketing.tech.
- Loan checker is a readiness tool, not a bank application. Sharing a lead with a lender happens only if you consent.
- Data hosting is typically Singapore (Supabase) — a cross-border transfer from the Philippines, disclosed here.

## 8. Cookies & Similar Tech

Essential only for the product to work:
- Auth / session cookies (Supabase)
- odo_vertical — remembers Property or Vehicles after triage (does not skip the front-door choice forever; used to scope later pages)
- Preference / theme if present

No advertising pixels are required for core ODO use. If we add analytics later, we will update this policy.

## 9. Retention

- Account & profile — while your account is open, then as needed for support/disputes
- Listings & media (Property and Vehicles) — while listed or as needed for dispute history after unpublish
- Payment references for in-app fees — as required for accounting and chargebacks
- ID Drive links — while verification is needed; you may replace the link; deletion requests honored subject to open disputes
- Loan-checker leads — until you withdraw consent or we close that campaign
- Assistant logs — only as long as needed for safety and quality, then deleted or aggregated

You may request erasure under RA 10173; some payment/audit rows may be kept where law requires. We do not keep 10-year “escrow close” files because we do not operate escrow.

## 10. Your Rights (RA 10173)

You may request: information, access, correction, erasure, objection, and portability, and you may complain to the National Privacy Commission (www.privacy.gov.ph).

Email: privacy@hmcmarketing.tech — we aim to respond within 15 business days. Signed-in users can also start a deletion request from Settings.

If you are an OFW, the same rights apply; using a relative on the ground does not waive your rights over your account data.

## 11. Security (Honest Current State)

- HTTPS / TLS in transit
- Supabase Auth for accounts
- Role checks in app code for buyer / seller / provider / admin actions
- Row Level Security (RLS) on many tables — still evolving; admin tools use elevated keys only on server
- ID files preferably stay in your Google Drive; treat link sharing carefully (“anyone with the link” is convenient but increases exposure — use the minimum sharing needed for admin review)

No system is perfect. Report suspected abuse to privacy@hmcmarketing.tech.

## 12. Children

ODO is for adults (18+) engaging in Property or Vehicle transactions. We do not knowingly create accounts for persons under 18.

## 13. Changes

We will update this page when collection or processors change in a material way — including if escrow or bank closing ever goes live. Until then, older pages or decks that mention escrow custodians do not describe the current product.

## 14. Contact

Privacy / data requests: privacy@hmcmarketing.tech  
Data Protection Officer: dpo@hmcmarketing.tech  
General: edc.helium@gmail.com  
Operator: Helium Marketing Corporation — OwnerDirect.online (ODO)

National Privacy Commission: www.privacy.gov.ph · info@privacy.gov.ph
