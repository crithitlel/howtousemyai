import Link from "next/link";
import type { Metadata } from "next";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";

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
    <div className="flex flex-col min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />

      <SiteHeader active="/best-ai-for" />

      <main className="v2-page">
        <div className="v2-pagehead">
          <div className="v2-crumb">
            <Link href="/">NODE</Link>
            <i>//</i>
            <span className="v2-crumb-cur">USE CASES</span>
          </div>
          <h1 className="v2-pagetitle">SECTOR<span className="v2-tred">.</span>MANIFEST</h1>
          <p className="v2-pagelead">
            Curated lists of the top AI tools for every objective — each sector pairs the best free and paid options with step-by-step guides.
          </p>
          <div className="v2-readbar">
            <span className="flex items-center gap-2"><i className="v2-dot v2-dot-ok" /> USE-CASE INDEX</span>
            <span className="v2-readbar-sep" />
            <span><b>{CATEGORIES.length}</b> <span className="v2-readbar-dim">SECTORS</span></span>
          </div>
        </div>

        <div className="v2-grid">
          {CATEGORIES.map(({ slug, label, icon, desc }, i) => (
            <Link key={slug} href={`/best-ai-for/${slug}`} className="v2-cell">
              <i className="v2-cb v2-cb-tl" /><i className="v2-cb v2-cb-tr" /><i className="v2-cb v2-cb-bl" /><i className="v2-cb v2-cb-br" />
              <span className="v2-cell-top">
                <span className="v2-cell-n">{String(i + 1).padStart(2, "0")}</span>
                <span className="v2-cell-id">{icon} SEC.{String(i + 1).padStart(2, "0")}</span>
              </span>
              <span className="v2-cell-name">{label}</span>
              <span className="v2-cell-desc">{desc}</span>
              <span className="v2-cell-foot">
                <span>VIEW GUIDE</span>
                <span className="v2-cell-go">ACCESS ▸</span>
              </span>
            </Link>
          ))}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
