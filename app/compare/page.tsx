import Link from "next/link";
import type { Metadata } from "next";
import Logo from "../components/Logo";

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
  { slug: "chatgpt-vs-claude",              tool1: "ChatGPT",          tool2: "Claude",           category: "Writing & AI Assistants",  icon1: "💬", icon2: "🤖" },
  { slug: "chatgpt-vs-gemini",              tool1: "ChatGPT",          tool2: "Gemini",            category: "AI Assistants",            icon1: "💬", icon2: "✨" },
  { slug: "midjourney-vs-dall-e-3",         tool1: "Midjourney",       tool2: "DALL-E 3",          category: "Image Generation",         icon1: "🎨", icon2: "🖼️" },
  { slug: "github-copilot-vs-cursor",       tool1: "GitHub Copilot",   tool2: "Cursor",            category: "AI Coding",                icon1: "🐙", icon2: "💻" },
  { slug: "jasper-vs-copy-ai",              tool1: "Jasper",           tool2: "Copy.ai",           category: "AI Copywriting",           icon1: "✍️", icon2: "📣" },
  { slug: "perplexity-vs-chatgpt",          tool1: "Perplexity",       tool2: "ChatGPT",           category: "AI Research",              icon1: "🔍", icon2: "💬" },
  { slug: "heygen-vs-synthesia",            tool1: "HeyGen",           tool2: "Synthesia",         category: "AI Video",                 icon1: "🎬", icon2: "🎥" },
  { slug: "suno-vs-udio",                   tool1: "Suno",             tool2: "Udio",              category: "AI Music",                 icon1: "🎵", icon2: "🎶" },
  { slug: "midjourney-vs-stable-diffusion", tool1: "Midjourney",       tool2: "Stable Diffusion",  category: "Image Generation",         icon1: "🎨", icon2: "🖌️" },
  { slug: "notion-ai-vs-chatgpt",           tool1: "Notion AI",        tool2: "ChatGPT",           category: "Productivity & Writing",   icon1: "📓", icon2: "💬" },
  { slug: "surfer-seo-vs-clearscope",       tool1: "Surfer SEO",       tool2: "Clearscope",        category: "SEO",                      icon1: "📈", icon2: "🔎" },
  { slug: "grammarly-vs-prowritingaid",     tool1: "Grammarly",        tool2: "ProWritingAid",     category: "Writing & Editing",        icon1: "📝", icon2: "📋" },
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
    <div className="flex flex-col min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <header className="sticky top-0 z-20 bg-white border-b border-[#e4e6ea] px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <Logo size={28} />
            <span className="font-semibold text-[#1877F2] text-sm tracking-tight">HowToUseMyAI</span>
          </Link>
          <Link href="/submit" className="text-xs text-[#e41e3f] font-medium hover:opacity-80">+ Submit a Tool</Link>
        </div>
      </header>

      <main className="flex-1 px-4 sm:px-6 py-12 max-w-4xl mx-auto w-full">
        <div className="mb-10">
          <div className="flex items-center gap-2 text-xs text-[#65676b] mb-4">
            <Link href="/" className="hover:text-[#1877F2]">Home</Link>
            <span>/</span>
            <span>Compare</span>
          </div>
          <h1 className="text-3xl font-semibold text-[#1c1e21] mb-3" style={{ fontFamily: "var(--font-playfair), serif" }}>
            AI Tool Comparisons
          </h1>
          <p className="text-[#65676b] text-sm leading-relaxed max-w-2xl">
            Detailed side-by-side comparisons of the most popular AI tools — with pros, cons, pricing, and a clear winner for each use case.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {COMPARISONS.map(({ slug, tool1, tool2, category, icon1, icon2 }) => (
            <Link
              key={slug}
              href={`/compare/${slug}`}
              className="flex items-center gap-4 bg-white border border-[#e4e6ea] rounded-xl p-4 hover:border-[#1877F2] hover:shadow-sm transition-all group"
            >
              <div className="flex items-center gap-1 flex-shrink-0 text-xl">
                <span>{icon1}</span>
                <span className="text-xs text-[#bcc0c4] font-bold">vs</span>
                <span>{icon2}</span>
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-sm font-semibold text-[#1c1e21] group-hover:text-[#1877F2] transition-colors mb-0.5">
                  {tool1} vs {tool2}
                </h2>
                <p className="text-xs text-[#65676b]">{category}</p>
              </div>
              <svg className="w-4 h-4 text-[#bcc0c4] group-hover:text-[#1877F2] flex-shrink-0 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ))}
        </div>

        <div className="mt-12 bg-[#f7f8fa] rounded-xl p-6 text-center">
          <p className="text-sm text-[#65676b] mb-3">Not sure which AI tool is right for you?</p>
          <Link
            href="/recommend"
            className="bg-[#1877F2] text-white text-sm font-semibold px-6 py-3 rounded-lg hover:bg-[#166FE5] transition-colors inline-block"
          >
            Describe your goal and we&apos;ll match you
          </Link>
        </div>
      </main>

      <footer className="border-t border-[#e4e6ea] px-6 py-6">
        <div className="max-w-4xl mx-auto flex flex-wrap gap-4 justify-between items-center text-xs text-[#65676b]">
          <Link href="/" className="flex items-center gap-2">
            <Logo size={18} />
            <span>HowToUseMyAI</span>
          </Link>
          <div className="flex gap-4 flex-wrap">
            <Link href="/best-ai-for" className="hover:text-[#1877F2]">Browse by Use Case</Link>
            <Link href="/tools" className="hover:text-[#1877F2]">All Tools</Link>
            <Link href="/compare" className="hover:text-[#1877F2]">Comparisons</Link>
          </div>
          <Link href="/privacy" className="hover:text-[#1877F2]">Privacy</Link>
        </div>
      </footer>
    </div>
  );
}
