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

type BodyType = "wire" | "rings" | "bands" | "moon";
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
  dots?: { x: number; y: number; s: number }[]; // moon stipple (unit disk)
};

const BODIES: Body[] = [
  { type: "wire",  fx: 0.84, fy: 0.30, r: 60, spin: 0.00016, tilt: 0.42, depth: 0.7, bob: 5, col: "120,170,255", accent: "120,212,255" },
  { type: "rings", fx: 0.15, fy: 0.66, r: 45, spin: 0.00012, tilt: 0.95, depth: 0.5, bob: 7, col: "150,185,255", accent: "255,150,120" },
  { type: "bands", fx: 0.21, fy: 0.20, r: 37, spin: 0.00022, tilt: 0.30, depth: 0.85, bob: 4, col: "130,175,255", accent: "255,110,104" },
  { type: "moon",  fx: 0.80, fy: 0.72, r: 30, spin: 0.00006, tilt: 0.00, depth: 0.4, bob: 8, col: "160,180,215", accent: "120,150,200" },
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

    // seed moon stipple once
    for (const b of BODIES) {
      if (b.type === "moon" && !b.dots) {
        b.dots = Array.from({ length: 26 }, () => {
          const a = Math.random() * Math.PI * 2, rr = Math.sqrt(Math.random()) * 0.9;
          return { x: Math.cos(a) * rr, y: Math.sin(a) * rr, s: 0.5 + Math.random() * 1.1 };
        });
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
      for (const l of LAT_LINES) strokeWire(l, true, cx, cy, rr, cr, sr, ct, st, b.col);
      for (const l of LON_LINES) strokeWire(l, false, cx, cy, rr, cr, sr, ct, st, b.col);
      g.strokeStyle = `rgba(${b.col},0.26)`; g.lineWidth = 1;
      g.beginPath(); g.arc(cx, cy, rr, 0, Math.PI * 2); g.stroke();
      // orbiting satellites
      for (let k = 0; k < 2; k++) {
        const ang = t * 0.0006 * (k ? -1 : 1) + k * Math.PI;
        const X = Math.cos(ang) * rr * 1.5, Z = Math.sin(ang) * rr * 1.5;
        const sx = cx + X, sy = cy + Z * 0.34, front = Math.sin(ang) >= 0;
        g.fillStyle = `rgba(${b.accent},${front ? 0.95 : 0.4})`;
        g.beginPath(); g.arc(sx, sy, front ? 1.8 : 1.2, 0, Math.PI * 2); g.fill();
      }
    }

    /* ---- ringed planet ---- */
    function drawRings(b: Body, cx: number, cy: number, rr: number, t: number) {
      const rot = t * b.spin, ringR = rr * 1.95, st = Math.sin(b.tilt), ct = Math.cos(b.tilt);
      const ringPt = (th: number) => {
        const X = Math.cos(th + rot * 0.4) * ringR, Z = Math.sin(th + rot * 0.4) * ringR;
        return { sx: cx + X, sy: cy + Z * st, depth: Z * ct };
      };
      const drawRingHalf = (front: boolean) => {
        g.lineWidth = Math.max(1.4, rr * 0.12);
        g.strokeStyle = `rgba(${b.accent},${front ? 0.5 : 0.16})`;
        g.beginPath(); let started = false;
        for (let s = 0; s <= 96; s++) {
          const th = (s / 96) * Math.PI * 2, p = ringPt(th);
          if ((p.depth >= 0) !== front) { started = false; continue; }
          if (!started) { g.moveTo(p.sx, p.sy); started = true; } else g.lineTo(p.sx, p.sy);
        }
        g.stroke();
      };
      drawRingHalf(false); // back of ring
      // planet body
      const grad = g.createRadialGradient(cx - rr * 0.3, cy - rr * 0.3, rr * 0.2, cx, cy, rr);
      grad.addColorStop(0, `rgba(${b.col},0.22)`); grad.addColorStop(1, `rgba(${b.col},0.04)`);
      g.fillStyle = grad; g.beginPath(); g.arc(cx, cy, rr, 0, Math.PI * 2); g.fill();
      g.strokeStyle = `rgba(${b.col},0.30)`; g.lineWidth = 1; g.beginPath(); g.arc(cx, cy, rr, 0, Math.PI * 2); g.stroke();
      drawRingHalf(true); // front of ring
      // small moon
      const ma = t * 0.0009;
      const mx = cx + Math.cos(ma) * rr * 2.3, my = cy + Math.sin(ma) * rr * 0.7;
      g.fillStyle = `rgba(${b.col},0.85)`; g.beginPath(); g.arc(mx, my, 1.6, 0, Math.PI * 2); g.fill();
    }

    /* ---- banded gas giant ---- */
    function drawBands(b: Body, cx: number, cy: number, rr: number, t: number) {
      g.save();
      g.beginPath(); g.arc(cx, cy, rr, 0, Math.PI * 2); g.clip();
      const N = 7;
      for (let i = 0; i < N; i++) {
        const y0 = cy - rr + (i / N) * rr * 2, y1 = cy - rr + ((i + 1) / N) * rr * 2;
        const a = 0.05 + 0.12 * (i % 2) + 0.03 * Math.sin(t * 0.0008 + i);
        g.fillStyle = `rgba(${b.col},${a.toFixed(3)})`;
        g.fillRect(cx - rr, y0, rr * 2, y1 - y0 + 0.5);
      }
      // storm spot rolls with rotation; only visible on the near face
      const ph = (t * b.spin) % (Math.PI * 2), face = Math.cos(ph);
      if (face > 0) {
        const sx = cx + Math.sin(ph) * rr * 0.7, sy = cy + rr * 0.22;
        g.fillStyle = `rgba(${b.accent},${(0.55 * face).toFixed(3)})`;
        g.beginPath(); g.ellipse(sx, sy, rr * 0.22 * face, rr * 0.13, 0, 0, Math.PI * 2); g.fill();
      }
      g.restore();
      g.strokeStyle = `rgba(${b.col},0.32)`; g.lineWidth = 1; g.beginPath(); g.arc(cx, cy, rr, 0, Math.PI * 2); g.stroke();
    }

    /* ---- stippled moon with terminator ---- */
    function drawMoon(b: Body, cx: number, cy: number, rr: number, t: number) {
      g.save();
      g.beginPath(); g.arc(cx, cy, rr, 0, Math.PI * 2); g.clip();
      g.fillStyle = `rgba(${b.col},0.07)`; g.fillRect(cx - rr, cy - rr, rr * 2, rr * 2);
      // stipple
      for (const d of b.dots!) {
        g.fillStyle = `rgba(${b.col},0.5)`;
        g.beginPath(); g.arc(cx + d.x * rr, cy + d.y * rr, d.s, 0, Math.PI * 2); g.fill();
      }
      // craters
      g.strokeStyle = `rgba(${b.col},0.4)`; g.lineWidth = 0.8;
      g.beginPath(); g.arc(cx - rr * 0.3, cy - rr * 0.2, rr * 0.22, 0, Math.PI * 2); g.stroke();
      g.beginPath(); g.arc(cx + rr * 0.35, cy + rr * 0.3, rr * 0.15, 0, Math.PI * 2); g.stroke();
      // terminator — night shadow sweeps slowly across
      const ph = Math.sin(t * b.spin) * rr * 1.4;
      g.fillStyle = "rgba(5,10,26,0.62)";
      g.beginPath(); g.arc(cx + rr * 1.1 + ph, cy, rr * 1.5, 0, Math.PI * 2); g.fill();
      g.restore();
      g.strokeStyle = `rgba(${b.col},0.34)`; g.lineWidth = 1; g.beginPath(); g.arc(cx, cy, rr, 0, Math.PI * 2); g.stroke();
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
