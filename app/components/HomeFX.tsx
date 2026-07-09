"use client";

import { useEffect } from "react";

/* ──────────────────────────────────────────────────────────────
   HomeFX — renders nothing. Holds the homepage's document-level
   effects so the page itself can be a server component:
   • v2-shell body class (dark full-bleed shell for this route)
   • hero parallax custom properties (--px/--py)
   • scroll-reveal IntersectionObserver
   • cursor spotlight on glass cards
   All pointer handlers are rAF-throttled and cache rects instead
   of calling getBoundingClientRect per event (forced layout).
   ────────────────────────────────────────────────────────────── */

export default function HomeFX() {
  // dark full-bleed shell for this route only
  useEffect(() => {
    document.body.classList.add("v2-shell");
    return () => document.body.classList.remove("v2-shell");
  }, []);

  // hero parallax (crosshair + rings track cursor) — rAF-throttled, cached rect
  useEffect(() => {
    const el = document.querySelector<HTMLElement>(".v2-hero");
    if (!el) return;
    let rect = el.getBoundingClientRect();
    let raf = 0;
    let cx = 0, cy = 0;
    const apply = () => {
      raf = 0;
      el.style.setProperty("--px", String((cx - rect.left) / rect.width - 0.5));
      el.style.setProperty("--py", String((cy - rect.top) / rect.height - 0.5));
    };
    const move = (e: MouseEvent) => {
      cx = e.clientX; cy = e.clientY;
      if (!raf) raf = requestAnimationFrame(apply);
    };
    const refresh = () => { rect = el.getBoundingClientRect(); };
    el.addEventListener("mousemove", move, { passive: true });
    window.addEventListener("resize", refresh);
    window.addEventListener("scroll", refresh, { passive: true });
    return () => {
      el.removeEventListener("mousemove", move);
      window.removeEventListener("resize", refresh);
      window.removeEventListener("scroll", refresh);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // scroll reveal
  useEffect(() => {
    const io = new IntersectionObserver(
      (en) => en.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("is-visible"); io.unobserve(e.target); } }),
      { threshold: 0.1 }
    );
    document.querySelectorAll(".v2-reveal").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // cursor-tracking spotlight on glass cards (Linear/Vercel-style light-follows-mouse)
  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      const card = (e.target as HTMLElement)?.closest?.(".v2-cell, .v2-duel") as HTMLElement | null;
      if (!card) return;
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const r = card.getBoundingClientRect();
        card.style.setProperty("--mx", `${e.clientX - r.left}px`);
        card.style.setProperty("--my", `${e.clientY - r.top}px`);
      });
    };
    document.addEventListener("pointermove", onMove, { passive: true });
    return () => { document.removeEventListener("pointermove", onMove); if (raf) cancelAnimationFrame(raf); };
  }, []);

  return null;
}
