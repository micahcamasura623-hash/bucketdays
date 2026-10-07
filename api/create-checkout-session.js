import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

// Server-side price lookup — keep this in sync with ACTIVITIES/VENUES in App.jsx.
// Client-supplied prices are never trusted.
// Values are in pence. These are current public/display prices, not
// confirmed trade rates — update a line here once a real rate is locked in.
const PRICES = {
  1: 7000,   // Rage Buggy Off-Road — £70 (legacy fallback; real venues priced below)
  2: 3000,   // Off-Road Karting — £30
  3: 5500,   // Indoor Skydiving — £55 (legacy fallback; real venues priced below)
  4: 23000,  // Tandem Skydive — £230 (legacy fallback; real venues priced below)
  5: 3000,   // Axe Throwing — £30 (legacy fallback; real venues priced below)
  6: 16500,  // Aeroplane Trial Lesson — £165 (legacy fallback; real venues priced below)
  7: 25000,  // Helicopter Trial Lesson — £250 (legacy fallback; real venues priced below)
  8: 15000,  // Hot Air Balloon Flight — £150 (legacy fallback; real venues priced below)
  9: 5000,   // Clay Pigeon Shooting — £50 (legacy fallback; real venues priced below)
  10: 4000,  // Paddleboarding — £40 (legacy fallback; real venues priced below)
  11: 4500,  // Kayaking Taster — £45 (legacy fallback; real venues priced below)
  12: 3000,  // Drum Taster Lesson — £30 (legacy fallback; real venues priced below)
  13: 4800,  // Pottery Wheel Class — £48 (legacy fallback; real venues priced below)
  14: 4500,  // Cocktail Masterclass — £45 (legacy fallback; real venues priced below)
  15: 4000,  // Bottomless Brunch — £40
  16: 4200,  // Gin Tasting — £42 (legacy fallback; real venues priced below)
  17: 8900,  // Spa Day — £89 (legacy fallback; real venues priced below)
  18: 1800,  // Bouldering Session — £18 (legacy fallback; real venues priced below)
  19: 3700,  // Thames Evening Cruise — £37 (legacy fallback; real venues priced below)
  20: 3200,  // London Eye Ticket — £32
  21: 2200,  // Comedy Club Night — £22 (legacy fallback; real venues priced below)
  22: 2000,  // Karaoke Private Room — £20 (legacy fallback; real venues priced below)
};

// Per-venue prices (pence). Each key is a venue id, e.g. "1_1".
// This is the SuggestedPrice column from the providers spreadsheet —
// the actual price to collect, per Micah's confirmation.
const PRICES_VENUE = {
  "1_1": 8000,  // Xsite Leisure (Dirt Karts Redhill) — £80
  "1_2": 8000,  // Max Events Dorchester — £80
  "1_3": 8000,  // Everyman Racing Elvington — £80
  "1_4": 8000,  // Everyman Racing Greetham — £80
  "1_5": 8000,  // Dirt Karts Market Harborough — £80
  "2_1": 7000,  // Hover Force Activity Centre — £70
  "2_2": 7000,  // Xsite Leisure (Dirt Karts Redhill) — £70
  "2_3": 7000,  // Rally Karting Centre — £70
  "2_4": 7000,  // Exeter Karting (Escot Park) — £70
  "3_1": 6500,  // iFLY Milton Keynes Indoor Skydiving — £65
  "3_2": 6500,  // iFLY London Indoor Skydiving at The O2 — £65
  "3_3": 6500,  // iFLY Manchester Indoor Skydiving — £65
  "3_4": 6500,  // iFLY Basingstoke Indoor Skydiving — £65
  "4_1": 29000,  // Skydive Langar — £290
  "4_2": 29000,  // North London Skydiving Centre — £290
  "4_3": 29000,  // Black Knights Skydiving Centre — £290
  "4_4": 29000,  // GoSkydive — £290
  "4_5": 29000,  // Skydive Hibaldstow — £290
  "4_6": 29000,  // UK Parachuting (Sibson) — £290
  "4_7": 29000,  // UK Parachuting (Beccles) — £290
  "4_8": 29000,  // Skydive GB Parachute Club — £290
  "4_9": 29000,  // Army Parachute Association (Red Devils) — £290
  "5_1": 5000,  // Axeperience Axe Throwing — £50
  "5_2": 5000,  // Game of Throwing - Axe Throwing Experience — £50
  "6_1": 24000,  // Flight Training London — £240
  "6_2": 24000,  // Merseyflight Air Training School — £240
  "6_3": 24000,  // Almat Flying Academy Ltd — £240
  "6_4": 24000,  // The Flying School Ltd — £240
  "6_5": 24000,  // Solent Flight GB-0042 — £240
  "6_6": 24000,  // The Sherwood Flying Club Ltd — £240
  "7_1": 32000,  // Heli Air Ltd (Wycombe) — £320
  "7_2": 32000,  // JK Helicopter Training — £320
  "7_3": 32000,  // Elstree Helicopters — £320
  "7_4": 32000,  // Hields Aviation — £320
  "7_5": 32000,  // Heli Air Ltd (Wellesbourne) — £320
  "8_1": 25000,  // Atmosphere Hot Air Balloons — £250
  "8_2": 25000,  // Wickers World Hot Air Balloon Flights — £250
  "8_3": 25000,  // Hot Air Balloon Flights from Derbyshire (Wickers World) — £250
  "8_4": 25000,  // Adventure Balloons Ltd — £250
  "8_5": 25000,  // Virgin Balloon Flights Head Office — £250
  "8_6": 25000,  // Bailey Balloons — £250
  "9_1": 11000,  // Headley Clay Pigeon Shooting Club — £110
  "9_2": 11000,  // London Clay Shooting — £110
  "9_3": 11000,  // National Clay Shooting Centre — £110
  "9_4": 11000,  // Spitfire Shoot — £110
  "10_1": 7000,  // PaddleSUP Company — £70
  "10_2": 7000,  // Active360 Paddleboarding Kew — £70
  "10_3": 7000,  // Paddleboarding London — £70
  "10_4": 7000,  // Waterborn SUP — £70
  "10_5": 7000,  // The SUP Store — £70
  "10_6": 7000,  // The Paddle Centre — £70
  "11_1": 5300,  // Tittesworth Water Sports and Activity Centre — £53
  "11_2": 5300,  // Phoenix Canoe Club & Outdoor Centre — £53
  "11_3": 5300,  // The Leam Boat Centre Ltd — £53
  "11_4": 5300,  // Canoe Wild — £53
  "11_5": 5300,  // Willowgate Adventure Centre — £53
  "12_1": 3000,  // Hackney Wick Drum Studio (Music Mission) — £30
  "12_2": 3000,  // East London Drum School — £30
  "12_3": 3000,  // London Drum Studio — £30
  "12_4": 3000,  // Drumshack — £30
  "13_1": 9500,  // Crown Works Pottery and School — £95
  "13_2": 9500,  // Ceramics Classes London (Zoe) — £95
  "13_3": 9500,  // Stoneware Studios Pottery — £95
  "13_4": 9500,  // Dalston Clay — £95
  "13_5": 9500,  // The Slightly Curious Studio — £95
  "14_1": 9700,  // Mixology Events Cocktail Classes (Shoreditch) — £97
  "14_2": 9700,  // Mixology Events Cocktail Classes (Covent Garden) — £97
  "14_3": 9700,  // Mixology Events Cocktail Classes (Fitzrovia) — £97
  "14_4": 9700,  // London Cocktail Exchange (Elliot) — £97
  "16_1": 6300,  // Bombay Sapphire Distillery — £63
  "16_2": 6300,  // Shakespeare Distillery Gin School — £63
  "16_3": 6300,  // The Maidstone Distillery — £63
  "17_1": 11500,  // Thermae Bath Spa — £115
  "17_2": 11500,  // Moddershall Oaks Country Spa Retreat — £115
  "17_3": 11500,  // Ringwood Hall Hotel & Spa — £115
  "18_1": 4000,  // The Castle Climbing Centre — £40
  "18_2": 4000,  // HarroWall Climbing Centre — £40
  "18_3": 4000,  // Boulder UK — £40
  "18_4": 4000,  // The Climbing Lab — £40
  "18_5": 4000,  // Aldgate City Bouldering — £40
  "18_6": 4000,  // Boulder Shack Climbing Gym — £40
  "18_7": 4000,  // The Climbing Works — £40
  "18_8": 4000,  // Boulder Central - Indoor Climbing — £40
  "18_9": 4000,  // White City Bouldering — £40
  "19_1": 4500,  // River Thames Cruises — £45
  "19_2": 4500,  // Thames Rockets (Gemma) — £45
  "21_1": 3500,  // The Top Secret Comedy Club (Drury Ln) — £35
  "21_2": 3500,  // The Comedy Store — £35
  "21_3": 3500,  // Comedy Carnival Covent Garden — £35
  "21_4": 3500,  // Big Belly Bar & Comedy Club London — £35
  "21_5": 3500,  // Comedy Carnival Leicester Square — £35
  "21_6": 3500,  // The Top Secret Comedy Club (Kingsway) — £35
  "21_7": 3500,  // The Boat Show Comedy Club (Jack) — £35
  "22_1": 3800,  // BAM Karaoke Box | Victoria — £38
  "22_2": 3800,  // Moyagi — £38
  "22_3": 3800,  // Karaoke Box Mayfair — £38
  "22_4": 3800,  // Lucky Voice Soho — £38
  "22_5": 3800,  // Lucky Voice Liverpool Street — £38
  "22_6": 3800,  // Karaoke Epoc — £38
  "22_7": 3800,  // Lucky Voice Brighton — £38
};

// Venue postcodes (used only to label the checkout page)
const VENUE_POSTCODES = {
  "1_1": "RH1 5QL",
  "1_2": "DT2 7FW",
  "1_3": "YO41 4AU",
  "1_4": "LE15 7RH",
  "1_5": "LE16 9UJ",
  "2_1": "WA6 7BT",
  "2_2": "RH1 5QL",
  "2_3": "PE28 2NX",
  "2_4": "EX11 1LU",
  "3_1": "MK9 3XS",
  "3_2": "SE10 0DX",
  "3_3": "M41 7JA",
  "3_4": "RG22 6PG",
  "4_1": "NG13 9HY",
  "4_2": "PE15 0FB",
  "4_3": "LA2 0DY",
  "4_4": "SP4 6EB",
  "4_5": "DN20 9NN",
  "4_6": "PE8 6NE",
  "4_7": "NR34 7XD",
  "4_8": "YO16 4YB",
  "4_9": "SP4 9SF",
  "5_1": "EC3N 1JJ",
  "5_2": "W6 0QU",
  "6_1": "WD6 3AW",
  "6_2": "CH4 0GZ",
  "6_3": "DY7 5DY",
  "6_4": "DY7 5DY",
  "6_5": "SO32 1HA",
  "6_6": "NG12 4GA",
  "7_1": "SL7 3DP",
  "7_2": "GL51 6SR",
  "7_3": "WD6 3AW",
  "7_4": "LS25 6JE",
  "7_5": "CV35 9EU",
  "8_1": "SO23 8SD",
  "8_2": "ST18 0RA",
  "8_3": "DE6 1RA",
  "8_4": "RG27 8HY",
  "8_5": "TF3 3BD",
  "8_6": "BS20 0HA",
  "9_1": "KT18 6LP",
  "9_2": "EN2 8AA",
  "9_3": "GU24 0PB",
  "9_4": "SO20 6JR",
  "10_1": "RG22 4LE",
  "10_2": "W4 3NG",
  "10_3": "NW1 7EA",
  "10_4": "TQ7 1HN",
  "10_5": "BH23 1HW",
  "10_6": "SO31 7EF",
  "11_1": "ST13 8SH",
  "11_2": "NW9 7ND",
  "11_3": "CV31 1BE",
  "11_4": "CT3 4BP",
  "11_5": "PH2 7JU",
  "12_1": "E9 5LN",
  "12_2": "E2 6GB",
  "12_3": "E8 4EW",
  "12_4": "SW11 5RQ",
  "13_1": "E2 6QQ",
  "13_2": "W6 0LD",
  "13_3": "SW6 3DJ",
  "13_4": "N16 8JN",
  "13_5": "HA0 1QL",
  "14_1": "EC2A 3EP",
  "14_2": "WC2E 7NG",
  "14_3": "W1T 6BA",
  "14_4": "W1T 2JN",
  "16_1": "RG28 7NR",
  "16_2": "CV37 9RQ",
  "16_3": "ME14 1HP",
  "17_1": "BA1 1SJ",
  "17_2": "ST15 8WF",
  "17_3": "S43 1DQ",
  "18_1": "N4 2HA",
  "18_2": "HA1 4HX",
  "18_3": "PR5 8AN",
  "18_4": "LS4 2AZ",
  "18_5": "EC3N 1AL",
  "18_6": "SO14 0JW",
  "18_7": "S8 0UJ",
  "18_8": "B70 0DG",
  "18_9": "W12 7HB",
  "19_1": "E1 2LY",
  "19_2": "SE1 7PB",
  "21_1": "WC2B 5PD",
  "21_2": "SW1Y 4EE",
  "21_3": "WC2H 9LA",
  "21_4": "SE1 9LQ",
  "21_5": "W1D 6LQ",
  "21_6": "WC2B 6UJ",
  "21_7": "WC2R 2PH",
  "22_1": "SW1E 6SQ",
  "22_2": "W1G 0QA",
  "22_3": "W1S 1PQ",
  "22_4": "W1F 7NQ",
  "22_5": "EC2M 4YP",
  "22_6": "W1F 0SS",
  "22_7": "BN1 1ND",
};

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { activityId, activityName, slotId, quantity, image } = req.body;
  const qty = Math.max(1, parseInt(quantity, 10) || 1);

  // Look up the slot to find out which venue it belongs to (if any).
  // This is the server-trusted source of truth for which venue was picked —
  // never trust a venue id sent directly from the browser.
  let venueId = null;
  let slotDate = null;
  let slotTime = null;
  if (slotId) {
    const { data: slot } = await supabase
      .from('availability_slots')
      .select('venue_id, date, time')
      .eq('id', slotId)
      .single();
    venueId = slot?.venue_id || null;
    slotDate = slot?.date || null;
    slotTime = slot?.time || null;
  }

  // Build the text shown on the left of the Stripe checkout page.
  // Date/time come from the database slot, not the browser.
  const venuePostcode = venueId ? (VENUE_POSTCODES[venueId] || null) : null;
  const niceDate = slotDate
    ? new Date(slotDate + 'T00:00:00Z').toLocaleDateString('en-GB', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC',
      })
    : null;
  const descParts = [];
  if (niceDate) descParts.push(niceDate + (slotTime ? ' at ' + slotTime : ''));
  descParts.push(qty + (qty === 1 ? ' person' : ' people'));
  if (venuePostcode) descParts.push('Location: ' + venuePostcode);
  const description = descParts.join('  |  ');

  // Only allow images from our own /images/ folder
  const imageUrl = (typeof image === 'string' && image.startsWith('/images/'))
    ? 'https://www.bucketdays.co.uk' + image
    : null;

  const amount = venueId ? PRICES_VENUE[venueId] : PRICES[activityId];
  if (!amount) return res.status(400).json({ error: 'Unknown activity or venue' });

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    billing_address_collection: 'required', // also collects full name
    phone_number_collection: { enabled: true },
    line_items: [{
      price_data: {
        currency: 'gbp',
        product_data: {
          name: activityName,
          description,
          ...(imageUrl ? { images: [imageUrl] } : {}),
        },
        unit_amount: amount,
      },
      quantity: qty,
    }],
    metadata: {
      activityId: String(activityId),
      slotId: String(slotId),
      quantity: String(qty),
      venueId: venueId ? String(venueId) : '',
    },
    custom_text: {
      submit: {
        message: "After booking, we'll email you the exact venue address and everything you need to know before you go.",
      },
    },
    success_url: 'https://www.bucketdays.co.uk/booking-success?session_id={CHECKOUT_SESSION_ID}',
    cancel_url: 'https://www.bucketdays.co.uk/?book=' + activityId,
  });

  res.status(200).json({ url: session.url });
}
