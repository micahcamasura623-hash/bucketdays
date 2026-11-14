import crypto from 'crypto';

// No 0/O/1/I/L so codes are easy to read out and type.
const ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';

export function generateCode() {
  const bytes = crypto.randomBytes(8);
  let s = '';
  for (const b of bytes) s += ALPHABET[b % ALPHABET.length];
  return `BD-${s.slice(0, 4)}-${s.slice(4)}`;
}

// Accepts "bd-abcd-efgh", "BDABCDEFGH" etc. Returns canonical form or null.
export function normaliseCode(input) {
  const raw = String(input || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
  if (raw.length !== 10 || !raw.startsWith('BD')) return null;
  return `BD-${raw.slice(2, 6)}-${raw.slice(6)}`;
}

// Returns the voucher row if it can be used right now, otherwise null.
export async function getUsableVoucher(supabase, input) {
  const code = normaliseCode(input);
  if (!code) return null;
  const { data } = await supabase
    .from('vouchers')
    .select('code, value_pence, balance_pence, expires_at, status')
    .eq('code', code)
    .maybeSingle();
  if (!data) return null;
  if (data.status !== 'active') return null;
  if (data.balance_pence <= 0) return null;
  if (new Date(data.expires_at) <= new Date()) return null;
  return data;
}
