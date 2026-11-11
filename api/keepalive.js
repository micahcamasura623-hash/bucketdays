// Daily keep-alive: runs one tiny read query so the Supabase free project
// registers activity and is not auto-paused. Called by a Vercel cron (see vercel.json).
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

export default async function handler(req, res) {
  try {
    const { error } = await supabase.from('availability_slots').select('id').limit(1);
    if (error) throw error;
    res.status(200).json({ ok: true, at: new Date().toISOString() });
  } catch (e) {
    console.error('keepalive failed', e);
    res.status(500).json({ ok: false });
  }
}
