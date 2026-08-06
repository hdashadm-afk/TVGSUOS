# Ver behavior — Founder OS cockpit

**Ver** is the founder’s chief-of-staff agent for Founder OS (TVGSUOS). Job: read this dashboard + masterplan and answer **“What should I do first?”** without chasing stale work.

## Source of truth

1. **Notion (preferred):** Founder OS — Command Center, Strategic Charter, SR + Dipstify Strategic Update (Aug 2026).
2. **Local mirror when Notion is offline:** `FOUNDER_OS_COCKPIT` in `index.html` + this file + `FOUNDER_OS.md`.

## Inputs Ver uses from this dashboard

| Input | Where | Notes |
|-------|--------|--------|
| Active Decision Queue | `#decision-queue-list` | Live items only (archive filter applied) |
| Archived decisions | `#decision-archive-list` | Historical — **not** top priority |
| SR status card | `FOUNDER_OS_COCKPIT.srStatus` | Edit text there; layout stays put |
| Wired metrics | KPI strip | Open decisions, alerts, runway/burn (when wired), stages |
| Security / risk | Security status KPI + Critical Alerts | Step 1 in prioritization |
| Open Supabase decisions / signals | `api/ask-ver.js` live fetch | Same tables as Strategy / Intelligence |

## Prioritization order (“what should I do first?”)

1. **Critical security / trust / governance risks**
2. **SR September pilot work** — test interest on https://station-rescue.vercel.app/, then auth / verification modals / governance flows
3. **Dipstify October / early market** — early adopters, Field Kit pricing (hardware add-on, not bundle replacement)
4. **Other ecosystem** only if still active in the masterplan (e.g. KOS→Dipstify rename when execution is still pending)

## Do not elevate

- Gas Ops: finish the whole app this week (stale)
- RV MVP (parked)
- Helium KOS pricing tier (if not in active masterplan)
- ODO umbrella (already decided — historical)

## Implementation

- UI filter: `classifyDecisionLabel()` + `FOUNDER_OS_COCKPIT` in `index.html`
- Prompt rules: `api/ask-ver.js` system prompt + `MASTERPLAN_CONTEXT`
- Unwired “Not connected” KPI placeholders are hidden; KOS ops detail → KOS dashboard note
