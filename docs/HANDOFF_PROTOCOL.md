# TVGSUOS — Handoff Protocol

Last updated: 2026-07-18
Status: Active
Owner: Edgardo Castro

The founder actively uses two Claude accounts interchangeably — when one runs out of credits, work continues in the other, cold, with no memory of the prior session. This doc is what makes that work.

---

## 1) On starting a session in this repo

Read, in order, before doing anything else:

1. This file.
2. `FOUNDER_OS.md` — the running, dated implementation log. This is the fastest way to know the actual current state; treat it as more current than your own assumptions.
3. `docs/MASTER_DIRECTION.md` — the baseline (mission, ecosystem, governance areas, ventures, working rules).
4. `docs/GOVERNANCE_MODEL.md` and `docs/PORTFOLIO_MAP.md` as needed for the specific task.

Do not start building against remembered context from a prior conversation that isn't reflected in these files. If it isn't written down here, treat it as not decided.

---

## 2) Working rules (restated from `docs/MASTER_DIRECTION.md` §6)

1. Repo Markdown files are canonical memory.
2. Do not drift from the agreed direction.
3. Do not introduce new strategy unless the founder explicitly asks for it.
4. Finalized direction takes priority over suggestions.
5. Keep outputs simple, trackable, reusable, and founder-readable.
6. Prefer stable structure over cleverness; don't redesign for style alone.
7. Prefer docs-first when direction is being locked; implementation-first only once direction is already settled.

---

## 3) On ending a session (or after any meaningful piece of work)

Provide, in this order:

1. **What changed** — plain description of the actual work done.
2. **Files updated** — exact paths, not "various files."
3. **Open questions** — anything genuinely the founder's call, not yours to guess.
4. **Risks or inconsistencies** — anywhere this session's work conflicts with an existing doc, another repo's doc, or a prior decision. Surface it explicitly; never resolve a real conflict silently.
5. **Next exact recommended step** — one concrete thing, not a menu.

Update `FOUNDER_OS.md` with a dated entry summarizing the same, so the next session (this account or the other one) doesn't have to reconstruct it from commit history.

---

## 4) Escalation — what to build vs. what to ask first

**Proceed without asking:**
- Work explicitly scoped by the founder in the current message.
- Docs updates that reflect an already-made decision.
- Reversible, local changes (file edits, commits on a branch not yet merged).

**Ask first (or explicitly flag and wait):**
- Anything that would introduce new strategy or contradict a documented decision.
- Hard-to-reverse or cross-system actions: creating new repos/deployments, deleting or migrating data, merging to a shared branch, anything affecting another repo.
- Scope bigger than what was explicitly asked for, even if it seems like an obvious next step.

When in doubt, this doc's own founder — the working rules above — settles it: preserve structure, don't invent, flag and wait rather than guess.

---

## 5) Cross-repo consistency rule

TVGSUOS is one repo in a multi-repo ecosystem (`katiwala-owner-os-`, `staffverified-app`, ODO's own repo). When work here touches or contradicts something documented in one of those repos:

- **Flag it explicitly** in the session's output (per §3, "Risks or inconsistencies") — name the specific doc and the specific conflict.
- **Do not silently edit another repo's docs** to resolve the conflict unless the founder explicitly asks for that in the same session.
- Treat the most recently founder-confirmed decision as authoritative when two docs disagree, but say so plainly rather than picking a side quietly.
