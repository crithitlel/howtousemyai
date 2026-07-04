import { notFound } from "next/navigation";
import Link from "next/link";
import SiteHeader from "../../components/SiteHeader";
import SiteFooter from "../../components/SiteFooter";
import NewsletterSignup from "../../components/NewsletterSignup";
import { TOOLS, slugify } from "@/lib/tools";
import { AFFILIATE_LINKS } from "@/lib/affiliates";

// Canonical profile slugs (lib/tools.ts is the source of truth). A best-ai-for
// tool only gets an internal /tools/[slug] link when its slug exists here.
const LIB_SLUGS = new Set(TOOLS.map((t) => slugify(t.name)));

// Build the outbound URL: affiliate link if configured (params preserved),
// else the direct URL — then append best-ai-for UTM tracking without clobbering
// any existing query string / affiliate params.
function outboundUrl(toolName: string, directUrl: string, campaign: string): string {
  const affiliate = AFFILIATE_LINKS[toolName];
  const base = affiliate && affiliate.trim() !== "" ? affiliate : directUrl;
  const sep = base.includes("?") ? "&" : "?";
  return `${base}${sep}utm_source=howtousemyai&utm_medium=best-ai-for&utm_campaign=${encodeURIComponent(campaign)}`;
}

const USE_CASES: Record<string, {
  title: string;
  description: string;
  intro?: string;
  howToChoose?: string[];
  faqs?: { q: string; a: string }[];
  tools: { name: string; domain: string; url: string; description: string; pricing: string; why: string }[];
}> = {
  "writing": {
    title: "Best AI Tools for Writing",
    description: "The top AI writing tools to help you write faster, better, and smarter. From blog posts to marketing copy.",
    intro: "AI writing tools have split into clear lanes: general assistants that draft anything, marketing platforms tuned for conversion, and focused editors that polish what you already wrote. The right pick depends on whether you're generating from scratch, scaling branded content, or tightening a final draft. Below is our ranked shortlist with the job each one wins.",
    howToChoose: [
      "Match the tool to the task: general drafting (ChatGPT), on-brand marketing copy (Jasper), or grammar and clarity (Grammarly) are different jobs.",
      "Check for a free tier if you write occasionally — several here let you start at no cost and only upgrade when volume grows.",
      "For SEO blog work, prioritize tools with built-in optimization (Writesonic) over pure generators.",
      "Whatever you choose, edit the output for your voice — AI draughts read generic until a human tightens them.",
    ],
    faqs: [
      { q: "What is the best AI tool for writing?", a: "ChatGPT is the best all-around pick for drafting and editing almost anything. For marketing teams, Jasper's templates and brand voice win; for pure editing, Grammarly is strongest." },
      { q: "Is there a free AI writing tool?", a: "Yes — ChatGPT, Copy.ai, Grammarly, and Writesonic all offer free plans. They're enough for light use; paid tiers add volume, advanced models, and commercial features." },
      { q: "Which AI is best for SEO blog posts?", a: "Writesonic is built for long-form SEO content with optimization features, while ChatGPT is a strong, flexible general-purpose option when paired with your own keyword research." },
    ],
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
    description: "Create, edit, and produce professional videos with AI, no camera or editing experience needed.",
    intro: "AI video tools fall into two camps: avatar/presenter platforms that turn a script into a talking-head video, and creative generators that produce footage from text or repurpose existing content. Which you need depends on whether you're making training videos, social clips, or original visual scenes. Here's the ranked shortlist by job.",
    howToChoose: [
      "Decide between an AI presenter (HeyGen, Synthesia) and creative/text-to-video generation (Runway) — they solve very different problems.",
      "For podcasts and interviews, a transcript-based editor (Descript) is far faster than a traditional timeline.",
      "Repurposing blog posts into clips? Prioritize tools built for that (Pictory, Lumen5) over general editors.",
      "Watch export limits and watermarks on free tiers — they often gate resolution and length.",
    ],
    faqs: [
      { q: "What is the best AI video tool?", a: "It depends on the job: HeyGen and Synthesia lead for AI-avatar presenter videos, Runway for creative text-to-video, and Descript for editing podcasts and interviews by editing text." },
      { q: "Can I make AI videos for free?", a: "Yes — HeyGen, Runway, Descript, and Lumen5 have free tiers, though they limit minutes and add watermarks. Paid plans unlock full length and clean exports." },
      { q: "What is the easiest AI video editor?", a: "Descript is widely considered the easiest — you edit video by editing the transcript, so cutting words removes footage without touching a timeline." },
    ],
    tools: [
      { name: "HeyGen", domain: "heygen.com", url: "https://heygen.com", pricing: "Freemium", description: "Create AI avatar videos with realistic lip-sync in 100+ languages.", why: "Best for AI avatar videos" },
      { name: "Synthesia", domain: "synthesia.io", url: "https://synthesia.io", pricing: "Paid", description: "Professional AI video platform used by 50,000+ companies worldwide.", why: "Best for corporate training videos" },
      { name: "Runway", domain: "runwayml.com", url: "https://runwayml.com", pricing: "Freemium", description: "AI video generation and editing with text-to-video capabilities.", why: "Best for creative video generation" },
      { name: "Descript", domain: "descript.com", url: "https://descript.com", pricing: "Freemium", description: "Edit video by editing text, the easiest video editor ever made.", why: "Best for podcast & interview videos" },
      { name: "Pictory", domain: "pictory.ai", url: "https://pictory.ai", pricing: "Paid", description: "Turn blog posts and scripts into short videos automatically.", why: "Best for repurposing content" },
      { name: "Lumen5", domain: "lumen5.com", url: "https://lumen5.com", pricing: "Freemium", description: "Transform articles into engaging social media videos with AI.", why: "Best for social media videos" },
    ],
  },
  "image-generation": {
    title: "Best AI Tools for Image Generation",
    description: "Generate stunning, unique images from text descriptions. From art to product photos, no design skills needed.",
    intro: "AI image generators now range from artistic powerhouses to text-accurate and commercially-safe options. The best choice hinges on what you're making — striking art, images with readable text, product assets, or work you can legally sell. Our ranked shortlist maps each tool to its strength.",
    howToChoose: [
      "For pure visual quality and art, Midjourney leads; for prompt accuracy, DALL-E 3 follows instructions most literally.",
      "Need commercial rights with no legal worry? Adobe Firefly is trained on licensed content.",
      "If your image needs legible text (logos, posters), Ideogram handles typography far better than most.",
      "Want unlimited free generation? Stable Diffusion is open-source with no usage caps.",
    ],
    faqs: [
      { q: "What is the best AI image generator?", a: "Midjourney produces the most visually stunning results overall. DALL-E 3 is best for following prompts exactly, and Adobe Firefly is best when you need commercially-safe images." },
      { q: "Is there a free AI image generator?", a: "Yes — Stable Diffusion is free and open-source, and DALL-E 3, Leonardo.ai, and Ideogram offer free credits. Midjourney is paid-only." },
      { q: "Which AI can put text in images?", a: "Ideogram is purpose-built to render readable text in images, making it the best pick for posters, logos, and social graphics with words." },
    ],
    tools: [
      { name: "Midjourney", domain: "midjourney.com", url: "https://midjourney.com", pricing: "Paid", description: "The gold standard for AI art,produces the most visually stunning results.", why: "Best image quality" },
      { name: "DALL-E 3", domain: "openai.com", url: "https://chatgpt.com", pricing: "Freemium", description: "OpenAI's image generator, integrated directly into ChatGPT.", why: "Best for following text prompts exactly" },
      { name: "Adobe Firefly", domain: "adobe.com", url: "https://firefly.adobe.com", pricing: "Freemium", description: "Commercially safe AI images built into Adobe's creative suite.", why: "Best for commercial use" },
      { name: "Leonardo.ai", domain: "leonardo.ai", url: "https://leonardo.ai", pricing: "Freemium", description: "Fine-tuned models for game art, product images, and consistent characters.", why: "Best for game & product assets" },
      { name: "Stable Diffusion", domain: "stability.ai", url: "https://stability.ai/stable-image", pricing: "Free", description: "Open-source image generation with no usage limits.", why: "Best free option" },
      { name: "Ideogram", domain: "ideogram.ai", url: "https://ideogram.ai", pricing: "Freemium", description: "AI image generator that actually renders text correctly in images.", why: "Best for images with text" },
    ],
  },
  "coding": {
    title: "Best AI Tools for Coding",
    description: "Write, debug, and review code faster with AI. From autocomplete to full app generation.",
    intro: "AI coding assistants split into in-editor autocomplete, AI-first editors that write whole files, and chat models for debugging and explanation. What suits you depends on your workflow, your privacy needs, and whether you're learning or shipping. Here's the ranked shortlist by role.",
    howToChoose: [
      "For everyday autocomplete inside your IDE, GitHub Copilot is the default; for a full AI-first editor, Cursor writes and edits entire files.",
      "Complex debugging and large-codebase reasoning is where chat models like Claude excel.",
      "If code can't leave your environment, choose a privacy-first option (Tabnine) that runs locally.",
      "Beginners benefit from browser-based, deploy-included tools (Replit AI) over local setups.",
    ],
    faqs: [
      { q: "What is the best AI coding assistant?", a: "GitHub Copilot is the best for daily in-editor coding. Cursor leads as an AI-first editor, and Claude is excellent for complex debugging and understanding large codebases." },
      { q: "Is there a free AI coding tool?", a: "Yes — Copilot, Cursor, Tabnine, and Replit AI all have free tiers, and ChatGPT's free plan handles explanations and boilerplate well." },
      { q: "Which AI is best for beginners learning to code?", a: "Replit AI is beginner-friendly because it runs in the browser with build-and-deploy included, while ChatGPT is great for explaining concepts and code line by line." },
    ],
    tools: [
      { name: "GitHub Copilot", domain: "github.com", url: "https://github.com/features/copilot", pricing: "Freemium", description: "AI pair programmer that suggests code in real time inside your editor.", why: "Best for daily coding" },
      { name: "Cursor", domain: "cursor.com", url: "https://cursor.com", pricing: "Freemium", description: "AI-first code editor that can write and edit entire files at once.", why: "Best AI code editor" },
      { name: "Claude", domain: "anthropic.com", url: "https://claude.ai", pricing: "Freemium", description: "Excellent at understanding large codebases and complex debugging tasks.", why: "Best for complex debugging" },
      { name: "Replit AI", domain: "replit.com", url: "https://replit.com", pricing: "Freemium", description: "Build and deploy full apps in the browser with AI assistance.", why: "Best for beginners" },
      { name: "Tabnine", domain: "tabnine.com", url: "https://tabnine.com", pricing: "Freemium", description: "Private AI code completion that runs locally for security.", why: "Best for privacy-conscious teams" },
      { name: "ChatGPT", domain: "openai.com", url: "https://chat.openai.com", pricing: "Freemium", description: "Great for explaining code, writing boilerplate, and learning new languages.", why: "Best for learning & explaining" },
    ],
  },
  "music": {
    title: "Best AI Tools for Music Creation",
    description: "Create original music, beats, and sound effects with AI, no musical experience required.",
    intro: "AI music tools now range from full-song generators that write lyrics and vocals to royalty-free background-track makers built for creators. The right one depends on whether you want a finished song, safe-to-use background music, or a cinematic score. Here's the ranked shortlist by job.",
    howToChoose: [
      "Decide what you need: a complete song with vocals (Suno, Udio) versus royalty-free background music (Mubert, Soundraw).",
      "If you'll monetize the output, confirm commercial rights — free tiers often restrict this (Soundraw and Boomy are built for it).",
      "For film and video scoring, a cinematic-focused tool (AIVA) beats a pop-song generator.",
      "Generate several takes — AI music quality varies run to run, so audition a few before committing.",
    ],
    faqs: [
      { q: "What is the best AI music generator?", a: "Suno is the leading pick for complete songs with vocals and lyrics, while Udio rivals it on audio quality. For royalty-free background music, Mubert and Soundraw are best." },
      { q: "Can I use AI-generated music commercially?", a: "Only with the right plan — Soundraw and Boomy are built for commercial and release use, while free tiers of most tools restrict monetization. Always check current terms." },
      { q: "Is there a free AI music tool?", a: "Yes — Suno, Udio, Mubert, and Boomy all offer free tiers with daily limits, enough to create a few tracks before upgrading for more credits and rights." },
    ],
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
    intro: "AI productivity tools help you plan, take notes, summarize, and automate busywork. The right one depends on whether you want an all-in-one workspace, meeting notes, or task automation. Our shortlist ranks them by the productivity job each wins.",
    howToChoose: [
      "Decide what you're automating: notes, tasks, meetings, or scheduling — one 'productivity' tool rarely does all four well.",
      "For an all-in-one workspace with AI built in, Notion AI and Taskade combine docs, tasks, and assistance.",
      "Meeting-heavy? A dedicated transcription tool (Otter.ai, Fireflies) beats general note apps.",
      "Start with the free tier and only upgrade once a tool is genuinely part of your daily routine.",
    ],
    faqs: [
      { q: "What is the best AI productivity tool?", a: "Notion AI is the strongest all-in-one for docs and tasks, while Taskade is great for AI-assisted project management and Otter.ai leads for meeting notes." },
      { q: "Is there a free AI productivity tool?", a: "Yes — Taskade, Otter.ai, and many others have generous free tiers. Notion AI is an add-on to Notion's free workspace." },
      { q: "Which AI is best for meeting notes?", a: "Otter.ai and Fireflies.ai are purpose-built for meetings — they transcribe, summarize, and extract action items automatically from your calls." },
    ],
    tools: [
      { name: "Notion AI", domain: "notion.so", url: "https://notion.so", pricing: "Freemium", description: "AI built into your workspace,summarize, write, and organize without switching tabs.", why: "Best all-in-one workspace" },
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
    intro: "AI marketing tools span copywriting, ad creative, and campaign automation. Your best pick depends on whether you're writing marketing copy, generating ad visuals, or scaling content across channels. Here's the ranked shortlist by marketing function.",
    howToChoose: [
      "Identify your bottleneck first: copy, creative, or distribution — each has a different best-in-class tool.",
      "For conversion-focused copy with performance prediction, Anyword and Jasper lead.",
      "Generating ad visuals at scale? A creative tool (AdCreative.ai) beats a general image generator for on-brand ads.",
      "Always keep a human in the loop for brand voice — AI gets you 80% there fast, the last 20% is what converts.",
    ],
    faqs: [
      { q: "What is the best AI marketing tool?", a: "Jasper is the top all-around marketing platform for copy and campaigns, while AdCreative.ai leads for generating conversion-focused ad visuals." },
      { q: "Are there free AI marketing tools?", a: "Yes — Copy.ai and several others offer free tiers for copywriting, and most paid platforms include free trials so you can test before subscribing." },
      { q: "Can AI run my whole marketing?", a: "AI can draft copy, generate creative, and schedule content, but strategy, brand judgment, and offer decisions still need a human — AI executes faster, it doesn't replace the marketer." },
    ],
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
    intro: "AI research tools help you find, summarize, and synthesize academic papers and sources. The best choice depends on whether you're doing a literature review, checking scientific consensus, or extracting data across studies. Here's the ranked shortlist by research task.",
    howToChoose: [
      "Match the tool to the stage: discovery, synthesis, or data extraction are different jobs.",
      "For evidence-based answers with agreement signals, Consensus summarizes across many papers.",
      "Doing a structured literature review? Elicit extracts the same fields across dozens of papers at once.",
      "Always open the original source before citing — AI summaries can miss nuance or context.",
    ],
    faqs: [
      { q: "What is the best AI research tool?", a: "Elicit is excellent for literature reviews and extracting data across papers, while Consensus is best for quick, evidence-backed answers with a scientific-agreement meter." },
      { q: "Are AI research tools accurate?", a: "They surface real papers and structured summaries, but they can miss nuance — always verify claims against the original source before relying on them academically." },
      { q: "Is there a free AI research tool?", a: "Yes — Elicit, Consensus, and Semantic Scholar all have free tiers covering searches and summaries, with paid plans adding higher limits and advanced extraction." },
    ],
    tools: [
      { name: "Perplexity AI", domain: "perplexity.ai", url: "https://perplexity.ai", pricing: "Freemium", description: "AI search engine that gives cited, accurate answers instead of a list of links.", why: "Best for quick research" },
      { name: "Elicit", domain: "elicit.org", url: "https://elicit.org", pricing: "Freemium", description: "AI research assistant that finds and summarizes academic papers.", why: "Best for academic research" },
      { name: "Claude", domain: "anthropic.com", url: "https://claude.ai", pricing: "Freemium", description: "Analyze long documents, PDFs, and research papers with 200k context window.", why: "Best for document analysis" },
      { name: "Consensus", domain: "consensus.app", url: "https://consensus.app", pricing: "Freemium", description: "Search engine that pulls insights directly from scientific research.", why: "Best for scientific consensus" },
      { name: "ChatGPT", domain: "openai.com", url: "https://chat.openai.com", pricing: "Freemium", description: "Summarize, explain, and analyze any topic with web browsing.", why: "Best all-around" },
      { name: "Explainpaper", domain: "explainpaper.com", url: "https://explainpaper.com", pricing: "Free", description: "Upload a research paper and get confusing sections explained in plain English.", why: "Best for understanding papers" },
    ],
  },
  "design": {
    title: "Best AI Tools for Design",
    description: "Create stunning visuals, logos, and UI designs with AI — no design experience needed.",
    intro: "AI design tools split between all-in-one editors for non-designers, pro tools that plug into existing creative suites, and specialists for logos or UI. The best pick depends on whether you're making social graphics, brand assets, a logo, or a website. Here's the shortlist by design job.",
    howToChoose: [
      "Match the tool to the deliverable: general graphics (Canva AI), logos (Looka), websites (Framer), or UI/UX (Galileo AI).",
      "Professionals already in Adobe should lean on Firefly for commercially-safe generation inside their workflow.",
      "For concept art and visual exploration, Midjourney produces the most striking results.",
      "Non-designers get the fastest results from template-first tools rather than open-ended generators.",
    ],
    faqs: [
      { q: "What is the best AI design tool?", a: "Canva AI is the best all-around pick for non-designers, Adobe Firefly for professionals, and specialists like Looka (logos) or Framer (websites) win their niches." },
      { q: "Is there a free AI design tool?", a: "Yes — Canva AI and Adobe Firefly both have free tiers, and several logo and UI tools offer free previews before you pay to download." },
      { q: "Can AI design a logo for me?", a: "Looka is purpose-built for AI logo design, generating full brand kits from a few prompts. Canva AI and Midjourney can also produce logo concepts to refine." },
    ],
    tools: [
      { name: "Canva AI", domain: "canva.com", url: "https://canva.com", pricing: "Freemium", description: "The world's most popular design tool with AI-powered generation, editing, and templates.", why: "Best all-around design tool" },
      { name: "Adobe Firefly", domain: "adobe.com", url: "https://firefly.adobe.com", pricing: "Freemium", description: "Commercially safe generative AI built into Adobe Creative Cloud.", why: "Best for professional designers" },
      { name: "Looka", domain: "looka.com", url: "https://looka.com", pricing: "Paid", description: "AI logo maker and brand identity generator for startups and small businesses.", why: "Best for logo design" },
      { name: "Framer", domain: "framer.com", url: "https://framer.com", pricing: "Freemium", description: "Build beautiful websites with AI, no code required.", why: "Best for website design" },
      { name: "Galileo AI", domain: "usegalileo.ai", url: "https://usegalileo.ai", pricing: "Paid", description: "Generate editable UI designs from text descriptions in seconds.", why: "Best for UI/UX design" },
      { name: "Midjourney", domain: "midjourney.com", url: "https://midjourney.com", pricing: "Paid", description: "Generate stunning concept art and design assets from text prompts.", why: "Best for concept art" },
    ],
  },
  "seo": {
    title: "Best AI Tools for SEO",
    description: "Rank higher on Google with AI-powered SEO tools for content, keywords, and technical optimization.",
    intro: "AI SEO tools cover keyword research, content optimization, and technical audits. The best fit depends on whether you're writing optimized content, finding keywords, or diagnosing site issues. Our shortlist ranks them by the SEO job each does best.",
    howToChoose: [
      "Separate the jobs: content optimization, keyword research, and technical audits are handled best by different tools.",
      "For writing content that ranks, prioritize a content-optimization tool (Surfer) that scores drafts against top-ranking pages.",
      "All-in-one platforms (Semrush) cost more but replace several point tools if you do SEO seriously.",
      "Verify AI suggestions against real SERP data — treat scores as guidance, not guarantees.",
    ],
    faqs: [
      { q: "What is the best AI SEO tool?", a: "Surfer SEO is the top pick for optimizing content to rank, while Semrush is the strongest all-in-one platform for keyword research, audits, and competitor analysis." },
      { q: "Is there a free AI SEO tool?", a: "Most serious SEO tools are paid, but many offer free trials or limited free tiers so you can test optimization and keyword features before committing." },
      { q: "Can AI actually improve my Google rankings?", a: "AI tools help you research keywords and optimize content faster, but rankings still depend on authority, backlinks, and genuine content quality — AI is a force-multiplier, not a shortcut." },
    ],
    tools: [
      { name: "Surfer SEO", domain: "surferseo.com", url: "https://surferseo.com", pricing: "Paid", description: "Write and optimize content that ranks on Google with real-time SEO scoring.", why: "Best for content optimization" },
      { name: "Semrush", domain: "semrush.com", url: "https://semrush.com", pricing: "Paid", description: "All-in-one SEO platform for keyword research, competitor analysis, and site audits.", why: "Best all-in-one SEO platform" },
      { name: "Ahrefs", domain: "ahrefs.com", url: "https://ahrefs.com", pricing: "Paid", description: "Industry-leading backlink analysis and keyword research tool.", why: "Best for backlink analysis" },
      { name: "Clearscope", domain: "clearscope.io", url: "https://clearscope.io", pricing: "Paid", description: "AI content optimization platform that helps you write content Google loves.", why: "Best for content briefs" },
      { name: "Frase", domain: "frase.io", url: "https://frase.io", pricing: "Paid", description: "Research, write, and optimize SEO content 10x faster with AI.", why: "Best for research + writing combo" },
      { name: "ChatGPT", domain: "openai.com", url: "https://chat.openai.com", pricing: "Freemium", description: "Use for keyword ideation, meta descriptions, title tags, and content outlines.", why: "Best free starting point" },
    ],
  },
  "social-media": {
    title: "Best AI Tools for Social Media",
    description: "Grow your social media presence faster with AI tools for content creation, scheduling, and analytics.",
    intro: "AI social media tools cover scheduling, content generation, and platform-specific growth. Your best pick depends on whether you need reliable scheduling, a LinkedIn growth engine, or a repurposing machine. Here's the ranked shortlist by social-media job.",
    howToChoose: [
      "Separate scheduling (Buffer) from growth and content generation (Taplio, Predis.ai) — most tools lean one way.",
      "Building on LinkedIn specifically? A dedicated growth tool (Taplio) outperforms general schedulers.",
      "For turning one piece of content into many posts, prioritize a repurposing tool (Lately).",
      "Keep a human edit on AI captions — generic posts underperform on every platform.",
    ],
    faqs: [
      { q: "What is the best AI social media tool?", a: "Buffer is the best for reliable multi-platform scheduling, Taplio for LinkedIn growth, and Predis.ai for AI-generated visual posts." },
      { q: "Is there a free social media AI tool?", a: "Yes — Buffer has a free plan for basic scheduling, and several tools offer free trials so you can test content generation before subscribing." },
      { q: "Can AI grow my social media following?", a: "AI speeds up content creation and posting consistency — the biggest growth levers — but genuine engagement and a clear niche still drive followers. AI is the accelerator, not the strategy." },
    ],
    tools: [
      { name: "Buffer", domain: "buffer.com", url: "https://buffer.com", pricing: "Freemium", description: "AI-powered social media scheduler with content suggestions for all major platforms.", why: "Best for scheduling" },
      { name: "Taplio", domain: "taplio.com", url: "https://taplio.com", pricing: "Paid", description: "AI tool for growing your LinkedIn audience with posts, outreach, and analytics.", why: "Best for LinkedIn growth" },
      { name: "FeedHive", domain: "feedhive.com", url: "https://feedhive.com", pricing: "Paid", description: "AI social media platform with conditional posting, recycling, and performance predictions.", why: "Best for power users" },
      { name: "Jasper", domain: "jasper.ai", url: "https://jasper.ai", pricing: "Paid", description: "Generate on-brand social media captions and ad copy at scale.", why: "Best for brand teams" },
      { name: "Predis.ai", domain: "predis.ai", url: "https://predis.ai", pricing: "Freemium", description: "Generate social media posts with visuals from a single text prompt.", why: "Best for visual posts" },
      { name: "Lately", domain: "lately.ai", url: "https://lately.ai", pricing: "Paid", description: "Repurpose long-form content into dozens of social media posts automatically.", why: "Best for content repurposing" },
    ],
  },
  "presentations": {
    title: "Best AI Tools for Presentations",
    description: "Create beautiful, professional presentations in minutes with AI — no design skills required.",
    intro: "AI presentation tools range from instant deck generators to polished design engines and add-ons for existing slide software. The best choice depends on whether you value speed, visual polish, team collaboration, or staying inside Google Slides or PowerPoint. Here's the shortlist by job.",
    howToChoose: [
      "Prioritize by need: raw speed (Gamma), design polish (Beautiful.ai), or working inside your current tool (SlidesAI, Plus AI).",
      "Team decks that multiple people edit favor collaboration-first tools (Pitch).",
      "Non-designers get the best results from tools that auto-apply layout and styling rather than blank canvases.",
      "Always review AI-generated slides for accuracy — it fills text confidently, sometimes wrongly.",
    ],
    faqs: [
      { q: "What is the best AI presentation tool?", a: "Gamma is the fastest way to generate a full deck from a prompt, Beautiful.ai produces the most polished slides, and SlidesAI/Plus AI are best if you live in Google Slides or PowerPoint." },
      { q: "Is there a free AI presentation maker?", a: "Yes — Gamma and Canva AI have free tiers, and several add-ons offer free credits to generate a few decks before upgrading." },
      { q: "Can AI make a whole presentation?", a: "Yes — tools like Gamma generate a complete, styled deck from a topic or outline in seconds. You'll still want to review content and tailor it to your audience." },
    ],
    tools: [
      { name: "Gamma", domain: "gamma.app", url: "https://gamma.app", pricing: "Freemium", description: "Generate complete slide decks from a text prompt in under a minute.", why: "Best for speed" },
      { name: "Beautiful.ai", domain: "beautiful.ai", url: "https://beautiful.ai", pricing: "Freemium", description: "Smart slide templates that auto-format as you add content.", why: "Best for polished slides" },
      { name: "Pitch", domain: "pitch.com", url: "https://pitch.com", pricing: "Freemium", description: "Collaborative presentation tool with AI writing and design assistance.", why: "Best for team collaboration" },
      { name: "Canva AI", domain: "canva.com", url: "https://canva.com/presentations", pricing: "Freemium", description: "Create presentations with AI-generated designs, images, and speaker notes.", why: "Best for non-designers" },
      { name: "SlidesAI", domain: "slidesai.io", url: "https://slidesai.io", pricing: "Freemium", description: "Turn any text or document into a Google Slides presentation instantly.", why: "Best for Google Slides users" },
      { name: "Plus AI", domain: "plusai.com", url: "https://plusai.com", pricing: "Paid", description: "Add AI-powered slide generation directly inside Google Slides and PowerPoint.", why: "Best add-on for existing tools" },
    ],
  },
  "data-analysis": {
    title: "Best AI Tools for Data Analysis",
    description: "Analyze data, build charts, and find insights faster with AI — no SQL or coding required.",
    intro: "AI data tools now let non-technical users analyze spreadsheets in plain English, while enterprise platforms add prediction and BI. The right pick depends on whether you're exploring data conversationally, building dashboards, or forecasting. Here's the ranked shortlist by data job.",
    howToChoose: [
      "Match to your skill level: plain-English analysis (Julius, ChatGPT) versus enterprise BI (Tableau).",
      "For predictions without code, a no-code ML tool (Obviously AI) beats a general chatbot.",
      "Need shareable dashboards? Prioritize a visualization-first tool (Polymer) over a chat interface.",
      "Always sanity-check AI's numbers against the raw data — confident output can still be wrong.",
    ],
    faqs: [
      { q: "What is the best AI data analysis tool?", a: "Julius and ChatGPT are best for non-technical, conversational analysis, Obviously AI for no-code predictions, and Tableau for enterprise business intelligence." },
      { q: "Can AI analyze my spreadsheet?", a: "Yes — upload a CSV or Excel file to Julius or ChatGPT and ask questions in plain English; it returns charts, summaries, and insights without formulas." },
      { q: "Is there a free AI data tool?", a: "ChatGPT's free tier handles basic data questions, and several tools offer free trials. Enterprise BI platforms like Tableau are paid but often have free viewers." },
    ],
    tools: [
      { name: "Julius", domain: "julius.ai", url: "https://julius.ai", pricing: "Freemium", description: "Chat with your data — upload CSVs and get charts, analysis, and insights instantly.", why: "Best for non-technical users" },
      { name: "ChatGPT", domain: "openai.com", url: "https://chat.openai.com", pricing: "Freemium", description: "Advanced Data Analysis mode lets you upload files and run Python analysis in-browser.", why: "Best all-around data tool" },
      { name: "Obviously AI", domain: "obviously.ai", url: "https://obviously.ai", pricing: "Paid", description: "Build and deploy predictive ML models without writing any code.", why: "Best for predictions" },
      { name: "Polymer", domain: "polymersearch.com", url: "https://polymersearch.com", pricing: "Freemium", description: "Turn spreadsheets into interactive dashboards with AI in minutes.", why: "Best for dashboards" },
      { name: "Rows", domain: "rows.com", url: "https://rows.com", pricing: "Freemium", description: "AI-powered spreadsheet that can fetch live data, run analysis, and summarize results.", why: "Best AI spreadsheet" },
      { name: "Tableau", domain: "tableau.com", url: "https://tableau.com", pricing: "Paid", description: "Industry-leading data visualization platform with AI-powered insights.", why: "Best for enterprise BI" },
    ],
  },
  "customer-support": {
    title: "Best AI Tools for Customer Support",
    description: "Automate customer service, reduce ticket volume, and delight customers 24/7 with AI.",
    intro: "AI customer-support tools span all-in-one help desks, e-commerce chatbots, and enterprise deflection engines. Your best pick depends on company size and whether you want a full platform, a quick storefront bot, or a custom-trained assistant. Here's the shortlist by job.",
    howToChoose: [
      "Choose by scale: SMB all-in-one (Intercom, Freshdesk), e-commerce (Tidio), or enterprise (Zendesk AI, Forethought).",
      "Want a bot trained on your own docs? A custom-chatbot builder (Chatbase) is fastest to deploy.",
      "Measure deflection rate, not just chat volume — the goal is resolving tickets without an agent.",
      "Keep an easy human-handoff path; AI-only support frustrates customers on complex issues.",
    ],
    faqs: [
      { q: "What is the best AI customer support tool?", a: "Intercom is the strongest all-in-one platform, Tidio is best for e-commerce, and Zendesk AI suits large support teams. Chatbase is best for building a custom bot fast." },
      { q: "Can AI handle customer support on its own?", a: "AI can resolve a large share of routine tickets automatically, but complex or emotional issues still need humans. The best setups blend AI deflection with easy agent handoff." },
      { q: "Is there a free AI support tool?", a: "Yes — Tidio and Freshdesk offer free tiers, and Chatbase lets you build and test a custom chatbot at low cost before scaling." },
    ],
    tools: [
      { name: "Intercom", domain: "intercom.com", url: "https://intercom.com", pricing: "Paid", description: "AI-first customer service platform with Fin AI agent that resolves 50%+ of tickets automatically.", why: "Best all-in-one platform" },
      { name: "Tidio", domain: "tidio.com", url: "https://tidio.com", pricing: "Freemium", description: "AI chatbot and live chat tool for e-commerce, easy to set up in minutes.", why: "Best for e-commerce" },
      { name: "Zendesk AI", domain: "zendesk.com", url: "https://zendesk.com", pricing: "Paid", description: "AI agents and automation built into the world's most popular support platform.", why: "Best for large support teams" },
      { name: "Freshdesk", domain: "freshdesk.com", url: "https://freshdesk.com", pricing: "Freemium", description: "AI-powered helpdesk with automated ticket routing and suggested replies.", why: "Best value for SMBs" },
      { name: "Forethought", domain: "forethought.ai", url: "https://forethought.ai", pricing: "Paid", description: "Generative AI for support that triages, assists, and resolves tickets autonomously.", why: "Best for enterprise" },
      { name: "Chatbase", domain: "chatbase.co", url: "https://chatbase.co", pricing: "Freemium", description: "Build a custom AI chatbot trained on your docs and website in minutes.", why: "Best for building custom chatbots" },
    ],
  },
  "translation": {
    title: "Best AI Tools for Translation",
    description: "Translate text, documents, and websites accurately into 100+ languages with AI.",
    intro: "AI translation tools range from best-in-class accuracy engines to free everyday translators and localization platforms for software and documents. The right pick depends on whether you need raw accuracy, free convenience, nuance, or full localization. Here's the shortlist by job.",
    howToChoose: [
      "Choose by need: top accuracy (DeepL), free everyday use (Google Translate), or nuance and context (Claude).",
      "Localizing software or apps? A dedicated localization platform (Lokalise AI) handles strings and context.",
      "For long documents, a translation-management tool (Smartcat) beats copy-pasting into a chatbot.",
      "Always have a native speaker review anything customer-facing — AI translation is strong but not flawless on tone.",
    ],
    faqs: [
      { q: "What is the most accurate AI translator?", a: "DeepL is widely regarded as the most accurate for major languages, while Claude and ChatGPT handle nuance and context especially well for tricky passages." },
      { q: "Is there a free AI translation tool?", a: "Yes — Google Translate is free and supports the most languages, and DeepL offers a capable free tier for shorter texts." },
      { q: "Can AI translate documents?", a: "Yes — DeepL and Smartcat translate whole documents while preserving formatting, and Lokalise AI is built for translating software and app content at scale." },
    ],
    tools: [
      { name: "DeepL", domain: "deepl.com", url: "https://deepl.com", pricing: "Freemium", description: "The most accurate AI translator, consistently outperforming Google Translate for European languages.", why: "Best translation accuracy" },
      { name: "Google Translate", domain: "translate.google.com", url: "https://translate.google.com", pricing: "Free", description: "Free translation for 130+ languages with camera, voice, and document support.", why: "Best free option" },
      { name: "Claude", domain: "anthropic.com", url: "https://claude.ai", pricing: "Freemium", description: "Translate with nuance, tone preservation, and cultural context for complex documents.", why: "Best for nuanced translation" },
      { name: "Lokalise AI", domain: "lokalise.com", url: "https://lokalise.com", pricing: "Paid", description: "AI translation management platform for software localization teams.", why: "Best for software localization" },
      { name: "Smartcat", domain: "smartcat.com", url: "https://smartcat.com", pricing: "Freemium", description: "AI translation platform with human review workflows for businesses.", why: "Best for document translation" },
      { name: "Reverso", domain: "reverso.net", url: "https://reverso.net", pricing: "Freemium", description: "Context-aware translation with examples from real-world usage.", why: "Best for language learners" },
    ],
  },
  "education": {
    title: "Best AI Tools for Learning & Education",
    description: "Learn faster, study smarter, and teach more effectively with AI-powered education tools.",
    intro: "AI education tools cover personal tutoring, language learning, studying, and homework help. The best pick depends on whether you want a tutor, a language app, study tools, or quick homework answers. Here's the ranked shortlist by learning job.",
    howToChoose: [
      "Match to the goal: personal tutoring (Claude, Khan Academy AI), languages (Duolingo), or studying and memorization (Quizlet).",
      "For step-by-step homework help, a solver-style tool (Socratic) explains rather than just answers.",
      "Free options cover most students — upgrade only for advanced features or ad-free study.",
      "Use AI to understand, not to copy — the learning happens when you work through explanations yourself.",
    ],
    faqs: [
      { q: "What is the best AI tool for learning?", a: "Claude and Khan Academy AI are excellent personal tutors, Duolingo leads for languages, and Quizlet is best for studying and memorization." },
      { q: "Is there a free AI tutor?", a: "Yes — Khan Academy's AI features, Socratic, and the free tiers of Claude and ChatGPT all offer capable tutoring and homework help at no cost." },
      { q: "Can AI help me study?", a: "Yes — AI can generate flashcards, quiz you, explain concepts, and summarize material. Quizlet and Claude are especially good for turning notes into active study sessions." },
    ],
    tools: [
      { name: "Khan Academy AI", domain: "khanacademy.org", url: "https://khanacademy.org", pricing: "Free", description: "Khanmigo is a free AI tutor that guides students through any subject with Socratic teaching.", why: "Best free AI tutor" },
      { name: "Duolingo", domain: "duolingo.com", url: "https://duolingo.com", pricing: "Freemium", description: "AI-powered language learning with personalized lessons, speaking practice, and conversation.", why: "Best for language learning" },
      { name: "Quizlet", domain: "quizlet.com", url: "https://quizlet.com", pricing: "Freemium", description: "AI study tools including flashcard generation, practice tests, and Q&A from any material.", why: "Best for studying and memorization" },
      { name: "Socratic", domain: "socratic.org", url: "https://socratic.org", pricing: "Free", description: "Google's AI homework helper — snap a photo of any question and get a step-by-step explanation.", why: "Best for homework help" },
      { name: "Coursera", domain: "coursera.org", url: "https://coursera.org", pricing: "Freemium", description: "AI-recommended courses and certificates from top universities worldwide.", why: "Best for professional courses" },
      { name: "Claude", domain: "anthropic.com", url: "https://claude.ai", pricing: "Freemium", description: "Explain any concept in plain English, generate practice questions, and tutor on any topic.", why: "Best personal AI tutor" },
    ],
  },
  "automation": {
    title: "Best AI Tools for Automation",
    description: "Automate repetitive tasks and build powerful workflows that save hours every week.",
    intro: "AI automation tools connect your apps and run workflows, from simple triggers to complex multi-step and browser automations. Your best pick depends on whether you want ease, power, open-source control, or browser tasks. Here's the ranked shortlist by job.",
    howToChoose: [
      "Choose by complexity: simple app connections (Zapier), complex branching workflows (Make), or open-source self-hosting (n8n).",
      "For browser-based tasks and scraping, a browser-automation tool (Bardeen) fits better than a general connector.",
      "Cost scales with task volume — a free Zapier alternative (Activepieces) can save money at high volumes.",
      "Start with one high-value workflow and expand; over-automating early creates fragile, hard-to-debug chains.",
    ],
    faqs: [
      { q: "What is the best AI automation tool?", a: "Zapier is the best for straightforward app integrations, Make for complex multi-step workflows, and n8n for open-source, self-hosted control." },
      { q: "Is there a free automation tool?", a: "Yes — Zapier, Make, and n8n all have free tiers, and Activepieces is a free, open-source Zapier alternative for higher volumes." },
      { q: "What can AI automation do?", a: "It connects your apps to move data and trigger actions automatically — like saving email attachments, posting to social, or enriching leads — with AI steps that summarize, classify, or draft along the way." },
    ],
    tools: [
      { name: "Zapier", domain: "zapier.com", url: "https://zapier.com", pricing: "Freemium", description: "Connect 7,000+ apps and automate workflows with AI — no code required.", why: "Best for app integrations" },
      { name: "Make", domain: "make.com", url: "https://make.com", pricing: "Freemium", description: "Visual workflow builder for complex multi-step automations with advanced logic.", why: "Best for complex workflows" },
      { name: "n8n", domain: "n8n.io", url: "https://n8n.io", pricing: "Free", description: "Open-source workflow automation with 400+ integrations — self-host for full control.", why: "Best open-source option" },
      { name: "Bardeen", domain: "bardeen.ai", url: "https://bardeen.ai", pricing: "Freemium", description: "AI browser automation that can scrape, fill forms, and automate web tasks.", why: "Best for browser automation" },
      { name: "Relay.app", domain: "relay.app", url: "https://relay.app", pricing: "Freemium", description: "Human-in-the-loop automation that combines AI and human judgment.", why: "Best for human+AI workflows" },
      { name: "Activepieces", domain: "activepieces.com", url: "https://activepieces.com", pricing: "Free", description: "Open-source Zapier alternative with AI actions built in.", why: "Best free Zapier alternative" },
    ],
  },
  "audio": {
    title: "Best AI Tools for Audio & Podcasts",
    description: "Record, edit, transcribe, and enhance audio with AI — professional results without a studio.",
    intro: "AI audio tools cover podcast editing, voiceover generation, enhancement, and transcription. The best pick depends on whether you're editing a podcast, generating voices, cleaning up recordings, or transcribing. Here's the ranked shortlist by audio job.",
    howToChoose: [
      "Match to the task: podcast editing (Descript), AI voiceovers (ElevenLabs, Murf), or transcription (Otter.ai).",
      "Bad room audio? An enhancement tool (Adobe Podcast, Cleanvoice) rescues recordings before editing.",
      "For voiceovers you'll publish, check commercial-use rights on the voice you generate.",
      "Descript's edit-by-text workflow is the biggest time-saver for spoken-word content.",
    ],
    faqs: [
      { q: "What is the best AI audio tool?", a: "Descript is best for podcast editing, ElevenLabs and Murf lead for AI voiceovers, and Otter.ai is best for transcription." },
      { q: "Can AI clean up bad audio?", a: "Yes — Adobe Podcast and Cleanvoice remove noise, filler words, and echo, often turning a rough recording into something publishable in one pass." },
      { q: "Is there a free AI audio tool?", a: "Yes — Otter.ai, Descript, and ElevenLabs all offer free tiers with limits, enough to transcribe, edit, or generate short voiceovers before upgrading." },
    ],
    tools: [
      { name: "Descript", domain: "descript.com", url: "https://descript.com", pricing: "Freemium", description: "Edit audio by editing text — the easiest podcast editor ever made, powered by AI.", why: "Best for podcast editing" },
      { name: "ElevenLabs", domain: "elevenlabs.io", url: "https://elevenlabs.io", pricing: "Freemium", description: "Generate ultra-realistic AI voices and clone your own voice for narration.", why: "Best for AI voiceovers" },
      { name: "Adobe Podcast", domain: "podcast.adobe.com", url: "https://podcast.adobe.com", pricing: "Freemium", description: "Remove background noise and enhance audio quality to studio-grade with one click.", why: "Best for audio enhancement" },
      { name: "Otter.ai", domain: "otter.ai", url: "https://otter.ai", pricing: "Freemium", description: "Transcribe audio and video in real time with speaker identification.", why: "Best for transcription" },
      { name: "Cleanvoice", domain: "cleanvoice.ai", url: "https://cleanvoice.ai", pricing: "Paid", description: "Automatically remove filler words, mouth sounds, and silences from recordings.", why: "Best for cleaning up recordings" },
      { name: "Murf", domain: "murf.ai", url: "https://murf.ai", pricing: "Freemium", description: "Create professional voiceovers with 120+ AI voices in 20+ languages.", why: "Best for voiceover production" },
    ],
  },
  "sales": {
    title: "Best AI Tools for Sales",
    description: "Close more deals faster with AI tools for prospecting, outreach, call analysis, and forecasting.",
    intro: "AI sales tools cover call intelligence, prospecting, email personalization, and data enrichment. Your best pick depends on whether you need conversation insights, lead sourcing, better emails, or enrichment. Here's the ranked shortlist by sales job.",
    howToChoose: [
      "Choose by stage: prospecting (Apollo.io, Clay), email personalization (Lavender), or call analysis (Gong).",
      "For outbound enrichment and list-building, a data tool (Clay) beats a general CRM add-on.",
      "Enterprise teams needing forecasting and coaching lean toward full platforms (Outreach, Gong).",
      "AI drafts and enriches, but relationships close deals — use it to spend more time selling, not less.",
    ],
    faqs: [
      { q: "What is the best AI sales tool?", a: "Gong leads for call intelligence, Apollo.io for prospecting, Lavender for email personalization, and Clay for outbound data enrichment." },
      { q: "Can AI write sales emails?", a: "Yes — Lavender coaches and personalizes emails in real time, and ChatGPT drafts outreach quickly. Personalized, AI-assisted emails tend to outperform generic templates." },
      { q: "Is there a free AI sales tool?", a: "ChatGPT's free tier handles sales writing, and Apollo.io offers a free plan for prospecting with limited credits before you upgrade." },
    ],
    tools: [
      { name: "Gong", domain: "gong.io", url: "https://gong.io", pricing: "Paid", description: "AI revenue intelligence platform that analyzes calls, emails, and deals to improve win rates.", why: "Best for sales intelligence" },
      { name: "Apollo.io", domain: "apollo.io", url: "https://apollo.io", pricing: "Freemium", description: "All-in-one sales platform with 275M contacts, AI email writing, and sequencing.", why: "Best for prospecting" },
      { name: "Lavender", domain: "lavender.ai", url: "https://lavender.ai", pricing: "Freemium", description: "AI email coach that scores your sales emails and suggests improvements in real time.", why: "Best for email personalization" },
      { name: "Outreach", domain: "outreach.io", url: "https://outreach.io", pricing: "Paid", description: "AI sales execution platform for sequences, forecasting, and deal management.", why: "Best for enterprise sales" },
      { name: "Clay", domain: "clay.com", url: "https://clay.com", pricing: "Freemium", description: "Enrich prospect data from 50+ sources and generate hyper-personalized outreach at scale.", why: "Best for outbound enrichment" },
      { name: "ChatGPT", domain: "openai.com", url: "https://chat.openai.com", pricing: "Freemium", description: "Write cold emails, generate objection responses, and create sales scripts instantly.", why: "Best free sales writing tool" },
    ],
  },
  "email": {
    title: "Best AI Tools for Email",
    description: "Write better emails faster, manage your inbox with AI, and automate your email workflows.",
    intro: "AI email tools speed up writing, triage, and inbox management, from smart clients to assistants inside Gmail. The best pick depends on whether you want a faster inbox, free convenience, sales-focused help, or complex drafting. Here's the ranked shortlist by job.",
    howToChoose: [
      "Match to need: fastest overall inbox (Superhuman), free built-in help (Gmail AI), or AI-native clients (Shortwave).",
      "Sales-heavy inboxes benefit from a personalization tool (Lavender) over a general client.",
      "Team inboxes favor collaboration-first clients (Missive).",
      "Let AI draft and triage, but read before you send — tone matters most in email.",
    ],
    faqs: [
      { q: "What is the best AI email tool?", a: "Superhuman is the best overall for a fast, AI-assisted inbox, Gmail's built-in AI is the best free option, and Shortwave is a strong AI-native client." },
      { q: "Can AI write my emails?", a: "Yes — Superhuman, Gmail AI, and Claude draft, summarize, and reply to emails. They're excellent first drafts; a quick human edit keeps the tone right." },
      { q: "Is there a free AI email tool?", a: "Yes — Gmail's AI features are free for users, and Claude's free tier handles complex email drafting well." },
    ],
    tools: [
      { name: "Superhuman", domain: "superhuman.com", url: "https://superhuman.com", pricing: "Paid", description: "The fastest email experience ever built — AI triage, summaries, and instant replies.", why: "Best overall email AI" },
      { name: "Gmail AI", domain: "gmail.com", url: "https://gmail.com", pricing: "Freemium", description: "Smart Compose and Gemini AI built into Gmail for drafting and summarizing emails.", why: "Best free option" },
      { name: "Lavender", domain: "lavender.ai", url: "https://lavender.ai", pricing: "Freemium", description: "AI email coach that scores and improves your sales and outreach emails.", why: "Best for sales emails" },
      { name: "Shortwave", domain: "shortwave.com", url: "https://shortwave.com", pricing: "Freemium", description: "AI email client that auto-triages, summarizes threads, and drafts replies.", why: "Best AI email client" },
      { name: "Missive", domain: "missive.app", url: "https://missive.app", pricing: "Paid", description: "Team email client with AI drafting and shared inboxes.", why: "Best for teams" },
      { name: "Claude", domain: "anthropic.com", url: "https://claude.ai", pricing: "Freemium", description: "Draft professional emails of any length, tone, or complexity in seconds.", why: "Best for complex email writing" },
    ],
  },
  "resume": {
    title: "Best AI Tools for Resume & Job Search",
    description: "Land more interviews with AI tools that write, optimize, and tailor your resume for every job.",
    intro: "AI resume and job-search tools help you build resumes, beat applicant tracking systems, and optimize your LinkedIn. Your best pick depends on whether you want an all-in-one platform, great templates, ATS optimization, or free tailoring. Here's the ranked shortlist by job.",
    howToChoose: [
      "Choose by need: all-in-one job search (Teal), templates (Kickresume), or ATS optimization (Rezi).",
      "Applying to big companies? Prioritize ATS-focused tools — many resumes are filtered by software before a human sees them.",
      "Tailor your resume to each job; a free tool (ChatGPT) is great for rewording bullets per posting.",
      "Keep a clean, standard format — over-designed resumes often break ATS parsing.",
    ],
    faqs: [
      { q: "What is the best AI resume tool?", a: "Teal is the best all-in-one job-search platform, Kickresume leads for templates, and Rezi is best for optimizing resumes to pass applicant tracking systems." },
      { q: "Can AI write my resume?", a: "Yes — tools like Teal, Rezi, and ChatGPT draft and tailor resume bullets to a specific job. Always review for accuracy and add your real metrics and achievements." },
      { q: "Is there a free AI resume builder?", a: "Yes — ChatGPT's free tier tailors resume content, and several builders like Kickresume and Resume.io offer free plans with basic templates." },
    ],
    tools: [
      { name: "Teal", domain: "tealhq.com", url: "https://tealhq.com", pricing: "Freemium", description: "AI resume builder that tailors your resume to each job description automatically.", why: "Best all-in-one job search platform" },
      { name: "Kickresume", domain: "kickresume.com", url: "https://kickresume.com", pricing: "Freemium", description: "AI resume and cover letter builder with 35+ ATS-friendly templates.", why: "Best for templates" },
      { name: "Resume.io", domain: "resume.io", url: "https://resume.io", pricing: "Paid", description: "Professional resume builder with AI writing assistance and ATS optimization.", why: "Best for clean professional resumes" },
      { name: "Rezi", domain: "rezi.ai", url: "https://rezi.ai", pricing: "Freemium", description: "ATS-optimized resume builder that scores your resume against job descriptions.", why: "Best for ATS optimization" },
      { name: "ChatGPT", domain: "openai.com", url: "https://chat.openai.com", pricing: "Freemium", description: "Paste any job description and ask ChatGPT to tailor your resume bullet points instantly.", why: "Best free resume tailoring" },
      { name: "LinkedIn AI", domain: "linkedin.com", url: "https://linkedin.com", pricing: "Freemium", description: "AI-powered profile writing, job matching, and application insights built into LinkedIn.", why: "Best for LinkedIn optimization" },
    ],
  },
  "legal": {
    title: "Best AI Tools for Legal Work",
    description: "Draft contracts, review documents, and research case law faster with AI legal tools.",
    intro: "AI legal tools range from law-firm-grade research assistants to contract-review software and consumer legal help. Your best pick depends on whether you're a firm, a business reviewing contracts, or a consumer. Here's the ranked shortlist by legal job.",
    howToChoose: [
      "Match to the user: law firms (Harvey, Casetext), contract review (Spellbook), or consumers (DoNotPay).",
      "For businesses managing many agreements, a contract-lifecycle tool (Ironclad) beats ad-hoc review.",
      "Use general models (Claude) for plain-English legal explanations, not binding advice.",
      "Always have a qualified lawyer review anything with real legal consequences — AI assists, it doesn't replace counsel.",
    ],
    faqs: [
      { q: "What is the best AI legal tool?", a: "Harvey and Casetext lead for law firms, Spellbook is best for contract review, and DoNotPay targets consumer legal tasks." },
      { q: "Can AI give legal advice?", a: "AI can explain legal concepts and draft documents, but it isn't a substitute for a licensed attorney. Always have a lawyer review anything with real stakes." },
      { q: "Is there a free legal AI tool?", a: "Claude's free tier is useful for plain-English legal explanations and drafting, though professional tools like Harvey and Casetext are paid and built for practitioners." },
    ],
    tools: [
      { name: "Harvey", domain: "harvey.ai", url: "https://harvey.ai", pricing: "Paid", description: "AI for law firms — draft, review, and analyze legal documents with GPT-4 fine-tuned on legal data.", why: "Best for law firms" },
      { name: "Spellbook", domain: "spellbook.legal", url: "https://spellbook.legal", pricing: "Paid", description: "AI contract drafting and review tool that works inside Microsoft Word.", why: "Best for contract review" },
      { name: "DoNotPay", domain: "donotpay.com", url: "https://donotpay.com", pricing: "Paid", description: "AI lawyer for consumers — fight parking tickets, cancel subscriptions, and draft demand letters.", why: "Best for consumers" },
      { name: "Casetext", domain: "casetext.com", url: "https://casetext.com", pricing: "Paid", description: "AI legal research tool that finds relevant case law and statutes in seconds.", why: "Best for legal research" },
      { name: "Claude", domain: "anthropic.com", url: "https://claude.ai", pricing: "Freemium", description: "Analyze long contracts, explain legal language, and draft basic legal documents.", why: "Best free legal AI" },
      { name: "Ironclad", domain: "ironcladapp.com", url: "https://ironcladapp.com", pricing: "Paid", description: "AI-powered contract lifecycle management for legal and business teams.", why: "Best for contract management" },
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
  "image-creation": "image-generation",
  "coding": "coding",
  "programming": "coding",
  "development": "coding",
  "music": "music",
  "music-creation": "music",
  "productivity": "productivity",
  "marketing": "marketing",
  "research": "research",
  "design": "design",
  "graphic-design": "design",
  "ui-design": "design",
  "seo": "seo",
  "search-engine-optimization": "seo",
  "social-media": "social-media",
  "social": "social-media",
  "presentations": "presentations",
  "slides": "presentations",
  "pitch-decks": "presentations",
  "data-analysis": "data-analysis",
  "data": "data-analysis",
  "analytics": "data-analysis",
  "customer-support": "customer-support",
  "chatbots": "customer-support",
  "support": "customer-support",
  "translation": "translation",
  "translate": "translation",
  "education": "education",
  "learning": "education",
  "studying": "education",
  "automation": "automation",
  "workflows": "automation",
  "audio": "audio",
  "podcasts": "audio",
  "podcast": "audio",
  "sales": "sales",
  "email": "email",
  "emails": "email",
  "resume": "resume",
  "job-search": "resume",
  "cv": "resume",
  "legal": "legal",
  "contracts": "legal",
};

export function generateStaticParams() {
  return Object.keys(USE_CASES).map((slug) => ({ "use-case": slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ "use-case": string }> }) {
  const { "use-case": slug } = await params;
  const key = SLUG_MAP[slug] || slug;
  const data = USE_CASES[key];
  if (!data) return { title: "Not Found" };
  const year = new Date().getFullYear();
  return {
    title: `${data.title} (${year}) — HowToUseMyAI`,
    description: data.description,
    openGraph: {
      title: `${data.title} (${year}) — HowToUseMyAI`,
      description: data.description,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${data.title} (${year}) — HowToUseMyAI`,
      description: data.description,
    },
  };
}

export default async function BestAIForPage({ params }: { params: Promise<{ "use-case": string }> }) {
  const { "use-case": slug } = await params;
  const key = SLUG_MAP[slug] || slug;
  const data = USE_CASES[key];
  if (!data) notFound();

  const freeTools = data!.tools.filter((t) => t.pricing === "Free" || t.pricing === "Freemium");
  const sectorName = data.title.replace("Best AI Tools for ", "");

  // Shared FAQ list — drives both the visible section and FAQPage schema.
  // Use-case-specific FAQs override the generated defaults when provided.
  const faqs: { q: string; a: string }[] = data.faqs ?? [
    {
      q: `What is the ${data.title.toLowerCase()}?`,
      a: `The best AI tools for this category include ${data.tools.slice(0, 3).map((t) => t.name).join(", ")}. ${data.description}`,
    },
    {
      q: `Is there a free AI tool for ${sectorName.toLowerCase()}?`,
      a: freeTools.length > 0
        ? `Yes, ${freeTools.slice(0, 2).map((t) => t.name).join(" and ")} offer free plans you can start with today.`
        : `Most tools in this category are paid, but many offer free trials so you can test before buying.`,
    },
    {
      q: `Which ${sectorName.toLowerCase()} AI tool should I use?`,
      a: `${data.tools[0].name} is our top pick — ${data.tools[0].why.toLowerCase()}. ${data.tools[1]?.name} is also excellent if you need ${data.tools[1]?.why.toLowerCase()}.`,
    },
  ];
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <div className="flex flex-col min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <SiteHeader active="/best-ai-for" />

      <main className="v2-page">
        <div className="v2-pagehead">
          <div className="v2-crumb">
            <Link href="/">HOME</Link>
            <i>//</i>
            <Link href="/best-ai-for">USE CASES</Link>
            <i>//</i>
            <span className="v2-crumb-cur">{sectorName.toUpperCase()}</span>
          </div>
          <h1 className="v2-pagetitle">{data.title}</h1>
          <p className="v2-pagelead">{data.description}</p>
          {data.intro && <p className="v2-pageintro">{data.intro}</p>}
          <div className="v2-readbar">
            <span className="flex items-center gap-2"><i className="v2-dot v2-dot-ok" /> RANKED SHORTLIST</span>
            <span className="v2-readbar-sep" />
            <span><b>{data.tools.length}</b> <span className="v2-readbar-dim">TOOLS</span></span>
          </div>
        </div>

        <div className="v2-stack">
          {data.tools.map((tool, i) => {
            const toolSlug = slugify(tool.name);
            const hasProfile = LIB_SLUGS.has(toolSlug);
            const visitHref = outboundUrl(tool.name, tool.url, key);
            return (
              <div key={tool.name} className="v2-panel v2-trow">
                <i className="v2-cb v2-cb-tl" /><i className="v2-cb v2-cb-tr" /><i className="v2-cb v2-cb-bl" /><i className="v2-cb v2-cb-br" />
                <span className="v2-trow-rank">{String(i + 1).padStart(2, "0")}</span>
                <span className="v2-mark" style={{ width: 40, height: 40, flexShrink: 0 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`https://www.google.com/s2/favicons?domain=${tool.domain}&sz=128`} alt={tool.name} width={23} height={23} loading="lazy" />
                </span>
                <div className="v2-trow-body">
                  <div className="v2-trow-head">
                    {hasProfile ? (
                      <Link href={`/tools/${toolSlug}`} className="v2-trow-name" style={{ textDecoration: "none" }}>
                        {tool.name}
                      </Link>
                    ) : (
                      <span className="v2-trow-name">{tool.name}</span>
                    )}
                    {i === 0 && <span className="v2-toppick">TOP PICK</span>}
                    <span className={`v2-pill v2-pill-${tool.pricing.toLowerCase()}`}>{tool.pricing}</span>
                  </div>
                  <p className="v2-trow-desc">{tool.description}</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
                    <span className="v2-trow-why"><i>▸</i> {tool.why}</span>
                    <a
                      href={visitHref}
                      target="_blank"
                      rel="noopener noreferrer sponsored"
                      className="v2-trow-why"
                      style={{ color: "var(--v2-dim)" }}
                    >
                      VISIT SITE <i>↗</i>
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {data.howToChoose && data.howToChoose.length > 0 && (
          <section className="v2-guide">
            <h2 className="v2-guide-h">How to choose your {sectorName.toLowerCase()} AI tool</h2>
            <ul className="v2-guide-list">
              {data.howToChoose.map((point, i) => (
                <li key={i}><i>▸</i><span>{point}</span></li>
              ))}
            </ul>
          </section>
        )}

        <section className="v2-guide">
          <h2 className="v2-guide-h">Frequently asked questions</h2>
          <div className="v2-faq">
            {faqs.map((f, i) => (
              <div key={i} className="v2-faq-item">
                <p className="v2-faq-q">{f.q}</p>
                <p className="v2-faq-a">{f.a}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="v2-ctapanel v2-panel">
          <i className="v2-cb v2-cb-tl" /><i className="v2-cb v2-cb-tr" /><i className="v2-cb v2-cb-bl" /><i className="v2-cb v2-cb-br" />
          <p>Not sure which one to pick for your exact task?</p>
          <Link
            href={`/recommend?q=${encodeURIComponent(data.title.replace("Best AI Tools for ", "I want to "))}`}
            className="v2-ctabtn"
          >
            ◆ FIND YOUR MATCH
          </Link>
        </div>

        <NewsletterSignup compact />
      </main>

      <SiteFooter />
    </div>
  );
}
