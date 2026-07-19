// Vercel serverless function — ported from katiwala-owner-os-
// 2026-07-19 along with KOS Leads (see index.html's Marketing section
// comment for the full reasoning). Sends the Simple POS setup
// checklist email to a converted lead (coffee shop, hotel, or gas
// station) via Resend. No npm dependencies (this repo has no build
// step / package.json); uses the global fetch available in Vercel's
// Node.js runtime.
//
// Requires a RESEND_API_KEY environment variable set on this Vercel
// project (tvgsuosweb) — a separate copy from katiwala-owner-os-'s own
// project, never hardcode it here, and never expose it to client-side
// code.

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

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  if (!RESEND_API_KEY) {
    res.status(500).json({ error: 'Email service is not configured (missing RESEND_API_KEY on this Vercel project).' });
    return;
  }

  const { email, businessName, ownerName, leadType } = req.body || {};
  if (!email || typeof email !== 'string') {
    res.status(400).json({ error: 'Missing recipient email.' });
    return;
  }
  const resolvedLeadType = CHECKLIST_SECTIONS[leadType] ? leadType : 'coffeeshop';

  const fromEmail = process.env.POS_CHECKLIST_FROM_EMAIL || 'onboarding@resend.dev';

  try {
    const resendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `Katiwala AI <${fromEmail}>`,
        to: [email],
        subject: `Setting up your Simple POS${businessName ? ` — ${businessName}` : ''}`,
        html: checklistEmailHtml({ leadType: resolvedLeadType, businessName, ownerName }),
      }),
    });

    const data = await resendRes.json();
    if (!resendRes.ok) {
      console.error('[Resend] send failed:', data);
      res.status(502).json({ error: data.message || 'Email provider rejected the request.' });
      return;
    }

    res.status(200).json({ ok: true, id: data.id });
  } catch (err) {
    console.error('[send-pos-checklist] error:', err);
    res.status(500).json({ error: 'Failed to send email.' });
  }
};
