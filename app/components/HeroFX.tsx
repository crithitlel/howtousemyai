"use client";

import { useEffect, useState } from "react";

type Particle = { x: number; y: number; s: number; d: number; delay: number; dur: number };

/* ──────────────────────────────────────────────────────────
   HeroFX — JS-driven depth layers for the command-center hero.
   Purely ABSTRACT decoration: parallax particles and soft pulse
   markers. Deliberately NO data-shaped readouts (telemetry,
   status text, etc.) — nothing here implies real system state.
   Slow, subtle, reduced-motion aware. Mounts INSIDE .v2-hero so
   it inherits the hero's --px/--py parallax custom properties.
   (Neural mesh layer removed — competed with the radar.)
   ────────────────────────────────────────────────────────── */

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

      {/* abstract pulse markers */}
      {marks.map((m) => (
        <span key={m.id} className={`v2-acq ${m.red ? "is-red" : ""}`} style={{ left: `${m.x}%`, top: `${m.y}%` }} aria-hidden="true">
          <i /><i /><i /><i />
        </span>
      ))}
    </>
  );
}
