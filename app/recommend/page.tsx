"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import Logo from "../components/Logo";

interface AITool {
  name: string;
  description: string;
  bestFor: string;
  steps: [string, string, string];
  url: string;
  pricing: "Free" | "Freemium" | "Paid";
  category: string;
}

const TOOLS: AITool[] = [
  // Writing
  { name: "ChatGPT", description: "OpenAI's flagship AI — exceptional at drafting, editing, summarising, and brainstorming.", bestFor: "Blog posts, emails, cover letters, creative writing", steps: ["Go to chat.openai.com and create a free account.", "Type your request in plain English.", "Refine by asking it to adjust tone, length, or add specific details."], url: "https://chat.openai.com", pricing: "Freemium", category: "writing" },
  { name: "Claude", description: "Anthropic's AI — praised for nuanced writing and following complex instructions.", bestFor: "Long documents, nuanced writing, research summaries", steps: ["Visit claude.ai and sign in with Google.", "Paste your outline and describe the tone and audience.", "Use follow-up messages to refine sections."], url: "https://claude.ai", pricing: "Freemium", category: "writing" },
  { name: "Jasper", description: "Marketing-focused AI writing platform with templates for ads and long-form content.", bestFor: "Marketing copy, product descriptions, ad creatives", steps: ["Start a free trial at jasper.ai and pick a template.", "Fill in brand voice settings and topic keywords.", "Generate, review, and export content."], url: "https://www.jasper.ai", pricing: "Paid", category: "writing" },
  { name: "Copy.ai", description: "Workflow-driven AI for marketers — generates multiple copy variants for testing.", bestFor: "Ad copy, email sequences, social media captions", steps: ["Create a free account at copy.ai.", "Choose a workflow (e.g. Blog Post Wizard).", "Enter your product/topic and generate multiple variants."], url: "https://www.copy.ai", pricing: "Freemium", category: "writing" },
  { name: "Grammarly", description: "AI writing assistant that checks grammar, style, and tone across every platform.", bestFor: "Emails, documents, professional writing, proofreading", steps: ["Install the Grammarly extension at grammarly.com.", "Write anywhere and see inline suggestions appear automatically.", "Accept fixes and use the tone detector to match your audience."], url: "https://grammarly.com", pricing: "Freemium", category: "writing" },
  { name: "Writesonic", description: "AI writer with 100+ templates for blogs, ads, and social media content.", bestFor: "Bulk content, SEO articles, product descriptions", steps: ["Sign up at writesonic.com and choose a template.", "Enter your topic and target keywords.", "Generate, review, and export your content."], url: "https://writesonic.com", pricing: "Freemium", category: "writing" },

  // Image
  { name: "Midjourney", description: "The gold standard for AI art — stunning stylised images from text prompts.", bestFor: "Concept art, illustrations, editorial imagery, brand visuals", steps: ["Join the Midjourney Discord at midjourney.com and subscribe.", "Type /imagine followed by your detailed prompt.", "Use U (upscale) and V (variation) buttons to refine."], url: "https://www.midjourney.com", pricing: "Paid", category: "image" },
  { name: "DALL-E 3", description: "OpenAI's image model — great for accurate text rendering and prompt fidelity.", bestFor: "Logos, diagrams, social media graphics, realistic scenes", steps: ["Open ChatGPT Plus or visit labs.openai.com.", "Describe your image in detail including style and mood.", "Download or ask it to iterate on the result."], url: "https://labs.openai.com", pricing: "Freemium", category: "image" },
  { name: "Adobe Firefly", description: "Adobe's generative AI — commercially safe, integrated with Photoshop and Illustrator.", bestFor: "Commercial-safe images, product photography, design assets", steps: ["Go to firefly.adobe.com and sign in with a free Adobe ID.", "Enter a prompt and adjust style and colour sliders.", "Open in Photoshop to edit further or download directly."], url: "https://firefly.adobe.com", pricing: "Freemium", category: "image" },
  { name: "Stable Diffusion", description: "Open-source image model — run locally or via hosted UIs with no usage limits.", bestFor: "Custom fine-tuned styles, high-volume generation", steps: ["Use DreamStudio (dreamstudio.ai) for instant access.", "Write a detailed prompt and a negative prompt.", "Adjust steps and CFG scale to dial in your aesthetic."], url: "https://dreamstudio.ai", pricing: "Freemium", category: "image" },
  { name: "Leonardo.ai", description: "Fine-tuned image generation platform for game assets and product design.", bestFor: "Game art, product design, consistent characters", steps: ["Create an account at leonardo.ai and choose a fine-tuned model.", "Write your prompt and set your image dimensions.", "Use Canvas to edit and refine specific areas of your image."], url: "https://leonardo.ai", pricing: "Freemium", category: "image" },

  // Coding
  { name: "GitHub Copilot", description: "AI pair programmer — autocompletes code and suggests functions as you type.", bestFor: "Everyday coding, autocompletion, boilerplate generation", steps: ["Install the GitHub Copilot extension in VS Code.", "Start typing a comment describing what you want.", "Press Tab to accept or cycle through alternatives."], url: "https://github.com/features/copilot", pricing: "Paid", category: "coding" },
  { name: "Cursor", description: "AI-native code editor — understands your entire codebase and edits multiple files at once.", bestFor: "Refactoring, multi-file edits, codebase Q&A", steps: ["Download Cursor at cursor.sh and open your project.", "Press Cmd+K to edit inline, or Cmd+L to chat with your codebase.", "Use @ to reference specific files in your prompt."], url: "https://cursor.sh", pricing: "Freemium", category: "coding" },
  { name: "Replit AI", description: "Browser-based coding environment with built-in AI assistance — no setup required.", bestFor: "Quick prototypes, learning to code, no-setup projects", steps: ["Go to replit.com and create a new Repl.", "Describe what you want to build to the AI assistant.", "Run and share your app instantly from the browser."], url: "https://replit.com", pricing: "Freemium", category: "coding" },
  { name: "Tabnine", description: "AI code completion for all major IDEs — privacy-first and enterprise-ready.", bestFor: "Teams, enterprise coding, privacy-conscious developers", steps: ["Install the Tabnine plugin in your IDE.", "It learns your codebase style automatically over time.", "Get suggestions as you type and accept them with Tab."], url: "https://tabnine.com", pricing: "Freemium", category: "coding" },

  // Video
  { name: "Runway", description: "Professional AI video generation and editing — generate from text or image.", bestFor: "AI-generated video clips, visual effects, video editing", steps: ["Create an account at runwayml.com and open Gen-3 Alpha.", "Write a text prompt describing your scene and camera movement.", "Generate, download, and chain clips in Runway's timeline editor."], url: "https://runwayml.com", pricing: "Freemium", category: "video" },
  { name: "Synthesia", description: "Create AI presenter videos with realistic avatars reading your script.", bestFor: "Training videos, product demos, multilingual content", steps: ["Sign up at synthesia.io and choose an AI avatar.", "Paste your script — the avatar lip-syncs it perfectly.", "Select a background, add slides, and click Generate."], url: "https://www.synthesia.io", pricing: "Paid", category: "video" },
  { name: "HeyGen", description: "AI video at scale — clone your voice and likeness or use stock avatars.", bestFor: "Personalised sales videos, HR onboarding, social content", steps: ["Create a free account at heygen.com.", "Pick an avatar or record 2 min to clone yourself, then type your script.", "Hit Generate — video ready in minutes with auto-captions."], url: "https://www.heygen.com", pricing: "Freemium", category: "video" },
  { name: "Sora", description: "OpenAI's cinematic video model — generates stunning video clips from text prompts.", bestFor: "Cinematic clips, AI B-roll, creative storytelling", steps: ["Access sora.com (ChatGPT Plus required).", "Describe your scene with camera movement, lighting, and style.", "Generate and download the clip or remix it with variations."], url: "https://sora.com", pricing: "Paid", category: "video" },
  { name: "Descript", description: "Edit video by editing the transcript — the most intuitive video editor for creators.", bestFor: "YouTube editing, podcast video, removing filler words", steps: ["Download Descript at descript.com and import your video.", "Edit the auto-generated transcript to cut and rearrange clips.", "Use Overdub to fix audio mistakes by typing new words."], url: "https://www.descript.com", pricing: "Freemium", category: "video" },
  { name: "CapCut AI", description: "Free AI-powered video editor with auto-captions, templates, and effects.", bestFor: "TikTok, YouTube Shorts, Reels, quick social edits", steps: ["Go to capcut.com — it's completely free.", "Import your footage and click Auto Captions for instant subtitles.", "Apply AI effects and transitions, then export in one click."], url: "https://www.capcut.com", pricing: "Free", category: "video" },
  { name: "Invideo AI", description: "Turn a text prompt into a full YouTube-ready video with voiceover and stock footage.", bestFor: "YouTube explainer videos, news-style content", steps: ["Go to invideo.ai and describe your video topic.", "AI generates script, selects stock clips, and adds voiceover.", "Edit any scene in the browser and export in HD."], url: "https://invideo.ai", pricing: "Freemium", category: "video" },
  { name: "Pictory", description: "Convert long articles or scripts into short branded video clips automatically.", bestFor: "Repurposing blog posts, social snippets", steps: ["Go to pictory.ai and paste your script or article URL.", "AI picks relevant stock footage and adds captions automatically.", "Customise branding, music, and voiceover then export."], url: "https://pictory.ai", pricing: "Freemium", category: "video" },

  // Music
  { name: "Suno", description: "Generate complete, radio-quality songs from a text prompt — vocals included.", bestFor: "Original songs, jingles, background music with lyrics", steps: ["Go to suno.com and sign in with Google.", "Click Create and describe your song genre, mood, and theme.", "Generate two variations, pick your favourite, and download."], url: "https://suno.com", pricing: "Freemium", category: "music" },
  { name: "Udio", description: "High-fidelity AI music with fine-grained style controls and seamless track extension.", bestFor: "Instrumental tracks, genre-specific music, compositions", steps: ["Visit udio.com and create a free account.", "Enter a prompt including genre, instruments, and mood.", "Use Extend to make tracks longer or remix sections."], url: "https://www.udio.com", pricing: "Freemium", category: "music" },
  { name: "Mubert", description: "AI-generated royalty-free music for creators — adaptive background tracks.", bestFor: "Royalty-free background music, podcasts, YouTube videos", steps: ["Go to mubert.com/generate and select your use case.", "Set mood, genre, BPM, and duration.", "Generate, preview, and download with a royalty-free licence."], url: "https://mubert.com", pricing: "Freemium", category: "music" },

  // Research
  { name: "Perplexity AI", description: "AI-powered search engine — direct answers to complex questions with cited sources.", bestFor: "Fact-finding, literature reviews, competitive research", steps: ["Go to perplexity.ai — no account required.", "Ask your question; enable Focus: Academic for scholarly sources.", "Click citations to verify, then use Follow-up questions to go deeper."], url: "https://www.perplexity.ai", pricing: "Freemium", category: "research" },
  { name: "Elicit", description: "AI research assistant trained on academic papers — finds and summarises literature.", bestFor: "Academic reviews, evidence synthesis, systematic reviews", steps: ["Visit elicit.com and create a free account.", "Type your research question — Elicit surfaces the most relevant papers.", "Use extraction columns to pull key findings side-by-side."], url: "https://elicit.com", pricing: "Freemium", category: "research" },
  { name: "Consensus", description: "AI search engine that finds answers directly from peer-reviewed scientific papers.", bestFor: "Medical claims, scientific evidence, academic research", steps: ["Go to consensus.app and ask your research question.", "Get answers extracted directly from peer-reviewed papers.", "Filter by study type and export citations."], url: "https://consensus.app", pricing: "Freemium", category: "research" },
  { name: "Otter.ai", description: "AI meeting recorder and transcriber — never miss a word from any meeting.", bestFor: "Meeting notes, interviews, lectures, transcription", steps: ["Go to otter.ai and connect your Google or Zoom calendar.", "Join any meeting — Otter auto-joins and transcribes live.", "Search highlights and share the AI summary after."], url: "https://otter.ai", pricing: "Freemium", category: "research" },

  // Presentations
  { name: "Gamma", description: "AI presentation builder — generates beautiful decks from a prompt in under a minute.", bestFor: "Business presentations, pitch decks, quick visual reports", steps: ["Go to gamma.app and sign in for free.", "Paste your outline or type a topic and let Gamma generate the deck.", "Edit any slide with the AI-assisted editor inline."], url: "https://gamma.app", pricing: "Freemium", category: "presentations" },
  { name: "Beautiful.ai", description: "Smart slide designer that auto-formats content as you type.", bestFor: "Corporate presentations, team decks, polished reports", steps: ["Sign up at beautiful.ai and choose a template.", "Add your content — Smart Slides adjust layouts automatically.", "Share a link or export as PDF/PPTX."], url: "https://www.beautiful.ai", pricing: "Freemium", category: "presentations" },
  { name: "Tome", description: "AI-native storytelling format — blends slides with narrative text and live data.", bestFor: "Investor decks, narrative reports, interactive presentations", steps: ["Visit tome.app and click Generate to create from a prompt.", "Describe your story and audience — Tome structures it for you.", "Add live embeds (Figma, Loom, charts) and share a link."], url: "https://tome.app", pricing: "Freemium", category: "presentations" },

  // Data
  { name: "Julius AI", description: "Upload any dataset and ask questions in plain English — Julius runs the analysis.", bestFor: "Data analysis, CSV exploration, automated charting", steps: ["Go to julius.ai and upload your CSV or Excel file.", "Ask your question in plain English, e.g. 'Show monthly revenue trends.'", "Julius generates and runs the code, displays charts and explains findings."], url: "https://julius.ai", pricing: "Freemium", category: "data" },
  { name: "Akkio", description: "No-code AI analytics platform — build predictive models from spreadsheet data.", bestFor: "Predictive analytics, lead scoring, churn forecasting", steps: ["Create a free account at akkio.com and upload your dataset.", "Select your target column and click Train Model.", "Review accuracy metrics and deploy the model for live predictions."], url: "https://www.akkio.com", pricing: "Freemium", category: "data" },

  // SEO / Marketing
  { name: "Surfer SEO", description: "Data-driven SEO writing assistant — tells you exactly what to include to rank.", bestFor: "SEO-optimised blog posts, content briefs, SERP audits", steps: ["Sign up at surferseo.com and create a new Content Editor.", "Enter your target keyword — Surfer analyses the top 10 results.", "Write content following the score recommendations to optimise."], url: "https://surferseo.com", pricing: "Paid", category: "seo" },
  { name: "AdCreative.ai", description: "Generate high-converting ad creatives and banners with AI.", bestFor: "Facebook ads, Google ads, display advertising", steps: ["Connect your brand at adcreative.ai and upload your logo and colors.", "Describe your product and target audience.", "Generate dozens of ad variants and download the best performers."], url: "https://adcreative.ai", pricing: "Paid", category: "seo" },

  // Productivity
  { name: "Reclaim.ai", description: "AI calendar optimizer that automatically schedules your tasks and habits.", bestFor: "Time management, scheduling, focus blocks", steps: ["Connect your Google Calendar at reclaim.ai.", "Add your tasks and habits with time estimates.", "Reclaim auto-schedules them around your existing meetings."], url: "https://reclaim.ai", pricing: "Freemium", category: "productivity" },
  { name: "Motion", description: "AI that builds your optimal daily schedule automatically from your tasks.", bestFor: "Task management, daily planning, deadline tracking", steps: ["Sign up at usemotion.com and add your tasks and deadlines.", "Motion builds your optimal daily schedule automatically.", "Incomplete tasks are rescheduled to tomorrow automatically."], url: "https://usemotion.com", pricing: "Paid", category: "productivity" },

  // Support
  { name: "Intercom AI", description: "Fin by Intercom — AI support agent trained on your docs, resolves queries 24/7.", bestFor: "Automated customer support, help centre Q&A, ticket deflection", steps: ["Set up Intercom at intercom.com and connect your help centre.", "Enable Fin in Inbox settings — it auto-responds to conversations.", "Review resolutions in the dashboard and add missing answers."], url: "https://www.intercom.com/fin", pricing: "Paid", category: "support" },
  { name: "Tidio", description: "AI chatbot for e-commerce — responds to queries, qualifies leads, escalates to humans.", bestFor: "E-commerce support, lead capture, small business chat", steps: ["Install Tidio at tidio.com by pasting a snippet on your site.", "Enable Lyro AI and connect your FAQ — it learns common questions.", "Set escalation rules so complex queries route to live agents."], url: "https://www.tidio.com", pricing: "Freemium", category: "support" },
];

const CATEGORY_RULES = [
  { keywords: ["write", "writing", "blog", "article", "essay", "email", "letter", "cover letter", "resume", "cv", "content", "copy", "draft", "paragraph", "story", "caption", "post", "grammar", "proofread"], categories: ["writing"] },
  { keywords: ["image", "picture", "photo", "illustration", "draw", "art", "logo", "design", "graphic", "visual", "generate image", "paint", "portrait", "background", "banner"], categories: ["image"] },
  { keywords: ["code", "coding", "program", "programming", "debug", "bug", "script", "develop", "software", "app", "javascript", "python", "react", "api", "sql", "html", "css", "fix my code"], categories: ["coding"] },
  { keywords: ["video", "film", "clip", "animation", "animate", "youtube", "reel", "tiktok", "short", "footage", "avatar video", "talking head", "record", "edit video", "creator", "channel"], categories: ["video"] },
  { keywords: ["music", "song", "audio", "sound", "melody", "beat", "track", "compose", "jingle", "instrumental", "lyrics", "podcast", "background music", "make a song"], categories: ["music"] },
  { keywords: ["research", "find information", "learn about", "summarise", "summarize", "facts", "study", "academic", "paper", "literature", "investigate", "search", "meeting notes", "transcribe"], categories: ["research"] },
  { keywords: ["presentation", "slide", "deck", "powerpoint", "keynote", "pitch", "slideshow", "investor deck"], categories: ["presentations"] },
  { keywords: ["data", "spreadsheet", "excel", "csv", "analyse", "analyze", "chart", "graph", "dashboard", "forecast", "predict", "report", "numbers", "statistics"], categories: ["data"] },
  { keywords: ["seo", "search engine", "rank", "google", "keyword", "traffic", "marketing", "social media", "ads", "advertising", "campaign", "ad creative"], categories: ["seo", "writing"] },
  { keywords: ["customer", "support", "chatbot", "helpdesk", "service", "chat", "respond", "faq"], categories: ["support"] },
  { keywords: ["productivity", "schedule", "calendar", "task", "plan", "time management", "organize", "organise", "to-do", "deadline"], categories: ["productivity"] },
];

function getRecommendations(query: string): AITool[] {
  const lower = query.toLowerCase();
  const categoryScores: Record<string, number> = {};

  for (const rule of CATEGORY_RULES) {
    const matchCount = rule.keywords.filter((kw) => lower.includes(kw)).length;
    if (matchCount > 0) {
      for (const cat of rule.categories) {
        categoryScores[cat] = (categoryScores[cat] ?? 0) + matchCount;
      }
    }
  }

  const topCategories = Object.entries(categoryScores)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([cat]) => cat);

  if (topCategories.length === 0) topCategories.push("writing", "research");

  const seen = new Set<string>();
  const results: AITool[] = [];

  for (const cat of topCategories) {
    for (const tool of TOOLS) {
      if (tool.category === cat && !seen.has(tool.name)) {
        seen.add(tool.name);
        results.push(tool);
      }
    }
  }

  // Fill remaining spots with writing tools if needed
  if (results.length < 6) {
    for (const tool of TOOLS) {
      if (tool.category === "writing" && !seen.has(tool.name)) {
        seen.add(tool.name);
        results.push(tool);
        if (results.length >= 8) break;
      }
    }
  }

  return results.slice(0, 8);
}

const PRICING_BADGE: Record<string, string> = {
  Free: "bg-[#E7F3FF] text-[#1877F2]",
  Freemium: "bg-[#E7F3FF] text-[#1877F2]",
  Paid: "bg-[#fff0f3] text-[#e41e3f]",
};

function RecommendResults() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get("q") ?? "";
  const tools = getRecommendations(query);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Dark navy header — matches home page */}
      <header className="sticky top-0 z-20 bg-[#0a0f1e] border-b border-white/5 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <button onClick={() => router.push("/")} className="flex items-center gap-2.5">
            <Logo size={32} />
            <span className="font-semibold text-white text-base tracking-tight">HowToUseMyAI</span>
          </button>
          <nav className="hidden md:flex items-center gap-7 text-sm">
            <a href="#" onClick={() => router.push("/")} className="text-white/50 hover:text-white transition-colors">Browse</a>
            <a href="/recommend?q=what+is+the+best+AI+tool+for+me" className="text-white/50 hover:text-white transition-colors">Recommend Me</a>
            <a href="/submit" className="text-[#e41e3f] font-medium hover:opacity-80 transition-opacity">+ Submit a Tool</a>
          </nav>
          <button
            onClick={() => router.push("/")}
            className="text-xs text-white/60 hover:text-white font-medium transition-colors border border-white/10 hover:border-white/30 px-3 py-1.5 rounded-lg md:hidden"
          >
            ← Try another
          </button>
        </div>
      </header>

      <main className="flex-1 px-6 py-10 bg-[#f7f8fa]">
        <div className="max-w-5xl mx-auto">
          {/* Query header */}
          <div className="mb-8 bg-white rounded-xl p-6 border border-[#e4e6ea]">
            <p className="text-[10px] font-semibold text-[#1877F2] uppercase tracking-widest mb-2">Results for</p>
            <h1
              className="text-xl font-medium text-[#0a0f1e] leading-snug"
              style={{ fontFamily: "var(--font-playfair), serif", fontStyle: "italic" }}
            >
              &ldquo;{query}&rdquo;
            </h1>
            <p className="text-xs text-[#65676b] mt-2">{tools.length} AI tools matched your request</p>
          </div>

          {/* Tool cards — 2-column on desktop */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tools.map((tool, i) => (
              <div
                key={tool.name}
                className={`tool-card relative bg-white border border-[#e4e6ea] rounded-xl overflow-hidden animate-fade-in-up stagger-${Math.min(i + 1, 5) as 1 | 2 | 3 | 4 | 5} flex flex-col`}
              >
                <div className="p-5 flex-1">
                  {/* Badges row */}
                  <div className="flex items-center gap-2 mb-3">
                    {i === 0 && (
                      <span className="text-[10px] font-semibold bg-[#fff0f3] text-[#e41e3f] px-2 py-0.5 rounded-full uppercase tracking-wide">
                        Top Pick
                      </span>
                    )}
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wide ${PRICING_BADGE[tool.pricing]}`}>
                      {tool.pricing}
                    </span>
                  </div>

                  {/* Tool name & description */}
                  <h2 className="text-base font-semibold text-[#1c1e21] mb-1">{tool.name}</h2>
                  <p className="text-xs text-[#65676b] leading-relaxed mb-3">{tool.description}</p>
                  <p className="text-xs text-[#65676b]">
                    <span className="font-semibold text-[#1c1e21]">Best for:</span> {tool.bestFor}
                  </p>

                  {/* Steps */}
                  <div className="mt-4 pt-4 border-t border-[#f0f2f5]">
                    <p className="text-[10px] font-semibold text-[#65676b] uppercase tracking-wider mb-3">
                      How to get started
                    </p>
                    <ol className="flex flex-col gap-2.5">
                      {tool.steps.map((step, si) => (
                        <li key={si} className="flex gap-2.5 items-start">
                          <span className="flex-shrink-0 w-4 h-4 rounded-full bg-[#E7F3FF] text-[#1877F2] text-[9px] font-bold flex items-center justify-center mt-0.5">
                            {si + 1}
                          </span>
                          <p className="text-xs text-[#65676b] leading-relaxed">{step}</p>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>

                {/* CTA button */}
                <div className="px-5 pb-5">
                  <a
                    href={tool.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 bg-[#1877F2] hover:bg-[#166FE5] text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors"
                  >
                    Open {tool.name} →
                  </a>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={() => router.push("/")}
              className="text-xs text-[#1877F2] hover:text-[#166FE5] border border-[#1877F2]/20 hover:border-[#1877F2]/40 px-5 py-2.5 rounded-lg transition-colors font-medium"
            >
              ← Search for something else
            </button>
          </div>
        </div>
      </main>

      {/* Dark navy footer — matches home page */}
      <footer className="bg-[#0a0f1e] border-t border-white/5 px-6 py-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/30">
          <div className="flex items-center gap-2">
            <Logo size={20} />
            <span className="font-medium text-white/60">HowToUseMyAI</span>
          </div>
          <p>© {new Date().getFullYear()} HowToUseMyAI. All rights reserved.</p>
          <div className="flex gap-5">
            <a href="#" className="hover:text-white/60 transition-colors">Privacy</a>
            <a href="#" className="hover:text-white/60 transition-colors">Terms</a>
            <a href="/submit" className="hover:text-white/60 transition-colors">Submit a Tool</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function RecommendPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#f7f8fa] flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-[#1877F2] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs text-[#65676b]">Finding the best AI tools...</p>
          </div>
        </div>
      }
    >
      <RecommendResults />
    </Suspense>
  );
}
