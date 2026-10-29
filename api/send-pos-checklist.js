// Vercel serverless function — ported from katiwala-owner-os-
// 2026-07-19 along with KOS Leads (see index.html's Marketing section
// comment for the full reasoning). Sends the Simple POS setup
// checklist email to a lead (coffee shop, hotel, or gas station) via
// Resend. No npm dependencies; uses the global fetch of Vercel's Node runtime.
//
// RECIPIENTS (2026-10-29, PR #73 remediation). The caller no longer names
// the recipient. It sends a stored-lead reference — { leadTable, leadId } —
// and the server reads that lead's own email with the service-role key.
// leadTable must be one of LEAD_TABLES; anything else is refused. A missing,
// unknown or malformed stored email is refused. No address in the request is
// ever used, so the route cannot be pointed at an arbitrary inbox.
//
// ABUSE CONTROLS (M2, re-review 2026-10-29) — ONE atomic database call.
// The database function claim_checklist_send takes a lock and, in a single
// transaction: (1) refuses if this lead was sent within COOLDOWN_HOURS,
// (2) refuses if DAILY_CAP sends were reserved in the last 24h overall,
// (3) otherwise inserts one ledger row and returns the lead's stored email.
// Either refusal rolls the transaction back; nothing is half-claimed. A
// failed, missing or malformed claim returns 503 and Resend is never called.
// There is no separate count-then-update step any more, so two parallel
// requests cannot both take the last slot (once the function exists).
// A provider failure after a claim does NOT release it: the slot stays used
// (fails toward fewer emails); the founder can resend after the cooldown.
// DEPENDENCY: claim_checklist_send and its ledger do NOT exist yet (checked
// 2026-10-29). Until the founder-approved SQL in
// docs/SECURITY_PRIVILEGE_INVENTORY.md §3.1 runs, checklist email is PAUSED:
// every request fails closed (503, nothing sent). No SQL is run here.
//
// Auth decision: founder only (api/_founder-auth.js), checked first.
// Requires RESEND_API_KEY and SUPABASE_SERVICE_ROLE_KEY on this project.

const { requireFounder } = require('./_founder-auth');

const CHECKLIST_SECTIONS = {
  coffeeshop: {
    businessNoun: 'coffee shop',
    intro: 'send it over',
    haveAlready: `Fastest option: reply with your existing menu/price list (photo, PDF, or spreadsheet — whatever you've got), any current sales reports if you already use a POS or cash register, any order forms you use day to day, and your logo file if you have one. We'll fill in from those first and only ask about what's missing.`,
    sections: [
      ['1. Business basics', [
        'Business/brand name (exactly as it should appear on receipts)',
        'Single location, or more than one branch?',
        'Address',
        'Contact number for receipts/support',
      ]],
      ['2. Menu &amp; pricing', [
        'Full menu list: item name, price, category (drinks / food / add-ons)',
        'Size or variant options (e.g. small/medium/large) and price per variant',
        'Modifiers/add-ons (e.g. extra shot, oat milk) and their prices',
        'Combo or bundle pricing, if any',
        'Any items with variable/manual pricing (weight-based, custom orders)',
      ]],
      ['3. Payment methods accepted', [
        'Cash',
        'Card — which processor/terminal, if any',
        'GCash / Maya / other e-wallets',
        'Split-payment or partial-payment needs',
      ]],
      ['4. Taxes &amp; charges', [
        'VAT-registered? (12% VAT inclusive or exclusive of listed prices)',
        'Service charge, if any (%)',
        'Senior citizen / PWD discount handling',
      ]],
      ['5. Operations', [
        'Opening hours',
        'Table count, if dine-in',
        'Peak hours',
        'Number of registers/terminals needed',
        "Staff who'll use the POS, and their roles (cashier, manager, owner)",
      ]],
      ['6. Receipts &amp; hardware', [
        'Receipt printer already owned, or need a recommendation?',
        'BIR-compliant receipt numbering needed? (Official Receipt / Sales Invoice series)',
        'Logo file for the receipt header',
      ]],
      ['7. Reporting needs', [
        'Daily sales summary — needed?',
        'End-of-day cash count / shift reconciliation — needed?',
      ]],
    ],
  },
  hotel: {
    businessNoun: 'hotel',
    haveAlready: `Fastest option: reply with your existing room rate sheet (photo, PDF, or spreadsheet), your F&amp;B menu if you run a restaurant/bar/room service, any current booking or sales reports if you already use a PMS/POS, and your logo file if you have one. We'll fill in from those first and only ask about what's missing.`,
    sections: [
      ['1. Business basics', [
        'Business/brand name (exactly as it should appear on receipts)',
        'Single property, or more than one location?',
        'Address',
        'Contact number for receipts/support',
      ]],
      ['2. Rooms &amp; rates', [
        'Room types and count of each',
        'Rate per room type (standard; note weekday/weekend or seasonal differences if any)',
        'Extra bed / extra guest charges, if any',
        'Minimum stay or cancellation policy that should show on receipts/confirmations',
      ]],
      ['3. Food &amp; beverage, if applicable', [
        'Does the property have a restaurant, bar, or room service?',
        'If yes: menu items, prices, categories (food / drinks / add-ons)',
        'Any room-service surcharge',
      ]],
      ['4. Payment methods accepted', [
        'Cash',
        'Card — which processor/terminal, if any',
        'GCash / Maya / other e-wallets',
        'Deposit/down payment handling for advance bookings',
        'Split-payment or partial-payment needs',
      ]],
      ['5. Taxes &amp; charges', [
        'VAT-registered? (12% VAT inclusive or exclusive of listed rates)',
        'Service charge, if any (%)',
        'Local lodging/tourism tax, if applicable',
        'Senior citizen / PWD discount handling',
      ]],
      ['6. Operations', [
        'Check-in / check-out times',
        'Check-in shifts per day',
        'Number of registers/terminals needed (front desk, F&amp;B outlet, etc.)',
        "Staff who'll use the POS, and their roles (front desk, F&amp;B, manager, owner)",
      ]],
      ['7. Receipts, hardware &amp; reporting', [
        'Receipt printer already owned, or need a recommendation?',
        'BIR-compliant receipt numbering needed? (Official Receipt / Sales Invoice series)',
        'Logo file for the receipt header',
        'Daily revenue / occupancy summary — needed?',
        'End-of-day cash count / shift reconciliation — needed?',
      ]],
    ],
  },
  gas_station: {
    businessNoun: 'gas station',
    haveAlready: `Fastest option: reply with your current fuel price board/list if you have one, any current sales/volume reports, your convenience store item list &amp; prices if applicable, and your logo file if you have one. We'll fill in from those first and only ask about what's missing.`,
    sections: [
      ['1. Business basics', [
        'Business/brand name (exactly as it should appear on receipts)',
        'Single station, or more than one location?',
        'Address',
        'Contact number for receipts/support',
        'Number of pumps',
      ]],
      ['2. Fuel products &amp; pricing', [
        'Which products you carry (Premium / Unleaded / Diesel) and current price per liter for each',
        'How often prices change (daily, per DOE cycle, ad hoc)',
        "Do you currently track DOE's posted rollback/hike ceilings, or set prices independently?",
        'Any discounts (fleet accounts, loyalty cards, bulk/wholesale)',
      ]],
      ['3. Convenience store / add-on services, if applicable', [
        'Do you run a convenience store, car wash, or other add-on service?',
        'If yes: item list, prices, categories',
      ]],
      ['4. Payment methods accepted', [
        'Cash',
        'Card — which processor/terminal, if any',
        'GCash / Maya / other e-wallets',
        'Fleet cards / credit accounts, if any',
      ]],
      ['5. Operations', [
        'Opening hours (24-hour, or specific hours?)',
        'Number of registers/terminals needed',
        "Staff who'll use the POS, and their roles (pump attendant, cashier, manager, owner)",
        'Current daily transaction/volume estimate',
      ]],
      ['6. Receipts, hardware &amp; reporting', [
        'Receipt printer already owned, or need a recommendation?',
        'BIR-compliant receipt numbering needed? (Official Receipt / Sales Invoice series)',
        'Logo file for the receipt header',
        'Daily volume report — needed? (liters sold per product per shift)',
        'Price monitoring / DOE compliance report — needed?',
        'End-of-day cash count / shift reconciliation — needed?',
      ]],
    ],
  },
};

function checklistEmailHtml({ leadType, businessName, ownerName }) {
  const config = CHECKLIST_SECTIONS[leadType] || CHECKLIST_SECTIONS.coffeeshop;
  const greetingName = ownerName ? ownerName.split(' ')[0] : 'there';
  const business = businessName || `your ${config.businessNoun}`;

  const sectionsHtml = config.sections.map(([title, items]) => `
    <h3 style="margin-top: 24px; color: #01696f;">${title}</h3>
    <ul>
      ${items.map(item => `<li>${item}</li>`).join('\n      ')}
    </ul>
  `).join('');

  return `
  <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; color: #1f2937; line-height: 1.6;">
    <p>Hi ${greetingName},</p>
    <p>Thanks for your interest in Katiwala's Simple POS for ${business}! To get your setup right the first time, here's what we'll need from you. Feel free to reply to this email with your answers, or we can go through it together on a quick call — whichever's easier.</p>

    <h3 style="margin-top: 24px; color: #01696f;">If you already have any of this, just send it over</h3>
    <p>${config.haveAlready}</p>
    ${sectionsHtml}

    <p style="margin-top: 24px;">Once we have these, we can get ${business} set up quickly. Looking forward to working with you!</p>
    <p>— Katiwala AI</p>
  </div>
  `;
}

const SUPABASE_URL = 'https://jbhfdmujqrtqkhacfegl.supabase.co';
const LEAD_TABLES = { leads_coffeeshop: 'coffeeshop', leads_hotel: 'hotel', leads_gas_station: 'gas_station' };
const COOLDOWN_HOURS = 24;
const DAILY_CAP = 25;
const EMAIL_RE = /^[^\s@<>",;]{1,64}@[A-Za-z0-9.-]{1,190}\.[A-Za-z]{2,24}$/;
const LEDGER_MISSING = 'Checklist sending is paused: the atomic send-limit claim (claim_checklist_send) is not in the database yet. Nothing was sent. See docs/SECURITY_PRIVILEGE_INVENTORY.md §3.1.';
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function escapeHtml(value) {
  return String(value == null ? '' : value)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function sbHeaders(key, extra = {}) {
  return { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json', ...extra };
}

// One atomic claim. Returns { status: 'claimed', email } | { status: 'cooldown' | 'cap' } | null.
async function claimSend(key, leadTable, leadId) {
  try {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/rpc/claim_checklist_send`, {
      method: 'POST',
      headers: sbHeaders(key),
      body: JSON.stringify({ p_lead_table: leadTable, p_lead_id: leadId, p_cooldown_hours: COOLDOWN_HOURS, p_daily_cap: DAILY_CAP }),
    });
    if (!r.ok) return null;
    const out = await r.json();
    if (!out || typeof out !== 'object') return null;
    if (out.status === 'cooldown' || out.status === 'cap') return { status: out.status };
    if (out.status === 'claimed' && typeof out.email === 'string' && typeof out.claim_id === 'string') return { status: 'claimed', email: out.email.trim() };
    return null;
  } catch {
    return null;
  }
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  if (!(await requireFounder(req, res))) return;

  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!RESEND_API_KEY || !serviceKey) {
    res.status(500).json({ error: 'Email service is not configured on this deployment.' });
    return;
  }

  const body = req.body && typeof req.body === 'object' ? req.body : {};
  if ('email' in body || 'to' in body) {
    res.status(400).json({ error: 'Recipients are not accepted. Send leadTable and leadId.' });
    return;
  }
  const { leadTable, leadId } = body;
  if (typeof leadTable !== 'string' || !Object.prototype.hasOwnProperty.call(LEAD_TABLES, leadTable)) {
    res.status(400).json({ error: 'Unknown lead table.' });
    return;
  }
  if (typeof leadId !== 'string' || !UUID_RE.test(leadId)) {
    res.status(400).json({ error: 'Invalid lead id.' });
    return;
  }

  try {
    // Read-only pre-check so a missing lead or bad address is refused before
    // any slot is reserved. The recipient used is the one the claim returns.
    const read = await fetch(`${SUPABASE_URL}/rest/v1/${leadTable}?id=eq.${leadId}&select=id,email,business_name,owner_name`, { headers: sbHeaders(serviceKey) });
    if (!read.ok) {
      res.status(503).json({ error: 'Lead lookup is unavailable. Nothing was sent.' });
      return;
    }
    const rows = await read.json();
    const lead = Array.isArray(rows) ? rows[0] : null;
    if (!lead) {
      res.status(404).json({ error: 'Lead not found.' });
      return;
    }
    const stored = typeof lead.email === 'string' ? lead.email.trim() : '';
    if (!stored || !EMAIL_RE.test(stored)) {
      res.status(422).json({ error: 'This lead has no valid email on file.' });
      return;
    }

    const claim = await claimSend(serviceKey, leadTable, leadId);
    if (!claim) {
      res.status(503).json({ error: LEDGER_MISSING });
      return;
    }
    if (claim.status === 'cooldown') {
      res.status(429).json({ error: `This lead already got the checklist in the last ${COOLDOWN_HOURS} hours.` });
      return;
    }
    if (claim.status === 'cap') {
      res.status(429).json({ error: `Daily limit reached (${DAILY_CAP} checklist emails in 24 hours).` });
      return;
    }
    const email = claim.email;
    if (email !== stored || !EMAIL_RE.test(email)) {
      res.status(409).json({ error: 'The lead changed while sending. Nothing was sent.' });
      return;
    }
    const now = new Date();

    const resolvedLeadType = LEAD_TABLES[leadTable];
    const fromEmail = process.env.POS_CHECKLIST_FROM_EMAIL || 'onboarding@resend.dev';
    const businessName = lead.business_name ? escapeHtml(lead.business_name).slice(0, 120) : '';
    const ownerName = lead.owner_name ? escapeHtml(lead.owner_name).slice(0, 80) : '';
    const resendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: `Katiwala AI <${fromEmail}>`,
        to: [email],
        subject: `Setting up your Simple POS${lead.business_name ? ` — ${String(lead.business_name).replace(/[\r\n]/g, ' ').slice(0, 120)}` : ''}`,
        html: checklistEmailHtml({ leadType: resolvedLeadType, businessName, ownerName }),
      }),
    });
    if (!resendRes.ok) {
      // The claim is not released: a failed send still uses its slot (fails toward fewer emails).
      console.error('[send-pos-checklist] provider rejected the send:', resendRes.status);
      res.status(502).json({ error: 'Email provider rejected the request.' });
      return;
    }
    const data = await resendRes.json();
    res.status(200).json({ ok: true, id: data.id, sentAt: now.toISOString() });
  } catch (err) {
    console.error('[send-pos-checklist] failed');
    res.status(500).json({ error: 'Failed to send email.' });
  }
};

module.exports.LEAD_TABLES = LEAD_TABLES;
module.exports.DAILY_CAP = DAILY_CAP;
module.exports.LEDGER_MISSING = LEDGER_MISSING;
