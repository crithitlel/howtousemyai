import Link from "next/link";
import type { Metadata } from "next";
import { TOOLS, slugify } from "@/lib/tools";
import Logo from "../components/Logo";

export const metadata: Metadata = {
  title: "All AI Tools Directory — HowToUseMyAI",
  description: "Browse 160+ AI tools across writing, coding, image generation, video, music, research, productivity, and more. Free, freemium, and paid options.",
  openGraph: {
    title: "All AI Tools Directory — HowToUseMyAI",
    description: "Browse 160+ AI tools across every category.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "All AI Tools Directory — HowToUseMyAI",
    description: "Browse 160+ AI tools across every category.",
  },
};

const PRICING_STYLES: Record<string, string> = {
  Free: "bg-green-50 text-green-700",
  Freemium: "bg-[#E7F3FF] text-[#1877F2]",
  Paid: "bg-[#fff0f3] text-[#e41e3f]",
};

const CATEGORY_ICONS: Record<string, string> = {
  Writing: "✍️",
  Coding: "💻",
  Images: "🎨",
  Video: "🎬",
  Music: "🎵",
  Research: "🔍",
  Productivity: "⚡",
  Marketing: "📣",
  Analytics: "📊",
  Design: "🖌️",
  Presentations: "🖥️",
  Support: "💬",
  HR: "👥",
  Finance: "💰",
};

const schema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "AI Tools Directory",
  description: "Browse 160+ AI tools across every category.",
  url: "https://howtousemyai.com/tools",
};

export default function ToolsIndexPage() {
  const categories = Array.from(new Set(TOOLS.map((t) => t.category))).sort();

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <header className="sticky top-0 z-20 bg-white border-b border-[#e4e6ea] px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <Logo size={28} />
            <span className="font-semibold text-[#1877F2] text-sm tracking-tight">HowToUseMyAI</span>
          </Link>
          <Link href="/submit" className="text-xs text-[#e41e3f] font-medium hover:opacity-80">+ Submit a Tool</Link>
        </div>
      </header>

      <main className="flex-1 px-4 sm:px-6 py-12 max-w-5xl mx-auto w-full">
        <div className="mb-10">
          <div className="flex items-center gap-2 text-xs text-[#65676b] mb-4">
            <Link href="/" className="hover:text-[#1877F2]">Home</Link>
            <span>/</span>
            <span>All Tools</span>
          </div>
          <h1 className="text-3xl font-semibold text-[#1c1e21] mb-3" style={{ fontFamily: "var(--font-playfair), serif" }}>
            All AI Tools
          </h1>
          <p className="text-[#65676b] text-sm leading-relaxed max-w-2xl">
            Browse {TOOLS.length}+ AI tools across {categories.length} categories. Click any tool to see a full guide, pricing, and how to get started.
          </p>
        </div>

        {/* Category jump links */}
        <div className="flex flex-wrap gap-2 mb-10">
          {categories.map((cat) => (
            <a
              key={cat}
              href={`#${cat.toLowerCase()}`}
              className="flex items-center gap-1.5 bg-[#f7f8fa] border border-[#e4e6ea] rounded-full px-3 py-1.5 text-xs font-medium text-[#65676b] hover:border-[#1877F2] hover:text-[#1877F2] transition-colors"
            >
              <span>{CATEGORY_ICONS[cat] ?? "🤖"}</span>
              {cat}
              <span className="text-[#bcc0c4]">({TOOLS.filter((t) => t.category === cat).length})</span>
            </a>
          ))}
        </div>

        {/* Tools by category */}
        <div className="space-y-12">
          {categories.map((cat) => {
            const catTools = TOOLS.filter((t) => t.category === cat);
            return (
              <section key={cat} id={cat.toLowerCase()}>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xl">{CATEGORY_ICONS[cat] ?? "🤖"}</span>
                  <h2 className="text-lg font-semibold text-[#1c1e21]">{cat}</h2>
                  <span className="text-xs text-[#65676b] bg-[#f7f8fa] border border-[#e4e6ea] rounded-full px-2 py-0.5">{catTools.length}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {catTools.map((tool) => (
                    <Link
                      key={tool.name}
                      href={`/tools/${slugify(tool.name)}`}
                      className="flex items-start gap-3 bg-white border border-[#e4e6ea] rounded-xl p-3.5 hover:border-[#1877F2] hover:shadow-sm transition-all group"
                    >
                      <div className="w-9 h-9 rounded-lg bg-[#f7f8fa] border border-[#e4e6ea] flex items-center justify-center text-lg flex-shrink-0">
                        {tool.icon}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className="text-sm font-semibold text-[#1c1e21] group-hover:text-[#1877F2] transition-colors truncate">
                            {tool.name}
                          </span>
                          {tool.isFeatured && (
                            <span className="text-[10px] font-bold bg-[#E7F3FF] text-[#1877F2] rounded-full px-1.5 py-0.5 flex-shrink-0">TOP</span>
                          )}
                        </div>
                        <p className="text-xs text-[#65676b] leading-snug line-clamp-2">{tool.description}</p>
                        <span className={`inline-block mt-1.5 text-[10px] font-bold rounded-full px-2 py-0.5 ${PRICING_STYLES[tool.pricing]}`}>
                          {tool.pricing.toUpperCase()}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            );
          })}
        </div>

        <div className="mt-12 bg-[#f7f8fa] rounded-xl p-6 text-center">
          <p className="text-sm text-[#65676b] mb-3">Know what you want to accomplish but not which tool to pick?</p>
          <Link
            href="/recommend"
            className="bg-[#1877F2] text-white text-sm font-semibold px-6 py-3 rounded-lg hover:bg-[#166FE5] transition-colors inline-block"
          >
            Get a personalised AI recommendation
          </Link>
        </div>
      </main>

      <footer className="border-t border-[#e4e6ea] px-6 py-6">
        <div className="max-w-5xl mx-auto flex flex-wrap gap-4 justify-between items-center text-xs text-[#65676b]">
          <Link href="/" className="flex items-center gap-2">
            <Logo size={18} />
            <span>HowToUseMyAI</span>
          </Link>
          <div className="flex gap-4 flex-wrap">
            <Link href="/best-ai-for" className="hover:text-[#1877F2]">Browse by Use Case</Link>
            <Link href="/compare" className="hover:text-[#1877F2]">Comparisons</Link>
          </div>
          <Link href="/privacy" className="hover:text-[#1877F2]">Privacy</Link>
        </div>
      </footer>
    </div>
  );
}
