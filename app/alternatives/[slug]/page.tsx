import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import SiteHeader from "../../components/SiteHeader";
import SiteFooter from "../../components/SiteFooter";
import NewsletterSignup from "../../components/NewsletterSignup";
import { TOOLS, slugify, type Tool } from "@/lib/tools";
import { AFFILIATE_LINKS } from "@/lib/affiliates";

// Programmatic "[Tool] Alternatives" pages — one per catalogued tool.
// Alternatives are same-category tools, featured picks first, capped at 8.

const BASE_URL = "https://howtousemyai.com";

function findTool(slug: string): Tool | undefined {
  return TOOLS.find((t) => slugify(t.name) === slug);
}

function alternativesFor(tool: Tool): Tool[] {
  const sameCategory = TOOLS.filter(
    (t) => t.category === tool.category && t.name !== tool.name
  );
  // Featured tools first, then free-tier options, then the rest.
  const rank = (t: Tool) =>
    (t.isFeatured ? 0 : 2) + (t.pricing === "Paid" ? 1 : 0);
  return sameCategory.sort((a, b) => rank(a) - rank(b)).slice(0, 8);
}

// Outbound: affiliate link when configured, else direct — with UTM tracking.
function outboundUrl(toolName: string, directUrl: string, campaign: string): string {
  const affiliate = AFFILIATE_LINKS[toolName];
  const base = affiliate && affiliate.trim() !== "" ? affiliate : directUrl;
  const sep = base.includes("?") ? "&" : "?";
  return `${base}${sep}utm_source=howtousemyai&utm_medium=alternatives&utm_campaign=${encodeURIComponent(campaign)}`;
}

function whyLabel(alt: Tool, target: Tool, index: number): string {
  if (index === 0) return `Top ${target.name} alternative`;
  if (alt.pricing === "Free") return "Completely free option";
  if (alt.pricing === "Freemium" && target.pricing === "Paid") return `Free plan — unlike ${target.name}`;
  if (alt.pricing === "Freemium") return "Free plan available";
  return "Premium alternative";
}

export function generateStaticParams() {
  return TOOLS.map((t) => ({ slug: slugify(t.name) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tool = findTool(slug);
  if (!tool) return {};
  const alts = alternativesFor(tool);
  const title = `${alts.length} Best ${tool.name} Alternatives in 2026 (Free & Paid)`;
  const description = `Looking for a ${tool.name} alternative? Compare the ${alts.length} best AI tools like ${tool.name} — ${alts.slice(0, 3).map((t) => t.name).join(", ")} and more, with pricing and use cases.`;
  return {
    title: `${title} | HowToUseMyAI`,
    description,
    openGraph: { title, description, type: "article", url: `${BASE_URL}/alternatives/${slug}` },
    twitter: { card: "summary", title, description },
    alternates: { canonical: `${BASE_URL}/alternatives/${slug}` },
  };
}

export default async function AlternativesPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tool = findTool(slug);
  if (!tool) notFound();

  const alts = alternativesFor(tool);
  const freeAlts = alts.filter((t) => t.pricing === "Free" || t.pricing === "Freemium");

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Best ${tool.name} Alternatives`,
    itemListElement: alts.map((t, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: t.name,
      url: `${BASE_URL}/tools/${slugify(t.name)}`,
    })),
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `What is the best alternative to ${tool.name}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `${alts[0].name} is the strongest ${tool.name} alternative for most people — ${alts[0].description} ${alts[1] ? `${alts[1].name} is another excellent choice.` : ""}`,
        },
      },
      {
        "@type": "Question",
        name: `Is there a free alternative to ${tool.name}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: freeAlts.length > 0
            ? `Yes — ${freeAlts.slice(0, 3).map((t) => t.name).join(", ")} ${freeAlts.length === 1 ? "offers" : "all offer"} free plans you can start with today.`
            : `Most ${tool.category.toLowerCase()} tools in this space are paid, but many offer free trials.`,
        },
      },
      {
        "@type": "Question",
        name: `Why look for a ${tool.name} alternative?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Common reasons include pricing (${tool.name} is ${tool.pricing.toLowerCase()}), missing features for a specific workflow, platform preferences, or simply wanting to compare before committing. The best pick depends on your exact use case.`,
        },
      },
    ],
  };

  return (
    <div className="flex flex-col min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <SiteHeader active="/tools" />

      <main className="v2-page">
        <div className="v2-pagehead">
          <div className="v2-crumb">
            <Link href="/">HOME</Link>
            <i>//</i>
            <Link href="/tools">TOOLS</Link>
            <i>//</i>
            <Link href={`/tools/${slug}`}>{tool.name.toUpperCase()}</Link>
            <i>//</i>
            <span className="v2-crumb-cur">ALTERNATIVES</span>
          </div>
          <h1 className="v2-pagetitle">Best {tool.name} Alternatives in 2026</h1>
          <p className="v2-pagelead">
            {tool.name} ({tool.pricing.toLowerCase()}) is a strong {tool.category.toLowerCase()} tool — but it is not the only option.
            Here are the {alts.length} best AI tools like {tool.name}, ranked, with pricing and the exact use case where each one wins.
          </p>
          <div className="v2-readbar">
            <span className="flex items-center gap-2"><i className="v2-dot v2-dot-ok" /> RANKED SHORTLIST</span>
            <span className="v2-readbar-sep" />
            <span><b>{alts.length}</b> <span className="v2-readbar-dim">ALTERNATIVES</span></span>
            <span className="v2-readbar-sep" />
            <span><b>{freeAlts.length}</b> <span className="v2-readbar-dim">WITH FREE PLANS</span></span>
          </div>
        </div>

        <div className="v2-stack">
          {alts.map((alt, i) => {
            const altSlug = slugify(alt.name);
            const visitHref = outboundUrl(alt.name, alt.url, `alt_${slug}`);
            return (
              <div key={alt.name} className="v2-panel v2-trow">
                <i className="v2-cb v2-cb-tl" /><i className="v2-cb v2-cb-tr" /><i className="v2-cb v2-cb-bl" /><i className="v2-cb v2-cb-br" />
                <span className="v2-trow-rank">{String(i + 1).padStart(2, "0")}</span>
                <span className="v2-mark" style={{ width: 40, height: 40, flexShrink: 0 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`https://www.google.com/s2/favicons?domain=${alt.domain}&sz=128`} alt={alt.name} width={23} height={23} loading="lazy" />
                </span>
                <div className="v2-trow-body">
                  <div className="v2-trow-head">
                    <Link href={`/tools/${altSlug}`} className="v2-trow-name" style={{ textDecoration: "none" }}>
                      {alt.name}
                    </Link>
                    {i === 0 && <span className="v2-toppick">TOP PICK</span>}
                    <span className={`v2-pill v2-pill-${alt.pricing.toLowerCase()}`}>{alt.pricing}</span>
                  </div>
                  <p className="v2-trow-desc">{alt.description}</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
                    <span className="v2-trow-why"><i>▸</i> {whyLabel(alt, tool, i)}</span>
                    <Link href={`/tools/${altSlug}`} className="v2-trow-why" style={{ color: "var(--v2-dim)" }}>
                      HOW TO USE IT <i>→</i>
                    </Link>
                    <a
                      href={visitHref}
                      target="_blank"
                      rel="noopener noreferrer sponsored"
                      className="v2-trow-why"
                      style={{ color: "var(--v2-dim)" }}
                    >
                      VISIT SITE <i>↗</i>
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="v2-ctapanel v2-panel">
          <i className="v2-cb v2-cb-tl" /><i className="v2-cb v2-cb-tr" /><i className="v2-cb v2-cb-bl" /><i className="v2-cb v2-cb-br" />
          <p>Still deciding? See our full {tool.name} guide with step-by-step instructions.</p>
          <Link href={`/tools/${slug}`} className="v2-ctabtn">
            ◆ HOW TO USE {tool.name.toUpperCase()}
          </Link>
        </div>

        <NewsletterSignup compact />
      </main>

      <SiteFooter />
    </div>
  );
}
