import React, { useState, useMemo, useEffect } from "react";

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
const MARKUP_PCT = 15;

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

  return (
    <div style={{ background:C.paper, minHeight:"100vh", color:C.ink, fontFamily:"'Inter', system-ui, sans-serif" }}>
      <style>{CSS}</style>
      <Header onHome={()=>setView("browse")} />
      {view==="browse" ? <Browse onBook={startBooking}/> : <Booking activity={bookingActivity} onBack={()=>setView("browse")} />}
      <Footer/>
    </div>
  );
}

function setMeta(n,c){ let m=document.querySelector(`meta[name="${n}"]`); if(!m){m=document.createElement("meta");m.name=n;document.head.appendChild(m);} m.content=c; }

// ── Header ───────────────────────────────────────────────
function Header({onHome}){
  return (
    <header className="hdr">
      <nav className="hdr-in" aria-label="Primary">
        <button className="logo" onClick={onHome}>
          <img src="/logo-white.png" alt="BucketDays — Find it. Book it. Go." style={{height:"42px",width:"auto",display:"block"}} />
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
      {/* HERO */}
<section className="hero">
  <div className="hero-glow" aria-hidden="true" />
  <div className="hero-grid">
    <div className="hero-in">
      <p className="eyebrow">Across the UK · 22 experiences</p>
      <h1 className="hero-h1">
        Something to do<br/>in the UK,{" "}
        <span className="rot-wrap"><span key={word} className="rot">{ROTATING[word]}</span></span>
      </h1>
      <p className="hero-sub">Skip the fifteen phone calls. Filter by beginner-friendly, solo, budget and vibe — then book in minutes.</p>
      <div className="hero-cta">
        <a href="#grid" className="btn btn-coral">Browse experiences</a>
        <span className="hero-trust">★ 4.7 average · no booking fees</span>
      </div>
    </div>
    <div className="hero-image-wrap">
      <img
        src="/images/hero.jpg"
        alt="Collage of BucketDays experiences: skydiving, off-roading, axe throwing, karaoke and comedy nights"
        className="hero-image"
      />
    </div>
  </div>
  {/* featured ticket strip */}
  <div className="strip" aria-label="Featured">
    {featured.map(a=>(
      <button key={a.id} className="strip-card" onClick={()=>a.tier===1?onBook(a):window.open(a.url,"_blank")}>
        <span className="strip-emoji">{a.emoji}</span>
        <span className="strip-name">{a.name}</span>
        <span className="strip-price">from £{a.price}</span>
      </button>
    ))}
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
                  <p className="ticket-area">📍 {a.area} · <span className="star">★ {a.rating}</span></p>
                  <p className="ticket-blurb">{a.blurb}</p>
                  <div className="ticket-tags">
                    {a.beginner && <em>Beginner</em>}
                    {a.solo && <em>Solo OK</em>}
                  </div>
                </div>
                <div className="ticket-foot">
                  <span className="ticket-price"><small>from</small> £{Math.round(a.price*(1+MARKUP_PCT/100))}</span>
                  {a.tier===1
                    ? <a className="btn btn-coral sm" href={a.url}>Book now</a>
                    : <a className="btn btn-out sm" href={a.url} target="_blank" rel="noopener noreferrer">Check dates</a>}
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
  const [step,setStep]=useState(1);
  const [vY,setVY]=useState(2026);
  const [vM,setVM]=useState(5);
  const [sel,setSel]=useState(null);
  const [form,setForm]=useState({name:"",email:"",people:1});

  const price=Math.round(activity.price*(1+MARKUP_PCT/100));
  const margin=price-activity.price;
  const total=price*form.people;

  const first=new Date(vY,vM,1); let sd=first.getDay()-1; if(sd<0)sd=6;
  const dim=new Date(vY,vM+1,0).getDate();
  const today=new Date(); today.setHours(0,0,0,0);
  const cells=[]; for(let i=0;i<sd;i++)cells.push(null); for(let d=1;d<=dim;d++)cells.push(d);
  const shift=d=>{let m=vM+d,y=vY; if(m<0){m=11;y--} if(m>11){m=0;y++} setVM(m);setVY(y);};
  const fmt=d=> d?`${DOW[(d.getDay()+6)%7]} ${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`:"";

  return (
    <main className="book-wrap">
      <button className="btn btn-ghost sm" onClick={onBack} style={{marginBottom:22}}>← All activities</button>
      <div className="book-head">
        <span className="book-emoji">{activity.emoji}</span>
        <div>
          <p className="eyebrow" style={{margin:"0 0 4px"}}>Book · {activity.cat}</p>
          <h1 className="book-h1">{activity.name}</h1>
          <p style={{color:C.muted,margin:"4px 0 0"}}>📍 {activity.area} · <span style={{color:C.gold}}>★ {activity.rating}</span></p>
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
                const on=sel&&date&&date.getTime()===sel.getTime();
                return <button key={i} className={`cell ${on?"on":""}`} disabled={!d||past} onClick={()=>date&&!past&&setSel(date)}>{d||""}</button>;
              })}
            </div>
          </div>
          {sel && <p className="sel-line">Selected: {fmt(sel)}</p>}
          <button className="btn btn-coral full" disabled={!sel} onClick={()=>setStep(2)} style={{marginTop:22}}>Continue</button>
        </div>
      )}

      {step===2 && (
        <div>
          <label className="lbl">Full name<input className="field" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Jane Smith"/></label>
          <label className="lbl">Email<input className="field" type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="jane@email.com"/></label>
          <label className="lbl">Number of people<input className="field" type="number" min="1" max="10" value={form.people} onChange={e=>setForm({...form,people:Math.max(1,+e.target.value||1)})}/></label>
          <div style={{display:"flex",gap:10,marginTop:22}}>
            <button className="btn btn-ghost" onClick={()=>setStep(1)}>Back</button>
            <button className="btn btn-coral" style={{flex:1}} disabled={!form.name||!form.email} onClick={()=>setStep(3)}>Review &amp; pay</button>
          </div>
        </div>
      )}

      {step===3 && (
        <div>
          <div className="summary">
            <Row l="Activity" v={activity.name}/><Row l="Date" v={fmt(sel)}/><Row l="Name" v={form.name}/><Row l="People" v={String(form.people)}/>
            <div className="sum-div"/>
            <Row l="Price per person" v={`£${price}`}/><Row l="Total" v={`£${total}`} bold/>
          </div>
          <div className="owner">Owner view (remove before launch): provider £{activity.price} · {MARKUP_PCT}% = <strong>£{margin}/person</strong> · £{margin*form.people} margin here.</div>
          <button className="btn btn-coral full" style={{marginTop:18}} onClick={()=>setStep(4)}>Pay £{total} →</button>
          <button className="btn btn-ghost full" style={{marginTop:10}} onClick={()=>setStep(2)}>Back</button>
          <p className="proto-note">Prototype — no real payment taken. Add Stripe + backend to go live.</p>
        </div>
      )}

      {step===4 && (
        <div className="done">
          <div className="done-tick">✓</div>
          <h2>You're booked in</h2>
          <p>In production {form.name||"the customer"} gets a confirmation email and you get an alert to arrange <strong>{activity.name}</strong> on <strong>{fmt(sel)}</strong> with the provider.</p>
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

/* featured strip */
.strip{position:relative;max-width:1180px;margin:0 auto;padding:0 22px 30px;display:flex;gap:12px;overflow-x:auto;scrollbar-width:none}
.strip::-webkit-scrollbar{display:none}
.strip-card{flex:0 0 auto;display:flex;flex-direction:column;align-items:flex-start;gap:3px;min-width:170px;
  background:${C.ink2};border:1px solid rgba(255,255,255,.1);border-radius:14px;padding:14px 16px;cursor:pointer;text-align:left;transition:border-color .15s,transform .15s}
.strip-card:hover{border-color:${C.coral};transform:translateY(-2px)}
.strip-emoji{font-size:22px}
.strip-name{color:#fff;font-weight:600;font-size:14px}
.strip-price{color:${C.gold};font-size:13px;font-weight:600}

/* wrap */
.wrap{max-width:1180px;margin:0 auto;padding:32px 22px 50px}
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

/* footer */
.ftr{background:${C.ink};color:#fff;margin-top:50px}
.ftr-in{max-width:1180px;margin:0 auto;padding:42px 22px 26px;display:flex;justify-content:space-between;gap:30px;flex-wrap:wrap}
.ftr-cols{display:flex;gap:46px;flex-wrap:wrap}
.ftr-cols h4{font-size:13px;text-transform:uppercase;letter-spacing:.08em;color:${C.inkMuted};margin:0 0 12px}
.ftr-cols span{display:block;font-size:14px;color:#D6DAE6;margin-bottom:8px;cursor:pointer}
.ftr-cols span:hover{color:#fff}
.ftr-base{border-top:1px solid rgba(255,255,255,.08);padding:16px 22px;text-align:center;font-size:12px;color:${C.inkMuted};max-width:1180px;margin:0 auto}

/* booking */
.book-wrap{max-width:680px;margin:0 auto;padding:34px 20px 60px}
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
