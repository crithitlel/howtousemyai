"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Logo from "../components/Logo";
import BrandMark from "../components/BrandMark";
import HeroReadout from "../components/HeroReadout";
import HeroFX from "../components/HeroFX";
import HeroCanvas from "../components/HeroCanvas";
import HeroGlobe from "../components/HeroGlobe";
import PinnedStrip from "../components/PinnedStrip";
import NewsletterSignup from "../components/NewsletterSignup";
import LiveClock from "../components/LiveClock";
import GlitchHeadline from "../components/GlitchHeadline";
import ScrollRail from "../components/ScrollRail";
import ToolCountUp from "../components/ToolCountUp";
import HeroSearch from "../components/HeroSearch";
import { TOOLS, slugify } from "@/lib/tools";
import { WORKFLOWS } from "@/lib/workflows";

/* ── Technical section-break divider ── */
function SectionBreak({ code, label, reveal = true }: { code: string; label: string; reveal?: boolean }) {
  return (
    <div className={`v2-break${reveal ? " v2-reveal" : ""}`} aria-hidden="true">
      <span className="v2-break-code">{code}</span>
      <span className="v2-break-line" />
      <span className="v2-break-bars">{Array.from({ length: 16 }).map((_, i) => <b key={i} />)}</span>
      <span className="v2-break-node">◆</span>
      <span className="v2-break-label">{label}</span>
      <span className="v2-break-line" />
      <span className="v2-break-code v2-break-code-r">{">>>"}</span>
    </div>
  );
}

const INDEX = [
  { label: "WRITING",      slug: "writing",          n: 20 },
  { label: "CODING",       slug: "coding",           n: 16 },
  { label: "VIDEO",        slug: "video",            n: 15 },
  { label: "PRODUCTIVITY", slug: "productivity",     n: 14 },
  { label: "RESEARCH",     slug: "research",         n: 13 },
  { label: "MARKETING",    slug: "marketing",        n: 12 },
  { label: "MUSIC",        slug: "music",            n: 11 },
  { label: "IMAGERY",      slug: "image-generation", n: 11 },
];

const COMPARE = [
  { slug: "chatgpt-vs-claude",        a: "CHATGPT",        b: "CLAUDE",   label: "ASSISTANTS", code: "DUEL.01" },
  { slug: "midjourney-vs-dall-e-3",   a: "MIDJOURNEY",     b: "DALL·E 3", label: "IMAGERY",    code: "DUEL.02" },
  { slug: "github-copilot-vs-cursor", a: "GITHUB COPILOT", b: "CURSOR",   label: "CODE",       code: "DUEL.03" },
];

const SECTOR_COUNT = new Set(TOOLS.map((t) => t.category)).size;
// Real, computed stat — tools with a free or freemium tier you can start without paying.
const FREE_TO_TRY = TOOLS.filter((t) => t.pricing !== "Paid").length;

export default function V2Page() {
  const [searchFocus, setSearchFocus] = useState(false);
  const heroRef = useRef<HTMLDivElement | null>(null);

  const featured = TOOLS.filter((t) => t.isFeatured).slice(0, 6);

  // hero parallax (crosshair + rings track cursor)
  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const move = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      el.style.setProperty("--px", String(x));
      el.style.setProperty("--py", String(y));
    };
    el.addEventListener("mousemove", move);
    return () => el.removeEventListener("mousemove", move);
  }, []);

  // dark full-bleed shell for this route only
  useEffect(() => {
    document.body.classList.add("v2-shell");
    return () => document.body.classList.remove("v2-shell");
  }, []);

  // scroll reveal
  useEffect(() => {
    const io = new IntersectionObserver(
      (en) => en.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("is-visible"); io.unobserve(e.target); } }),
      { threshold: 0.1 }
    );
    document.querySelectorAll(".v2-reveal").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // cursor-tracking spotlight on glass cards (Linear/Vercel-style light-follows-mouse)
  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      const card = (e.target as HTMLElement)?.closest?.(".v2-cell, .v2-duel") as HTMLElement | null;
      if (!card) return;
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const r = card.getBoundingClientRect();
        card.style.setProperty("--mx", `${e.clientX - r.left}px`);
        card.style.setProperty("--my", `${e.clientY - r.top}px`);
      });
    };
    document.addEventListener("pointermove", onMove, { passive: true });
    return () => { document.removeEventListener("pointermove", onMove); if (raf) cancelAnimationFrame(raf); };
  }, []);

  return (
    <div className="v2-root">
      {/* global overlays */}
      <div className="v2-scan" aria-hidden="true" />
      <div className="v2-noise" aria-hidden="true" />

      {/* fixed scroll-progress rail */}
      <ScrollRail />

      {/* ════ COMMAND BAR ════ */}
      <header className="v2-topbar">
        <Link href="/" className="v2-brand">
          <Logo size={22} />
          <span>HOWTOUSEMY<b>AI</b></span>
          <i className="v2-brand-sep" />
          <em className="v2-brand-ver">v2</em>
        </Link>
        <nav className="v2-nav">
          {[["TOOLS", "/tools"], ["WORKFLOWS", "/workflows"], ["COMPARE", "/compare"], ["FREE", "/free"], ["USE CASES", "/best-ai-for"]].map(([t, h], i) => (
            <Link key={h} href={h}><span className="v2-nav-i">0{i + 1}</span>{t}</Link>
          ))}
        </nav>
        <div className="v2-sysline">
          <button
            type="button"
            className="v2-cmdk-trigger"
            onClick={() => window.dispatchEvent(new Event("open-cmdk"))}
            aria-label="Open command palette"
          >
            <span className="v2-cmdk-ico">⌘</span>K<span className="v2-cmdk-txt">SEARCH</span>
          </button>
          <LiveClock />
        </div>
      </header>

      {/* ════ MAIN VIEWPORT (HERO) ════ */}
      <section className={`v2-hero${searchFocus ? " is-search" : ""}`} ref={heroRef}>
        <div className="v2-hero-grid" aria-hidden="true" />
        <div className="v2-hero-glow" aria-hidden="true" />

        {/* rotating wireframe globe + great-circle network arcs */}
        <HeroGlobe />

        {/* live cursor-reactive particle constellation */}
        <HeroCanvas />

        {/* deep-space blueprint circles extending beyond the hero */}
        <div className="v2-deepspace" aria-hidden="true">
          <span className="v2-bp v2-bp-1" />
          <span className="v2-bp v2-bp-2" />
          <span className="v2-bp v2-bp-3" />
          <span className="v2-bp-coord v2-bp-coord-n">00°</span>
          <span className="v2-bp-coord v2-bp-coord-e">90°</span>
          <span className="v2-bp-coord v2-bp-coord-s">180°</span>
          <span className="v2-bp-coord v2-bp-coord-w">270°</span>
        </div>

        <div className="v2-rings" aria-hidden="true">
          <span className="v2-breath" />
          <span className="v2-ring v2-ring-1" />
          <span className="v2-ring v2-ring-2" />
          <span className="v2-ring v2-ring-3" />
          <span className="v2-measure" />
          <span className="v2-sweep" />
          <span className="v2-ring-tick" />
          {/* orbital satellite indicators */}
          <span className="v2-orbit v2-orbit-1"><i className="v2-sat" /></span>
          <span className="v2-orbit v2-orbit-2"><i className="v2-sat v2-sat-red" /></span>
          <span className="v2-orbit v2-orbit-3"><i className="v2-sat" /></span>
          {/* signal pulses traveling along circular paths */}
          <span className="v2-signal" />
          <span className="v2-signal v2-signal-red" />
          {/* rotating compass around center reticle */}
          <span className="v2-compass" />
        </div>

        <div className="v2-cross v2-cross-x" aria-hidden="true" />
        <div className="v2-cross v2-cross-y" aria-hidden="true" />
        <div className="v2-reticle" aria-hidden="true" />

        {/* edge measurement rulers */}
        <span className="v2-ruler v2-ruler-t" aria-hidden="true" />
        <span className="v2-ruler v2-ruler-b" aria-hidden="true" />

        {/* JS-driven layers: particles, neural net, telemetry, acquisition, status */}
        <HeroFX />

        {/* hero corner brackets */}
        <i className="v2-cb v2-cb-tl v2-hero-cb" /><i className="v2-cb v2-cb-tr v2-hero-cb" />
        <i className="v2-cb v2-cb-bl v2-hero-cb" /><i className="v2-cb v2-cb-br v2-hero-cb" />

        {/* floating annotations */}
        <span className="v2-anno v2-anno-tl" aria-hidden="true">▸ RENDER OK · 60FPS</span>
        <span className="v2-anno v2-anno-tr" aria-hidden="true">NODE.MAINFRAME // <ToolCountUp target={TOOLS.length} /></span>
        <span className="v2-anno v2-anno-bl" aria-hidden="true">BUILD 1.9.{new Date().getFullYear()}</span>

        {/* rotating hex emblem */}
        <span className="v2-hex" aria-hidden="true">
          <svg viewBox="0 0 100 100">
            <polygon points="50,4 92,27 92,73 50,96 8,73 8,27" fill="none" stroke="rgba(24,119,242,0.5)" strokeWidth="1" />
            <polygon points="50,18 80,35 80,65 50,82 20,65 20,35" fill="none" stroke="rgba(228,30,63,0.45)" strokeWidth="1" />
            <circle cx="50" cy="50" r="4" fill="#1877F2" />
          </svg>
        </span>

        {/* vertical side rails */}
        <div className="v2-rail v2-rail-l" aria-hidden="true">
          <span>LAT 51.5074°N</span><span>LON 0.1278°W</span><span className="v2-bar"><b style={{ height: "62%" }} /></span><span>SEC // 14</span>
        </div>
        <div className="v2-rail v2-rail-r" aria-hidden="true">
          <span className="v2-dot v2-dot-ok" />NAV<span className="v2-dot v2-dot-ok" />IDX<span className="v2-dot v2-dot-red" />NET<span className="v2-dot v2-dot-ok" />PWR
        </div>

        {/* corner HUD statistics (shown in compact / search-primary compositions) */}
        <div className="v2-herostats" aria-hidden="true">
          <span className="v2-hs-cell"><b><ToolCountUp target={TOOLS.length} /></b><em>TOOLS</em></span>
          <span className="v2-hs-sep" />
          <span className="v2-hs-cell"><b>{SECTOR_COUNT}</b><em>CATEGORIES</em></span>
          <span className="v2-hs-sep" />
          <span className="v2-hs-cell"><b>{FREE_TO_TRY}</b><em>FREE TO TRY</em></span>
        </div>

        <div className="v2-hero-inner">
          <div className="v2-eyebrow">
            <i className="v2-haz" /><span>// DISCOVER + LEARN · THE AI DIRECTORY THAT TEACHES</span><i className="v2-haz" />
          </div>

          <GlitchHeadline />

          <HeroSearch onFocusChange={setSearchFocus} />

          <HeroReadout />
          <PinnedStrip />
        </div>

      </section>

      <SectionBreak code="SEC.01" label="DATABASE INDEX // SECTOR MANIFEST" reveal={false} />

      {/* ════ DATABASE INDEX ════ */}
      <section id="index" className="v2-sec">
        <div className="v2-sechead v2-reveal">
          <span className="v2-secnum">[ 01 ]</span>
          <h2 className="v2-sectitle">DATABASE<span className="v2-tred">.</span>INDEX</h2>
          <span className="v2-secmeta">// BROWSE BY SECTOR · {INDEX.length} CLASSIFICATIONS</span>
        </div>

        <div className="v2-grid v2-grid-index">
          {/* featured lead sector — wide 2×2 anchor cell breaks the uniform grid */}
          <a href={`/best-ai-for/${INDEX[0].slug}`} className="v2-cell v2-cell-feat v2-reveal">
            <i className="v2-cb v2-cb-tl" /><i className="v2-cb v2-cb-tr" /><i className="v2-cb v2-cb-bl" /><i className="v2-cb v2-cb-br" />
            <span className="v2-cell-top">
              <span className="v2-cell-n">01</span>
              <span className="v2-cell-id">SEC.01 · LEAD SECTOR</span>
            </span>
            <span className="v2-cell-name">{INDEX[0].label}</span>
            <span className="v2-cell-lede">The deepest sector — {INDEX[0].n} assistants for drafting, editing, and long-form. Where most missions begin.</span>
            <span className="v2-cell-bars" aria-hidden="true">
              {Array.from({ length: 10 }).map((_, b) => (
                <i key={b} className={b < Math.round(INDEX[0].n / 2.2) ? "on" : ""} />
              ))}
            </span>
            <span className="v2-cell-foot">
              <span>{INDEX[0].n} TOOLS · LARGEST INDEX</span>
              <span className="v2-cell-go">ACCESS ▸</span>
            </span>
          </a>
          {INDEX.slice(1).map((c, i) => (
            <a key={c.slug} href={`/best-ai-for/${c.slug}`} className="v2-cell v2-reveal" style={{ transitionDelay: `${(i + 1) * 45}ms` }}>
              <i className="v2-cb v2-cb-tl" /><i className="v2-cb v2-cb-tr" /><i className="v2-cb v2-cb-bl" /><i className="v2-cb v2-cb-br" />
              <span className="v2-cell-top">
                <span className="v2-cell-n">{String(i + 2).padStart(2, "0")}</span>
                <span className="v2-cell-id">SEC.{String(i + 2).padStart(2, "0")}</span>
              </span>
              <span className="v2-cell-name">{c.label}</span>
              <span className="v2-cell-bars" aria-hidden="true">
                {Array.from({ length: 10 }).map((_, b) => (
                  <i key={b} className={b < Math.round(c.n / 2.2) ? "on" : ""} />
                ))}
              </span>
              <span className="v2-cell-foot">
                <span>{c.n} TOOLS</span>
                <span className="v2-cell-go">ACCESS ▸</span>
              </span>
            </a>
          ))}
          {/* manifest CTA — fills the final cell as an intentional terminus, not a gap */}
          <a href="/best-ai-for" className="v2-cell v2-cell-cta v2-reveal" style={{ transitionDelay: `${INDEX.length * 45}ms` }}>
            <i className="v2-cb v2-cb-tl" /><i className="v2-cb v2-cb-tr" /><i className="v2-cb v2-cb-bl" /><i className="v2-cb v2-cb-br" />
            <span className="v2-cell-cta-mark" aria-hidden="true">+</span>
            <span className="v2-cell-name">ALL SECTORS</span>
            <span className="v2-cell-foot">
              <span>FULL MANIFEST</span>
              <span className="v2-cell-go">OPEN ▸</span>
            </span>
          </a>
        </div>
      </section>

      {/* ════ PRIORITY TARGETS (featured) ════ */}
      <section className="v2-sec v2-sec-dark">
        <div className="v2-hero-grid v2-grid-faint" aria-hidden="true" />
        <div className="v2-sechead v2-reveal">
          <span className="v2-secnum v2-secnum-on-dark">[ 02 ]</span>
          <h2 className="v2-sectitle v2-on-dark">PRIORITY<span className="v2-tred">.</span>TARGETS</h2>
          <span className="v2-secmeta v2-secmeta-dark">// HIGHEST-SIGNAL INSTRUMENTS</span>
        </div>

        <div className="v2-targets v2-reveal">
          {/* primary */}
          {featured[0] && (
            <a href={`/tools/${slugify(featured[0].name)}`} className="v2-primary">
              <i className="v2-cb v2-cb-tl v2-cb-on" /><i className="v2-cb v2-cb-tr v2-cb-on" /><i className="v2-cb v2-cb-bl v2-cb-on" /><i className="v2-cb v2-cb-br v2-cb-on" />
              <span className="v2-primary-tag"><i className="v2-dot v2-dot-red" />PRIMARY TARGET · 01</span>
              <BrandMark tool={featured[0]} size={66} />
              <h3 className="v2-primary-name">{featured[0].name}</h3>
              <p className="v2-primary-desc">{featured[0].description}</p>
              <span className="v2-primary-link">VIEW TOOL ▸</span>
              <span className="v2-primary-cross" aria-hidden="true" />
            </a>
          )}

          {/* secondary list */}
          <div className="v2-seclist">
            {featured.slice(1, 6).map((t, i) => (
              <a key={t.name} href={`/tools/${slugify(t.name)}`} className="v2-secitem">
                <span className="v2-secitem-n">{String(i + 2).padStart(2, "0")}</span>
                <BrandMark tool={t} size={38} />
                <span className="v2-secitem-body">
                  <span className="v2-secitem-name">{t.name}</span>
                  <span className="v2-secitem-cat">{t.category}</span>
                </span>
                <span className="v2-secitem-sig" aria-hidden="true"><i /><i /><i /><i /></span>
                <span className="v2-secitem-arrow" aria-hidden="true">▸</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <SectionBreak code="SEC.03" label="AI WORKFLOWS // COMPLETE MULTI-TOOL PLAYBOOKS" />

      {/* ════ WORKFLOWS — the core differentiator: complete tool chains ════ */}
      <section className="v2-sec">
        <div className="v2-sechead v2-reveal">
          <span className="v2-secnum">[ 03 ]</span>
          <h2 className="v2-sectitle">AI<span className="v2-tred">.</span>WORKFLOWS</h2>
          <span className="v2-secmeta">// MISSION PLAYBOOKS · THE WHOLE JOB, NOT JUST ONE TOOL · {WORKFLOWS.length} WORKFLOWS</span>
        </div>

        <div className="v2-grid v2-reveal" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}>
          {WORKFLOWS.slice(0, 4).map((w, i) => (
            <a key={w.slug} href={`/workflows/${w.slug}`} className="v2-cell v2-reveal" style={{ transitionDelay: `${i * 45}ms` }}>
              <i className="v2-cb v2-cb-tl" /><i className="v2-cb v2-cb-tr" /><i className="v2-cb v2-cb-bl" /><i className="v2-cb v2-cb-br" />
              <span className="v2-cell-top">
                <span className="v2-cell-n v2-cell-n-icon">{w.icon}</span>
                <span className="v2-cell-id">{w.difficulty.toUpperCase()}</span>
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
                <span>{w.time} · {w.steps.length} STEPS</span>
                <span className="v2-cell-go">RUN ▸</span>
              </span>
            </a>
          ))}
        </div>
        <div className="v2-reveal" style={{ textAlign: "center", marginTop: 26 }}>
          <a href="/workflows" className="v2-ctabtn" style={{ display: "inline-flex" }}>◆ ALL {WORKFLOWS.length} WORKFLOWS</a>
        </div>
      </section>

      <SectionBreak code="SEC.04" label="COMPARISONS // TOOL VS TOOL" />

      {/* ════ VERSUS ════ */}
      <section className="v2-sec">
        <div className="v2-sechead v2-reveal">
          <span className="v2-secnum">[ 04 ]</span>
          <h2 className="v2-sectitle">COMBAT<span className="v2-tred">.</span>LOG</h2>
          <span className="v2-secmeta">// COMPARISONS · TWO TOOLS, HEAD-TO-HEAD</span>
        </div>

        <div className="v2-duels">
          {COMPARE.map((c, i) => (
            <a key={c.slug} href={`/compare/${c.slug}`} className="v2-duel v2-reveal" style={{ transitionDelay: `${i * 60}ms` }}>
              <i className="v2-cb v2-cb-tl" /><i className="v2-cb v2-cb-tr" /><i className="v2-cb v2-cb-bl" /><i className="v2-cb v2-cb-br" />
              <span className="v2-duel-top"><span>{c.code}</span><span>{c.label}</span></span>
              <div className="v2-duel-body">
                <span className="v2-duel-side">{c.a}</span>
                <span className="v2-duel-vs"><i />VS<i /></span>
                <span className="v2-duel-side">{c.b}</span>
              </div>
              <span className="v2-duel-link">VIEW VERDICT ▸</span>
            </a>
          ))}
        </div>
      </section>

      <SectionBreak code="SEC.05" label="OPEN CHANNEL // TRANSMISSION RELAY" />

      {/* ════ TRANSMISSION (newsletter) ════ */}
      <section className="v2-sec v2-sec-dark v2-sec-news">
        <div className="v2-hero-grid v2-grid-faint" aria-hidden="true" />
        <NewsletterSignup secnum="[ 05 ]" className="v2-reveal" />
      </section>

      {/* ════ FOOTER CONSOLE ════ */}
      <footer className="v2-footer">
        <div className="v2-foot-grid">
          <div className="v2-foot-col">
            <span className="v2-foot-h">SYSTEM</span>
            <a href="/tools">Tools</a><a href="/workflows">Workflows</a><a href="/compare">Compare</a><a href="/free">Free</a><a href="/best-ai-for">Use Cases</a><a href="/prompts">Prompts</a><a href="/glossary">Glossary</a><a href="/calculator">Cost Calculator</a>
          </div>
          <div className="v2-foot-col">
            <span className="v2-foot-h">REGISTRY</span>
            <a href="/about">About</a><a href="/submit">Submit</a><a href="/privacy">Privacy</a><a href="/terms">Terms</a>
          </div>
          <div className="v2-foot-brand">
            <div className="v2-foot-logo"><Logo size={20} /><span>HOWTOUSEMY<b>AI</b></span></div>
            <p className="v2-foot-mono"><span className="v2-tok">{TOOLS.length}</span> AI TOOLS · <span className="v2-tok">{new Set(TOOLS.map((t) => t.category)).size}</span> CATEGORIES</p>
            <p className="v2-foot-mono v2-foot-dim">© {new Date().getFullYear()} HOWTOUSEMYAI // ALL SYSTEMS RESERVED</p>
            <p className="v2-foot-mono v2-foot-dim">PLANET TEXTURES · <a href="https://www.solarsystemscope.com/textures/" target="_blank" rel="noopener noreferrer">SOLAR SYSTEM SCOPE</a> · CC BY 4.0</p>
          </div>
        </div>
        <div className="v2-foot-bar" aria-hidden="true">
          {Array.from({ length: 60 }).map((_, i) => <i key={i} />)}
        </div>
      </footer>
    </div>
  );
}
