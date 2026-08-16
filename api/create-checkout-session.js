import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Server-side price lookup — keep this in sync with ACTIVITIES in App.jsx.
// Client-supplied prices are never trusted.
// Values are in pence. These are current public/display prices, not
// confirmed trade rates — update a line here once a real rate is locked in.
const PRICES = {
  1: 7000,   // Rage Buggy Off-Road — £70
  2: 3000,   // Off-Road Karting — £30
  3: 5500,   // Indoor Skydiving — £55
  4: 23000,  // Tandem Skydive — £230
  5: 3000,   // Axe Throwing — £30
  6: 16500,  // Aeroplane Trial Lesson — £165
  7: 25000,  // Helicopter Trial Lesson — £250
  8: 15000,  // Hot Air Balloon Flight — £150
  9: 5000,   // Clay Pigeon Shooting — £50
  10: 4000,  // Paddleboarding — £40
  11: 4500,  // Kayaking Taster — £45
  12: 3000,  // Drum Taster Lesson — £30
  13: 4800,  // Pottery Wheel Class — £48
  14: 4500,  // Cocktail Masterclass — £45
  15: 4000,  // Bottomless Brunch — £40
  16: 4200,  // Gin Tasting — £42
  17: 8900,  // Spa Day — £89
  18: 1800,  // Bouldering Session — £18
  19: 3700,  // Thames Evening Cruise — £37
  20: 3200,  // London Eye Ticket — £32
  21: 2200,  // Comedy Club Night — £22
  22: 2000,  // Karaoke Private Room — £20
};

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.(405).end();
 const { activityId, activityName, slotId, quantity } = req.body;
  const amount = PRICES[activityId];
  const qty = Math.max(1, parseInt(quantity, 10) || 1);
  if (!amount) return res.status(400).json({ error: 'Unknown activity' });

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    billing_address_collection: 'required', // also collects full name
    phone_number_collection: { enabled: true },
    line_items: [{
      price_data: {
        currency: 'gbp',
        product_data: { name: activityName },
        unit_amount: amount,
      },
      quantity: 1,
    }],
    metadata: { activityId: String(activityId), slotId: String(slotId) },
    success_url: 'https://www.bucketdays.co.uk/booking-success?session_id={CHECKOUT_SESSION_ID}',
    cancel_url: 'https://www.bucketdays.co.uk/?book=' + activityId,
  });

  res.status(200).json({ url: session.url });
}
