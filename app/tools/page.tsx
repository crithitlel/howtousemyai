import Link from "next/link";
import { Suspense } from "react";
import type { Metadata } from "next";
import { TOOLS } from "@/lib/tools";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import ToolsBrowser from "../components/ToolsBrowser";

export const metadata: Metadata = {
  title: "All AI Tools Directory — HowToUseMyAI",
  description: `Browse ${TOOLS.length}+ AI tools across writing, coding, image generation, video, music, research, productivity, and more. Free, freemium, and paid options.`,
  openGraph: {
    title: "All AI Tools Directory — HowToUseMyAI",
    description: `Browse ${TOOLS.length}+ AI tools across every category.`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "All AI Tools Directory — HowToUseMyAI",
    description: `Browse ${TOOLS.length}+ AI tools across every category.`,
  },
};

const schema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "AI Tools Directory",
  description: `Browse ${TOOLS.length}+ AI tools across every category.`,
  url: "https://howtousemyai.com/tools",
};

export default function ToolsIndexPage() {
  const categories = Array.from(new Set(TOOLS.map((t) => t.category))).sort();

  return (
    <div className="flex flex-col min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <SiteHeader active="/tools" />

      <main className="v2-page">
        <div className="v2-pagehead">
          <div className="v2-crumb">
            <Link href="/">HOME</Link>
            <i>//</i>
            <span className="v2-crumb-cur">TOOLS</span>
          </div>
          <h1 className="v2-pagetitle">ALL<span className="v2-tred">.</span>TOOLS</h1>
          <p className="v2-pagelead">
            <b>{TOOLS.length}</b> instruments indexed across <b>{categories.length}</b> sectors. Open any node for a full guide, pricing, and deployment steps.
          </p>
          <div className="v2-readbar">
            <span className="flex items-center gap-2"><i className="v2-dot v2-dot-ok" /> LIVE INDEX</span>
            <span className="v2-readbar-sep" />
            <span><b>{TOOLS.length}</b> <span className="v2-readbar-dim">NODES</span></span>
            <span className="v2-readbar-sep" />
            <span><b>{categories.length}</b> <span className="v2-readbar-dim">SECTORS</span></span>
          </div>
        </div>

        {/* Interactive filter / sort browser */}
        <Suspense fallback={<div className="mono text-[10px] tracking-[0.18em] text-[#5d6f93] py-8">LOADING INDEX…</div>}>
          <ToolsBrowser />
        </Suspense>
      </main>

      <SiteFooter />
    </div>
  );
}
