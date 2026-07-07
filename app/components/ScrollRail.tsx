"use client";

import { useEffect, useState } from "react";

// Isolated so scroll-driven updates don't force the whole page to re-render.
export default function ScrollRail() {
  const [scrollPct, setScrollPct] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      setScrollPct(max > 0 ? Math.round((h.scrollTop / max) * 100) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="v2-scrollrail" aria-hidden="true">
      <span className="v2-scrollrail-pct">{String(scrollPct).padStart(3, "0")}<em>%</em></span>
      <span className="v2-scrollrail-track"><i style={{ height: `${scrollPct}%` }} /></span>
      <span className="v2-scrollrail-label">SCROLL // DEPTH</span>
    </div>
  );
}
