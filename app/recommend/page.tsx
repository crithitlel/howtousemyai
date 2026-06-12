"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import Logo from "../components/Logo";
import { TOOLS as ALL_TOOLS, slugify, type Tool } from "@/lib/tools";
import { getToolUrl } from "@/lib/affiliates";

// Step-by-step detail data for top tools
const TOOL_DETAILS: Record<string, { bestFor: string; steps: [string, string, string] }> = {
  "ChatGPT": { bestFor: "Blog posts, emails, cover letters, creative writing", steps: ["Go to chatgpt.com and create a free account.", "Type your request in plain English, be specific about tone and length.", "Refine by asking it to adjust, expand, or rewrite until you're happy."] },
  "Claude": { bestFor: "Long documents, nuanced writing, research summaries", steps: ["Visit claude.ai and sign in with Google.", "Paste your outline or context and describe your tone and audience.", "Use follow-up messages to refine individual sections."] },
  "Jasper": { bestFor: "Marketing copy, product descriptions, ad creatives", steps: ["Start a free trial at jasper.ai and pick a template.", "Fill in brand voice settings and topic keywords.", "Generate, review, and export content."] },
  "Copy.ai": { bestFor: "Ad copy, email sequences, social media captions", steps: ["Create a free account at copy.ai.", "Choose a workflow (e.g. Blog Post Wizard).", "Enter your product/topic and generate multiple variants."] },
  "Grammarly": { bestFor: "Emails, documents, professional writing, proofreading", steps: ["Install the Grammarly extension at grammarly.com.", "Write anywhere and see inline suggestions appear automatically.", "Accept fixes and use the tone detector to match your audience."] },
  "Writesonic": { bestFor: "Bulk content, SEO articles, product descriptions", steps: ["Sign up at writesonic.com and choose a template.", "Enter your topic and target keywords.", "Generate, review, and export your content directly."] },
  "Midjourney": { bestFor: "Concept art, illustrations, editorial imagery, brand visuals", steps: ["Join the Midjourney Discord at midjourney.com and subscribe.", "Type /imagine followed by your detailed prompt.", "Use U (upscale) and V (variation) buttons to refine."] },
  "DALL-E 3": { bestFor: "Logos, diagrams, social media graphics, realistic scenes", steps: ["Open ChatGPT at chatgpt.com (free account works).", "Type 'Create an image of...' and describe your scene in detail.", "Download or ask ChatGPT to iterate with specific changes."] },
  "Adobe Firefly": { bestFor: "Commercial-safe images, product photography, design assets", steps: ["Go to firefly.adobe.com and sign in with a free Adobe ID.", "Enter a prompt and adjust style and colour sliders.", "Open in Photoshop to edit further or download directly."] },
  "Stable Diffusion": { bestFor: "Custom fine-tuned styles, high-volume generation", steps: ["Go to stability.ai/stable-image for hosted access.", "Write a detailed prompt and a negative prompt.", "Adjust steps and CFG scale to dial in your aesthetic."] },
  "Leonardo.ai": { bestFor: "Game art, product design, consistent characters", steps: ["Create an account at leonardo.ai and choose a fine-tuned model.", "Write your prompt and set your image dimensions.", "Use Canvas to edit and refine specific areas of your image."] },
  "GitHub Copilot": { bestFor: "Everyday coding, autocompletion, boilerplate generation", steps: ["Install the GitHub Copilot extension in VS Code.", "Start typing a comment describing what you want.", "Press Tab to accept or cycle through alternatives."] },
  "Cursor": { bestFor: "Refactoring, multi-file edits, codebase Q&A", steps: ["Download Cursor at cursor.com and open your project.", "Press Cmd+K to edit inline, or Cmd+L to chat with your codebase.", "Use @ to reference specific files in your prompt."] },
  "Replit AI": { bestFor: "Quick prototypes, learning to code, no-setup projects", steps: ["Go to replit.com and create a new Repl.", "Describe what you want to build to the AI assistant.", "Run and share your app instantly from the browser."] },
  "Tabnine": { bestFor: "Teams, enterprise coding, privacy-conscious developers", steps: ["Install the Tabnine plugin in your IDE.", "It learns your codebase style automatically over time.", "Get suggestions as you type and accept them with Tab."] },
  "Runway": { bestFor: "AI-generated video clips, visual effects, video editing", steps: ["Create an account at runwayml.com and open Gen-3 Alpha.", "Write a text prompt describing your scene and camera movement.", "Generate, download, and chain clips in Runway's timeline editor."] },
  "Synthesia": { bestFor: "Training videos, product demos, multilingual content", steps: ["Sign up at synthesia.io and choose an AI avatar.", "Paste your script, the avatar lip-syncs it perfectly.", "Select a background, add slides, and click Generate."] },
  "HeyGen": { bestFor: "Personalised sales videos, HR onboarding, social content", steps: ["Create a free account at heygen.com.", "Pick an avatar or record 2 min to clone yourself, then type your script.", "Hit Generate, video ready in minutes with auto-captions."] },
  "Sora": { bestFor: "Cinematic clips, AI B-roll, creative storytelling", steps: ["Access openai.com/sora (ChatGPT Plus required).", "Describe your scene with camera movement, lighting, and style.", "Generate and download the clip or remix it with variations."] },
  "Descript": { bestFor: "YouTube editing, podcast video, removing filler words", steps: ["Download Descript at descript.com and import your video.", "Edit the auto-generated transcript to cut and rearrange clips.", "Use Overdub to fix audio mistakes by typing new words."] },
  "CapCut AI": { bestFor: "TikTok, YouTube Shorts, Reels, quick social edits", steps: ["Go to capcut.com, it's completely free.", "Import your footage and click Auto Captions for instant subtitles.", "Apply AI effects and transitions, then export in one click."] },
  "Invideo AI": { bestFor: "YouTube explainer videos, news-style content", steps: ["Go to invideo.ai and describe your video topic.", "AI generates script, selects stock clips, and adds voiceover.", "Edit any scene in the browser and export in HD."] },
  "Pika Labs": { bestFor: "Short cinematic clips, animating images, creative effects", steps: ["Go to pika.art and create a free account.", "Type a text prompt or upload an image to animate.", "Generate and download your clip or apply Pikaffects."] },
  "Suno": { bestFor: "Original songs, jingles, background music with lyrics", steps: ["Go to suno.com and sign in with Google.", "Click Create and describe your song genre, mood, and theme.", "Generate two variations, pick your favourite, and download."] },
  "Udio": { bestFor: "Instrumental tracks, genre-specific music, compositions", steps: ["Visit udio.com and create a free account.", "Enter a prompt including genre, instruments, and mood.", "Use Extend to make tracks longer or remix sections."] },
  "Mubert": { bestFor: "Royalty-free background music, podcasts, YouTube videos", steps: ["Go to mubert.com/generate and select your use case.", "Set mood, genre, BPM, and duration.", "Generate, preview, and download with a royalty-free licence."] },
  "Perplexity AI": { bestFor: "Fact-finding, literature reviews, competitive research", steps: ["Go to perplexity.ai, no account required.", "Ask your question; enable Focus: Academic for scholarly sources.", "Click citations to verify, then use Follow-up questions to go deeper."] },
  "Elicit": { bestFor: "Academic reviews, evidence synthesis, systematic reviews", steps: ["Visit elicit.com and create a free account.", "Type your research question, Elicit surfaces the most relevant papers.", "Use extraction columns to pull key findings side-by-side."] },
  "Consensus": { bestFor: "Medical claims, scientific evidence, academic research", steps: ["Go to consensus.app and ask your research question.", "Get answers extracted directly from peer-reviewed papers.", "Filter by study type and export citations."] },
  "Otter.ai": { bestFor: "Meeting notes, interviews, lectures, transcription", steps: ["Go to otter.ai and connect your Google or Zoom calendar.", "Join any meeting, Otter auto-joins and transcribes live.", "Search highlights and share the AI summary after."] },
  "Gamma": { bestFor: "Business presentations, pitch decks, quick visual reports", steps: ["Go to gamma.app and sign in for free.", "Paste your outline or type a topic and let Gamma generate the deck.", "Edit any slide with the AI-assisted editor inline."] },
  "Beautiful.ai": { bestFor: "Corporate presentations, team decks, polished reports", steps: ["Sign up at beautiful.ai and choose a template.", "Add your content, Smart Slides adjust layouts automatically.", "Share a link or export as PDF/PPTX."] },
  "Julius AI": { bestFor: "Data analysis, CSV exploration, automated charting", steps: ["Go to julius.ai and upload your CSV or Excel file.", "Ask your question in plain English, e.g. 'Show monthly revenue trends.'", "Julius generates and runs the code, displays charts and explains findings."] },
  "Surfer SEO": { bestFor: "SEO-optimised blog posts, content briefs, SERP audits", steps: ["Sign up at surferseo.com and create a new Content Editor.", "Enter your target keyword, Surfer analyses the top 10 results.", "Write content following the score recommendations to optimise."] },
  "AdCreative.ai": { bestFor: "Facebook ads, Google ads, display advertising", steps: ["Connect your brand at adcreative.ai and upload your logo and colors.", "Describe your product and target audience.", "Generate dozens of ad variants and download the best performers."] },
  "Reclaim.ai": { bestFor: "Time management, scheduling, focus blocks", steps: ["Connect your Google Calendar at reclaim.ai.", "Add your tasks and habits with time estimates.", "Reclaim auto-schedules them around your existing meetings."] },
  "Motion": { bestFor: "Task management, daily planning, deadline tracking", steps: ["Sign up at usemotion.com and add your tasks and deadlines.", "Motion builds your optimal daily schedule automatically.", "Incomplete tasks are rescheduled to tomorrow automatically."] },
  "Intercom AI": { bestFor: "Automated customer support, help centre Q&A, ticket deflection", steps: ["Set up Intercom at intercom.com and connect your help centre.", "Enable Fin in Inbox settings, it auto-responds to conversations.", "Review resolutions in the dashboard and add missing answers."] },
  "Tidio": { bestFor: "E-commerce support, lead capture, small business chat", steps: ["Install Tidio at tidio.com by pasting a snippet on your site.", "Enable Lyro AI and connect your FAQ, it learns common questions.", "Set escalation rules so complex queries route to live agents."] },
};

// Normalize lib/tools.ts category names to engine category keys
function normCat(cat: string): string {
  const map: Record<string, string> = {
    "Writing": "writing", "Images": "image", "Design": "image",
    "Coding": "coding", "Video": "video", "Music": "music",
    "Research": "research", "Productivity": "productivity",
    "Marketing": "seo", "Analytics": "data",
    "Presentations": "presentations", "Support": "support",
    "HR": "hr", "Finance": "finance",
  };
  return map[cat] ?? cat.toLowerCase();
}

// ---- Recommendation engine ----

function normalize(s: string): string {
  return s.toLowerCase().replace(/[^\w\s]/g, " ").replace(/\s+/g, " ").trim();
}

function stem(word: string): string {
  return word
    .replace(/ing$/, "").replace(/ings$/, "").replace(/tion$/, "")
    .replace(/tions$/, "").replace(/ers?$/, "").replace(/ies$/, "y").replace(/s$/, "");
}

function tokenize(s: string): string[] {
  return normalize(s).split(" ").filter(Boolean).map(stem);
}

const ACTION_INTENT_MAP: Array<{ actions: string[]; categories: string[]; weight: number }> = [
  { actions: ["write", "draft", "writ", "proofread", "edit", "rewrite", "rewrit"], categories: ["writing"], weight: 2 },
  { actions: ["draw", "design", "generat", "creat", "paint", "illustrat", "make"], categories: ["image"], weight: 1 },
  { actions: ["code", "program", "debug", "build", "develop", "fix", "script"], categories: ["coding"], weight: 2 },
  { actions: ["film", "record", "animat", "produc"], categories: ["video"], weight: 2 },
  { actions: ["compos", "generat", "creat", "make"], categories: ["music"], weight: 1 },
  { actions: ["research", "find", "summaris", "summariz", "translat", "analys", "analyz", "transcrib"], categories: ["research"], weight: 2 },
  { actions: ["present", "pitch", "creat", "build", "make"], categories: ["presentations"], weight: 1 },
  { actions: ["analys", "analyz", "visualis", "visualiz", "forecast", "predict", "chart"], categories: ["data"], weight: 2 },
  { actions: ["rank", "optimis", "optimiz", "market", "advertis", "promot"], categories: ["seo"], weight: 2 },
  { actions: ["schedul", "organis", "organiz", "plan", "manag"], categories: ["productivity"], weight: 2 },
  { actions: ["automat", "respond", "support"], categories: ["support"], weight: 2 },
];

const INTENT_MAP: Array<{ phrases: string[]; categories: string[]; weight: number }> = [
  { phrases: ["blog post", "blog article", "write a", "write an", "draft a", "draft an", "cover letter", "email", "essay", "proofread", "grammar check", "caption"], categories: ["writing"], weight: 3 },
  { phrases: ["logo", "icon", "banner", "poster", "illustration", "artwork", "generate image", "create image", "make image", "make a logo", "design a", "visual", "graphic design", "product photo", "hero image"], categories: ["image"], weight: 3 },
  { phrases: ["fix my code", "write code", "build an app", "build a website", "debug", "autocompletion", "boilerplate", "refactor", "write a script", "write a function"], categories: ["coding"], weight: 3 },
  { phrases: ["edit video", "edit a video", "make a video", "create a video", "youtube video", "tiktok video", "short video", "reels", "add captions", "add subtitles", "ai avatar", "talking head", "video voiceover"], categories: ["video"], weight: 3 },
  { phrases: ["podcast", "edit audio", "edit podcast", "record podcast", "transcribe audio", "transcribe podcast", "background music", "make a song", "write a song", "create music", "generate music", "jingle", "royalty free music", "royalty-free music", "soundtrack"], categories: ["music"], weight: 3 },
  { phrases: ["transcribe", "transcription", "meeting notes", "meeting transcript", "record meeting"], categories: ["research"], weight: 3 },
  { phrases: ["research", "find information", "literature review", "academic paper", "scientific evidence", "fact check", "summarize article", "summarise article"], categories: ["research"], weight: 3 },
  { phrases: ["presentation", "slide deck", "pitch deck", "powerpoint", "keynote", "slideshow", "investor deck"], categories: ["presentations"], weight: 3 },
  { phrases: ["analyze data", "analyse data", "upload dataset", "csv analysis", "excel analysis", "data chart", "data visualization", "predictive model", "forecast", "spreadsheet analysis"], categories: ["data"], weight: 3 },
  { phrases: ["seo", "rank on google", "ad creative", "facebook ad", "google ad", "content brief", "keyword research", "social media marketing"], categories: ["seo"], weight: 3 },
  { phrases: ["manage my calendar", "schedule tasks", "time management", "focus blocks", "to-do", "daily plan", "task manager"], categories: ["productivity"], weight: 3 },
  { phrases: ["customer support", "chatbot", "help desk", "helpdesk", "faq bot", "support agent", "live chat"], categories: ["support"], weight: 3 },
];

const CATEGORY_KEYWORDS: Array<{ keywords: string[]; categories: string[]; weight: number }> = [
  { keywords: ["blog", "article", "essay", "letter", "email", "resume", "cv", "story", "caption", "post", "copy", "content", "grammar", "paragraph", "newsletter", "report"], categories: ["writing"], weight: 2 },
  { keywords: ["image", "picture", "photo", "illustration", "art", "logo", "design", "graphic", "visual", "portrait", "background", "banner", "icon", "branding", "concept art"], categories: ["image"], weight: 2 },
  { keywords: ["code", "coding", "program", "programming", "bug", "script", "software", "app", "javascript", "python", "react", "api", "sql", "html", "css", "function", "repository"], categories: ["coding"], weight: 2 },
  { keywords: ["video", "film", "clip", "animation", "youtube", "reel", "tiktok", "short", "footage", "caption", "subtitle", "channel", "vlog", "creator"], categories: ["video"], weight: 2 },
  { keywords: ["music", "song", "audio", "sound", "melody", "beat", "track", "jingle", "instrumental", "lyric", "podcast", "episode", "recording", "voice", "voiceover"], categories: ["music"], weight: 2 },
  { keywords: ["research", "information", "fact", "study", "academic", "paper", "literature", "source", "citation", "evidence", "meeting", "transcript", "note"], categories: ["research"], weight: 2 },
  { keywords: ["presentation", "slide", "deck", "powerpoint", "keynote", "pitch", "slideshow", "investor"], categories: ["presentations"], weight: 2 },
  { keywords: ["data", "spreadsheet", "excel", "csv", "chart", "graph", "dashboard", "forecast", "statistic", "number", "metric", "dataset"], categories: ["data"], weight: 2 },
  { keywords: ["seo", "search engine", "ranking", "google", "keyword", "traffic", "marketing", "ad", "advertising", "campaign", "social media", "brand"], categories: ["seo"], weight: 2 },
  { keywords: ["customer", "support", "chatbot", "helpdesk", "service", "faq", "ticket"], categories: ["support"], weight: 2 },
  { keywords: ["productivity", "schedule", "calendar", "task", "plan", "habit", "deadline", "focus", "time"], categories: ["productivity"], weight: 2 },
];

function getRecommendations(query: string): Tool[] {
  const lower = normalize(query);
  const tokens = tokenize(query);
  const categoryScores: Record<string, number> = {};

  function addScore(cats: string[], amount: number) {
    for (const cat of cats) categoryScores[cat] = (categoryScores[cat] ?? 0) + amount;
  }

  for (const rule of INTENT_MAP) {
    for (const phrase of rule.phrases) {
      if (lower.includes(phrase)) addScore(rule.categories, rule.weight);
    }
  }

  for (const rule of ACTION_INTENT_MAP) {
    const matched = rule.actions.filter((a) => tokens.some((t) => t === a || t.startsWith(a)));
    if (matched.length > 0) addScore(rule.categories, rule.weight * matched.length);
  }

  for (const rule of CATEGORY_KEYWORDS) {
    const stemmedKws = rule.keywords.map(stem);
    const matchCount = stemmedKws.filter((kw) => tokens.some((t) => t === kw || t.startsWith(kw) || kw.startsWith(t))).length;
    if (matchCount > 0) addScore(rule.categories, rule.weight * matchCount);
  }

  const toolScores = ALL_TOOLS.map((tool) => {
    const catScore = categoryScores[normCat(tool.category)] ?? 0;
    const toolText = normalize(`${tool.name} ${tool.description}`);
    const toolTokens = tokenize(`${tool.name} ${tool.description}`);

    let directBonus = 0;
    if (toolText.includes(lower)) directBonus += 5;

    const overlapCount = tokens.filter((t) =>
      t.length > 2 && toolTokens.some((tt) => tt === t || tt.startsWith(t) || t.startsWith(tt))
    ).length;
    directBonus += overlapCount * 0.5;

    // Boost featured tools slightly
    if (tool.isFeatured) directBonus += 0.5;

    return { tool, score: catScore + directBonus };
  });

  toolScores.sort((a, b) => b.score - a.score);

  const hasAnyScore = toolScores.some((ts) => ts.score > 0);
  if (!hasAnyScore) {
    return ALL_TOOLS.filter((t) => t.category === "Writing" || t.category === "Research").slice(0, 8);
  }

  const results = toolScores.filter((ts) => ts.score > 0).slice(0, 8).map((ts) => ts.tool);

  if (results.length < 4) {
    const seen = new Set(results.map((t) => t.name));
    for (const tool of ALL_TOOLS) {
      if (tool.category === "Writing" && !seen.has(tool.name)) {
        results.push(tool);
        seen.add(tool.name);
        if (results.length >= 8) break;
      }
    }
  }

  return results.slice(0, 8);
}

const PRICING_BADGE: Record<string, string> = {
  Free: "bg-[#142a4d] text-[#1877F2]",
  Freemium: "bg-[#142a4d] text-[#1877F2]",
  Paid: "bg-[#3a1524] text-[#ff6b85]",
};

function RecommendResults() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get("q") ?? "";
  const tools = getRecommendations(query);

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-30 bg-[#0a0f1e]/85 backdrop-blur border-b border-[#233150] px-6 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <a href="/" className="flex items-center gap-2 flex-shrink-0">
            <Logo size={24} />
            <span className="brand-mark">HowToUseMy<span className="brand-ai">AI</span></span>
          </a>
          <button
            onClick={() => router.push("/")}
            className="text-xs text-[#93a4c3] hover:text-[#1877F2] font-medium transition-colors whitespace-nowrap"
          >
            ← Try another
          </button>
        </div>
      </header>

      <main className="flex-1 px-6 py-10 bg-[#0d1729]">
        <div className="max-w-5xl mx-auto">
          {/* Query header */}
          <div className="mb-8 bg-[#101b32] rounded-xl p-6 border border-[#233150]">
            <p className="text-[10px] font-semibold text-[#1877F2] uppercase tracking-widest mb-2">Results for</p>
            <h1
              className="text-xl font-medium text-[#e9eef8] leading-snug"
              style={{ fontFamily: "var(--font-playfair), serif" }}
            >
              &ldquo;{query}&rdquo;
            </h1>
            <p className="text-xs text-[#93a4c3] mt-2">{tools.length} AI tools matched your request</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tools.map((tool, i) => {
              const hasGuide = Boolean(TOOL_DETAILS[tool.name]);
              const details = TOOL_DETAILS[tool.name] ?? {
                bestFor: tool.description.replace(/\.$/, "").toLowerCase(),
                steps: [
                  `Go to ${tool.domain} and create a free account.`,
                  `Start with a simple task to learn how ${tool.name} works.`,
                  `Explore the settings and upgrade only if you hit the free plan limits.`,
                ],
              };
              const toolSlug = slugify(tool.name);
              return (
                <a
                  key={tool.name}
                  href={`/tools/${toolSlug}`}
                  className={`tool-card relative bg-[#101b32] border border-[#233150] rounded-xl overflow-hidden animate-fade-in-up stagger-${Math.min(i + 1, 5) as 1 | 2 | 3 | 4 | 5} flex flex-col hover:border-[#1877F2] hover:shadow-md transition-all`}
                >
                  <div className="p-5 flex-1">
                    {/* Logo + Badges row */}
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-9 h-9 rounded-lg bg-[#0d1729] border border-[#233150] flex items-center justify-center overflow-hidden flex-shrink-0">
                        <img
                          src={`https://www.google.com/s2/favicons?domain=${tool.domain}&sz=64`}
                          alt={tool.name}
                          width={24}
                          height={24}
                          className="rounded object-contain"
                          onError={(e) => {
                            const el = e.currentTarget;
                            el.style.display = "none";
                            if (el.nextElementSibling) (el.nextElementSibling as HTMLElement).style.display = "flex";
                          }}
                        />
                        <span className="text-lg hidden items-center justify-center w-full h-full">{tool.icon}</span>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        {i === 0 && (
                          <span className="text-[10px] font-semibold bg-[#3a1524] text-[#ff6b85] px-2 py-0.5 rounded-full uppercase tracking-wide">
                            Top Pick
                          </span>
                        )}
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wide ${PRICING_BADGE[tool.pricing]}`}>
                          {tool.pricing}
                        </span>
                        {tool.isNew && (
                          <span className="text-[10px] font-semibold bg-[#3a1524] text-[#ff6b85] px-2 py-0.5 rounded-full uppercase tracking-wide">New</span>
                        )}
                      </div>
                    </div>

                    {/* Tool name & description */}
                    <h2 className="text-base font-semibold text-[#e9eef8] mb-1">{tool.name}</h2>
                    <p className="text-xs text-[#93a4c3] leading-relaxed mb-3">{tool.description}</p>

                    {details && (
                      <p className="text-xs text-[#93a4c3]">
                        <span className="font-semibold text-[#e9eef8]">Best for:</span> {details.bestFor}
                      </p>
                    )}

                    {/* Steps — only for detailed tools */}
                    {details && (
                      <div className="mt-4 pt-4 border-t border-[#1b2742]">
                        <p className="tech-label !text-[10px] mb-3">
                          How to get started
                        </p>
                        <ol className="flex flex-col gap-2.5">
                          {details.steps.map((step, si) => (
                            <li key={si} className="flex gap-2.5 items-start">
                              <span className="flex-shrink-0 w-4 h-4 rounded-full bg-[#142a4d] text-[#1877F2] text-[9px] font-bold flex items-center justify-center mt-0.5">
                                {si + 1}
                              </span>
                              <p className="text-xs text-[#93a4c3] leading-relaxed">{step}</p>
                            </li>
                          ))}
                        </ol>
                      </div>
                    )}
                  </div>

                  {/* CTA */}
                  <div className="px-5 pb-5 flex gap-2">
                    <span
                      onClick={(e) => { e.preventDefault(); window.open(getToolUrl(tool.name, tool.url), "_blank", "noopener,noreferrer"); }}
                      className="flex-1 flex items-center justify-center gap-1 bg-[#1877F2] hover:bg-[#166FE5] text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors cursor-pointer"
                    >
                      Open {tool.name}
                    </span>
                    {!hasGuide && (
                      <span className="flex items-center justify-center text-xs font-medium text-[#1877F2] border border-[#1877F2]/20 hover:border-[#1877F2]/50 px-3 py-2.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap">
                        Full guide
                      </span>
                    )}
                  </div>
                </a>
              );
            })}
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

      <footer className="border-t border-[#233150] px-6 py-4 bg-[#101b32]">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#93a4c3]">
          <div className="flex items-center gap-2">
            <Logo size={18} />
            <span className="font-medium text-[#1877F2]">HowToUseMyAI</span>
          </div>
          <p>© {new Date().getFullYear()} HowToUseMyAI</p>
          <div className="flex gap-5">
            <a href="/" className="hover:text-[#1877F2] transition-colors">Home</a>
            <a href="/submit" className="hover:text-[#1877F2] transition-colors">Submit a Tool</a>
            <a href="/privacy" className="hover:text-[#1877F2] transition-colors">Privacy</a>
            <a href="/terms" className="hover:text-[#1877F2] transition-colors">Terms</a>
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
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-[#1877F2] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs text-[#93a4c3]">Finding the best AI tools...</p>
          </div>
        </div>
      }
    >
      <RecommendResults />
    </Suspense>
  );
}
