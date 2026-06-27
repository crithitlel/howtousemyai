"use client";

import { useEffect, useRef } from "react";

/* ──────────────────────────────────────────────────────────────
   HeroCanvas — a slow sky of REAL named constellations.
   Hand-rolled <canvas> (no library). Each constellation uses its
   actual star layout + connecting lines (Orion, the Big Dipper,
   Cassiopeia, Cygnus, Lyra, the Southern Cross). The whole sky
   drifts very slowly and the stars twinkle; the pointer adds a
   gentle depth-parallax. Shapes stay rigid so they remain
   recognisable — no random node soup.

   Guardrails:
   • prefers-reduced-motion → render ONE static frame, no loop.
   • IntersectionObserver → pause when the hero scrolls offscreen.
   • visibilitychange → pause when the tab is hidden.
   • devicePixelRatio-aware (capped at 2).
   • MOBILE (≤768px) → slower drift + slower twinkle + smaller
     scale, so it reads calm on a phone.
   pointer-events:none — never blocks clicks.
   ────────────────────────────────────────────────────────────── */

type RGB = [number, number, number];
type Star = [number, number, number]; // local x, y (0..1, y-down), brightness
type Constellation = {
  name: string;
  stars: Star[];
  edges: [number, number][];
  accents?: Record<number, RGB>; // star index → accent colour (bright/coloured giants)
};

const STARW: RGB = [183, 206, 255]; // default star (blue-white)
const LINKC = "24,119,242"; // constellation line (blue)
const RED: RGB = [255, 120, 110]; // red giant (e.g. Betelgeuse)
const CYAN: RGB = [120, 220, 255]; // hot blue star (e.g. Rigel, Vega)

/* Real star layouts — local coords (0..1), y points DOWN to match canvas. */
const CONSTELLATIONS: Constellation[] = [
  {
    name: "Orion",
    stars: [
      [0.3, 0.14, 1.3], // 0 Betelgeuse
      [0.66, 0.2, 1.0], // 1 Bellatrix
      [0.42, 0.5, 0.95], // 2 Alnitak (belt)
      [0.5, 0.52, 1.0], // 3 Alnilam (belt)
      [0.58, 0.54, 0.95], // 4 Mintaka (belt)
      [0.36, 0.86, 0.9], // 5 Saiph
      [0.7, 0.84, 1.25], // 6 Rigel
      [0.5, 0.03, 0.7], // 7 Meissa (head)
    ],
    edges: [
      [7, 0], [7, 1], [0, 1], [0, 2], [1, 4],
      [2, 3], [3, 4], [2, 5], [4, 6],
    ],
    accents: { 0: RED, 6: CYAN },
  },
  {
    name: "Ursa Major",
    stars: [
      [0.04, 0.4, 1.0], // Alkaid
      [0.22, 0.34, 1.0], // Mizar
      [0.4, 0.3, 1.0], // Alioth
      [0.56, 0.34, 0.8], // Megrez
      [0.58, 0.56, 0.9], // Phecda
      [0.8, 0.58, 1.0], // Merak
      [0.78, 0.34, 1.2], // Dubhe
    ],
    edges: [[0, 1], [1, 2], [2, 3], [3, 6], [6, 5], [5, 4], [4, 3]],
    accents: { 6: STARW },
  },
  {
    name: "Cassiopeia",
    stars: [
      [0.04, 0.34, 1.0],
      [0.26, 0.62, 1.0],
      [0.5, 0.3, 1.1],
      [0.74, 0.64, 1.0],
      [0.96, 0.4, 1.0],
    ],
    edges: [[0, 1], [1, 2], [2, 3], [3, 4]],
  },
  {
    name: "Cygnus",
    stars: [
      [0.5, 0.04, 1.2], // Deneb
      [0.5, 0.46, 0.9], // Sadr
      [0.5, 0.98, 0.8], // Albireo
      [0.08, 0.52, 0.9], // Gienah
      [0.92, 0.4, 0.9], // Delta
    ],
    edges: [[0, 1], [1, 2], [3, 1], [1, 4]],
    accents: { 0: CYAN },
  },
  {
    name: "Lyra",
    stars: [
      [0.5, 0.06, 1.3], // Vega
      [0.3, 0.34, 0.8],
      [0.7, 0.4, 0.8],
      [0.36, 0.82, 0.8],
      [0.74, 0.86, 0.8],
    ],
    edges: [[0, 1], [0, 2], [1, 3], [3, 4], [4, 2]],
    accents: { 0: CYAN },
  },
  {
    name: "Crux",
    stars: [
      [0.5, 0.02, 1.1],
      [0.52, 0.98, 1.0],
      [0.04, 0.46, 0.9],
      [0.96, 0.56, 0.95],
    ],
    edges: [[0, 1], [2, 3]],
  },
  {
    name: "Gemini", // the twins — two parallel stick figures joined at the heads
    stars: [
      [0.34, 0.05, 1.45], // 0 Castor (head)
      [0.6, 0.1, 1.6], // 1 Pollux (head, orange giant)
      [0.28, 0.45, 1.05], // 2 Mebsuta (left body)
      [0.2, 0.85, 1.1], // 3 Tejat (left foot)
      [0.56, 0.5, 1.05], // 4 Wasat (right body)
      [0.62, 0.88, 1.25], // 5 Alhena (right foot, blue-white)
    ],
    edges: [[0, 1], [0, 2], [2, 3], [1, 4], [4, 5]],
    accents: { 1: RED, 5: CYAN },
  },
];

/* Curated placements (fractions of hero box). Positions frame the
   headline rather than sit dead-centre. `depth` drives parallax. */
type Placement = {
  ci: number; fx: number; fy: number; scale: number; depth: number; vx: number; vy: number;
};
const PLACEMENTS: Placement[] = [
  { ci: 0, fx: 0.15, fy: 0.34, scale: 150, depth: 0.7, vx: 0.05, vy: 0.018 }, // Orion
  { ci: 1, fx: 0.8, fy: 0.22, scale: 205, depth: 0.45, vx: -0.045, vy: 0.02 }, // Big Dipper
  { ci: 2, fx: 0.56, fy: 0.12, scale: 165, depth: 0.8, vx: 0.03, vy: 0.04 }, // Cassiopeia
  { ci: 3, fx: 0.86, fy: 0.66, scale: 150, depth: 0.6, vx: -0.035, vy: -0.03 }, // Cygnus
  { ci: 4, fx: 0.1, fy: 0.72, scale: 95, depth: 0.95, vx: 0.04, vy: -0.025 }, // Lyra
  { ci: 5, fx: 0.4, fy: 0.8, scale: 95, depth: 0.9, vx: -0.03, vy: 0.03 }, // Crux
  { ci: 6, fx: 0.7, fy: 0.5, scale: 175, depth: 0.55, vx: -0.04, vy: 0.022 }, // Gemini ♊ (your sign — bigger/brighter)
];

// precompute each constellation's local centroid so it scales about its centre
const CENTROIDS = CONSTELLATIONS.map((c) => {
  let sx = 0, sy = 0;
  for (const s of c.stars) { sx += s[0]; sy += s[1]; }
  return [sx / c.stars.length, sy / c.stars.length] as const;
});

/* ── tracked "contacts": blips that fly across the hero leaving a
   fading trail + a lock bracket, like targets crossing a scope. ── */
type Contact = {
  id: number; x: number; y: number; vx: number; vy: number;
  red: boolean; dist: number; trail: [number, number][];
};

// true when the radar sweep's leading edge passes `target` this frame
// (all angles in degrees, clockwise from north; sweep advances forward & wraps)
function crossed(prev: number, cur: number, target: number): boolean {
  if (cur >= prev) return target > prev && target <= cur;
  return target > prev || target <= cur; // wrapped past 360→0
}

export default function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    if (!canvas || !parent) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let w = 0;
    let h = 0;
    let mobile = false;
    let speed = 1; // drift + twinkle multiplier (lowered on mobile)
    let scaleMul = 1; // constellation size multiplier
    let raf = 0;
    let running = false;
    let visible = true;
    let start0 = 0;

    // live centre of each placement (px), seeded from fractions on resize
    const live = PLACEMENTS.map(() => ({ cx: 0, cy: 0, seeded: false }));

    // smoothed pointer in normalised hero space (-0.5..0.5)
    const ptr = { tx: 0, ty: 0, x: 0, y: 0 };

    // flying tracked contacts + sweep-triggered constellation pings
    const sweep = parent.querySelector(".v2-sweep") as HTMLElement | null;
    const contacts: Contact[] = [];
    const pingAt = PLACEMENTS.map(() => -1e9); // last ping time per constellation
    let contactSeq = 0;
    let nextSpawn = 1800;
    let prevSweep = 0;
    let lastT = 0;
    const PING_MS = 1100;

    const spawnContact = (t: number) => {
      void t;
      const fromLeft = Math.random() < 0.5;
      const sp = (mobile ? 0.045 : 0.085) * (0.8 + Math.random() * 0.5); // px/ms
      const ang = (Math.random() - 0.5) * 0.34; // gentle vertical slope
      contacts.push({
        id: ++contactSeq,
        x: fromLeft ? -36 : w + 36,
        y: h * (0.2 + Math.random() * 0.5),
        vx: (fromLeft ? 1 : -1) * sp * Math.cos(ang),
        vy: sp * Math.sin(ang),
        red: Math.random() < 0.28,
        dist: 800 + Math.floor(Math.random() * 9000),
        trail: [],
      });
    };

    const drawContact = (c: Contact) => {
      const col = c.red ? "255,96,104" : "92,170,255";
      // fading trail
      ctx.lineWidth = 1;
      for (let k = 1; k < c.trail.length; k++) {
        const a = (k / c.trail.length) * 0.5;
        ctx.strokeStyle = `rgba(${col},${a.toFixed(3)})`;
        ctx.beginPath();
        ctx.moveTo(c.trail[k - 1][0], c.trail[k - 1][1]);
        ctx.lineTo(c.trail[k][0], c.trail[k][1]);
        ctx.stroke();
      }
      // head
      ctx.shadowColor = `rgba(${col},0.9)`;
      ctx.shadowBlur = 6;
      ctx.fillStyle = `rgba(${col},0.95)`;
      ctx.beginPath();
      ctx.arc(c.x, c.y, 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
      // lock bracket (four corner ticks)
      const b = 8, tk = 3;
      ctx.strokeStyle = `rgba(${col},0.7)`;
      ctx.beginPath();
      // TL
      ctx.moveTo(c.x - b, c.y - b + tk); ctx.lineTo(c.x - b, c.y - b); ctx.lineTo(c.x - b + tk, c.y - b);
      // TR
      ctx.moveTo(c.x + b - tk, c.y - b); ctx.lineTo(c.x + b, c.y - b); ctx.lineTo(c.x + b, c.y - b + tk);
      // BR
      ctx.moveTo(c.x + b, c.y + b - tk); ctx.lineTo(c.x + b, c.y + b); ctx.lineTo(c.x + b - tk, c.y + b);
      // BL
      ctx.moveTo(c.x - b + tk, c.y + b); ctx.lineTo(c.x - b, c.y + b); ctx.lineTo(c.x - b, c.y + b - tk);
      ctx.stroke();
      // label
      ctx.font = "9px ui-monospace, SFMono-Regular, Menlo, monospace";
      ctx.fillStyle = `rgba(${col},0.78)`;
      ctx.fillText(`TRK-${String(c.id % 100).padStart(2, "0")} · ${c.dist}KM`, c.x + 12, c.y - 9);
    };

    const applyBreakpoint = () => {
      mobile = w <= 768;
      speed = mobile ? 0.32 : 1; // ← slower on phones
      scaleMul = mobile ? 0.72 : 1;
    };

    const resize = () => {
      const rect = parent.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      applyBreakpoint();
      live.forEach((l, i) => {
        if (!l.seeded) {
          l.cx = PLACEMENTS[i].fx * w;
          l.cy = PLACEMENTS[i].fy * h;
          l.seeded = true;
        }
      });
      if (reduce) draw(0);
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);

      const dt = lastT ? Math.min(t - lastT, 50) : 16;
      lastT = t;

      // ease pointer
      ptr.x += (ptr.tx - ptr.x) * 0.06;
      ptr.y += (ptr.ty - ptr.y) * 0.06;

      // PASS 1 — advance drift + compute each constellation's screen centre
      const centers = PLACEMENTS.map((pl, p) => {
        const l = live[p];
        if (!reduce) {
          l.cx += pl.vx * speed;
          l.cy += pl.vy * speed;
          const m = pl.scale * scaleMul;
          if (l.cx < -m) l.cx = w + m;
          else if (l.cx > w + m) l.cx = -m;
          if (l.cy < -m) l.cy = h + m;
          else if (l.cy > h + m) l.cy = -m;
        }
        const par = pl.depth * 26;
        return { ox: l.cx + ptr.x * par, oy: l.cy + ptr.y * par, sc: pl.scale * scaleMul };
      });

      // PASS 2 — read the live radar-sweep angle from the DOM and fire a
      // ping on any constellation its leading edge crosses this frame, so
      // the pings stay perfectly synced to the visible sweep.
      if (sweep && !reduce) {
        const sr = sweep.getBoundingClientRect();
        if (sr.width > 1) {
          const pr = parent.getBoundingClientRect();
          const scx = sr.left + sr.width / 2 - pr.left;
          const scy = sr.top + sr.height / 2 - pr.top;
          const tf = getComputedStyle(sweep).transform;
          let cur = prevSweep;
          if (tf && tf !== "none") {
            const m = new DOMMatrixReadOnly(tf);
            cur = (Math.atan2(m.b, m.a) * 180 / Math.PI + 360) % 360;
          }
          for (let p = 0; p < centers.length; p++) {
            const dx = centers[p].ox - scx;
            const dy = centers[p].oy - scy;
            const ang = (Math.atan2(dx, -dy) * 180 / Math.PI + 360) % 360;
            if (crossed(prevSweep, cur, ang)) pingAt[p] = t;
          }
          prevSweep = cur;
        }
      }

      // PASS 3 — draw constellations (stars brighten + a lock bracket
      // snaps on for ~1.1s after a sweep ping)
      for (let p = 0; p < PLACEMENTS.length; p++) {
        const pl = PLACEMENTS[p];
        const con = CONSTELLATIONS[pl.ci];
        const [lcx, lcy] = CENTROIDS[pl.ci];
        const { ox, oy, sc } = centers[p];
        const ping = reduce ? 0 : Math.max(0, 1 - (t - pingAt[p]) / PING_MS);

        const pts: [number, number][] = con.stars.map((s) => [
          ox + (s[0] - lcx) * sc,
          oy + (s[1] - lcy) * sc,
        ]);

        // lines (brighten slightly on ping)
        ctx.lineWidth = 0.7;
        ctx.strokeStyle = `rgba(${LINKC},${(0.28 + ping * 0.4).toFixed(3)})`;
        ctx.beginPath();
        for (const [a, b] of con.edges) {
          ctx.moveTo(pts[a][0], pts[a][1]);
          ctx.lineTo(pts[b][0], pts[b][1]);
        }
        ctx.stroke();

        // stars (twinkle + ping boost)
        for (let i = 0; i < con.stars.length; i++) {
          const bright = con.stars[i][2];
          const accent = con.accents?.[i];
          const [sxp, syp] = pts[i];
          const tw = reduce ? 0.85 : 0.62 + 0.38 * Math.sin(t * 0.0012 * speed + i * 1.7 + p);
          const a = Math.min(1, tw + ping * 0.45);
          const rad = (accent ? 1.7 : 1.1) * bright * (1 + ping * 0.4);
          const [r, g, bch] = accent ?? STARW;
          if (accent || ping > 0.01) {
            ctx.shadowColor = `rgba(${r},${g},${bch},0.9)`;
            ctx.shadowBlur = accent ? 8 : ping * 8;
          } else {
            ctx.shadowBlur = 0;
          }
          ctx.fillStyle = `rgba(${r},${g},${bch},${a.toFixed(3)})`;
          ctx.beginPath();
          ctx.arc(sxp, syp, rad, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.shadowBlur = 0;

        // lock bracket around the bounding box during a ping
        if (ping > 0.02) {
          let minx = 1e9, miny = 1e9, maxx = -1e9, maxy = -1e9;
          for (const [px, py] of pts) {
            if (px < minx) minx = px; if (px > maxx) maxx = px;
            if (py < miny) miny = py; if (py > maxy) maxy = py;
          }
          const pad = 12 + (1 - ping) * 10; // contracts as it settles
          minx -= pad; miny -= pad; maxx += pad; maxy += pad;
          const tk = 8;
          ctx.strokeStyle = `rgba(${LINKC},${(ping * 0.75).toFixed(3)})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(minx, miny + tk); ctx.lineTo(minx, miny); ctx.lineTo(minx + tk, miny);
          ctx.moveTo(maxx - tk, miny); ctx.lineTo(maxx, miny); ctx.lineTo(maxx, miny + tk);
          ctx.moveTo(maxx, maxy - tk); ctx.lineTo(maxx, maxy); ctx.lineTo(maxx - tk, maxy);
          ctx.moveTo(minx + tk, maxy); ctx.lineTo(minx, maxy); ctx.lineTo(minx, maxy - tk);
          ctx.stroke();
        }
      }

      // PASS 4 — flying tracked contacts
      if (!reduce) {
        if (t > nextSpawn && contacts.length < (mobile ? 1 : 2)) {
          spawnContact(t);
          nextSpawn = t + (mobile ? 7000 : 4800) + Math.random() * 3200;
        }
        for (let i = contacts.length - 1; i >= 0; i--) {
          const c = contacts[i];
          c.x += c.vx * dt;
          c.y += c.vy * dt;
          c.trail.push([c.x, c.y]);
          if (c.trail.length > 16) c.trail.shift();
          if (c.x < -60 || c.x > w + 60 || c.y < -60 || c.y > h + 60) {
            contacts.splice(i, 1);
            continue;
          }
          drawContact(c);
        }
      }
    };

    const loop = (now: number) => {
      if (!start0) start0 = now;
      draw(now - start0);
      raf = requestAnimationFrame(loop);
    };

    const startLoop = () => {
      if (running || reduce || !visible) return;
      running = true;
      raf = requestAnimationFrame(loop);
    };
    const stopLoop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const onMove = (e: MouseEvent) => {
      const rect = parent.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width - 0.5;
      const ny = (e.clientY - rect.top) / rect.height - 0.5;
      if (nx >= -0.5 && nx <= 0.5 && ny >= -0.5 && ny <= 0.5) {
        ptr.tx = nx;
        ptr.ty = ny;
      }
    };
    const onVisibility = () => {
      visible = !document.hidden;
      if (visible) startLoop();
      else stopLoop();
    };

    resize();

    if (reduce) {
      draw(0);
      window.addEventListener("resize", resize);
      return () => window.removeEventListener("resize", resize);
    }

    const io = new IntersectionObserver(
      (entries) => {
        visible = entries[0]?.isIntersecting ?? true;
        if (visible && !document.hidden) startLoop();
        else stopLoop();
      },
      { threshold: 0 }
    );
    io.observe(parent);

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    startLoop();

    return () => {
      stopLoop();
      io.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <>
      <canvas ref={canvasRef} className="v2-herocanvas" aria-hidden="true" />
      {/* SVG turbulence filter — drives the analog warp on the headline glitch */}
      <svg width="0" height="0" aria-hidden="true" style={{ position: "absolute" }}>
        <filter id="v2-turb" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.02 0.06" numOctaves={2} seed={7} result="noise">
            <animate attributeName="baseFrequency" dur="0.4s" values="0.02 0.06;0.05 0.02;0.02 0.06" repeatCount="indefinite" />
          </feTurbulence>
          <feDisplacementMap in="SourceGraphic" in2="noise" scale={6} xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>
    </>
  );
}
