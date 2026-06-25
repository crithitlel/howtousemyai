import Link from "next/link";
import Logo from "../components/Logo";
import { TOOLS, slugify } from "@/lib/tools";

export const metadata = {
  title: "Best Free AI Tools (2026) — HowToUseMyAI",
  description: "Hand-picked free AI tools you can use right now with no credit card required. Updated monthly.",
  openGraph: {
    title: "Best Free AI Tools (2026) — HowToUseMyAI",
    description: "Hand-picked free AI tools you can use right now with no credit card required.",
  },
};

const freeTools = TOOLS.filter((t) => t.pricing === "Free");

export default function FreeToolsPage() {
  const byCategory = freeTools.reduce<Record<string, typeof freeTools>>((acc, tool) => {
    if (!acc[tool.category]) acc[tool.category] = [];
    acc[tool.category].push(tool);
    return acc;
  }, {});

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-[#d0ddf5] px-6 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <a href="/" className="flex items-center gap-2 flex-shrink-0">
            <Logo size={24} />
            <span className="brand-mark">HowToUseMy<span className="brand-ai">AI</span></span>
          </a>
          <Link href="/" className="back-link whitespace-nowrap">← Back to home</Link>
        </div>
      </header>

      <main className="flex-1 px-6 py-12">
        <div className="max-w-6xl mx-auto">

          {/* Hero */}
          <div className="text-center mb-12">
            <span className="inline-block mono text-[10px] tracking-[0.3em] text-[#1877F2] uppercase mb-3 bg-[#eef4ff] px-3 py-1 rounded-full">
              Free — no credit card required
            </span>
            <h1 className="display-head text-3xl sm:text-4xl font-bold text-[#1a2240] mb-4">
              Best Free AI Tools ({new Date().getFullYear()})
            </h1>
            <p className="text-sm text-[#4a6090] max-w-xl mx-auto leading-relaxed">
              {freeTools.length} hand-picked AI tools with completely free plans — no trials, no credit card, no catch.
              Updated monthly.
            </p>
          </div>

          {/* Category sections */}
          {Object.entries(byCategory).map(([category, tools]) => (
            <section key={category} className="mb-10">
              <h2 className="tech-label mb-4">
                <span className="mono text-[#1877F2]">//</span> {category}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {tools.map((tool) => (
                  <a
                    key={tool.name}
                    href={`/tools/${slugify(tool.name)}`}
                    className="glass-card group bg-white border border-[#d0ddf5] rounded-xl p-4 flex items-start gap-3 hover:border-[#1877F2] hover:shadow-sm hover:-translate-y-0.5 transition-all"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#eef3ff] border border-[#d0ddf5] flex items-center justify-center overflow-hidden flex-shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={`https://www.google.com/s2/favicons?domain=${tool.domain}&sz=64`}
                        alt={tool.name}
                        width={24}
                        height={24}
                        className="rounded object-contain"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm font-semibold text-[#1a2240] group-hover:text-[#1877F2] transition-colors truncate">
                          {tool.name}
                        </h3>
                        <span className="text-[9px] font-bold bg-[#eef3ff] text-[#1877F2] px-1.5 py-0.5 rounded-full flex-shrink-0">FREE</span>
                      </div>
                      <p className="text-xs text-[#4a6090] leading-relaxed line-clamp-2">{tool.description}</p>
                    </div>
                  </a>
                ))}
              </div>
            </section>
          ))}

          {/* CTA */}
          <div className="mt-12 text-center border-t border-[#d0ddf5] pt-10">
            <p className="text-sm text-[#4a6090] mb-4">Need a specific AI tool? Describe your task and we&apos;ll match you.</p>
            <a
              href="/"
              className="inline-block bg-[#1877F2] hover:bg-[#166FE5] text-white text-sm font-semibold px-6 py-3 rounded-full transition-colors"
            >
              Find My AI Tool →
            </a>
          </div>
        </div>
      </main>

      <footer className="border-t border-[#d0ddf5] px-6 py-8 mt-10">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#8a9bb8]">
          <p>© {new Date().getFullYear()} HowToUseMyAI. All rights reserved.</p>
          <div className="flex gap-5">
            <Link href="/tools" className="nav-link">All Tools</Link>
            <Link href="/disclosure" className="nav-link">Disclosure</Link>
            <Link href="/privacy" className="nav-link">Privacy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
