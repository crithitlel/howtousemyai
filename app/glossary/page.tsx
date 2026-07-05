import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import { GLOSSARY, GLOSSARY_CATEGORIES } from "@/lib/glossary";

export const metadata: Metadata = {
  title: "AI Glossary — Plain-English Definitions | HowToUseMyAI",
  description:
    "AI terms explained in plain English: LLM, token, RAG, hallucination, fine-tuning, prompt engineering, and more — with links to tools that use each concept.",
  alternates: { canonical: "https://howtousemyai.com/glossary" },
};

export default function GlossaryIndex() {
  return (
    <div className="v2-root site-bg">
      <SiteHeader />
      <main className="v2-sec" style={{ maxWidth: 1180, margin: "0 auto", padding: "clamp(28px,4vw,52px) clamp(16px,4vw,44px)" }}>
        <nav className="v2-crumb" aria-label="Breadcrumb">
          <Link href="/">HOME</Link> <span className="v2-crumb-sep">{"//"}</span> <span>GLOSSARY</span>
        </nav>

        <h1 className="v2-pagetitle">AI Glossary</h1>
        <p className="v2-pageintro">
          Plain-English definitions for the jargon you hit reading AI tool docs and articles —
          no circular definitions, no unexplained acronyms. {GLOSSARY.length} terms and counting.
        </p>

        {GLOSSARY_CATEGORIES.map((cat) => (
          <section key={cat} style={{ marginTop: 36 }}>
            <h2 className="dossier-h">{cat}</h2>
            <div className="v2-promptgrid">
              {GLOSSARY.filter((g) => g.category === cat).map((g) => (
                <Link key={g.slug} href={`/glossary/${g.slug}`} className="v2-promptcard v2-panel">
                  <h2 style={{ fontSize: 18 }}>{g.term}</h2>
                  <p>{g.shortDef}</p>
                  <span className="v2-trow-why"><i>▸</i> READ DEFINITION</span>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </main>
      <SiteFooter />
    </div>
  );
}
