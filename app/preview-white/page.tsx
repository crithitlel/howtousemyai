// SERVER component on purpose: everything static (sector grid, priority
// targets, workflows, comparisons, footer) renders at build time; only the
// interactive/animated pieces are client islands (HeroSearch, clock-free
// effects holder, count-up). TOOLS/WORKFLOWS data stays server-side.
import Link from "next/link";
import Logo from "../components/Logo";
import BrandMark from "../components/BrandMark";
import HeroReadout from "../components/HeroReadout";
import PinnedStrip from "../components/PinnedStrip";
import NewsletterSignup from "../components/NewsletterSignup";
import ToolCountUp from "../components/ToolCountUp";
import HeroSearch from "../components/HeroSearch";
import HomeFX from "../components/HomeFX";
import CmdkTrigger from "../components/CmdkTrigger";
import { TOOLS, slugify } from "@/lib/tools";
import { WORKFLOWS } from "@/lib/workflows";

const INDEX = [
  { label: "Writing",      slug: "writing",          n: 20 },
  { label: "Coding",       slug: "coding",           n: 16 },
  { label: "Video",        slug: "video",            n: 15 },
  { label: "Productivity", slug: "productivity",     n: 14 },
  { label: "Research",     slug: "research",         n: 13 },
  { label: "Marketing",    slug: "marketing",        n: 12 },
  { label: "Music",        slug: "music",            n: 11 },
  { label: "Imagery",      slug: "image-generation", n: 11 },
];

const COMPARE = [
  { slug: "chatgpt-vs-claude",        a: "ChatGPT",        b: "Claude",   label: "Assistants" },
  { slug: "midjourney-vs-dall-e-3",   a: "Midjourney",     b: "DALL·E 3", label: "Imagery" },
  { slug: "github-copilot-vs-cursor", a: "GitHub Copilot", b: "Cursor",   label: "Code" },
];

const SECTOR_COUNT = new Set(TOOLS.map((t) => t.category)).size;
// Real, computed stat — tools with a free or freemium tier you can start without paying.
const FREE_TO_TRY = TOOLS.filter((t) => t.pricing !== "Paid").length;

// TEMPORARY preview route — NOT linked from nav/sitemap, localhost only.
// Preserved copy of the white/blue homepage experiment ("keep them just in
// case"). The live homepage remains the dark command-center design.
export default function PreviewWhitePage() {
  const featured = TOOLS.filter((t) => t.isFeatured).slice(0, 6);

  return (
    <div className="v2-root hp-shell">
      {/* white body override, scoped to this route only (HomeFX adds body.v2-shell) */}
      <style>{`body.v2-shell { background: #FFFFFF !important; }`}</style>
      {/* document-level effects (body class, scroll-reveal, cursor spotlight) */}
      <HomeFX />

      {/* ════ NAV ════ */}
      <header className="v2-topbar">
        <Link href="/" className="v2-brand">
          <Logo size={22} />
          <span>HOWTOUSEMY<b>AI</b></span>
        </Link>
        <nav className="v2-nav">
          {[["Tools", "/tools"], ["Workflows", "/workflows"], ["Compare", "/compare"], ["Free", "/free"], ["Use Cases", "/best-ai-for"]].map(([t, h]) => (
            <Link key={h} href={h}>{t}</Link>
          ))}
        </nav>
        <div className="v2-sysline">
          <CmdkTrigger />
        </div>
      </header>

      {/* ════ HERO ════ */}
      <section className="v2-hero">
        <div className="hp-hero-glow" aria-hidden="true" />

        <div className="v2-hero-inner">
          <div className="v2-eyebrow">
            <span>The AI directory that teaches</span>
          </div>

          <h1 className="v2-display">
            Find the <span className="v2-display-blue">right AI</span><span className="v2-display-red">.</span>
          </h1>
          <p className="hp-hero-sub">
            Describe what you're trying to do — we'll match you to the right tool and show you exactly how to use it.
          </p>

          <HeroSearch />

          <HeroReadout />
          <PinnedStrip />
        </div>
      </section>

      {/* ════ CATEGORIES ════ */}
      <section id="index" className="v2-sec">
        <div className="v2-sechead v2-reveal">
          <h2 className="v2-sectitle">Browse by category</h2>
          <span className="v2-secmeta">{INDEX.length} categories to explore</span>
        </div>

        <div className="v2-grid v2-grid-index">
          <a href={`/best-ai-for/${INDEX[0].slug}`} className="v2-cell v2-cell-feat v2-reveal">
            <span className="v2-cell-top">
              <span className="hp-cell-badge">Most popular</span>
            </span>
            <span className="v2-cell-name">{INDEX[0].label}</span>
            <span className="v2-cell-lede">The deepest category — {INDEX[0].n} assistants for drafting, editing, and long-form. Where most people start.</span>
            <span className="v2-cell-foot">
              <span>{INDEX[0].n} tools</span>
              <span className="v2-cell-go">Explore →</span>
            </span>
          </a>
          {INDEX.slice(1).map((c, i) => (
            <a key={c.slug} href={`/best-ai-for/${c.slug}`} className="v2-cell v2-reveal" style={{ transitionDelay: `${(i + 1) * 45}ms` }}>
              <span className="v2-cell-name">{c.label}</span>
              <span className="v2-cell-foot">
                <span>{c.n} tools</span>
                <span className="v2-cell-go">Explore →</span>
              </span>
            </a>
          ))}
          <a href="/best-ai-for" className="v2-cell v2-cell-cta v2-reveal" style={{ transitionDelay: `${INDEX.length * 45}ms` }}>
            <span className="v2-cell-cta-mark" aria-hidden="true">+</span>
            <span className="v2-cell-name">All categories</span>
            <span className="v2-cell-foot">
              <span className="v2-cell-go">Open →</span>
            </span>
          </a>
        </div>
      </section>

      {/* ════ PRIORITY TARGETS (featured) ════ */}
      <section className="v2-sec v2-sec-dark">
        <div className="v2-sechead v2-reveal">
          <h2 className="v2-sectitle v2-on-dark">Most popular tools</h2>
          <span className="v2-secmeta v2-secmeta-dark">The highest-signal picks in the directory</span>
        </div>

        <div className="v2-targets v2-reveal">
          {featured[0] && (
            <a href={`/tools/${slugify(featured[0].name)}`} className="v2-primary">
              <span className="v2-primary-tag">Most popular</span>
              <BrandMark tool={featured[0]} size={66} />
              <h3 className="v2-primary-name">{featured[0].name}</h3>
              <p className="v2-primary-desc">{featured[0].description}</p>
              <span className="v2-primary-link">View tool →</span>
            </a>
          )}

          <div className="v2-seclist">
            {featured.slice(1, 6).map((t, i) => (
              <a key={t.name} href={`/tools/${slugify(t.name)}`} className="v2-secitem">
                <span className="v2-secitem-n">{String(i + 2).padStart(2, "0")}</span>
                <BrandMark tool={t} size={38} />
                <span className="v2-secitem-body">
                  <span className="v2-secitem-name">{t.name}</span>
                  <span className="v2-secitem-cat">{t.category}</span>
                </span>
                <span className="v2-secitem-arrow" aria-hidden="true">→</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ════ WORKFLOWS ════ */}
      <section className="v2-sec">
        <div className="v2-sechead v2-reveal">
          <h2 className="v2-sectitle">AI workflows</h2>
          <span className="v2-secmeta">The whole job, not just one tool · {WORKFLOWS.length} playbooks</span>
        </div>

        <div className="v2-grid v2-reveal" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}>
          {WORKFLOWS.slice(0, 4).map((w, i) => (
            <a key={w.slug} href={`/workflows/${w.slug}`} className="v2-cell v2-reveal" style={{ transitionDelay: `${i * 45}ms` }}>
              <span className="v2-cell-top">
                <span className="v2-cell-n-icon">{w.icon}</span>
                <span className="hp-difficulty">{w.difficulty}</span>
              </span>
              <span className="v2-cell-name">{w.title}</span>
              <span className="wf-card-flow" style={{ padding: "2px 0 4px" }}>
                {w.steps.map((s, b) => (
                  <span key={s.phase} className="wf-flow-step">
                    <span className="wf-flow-ico">{s.icon}</span>
                    {b < w.steps.length - 1 && <span className="wf-flow-arrow">→</span>}
                  </span>
                ))}
              </span>
              <span className="v2-cell-foot">
                <span>{w.time} · {w.steps.length} steps</span>
                <span className="v2-cell-go">Start →</span>
              </span>
            </a>
          ))}
        </div>
        <div className="v2-reveal" style={{ textAlign: "center", marginTop: 32 }}>
          <a href="/workflows" className="v2-ctabtn" style={{ display: "inline-flex" }}>All {WORKFLOWS.length} workflows</a>
        </div>
      </section>

      {/* ════ COMPARISONS ════ */}
      <section className="v2-sec">
        <div className="v2-sechead v2-reveal">
          <h2 className="v2-sectitle">Popular comparisons</h2>
          <span className="v2-secmeta">Two tools, head-to-head</span>
        </div>

        <div className="v2-duels">
          {COMPARE.map((c, i) => (
            <a key={c.slug} href={`/compare/${c.slug}`} className="v2-duel v2-reveal" style={{ transitionDelay: `${i * 60}ms` }}>
              <span className="v2-duel-top"><span>{c.label}</span></span>
              <div className="v2-duel-body">
                <span className="v2-duel-side">{c.a}</span>
                <span className="v2-duel-vs">vs</span>
                <span className="v2-duel-side">{c.b}</span>
              </div>
              <span className="v2-duel-link">See verdict →</span>
            </a>
          ))}
        </div>
      </section>

      {/* ════ NEWSLETTER ════ */}
      <section className="v2-sec v2-sec-dark v2-sec-news">
        <NewsletterSignup
          className="v2-reveal"
          title="Get the newsletter"
          lead="The best new AI tools, once a week. No noise."
          ctaLabel="Subscribe"
        />
      </section>

      {/* ════ FOOTER ════ */}
      <footer className="v2-footer">
        <div className="v2-foot-grid">
          <div className="v2-foot-col">
            <span className="v2-foot-h">Site</span>
            <a href="/tools">Tools</a><a href="/workflows">Workflows</a><a href="/compare">Compare</a><a href="/free">Free</a><a href="/best-ai-for">Use Cases</a><a href="/prompts">Prompts</a><a href="/glossary">Glossary</a><a href="/calculator">Cost Calculator</a>
          </div>
          <div className="v2-foot-col">
            <span className="v2-foot-h">Company</span>
            <a href="/about">About</a><a href="/submit">Submit</a><a href="/privacy">Privacy</a><a href="/terms">Terms</a>
          </div>
          <div className="v2-foot-brand">
            <div className="v2-foot-logo"><Logo size={20} /><span>HOWTOUSEMY<b>AI</b></span></div>
            <p className="v2-foot-mono"><span className="v2-tok"><ToolCountUp target={TOOLS.length} /></span> AI tools · <span className="v2-tok">{SECTOR_COUNT}</span> categories · <span className="v2-tok">{FREE_TO_TRY}</span> free to try</p>
            <p className="v2-foot-mono v2-foot-dim">© {new Date().getFullYear()} HowToUseMyAI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
