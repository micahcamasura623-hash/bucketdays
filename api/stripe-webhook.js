import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

export const config = { api: { bodyParser: false } };

export default async function handler(req, res) {
  const sig = req.headers['stripe-signature'];
  const buf = await new Promise((resolve) => {
    const chunks = [];
    req.on('data', (c) => chunks.push(c));
    req.on('end', () => resolve(Buffer.concat(chunks)));
  });

  let event;
  try {
    event = stripe.webhooks.constructEvent(buf, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook signature error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const { activityId, slotId } = session.metadata;
    const details = session.customer_details || {};

    // Write the confirmed booking
    await supabase.from('bookings').insert({
      slot_id: slotId,
      activity_id: activityId,
      customer_name: details.name || null,
      customer_email: details.email || null,
      customer_phone: details.phone || null,
      status: 'confirmed',
    });

    // Decrement capacity (fetch-then-write — matches the no-locking
    // approach already accepted for this calendar; double-booking risk
    // is handled manually via backup providers, not in code)
    const { data: slot } = await supabase
      .from('availability_slots')
      .select('spots_booked')
      .eq('id', slotId)
      .single();

    await supabase
      .from('availability_slots')
      .update({ spots_booked: (slot?.spots_booked || 0) + 1 })
      .eq('id', slotId);
  }

  res.status(200).json({ received: true });
}
