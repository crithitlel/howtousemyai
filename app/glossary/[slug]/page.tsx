import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteHeader from "../../components/SiteHeader";
import SiteFooter from "../../components/SiteFooter";
import { GLOSSARY, GLOSSARY_SLUGS, glossaryBySlug } from "@/lib/glossary";
import { slugify } from "@/lib/tools";

export function generateStaticParams() {
  return GLOSSARY_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const g = glossaryBySlug(slug);
  if (!g) return {};
  const title = `What is ${g.term}? | AI Glossary | HowToUseMyAI`;
  return {
    title,
    description: g.shortDef,
    alternates: { canonical: `https://howtousemyai.com/glossary/${slug}` },
    openGraph: { title, description: g.shortDef, type: "article", url: `https://howtousemyai.com/glossary/${slug}` },
  };
}

export default async function GlossaryTermPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const g = glossaryBySlug(slug);
  if (!g) notFound();

  const related = GLOSSARY.filter((t) => g.relatedTerms.includes(t.slug));

  const schema = {
    "@context": "https://schema.org",
    "@type": "DefinedTerm",
    name: g.term,
    description: g.definition,
    inDefinedTermSet: "https://howtousemyai.com/glossary",
  };

  return (
    <div className="v2-root site-bg">
      <SiteHeader />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <main className="v2-sec" style={{ maxWidth: 900, margin: "0 auto", padding: "clamp(28px,4vw,52px) clamp(16px,4vw,44px)" }}>
        <nav className="v2-crumb" aria-label="Breadcrumb">
          <Link href="/">HOME</Link> <span className="v2-crumb-sep">{"//"}</span>{" "}
          <Link href="/glossary">GLOSSARY</Link> <span className="v2-crumb-sep">{"//"}</span>{" "}
          <span>{g.term.toUpperCase()}</span>
        </nav>

        <h1 className="v2-pagetitle">{g.term}</h1>
        <p className="v2-pageintro">{g.shortDef}</p>

        <div className="mb-9">
          <h2 className="dossier-h"><span className="dossier-h-no">01</span> Definition</h2>
          <p className="text-base text-[#e9eef8] leading-relaxed">{g.definition}</p>
        </div>

        <div className="mb-9">
          <h2 className="dossier-h"><span className="dossier-h-no">02</span> Why It Matters</h2>
          <p className="text-base text-[#e9eef8] leading-relaxed">{g.whyItMatters}</p>
        </div>

        {g.example && (
          <div className="mb-9">
            <h2 className="dossier-h"><span className="dossier-h-no">03</span> Example</h2>
            <p className="text-base text-[#e9eef8] leading-relaxed italic">{g.example}</p>
          </div>
        )}

        {g.relatedTools.length > 0 && (
          <div className="mb-9">
            <h2 className="dossier-h"><span className="dossier-h-no">◆</span> Tools That Use This</h2>
            <div className="dossier-tags">
              {g.relatedTools.map((name) => (
                <Link key={name} href={`/tools/${slugify(name)}`} className="dossier-tagchip">{name}</Link>
              ))}
            </div>
          </div>
        )}

        {related.length > 0 && (
          <div className="mb-9">
            <h2 className="dossier-h"><span className="dossier-h-no">◆</span> Related Terms</h2>
            <div className="dossier-tags">
              {related.map((t) => (
                <Link key={t.slug} href={`/glossary/${t.slug}`} className="dossier-tagchip">{t.term}</Link>
              ))}
            </div>
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
