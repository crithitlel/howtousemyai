"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { TOOLS, slugify, type Tool } from "@/lib/tools";
import { tagsForTool, tagLabel, activeTags } from "@/lib/tags";
import { usePins, useCompare, MAX_COMPARE } from "@/lib/useToolStore";
import BrandMark from "./BrandMark";

// Capability + platform tags — the filtering dimension the single "sector" model lacked.
const CAP_TAG_IDS = [
  ...activeTags("capability").map((t) => t.id),
  ...activeTags("platform").map((t) => t.id),
];

const PRICING_STYLES: Record<string, string> = {
  Free: "border border-[#aaff00]/40 text-[#aaff00]",
  Freemium: "border border-[#1877F2]/30 bg-[#1877F2]/10 text-[#4da3ff]",
  Paid: "border border-[#e41e3f]/50 bg-[#e41e3f]/15 text-[#ff5c78]",
};

const CATEGORY_ICONS: Record<string, string> = {
  Writing: "✍️", Coding: "💻", Images: "🎨", Video: "🎬", Music: "🎵",
  Research: "🔍", Productivity: "⚡", Marketing: "📣", Analytics: "📊",
  Design: "🖌️", Presentations: "🖥️", Support: "💬", HR: "👥", Finance: "💰",
};

const PRICING_FILTERS = ["All", "Free", "Freemium", "Paid"] as const;
type PriceFilter = (typeof PRICING_FILTERS)[number];
type SortMode = "sector" | "az" | "za";

const catParam = (c: string) => c.toLowerCase().replace(/\s+/g, "-");

function Card({ tool }: { tool: Tool }) {
  const { isPinned, toggle: togglePin } = usePins();
  const { inCompare, toggle: toggleCompare, isFull } = useCompare();
  const pinned = isPinned(tool.name);
  const comparing = inCompare(tool.name);

  const stop = (e: React.MouseEvent) => { e.preventDefault(); e.stopPropagation(); };

  return (
    <Link
      href={`/tools/${slugify(tool.name)}`}
      className="tcard glass-card flex flex-col border border-[#233150] rounded-xl p-3.5 group"
    >
      <i className="v2-cb v2-cb-tl" /><i className="v2-cb v2-cb-tr" /><i className="v2-cb v2-cb-bl" /><i className="v2-cb v2-cb-br" />
      <div className="flex items-start gap-3">
        <BrandMark tool={tool} size={36} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="text-sm font-semibold text-[#e9eef8] group-hover:text-[#4da3ff] transition-colors truncate">
              {tool.name}
            </span>
            {tool.isFeatured && (
              <span className="text-[10px] font-bold bg-[#142a4d] text-[#1877F2] rounded-full px-1.5 py-0.5 flex-shrink-0">TOP</span>
            )}
            {/* pin / compare controls */}
            <span className="tcard-tools ml-auto flex items-center gap-1 flex-shrink-0">
              <button
                type="button"
                className={`tcard-cmp ${comparing ? "is-on" : ""}`}
                onClick={(e) => { stop(e); toggleCompare(tool.name); }}
                disabled={!comparing && isFull}
                title={comparing ? "Remove from compare" : isFull ? `Compare is full (${MAX_COMPARE} max)` : "Add to compare"}
                aria-label="Toggle compare"
              >⇄</button>
              <button
                type="button"
                className={`tcard-pin ${pinned ? "is-on" : ""}`}
                onClick={(e) => { stop(e); togglePin(tool.name); }}
                title={pinned ? "Unpin node" : "Pin node"}
                aria-label="Toggle pin"
              >{pinned ? "★" : "☆"}</button>
            </span>
          </div>
          <p className="text-xs text-[#93a4c3] leading-snug line-clamp-2">{tool.description}</p>
          <div className="flex items-center justify-between mt-1.5">
            <span className={`inline-block text-[10px] font-bold rounded-full px-2 py-0.5 ${PRICING_STYLES[tool.pricing]}`}>
              {tool.pricing.toUpperCase()}
            </span>
            <span className="tcard-go mono text-[10px] tracking-[0.15em]">OPEN →</span>
          </div>
        </div>
      </div>
      {/* hover telemetry readout — real capability tags, not a fabricated metric */}
      <div className="tcard-readout">
        <span className="tcard-ro-k">SECTOR</span>
        <span className="tcard-ro-v">{tool.category}</span>
        {tagsForTool(tool.name).filter((t) => CAP_TAG_IDS.includes(t)).slice(0, 2).map((t) => (
          <span key={t} className="tcard-ro-tag">{tagLabel(t)}</span>
        ))}
      </div>
    </Link>
  );
}

export default function ToolsBrowser() {
  const categories = useMemo(() => Array.from(new Set(TOOLS.map((t) => t.category))).sort(), []);
  const router = useRouter();
  const searchParams = useSearchParams();

  // ── initialise from URL (shareable / indexable filtered views) ──
  const initPrice = (() => {
    const v = (searchParams.get("license") || "").toLowerCase();
    return (PRICING_FILTERS.find((p) => p.toLowerCase() === v) ?? "All") as PriceFilter;
  })();
  const initCat = (() => {
    const v = (searchParams.get("sector") || "").toLowerCase();
    return categories.find((c) => catParam(c) === v) ?? "All";
  })();
  const initSort = (() => {
    const v = (searchParams.get("sort") || "").toLowerCase();
    return (["sector", "az", "za"].includes(v) ? v : "sector") as SortMode;
  })();

  const initTag = (() => {
    const v = (searchParams.get("tag") || "").toLowerCase();
    return CAP_TAG_IDS.includes(v) ? v : "All";
  })();

  const [price, setPrice] = useState<PriceFilter>(initPrice);
  const [cat, setCat] = useState<string>(initCat);
  const [tag, setTag] = useState<string>(initTag);
  const [sort, setSort] = useState<SortMode>(initSort);

  // Capability tags, with live counts under the current sector/price filters.
  const capTags = useMemo(() => activeTags("capability").concat(activeTags("platform")), []);

  // ── sync state → URL ──
  useEffect(() => {
    const params = new URLSearchParams();
    if (price !== "All") params.set("license", price.toLowerCase());
    if (cat !== "All") params.set("sector", catParam(cat));
    if (tag !== "All") params.set("tag", tag);
    if (sort !== "sector") params.set("sort", sort);
    const qs = params.toString();
    router.replace(qs ? `/tools?${qs}` : "/tools", { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [price, cat, tag, sort]);

  const filtered = useMemo(() => {
    let list = TOOLS.filter(
      (t) =>
        (price === "All" || t.pricing === price) &&
        (cat === "All" || t.category === cat) &&
        (tag === "All" || tagsForTool(t.name).includes(tag))
    );
    if (sort === "az") list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    else if (sort === "za") list = [...list].sort((a, b) => b.name.localeCompare(a.name));
    return list;
  }, [price, cat, tag, sort]);

  const grouped = sort === "sector" && cat === "All" && tag === "All";

  return (
    <div>
      {/* Control deck */}
      <div className="tools-deck mb-8">
        <div className="tools-deck-row">
          <span className="tools-deck-lbl">LICENSE</span>
          {PRICING_FILTERS.map((p) => (
            <button
              key={p}
              onClick={() => setPrice(p)}
              className={`deck-chip ${price === p ? "is-on" : ""}`}
            >
              {p === "All" ? "All" : p}
            </button>
          ))}
          <span className="tools-deck-spacer" />
          <span className="tools-deck-lbl">SORT</span>
          <div className="deck-seg">
            <button onClick={() => setSort("sector")} className={`deck-seg-btn ${sort === "sector" ? "is-on" : ""}`}>SECTOR</button>
            <button onClick={() => setSort("az")} className={`deck-seg-btn ${sort === "az" ? "is-on" : ""}`}>A–Z</button>
            <button onClick={() => setSort("za")} className={`deck-seg-btn ${sort === "za" ? "is-on" : ""}`}>Z–A</button>
          </div>
        </div>
        <div className="tools-deck-row tools-deck-cats">
          <span className="tools-deck-lbl">SECTOR</span>
          <button onClick={() => setCat("All")} className={`deck-chip ${cat === "All" ? "is-on" : ""}`}>All</button>
          {categories.map((c) => (
            <button key={c} onClick={() => setCat(c)} className={`deck-chip ${cat === c ? "is-on" : ""}`}>
              <span className="mr-1">{CATEGORY_ICONS[c] ?? "🤖"}</span>{c}
              <span className="text-[#5d6f93] ml-1">{TOOLS.filter((t) => t.category === c).length}</span>
            </button>
          ))}
        </div>
        <div className="tools-deck-row tools-deck-cats">
          <span className="tools-deck-lbl">CAPABILITY</span>
          <button onClick={() => setTag("All")} className={`deck-chip ${tag === "All" ? "is-on" : ""}`}>All</button>
          {capTags.map((t) => (
            <button key={t.id} onClick={() => setTag(tag === t.id ? "All" : t.id)} className={`deck-chip ${tag === t.id ? "is-on" : ""}`}>
              {t.label}
              <span className="text-[#5d6f93] ml-1">{t.count}</span>
            </button>
          ))}
        </div>
        <div className="tools-deck-count mono">
          <span className="status-dot" /> {filtered.length} {filtered.length === 1 ? "TOOL" : "TOOLS"} MATCH
          {(price !== "All" || cat !== "All" || tag !== "All" || sort !== "sector") && (
            <button className="deck-reset" onClick={() => { setPrice("All"); setCat("All"); setTag("All"); setSort("sector"); }}>✕ CLEAR</button>
          )}
        </div>
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="tools-empty mono">NO SIGNAL · NO TOOLS MATCH THESE FILTERS</div>
      ) : grouped ? (
        <div className="space-y-12">
          {categories
            .filter((c) => filtered.some((t) => t.category === c))
            .map((c) => {
              const catTools = filtered.filter((t) => t.category === c);
              return (
                <section key={c} id={c.toLowerCase()}>
                  <div className="v2-catbar">
                    <span className="v2-catbar-ico">{CATEGORY_ICONS[c] ?? "🤖"}</span>
                    <h2 className="v2-catbar-name">{c}</h2>
                    <span className="v2-catbar-rule" />
                    <span className="v2-catbar-count">{String(catTools.length).padStart(2, "0")} UNITS</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {catTools.map((tool) => <Card key={tool.name} tool={tool} />)}
                  </div>
                </section>
              );
            })}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map((tool) => <Card key={tool.name} tool={tool} />)}
        </div>
      )}
    </div>
  );
}
