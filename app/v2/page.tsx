"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Logo from "../components/Logo";
import { TOOLS, slugify, type Tool } from "@/lib/tools";

/* ── Real brand mark (unavatar → favicon fallback) ── */
function Mark({ tool, size = 40 }: { tool: Tool; size?: number }) {
  const inner = Math.round(size * 0.58);
  return (
    <span className="v2-mark" style={{ width: size, height: size }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`https://unavatar.io/${tool.domain}?fallback=false`}
        data-i="0"
        alt={tool.name}
        width={inner}
        height={inner}
        onError={(e) => {
          const t = e.currentTarget;
          if (t.dataset.i === "0") { t.dataset.i = "1"; t.src = `https://www.google.com/s2/favicons?domain=${tool.domain}&sz=128`; }
          else { t.style.display = "none"; }
        }}
      />
    </span>
  );
}

/* ── HUD corner-bracket frame wrapper ── */
function Frame({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={`v2-frame ${className}`}>
      <i className="v2-cb v2-cb-tl" /><i className="v2-cb v2-cb-tr" />
      <i className="v2-cb v2-cb-bl" /><i className="v2-cb v2-cb-br" />
      {children}
    </div>
  );
}

/* ── Technical section-break divider ── */
function SectionBreak({ code, label }: { code: string; label: string }) {
  return (
    <div className="v2-break v2-reveal" aria-hidden="true">
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

const PLACEHOLDERS = [
  "CREATE A YOUTUBE VIDEO",
  "WRITE A COVER LETTER",
  "GENERATE BRAND IMAGERY",
  "DEBUG MY SOURCE CODE",
];

const TICKER = [
  "SYSTEM ONLINE", "INDEX SYNCHRONISED", "164 NODES ACTIVE", "LATENCY 12MS",
  "SECTORS 14 / 14 NOMINAL", "FEED LIVE", "ENCRYPTION AES-256", "UPLINK STABLE",
];

export default function V2Page() {
  const [query, setQuery] = useState("");
  const [count, setCount] = useState(0);
  const [ph, setPh] = useState("");
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [clock, setClock] = useState("--:--:--");
  const [glitch, setGlitch] = useState(false);
  const [scrollPct, setScrollPct] = useState(0);
  const heroRef = useRef<HTMLDivElement | null>(null);
  const magnetRef = useRef<HTMLButtonElement | null>(null);
  const router = useRouter();

  const featured = TOOLS.filter((t) => t.isFeatured).slice(0, 6);

  const submit = (q: string) => {
    const t = q.trim();
    if (t) router.push(`/recommend?q=${encodeURIComponent(t)}`);
  };

  // count-up
  useEffect(() => {
    const target = TOOLS.length;
    const start = performance.now();
    let raf = 0;
    const step = (now: number) => {
      const p = Math.min((now - start) / 1600, 1);
      setCount(Math.round((1 - Math.pow(1 - p, 3)) * target));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, []);

  // typewriter
  useEffect(() => {
    let i = 0, pos = 0, del = false, timer: ReturnType<typeof setTimeout>;
    const tick = () => {
      const txt = PLACEHOLDERS[i];
      if (!del) { pos++; setPh(txt.slice(0, pos)); if (pos === txt.length) { del = true; timer = setTimeout(tick, 1700); return; } timer = setTimeout(tick, 55); }
      else { pos--; setPh(txt.slice(0, pos)); if (pos === 0) { del = false; i = (i + 1) % PLACEHOLDERS.length; timer = setTimeout(tick, 280); return; } timer = setTimeout(tick, 22); }
    };
    timer = setTimeout(tick, 800);
    return () => clearTimeout(timer);
  }, []);

  // live UTC clock
  useEffect(() => {
    const fmt = () => {
      const d = new Date();
      setClock(
        `${String(d.getUTCHours()).padStart(2, "0")}:${String(d.getUTCMinutes()).padStart(2, "0")}:${String(d.getUTCSeconds()).padStart(2, "0")}`
      );
    };
    fmt();
    const id = setInterval(fmt, 1000);
    return () => clearInterval(id);
  }, []);

  // periodic headline glitch
  useEffect(() => {
    const id = setInterval(() => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 220);
    }, 4200);
    return () => clearInterval(id);
  }, []);

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
      el.style.setProperty("--mx", `${e.clientX - r.left}px`);
      el.style.setProperty("--my", `${e.clientY - r.top}px`);
    };
    el.addEventListener("mousemove", move);
    return () => el.removeEventListener("mousemove", move);
  }, []);

  // magnetic CTA
  useEffect(() => {
    const btn = magnetRef.current;
    if (!btn) return;
    const move = (e: MouseEvent) => {
      const r = btn.getBoundingClientRect();
      const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      const dx = e.clientX - cx, dy = e.clientY - cy;
      if (Math.hypot(dx, dy) < 110) btn.style.transform = `translate(${dx * 0.22}px, ${dy * 0.22}px)`;
      else btn.style.transform = "";
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  // dark full-bleed shell for this route only
  useEffect(() => {
    document.body.classList.add("v2-shell");
    return () => document.body.classList.remove("v2-shell");
  }, []);

  // scroll progress
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      setScrollPct(max > 0 ? Math.round((h.scrollTop / max) * 100) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
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

  return (
    <div className="v2-root">
      {/* global overlays */}
      <div className="v2-scan" aria-hidden="true" />
      <div className="v2-noise" aria-hidden="true" />

      {/* fixed scroll-progress rail */}
      <div className="v2-scrollrail" aria-hidden="true">
        <span className="v2-scrollrail-pct">{String(scrollPct).padStart(3, "0")}<em>%</em></span>
        <span className="v2-scrollrail-track"><i style={{ height: `${scrollPct}%` }} /></span>
        <span className="v2-scrollrail-label">SCROLL // DEPTH</span>
      </div>

      {/* ════ COMMAND BAR ════ */}
      <header className="v2-topbar">
        <a href="/" className="v2-brand">
          <Logo size={22} />
          <span>HOWTOUSEMY<b>AI</b></span>
          <i className="v2-brand-sep" />
          <em className="v2-brand-ver">v1.0</em>
        </a>
        <nav className="v2-nav">
          {[["TOOLS", "/tools"], ["COMPARE", "/compare"], ["FREE", "/free"], ["USE CASES", "/best-ai-for"]].map(([t, h], i) => (
            <a key={h} href={h}><span className="v2-nav-i">0{i + 1}</span>{t}</a>
          ))}
        </nav>
        <div className="v2-sysline">
          <span className="v2-stat"><i className="v2-dot v2-dot-ok" />ONLINE</span>
          <span className="v2-stat v2-mono">{clock} UTC</span>
          <span className="v2-stat"><i className="v2-dot v2-dot-red" />LIVE</span>
        </div>
      </header>

      {/* ════ MAIN VIEWPORT (HERO) ════ */}
      <section className="v2-hero" ref={heroRef}>
        <div className="v2-hero-grid" aria-hidden="true" />
        <div className="v2-hero-glow" aria-hidden="true" />
        <div className="v2-rings" aria-hidden="true">
          <span className="v2-ring v2-ring-1" />
          <span className="v2-ring v2-ring-2" />
          <span className="v2-ring v2-ring-3" />
          <span className="v2-ring-tick" />
        </div>
        <div className="v2-cross v2-cross-x" aria-hidden="true" />
        <div className="v2-cross v2-cross-y" aria-hidden="true" />
        <div className="v2-reticle" aria-hidden="true" />

        {/* hero corner brackets */}
        <i className="v2-cb v2-cb-tl v2-hero-cb" /><i className="v2-cb v2-cb-tr v2-hero-cb" />
        <i className="v2-cb v2-cb-bl v2-hero-cb" /><i className="v2-cb v2-cb-br v2-hero-cb" />

        {/* floating annotations */}
        <span className="v2-anno v2-anno-tl" aria-hidden="true">▸ RENDER OK · 60FPS</span>
        <span className="v2-anno v2-anno-tr" aria-hidden="true">NODE.MAINFRAME // {count}</span>
        <span className="v2-anno v2-anno-bl" aria-hidden="true">BUILD 1.0.{new Date().getFullYear()}</span>

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

        <div className="v2-hero-inner">
          <div className="v2-eyebrow">
            <i className="v2-haz" /><span>// SYSTEM ONLINE · AI DIRECTORY MAINFRAME</span><i className="v2-haz" />
          </div>

          <h1 className={`v2-display ${glitch ? "is-glitch" : ""}`} data-text="FIND THE RIGHT AI">
            FIND THE<br /><span className="v2-display-blue">RIGHT AI</span><span className="v2-display-red">.</span>
          </h1>

          <p className="v2-lead">
            A mainframe index of <b>{count}</b> tools — scanned, ranked, and decoded.
            State your objective. The system returns the optimal instrument.
          </p>

          <Frame className="v2-console">
            <span className="v2-console-tag">TARGET ACQUISITION</span>
            <div className="v2-console-row">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") submit(query); }}
                placeholder={ph ? `> ${ph}_` : "> STATE YOUR OBJECTIVE_"}
              />
              <button ref={magnetRef} className="v2-cta" onClick={() => submit(query)}>
                <span>EXECUTE</span><i className="v2-cta-arrow">▸</i>
              </button>
            </div>
          </Frame>

          <div className="v2-readout">
            <span><b>{count}</b><em>NODES</em></span>
            <i className="v2-readout-sep" />
            <span><b>14</b><em>SECTORS</em></span>
            <i className="v2-readout-sep" />
            <span><b>WEEKLY</b><em>REFRESH</em></span>
          </div>
        </div>

        {/* hero ticker */}
        <div className="v2-ticker" aria-hidden="true">
          <div className="v2-ticker-track">
            {[...TICKER, ...TICKER].map((t, i) => (
              <span key={i}><i className="v2-dot v2-dot-red" />{t}</span>
            ))}
          </div>
        </div>
      </section>

      <SectionBreak code="SEC.01" label="DATABASE INDEX // SECTOR MANIFEST" />

      {/* ════ DATABASE INDEX ════ */}
      <section id="index" className="v2-sec">
        <div className="v2-sechead v2-reveal">
          <span className="v2-secnum">[ 01 ]</span>
          <h2 className="v2-sectitle">DATABASE<span className="v2-tred">.</span>INDEX</h2>
          <span className="v2-secmeta">// BROWSE BY SECTOR · {INDEX.length} CLASSIFICATIONS</span>
        </div>

        <div className="v2-grid">
          {INDEX.map((c, i) => (
            <a key={c.slug} href={`/best-ai-for/${c.slug}`} className="v2-cell v2-reveal" style={{ transitionDelay: `${i * 45}ms` }}>
              <i className="v2-cb v2-cb-tl" /><i className="v2-cb v2-cb-tr" /><i className="v2-cb v2-cb-bl" /><i className="v2-cb v2-cb-br" />
              <span className="v2-cell-top">
                <span className="v2-cell-n">{String(i + 1).padStart(2, "0")}</span>
                <span className="v2-cell-id">SEC.{String(i + 1).padStart(2, "0")}</span>
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
              <Mark tool={featured[0]} size={66} />
              <h3 className="v2-primary-name">{featured[0].name}</h3>
              <p className="v2-primary-desc">{featured[0].description}</p>
              <span className="v2-primary-link">OPEN DOSSIER ▸</span>
              <span className="v2-primary-cross" aria-hidden="true" />
            </a>
          )}

          {/* secondary list */}
          <div className="v2-seclist">
            {featured.slice(1, 6).map((t, i) => (
              <a key={t.name} href={`/tools/${slugify(t.name)}`} className="v2-secitem">
                <span className="v2-secitem-n">{String(i + 2).padStart(2, "0")}</span>
                <Mark tool={t} size={38} />
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

      <SectionBreak code="SEC.03" label="COMBAT LOG // ENGAGEMENT RECORDS" />

      {/* ════ VERSUS ════ */}
      <section className="v2-sec">
        <div className="v2-sechead v2-reveal">
          <span className="v2-secnum">[ 03 ]</span>
          <h2 className="v2-sectitle">COMBAT<span className="v2-tred">.</span>LOG</h2>
          <span className="v2-secmeta">// HEAD-TO-HEAD ENGAGEMENTS</span>
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

      <SectionBreak code="SEC.04" label="SYSTEM TELEMETRY // LIVE DIAGNOSTICS" />

      {/* ════ SYSTEM TELEMETRY ════ */}
      <section className="v2-sec">
        <div className="v2-sechead v2-reveal">
          <span className="v2-secnum">[ 04 ]</span>
          <h2 className="v2-sectitle">SYSTEM<span className="v2-tred">.</span>TELEMETRY</h2>
          <span className="v2-secmeta">// REAL-TIME DIAGNOSTICS · ALL CHANNELS NOMINAL</span>
        </div>

        <div className="v2-tele v2-reveal">
          {/* radar scope */}
          <Frame className="v2-tpanel">
            <span className="v2-tpanel-tag">SECTOR SCAN</span>
            <div className="v2-radar">
              <span className="v2-radar-ring" /><span className="v2-radar-ring v2-radar-ring-2" />
              <span className="v2-radar-x" /><span className="v2-radar-y" />
              <span className="v2-radar-sweep" />
              <span className="v2-radar-blip" style={{ top: "32%", left: "60%" }} />
              <span className="v2-radar-blip" style={{ top: "58%", left: "40%", animationDelay: "0.6s" }} />
              <span className="v2-radar-blip" style={{ top: "44%", left: "72%", animationDelay: "1.1s" }} />
            </div>
            <span className="v2-tpanel-foot"><span>14 SECTORS</span><span className="v2-tok-b">TRACKING</span></span>
          </Frame>

          {/* throughput EQ */}
          <Frame className="v2-tpanel">
            <span className="v2-tpanel-tag">DATA THROUGHPUT</span>
            <div className="v2-eq">{Array.from({ length: 28 }).map((_, i) => <i key={i} style={{ animationDelay: `${(i % 7) * 0.12}s` }} />)}</div>
            <span className="v2-tpanel-foot"><span>12MS LATENCY</span><span className="v2-tok-b">164 NODES</span></span>
          </Frame>

          {/* health gauge */}
          <Frame className="v2-tpanel">
            <span className="v2-tpanel-tag">INDEX HEALTH</span>
            <div className="v2-gauge">
              <svg viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(24,119,242,0.14)" strokeWidth="8" />
                <circle className="v2-gauge-arc" cx="60" cy="60" r="50" fill="none" stroke="#1877F2" strokeWidth="8" strokeLinecap="round" transform="rotate(-90 60 60)" />
              </svg>
              <span className="v2-gauge-num">98<em>%</em></span>
            </div>
            <span className="v2-tpanel-foot"><span>INTEGRITY</span><span className="v2-tok-b">OPERATIONAL</span></span>
          </Frame>

          {/* signal oscilloscope */}
          <Frame className="v2-tpanel">
            <span className="v2-tpanel-tag">SIGNAL FEED</span>
            <div className="v2-scope">
              <span className="v2-scope-grid" />
              <span className="v2-scope-wave" />
              <span className="v2-scope-wave v2-scope-wave-2" />
              <span className="v2-scope-line" />
            </div>
            <span className="v2-tpanel-foot"><span>UPLINK STABLE</span><span className="v2-tok-b">AES-256</span></span>
          </Frame>
        </div>
      </section>

      <SectionBreak code="SEC.05" label="OPEN CHANNEL // TRANSMISSION RELAY" />

      {/* ════ TRANSMISSION (newsletter) ════ */}
      <section className="v2-sec v2-sec-dark v2-sec-news">
        <div className="v2-hero-grid v2-grid-faint" aria-hidden="true" />
        <Frame className="v2-news v2-reveal">
          <span className="v2-secnum v2-secnum-on-dark">[ 05 ]</span>
          <h2 className="v2-news-title">OPEN<span className="v2-tred">.</span>CHANNEL</h2>
          <p className="v2-news-lead">// WEEKLY TRANSMISSION · THE BEST NEW AI TOOLS, DECRYPTED · ZERO NOISE</p>
          {subscribed ? (
            <p className="v2-news-done"><i className="v2-dot v2-dot-ok" />CHANNEL OPEN — CHECK YOUR INBOX</p>
          ) : (
            <form
              className="v2-news-form"
              onSubmit={async (e) => {
                e.preventDefault();
                if (email.trim()) {
                  await fetch("https://formspree.io/f/mbdwnbqb", {
                    method: "POST",
                    headers: { "Content-Type": "application/json", Accept: "application/json" },
                    body: JSON.stringify({ email, _subject: "New subscriber (v2)" }),
                  });
                  setSubscribed(true);
                }
              }}
            >
              <span className="v2-news-pre">▸</span>
              <input type="email" required placeholder="ENTER FREQUENCY // you@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
              <button type="submit">TRANSMIT</button>
            </form>
          )}
        </Frame>
      </section>

      {/* ════ FOOTER CONSOLE ════ */}
      <footer className="v2-footer">
        <div className="v2-foot-grid">
          <div className="v2-foot-col">
            <span className="v2-foot-h">SYSTEM</span>
            <a href="/tools">Tools</a><a href="/compare">Compare</a><a href="/free">Free</a><a href="/best-ai-for">Use Cases</a>
          </div>
          <div className="v2-foot-col">
            <span className="v2-foot-h">REGISTRY</span>
            <a href="/about">About</a><a href="/submit">Submit</a><a href="/privacy">Privacy</a><a href="/terms">Terms</a>
          </div>
          <div className="v2-foot-brand">
            <div className="v2-foot-logo"><Logo size={20} /><span>HOWTOUSEMY<b>AI</b></span></div>
            <p className="v2-foot-mono">STATUS: <span className="v2-tok">NOMINAL</span> · NODES: <span className="v2-tok">{TOOLS.length}</span> · UPLINK: <span className="v2-tok">STABLE</span></p>
            <p className="v2-foot-mono v2-foot-dim">© {new Date().getFullYear()} HOWTOUSEMYAI // ALL SYSTEMS RESERVED</p>
          </div>
        </div>
        <div className="v2-foot-bar" aria-hidden="true">
          {Array.from({ length: 60 }).map((_, i) => <i key={i} />)}
        </div>
      </footer>
    </div>
  );
}
