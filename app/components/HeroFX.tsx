"use client";

import { useEffect, useState } from "react";

type Particle = { x: number; y: number; s: number; d: number; delay: number; dur: number };

/* ──────────────────────────────────────────────────────────
   HeroFX — JS-driven depth layers for the command-center hero.
   Purely ABSTRACT decoration: parallax particles, peripheral
   connection lines with traveling packets, and soft pulse
   markers. Deliberately NO data-shaped readouts (telemetry,
   status text, etc.) — nothing here implies real system state.
   Slow, subtle, reduced-motion aware. Mounts INSIDE .v2-hero so
   it inherits the hero's --px/--py parallax custom properties.
   ────────────────────────────────────────────────────────── */

// loose peripheral web — avoids the central content zone
const SEGMENTS: { x1: number; y1: number; x2: number; y2: number; red?: boolean }[] = [
  { x1: 9, y1: 19, x2: 38, y2: 13 },
  { x1: 38, y1: 13, x2: 90, y2: 20, red: true },
  { x1: 90, y1: 20, x2: 85, y2: 72 },
  { x1: 85, y1: 72, x2: 24, y2: 78 },
  { x1: 24, y1: 78, x2: 9, y2: 19, red: true },
  { x1: 9, y1: 19, x2: 16, y2: 50 },
  { x1: 85, y1: 72, x2: 62, y2: 40 },
];

export default function HeroFX() {
  // particles are generated client-side only (random → avoids SSR hydration mismatch)
  const [particles, setParticles] = useState<Particle[]>([]);
  useEffect(() => {
    setParticles(
      Array.from({ length: 26 }, () => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        s: 0.6 + Math.random() * 1.7,
        d: 0.3 + Math.random() * 0.8, // parallax depth
        delay: Math.random() * 6,
        dur: 3 + Math.random() * 4,
      }))
    );
  }, []);

  const [marks, setMarks] = useState<{ id: number; x: number; y: number; red: boolean }[]>([]);

  useEffect(() => {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

    let mid = 0;
    const markIv = setInterval(() => {
      const id = ++mid;
      const m = { id, x: 16 + Math.random() * 68, y: 14 + Math.random() * 64, red: Math.random() < 0.4 };
      setMarks((prev) => [...prev, m]);
      setTimeout(() => setMarks((prev) => prev.filter((k) => k.id !== id)), 1700);
    }, 2400);

    return () => {
      clearInterval(markIv);
    };
  }, []);

  return (
    <>
      {/* parallax star particles */}
      <div className="v2-particles" aria-hidden="true">
        {particles.map((p, i) => (
          <i
            key={i}
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.s,
              height: p.s,
              ["--pd" as string]: p.d,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.dur}s`,
            }}
          />
        ))}
      </div>

      {/* neural connection lines + traveling data packets */}
      <svg className="v2-neural" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        {SEGMENTS.map((s, i) => (
          <g key={i}>
            <line x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2} className="v2-neural-line" vectorEffect="non-scaling-stroke" />
            <line
              x1={s.x1}
              y1={s.y1}
              x2={s.x2}
              y2={s.y2}
              pathLength={100}
              className={`v2-neural-pkt ${s.red ? "is-red" : ""}`}
              vectorEffect="non-scaling-stroke"
              style={{ animationDelay: `${i * 0.8}s` }}
            />
          </g>
        ))}
      </svg>

      {/* abstract pulse markers */}
      {marks.map((m) => (
        <span key={m.id} className={`v2-acq ${m.red ? "is-red" : ""}`} style={{ left: `${m.x}%`, top: `${m.y}%` }} aria-hidden="true">
          <i /><i /><i /><i />
        </span>
      ))}
    </>
  );
}
