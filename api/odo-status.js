// Vercel serverless function — ODO's status for TVGSUOS's Venture Updates panel.
//
// MANUAL / IMPORT ONLY (2026-10-29, PR #73 remediation; MASTER §11.9 "No live
// cross-project service-role reporting"). This route used to read ODO's own
// Supabase project (vera_signals, health_snapshots, listings, transactions,
// waitlist_signups) with ODO_SUPABASE_SERVICE_ROLE_KEY — a full-rights key to
// another venture's database held by this app. That read is removed, not
// disabled behind a flag: there is no ODO URL, no ODO key read and no fetch in
// this file, so configuring ODO_SUPABASE_SERVICE_ROLE_KEY changes nothing.
//
// Until an imported ODO report exists (MASTER §8 reporting contract, Phase 2),
// the honest answer is "not supplied". No cached, current or imported number is
// returned, because none exists here; a missing measurement is never invented.
//
// Auth decision: founder only (api/_founder-auth.js), checked first, so an
// anonymous caller learns nothing about configuration either.

const { requireFounder } = require('./_founder-auth');

const MANUAL_IMPORT_MESSAGE =
  'ODO status is manual/import-only. Founder OS no longer reads ODO\'s database. No imported ODO report is stored yet, so there are no ODO numbers to show.';

module.exports = async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  if (!(await requireFounder(req, res))) return;

  res.status(200).json({
    manualImportRequired: true,
    status: 'not_supplied',
    source: null,
    sourceTimestamp: null,
    error: MANUAL_IMPORT_MESSAGE,
  });
};

module.exports.MANUAL_IMPORT_MESSAGE = MANUAL_IMPORT_MESSAGE;
