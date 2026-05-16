"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Logo from "./components/Logo";

const CATEGORIES = [
  "All", "Writing", "Image Generation", "Coding", "Video", "Music",
  "Research", "Productivity", "Marketing", "Data Analysis", "Presentations", "Customer Support",
];

const PRICING_OPTIONS = ["All", "Free", "Freemium", "Paid"] as const;
type PricingFilter = typeof PRICING_OPTIONS[number];

const TOOLS = [
  // Writing
  { name: "ChatGPT", description: "The world's most popular AI assistant for writing, coding, research and more.", category: "Writing", pricing: "Freemium", isNew: false, icon: "💬", logo: "https://logo.clearbit.com/openai.com", url: "https://chat.openai.com" },
  { name: "Claude", description: "Anthropic's AI assistant for nuanced writing and complex reasoning.", category: "Writing", pricing: "Freemium", isNew: false, icon: "🤖", logo: "https://logo.clearbit.com/anthropic.com", url: "https://claude.ai" },
  { name: "Jasper", description: "AI writing platform for marketing teams and content creators.", category: "Writing", pricing: "Paid", isNew: false, icon: "✍️", logo: "https://logo.clearbit.com/jasper.ai", url: "https://jasper.ai" },
  { name: "Copy.ai", description: "AI copywriting tool for ads, emails, and social media content.", category: "Writing", pricing: "Freemium", isNew: false, icon: "📣", logo: "https://logo.clearbit.com/copy.ai", url: "https://copy.ai" },
  { name: "Grammarly", description: "AI writing assistant that checks grammar, style, and tone everywhere.", category: "Writing", pricing: "Freemium", isNew: false, icon: "📝", logo: "https://logo.clearbit.com/grammarly.com", url: "https://grammarly.com" },
  { name: "Writesonic", description: "AI writer with 100+ templates for blogs, ads, and social content.", category: "Writing", pricing: "Freemium", isNew: false, icon: "🖊️", logo: "https://logo.clearbit.com/writesonic.com", url: "https://writesonic.com" },
  // Image Generation
  { name: "Midjourney", description: "Generate stunning, artistic images from text prompts.", category: "Image Generation", pricing: "Paid", isNew: false, icon: "🎨", logo: "https://logo.clearbit.com/midjourney.com", url: "https://midjourney.com" },
  { name: "DALL-E 3", description: "OpenAI's image generation model integrated into ChatGPT.", category: "Image Generation", pricing: "Freemium", isNew: false, icon: "🖼️", logo: "https://logo.clearbit.com/openai.com", url: "https://labs.openai.com" },
  { name: "Adobe Firefly", description: "Commercially safe AI image generation built into Adobe tools.", category: "Image Generation", pricing: "Freemium", isNew: false, icon: "🔥", logo: "https://logo.clearbit.com/adobe.com", url: "https://firefly.adobe.com" },
  { name: "Leonardo.ai", description: "Fine-tuned image generation for game art and product design.", category: "Image Generation", pricing: "Freemium", isNew: true, icon: "🎭", logo: "https://logo.clearbit.com/leonardo.ai", url: "https://leonardo.ai" },
  { name: "Stable Diffusion", description: "Open-source image model with no usage limits.", category: "Image Generation", pricing: "Free", isNew: false, icon: "⚡", logo: "https://logo.clearbit.com/stability.ai", url: "https://dreamstudio.ai" },
  // Coding
  { name: "GitHub Copilot", description: "AI pair programmer that suggests code completions in real time.", category: "Coding", pricing: "Freemium", isNew: false, icon: "💻", logo: "https://logo.clearbit.com/github.com", url: "https://github.com/features/copilot" },
  { name: "Cursor", description: "AI-first code editor that understands your entire codebase.", category: "Coding", pricing: "Freemium", isNew: true, icon: "⌨️", logo: "https://logo.clearbit.com/cursor.sh", url: "https://cursor.sh" },
  { name: "Replit AI", description: "Browser-based coding with AI assistance, no setup required.", category: "Coding", pricing: "Freemium", isNew: true, icon: "🔧", logo: "https://logo.clearbit.com/replit.com", url: "https://replit.com" },
  { name: "Tabnine", description: "Privacy-first AI code completion for all major IDEs.", category: "Coding", pricing: "Freemium", isNew: false, icon: "🛠️", logo: "https://logo.clearbit.com/tabnine.com", url: "https://tabnine.com" },
  // Video
  { name: "Runway", description: "Professional AI video generation and editing for creators.", category: "Video", pricing: "Freemium", isNew: false, icon: "🎬", logo: "https://logo.clearbit.com/runwayml.com", url: "https://runwayml.com" },
  { name: "HeyGen", description: "Create AI avatar videos with realistic human presenters.", category: "Video", pricing: "Freemium", isNew: true, icon: "🎥", logo: "https://logo.clearbit.com/heygen.com", url: "https://heygen.com" },
  { name: "Synthesia", description: "AI presenter videos with avatars reading your script.", category: "Video", pricing: "Paid", isNew: false, icon: "📹", logo: "https://logo.clearbit.com/synthesia.io", url: "https://synthesia.io" },
  { name: "CapCut AI", description: "Free AI video editor with auto-captions and effects.", category: "Video", pricing: "Free", isNew: false, icon: "✂️", logo: "https://logo.clearbit.com/capcut.com", url: "https://capcut.com" },
  { name: "Descript", description: "Edit video by editing its transcript — the easiest video editor.", category: "Video", pricing: "Freemium", isNew: false, icon: "🎞️", logo: "https://logo.clearbit.com/descript.com", url: "https://descript.com" },
  { name: "Invideo AI", description: "Turn a text prompt into a full YouTube-ready video.", category: "Video", pricing: "Freemium", isNew: true, icon: "▶️", logo: "https://logo.clearbit.com/invideo.ai", url: "https://invideo.ai" },
  // Music
  { name: "Suno", description: "Create full songs with lyrics and music from a text prompt.", category: "Music", pricing: "Freemium", isNew: true, icon: "🎵", logo: "https://logo.clearbit.com/suno.com", url: "https://suno.com" },
  { name: "Udio", description: "Generate original music tracks in any genre from text.", category: "Music", pricing: "Freemium", isNew: true, icon: "🎶", logo: "https://logo.clearbit.com/udio.com", url: "https://udio.com" },
  { name: "Mubert", description: "Royalty-free AI background music for videos and podcasts.", category: "Music", pricing: "Freemium", isNew: false, icon: "🎼", logo: "https://logo.clearbit.com/mubert.com", url: "https://mubert.com" },
  // Research
  { name: "Perplexity AI", description: "AI-powered search engine with cited, real-time answers.", category: "Research", pricing: "Freemium", isNew: false, icon: "🔍", logo: "https://logo.clearbit.com/perplexity.ai", url: "https://perplexity.ai" },
  { name: "Elicit", description: "AI research assistant trained on academic papers.", category: "Research", pricing: "Freemium", isNew: false, icon: "📚", logo: "https://logo.clearbit.com/elicit.com", url: "https://elicit.com" },
  { name: "Consensus", description: "AI search engine for scientific and medical evidence.", category: "Research", pricing: "Freemium", isNew: true, icon: "🔬", logo: "https://logo.clearbit.com/consensus.app", url: "https://consensus.app" },
  { name: "Otter.ai", description: "AI meeting recorder and transcriber with instant summaries.", category: "Research", pricing: "Freemium", isNew: false, icon: "🎙️", logo: "https://logo.clearbit.com/otter.ai", url: "https://otter.ai" },
  // Productivity
  { name: "Notion AI", description: "AI built into Notion for writing, summarizing and organizing.", category: "Productivity", pricing: "Freemium", isNew: false, icon: "🗂️", logo: "https://logo.clearbit.com/notion.so", url: "https://notion.so/product/ai" },
  { name: "Reclaim.ai", description: "AI calendar optimizer that auto-schedules your tasks.", category: "Productivity", pricing: "Freemium", isNew: true, icon: "📅", logo: "https://logo.clearbit.com/reclaim.ai", url: "https://reclaim.ai" },
  { name: "Motion", description: "AI that builds your perfect daily schedule automatically.", category: "Productivity", pricing: "Paid", isNew: false, icon: "⏱️", logo: "https://logo.clearbit.com/usemotion.com", url: "https://usemotion.com" },
  // Marketing
  { name: "Surfer SEO", description: "Data-driven SEO tool to rank higher on Google.", category: "Marketing", pricing: "Paid", isNew: false, icon: "📈", logo: "https://logo.clearbit.com/surferseo.com", url: "https://surferseo.com" },
  { name: "AdCreative.ai", description: "Generate high-converting ad creatives and banners with AI.", category: "Marketing", pricing: "Paid", isNew: true, icon: "📢", logo: "https://logo.clearbit.com/adcreative.ai", url: "https://adcreative.ai" },
  { name: "Buffer", description: "AI-powered social media scheduling and analytics.", category: "Marketing", pricing: "Freemium", isNew: false, icon: "📱", logo: "https://logo.clearbit.com/buffer.com", url: "https://buffer.com" },
  { name: "Mailchimp AI", description: "Email marketing platform with AI content suggestions.", category: "Marketing", pricing: "Freemium", isNew: false, icon: "📧", logo: "https://logo.clearbit.com/mailchimp.com", url: "https://mailchimp.com" },
  // Data Analysis
  { name: "Julius AI", description: "Chat with your data — upload spreadsheets and get instant analysis.", category: "Data Analysis", pricing: "Freemium", isNew: true, icon: "📊", logo: "https://logo.clearbit.com/julius.ai", url: "https://julius.ai" },
  { name: "Akkio", description: "No-code AI analytics for predictions and dashboards.", category: "Data Analysis", pricing: "Freemium", isNew: false, icon: "🔢", logo: "https://logo.clearbit.com/akkio.com", url: "https://akkio.com" },
  // Presentations
  { name: "Gamma", description: "AI presentation builder that generates beautiful decks instantly.", category: "Presentations", pricing: "Freemium", isNew: false, icon: "🖥️", logo: "https://logo.clearbit.com/gamma.app", url: "https://gamma.app" },
  { name: "Beautiful.ai", description: "Smart slide designer that auto-formats as you type.", category: "Presentations", pricing: "Freemium", isNew: false, icon: "✨", logo: "https://logo.clearbit.com/beautiful.ai", url: "https://beautiful.ai" },
  { name: "Tome", description: "AI storytelling format blending slides with narrative text.", category: "Presentations", pricing: "Freemium", isNew: false, icon: "📖", logo: "https://logo.clearbit.com/tome.app", url: "https://tome.app" },
  // Customer Support
  { name: "Intercom AI", description: "AI support agent trained on your docs, resolves queries 24/7.", category: "Customer Support", pricing: "Paid", isNew: false, icon: "💬", logo: "https://logo.clearbit.com/intercom.com", url: "https://intercom.com/fin" },
  { name: "Tidio", description: "AI chatbot for e-commerce that qualifies leads and supports customers.", category: "Customer Support", pricing: "Freemium", isNew: false, icon: "🤝", logo: "https://logo.clearbit.com/tidio.com", url: "https://tidio.com" },
  { name: "Drift", description: "AI chatbot that qualifies leads and books meetings automatically.", category: "Customer Support", pricing: "Freemium", isNew: false, icon: "💼", logo: "https://logo.clearbit.com/drift.com", url: "https://drift.com" },
  { name: "Zendesk AI", description: "AI-powered customer support with smart ticket routing.", category: "Customer Support", pricing: "Paid", isNew: false, icon: "🎫", logo: "https://logo.clearbit.com/zendesk.com", url: "https://zendesk.com" },
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
  { icon: "🔍", step: "2", title: "We match the tools", desc: "Our system finds the best AI tools for your exact use case from 50+ options." },
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
        <div className="max-w-6xl mx-auto flex gap-2 flex-wrap">
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
        <div className="max-w-6xl mx-auto flex gap-2 flex-wrap mt-3 pb-2">
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
              <a
                key={tool.name}
                href={tool.url}
                target="_blank"
                rel="noopener noreferrer"
                className="tool-card relative group bg-white border border-[#e4e6ea] rounded-xl p-4 flex flex-col gap-3 overflow-hidden"
              >
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-lg bg-[#f7f8fa] border border-[#e4e6ea] flex items-center justify-center overflow-hidden">
                    <img
                      src={tool.logo}
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

                <div className="mt-auto">
                  <span className="text-[10px] text-[#1877F2] bg-[#E7F3FF] px-2 py-0.5 rounded-full">
                    {tool.category}
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter signup section */}
      <section className="bg-white px-6 py-16">
        <div className="max-w-xl mx-auto text-center">
          {/* Red accent dot + label */}

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
                <a key={cat} href="/" className="text-xs text-[#65676b] hover:text-[#1877F2] transition-colors">{cat}</a>
              ))}
            </div>
          </div>
          <div className="border-t border-[#e4e6ea] pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#65676b]">
            <p>© {new Date().getFullYear()} HowToUseMyAI. All rights reserved.</p>
            <div className="flex gap-5">
              <a href="#" className="hover:text-[#1877F2] transition-colors">Privacy</a>
              <a href="#" className="hover:text-[#1877F2] transition-colors">Terms</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
