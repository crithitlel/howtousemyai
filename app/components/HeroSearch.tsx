"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { slugify, type Tool } from "@/lib/tools";
import { searchTools } from "@/lib/search";

const PLACEHOLDERS = [
  "CREATE A YOUTUBE VIDEO",
  "WRITE A COVER LETTER",
  "GENERATE BRAND IMAGERY",
  "DEBUG MY SOURCE CODE",
];

function Frame({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={`v2-frame ${className}`}>
      <i className="v2-cb v2-cb-tl" /><i className="v2-cb v2-cb-tr" />
      <i className="v2-cb v2-cb-bl" /><i className="v2-cb v2-cb-br" />
      {children}
    </div>
  );
}

// Owns the search box, typeahead, and typewriter placeholder — isolated from the
// rest of the homepage so keystrokes and the typewriter tick don't force a
// re-render of the entire page tree (hero + sectors + targets + workflows...).
export default function HeroSearch({ onFocusChange }: { onFocusChange?: (focused: boolean) => void }) {
  const [query, setQuery] = useState("");
  const [ph, setPh] = useState("");
  const [sugOpen, setSugOpen] = useState(false);
  const [sugActive, setSugActive] = useState(-1);
  const [sugRect, setSugRect] = useState<{ left: number; top: number; width: number; maxHeight: number } | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const magnetRef = useRef<HTMLButtonElement | null>(null);
  const router = useRouter();

  const updateRect = () => {
    const r = wrapRef.current?.getBoundingClientRect();
    if (r) setSugRect({ left: r.left, top: r.bottom + 8, width: r.width, maxHeight: window.innerHeight - r.bottom - 24 });
  };

  // Intent-aware suggestions (synonyms, capabilities, use-cases) — not just substring.
  const suggestions = useMemo(() => {
    const term = query.trim();
    if (!term) return [] as Tool[];
    return searchTools(term, 6) as unknown as Tool[];
  }, [query]);

  const submit = (q: string) => {
    const t = q.trim();
    if (t) router.push(`/recommend?q=${encodeURIComponent(t)}`);
  };

  const onSearchKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSugOpen(true);
      setSugActive((a) => Math.min(a + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSugActive((a) => Math.max(a - 1, -1));
    } else if (e.key === "Enter") {
      if (sugOpen && sugActive >= 0 && suggestions[sugActive]) {
        router.push(`/tools/${slugify(suggestions[sugActive].name)}`);
      } else {
        submit(query);
      }
    } else if (e.key === "Escape") {
      setSugOpen(false);
      setSugActive(-1);
    }
  };

  // keep typeahead popover anchored to the search box
  useEffect(() => {
    if (!sugOpen) return;
    updateRect();
    const on = () => updateRect();
    window.addEventListener("scroll", on, true);
    window.addEventListener("resize", on);
    return () => {
      window.removeEventListener("scroll", on, true);
      window.removeEventListener("resize", on);
    };
  }, [sugOpen]);

  // typewriter
  useEffect(() => {
    let i = 0, pos = 0, del = false, timer: ReturnType<typeof setTimeout>;
    const tick = () => {
      const txt = PLACEHOLDERS[i];
      if (!del) { pos++; setPh(txt.slice(0, pos)); if (pos === txt.length) { del = true; timer = setTimeout(tick, 1700); return; } timer = setTimeout(tick, 55); }
      else { pos--; setPh(txt.slice(0, pos)); if (pos === 0) { del = false; i = (i + 1) % PLACEHOLDERS.length; timer = setTimeout(tick, 280); return; } timer = setTimeout(tick, 22); }
    };
    timer = setTimeout(tick, 800);
    return () => clearTimeout(timer);
  }, []);

  // magnetic CTA — rAF-throttled with a cached center point instead of a
  // getBoundingClientRect (forced layout) on every mousemove event.
  useEffect(() => {
    const btn = magnetRef.current;
    if (!btn) return;
    let cx = 0, cy = 0, has = false;
    let mx = 0, my = 0;
    let raf = 0;
    const measure = () => {
      // measure with the magnet transform neutralized so the center is stable
      const prev = btn.style.transform;
      btn.style.transform = "";
      const r = btn.getBoundingClientRect();
      btn.style.transform = prev;
      cx = r.left + r.width / 2; cy = r.top + r.height / 2;
      has = true;
    };
    const apply = () => {
      raf = 0;
      if (!has) measure();
      const dx = mx - cx, dy = my - cy;
      if (Math.hypot(dx, dy) < 110) btn.style.transform = `translate(${dx * 0.22}px, ${dy * 0.22}px)`;
      else btn.style.transform = "";
    };
    const move = (e: MouseEvent) => {
      mx = e.clientX; my = e.clientY;
      if (!raf) raf = requestAnimationFrame(apply);
    };
    const invalidate = () => { has = false; };
    window.addEventListener("mousemove", move, { passive: true });
    window.addEventListener("resize", invalidate);
    window.addEventListener("scroll", invalidate, { passive: true });
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("resize", invalidate);
      window.removeEventListener("scroll", invalidate);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="v2-console-wrap" ref={wrapRef}>
      <Frame className="v2-console">
        <span className="v2-console-tag">DESCRIBE YOUR TASK</span>
        <div className="v2-console-row">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input
            value={query}
            onChange={(e) => { setQuery(e.target.value); setSugOpen(true); setSugActive(-1); }}
            onKeyDown={onSearchKey}
            onFocus={() => { onFocusChange?.(true); if (query.trim()) { setSugOpen(true); updateRect(); } }}
            onBlur={() => { onFocusChange?.(false); setTimeout(() => setSugOpen(false), 120); }}
            placeholder={ph ? `> ${ph}_` : "State your objective..."}
            role="combobox"
            aria-expanded={sugOpen && suggestions.length > 0}
            aria-controls="v2-sug-list"
            autoComplete="off"
          />
          <button ref={magnetRef} className="v2-cta" onClick={() => submit(query)}>
            <span>SEARCH</span><i className="v2-cta-arrow">▸</i>
          </button>
        </div>
      </Frame>

      {sugOpen && suggestions.length > 0 && (
        <div
          className="v2-sug"
          id="v2-sug-list"
          role="listbox"
          style={sugRect ? { left: sugRect.left, top: sugRect.top, width: sugRect.width, maxHeight: sugRect.maxHeight } : undefined}
        >
          <div className="v2-sug-head">
            <span className="v2-sug-prompt">{">"}</span> MATCHING NODES
            <span className="v2-sug-count">{suggestions.length}</span>
          </div>
          {suggestions.map((t, i) => (
            <button
              key={t.name}
              role="option"
              aria-selected={i === sugActive}
              className={`v2-sug-row ${i === sugActive ? "is-active" : ""}`}
              onMouseEnter={() => setSugActive(i)}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => router.push(`/tools/${slugify(t.name)}`)}
            >
              <span className="v2-sug-ico">{t.icon}</span>
              <span className="v2-sug-name">{t.name}</span>
              <span className="v2-sug-meta">{t.category} · {t.pricing}</span>
              <span className="v2-sug-go">↵</span>
            </button>
          ))}
          <button
            className="v2-sug-foot"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => submit(query)}
          >
            <span className="v2-sug-prompt">▸</span> Get a recommendation for “{query.trim()}”
          </button>
        </div>
      )}
    </div>
  );
}
