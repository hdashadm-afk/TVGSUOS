# Privacy comparison — ODO vs Dipstify Station

Last updated: 2026-08-13  
Status: Founder summary (not legal advice)  
Sources: live product behavior + rewritten policies  
Launch gates: `docs/PRIVACY_LAUNCH_GATES.md` — **ODO Property V1 = 8 Sept 2026** · **Dipstify = 8 Oct 2026**

| Parameter | ODO (OwnerDirect) | Dipstify Station | How we’re doing | Suggestion |
|---|---|---|---|---|
| **PIC / roles** | HMC is Controller for user accounts on ownerdirect.online | Owner = Controller for staff/ops data; HMC = Processor (+ Controller for owner accounts) | ODO clear; Dipstify dual-role now stated | Sign a short **DPA** with each station customer for Staff/payroll |
| **What we collect** | Account, Drive ID **link**, listings Property/Vehicles, photos, bookings, PayMongo refs, loan-checker leads, VERA chats | Owner accounts, PIN staff, shift logs, tank/variance, evidence **photos**, permits, HR/payroll numbers (when Staff used), Lens AI, onboarding | Policies now match MVP (ODO escrow claims removed) | Keep policies versioned whenever onboarding/Staff fields change |
| **Sensitive data** | Gov ID via Drive link; title/OR-CR docs | SSS/PhilHealth/Pag-IBIG; PINs; cash/P&L; photos | Dipstify higher sensitivity overall | Minimize gov numbers until payroll module truly live; force PIN reset |
| **Payments** | PayMongo (no PAN stored by us) | Subscription processor TBD; ops cash is business data not card PAN | ODO OK | Name PayMongo/equivalent in Dipstify ToS when billing goes live |
| **Processors** | Supabase, Vercel, PayMongo, AI provider, Google Drive (user-hosted) | Supabase (**3 Station-family DBs** today), Vercel, Anthropic, Telegram (optional) | Disclosed | After Ops merge, update Dipstify policy “3→2 Station-family DBs” |
| **Cross-border** | Supabase region (typically SG) | Same | Disclosed | One sentence in signup checkbox both products |
| **Cookies** | Auth + `odo_vertical` lane | Auth/session; Ops may use local device storage | ODO explicit | Add Dipstify cookie/localStorage line on Lens login |
| **Access control** | Roles + evolving RLS | UI station scoping strong; **DB RLS multi-client not fully on** (Phase E) | Biggest residual risk on Dipstify | **E+1 before client #2**; don’t market multi-tenant until then |
| **AI** | VERA / Ask Vera | Lens / onboarding Lens | Disclosed as decision-support | Add “not financial/legal advice” near Lens UI |
| **Retention** | Account/listings/payments; erasure with legal holds | Customer-driven for HR; photos need retention policy | Honest but soft numbers | Publish concrete photo retention default (e.g. 90/180 days) |
| **NPC** | In progress | In progress (HMC) | Same gap | Complete NPC registration once; covers both brands under HMC if structured that way |
| **Public policy URL** | `/privacy` on ODO | `https://dipstify.com/privacy.html` | Dipstify page + links live; ODO rewrite **not deployed** (live still June/escrow) | Push ODO before Sept 8 |
| **Children / employees** | 18+ marketplace users | Employees are data subjects of the station | OK | Employee privacy notice one-pager for Helium TLs |

## Scorecard (practical)

| | ODO | Dipstify |
|---|---|---|
| Policy matches product | Strong (after rewrite) | Strong (first real Station policy) |
| Transparency | Good | Good |
| Security posture narrative | Good / evolving RLS | Honest about UI vs RLS gap |
| Biggest gap | NPC registration; Drive-link sharing hygiene | E+1 RLS; DPA; photo retention; deploy privacy page |
| Biggest strength | ID-not-on-our-disk default (Drive link) | Clear Controller/Processor split for stations |

## Priority suggestions (both)

1. Link policies in footers / signup.  
2. One HMC privacy inbox for both brands: **privacy@hmcmarketing.tech** (create/forward the mailbox).  
3. Finish **NPC** registration for HMC.  
4. Dipstify: **E+1 before second client**.  
5. Dipstify: customer **DPA** for StaffVerified.  
6. Both: counsel review before heavy public launch / YC-scale sharing.  
7. Update policies when Ops DB merges or escrow returns to ODO.
