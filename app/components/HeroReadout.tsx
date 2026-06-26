"use client";

import { useEffect, useRef, useState } from "react";
import { TOOLS } from "@/lib/tools";

const NODES = TOOLS.length;
const SECTORS = new Set(TOOLS.map((t) => t.category)).size;
const FREE = TOOLS.filter((t) => t.pricing !== "Paid").length;

export default function HeroReadout() {
  // Count-up entrance animation that resolves to the REAL totals. No random
  // "scramble" — flickering digits imply live-changing data when these counts
  // are static, which would mislead. Plain-English labels, brand styling.
  const [nodes, setNodes] = useState(0);
  const [sectors, setSectors] = useState(0);
  const [free, setFree] = useState(0);
  const ready = useRef(false);

  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const dur = 1300;
    const step = (now: number) => {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setNodes(Math.round(eased * NODES));
      setSectors(Math.round(eased * SECTORS));
      setFree(Math.round(eased * FREE));
      if (p < 1) raf = requestAnimationFrame(step);
      else ready.current = true;
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="v2-readout">
      <div className="v2-stat-cell">
        <span className="v2-ping" aria-hidden="true" />
        <b>{nodes}</b>
        <em>TOOLS</em>
      </div>
      <i className="v2-readout-sep" />
      <div className="v2-stat-cell">
        <span className="v2-ping" aria-hidden="true" />
        <b>{sectors}</b>
        <em>CATEGORIES</em>
      </div>
      <i className="v2-readout-sep" />
      <div className="v2-stat-cell">
        <span className="v2-ping v2-ping-red" aria-hidden="true" />
        <b>{free}</b>
        <em>FREE TO TRY</em>
      </div>
    </div>
  );
}
