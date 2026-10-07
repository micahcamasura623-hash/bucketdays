import Stripe from 'stripe';
import nodemailer from 'nodemailer';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

export const config = { api: { bodyParser: false } };

// Activity names (keep in sync with ACTIVITIES in App.jsx)
const ACTIVITY_NAMES = {
  "1": "Rage Buggy Off-Road",
  "2": "Off-Road Karting",
  "3": "Indoor Skydiving",
  "4": "Tandem Skydive",
  "5": "Axe Throwing",
  "6": "Aeroplane Trial Lesson",
  "7": "Helicopter Trial Lesson",
  "8": "Hot Air Balloon Flight",
  "9": "Clay Pigeon Shooting",
  "10": "Paddleboarding",
  "11": "Kayaking Taster",
  "12": "Drum Taster Lesson",
  "13": "Pottery Wheel Class",
  "14": "Cocktail Masterclass",
  "16": "Gin Tasting",
  "17": "Spa Day",
  "18": "Bouldering Session",
  "19": "Thames Evening Cruise",
  "20": "London Eye Ticket",
  "21": "Comedy Club Night",
  "22": "Karaoke Private Room"
};

// Venue details — used ONLY in the alert email to you. Customers only ever
// get the postcode in their confirmation.
const VENUE_INFO = {
  "1_1": {
    "name": "Xsite Leisure (Dirt Karts Redhill)",
    "address": "Honeycrock Farm, Axes Lane, Salfords, Surrey RH1 5QL",
    "postcode": "RH1 5QL",
    "phone": "+44 1737 772548"
  },
  "1_2": {
    "name": "Max Events Dorchester",
    "address": "Off Waddock Drove, Dorchester DT2 7FW",
    "postcode": "DT2 7FW",
    "phone": null
  },
  "1_3": {
    "name": "Everyman Racing Elvington",
    "address": "Elvington Track, Elvington, Yorkshire YO41 4AU",
    "postcode": "YO41 4AU",
    "phone": null
  },
  "1_4": {
    "name": "Everyman Racing Greetham",
    "address": "Everyman Driving Centre, Greetham, Rutland LE15 7RH",
    "postcode": "LE15 7RH",
    "phone": null
  },
  "1_5": {
    "name": "Dirt Karts Market Harborough",
    "address": "Welford Rd, Sibbertoft, Market Harborough LE16 9UJ",
    "postcode": "LE16 9UJ",
    "phone": null
  },
  "2_1": {
    "name": "Hover Force Activity Centre",
    "address": "Brook Furlong, Frodsham, Cheshire WA6 7BT",
    "postcode": "WA6 7BT",
    "phone": "+44 1928 240444"
  },
  "2_2": {
    "name": "Xsite Leisure (Dirt Karts Redhill)",
    "address": "Honeycrock Farm, Axes Lane, Salfords, Surrey RH1 5QL",
    "postcode": "RH1 5QL",
    "phone": "+44 1737 772548"
  },
  "2_3": {
    "name": "Rally Karting Centre",
    "address": "Kings Ripton Road, Off Huntingdon Northern Bypass, Kings Ripton, Huntingdon PE28 2NX",
    "postcode": "PE28 2NX",
    "phone": "+44 1480 457263"
  },
  "2_4": {
    "name": "Exeter Karting (Escot Park)",
    "address": "Escot Park, Ottery St Mary EX11 1LU",
    "postcode": "EX11 1LU",
    "phone": "+44 1392 925823"
  },
  "3_1": {
    "name": "iFLY Milton Keynes Indoor Skydiving",
    "address": "602 Marlborough Gate, Milton Keynes MK9 3XS",
    "postcode": "MK9 3XS",
    "phone": "+44 330 191 3967"
  },
  "3_2": {
    "name": "iFLY London Indoor Skydiving at The O2",
    "address": "Peninsula Square, London SE10 0DX",
    "postcode": "SE10 0DX",
    "phone": "+44 161 359 7040"
  },
  "3_3": {
    "name": "iFLY Manchester Indoor Skydiving",
    "address": "9 Trafford Way, Trafford Park, Stretford, Manchester M41 7JA",
    "postcode": "M41 7JA",
    "phone": "+44 161 359 7040"
  },
  "3_4": {
    "name": "iFLY Basingstoke Indoor Skydiving",
    "address": "Basingstoke Leisure Park, Euskirchen Way, Basingstoke RG22 6PG",
    "postcode": "RG22 6PG",
    "phone": "+44 330 191 3965"
  },
  "4_1": {
    "name": "Skydive Langar",
    "address": "Langar Airfield, Harby Rd, Langar, Nottingham NG13 9HY",
    "postcode": "NG13 9HY",
    "phone": "+44 1949 860878"
  },
  "4_2": {
    "name": "North London Skydiving Centre",
    "address": "Chatteris Airfield, Block Fen Drove, Wimblington, March PE15 0FB",
    "postcode": "PE15 0FB",
    "phone": "+44 1354 699088"
  },
  "4_3": {
    "name": "Black Knights Skydiving Centre",
    "address": "Hillam Ln, Cockerham, Lancaster LA2 0DY",
    "postcode": "LA2 0DY",
    "phone": "+44 1524 791820"
  },
  "4_4": {
    "name": "GoSkydive",
    "address": "Old Sarum Park, Old Sarum, Salisbury SP4 6EB",
    "postcode": "SP4 6EB",
    "phone": "+44 1722 442967"
  },
  "4_5": {
    "name": "Skydive Hibaldstow",
    "address": "Hibaldstow Airfield, Redbourne Rd, Hibaldstow, Brigg DN20 9NN",
    "postcode": "DN20 9NN",
    "phone": "+44 1652 648837"
  },
  "4_6": {
    "name": "UK Parachuting (Sibson)",
    "address": "Sibson Airfield, Wansford Rd, Wansford, Peterborough PE8 6NE",
    "postcode": "PE8 6NE",
    "phone": "+44 1502 476131"
  },
  "4_7": {
    "name": "UK Parachuting (Beccles)",
    "address": "Aerodrome, Benacre Rd, Beccles NR34 7XD",
    "postcode": "NR34 7XD",
    "phone": "+44 1502 476131"
  },
  "4_8": {
    "name": "Skydive GB Parachute Club",
    "address": "East Leys Farm, Grindale Ln, Grindale, Bridlington YO16 4YB",
    "postcode": "YO16 4YB",
    "phone": "+44 1262 228033"
  },
  "4_9": {
    "name": "Army Parachute Association (Red Devils)",
    "address": "Airfield Camp, Netheravon, Salisbury SP4 9SF",
    "postcode": "SP4 9SF",
    "phone": "+44 1980 670734"
  },
  "5_1": {
    "name": "Axeperience Axe Throwing",
    "address": "48-51 Minories, London EC3N 1JJ",
    "postcode": "EC3N 1JJ",
    "phone": "+44 7933 177414"
  },
  "5_2": {
    "name": "Game of Throwing - Axe Throwing Experience",
    "address": "136 King St, London W6 0QU",
    "postcode": "W6 0QU",
    "phone": "+44 330 122 8877"
  },
  "6_1": {
    "name": "Flight Training London",
    "address": "Elstree Aerodrome, Hogg Ln, Radlett, Borehamwood WD6 3AW",
    "postcode": "WD6 3AW",
    "phone": "+44 20 3005 3276"
  },
  "6_2": {
    "name": "Merseyflight Air Training School",
    "address": "Saltney Ferry, Chester CH4 0GZ",
    "postcode": "CH4 0GZ",
    "phone": "+44 1244 911787"
  },
  "6_3": {
    "name": "Almat Flying Academy Ltd",
    "address": "Halfpenny Green Airport, Unit 29B Crab Ln, Stourbridge DY7 5DY",
    "postcode": "DY7 5DY",
    "phone": "+44 24 7722 0399"
  },
  "6_4": {
    "name": "The Flying School Ltd",
    "address": "Unit 20, Halfpenny Green Airport, Bobbington, Stourbridge DY7 5DY",
    "postcode": "DY7 5DY",
    "phone": "+44 1384 221700"
  },
  "6_5": {
    "name": "Solent Flight GB-0042",
    "address": "Winchester Rd, Lower Upham, Bishop's Waltham, Southampton SO32 1HA",
    "postcode": "SO32 1HA",
    "phone": "+44 1489 861333"
  },
  "6_6": {
    "name": "The Sherwood Flying Club Ltd",
    "address": "Airport, Tollerton Ln, Nottingham NG12 4GA",
    "postcode": "NG12 4GA",
    "phone": "+44 7359 057848"
  },
  "7_1": {
    "name": "Heli Air Ltd (Wycombe)",
    "address": "Wycombe Air Park, Near Marlow, Booker, High Wycombe SL7 3DP",
    "postcode": "SL7 3DP",
    "phone": "+44 1494 769976"
  },
  "7_2": {
    "name": "JK Helicopter Training",
    "address": "Staverton, Cheltenham GL51 6SR",
    "postcode": "GL51 6SR",
    "phone": "+44 7900 680859"
  },
  "7_3": {
    "name": "Elstree Helicopters",
    "address": "Elstree Aerodrome, Hogg Ln, Radlett, Borehamwood WD6 3AW",
    "postcode": "WD6 3AW",
    "phone": "+44 20 8099 7766"
  },
  "7_4": {
    "name": "Hields Aviation",
    "address": "Lennerton Ln, Leeds LS25 6JE",
    "postcode": "LS25 6JE",
    "phone": "+44 1977 680206"
  },
  "7_5": {
    "name": "Heli Air Ltd (Wellesbourne)",
    "address": "Loxley Ln, Wellesbourne, Warwick CV35 9EU",
    "postcode": "CV35 9EU",
    "phone": "+44 1789 470476"
  },
  "8_1": {
    "name": "Atmosphere Hot Air Balloons",
    "address": "7C City Rd, Winchester SO23 8SD",
    "postcode": "SO23 8SD",
    "phone": "+44 7711 638026"
  },
  "8_2": {
    "name": "Wickers World Hot Air Balloon Flights",
    "address": "Tolldish Ln, Great Haywood, Stafford ST18 0RA",
    "postcode": "ST18 0RA",
    "phone": "+44 1889 882222"
  },
  "8_3": {
    "name": "Hot Air Balloon Flights from Derbyshire (Wickers World)",
    "address": "Tissington, Ashbourne DE6 1RA",
    "postcode": "DE6 1RA",
    "phone": "+44 1889 882222"
  },
  "8_4": {
    "name": "Adventure Balloons Ltd",
    "address": "London Rd, Hartley Wintney, Hook RG27 8HY",
    "postcode": "RG27 8HY",
    "phone": "+44 1252 844222"
  },
  "8_5": {
    "name": "Virgin Balloon Flights Head Office",
    "address": "Jesson House, Stafford Ct, Telford TF3 3BD",
    "postcode": "TF3 3BD",
    "phone": "+44 1952 212775"
  },
  "8_6": {
    "name": "Bailey Balloons",
    "address": "44 Ham Grn, Pill, Bristol BS20 0HA",
    "postcode": "BS20 0HA",
    "phone": "+44 1275 375300"
  },
  "9_1": {
    "name": "Headley Clay Pigeon Shooting Club",
    "address": "Costal Woods, Church Ln, Headley, Epsom KT18 6LP",
    "postcode": "KT18 6LP",
    "phone": "+44 7831 879200"
  },
  "9_2": {
    "name": "London Clay Shooting",
    "address": "The Red House Rectory Farm, The Ridgeway, Enfield EN2 8AA",
    "postcode": "EN2 8AA",
    "phone": "+44 7971 162048"
  },
  "9_3": {
    "name": "National Clay Shooting Centre",
    "address": "Bisley Camp, Brookwood, Woking GU24 0PB",
    "postcode": "GU24 0PB",
    "phone": "+44 1483 797666"
  },
  "9_4": {
    "name": "Spitfire Shoot",
    "address": "Houghton Down Farm, Stockbridge SO20 6JR",
    "postcode": "SO20 6JR",
    "phone": "+44 1264 810312"
  },
  "10_1": {
    "name": "PaddleSUP Company",
    "address": "78 Novello Cl, Basingstoke RG22 4LE",
    "postcode": "RG22 4LE",
    "phone": "+44 7789 956705"
  },
  "10_2": {
    "name": "Active360 Paddleboarding Kew",
    "address": "Kew Bridge Paddlesports Arch, Strand-on-the-Green, London W4 3NG",
    "postcode": "W4 3NG",
    "phone": "+44 20 3393 5360"
  },
  "10_3": {
    "name": "Paddleboarding London",
    "address": "The Pirate Castle, Gilbey's Wharf, Oval Rd, London NW1 7EA",
    "postcode": "NW1 7EA",
    "phone": null
  },
  "10_4": {
    "name": "Waterborn SUP",
    "address": "The Quay Carpark, Promenade, Kingsbridge TQ7 1HN",
    "postcode": "TQ7 1HN",
    "phone": "+44 7908 193632"
  },
  "10_5": {
    "name": "The SUP Store",
    "address": "Little Avon Marina, Stony Ln S, Christchurch BH23 1HW",
    "postcode": "BH23 1HW",
    "phone": "+44 7857 268918"
  },
  "10_6": {
    "name": "The Paddle Centre",
    "address": "Swanwick Shore Rd, Southampton SO31 7EF",
    "postcode": "SO31 7EF",
    "phone": "+44 1489 536151"
  },
  "11_1": {
    "name": "Tittesworth Water Sports and Activity Centre",
    "address": "Fishermans Lodge, Meerbrook, Leek ST13 8SH",
    "postcode": "ST13 8SH",
    "phone": "+44 1538 300741"
  },
  "11_2": {
    "name": "Phoenix Canoe Club & Outdoor Centre",
    "address": "Cool Oak Ln, London NW9 7ND",
    "postcode": "NW9 7ND",
    "phone": "+44 7837 585798"
  },
  "11_3": {
    "name": "The Leam Boat Centre Ltd",
    "address": "Mill Rd, Royal Leamington Spa, Leamington Spa CV31 1BE",
    "postcode": "CV31 1BE",
    "phone": "+44 1926 889928"
  },
  "11_4": {
    "name": "Canoe Wild",
    "address": "Grove Ferry Rd, Canterbury CT3 4BP",
    "postcode": "CT3 4BP",
    "phone": "+44 7947 835688"
  },
  "11_5": {
    "name": "Willowgate Adventure Centre",
    "address": "Stockgreen Lodge, Lairwell, Kinfauns, Perth PH2 7JU",
    "postcode": "PH2 7JU",
    "phone": "+44 1738 637245"
  },
  "12_1": {
    "name": "Hackney Wick Drum Studio (Music Mission)",
    "address": "92-94 Wallis Rd, London E9 5LN",
    "postcode": "E9 5LN",
    "phone": "+44 7472 883548"
  },
  "12_2": {
    "name": "East London Drum School",
    "address": "115 Coventry Rd, London E2 6GB",
    "postcode": "E2 6GB",
    "phone": "+44 20 7971 1196"
  },
  "12_3": {
    "name": "London Drum Studio",
    "address": "17 Frederick Terrace, London E8 4EW",
    "postcode": "E8 4EW",
    "phone": "+44 20 8158 6764"
  },
  "12_4": {
    "name": "Drumshack",
    "address": "58 Lavender Hill, London SW11 5RQ",
    "postcode": "SW11 5RQ",
    "phone": "+44 20 7228 1000"
  },
  "13_1": {
    "name": "Crown Works Pottery and School",
    "address": "Crown Works, 11 Temple St, Bethnal Green, London E2 6QQ",
    "postcode": "E2 6QQ",
    "phone": null
  },
  "13_2": {
    "name": "Ceramics Classes London (Zoe)",
    "address": "Railway Arch, 57 Cambridge Grove, London W6 0LD",
    "postcode": "W6 0LD",
    "phone": "+44 20 8876 4129"
  },
  "13_3": {
    "name": "Stoneware Studios Pottery",
    "address": "Unit 1A, Sulivan Enterprise Centre, London SW6 3DJ",
    "postcode": "SW6 3DJ",
    "phone": null
  },
  "13_4": {
    "name": "Dalston Clay",
    "address": "Unit 308, 10B Bradbury St, London N16 8JN",
    "postcode": "N16 8JN",
    "phone": "+44 7586 258554"
  },
  "13_5": {
    "name": "The Slightly Curious Studio",
    "address": "243 Ealing Rd, Wembley HA0 1QL",
    "postcode": "HA0 1QL",
    "phone": null
  },
  "14_1": {
    "name": "Mixology Events Cocktail Classes (Shoreditch)",
    "address": "48 Great Eastern St, London EC2A 3EP",
    "postcode": "EC2A 3EP",
    "phone": "+44 20 7183 9503"
  },
  "14_2": {
    "name": "Mixology Events Cocktail Classes (Covent Garden)",
    "address": "15 Maiden Lane, Covent Garden, London WC2E 7NG",
    "postcode": "WC2E 7NG",
    "phone": "+44 333 344 7765"
  },
  "14_3": {
    "name": "Mixology Events Cocktail Classes (Fitzrovia)",
    "address": "2A Conway St, London W1T 6BA",
    "postcode": "W1T 6BA",
    "phone": "+44 20 8003 7982"
  },
  "14_4": {
    "name": "London Cocktail Exchange (Elliot)",
    "address": "31 Windmill St, London W1T 2JN",
    "postcode": "W1T 2JN",
    "phone": null
  },
  "16_1": {
    "name": "Bombay Sapphire Distillery",
    "address": "Laverstoke Mill, London Rd, Whitchurch RG28 7NR",
    "postcode": "RG28 7NR",
    "phone": "+44 1256 890090"
  },
  "16_2": {
    "name": "Shakespeare Distillery Gin School",
    "address": "Unit A Drayton Manor Dr, Drayton, Stratford-upon-Avon CV37 9RQ",
    "postcode": "CV37 9RQ",
    "phone": "+44 1789 336559"
  },
  "16_3": {
    "name": "The Maidstone Distillery",
    "address": "Unit 5, Corn Exchange, Market Buildings, Maidstone ME14 1HP",
    "postcode": "ME14 1HP",
    "phone": "+44 1622 670063"
  },
  "17_1": {
    "name": "Thermae Bath Spa",
    "address": "The Hetling Pump Room, Hot Bath St, Bath BA1 1SJ",
    "postcode": "BA1 1SJ",
    "phone": "+44 1225 331234"
  },
  "17_2": {
    "name": "Moddershall Oaks Country Spa Retreat",
    "address": "Moddershall, Nr Stone ST15 8WF",
    "postcode": "ST15 8WF",
    "phone": "+44 1782 399000"
  },
  "17_3": {
    "name": "Ringwood Hall Hotel & Spa",
    "address": "Ringwood Rd, Brimington, Chesterfield S43 1DQ",
    "postcode": "S43 1DQ",
    "phone": "+44 1246 280077"
  },
  "18_1": {
    "name": "The Castle Climbing Centre",
    "address": "Green Lanes, London N4 2HA",
    "postcode": "N4 2HA",
    "phone": "+44 20 8211 7000"
  },
  "18_2": {
    "name": "HarroWall Climbing Centre",
    "address": "Unit 2a & 3a, Neptune Trading Estate, Neptune Rd, Harrow HA1 4HX",
    "postcode": "HA1 4HX",
    "phone": "+44 20 3026 4960"
  },
  "18_3": {
    "name": "Boulder UK",
    "address": "3B Carnfield Pl, Walton Summit Centre, Preston PR5 8AN",
    "postcode": "PR5 8AN",
    "phone": "+44 1772 337447"
  },
  "18_4": {
    "name": "The Climbing Lab",
    "address": "12 14 & 15 Kirkstall Industrial Park, Burley, Leeds LS4 2AZ",
    "postcode": "LS4 2AZ",
    "phone": "+44 113 263 2742"
  },
  "18_5": {
    "name": "Aldgate City Bouldering",
    "address": "33 Aldgate High St, London EC3N 1AL",
    "postcode": "EC3N 1AL",
    "phone": "+44 20 7247 3121"
  },
  "18_6": {
    "name": "Boulder Shack Climbing Gym",
    "address": "Unit 4, Imperial Park, Empress Rd, Southampton SO14 0JW",
    "postcode": "SO14 0JW",
    "phone": "+44 23 8017 1808"
  },
  "18_7": {
    "name": "The Climbing Works",
    "address": "Unit B2, 150 Little London Rd, Sheffield S8 0UJ",
    "postcode": "S8 0UJ",
    "phone": "+44 114 250 9990"
  },
  "18_8": {
    "name": "Boulder Central - Indoor Climbing",
    "address": "Richmond St S, West Bromwich B70 0DG",
    "postcode": "B70 0DG",
    "phone": "+44 121 448 3736"
  },
  "18_9": {
    "name": "White City Bouldering",
    "address": "Ariel Way, London W12 7HB",
    "postcode": "W12 7HB",
    "phone": "+44 20 8743 6466"
  },
  "19_1": {
    "name": "River Thames Cruises",
    "address": "Unit 104 Railway Arches, London E1 2LY",
    "postcode": "E1 2LY",
    "phone": "+44 20 7237 3108"
  },
  "19_2": {
    "name": "Thames Rockets (Gemma)",
    "address": "The London Eye and Tower Bridge, London SE1 7PB",
    "postcode": "SE1 7PB",
    "phone": "+44 20 7928 8933"
  },
  "21_1": {
    "name": "The Top Secret Comedy Club (Drury Ln)",
    "address": "170a Drury Ln, London WC2B 5PD",
    "postcode": "WC2B 5PD",
    "phone": "+44 7956 539784"
  },
  "21_2": {
    "name": "The Comedy Store",
    "address": "1a Oxendon St, London SW1Y 4EE",
    "postcode": "SW1Y 4EE",
    "phone": "+44 20 7024 2060"
  },
  "21_3": {
    "name": "Comedy Carnival Covent Garden",
    "address": "42 Earlham St, London WC2H 9LA",
    "postcode": "WC2H 9LA",
    "phone": "+44 20 3411 6388"
  },
  "21_4": {
    "name": "Big Belly Bar & Comedy Club London",
    "address": "Unit 6 & 7, 30 Stamford St, London SE1 9LQ",
    "postcode": "SE1 9LQ",
    "phone": "+44 20 7971 1451"
  },
  "21_5": {
    "name": "Comedy Carnival Leicester Square",
    "address": "61-63 Shaftesbury Ave, London W1D 6LQ",
    "postcode": "W1D 6LQ",
    "phone": "+44 20 3411 6388"
  },
  "21_6": {
    "name": "The Top Secret Comedy Club (Kingsway)",
    "address": "23 Kingsway, London WC2B 6UJ",
    "postcode": "WC2B 6UJ",
    "phone": "+44 7538 800371"
  },
  "21_7": {
    "name": "The Boat Show Comedy Club (Jack)",
    "address": "Ps Tattershall Castle, Victoria Embankment, London WC2R 2PH",
    "postcode": "WC2R 2PH",
    "phone": "+44 7932 658895"
  },
  "22_1": {
    "name": "BAM Karaoke Box | Victoria",
    "address": "74 Victoria St, London SW1E 6SQ",
    "postcode": "SW1E 6SQ",
    "phone": "+44 20 3740 2205"
  },
  "22_2": {
    "name": "Moyagi",
    "address": "5 Cavendish Pl, London W1G 0QA",
    "postcode": "W1G 0QA",
    "phone": "+44 7519 560068"
  },
  "22_3": {
    "name": "Karaoke Box Mayfair",
    "address": "Basement Level, 14 Maddox St, London W1S 1PQ",
    "postcode": "W1S 1PQ",
    "phone": "+44 20 3831 6656"
  },
  "22_4": {
    "name": "Lucky Voice Soho",
    "address": "52 Poland St, London W1F 7NQ",
    "postcode": "W1F 7NQ",
    "phone": "+44 20 7439 3660"
  },
  "22_5": {
    "name": "Lucky Voice Liverpool Street",
    "address": "Building 10, The Avenue, Devonshire Square, London EC2M 4YP",
    "postcode": "EC2M 4YP",
    "phone": "+44 20 3880 6169"
  },
  "22_6": {
    "name": "Karaoke Epoc",
    "address": "30 Brewer St, London W1F 0SS",
    "postcode": "W1F 0SS",
    "phone": "+44 7508 029044"
  },
  "22_7": {
    "name": "Lucky Voice Brighton",
    "address": "8 Black Lion St, Brighton BN1 1ND",
    "postcode": "BN1 1ND",
    "phone": "+44 1273 715770"
  }
};

const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

function formatDate(dateStr) {
  try {
    return new Date(dateStr + 'T12:00:00Z').toLocaleDateString('en-GB', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC',
    });
  } catch (e) {
    return dateStr;
  }
}

async function sendEmails({ activityName, venue, slot, qty, details, amountTotal, sessionId }) {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log('Email not configured - skipping emails');
    return;
  }
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '465', 10),
    secure: (process.env.SMTP_PORT || '465') === '465',
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
  const from = `BucketDays <${process.env.SMTP_USER}>`;
  const when = slot ? `${formatDate(slot.date)} at ${slot.time}` : 'Date to be confirmed';
  const postcode = venue ? venue.postcode : null;
  const total = amountTotal != null ? `£${(amountTotal / 100).toFixed(2)}` : '';

  // 1) Alert to you, with everything needed to brief the venue
  const alertHtml = `
    <h2>New booking: ${esc(activityName)}</h2>
    <p><strong>When:</strong> ${esc(when)}<br>
    <strong>People:</strong> ${qty}<br>
    <strong>Paid:</strong> ${esc(total)}</p>
    <p><strong>Customer:</strong> ${esc(details.name || '')}<br>
    <strong>Email:</strong> ${esc(details.email || '')}<br>
    <strong>Phone:</strong> ${esc(details.phone || '')}</p>
    ${venue ? `<p><strong>Venue:</strong> ${esc(venue.name)}<br>
    <strong>Address:</strong> ${esc(venue.address)}<br>
    <strong>Venue phone:</strong> ${esc(venue.phone || 'n/a')}</p>` : ''}
    <p style="color:#666;font-size:12px">Stripe session: ${esc(sessionId)}</p>`;
  await transporter.sendMail({
    from,
    to: process.env.NOTIFY_TO || process.env.SMTP_USER,
    subject: `New booking: ${activityName} - ${when}`,
    html: alertHtml,
  });

  // 2) Confirmation to the customer (postcode only, no venue name/address)
  if (details.email) {
    const custHtml = `
      <div style="font-family:Arial,sans-serif;max-width:520px;margin:auto;color:#1d1d1f">
        <h2>You're booked in${details.name ? ', ' + esc(details.name.split(' ')[0]) : ''}!</h2>
        <p>Thanks for booking with BucketDays. Here are your details:</p>
        <table style="border-collapse:collapse">
          <tr><td style="padding:4px 14px 4px 0;color:#666">Activity</td><td><strong>${esc(activityName)}</strong></td></tr>
          <tr><td style="padding:4px 14px 4px 0;color:#666">When</td><td><strong>${esc(when)}</strong></td></tr>
          <tr><td style="padding:4px 14px 4px 0;color:#666">People</td><td><strong>${qty}</strong></td></tr>
          ${postcode ? `<tr><td style="padding:4px 14px 4px 0;color:#666">Location</td><td><strong>${esc(postcode)}</strong></td></tr>` : ''}
          <tr><td style="padding:4px 14px 4px 0;color:#666">Paid</td><td><strong>${esc(total)}</strong></td></tr>
        </table>
        <p>We'll email you the full address and everything you need to know before your day. If you have any questions in the meantime, just reply to this email.</p>
        <p>The BucketDays team<br>hello@bucketdays.co.uk</p>
      </div>`;
    await transporter.sendMail({
      from,
      to: details.email,
      replyTo: process.env.SMTP_USER,
      subject: `Booking confirmed: ${activityName}`,
      html: custHtml,
    });
  }
}

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
    const { activityId, slotId, quantity, venueId } = session.metadata;
    const qty = parseInt(quantity, 10) || 1;
    const details = session.customer_details || {};

    // Write the confirmed booking
    await supabase.from('bookings').insert({
      slot_id: slotId,
      activity_id: activityId,
      venue_id: venueId || null,
      customer_name: details.name || null,
      customer_email: details.email || null,
      customer_phone: details.phone || null,
      status: 'confirmed',
    });

    // Decrement capacity (fetch-then-write - matches the no-locking
    // approach already accepted for this calendar; double-booking risk
    // is handled manually via backup providers, not in code)
    const { data: slot } = await supabase
      .from('availability_slots')
      .select('spots_booked, date, time')
      .eq('id', slotId)
      .single();

    await supabase
      .from('availability_slots')
      .update({ spots_booked: (slot?.spots_booked || 0) + qty })
      .eq('id', slotId);

    // Emails - never allowed to break the webhook
    try {
      await sendEmails({
        activityName: ACTIVITY_NAMES[activityId] || 'Your BucketDays experience',
        venue: venueId ? VENUE_INFO[venueId] : null,
        slot,
        qty,
        details,
        amountTotal: session.amount_total,
        sessionId: session.id,
      });
    } catch (err) {
      console.error('Email sending failed:', err.message);
    }
  }

  res.status(200).json({ received: true });
}
