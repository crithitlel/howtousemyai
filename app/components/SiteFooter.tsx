import Logo from "./Logo";
import { TOOLS } from "@/lib/tools";

const CATEGORIES = new Set(TOOLS.map((t) => t.category)).size;

/* ──────────────────────────────────────────────────────────────
   SiteFooter — the shared footer console.
   Ported from the homepage source-of-truth (.v2-footer) so every
   route closes with the same diagnostics strip instead of a
   bespoke per-page footer.
   ────────────────────────────────────────────────────────────── */

export default function SiteFooter() {
  return (
    <footer className="v2-footer">
      <div className="v2-foot-grid">
        <div className="v2-foot-col">
          <span className="v2-foot-h">SYSTEM</span>
          <a href="/tools">Tools</a>
          <a href="/workflows">Workflows</a>
          <a href="/compare">Compare</a>
          <a href="/free">Free</a>
          <a href="/best-ai-for">Use Cases</a>
        </div>
        <div className="v2-foot-col">
          <span className="v2-foot-h">REGISTRY</span>
          <a href="/about">About</a>
          <a href="/submit">Submit</a>
          <a href="/privacy">Privacy</a>
          <a href="/terms">Terms</a>
        </div>
        <div className="v2-foot-brand">
          <div className="v2-foot-logo"><Logo size={20} /><span>HOWTOUSEMY<b>AI</b></span></div>
          <p className="v2-foot-mono"><span className="v2-tok">{TOOLS.length}</span> AI TOOLS · <span className="v2-tok">{CATEGORIES}</span> CATEGORIES</p>
          <p className="v2-foot-mono v2-foot-dim">© {new Date().getFullYear()} HOWTOUSEMYAI // ALL SYSTEMS RESERVED</p>
        </div>
      </div>
      <div className="v2-foot-bar" aria-hidden="true">
        {Array.from({ length: 60 }).map((_, i) => <i key={i} />)}
      </div>
    </footer>
  );
}
