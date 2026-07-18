// Vercel serverless function — ODO's real project-update status for
// TVGSUOS's Venture Updates panel. Reads ODO's own Supabase project
// directly (vera_signals, health_snapshots) via a service-role key
// scoped to THAT project — this app's own SUPABASE_SERVICE_ROLE_KEY
// is scoped to the shared KOS project and has no access here. Same
// pattern and same ODO project as katiwala-owner-os-'s
// api/generate-vera-status.js, ported here so TVGSUOS's own "ODO
// project update" is native to the umbrella layer instead of only
// living inside KOS's app — that's the whole point of this endpoint.
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
    const [signalsRes, healthRes] = await Promise.all([
      fetch(`${ODO_SUPABASE_URL}/rest/v1/vera_signals?created_at=gte.${since}&select=id,topic,sentiment,created_at&order=created_at.desc&limit=50`, { headers: authHeaders }),
      fetch(`${ODO_SUPABASE_URL}/rest/v1/health_snapshots?select=snapshot_date,pulse_score,open_critical,open_high,open_medium,total_open,deals_active,deals_closed_7d&order=snapshot_date.desc&limit=1`, { headers: authHeaders }),
    ]);

    if (!signalsRes.ok || !healthRes.ok) {
      const body = !signalsRes.ok ? await signalsRes.text() : await healthRes.text();
      console.error('[odo-status] Supabase REST error:', body);
      res.status(502).json({ error: `ODO Supabase query failed (${!signalsRes.ok ? signalsRes.status : healthRes.status}).` });
      return;
    }

    const signals = await signalsRes.json();
    const health = await healthRes.json();
    const negativeCount = signals.filter(s => s.sentiment === 'negative').length;
    const byTopic = signals.reduce((acc, s) => { const t = s.topic || 'unspecified'; acc[t] = (acc[t] || 0) + 1; return acc; }, {});
    const topicSummary = Object.entries(byTopic).map(([topic, count]) => `${count} ${topic}`).join(', ');

    res.status(200).json({
      signalsCount: signals.length,
      negativeCount,
      topicSummary,
      lookbackHours: LOOKBACK_HOURS,
      health: health[0] || null,
    });
  } catch (err) {
    console.error('[odo-status] error:', err);
    res.status(500).json({ error: 'Failed to fetch ODO status.' });
  }
};
