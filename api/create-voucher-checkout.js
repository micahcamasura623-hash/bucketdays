import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const MIN_POUNDS = 20;
const MAX_POUNDS = 500;

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const body = req.body || {};
  const pounds = Number(body.amount);
  if (!Number.isInteger(pounds) || pounds < MIN_POUNDS || pounds > MAX_POUNDS) {
    return res.status(400).json({ error: `Choose an amount between £${MIN_POUNDS} and £${MAX_POUNDS}.` });
  }
  const recipientName = String(body.recipientName || '').trim().slice(0, 60);
  const message = String(body.message || '').trim().slice(0, 300);

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      billing_address_collection: 'required',
      line_items: [{
        price_data: {
          currency: 'gbp',
          product_data: {
            name: 'BucketDays Gift Voucher',
            description: `£${pounds} to spend on any BucketDays experience. Valid for 12 months.`,
          },
          unit_amount: pounds * 100,
        },
        quantity: 1,
      }],
      metadata: {
        type: 'voucher',
        recipientName,
        message,
      },
      custom_text: {
        submit: {
          message: "After payment we'll email you the voucher code straight away. You can forward it to the person you're giving it to.",
        },
      },
      success_url: 'https://www.bucketdays.co.uk/voucher-success.html',
      cancel_url: 'https://www.bucketdays.co.uk/gift-vouchers.html',
    });
    res.status(200).json({ url: session.url });
  } catch (e) {
    console.error('create-voucher-checkout failed', e);
    res.status(500).json({ error: 'Something went wrong. Please try again or email hello@bucketdays.co.uk.' });
  }
}
