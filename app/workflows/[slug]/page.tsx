import { notFound } from "next/navigation";
import Link from "next/link";
import SiteHeader from "../../components/SiteHeader";
import SiteFooter from "../../components/SiteFooter";
import NewsletterSignup from "../../components/NewsletterSignup";
import { WORKFLOWS, workflowBySlug, slugify } from "@/lib/workflows";
import { TOOLS } from "@/lib/tools";

const TOOL_NAMES = new Set(TOOLS.map((t) => t.name));
const toolHref = (name: string) =>
  TOOL_NAMES.has(name) ? `/tools/${slugify(name)}` : null;

const DIFF_CLASS: Record<string, string> = {
  Beginner: "wf-diff-beg",
  Intermediate: "wf-diff-int",
  Advanced: "wf-diff-adv",
};

export function generateStaticParams() {
  return WORKFLOWS.map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const w = workflowBySlug(slug);
  if (!w) return { title: "Not Found" };
  const year = new Date().getFullYear();
  const title = `${w.title}: The AI Workflow (${year}) — HowToUseMyAI`;
  const description = `${w.tagline} ${w.steps.length} steps, ${w.difficulty.toLowerCase()} level. Outcome: ${w.outcome}`;
  return {
    title,
    description,
    openGraph: { title, description, type: "article" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function WorkflowDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const w = workflowBySlug(slug);
  if (!w) notFound();

  // HowTo structured data for rich results.
  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: w.title,
    description: w.tagline,
    totalTime: w.time,
    step: w.steps.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: `${s.phase}: ${s.what}`,
      text: s.how,
      itemListElement: [{ "@type": "HowToTool", name: s.tool }],
    })),
  };

  const others = WORKFLOWS.filter((x) => x.slug !== w.slug).slice(0, 3);

  return (
    <div className="flex flex-col min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />
      <SiteHeader active="/workflows" />

      <main className="v2-page">
        <div className="v2-pagehead">
          <div className="v2-crumb">
            <Link href="/">HOME</Link>
            <i>//</i>
            <Link href="/workflows">WORKFLOWS</Link>
            <i>//</i>
            <span className="v2-crumb-cur">{w.title.toUpperCase()}</span>
          </div>
          <div className="wf-head-top">
            <span className="wf-head-ico">{w.icon}</span>
            <span className={`wf-diff ${DIFF_CLASS[w.difficulty]}`}>{w.difficulty}</span>
            <span className="wf-head-time">⏱ {w.time}</span>
          </div>
          <h1 className="v2-pagetitle">{w.title}</h1>
          <p className="v2-pagelead">{w.tagline}</p>
          <div className="wf-outcome">
            <span className="wf-outcome-k">YOU&apos;LL END UP WITH</span>
            <span className="wf-outcome-v">{w.outcome}</span>
          </div>
        </div>

        {/* The tool chain at a glance */}
        <div className="wf-chain">
          {w.steps.map((s, i) => (
            <span key={s.phase} className="wf-chain-step">
              <span className="wf-chain-ico">{s.icon}</span>
              <span className="wf-chain-name">{s.phase}</span>
              {i < w.steps.length - 1 && <span className="wf-chain-arrow">→</span>}
            </span>
          ))}
        </div>

        {/* Step-by-step */}
        <div className="v2-stack">
          {w.steps.map((s, i) => {
            const primaryHref = toolHref(s.tool);
            return (
              <div key={s.phase} className="v2-panel wf-step">
                <i className="v2-cb v2-cb-tl" /><i className="v2-cb v2-cb-tr" /><i className="v2-cb v2-cb-bl" /><i className="v2-cb v2-cb-br" />
                <div className="wf-step-rail">
                  <span className="wf-step-no">{String(i + 1).padStart(2, "0")}</span>
                  <span className="wf-step-ico">{s.icon}</span>
                </div>
                <div className="wf-step-body">
                  <div className="wf-step-head">
                    <span className="wf-step-phase">{s.phase}</span>
                    <span className="wf-step-what">{s.what}</span>
                  </div>

                  <div className="wf-step-tool">
                    <span className="wf-step-tool-lbl">USE</span>
                    {primaryHref ? (
                      <Link href={primaryHref} className="wf-tool-chip wf-tool-chip-primary">{s.tool}</Link>
                    ) : (
                      <span className="wf-tool-chip wf-tool-chip-primary">{s.tool}</span>
                    )}
                    {s.alts && s.alts.length > 0 && (
                      <>
                        <span className="wf-step-tool-lbl wf-step-tool-or">OR</span>
                        {s.alts.map((alt) => {
                          const h = toolHref(alt);
                          return h ? (
                            <Link key={alt} href={h} className="wf-tool-chip">{alt}</Link>
                          ) : (
                            <span key={alt} className="wf-tool-chip">{alt}</span>
                          );
                        })}
                      </>
                    )}
                  </div>

                  <p className="wf-step-how">{s.how}</p>
                </div>
              </div>
            );
          })}
        </div>

        {others.length > 0 && (
          <>
            <p className="v2-seclabel">MORE WORKFLOWS</p>
            <div className="wf-grid">
              {others.map((o) => (
                <Link key={o.slug} href={`/workflows/${o.slug}`} className="v2-panel wf-card">
                  <i className="v2-cb v2-cb-tl" /><i className="v2-cb v2-cb-tr" /><i className="v2-cb v2-cb-bl" /><i className="v2-cb v2-cb-br" />
                  <div className="wf-card-top">
                    <span className="wf-card-ico">{o.icon}</span>
                    <span className={`wf-diff ${DIFF_CLASS[o.difficulty]}`}>{o.difficulty}</span>
                  </div>
                  <h2 className="wf-card-title">{o.title}</h2>
                  <p className="wf-card-tagline">{o.tagline}</p>
                  <div className="wf-card-foot">
                    <span className="wf-card-meta">⏱ {o.time}</span>
                    <span className="wf-card-go">OPEN →</span>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}

        <div className="v2-ctapanel v2-panel">
          <i className="v2-cb v2-cb-tl" /><i className="v2-cb v2-cb-tr" /><i className="v2-cb v2-cb-bl" /><i className="v2-cb v2-cb-br" />
          <p>Want a tool stack tuned to your exact task and budget?</p>
          <Link href="/recommend" className="v2-ctabtn">
            ◆ FIND YOUR MATCH
          </Link>
        </div>

        <NewsletterSignup compact />
      </main>

      <SiteFooter />
    </div>
  );
}
