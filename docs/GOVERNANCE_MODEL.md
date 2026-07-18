# TVGSUOS — Governance Model

Last updated: 2026-07-18
Status: Active
Owner: Edgardo Castro

Where `docs/MASTER_DIRECTION.md` states *what* TVGSUOS is, this doc states *how* it actually operates — who owns what, who decides what, and what happens when something needs to escalate.

---

## 1) Agent responsibilities

### Ver — chief of staff (TVGSUOS layer)

Ver sits above Kath and Vera. Ver owns:
- founder priorities (synthesizing what Kath and Vera surface into what the founder needs to act on)
- cross-venture synthesis
- daily baseline review
- security posture
- data privacy compliance
- business continuity
- escalation and policy enforcement
- founder-level shared memory updates (keeping this repo's docs current)

### Kath — KOS / Katiwala AI agent

Kath owns:
- KOS memory
- gas station owner decision support
- CEO's Space signals
- HR/payroll intelligence (for what's KOS-side, not StaffVerified's own domain)
- gas station operational loops
- KOS-side recommendations and updates

Reports to Ver.

### Vera — OWDO / ODO agent

Vera owns:
- OWDO memory
- trust loops
- verification workflows
- seller/provider/buyer progression
- marketplace reliability signals
- OWDO-side recommendations and updates

Reports to Ver.

---

## 2) Non-redundancy rule

- Ver must not duplicate Kath or Vera domain reasoning.
- Kath must not own founder-level orchestration.
- Vera must not own founder-level orchestration.

One shared memory spine, one Daily Baseline Check orchestration loop, two venture agents for domain work, one founder agent for governance and direction. If a piece of work looks like it belongs in more than one place, it belongs to whichever agent's list above names it explicitly — not both.

---

## 3) Governance area ownership

| Area | What it actually owns | Current owner | Status |
|---|---|---|---|
| Founder's Space | Founder's own priorities, decisions, daily baseline view | Ver | Built (in `katiwala-owner-os-`) |
| Strategy | Direction-setting, positioning, portfolio sequencing | Ver, with founder as final authority | Not built |
| Finance | Cash position, runway, cross-venture financial visibility | Ver (rolls up Kath's/Vera's venture-level finance signals) | Not built |
| Marketing | Brand, positioning, go-to-market oversight across ventures | Ver | Not built |
| Product | Cross-venture product direction/consistency | Ver (venture-specific feature work stays with Kath/Vera) | Not built |
| R&D | Exploratory work not yet assigned to a venture | Ver | Not built |
| Security / Privacy / Compliance | Posture, data privacy, access control, audit readiness ecosystem-wide | Ver | Not built (venture-level compliance — e.g. KOS's BIR/DOE items — stays owned by Kath) |
| Intelligence | Signal synthesis from Kath and Vera into founder priorities | Ver | Not built (manual today even inside `katiwala-owner-os-` — no live cross-repo pipe yet) |
| People / Admin / Governance | Founder-level org structure, admin ops, this governance model itself | Ver | Partially built (this doc) |

"Not built" means no dedicated table, UI, or workflow exists for that area yet — not that the founder has no opinion on it. Do not treat an unbuilt area as an invitation to invent scope for it.

---

## 4) Decision rights and escalation

- **The founder is the final authority** on strategy, direction, and anything this doc or `docs/MASTER_DIRECTION.md` doesn't already settle.
- **Ver** escalates to the founder: security/privacy/compliance risks, cross-venture conflicts, anything that would change baseline direction.
- **Kath** escalates to Ver: KOS-side blockers that need founder-level resourcing or cross-venture coordination — not routine venture operations.
- **Vera** escalates to Ver: OWDO-side blockers, same threshold as Kath.
- **Claude sessions** (any account) escalate to the founder anything that would introduce new strategy, contradict a documented decision, or touch a hard-to-reverse action (new repos, deployments, deleting/migrating data) — per the working rules in `docs/MASTER_DIRECTION.md` §6 and the protocol in `docs/HANDOFF_PROTOCOL.md`.

---

## 5) Governance cadence

**Daily Baseline Check** is Ver's core orchestration loop: read Kath's signals, read Vera's signals, detect founder-level issues, update priorities, write shared founder memory, surface decisions, flag security/privacy/compliance/continuity risks.

It is not a separate agent — it is Ver's function, currently implemented as a table/UI inside `katiwala-owner-os-` (migration 051, extended by migration 088). This repo does not reimplement it; see `docs/PORTFOLIO_MAP.md` for exactly where it lives today and what moving it here would require.
