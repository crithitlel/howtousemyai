# HowToUseMyAI — Build Rules

## Deployment
- NEVER run `vercel --prod` without explicit user confirmation ("deploy" or "yes deploy")
- Local dev runs at http://localhost:3000
- After EVERY change, automatically include http://localhost:3000 so the user can preview without asking

## Design — Minimalist (like Google)
- Hero: one H1 headline + one-line subline above the search bar (added June 2026 for SEO/clarity). Nothing else above it
- No arrows (→) on buttons or action links. Back-nav (← Back) is fine
- No em dashes in copy — they look AI-generated
- No "how it works" sections, no generic taglines
- Footer links: Home, About, Comparisons, Submit a Tool (blue), Disclosure, Privacy, Terms
- Cards: clean, no category badge, simple "Visit tool" text link at bottom
- Playfair Display headings: regular style, never italic

## Tools Array
- Before adding any tool, grep for its name to check for duplicates
- Total tool count must be divisible by 4 for desktop grid symmetry (4-col layout)
- New This Week and Editor's Picks sections must each have exactly 6 tools (3×2 grid)
- Logos use Google Favicon API: `https://www.google.com/s2/favicons?domain=${domain}&sz=64`

## Colors
- Primary blue: #1877F2 — buttons, active states, links (including "Submit a Tool"), search glow on focus
- Red: #e41e3f — accent badges only (HOT/NEW/Top Pick), never links or buttons
- Search bar glows blue (#1877F2) on focus, not red

## Symmetry Rules — Check Before Every Edit
- After ANY layout change, take a screenshot and scan for: overflow (chips/cards cut off), uneven grid rows, empty space where cards should be
- "Try:" chips and category filters must use `flex-wrap` — never `overflow-x-auto` (hidden content = broken UX)
- Every horizontal row of cards must be complete — no orphaned partial rows
- Before adding tools: count total, ensure divisible by 4

## Stack
- Next.js 15 App Router + TypeScript + Tailwind CSS
- Formspree ID: mbdwnbqb (submit form)
- Vercel project: howtousemyai → howtousemyai.com
