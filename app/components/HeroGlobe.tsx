"use client";

import { useEffect, useRef } from "react";

/* ──────────────────────────────────────────────────────────
   HeroGlobe — a small SYSTEM of celestial bodies scattered
   around the hero periphery. The planets are now PHOTOREAL:
   real equirectangular texture maps (CC-BY, Solar System Scope)
   are projected onto a sphere once into a cached, lit offscreen
   sprite, then composited each frame with parallax / bob / glow.
   The signature "intelligence globe" stays a procedural wireframe.

     • planet — textured sphere sprite (Jupiter / Mars / Neptune /
                Saturn+rings / Moon), single upper-left sun
     • wire   — rotating holographic wireframe + orbiting sats

   Because the planets carry real (dark-sided) texture, the layer
   no longer uses mix-blend-mode:screen (which would erase night
   sides). It renders with normal blend; only the additive glows
   and the wire globe use 'lighter' compositing locally.

   Guardrails unchanged: reduced-motion → static frame,
   IntersectionObserver + visibilitychange pause, DPR capped at 2,
   pointer-events:none, smaller/slower on mobile.
   ────────────────────────────────────────────────────────── */

const D2R = Math.PI / 180;
const TEX_BASE = "/textures/planets/";

// single shared light source (upper-left, tipped slightly toward the viewer).
const LIGHT = (() => {
  const x = -0.55, y = -0.62, z = 0.62, l = Math.hypot(x, y, z);
  return { x: x / l, y: y / l, z: z / l, ang: Math.atan2(y, x) };
})();

type BodyType = "wire" | "planet";
type Body = {
  type: BodyType;
  tex?: string;             // texture filename (planet)
  ring?: boolean;           // draw a ring system (Saturn)
  tint?: [number, number, number]; // colorize the texture toward this RGB (fit theme)
  fx: number; fy: number;   // fractional position in the hero
  r: number;                // radius in px (desktop)
  spin: number;             // rotation speed (rad/ms) — wire only
  tilt: number;             // axial tilt (rad)
  depth: number;            // parallax depth 0..1
  bob: number;              // vertical bob amplitude (px)
  col: string;              // base "r,g,b" (glow / wire)
  accent: string;           // accent "r,g,b" (atmosphere)
  far?: boolean;            // distant body → dimmed + softly blurred
  dim?: number;             // explicit opacity override (0..1)
  // runtime — precomputed projection LUT + per-frame compositing buffers
  spriteKey?: string;         // size bucket the LUT was built at
  lut?: PlanetLUT;
  fbuf?: ImageData;           // reusable RGBA buffer (alpha baked, RGB per frame)
  fcv?: HTMLCanvasElement;    // offscreen canvas the buffer is painted into
  fcx?: CanvasRenderingContext2D;
};

// Per-pixel projection lookup: for each lit pixel inside the disc we store the
// fixed texture row, the base longitude (0..1), the lighting shade and the dest
// index. Rotation is then just "add a longitude offset + resample" each frame —
// no trig, so all five planets can spin smoothly without re-projecting.
type PlanetLUT = { rowOff: Int32Array; uBase: Float32Array; shade: Float32Array; dst: Int32Array; n: number; tw: number };

// Composition: ONE dominant hero (Saturn + rings, right third beside the
// headline) with its Moon. Everything else is a smaller, dimmed, softly
// blurred DISTANT body — depth from scale × opacity × blur. The wireframe
// globe is the signature motif on the lower-left.
const BODIES: Body[] = [
  // ── DISTANT FIELD (drawn first, far behind) ──
  { type: "planet", tex: "2k_jupiter.jpg", fx: 0.11, fy: 0.23, r: 36, spin: 0.000030, tilt: 0.26, depth: 0.9,  bob: 3, col: "208,178,140", accent: "255,206,150", far: true, dim: 0.66 },
  { type: "planet", tex: "2k_mars.jpg",    fx: 0.40, fy: 0.12, r: 24, spin: 0.000020, tilt: 0.32, depth: 0.95, bob: 3, col: "198,120,82",  accent: "255,156,104", far: true, dim: 0.6 },
  { type: "planet", tex: "2k_neptune.jpg", fx: 0.30, fy: 0.86, r: 32, spin: -0.000024, tilt: 0.40, depth: 0.85, bob: 4, col: "110,150,228", accent: "150,196,255", far: true, dim: 0.64 },
  // ── MID: the wireframe intelligence globe (signature, secondary) ──
  { type: "wire",   fx: 0.15, fy: 0.60, r: 44, spin: 0.00016, tilt: 0.42, depth: 0.62, bob: 5, col: "120,170,255", accent: "120,212,255", dim: 0.82 },
  // ── HERO: dominant ringed gas giant + its moon, tinted to the site's blue ──
  { type: "planet", tex: "2k_saturn.jpg", ring: true, tint: [132, 176, 255], fx: 0.80, fy: 0.44, r: 72, spin: 0.000013, tilt: 0.46, depth: 0.42, bob: 6, col: "150,185,255", accent: "150,200,255" },
  { type: "planet", tex: "2k_moon.jpg",   fx: 0.93, fy: 0.67, r: 25, spin: 0.000009, tilt: 0.06, depth: 0.30, bob: 7, col: "182,196,222", accent: "210,218,236", far: true, dim: 0.8 },
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

// surface hubs + great-circle network arcs for the wire globe
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

/* ── texture cache: equirectangular maps sampled once into ImageData ── */
type TexData = { data: Uint8ClampedArray; tw: number; th: number };
const TEXTURES = new Map<string, { img: HTMLImageElement; ready: boolean; sampled?: TexData }>();
function loadTexture(name: string) {
  if (TEXTURES.has(name)) return;
  const img = new Image();
  const rec = { img, ready: false } as { img: HTMLImageElement; ready: boolean; sampled?: TexData };
  img.onload = () => { rec.ready = true; };
  img.src = TEX_BASE + name;
  TEXTURES.set(name, rec);
}
function sampleTexture(name: string): TexData | null {
  const rec = TEXTURES.get(name);
  if (!rec || !rec.ready) return null;
  if (rec.sampled) return rec.sampled;
  const tw = rec.img.naturalWidth, th = rec.img.naturalHeight;
  if (!tw || !th) return null;
  const tc = document.createElement("canvas");
  tc.width = tw; tc.height = th;
  const tctx = tc.getContext("2d", { willReadFrequently: true });
  if (!tctx) return null;
  tctx.drawImage(rec.img, 0, 0);
  try {
    rec.sampled = { data: tctx.getImageData(0, 0, tw, th).data, tw, th };
  } catch { return null; }
  return rec.sampled;
}

/* ── build a projection lookup table for a lit, spinnable sphere (once) ──
   For each output pixel we derive the sphere normal, undo the axial tilt to
   read body-local lon/lat, and precompute: the texture ROW (fixed — latitude
   doesn't change as the planet spins about its axis), the BASE longitude
   (0..1), the lighting shade (diffuse dot-product + limb darkening) and the
   destination index. The rim alpha is baked straight into the supplied frame
   buffer. Per frame we then only add a longitude offset and resample — cheap
   enough to spin every planet at 60fps. */
function buildPlanetLUT(tex: TexData, sizePx: number, tilt: number, fbuf: ImageData): PlanetLUT {
  const dst = fbuf.data;
  const { tw, th } = tex;
  const R = sizePx / 2;
  const ct = Math.cos(tilt), stt = Math.sin(tilt);
  const Lx = LIGHT.x, Ly = LIGHT.y, Lz = LIGHT.z;
  const TWO_PI = Math.PI * 2;
  const cap = sizePx * sizePx;
  const rowOff = new Int32Array(cap);
  const uBase = new Float32Array(cap);
  const shade = new Float32Array(cap);
  const dstA = new Int32Array(cap);
  let n = 0;
  for (let py = 0; py < sizePx; py++) {
    const ny = (py - R + 0.5) / R;
    for (let px = 0; px < sizePx; px++) {
      const nx = (px - R + 0.5) / R;
      const r2 = nx * nx + ny * ny;
      const di = (py * sizePx + px) * 4;
      if (r2 >= 1) { dst[di + 3] = 0; continue; }
      const nz = Math.sqrt(1 - r2);
      // undo axial tilt (rotate by -tilt about X) → body-local coords
      const by = ny * ct + nz * stt;
      const bz = -ny * stt + nz * ct;
      const lon = Math.atan2(nx, bz);
      const lat = Math.asin(by < -1 ? -1 : by > 1 ? 1 : by);
      let u = lon / TWO_PI + 0.5; u -= Math.floor(u);
      const v = 0.5 - lat / Math.PI;
      const sy = (v * th) | 0;
      // diffuse + ambient, with limb darkening toward the rim
      let diff = nx * Lx + ny * Ly + nz * Lz;
      if (diff < 0) diff = 0;
      const limb = 0.62 + 0.38 * nz;
      let sh = (0.2 + 0.8 * Math.pow(diff, 0.85)) * limb;
      if (sh > 1.18) sh = 1.18;
      rowOff[n] = (sy < th ? sy : th - 1) * tw * 4;
      uBase[n] = u;
      shade[n] = sh;
      dstA[n] = di;
      // rim anti-alias (feather the outer ~1.5px) — alpha is fixed, baked once
      const edge = 1 - r2;
      dst[di + 3] = edge < 0.05 ? (edge / 0.05) * 255 : 255;
      n++;
    }
  }
  return { rowOff, uBase, shade, dst: dstA, n, tw };
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

    // kick off texture loads up-front
    for (const b of BODIES) if (b.tex) loadTexture(b.tex);

    let w = 0, h = 0, mobile = false, sizeMul = 1;
    let raf = 0, running = false, visible = true, start0 = 0;
    const ptr = { tx: 0, ty: 0, x: 0, y: 0 };

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
      for (const b of BODIES) { b.lut = undefined; b.fbuf = undefined; b.fcv = undefined; b.fcx = undefined; b.spriteKey = undefined; } // rebuild at new scale
      if (reduce) draw(0);
    };

    /* ---- wireframe sphere projection ---- */
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
    // crisp fresnel highlight hugging the lit limb (additive)
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
        for (let tr = 0; tr < 4; tr++) {
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
      fresnelArc(cx, cy, rr, b.accent, 0.4, 1.4);
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

    /* ---- Saturn ring system — tilted multi-band, split behind/in-front ---- */
    const RING_BANDS = [
      { radF: 1.34, widthF: 0.030, alpha: 0.12 },
      { radF: 1.46, widthF: 0.060, alpha: 0.30 },
      { radF: 1.60, widthF: 0.105, alpha: 0.62 },
      { radF: 1.74, widthF: 0.080, alpha: 0.46 },
      // Cassini gap
      { radF: 1.94, widthF: 0.070, alpha: 0.34 },
      { radF: 2.06, widthF: 0.024, alpha: 0.18 },
    ];
    function ringHalf(b: Body, cx: number, cy: number, rr: number, t: number, front: boolean) {
      const st = Math.sin(b.tilt), ct = Math.cos(b.tilt);
      for (const band of RING_BANDS) {
        const radius = rr * band.radF;
        const shimmer = 0.82 + 0.18 * Math.sin(t * 0.003 + band.radF * 9.3);
        const alpha = band.alpha * shimmer * (front ? 1 : 0.55);
        g.lineWidth = Math.max(1, rr * band.widthF);
        g.strokeStyle = `rgba(${b.accent},${alpha.toFixed(3)})`;
        g.beginPath(); let started = false;
        for (let s = 0; s <= 128; s++) {
          const th = (s / 128) * Math.PI * 2;
          const X = Math.cos(th) * radius, Z = Math.sin(th) * radius;
          const depth = Z * ct, sx = cx + X, sy = cy + Z * st;
          if ((depth >= 0) !== front) { started = false; continue; }
          if (!started) { g.moveTo(sx, sy); started = true; } else g.lineTo(sx, sy);
        }
        g.stroke();
      }
    }

    /* ---- textured planet — cached lit sprite + atmosphere glow ---- */
    function drawPlanet(b: Body, cx: number, cy: number, rr: number, t: number) {
      // build / rebuild the projection LUT for this size bucket
      const key = `${Math.round(rr)}`;
      const tex = b.tex ? sampleTexture(b.tex) : null;
      if (b.spriteKey !== key && tex) {
        const px = Math.max(32, Math.ceil(rr * 2 * dpr));
        const fcv = document.createElement("canvas");
        fcv.width = px; fcv.height = px;
        const fcx = fcv.getContext("2d");
        if (fcx) {
          const fbuf = fcx.createImageData(px, px);
          b.lut = buildPlanetLUT(tex, px, b.tilt, fbuf);
          b.fbuf = fbuf; b.fcv = fcv; b.fcx = fcx; b.spriteKey = key;
        }
      }

      // atmosphere glow behind everything (additive)
      g.save();
      g.globalCompositeOperation = "lighter";
      const halo = g.createRadialGradient(cx, cy, rr * 0.9, cx, cy, rr * 1.32);
      halo.addColorStop(0, `rgba(${b.accent},0.14)`);
      halo.addColorStop(0.55, `rgba(${b.accent},0.07)`);
      halo.addColorStop(1, `rgba(${b.accent},0)`);
      g.fillStyle = halo; g.beginPath(); g.arc(cx, cy, rr * 1.32, 0, Math.PI * 2); g.fill();
      // brighter sunward crescent on the lit limb
      const awx = cx + LIGHT.x * rr * 0.5, awy = cy + LIGHT.y * rr * 0.5;
      const cres = g.createRadialGradient(awx, awy, rr * 0.55, awx, awy, rr * 1.25);
      cres.addColorStop(0, `rgba(${b.accent},0.1)`);
      cres.addColorStop(0.7, `rgba(${b.accent},0.05)`);
      cres.addColorStop(1, `rgba(${b.accent},0)`);
      g.fillStyle = cres; g.beginPath(); g.arc(cx, cy, rr * 1.25, 0, Math.PI * 2); g.fill();
      g.restore();

      // rings — back halves behind the body
      if (b.ring) ringHalf(b, cx, cy, rr, t, false);

      // the textured sphere itself — spun by scrolling the sampled longitude,
      // then composited (normal blend over the dark hero)
      if (b.lut && b.fbuf && b.fcv && b.fcx && tex) {
        const { rowOff, uBase, shade, dst, n, tw } = b.lut;
        const src = tex.data, d = b.fbuf.data;
        let spin = reduce ? 0 : (t * b.spin) % 1; if (spin < 0) spin += 1;
        const tint = b.tint;
        if (tint) {
          const tr = tint[0], tg = tint[1], tb = tint[2];
          for (let i = 0; i < n; i++) {
            let u = uBase[i] + spin; if (u >= 1) u -= 1;
            const si = rowOff[i] + ((u * tw) | 0) * 4, di = dst[i], sh = shade[i];
            const lum = (0.299 * src[si] + 0.587 * src[si + 1] + 0.114 * src[si + 2]) / 255;
            const ramp = (0.32 + 0.78 * lum) * sh;
            d[di] = tr * ramp; d[di + 1] = tg * ramp; d[di + 2] = tb * ramp;
          }
        } else {
          for (let i = 0; i < n; i++) {
            let u = uBase[i] + spin; if (u >= 1) u -= 1;
            const si = rowOff[i] + ((u * tw) | 0) * 4, di = dst[i], sh = shade[i];
            d[di] = src[si] * sh; d[di + 1] = src[si + 1] * sh; d[di + 2] = src[si + 2] * sh;
          }
        }
        b.fcx.putImageData(b.fbuf, 0, 0);
        g.drawImage(b.fcv, cx - rr, cy - rr, rr * 2, rr * 2);
      } else {
        // graceful fallback until the texture loads: a simple shaded disc
        const grd = g.createRadialGradient(cx + LIGHT.x * rr * 0.5, cy + LIGHT.y * rr * 0.5, rr * 0.1, cx, cy, rr);
        grd.addColorStop(0, `rgba(${b.col},0.9)`); grd.addColorStop(1, `rgba(${b.col},0.12)`);
        g.fillStyle = grd; g.beginPath(); g.arc(cx, cy, rr, 0, Math.PI * 2); g.fill();
      }

      // lit-limb fresnel + cast ring shadow band, then front ring halves
      g.save();
      g.globalCompositeOperation = "lighter";
      fresnelArc(cx, cy, rr, b.accent, 0.3, 1.3);
      g.restore();

      if (b.ring) {
        // soft ring shadow cast across the body equator
        g.save();
        g.beginPath(); g.arc(cx, cy, rr, 0, Math.PI * 2); g.clip();
        g.fillStyle = "rgba(3,7,18,0.28)";
        g.fillRect(cx - rr, cy - rr * 0.06, rr * 2, rr * 0.12);
        g.restore();
        ringHalf(b, cx, cy, rr, t, true);
        // orbiting moonlet
        const ma = t * 0.0006, mFront = Math.sin(ma) >= 0;
        const mx = cx + Math.cos(ma) * rr * 2.35, my = cy + Math.sin(ma) * rr * 0.78;
        g.fillStyle = `rgba(${b.accent},${mFront ? 0.85 : 0.4})`;
        g.beginPath(); g.arc(mx, my, mFront ? 1.8 : 1.3, 0, Math.PI * 2); g.fill();
      }
    }

    function draw(t: number) {
      g.clearRect(0, 0, w, h);
      ptr.x += (ptr.tx - ptr.x) * 0.05;
      ptr.y += (ptr.ty - ptr.y) * 0.05;
      for (const b of BODIES) {
        const rr = b.r * sizeMul;
        const par = b.far ? 40 : 26;
        const cx = b.fx * w + ptr.x * par * b.depth;
        const cy = b.fy * h + ptr.y * (par * 0.78) * b.depth + (reduce ? 0 : Math.sin(t * 0.0005 + b.fx * 10) * b.bob);
        g.save();
        if (b.dim != null) g.globalAlpha = b.dim;
        if (b.far) g.filter = mobile ? "none" : "blur(1.1px)";
        if (b.type === "wire") {
          g.globalCompositeOperation = "lighter"; // light-on-dark holographic glow
          drawWire(b, cx, cy, rr, t);
        } else {
          drawPlanet(b, cx, cy, rr, t);
        }
        g.filter = "none";
        g.restore();
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
      // draw once now and again shortly after, in case textures are still loading
      draw(0);
      const retry = window.setInterval(() => { draw(0); }, 250);
      window.setTimeout(() => window.clearInterval(retry), 3000);
      window.addEventListener("resize", resize);
      return () => { window.clearInterval(retry); window.removeEventListener("resize", resize); };
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
