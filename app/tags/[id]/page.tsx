import { notFound } from "next/navigation";
import Link from "next/link";
import SiteHeader from "../../components/SiteHeader";
import SiteFooter from "../../components/SiteFooter";
import { ALL_TAGS, toolsByTag, tagLabel, tagKind, slugify } from "@/lib/tags";

const KIND_LABEL: Record<string, string> = {
  "use-case": "Use case",
  capability: "Capability",
  platform: "Platform",
  industry: "Industry",
};

export function generateStaticParams() {
  // Only build pages for tags that actually carry tools.
  return ALL_TAGS.filter((t) => toolsByTag(t.id).length > 0).map((t) => ({ id: t.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const label = tagLabel(id);
  const tools = toolsByTag(id);
  if (tools.length === 0) return { title: "Not Found" };
  const year = new Date().getFullYear();
  const title = `Best AI Tools for ${label} (${year}) — HowToUseMyAI`;
  const description = `${tools.length} AI tools for ${label.toLowerCase()}, each with a plain-English guide on exactly how to use it. Compare free and paid options.`;
  return {
    title,
    description,
    openGraph: { title, description, type: "website" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function TagPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const label = tagLabel(id);
  const tools = toolsByTag(id);
  if (tools.length === 0) notFound();

  const kind = tagKind(id);
  const free = tools.filter((t) => t.pricing !== "Paid");

  // Related tags: most common co-occurring tags across this set, excluding self.
  const co = new Map<string, number>();
  for (const t of tools) for (const tg of t.tags) if (tg !== id) co.set(tg, (co.get(tg) ?? 0) + 1);
  const relatedTags = Array.from(co.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([tid]) => tid);

  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader active="/tools" />

      <main className="v2-page">
        <div className="v2-pagehead">
          <div className="v2-crumb">
            <Link href="/">HOME</Link>
            <i>//</i>
            <Link href="/tools">TOOLS</Link>
            <i>//</i>
            <span className="v2-crumb-cur">{label.toUpperCase()}</span>
          </div>
          <h1 className="v2-pagetitle">{label}</h1>
          <p className="v2-pagelead">
            {tools.length} AI tool{tools.length === 1 ? "" : "s"} for <b>{label.toLowerCase()}</b>
            {free.length > 0 && <> — including {free.length} you can start free</>}. Open any tool for a
            step-by-step guide on exactly how to use it.
          </p>
          <div className="v2-readbar">
            <span className="flex items-center gap-2"><i className="v2-dot v2-dot-ok" /> {KIND_LABEL[kind ?? "use-case"]?.toUpperCase()}</span>
            <span className="v2-readbar-sep" />
            <span><b>{tools.length}</b> <span className="v2-readbar-dim">TOOLS</span></span>
            {free.length > 0 && (
              <>
                <span className="v2-readbar-sep" />
                <span><b>{free.length}</b> <span className="v2-readbar-dim">FREE TO TRY</span></span>
              </>
            )}
          </div>
        </div>

        <div className="v2-stack">
          {tools.map((tool, i) => (
            <Link key={tool.name} href={`/tools/${slugify(tool.name)}`} className="v2-panel v2-trow">
              <i className="v2-cb v2-cb-tl" /><i className="v2-cb v2-cb-tr" /><i className="v2-cb v2-cb-bl" /><i className="v2-cb v2-cb-br" />
              <span className="v2-trow-rank">{String(i + 1).padStart(2, "0")}</span>
              <span className="v2-mark" style={{ width: 40, height: 40, flexShrink: 0 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`https://www.google.com/s2/favicons?domain=${tool.domain}&sz=64`} alt={tool.name} width={23} height={23} loading="lazy" />
              </span>
              <div className="v2-trow-body">
                <div className="v2-trow-head">
                  <span className="v2-trow-name">{tool.name}</span>
                  <span className={`v2-pill v2-pill-${tool.pricing.toLowerCase()}`}>{tool.pricing}</span>
                </div>
                <p className="v2-trow-desc">{tool.description}</p>
                <span className="v2-trow-why"><i>▸</i> {tool.category} · view how-to guide</span>
              </div>
            </Link>
          ))}
        </div>

        {relatedTags.length > 0 && (
          <>
            <p className="v2-seclabel">RELATED TAGS</p>
            <div className="v2-taghero">
              {relatedTags.map((tid) => (
                <Link key={tid} href={`/tags/${tid}`} className="dossier-tagchip">{tagLabel(tid)}</Link>
              ))}
            </div>
          </>
        )}

        <div className="v2-ctapanel v2-panel">
          <i className="v2-cb v2-cb-tl" /><i className="v2-cb v2-cb-tr" /><i className="v2-cb v2-cb-bl" /><i className="v2-cb v2-cb-br" />
          <p>Not sure which one fits your exact task?</p>
          <Link href={`/recommend?q=${encodeURIComponent(label)}`} className="v2-ctabtn">
            ◆ FIND YOUR MATCH
          </Link>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
