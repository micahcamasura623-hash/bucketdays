# BucketDays — Go Live Guide (Low Cost)

This folder is a complete, ready-to-deploy website. It already builds successfully. Follow these steps to get it online. Total cost: **~£10/year for a domain** (hosting is free).

---

## What you need first (all free to sign up)

- A **GitHub** account — github.com
- A **Vercel** account — vercel.com (sign up with your GitHub — one click)
- **Node.js** installed on your computer — nodejs.org (download the "LTS" version)
- A code editor — **VS Code** (code.visualstudio.com) is free and easiest

---

## Option A — The easiest route (no command line)

**1. Put the code on GitHub**
- Create a new repository on GitHub called `bucketdays`
- Upload this entire folder's contents to it (GitHub lets you drag-and-drop files in the browser: "Add file" → "Upload files")

**2. Connect Vercel**
- Go to vercel.com → "Add New" → "Project"
- Pick your `bucketdays` repository
- Vercel auto-detects it's a Vite project — just click **Deploy**
- Wait ~1 minute. You'll get a live URL like `bucketdays.vercel.app`

**That's it — you're live, for free.**

---

## Option B — Test it on your own computer first (recommended)

Open a terminal in this folder and run:

```bash
npm install      # installs the tools (one time)
npm run dev      # starts a local preview
```

Open the link it shows (usually http://localhost:5173) to see your site running locally. Edit `src/App.jsx`, save, and the browser updates instantly. When happy, follow Option A to deploy.

To check the production build:
```bash
npm run build    # creates the optimised /dist folder
npm run preview  # preview that build
```

---

## Adding your own domain (~£10/year)

1. Buy a domain from **Namecheap**, **Cloudflare**, or **GoDaddy** (e.g. `bucketdays.co.uk` — check availability, the name may need tweaking).
2. In Vercel: your project → **Settings → Domains → Add** → type your domain.
3. Vercel shows you the DNS records to set. Copy them into your domain registrar's DNS settings.
4. Wait 10–60 minutes. HTTPS is automatic and free.

---

## What to change before/after launch

- **Remove the "Owner view" margin panel** — in `src/App.jsx`, search for `owner` / "Owner view" and delete that block. It's only there so you can see your margin; customers must not.
- **Swap affiliate links** — search `url:` in the activity list. Replace the placeholder URLs (`https://www.getyourguide.com` etc.) with YOUR affiliate tracking links once you've joined the programmes (Awin, etc.).
- **Update the domain** in `index.html` — replace `bucketdays.example` with your real domain in the canonical + Open Graph tags.
- **Make an OG image** — a 1200×630px branded image saved as `public/og-image.png`, so shared links look good. Any design tool (even Canva) works.

---

## Important limitation to know

This version is the **front-end only**. The "Book now" checkout is a working *demo* — it does not yet take real money or send emails. To turn that on you'll later need:
- **Stripe** for payments (stripe.com — no upfront cost, ~1.5% + 20p per sale)
- A small backend or a no-code tool (Make/Zapier + Stripe Payment Links) to handle the order + confirmation email

Until then, the smart launch is **affiliate-only**: the "Check dates" links earn you commission with zero setup. Get the site live, get it indexed by Google, see what people click — then add payments to the winners. This matches the low-cost, validate-first plan.

---

## Recap of costs

| Item | Cost |
|---|---|
| Hosting (Vercel free tier) | £0 |
| GitHub | £0 |
| Domain | ~£10/year |
| Affiliate accounts | £0 |
| Payments (Stripe, later) | per-sale only |
| **To launch** | **~£10** |

---

*Files: `index.html`, `vite.config.js`, `package.json`, `src/App.jsx` (the BucketDays site), `src/main.jsx`, `public/favicon.svg`. Pair this with `nextjs-migration-seo-plan.md` when you're ready to scale up to per-page SEO.*
