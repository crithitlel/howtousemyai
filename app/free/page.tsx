import Link from "next/link";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import BrandMark from "../components/BrandMark";
import { TOOLS, slugify } from "@/lib/tools";

export const metadata = {
  title: "Best Free AI Tools (2026) — HowToUseMyAI",
  description: "Hand-picked free AI tools you can use right now with no credit card required.",
  openGraph: {
    title: "Best Free AI Tools (2026) — HowToUseMyAI",
    description: "Hand-picked free AI tools you can use right now with no credit card required.",
  },
};

const freeTools = TOOLS.filter((t) => t.pricing === "Free");

const CATEGORY_ICONS: Record<string, string> = {
  Writing: "✍️", Coding: "💻", Images: "🎨", Video: "🎬", Music: "🎵",
  Research: "🔍", Productivity: "⚡", Marketing: "📣", Analytics: "📊",
  Design: "🖌️", Presentations: "🖥️", Support: "💬", HR: "👥", Finance: "💰",
};

export default function FreeToolsPage() {
  const byCategory = freeTools.reduce<Record<string, typeof freeTools>>((acc, tool) => {
    if (!acc[tool.category]) acc[tool.category] = [];
    acc[tool.category].push(tool);
    return acc;
  }, {});

  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader active="/free" />

      <main className="v2-page">
        <div className="v2-pagehead">
          <div className="v2-crumb">
            <Link href="/">HOME</Link>
            <i>//</i>
            <span className="v2-crumb-cur">FREE</span>
          </div>
          <h1 className="v2-pagetitle">FREE<span className="v2-tred">.</span>ACCESS</h1>
          <p className="v2-pagelead">
            <b>{freeTools.length}</b> instruments with genuinely free plans — no trial, no card, no catch.
          </p>
          <div className="v2-readbar">
            <span className="flex items-center gap-2"><i className="v2-dot v2-dot-ok" /> FREE INDEX</span>
            <span className="v2-readbar-sep" />
            <span><b>{freeTools.length}</b> <span className="v2-readbar-dim">NODES</span></span>
            <span className="v2-readbar-sep" />
            <span><b>{Object.keys(byCategory).length}</b> <span className="v2-readbar-dim">SECTORS</span></span>
          </div>
        </div>

        <div className="space-y-12">
          {Object.entries(byCategory).map(([category, tools]) => (
            <section key={category} id={category.toLowerCase()}>
              <div className="v2-catbar">
                <span className="v2-catbar-ico">{CATEGORY_ICONS[category] ?? "🤖"}</span>
                <h2 className="v2-catbar-name">{category}</h2>
                <span className="v2-catbar-rule" />
                <span className="v2-catbar-count">{String(tools.length).padStart(2, "0")} UNITS</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {tools.map((tool) => (
                  <Link
                    key={tool.name}
                    href={`/tools/${slugify(tool.name)}`}
                    className="tcard glass-card group border border-[#233150] rounded-xl p-3.5 flex items-start gap-3"
                  >
                    <i className="v2-cb v2-cb-tl" /><i className="v2-cb v2-cb-tr" /><i className="v2-cb v2-cb-bl" /><i className="v2-cb v2-cb-br" />
                    <BrandMark tool={tool} size={36} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm font-semibold text-[#e9eef8] group-hover:text-[#4da3ff] transition-colors truncate">
                          {tool.name}
                        </h3>
                        <span className="text-[9px] font-bold border border-[#aaff00]/40 text-[#aaff00] px-1.5 py-0.5 rounded-full flex-shrink-0">FREE</span>
                      </div>
                      <p className="text-xs text-[#93a4c3] leading-relaxed line-clamp-2">{tool.description}</p>
                      <div className="flex items-center justify-end mt-1.5">
                        <span className="tcard-go mono text-[10px] tracking-[0.15em]">OPEN →</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
