import React, { useState, useMemo, useEffect } from "react";import { supabase } from './supabaseClient';

// ════════════════════════════════════════════════════════════════
//  GOLONDON — redesigned for appeal + conversion
//  Direction: "London at dusk" — ink navy, sunset coral, electric
//  blue. Condensed display type, ticket-stub cards, animated hero
//  promise. Tier 1 → booking checkout · Tier 2/3 → affiliate.
// ════════════════════════════════════════════════════════════════

const CATEGORIES = ["All","Adrenaline","Flying","Water","Shooting","Creative","Food & Drink","Wellness","Days Out","Nightlife"];

const ACTIVITIES = [
  { id:1, name:"Rage Buggy Off-Road", cat:"Adrenaline", price:80, tier:1, beginner:true, solo:true, area:"Redhill, Surrey", rating:4.8, blurb:"Throw a roll-caged dirt buggy round a mud track. No licence needed.", emoji:"🏎️", img:"/images/rage-buggy.jpg", url:"/activities/rage-buggy.html" },
  { id:2, name:"Off-Road Karting", cat:"Adrenaline", price:70, tier:1, beginner:true, solo:true, area:"Croydon", rating:4.4, blurb:"Chunky off-road karts, mud and a proper session on track. Beginners welcome.", emoji:"🏁", img:"/images/off-road-karting.jpg", url:"/activities/off-road-karting.html" },
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
    { id:"1_1", name:"Xsite Leisure (Dirt Karts Redhill)", address:"Honeycrock Farm, Axes Lane, Salfords, Surrey RH1 5QL", postcode:"RH1 5QL", phone:"+44 1737 772548", price:80, duration:"Approx. 1 hour", requirements:"Min age 16 to drive. Parental consent needed for under-18s. All equipment included." },
    { id:"1_2", name:"Max Events Dorchester", address:"Off Waddock Drove, Dorchester DT2 7FW", postcode:"DT2 7FW", phone:null, price:80, duration:"Approx. 30 mins for a group of up to 6", requirements:"Min age 17. Equipment included." },
    { id:"1_3", name:"Everyman Racing Elvington", address:"Elvington Track, Elvington, Yorkshire YO41 4AU", postcode:"YO41 4AU", phone:null, price:80, duration:"12 laps", requirements:"Min age 10, height 4ft 10in to 6ft 4in, max weight 20 stone. Under-18s need parental consent. Valid full driving licence required for ages 17+. Clothing covering arms and legs and flat footwear required." },
    { id:"1_4", name:"Everyman Racing Greetham", address:"Everyman Driving Centre, Greetham, Rutland LE15 7RH", postcode:"LE15 7RH", phone:null, price:80, duration:"12 laps", requirements:"Min age 10, height 4ft 10in to 6ft 4in, max weight 20 stone. Under-18s need parental consent. Valid full driving licence required for ages 17+. Clothing covering arms and legs and flat footwear required." },
    { id:"1_5", name:"Dirt Karts Market Harborough", address:"Welford Rd, Sibbertoft, Market Harborough LE16 9UJ", postcode:"LE16 9UJ", phone:null, price:80, duration:"60 mins (about 30 mins driving each) for a group of 4-6", requirements:"Min age 12. All equipment included." },
  ],
  2: [
    { id:"2_1", name:"Hover Force Activity Centre", address:"Brook Furlong, Frodsham, Cheshire WA6 7BT", postcode:"WA6 7BT", phone:"+44 1928 240444", price:70, duration:null, requirements:"Age and height limits apply - we'll confirm them in your booking email." },
    { id:"2_2", name:"Xsite Leisure (Dirt Karts Redhill)", address:"Honeycrock Farm, Axes Lane, Salfords, Surrey RH1 5QL", postcode:"RH1 5QL", phone:"+44 1737 772548", price:70, duration:"Min 20 minutes driving", requirements:"Min age 16, max height 6ft 4in, max weight 18 stone. Parental consent needed for under-18s." },
    { id:"2_3", name:"Rally Karting Centre", address:"Kings Ripton Road, Off Huntingdon Northern Bypass, Kings Ripton, Huntingdon PE28 2NX", postcode:"PE28 2NX", phone:"+44 1480 457263", price:70, duration:"15 or 30 minute session", requirements:"Age 13+. Open weekends only." },
    { id:"2_4", name:"Exeter Karting (Escot Park)", address:"Escot Park, Ottery St Mary EX11 1LU", postcode:"EX11 1LU", phone:"+44 1392 925823", price:70, duration:"2 x 10 minute races (about 60 mins in total)", requirements:"Min age 15. No driving licence needed. Solo drivers only." },
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
  return m!==null ? m : a.price; // always the price actually charged
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
  const [bookingPc,setBookingPc]=useState(null);
  const [userLoc,setUserLoc]=useState(null); // {lat,lng,label} - kept in memory only

  useEffect(()=>{
    document.title = "BucketDays — Things to do across the UK, tonight, this weekend & beyond";
    setMeta("description","Discover and book experiences across the UK in minutes. Filter by beginner-friendly, solo, budget and category — adrenaline, flying, food, spa, days out and more.");
    const ld={ "@context":"https://schema.org","@type":"ItemList","name":"Things to do in the UK",
      "itemListElement":ACTIVITIES.slice(0,10).map((a,i)=>({"@type":"ListItem","position":i+1,
        "item":{"@type":"Product","name":a.name,"category":a.cat,
          "offers":{"@type":"Offer","price":displayPrice(a),"priceCurrency":"GBP"}}}))};
    let s=document.getElementById("ld"); if(!s){s=document.createElement("script");s.id="ld";s.type="application/ld+json";document.head.appendChild(s);}
    s.textContent=JSON.stringify(ld);
  },[]);

  function startBooking(a, pc){
    const postcode = typeof pc==="string" ? pc : null;
    setBookingActivity(a); setBookingPc(postcode); setView("book"); window.scrollTo(0,0);
    // add a browser-history entry so the Back button returns to the previous page
    try{ window.history.pushState({view:"book",id:a.id,pc:postcode},"","?book="+a.id+(postcode?"&pc="+encodeURIComponent(postcode):"")); }catch(e){}
  }
  function goBack(){
    if(window.history.state && window.history.state.view==="book"){ window.history.back(); }
    else { setView("browse"); try{ window.history.replaceState(null,"",window.location.pathname); }catch(e){} window.scrollTo(0,0); }
  }
  useEffect(()=>{
    // opening a ?book=ID link (e.g. from a guide page or back from Stripe)
    const params = new URLSearchParams(window.location.search);
    const bookId = params.get('book');
    if(bookId){
      const match = ACTIVITIES.find(a => a.id === Number(bookId));
      if(match){
        const pc0 = params.get('pc');
        setBookingActivity(match); setBookingPc(pc0||null); setView("book");
        try{ window.history.replaceState({view:"book",id:match.id,pc:pc0||null},"","?book="+match.id+(pc0?"&pc="+encodeURIComponent(pc0):"")); }catch(e){}
      }
    }
    // browser Back / Forward buttons
    function onPop(){
      const sp = new URLSearchParams(window.location.search);
      const id = sp.get('book');
      const m = id ? ACTIVITIES.find(a => a.id === Number(id)) : null;
      if(m){ setBookingActivity(m); setBookingPc(sp.get('pc')||null); setView("book"); } else { setView("browse"); }
      window.scrollTo(0,0);
    }
    window.addEventListener("popstate", onPop);
    return ()=>window.removeEventListener("popstate", onPop);
  },[]);

  return (
    <div style={{ background:C.paper, minHeight:"100vh", color:C.ink, fontFamily:"'Inter', system-ui, sans-serif" }}>
      <style>{CSS}</style>
      <Header onHome={()=>{ setView("browse"); window.scrollTo({top:0, behavior:"smooth"}); if(window.location.search){ history.pushState(null, document.title, window.location.pathname); } }} />
      {view==="browse" ? <Browse onBook={startBooking} userLoc={userLoc} setUserLoc={setUserLoc}/> : <Booking key={(bookingActivity&&bookingActivity.id)+"-"+(bookingPc||"")} activity={bookingActivity} initialPostcode={bookingPc} userLoc={userLoc} onSwitch={startBooking} onBack={goBack} />}
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
          <a href="#areas" onClick={()=>setMenuOpen(false)}>Plan a day</a>
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
function Browse({onBook,userLoc,setUserLoc}){
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
    <p className="eyebrow">Across the UK · 21 experiences</p>
    <h1 className="hero-h1">
      Something to do<br/>in the UK,{" "}
      <span className="rot-wrap"><span key={word} className="rot">{ROTATING[word]}</span></span>
    </h1>
    <p className="hero-sub">Skip the fifteen phone calls. See everything you can do in one area, combine activities, and book your whole day in minutes.</p>
    <div className="hero-cta">
      <a href="#areas" className="btn btn-coral">Plan a day in your area</a>
      <a href="#grid" className="btn btn-out-light">Browse all experiences</a>
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

      <AreaPlanner onBook={onBook} userLoc={userLoc} setUserLoc={setUserLoc}/>

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
                  <p className="ticket-area">📍 {VENUES[a.id] ? `${VENUES[a.id].length} locations across the UK` : a.area}</p>
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

// Sort UK postcodes: area letters (A-Z), then district number, then district letter, then the rest
function pcKey(pc){
  const m=/^([A-Z]{1,2})(\d{1,2})([A-Z]?)\s*(\d)([A-Z]{2})$/i.exec((pc||"").trim());
  return m ? {a:m[1].toUpperCase(), n:+m[2], l:m[3].toUpperCase(), r:(m[4]+m[5]).toUpperCase()} : {a:(pc||"").toUpperCase(), n:0, l:"", r:""};
}
function comparePostcodes(x,y){
  const p=pcKey(x.postcode), q=pcKey(y.postcode);
  return p.a.localeCompare(q.a) || p.n-q.n || p.l.localeCompare(q.l) || p.r.localeCompare(q.r);
}


// ── Distance: how far venues are from the customer ────────
// Venue coordinates are looked up once (free postcodes.io service) and cached in the
// visitor's browser. The customer's own location never leaves their device.
const COORDS = {};
const normPc = (pc)=> (pc||"").toUpperCase().replace(/\s+/g," ").trim();
try{ Object.assign(COORDS, JSON.parse(window.localStorage.getItem("bd_coords_v1")||"{}")); }catch(e){}
const ALL_VENUE_PCS = Array.from(new Set(Object.keys(VENUES).flatMap(k=>(VENUES[k]||[]).map(v=>normPc(v.postcode)))));
async function fetchCoords(list){
  const need = Array.from(new Set(list.map(normPc))).filter(pc=>pc && !COORDS[pc]);
  for(let i=0;i<need.length;i+=100){
    const chunk = need.slice(i,i+100);
    const r = await fetch("https://api.postcodes.io/postcodes?filter=postcode,latitude,longitude",{
      method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({postcodes:chunk})
    });
    const j = await r.json();
    (j.result||[]).forEach(x=>{ if(x && x.result && x.result.latitude!=null){ COORDS[normPc(x.query)] = {lat:x.result.latitude, lng:x.result.longitude}; } });
  }
  try{ window.localStorage.setItem("bd_coords_v1", JSON.stringify(COORDS)); }catch(e){}
}
function useCoords(list){
  const [,force]=useState(0);
  const key = list.join("|");
  useEffect(()=>{
    if(!list.length) return;
    let on=true;
    fetchCoords(list).then(()=>{ if(on) force(n=>n+1); }).catch(()=>{});
    return ()=>{ on=false; };
  },[key]);
}
function miles(a,b){
  const R=3958.8, rad=Math.PI/180;
  const dLat=(b.lat-a.lat)*rad, dLng=(b.lng-a.lng)*rad;
  const h=Math.sin(dLat/2)**2 + Math.cos(a.lat*rad)*Math.cos(b.lat*rad)*Math.sin(dLng/2)**2;
  return 2*R*Math.asin(Math.sqrt(h));
}
const fmtMi = (m)=> m<1 ? "under 1 mile" : (Math.round(m)+" mi");
// every activity, with the venues closest to a point, nearest first
function activitiesNear(point, excludeId){
  const out=[];
  Object.keys(VENUES).forEach(aid=>{
    if(Number(aid)===excludeId) return;
    const a=ACTIVITIES.find(x=>x.id===Number(aid)); if(!a) return;
    const seen={}, opts=[];
    (VENUES[aid]||[]).forEach(v=>{
      const pc=normPc(v.postcode); if(seen[pc]) return; seen[pc]=1;
      const c=COORDS[pc]; if(!c) return;
      opts.push({pc:v.postcode, mi:miles(point,c)});
    });
    opts.sort((x,y)=>x.mi-y.mi);
    if(opts.length) out.push({a,opts});
  });
  return out.sort((x,y)=>x.opts[0].mi-y.opts[0].mi);
}

// ── Areas: which activities share a postcode area ─────────
const LONDON_AREAS = ["E","EC","N","NW","SE","SW","W","WC","HA","EN"];
const AREA_LABELS = {
  LONDON:"All of London", W:"West End & West London", WC:"Covent Garden & Holborn", EC:"The City", SW:"South West London",
  SE:"South East London", E:"East London", N:"North London", NW:"North West London", HA:"Harrow & Wembley",
  SO:"Southampton & Winchester", RG:"Reading & Basingstoke", CV:"Warwickshire", ST:"Staffordshire", RH:"Redhill, Surrey",
  YO:"York & East Yorkshire", PE:"Peterborough & Cambridgeshire", NG:"Nottingham", WD:"Elstree & Borehamwood",
  LS:"Leeds", S:"Sheffield & Chesterfield"
};
function areaOf(pc){ const m=/^([A-Z]{1,2})\d/i.exec((pc||"").trim()); return m?m[1].toUpperCase():""; }
function buildAreas(){
  const groups={};
  const add=(code,aid,v)=>{ groups[code]=groups[code]||{}; (groups[code][aid]=groups[code][aid]||[]).push(v); };
  Object.keys(VENUES).forEach(aid=>{
    (VENUES[aid]||[]).forEach(v=>{
      const ar=areaOf(v.postcode); if(!ar) return;
      add(ar,aid,v);
      if(LONDON_AREAS.includes(ar)) add("LONDON",aid,v);
    });
  });
  const out=Object.keys(groups).map(code=>{
    const items=Object.keys(groups[code]).map(aid=>{
      const a=ACTIVITIES.find(x=>x.id===Number(aid)); if(!a) return null;
      const seen={}; const vs=groups[code][aid].filter(v=>seen[v.postcode]?false:(seen[v.postcode]=true)).sort(comparePostcodes);
      return {a, pcs:vs.map(v=>v.postcode)};
    }).filter(Boolean).sort((x,y)=>x.a.name.localeCompare(y.a.name));
    return {code, label:AREA_LABELS[code]||code, items};
  }).filter(g=>g.items.length>=2);
  out.sort((x,y)=> (x.code==="LONDON"?-1:0)-(y.code==="LONDON"?-1:0) || y.items.length-x.items.length || x.label.localeCompare(y.label));
  return out;
}
const AREAS = buildAreas();
function areaForPostcode(pc){
  const ar=areaOf(pc);
  return AREAS.find(g=>g.code===ar) || (LONDON_AREAS.includes(ar) ? AREAS.find(g=>g.code==="LONDON") : null) || null;
}


// One activity card: clean by default. Choosing it asks where to book.
function ActivityCard({a,options,onBook,lead}){
  const [open,setOpen]=useState(false);
  const single = options.length===1;
  const label = (o)=> `📍 ${o.pc}${o.mi!=null ? " · "+fmtMi(o.mi) : ""}`;
  return (
    <div className="area-card">
      <div className="area-card-top">
        <span className="area-card-emoji">{a.emoji}</span>
        <div>
          <p className="area-card-name">{a.name}</p>
          <p className="area-card-price">£{displayPrice(a)} per person</p>
        </div>
      </div>
      {lead && <p className="area-card-lead">{lead}</p>}
      {single ? (
        <button className="btn btn-coral sm area-card-btn" onClick={()=>onBook(a, options[0].pc)}>Book · {label(options[0])}</button>
      ) : (
        <button className="btn btn-coral sm area-card-btn" onClick={()=>setOpen(o=>!o)} aria-expanded={open}>
          {open ? "Hide locations" : `Choose where to book (${options.length})`}
        </button>
      )}
      {!single && open && (
        <div className="area-card-pcs">
          <p className="area-card-lbl">Where would you like to go?</p>
          {options.map(o=>(
            <button key={o.pc} className="pc-pill" onClick={()=>onBook(a, o.pc)}>{label(o)}</button>
          ))}
        </div>
      )}
    </div>
  );
}

function AreaPlanner({onBook,userLoc,setUserLoc}){
  const [code,setCode]=useState(AREAS[0].code);
  const [pcText,setPcText]=useState("");
  const [note,setNote]=useState("");
  const [busy,setBusy]=useState(false);
  const [radius,setRadius]=useState(50);
  const area = AREAS.find(g=>g.code===code) || AREAS[0];
  useCoords(userLoc ? ALL_VENUE_PCS : []);

  async function find(e){
    e.preventDefault();
    const t=normPc(pcText);
    if(!areaOf(t)){ setNote("Enter a UK postcode, for example W1T 6BA."); return; }
    setBusy(true); setNote("");
    try{
      await fetchCoords([t]);
      const c=COORDS[t];
      if(!c){ setNote("We couldn't find that postcode. Check it and try again."); }
      else {
        setUserLoc({lat:c.lat,lng:c.lng,label:t});
        const g=areaForPostcode(t); if(g) setCode(g.code);
      }
    }catch(err){ setNote("We couldn't look up that postcode right now. You can still browse by area below."); }
    setBusy(false);
  }
  function useMyLocation(){
    if(!navigator.geolocation){ setNote("Your browser can't share its location. Enter a postcode instead."); return; }
    setBusy(true); setNote("");
    navigator.geolocation.getCurrentPosition(
      pos=>{ setUserLoc({lat:pos.coords.latitude,lng:pos.coords.longitude,label:"your location"}); setBusy(false); },
      ()=>{ setNote("We couldn't get your location. Enter a postcode instead."); setBusy(false); },
      {timeout:10000}
    );
  }

  const near = userLoc ? activitiesNear(userLoc) : [];
  const shown = near.filter(n=> radius===0 || n.opts[0].mi<=radius);
  const loadingNear = userLoc && near.length===0;

  return (
    <section id="areas" className="areas" aria-labelledby="areas-h2">
      <div className="areas-in">
        <p className="eyebrow">Make a day of it</p>
        <h2 id="areas-h2" className="areas-h2">See what's closest to you. Combine activities nearby.</h2>
        <p className="areas-sub">Tell us where you are and we'll show the activities nearest to you, so you can fit more into one day.</p>
        <form className="areas-find" onSubmit={find}>
          <input className="field areas-input" value={pcText} onChange={e=>setPcText(e.target.value)} placeholder="Enter your postcode, e.g. W6 0QU" aria-label="Your postcode" />
          <button type="submit" className="btn btn-coral" disabled={busy}>{busy?"Finding…":"Show nearest"}</button>
          <button type="button" className="btn btn-out" onClick={useMyLocation} disabled={busy}>📍 Use my location</button>
        </form>
        {note && <p className="areas-note">{note}</p>}

        {userLoc && (
          <div className="near">
            <div className="near-head">
              <p className="near-title"><strong>Closest to {userLoc.label}</strong></p>
              <label className="near-radius">Within{" "}
                <select className="field near-select" value={radius} onChange={e=>setRadius(+e.target.value)}>
                  <option value={10}>10 miles</option>
                  <option value={25}>25 miles</option>
                  <option value={50}>50 miles</option>
                  <option value={100}>100 miles</option>
                  <option value={0}>Any distance</option>
                </select>
              </label>
              <button className="btn btn-ghost sm" onClick={()=>{setUserLoc(null);setPcText("");}}>Clear</button>
            </div>
            {loadingNear ? <p className="areas-count">Finding the closest venues…</p> : shown.length===0 ? (
              <p className="areas-count">Nothing within {radius} miles yet. Try a wider distance.</p>
            ) : (
              <div className="areas-grid">
                {shown.map(n=>(
                  <ActivityCard key={n.a.id} a={n.a} options={n.opts} onBook={onBook}
                    lead={`Nearest: ${fmtMi(n.opts[0].mi)} from ${userLoc.label}`} />
                ))}
              </div>
            )}
            <p className="areas-foot">Distances are in a straight line, so the drive will be longer. Each activity is booked separately.</p>
          </div>
        )}

        <h3 className="areas-h3">{userLoc ? "Or browse by postcode area" : "Browse by postcode area"}</h3>
        <div className="areas-chips" role="group" aria-label="Areas">
          {AREAS.map(g=>(
            <button key={g.code} className={`chip ${g.code===area.code?"on":""}`} onClick={()=>{setCode(g.code);setNote("");}}>
              {g.label}{g.code!=="LONDON" && <span className="areas-code"> ({g.code})</span>} · {g.items.length}
            </button>
          ))}
        </div>
        <p className="areas-count"><strong>{area.items.length} activities</strong> in {area.label}</p>
        <div className="areas-grid">
          {area.items.map(it=>{
            // nearest first when we know where the customer is, otherwise by postcode
            const opts = it.pcs.map(pc=>({pc, mi:(userLoc && COORDS[normPc(pc)]) ? miles(userLoc, COORDS[normPc(pc)]) : null}));
            if(userLoc) opts.sort((x,y)=>(x.mi==null?1e9:x.mi)-(y.mi==null?1e9:y.mi));
            return <ActivityCard key={it.a.id} a={it.a} options={opts} onBook={onBook}
              lead={opts.length>1 ? `${opts.length} locations in this area` : null} />;
          })}
        </div>
        <p className="areas-foot">Postcode areas can cover a fair distance, so check the travel time between venues.</p>
      </div>
    </section>
  );
}

function Booking({activity,onBack,initialPostcode,onSwitch,userLoc}){
  const venueList = VENUES[activity.id] || null;
  const [step,setStep]=useState(1);
  const [venue,setVenue]=useState(()=> (initialPostcode && venueList) ? (venueList.find(v=>v.postcode===initialPostcode)||null) : null);
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
  useCoords((userLoc||venue) ? ALL_VENUE_PCS : []);
  const uniqueVenues = venueList ? venueList.filter((v,i,arr)=>arr.findIndex(x=>x.postcode===v.postcode)===i) : [];
  const distFromUser = (v)=> (userLoc && COORDS[normPc(v.postcode)]) ? miles(userLoc, COORDS[normPc(v.postcode)]) : null;
  const sortedVenues = userLoc
    ? uniqueVenues.slice().sort((x,y)=>{ const a=distFromUser(x), b=distFromUser(y); return (a==null?1e9:a)-(b==null?1e9:b) || comparePostcodes(x,y); })
    : uniqueVenues.slice().sort(comparePostcodes);
  // other activities close to the chosen venue (real distance when we have it, postcode area otherwise)
  const venueCoord = venue ? COORDS[normPc(venue.postcode)] : null;
  let nearbyItems = [], nearbyTitle = "";
  if(venue && venueCoord){
    nearbyItems = activitiesNear(venueCoord, activity.id).filter(n=>n.opts[0].mi<=20)
      .map(n=>({a:n.a, pc:n.opts[0].pc, meta:`${fmtMi(n.opts[0].mi)} away · ${n.opts[0].pc}`}));
    nearbyTitle = "Make a day of it near "+venue.postcode;
  } else if(venue){
    const g = areaForPostcode(venue.postcode);
    if(g){ nearbyItems = g.items.filter(it=>it.a.id!==activity.id).map(it=>({a:it.a, pc:it.pcs[0], meta:it.pcs[0]})); nearbyTitle = "Make a day of it in "+g.label; }
  }
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
          activityName: venue ? `${activity.name} (${venue.postcode})` : activity.name,
          slotId: selSlot.id,
          quantity: form.people,
          image: activity.img,
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
          {(venue || !needsVenue) && <p style={{color:C.muted,margin:"4px 0 0"}}>📍 {venue ? venue.postcode : activity.area}</p>}
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
                  {sortedVenues.map(v=>{
                    const d=distFromUser(v);
                    return <option key={v.id} value={v.id}>{v.postcode}{d!=null?` · ${fmtMi(d)} from you`:""}</option>;
                  })}
                </select>
              </label>
              {venue && (
                <div className="venue-card">
                  <p className="venue-card-name">📍 {venue.postcode}</p>
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
          {nearbyItems.length>0 && (
            <div className="nearby">
              <p className="nearby-h">{nearbyTitle}</p>
              <p className="nearby-sub">Other activities you can book close by:</p>
              <div className="nearby-list">
                {nearbyItems.map(it=>(
                  <button key={it.a.id} className="nearby-item" onClick={()=>onSwitch&&onSwitch(it.a, it.pc)}>
                    <span>{it.a.emoji} {it.a.name}</span>
                    <span className="nearby-meta">£{displayPrice(it.a)} · {it.meta}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
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
            {venue && <Row l="Location" v={venue.postcode}/>}
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

.btn-out-light{background:transparent;color:#fff;border:1.5px solid rgba(255,255,255,.55)}
.btn-out-light:hover{background:rgba(255,255,255,.12)}
.hero-cta a{text-decoration:none;display:inline-block}

/* plan a day by area */
.areas{background:${C.cream};padding:56px 22px}
.areas-in{max-width:1180px;margin:0 auto}
.areas-h2{font-family:'Anton',sans-serif;font-weight:400;font-size:clamp(28px,4vw,40px);text-transform:uppercase;margin:0 0 10px;color:${C.ink}}
.areas-sub{color:${C.muted};max-width:620px;margin:0 0 20px;line-height:1.55}
.areas-find{display:flex;gap:10px;flex-wrap:wrap;margin-bottom:12px}
.areas-input{max-width:320px;flex:1 1 220px}
.areas-note{color:${C.coral};font-size:14px;margin:0 0 12px}
.areas-chips{display:flex;gap:9px;flex-wrap:wrap;margin:14px 0 18px}
.areas-code{opacity:.65;font-weight:500}
.areas-count{margin:0 0 14px;color:${C.ink}}
.areas-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:14px}
.area-card{background:#fff;border:1px solid ${C.line};border-radius:16px;padding:16px 18px}
.area-card-top{display:flex;gap:12px;align-items:center;margin-bottom:12px}
.area-card-emoji{font-size:30px}
.area-card-name{font-weight:700;margin:0 0 2px;color:${C.ink}}
.area-card-price{margin:0;font-size:14px;color:${C.muted}}
.area-card-lbl{font-size:12px;color:${C.muted};margin:0 0 6px;text-transform:uppercase;letter-spacing:.08em}
.area-card-pcs{display:flex;gap:8px;flex-wrap:wrap}
.pc-pill{cursor:pointer;border:1.5px solid ${C.ink};background:#fff;color:${C.ink};border-radius:999px;padding:7px 13px;font-size:13px;font-weight:700;font-family:inherit;transition:all .15s}
.pc-pill:hover{background:${C.coral};border-color:${C.coral};color:#fff}
.area-card-lead{font-size:13px;color:${C.muted};margin:0 0 10px}
.area-card-btn{width:100%}
.area-card-pcs{margin-top:12px}
.areas-h3{font-size:16px;margin:28px 0 0;color:${C.ink}}
.near{background:#fff;border:1px solid ${C.line};border-radius:18px;padding:18px 20px;margin:6px 0 4px}
.near-head{display:flex;gap:14px;align-items:center;flex-wrap:wrap;margin-bottom:14px}
.near-title{margin:0;font-size:17px;color:${C.ink};flex:1 1 200px}
.near-radius{font-size:14px;color:${C.muted};display:flex;align-items:center;gap:8px}
.near-select{width:auto;padding:8px 10px}
.areas-foot{font-size:13px;color:${C.muted};margin:16px 0 0;max-width:680px}
.nearby{margin-top:26px;background:${C.cream};border-radius:14px;padding:16px 18px}
.nearby-h{font-weight:700;margin:0 0 2px;color:${C.ink}}
.nearby-sub{font-size:13px;color:${C.muted};margin:0 0 10px}
.nearby-list{display:flex;flex-direction:column;gap:8px}
.nearby-item{cursor:pointer;display:flex;justify-content:space-between;gap:10px;align-items:center;text-align:left;background:#fff;border:1px solid ${C.line};border-radius:10px;padding:11px 14px;font-size:14px;font-weight:600;color:${C.ink};font-family:inherit}
.nearby-item:hover{border-color:${C.coral}}
.nearby-meta{font-weight:500;color:${C.muted};font-size:13px;white-space:nowrap}
@media (prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}}
`;
