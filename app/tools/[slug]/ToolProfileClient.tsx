"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { TOOLS, slugify as libSlugify } from "@/lib/tools";
import { relatedByName, tagsForTool, tagLabel } from "@/lib/tags";
import { workflowsUsingTool } from "@/lib/workflows";
import { getToolUrl } from "@/lib/affiliates";
import DossierActions from "../../components/DossierActions";
import SiteHeader from "../../components/SiteHeader";
import SiteFooter from "../../components/SiteFooter";
import { TOOLS_DATA, type ToolData, slugify, PRICING_STYLES } from "./data";
import { PROMPT_LIBS } from "@/lib/prompts";

export function ToolProfileClient({ slug }: { slug: string }) {
  const router = useRouter();

  const tool = TOOLS_DATA.find((t) => slugify(t.name) === slug);

  // Fallback: look up basic info from the shared tools list
  const basicTool = !tool ? TOOLS.find((t) => libSlugify(t.name) === slug) : null;

  if (!tool && basicTool) {
    return (
      <div className="min-h-screen">
        <div className="px-6 pt-6 pb-2 max-w-3xl mx-auto">
          <button onClick={() => router.push("/")} className="back-link">
            ‹ Return.To.Index
          </button>
        </div>
        <div className="max-w-3xl mx-auto px-6 py-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-[#0d1729] border border-[#233150] flex items-center justify-center text-3xl flex-shrink-0">
              <img
                src={`https://www.google.com/s2/favicons?domain=${basicTool.domain}&sz=64`}
                alt={basicTool.name}
                className="w-8 h-8 object-contain"
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#e9eef8]">{basicTool.name}</h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs px-2 py-0.5 rounded-full bg-[#0d1729] text-[#93a4c3] font-medium">{basicTool.category}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${basicTool.pricing === "Paid" ? "border border-[#e41e3f]/50 bg-[#e41e3f]/15 text-[#ff5c78]" : basicTool.pricing === "Free" ? "border border-[#aaff00]/40 text-[#aaff00]" : "border border-[#1877F2]/30 bg-[#1877F2]/10 text-[#4da3ff]"}`}>{basicTool.pricing}</span>
              </div>
            </div>
          </div>
          <p className="text-[#c6d2e6] text-base leading-relaxed mb-8">{basicTool.description}</p>
          <a
            href={getToolUrl(basicTool.name, basicTool.url)}
            target="_blank"
            rel="sponsored noopener noreferrer"
            className="inline-block bg-[#1877F2] hover:bg-[#166FE5] text-white text-sm font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            Visit {basicTool.name}
          </a>
        </div>
      </div>
    );
  }

  if (!tool) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-6">
        <h1 className="text-2xl font-semibold text-[#e9eef8]">Tool not found</h1>
        <Link href="/" className="back-link">
          ‹ Return.To.Index
        </Link>
      </div>
    );
  }

  const toolTags = tagsForTool(tool.name);
  const usedInWorkflows = workflowsUsingTool(tool.name);

  // Related by multi-tag overlap (capabilities + use-cases), not just same category.
  // Falls back to same-category if a tool has no derived tags.
  const relatedNames = relatedByName(tool.name, 8).map((t) => t.name);
  const byName = new Map(TOOLS_DATA.map((t) => [t.name, t]));
  let similar = relatedNames
    .map((n) => byName.get(n))
    .filter((t): t is ToolData => Boolean(t) && t!.name !== tool.name)
    .slice(0, 3);
  if (similar.length < 3) {
    const extra = TOOLS_DATA.filter(
      (t) => t.category === tool.category && t.name !== tool.name && !similar.includes(t)
    );
    similar = [...similar, ...extra].slice(0, 3);
  }

  const pricing = PRICING_STYLES[tool.pricing];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `What is ${tool.name}?`,
        acceptedAnswer: { "@type": "Answer", text: tool.fullDescription },
      },
      {
        "@type": "Question",
        name: `Is ${tool.name} free?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: tool.pricing === "Free"
            ? `Yes, ${tool.name} is completely free to use.`
            : tool.pricing === "Freemium"
            ? `${tool.name} offers a free plan with limited features. Paid plans unlock more advanced capabilities.`
            : `${tool.name} is a paid tool. Visit their website for current pricing details.`,
        },
      },
      {
        "@type": "Question",
        name: `What is ${tool.name} best for?`,
        acceptedAnswer: { "@type": "Answer", text: tool.bestFor.join(", ") + "." },
      },
      {
        "@type": "Question",
        name: `How do I get started with ${tool.name}?`,
        acceptedAnswer: { "@type": "Answer", text: tool.steps[0] },
      },
      // Tool-specific editorial FAQs (when authored) enrich the schema beyond the templated ones.
      ...(tool.faqs ?? []).map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    ],
  };

  return (
    <div className="min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <SiteHeader active="/tools" />
      {/* Breadcrumb */}
      <div className="px-6 pt-6 pb-2 max-w-3xl mx-auto">
        <div className="v2-crumb">
          <button onClick={() => router.push("/")}>HOME</button>
          <i>//</i>
          <button onClick={() => router.push("/tools")}>{tool.category}</button>
          <i>//</i>
          <span className="v2-crumb-cur">{tool.name}</span>
        </div>
      </div>

      {/* Dossier hero */}
      <div className="px-6 pt-4 pb-10 max-w-3xl mx-auto">
        <div className="dossier-card p-6 sm:p-8 mb-9">
          <i className="v2-cb v2-cb-tl v2-hero-cb" /><i className="v2-cb v2-cb-tr v2-hero-cb" />
          <i className="v2-cb v2-cb-bl v2-hero-cb" /><i className="v2-cb v2-cb-br v2-hero-cb" />

          <div className="flex items-center gap-2 mb-5">
            <span className="dossier-tag">Node Dossier</span>
            <span className="dossier-tag dossier-tag-id">ID · {slugify(tool.name).slice(0, 10)}</span>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-[#0d1729] border border-[#233150] flex items-center justify-center overflow-hidden flex-shrink-0">
              <img
                src={`https://www.google.com/s2/favicons?domain=${tool.domain}&sz=64`}
                alt={tool.name}
                width={48}
                height={48}
                className="rounded-lg object-contain"
                onError={(e) => {
                  const el = e.currentTarget;
                  el.style.display = "none";
                  if (el.nextElementSibling) (el.nextElementSibling as HTMLElement).style.display = "flex";
                }}
              />
              <span className="text-3xl hidden items-center justify-center w-full h-full">{tool.icon}</span>
            </div>
            <div>
              <h1 className="display-head text-[30px] sm:text-[34px] font-semibold text-[#e9eef8] leading-tight">
                {tool.name}
              </h1>
              <p className="text-sm text-[#93a4c3] mt-1 leading-snug">{tool.shortDescription}</p>
            </div>
          </div>

          {/* Spec table — every field is sourced from real tool data, no auto-generated signals */}
          <div className="dossier-spec">
            <div className="dossier-srow"><span className="k">Designation</span><span className="v">{tool.name}</span></div>
            <div className="dossier-srow"><span className="k">Primary use</span><span className="v">{tool.category}</span></div>
            <div className="dossier-srow"><span className="k">Pricing</span><span className="v">{pricing.label}</span></div>
            <div className="dossier-srow"><span className="k">Website</span><span className="v">{tool.domain}</span></div>
          </div>

          {/* Capability / use-case tags (multi-tag model) */}
          {toolTags.length > 0 && (
            <div className="dossier-tags">
              {toolTags.map((id) => (
                <Link key={id} href={`/tags/${id}`} className="dossier-tagchip">{tagLabel(id)}</Link>
              ))}
            </div>
          )}

          <a
            href={getToolUrl(tool.name, tool.url)}
            target="_blank"
            rel="sponsored noopener noreferrer"
            className="dossier-launch dossier-launch-hero"
          >
            ▸ Visit {tool.name} ↗
          </a>

          <DossierActions name={tool.name} />
        </div>

        {/* 01 Brief */}
        <div className="mb-9">
          <h2 className="dossier-h"><span className="dossier-h-no">01</span> Brief // Summary</h2>
          <p className="text-base text-[#e9eef8] leading-relaxed">
            {tool.fullDescription}
          </p>
        </div>

        {/* 02 Optimal deployment */}
        <div className="mb-9">
          <h2 className="dossier-h"><span className="dossier-h-no">02</span> Optimal Deployment</h2>
          <ul className="flex flex-col gap-2.5">
            {tool.bestFor.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm text-[#93a4c3]">
                <span className="dossier-bullet mt-0.5">▸</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* 03 Initialization sequence */}
        <div className="mb-9">
          <h2 className="dossier-h"><span className="dossier-h-no">03</span> Initialization Sequence</h2>
          <ol className="flex flex-col gap-3">
            {tool.steps.map((step, i) => (
              <li key={i} className="flex gap-3 items-start">
                <span className="dossier-step-no mt-0.5">{String(i + 1).padStart(2, "0")}</span>
                <p className="text-sm text-[#93a4c3] leading-relaxed pt-1">{step}</p>
              </li>
            ))}
          </ol>
          {/* Field notes — editorial pro tips, only for tools with authored deep content */}
          {tool.tips && tool.tips.length > 0 && (
            <div className="dossier-tips mt-6">
              <h3 className="dossier-tips-h">// FIELD NOTES · PRO TIPS</h3>
              <ul className="flex flex-col gap-2.5 mt-3">
                {tool.tips.map((tip) => (
                  <li key={tip} className="flex items-start gap-2.5 text-sm text-[#93a4c3]">
                    <span className="dossier-bullet mt-0.5">◆</span>
                    <span className="leading-relaxed">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* 04 At a glance — strengths + honest considerations, all derived from real data */}
        <div className="mb-9">
          <h2 className="dossier-h"><span className="dossier-h-no">04</span> At a Glance</h2>
          <div className="v2-pcgrid">
            <div className="v2-pccol">
              <h3>Strengths</h3>
              <ul className="v2-pclist">
                {tool.bestFor.slice(0, 4).map((s) => (
                  <li key={s}><span className="mk mk-pro">+</span><span>{s}</span></li>
                ))}
                {tool.pricing !== "Paid" && (
                  <li><span className="mk mk-pro">+</span><span>Free tier you can start with today</span></li>
                )}
              </ul>
            </div>
            <div className="v2-pccol">
              <h3>Things to consider</h3>
              <ul className="v2-pclist">
                {tool.pricing === "Paid" && (
                  <li><span className="mk mk-con">−</span><span>No free tier — a paid plan is required to use it.</span></li>
                )}
                {tool.pricing === "Freemium" && (
                  <li><span className="mk mk-lim">!</span><span>The free plan has limits; advanced features need a paid plan.</span></li>
                )}
                <li><span className="mk mk-lim">!</span><span>Pricing and features change often — confirm current details on the official site.</span></li>
                <li><span className="mk mk-lim">!</span><span>AI output should be reviewed before you rely on it.</span></li>
              </ul>
            </div>
          </div>
          <p className="dossier-rank-note">
            Placement reflects our editorial assessment of fit for this use case, not paid placement.
            Some links may be affiliate links — this never changes our rankings.{" "}
            <Link href="/disclosure" className="dossier-rank-link">How we rank →</Link>
          </p>
        </div>

        {/* CTA */}
        <a
          href={getToolUrl(tool.name, tool.url)}
          target="_blank"
          rel="sponsored noopener noreferrer"
          className="dossier-launch"
        >
          ▸ Visit {tool.name}
        </a>
      </div>

      {/* Prompt library cross-link — send readers to the copy-paste prompts for this tool */}
      {PROMPT_LIBS[slugify(tool.name)] && (
        <div className="border-t border-[#233150] px-6 py-6">
          <Link href={`/prompts/${slugify(tool.name)}`} className="dossier-launch" style={{ background: "transparent", color: "#7fb0ff", borderColor: "rgba(24,119,242,0.4)" }}>
            ▸ {tool.name} prompt library — copy-paste prompts →
          </Link>
        </div>
      )}

      {/* Used in these workflows — positions the tool inside complete, multi-tool jobs */}
      {usedInWorkflows.length > 0 && (
        <div className="border-t border-[#233150] px-6 py-10">
          <div className="max-w-3xl mx-auto">
            <h2 className="dossier-h mb-2">
              <span className="dossier-h-no">◆</span> Used in these workflows
            </h2>
            <p className="text-sm text-[#93a4c3] mb-5 leading-relaxed">
              {tool.name} is one step in these complete, multi-tool playbooks for real-world tasks.
            </p>
            <div className="wf-uselist">
              {usedInWorkflows.map((w) => (
                <Link key={w.slug} href={`/workflows/${w.slug}`} className="wf-usecard">
                  <span className="wf-usecard-ico">{w.icon}</span>
                  <span className="wf-usecard-body">
                    <span className="wf-usecard-title">{w.title}</span>
                    <span className="wf-usecard-meta">{w.difficulty} · {w.time} · {w.steps.length} steps</span>
                  </span>
                  <span className="wf-usecard-go">→</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Similar tools */}
      {similar.length > 0 && (
        <div className="border-t border-[#233150] px-6 py-10">
          <div className="max-w-3xl mx-auto">
            <h2 className="dossier-h mb-5">
              <span className="dossier-h-no">05</span> Alternatives &amp; Related
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {similar.map((t) => (
                <button
                  key={t.name}
                  onClick={() => router.push(`/tools/${slugify(t.name)}`)}
                  className="tool-card text-left bg-[#101b32] border border-[#233150] rounded-xl p-4 flex flex-col gap-3 overflow-hidden"
                >
                  <div className="w-9 h-9 rounded-lg bg-[#0d1729] border border-[#233150] flex items-center justify-center overflow-hidden">
                    <img
                      src={`https://www.google.com/s2/favicons?domain=${t.domain}&sz=64`}
                      alt={t.name}
                      width={24}
                      height={24}
                      className="rounded object-contain"
                      onError={(e) => {
                        const el = e.currentTarget;
                        el.style.display = "none";
                        if (el.nextElementSibling) (el.nextElementSibling as HTMLElement).style.display = "flex";
                      }}
                    />
                    <span className="text-lg hidden items-center justify-center w-full h-full">{t.icon}</span>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-[#e9eef8] group-hover:text-[#1877F2]">
                      {t.name}
                    </h3>
                    <p className="text-xs text-[#93a4c3] mt-1 leading-relaxed line-clamp-2">
                      {t.shortDescription}
                    </p>
                  </div>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full self-start ${PRICING_STYLES[t.pricing].badge}`}>
                    {t.pricing.toUpperCase()}
                  </span>
                </button>
              ))}
            </div>
            <div className="mt-5">
              <button
                onClick={() => router.push(`/alternatives/${slugify(tool.name)}`)}
                className="text-xs font-semibold tracking-wider text-[#1877F2] hover:text-[#4a9df8] transition-colors"
              >
                SEE ALL {tool.name.toUpperCase()} ALTERNATIVES →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 06 FAQ — editorial Q&A, only for tools with authored deep content */}
      {tool.faqs && tool.faqs.length > 0 && (
        <div className="border-t border-[#233150] px-6 py-10">
          <div className="max-w-3xl mx-auto">
            <h2 className="dossier-h mb-5">
              <span className="dossier-h-no">06</span> Frequently Asked Questions
            </h2>
            <div className="flex flex-col gap-5">
              {tool.faqs.map((f) => (
                <div key={f.q}>
                  <h3 className="text-sm font-semibold text-[#e9eef8] mb-1.5">{f.q}</h3>
                  <p className="text-sm text-[#93a4c3] leading-relaxed">{f.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      <SiteFooter />
    </div>
  );
}
