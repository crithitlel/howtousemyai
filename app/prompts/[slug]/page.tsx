import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteHeader from "../../components/SiteHeader";
import SiteFooter from "../../components/SiteFooter";
import CopyPromptButton from "../../components/CopyPromptButton";
import { PROMPT_LIBS, PROMPT_SLUGS } from "@/lib/prompts";

export function generateStaticParams() {
  return PROMPT_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const lib = PROMPT_LIBS[slug];
  if (!lib) return {};
  return {
    title: `${lib.title} | HowToUseMyAI`,
    description: lib.description,
    alternates: { canonical: `https://howtousemyai.com/prompts/${slug}` },
    openGraph: { title: lib.title, description: lib.description, type: "article", url: `https://howtousemyai.com/prompts/${slug}` },
  };
}

export default async function PromptLibraryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const lib = PROMPT_LIBS[slug];
  if (!lib) notFound();

  const count = lib.sections.reduce((m, s) => m + s.prompts.length, 0);

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: lib.title,
    numberOfItems: count,
    itemListElement: lib.sections.flatMap((s, si) =>
      s.prompts.map((p, pi) => ({
        "@type": "ListItem",
        position: si * 100 + pi + 1,
        name: p.slice(0, 110),
      }))
    ),
  };

  return (
    <div className="v2-root">
      <SiteHeader />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <main className="v2-sec" style={{ maxWidth: 900, margin: "0 auto", padding: "clamp(28px,4vw,52px) clamp(16px,4vw,44px)" }}>
        <nav className="v2-crumb" aria-label="Breadcrumb">
          <Link href="/">HOME</Link> <span className="v2-crumb-sep">{"//"}</span>{" "}
          <Link href="/prompts">PROMPTS</Link> <span className="v2-crumb-sep">{"//"}</span>{" "}
          <span>{lib.toolName.toUpperCase()}</span>
        </nav>

        <h1 className="v2-pagetitle">{lib.title}</h1>
        <p className="v2-pageintro">{lib.intro}</p>

        <div className="v2-promptmeta">
          <span className="v2-cell-id">{count} PROMPTS · {lib.sections.length} CATEGORIES</span>
          <Link href={`/tools/${lib.toolSlug}`} className="v2-trow-why">
            <i>▸</i> HOW TO USE {lib.toolName.toUpperCase()} →
          </Link>
        </div>

        {lib.sections.map((section) => (
          <section key={section.title} className="v2-promptsec">
            <h2 className="dossier-h">{section.title}</h2>
            <ul className="v2-promptlist">
              {section.prompts.map((p) => (
                <li key={p.slice(0, 60)} className="v2-promptrow v2-panel">
                  <code>{p.replace(/\\n/g, "\n")}</code>
                  <CopyPromptButton text={p} />
                </li>
              ))}
            </ul>
          </section>
        ))}

        <section className="v2-promptsec">
          <h2 className="dossier-h">Tips for Better Results</h2>
          <ul className="v2-guide">
            {lib.tips.map((t) => (
              <li key={t.slice(0, 40)}>{t}</li>
            ))}
          </ul>
        </section>

        <div className="v2-ctapanel v2-panel">
          <i className="v2-cb v2-cb-tl" /><i className="v2-cb v2-cb-tr" /><i className="v2-cb v2-cb-bl" /><i className="v2-cb v2-cb-br" />
          <p>New to {lib.toolName}? Start with the step-by-step guide.</p>
          <Link href={`/tools/${lib.toolSlug}`} className="v2-ctabtn">◆ HOW TO USE {lib.toolName.toUpperCase()}</Link>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
