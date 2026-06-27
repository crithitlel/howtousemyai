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
  craters?: { x: number; y: number; r: number }[];        // moon craters (unit disk)
  cracks?: { x: number; y: number }[][];                  // lava/ice surface fractures (unit disk)
};

const BODIES: Body[] = [
  { type: "wire",  fx: 0.84, fy: 0.30, r: 60, spin: 0.00016, tilt: 0.42, depth: 0.7, bob: 5, col: "120,170,255", accent: "120,212,255" },
  { type: "rings", fx: 0.15, fy: 0.66, r: 45, spin: 0.00012, tilt: 0.95, depth: 0.5, bob: 7, col: "150,185,255", accent: "255,150,120" },
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
        b.craters = Array.from({ length: 6 }, () => {
          const a = Math.random() * Math.PI * 2, rr = Math.sqrt(Math.random()) * 0.72;
          return { x: Math.cos(a) * rr, y: Math.sin(a) * rr, r: 0.1 + Math.random() * 0.16 };
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
        const fp = (t * 0.00018 + k * 0.37) % 1, pk = pts[Math.floor(fp * (pts.length - 1))];
        if (pk && pk.depth >= 0) { g.fillStyle = `rgba(${b.accent},0.95)`; g.beginPath(); g.arc(pk.sx, pk.sy, 1.4, 0, Math.PI * 2); g.fill(); }
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
      { radF: 1.42, widthF: 0.05, alpha: 0.16 },  // faint inner C ring
      { radF: 1.66, widthF: 0.17, alpha: 0.52 },  // bright main B ring
      { radF: 1.92, widthF: 0.06, alpha: 0.30 },  // A ring (Cassini gap before it)
    ];
    function drawRings(b: Body, cx: number, cy: number, rr: number, t: number) {
      const rot = t * b.spin, st = Math.sin(b.tilt), ct = Math.cos(b.tilt);
      const ringHalf = (radF: number, widthF: number, alpha: number, front: boolean) => {
        const radius = rr * radF;
        g.lineWidth = Math.max(1, rr * widthF);
        g.strokeStyle = `rgba(${b.accent},${(front ? alpha : alpha * 0.28).toFixed(3)})`;
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
      // planet body
      const grad = g.createRadialGradient(cx - rr * 0.35, cy - rr * 0.35, rr * 0.1, cx, cy, rr);
      grad.addColorStop(0, `rgba(${b.col},0.30)`); grad.addColorStop(0.7, `rgba(${b.col},0.10)`); grad.addColorStop(1, `rgba(${b.col},0.02)`);
      g.fillStyle = grad; g.beginPath(); g.arc(cx, cy, rr, 0, Math.PI * 2); g.fill();
      g.save();
      g.beginPath(); g.arc(cx, cy, rr, 0, Math.PI * 2); g.clip();
      for (let i = 0; i < 5; i++) {  // faint cloud bands
        const yy = cy - rr * 0.6 + (i / 4) * rr * 1.2;
        g.fillStyle = `rgba(${b.col},${(0.05 + 0.04 * (i % 2)).toFixed(3)})`;
        g.fillRect(cx - rr, yy, rr * 2, rr * 0.16);
      }
      g.fillStyle = "rgba(3,7,20,0.32)"; g.fillRect(cx - rr, cy - rr * 0.05, rr * 2, rr * 0.1); // ring shadow line
      const sh = g.createRadialGradient(cx - rr * 0.35, cy - rr * 0.35, rr * 0.1, cx, cy, rr * 1.02); // limb shading
      sh.addColorStop(0, "rgba(255,255,255,0.06)"); sh.addColorStop(0.65, "rgba(0,0,0,0)"); sh.addColorStop(1, "rgba(2,6,18,0.5)");
      g.fillStyle = sh; g.fillRect(cx - rr, cy - rr, rr * 2, rr * 2);
      g.restore();
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
      g.fillStyle = `rgba(${b.col},0.08)`; g.fillRect(cx - rr, cy - rr, rr * 2, rr * 2);
      const strips = 40, drift = Math.sin(t * 0.0003) * 0.5;
      for (let i = 0; i < strips; i++) {
        const yy = cy - rr + (i / strips) * rr * 2, lat = (yy - cy) / rr;
        const v = Math.sin(lat * 6.5 + drift) * 0.5 + 0.5;
        const warm = Math.sin(lat * 6.5 + drift + 1.6) > 0.6;
        const a = 0.04 + 0.12 * v + 0.02 * Math.sin(t * 0.0009 + i * 0.6);
        g.fillStyle = warm ? `rgba(${b.accent},${(a * 0.5).toFixed(3)})` : `rgba(${b.col},${a.toFixed(3)})`;
        g.fillRect(cx - rr, yy, rr * 2, rr * 2 / strips + 0.7);
      }
      // great storm — swirling oval, near face only
      const ph = (t * b.spin) % (Math.PI * 2), face = Math.cos(ph);
      if (face > 0) {
        const sx = cx + Math.sin(ph) * rr * 0.6, sy = cy + rr * 0.24;
        const w0 = rr * 0.26 * face, h0 = rr * 0.15;
        g.fillStyle = `rgba(${b.accent},${(0.5 * face).toFixed(3)})`;
        g.beginPath(); g.ellipse(sx, sy, w0, h0, 0, 0, Math.PI * 2); g.fill();
        g.strokeStyle = `rgba(${b.col},${(0.4 * face).toFixed(3)})`; g.lineWidth = 0.8;
        g.beginPath(); g.ellipse(sx, sy, w0 * 0.6, h0 * 0.6, 0, 0, Math.PI * 2); g.stroke();
        g.beginPath(); g.ellipse(sx, sy, w0 * 0.3, h0 * 0.3, 0, 0, Math.PI * 2); g.stroke();
      }
      const sh = g.createRadialGradient(cx - rr * 0.4, cy - rr * 0.4, rr * 0.1, cx, cy, rr * 1.05);
      sh.addColorStop(0, "rgba(255,255,255,0.07)"); sh.addColorStop(0.6, "rgba(0,0,0,0)"); sh.addColorStop(1, "rgba(2,6,18,0.55)");
      g.fillStyle = sh; g.fillRect(cx - rr, cy - rr, rr * 2, rr * 2);
      g.restore();
      g.strokeStyle = `rgba(${b.col},0.32)`; g.lineWidth = 1; g.beginPath(); g.arc(cx, cy, rr, 0, Math.PI * 2); g.stroke();
    }

    /* ---- cratered moon — maria, 3D crater rims, soft sweeping terminator ---- */
    function drawMoon(b: Body, cx: number, cy: number, rr: number, t: number) {
      g.save();
      g.beginPath(); g.arc(cx, cy, rr, 0, Math.PI * 2); g.clip();
      g.fillStyle = `rgba(${b.col},0.12)`; g.fillRect(cx - rr, cy - rr, rr * 2, rr * 2);
      // maria — darker basaltic plains
      g.fillStyle = `rgba(${b.accent},0.1)`;
      g.beginPath(); g.ellipse(cx - rr * 0.25, cy - rr * 0.15, rr * 0.4, rr * 0.32, 0.4, 0, Math.PI * 2); g.fill();
      g.beginPath(); g.ellipse(cx + rr * 0.3, cy + rr * 0.35, rr * 0.28, rr * 0.2, -0.3, 0, Math.PI * 2); g.fill();
      // regolith stipple
      for (const d of b.dots!) {
        g.fillStyle = `rgba(${b.col},0.45)`;
        g.beginPath(); g.arc(cx + d.x * rr, cy + d.y * rr, d.s, 0, Math.PI * 2); g.fill();
      }
      // craters with 3D rims (light top-left, shadow bottom-right)
      for (const c of b.craters!) {
        const ccx = cx + c.x * rr, ccy = cy + c.y * rr, cradius = c.r * rr;
        g.fillStyle = "rgba(3,8,22,0.22)";
        g.beginPath(); g.arc(ccx, ccy, cradius, 0, Math.PI * 2); g.fill();
        g.lineWidth = Math.max(0.6, cradius * 0.18);
        g.strokeStyle = `rgba(${b.col},0.55)`;
        g.beginPath(); g.arc(ccx, ccy, cradius, Math.PI * 0.75, Math.PI * 1.75); g.stroke();
        g.strokeStyle = "rgba(3,8,22,0.45)";
        g.beginPath(); g.arc(ccx, ccy, cradius, -Math.PI * 0.25, Math.PI * 0.75); g.stroke();
      }
      // soft terminator sweeping across the disc (phase)
      const mid = 0.5 + Math.sin(t * b.spin) * 0.42;
      const grad = g.createLinearGradient(cx - rr, cy, cx + rr, cy);
      grad.addColorStop(Math.max(0, mid - 0.18), "rgba(0,0,0,0)");
      grad.addColorStop(Math.min(1, mid + 0.02), "rgba(3,7,20,0.72)");
      g.fillStyle = grad; g.fillRect(cx - rr, cy - rr, rr * 2, rr * 2);
      g.restore();
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
      // glowing magma cracks (flickering)
      for (let ci = 0; ci < b.cracks!.length; ci++) {
        const cr = b.cracks![ci], flick = 0.5 + 0.5 * Math.sin(t * 0.004 + ci * 1.3);
        g.strokeStyle = `rgba(255,${(150 + 60 * flick) | 0},${(90 * flick) | 0},${(0.55 + 0.4 * flick).toFixed(3)})`;
        g.lineWidth = Math.max(1, rr * 0.05 * (0.6 + flick * 0.6));
        g.shadowColor = `rgba(${b.accent},0.9)`; g.shadowBlur = rr * 0.2 * flick;
        g.beginPath();
        for (let p = 0; p < cr.length; p++) { const X = cx + cr[p].x * rr, Y = cy + cr[p].y * rr; if (p === 0) g.moveTo(X, Y); else g.lineTo(X, Y); }
        g.stroke();
      }
      g.shadowBlur = 0;
      g.restore();
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
      // shimmering aurora bands near the upper pole
      for (let a = 0; a < 3; a++) {
        const yy = cy - rr * 0.5 - a * rr * 0.12;
        const alpha = (0.1 + 0.08 * Math.sin(t * 0.003 + a)) * (0.6 + 0.4 * Math.sin(t * 0.0012));
        g.strokeStyle = `rgba(120,212,255,${Math.max(0, alpha).toFixed(3)})`; g.lineWidth = 1.4;
        g.beginPath();
        for (let s = 0; s <= 20; s++) { const xx = cx - rr + (s / 20) * rr * 2, wob = Math.sin(s * 0.6 + t * 0.004 + a) * rr * 0.06; if (s === 0) g.moveTo(xx, yy + wob); else g.lineTo(xx, yy + wob); }
        g.stroke();
      }
      // limb shading + highlight
      const sh = g.createRadialGradient(cx - rr * 0.4, cy - rr * 0.4, rr * 0.1, cx, cy, rr * 1.02);
      sh.addColorStop(0, "rgba(255,255,255,0.08)"); sh.addColorStop(0.6, "rgba(0,0,0,0)"); sh.addColorStop(1, "rgba(4,10,24,0.5)");
      g.fillStyle = sh; g.fillRect(cx - rr, cy - rr, rr * 2, rr * 2);
      g.restore();
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
