"use client";

import { useEffect, useRef } from "react";

/* ──────────────────────────────────────────────────────────────
   HeroCanvas — a live, cursor-reactive particle CONSTELLATION.
   Hand-rolled <canvas> (no library): nodes drift with real
   velocity, link to nearby nodes with proximity lines, and the
   pointer gently repels + lights up the field around it. Blue is
   the base; rare red/green nodes echo the site's semantic accents.

   Guardrails (deliberate):
   • prefers-reduced-motion → render ONE static frame, no loop.
   • IntersectionObserver → pause the rAF loop when the hero
     scrolls out of view.
   • visibilitychange → pause when the tab is hidden.
   • devicePixelRatio-aware (capped at 2) for crisp + cheap render.
   • node count scales with area, hard-capped — O(n²) links stay
     ~4k ops/frame worst case, trivial even on an M1.
   pointer-events:none — never blocks clicks; pointer is tracked
   on window and mapped into the hero's box.
   ────────────────────────────────────────────────────────────── */

type Node = { x: number; y: number; vx: number; vy: number; r: number; c: [number, number, number] };

const BLUE: [number, number, number] = [24, 119, 242];
const RED: [number, number, number] = [228, 30, 63];
const GREEN: [number, number, number] = [170, 255, 0];

const LINK = 132; // px proximity at which two nodes link
const PULL = 150; // px radius of cursor influence

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
    let nodes: Node[] = [];
    let raf = 0;
    let running = false;
    let visible = true;

    const pointer = { x: -9999, y: -9999, active: false };

    const buildNodes = () => {
      const target = Math.max(28, Math.min(92, Math.round((w * h) / 16000)));
      nodes = Array.from({ length: target }, () => {
        const roll = Math.random();
        const c = roll > 0.95 ? RED : roll > 0.88 ? GREEN : BLUE;
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.24,
          vy: (Math.random() - 0.5) * 0.24,
          r: 0.8 + Math.random() * 1.5,
          c,
        };
      });
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
      buildNodes();
      if (reduce) draw(); // keep a static frame on resize
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);

      // advance + integrate
      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;

        if (pointer.active) {
          const dx = n.x - pointer.x;
          const dy = n.y - pointer.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < PULL * PULL) {
            const d = Math.sqrt(d2) || 1;
            const f = (1 - d / PULL) * 0.05; // gentle repel
            n.vx += (dx / d) * f;
            n.vy += (dy / d) * f;
          }
        }

        n.vx = Math.max(-0.6, Math.min(0.6, n.vx * 0.992));
        n.vy = Math.max(-0.6, Math.min(0.6, n.vy * 0.992));

        if (n.x < -12) n.x = w + 12;
        else if (n.x > w + 12) n.x = -12;
        if (n.y < -12) n.y = h + 12;
        else if (n.y > h + 12) n.y = -12;
      }

      // proximity links
      ctx.lineWidth = 0.6;
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < LINK * LINK) {
            const o = (1 - Math.sqrt(d2) / LINK) * 0.5;
            ctx.strokeStyle = `rgba(24,119,242,${o.toFixed(3)})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // cursor halo links (acid green)
      if (pointer.active) {
        const R = LINK * 1.45;
        ctx.lineWidth = 0.7;
        for (const n of nodes) {
          const dx = n.x - pointer.x;
          const dy = n.y - pointer.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < R * R) {
            const o = (1 - Math.sqrt(d2) / R) * 0.55;
            ctx.strokeStyle = `rgba(170,255,0,${o.toFixed(3)})`;
            ctx.beginPath();
            ctx.moveTo(n.x, n.y);
            ctx.lineTo(pointer.x, pointer.y);
            ctx.stroke();
          }
        }
      }

      // nodes (with soft glow on the rare accent dots)
      for (const n of nodes) {
        const [r, g, b] = n.c;
        if (n.c !== BLUE) {
          ctx.shadowColor = `rgba(${r},${g},${b},0.9)`;
          ctx.shadowBlur = 7;
        } else {
          ctx.shadowBlur = 0;
        }
        ctx.fillStyle = `rgba(${r},${g},${b},0.85)`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.shadowBlur = 0;
    };

    const loop = () => {
      draw();
      raf = requestAnimationFrame(loop);
    };

    const start = () => {
      if (running || reduce || !visible) return;
      running = true;
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    // pointer mapped from window → hero box
    const onMove = (e: MouseEvent) => {
      const rect = parent.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      pointer.active = x >= 0 && y >= 0 && x <= rect.width && y <= rect.height;
      pointer.x = x;
      pointer.y = y;
    };
    const onLeave = () => {
      pointer.active = false;
    };
    const onVisibility = () => {
      visible = !document.hidden;
      if (visible) start();
      else stop();
    };

    resize();

    if (reduce) {
      draw();
      window.addEventListener("resize", resize);
      return () => window.removeEventListener("resize", resize);
    }

    const io = new IntersectionObserver(
      (entries) => {
        visible = entries[0]?.isIntersecting ?? true;
        if (visible && !document.hidden) start();
        else stop();
      },
      { threshold: 0 }
    );
    io.observe(parent);

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseout", onLeave);
    document.addEventListener("visibilitychange", onVisibility);
    start();

    return () => {
      stop();
      io.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseout", onLeave);
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
