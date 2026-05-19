"use client";

import { useState } from "react";
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
  Free:     "bg-[#E7F3FF] text-[#1877F2]",
  Freemium: "bg-[#E7F3FF] text-[#1877F2]",
  Paid:     "bg-[#fff0f3] text-[#e41e3f]",
};

const TRENDING = [
  "YouTube video",
  "Generate images",
  "Cover letter",
  "Fix my code",
  "Make a song",
  "Research topic",
];

const HOW_IT_WORKS = [
  { icon: "💬", step: "1", title: "Describe your goal", desc: "Type what you want to do in plain English. No technical knowledge needed." },
  { icon: "🔍", step: "2", title: "We match the tools", desc: "Our system finds the best AI tools for your exact use case from 100+ options." },
  { icon: "⚡", step: "3", title: "Get started instantly", desc: "Each result comes with step-by-step instructions so you can start in minutes." },
];

const FOOTER_CATEGORIES = ["Writing", "Images", "Video", "Coding", "Music"];

function MiniToolCard({ tool }: { tool: Tool }) {
  return (
    <a
      href={`/tools/${slugify(tool.name)}`}
      className="bg-white border border-[#e4e6ea] rounded-xl p-3 flex flex-col gap-2 hover:shadow-md hover:border-[#1877F2] transition-all"
    >
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-[#f7f8fa] border border-[#e4e6ea] flex items-center justify-center overflow-hidden flex-shrink-0">
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
        <span className="text-xs font-semibold text-[#1c1e21] leading-tight">{tool.name}</span>
      </div>
      <p className="text-[10px] text-[#65676b] leading-relaxed line-clamp-2">{tool.description}</p>
    </a>
  );
}

export default function HomePage() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [activePricing, setActivePricing] = useState<PricingFilter>("All");
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const router = useRouter();

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
    <div className="flex flex-col min-h-screen bg-white">

      {/* Sticky nav */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-[#e4e6ea] px-6 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <a href="/" className="flex items-center gap-2 flex-shrink-0">
            <Logo size={24} />
            <span className="font-semibold text-[#1877F2] text-sm tracking-tight">HowToUseMyAI</span>
          </a>
<a href="/submit" className="text-xs text-[#e41e3f] font-semibold hover:opacity-80 transition-opacity whitespace-nowrap">+ Submit a Tool</a>
        </div>
      </header>

      {/* Hero — Google-style */}
      <section className="bg-white px-4 sm:px-6 pt-6 sm:pt-8 pb-6 text-center">
        <div className="max-w-2xl mx-auto">


          {/* Inline search bar */}
          <div className="search-glow flex items-center bg-white rounded-full px-4 py-2 gap-2">
            <svg className="w-4 h-4 text-[#bcc0c4] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              className="flex-1 text-sm text-[#1c1e21] bg-transparent placeholder-[#bcc0c4] focus:outline-none"
              placeholder='e.g. "I want to create a YouTube video"'
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

          {/* Trending chips — scrollable single row */}
          <div className="mt-5 pb-1">
            <span className="text-xs text-[#bcc0c4] block mb-2">Try:</span>
            <div className="grid grid-cols-3 gap-2">
            {TRENDING.map((term) => (
              <button
                key={term}
                onClick={() => handleSubmit(term)}
                className="text-xs px-3 h-10 rounded-full border border-[#e4e6ea] text-[#65676b] hover:border-[#1877F2] hover:text-[#1877F2] transition-all bg-white text-center flex items-center justify-center leading-tight"
              >
                {term}
              </button>
            ))}
            </div>
          </div>
        </div>
      </section>

      {/* Category chips */}
      <section id="tools" className="px-6 pt-5 pb-3 bg-white border-b border-[#f0f2f5]">
        <div className="max-w-6xl mx-auto grid grid-cols-3 gap-2 pb-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => { setActiveCategory(cat); scrollToTools(); }}
              className={`text-xs px-3 h-10 rounded-full border font-medium transition-all text-center flex items-center justify-center leading-tight ${
                activeCategory === cat
                  ? "bg-[#1877F2] text-white border-[#1877F2] shadow-sm shadow-[#1877F2]/20"
                  : "bg-white text-[#65676b] border-[#dddfe2] hover:border-[#1877F2] hover:text-[#1877F2]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Pricing filter */}
        <div className="max-w-6xl mx-auto flex flex-wrap gap-2 mt-3 pb-2">
          {PRICING_OPTIONS.map((p) => (
            <button
              key={p}
              onClick={() => { setActivePricing(p); scrollToTools(); }}
              className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-all whitespace-nowrap flex-shrink-0 ${
                activePricing === p
                  ? "bg-[#e41e3f] text-white border-[#e41e3f] shadow-sm shadow-[#e41e3f]/20"
                  : "bg-white text-[#65676b] border-[#dddfe2] hover:border-[#e41e3f] hover:text-[#e41e3f]"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </section>

      {/* New This Week + Editor's Picks horizontal scroll sections */}
      <section className="px-4 sm:px-6 pt-6 pb-2 bg-white border-b border-[#f0f2f5]">
        <div className="max-w-6xl mx-auto space-y-6">

          {/* New This Week */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[10px] font-bold bg-[#fff0f3] text-[#e41e3f] px-2 py-0.5 rounded-full">NEW</span>
              <h2 className="text-sm font-semibold text-[#1c1e21]">New This Week</h2>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {newThisWeekTools.map((tool) => (
                <MiniToolCard key={tool.name} tool={tool} />
              ))}
            </div>
          </div>

          {/* Editor's Picks */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[10px] font-bold bg-[#E7F3FF] text-[#1877F2] px-2 py-0.5 rounded-full">⭐ PICKS</span>
              <h2 className="text-sm font-semibold text-[#1c1e21]">Editor&apos;s Picks</h2>
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
      <section id="tool-grid" className="px-4 sm:px-6 py-8 flex-1 bg-[#f7f8fa]">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs text-[#65676b] mb-5">{filtered.length} tools available</p>
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {filtered.map((tool) => (
              <a
                key={tool.name}
                href={`/tools/${slugify(tool.name)}`}
                className="tool-card relative group bg-white border border-[#e4e6ea] rounded-xl p-4 flex flex-col gap-2 overflow-hidden hover:shadow-md transition-all"
              >
                {/* Top row: logo + badges */}
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-lg bg-[#f7f8fa] border border-[#e4e6ea] flex items-center justify-center overflow-hidden flex-shrink-0">
                    <img
                      src={`https://www.google.com/s2/favicons?domain=${tool.domain}&sz=64`}
                      alt={tool.name}
                      width={24}
                      height={24}
                      className="rounded object-contain"
                      onError={(e) => {
                        const t = e.currentTarget;
                        t.style.display = "none";
                        if (t.nextElementSibling) (t.nextElementSibling as HTMLElement).style.display = "flex";
                      }}
                    />
                    <span className="text-lg hidden items-center justify-center w-full h-full">{tool.icon}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {tool.isFeatured && (
                      <span className="text-[9px] font-bold bg-[#E7F3FF] text-[#1877F2] px-1.5 py-0.5 rounded-full">⭐</span>
                    )}
                    {tool.isNew && (
                      <span className="text-[9px] font-bold bg-[#fff0f3] text-[#e41e3f] px-1.5 py-0.5 rounded-full">NEW</span>
                    )}
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${PRICING_STYLES[tool.pricing]}`}>
                      {tool.pricing.toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Name + description */}
                <div>
                  <h3 className="text-sm font-semibold text-[#1c1e21] group-hover:text-[#1877F2] transition-colors leading-tight">
                    {tool.name}
                  </h3>
                  <p className="text-xs text-[#65676b] mt-1 leading-relaxed line-clamp-2">
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
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-white border-t border-[#e4e6ea] px-6 py-10">
        <div className="max-w-md mx-auto text-center">
          <p className="text-xs text-[#65676b] mb-4">Get the best new AI tools in your inbox every week.</p>
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
              className="search-glow flex items-center bg-white rounded-full px-4 py-2 gap-2"
            >
              <input
                type="email"
                required
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 text-sm text-[#1c1e21] bg-transparent placeholder-[#bcc0c4] focus:outline-none"
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
      <footer className="border-t border-[#e4e6ea] px-6 py-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#65676b]">
          <div className="flex items-center gap-2">
            <Logo size={18} />
            <span className="font-medium text-[#1877F2]">HowToUseMyAI</span>
          </div>
          <div className="flex gap-5">
            <a href="/" className="hover:text-[#1877F2] transition-colors">Home</a>
            <a href="/submit" className="hover:text-[#e41e3f] transition-colors text-[#e41e3f]">Submit a Tool</a>
            <a href="/privacy" className="hover:text-[#1877F2] transition-colors">Privacy</a>
            <a href="/terms" className="hover:text-[#1877F2] transition-colors">Terms</a>
          </div>
          <p>© {new Date().getFullYear()} HowToUseMyAI</p>
        </div>
      </footer>
    </div>
  );
}
