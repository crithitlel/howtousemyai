"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Logo from "./components/Logo";

const CATEGORIES = [
  "All", "Writing", "Image Generation", "Coding", "Video", "Music",
  "Research", "Productivity", "Marketing", "Data Analysis", "Presentations",
  "Customer Support", "HR & Recruiting", "Finance",
];

const PRICING_OPTIONS = ["All", "Free", "Freemium", "Paid"] as const;
type PricingFilter = typeof PRICING_OPTIONS[number];

function slugify(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

const TOOLS = [
  // Writing
  { name: "ChatGPT", description: "The world's most popular AI assistant for writing, coding, research and more.", category: "Writing", pricing: "Freemium", isNew: false, icon: "💬", domain: "openai.com", url: "https://chat.openai.com" },
  { name: "Claude", description: "Anthropic's AI assistant for nuanced writing and complex reasoning.", category: "Writing", pricing: "Freemium", isNew: false, icon: "🤖", domain: "anthropic.com", url: "https://claude.ai" },
  { name: "Jasper", description: "AI writing platform for marketing teams and content creators.", category: "Writing", pricing: "Paid", isNew: false, icon: "✍️", domain: "jasper.ai", url: "https://jasper.ai" },
  { name: "Copy.ai", description: "AI copywriting tool for ads, emails, and social media content.", category: "Writing", pricing: "Freemium", isNew: false, icon: "📣", domain: "copy.ai", url: "https://copy.ai" },
  { name: "Grammarly", description: "AI writing assistant that checks grammar, style, and tone everywhere.", category: "Writing", pricing: "Freemium", isNew: false, icon: "📝", domain: "grammarly.com", url: "https://grammarly.com" },
  { name: "Writesonic", description: "AI writer with 100+ templates for blogs, ads, and social content.", category: "Writing", pricing: "Freemium", isNew: false, icon: "🖊️", domain: "writesonic.com", url: "https://writesonic.com" },
  { name: "Quillbot", description: "AI paraphrasing and summarizing tool.", category: "Writing", pricing: "Freemium", isNew: false, icon: "🔄", domain: "quillbot.com", url: "https://quillbot.com" },
  { name: "Sudowrite", description: "AI writing tool for fiction and creative writing.", category: "Writing", pricing: "Paid", isNew: false, icon: "📖", domain: "sudowrite.com", url: "https://sudowrite.com" },
  { name: "Hemingway Editor", description: "Makes your writing bold and clear.", category: "Writing", pricing: "Free", isNew: false, icon: "✂️", domain: "hemingwayapp.com", url: "https://hemingwayapp.com" },
  { name: "Wordtune", description: "AI that rewrites sentences to sound better.", category: "Writing", pricing: "Freemium", isNew: false, icon: "🎯", domain: "wordtune.com", url: "https://wordtune.com" },
  { name: "Anyword", description: "AI copywriting with performance predictions.", category: "Writing", pricing: "Paid", isNew: false, icon: "📊", domain: "anyword.com", url: "https://anyword.com" },
  // Image Generation
  { name: "Midjourney", description: "Generate stunning, artistic images from text prompts.", category: "Image Generation", pricing: "Paid", isNew: false, icon: "🎨", domain: "midjourney.com", url: "https://midjourney.com" },
  { name: "DALL-E 3", description: "OpenAI's image generation model integrated into ChatGPT.", category: "Image Generation", pricing: "Freemium", isNew: false, icon: "🖼️", domain: "openai.com", url: "https://labs.openai.com" },
  { name: "Adobe Firefly", description: "Commercially safe AI image generation built into Adobe tools.", category: "Image Generation", pricing: "Freemium", isNew: false, icon: "🔥", domain: "adobe.com", url: "https://firefly.adobe.com" },
  { name: "Leonardo.ai", description: "Fine-tuned image generation for game art and product design.", category: "Image Generation", pricing: "Freemium", isNew: true, icon: "🎭", domain: "leonardo.ai", url: "https://leonardo.ai" },
  { name: "Stable Diffusion", description: "Open-source image model with no usage limits.", category: "Image Generation", pricing: "Free", isNew: false, icon: "⚡", domain: "stability.ai", url: "https://dreamstudio.ai" },
  { name: "Canva AI", description: "Design platform with AI image generation built in.", category: "Image Generation", pricing: "Freemium", isNew: false, icon: "🖌️", domain: "canva.com", url: "https://canva.com" },
  { name: "Ideogram", description: "AI image generator great for text in images.", category: "Image Generation", pricing: "Freemium", isNew: true, icon: "🔤", domain: "ideogram.ai", url: "https://ideogram.ai" },
  { name: "Playground AI", description: "Free AI image generator with powerful controls.", category: "Image Generation", pricing: "Free", isNew: false, icon: "🎮", domain: "playground.com", url: "https://playground.com" },
  { name: "Remove.bg", description: "Remove image backgrounds instantly with AI.", category: "Image Generation", pricing: "Freemium", isNew: false, icon: "✂️", domain: "remove.bg", url: "https://remove.bg" },
  { name: "Clipdrop", description: "Suite of AI image editing tools by Stability AI.", category: "Image Generation", pricing: "Freemium", isNew: false, icon: "📷", domain: "clipdrop.co", url: "https://clipdrop.co" },
  // Coding
  { name: "GitHub Copilot", description: "AI pair programmer that suggests code completions in real time.", category: "Coding", pricing: "Freemium", isNew: false, icon: "💻", domain: "github.com", url: "https://github.com/features/copilot" },
  { name: "Cursor", description: "AI-first code editor that understands your entire codebase.", category: "Coding", pricing: "Freemium", isNew: true, icon: "⌨️", domain: "cursor.sh", url: "https://cursor.sh" },
  { name: "Replit AI", description: "Browser-based coding with AI assistance, no setup required.", category: "Coding", pricing: "Freemium", isNew: true, icon: "🔧", domain: "replit.com", url: "https://replit.com" },
  { name: "Tabnine", description: "Privacy-first AI code completion for all major IDEs.", category: "Coding", pricing: "Freemium", isNew: false, icon: "🛠️", domain: "tabnine.com", url: "https://tabnine.com" },
  { name: "Codeium", description: "Free AI code completion for 70+ languages.", category: "Coding", pricing: "Free", isNew: false, icon: "⚡", domain: "codeium.com", url: "https://codeium.com" },
  { name: "Amazon CodeWhisperer", description: "AWS AI coding assistant.", category: "Coding", pricing: "Free", isNew: false, icon: "☁️", domain: "aws.amazon.com", url: "https://aws.amazon.com/codewhisperer" },
  { name: "Sourcegraph Cody", description: "AI coding assistant with codebase context.", category: "Coding", pricing: "Freemium", isNew: false, icon: "🔍", domain: "sourcegraph.com", url: "https://sourcegraph.com/cody" },
  { name: "Pieces for Developers", description: "AI-powered developer workflow tool.", category: "Coding", pricing: "Freemium", isNew: false, icon: "🧩", domain: "pieces.app", url: "https://pieces.app" },
  // Video
  { name: "Runway", description: "Professional AI video generation and editing for creators.", category: "Video", pricing: "Freemium", isNew: false, icon: "🎬", domain: "runwayml.com", url: "https://runwayml.com" },
  { name: "HeyGen", description: "Create AI avatar videos with realistic human presenters.", category: "Video", pricing: "Freemium", isNew: true, icon: "🎥", domain: "heygen.com", url: "https://heygen.com" },
  { name: "Synthesia", description: "AI presenter videos with avatars reading your script.", category: "Video", pricing: "Paid", isNew: false, icon: "📹", domain: "synthesia.io", url: "https://synthesia.io" },
  { name: "CapCut AI", description: "Free AI video editor with auto-captions and effects.", category: "Video", pricing: "Free", isNew: false, icon: "✂️", domain: "capcut.com", url: "https://capcut.com" },
  { name: "Descript", description: "Edit video by editing its transcript — the easiest video editor.", category: "Video", pricing: "Freemium", isNew: false, icon: "🎞️", domain: "descript.com", url: "https://descript.com" },
  { name: "Invideo AI", description: "Turn a text prompt into a full YouTube-ready video.", category: "Video", pricing: "Freemium", isNew: true, icon: "▶️", domain: "invideo.ai", url: "https://invideo.ai" },
  { name: "Pika Labs", description: "AI video generation from text and images.", category: "Video", pricing: "Freemium", isNew: true, icon: "🎆", domain: "pika.art", url: "https://pika.art" },
  { name: "D-ID", description: "Create talking avatar videos from a photo.", category: "Video", pricing: "Freemium", isNew: false, icon: "👤", domain: "d-id.com", url: "https://d-id.com" },
  { name: "Loom AI", description: "Async video messaging with AI summaries.", category: "Video", pricing: "Freemium", isNew: false, icon: "📽️", domain: "loom.com", url: "https://loom.com" },
  { name: "Captions", description: "AI video editor with auto-captions and effects.", category: "Video", pricing: "Freemium", isNew: true, icon: "💬", domain: "captions.ai", url: "https://captions.ai" },
  // Music
  { name: "Suno", description: "Create full songs with lyrics and music from a text prompt.", category: "Music", pricing: "Freemium", isNew: true, icon: "🎵", domain: "suno.com", url: "https://suno.com" },
  { name: "Udio", description: "Generate original music tracks in any genre from text.", category: "Music", pricing: "Freemium", isNew: true, icon: "🎶", domain: "udio.com", url: "https://udio.com" },
  { name: "Mubert", description: "Royalty-free AI background music for videos and podcasts.", category: "Music", pricing: "Freemium", isNew: false, icon: "🎼", domain: "mubert.com", url: "https://mubert.com" },
  { name: "Soundraw", description: "AI music generator for content creators.", category: "Music", pricing: "Freemium", isNew: false, icon: "🎸", domain: "soundraw.io", url: "https://soundraw.io" },
  { name: "Boomy", description: "Create and release AI-generated songs.", category: "Music", pricing: "Freemium", isNew: false, icon: "🎤", domain: "boomy.com", url: "https://boomy.com" },
  { name: "Loudly", description: "AI music generation with style controls.", category: "Music", pricing: "Freemium", isNew: false, icon: "🔊", domain: "loudly.com", url: "https://loudly.com" },
  // Research
  { name: "Perplexity AI", description: "AI-powered search engine with cited, real-time answers.", category: "Research", pricing: "Freemium", isNew: false, icon: "🔍", domain: "perplexity.ai", url: "https://perplexity.ai" },
  { name: "Elicit", description: "AI research assistant trained on academic papers.", category: "Research", pricing: "Freemium", isNew: false, icon: "📚", domain: "elicit.com", url: "https://elicit.com" },
  { name: "Consensus", description: "AI search engine for scientific and medical evidence.", category: "Research", pricing: "Freemium", isNew: true, icon: "🔬", domain: "consensus.app", url: "https://consensus.app" },
  { name: "Otter.ai", description: "AI meeting recorder and transcriber with instant summaries.", category: "Research", pricing: "Freemium", isNew: false, icon: "🎙️", domain: "otter.ai", url: "https://otter.ai" },
  { name: "Semantic Scholar", description: "Free AI-powered academic search engine.", category: "Research", pricing: "Free", isNew: false, icon: "🎓", domain: "semanticscholar.org", url: "https://semanticscholar.org" },
  { name: "Scite", description: "AI tool that shows how papers have been cited.", category: "Research", pricing: "Freemium", isNew: false, icon: "📋", domain: "scite.ai", url: "https://scite.ai" },
  { name: "Research Rabbit", description: "AI paper discovery and visualization.", category: "Research", pricing: "Free", isNew: false, icon: "🐇", domain: "researchrabbitapp.com", url: "https://researchrabbitapp.com" },
  { name: "Explainpaper", description: "Upload a paper and AI explains the hard parts.", category: "Research", pricing: "Freemium", isNew: false, icon: "📄", domain: "explainpaper.com", url: "https://explainpaper.com" },
  // Productivity
  { name: "Notion AI", description: "AI built into Notion for writing, summarizing and organizing.", category: "Productivity", pricing: "Freemium", isNew: false, icon: "🗂️", domain: "notion.so", url: "https://notion.so/product/ai" },
  { name: "Reclaim.ai", description: "AI calendar optimizer that auto-schedules your tasks.", category: "Productivity", pricing: "Freemium", isNew: true, icon: "📅", domain: "reclaim.ai", url: "https://reclaim.ai" },
  { name: "Motion", description: "AI that builds your perfect daily schedule automatically.", category: "Productivity", pricing: "Paid", isNew: false, icon: "⏱️", domain: "usemotion.com", url: "https://usemotion.com" },
  { name: "Mem", description: "AI-powered note-taking that organizes itself.", category: "Productivity", pricing: "Freemium", isNew: false, icon: "🧠", domain: "mem.ai", url: "https://mem.ai" },
  { name: "Taskade", description: "AI project management and team collaboration.", category: "Productivity", pricing: "Freemium", isNew: false, icon: "✅", domain: "taskade.com", url: "https://taskade.com" },
  { name: "Fireflies.ai", description: "AI meeting assistant that records and transcribes.", category: "Productivity", pricing: "Freemium", isNew: false, icon: "🔥", domain: "fireflies.ai", url: "https://fireflies.ai" },
  { name: "Superhuman", description: "AI-powered email client.", category: "Productivity", pricing: "Paid", isNew: false, icon: "⚡", domain: "superhuman.com", url: "https://superhuman.com" },
  // Marketing
  { name: "Surfer SEO", description: "Data-driven SEO tool to rank higher on Google.", category: "Marketing", pricing: "Paid", isNew: false, icon: "📈", domain: "surferseo.com", url: "https://surferseo.com" },
  { name: "AdCreative.ai", description: "Generate high-converting ad creatives and banners with AI.", category: "Marketing", pricing: "Paid", isNew: true, icon: "📢", domain: "adcreative.ai", url: "https://adcreative.ai" },
  { name: "Buffer", description: "AI-powered social media scheduling and analytics.", category: "Marketing", pricing: "Freemium", isNew: false, icon: "📱", domain: "buffer.com", url: "https://buffer.com" },
  { name: "Mailchimp AI", description: "Email marketing platform with AI content suggestions.", category: "Marketing", pricing: "Freemium", isNew: false, icon: "📧", domain: "mailchimp.com", url: "https://mailchimp.com" },
  { name: "Semrush", description: "Comprehensive AI SEO and marketing platform.", category: "Marketing", pricing: "Paid", isNew: false, icon: "🔍", domain: "semrush.com", url: "https://semrush.com" },
  { name: "Hootsuite", description: "AI social media management and scheduling.", category: "Marketing", pricing: "Paid", isNew: false, icon: "🦉", domain: "hootsuite.com", url: "https://hootsuite.com" },
  { name: "Recently.ai", description: "AI social media content repurposing.", category: "Marketing", pricing: "Freemium", isNew: false, icon: "♻️", domain: "recently.ai", url: "https://recently.ai" },
  { name: "Phrasee", description: "AI brand language and email subject line optimizer.", category: "Marketing", pricing: "Paid", isNew: false, icon: "🗣️", domain: "phrasee.co", url: "https://phrasee.co" },
  // Data Analysis
  { name: "Julius AI", description: "Chat with your data — upload spreadsheets and get instant analysis.", category: "Data Analysis", pricing: "Freemium", isNew: true, icon: "📊", domain: "julius.ai", url: "https://julius.ai" },
  { name: "Akkio", description: "No-code AI analytics for predictions and dashboards.", category: "Data Analysis", pricing: "Freemium", isNew: false, icon: "🔢", domain: "akkio.com", url: "https://akkio.com" },
  { name: "Tableau AI", description: "AI-powered business intelligence and visualization.", category: "Data Analysis", pricing: "Paid", isNew: false, icon: "📉", domain: "tableau.com", url: "https://tableau.com" },
  { name: "Obviously AI", description: "No-code AI predictions from any dataset.", category: "Data Analysis", pricing: "Freemium", isNew: false, icon: "💡", domain: "obviously.ai", url: "https://obviously.ai" },
  { name: "MonkeyLearn", description: "AI text analysis and classification.", category: "Data Analysis", pricing: "Freemium", isNew: false, icon: "🐒", domain: "monkeylearn.com", url: "https://monkeylearn.com" },
  // Presentations
  { name: "Gamma", description: "AI presentation builder that generates beautiful decks instantly.", category: "Presentations", pricing: "Freemium", isNew: false, icon: "🖥️", domain: "gamma.app", url: "https://gamma.app" },
  { name: "Beautiful.ai", description: "Smart slide designer that auto-formats as you type.", category: "Presentations", pricing: "Freemium", isNew: false, icon: "✨", domain: "beautiful.ai", url: "https://beautiful.ai" },
  { name: "Tome", description: "AI storytelling format blending slides with narrative text.", category: "Presentations", pricing: "Freemium", isNew: false, icon: "📖", domain: "tome.app", url: "https://tome.app" },
  { name: "SlidesAI", description: "AI that creates presentations from text.", category: "Presentations", pricing: "Freemium", isNew: false, icon: "📑", domain: "slidesai.io", url: "https://slidesai.io" },
  { name: "Decktopus", description: "AI presentation builder with smart design.", category: "Presentations", pricing: "Freemium", isNew: false, icon: "🎴", domain: "decktopus.com", url: "https://decktopus.com" },
  { name: "MagicSlides", description: "Create Google Slides with AI instantly.", category: "Presentations", pricing: "Freemium", isNew: false, icon: "🪄", domain: "magicslides.app", url: "https://magicslides.app" },
  // Customer Support
  { name: "Intercom AI", description: "AI support agent trained on your docs, resolves queries 24/7.", category: "Customer Support", pricing: "Paid", isNew: false, icon: "💬", domain: "intercom.com", url: "https://intercom.com/fin" },
  { name: "Tidio", description: "AI chatbot for e-commerce that qualifies leads and supports customers.", category: "Customer Support", pricing: "Freemium", isNew: false, icon: "🤝", domain: "tidio.com", url: "https://tidio.com" },
  { name: "Drift", description: "AI chatbot that qualifies leads and books meetings automatically.", category: "Customer Support", pricing: "Freemium", isNew: false, icon: "💼", domain: "drift.com", url: "https://drift.com" },
  { name: "Zendesk AI", description: "AI-powered customer support with smart ticket routing.", category: "Customer Support", pricing: "Paid", isNew: false, icon: "🎫", domain: "zendesk.com", url: "https://zendesk.com" },
  { name: "Freshdesk AI", description: "AI customer support with smart routing.", category: "Customer Support", pricing: "Freemium", isNew: false, icon: "🌿", domain: "freshdesk.com", url: "https://freshdesk.com" },
  { name: "Forethought", description: "AI that resolves support tickets automatically.", category: "Customer Support", pricing: "Paid", isNew: false, icon: "🧠", domain: "forethought.ai", url: "https://forethought.ai" },
  { name: "Ada", description: "AI customer service automation platform.", category: "Customer Support", pricing: "Paid", isNew: false, icon: "🤖", domain: "ada.cx", url: "https://ada.cx" },
  // HR & Recruiting
  { name: "Workday AI", description: "AI-powered HR and workforce management.", category: "HR & Recruiting", pricing: "Paid", isNew: false, icon: "👔", domain: "workday.com", url: "https://workday.com" },
  { name: "HireVue", description: "AI video interviewing and assessment platform.", category: "HR & Recruiting", pricing: "Paid", isNew: false, icon: "🎥", domain: "hirevue.com", url: "https://hirevue.com" },
  { name: "Paradox", description: "AI recruiting assistant named Olivia.", category: "HR & Recruiting", pricing: "Paid", isNew: false, icon: "🤖", domain: "paradox.ai", url: "https://paradox.ai" },
  { name: "Fetcher", description: "AI talent sourcing and outreach automation.", category: "HR & Recruiting", pricing: "Paid", isNew: false, icon: "🎣", domain: "fetcher.ai", url: "https://fetcher.ai" },
  // Finance
  { name: "Zest AI", description: "AI credit underwriting platform.", category: "Finance", pricing: "Paid", isNew: false, icon: "💳", domain: "zest.ai", url: "https://zest.ai" },
  { name: "Domo", description: "AI business intelligence platform.", category: "Finance", pricing: "Paid", isNew: false, icon: "📊", domain: "domo.com", url: "https://domo.com" },
  { name: "Vic.ai", description: "AI accounts payable automation.", category: "Finance", pricing: "Paid", isNew: false, icon: "🧾", domain: "vic.ai", url: "https://vic.ai" },
];

const PRICING_STYLES: Record<string, string> = {
  Free:     "bg-[#E7F3FF] text-[#1877F2]",
  Freemium: "bg-[#E7F3FF] text-[#1877F2]",
  Paid:     "bg-[#fff0f3] text-[#e41e3f]",
};

const TRENDING = [
  "Create a YouTube video",
  "Generate images",
  "Write a cover letter",
  "Fix my code",
  "Make a song",
  "Research a topic",
];

const HOW_IT_WORKS = [
  { icon: "💬", step: "1", title: "Describe your goal", desc: "Type what you want to do in plain English. No technical knowledge needed." },
  { icon: "🔍", step: "2", title: "We match the tools", desc: "Our system finds the best AI tools for your exact use case from 100+ options." },
  { icon: "⚡", step: "3", title: "Get started instantly", desc: "Each result comes with step-by-step instructions so you can start in minutes." },
];

const FOOTER_CATEGORIES = ["Writing", "Image Generation", "Video", "Coding", "Music"];

export default function HomePage() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [activePricing, setActivePricing] = useState<PricingFilter>("All");
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const router = useRouter();

  const handleSubmit = (q: string) => {
    const trimmed = q.trim();
    if (!trimmed) return;
    router.push(`/recommend?q=${encodeURIComponent(trimmed)}`);
  };

  const filtered = TOOLS.filter((t) => {
    const matchesCategory = activeCategory === "All" || t.category === activeCategory;
    const matchesPricing = activePricing === "All" || t.pricing === activePricing;
    const matchesSearch = !query.trim() || (
      t.name.toLowerCase().includes(query.toLowerCase()) ||
      t.description.toLowerCase().includes(query.toLowerCase())
    );
    return matchesCategory && matchesPricing && matchesSearch;
  });

  return (
    <div className="flex flex-col min-h-screen bg-white">

      {/* Hero — Google-style, no header */}
      <section className="bg-white px-4 sm:px-6 pt-16 sm:pt-24 pb-8 text-center">
        <div className="max-w-2xl mx-auto">

          {/* Centered logo + wordmark */}
          <div className="flex items-center justify-center gap-2.5 mb-10">
            <Logo size={36} />
            <span className="font-semibold text-[#1877F2] text-xl tracking-tight">
              HowToUseMyAI
            </span>
          </div>

          {/* Search bar with red glow border */}
          <div className="search-glow flex flex-col sm:flex-row gap-2 bg-white rounded-xl p-1.5">
            <input
              type="text"
              className="flex-1 text-sm text-[#1c1e21] bg-transparent px-3 py-2 placeholder-[#bcc0c4] focus:outline-none"
              placeholder='e.g. "I want to create a YouTube video"'
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(query); }}
            />
            <button
              onClick={() => handleSubmit(query)}
              disabled={!query.trim()}
              className="bg-[#1877F2] hover:bg-[#166FE5] disabled:opacity-30 disabled:cursor-not-allowed text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors whitespace-nowrap"
            >
              Find My AI →
            </button>
          </div>

          {/* Trending searches */}
          <div className="mt-4 flex items-center gap-2 justify-center flex-wrap">
            <span className="text-xs text-[#65676b] font-medium flex-shrink-0">Popular:</span>
            <div className="flex gap-2 flex-wrap justify-center">
              {TRENDING.map((term) => (
                <button
                  key={term}
                  onClick={() => handleSubmit(term)}
                  className="text-xs px-3 py-1 rounded-full border border-[#dddfe2] text-[#65676b] hover:border-[#1877F2] hover:text-[#1877F2] transition-all whitespace-nowrap"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-[#f7f8fa] px-6 py-10 border-y border-[#e4e6ea]">
        <div className="max-w-3xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-4">
            {HOW_IT_WORKS.map(({ icon, step, title, desc }) => (
              <div key={step} className="flex flex-col items-center text-center gap-3">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#1877F2] text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                    {step}
                  </div>
                  <span className="text-xl">{icon}</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#1c1e21] mb-1">{title}</p>
                  <p className="text-xs text-[#65676b] leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Thin gradient divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-[#1877F2]/30 to-transparent" />

      {/* Category chips */}
      <section id="tools" className="px-6 pt-5 pb-3 bg-white border-b border-[#f0f2f5]">
        <div className="max-w-6xl mx-auto flex gap-2 flex-wrap justify-center">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-all ${
                activeCategory === cat
                  ? "bg-[#1877F2] text-white border-[#1877F2] shadow-sm shadow-[#1877F2]/20"
                  : "bg-white text-[#65676b] border-[#dddfe2] hover:border-[#1877F2] hover:text-[#1877F2]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Pricing filter */}
        <div className="max-w-6xl mx-auto flex gap-2 flex-wrap mt-3 pb-2 justify-center">
          {PRICING_OPTIONS.map((p) => (
            <button
              key={p}
              onClick={() => setActivePricing(p)}
              className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-all ${
                activePricing === p
                  ? "bg-[#e41e3f] text-white border-[#e41e3f] shadow-sm shadow-[#e41e3f]/20"
                  : "bg-white text-[#65676b] border-[#dddfe2] hover:border-[#e41e3f] hover:text-[#e41e3f]"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </section>

      {/* Tool cards */}
      <section className="px-6 py-8 flex-1 bg-[#f7f8fa]">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs text-[#65676b] mb-5">{filtered.length} tools available</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filtered.map((tool) => (
              <div
                key={tool.name}
                className="tool-card relative group bg-white border border-[#e4e6ea] rounded-xl p-4 flex flex-col gap-3 overflow-hidden"
              >
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-lg bg-[#f7f8fa] border border-[#e4e6ea] flex items-center justify-center overflow-hidden">
                    <img
                      src={`https://www.google.com/s2/favicons?domain=${tool.domain}&sz=64`}
                      alt={tool.name}
                      width={28}
                      height={28}
                      className="rounded object-contain"
                      onError={(e) => {
                        const t = e.currentTarget;
                        t.style.display = "none";
                        if (t.nextElementSibling) (t.nextElementSibling as HTMLElement).style.display = "flex";
                      }}
                    />
                    <span className="text-xl hidden items-center justify-center w-full h-full">{tool.icon}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {tool.isNew && (
                      <span className="text-[10px] font-semibold bg-[#fff0f3] text-[#e41e3f] px-2 py-0.5 rounded-full">
                        NEW
                      </span>
                    )}
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${PRICING_STYLES[tool.pricing]}`}>
                      {tool.pricing.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-[#1c1e21] group-hover:text-[#1877F2] transition-colors">
                    {tool.name}
                  </h3>
                  <p className="text-xs text-[#65676b] mt-1 leading-relaxed line-clamp-2">
                    {tool.description}
                  </p>
                </div>

                <div className="mt-auto flex items-center justify-between">
                  <span className="text-[10px] text-[#1877F2] bg-[#E7F3FF] px-2 py-0.5 rounded-full">
                    {tool.category}
                  </span>
                  <div className="flex items-center gap-2">
                    <a
                      href={`/tools/${slugify(tool.name)}`}
                      className="text-[10px] text-[#65676b] hover:text-[#1877F2] transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Learn more
                    </a>
                    <a
                      href={tool.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] text-white bg-[#1877F2] hover:bg-[#166FE5] px-2 py-0.5 rounded-full transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Visit →
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter signup section */}
      <section className="bg-white px-6 py-16">
        <div className="max-w-xl mx-auto text-center">
          {subscribed ? (
            <div className="bg-[#E7F3FF] border border-[#1877F2]/20 rounded-xl px-6 py-4 text-sm text-[#1877F2] font-medium">
              You&apos;re in! Check your inbox. 🎉
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (email.trim()) setSubscribed(true);
              }}
              className="flex flex-col sm:flex-row gap-2"
            >
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-white text-[#1c1e21] text-sm px-4 py-3 rounded-lg placeholder-[#bcc0c4] focus:outline-none search-glow"
              />
              <button
                type="submit"
                className="bg-[#1877F2] hover:bg-[#166FE5] text-white text-sm font-semibold px-6 py-3 rounded-lg transition-colors whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Rich footer */}
      <footer className="bg-white border-t border-[#e4e6ea] px-6 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 mb-10">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2.5">
                <Logo size={28} />
                <span className="font-semibold text-[#1877F2] text-sm tracking-tight">HowToUseMyAI</span>
              </div>
              <p className="text-xs text-[#65676b] leading-relaxed">Making AI accessible to everyone.</p>
            </div>
            <div className="flex flex-col gap-3">
              <p className="text-[10px] font-semibold text-[#65676b] uppercase tracking-widest mb-1">Quick Links</p>
              <a href="/" className="text-xs text-[#65676b] hover:text-[#1877F2] transition-colors">Home</a>
              <a href="/#tools" className="text-xs text-[#65676b] hover:text-[#1877F2] transition-colors">Browse Tools</a>
              <a href="/recommend?q=what+is+the+best+AI+tool+for+me" className="text-xs text-[#65676b] hover:text-[#1877F2] transition-colors">Recommend Me</a>
              <a href="/submit" className="text-xs text-[#e41e3f] hover:opacity-80 transition-colors font-medium">+ Submit a Tool</a>
            </div>
            <div className="flex flex-col gap-3">
              <p className="text-[10px] font-semibold text-[#65676b] uppercase tracking-widest mb-1">Categories</p>
              {FOOTER_CATEGORIES.map((cat) => (
                <a key={cat} href={`/recommend?q=best AI tools for ${cat.toLowerCase()}`} className="text-xs text-[#65676b] hover:text-[#1877F2] transition-colors">{cat}</a>
              ))}
            </div>
          </div>
          <div className="border-t border-[#e4e6ea] pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#65676b]">
            <p>© {new Date().getFullYear()} HowToUseMyAI. All rights reserved.</p>
            <div className="flex gap-5">
              <a href="/privacy" className="hover:text-[#1877F2] transition-colors">Privacy</a>
              <a href="/terms" className="hover:text-[#1877F2] transition-colors">Terms</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
