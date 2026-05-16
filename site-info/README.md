# HowToUseMyAI — Site Info

## Domain
**howtousemyai.com** (purchased via Namecheap, ~$6.79/yr)

## Accounts Needed
- **GitHub** — source code hosting
- **Vercel** — free hosting + domain connection
- **Namecheap** — domain DNS (point to Vercel)
- **Google Search Console** — SEO tracking (add after deploy)
- **Google Analytics** — traffic tracking

## Tech Stack
- **Framework:** Next.js 15 (App Router) + TypeScript
- **Styling:** Tailwind CSS + custom CSS (globals.css)
- **Fonts:** Inter + Playfair Display (Google Fonts)
- **Logos:** Clearbit API (`https://logo.clearbit.com/{domain}`)
- **Hosting:** Vercel (free tier)
- **No database** — all data is static in code

## Project Location
`/Users/maxim/Desktop/howtousemyai/`

## Key Files
| File | Purpose |
|------|---------|
| `app/page.tsx` | Homepage — search, filters, 93+ tool cards |
| `app/recommend/page.tsx` | Results page after search |
| `app/tools/[slug]/page.tsx` | Individual tool pages (SEO) |
| `app/submit/page.tsx` | Submit a Tool form |
| `app/layout.tsx` | Fonts, metadata |
| `app/globals.css` | Custom CSS classes |
| `app/components/Logo.tsx` | SVG logo component |

## Colors
| Token | Hex | Usage |
|-------|-----|-------|
| Blue | `#1877F2` | Primary, buttons, links |
| Red | `#e41e3f` | Logo, accents, search glow |
| White | `#ffffff` | Background |
| Gray | `#65676b` | Secondary text |

## Running Locally
```bash
cd /Users/maxim/Desktop/howtousemyai
npm run dev
# Opens at http://localhost:3000
```

## Deploy to Vercel
```bash
# One-time setup
npm i -g vercel
vercel login
vercel --prod

# Connect domain in Vercel dashboard:
# Project → Settings → Domains → Add howtousemyai.com
# Then update Namecheap DNS to point to Vercel nameservers
```

## Monetization Plan (Target: $10k–50k/month)

### 1. Affiliate Commissions (primary)
Sign up at each program, replace URLs in `app/page.tsx` and `app/tools/[slug]/page.tsx`:

| Tool | Affiliate Program | Commission |
|------|------------------|------------|
| Jasper | jasper.ai/affiliates | 25% recurring |
| Copy.ai | copy.ai/affiliates | 45% first month |
| Writesonic | writesonic.com/affiliates | 30% recurring |
| Grammarly | grammarly.com/affiliates | $20/sale |
| HeyGen | heygen.com/affiliates | 20% recurring |
| Synthesia | synthesia.io/affiliates | 20% recurring |
| Descript | descript.com/affiliates | 15% recurring |
| Notion AI | notion.so/affiliates | varies |
| Midjourney | (no program yet — check back) | — |

### 2. Featured Listings ($99–499/month per tool)
- Add "Featured" badge to tool cards
- Create `/advertise` page explaining packages
- Contact AI tools via their business email

### 3. Google AdSense
- Apply after reaching ~500 daily visitors
- Place ads: homepage sidebar, tool detail pages

### 4. Newsletter Sponsorships
- Build email list via homepage subscribe form
- Charge $200–500/issue once you hit 1k+ subscribers

## SEO Strategy
- Each `/tools/[slug]` page = 93+ indexed pages
- Target keywords: "best AI for [task]", "how to use [tool]"
- Build "Best AI for X" landing pages (next big priority)
- Submit sitemap to Google Search Console after deploy

## Growth Roadmap
1. Deploy to Vercel ← **next step**
2. Connect howtousemyai.com domain
3. Submit to Google Search Console
4. Sign up for affiliate programs, swap in tracking links
5. Apply for AdSense
6. Expand to 200+ tools
7. Add "Best AI for X" comparison pages
8. Add user ratings / votes
9. Build email list → newsletter sponsorships
10. Outreach to AI tools for featured listings
