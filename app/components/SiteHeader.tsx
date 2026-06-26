"use client";

import { useEffect, useState } from "react";
import Logo from "./Logo";

/* ──────────────────────────────────────────────────────────────
   SiteHeader — the shared command-bar chrome.
   Ported verbatim from the homepage source-of-truth (.v2-topbar)
   so every route wears the same AI-OS command bar: brand + version,
   primary nav with active-state, ⌘K palette trigger, live ET clock,
   ONLINE / LIVE status. Reused across all non-homepage routes to
   kill the per-page <header> drift.
   ────────────────────────────────────────────────────────────── */

const NAV: [string, string][] = [
  ["TOOLS", "/tools"],
  ["WORKFLOWS", "/workflows"],
  ["COMPARE", "/compare"],
  ["FREE", "/free"],
  ["USE CASES", "/best-ai-for"],
];

export default function SiteHeader({ active }: { active?: string }) {
  const [clock, setClock] = useState("--:--:--");

  useEffect(() => {
    const fmt = () =>
      setClock(
        new Date().toLocaleTimeString("en-US", {
          timeZone: "America/New_York",
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    fmt();
    const id = setInterval(fmt, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <header className="v2-topbar v2-topbar-sticky">
      <a href="/" className="v2-brand">
        <Logo size={22} />
        <span>HOWTOUSEMY<b>AI</b></span>
        <i className="v2-brand-sep" />
        <em className="v2-brand-ver">v1.9</em>
      </a>
      <nav className="v2-nav">
        {NAV.map(([t, h]) => (
          <a key={h} href={h} className={active === h ? "is-active" : undefined} aria-current={active === h ? "page" : undefined}>
            {t}
          </a>
        ))}
      </nav>
      <div className="v2-sysline">
        <button
          type="button"
          className="v2-cmdk-trigger"
          onClick={() => window.dispatchEvent(new Event("open-cmdk"))}
          aria-label="Open command palette"
        >
          <span className="v2-cmdk-ico">⌘</span>K<span className="v2-cmdk-txt">SEARCH</span>
        </button>
        <span className="v2-stat"><i className="v2-dot v2-dot-ok" />ONLINE</span>
        <span className="v2-stat v2-mono">{clock} ET</span>
        <span className="v2-stat"><i className="v2-dot v2-dot-red" />LIVE</span>
      </div>
    </header>
  );
}
