"use client";

import type { Tool } from "@/lib/tools";

/* ──────────────────────────────────────────────────────────────
   BrandMark — real favicon/brand mark with graceful fallback.
   Shared so the directory cards wear the same logos as the
   homepage PRIORITY TARGETS instead of generic emoji, unifying
   the visual identity across routes.
   Google's favicon service is primary (fast, reliable at volume) —
   unavatar.io throttles/resets connections once a page requests more
   than a handful concurrently (e.g. the 165-tool /tools grid), which
   showed up as real page-load lag. unavatar is kept only as a
   fallback for the rare case Google has no favicon for a domain.
   (Google favicon → unavatar → hidden.)
   ────────────────────────────────────────────────────────────── */

export default function BrandMark({ tool, size = 40 }: { tool: Tool; size?: number }) {
  const inner = Math.round(size * 0.58);
  return (
    <span className="v2-mark" style={{ width: size, height: size }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`https://www.google.com/s2/favicons?domain=${tool.domain}&sz=64`}
        data-i="0"
        alt={tool.name}
        width={inner}
        height={inner}
        loading="lazy"
        onError={(e) => {
          const t = e.currentTarget;
          if (t.dataset.i === "0") { t.dataset.i = "1"; t.src = `https://unavatar.io/${tool.domain}?fallback=false`; }
          else { t.style.display = "none"; }
        }}
      />
    </span>
  );
}
