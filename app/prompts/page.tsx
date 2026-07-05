import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import { PROMPT_LIBS } from "@/lib/prompts";

export const metadata: Metadata = {
  title: "AI Prompt Libraries — Copy-Paste Prompts That Work | HowToUseMyAI",
  description:
    "Free, curated prompt libraries for ChatGPT, Midjourney, Claude, Gemini, and Suno. Copy-paste prompts organized by task, with tips for adapting them.",
  alternates: { canonical: "https://howtousemyai.com/prompts" },
};

export default function PromptsIndex() {
  const libs = Object.entries(PROMPT_LIBS);
  const totalPrompts = libs.reduce(
    (n, [, l]) => n + l.sections.reduce((m, s) => m + s.prompts.length, 0),
    0
  );

  return (
    <div className="v2-root">
      <SiteHeader />
      <main className="v2-sec" style={{ maxWidth: 1180, margin: "0 auto", padding: "clamp(28px,4vw,52px) clamp(16px,4vw,44px)" }}>
        <nav className="v2-crumb" aria-label="Breadcrumb">
          <Link href="/">HOME</Link> <span className="v2-crumb-sep">{"//"}</span> <span>PROMPTS</span>
        </nav>

        <h1 className="v2-pagetitle">Prompt Libraries</h1>
        <p className="v2-pageintro">
          Curated, copy-paste prompts organized by job — not random lists. Each library is
          built around what its tool actually does best. {totalPrompts} prompts and counting.
        </p>

        <div className="v2-promptgrid">
          {libs.map(([slug, lib]) => {
            const count = lib.sections.reduce((m, s) => m + s.prompts.length, 0);
            return (
              <Link key={slug} href={`/prompts/${slug}`} className="v2-promptcard v2-panel">
                <span className="v2-cell-id">{count} PROMPTS · {lib.sections.length} CATEGORIES</span>
                <h2>{lib.title}</h2>
                <p>{lib.intro.slice(0, 120)}…</p>
                <span className="v2-trow-why"><i>▸</i> OPEN LIBRARY</span>
              </Link>
            );
          })}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
