"use client";

import type { Tool } from "@/lib/tools";

/* ──────────────────────────────────────────────────────────────
   BrandMark — real favicon/brand mark with graceful fallback.
   Shared so the directory cards wear the same logos as the
   homepage PRIORITY TARGETS instead of generic emoji, unifying
   the visual identity across routes. (unavatar → Google favicon
   → hidden.)
   ────────────────────────────────────────────────────────────── */

export default function BrandMark({ tool, size = 40 }: { tool: Tool; size?: number }) {
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
        loading="lazy"
        onError={(e) => {
          const t = e.currentTarget;
          if (t.dataset.i === "0") { t.dataset.i = "1"; t.src = `https://www.google.com/s2/favicons?domain=${tool.domain}&sz=128`; }
          else { t.style.display = "none"; }
        }}
      />
    </span>
  );
}
