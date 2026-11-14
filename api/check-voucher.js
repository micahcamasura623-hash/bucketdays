import { createClient } from '@supabase/supabase-js';
import { getUsableVoucher } from './_vouchers.js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  try {
    const v = await getUsableVoucher(supabase, req.body && req.body.code);
    if (!v) return res.status(200).json({ valid: false });
    res.status(200).json({
      valid: true,
      balance: v.balance_pence / 100,
      expires: v.expires_at,
    });
  } catch (e) {
    console.error('check-voucher failed', e);
    res.status(500).json({ valid: false });
  }
}
