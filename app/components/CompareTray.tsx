"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { TOOLS, slugify, type Tool } from "@/lib/tools";
import { useCompare, MAX_COMPARE } from "@/lib/useToolStore";
import { findCompareSlug } from "@/lib/compareSlugs";
import { getToolUrl } from "@/lib/affiliates";

const PRICING_STYLES: Record<string, string> = {
  Free: "border border-[#aaff00]/40 text-[#aaff00]",
  Freemium: "border border-[#1877F2]/30 bg-[#1877F2]/10 text-[#4da3ff]",
  Paid: "border border-[#e41e3f]/50 bg-[#e41e3f]/15 text-[#ff5c78]",
};

function Mark({ tool, size = 38 }: { tool: Tool; size?: number }) {
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
          if (t.dataset.i === "0") { t.dataset.i = "1"; t.src = `https://www.google.com/s2/favicons?domain=${tool.domain}&sz=64`; }
          else { t.style.display = "none"; }
        }}
      />
    </span>
  );
}

export default function CompareTray() {
  const { compare, remove, clear } = useCompare();
  const [open, setOpen] = useState(false);

  const tools = useMemo(
    () => compare.map((n) => TOOLS.find((t) => t.name === n)).filter(Boolean) as Tool[],
    [compare]
  );

  // lock scroll while drawer open
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // auto-close drawer if everything was removed
  useEffect(() => { if (tools.length === 0) setOpen(false); }, [tools.length]);

  const verdictSlug = tools.length === 2 ? findCompareSlug(tools[0].name, tools[1].name) : null;
  const sameCategory = tools.length > 1 && tools.every((t) => t.category === tools[0].category);

  if (tools.length === 0) return null;

  return (
    <>
      {/* floating tray */}
      <div className={`cmp-tray ${open ? "is-hidden" : ""}`} role="region" aria-label="Compare tray">
        <span className="cmp-tray-tag mono">
          <span className="status-dot" /> COMPARE
          <em>{tools.length}/{MAX_COMPARE}</em>
        </span>
        <div className="cmp-tray-chips">
          {tools.map((t) => (
            <span key={t.name} className="cmp-chip">
              <span className="cmp-chip-ico">{t.icon}</span>
              <span className="cmp-chip-name">{t.name}</span>
              <button className="cmp-chip-x" onClick={() => remove(t.name)} aria-label={`Remove ${t.name}`}>✕</button>
            </span>
          ))}
        </div>
        <button className="cmp-tray-clear" onClick={clear}>CLEAR</button>
        <button
          className="cmp-tray-go"
          onClick={() => setOpen(true)}
          disabled={tools.length < 2}
        >
          COMPARE <i>▸</i>
        </button>
      </div>

      {/* drawer */}
      {open && (
        <div className="cmp-overlay" onClick={() => setOpen(false)} role="dialog" aria-modal="true" aria-label="Comparison">
          <div className="cmp-drawer" onClick={(e) => e.stopPropagation()}>
            <i className="v2-cb v2-cb-tl v2-hero-cb" /><i className="v2-cb v2-cb-tr v2-hero-cb" />
            <i className="v2-cb v2-cb-bl v2-hero-cb" /><i className="v2-cb v2-cb-br v2-hero-cb" />

            <div className="cmp-drawer-head">
              <span className="cmp-drawer-prompt">{">"}</span>
              <span className="cmp-drawer-title">SIDE&#8209;BY&#8209;SIDE ANALYSIS</span>
              <span className="cmp-drawer-meta mono">{tools.length} NODES{sameCategory ? ` · ${tools[0].category.toUpperCase()}` : ""}</span>
              <button className="cmp-drawer-close" onClick={() => setOpen(false)} aria-label="Close">ESC</button>
            </div>

            <div className="cmp-grid" style={{ gridTemplateColumns: `repeat(${tools.length}, minmax(0,1fr))` }}>
              {tools.map((t) => (
                <div key={t.name} className="cmp-col">
                  <button className="cmp-col-x" onClick={() => remove(t.name)} aria-label={`Remove ${t.name}`}>✕</button>
                  <div className="cmp-col-head">
                    <Mark tool={t} size={46} />
                    <Link href={`/tools/${slugify(t.name)}`} className="cmp-col-name" onClick={() => setOpen(false)}>{t.name}</Link>
                  </div>

                  <div className="cmp-row">
                    <span className="cmp-row-k mono">SECTOR</span>
                    <span className="cmp-row-v">{t.category}</span>
                  </div>
                  <div className="cmp-row">
                    <span className="cmp-row-k mono">LICENSE</span>
                    <span className={`cmp-pill ${PRICING_STYLES[t.pricing]}`}>{t.pricing.toUpperCase()}</span>
                  </div>
                  <div className="cmp-row cmp-row-desc">
                    <span className="cmp-row-k mono">BRIEF</span>
                    <span className="cmp-row-v">{t.description}</span>
                  </div>

                  <div className="cmp-col-actions">
                    <Link href={`/tools/${slugify(t.name)}`} className="cmp-act-dossier" onClick={() => setOpen(false)}>DOSSIER ▸</Link>
                    <a href={getToolUrl(t.name, t.url)} target="_blank" rel="sponsored noopener noreferrer" className="cmp-act-visit">VISIT ↗</a>
                  </div>
                </div>
              ))}
            </div>

            <div className="cmp-drawer-foot">
              {verdictSlug ? (
                <Link href={`/compare/${verdictSlug}`} className="cmp-verdict-btn" onClick={() => setOpen(false)}>
                  READ FULL VERDICT · {tools[0].name} vs {tools[1].name} ▸
                </Link>
              ) : (
                <span className="cmp-foot-note mono">// NO EDITORIAL VERDICT ON FILE FOR THIS PAIR</span>
              )}
              <button className="cmp-foot-clear" onClick={() => { clear(); setOpen(false); }}>CLEAR ALL</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
