"use client";

import { useEffect, useRef, useState } from "react";

/* ──────────────────────────────────────────────────────────────
   SystemBackdrop — a global "living AI OS" ambient engine.
   Mounted once site-wide (behind all content, pointer-events:none).
   Every layer implies system activity: scanning, computing,
   targeting, networking, processing. Lean JS (one rAF mouse
   handler + randomized tickers); all motion is GPU transform/
   opacity. Heavy gutter HUD only appears on wide screens where
   the centered content leaves empty side margins, so the engine
   never competes with usability. Reduced-motion aware.
   ────────────────────────────────────────────────────────────── */

type Node = { x: number; y: number; s: number; dur: number; delay: number; depth: number };
type Stream = { x: number; dur: number; delay: number; len: number; red: boolean };

// peripheral neural web — hugs the edges, never crosses center content
const NET: { x1: number; y1: number; x2: number; y2: number; red?: boolean }[] = [
  { x1: 4, y1: 14, x2: 18, y2: 40 },
  { x1: 18, y1: 40, x2: 7, y2: 74, red: true },
  { x1: 96, y1: 18, x2: 84, y2: 46 },
  { x1: 84, y1: 46, x2: 93, y2: 80 },
  { x1: 84, y1: 46, x2: 96, y2: 18, red: true },
  { x1: 4, y1: 14, x2: 18, y2: 40 },
];

export default function SystemBackdrop() {
  const rootRef = useRef<HTMLDivElement>(null);

  // random-driven decoration → client-only to avoid SSR hydration mismatch
  const [nodes, setNodes] = useState<Node[]>([]);
  const [streams, setStreams] = useState<Stream[]>([]);

  // populate procedural decoration once on the client
  useEffect(() => {
    setNodes(
      Array.from({ length: 30 }, () => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        s: 0.6 + Math.random() * 1.6,
        dur: 4 + Math.random() * 6,
        delay: Math.random() * 8,
        depth: 0.25 + Math.random() * 0.85,
      }))
    );
    setStreams(
      Array.from({ length: 11 }, () => ({
        x: Math.random() * 100,
        dur: 7 + Math.random() * 9,
        delay: Math.random() * 12,
        len: 60 + Math.random() * 120,
        red: Math.random() < 0.22,
      }))
    );
  }, []);

  // intelligent mouse interaction — environmental light + parallax (rAF throttled)
  useEffect(() => {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    let mx = 0.5;
    let my = 0.32;
    const apply = () => {
      raf = 0;
      const el = rootRef.current;
      if (!el) return;
      el.style.setProperty("--mx", mx.toFixed(4));
      el.style.setProperty("--my", my.toFixed(4));
      el.style.setProperty("--px", (mx - 0.5).toFixed(4));
      el.style.setProperty("--py", (my - 0.5).toFixed(4));
    };
    const onMove = (e: MouseEvent) => {
      mx = e.clientX / window.innerWidth;
      my = e.clientY / window.innerHeight;
      if (!raf) raf = requestAnimationFrame(apply);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={rootRef} className="sysbg" aria-hidden="true">
      {/* dynamic environmental lighting — tracks the cursor */}
      <div className="sysbg-light" />

      {/* rotating blueprint geometry */}
      <div className="sysbg-blueprint">
        <span className="sysbg-ring sysbg-ring-1" />
        <span className="sysbg-ring sysbg-ring-2" />
        <span className="sysbg-ring sysbg-ring-3" />
        <span className="sysbg-hex" />
      </div>

      {/* procedural radar sweep */}
      <div className="sysbg-radar"><i /></div>

      {/* orbital nodes */}
      <div className="sysbg-orbits">
        <span className="sysbg-orbit sysbg-orbit-1"><i /></span>
        <span className="sysbg-orbit sysbg-orbit-2"><i className="is-red" /></span>
        <span className="sysbg-orbit sysbg-orbit-3"><i /></span>
      </div>

      {/* neural network + traveling packets */}
      <svg className="sysbg-net" viewBox="0 0 100 100" preserveAspectRatio="none">
        {NET.map((s, i) => (
          <g key={i}>
            <line x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2} className="sysbg-net-line" vectorEffect="non-scaling-stroke" />
            <line
              x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2}
              pathLength={100}
              className={`sysbg-net-pkt ${s.red ? "is-red" : ""}`}
              vectorEffect="non-scaling-stroke"
              style={{ animationDelay: `${i * 1.3}s` }}
            />
          </g>
        ))}
      </svg>

      {/* particle data streams */}
      <div className="sysbg-streams">
        {streams.map((s, i) => (
          <i
            key={i}
            className={s.red ? "is-red" : ""}
            style={{
              left: `${s.x}%`,
              height: s.len,
              animationDuration: `${s.dur}s`,
              animationDelay: `${s.delay}s`,
            }}
          />
        ))}
      </div>

      {/* parallax particles */}
      <div className="sysbg-nodes">
        {nodes.map((n, i) => (
          <i
            key={i}
            style={{
              left: `${n.x}%`,
              top: `${n.y}%`,
              width: n.s,
              height: n.s,
              ["--nd" as string]: n.depth,
              animationDuration: `${n.dur}s`,
              animationDelay: `${n.delay}s`,
            }}
          />
        ))}
      </div>

    </div>
  );
}
