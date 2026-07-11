import Link from "next/link";
import Logo from "./Logo";
import LiveClock from "./LiveClock";
import CmdkTrigger from "./CmdkTrigger";

/* ──────────────────────────────────────────────────────────────
   SiteHeader — the shared command-bar chrome.
   Ported verbatim from the homepage source-of-truth (.v2-topbar)
   so every route wears the same AI-OS command bar: brand + version,
   primary nav with active-state, ⌘K palette trigger, live ET clock,
   ONLINE / LIVE status. Reused across all non-homepage routes to
   kill the per-page <header> drift.
   SERVER component: the only client pieces are the LiveClock and
   CmdkTrigger islands, so static pages don't pay a client boundary
   for an otherwise static header.
   ────────────────────────────────────────────────────────────── */

// Full site map — every section reachable from the top bar, so nothing
// important lives only in the footer (Prompts/Glossary/Calculator used to).
const NAV: [string, string][] = [
  ["Tools", "/tools"],
  ["Workflows", "/workflows"],
  ["Compare", "/compare"],
  ["Free", "/free"],
  ["Use Cases", "/best-ai-for"],
  ["Prompts", "/prompts"],
  ["Glossary", "/glossary"],
  ["Calculator", "/calculator"],
];

export default function SiteHeader({ active }: { active?: string }) {
  return (
    <header className="v2-topbar v2-topbar-sticky">
      <Link href="/" className="v2-brand">
        <Logo size={22} />
        <span>HOWTOUSEMY<b>AI</b></span>
      </Link>
      <nav className="v2-nav">
        {NAV.map(([t, h]) => (
          <Link key={h} href={h} className={active === h ? "is-active" : undefined} aria-current={active === h ? "page" : undefined}>
            {t}
          </Link>
        ))}
      </nav>
      <div className="v2-sysline">
        <CmdkTrigger />
        <LiveClock />
      </div>
    </header>
  );
}
