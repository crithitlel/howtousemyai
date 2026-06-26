import Link from "next/link";
import SiteHeader from "./components/SiteHeader";
import SiteFooter from "./components/SiteFooter";

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />

      <main className="flex-1 flex items-center justify-center px-6 py-20">
        <div className="nf-card relative w-full max-w-xl text-center">
          <i className="v2-cb v2-cb-tl v2-hero-cb" /><i className="v2-cb v2-cb-tr v2-hero-cb" />
          <i className="v2-cb v2-cb-bl v2-hero-cb" /><i className="v2-cb v2-cb-br v2-hero-cb" />

          <div className="mono text-[10px] tracking-[0.22em] uppercase text-[#5d6f93] mb-5 flex items-center justify-center gap-2">
            <Link href="/" className="hover:text-[#4da3ff] transition-colors">NODE</Link>
            <span className="text-[#e41e3f]">//</span>
            <span className="text-[#93a4c3]">ERROR</span>
          </div>

          <p className="nf-code display-head" data-text="404">404</p>

          <h1 className="display-head text-2xl font-bold text-[#e9eef8] mt-2 mb-2 tracking-wide">
            SIGNAL LOST
          </h1>
          <p className="mono text-[11px] tracking-[0.14em] text-[#7e93b8] uppercase mb-7">
            Node not found · the requested coordinates returned no data
          </p>

          <div className="nf-term mono text-left mx-auto mb-8">
            <p><span className="nf-arrow">{">"}</span> scanning sector for resource…</p>
            <p><span className="nf-arrow nf-arrow-r">{">"}</span> <span className="text-[#ff8095]">404 · resource unreachable</span></p>
            <p><span className="nf-arrow">{">"}</span> rerouting to mainframe<span className="nf-blink">_</span></p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link href="/" className="nf-btn nf-btn-primary">↩ RETURN TO MAINFRAME</Link>
            <Link href="/tools" className="nf-btn">▦ BROWSE ALL NODES</Link>
          </div>
          <p className="mono text-[10px] tracking-[0.16em] text-[#56688c] mt-6">
            TIP: PRESS <kbd className="nf-kbd">⌘K</kbd> TO SEARCH ANY TOOL
          </p>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
