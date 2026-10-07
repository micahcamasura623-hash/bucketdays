import React, { useState, useMemo, useEffect } from "react";import { supabase } from './supabaseClient';

// ════════════════════════════════════════════════════════════════
//  GOLONDON — redesigned for appeal + conversion
//  Direction: "London at dusk" — ink navy, sunset coral, electric
//  blue. Condensed display type, ticket-stub cards, animated hero
//  promise. Tier 1 → booking checkout · Tier 2/3 → affiliate.
// ════════════════════════════════════════════════════════════════

const CATEGORIES = ["All","Adrenaline","Flying","Water","Shooting","Creative","Food & Drink","Wellness","Days Out","Nightlife"];

const ACTIVITIES = [
  { id:1, name:"Rage Buggy Off-Road", cat:"Adrenaline", price:70, tier:1, beginner:true, solo:true, area:"Redhill, Surrey", rating:4.8, blurb:"Throw a roll-caged dirt buggy round a mud track. No licence needed.", emoji:"🏎️", img:"/images/rage-buggy.jpg", url:"/activities/rage-buggy.html" },
  { id:2, name:"Off-Road Karting", cat:"Adrenaline", price:30, tier:1, beginner:true, solo:true, area:"Croydon", rating:4.4, blurb:"The cheapest adrenaline hit near London — a full day on track.", emoji:"🏁", img:"/images/off-road-karting.jpg", url:"/activities/off-road-karting.html" },
  { id:3, name:"Indoor Skydiving", cat:"Adrenaline", price:55, tier:1, beginner:true, solo:true, area:"Basingstoke", rating:4.7, blurb:"Float on a column of air. Weatherproof freefall, any day.", emoji:"🪂", img:"/images/indoor-skydiving.jpg", url:"/activities/indoor-skydiving.html" },
  { id:4, name:"Tandem Skydive", cat:"Adrenaline", price:230, tier:1, beginner:true, solo:true, area:"North London", rating:4.9, blurb:"10,000ft, strapped to a pro. The one you'll never forget.", emoji:"☁️", img:"/images/tandem-skydive.jpg", url:"/activities/tandem-skydive.html" },
  { id:5, name:"Axe Throwing", cat:"Adrenaline", price:30, tier:1, beginner:true, solo:true, area:"Central London", rating:4.6, blurb:"Stick it in the bullseye. Weirdly addictive, fully coached.", emoji:"🪓", img:"/images/axe-throwing.jpg", url:"/activities/axe-throwing.html" },
  { id:6, name:"Aeroplane Trial Lesson", cat:"Flying", price:165, tier:1, beginner:true, solo:true, area:"Denham", rating:4.9, blurb:"Take the controls over the Chilterns. You actually fly it.", emoji:"✈️", img:"/images/aeroplane-trial-lesson.jpg", url:"/activities/aeroplane-trial-lesson.html" },
  { id:7, name:"Helicopter Trial Lesson", cat:"Flying", price:250, tier:1, beginner:true, solo:true, area:"Elstree", rating:4.8, blurb:"Hover, bank, and turn — dual controls, real stick time.", emoji:"🚁", img:"/images/helicopter-trial-lesson.jpg", url:"/activities/helicopter-trial-lesson.html" },
  { id:8, name:"Hot Air Balloon Flight", cat:"Flying", price:150, tier:1, beginner:true, solo:true, area:"Greater London", rating:4.7, blurb:"Drift over the capital at sunrise. Bucket-list calm.", emoji:"🎈", img:"/images/hot-air-balloon.jpg", url:"/activities/hot-air-balloon.html" },
  { id:9, name:"Clay Pigeon Shooting", cat:"Shooting", price:50, tier:1, beginner:true, solo:true, area:"West London", rating:4.8, blurb:"Smash your first clay within minutes. Pro instructor included.", emoji:"🎯", img:"/images/clay-pigeon-shooting.jpg", url:"/activities/clay-pigeon-shooting.html" },
  { id:10, name:"Paddleboarding", cat:"Water", price:40, tier:1, beginner:true, solo:true, area:"Paddington Basin", rating:4.5, blurb:"Stand, balance, glide the calm canal. Surprise core workout.", emoji:"🏄", img:"/images/paddleboarding.jpg", url:"/activities/paddleboarding.html" },
  { id:11, name:"Kayaking Taster", cat:"Water", price:45, tier:1, beginner:true, solo:true, area:"Lee Valley", rating:4.6, blurb:"Beginner paddle on still water with a guide alongside.", emoji:"🛶", img:"/images/kayaking-taster.jpg", url:"/activities/kayaking-taster.html" },
  { id:12, name:"Drum Taster Lesson", cat:"Creative", price:30, tier:1, beginner:true, solo:true, area:"City of London", rating:4.9, blurb:"Adults-only studio, kit provided, play a beat in an hour.", emoji:"🥁", img:"/images/drum-taster-lesson.jpg", url:"/activities/drum-taster-lesson.html" },
  { id:13, name:"Pottery Wheel Class", cat:"Creative", price:48, tier:1, beginner:true, solo:true, area:"Hackney", rating:4.8, blurb:"Throw a bowl on the wheel. Leave with something you made.", emoji:"🏺", img:"/images/pottery-wheel-class.jpg", url:"/activities/pottery-wheel-class.html" },
  { id:14, name:"Cocktail Masterclass", cat:"Food & Drink", price:45, tier:1, beginner:true, solo:false, area:"Shoreditch", rating:4.7, blurb:"Shake three classics under a bartender's eye. Then drink them.", emoji:"🍸", img:"/images/cocktail-masterclass.jpg", url:"/activities/cocktail-masterclass.html" },
  { id:15, name:"Bottomless Brunch", cat:"Food & Drink", price:40, tier:1, beginner:true, solo:false, area:"Soho", rating:4.5, blurb:"Two hours of free-flowing drinks and food. Bring the crew.", emoji:"🥂", img:"/images/bottomless-brunch.jpg", url:"/activities/bottomless-brunch.html" },
  { id:16, name:"Gin Tasting", cat:"Food & Drink", price:42, tier:1, beginner:true, solo:false, area:"Borough", rating:4.6, blurb:"A guided flight of craft gins with the distiller's notes.", emoji:"🍹", img:"/images/gin-tasting.jpg", url:"/activities/gin-tasting.html" },
  { id:17, name:"Spa Day", cat:"Wellness", price:89, tier:1, beginner:true, solo:true, area:"Central London", rating:4.7, blurb:"Thermal suite, a treatment, and nowhere to be. Reset.", emoji:"💆", img:"/images/spa-day.jpg", url:"/activities/spa-day.html" },
  { id:18, name:"Bouldering Session", cat:"Wellness", price:18, tier:1, beginner:true, solo:true, area:"Acton", rating:4.6, blurb:"Ropeless climbing near Ealing. Hooked by the first wall.", emoji:"🧗", img:"/images/bouldering.jpg", url:"/activities/bouldering.html" },
  { id:19, name:"Thames Evening Cruise", cat:"Days Out", price:37, tier:1, beginner:true, solo:true, area:"Westminster Pier", rating:4.7, blurb:"Landmarks lit gold, gliding under Tower Bridge. Two hours.", emoji:"🛳️", img:"/images/thames-evening-cruise.jpg", url:"/activities/thames-evening-cruise.html" },
  { id:20, name:"London Eye Ticket", cat:"Days Out", price:32, tier:1, beginner:true, solo:true, area:"South Bank", rating:4.5, blurb:"The whole skyline from 135 metres. The classic for a reason.", emoji:"🎡", img:"/images/london-eye.jpg", url:"/activities/london-eye.html" },
  { id:21, name:"Comedy Club Night", cat:"Nightlife", price:22, tier:1, beginner:true, solo:true, area:"Soho", rating:4.6, blurb:"Circuit pros and rising names, close enough to heckle.", emoji:"🎤", img:"/images/comedy-club-night.jpg", url:"/activities/comedy-club-night.html" },
  { id:22, name:"Karaoke Private Room", cat:"Nightlife", price:20, tier:1, beginner:true, solo:false, area:"Chinatown", rating:4.4, blurb:"Your booth, your playlist, no judgement. Bring friends.", emoji:"🎶", img:"/images/karaoke-private-room.jpg", url:"/activities/karaoke-private-room.html" },
];
const VENUES = {
  1: [
    { id:"1_1", name:"Max Events Bristol", address:"Berwick Lodge Farm, Henbury, Bristol BS10 7TD", postcode:"BS10 7TD", phone:"+44 117 950 8080", price:95, duration:"Standard (30-60mins)", requirements:"Typically min age 16 to drive (younger as passenger). Closed-toe shoes required. Usually includes helmet, overalls, and instruction." },
    { id:"1_2", name:"Hover Force Activity Centre", address:"Moorditch Ln, Frodsham WA6 7GQ", postcode:"WA6 7GQ", phone:"+44 1928 240444", price:95, duration:"Standard (30-60mins)", requirements:"Typically min age 16 to drive (younger as passenger). Closed-toe shoes required. Usually includes helmet, overalls, and instruction." },
    { id:"1_3", name:"Xsite Leisure", address:"Axes Ln, Redhill RH1 5QL", postcode:"RH1 5QL", phone:"+44 1737 772548", price:95, duration:"Standard (30-60mins)", requirements:"Typically min age 16 to drive (younger as passenger). Closed-toe shoes required. Usually includes helmet, overalls, and instruction." },
  ],
  3: [
    { id:"3_1", name:"iFLY Milton Keynes Indoor Skydiving", address:"602 Marlborough Gate, Milton Keynes MK9 3XS", postcode:"MK9 3XS", phone:"+44 330 191 3967", price:65, duration:"2 Flights", requirements:"Typically min age 4-6. Max weight ~15-16 stone (venue-dependent). Includes flight suit, helmet, goggles, and training briefing. Included Equipment hire Flight certificate" },
    { id:"3_2", name:"iFLY London Indoor Skydiving at The O2", address:"Peninsula Square, London SE10 0DX", postcode:"SE10 0DX", phone:"+44 161 359 7040", price:65, duration:"2 Flights", requirements:"Typically min age 4-6. Max weight ~15-16 stone (venue-dependent). Includes flight suit, helmet, goggles, and training briefing." },
    { id:"3_3", name:"iFLY Manchester Indoor Skydiving", address:"9 Trafford Way, Trafford Park, Stretford, Manchester M41 7JA", postcode:"M41 7JA", phone:"+44 161 359 7040", price:65, duration:"2 Flights", requirements:"Typically min age 4-6. Max weight ~15-16 stone (venue-dependent). Includes flight suit, helmet, goggles, and training briefing." },
    { id:"3_4", name:"iFLY Basingstoke Indoor Skydiving", address:"Basingstoke Leisure Park, Euskirchen Way, Basingstoke RG22 6PG", postcode:"RG22 6PG", phone:"+44 330 191 3965", price:65, duration:"2 Flights", requirements:"Typically min age 4-6. Max weight ~15-16 stone (venue-dependent). Includes flight suit, helmet, goggles, and training briefing." },
  ],
  4: [
    { id:"4_1", name:"Skydive Langar", address:"Langar Airfield, Harby Rd, Langar, Nottingham NG13 9HY", postcode:"NG13 9HY", phone:"+44 1949 860878", price:290, duration:"10k ft.", requirements:"Typically min age 16 (18 at some centres). Max weight ~15-stone. Includes training, equipment and the jump; photos/video usually cost extra." },
    { id:"4_2", name:"North London Skydiving Centre", address:"Chatteris Airfield, Block Fen Drove, Wimblington, March PE15 0FB", postcode:"PE15 0FB", phone:"+44 1354 699088", price:290, duration:"10k ft.", requirements:"Typically min age 16 (18 at some centres). Max weight ~15-stone. Includes training, equipment and the jump; photos/video usually cost extra." },
    { id:"4_3", name:"Black Knights Skydiving Centre", address:"Hillam Ln, Cockerham, Lancaster LA2 0DY", postcode:"LA2 0DY", phone:"+44 1524 791820", price:290, duration:"10k ft.", requirements:"Typically min age 16 (18 at some centres). Max weight ~15-stone. Includes training, equipment and the jump; photos/video usually cost extra." },
    { id:"4_4", name:"GoSkydive", address:"Old Sarum Park, Old Sarum, Salisbury SP4 6EB", postcode:"SP4 6EB", phone:"+44 1722 442967", price:290, duration:"10k ft.", requirements:"Typically min age 16 (18 at some centres). Max weight ~15-stone. Includes training, equipment and the jump; photos/video usually cost extra." },
    { id:"4_5", name:"Skydive Hibaldstow", address:"Hibaldstow Airfield, Redbourne Rd, Hibaldstow, Brigg DN20 9NN", postcode:"DN20 9NN", phone:"+44 1652 648837", price:290, duration:"10k ft.", requirements:"Typically min age 16 (18 at some centres). Max weight ~15-stone. Includes training, equipment and the jump; photos/video usually cost extra." },
    { id:"4_6", name:"UK Parachuting (Sibson)", address:"Sibson Airfield, Wansford Rd, Wansford, Peterborough PE8 6NE", postcode:"PE8 6NE", phone:"+44 1502 476131", price:290, duration:"10k ft.", requirements:"Typically min age 16 (18 at some centres). Max weight ~15-stone. Includes training, equipment and the jump; photos/video usually cost extra." },
    { id:"4_7", name:"UK Parachuting (Beccles)", address:"Aerodrome, Benacre Rd, Beccles NR34 7XD", postcode:"NR34 7XD", phone:"+44 1502 476131", price:290, duration:"10kft", requirements:"Typically min age 16 (18 at some centres). Max weight ~15-stone. Includes training, equipment and the jump; photos/video usually cost extra." },
    { id:"4_8", name:"Skydive GB Parachute Club", address:"East Leys Farm, Grindale Ln, Grindale, Bridlington YO16 4YB", postcode:"YO16 4YB", phone:"+44 1262 228033", price:290, duration:null, requirements:"Typically min age 16 (18 at some centres). Max weight ~15-stone. Includes training, equipment and the jump; photos/video usually cost extra." },
    { id:"4_9", name:"Army Parachute Association (Red Devils)", address:"Airfield Camp, Netheravon, Salisbury SP4 9SF", postcode:"SP4 9SF", phone:"+44 1980 670734", price:290, duration:null, requirements:"Typically min age 16 (18 at some centres). Max weight ~15-stone. Includes training, equipment and the jump; photos/video usually cost extra." },
  ],
  5: [
    { id:"5_1", name:"Axeperience Axe Throwing", address:"48-51 Minories, London EC3N 1JJ", postcode:"EC3N 1JJ", phone:"+44 7933 177414", price:50, duration:"Social Lane peak", requirements:"Typically min age 18" },
    { id:"5_2", name:"Game of Throwing - Axe Throwing Experience", address:"136 King St, London W6 0QU", postcode:"W6 0QU", phone:"+44 330 122 8877", price:50, duration:null, requirements:"Typically min age 18" },
  ],
  6: [
    { id:"6_1", name:"Flight Training London", address:"Elstree Aerodrome, Hogg Ln, Radlett, Borehamwood WD6 3AW", postcode:"WD6 3AW", phone:"+44 20 3005 3276", price:240, duration:"2-seaters /30 min", requirements:"No strict min age (child sits with instructor). Some height/weight limits for reaching controls. Includes headset, briefing, and logbook entry." },
    { id:"6_2", name:"Merseyflight Air Training School", address:"Saltney Ferry, Chester CH4 0GZ", postcode:"CH4 0GZ", phone:"+44 1244 911787", price:240, duration:"2-seaters /30 min", requirements:"No strict min age (child sits with instructor). Some height/weight limits for reaching controls. Includes headset, briefing, and logbook entry." },
    { id:"6_3", name:"Almat Flying Academy Ltd", address:"Halfpenny Green Airport, Unit 29B Crab Ln, Stourbridge DY7 5DY", postcode:"DY7 5DY", phone:"+44 24 7722 0399", price:240, duration:"2-seaters /30 min", requirements:"No strict min age (child sits with instructor). Some height/weight limits for reaching controls. Includes headset, briefing, and logbook entry." },
    { id:"6_4", name:"The Flying School Ltd", address:"Unit 20, Halfpenny Green Airport, Bobbington, Stourbridge DY7 5DY", postcode:"DY7 5DY", phone:"+44 1384 221700", price:240, duration:"2-seaters /30 min", requirements:"No strict min age (child sits with instructor). Some height/weight limits for reaching controls. Includes headset, briefing, and logbook entry." },
    { id:"6_5", name:"Solent Flight GB-0042", address:"Winchester Rd, Lower Upham, Bishop's Waltham, Southampton SO32 1HA", postcode:"SO32 1HA", phone:"+44 1489 861333", price:240, duration:"2-seaters /30 min", requirements:"No strict min age (child sits with instructor). Some height/weight limits for reaching controls. Includes headset, briefing, and logbook entry." },
    { id:"6_6", name:"The Sherwood Flying Club Ltd", address:"Airport, Tollerton Ln, Nottingham NG12 4GA", postcode:"NG12 4GA", phone:"+44 7359 057848", price:240, duration:"2-seaters /30 min", requirements:"No strict min age (child sits with instructor). Some height/weight limits for reaching controls. Includes headset, briefing, and logbook entry." },
  ],
  7: [
    { id:"7_1", name:"Heli Air Ltd (Wycombe)", address:"Wycombe Air Park, Near Marlow, Booker, High Wycombe SL7 3DP", postcode:"SL7 3DP", phone:"+44 1494 769976", price:320, duration:"30 minutes", requirements:"No strict min age. Weight limits apply per aircraft. Includes headset, safety briefing, and time at the controls." },
    { id:"7_2", name:"JK Helicopter Training", address:"Staverton, Cheltenham GL51 6SR", postcode:"GL51 6SR", phone:"+44 7900 680859", price:320, duration:"30 minutes R22", requirements:"No strict min age. Weight limits apply per aircraft. Includes headset, safety briefing, and time at the controls." },
    { id:"7_3", name:"Elstree Helicopters", address:"Elstree Aerodrome, Hogg Ln, Radlett, Borehamwood WD6 3AW", postcode:"WD6 3AW", phone:"+44 20 8099 7766", price:320, duration:"30 minutes R22", requirements:"No strict min age. Weight limits apply per aircraft. Includes headset, safety briefing, and time at the controls." },
    { id:"7_4", name:"Hields Aviation", address:"Lennerton Ln, Leeds LS25 6JE", postcode:"LS25 6JE", phone:"+44 1977 680206", price:320, duration:"30 minutes R22", requirements:"No strict min age. Weight limits apply per aircraft. Includes headset, safety briefing, and time at the controls." },
    { id:"7_5", name:"Heli Air Ltd (Wellesbourne)", address:"Loxley Ln, Wellesbourne, Warwick CV35 9EU", postcode:"CV35 9EU", phone:"+44 1789 470476", price:320, duration:"30 minutes R22", requirements:"No strict min age. Weight limits apply per aircraft. Includes headset, safety briefing, and time at the controls." },
  ],
  8: [
    { id:"8_1", name:"Atmosphere Hot Air Balloons", address:"7C City Rd, Winchester SO23 8SD", postcode:"SO23 8SD", phone:"+44 7711 638026", price:250, duration:null, requirements:"Min age typically 8-14 depending on operator. Weather-dependent - frequent rescheduling is normal. Often includes a champagne toast on landing." },
    { id:"8_2", name:"Wickers World Hot Air Balloon Flights", address:"Tolldish Ln, Great Haywood, Stafford ST18 0RA", postcode:"ST18 0RA", phone:"+44 1889 882222", price:250, duration:null, requirements:"Min age typically 8-14 depending on operator. Weather-dependent - frequent rescheduling is normal. Often includes a champagne toast on landing." },
    { id:"8_3", name:"Hot Air Balloon Flights from Derbyshire (Wickers World)", address:"Tissington, Ashbourne DE6 1RA", postcode:"DE6 1RA", phone:"+44 1889 882222", price:250, duration:null, requirements:"Min age typically 8-14 depending on operator. Weather-dependent - frequent rescheduling is normal. Often includes a champagne toast on landing." },
    { id:"8_4", name:"Adventure Balloons Ltd", address:"London Rd, Hartley Wintney, Hook RG27 8HY", postcode:"RG27 8HY", phone:"+44 1252 844222", price:250, duration:null, requirements:"Min age typically 8-14 depending on operator. Weather-dependent - frequent rescheduling is normal. Often includes a champagne toast on landing." },
    { id:"8_5", name:"Virgin Balloon Flights Head Office", address:"Jesson House, Stafford Ct, Telford TF3 3BD", postcode:"TF3 3BD", phone:"+44 1952 212775", price:250, duration:null, requirements:"Min age typically 8-14 depending on operator. Weather-dependent - frequent rescheduling is normal. Often includes a champagne toast on landing." },
    { id:"8_6", name:"Bailey Balloons", address:"44 Ham Grn, Pill, Bristol BS20 0HA", postcode:"BS20 0HA", phone:"+44 1275 375300", price:250, duration:null, requirements:"Min age typically 8-14 depending on operator. Weather-dependent - frequent rescheduling is normal. Often includes a champagne toast on landing." },
  ],
  9: [
    { id:"9_1", name:"Headley Clay Pigeon Shooting Club", address:"Costal Woods, Church Ln, Headley, Epsom KT18 6LP", postcode:"KT18 6LP", phone:"+44 7831 879200", price:110, duration:"essential basic tuition/25 clays", requirements:"Typically min age ~12 with adult supervision; ID sometimes checked. Usually includes cartridges, gun hire, eye/ear protection and instruction. Some venues set a minimum shot count (e.g. 50-100)." },
    { id:"9_2", name:"London Clay Shooting", address:"The Red House Rectory Farm, The Ridgeway, Enfield EN2 8AA", postcode:"EN2 8AA", phone:"+44 7971 162048", price:110, duration:"essential basic tuition/25 clays", requirements:"Typically min age ~12 with adult supervision; ID sometimes checked. Usually includes cartridges, gun hire, eye/ear protection and instruction. Some venues set a minimum shot count (e.g. 50-100)." },
    { id:"9_3", name:"National Clay Shooting Centre", address:"Bisley Camp, Brookwood, Woking GU24 0PB", postcode:"GU24 0PB", phone:"+44 1483 797666", price:110, duration:"essential basic tuition/25 clays", requirements:"Typically min age ~12 with adult supervision; ID sometimes checked. Usually includes cartridges, gun hire, eye/ear protection and instruction. Some venues set a minimum shot count (e.g. 50-100)." },
    { id:"9_4", name:"Spitfire Shoot", address:"Houghton Down Farm, Stockbridge SO20 6JR", postcode:"SO20 6JR", phone:"+44 1264 810312", price:110, duration:null, requirements:"Typically min age ~12 with adult supervision; ID sometimes checked. Usually includes cartridges, gun hire, eye/ear protection and instruction. Some venues set a minimum shot count (e.g. 50-100)." },
  ],
  10: [
    { id:"10_1", name:"PaddleSUP Company", address:"78 Novello Cl, Basingstoke RG22 4LE", postcode:"RG22 4LE", phone:"+44 7789 956705", price:70, duration:"1hr ,Group lesson", requirements:"Typically min age ~8. Must be a confident swimmer. Wetsuit and buoyancy aid usually included." },
    { id:"10_2", name:"Active360 Paddleboarding Kew", address:"Kew Bridge Paddlesports Arch, Strand-on-the-Green, London W4 3NG", postcode:"W4 3NG", phone:"+44 20 3393 5360", price:70, duration:"2hr,group lesson", requirements:"Typically min age ~8. Must be a confident swimmer. Wetsuit and buoyancy aid usually included." },
    { id:"10_3", name:"Paddleboarding London", address:"The Pirate Castle, Gilbey's Wharf, Oval Rd, London NW1 7EA", postcode:"NW1 7EA", phone:null, price:70, duration:"90mins", requirements:"Typically min age ~8. Must be a confident swimmer. Wetsuit and buoyancy aid usually included." },
    { id:"10_4", name:"Waterborn SUP", address:"The Quay Carpark, Promenade, Kingsbridge TQ7 1HN", postcode:"TQ7 1HN", phone:"+44 7908 193632", price:70, duration:"90mins", requirements:"Typically min age ~8. Must be a confident swimmer. Wetsuit and buoyancy aid usually included." },
    { id:"10_5", name:"The SUP Store", address:"Little Avon Marina, Stony Ln S, Christchurch BH23 1HW", postcode:"BH23 1HW", phone:"+44 7857 268918", price:70, duration:"1hr", requirements:"Typically min age ~8. Must be a confident swimmer. Wetsuit and buoyancy aid usually included." },
    { id:"10_6", name:"The Paddle Centre", address:"Swanwick Shore Rd, Southampton SO31 7EF", postcode:"SO31 7EF", phone:"+44 1489 536151", price:70, duration:"1hr", requirements:"Typically min age ~8. Must be a confident swimmer. Wetsuit and buoyancy aid usually included." },
  ],
  11: [
    { id:"11_1", name:"Tittesworth Water Sports and Activity Centre", address:"Fishermans Lodge, Meerbrook, Leek ST13 8SH", postcode:"ST13 8SH", phone:"+44 1538 300741", price:53, duration:"1.5hours", requirements:"Typically min age ~8. Must be able to swim. Buoyancy aid and paddle usually included." },
    { id:"11_2", name:"Phoenix Canoe Club & Outdoor Centre", address:"Cool Oak Ln, London NW9 7ND", postcode:"NW9 7ND", phone:"+44 7837 585798", price:53, duration:"1.5hours", requirements:"Typically min age ~8. Must be able to swim. Buoyancy aid and paddle usually included." },
    { id:"11_3", name:"The Leam Boat Centre Ltd", address:"Mill Rd, Royal Leamington Spa, Leamington Spa CV31 1BE", postcode:"CV31 1BE", phone:"+44 1926 889928", price:53, duration:"2hrs", requirements:"Typically min age ~8. Must be able to swim. Buoyancy aid and paddle usually included." },
    { id:"11_4", name:"Canoe Wild", address:"Grove Ferry Rd, Canterbury CT3 4BP", postcode:"CT3 4BP", phone:"+44 7947 835688", price:53, duration:"1hr", requirements:"Typically min age ~8. Must be able to swim. Buoyancy aid and paddle usually included." },
    { id:"11_5", name:"Willowgate Adventure Centre", address:"Stockgreen Lodge, Lairwell, Kinfauns, Perth PH2 7JU", postcode:"PH2 7JU", phone:"+44 1738 637245", price:53, duration:"1hr", requirements:"Typically min age ~8. Must be able to swim. Buoyancy aid and paddle usually included." },
  ],
  12: [
    { id:"12_1", name:"Hackney Wick Drum Studio (Music Mission)", address:"92-94 Wallis Rd, London E9 5LN", postcode:"E9 5LN", phone:"+44 7472 883548", price:30, duration:"30-free taster", requirements:"No strict age restriction. Drumsticks usually provided; own footwear/clothing fine." },
    { id:"12_2", name:"East London Drum School", address:"115 Coventry Rd, London E2 6GB", postcode:"E2 6GB", phone:"+44 20 7971 1196", price:30, duration:"30min", requirements:"No strict age restriction. Drumsticks usually provided; own footwear/clothing fine." },
    { id:"12_3", name:"London Drum Studio", address:"17 Frederick Terrace, London E8 4EW", postcode:"E8 4EW", phone:"+44 20 8158 6764", price:30, duration:"1hour", requirements:"No strict age restriction. Drumsticks usually provided; own footwear/clothing fine." },
    { id:"12_4", name:"Drumshack", address:"58 Lavender Hill, London SW11 5RQ", postcode:"SW11 5RQ", phone:"+44 20 7228 1000", price:30, duration:"30mins", requirements:"No strict age restriction. Drumsticks usually provided; own footwear/clothing fine." },
  ],
  13: [
    { id:"13_1", name:"Crown Works Pottery and School", address:"Crown Works, 11 Temple St, Bethnal Green, London E2 6QQ", postcode:"E2 6QQ", phone:null, price:95, duration:"2hours-Taster", requirements:"No strict age restriction. Apron usually provided. Firing/collection of finished pieces sometimes arranged separately after the session." },
    { id:"13_2", name:"Ceramics Classes London (Zoe)", address:"Railway Arch, 57 Cambridge Grove, London W6 0LD", postcode:"W6 0LD", phone:"+44 20 8876 4129", price:95, duration:"1.5 hours-Taster", requirements:"No strict age restriction. Apron usually provided. Firing/collection of finished pieces sometimes arranged separately after the session." },
    { id:"13_3", name:"Stoneware Studios Pottery", address:"Unit 1A, Sulivan Enterprise Centre, London SW6 3DJ", postcode:"SW6 3DJ", phone:null, price:95, duration:"2 hours-Taster", requirements:"No strict age restriction. Apron usually provided. Firing/collection of finished pieces sometimes arranged separately after the session." },
    { id:"13_4", name:"Dalston Clay", address:"Unit 308, 10B Bradbury St, London N16 8JN", postcode:"N16 8JN", phone:"+44 7586 258554", price:95, duration:"1.5 hours-Taster", requirements:"No strict age restriction. Apron usually provided. Firing/collection of finished pieces sometimes arranged separately after the session." },
    { id:"13_5", name:"The Slightly Curious Studio", address:"243 Ealing Rd, Wembley HA0 1QL", postcode:"HA0 1QL", phone:null, price:95, duration:"2hours-Taster", requirements:"No strict age restriction. Apron usually provided. Firing/collection of finished pieces sometimes arranged separately after the session." },
  ],
  14: [
    { id:"14_1", name:"Mixology Events Cocktail Classes (Shoreditch)", address:"48 Great Eastern St, London EC2A 3EP", postcode:"EC2A 3EP", phone:"+44 20 7183 9503", price:97, duration:"2hours", requirements:"Min age 18 (alcohol service). Non-alcoholic versions sometimes available on request." },
    { id:"14_2", name:"Mixology Events Cocktail Classes (Covent Garden)", address:"15 Maiden Lane, Covent Garden, London WC2E 7NG", postcode:"WC2E 7NG", phone:"+44 333 344 7765", price:97, duration:"2hours", requirements:"Min age 18 (alcohol service). Non-alcoholic versions sometimes available on request." },
    { id:"14_3", name:"Mixology Events Cocktail Classes (Fitzrovia)", address:"2A Conway St, London W1T 6BA", postcode:"W1T 6BA", phone:"+44 20 8003 7982", price:97, duration:"2hours", requirements:"Min age 18 (alcohol service). Non-alcoholic versions sometimes available on request." },
    { id:"14_4", name:"London Cocktail Exchange (Elliot)", address:"31 Windmill St, London W1T 2JN", postcode:"W1T 2JN", phone:null, price:97, duration:"inc.£40 worth of drinks", requirements:"Min age 18 (alcohol service). Non-alcoholic versions sometimes available on request." },
  ],
  16: [
    { id:"16_1", name:"Bombay Sapphire Distillery", address:"Laverstoke Mill, London Rd, Whitchurch RG28 7NR", postcode:"RG28 7NR", phone:"+44 1256 890090", price:63, duration:"1.5-hour fully-guided tour,1-hour cocktail mixology session", requirements:"Min age 18. Often includes a short talk/tour plus a take-home miniature at some venues." },
    { id:"16_2", name:"Shakespeare Distillery Gin School", address:"Unit A Drayton Manor Dr, Drayton, Stratford-upon-Avon CV37 9RQ", postcode:"CV37 9RQ", phone:"+44 1789 336559", price:63, duration:"1hr", requirements:"Min age 18. Often includes a short talk/tour plus a take-home miniature at some venues." },
    { id:"16_3", name:"The Maidstone Distillery", address:"Unit 5, Corn Exchange, Market Buildings, Maidstone ME14 1HP", postcode:"ME14 1HP", phone:"+44 1622 670063", price:63, duration:"90 minute immersive experience of our modern facility", requirements:"Min age 18. Often includes a short talk/tour plus a take-home miniature at some venues." },
  ],
  17: [
    { id:"17_1", name:"Thermae Bath Spa", address:"The Hetling Pump Room, Hot Bath St, Bath BA1 1SJ", postcode:"BA1 1SJ", phone:"+44 1225 331234", price:115, duration:"2hours Thermal", requirements:"Min age typically 18+" },
    { id:"17_2", name:"Moddershall Oaks Country Spa Retreat", address:"Moddershall, Nr Stone ST15 8WF", postcode:"ST15 8WF", phone:"+44 1782 399000", price:115, duration:"1/2day spa", requirements:"Min age typically 18+" },
    { id:"17_3", name:"Ringwood Hall Hotel & Spa", address:"Ringwood Rd, Brimington, Chesterfield S43 1DQ", postcode:"S43 1DQ", phone:"+44 1246 280077", price:115, duration:"Afternoon Serenity 1/2 day", requirements:"Min age typically 18+" },
  ],
  18: [
    { id:"18_1", name:"The Castle Climbing Centre", address:"Green Lanes, London N4 2HA", postcode:"N4 2HA", phone:"+44 20 8211 7000", price:40, duration:null, requirements:"Including Climbing shoe and chalk bag hire often charged separately from entry." },
    { id:"18_2", name:"HarroWall Climbing Centre", address:"Unit 2a & 3a, Neptune Trading Estate, Neptune Rd, Harrow HA1 4HX", postcode:"HA1 4HX", phone:"+44 20 3026 4960", price:40, duration:"1of1,1hour", requirements:"14+ Climbing shoe and chalk bag hire often charged separately from entry." },
    { id:"18_3", name:"Boulder UK", address:"3B Carnfield Pl, Walton Summit Centre, Preston PR5 8AN", postcode:"PR5 8AN", phone:"+44 1772 337447", price:40, duration:"Induction", requirements:"Adult Including Climbing shoe and chalk bag hire often charged separately from entry." },
    { id:"18_4", name:"The Climbing Lab", address:"12 14 & 15 Kirkstall Industrial Park, Burley, Leeds LS4 2AZ", postcode:"LS4 2AZ", phone:"+44 113 263 2742", price:40, duration:"Induction", requirements:"Adult and 14-17 Including Climbing shoe and chalk bag hire often charged separately from entry." },
    { id:"18_5", name:"Aldgate City Bouldering", address:"33 Aldgate High St, London EC3N 1AL", postcode:"EC3N 1AL", phone:"+44 20 7247 3121", price:40, duration:"Single entry peak", requirements:"Adult and 14-17 Including Climbing shoe and chalk bag hire often charged separately from entry." },
    { id:"18_6", name:"Boulder Shack Climbing Gym", address:"Unit 4, Imperial Park, Empress Rd, Southampton SO14 0JW", postcode:"SO14 0JW", phone:"+44 23 8017 1808", price:40, duration:null, requirements:"Adult and 14-17 Including Climbing shoe and chalk bag hire often charged separately from entry." },
    { id:"18_7", name:"The Climbing Works", address:"Unit B2, 150 Little London Rd, Sheffield S8 0UJ", postcode:"S8 0UJ", phone:"+44 114 250 9990", price:40, duration:null, requirements:"Adult and 14-17 Including Climbing shoe and chalk bag hire often charged separately from entry." },
    { id:"18_8", name:"Boulder Central - Indoor Climbing", address:"Richmond St S, West Bromwich B70 0DG", postcode:"B70 0DG", phone:"+44 121 448 3736", price:40, duration:null, requirements:"Adult and 14-17 Including Climbing shoe and chalk bag hire often charged separately from entry." },
    { id:"18_9", name:"White City Bouldering", address:"Ariel Way, London W12 7HB", postcode:"W12 7HB", phone:"+44 20 8743 6466", price:40, duration:null, requirements:"Adult and 14-17 Including Climbing shoe and chalk bag hire often charged separately from entry." },
  ],
  19: [
    { id:"19_1", name:"River Thames Cruises", address:"Unit 104 Railway Arches, London E1 2LY", postcode:"E1 2LY", phone:"+44 20 7237 3108", price:45, duration:"Thames River Disco Cruise", requirements:"No strict age restriction. Welcome drink or light snacks sometimes included depending on package." },
    { id:"19_2", name:"Thames Rockets (Gemma)", address:"The London Eye and Tower Bridge, London SE1 7PB", postcode:"SE1 7PB", phone:"+44 20 7928 8933", price:45, duration:"Seated ticket", requirements:"No strict age restriction. Welcome drink or light snacks sometimes included depending on package." },
  ],
  21: [
    { id:"21_1", name:"The Top Secret Comedy Club (Drury Ln)", address:"170a Drury Ln, London WC2B 5PD", postcode:"WC2B 5PD", phone:"+44 7956 539784", price:35, duration:"Standup Comedy", requirements:"Often 18+ due to adult content and bar service; some venues run separate family-friendly daytime shows." },
    { id:"21_2", name:"The Comedy Store", address:"1a Oxendon St, London SW1Y 4EE", postcode:"SW1Y 4EE", phone:"+44 20 7024 2060", price:35, duration:"Seated ticket", requirements:"Often 18+ due to adult content and bar service; some venues run separate family-friendly daytime shows." },
    { id:"21_3", name:"Comedy Carnival Covent Garden", address:"42 Earlham St, London WC2H 9LA", postcode:"WC2H 9LA", phone:"+44 20 3411 6388", price:35, duration:"Seated ticket", requirements:"Often 18+ due to adult content and bar service; some venues run separate family-friendly daytime shows." },
    { id:"21_4", name:"Big Belly Bar & Comedy Club London", address:"Unit 6 & 7, 30 Stamford St, London SE1 9LQ", postcode:"SE1 9LQ", phone:"+44 20 7971 1451", price:35, duration:"Seated ticket", requirements:"Often 18+ due to adult content and bar service; some venues run separate family-friendly daytime shows." },
    { id:"21_5", name:"Comedy Carnival Leicester Square", address:"61-63 Shaftesbury Ave, London W1D 6LQ", postcode:"W1D 6LQ", phone:"+44 20 3411 6388", price:35, duration:"Seated ticket", requirements:"Often 18+ due to adult content and bar service; some venues run separate family-friendly daytime shows." },
    { id:"21_6", name:"The Top Secret Comedy Club (Kingsway)", address:"23 Kingsway, London WC2B 6UJ", postcode:"WC2B 6UJ", phone:"+44 7538 800371", price:35, duration:"Standup Comedy", requirements:"Often 18+ due to adult content and bar service; some venues run separate family-friendly daytime shows." },
    { id:"21_7", name:"The Boat Show Comedy Club (Jack)", address:"Ps Tattershall Castle, Victoria Embankment, London WC2R 2PH", postcode:"WC2R 2PH", phone:"+44 7932 658895", price:35, duration:"Seated ticket", requirements:"Often 18+ due to adult content and bar service; some venues run separate family-friendly daytime shows." },
  ],
  22: [
    { id:"22_1", name:"BAM Karaoke Box | Victoria", address:"74 Victoria St, London SW1E 6SQ", postcode:"SW1E 6SQ", phone:"+44 20 3740 2205", price:38, duration:"Classic rate,1hr", requirements:"Age policy varies by venue and time slot - some restrict evenings to 18+ and run family sessions in the day." },
    { id:"22_2", name:"Moyagi", address:"5 Cavendish Pl, London W1G 0QA", postcode:"W1G 0QA", phone:"+44 7519 560068", price:38, duration:"1.45hr", requirements:"Age policy varies by venue and time slot - some restrict evenings to 18+ and run family sessions in the day." },
    { id:"22_3", name:"Karaoke Box Mayfair", address:"Basement Level, 14 Maddox St, London W1S 1PQ", postcode:"W1S 1PQ", phone:"+44 20 3831 6656", price:38, duration:"2hours", requirements:"Age policy varies by venue and time slot - some restrict evenings to 18+ and run family sessions in the day." },
    { id:"22_4", name:"Lucky Voice Soho", address:"52 Poland St, London W1F 7NQ", postcode:"W1F 7NQ", phone:"+44 20 7439 3660", price:38, duration:"2hours", requirements:"Age policy varies by venue and time slot - some restrict evenings to 18+ and run family sessions in the day." },
    { id:"22_5", name:"Lucky Voice Liverpool Street", address:"Building 10, The Avenue, Devonshire Square, London EC2M 4YP", postcode:"EC2M 4YP", phone:"+44 20 3880 6169", price:38, duration:"2hours", requirements:"Age policy varies by venue and time slot - some restrict evenings to 18+ and run family sessions in the day." },
    { id:"22_6", name:"Karaoke Epoc", address:"30 Brewer St, London W1F 0SS", postcode:"W1F 0SS", phone:"+44 7508 029044", price:38, duration:"2hours", requirements:"Age policy varies by venue and time slot - some restrict evenings to 18+ and run family sessions in the day." },
    { id:"22_7", name:"Lucky Voice Brighton", address:"8 Black Lion St, Brighton BN1 1ND", postcode:"BN1 1ND", phone:"+44 1273 715770", price:38, duration:"2hours", requirements:"Age policy varies by venue and time slot - some restrict evenings to 18+ and run family sessions in the day." },
  ],
};
const MARKUP_PCT = 15;

function minVenuePrice(a){
  const vs = VENUES[a.id];
  if(!vs || vs.length===0) return null;
  return Math.min(...vs.map(v=>v.price));
}
function displayPrice(a){
  const m = minVenuePrice(a);
  return m!==null ? m : Math.round(a.price*(1+MARKUP_PCT/100));
}


// ── Palette: London at dusk ──────────────────────────────
const C = {
  ink:    "#141B2E",   // deep navy ink
  ink2:   "#1F2942",   // raised navy
  paper:  "#FBFAF7",   // warm off-white
  coral:  "#FF5A4D",   // sunset coral (primary accent)
  blue:   "#3B7BFF",   // electric dusk blue (secondary)
  gold:   "#FFB23E",   // lamp gold (tertiary / ratings)
  cream:  "#F3EFE6",
  line:   "#E4DFD3",
  muted:  "#7A7E8C",
  inkMuted:"#A8AEC0",
};

const MONTHS=["January","February","March","April","May","June","July","August","September","October","November","December"];
const DOW=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
const ROTATING = ["tonight","this weekend","on a budget","solo","for beginners","near you"];

export default function App(){
  const [view,setView]=useState("browse");
  const [bookingActivity,setBookingActivity]=useState(null);

  useEffect(()=>{
    document.title = "BucketDays — Things to do across the UK, tonight, this weekend & beyond";
    setMeta("description","Discover and book experiences across the UK in minutes. Filter by beginner-friendly, solo, budget and category — adrenaline, flying, food, spa, days out and more.");
    const ld={ "@context":"https://schema.org","@type":"ItemList","name":"Things to do in the UK",
      "itemListElement":ACTIVITIES.slice(0,10).map((a,i)=>({"@type":"ListItem","position":i+1,
        "item":{"@type":"Product","name":a.name,"category":a.cat,
          "aggregateRating":{"@type":"AggregateRating","ratingValue":a.rating,"reviewCount":120},
          "offers":{"@type":"Offer","price":a.price,"priceCurrency":"GBP"}}}))};
    let s=document.getElementById("ld"); if(!s){s=document.createElement("script");s.id="ld";s.type="application/ld+json";document.head.appendChild(s);}
    s.textContent=JSON.stringify(ld);
  },[]);

  function startBooking(a){ setBookingActivity(a); setView("book"); window.scrollTo(0,0); }
  useEffect(()=>{
  const params = new URLSearchParams(window.location.search);
  const bookId = params.get('book');
  if(bookId){
    const match = ACTIVITIES.find(a => a.id === Number(bookId));
    if(match) startBooking(match);
  }
},[]);

  return (
    <div style={{ background:C.paper, minHeight:"100vh", color:C.ink, fontFamily:"'Inter', system-ui, sans-serif" }}>
      <style>{CSS}</style>
      <Header onHome={()=>{ setView("browse"); window.scrollTo({top:0, behavior:"smooth"}); history.pushState("", document.title, window.location.pathname); }} />
      {view==="browse" ? <Browse onBook={startBooking}/> : <Booking activity={bookingActivity} onBack={()=>setView("browse")} />}
     {/* CONTACT */}
<section id="contact" className="contact">
  <div className="contact-in">   
    <h2 className="contact-h2">Get in touch</h2>
    <p className="contact-sub">Questions about a booking, a provider partnership, or anything else — send us a message and we'll get back to you.</p>
    <form className="contact-form" action="https://formspree.io/f/xykrwrob" method="POST">
      <label>
        Name
        <input type="text" name="name" required />
      </label>
      <label>
        Email
        <input type="email" name="email" required />
      </label>
      <label>
        Message
        <textarea name="message" rows="5" required></textarea>
      </label>
      <button type="submit" className="btn btn-coral">Send message</button>
    </form>
  </div>
</section>
      <Footer/>
    </div>
  );
}

function setMeta(n,c){ let m=document.querySelector(`meta[name="${n}"]`); if(!m){m=document.createElement("meta");m.name=n;document.head.appendChild(m);} m.content=c; }

// ── Header ───────────────────────────────────────────────
function Header({onHome}){
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <header className="hdr">
      <nav className="hdr-in" aria-label="Primary">
        <button className="logo" onClick={onHome}>
          <img src="/logo-white.png" alt="BucketDays — Find it. Book it. Go." style={{height:"42px",width:"auto",display:"block"}} />
        </button>
        <div className={`hdr-links ${menuOpen ? "open" : ""}`}>
          <a href="#grid" onClick={()=>setMenuOpen(false)}>Experiences</a>
          <a href="#how" onClick={()=>setMenuOpen(false)}>How It Works</a>
          <a href="/guides" onClick={()=>setMenuOpen(false)}>Guides</a>
          <a href="#contact" onClick={()=>setMenuOpen(false)}>Contact</a>
        </div>
        <button className="hdr-burger" aria-label="Menu" onClick={()=>setMenuOpen(m=>!m)}>
          <span></span><span></span><span></span>
        </button>
      </nav>
    </header>
  );
}  

function Footer(){
  return (
    <footer className="ftr">
      <div className="ftr-in">
        <div>
          <div style={{ marginBottom:14 }}><img src="/logo-white.png" alt="BucketDays" style={{height:"36px",width:"auto",display:"block"}} /></div>
          <p style={{ maxWidth:340, color:C.inkMuted, fontSize:14, lineHeight:1.6, margin:0 }}>The fastest way to find something to do across the UK — filtered by what actually fits your day.</p>
        </div>
        <div className="ftr-cols">
          <div><h4>Explore</h4><span>Adrenaline</span><span>Flying</span><span>Food &amp; Drink</span><span>Days Out</span></div>
          <div><h4>Company</h4><span>About</span><span>How it works</span><span>List your activity</span></div>
          <div><h4>Explore</h4><a href="/guides/" style={{display:"block",fontSize:"14px",color:"#D6DAE6",marginBottom:"8px",textDecoration:"none"}}>Guides</a><a href="mailto:hello@bucketdays.co.uk" style={{display:"block",fontSize:"14px",color:"#D6DAE6",marginBottom:"8px",textDecoration:"none"}}>hello@bucketdays.co.uk</a><a href="/refunds.html" style={{display:"block",fontSize:"14px",color:"#D6DAE6",marginBottom:"8px",textDecoration:"none"}}>Refunds</a><a href="/terms.html" style={{display:"block",fontSize:"14px",color:"#D6DAE6",marginBottom:"8px",textDecoration:"none"}}>Terms</a><a href="/privacy.html" style={{display:"block",fontSize:"14px",color:"#D6DAE6",marginBottom:"8px",textDecoration:"none"}}>Privacy</a></div>
        </div>
      </div>
      <div className="ftr-base">Prototype · “Book now” activities run through our calendar; others link to trusted partners. Prices indicative.</div>
    </footer>
  );
}

// ── Browse ───────────────────────────────────────────────
function Browse({onBook}){
  const [cat,setCat]=useState("All");
  const [maxPrice,setMaxPrice]=useState(250);
  const [beginnerOnly,setBeginner]=useState(false);
  const [soloOnly,setSolo]=useState(false);
  const [q,setQ]=useState("");
  const [word,setWord]=useState(0);

  useEffect(()=>{ const t=setInterval(()=>setWord(w=>(w+1)%ROTATING.length),1900); return ()=>clearInterval(t); },[]);

  const results=useMemo(()=>ACTIVITIES.filter(a=>{
    if(cat!=="All"&&a.cat!==cat) return false;
    if(a.price>maxPrice) return false;
    if(beginnerOnly&&!a.beginner) return false;
    if(soloOnly&&!a.solo) return false;
    if(q&&!`${a.name} ${a.area} ${a.blurb}`.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  }).sort((x,y)=>x.price-y.price),[cat,maxPrice,beginnerOnly,soloOnly,q]);

  const featured = ACTIVITIES.filter(a=>[1,4,6,9].includes(a.id));

  return (
    <main>
    {/* HEADER */}

{/* HERO */}
<section className="hero hero-bg">
  <img src="/images/hero.jpg" alt="Collage of BucketDays experiences: skydiving, off-roading, axe throwing, karaoke and comedy nights" className="hero-bg-img" />
  <div className="hero-overlay" aria-hidden="true" />
  <div className="hero-in">
    <p className="eyebrow">Across the UK · 22 experiences</p>
    <h1 className="hero-h1">
      Something to do<br/>in the UK,{" "}
      <span className="rot-wrap"><span key={word} className="rot">{ROTATING[word]}</span></span>
    </h1>
    <p className="hero-sub">Skip the fifteen phone calls. Filter by beginner-friendly, solo, budget and vibe — then book in minutes.</p>
    <div className="hero-cta">
      <a href="#grid" className="btn btn-coral">Browse experiences</a>
    </div>
    <div className="trust-row">
  <div className="trust-item"><span className="trust-icon">£</span><div><strong>Great Prices</strong><br/>Experiences for every budget</div></div>
  <div className="trust-item"><span className="trust-icon">✓</span><div><strong>No Booking Fees</strong><br/>What you see is what you pay</div></div>
  <div className="trust-item"><span className="trust-icon">⚡</span><div><strong>Instant Confirmation</strong><br/>Book in minutes</div></div>
</div>
  </div>
  {/* featured ticket strip */}
  <div className="strip" aria-label="Featured">
    {featured.map(a=>(
      <button key={a.id} className="strip-card" onClick={()=>a.tier===1?onBook(a):window.open(a.url,"_blank")}>
        <span className="strip-emoji">{a.emoji}</span>
        <span className="strip-name">{a.name}</span>
        <span className="strip-price">from £{displayPrice(a)}</span>
      </button>
    ))}
  </div>
</section>

      {/* HOW IT WORKS */}
<section id="how" className="how">
  <div className="how-in">
    <h2 className="how-h2">How it works</h2>
    <div className="how-steps">
      <div className="how-step">
        <span className="how-num">1</span>
        <h3>Browse & filter</h3>
      </div>
      <div className="how-step">
        <span className="how-num">2</span>
        <h3>Book with confidence</h3>
      </div>
      <div className="how-step">
        <span className="how-num">3</span>
        <h3>Show up and go</h3>
      </div>
    </div>
  </div>
</section>

      {/* CONTROLS */}
      <div id="grid" className="wrap">
        <input className="search" value={q} onChange={e=>setQ(e.target.value)} placeholder="Search activities or areas…" aria-label="Search" />
        <nav className="chips" aria-label="Categories">
          {CATEGORIES.map(c=> <button key={c} className={`chip ${cat===c?"on":""}`} onClick={()=>setCat(c)}>{c}</button> )}
        </nav>
        <div className="filters">
          <div className="slider">
            <span>Max price <strong>£{maxPrice}</strong></span>
            <input type="range" min="15" max="250" step="5" value={maxPrice} onChange={e=>setMaxPrice(+e.target.value)} aria-label="Maximum price" />
          </div>
          <label className="tog"><input type="checkbox" checked={beginnerOnly} onChange={e=>setBeginner(e.target.checked)} /> Beginner-friendly</label>
          <label className="tog"><input type="checkbox" checked={soloOnly} onChange={e=>setSolo(e.target.checked)} /> Solo-friendly</label>
        </div>

        <div className="grid-head">
          <h2>{cat==="All"?"All experiences":cat}</h2>
          <span>{results.length} {results.length===1?"result":"results"}</span>
        </div>

        {results.length===0 ? (
          <div className="empty">Nothing fits these filters yet. Nudge the price up or clear a toggle.</div>
        ) : (
          <div className="grid">
            {results.map(a=>(
              <article key={a.id} className="ticket">
                <div className="ticket-img">
                  <img src={a.img} alt={`${a.name} — ${a.cat} experience in ${a.area}`} loading="lazy"
                    onError={(e)=>{e.target.style.display="none";e.target.parentNode.classList.add("noimg");}} />
                  <span className="ticket-img-emoji">{a.emoji}</span>
                  {a.tier===1 && <span className="ticket-badge">Instant book</span>}
                </div>
                <div className="ticket-top">
                  <span className="ticket-cat">{a.cat}</span>
                </div>
                <div className="ticket-body">
                  <h3>{a.name}</h3>
                  <p className="ticket-area">📍 {VENUES[a.id] ? `${VENUES[a.id].length} locations across the UK` : a.area} · <span className="star">★ {a.rating}</span></p>
                  <p className="ticket-blurb">{a.blurb}</p>
                  <div className="ticket-tags">
                    {a.beginner && <em>Beginner</em>}
                    {a.solo && <em>Solo OK</em>}
                  </div>
                </div>
                <div className="ticket-foot">
  <span className="ticket-price"><small>from</small> £{displayPrice(a)}</span>
  <button className="btn btn-coral sm" onClick={()=>onBook(a)}>Book now</button>
</div>
              </article>
            ))}
          </div>
        )}

        {/* trust band */}
        <section className="band">
          <div><strong>1</strong><span>Find it with real filters — price, beginner, solo, midweek.</span></div>
          <div><strong>2</strong><span>Book the date that suits you in a couple of taps.</span></div>
          <div><strong>3</strong><span>Turn up and enjoy. We sort the rest with the provider.</span></div>
        </section>

        {/* SEO copy */}
        <section className="seo">
          <h2>Things to do across the UK — without the endless searching</h2>
          <p>The UK has more experiences than anyone can reasonably sort through, and most listings hide the details that actually decide your day: whether beginners are welcome, whether you can go on your own, whether it runs midweek, and what it really costs. BucketDays puts those filters first.</p>
          <p>Chasing an adrenaline hit like a <strong>rage buggy</strong> or <strong>tandem skydive</strong>? After a calmer <strong>evening Thames cruise</strong>, a creative <strong>drum lesson</strong>, or a <strong>spa day</strong> to switch off? Narrow to what fits and book without ringing round. Every listing is tagged for experience level and group size, so first-timers and solo adventurers can book with confidence.</p>
        </section>
      </div>
    </main>
  );
}

// ── Booking ──────────────────────────────────────────────
function Booking({activity,onBack}){
  const venueList = VENUES[activity.id] || null;
  const [step,setStep]=useState(1);
  const [venue,setVenue]=useState(null);
  const [vY,setVY]=useState(new Date().getFullYear());
  const [vM,setVM]=useState(new Date().getMonth());
  const [sel,setSel]=useState(null);
  const [slots,setSlots]=useState([]);
  const [selSlot,setSelSlot]=useState(null);
  const [loadingSlots,setLoadingSlots]=useState(true);
  const [form,setForm]=useState({name:"",email:"",people:1});
  const [submitting,setSubmitting]=useState(false);
  const [bookingError,setBookingError]=useState("");

  useEffect(()=>{
    window.scrollTo({top:0, behavior:"smooth"});
  }, [step]);

  // need-a-venue gate: multi-location activities must pick a venue before
  // availability means anything
  const needsVenue = !!venueList;
  const venueChosen = !needsVenue || !!venue;

  useEffect(()=>{
    if(needsVenue && !venue){ setSlots([]); setLoadingSlots(false); return; }
    let active=true;
    setLoadingSlots(true);
    let q=supabase.from('availability_slots').select('*').eq('activity_id',activity.id);
    if(needsVenue) q=q.eq('venue_id',venue.id);
    q.order('date').order('time')
      .then(({data,error})=>{
        if(!active) return;
        if(!error) setSlots(data||[]);
        setLoadingSlots(false);
      });
    return ()=>{active=false;};
  },[activity.id, venue]);

  const price = venue ? venue.price : activity.price;
  const total = price*form.people;

  const first=new Date(vY,vM,1); let sd=first.getDay()-1; if(sd<0)sd=6;
  const dim=new Date(vY,vM+1,0).getDate();
  const today=new Date(); today.setHours(0,0,0,0);
  const cells=[]; for(let i=0;i<sd;i++)cells.push(null); for(let d=1;d<=dim;d++)cells.push(d);
  const shift=d=>{let m=vM+d,y=vY; if(m<0){m=11;y--} if(m>11){m=0;y++} setVM(m);setVY(y);};
  const fmt=d=> d?`${DOW[(d.getDay()+6)%7]} ${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`:"";

  const slotsForDay=(d)=>{
    if(!d) return [];
    const dateStr=`${vY}-${String(vM+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    return slots.filter(s=>s.date===dateStr && s.spots_booked<s.capacity);
  };

  const daySlots = sel ? slots.filter(s=>{
    const sd2=new Date(s.date+"T00:00:00");
    return sd2.getFullYear()===sel.getFullYear() && sd2.getMonth()===sel.getMonth() && sd2.getDate()===sel.getDate() && s.spots_booked<s.capacity;
  }) : [];

  function chooseVenue(v){
    setVenue(v); setSel(null); setSelSlot(null);
  }
  function changeVenue(){
    setVenue(null); setSel(null); setSelSlot(null);
  }

  async function confirmBooking(){
    if(!selSlot) return;
    setSubmitting(true);
    setBookingError("");
    try {
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          activityId: activity.id,
          activityName: venue ? `${activity.name} — ${venue.name}` : activity.name,
          slotId: selSlot.id,
          quantity: form.people,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        setBookingError("Something went wrong — please try again or contact us.");
        setSubmitting(false);
        return;
      }
      window.location.href = data.url; // off to Stripe Checkout
    } catch (err) {
      setBookingError("Something went wrong — please try again or contact us.");
      setSubmitting(false);
    }
  }

  return (
    <main className="book-wrap">
      <button className="btn btn-ghost sm" onClick={onBack} style={{marginBottom:22}}>← All activities</button>
      <div className="book-head">
        <span className="book-emoji">{activity.emoji}</span>
        <div>
          <p className="eyebrow" style={{margin:"0 0 4px"}}>Book · {activity.cat}</p>
          <h1 className="book-h1">{activity.name}</h1>
          <p style={{color:C.muted,margin:"4px 0 0"}}>📍 {venue ? `${venue.address}` : activity.area}</p>
        </div>
      </div>

      <div className="steps">
        {[1,2,3].map(n=>(
          <React.Fragment key={n}>
            <div className="dot" style={{background:step>=n?C.coral:C.cream,color:step>=n?"#fff":C.muted}}>{n}</div>
            {n<3 && <div className="dot-line" style={{background:step>n?C.coral:C.cream}}/>}
          </React.Fragment>
        ))}
      </div>

      {step===1 && (
        <div>
          {needsVenue && (
            <div className="venue-pick">
              <label className="lbl">Choose a location
                <select
                  className="field"
                  value={venue?venue.id:""}
                  onChange={e=>{
                    const v=venueList.find(x=>x.id===e.target.value);
                    chooseVenue(v||null);
                  }}
                >
                  <option value="">Select a postcode / location…</option>
                  {venueList.slice().sort((a,b)=>a.postcode.localeCompare(b.postcode)).map(v=>(
                    <option key={v.id} value={v.id}>{v.postcode} — {v.name} — £{v.price}</option>
                  ))}
                </select>
              </label>
              {venue && (
                <div className="venue-card">
                  <p className="venue-card-name">{venue.name}</p>
                  <p className="venue-card-line">📍 {venue.address}</p>
                  {venue.phone && <p className="venue-card-line">📞 {venue.phone}</p>}
                  {venue.duration && <p className="venue-card-line">⏱ {venue.duration}</p>}
                  {venue.requirements && <p className="venue-card-req">{venue.requirements}</p>}
                  <button className="btn btn-ghost sm" onClick={changeVenue} style={{marginTop:10}}>Change location</button>
                </div>
              )}
            </div>
          )}

          {venueChosen && (
          <>
          <div className="cal">
            <div className="cal-head">
              <button className="btn btn-ghost sm" onClick={()=>shift(-1)} aria-label="Previous month">‹</button>
              <strong>{MONTHS[vM]} {vY}</strong>
              <button className="btn btn-ghost sm" onClick={()=>shift(1)} aria-label="Next month">›</button>
            </div>
            <div className="cal-dow">{DOW.map(d=><span key={d}>{d}</span>)}</div>
            <div className="cal-grid">
              {cells.map((d,i)=>{
                const date=d?new Date(vY,vM,d):null;
                const past=date&&date<today;
                const available=d && !past && slotsForDay(d).length>0;
                const on=sel&&date&&date.getTime()===sel.getTime();
                return <button key={i} className={`cell ${on?"on":""}`} disabled={!available} onClick={()=>{setSel(date);setSelSlot(null);}}>{d||""}</button>
              })}
            </div>
          </div>
          {loadingSlots && <p style={{color:C.muted,fontSize:14}}>Loading availability…</p>}
          {!loadingSlots && sel && (
            <div style={{marginTop:18}}>
              <p className="sel-line">Selected: {fmt(sel)}</p>
              {daySlots.length===0 ? (
                <p style={{color:C.muted,fontSize:14}}>No open times left on this day — try another date.</p>
              ) : (
                <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                  {daySlots.map(s=>{
                    const left=s.capacity-s.spots_booked;
                    const on=selSlot&&selSlot.id===s.id;
                    return (
                      <button key={s.id} className={`btn ${on?"btn-coral":"btn-out"} sm`} onClick={()=>setSelSlot(s)}>
                        {s.time} · {left} left
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}
          <button className="btn btn-coral full" disabled={!selSlot} onClick={()=>setStep(2)} style={{marginTop:22}}>Continue</button>
          </>
          )}
        </div>
      )}

      {step===2 && (
        <div>
          <label className="lbl">Full name<input className="field" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} /></label>
          <label className="lbl">Email<input className="field" type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} /></label>
          <label className="lbl">Number of people<input className="field" type="number" min="1" max={selSlot?selSlot.capacity-selSlot.spots_booked:10} value={form.people} onChange={e=>setForm({...form,people:+e.target.value})} /></label>
          <div style={{display:"flex",gap:10,marginTop:22}}>
            <button className="btn btn-ghost" onClick={()=>setStep(1)}>Back</button>
            <button className="btn btn-coral" style={{flex:1}} disabled={!form.name||!form.email} onClick={()=>setStep(3)}>Continue</button>
          </div>
        </div>
      )}

      {step===3 && (
        <div>
          <div className="summary">
            <Row l="Activity" v={activity.name}/>
            {venue && <Row l="Location" v={`${venue.name} (${venue.postcode})`}/>}
            <Row l="Date" v={fmt(sel)}/><Row l="Time" v={selSlot?selSlot.time:""}/><Row l="Name" v={form.name}/>
            <div className="sum-div"/>
            <Row l="Price per person" v={`£${price}`}/><Row l="Total" v={`£${total}`} bold/>
          </div>
          <button className="btn btn-coral full" style={{marginTop:18}} disabled={submitting} onClick={confirmBooking}>{submitting?"Booking…":"Confirm booking"}</button>
          <button className="btn btn-ghost full" style={{marginTop:10}} onClick={()=>setStep(2)}>Back</button>
          {bookingError && <p style={{color:"crimson",fontSize:14,marginTop:10}}>{bookingError}</p>}
        </div>
      )}

      {step===4 && (
        <div className="done">
          <div className="done-tick">✓</div>
          <h2>You're booked in</h2>
          <p>In production {form.name||"the customer"} gets a confirmation email and you get an alert.</p>
          <button className="btn btn-coral" onClick={onBack}>Back to activities</button>
        </div>
      )}
    </main>
  );
}

function Row({l,v,bold}){ return <div className={`row ${bold?"row-b":""}`}><span>{l}</span><span>{v}</span></div>; }

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@400;500;600;700&display=swap');
*{box-sizing:border-box}
body{margin:0}
::selection{background:${C.coral};color:#fff}

.eyebrow{font-size:12px;letter-spacing:.18em;text-transform:uppercase;color:${C.coral};font-weight:700;margin:0 0 14px}

/* header */
.hdr{position:sticky;top:0;z-index:50;background:${C.ink};border-bottom:1px solid rgba(255,255,255,.08)}
.hdr-in{max-width:1180px;margin:0 auto;padding:14px 22px;display:flex;align-items:center;justify-content:space-between}
.logo{display:flex;align-items:center;gap:9px;background:none;border:none;cursor:pointer}
.logo-mark{color:${C.coral};font-size:18px;transform:translateY(-1px)}
.logo-word{font-family:'Anton',sans-serif;font-size:23px;letter-spacing:.02em;color:#fff}
.hdr-tag{font-size:13px;color:${C.inkMuted}}

/* hero */
.hero{position:relative;background:${C.ink};color:#fff;overflow:hidden}
.hero-glow{position:absolute;top:-160px;right:-120px;width:520px;height:520px;border-radius:50%;
  background:radial-gradient(circle, rgba(255,90,77,.45), rgba(59,123,255,.12) 55%, transparent 70%);filter:blur(20px)}
.hero-in{position:relative;max-width:1180px;margin:0 auto;padding:64px 22px 34px}
.hero-h1{font-family:'Anton',sans-serif;font-weight:400;font-size:clamp(44px,8vw,86px);line-height:.96;letter-spacing:.005em;margin:0 0 20px;text-transform:uppercase}
.rot-wrap{display:inline-block;color:${C.coral}}
.rot{display:inline-block;animation:rotIn .5s cubic-bezier(.2,.7,.2,1)}
@keyframes rotIn{from{opacity:0;transform:translateY(14px) rotate(-2deg)}to{opacity:1;transform:none}}
.hero-sub{font-size:clamp(16px,2vw,19px);color:#D6DAE6;max-width:540px;line-height:1.55;margin:0 0 26px}
.hero-cta{display:flex;align-items:center;gap:18px;flex-wrap:wrap}
.hero-trust{font-size:13px;color:${C.inkMuted}}
.trust-row{display:flex;flex-direction:row;flex-wrap:wrap;gap:32px;margin-top:24px}
.how{background:${C.paper};padding:60px 22px 30px}
.how-in{max-width:1180px;margin:0 auto}
.how-h2{font-family:'Anton',sans-serif;font-weight:400;font-size:32px;color:${C.ink};margin:0 0 32px;text-transform:uppercase;text-align:center}
.how-steps{display:flex;gap:32px;flex-wrap:wrap;justify-content:center}
.how-step{flex:1 1 260px;max-width:320px;text-align:center}
.how-num{display:inline-flex;align-items:center;justify-content:center;width:36px;height:36px;border-radius:50%;background:${C.coral};color:#fff;font-weight:700;font-size:16px;margin-bottom:14px}
.how-step h3{font-size:18px;color:${C.ink};margin:0 0 8px}
.how-step p{font-size:14px;color:${C.muted};line-height:1.5;margin:0}
.trust-item{display:flex;flex-direction:row;align-items:flex-start;gap:10px;max-width:220px}
.trust-icon{font-size:20px;line-height:1.2;flex-shrink:0}
.trust-item strong{display:block;font-size:14px;color:#fff}
.trust-item div>br{display:none}
.trust-item div{font-size:13px;color:${C.inkMuted};line-height:1.4}

.hero-bg-img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:0}
.hero-overlay{position:absolute;inset:0;background:linear-gradient(90deg, ${C.ink} 0%, rgba(20,27,46,.88) 45%, rgba(20,27,46,.4) 75%);z-index:1}
.hero-in{position:relative;z-index:2}
.hdr-links{display:flex;gap:28px;align-items:center}
.hdr-links a{color:#fff;text-decoration:none;font-size:14px;font-weight:600}
.hdr-links a:hover{color:${C.coral}}
.hdr-burger{display:none;flex-direction:column;justify-content:center;gap:5px;background:none;border:none;cursor:pointer;padding:6px}
.hdr-burger span{width:24px;height:2px;background:#fff;display:block}

@media (max-width:768px){
  .hdr-burger{display:flex}
  .hdr-links{
    display:none;
    position:absolute;
    top:100%;
    left:0;
    right:0;
    flex-direction:column;
    background:${C.ink};
    padding:20px 22px;
    gap:18px;
    border-bottom:1px solid rgba(255,255,255,.08);
  }
  .hdr-links.open{display:flex}
  .hdr{position:relative}
}
.hdr-links a{color:#fff;text-decoration:none;font-size:14px;font-weight:600}
.hdr-links a:hover{color:${C.coral}}
@media (max-width:768px){.hdr-links{display:none}}
/* featured strip */
.strip{position:relative;z-index:2;max-width:1180px;margin:0 auto;padding:0 22px 30px;display:flex;gap:12px;overflow-x:auto;scrollbar-width:none}
.strip::-webkit-scrollbar{display:none}
.strip-card{flex:0 0 auto;display:flex;flex-direction:column;align-items:flex-start;gap:3px;min-width:170px;
 background:rgba(31,41,66,.9);border:1px solid rgba(255,255,255,.18);border:1px solid rgba(255,255,255,.1);border-radius:14px;padding:14px 16px;cursor:pointer;text-align:left;transition:border-color .15s,transform .15s}
.strip-card:hover{border-color:${C.coral};transform:translateY(-2px)}
.strip-emoji{font-size:22px}
.strip-name{color:#fff;font-weight:600;font-size:14px}
.strip-price{color:${C.gold};font-size:13px;font-weight:600}

/* wrap */
.wrap{max-width:1180px;margin:0 auto;padding:10px 22px 50px}
.search{width:100%;padding:15px 18px;border-radius:13px;border:1px solid ${C.line};font-size:15px;margin-bottom:18px;background:#fff}
.search:focus{outline:2px solid ${C.blue};outline-offset:1px}

.chips{display:flex;gap:9px;flex-wrap:wrap;margin-bottom:18px}
.chip{cursor:pointer;border:1px solid ${C.line};background:#fff;padding:8px 15px;border-radius:999px;font-size:14px;font-weight:600;color:${C.ink};transition:all .15s}
.chip:hover{border-color:${C.coral}}
.chip.on{background:${C.ink};color:#fff;border-color:${C.ink}}

.filters{display:flex;gap:24px;flex-wrap:wrap;align-items:center;padding:16px 20px;background:${C.cream};border-radius:14px;margin-bottom:30px}
.slider{display:flex;flex-direction:column;gap:5px;min-width:210px}
.slider span{font-size:13px;color:${C.muted}}.slider strong{color:${C.ink}}
.slider input{accent-color:${C.coral}}
.tog{cursor:pointer;user-select:none;display:inline-flex;align-items:center;gap:8px;font-size:14px;font-weight:500;color:${C.ink}}
.tog input{accent-color:${C.coral};width:17px;height:17px}

.grid-head{display:flex;align-items:baseline;justify-content:space-between;margin-bottom:18px}
.grid-head h2{font-family:'Anton',sans-serif;font-weight:400;font-size:26px;letter-spacing:.01em;margin:0;text-transform:uppercase}
.grid-head span{font-size:14px;color:${C.muted}}

.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(270px,1fr));gap:20px}

/* ticket card */
.ticket{position:relative;background:#fff;border:1px solid ${C.line};border-radius:18px;display:flex;flex-direction:column;overflow:hidden;transition:transform .16s,box-shadow .16s}
.ticket:hover{transform:translateY(-4px);box-shadow:0 18px 40px rgba(20,27,46,.13)}
.ticket-img{position:relative;height:170px;background:linear-gradient(135deg,${C.ink2},${C.ink});overflow:hidden}
.ticket-img img{width:100%;height:100%;object-fit:cover;display:block;transition:transform .3s}
.ticket:hover .ticket-img img{transform:scale(1.05)}
.ticket-img.noimg{display:flex;align-items:center;justify-content:center}
.ticket-img-emoji{position:absolute;left:12px;bottom:10px;font-size:26px;filter:drop-shadow(0 2px 4px rgba(0,0,0,.4))}
.ticket-img.noimg .ticket-img-emoji{position:static;font-size:52px}
.ticket-badge{position:absolute;top:12px;right:12px;font-size:11px;font-weight:700;color:#fff;background:${C.coral};padding:4px 10px;border-radius:999px;box-shadow:0 2px 8px rgba(0,0,0,.25)}
.ticket-top{display:flex;align-items:center;gap:10px;padding:14px 18px 0}
.ticket-emoji{font-size:26px}
.ticket-cat{font-size:11px;font-weight:700;letter-spacing:.07em;text-transform:uppercase;color:${C.blue}}
.ticket-body{padding:10px 18px 0;flex:1}
.ticket-body h3{font-size:19px;font-weight:700;margin:0 0 5px;line-height:1.2}
.ticket-area{font-size:13px;color:${C.muted};margin:0 0 9px}
.star{color:${C.gold};font-weight:600}
.ticket-blurb{font-size:14px;color:#495062;line-height:1.45;margin:0 0 12px}
.ticket-tags{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:14px}
.ticket-tags em{font-style:normal;font-size:11px;font-weight:600;color:#3B6B4E;background:#E9F4EC;padding:3px 9px;border-radius:999px}
/* perforated divider */
.ticket-foot{display:flex;align-items:center;justify-content:space-between;padding:14px 18px;margin-top:auto;border-top:2px dashed ${C.line};position:relative}
.ticket-foot::before,.ticket-foot::after{content:"";position:absolute;top:-9px;width:16px;height:16px;border-radius:50%;background:${C.paper};border:1px solid ${C.line}}
.ticket-foot::before{left:-9px}.ticket-foot::after{right:-9px}
.ticket-price{font-family:'Anton',sans-serif;font-size:23px;color:${C.ink}}
.ticket-price small{font-family:'Inter';font-size:11px;color:${C.muted};font-weight:500;margin-right:3px;vertical-align:2px}

/* buttons */
.btn{cursor:pointer;border:none;border-radius:11px;font-weight:700;font-size:15px;padding:13px 22px;transition:transform .12s,background .15s,box-shadow .15s;font-family:inherit}
.btn:active{transform:scale(.98)}
.btn.sm{padding:9px 16px;font-size:14px;border-radius:10px}
.btn.full{width:100%}
.btn-coral{background:${C.coral};color:#fff;box-shadow:0 6px 16px rgba(255,90,77,.28)}
.btn-coral:hover{background:#F5483B}
.btn-coral:disabled{background:${C.line};color:#fff;box-shadow:none;cursor:not-allowed}
.btn-out{background:#fff;color:${C.ink};border:1.5px solid ${C.ink}}
.btn-out:hover{background:${C.ink};color:#fff}
.btn-ghost{background:transparent;color:${C.muted};border:1px solid ${C.line}}
.btn-ghost:hover{background:${C.cream}}

.empty{padding:54px 20px;text-align:center;border:1px dashed ${C.line};border-radius:14px;color:${C.muted}}

/* band */
.band{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;margin:48px 0 10px}
.band div{background:${C.ink};color:#fff;border-radius:16px;padding:22px 20px}
.band strong{font-family:'Anton',sans-serif;font-size:30px;color:${C.coral};display:block;margin-bottom:8px}
.band span{font-size:14px;color:#D6DAE6;line-height:1.5}

/* seo */
.seo{margin:42px 0 0;max-width:760px}
.seo h2{font-family:'Anton',sans-serif;font-weight:400;font-size:26px;letter-spacing:.01em;text-transform:uppercase;margin:0 0 14px}
.seo p{font-size:15px;color:#495062;line-height:1.7;margin:0 0 14px}
.seo strong{color:${C.ink}}
.contact{background:${C.cream};padding:70px 22px 60px;border-top:1px solid ${C.line};margin-top:40px}
.contact-in{max-width:600px;margin:0 auto}
.contact-h2{font-family:'Anton',sans-serif;font-weight:400;font-size:32px;color:${C.ink};margin:0 0 10px;text-transform:uppercase}
.contact-sub{color:${C.muted};font-size:15px;margin:0 0 28px;line-height:1.5}
.contact-form{display:flex;flex-direction:column;gap:18px}
.contact-form label{display:flex;flex-direction:column;gap:6px;font-size:14px;font-weight:600;color:${C.ink}}
.contact-form input,.contact-form textarea{font-family:'Inter',sans-serif;font-size:15px;padding:12px 14px;border:1px solid ${C.line};border-radius:10px;background:#fff;color:${C.ink}}
.contact-form input:focus,.contact-form textarea:focus{outline:2px solid ${C.blue};outline-offset:1px}
.contact-form button{align-self:flex-start;margin-top:6px}
/* footer */
.ftr{background:${C.ink};color:#fff;margin-top:50px}
.ftr-in{max-width:1180px;margin:0 auto;padding:42px 22px 26px;display:flex;justify-content:space-between;gap:30px;flex-wrap:wrap}
.ftr-cols{display:flex;gap:46px;flex-wrap:wrap}
.ftr-cols h4{font-size:13px;text-transform:uppercase;letter-spacing:.08em;color:${C.inkMuted};margin:0 0 12px}
.ftr-cols span{display:block;font-size:14px;color:#D6DAE6;margin-bottom:8px;cursor:pointer}
.ftr-cols span:hover{color:#fff}
.ftr-base{border-top:1px solid rgba(255,255,255,.08);padding:16px 22px;text-align:center;font-size:12px;color:${C.inkMuted};max-width:1180px;margin:0 auto}

/* booking */
.book-wrap{max-width:680px;margin:0 auto;padding:34px 20px 60px;background:#fff;border-radius:16px;box-shadow:0 1px 3px rgba(0,0,0,0.08);border:1px solid ${C.line}}
.book-head{display:flex;gap:16px;align-items:flex-start;margin-bottom:26px}
.book-emoji{font-size:46px;line-height:1}
.book-h1{font-family:'Anton',sans-serif;font-weight:400;font-size:34px;letter-spacing:.01em;text-transform:uppercase;margin:0}
.steps{display:flex;align-items:center;gap:10px;margin-bottom:28px}
.dot{width:30px;height:30px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:700;flex:0 0 auto}
.dot-line{flex:1;height:2px}
.cal{background:#fff;border:1px solid ${C.line};border-radius:16px;padding:18px}
.cal-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:14px}
.cal-head strong{font-size:18px}
.cal-dow{display:grid;grid-template-columns:repeat(7,1fr);gap:6px;margin-bottom:6px}
.cal-dow span{text-align:center;font-size:12px;color:${C.muted};font-weight:600}
.cal-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:6px}
.cell{aspect-ratio:1;border:1px solid transparent;background:${C.cream};border-radius:10px;cursor:pointer;font-size:14px;font-weight:600;color:${C.ink};transition:all .12s}
.cell:hover:not(:disabled){border-color:${C.coral}}
.cell:disabled{color:#C8CCD6;background:transparent;cursor:default}
.cell.on{background:${C.coral};color:#fff}
.sel-line{margin-top:14px;font-size:15px;color:${C.coral};font-weight:700}
.lbl{display:block;font-size:14px;font-weight:600;margin-bottom:16px}
.venue-pick{margin-bottom:20px}
.venue-card{background:${C.cream};border-radius:14px;padding:16px 18px;margin-top:12px}
.venue-card-name{font-weight:700;font-size:15px;margin:0 0 6px;color:${C.ink}}
.venue-card-line{font-size:13px;color:${C.muted};margin:0 0 4px}
.venue-card-req{font-size:12px;color:${C.muted};margin:8px 0 0;line-height:1.5}

.field{display:block;width:100%;padding:13px 15px;border:1px solid ${C.line};border-radius:11px;font-size:15px;background:#fff;margin-top:6px}
.field:focus{outline:2px solid ${C.blue};outline-offset:1px}
.summary{background:#fff;border:1px solid ${C.line};border-radius:16px;padding:22px}
.row{display:flex;justify-content:space-between;padding:5px 0;font-size:14px}
.row span:first-child{color:${C.muted}}.row span:last-child{font-weight:600}
.row-b{font-size:18px}.row-b span:first-child{color:${C.ink};font-weight:700}.row-b span:last-child{font-family:'Anton',sans-serif;font-weight:400}
.sum-div{border-top:1px solid ${C.line};margin:14px 0}
.owner{margin-top:14px;background:#EAF1FF;border:1px solid ${C.blue};border-radius:12px;padding:14px 18px;font-size:13px;color:#234}
.proto-note{font-size:12px;color:${C.muted};margin-top:14px;text-align:center}
.done{text-align:center;padding:30px 0}
.done-tick{width:64px;height:64px;border-radius:50%;background:${C.coral};color:#fff;font-size:32px;display:flex;align-items:center;justify-content:center;margin:0 auto 16px}
.done h2{font-family:'Anton',sans-serif;font-weight:400;font-size:28px;text-transform:uppercase;margin:0 0 10px}
.done p{color:${C.muted};font-size:15px;line-height:1.55;max-width:430px;margin:0 auto 24px}

a:focus-visible,button:focus-visible,input:focus-visible{outline:2px solid ${C.blue};outline-offset:2px}
@media (max-width:760px){.band{grid-template-columns:1fr}}
@media (prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}}
`;
