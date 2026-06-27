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
// spread wide across the whole hero (corners + edges), steering clear of the
// dead-centre headline/search zone so the sky frames the UI instead of crowding it
const PLACEMENTS: Placement[] = [
  { ci: 0, fx: 0.08, fy: 0.18, scale: 150, depth: 0.7, vx: 0.05, vy: 0.018 }, // Orion — top-left
  { ci: 1, fx: 0.9, fy: 0.12, scale: 205, depth: 0.45, vx: -0.045, vy: 0.02 }, // Big Dipper — top-right
  { ci: 2, fx: 0.5, fy: 0.06, scale: 165, depth: 0.8, vx: 0.03, vy: 0.04 }, // Cassiopeia — top-centre
  { ci: 3, fx: 0.93, fy: 0.78, scale: 150, depth: 0.6, vx: -0.035, vy: -0.03 }, // Cygnus — bottom-right
  { ci: 4, fx: 0.05, fy: 0.6, scale: 95, depth: 0.95, vx: 0.04, vy: -0.025 }, // Lyra — left edge
  { ci: 5, fx: 0.26, fy: 0.9, scale: 95, depth: 0.9, vx: -0.03, vy: 0.03 }, // Crux — bottom-left
  { ci: 6, fx: 0.74, fy: 0.9, scale: 175, depth: 0.55, vx: -0.04, vy: 0.022 }, // Gemini ♊ — bottom-right area
];

// precompute each constellation's local centroid so it scales about its centre
const CENTROIDS = CONSTELLATIONS.map((c) => {
  let sx = 0, sy = 0;
  for (const s of c.stars) { sx += s[0]; sy += s[1]; }
  return [sx / c.stars.length, sy / c.stars.length] as const;
});

/* Nebula deep-field — a few large, very soft colored clouds that drift on the
   deepest parallax layer. Under mix-blend-mode:screen these are purely additive
   glow, so they read as volumetric atmosphere/haze rather than flat fills. The
   palette is a controlled indigo → magenta → cyan spread to give the scene a
   real luminosity range instead of one monotone blue. Seeded once, deterministic. */
type Nebula = { fx: number; fy: number; rx: number; ry: number; rot: number; rgb: RGB; a: number; depth: number; drift: number; ph: number };
const NEBULAE: Nebula[] = [
  { fx: 0.20, fy: 0.32, rx: 0.46, ry: 0.40, rot: -0.5, rgb: [96, 84, 224], a: 0.20, depth: 0.08, drift: 0.004, ph: 0.0 },  // indigo, left
  { fx: 0.80, fy: 0.60, rx: 0.50, ry: 0.40, rot: 0.4, rgb: [202, 70, 168], a: 0.16, depth: 0.10, drift: -0.003, ph: 1.4 }, // magenta, lower-right
  { fx: 0.62, fy: 0.16, rx: 0.38, ry: 0.30, rot: 0.2, rgb: [44, 164, 226], a: 0.14, depth: 0.06, drift: 0.0035, ph: 2.7 }, // cyan, top
  { fx: 0.38, fy: 0.82, rx: 0.34, ry: 0.26, rot: -0.3, rgb: [60, 132, 210], a: 0.11, depth: 0.12, drift: 0.0028, ph: 4.1 }, // blue, bottom
];

/* scattered background star dust in 3 DEPTH TIERS — far (tiny/dim/no parallax),
   mid, and near (larger/brighter/more parallax, brightest ones bloom). Real depth
   comes from size × brightness × parallax variance, not from element count.
   Subtle warm/cyan color variation keeps it from going monotone. */
type Dust = { fx: number; fy: number; r: number; b: number; ph: number; depth: number; tint: RGB; bloom: boolean };
function seedTier(n: number, dMin: number, dMax: number, rMin: number, rMax: number, bMin: number, bMax: number, bloomChance: number): Dust[] {
  return Array.from({ length: n }, () => {
    const roll = Math.random();
    const tint: RGB = roll < 0.12 ? [255, 224, 196] : roll < 0.24 ? [188, 224, 255] : [206, 218, 255];
    return {
      fx: Math.random(), fy: Math.random(),
      r: rMin + Math.random() * (rMax - rMin),
      b: bMin + Math.random() * (bMax - bMin),
      ph: Math.random() * Math.PI * 2,
      depth: dMin + Math.random() * (dMax - dMin),
      tint, bloom: Math.random() < bloomChance,
    };
  });
}
const STARFIELD: Dust[] = [
  ...seedTier(150, 0.04, 0.22, 0.3, 0.7, 0.18, 0.4, 0),     // far field — dense, faint, near-static
  ...seedTier(80, 0.35, 0.6, 0.5, 1.1, 0.3, 0.6, 0.04),     // mid field
  ...seedTier(34, 0.7, 1.0, 0.9, 1.7, 0.45, 0.85, 0.5),     // near field — sparse, bright, bloom
];

/* ── tracked "contacts": blips that fly across the hero leaving a
   fading trail + a lock bracket, like targets crossing a scope. ── */
type Contact = {
  id: number; x: number; y: number; vx: number; vy: number;
  red: boolean; dist: number; trail: [number, number][];
};

/* a fast shooting star — bright head + long fading tail, no label */
type Shoot = { x: number; y: number; vx: number; vy: number; life: number; max: number };

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

    // shooting stars
    const shoots: Shoot[] = [];
    let nextShoot = 1400;

    const spawnShoot = () => {
      const fromLeft = Math.random() < 0.5;
      const sp = (mobile ? 0.5 : 0.9) * (0.8 + Math.random() * 0.6); // px/ms (fast)
      const ang = (fromLeft ? 0.5 : Math.PI - 0.5) + (Math.random() - 0.5) * 0.4;
      shoots.push({
        x: fromLeft ? w * (0.0 + Math.random() * 0.3) : w * (0.7 + Math.random() * 0.3),
        y: h * (0.02 + Math.random() * 0.35),
        vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp,
        life: 0, max: 520 + Math.random() * 360,
      });
    };

    const drawShoot = (s: Shoot) => {
      const p = s.life / s.max;            // 0..1 progress
      const fade = Math.sin(Math.min(1, p) * Math.PI); // in then out
      const tailLen = 26 + 40 * fade;
      const tx = s.x - s.vx / Math.hypot(s.vx, s.vy) * tailLen;
      const ty = s.y - s.vy / Math.hypot(s.vx, s.vy) * tailLen;
      const grad = ctx.createLinearGradient(s.x, s.y, tx, ty);
      grad.addColorStop(0, `rgba(214,232,255,${(0.9 * fade).toFixed(3)})`);
      grad.addColorStop(1, "rgba(214,232,255,0)");
      ctx.strokeStyle = grad; ctx.lineWidth = 1.6;
      ctx.beginPath(); ctx.moveTo(s.x, s.y); ctx.lineTo(tx, ty); ctx.stroke();
      ctx.shadowColor = "rgba(220,236,255,0.9)"; ctx.shadowBlur = 8;
      ctx.fillStyle = `rgba(240,248,255,${fade.toFixed(3)})`;
      ctx.beginPath(); ctx.arc(s.x, s.y, 1.7, 0, Math.PI * 2); ctx.fill();
      ctx.shadowBlur = 0;
    };

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

    // a silent distant probe — faint head + short fading trail, no label/bracket
    // (the old TRK-xx telemetry labels read as HUD noise; premium = quieter)
    const drawContact = (c: Contact) => {
      const col = c.red ? "255,120,128" : "150,196,255";
      ctx.lineWidth = 1;
      for (let k = 1; k < c.trail.length; k++) {
        const a = (k / c.trail.length) * 0.28;
        ctx.strokeStyle = `rgba(${col},${a.toFixed(3)})`;
        ctx.beginPath();
        ctx.moveTo(c.trail[k - 1][0], c.trail[k - 1][1]);
        ctx.lineTo(c.trail[k][0], c.trail[k][1]);
        ctx.stroke();
      }
      ctx.shadowColor = `rgba(${col},0.8)`;
      ctx.shadowBlur = 5;
      ctx.fillStyle = `rgba(${col},0.7)`;
      ctx.beginPath();
      ctx.arc(c.x, c.y, 1.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
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

      // PASS -1 — nebula deep-field (volumetric haze, deepest parallax)
      for (const n of NEBULAE) {
        const par = n.depth * 30;
        const dx = reduce ? 0 : Math.sin(t * n.drift * 0.4 + n.ph) * w * 0.02;
        const dy = reduce ? 0 : Math.cos(t * n.drift * 0.32 + n.ph) * h * 0.02;
        const cx = n.fx * w + ptr.x * par + dx, cy = n.fy * h + ptr.y * par + dy;
        const breath = reduce ? 1 : 0.85 + 0.15 * Math.sin(t * 0.0004 + n.ph);
        const rx = n.rx * w * breath, ry = n.ry * h * breath;
        const big = Math.max(rx, ry);
        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, big);
        const [r, gg, b] = n.rgb;
        grad.addColorStop(0, `rgba(${r},${gg},${b},${n.a.toFixed(3)})`);
        grad.addColorStop(0.35, `rgba(${r},${gg},${b},${(n.a * 0.6).toFixed(3)})`);
        grad.addColorStop(0.7, `rgba(${r},${gg},${b},${(n.a * 0.22).toFixed(3)})`);
        grad.addColorStop(1, `rgba(${r},${gg},${b},0)`);
        ctx.save();
        ctx.translate(cx, cy); ctx.rotate(n.rot); ctx.scale(1, ry / big);
        ctx.fillStyle = grad;
        ctx.beginPath(); ctx.arc(0, 0, big, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      }

      // PASS 0 — scattered background star dust in depth tiers (twinkle, parallax, bloom)
      for (const s of STARFIELD) {
        const par = s.depth * 26;
        const x = s.fx * w + ptr.x * par, y = s.fy * h + ptr.y * par;
        const tw = reduce ? 0.7 : 0.4 + 0.6 * Math.sin(t * 0.001 * speed + s.ph);
        const a = s.b * (0.4 + 0.6 * tw);
        const [r, gg, b] = s.tint;
        if (s.bloom) { ctx.shadowColor = `rgba(${r},${gg},${b},0.9)`; ctx.shadowBlur = 4 + 4 * tw; }
        ctx.fillStyle = `rgba(${r},${gg},${b},${a.toFixed(3)})`;
        ctx.beginPath(); ctx.arc(x, y, s.r, 0, Math.PI * 2); ctx.fill();
        if (s.bloom) ctx.shadowBlur = 0;
      }

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

        // lines — elegant thin glowing connections (brighten slightly on ping)
        ctx.lineWidth = 0.6;
        ctx.strokeStyle = `rgba(146,184,255,${(0.16 + ping * 0.42).toFixed(3)})`;
        ctx.shadowColor = "rgba(120,170,255,0.5)";
        ctx.shadowBlur = 3 + ping * 5;
        ctx.beginPath();
        for (const [a, b] of con.edges) {
          ctx.moveTo(pts[a][0], pts[a][1]);
          ctx.lineTo(pts[b][0], pts[b][1]);
        }
        ctx.stroke();
        ctx.shadowBlur = 0;

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
          ctx.strokeStyle = `rgba(${LINKC},${(ping * 0.4).toFixed(3)})`;
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

      // PASS 5 — shooting stars
      if (!reduce) {
        if (t > nextShoot && shoots.length < 2) {
          spawnShoot();
          nextShoot = t + 3200 + Math.random() * 4200;
        }
        for (let i = shoots.length - 1; i >= 0; i--) {
          const s = shoots[i];
          s.x += s.vx * dt; s.y += s.vy * dt; s.life += dt;
          if (s.life > s.max || s.x < -80 || s.x > w + 80 || s.y > h + 80) { shoots.splice(i, 1); continue; }
          drawShoot(s);
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
