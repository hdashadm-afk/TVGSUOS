// Vercel serverless function — ODO's real project-update status for
// TVGSUOS's Venture Updates panel. Reads ODO's own Supabase project
// directly (vera_signals, health_snapshots, listings, transactions,
// waitlist_signups) via a service-role key scoped to THAT project —
// this app's own SUPABASE_SERVICE_ROLE_KEY is scoped to the shared
// KOS project and has no access here. The vera_signals/health_snapshots
// half is ported from katiwala-owner-os-'s api/generate-vera-status.js;
// the listings/transactions/waitlist_signups half is new — wiring the
// real GMV/listings/waitlist/escrow signals a founder-pasted spec once
// asked for as "Not connected" placeholders, now that a schema check
// confirmed real (if still small) data exists for them. business.gmvPhp
// is currently ~0 and business.activeListings is currently 1 because
// that's honestly where the venture is — this wiring is meant to keep
// working as those numbers grow, not to make them look bigger today.
//
// Requires ODO_SUPABASE_SERVICE_ROLE_KEY. Not configured until the
// founder adds it — returns a clear "not configured" error rather
// than crashing.

const ODO_SUPABASE_URL = 'https://qhjhsdsluxgyjevbhfmk.supabase.co';
const LOOKBACK_HOURS = 72;

module.exports = async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const serviceRoleKey = process.env.ODO_SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) {
    res.status(200).json({
      notConfigured: true,
      error: 'ODO_SUPABASE_SERVICE_ROLE_KEY is not set on this Vercel project (tvgsuosweb) — ODO project update is unavailable until it is added.',
    });
    return;
  }

  const since = new Date(Date.now() - LOOKBACK_HOURS * 60 * 60 * 1000).toISOString();
  const authHeaders = { apikey: serviceRoleKey, Authorization: `Bearer ${serviceRoleKey}` };

  try {
    const [signalsRes, healthRes, listingsRes, transactionsRes, waitlistRes] = await Promise.all([
      fetch(`${ODO_SUPABASE_URL}/rest/v1/vera_signals?created_at=gte.${since}&select=id,topic,sentiment,created_at&order=created_at.desc&limit=50`, { headers: authHeaders }),
      fetch(`${ODO_SUPABASE_URL}/rest/v1/health_snapshots?select=snapshot_date,pulse_score,open_critical,open_high,open_medium,total_open,deals_active,deals_closed_7d&order=snapshot_date.desc&limit=1`, { headers: authHeaders }),
      fetch(`${ODO_SUPABASE_URL}/rest/v1/listings?select=status`, { headers: authHeaders }),
      fetch(`${ODO_SUPABASE_URL}/rest/v1/transactions?select=total_php,escrow_state`, { headers: authHeaders }),
      fetch(`${ODO_SUPABASE_URL}/rest/v1/waitlist_signups?select=id`, { headers: authHeaders }),
    ]);

    const failed = [signalsRes, healthRes, listingsRes, transactionsRes, waitlistRes].find(r => !r.ok);
    if (failed) {
      const body = await failed.text();
      console.error('[odo-status] Supabase REST error:', body);
      res.status(502).json({ error: `ODO Supabase query failed (${failed.status}).` });
      return;
    }

    const signals = await signalsRes.json();
    const health = await healthRes.json();
    const listings = await listingsRes.json();
    const transactions = await transactionsRes.json();
    const waitlistSignups = await waitlistRes.json();

    const negativeCount = signals.filter(s => s.sentiment === 'negative').length;
    const byTopic = signals.reduce((acc, s) => { const t = s.topic || 'unspecified'; acc[t] = (acc[t] || 0) + 1; return acc; }, {});
    const topicSummary = Object.entries(byTopic).map(([topic, count]) => `${count} ${topic}`).join(', ');
    // Per-topic negative count — for the Daily Baseline Check's
    // Regenerate flow to detect a real pattern (repeated frustration
    // on one topic) worth flagging to Task Inventory, without touching
    // ODO's live customer-facing /api/vera route at all. Read-only,
    // additive to the existing response shape.
    const byTopicNegative = signals.filter(s => s.sentiment === 'negative').reduce((acc, s) => { const t = s.topic || 'unspecified'; acc[t] = (acc[t] || 0) + 1; return acc; }, {});

    // GMV = sum of every transaction's total_php regardless of escrow
    // state (held/released/refunded all represent real transacted
    // value) — escrowBreakdown is the "protection cases" view of the
    // same rows, by state.
    const gmvPhp = transactions.reduce((sum, t) => sum + Number(t.total_php || 0), 0);
    const escrowBreakdown = transactions.reduce((acc, t) => { const s = t.escrow_state || 'unspecified'; acc[s] = (acc[s] || 0) + 1; return acc; }, {});

    res.status(200).json({
      signalsCount: signals.length,
      negativeCount,
      topicSummary,
      byTopicNegative,
      lookbackHours: LOOKBACK_HOURS,
      health: health[0] || null,
      business: {
        activeListings: listings.filter(l => l.status === 'published').length,
        totalListings: listings.length,
        gmvPhp,
        transactionCount: transactions.length,
        escrowBreakdown,
        waitlistCount: waitlistSignups.length,
      },
    });
  } catch (err) {
    console.error('[odo-status] error:', err);
    res.status(500).json({ error: 'Failed to fetch ODO status.' });
  }
};
