import { notFound } from "next/navigation";
import Link from "next/link";
import Logo from "../../components/Logo";

const USE_CASES: Record<string, {
  title: string;
  description: string;
  tools: { name: string; domain: string; url: string; description: string; pricing: string; why: string }[];
}> = {
  "writing": {
    title: "Best AI Tools for Writing",
    description: "The top AI writing tools to help you write faster, better, and smarter. From blog posts to marketing copy.",
    tools: [
      { name: "ChatGPT", domain: "openai.com", url: "https://chat.openai.com", pricing: "Freemium", description: "The world's most popular AI for drafting, editing, and brainstorming any type of content.", why: "Best all-around writing assistant" },
      { name: "Jasper", domain: "jasper.ai", url: "https://jasper.ai", pricing: "Paid", description: "Purpose-built for marketing teams with 50+ templates for every content type.", why: "Best for marketing copy" },
      { name: "Copy.ai", domain: "copy.ai", url: "https://copy.ai", pricing: "Freemium", description: "Generate high-converting copy for ads, emails, and social media in seconds.", why: "Best for short-form copy" },
      { name: "Grammarly", domain: "grammarly.com", url: "https://grammarly.com", pricing: "Freemium", description: "AI writing assistant that checks grammar, style, clarity, and tone in real time.", why: "Best for editing & proofreading" },
      { name: "Writesonic", domain: "writesonic.com", url: "https://writesonic.com", pricing: "Freemium", description: "Long-form AI writer with SEO optimization built in.", why: "Best for SEO blog posts" },
      { name: "Quillbot", domain: "quillbot.com", url: "https://quillbot.com", pricing: "Freemium", description: "Paraphrase, summarize, and rewrite any text with AI.", why: "Best for paraphrasing" },
    ],
  },
  "video": {
    title: "Best AI Tools for Video Creation",
    description: "Create, edit, and produce professional videos with AI — no camera or editing experience needed.",
    tools: [
      { name: "HeyGen", domain: "heygen.com", url: "https://heygen.com", pricing: "Freemium", description: "Create AI avatar videos with realistic lip-sync in 100+ languages.", why: "Best for AI avatar videos" },
      { name: "Synthesia", domain: "synthesia.io", url: "https://synthesia.io", pricing: "Paid", description: "Professional AI video platform used by 50,000+ companies worldwide.", why: "Best for corporate training videos" },
      { name: "Runway", domain: "runwayml.com", url: "https://runwayml.com", pricing: "Freemium", description: "AI video generation and editing with text-to-video capabilities.", why: "Best for creative video generation" },
      { name: "Descript", domain: "descript.com", url: "https://descript.com", pricing: "Freemium", description: "Edit video by editing text — the easiest video editor ever made.", why: "Best for podcast & interview videos" },
      { name: "Pictory", domain: "pictory.ai", url: "https://pictory.ai", pricing: "Paid", description: "Turn blog posts and scripts into short videos automatically.", why: "Best for repurposing content" },
      { name: "Lumen5", domain: "lumen5.com", url: "https://lumen5.com", pricing: "Freemium", description: "Transform articles into engaging social media videos with AI.", why: "Best for social media videos" },
    ],
  },
  "image-generation": {
    title: "Best AI Tools for Image Generation",
    description: "Generate stunning, unique images from text descriptions. From art to product photos — no design skills needed.",
    tools: [
      { name: "Midjourney", domain: "midjourney.com", url: "https://midjourney.com", pricing: "Paid", description: "The gold standard for AI art — produces the most visually stunning results.", why: "Best image quality" },
      { name: "DALL-E 3", domain: "openai.com", url: "https://labs.openai.com", pricing: "Freemium", description: "OpenAI's image generator, integrated directly into ChatGPT.", why: "Best for following text prompts exactly" },
      { name: "Adobe Firefly", domain: "adobe.com", url: "https://firefly.adobe.com", pricing: "Freemium", description: "Commercially safe AI images built into Adobe's creative suite.", why: "Best for commercial use" },
      { name: "Leonardo.ai", domain: "leonardo.ai", url: "https://leonardo.ai", pricing: "Freemium", description: "Fine-tuned models for game art, product images, and consistent characters.", why: "Best for game & product assets" },
      { name: "Stable Diffusion", domain: "stability.ai", url: "https://dreamstudio.ai", pricing: "Free", description: "Open-source image generation with no usage limits.", why: "Best free option" },
      { name: "Ideogram", domain: "ideogram.ai", url: "https://ideogram.ai", pricing: "Freemium", description: "AI image generator that actually renders text correctly in images.", why: "Best for images with text" },
    ],
  },
  "coding": {
    title: "Best AI Tools for Coding",
    description: "Write, debug, and review code faster with AI. From autocomplete to full app generation.",
    tools: [
      { name: "GitHub Copilot", domain: "github.com", url: "https://github.com/features/copilot", pricing: "Paid", description: "AI pair programmer that suggests code in real time inside your editor.", why: "Best for daily coding" },
      { name: "Cursor", domain: "cursor.so", url: "https://cursor.so", pricing: "Freemium", description: "AI-first code editor that can write and edit entire files at once.", why: "Best AI code editor" },
      { name: "Claude", domain: "anthropic.com", url: "https://claude.ai", pricing: "Freemium", description: "Excellent at understanding large codebases and complex debugging tasks.", why: "Best for complex debugging" },
      { name: "Replit AI", domain: "replit.com", url: "https://replit.com", pricing: "Freemium", description: "Build and deploy full apps in the browser with AI assistance.", why: "Best for beginners" },
      { name: "Tabnine", domain: "tabnine.com", url: "https://tabnine.com", pricing: "Freemium", description: "Private AI code completion that runs locally for security.", why: "Best for privacy-conscious teams" },
      { name: "ChatGPT", domain: "openai.com", url: "https://chat.openai.com", pricing: "Freemium", description: "Great for explaining code, writing boilerplate, and learning new languages.", why: "Best for learning & explaining" },
    ],
  },
  "music": {
    title: "Best AI Tools for Music Creation",
    description: "Create original music, beats, and sound effects with AI — no musical experience required.",
    tools: [
      { name: "Suno", domain: "suno.ai", url: "https://suno.ai", pricing: "Freemium", description: "Generate full songs with vocals, lyrics, and production from a text prompt.", why: "Best for full song generation" },
      { name: "Udio", domain: "udio.com", url: "https://udio.com", pricing: "Freemium", description: "Create studio-quality music in any genre from text descriptions.", why: "Best audio quality" },
      { name: "Mubert", domain: "mubert.com", url: "https://mubert.com", pricing: "Freemium", description: "Generate royalty-free background music for videos and podcasts.", why: "Best for background music" },
      { name: "Soundraw", domain: "soundraw.io", url: "https://soundraw.io", pricing: "Paid", description: "AI music generator with full commercial license for creators.", why: "Best for commercial projects" },
      { name: "Boomy", domain: "boomy.com", url: "https://boomy.com", pricing: "Freemium", description: "Create and release music to streaming platforms instantly with AI.", why: "Best for releasing music" },
      { name: "AIVA", domain: "aiva.ai", url: "https://aiva.ai", pricing: "Freemium", description: "AI composer specializing in cinematic and orchestral music.", why: "Best for cinematic scores" },
    ],
  },
  "productivity": {
    title: "Best AI Tools for Productivity",
    description: "Work smarter with AI tools that automate tasks, organize your work, and save you hours every day.",
    tools: [
      { name: "Notion AI", domain: "notion.so", url: "https://notion.so", pricing: "Freemium", description: "AI built into your workspace — summarize, write, and organize without switching tabs.", why: "Best all-in-one workspace" },
      { name: "Otter.ai", domain: "otter.ai", url: "https://otter.ai", pricing: "Freemium", description: "Transcribe meetings in real time and generate automatic summaries.", why: "Best for meeting notes" },
      { name: "Motion", domain: "usemotion.com", url: "https://usemotion.com", pricing: "Paid", description: "AI that automatically schedules your tasks around your meetings.", why: "Best for scheduling" },
      { name: "Zapier", domain: "zapier.com", url: "https://zapier.com", pricing: "Freemium", description: "Connect 5,000+ apps and automate workflows without code.", why: "Best for automation" },
      { name: "Reclaim.ai", domain: "reclaim.ai", url: "https://reclaim.ai", pricing: "Freemium", description: "AI calendar assistant that protects time for your priorities.", why: "Best for time blocking" },
      { name: "Superhuman", domain: "superhuman.com", url: "https://superhuman.com", pricing: "Paid", description: "The fastest email experience ever made, powered by AI.", why: "Best for email" },
    ],
  },
  "marketing": {
    title: "Best AI Tools for Marketing",
    description: "Grow your business faster with AI marketing tools for content, ads, SEO, and social media.",
    tools: [
      { name: "Jasper", domain: "jasper.ai", url: "https://jasper.ai", pricing: "Paid", description: "The #1 AI marketing platform for enterprise content teams.", why: "Best for content teams" },
      { name: "Surfer SEO", domain: "surferseo.com", url: "https://surferseo.com", pricing: "Paid", description: "AI-powered SEO tool that helps you write content that ranks on Google.", why: "Best for SEO content" },
      { name: "AdCreative.ai", domain: "adcreative.ai", url: "https://adcreative.ai", pricing: "Paid", description: "Generate high-converting ad creatives with AI in seconds.", why: "Best for paid ads" },
      { name: "Copy.ai", domain: "copy.ai", url: "https://copy.ai", pricing: "Freemium", description: "AI copywriting for ads, emails, landing pages, and social media.", why: "Best for copywriting" },
      { name: "Lately", domain: "lately.ai", url: "https://lately.ai", pricing: "Paid", description: "Repurpose long content into dozens of social media posts automatically.", why: "Best for social media" },
      { name: "Phrasee", domain: "phrasee.co", url: "https://phrasee.co", pricing: "Paid", description: "AI that writes and optimizes email subject lines to boost open rates.", why: "Best for email marketing" },
    ],
  },
  "research": {
    title: "Best AI Tools for Research",
    description: "Find, analyze, and summarize information faster with AI research tools.",
    tools: [
      { name: "Perplexity AI", domain: "perplexity.ai", url: "https://perplexity.ai", pricing: "Freemium", description: "AI search engine that gives cited, accurate answers instead of a list of links.", why: "Best for quick research" },
      { name: "Elicit", domain: "elicit.org", url: "https://elicit.org", pricing: "Freemium", description: "AI research assistant that finds and summarizes academic papers.", why: "Best for academic research" },
      { name: "Claude", domain: "anthropic.com", url: "https://claude.ai", pricing: "Freemium", description: "Analyze long documents, PDFs, and research papers with 200k context window.", why: "Best for document analysis" },
      { name: "Consensus", domain: "consensus.app", url: "https://consensus.app", pricing: "Freemium", description: "Search engine that pulls insights directly from scientific research.", why: "Best for scientific consensus" },
      { name: "ChatGPT", domain: "openai.com", url: "https://chat.openai.com", pricing: "Freemium", description: "Summarize, explain, and analyze any topic with web browsing.", why: "Best all-around" },
      { name: "Explainpaper", domain: "explainpaper.com", url: "https://explainpaper.com", pricing: "Free", description: "Upload a research paper and get confusing sections explained in plain English.", why: "Best for understanding papers" },
    ],
  },
};

const SLUG_MAP: Record<string, string> = {
  "writing": "writing",
  "video": "video",
  "video-creation": "video",
  "video-editing": "video",
  "image-generation": "image-generation",
  "images": "image-generation",
  "coding": "coding",
  "programming": "coding",
  "music": "music",
  "music-creation": "music",
  "productivity": "productivity",
  "marketing": "marketing",
  "research": "research",
};

const PRICING_STYLES: Record<string, string> = {
  Free: "bg-green-50 text-green-700",
  Freemium: "bg-[#E7F3FF] text-[#1877F2]",
  Paid: "bg-[#fff0f3] text-[#e41e3f]",
};

export function generateStaticParams() {
  return Object.keys(USE_CASES).map((slug) => ({ "use-case": slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ "use-case": string }> }) {
  const { "use-case": slug } = await params;
  const key = SLUG_MAP[slug] || slug;
  const data = USE_CASES[key];
  if (!data) return { title: "Not Found" };
  return {
    title: `${data.title} (2025) — HowToUseMyAI`,
    description: data.description,
  };
}

export default async function BestAIForPage({ params }: { params: Promise<{ "use-case": string }> }) {
  const { "use-case": slug } = await params;
  const key = SLUG_MAP[slug] || slug;
  const data = USE_CASES[key];
  if (!data) notFound();

  return (
    <div className="flex flex-col min-h-screen bg-white">
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
            {data.title}
          </h1>
          <p className="text-[#65676b] text-sm leading-relaxed max-w-2xl">{data.description}</p>
        </div>

        <div className="flex flex-col gap-5">
          {data.tools.map((tool, i) => (
            <a
              key={tool.name}
              href={tool.url}
              target="_blank"
              rel="noopener noreferrer"
              className="tool-card relative bg-white border border-[#e4e6ea] rounded-xl p-5 flex items-start gap-4 hover:border-[#1877F2] transition-all overflow-hidden"
            >
              {i === 0 && (
                <span className="absolute top-3 right-3 text-[10px] font-bold bg-[#e41e3f] text-white px-2 py-0.5 rounded-full">
                  TOP PICK
                </span>
              )}
              <div className="w-12 h-12 rounded-xl bg-[#f7f8fa] border border-[#e4e6ea] flex items-center justify-center overflow-hidden flex-shrink-0">
                <img
                  src={`https://www.google.com/s2/favicons?domain=${tool.domain}&sz=64`}
                  alt={tool.name}
                  width={32}
                  height={32}
                  className="rounded object-contain"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-[#1c1e21] text-sm">{tool.name}</span>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${PRICING_STYLES[tool.pricing]}`}>
                    {tool.pricing.toUpperCase()}
                  </span>
                </div>
                <p className="text-xs text-[#65676b] leading-relaxed mb-2">{tool.description}</p>
                <span className="text-xs font-medium text-[#1877F2]">✓ {tool.why}</span>
              </div>
            </a>
          ))}
        </div>

        <div className="mt-12 bg-[#f7f8fa] rounded-xl p-6 text-center">
          <p className="text-sm text-[#65676b] mb-3">Not sure which one to pick?</p>
          <Link
            href={`/recommend?q=${encodeURIComponent(data.title.replace("Best AI Tools for ", "I want to "))}`}
            className="bg-[#1877F2] text-white text-sm font-semibold px-6 py-3 rounded-lg hover:bg-[#166FE5] transition-colors inline-block"
          >
            Get a personalized recommendation →
          </Link>
        </div>
      </main>

      <footer className="border-t border-[#e4e6ea] px-6 py-6">
        <div className="max-w-4xl mx-auto flex flex-wrap gap-4 justify-between items-center text-xs text-[#65676b]">
          <Link href="/" className="flex items-center gap-2">
            <Logo size={18} />
            <span>HowToUseMyAI</span>
          </Link>
          <div className="flex gap-4">
            <Link href="/best-ai-for/writing" className="hover:text-[#1877F2]">Writing</Link>
            <Link href="/best-ai-for/video" className="hover:text-[#1877F2]">Video</Link>
            <Link href="/best-ai-for/coding" className="hover:text-[#1877F2]">Coding</Link>
            <Link href="/best-ai-for/image-generation" className="hover:text-[#1877F2]">Images</Link>
            <Link href="/best-ai-for/music" className="hover:text-[#1877F2]">Music</Link>
          </div>
          <Link href="/privacy" className="hover:text-[#1877F2]">Privacy</Link>
        </div>
      </footer>
    </div>
  );
}
