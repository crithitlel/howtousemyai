import Link from "next/link";
import type { Metadata } from "next";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";

export const metadata: Metadata = {
  title: "AI Tool Comparisons — HowToUseMyAI",
  description: "Side-by-side comparisons of the top AI tools. Find out which AI is best for writing, coding, image generation, SEO, and more.",
  openGraph: {
    title: "AI Tool Comparisons — HowToUseMyAI",
    description: "Side-by-side comparisons of the top AI tools.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Tool Comparisons — HowToUseMyAI",
    description: "Side-by-side comparisons of the top AI tools.",
  },
};

const COMPARISONS = [
  { slug: "chatgpt-vs-claude",              tool1: "ChatGPT",          tool2: "Claude",           category: "ASSISTANTS" },
  { slug: "chatgpt-vs-gemini",              tool1: "ChatGPT",          tool2: "Gemini",           category: "ASSISTANTS" },
  { slug: "midjourney-vs-dall-e-3",         tool1: "Midjourney",       tool2: "DALL·E 3",         category: "IMAGERY" },
  { slug: "github-copilot-vs-cursor",       tool1: "GitHub Copilot",   tool2: "Cursor",           category: "CODE" },
  { slug: "jasper-vs-copy-ai",              tool1: "Jasper",           tool2: "Copy.ai",          category: "COPY" },
  { slug: "perplexity-vs-chatgpt",          tool1: "Perplexity",       tool2: "ChatGPT",          category: "RESEARCH" },
  { slug: "heygen-vs-synthesia",            tool1: "HeyGen",           tool2: "Synthesia",        category: "VIDEO" },
  { slug: "suno-vs-udio",                   tool1: "Suno",             tool2: "Udio",             category: "MUSIC" },
  { slug: "midjourney-vs-stable-diffusion", tool1: "Midjourney",       tool2: "Stable Diffusion", category: "IMAGERY" },
  { slug: "notion-ai-vs-chatgpt",           tool1: "Notion AI",        tool2: "ChatGPT",          category: "PRODUCTIVITY" },
  { slug: "surfer-seo-vs-clearscope",       tool1: "Surfer SEO",       tool2: "Clearscope",       category: "SEO" },
  { slug: "grammarly-vs-prowritingaid",     tool1: "Grammarly",        tool2: "ProWritingAid",    category: "EDITING" },
  { slug: "gemini-vs-claude", tool1: "Gemini", tool2: "Claude", category: "ASSISTANTS" },
  { slug: "perplexity-vs-gemini", tool1: "Perplexity", tool2: "Gemini", category: "RESEARCH" },
  { slug: "jasper-vs-writesonic", tool1: "Jasper", tool2: "Writesonic", category: "COPY" },
  { slug: "canva-ai-vs-adobe-firefly", tool1: "Canva AI", tool2: "Adobe Firefly", category: "DESIGN" },
  { slug: "leonardo-ai-vs-midjourney", tool1: "Leonardo.ai", tool2: "Midjourney", category: "IMAGERY" },
  { slug: "ideogram-vs-midjourney", tool1: "Ideogram", tool2: "Midjourney", category: "IMAGERY" },
  { slug: "gamma-vs-beautiful-ai", tool1: "Gamma", tool2: "Beautiful.ai", category: "SLIDES" },
  { slug: "otter-ai-vs-fireflies-ai", tool1: "Otter.ai", tool2: "Fireflies.ai", category: "MEETINGS" },
  { slug: "quillbot-vs-grammarly", tool1: "Quillbot", tool2: "Grammarly", category: "WRITING" },
  { slug: "tabnine-vs-github-copilot", tool1: "Tabnine", tool2: "GitHub Copilot", category: "CODE" },
  { slug: "taskade-vs-notion-ai", tool1: "Taskade", tool2: "Notion AI", category: "PRODUCTIVITY" },
  { slug: "sudowrite-vs-jasper", tool1: "Sudowrite", tool2: "Jasper", category: "WRITING" },
];

const schema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "AI Tool Comparisons",
  description: "Side-by-side comparisons of the top AI tools.",
  url: "https://howtousemyai.com/compare",
};

export default function CompareIndexPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <SiteHeader active="/compare" />

      <main className="v2-page">
        <div className="v2-pagehead">
          <div className="v2-crumb">
            <Link href="/">HOME</Link>
            <i>//</i>
            <span className="v2-crumb-cur">COMPARE</span>
          </div>
          <h1 className="v2-pagetitle">COMBAT<span className="v2-tred">.</span>LOG</h1>
          <p className="v2-pagelead">
            Head-to-head engagements between the top instruments — pros, cons, pricing, and a clear verdict for each use case.
          </p>
          <div className="v2-readbar">
            <span className="flex items-center gap-2"><i className="v2-dot v2-dot-ok" /> ENGAGEMENTS</span>
            <span className="v2-readbar-sep" />
            <span><b>{COMPARISONS.length}</b> <span className="v2-readbar-dim">MATCHUPS</span></span>
          </div>
        </div>

        <div className="v2-duels v2-duels-page">
          {COMPARISONS.map(({ slug, tool1, tool2, category }, i) => (
            <Link key={slug} href={`/compare/${slug}`} className="v2-duel">
              <i className="v2-cb v2-cb-tl" /><i className="v2-cb v2-cb-tr" /><i className="v2-cb v2-cb-bl" /><i className="v2-cb v2-cb-br" />
              <span className="v2-duel-top"><span>DUEL.{String(i + 1).padStart(2, "0")}</span><span>{category}</span></span>
              <div className="v2-duel-body">
                <span className="v2-duel-side">{tool1}</span>
                <span className="v2-duel-vs"><i />VS<i /></span>
                <span className="v2-duel-side">{tool2}</span>
              </div>
              <span className="v2-duel-link">VIEW VERDICT ▸</span>
            </Link>
          ))}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
