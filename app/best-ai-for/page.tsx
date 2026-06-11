import Link from "next/link";
import type { Metadata } from "next";
import Logo from "../components/Logo";

export const metadata: Metadata = {
  title: "Best AI Tools by Use Case — HowToUseMyAI",
  description: "Browse the best AI tools for every use case — writing, coding, image generation, video, SEO, marketing, and 16 more categories.",
  openGraph: {
    title: "Best AI Tools by Use Case — HowToUseMyAI",
    description: "Browse the best AI tools for every use case.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Best AI Tools by Use Case — HowToUseMyAI",
    description: "Browse the best AI tools for every use case.",
  },
};

const CATEGORIES = [
  { slug: "writing",          label: "Writing",            icon: "✍️",  desc: "AI writers, editors, and copywriting tools" },
  { slug: "coding",           label: "Coding",             icon: "💻",  desc: "AI code editors, assistants, and generators" },
  { slug: "image-generation", label: "Image Generation",   icon: "🎨",  desc: "Text-to-image and AI art creation tools" },
  { slug: "video",            label: "Video Creation",     icon: "🎬",  desc: "AI video generation and editing tools" },
  { slug: "music",            label: "Music",              icon: "🎵",  desc: "AI music generation and audio creation" },
  { slug: "research",         label: "Research",           icon: "🔍",  desc: "AI search engines and research assistants" },
  { slug: "productivity",     label: "Productivity",       icon: "⚡",  desc: "AI tools for scheduling, notes, and automation" },
  { slug: "marketing",        label: "Marketing",          icon: "📣",  desc: "AI tools for campaigns, ads, and growth" },
  { slug: "seo",              label: "SEO",                icon: "📈",  desc: "AI for keyword research and content ranking" },
  { slug: "social-media",     label: "Social Media",       icon: "📱",  desc: "AI for social content, scheduling, and analytics" },
  { slug: "design",           label: "Design",             icon: "🖌️",  desc: "AI design, logo, and UI creation tools" },
  { slug: "presentations",    label: "Presentations",      icon: "🖥️",  desc: "AI slide deck and presentation builders" },
  { slug: "data-analysis",    label: "Data Analysis",      icon: "📊",  desc: "AI tools for data visualisation and insights" },
  { slug: "automation",       label: "Automation",         icon: "🔧",  desc: "AI workflow automation and app integration" },
  { slug: "customer-support", label: "Customer Support",   icon: "💬",  desc: "AI chatbots and support automation platforms" },
  { slug: "education",        label: "Education",          icon: "🎓",  desc: "AI tutors, learning tools, and study assistants" },
  { slug: "translation",      label: "Translation",        icon: "🌐",  desc: "AI translation for text and documents" },
  { slug: "audio",            label: "Audio & Podcasts",   icon: "🎙️",  desc: "AI podcast editing, voiceover, and transcription" },
  { slug: "sales",            label: "Sales",              icon: "💼",  desc: "AI prospecting, outreach, and sales intelligence" },
  { slug: "email",            label: "Email",              icon: "📧",  desc: "AI email writing, inbox management, and outreach" },
  { slug: "resume",           label: "Resume & Jobs",      icon: "📄",  desc: "AI resume builders and job search tools" },
  { slug: "legal",            label: "Legal",              icon: "⚖️",  desc: "AI contract review and legal research tools" },
];

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Best AI Tools by Use Case",
  description: "Browse the best AI tools for every use case — writing, coding, image generation, video, SEO, marketing, and more.",
  url: "https://howtousemyai.com/best-ai-for",
};

export default function BestAIForIndexPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />

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
          <h1 className="text-3xl font-semibold text-[#1c1e21] mb-3" style={{ fontFamily: "var(--font-playfair), serif" }}>
            Best AI Tools by Use Case
          </h1>
          <p className="text-[#65676b] text-sm leading-relaxed max-w-2xl">
            Browse our curated lists of the top AI tools for every use case. Each category includes the best free and paid options with step-by-step guides.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {CATEGORIES.map(({ slug, label, icon, desc }) => (
            <Link
              key={slug}
              href={`/best-ai-for/${slug}`}
              className="flex items-start gap-4 bg-white border border-[#e4e6ea] rounded-xl p-4 hover:border-[#1877F2] hover:shadow-sm transition-all group"
            >
              <span className="text-2xl flex-shrink-0 mt-0.5">{icon}</span>
              <div className="min-w-0">
                <h2 className="text-sm font-semibold text-[#1c1e21] group-hover:text-[#1877F2] transition-colors mb-0.5">
                  Best AI for {label}
                </h2>
                <p className="text-xs text-[#65676b] leading-relaxed">{desc}</p>
              </div>
              <svg className="w-4 h-4 text-[#bcc0c4] group-hover:text-[#1877F2] flex-shrink-0 ml-auto mt-1 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ))}
        </div>

        <div className="mt-12 bg-[#f7f8fa] rounded-xl p-6 text-center">
          <p className="text-sm text-[#65676b] mb-3">Not sure which category you need?</p>
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
            {CATEGORIES.slice(0, 6).map(({ slug, label }) => (
              <Link key={slug} href={`/best-ai-for/${slug}`} className="hover:text-[#1877F2]">{label}</Link>
            ))}
          </div>
          <Link href="/privacy" className="hover:text-[#1877F2]">Privacy</Link>
        </div>
      </footer>
    </div>
  );
}
