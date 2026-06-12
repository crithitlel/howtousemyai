"use client";

import { useEffect, useState } from "react";
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
      className="bg-[#101b32] border border-[#233150] rounded-xl p-3 flex flex-col gap-2 hover:shadow-md hover:border-[#1877F2] transition-all"
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

export default function HomePage() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [activePricing, setActivePricing] = useState<PricingFilter>("All");
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [typedPlaceholder, setTypedPlaceholder] = useState("");
  const [toolCount, setToolCount] = useState(0);
  const router = useRouter();

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

      {/* Sticky nav */}
      <header className="sticky top-0 z-30 bg-[#0a0f1e]/85 backdrop-blur border-b border-[#233150] px-6 py-3">
        <div className="header-glow-line absolute bottom-0 left-0 right-0" />
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <a href="/" className="flex items-center gap-2 flex-shrink-0">
            <Logo size={24} />
            <span className="font-semibold text-[#1877F2] text-sm tracking-tight">HowToUseMyAI</span>
          </a>
          <nav className="flex items-center gap-5">
            <a href="/compare" className="text-xs text-[#93a4c3] font-medium hover:text-[#1877F2] transition-colors whitespace-nowrap">Comparisons</a>
            <a href="/best-ai-for" className="text-xs text-[#93a4c3] font-medium hover:text-[#1877F2] transition-colors whitespace-nowrap hidden sm:inline">Use Cases</a>
            <a href="/submit" className="text-xs text-[#1877F2] font-semibold hover:opacity-80 transition-opacity whitespace-nowrap">+ Submit a Tool</a>
          </nav>
        </div>
      </header>

      {/* Status ticker */}
      <div className="ticker-bar overflow-hidden border-b border-[#1b2742] bg-[#070d1a]/80 py-1.5 select-none">
        <div className="ticker-track mono text-[10px] tracking-[0.2em] text-[#5d6f93] uppercase">
          {[0, 1].map((copy) => (
            <span key={copy} className="flex items-center whitespace-nowrap">
              {[
                `${TOOLS.length} tools indexed`,
                "verified june 2026",
                `${newThisWeekTools.length} new this week`,
                "step-by-step guides included",
                "system online",
              ].map((item) => (
                <span key={item} className="flex items-center">
                  <span className="px-6">{item}</span>
                  <span className="text-[#1877F2]">·</span>
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* Hero — Google-style */}
      <section className="px-4 sm:px-6 pt-8 sm:pt-12 pb-6 text-center">
        <div className="max-w-2xl mx-auto">

          <h1 className="text-2xl sm:text-3xl font-bold text-[#e9eef8] tracking-tight mb-2">
            Find the right AI tool in seconds
          </h1>
          <p className="text-sm text-[#93a4c3] mb-6">
            Describe what you want to do. We match you with the best of <span className="mono font-semibold text-[#4da3ff]">{toolCount}</span> hand-picked tools, each with step-by-step instructions.
          </p>

          {/* Inline search bar */}
          <div className="hud-corners search-glow flex items-center bg-[#101b32] rounded-full px-4 py-2 gap-2">
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
          <div className="mt-6 flex flex-wrap items-center justify-center gap-1.5">
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
        </div>
      </section>

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

      {/* New This Week + Editor's Picks horizontal scroll sections */}
      <section className="px-4 sm:px-6 pt-6 pb-2 border-b border-[#1b2742]">
        <div className="max-w-6xl mx-auto space-y-6">

          {/* New This Week */}
          <div className="reveal">
            <div className="flex items-center gap-2 mb-3">
              <h2 className="tech-label"><span className="mono text-[#4da3ff]">01 /</span> Trending Now</h2>
              <span className="text-[10px] font-bold bg-[#3a1524] text-[#ff6b85] px-2 py-0.5 rounded-full">HOT</span>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {newThisWeekTools.map((tool) => (
                <MiniToolCard key={tool.name} tool={tool} />
              ))}
            </div>
          </div>

          {/* Editor's Picks */}
          <div className="reveal">
            <div className="flex items-center gap-2 mb-3">
              <h2 className="tech-label"><span className="mono text-[#4da3ff]">02 /</span> Editor&apos;s Picks</h2>
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
                  className="tool-card relative group bg-[#101b32] border border-[#233150] rounded-xl p-4 flex flex-col items-center text-center gap-2 overflow-hidden hover:shadow-md transition-all"
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
                  className="group bg-[#101b32] border border-[#233150] rounded-xl px-4 py-3 flex items-center gap-4 hover:shadow-md hover:border-[#1877F2] transition-all"
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
          <h2 className="tech-label mb-1"><span className="mono text-[#4da3ff]">03 /</span> Browse by use case</h2>
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
                className="flex items-center gap-2.5 bg-[#0d1729] border border-[#233150] rounded-xl px-3 py-2.5 hover:border-[#1877F2] hover:bg-[#16233f] transition-all group"
              >
                <span className="text-base flex-shrink-0">{icon}</span>
                <span className="text-xs font-medium text-[#e9eef8] group-hover:text-[#1877F2] transition-colors leading-tight">{label}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="border-t border-[#233150] px-6 py-10">
        <div className="max-w-md mx-auto text-center reveal">
          <h2 className="tech-label justify-center mb-2"><span className="mono text-[#4da3ff]">04 /</span> Newsletter</h2>
          <p className="text-xs text-[#93a4c3] mb-4">Get the best new AI tools in your inbox every week.</p>
          {subscribed ? (
            <p className="text-sm text-[#1877F2] font-medium">You&apos;re in!</p>
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
              className="search-glow flex items-center bg-[#101b32] rounded-full px-4 py-2 gap-2"
            >
              <input
                type="email"
                required
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 text-sm text-[#e9eef8] bg-transparent placeholder-[#566586] focus:outline-none"
              />
              <button
                type="submit"
                className="bg-[#1877F2] hover:bg-[#166FE5] text-white text-xs font-semibold px-4 py-2 rounded-full transition-colors whitespace-nowrap flex-shrink-0"
              >
                Subscribe
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#233150] px-6 py-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#93a4c3]">
          <div className="flex items-center gap-2">
            <Logo size={18} />
            <span className="font-medium text-[#1877F2]">HowToUseMyAI</span>
          </div>
          <div className="flex flex-wrap justify-center gap-5">
            <a href="/" className="hover:text-[#1877F2] transition-colors">Home</a>
            <a href="/about" className="hover:text-[#1877F2] transition-colors">About</a>
            <a href="/compare" className="hover:text-[#1877F2] transition-colors">Comparisons</a>
            <a href="/submit" className="text-[#1877F2] hover:opacity-80 transition-opacity font-medium">Submit a Tool</a>
            <a href="/disclosure" className="hover:text-[#1877F2] transition-colors">Disclosure</a>
            <a href="/privacy" className="hover:text-[#1877F2] transition-colors">Privacy</a>
            <a href="/terms" className="hover:text-[#1877F2] transition-colors">Terms</a>
          </div>
          <p>© {new Date().getFullYear()} HowToUseMyAI</p>
        </div>
      </footer>
    </div>
  );
}
