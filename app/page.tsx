"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Logo from "./components/Logo";
import { TOOLS, slugify, type Tool } from "@/lib/tools";
import { getToolUrl } from "@/lib/affiliates";

const CATEGORIES = [
  "All", "Writing", "Images",
  "Coding", "Video", "Music",
  "Research", "Productivity", "Marketing",
  "Analytics", "Presentations", "Design",
  "Support", "HR", "Finance",
];

const PRICING_OPTIONS = ["All", "Free", "Freemium", "Paid"] as const;
type PricingFilter = typeof PRICING_OPTIONS[number];


const PRICING_STYLES: Record<string, string> = {
  Free:     "bg-[#142a4d] text-[#1877F2]",
  Freemium: "bg-[#142a4d] text-[#1877F2]",
  Paid:     "bg-[#3a1524] text-[#ff6b85]",
};

const TRENDING = [
  "YouTube video",
  "Generate images",
  "Cover letter",
  "Fix my code",
  "Make a song",
  "Research topic",
];

const HERO_TEXT = "Find the right AI tool in seconds";

const USE_CASES = [
  { slug: "writing", label: "Writing" },
  { slug: "coding", label: "Coding" },
  { slug: "image-generation", label: "Images" },
  { slug: "video", label: "Video" },
  { slug: "music", label: "Music" },
  { slug: "research", label: "Research" },
  { slug: "productivity", label: "Productivity" },
  { slug: "marketing", label: "Marketing" },
  { slug: "design", label: "Design" },
  { slug: "data-analysis", label: "Data" },
  { slug: "automation", label: "Automation" },
  { slug: "education", label: "Education" },
];

const PLACEHOLDER_QUERIES = [
  "I want to create a YouTube video",
  "Write a cover letter for me",
  "Generate images for my brand",
  "Fix a bug in my code",
  "Make a song from my lyrics",
  "Research a topic in depth",
];

function MiniToolCard({ tool }: { tool: Tool }) {
  return (
    <a
      href={`/tools/${slugify(tool.name)}`}
      className="glass-card bg-[#101b32] border border-[#233150] rounded-xl p-3 flex flex-col gap-2 hover:shadow-md hover:border-[#1877F2] transition-all"
    >
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-[#0d1729] border border-[#233150] flex items-center justify-center overflow-hidden flex-shrink-0">
          <img
            src={`https://www.google.com/s2/favicons?domain=${tool.domain}&sz=64`}
            alt={tool.name}
            width={18}
            height={18}
            className="rounded object-contain"
            onError={(e) => {
              const t = e.currentTarget;
              t.style.display = "none";
              if (t.nextElementSibling) (t.nextElementSibling as HTMLElement).style.display = "flex";
            }}
          />
          <span className="text-sm hidden items-center justify-center w-full h-full">{tool.icon}</span>
        </div>
        <span className="text-xs font-semibold text-[#e9eef8] leading-tight">{tool.name}</span>
      </div>
      <p className="text-[10px] text-[#93a4c3] leading-relaxed line-clamp-2">{tool.description}</p>
    </a>
  );
}

function MatrixRain() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const parent = canvas.parentElement as HTMLElement;
    const fit = () => { canvas.width = parent.clientWidth; canvas.height = parent.clientHeight; };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(parent);
    const chars = "アイウエオカキクケコ01<>/=+*#";
    const fs = 14;
    const gap = fs * 2.2; // sparse columns — minimalist
    let drops: number[] = [];
    const seed = () => { drops = Array.from({ length: Math.ceil(canvas.width / gap) }, () => Math.random() * -70); };
    seed();
    const iv = setInterval(() => {
      if (document.hidden) return;
      if (Math.ceil(canvas.width / gap) !== drops.length) seed();
      ctx.fillStyle = "rgba(13, 23, 41, 0.1)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = `${fs}px monospace`;
      for (let i = 0; i < drops.length; i++) {
        const ch = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillStyle = Math.random() > 0.985 ? "rgba(125, 180, 255, 0.45)" : "rgba(77, 163, 255, 0.12)";
        ctx.fillText(ch, i * gap, drops[i] * fs);
        if (drops[i] * fs > canvas.height && Math.random() > 0.99) drops[i] = Math.random() * -20;
        drops[i] += 0.3; // slow fall
      }
    }, 90);
    return () => { clearInterval(iv); ro.disconnect(); };
  }, []);
  return <canvas ref={ref} className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true" />;
}

export default function HomePage() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [activePricing, setActivePricing] = useState<PricingFilter>("All");
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [typedPlaceholder, setTypedPlaceholder] = useState("");
  const [heroText, setHeroText] = useState(HERO_TEXT);
  const [toolCount, setToolCount] = useState(0);
  const [heroTab, setHeroTab] = useState<"search" | "trending" | "categories">("search");
  const [feedText, setFeedText] = useState("");
  const [featIdx, setFeatIdx] = useState(0);
  const [booting, setBooting] = useState<"off" | "on" | "fading">("off");
  const [sndOn, setSndOn] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const router = useRouter();

  // Boot loader — once per session
  useEffect(() => {
    if (sessionStorage.getItem("htumai-boot")) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      sessionStorage.setItem("htumai-boot", "1");
      return;
    }
    setBooting("on");
    sessionStorage.setItem("htumai-boot", "1");
    const t1 = setTimeout(() => setBooting("fading"), 1400);
    const t2 = setTimeout(() => setBooting("off"), 1900);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const skipBoot = () => {
    setBooting("fading");
    setTimeout(() => setBooting("off"), 450);
  };

  // Featured carousel auto-advance
  useEffect(() => {
    const n = TOOLS.filter((t) => t.isFeatured).length;
    if (n < 2) return;
    const iv = setInterval(() => setFeatIdx((i) => (i + 1) % n), 5000);
    return () => clearInterval(iv);
  }, [featIdx]);

  // UI sounds — WebAudio blips on interactive elements
  useEffect(() => {
    setSndOn(localStorage.getItem("htumai-snd") === "1");
  }, []);

  useEffect(() => {
    if (!sndOn) return;
    const SELECTOR = ".seg-cell, .filter-chip, .mod-link, .nav-link, .submit-chip, .tool-card, .sub-tab, .car-btn, .glass-card";
    const blip = (freq: number, dur: number, gain: number) => {
      try {
        if (!audioCtxRef.current) audioCtxRef.current = new AudioContext();
        const ctx = audioCtxRef.current;
        if (ctx.state === "suspended") ctx.resume();
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = "square";
        osc.frequency.value = freq;
        g.gain.setValueAtTime(gain, ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
        osc.connect(g);
        g.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + dur);
      } catch { /* audio unavailable */ }
    };
    const onOver = (e: MouseEvent) => {
      const el = (e.target as HTMLElement).closest(SELECTOR);
      const rel = (e as MouseEvent & { relatedTarget: EventTarget | null }).relatedTarget as HTMLElement | null;
      if (el && (!rel || rel.closest(SELECTOR) !== el)) blip(1400, 0.05, 0.012);
    };
    const onClick = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest(SELECTOR)) blip(740, 0.09, 0.025);
    };
    document.addEventListener("mouseover", onOver);
    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("click", onClick);
    };
  }, [sndOn]);

  // Typewriter index feed at the bottom of the hero panel
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setFeedText(`${TOOLS.length} TOOLS // ${CATEGORIES.length - 1} CATEGORIES`);
      return;
    }
    const entries = TOOLS.map((t) => `${t.name.toUpperCase()} // ${t.category.toUpperCase()}`);
    let i = Math.floor(Math.random() * entries.length);
    let pos = 0;
    let deleting = false;
    let timer: ReturnType<typeof setTimeout>;
    const tick = () => {
      const text = entries[i];
      if (!deleting) {
        pos++;
        setFeedText(text.slice(0, pos));
        if (pos === text.length) { deleting = true; timer = setTimeout(tick, 2400); return; }
        timer = setTimeout(tick, 50);
      } else {
        pos--;
        setFeedText(text.slice(0, pos));
        if (pos === 0) { deleting = false; i = (i + 1) % entries.length; timer = setTimeout(tick, 400); return; }
        timer = setTimeout(tick, 16);
      }
    };
    timer = setTimeout(tick, 1200);
    return () => clearTimeout(timer);
  }, []);

  const toggleSnd = () => {
    const next = !sndOn;
    setSndOn(next);
    localStorage.setItem("htumai-snd", next ? "1" : "0");
  };

  // Decode scramble-in for the headline
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789<>/\\|=+*#";
    let frame = 0;
    const total = 28;
    const iv = setInterval(() => {
      frame++;
      const revealed = Math.floor(HERO_TEXT.length * (frame / total));
      let out = HERO_TEXT.slice(0, revealed);
      for (let j = revealed; j < HERO_TEXT.length; j++) {
        out += HERO_TEXT[j] === " " ? " " : chars[Math.floor(Math.random() * chars.length)];
      }
      if (frame >= total) { setHeroText(HERO_TEXT); clearInterval(iv); }
      else setHeroText(out);
    }, 40);
    return () => clearInterval(iv);
  }, []);

  // Cycling typewriter placeholder
  useEffect(() => {
    let i = 0;        // query index
    let pos = 0;      // char position
    let deleting = false;
    let timer: ReturnType<typeof setTimeout>;
    const tick = () => {
      const text = PLACEHOLDER_QUERIES[i];
      if (!deleting) {
        pos++;
        setTypedPlaceholder(text.slice(0, pos));
        if (pos === text.length) { deleting = true; timer = setTimeout(tick, 2000); return; }
        timer = setTimeout(tick, 45);
      } else {
        pos--;
        setTypedPlaceholder(text.slice(0, pos));
        if (pos === 0) { deleting = false; i = (i + 1) % PLACEHOLDER_QUERIES.length; timer = setTimeout(tick, 350); return; }
        timer = setTimeout(tick, 18);
      }
    };
    timer = setTimeout(tick, 600);
    return () => clearTimeout(timer);
  }, []);

  // Count-up for the tool total
  useEffect(() => {
    const target = TOOLS.length;
    const duration = 1200;
    const start = performance.now();
    let raf: number;
    const step = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setToolCount(Math.round(eased * target));
      if (t < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Boot-up reveals on scroll
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver(
      (entries) => entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add("is-visible"); io.unobserve(en.target); }
      }),
      { threshold: 0.08 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // Spotlight position on tool cards
  const handleSpotlight = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = (e.target as HTMLElement).closest(".tool-card") as HTMLElement | null;
    if (!card) return;
    const r = card.getBoundingClientRect();
    card.style.setProperty("--mx", `${e.clientX - r.left}px`);
    card.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  const handleSubmit = (q: string) => {
    const trimmed = q.trim();
    if (!trimmed) return;
    router.push(`/recommend?q=${encodeURIComponent(trimmed)}`);
  };

  const scrollToTools = () => {
    document.getElementById("tool-grid")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const filtered = TOOLS.filter((t) => {
    const matchesCategory = activeCategory === "All" || t.category === activeCategory;
    const matchesPricing = activePricing === "All" || t.pricing === activePricing;
    const matchesSearch = !query.trim() || (
      t.name.toLowerCase().includes(query.toLowerCase()) ||
      t.description.toLowerCase().includes(query.toLowerCase())
    );
    return matchesCategory && matchesPricing && matchesSearch;
  });

  const newThisWeekTools = TOOLS.filter((t) => t.isNewThisWeek);
  const featuredTools = TOOLS.filter((t) => t.isFeatured);

  return (
    <div className="flex flex-col min-h-screen">

      {/* Boot loader overlay — once per session */}
      {booting !== "off" && (
        <div className={`boot-overlay ${booting === "fading" ? "boot-done" : ""}`} onClick={skipBoot} role="presentation">
          <div className="boot-lines">
            <div>HTUMAI.SYS <span className="dim">// V1.2026</span></div>
            <div className="dim">INITIALIZING INDEX ... <span className="text-[#4da3ff]">OK</span></div>
            <div className="dim">{TOOLS.length} TOOLS VERIFIED ... <span className="text-[#4da3ff]">OK</span></div>
            <div>INTERFACE READY<span className="cursor-blink" /></div>
          </div>
          <div className="boot-bar" />
          <span className="boot-skip">Click to skip</span>
        </div>
      )}

      {/* ── First screen: 2A console viewport ── */}
      <div className="flex flex-col lg:h-svh">

        {/* Sticky nav */}
        <header className="sticky top-0 z-30 bg-[#0a0f1e]/85 backdrop-blur border-b border-[#233150] px-6 py-3">
          <div className="header-glow-line absolute bottom-0 left-0 right-0" />
          <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
            <a href="/" className="flex items-center gap-2 flex-shrink-0">
              <Logo size={24} />
              <span className="brand-mark">HowToUseMy<span className="brand-ai">AI</span></span>
            </a>
            <nav className="flex items-center gap-5">
              <a href="/submit" className="submit-chip">+ Submit a Tool</a>
            </nav>
          </div>
        </header>

        {/* Segmented nav bar */}
        <nav className="seg-nav select-none">
          <span className="seg-bc">→ HTUMAI.V1_2026 // Index</span>
          <a href="#tools" className="seg-cell">Tools</a>
          <a href="/compare" className="seg-cell">Compare</a>
          <a href="/best-ai-for" className="seg-cell">Use Cases</a>
          <a href="/about" className="seg-cell">About</a>
          <a href="/submit" className="seg-cell accent">+ Submit</a>
        </nav>

        {/* Status bar — static HUD readout */}
        <div className="border-b border-[#1b2742] bg-[#070d1a]/80 py-1.5 select-none">
          <div className="max-w-6xl mx-auto px-4 flex items-center justify-center gap-3 sm:gap-5 mono text-[9px] sm:text-[10px] tracking-[0.18em] text-[#5d6f93] uppercase whitespace-nowrap overflow-hidden">
            <span className="flex items-center gap-1.5"><span className="status-dot" />System online</span>
            <span className="text-[#233150]">|</span>
            <span><span className="text-[#4da3ff]">{TOOLS.length}</span> tools indexed</span>
            <span className="text-[#233150]">|</span>
            <span><span className="text-[#4da3ff]">{CATEGORIES.length - 1}</span> categories</span>
            <span className="hidden sm:inline text-[#233150]">|</span>
            <span className="hidden sm:inline">Verified {new Date().toLocaleString("en-US", { month: "long", year: "numeric" })}</span>
            <span className="text-[#233150]">|</span>
            <button
              onClick={toggleSnd}
              className={`uppercase tracking-[0.18em] transition-colors ${sndOn ? "text-[#4da3ff]" : "text-[#5d6f93] hover:text-[#93a4c3]"}`}
              title="Toggle interface sounds"
            >
              SND: {sndOn ? "ON" : "OFF"}
            </button>
          </div>
        </div>

        {/* Console area */}
        <section className="flex-1 min-h-0 flex flex-col gap-3 px-3 sm:px-5 py-4">

          {/* Hero viewport panel */}
          <div className="panel flex-1 min-h-0">
            <div className="panel-head">
              <span className="ph-icon">H</span>
              Htumai // Find.Your.Tool
              <span className="ph-fill" />
              <span className="text-[#4da3ff]">V1.2026</span>
            </div>
            <div className="panel-body relative flex flex-col min-h-0 overflow-hidden">
              {/* In-panel sub-tabs (2A viewport switcher) */}
              <div className="sub-tabs flex-shrink-0">
                <button className={`sub-tab ${heroTab === "search" ? "active" : ""}`} onClick={() => setHeroTab("search")}>Search</button>
                <button className={`sub-tab ${heroTab === "trending" ? "active" : ""}`} onClick={() => setHeroTab("trending")}>Trending</button>
                <button className={`sub-tab ${heroTab === "categories" ? "active" : ""}`} onClick={() => setHeroTab("categories")}>Categories</button>
              </div>

              {heroTab === "search" && (
              <div className="relative flex-1 min-h-0 flex flex-col items-center justify-center text-center px-4 pt-8 pb-12">
                <MatrixRain />
                <span className="absolute top-2.5 left-3.5 mono text-[9px] tracking-[0.24em] text-[#3d4f75] uppercase hidden sm:block">Sys.Search.Module</span>

                <div className="hero-kicker mb-3 relative">
                  <span>AI Tool Index</span>
                </div>
                <h1 className="hero-title relative text-2xl sm:text-4xl font-bold mb-2">
                  {heroText}
                </h1>
                <p className="relative text-[13px] text-[#93a4c3] mb-5 max-w-lg mx-auto">
                  Describe what you want to do. We match you with the best of <span className="mono font-semibold text-[#4da3ff]">{toolCount}</span> hand-picked tools, each with step-by-step instructions.
                </p>

                {/* Inline search bar */}
                <div className="hud-corners search-glow relative flex items-center bg-[#101b32] rounded-full px-4 py-2 gap-2 w-full max-w-2xl">
                  <svg className="w-4 h-4 text-[#5d6f93] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    className="flex-1 text-sm text-[#e9eef8] bg-transparent placeholder-[#566586] focus:outline-none"
                    placeholder={typedPlaceholder || " "}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(query); }}
                  />
                  <button
                    onClick={() => handleSubmit(query)}
                    disabled={!query.trim()}
                    className="bg-[#1877F2] hover:bg-[#166FE5] disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-semibold px-4 py-2 rounded-full transition-colors whitespace-nowrap flex-shrink-0"
                  >
                    Find My AI
                  </button>
                </div>

                {/* Trending chips — compact single row */}
                <div className="relative mt-4 flex flex-wrap items-center justify-center gap-1.5">
                  <span className="mono text-[10px] tracking-[0.2em] text-[#5d6f93] uppercase mr-1">Try //</span>
                  {TRENDING.map((term) => (
                    <button
                      key={term}
                      onClick={() => handleSubmit(term)}
                      className="filter-chip"
                    >
                      {term}
                    </button>
                  ))}
                </div>

                {/* Typewriter index feed */}
                <div className="absolute bottom-0 left-0 right-0 border-t border-[#1b2742] bg-[#0a1124]/90 px-4 py-1.5 text-left select-none">
                  <span className="mono text-[9px] sm:text-[10px] tracking-[0.16em] uppercase">
                    <span className="text-[#5d6f93]">&gt; Indexed: </span>
                    <span className="text-[#4da3ff]">{feedText}</span>
                  </span>
                </div>
              </div>
              )}

              {heroTab === "trending" && (
              <div className="flex-1 min-h-0 overflow-y-auto px-4 py-5">
                <p className="mono text-[10px] tracking-[0.22em] text-[#5d6f93] uppercase mb-3">&gt; Trending.Now // Latest verified additions</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-3xl mx-auto">
                  {newThisWeekTools.slice(0, 6).map((tool) => (
                    <MiniToolCard key={tool.name} tool={tool} />
                  ))}
                </div>
              </div>
              )}

              {heroTab === "categories" && (
              <div className="flex-1 min-h-0 overflow-y-auto px-4 py-5">
                <p className="mono text-[10px] tracking-[0.22em] text-[#5d6f93] uppercase mb-3">&gt; Browse.Index // Select use case</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 max-w-3xl mx-auto">
                  {USE_CASES.map(({ slug, label }) => (
                    <a key={slug} href={`/best-ai-for/${slug}`} className="mod-link border border-[#1b2742] bg-[#0a1124]/60 px-3 py-2 hover:border-[#1877F2] hover:bg-[#16233f] transition-all">{label}</a>
                  ))}
                </div>
                <p className="text-center mt-4">
                  <a href="/best-ai-for" className="mono text-[10px] tracking-[0.18em] text-[#4da3ff] uppercase hover:underline">View All Use Cases →</a>
                </p>
              </div>
              )}
            </div>
          </div>

          {/* Module row — Trending / Browse / Mailing list */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 flex-shrink-0">

            <div className="panel">
              <div className="panel-head"><span className="ph-icon">T</span>Trending.Now<span className="ph-fill" /><span className="text-[#ff6b85]">Hot</span></div>
              <div className="panel-body px-3 py-2 grid grid-cols-2 gap-x-3">
                {newThisWeekTools.slice(0, 6).map((tool) => (
                  <a key={tool.name} href={`/tools/${slugify(tool.name)}`} className="mod-link truncate">{tool.name}</a>
                ))}
              </div>
            </div>

            <div className="panel">
              <div className="panel-head"><span className="ph-icon">F</span>Featured.Tool<span className="ph-fill" /><span className="text-[#4da3ff]">{String(featIdx + 1).padStart(2, "0")}/{String(featuredTools.length).padStart(2, "0")}</span></div>
              <div className="panel-body px-3 py-2 flex items-center gap-2.5">
                {featuredTools.length > 0 && (() => {
                  const ft = featuredTools[featIdx % featuredTools.length];
                  return (
                    <>
                      <button className="car-btn" aria-label="Previous featured tool" onClick={() => setFeatIdx((featIdx - 1 + featuredTools.length) % featuredTools.length)}>‹</button>
                      <a href={`/tools/${slugify(ft.name)}`} className="flex-1 min-w-0 flex items-center gap-2.5 group">
                        <div className="w-9 h-9 rounded-lg bg-[#0d1729] border border-[#233150] flex items-center justify-center overflow-hidden flex-shrink-0">
                          <img
                            src={`https://www.google.com/s2/favicons?domain=${ft.domain}&sz=64`}
                            alt={ft.name}
                            width={22}
                            height={22}
                            className="rounded object-contain"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-[#e9eef8] group-hover:text-[#4da3ff] transition-colors truncate">{ft.name}</p>
                          <p className="text-[10px] text-[#93a4c3] leading-snug line-clamp-2">{ft.description}</p>
                        </div>
                        <span className="mono text-[9px] tracking-[0.18em] text-[#4da3ff] uppercase border border-[#233150] px-2 py-1 flex-shrink-0 group-hover:border-[#1877F2] transition-colors">View</span>
                      </a>
                      <button className="car-btn" aria-label="Next featured tool" onClick={() => setFeatIdx((featIdx + 1) % featuredTools.length)}>›</button>
                    </>
                  );
                })()}
              </div>
            </div>

            <div className="panel sm:col-span-2 lg:col-span-1">
              <div className="panel-head"><span className="ph-icon">M</span>Mailing.List<span className="ph-fill" /><span>Weekly</span></div>
              <div className="panel-body px-3 py-2 flex flex-col justify-center gap-1.5">
                {subscribed ? (
                  <p className="mono text-xs text-[#4da3ff] tracking-[0.08em]">&gt; SUBSCRIBED // YOU&apos;RE IN</p>
                ) : (
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      if (email.trim()) {
                        await fetch("https://formspree.io/f/mbdwnbqb", {
                          method: "POST",
                          headers: { "Content-Type": "application/json", Accept: "application/json" },
                          body: JSON.stringify({ email, _subject: "New newsletter subscriber" }),
                        });
                        setSubscribed(true);
                      }
                    }}
                    className="flex items-center bg-[#070d1a] border border-[#2b3a5c] rounded px-3 py-1.5 gap-2"
                  >
                    <span className="mono text-xs text-[#4da3ff] flex-shrink-0">&gt;_</span>
                    <input
                      type="email"
                      required
                      placeholder="ENTER EMAIL"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mono flex-1 min-w-0 text-xs text-[#e9eef8] bg-transparent placeholder-[#3d4f75] tracking-[0.08em] focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="mono bg-[#1877F2] hover:bg-[#166FE5] text-white text-[10px] font-semibold tracking-[0.14em] uppercase px-3 py-1.5 rounded transition-colors whitespace-nowrap flex-shrink-0"
                    >
                      Subscribe
                    </button>
                  </form>
                )}
                <p className="mono text-[9px] tracking-[0.18em] text-[#5d6f93] uppercase">Best new AI tools // every week</p>
              </div>
            </div>
          </div>
        </section>

        {/* Scroll hint divider */}
        <div className="divider-bar flex-shrink-0">
          <span className="flex items-center gap-2">↓ Scroll.Extended.Content</span>
          <span className="hidden sm:inline">Full index // {TOOLS.length} tools</span>
        </div>
      </div>

      {/* Filter console — compact HUD panel */}
      <section id="tools" className="px-4 sm:px-6 py-4 border-b border-[#1b2742]">
        <div className="max-w-6xl mx-auto border border-[#233150] bg-[#0d1729]/70 rounded-lg px-3 py-2.5">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="mono text-[10px] tracking-[0.18em] text-[#5d6f93] uppercase w-[74px] flex-shrink-0">Category</span>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => { setActiveCategory(cat); scrollToTools(); }}
                className={`filter-chip ${activeCategory === cat ? "active" : ""}`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-1.5 mt-2 pt-2 border-t border-[#1b2742]">
            <span className="mono text-[10px] tracking-[0.18em] text-[#5d6f93] uppercase w-[74px] flex-shrink-0">Pricing</span>
            {PRICING_OPTIONS.map((p) => (
              <button
                key={p}
                onClick={() => { setActivePricing(p); scrollToTools(); }}
                className={`filter-chip ${activePricing === p ? "active" : ""}`}
              >
                {p}
              </button>
            ))}
            <span className="mono text-[10px] text-[#4da3ff] ml-auto hidden sm:block">{filtered.length} / {TOOLS.length}</span>
          </div>
        </div>
      </section>

      {/* Editor's Picks */}
      <section className="px-4 sm:px-6 pt-6 pb-2 border-b border-[#1b2742]">
        <div className="max-w-6xl mx-auto">
          <div className="reveal">
            <div className="flex items-center gap-2 mb-3">
              <h2 className="tech-label"><span className="mono text-[#4da3ff]">01 /</span> Editor&apos;s Picks</h2>
              <span className="text-[10px] font-bold bg-[#142a4d] text-[#1877F2] px-2 py-0.5 rounded-full">⭐ PICKS</span>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {featuredTools.map((tool) => (
                <MiniToolCard key={tool.name} tool={tool} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Tool cards */}
      <section id="tool-grid" className="px-4 sm:px-6 py-8 flex-1">
        <div className="max-w-6xl mx-auto">
          {/* Header row: count + view toggle */}
          <div className="flex items-center justify-between mb-5">
            <p className="mono text-xs text-[#93a4c3]"><span className="text-[#4da3ff]">{filtered.length}</span> tools available</p>
            <div className="flex items-center gap-1 bg-[#101b32] border border-[#233150] rounded-lg p-0.5">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-md transition-colors ${viewMode === "grid" ? "bg-[#1877F2] text-white" : "text-[#93a4c3] hover:text-[#1877F2]"}`}
                title="Grid view"
              >
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 16 16">
                  <rect x="1" y="1" width="6" height="6" rx="1"/><rect x="9" y="1" width="6" height="6" rx="1"/><rect x="1" y="9" width="6" height="6" rx="1"/><rect x="9" y="9" width="6" height="6" rx="1"/>
                </svg>
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded-md transition-colors ${viewMode === "list" ? "bg-[#1877F2] text-white" : "text-[#93a4c3] hover:text-[#1877F2]"}`}
                title="List view"
              >
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 16 16">
                  <rect x="1" y="2" width="14" height="2.5" rx="1"/><rect x="1" y="6.75" width="14" height="2.5" rx="1"/><rect x="1" y="11.5" width="14" height="2.5" rx="1"/>
                </svg>
              </button>
            </div>
          </div>

          {/* GRID VIEW */}
          {viewMode === "grid" && (
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3" onMouseMove={handleSpotlight}>
              {filtered.map((tool) => (
                <a
                  key={tool.name}
                  href={`/tools/${slugify(tool.name)}`}
                  className="tool-card glass-card relative group bg-[#101b32] border border-[#233150] rounded-xl p-4 flex flex-col items-center text-center gap-2 overflow-hidden hover:shadow-md transition-all"
                >
                  {/* Large centered favicon */}
                  <div className="w-12 h-12 rounded-xl bg-[#0d1729] border border-[#233150] flex items-center justify-center overflow-hidden flex-shrink-0 mt-1">
                    <img
                      src={`https://www.google.com/s2/favicons?domain=${tool.domain}&sz=64`}
                      alt={tool.name}
                      width={32}
                      height={32}
                      className="rounded object-contain"
                      onError={(e) => {
                        const t = e.currentTarget;
                        t.style.display = "none";
                        if (t.nextElementSibling) (t.nextElementSibling as HTMLElement).style.display = "flex";
                      }}
                    />
                    <span className="text-xl hidden items-center justify-center w-full h-full">{tool.icon}</span>
                  </div>

                  {/* Badges */}
                  <div className="flex items-center gap-1 flex-wrap justify-center">
                    {tool.isFeatured && (
                      <span className="text-[9px] font-bold bg-[#142a4d] text-[#1877F2] px-1.5 py-0.5 rounded-full">⭐</span>
                    )}
                    {tool.isNew && (
                      <span className="text-[9px] font-bold bg-[#3a1524] text-[#ff6b85] px-1.5 py-0.5 rounded-full">NEW</span>
                    )}
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${PRICING_STYLES[tool.pricing]}`}>
                      {tool.pricing.toUpperCase()}
                    </span>
                  </div>

                  {/* Name + description */}
                  <div>
                    <h3 className="text-sm font-semibold text-[#e9eef8] group-hover:text-[#1877F2] transition-colors leading-tight">
                      {tool.name}
                    </h3>
                    <p className="text-xs text-[#93a4c3] mt-1 leading-relaxed line-clamp-2">
                      {tool.description}
                    </p>
                  </div>

                  {/* Visit link */}
                  <div className="mt-auto pt-1">
                    <span className="text-[11px] font-medium text-[#1877F2] group-hover:underline">
                      Visit tool
                    </span>
                  </div>
                </a>
              ))}
            </div>
          )}

          {/* LIST VIEW */}
          {viewMode === "list" && (
            <div className="flex flex-col gap-2">
              {filtered.map((tool) => (
                <a
                  key={tool.name}
                  href={`/tools/${slugify(tool.name)}`}
                  className="glass-card group bg-[#101b32] border border-[#233150] rounded-xl px-4 py-3 flex items-center gap-4 hover:shadow-md hover:border-[#1877F2] transition-all"
                >
                  {/* Favicon */}
                  <div className="w-10 h-10 rounded-xl bg-[#0d1729] border border-[#233150] flex items-center justify-center overflow-hidden flex-shrink-0">
                    <img
                      src={`https://www.google.com/s2/favicons?domain=${tool.domain}&sz=64`}
                      alt={tool.name}
                      width={28}
                      height={28}
                      className="rounded object-contain"
                      onError={(e) => {
                        const t = e.currentTarget;
                        t.style.display = "none";
                        if (t.nextElementSibling) (t.nextElementSibling as HTMLElement).style.display = "flex";
                      }}
                    />
                    <span className="text-lg hidden items-center justify-center w-full h-full">{tool.icon}</span>
                  </div>

                  {/* Name + description */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-[#e9eef8] group-hover:text-[#1877F2] transition-colors leading-tight">
                      {tool.name}
                    </h3>
                    <p className="text-xs text-[#93a4c3] mt-0.5 leading-relaxed truncate">
                      {tool.description}
                    </p>
                  </div>

                  {/* Badges */}
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {tool.isFeatured && (
                      <span className="text-[9px] font-bold bg-[#142a4d] text-[#1877F2] px-1.5 py-0.5 rounded-full">⭐</span>
                    )}
                    {tool.isNew && (
                      <span className="text-[9px] font-bold bg-[#3a1524] text-[#ff6b85] px-1.5 py-0.5 rounded-full">NEW</span>
                    )}
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${PRICING_STYLES[tool.pricing]}`}>
                      {tool.pricing.toUpperCase()}
                    </span>
                  </div>

                  {/* Arrow */}
                  <svg className="w-4 h-4 text-[#5d6f93] group-hover:text-[#1877F2] flex-shrink-0 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Browse by Category */}
      <section className="border-t border-[#233150] px-6 py-10">
        <div className="max-w-6xl mx-auto reveal">
          <h2 className="tech-label mb-1"><span className="mono text-[#4da3ff]">02 /</span> Browse by use case</h2>
          <p className="text-xs text-[#93a4c3] mb-5">Find the best AI tool for exactly what you need to do.</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {[
              { slug: "writing", label: "Writing", icon: "✍️" },
              { slug: "coding", label: "Coding", icon: "💻" },
              { slug: "image-generation", label: "Image Generation", icon: "🎨" },
              { slug: "video", label: "Video Creation", icon: "🎬" },
              { slug: "music", label: "Music", icon: "🎵" },
              { slug: "research", label: "Research", icon: "🔍" },
              { slug: "productivity", label: "Productivity", icon: "⚡" },
              { slug: "marketing", label: "Marketing", icon: "📣" },
              { slug: "seo", label: "SEO", icon: "📈" },
              { slug: "social-media", label: "Social Media", icon: "📱" },
              { slug: "design", label: "Design", icon: "🖌️" },
              { slug: "presentations", label: "Presentations", icon: "🖥️" },
              { slug: "data-analysis", label: "Data Analysis", icon: "📊" },
              { slug: "automation", label: "Automation", icon: "🔧" },
              { slug: "customer-support", label: "Customer Support", icon: "💬" },
              { slug: "education", label: "Education", icon: "🎓" },
              { slug: "translation", label: "Translation", icon: "🌐" },
              { slug: "audio", label: "Audio & Podcasts", icon: "🎙️" },
              { slug: "sales", label: "Sales", icon: "💼" },
              { slug: "email", label: "Email", icon: "📧" },
              { slug: "resume", label: "Resume & Jobs", icon: "📄" },
              { slug: "legal", label: "Legal", icon: "⚖️" },
            ].map(({ slug, label, icon }) => (
              <a
                key={slug}
                href={`/best-ai-for/${slug}`}
                className="glass-card flex items-center gap-2.5 bg-[#0d1729] border border-[#233150] rounded-xl px-3 py-2.5 hover:border-[#1877F2] hover:bg-[#16233f] transition-all group"
              >
                <span className="text-base flex-shrink-0">{icon}</span>
                <span className="text-xs font-medium text-[#e9eef8] group-hover:text-[#1877F2] transition-colors leading-tight">{label}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Footer — 2A bottom bar */}
      <footer className="border-t border-[#233150] px-4 sm:px-6 py-4 bg-[#0a1124]">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Logo size={16} />
            <span className="footer-meta">(C) {new Date().getFullYear()} HowToUseMyAI</span>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-x-2 gap-y-1 mono text-[10px]">
            <a href="/" className="nav-link">Home</a>
            <span className="text-[#233150]">//</span>
            <a href="/about" className="nav-link">About</a>
            <span className="text-[#233150]">//</span>
            <a href="/compare" className="nav-link">Compare</a>
            <span className="text-[#233150]">//</span>
            <a href="/disclosure" className="nav-link">Disclosure</a>
            <span className="text-[#233150]">//</span>
            <a href="/privacy" className="nav-link">Privacy</a>
            <span className="text-[#233150]">//</span>
            <a href="/terms" className="nav-link">Terms</a>
          </div>
          <a href="/submit" className="submit-chip">+ Submit a Tool</a>
        </div>
      </footer>
    </div>
  );
}
