"use client";

import { useEffect, useRef } from "react";

/* ──────────────────────────────────────────────────────────
   HeroGlobe — a small SYSTEM of celestial bodies scattered
   around the hero periphery (not one big centred globe). Each
   body is constellation-sized and visually distinct with its
   own animation, all hand-drawn in canvas-2D:

     • wire   — rotating wireframe sphere + orbiting satellites
     • rings  — ringed planet (tilted ring passes behind/front)
     • bands  — banded gas giant with a drifting storm spot
     • moon   — stippled moon with craters + a slow terminator

   Placed off-centre to avoid the search-console zone. Same
   guardrails as HeroCanvas: reduced-motion → static frame,
   IntersectionObserver + visibilitychange pause, DPR capped at
   2, pointer-events:none, smaller/slower on mobile.
   ────────────────────────────────────────────────────────── */

const D2R = Math.PI / 180;

// single shared light source (upper-left). Under mix-blend-mode:screen the
// canvas can only ADD brightness — dark shading is invisible — so all "lighting"
// is done by washing brightness onto the lit hemisphere and leaving the far
// side untouched, which reads as a natural terminator.
const LIGHT = (() => { const x = -0.55, y = -0.62, l = Math.hypot(x, y); return { x: x / l, y: y / l, ang: Math.atan2(y, x) }; })();

type BodyType = "wire" | "rings" | "bands" | "moon" | "lava" | "ice";
type Body = {
  type: BodyType;
  fx: number; fy: number;   // fractional position in the hero
  r: number;                // radius in px (desktop)
  spin: number;             // rotation speed (rad/ms)
  tilt: number;             // axial tilt (rad)
  depth: number;            // parallax depth 0..1
  bob: number;              // vertical bob amplitude (px)
  col: string;              // base "r,g,b"
  accent: string;           // accent "r,g,b"
  // runtime
  dots?: { x: number; y: number; s: number }[];          // moon stipple (unit disk)
  craters?: { x: number; y: number; r: number; fresh?: boolean }[]; // moon craters (unit disk)
  cracks?: { x: number; y: number }[][];                  // lava/ice surface fractures (unit disk)
};

const BODIES: Body[] = [
  { type: "wire",  fx: 0.84, fy: 0.30, r: 60, spin: 0.00016, tilt: 0.42, depth: 0.7, bob: 5, col: "120,170,255", accent: "120,212,255" },
  { type: "rings", fx: 0.15, fy: 0.66, r: 45, spin: 0.00012, tilt: 0.95, depth: 0.5, bob: 7, col: "150,185,255", accent: "206,221,255" },
  { type: "bands", fx: 0.21, fy: 0.20, r: 37, spin: 0.00022, tilt: 0.30, depth: 0.85, bob: 4, col: "130,175,255", accent: "255,110,104" },
  { type: "moon",  fx: 0.80, fy: 0.72, r: 30, spin: 0.00006, tilt: 0.00, depth: 0.4, bob: 8, col: "160,180,215", accent: "120,150,200" },
  { type: "lava",  fx: 0.50, fy: 0.13, r: 30, spin: 0.00010, tilt: 0.20, depth: 0.6, bob: 5, col: "150,90,120", accent: "236,86,84" },
  { type: "ice",   fx: 0.50, fy: 0.89, r: 35, spin: 0.00009, tilt: 0.35, depth: 0.55, bob: 6, col: "150,195,255", accent: "216,238,255" },
];

type Vec3 = { x: number; y: number; z: number };
function unit(latDeg: number, lonDeg: number): Vec3 {
  const la = latDeg * D2R, lo = lonDeg * D2R, cl = Math.cos(la);
  return { x: cl * Math.sin(lo), y: Math.sin(la), z: cl * Math.cos(lo) };
}

// shared wireframe geometry (unit sphere)
const LAT_LINES: Vec3[][] = [];
const LON_LINES: Vec3[][] = [];
for (let lat = -60; lat <= 60; lat += 30) {
  const line: Vec3[] = [];
  for (let lon = -180; lon <= 180; lon += 12) line.push(unit(lat, lon));
  LAT_LINES.push(line);
}
for (let lon = -180; lon < 180; lon += 45) {
  const line: Vec3[] = [];
  for (let lat = -90; lat <= 90; lat += 12) line.push(unit(lat, lon));
  LON_LINES.push(line);
}

// surface hubs + great-circle network arcs for the wire globe (world-city style)
const HUBS: Vec3[] = [
  unit(40, -74), unit(51, 0), unit(35, 139), unit(-23, -46),
  unit(1, 103), unit(-33, 151), unit(28, 77),
];
const ARCS: [number, number][] = [[0, 1], [1, 2], [1, 6], [0, 3], [2, 5], [6, 4]];
function greatCircle(a: Vec3, b: Vec3, steps: number): Vec3[] {
  const dot = Math.max(-1, Math.min(1, a.x * b.x + a.y * b.y + a.z * b.z));
  const om = Math.acos(dot), so = Math.sin(om) || 1e-6, out: Vec3[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps, k0 = Math.sin((1 - t) * om) / so, k1 = Math.sin(t * om) / so;
    out.push({ x: a.x * k0 + b.x * k1, y: a.y * k0 + b.y * k1, z: a.z * k0 + b.z * k1 });
  }
  return out;
}

// seed jagged fracture/crack polylines inside the unit disk (lava & ice surfaces)
function seedCracks(count: number, segs: number, jag: number): { x: number; y: number }[][] {
  const cracks: { x: number; y: number }[][] = [];
  for (let i = 0; i < count; i++) {
    let x = (Math.random() - 0.5) * 0.7, y = (Math.random() - 0.5) * 0.7;
    let dir = Math.random() * Math.PI * 2;
    const pts = [{ x, y }];
    for (let s = 0; s < segs; s++) {
      dir += (Math.random() - 0.5) * jag;
      const step = 0.12 + Math.random() * 0.12;
      x += Math.cos(dir) * step; y += Math.sin(dir) * step;
      if (x * x + y * y > 0.93) break;
      pts.push({ x, y });
    }
    if (pts.length > 1) cracks.push(pts);
  }
  return cracks;
}

export default function HeroGlobe() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    if (!canvas || !parent) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const g = ctx;

    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let w = 0, h = 0, mobile = false, sizeMul = 1;
    let raf = 0, running = false, visible = true, start0 = 0;
    const ptr = { tx: 0, ty: 0, x: 0, y: 0 };

    // seed moon stipple + craters once
    for (const b of BODIES) {
      if (b.type !== "moon") continue;
      if (!b.dots) {
        b.dots = Array.from({ length: 32 }, () => {
          const a = Math.random() * Math.PI * 2, rr = Math.sqrt(Math.random()) * 0.92;
          return { x: Math.cos(a) * rr, y: Math.sin(a) * rr, s: 0.5 + Math.random() * 1.1 };
        });
      }
      if (!b.craters) {
        b.craters = Array.from({ length: 13 }, (_, i) => {
          const a = Math.random() * Math.PI * 2, rr = Math.sqrt(Math.random()) * 0.78;
          // one designated fresh, bright-rayed crater placed in the upper-left (sunward) third
          const fresh = i === 0;
          const fa = -2.3 + Math.random() * 0.5, fd = 0.34 + Math.random() * 0.12;
          return {
            x: fresh ? Math.cos(fa) * fd : Math.cos(a) * rr,
            y: fresh ? Math.sin(fa) * fd : Math.sin(a) * rr,
            r: fresh ? 0.13 + Math.random() * 0.04 : 0.05 + Math.random() * 0.17,
            fresh,
          };
        });
      }
    }
    // seed lava / ice surface fractures once
    for (const b of BODIES) {
      if ((b.type === "lava" || b.type === "ice") && !b.cracks) {
        b.cracks = seedCracks(b.type === "lava" ? 7 : 9, b.type === "lava" ? 5 : 4, b.type === "lava" ? 0.9 : 1.2);
      }
    }

    const applyBreakpoint = () => {
      mobile = w <= 768;
      sizeMul = (mobile ? 0.7 : 1) * Math.min(1, w / 1180);
    };
    const resize = () => {
      const rect = parent.getBoundingClientRect();
      w = rect.width; h = rect.height;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      applyBreakpoint();
      if (reduce) draw(0);
    };

    /* ---- wireframe sphere ---- */
    function projW(v: Vec3, cx: number, cy: number, rr: number, cr: number, sr: number, ct: number, st: number) {
      const rx = v.x * cr + v.z * sr;
      const rz = -v.x * sr + v.z * cr;
      const ry = v.y;
      const ty = ry * ct - rz * st;
      const tz = ry * st + rz * ct;
      return { sx: cx + rx * rr, sy: cy - ty * rr, depth: tz };
    }
    function strokeWire(line: Vec3[], closed: boolean, cx: number, cy: number, rr: number, cr: number, sr: number, ct: number, st: number, col: string) {
      const pts = line.map((v) => projW(v, cx, cy, rr, cr, sr, ct, st));
      const n = pts.length, last = closed ? n : n - 1;
      let run: boolean | null = null;
      g.beginPath();
      for (let i = 0; i < last; i++) {
        const a = pts[i], b = pts[(i + 1) % n];
        const front = (a.depth + b.depth) >= 0;
        if (front !== run) {
          if (run !== null) g.stroke();
          g.beginPath();
          g.strokeStyle = front ? `rgba(${col},0.34)` : `rgba(${col},0.08)`;
          g.lineWidth = front ? 1 : 0.7;
          g.moveTo(a.sx, a.sy);
          run = front;
        }
        g.lineTo(b.sx, b.sy);
      }
      g.stroke();
    }
    /* ---- shared lighting (additive; screen blend ignores darkening) ---- */
    // bright pool on the lit hemisphere that falls off toward the terminator
    function lightWash(cx: number, cy: number, rr: number, rgb: string, peak: number) {
      const ex = cx + LIGHT.x * rr * 0.55, ey = cy + LIGHT.y * rr * 0.55;
      const grd = g.createRadialGradient(ex, ey, rr * 0.08, ex, ey, rr * 1.25);
      grd.addColorStop(0, `rgba(${rgb},${peak.toFixed(3)})`);
      grd.addColorStop(0.5, `rgba(${rgb},${(peak * 0.28).toFixed(3)})`);
      grd.addColorStop(1, `rgba(${rgb},0)`);
      g.save(); g.beginPath(); g.arc(cx, cy, rr, 0, Math.PI * 2); g.clip();
      g.fillStyle = grd; g.fillRect(cx - rr, cy - rr, rr * 2, rr * 2);
      g.restore();
    }
    // crisp fresnel highlight hugging the lit limb
    function fresnelArc(cx: number, cy: number, rr: number, rgb: string, peak: number, width: number) {
      g.save();
      g.strokeStyle = `rgba(${rgb},${peak.toFixed(3)})`;
      g.lineWidth = width;
      g.shadowColor = `rgba(${rgb},${(peak * 0.9).toFixed(3)})`;
      g.shadowBlur = rr * 0.28;
      g.beginPath(); g.arc(cx, cy, rr * 0.985, LIGHT.ang - 1.4, LIGHT.ang + 1.4); g.stroke();
      g.restore();
      g.shadowBlur = 0;
    }
    // tiny specular hotspot where light hits a glossy surface
    function specular(cx: number, cy: number, rr: number, rgb: string, peak: number) {
      const sx = cx + LIGHT.x * rr * 0.62, sy = cy + LIGHT.y * rr * 0.62;
      const grd = g.createRadialGradient(sx, sy, 0, sx, sy, rr * 0.32);
      grd.addColorStop(0, `rgba(${rgb},${peak.toFixed(3)})`);
      grd.addColorStop(1, `rgba(${rgb},0)`);
      g.save(); g.beginPath(); g.arc(cx, cy, rr, 0, Math.PI * 2); g.clip();
      g.fillStyle = grd; g.fillRect(cx - rr, cy - rr, rr * 2, rr * 2);
      g.restore();
    }

    function drawWire(b: Body, cx: number, cy: number, rr: number, t: number) {
      const rot = t * b.spin, cr = Math.cos(rot), sr = Math.sin(rot), ct = Math.cos(b.tilt), st = Math.sin(b.tilt);
      // atmosphere glow halo
      const glow = g.createRadialGradient(cx, cy, rr * 0.75, cx, cy, rr * 1.4);
      glow.addColorStop(0, `rgba(${b.accent},0)`); glow.addColorStop(0.55, `rgba(${b.accent},0.08)`); glow.addColorStop(1, `rgba(${b.accent},0)`);
      g.fillStyle = glow; g.beginPath(); g.arc(cx, cy, rr * 1.4, 0, Math.PI * 2); g.fill();
      // faint glassy core
      const core = g.createRadialGradient(cx - rr * 0.3, cy - rr * 0.3, rr * 0.1, cx, cy, rr);
      core.addColorStop(0, `rgba(${b.col},0.1)`); core.addColorStop(1, `rgba(${b.col},0.01)`);
      g.fillStyle = core; g.beginPath(); g.arc(cx, cy, rr, 0, Math.PI * 2); g.fill();
      // volumetric scan plane sweeping top→bottom through the sphere
      const scanY = cy - rr + ((t * 0.00007) % 1) * rr * 2;
      g.save();
      g.beginPath(); g.arc(cx, cy, rr, 0, Math.PI * 2); g.clip();
      const half = rr * 0.13;
      const scan = g.createLinearGradient(0, scanY - half, 0, scanY + half);
      scan.addColorStop(0, `rgba(${b.accent},0)`);
      scan.addColorStop(0.5, `rgba(${b.accent},0.16)`);
      scan.addColorStop(1, `rgba(${b.accent},0)`);
      g.fillStyle = scan; g.fillRect(cx - rr, scanY - half, rr * 2, half * 2);
      g.fillStyle = `rgba(${b.accent},0.22)`; g.fillRect(cx - rr, scanY - 0.5, rr * 2, 1);
      g.restore();
      // wireframe graticule
      for (const l of LAT_LINES) strokeWire(l, true, cx, cy, rr, cr, sr, ct, st, b.col);
      for (const l of LON_LINES) strokeWire(l, false, cx, cy, rr, cr, sr, ct, st, b.col);
      // great-circle network arcs + traveling data packets
      for (let k = 0; k < ARCS.length; k++) {
        const pts = greatCircle(HUBS[ARCS[k][0]], HUBS[ARCS[k][1]], 24).map((v) => projW(v, cx, cy, rr * 1.02, cr, sr, ct, st));
        let run: boolean | null = null;
        for (let i = 0; i < pts.length - 1; i++) {
          const a = pts[i], c = pts[i + 1], front = (a.depth + c.depth) >= 0;
          if (front !== run) {
            if (run !== null) g.stroke();
            g.beginPath();
            g.strokeStyle = front ? `rgba(${b.accent},0.5)` : `rgba(${b.accent},0.1)`;
            g.lineWidth = front ? 1 : 0.6;
            g.moveTo(a.sx, a.sy); run = front;
          }
          g.lineTo(c.sx, c.sy);
        }
        g.stroke();
        const fp = (t * 0.00018 + k * 0.37) % 1, idx = fp * (pts.length - 1);
        for (let tr = 0; tr < 4; tr++) {                       // fading comet trail
          const pk = pts[Math.floor(idx) - tr];
          if (pk && pk.depth >= 0) { g.fillStyle = `rgba(${b.accent},${(0.9 - tr * 0.22).toFixed(3)})`; g.beginPath(); g.arc(pk.sx, pk.sy, 1.5 - tr * 0.3, 0, Math.PI * 2); g.fill(); }
        }
      }
      // surface hub nodes with pulse pings
      for (let idx = 0; idx < HUBS.length; idx++) {
        const p = projW(HUBS[idx], cx, cy, rr, cr, sr, ct, st);
        if (p.depth < 0) continue;
        const pulse = 0.5 + 0.5 * Math.sin(t * 0.003 + idx * 1.7);
        g.fillStyle = `rgba(${b.accent},${(0.5 + 0.45 * pulse).toFixed(3)})`;
        g.beginPath(); g.arc(p.sx, p.sy, 1.4, 0, Math.PI * 2); g.fill();
        g.strokeStyle = `rgba(${b.accent},${(0.3 * (1 - pulse)).toFixed(3)})`; g.lineWidth = 0.7;
        g.beginPath(); g.arc(p.sx, p.sy, 1.4 + pulse * 3.2, 0, Math.PI * 2); g.stroke();
      }
      // rim + polar axis
      g.strokeStyle = `rgba(${b.col},0.28)`; g.lineWidth = 1;
      g.beginPath(); g.arc(cx, cy, rr, 0, Math.PI * 2); g.stroke();
      fresnelArc(cx, cy, rr, b.accent, 0.4, 1.4);  // lit-edge atmosphere glow
      const pN = projW({ x: 0, y: 1, z: 0 }, cx, cy, rr * 1.14, cr, sr, ct, st);
      const pS = projW({ x: 0, y: -1, z: 0 }, cx, cy, rr * 1.14, cr, sr, ct, st);
      g.strokeStyle = `rgba(${b.col},0.22)`; g.lineWidth = 0.8;
      g.beginPath(); g.moveTo(pN.sx, pN.sy); g.lineTo(pS.sx, pS.sy); g.stroke();
      // orbiting satellites on an inclined ring
      for (let k = 0; k < 2; k++) {
        const ang = t * 0.0006 * (k ? -1 : 1) + k * Math.PI;
        const X = Math.cos(ang) * rr * 1.5, Z = Math.sin(ang) * rr * 1.5;
        const sx = cx + X, sy = cy + Z * 0.34, front = Math.sin(ang) >= 0;
        g.fillStyle = `rgba(${b.accent},${front ? 0.95 : 0.4})`;
        g.beginPath(); g.arc(sx, sy, front ? 1.8 : 1.2, 0, Math.PI * 2); g.fill();
      }
    }

    /* ---- ringed planet — multi-band ring system + shaded body ---- */
    const RING_BANDS = [
      { radF: 1.34, widthF: 0.025, alpha: 0.10 }, // faint inner haze
      { radF: 1.45, widthF: 0.05, alpha: 0.22 },  // C ring
      { radF: 1.58, widthF: 0.09, alpha: 0.52 },  // B ring (bright inner)
      { radF: 1.71, widthF: 0.07, alpha: 0.40 },  // B ring (outer)
      // Cassini division gap here
      { radF: 1.90, widthF: 0.06, alpha: 0.30 },  // A ring
      { radF: 2.01, widthF: 0.02, alpha: 0.16 },  // thin F ring
    ];
    function drawRings(b: Body, cx: number, cy: number, rr: number, t: number) {
      const rot = t * b.spin, st = Math.sin(b.tilt), ct = Math.cos(b.tilt);
      const ringHalf = (radF: number, widthF: number, alpha: number, front: boolean) => {
        const radius = rr * radF;
        const shimmer = 0.8 + 0.2 * Math.sin(t * 0.004 + radF * 9.3); // per-band ice-particle glint
        alpha *= shimmer;
        g.lineWidth = Math.max(1, rr * widthF);
        // back half only modestly dimmer so the ring reads as one continuous band
        g.strokeStyle = `rgba(${b.accent},${(front ? alpha : alpha * 0.55).toFixed(3)})`;
        g.beginPath(); let started = false;
        for (let s = 0; s <= 128; s++) {
          const th = (s / 128) * Math.PI * 2;
          const X = Math.cos(th + rot * 0.4) * radius, Z = Math.sin(th + rot * 0.4) * radius;
          const depth = Z * ct, sx = cx + X, sy = cy + Z * st;
          if ((depth >= 0) !== front) { started = false; continue; }
          if (!started) { g.moveTo(sx, sy); started = true; } else g.lineTo(sx, sy);
        }
        g.stroke();
      };
      for (const r of RING_BANDS) ringHalf(r.radF, r.widthF, r.alpha, false); // back halves
      // planet body — spherical base wash
      const grad = g.createRadialGradient(cx - rr * 0.35, cy - rr * 0.35, rr * 0.1, cx, cy, rr);
      grad.addColorStop(0, `rgba(${b.col},0.30)`); grad.addColorStop(0.7, `rgba(${b.col},0.10)`); grad.addColorStop(1, `rgba(${b.col},0.02)`);
      g.fillStyle = grad; g.beginPath(); g.arc(cx, cy, rr, 0, Math.PI * 2); g.fill();
      g.save();
      g.beginPath(); g.arc(cx, cy, rr, 0, Math.PI * 2); g.clip();
      // curved latitude cloud bands that hug the sphere (project lat onto the disc)
      const drift = Math.sin(t * 0.00035) * 0.4;
      const STRIPS = 44;
      for (let i = 0; i < STRIPS; i++) {
        const lat = -1 + (i / (STRIPS - 1)) * 2;          // -1..1 across the sphere
        const yy = cy + lat * rr;
        const halfW = Math.sqrt(Math.max(0, 1 - lat * lat)) * rr; // chord width at this latitude
        if (halfW <= 0) continue;
        const v = 0.5 + 0.5 * Math.sin(lat * 8 + drift) * Math.cos(lat * 2.5 - drift * 0.5);
        const belt = Math.sin(lat * 8 + drift + 1.4);
        const warm = belt > 0.55, brightBelt = belt < -0.6;
        const a = 0.03 + 0.19 * v + 0.02 * Math.sin(t * 0.0008 + i * 0.7);
        const col = warm ? b.accent : brightBelt ? "215,230,255" : b.col;
        g.fillStyle = `rgba(${col},${(warm ? a * 0.6 : a).toFixed(3)})`;
        g.fillRect(cx - halfW, yy - rr / STRIPS, halfW * 2, rr * 2 / STRIPS + 0.6);
      }
      // turbulent shear filaments
      for (let f = 0; f < 5; f++) {
        const lat = -0.7 + f * 0.35;
        const yy = cy + lat * rr, halfW = Math.sqrt(Math.max(0, 1 - lat * lat)) * rr;
        if (halfW <= 2) continue;
        g.strokeStyle = `rgba(${f % 2 ? b.accent : "215,230,255"},${(0.14 + 0.05 * Math.sin(t * 0.0012 + f)).toFixed(3)})`;
        g.lineWidth = 0.7;
        g.beginPath();
        for (let s = 0; s <= 26; s++) {
          const xx = cx - halfW + (s / 26) * halfW * 2;
          const wob = Math.sin(s * 0.7 + t * 0.0015 * (f % 2 ? -1 : 1) + f * 1.2) * rr * 0.045;
          if (s === 0) g.moveTo(xx, yy + wob); else g.lineTo(xx, yy + wob);
        }
        g.stroke();
      }
      // a small rotating storm spot (near face only)
      const ph = (t * b.spin * 6) % (Math.PI * 2), face = Math.cos(ph);
      if (face > 0) {
        const sx = cx + Math.sin(ph) * rr * 0.55, sy = cy - rr * 0.28;
        const w0 = rr * 0.2 * face, h0 = rr * 0.12;
        g.fillStyle = `rgba(${b.accent},${(0.42 * face).toFixed(3)})`;
        g.beginPath(); g.ellipse(sx, sy, w0, h0, 0, 0, Math.PI * 2); g.fill();
        g.strokeStyle = `rgba(${b.col},${(0.4 * face).toFixed(3)})`; g.lineWidth = 0.7;
        g.beginPath(); g.ellipse(sx, sy, w0 * 0.55, h0 * 0.55, 0, 0, Math.PI * 2); g.stroke();
      }
      g.fillStyle = "rgba(3,7,20,0.32)"; g.fillRect(cx - rr, cy - rr * 0.05, rr * 2, rr * 0.1); // ring shadow line cast on body
      g.restore();
      lightWash(cx, cy, rr, b.col, 0.3);                    // lit hemisphere
      specular(cx, cy, rr, "225,236,255", 0.34);            // glossy cloud-top highlight
      fresnelArc(cx, cy, rr, b.col, 0.34, 1.3);             // lit limb
      g.strokeStyle = `rgba(${b.col},0.32)`; g.lineWidth = 1; g.beginPath(); g.arc(cx, cy, rr, 0, Math.PI * 2); g.stroke();
      for (const r of RING_BANDS) ringHalf(r.radF, r.widthF, r.alpha, true); // front halves
      // orbiting moon (depth-aware)
      const ma = t * 0.0009, mFront = Math.sin(ma) >= 0;
      const mx = cx + Math.cos(ma) * rr * 2.3, my = cy + Math.sin(ma) * rr * 0.7;
      g.fillStyle = `rgba(${b.col},${mFront ? 0.9 : 0.45})`;
      g.beginPath(); g.arc(mx, my, mFront ? 1.8 : 1.3, 0, Math.PI * 2); g.fill();
    }

    /* ---- banded gas giant — curved bands, swirling storm, spherical shading ---- */
    function drawBands(b: Body, cx: number, cy: number, rr: number, t: number) {
      g.save();
      g.beginPath(); g.arc(cx, cy, rr, 0, Math.PI * 2); g.clip();
      g.fillStyle = `rgba(${b.col},0.05)`; g.fillRect(cx - rr, cy - rr, rr * 2, rr * 2);
      // high-contrast curved cloud belts (chord-width follows the sphere)
      const drift = Math.sin(t * 0.0003) * 0.5;
      const strips = 52;
      for (let i = 0; i < strips; i++) {
        const lat = -1 + (i / (strips - 1)) * 2;
        const yy = cy + lat * rr;
        const half = Math.sqrt(Math.max(0, 1 - lat * lat)) * rr;
        if (half <= 0) continue;
        // two superimposed sine systems → richer belt structure
        const v = 0.5 + 0.5 * Math.sin(lat * 7.5 + drift) * Math.cos(lat * 2.3 - drift * 0.6);
        const belt = Math.sin(lat * 7.5 + drift + 1.4);
        const warm = belt > 0.55, brightBelt = belt < -0.6;
        const a = 0.03 + 0.2 * v + 0.025 * Math.sin(t * 0.0009 + i * 0.6);
        const col = warm ? b.accent : brightBelt ? "210,228,255" : b.col;
        g.fillStyle = `rgba(${col},${(warm ? a * 0.6 : a).toFixed(3)})`;
        g.fillRect(cx - half, yy - rr / strips, half * 2, rr * 2 / strips + 0.7);
      }
      // turbulent shear filaments riding the belt boundaries
      for (let f = 0; f < 6; f++) {
        const lat = -0.75 + f * 0.3;
        const yy = cy + lat * rr;
        const half = Math.sqrt(Math.max(0, 1 - lat * lat)) * rr;
        if (half <= 2) continue;
        g.strokeStyle = `rgba(${f % 2 ? b.accent : "215,230,255"},${(0.16 + 0.06 * Math.sin(t * 0.0012 + f)).toFixed(3)})`;
        g.lineWidth = 0.8;
        g.beginPath();
        for (let s = 0; s <= 28; s++) {
          const xx = cx - half + (s / 28) * half * 2;
          const wob = Math.sin(s * 0.7 + t * 0.0016 * (f % 2 ? -1 : 1) + f * 1.3) * rr * 0.05;
          if (s === 0) g.moveTo(xx, yy + wob); else g.lineTo(xx, yy + wob);
        }
        g.stroke();
      }
      // great storm — detailed swirling spiral, near face only
      const ph = (t * b.spin) % (Math.PI * 2), face = Math.cos(ph);
      if (face > 0) {
        const sx = cx + Math.sin(ph) * rr * 0.6, sy = cy + rr * 0.26;
        const w0 = rr * 0.3 * face, h0 = rr * 0.18, swirl = t * 0.0022;
        const sg = g.createRadialGradient(sx, sy, 1, sx, sy, w0);
        sg.addColorStop(0, `rgba(255,190,150,${(0.6 * face).toFixed(3)})`);
        sg.addColorStop(0.5, `rgba(${b.accent},${(0.4 * face).toFixed(3)})`);
        sg.addColorStop(1, `rgba(${b.accent},0)`);
        g.fillStyle = sg; g.beginPath(); g.ellipse(sx, sy, w0, h0, 0, 0, Math.PI * 2); g.fill();
        g.save(); g.translate(sx, sy); g.rotate(swirl);
        g.strokeStyle = `rgba(255,225,200,${(0.5 * face).toFixed(3)})`; g.lineWidth = 0.8;
        for (let r = 0; r < 3; r++) { const k = 1 - r * 0.3; g.beginPath(); g.ellipse(0, 0, w0 * k * 0.8, h0 * k * 0.8, r * 0.5, 0, Math.PI * 2); g.stroke(); }
        g.fillStyle = `rgba(255,240,225,${(0.55 * face).toFixed(3)})`;
        g.beginPath(); g.ellipse(0, 0, w0 * 0.16, h0 * 0.16, 0, 0, Math.PI * 2); g.fill();
        g.restore();
      }
      // second, smaller counter-rotating eddy higher up
      const ph2 = (-t * b.spin * 1.4) % (Math.PI * 2), face2 = Math.cos(ph2);
      if (face2 > 0) {
        const ex = cx + Math.sin(ph2) * rr * 0.5, ey = cy - rr * 0.36;
        const ew = rr * 0.16 * face2, eh = rr * 0.1;
        const spin2 = t * 0.004;
        g.save(); g.translate(ex, ey); g.rotate(spin2);
        g.strokeStyle = `rgba(${b.col},${(0.45 * face2).toFixed(3)})`; g.lineWidth = 0.8;
        g.beginPath(); g.ellipse(0, 0, ew, eh, 0, 0, Math.PI * 2); g.stroke();
        g.beginPath(); g.ellipse(0, 0, ew * 0.5, eh * 0.5, 0, 0, Math.PI * 2); g.stroke();
        g.fillStyle = `rgba(${b.accent},${(0.3 * face2).toFixed(3)})`;
        g.beginPath(); g.ellipse(0, 0, ew * 0.35, eh * 0.35, 0, 0, Math.PI * 2); g.fill();
        g.restore();
      }
      g.restore();
      specular(cx, cy, rr, "225,236,255", 0.3);   // glossy cloud-top sheen
      lightWash(cx, cy, rr, b.col, 0.24);
      fresnelArc(cx, cy, rr, b.accent, 0.3, 1.3);
      g.strokeStyle = `rgba(${b.col},0.32)`; g.lineWidth = 1; g.beginPath(); g.arc(cx, cy, rr, 0, Math.PI * 2); g.stroke();
    }

    /* ---- cratered moon — maria, lit crater rims, ejecta rays, ridges ---- */
    function drawMoon(b: Body, cx: number, cy: number, rr: number, t: number) {
      const La = LIGHT.ang;                         // sun direction (upper-left)
      const sunx = Math.cos(La), suny = Math.sin(La);
      g.save();
      g.beginPath(); g.arc(cx, cy, rr, 0, Math.PI * 2); g.clip();
      g.fillStyle = `rgba(${b.col},0.12)`; g.fillRect(cx - rr, cy - rr, rr * 2, rr * 2);

      // maria — basaltic plains with soft irregular edges (3 lobes per sea)
      const seas: [number, number, number, number, number][] = [
        [-0.26, -0.16, 0.42, 0.34, 0.4],
        [0.30, 0.36, 0.30, 0.22, -0.3],
        [0.08, -0.42, 0.24, 0.16, 0.2],
      ];
      for (const [mx, my, ma, mb, rot] of seas) {
        const mg = g.createRadialGradient(cx + mx * rr, cy + my * rr, 0, cx + mx * rr, cy + my * rr, ma * rr);
        mg.addColorStop(0, `rgba(${b.accent},0.16)`); mg.addColorStop(0.7, `rgba(${b.accent},0.09)`); mg.addColorStop(1, `rgba(${b.accent},0)`);
        g.fillStyle = mg;
        g.beginPath(); g.ellipse(cx + mx * rr, cy + my * rr, ma * rr, mb * rr, rot, 0, Math.PI * 2); g.fill();
      }

      // wrinkle ridges / rilles — faint meandering surface lines
      g.lineWidth = 0.8;
      for (let rdg = 0; rdg < 4; rdg++) {
        const y0 = cy + (rdg - 1.5) * rr * 0.42;
        g.strokeStyle = `rgba(${b.col},${(0.16 + 0.05 * (rdg % 2)).toFixed(3)})`;
        g.beginPath();
        for (let s = 0; s <= 22; s++) {
          const xx = cx - rr + (s / 22) * rr * 2;
          const yy = y0 + Math.sin(s * 0.55 + rdg * 1.7) * rr * 0.08 + Math.sin(s * 1.7 + rdg) * rr * 0.03;
          if (s === 0) g.moveTo(xx, yy); else g.lineTo(xx, yy);
        }
        g.stroke();
      }

      // regolith stipple
      for (const d of b.dots!) {
        g.fillStyle = `rgba(${b.col},0.4)`;
        g.beginPath(); g.arc(cx + d.x * rr, cy + d.y * rr, d.s, 0, Math.PI * 2); g.fill();
      }

      // ejecta ray system from the fresh crater (bright streaks radiating out)
      const fresh = b.craters!.find((c) => c.fresh);
      if (fresh) {
        const fxp = cx + fresh.x * rr, fyp = cy + fresh.y * rr;
        for (let ry = 0; ry < 11; ry++) {
          const ang = (ry / 11) * Math.PI * 2 + 0.3;
          const len = rr * (0.5 + ((Math.sin(ry * 7.13) * 0.5 + 0.5)) * 0.7);
          const gx = fxp + Math.cos(ang) * len, gy = fyp + Math.sin(ang) * len;
          const rg = g.createLinearGradient(fxp, fyp, gx, gy);
          rg.addColorStop(0, `rgba(${b.col},0.3)`); rg.addColorStop(0.4, `rgba(${b.col},0.1)`); rg.addColorStop(1, `rgba(${b.col},0)`);
          g.strokeStyle = rg; g.lineWidth = 0.9;
          g.beginPath(); g.moveTo(fxp, fyp); g.lineTo(gx, gy); g.stroke();
        }
      }

      // craters with sun-lit rims — bright crescent toward the sun, shadow opposite,
      // and a shadow pool on the far inner wall (3D depression read)
      for (const c of b.craters!) {
        const ccx = cx + c.x * rr, ccy = cy + c.y * rr, cradius = c.r * rr;
        // floor shadow offset away from the sun
        g.fillStyle = "rgba(3,8,22,0.28)";
        g.beginPath(); g.arc(ccx - sunx * cradius * 0.18, ccy - suny * cradius * 0.18, cradius, 0, Math.PI * 2); g.fill();
        // inner-wall sunlit crescent (far wall catches light)
        g.lineWidth = Math.max(0.7, cradius * 0.26);
        g.strokeStyle = c.fresh ? `rgba(235,242,255,0.8)` : `rgba(${b.col},0.6)`;
        g.beginPath(); g.arc(ccx, ccy, cradius * 0.82, La - 0.95, La + 0.95); g.stroke();
        // outer rim highlight toward sun
        g.lineWidth = Math.max(0.6, cradius * 0.16);
        g.strokeStyle = c.fresh ? `rgba(220,232,255,0.7)` : `rgba(${b.col},0.5)`;
        g.beginPath(); g.arc(ccx, ccy, cradius, La + Math.PI - 0.85, La + Math.PI + 0.85); g.stroke();
        // shadow on the sunward inner wall
        g.strokeStyle = "rgba(3,8,22,0.5)"; g.lineWidth = Math.max(0.6, cradius * 0.2);
        g.beginPath(); g.arc(ccx, ccy, cradius * 0.82, La + Math.PI - 0.95, La + Math.PI + 0.95); g.stroke();
        if (c.fresh) { // tiny bright central peak
          g.fillStyle = "rgba(230,240,255,0.7)";
          g.beginPath(); g.arc(ccx, ccy, cradius * 0.16, 0, Math.PI * 2); g.fill();
        }
      }

      // soft terminator sweeping across the disc (phase)
      const mid = 0.5 + Math.sin(t * b.spin) * 0.42;
      const grad = g.createLinearGradient(cx - rr, cy, cx + rr, cy);
      grad.addColorStop(Math.max(0, mid - 0.18), "rgba(0,0,0,0)");
      grad.addColorStop(Math.min(1, mid + 0.02), "rgba(3,7,20,0.72)");
      g.fillStyle = grad; g.fillRect(cx - rr, cy - rr, rr * 2, rr * 2);
      g.restore();
      lightWash(cx, cy, rr, b.col, 0.34);                  // sunlit hemisphere
      specular(cx, cy, rr, "230,238,255", 0.22);           // faint regolith sheen
      fresnelArc(cx, cy, rr, b.col, 0.32, 1.2);            // bright lit limb
      g.strokeStyle = `rgba(${b.col},0.34)`; g.lineWidth = 1; g.beginPath(); g.arc(cx, cy, rr, 0, Math.PI * 2); g.stroke();
    }

    /* ---- molten lava world — dark crust, glowing magma cracks, hot rim ---- */
    function drawLava(b: Body, cx: number, cy: number, rr: number, t: number) {
      const pulse = 0.6 + 0.4 * Math.sin(t * 0.002);
      // outer heat haze (shows through the screen blend)
      const haze = g.createRadialGradient(cx, cy, rr * 0.7, cx, cy, rr * 1.3);
      haze.addColorStop(0, `rgba(${b.accent},${(0.12 * pulse).toFixed(3)})`); haze.addColorStop(1, `rgba(${b.accent},0)`);
      g.fillStyle = haze; g.beginPath(); g.arc(cx, cy, rr * 1.3, 0, Math.PI * 2); g.fill();
      g.save();
      g.beginPath(); g.arc(cx, cy, rr, 0, Math.PI * 2); g.clip();
      // molten body glow (dark crust is invisible under screen blend, so lead with heat)
      const glow = g.createRadialGradient(cx + rr * 0.1, cy + rr * 0.25, rr * 0.1, cx, cy, rr * 1.05);
      glow.addColorStop(0, `rgba(${b.accent},${(0.42 * pulse).toFixed(3)})`);
      glow.addColorStop(0.6, `rgba(${b.accent},0.14)`);
      glow.addColorStop(1, `rgba(${b.accent},0.03)`);
      g.fillStyle = glow; g.fillRect(cx - rr, cy - rr, rr * 2, rr * 2);
      // crust shading hint via warm midtone
      const crust = g.createRadialGradient(cx - rr * 0.35, cy - rr * 0.4, rr * 0.1, cx, cy, rr);
      crust.addColorStop(0, `rgba(${b.col},0.3)`); crust.addColorStop(1, `rgba(${b.col},0.06)`);
      g.fillStyle = crust; g.fillRect(cx - rr, cy - rr, rr * 2, rr * 2);
      // convective lava-lake cells — curved spherical glow bands that follow the
      // surface curvature, brightening/dimming as heat circulates
      const LSTR = 26;
      for (let i = 0; i < LSTR; i++) {
        const lat = -1 + (i / (LSTR - 1)) * 2;
        const half = Math.sqrt(Math.max(0, 1 - lat * lat)) * rr;
        const yy = cy + lat * rr;
        const cell = 0.5 + 0.5 * Math.sin(lat * 9 + t * 0.0016) * Math.cos(lat * 3.4 - t * 0.0009);
        const hot = cell > 0.62;
        const a = hot ? 0.16 * pulse : 0.05;
        g.fillStyle = hot ? `rgba(255,${(150 + 70 * cell) | 0},${(70 * cell) | 0},${a.toFixed(3)})` : `rgba(${b.col},${a.toFixed(3)})`;
        g.fillRect(cx - half, yy - rr / LSTR, half * 2, (rr * 2) / LSTR + 1);
      }
      // glowing magma cracks — heat travels through them as a spatial wave
      for (let ci = 0; ci < b.cracks!.length; ci++) {
        const cr = b.cracks![ci];
        const wave = cr[0].x * 2.4 + cr[0].y * 1.7; // phase by crack position → propagating glow
        const flick = 0.5 + 0.5 * Math.sin(t * 0.0045 - wave + ci * 0.6);
        g.strokeStyle = `rgba(255,${(150 + 60 * flick) | 0},${(90 * flick) | 0},${(0.55 + 0.4 * flick).toFixed(3)})`;
        g.lineWidth = Math.max(1, rr * 0.05 * (0.6 + flick * 0.6));
        g.shadowColor = `rgba(${b.accent},0.9)`; g.shadowBlur = rr * 0.2 * flick;
        g.beginPath();
        for (let p = 0; p < cr.length; p++) { const X = cx + cr[p].x * rr, Y = cy + cr[p].y * rr; if (p === 0) g.moveTo(X, Y); else g.lineTo(X, Y); }
        g.stroke();
      }
      g.shadowBlur = 0;
      g.restore();
      // rising ember particles drifting up off the surface (heat plume)
      for (let k = 0; k < 11; k++) {
        const seed = Math.sin(k * 12.9898) * 43758.5453;
        const rx = (seed - Math.floor(seed) - 0.5) * 1.1;          // stable per-ember x
        const ph = (t * 0.00045 + k * 0.137) % 1;
        const ey = cy + rr * 0.55 - ph * rr * 1.5;                 // rise upward
        const ex = cx + rx * rr * 0.55 + Math.sin(t * 0.002 + k) * rr * 0.06;
        const fade = Math.sin(ph * Math.PI);                        // fade in then out
        if (fade <= 0.02) continue;
        g.fillStyle = `rgba(255,${(140 + 80 * fade) | 0},${(60 * fade) | 0},${(0.7 * fade).toFixed(3)})`;
        g.shadowColor = `rgba(${b.accent},0.9)`; g.shadowBlur = rr * 0.15;
        g.beginPath(); g.arc(ex, ey, 0.8 + fade * 1.1, 0, Math.PI * 2); g.fill();
      }
      g.shadowBlur = 0;
      // hot rim
      g.strokeStyle = `rgba(${b.accent},${(0.45 + 0.25 * pulse).toFixed(3)})`; g.lineWidth = 1.3;
      g.beginPath(); g.arc(cx, cy, rr, 0, Math.PI * 2); g.stroke();
    }

    /* ---- frozen ice world — polar caps, fractures, shimmering aurora, halo ---- */
    function drawIce(b: Body, cx: number, cy: number, rr: number, t: number) {
      // thin atmosphere halo
      const halo = g.createRadialGradient(cx, cy, rr * 0.85, cx, cy, rr * 1.25);
      halo.addColorStop(0, `rgba(${b.accent},0)`); halo.addColorStop(0.6, `rgba(${b.accent},0.08)`); halo.addColorStop(1, `rgba(${b.accent},0)`);
      g.fillStyle = halo; g.beginPath(); g.arc(cx, cy, rr * 1.25, 0, Math.PI * 2); g.fill();
      g.save();
      g.beginPath(); g.arc(cx, cy, rr, 0, Math.PI * 2); g.clip();
      // icy body
      const base = g.createRadialGradient(cx - rr * 0.35, cy - rr * 0.4, rr * 0.1, cx, cy, rr);
      base.addColorStop(0, `rgba(${b.col},0.3)`); base.addColorStop(0.7, `rgba(${b.col},0.12)`); base.addColorStop(1, `rgba(${b.col},0.03)`);
      g.fillStyle = base; g.fillRect(cx - rr, cy - rr, rr * 2, rr * 2);
      // polar caps
      g.fillStyle = `rgba(${b.accent},0.22)`;
      g.beginPath(); g.ellipse(cx, cy - rr * 0.82, rr * 0.7, rr * 0.3, 0, 0, Math.PI * 2); g.fill();
      g.beginPath(); g.ellipse(cx, cy + rr * 0.82, rr * 0.6, rr * 0.26, 0, 0, Math.PI * 2); g.fill();
      // surface fractures
      for (let ci = 0; ci < b.cracks!.length; ci++) {
        const cr = b.cracks![ci];
        g.strokeStyle = `rgba(${b.accent},0.4)`; g.lineWidth = 0.7;
        g.beginPath();
        for (let p = 0; p < cr.length; p++) { const X = cx + cr[p].x * rr, Y = cy + cr[p].y * rr; if (p === 0) g.moveTo(X, Y); else g.lineTo(X, Y); }
        g.stroke();
      }
      // drifting frost clouds sweeping across the surface
      for (let fc = 0; fc < 3; fc++) {
        const drift = ((t * 0.00006 * (fc + 1) + fc * 0.33) % 1) * rr * 2.4 - rr * 1.2;
        const fy = cy + (fc - 1) * rr * 0.4;
        const fr = rr * (0.5 - fc * 0.08);
        const cl = g.createRadialGradient(cx + drift, fy, 0, cx + drift, fy, fr);
        cl.addColorStop(0, `rgba(${b.accent},0.1)`); cl.addColorStop(1, `rgba(${b.accent},0)`);
        g.fillStyle = cl; g.beginPath(); g.ellipse(cx + drift, fy, fr, fr * 0.5, 0, 0, Math.PI * 2); g.fill();
      }
      // shimmering aurora bands near the upper pole
      for (let a = 0; a < 3; a++) {
        const yy = cy - rr * 0.5 - a * rr * 0.12;
        const alpha = (0.1 + 0.08 * Math.sin(t * 0.003 + a)) * (0.6 + 0.4 * Math.sin(t * 0.0012));
        g.strokeStyle = `rgba(120,212,255,${Math.max(0, alpha).toFixed(3)})`; g.lineWidth = 1.4;
        g.beginPath();
        for (let s = 0; s <= 20; s++) { const xx = cx - rr + (s / 20) * rr * 2, wob = Math.sin(s * 0.6 + t * 0.004 + a) * rr * 0.06; if (s === 0) g.moveTo(xx, yy + wob); else g.lineTo(xx, yy + wob); }
        g.stroke();
      }
      // crystalline facet glints — small bright sparkles on the sunward face that
      // twinkle as the ice catches the light
      for (let k = 0; k < 7; k++) {
        const seed = Math.sin(k * 78.233) * 43758.5453, seed2 = Math.sin(k * 12.9898) * 43758.5453;
        const gx = cx + (LIGHT.x * 0.35 + ((seed - Math.floor(seed)) - 0.5) * 0.9) * rr;
        const gy = cy + (LIGHT.y * 0.35 + ((seed2 - Math.floor(seed2)) - 0.5) * 0.9) * rr;
        const tw = Math.max(0, Math.sin(t * 0.004 + k * 1.7));
        if (tw < 0.2) continue;
        g.fillStyle = `rgba(235,248,255,${(0.5 * tw).toFixed(3)})`;
        g.shadowColor = "rgba(200,235,255,0.9)"; g.shadowBlur = rr * 0.1 * tw;
        g.beginPath(); g.arc(gx, gy, 0.7 + tw * 0.9, 0, Math.PI * 2); g.fill();
      }
      g.shadowBlur = 0;
      // limb shading + highlight
      const sh = g.createRadialGradient(cx - rr * 0.4, cy - rr * 0.4, rr * 0.1, cx, cy, rr * 1.02);
      sh.addColorStop(0, "rgba(255,255,255,0.08)"); sh.addColorStop(0.6, "rgba(0,0,0,0)"); sh.addColorStop(1, "rgba(4,10,24,0.5)");
      g.fillStyle = sh; g.fillRect(cx - rr, cy - rr, rr * 2, rr * 2);
      g.restore();
      lightWash(cx, cy, rr, b.col, 0.28);                  // lit hemisphere
      specular(cx, cy, rr, "235,248,255", 0.5);            // bright glossy sun-glint
      fresnelArc(cx, cy, rr, b.accent, 0.36, 1.3);         // icy lit limb
      g.strokeStyle = `rgba(${b.accent},0.34)`; g.lineWidth = 1; g.beginPath(); g.arc(cx, cy, rr, 0, Math.PI * 2); g.stroke();
    }

    function draw(t: number) {
      g.clearRect(0, 0, w, h);
      ptr.x += (ptr.tx - ptr.x) * 0.05;
      ptr.y += (ptr.ty - ptr.y) * 0.05;
      for (const b of BODIES) {
        const rr = b.r * sizeMul;
        const cx = b.fx * w + ptr.x * 26 * b.depth;
        const cy = b.fy * h + ptr.y * 20 * b.depth + (reduce ? 0 : Math.sin(t * 0.0005 + b.fx * 10) * b.bob);
        if (b.type === "wire") drawWire(b, cx, cy, rr, t);
        else if (b.type === "rings") drawRings(b, cx, cy, rr, t);
        else if (b.type === "bands") drawBands(b, cx, cy, rr, t);
        else if (b.type === "lava") drawLava(b, cx, cy, rr, t);
        else if (b.type === "ice") drawIce(b, cx, cy, rr, t);
        else drawMoon(b, cx, cy, rr, t);
      }
    }

    const loop = (now: number) => { if (!start0) start0 = now; draw(now - start0); raf = requestAnimationFrame(loop); };
    const startLoop = () => { if (running || reduce || !visible) return; running = true; raf = requestAnimationFrame(loop); };
    const stopLoop = () => { running = false; cancelAnimationFrame(raf); };

    const onMove = (e: MouseEvent) => {
      const rect = parent.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width - 0.5;
      const ny = (e.clientY - rect.top) / rect.height - 0.5;
      if (nx >= -0.5 && nx <= 0.5 && ny >= -0.5 && ny <= 0.5) { ptr.tx = nx; ptr.ty = ny; }
    };
    const onVisibility = () => { visible = !document.hidden; if (visible) startLoop(); else stopLoop(); };

    resize();
    if (reduce) {
      draw(0);
      window.addEventListener("resize", resize);
      return () => window.removeEventListener("resize", resize);
    }
    const io = new IntersectionObserver(
      (entries) => { visible = entries[0]?.isIntersecting ?? true; if (visible && !document.hidden) startLoop(); else stopLoop(); },
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

  return <canvas ref={canvasRef} className="v2-heroglobe" aria-hidden="true" />;
}
