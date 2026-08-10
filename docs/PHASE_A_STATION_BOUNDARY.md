# Phase A — Station boundary (Claude)

Last updated: 2026-08-10  
Status: Active  
Owner: Edgardo Castro

**Phase A = Dipstify / Station only.** Claude (and any Station-scoped Cursor work the founder assigns) stays inside this boundary until the founder says Station is done enough.

---

## In scope (Station)

1. Owner’s Lens / Station Control (`katiwala-owner-os-`) — daily loop (variance, P&L, pricing signals)
2. OpsVerified attachment (`fuel-ops`) — wet-stock / ops signal into Lens
3. StaffVerified attachment (`staffverified-app`)
4. AdminVerified attachment (`adminverified`)
5. PnLVerified attachment (`pnlverified`)

Station foundations that do **not** break the boundary (allowed as schema/storage rules): `station_id`, photos in object storage (not DB blobs), retention policy, Lens exceptions-first — see `docs/DIPSTIFY_SCALE_PLAN.md`.

---

## Out of scope (until founder unlocks)

1. StationRescue depth
2. Dipstify Delivery full build (MVP stays parked for supplier)
3. Franchise product build
4. RideVerified ownership app (`hmcmarketing`)
5. ODO Property / Vehicle marketplace depth
6. FOS AGI Phase 2 (auto Lens→Ver pipe)
7. OpsVerified Supabase merge into Station shared DB (own scoped session when greenlit)
8. Mega-monorepo physical merges

---

## Risk management → approval → run until done (mandatory)

Before any non-trivial Station work (schema, auth, data migration, module attach, deploy, delete/rename):

1. **Risk management** — list risks (data loss, auth break, Helium downtime, cost, RLS, photo/storage, scope creep into Rescue/ODO/RV).
2. **Mitigation + plan** — for each risk: mitigation, owner, and whether it blocks start. Ship a short Step / Where / How plan.
3. **Clearance** — do not start build until risks are cleared or explicitly accepted by the founder.
4. **All approvals required** — founder must approve the full plan (scope, mitigations, success check) in one go — not piecemeal mid-flight.
5. **Run until done** — once the founder says approve / execute / run until done, finish the approved plan end-to-end without pausing for re-approval on steps already covered. Only stop for a **new** risk that was not in the approved plan, or an explicit founder interrupt.

Closing brief still required when the run completes (Item / Status / Note).

---

## Map source

Full tree: `docs/ECOSYSTEM_REPO_TREE.md`.  
Ver prioritization must not pull Claude into out-of-scope pillars during Phase A.
