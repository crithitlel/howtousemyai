import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import SiteHeader from "../../components/SiteHeader";
import SiteFooter from "../../components/SiteFooter";
import NewsletterSignup from "../../components/NewsletterSignup";
import { TOOLS, slugify } from "@/lib/tools";
import { getToolUrl } from "@/lib/affiliates";

// Base facts (name, domain, pricing, url) are the single source of truth in
// lib/tools.ts. A comparison entry only declares its page-unique editorial
// content (tagline, pros, cons, bestFor) plus a `slug` pointing at the lib
// tool. `name`/`domain`/`pricing`/`url` may be set locally to override lib (the
// Cursor domain) or to define a tool that isn't in lib at all (Perplexity AI).
const BY_SLUG = new Map(TOOLS.map((t) => [slugify(t.name), t]));

// What a comparison stores: editorial content + a lib reference / overrides.
interface CompareToolContent {
  slug?: string;
  name?: string;
  domain?: string;
  pricing?: "Free" | "Freemium" | "Paid";
  url?: string;
  tagline: string;
  pros: string[];
  cons: string[];
  bestFor: string;
}

// What the page renders: fully resolved tool with base facts filled from lib.
interface CompareTool {
  name: string;
  domain: string;
  pricing: "Free" | "Freemium" | "Paid";
  tagline: string;
  pros: string[];
  cons: string[];
  bestFor: string;
  url: string;
}

function resolveTool(c: CompareToolContent): CompareTool {
  const base = c.slug ? BY_SLUG.get(c.slug) : undefined;
  return {
    name: c.name ?? base?.name ?? "",
    domain: c.domain ?? base?.domain ?? "",
    pricing: c.pricing ?? base?.pricing ?? "Freemium",
    url: c.url ?? base?.url ?? "",
    tagline: c.tagline,
    pros: c.pros,
    cons: c.cons,
    bestFor: c.bestFor,
  };
}

interface Comparison {
  tool1: CompareToolContent;
  tool2: CompareToolContent;
  verdict: string;
  verdictWinner: "tool1" | "tool2" | "tie";
  verdictDetail: string;
  category: string;
}

const COMPARISONS: Record<string, Comparison> = {
  "chatgpt-vs-claude": {
    category: "Writing & AI Assistants",
    tool1: {
      slug: "chatgpt",
      tagline: "The world's most popular AI assistant",
      pros: ["Largest user base and community", "Excellent plugin and GPT ecosystem", "Strong at coding and structured tasks", "DALL-E 3 image generation built in", "Voice mode and mobile apps"],
      cons: ["Can be verbose and over-explain", "Knowledge cutoff without browsing", "GPT-4 rate-limited on free tier", "Less nuanced on sensitive topics"],
      bestFor: "General-purpose tasks, coding, and users who want the widest ecosystem",
    },
    tool2: {
      slug: "claude",
      tagline: "Anthropic's thoughtful AI for nuanced work",
      pros: ["200k context window handles huge documents", "More nuanced, careful writing style", "Better at following complex instructions", "Stronger reasoning and analysis", "Less prone to hallucination"],
      cons: ["Smaller ecosystem than ChatGPT", "No image generation", "Fewer integrations and plugins", "Less known outside tech circles"],
      bestFor: "Long documents, nuanced writing, and tasks requiring careful reasoning",
    },
    verdict: "Claude",
    verdictWinner: "tool2",
    verdictDetail: "For pure writing quality and handling complex, nuanced tasks, Claude edges ahead. But if you want the broadest ecosystem, integrations, and image generation, ChatGPT wins. Most power users keep both.",
  },
  "chatgpt-vs-gemini": {
    category: "AI Assistants",
    tool1: {
      slug: "chatgpt",
      tagline: "The world's most popular AI assistant",
      pros: ["Best-in-class GPT-4o model", "Huge plugin and GPT store ecosystem", "DALL-E 3 image generation", "Excellent coding ability", "Strong track record and reliability"],
      cons: ["Not deeply integrated with Google services", "Separate app from existing workflows", "Can hallucinate confidently", "Rate limits on free tier"],
      bestFor: "Standalone AI tasks, coding, content creation, and users outside Google ecosystem",
    },
    tool2: {
      slug: "gemini",
      tagline: "Google's AI deeply integrated with Search and Workspace",
      pros: ["Native Google Search grounding", "Gmail, Docs, Drive integration", "1M token context window on Advanced", "Free tier is generous", "Best for Google Workspace users"],
      cons: ["Weaker coding than ChatGPT", "Less consistent quality", "Ecosystem still maturing", "Advanced tier is expensive"],
      bestFor: "Google Workspace users, research with cited sources, and Gmail/Docs workflows",
    },
    verdict: "ChatGPT",
    verdictWinner: "tool1",
    verdictDetail: "ChatGPT leads on raw capability and consistency. Gemini wins if you live in Google Workspace — the integrations are genuinely useful. For everything else, ChatGPT is the stronger choice.",
  },
  "midjourney-vs-dall-e-3": {
    category: "Image Generation",
    tool1: {
      slug: "midjourney",
      tagline: "The gold standard for AI art quality",
      pros: ["Highest aesthetic quality of any AI image tool", "Exceptional at artistic and stylised images", "Active Discord community with inspiration", "v6 model is photorealistic", "Consistent character and style control"],
      cons: ["No free tier", "Discord-only interface (until recently)", "Less accurate at following exact text prompts", "Can't generate images with accurate text"],
      bestFor: "Artists, designers, and anyone who prioritises image quality over everything else",
    },
    tool2: {
      slug: "dall-e-3",
      tagline: "OpenAI's image model integrated into ChatGPT",
      pros: ["Excellent at following exact text prompts", "Integrated into ChatGPT for easy access", "Better at rendering text in images", "Free tier via ChatGPT", "Great for precise, literal image requests"],
      cons: ["Less artistic flair than Midjourney", "Lower aesthetic ceiling", "Limited fine-tuning control", "Slower generation"],
      bestFor: "Precise, literal images and users already using ChatGPT",
    },
    verdict: "Midjourney",
    verdictWinner: "tool1",
    verdictDetail: "For pure image quality and artistic output, Midjourney wins clearly. DALL-E 3 is better when you need exact prompt adherence or have text in your image. If budget isn't a concern, Midjourney is the clear choice.",
  },
  "github-copilot-vs-cursor": {
    category: "AI Coding",
    tool1: {
      slug: "github-copilot",
      tagline: "Microsoft's AI pair programmer inside your editor",
      pros: ["Works in VS Code, JetBrains, Vim, and more", "Deep GitHub and pull request integration", "Battle-tested by millions of developers", "Copilot Chat for code explanations", "Enterprise security and compliance options"],
      cons: ["Autocomplete-focused, not agentic", "Can't make multi-file changes autonomously", "Suggestions can feel generic", "Pricier than alternatives"],
      bestFor: "Developers who want reliable autocomplete across any editor or IDE",
    },
    tool2: {
      slug: "cursor", domain: "cursor.com", // domain override: lib has cursor.sh, this page shows cursor.com
      tagline: "The AI-first code editor that thinks in whole files",
      pros: ["Can edit entire files and multi-file changes", "Understands full codebase context", "Composer mode for agentic coding", "Faster for large refactors", "Free tier is generous"],
      cons: ["VS Code fork — switching cost for other editors", "Less stable than GitHub Copilot", "Codebase indexing can be slow", "Smaller company, less enterprise trust"],
      bestFor: "Developers who want AI that can plan and implement across the whole codebase",
    },
    verdict: "Cursor",
    verdictWinner: "tool2",
    verdictDetail: "Cursor is the better tool for ambitious, agentic coding — writing whole features rather than completing single lines. GitHub Copilot wins on stability, IDE flexibility, and enterprise trust. Many developers use both.",
  },
  "jasper-vs-copy-ai": {
    category: "AI Writing & Copywriting",
    tool1: {
      slug: "jasper",
      tagline: "Enterprise AI writing for marketing teams",
      pros: ["50+ marketing-specific templates", "Brand voice settings keep content on-brand", "Campaigns feature for multi-channel content", "Integrates with Surfer SEO", "Strong enterprise support"],
      cons: ["Expensive — starts at $49/month", "Overkill for solo creators", "Steeper learning curve", "Output still needs editing"],
      bestFor: "Marketing teams producing high volumes of on-brand content",
    },
    tool2: {
      slug: "copy-ai",
      tagline: "Fast AI copywriting for individuals and teams",
      pros: ["Generous free tier", "Faster for short-form copy", "Workflows for repeatable content processes", "Easier to get started", "Good for social and ad copy"],
      cons: ["Less brand control than Jasper", "Weaker long-form content", "Output can feel templated", "Fewer enterprise features"],
      bestFor: "Individuals and small teams who need fast short-form copy without the enterprise price tag",
    },
    verdict: "tie",
    verdictWinner: "tie",
    verdictDetail: "It depends on your budget and scale. Jasper is worth it for marketing teams needing brand consistency at volume. Copy.ai is the smarter choice for solopreneurs and small teams — the free tier alone covers most use cases.",
  },
  "perplexity-vs-chatgpt": {
    category: "Research & AI Search",
    tool1: {
      // Local-only: lib has "Perplexity"; this page keeps the "Perplexity AI" label.
      name: "Perplexity AI", domain: "perplexity.ai", pricing: "Freemium", url: "https://perplexity.ai",
      tagline: "AI search that cites every answer",
      pros: ["Real-time web search on every query", "Every claim is cited with sources", "Faster for research tasks", "Pro Search does deep multi-step research", "Clean, focused interface"],
      cons: ["Less capable at creative or generative tasks", "Not ideal for writing or coding", "Answers limited by web sources", "Smaller context window"],
      bestFor: "Research, fact-checking, and any task where cited, accurate answers matter",
    },
    tool2: {
      slug: "chatgpt",
      tagline: "The world's most versatile AI assistant",
      pros: ["Far more versatile — writes, codes, analyses", "Better at creative and generative tasks", "Larger context window", "Can browse the web too", "Plugin ecosystem extends capabilities"],
      cons: ["Web browsing is optional, not default", "Citations less reliable", "Can hallucinate confidently", "Slower for pure research tasks"],
      bestFor: "Everything except pure research — writing, coding, analysis, brainstorming",
    },
    verdict: "Perplexity AI",
    verdictWinner: "tool1",
    verdictDetail: "For research specifically, Perplexity wins — it's faster, always cites sources, and is purpose-built for finding information. For everything else, ChatGPT is more capable. Use Perplexity to research, ChatGPT to create.",
  },
  "heygen-vs-synthesia": {
    category: "AI Video",
    tool1: {
      slug: "heygen",
      tagline: "AI avatar videos with realistic lip-sync",
      pros: ["Best-in-class lip-sync quality", "Video translation in 100+ languages", "Generous free tier (1 credit/month)", "Fast generation times", "Strong API for developers"],
      cons: ["Avatar quality varies by plan", "Limited customisation on free tier", "Less enterprise focus", "Newer company"],
      bestFor: "Creators, marketers, and developers needing realistic avatar videos at scale",
    },
    tool2: {
      slug: "synthesia",
      tagline: "Enterprise AI video for training and comms",
      pros: ["Trusted by 50,000+ companies", "Strong compliance and enterprise security", "Better customisation for brand videos", "Wider avatar library", "Robust template system"],
      cons: ["No free tier", "More expensive", "Slower iteration for creative work", "Less flexible for consumer use"],
      bestFor: "Enterprises producing training videos, internal communications, and compliance content",
    },
    verdict: "HeyGen",
    verdictWinner: "tool1",
    verdictDetail: "HeyGen wins on value — better lip-sync, a free tier, and faster generation. Synthesia wins for enterprise teams that need compliance, security, and a trusted vendor. For most creators and marketers, HeyGen is the better choice.",
  },
  "suno-vs-udio": {
    category: "AI Music",
    tool1: {
      slug: "suno",
      tagline: "Generate full songs with vocals from a text prompt",
      pros: ["Easiest to use — one prompt creates a full song", "Impressive vocal quality", "Great genre variety", "Free tier with daily credits", "Fastest results"],
      cons: ["Less control over individual elements", "Lyrics can be repetitive", "Limited stem export options", "Copyright questions still unresolved"],
      bestFor: "Quick full-song generation and creators who want results with minimal effort",
    },
    tool2: {
      slug: "udio",
      tagline: "Studio-quality AI music with more creative control",
      pros: ["Higher audio fidelity on many genres", "More granular prompt control", "Better for niche genres", "Section-by-section generation", "Strong community and inspiration feed"],
      cons: ["Slightly steeper learning curve", "Less consistent results", "Slower generation", "Smaller free tier"],
      bestFor: "Musicians and producers who want more control and higher audio quality",
    },
    verdict: "tie",
    verdictWinner: "tie",
    verdictDetail: "Both are excellent and improving rapidly. Suno is easier and faster for quick results. Udio often produces higher-fidelity audio with more creative control. Try both on the same prompt and pick whichever sounds better for your genre.",
  },
  "midjourney-vs-stable-diffusion": {
    category: "Image Generation",
    tool1: {
      slug: "midjourney",
      tagline: "Best image quality, no technical setup",
      pros: ["Highest aesthetic quality output", "No technical knowledge required", "Consistent, reliable results", "Active community and inspiration", "Frequent model updates"],
      cons: ["Paid only — no free tier", "No local/offline use", "Less control over fine details", "Closed source"],
      bestFor: "Anyone who wants the best-looking AI images without any technical setup",
    },
    tool2: {
      slug: "stable-diffusion",
      tagline: "Open-source image generation with unlimited control",
      pros: ["Completely free and open-source", "Run locally for total privacy", "Thousands of community fine-tuned models", "Full control via ComfyUI or A1111", "No usage limits when self-hosted"],
      cons: ["Requires technical setup", "Quality depends heavily on prompting skill", "Time-consuming to get great results", "Hardware requirements for local use"],
      bestFor: "Developers, researchers, and power users who want full control and no usage limits",
    },
    verdict: "Midjourney",
    verdictWinner: "tool1",
    verdictDetail: "Midjourney wins for output quality and ease of use. Stable Diffusion wins for cost, privacy, and unlimited customisation. Choose Midjourney if you want great results fast. Choose Stable Diffusion if you want total control and don't mind the setup.",
  },
  "notion-ai-vs-chatgpt": {
    category: "Writing & Productivity",
    tool1: {
      slug: "notion-ai",
      tagline: "AI built into your workspace",
      pros: ["Works directly inside your Notion pages", "Summarise, edit, and generate without switching tabs", "Understands context from your existing notes", "Ask AI about your whole workspace", "Seamless workflow integration"],
      cons: ["Only useful if you already use Notion", "Less capable than standalone AI tools", "Add-on cost on top of Notion subscription", "Limited to Notion's interface"],
      bestFor: "Notion users who want AI assistance without leaving their workspace",
    },
    tool2: {
      slug: "chatgpt",
      tagline: "The most capable standalone AI assistant",
      pros: ["Far more capable at complex tasks", "Better at long-form writing and reasoning", "Broader range of use cases", "More up-to-date knowledge with browsing", "Better value for money"],
      cons: ["Context-switching away from your notes", "Doesn't know your Notion content", "Separate interface to manage", "Less integrated into workflows"],
      bestFor: "Power users who want the most capable AI for writing, research, and complex tasks",
    },
    verdict: "ChatGPT",
    verdictWinner: "tool2",
    verdictDetail: "ChatGPT is significantly more capable. Notion AI wins only if staying inside Notion matters more than output quality. Most serious users keep ChatGPT for heavy lifting and use Notion AI for quick in-context edits.",
  },
  "surfer-seo-vs-clearscope": {
    category: "SEO Content Tools",
    tool1: {
      slug: "surfer-seo",
      tagline: "Write and optimise content that ranks on Google",
      pros: ["Real-time content editor with SEO score", "Built-in AI writer (Surfy)", "Keyword research and content planning", "SERP analyser for competitor insights", "More affordable entry price"],
      cons: ["Can over-optimise content", "Keyword stuffing risk if followed blindly", "Interface can feel overwhelming", "Accuracy varies by niche"],
      bestFor: "Content marketers who want an all-in-one tool for research, writing, and optimisation",
    },
    tool2: {
      slug: "clearscope",
      tagline: "The gold standard for content optimisation",
      pros: ["More accurate NLP analysis", "Cleaner, simpler interface", "Better Google Docs integration", "Trusted by larger enterprises", "More reliable content grades"],
      cons: ["No built-in AI writer", "More expensive", "Less keyword research functionality", "Fewer features overall"],
      bestFor: "Editorial teams and agencies who prioritise content quality and accuracy above all",
    },
    verdict: "Surfer SEO",
    verdictWinner: "tool1",
    verdictDetail: "Surfer SEO wins on value — you get keyword research, a content editor, and an AI writer in one tool at a lower price. Clearscope is more accurate and better loved by enterprise editorial teams who already have writers. For most, Surfer is the better starting point.",
  },
  "grammarly-vs-prowritingaid": {
    category: "Writing & Editing",
    tool1: {
      slug: "grammarly",
      tagline: "AI writing assistant that works everywhere",
      pros: ["Works across every app via browser extension", "Real-time suggestions as you type", "Tone detector and rewrite suggestions", "Generous free tier", "Excellent mobile keyboard"],
      cons: ["Surface-level style suggestions on free tier", "Can be overly aggressive with suggestions", "Less useful for long-form creative writing", "Premium features gated"],
      bestFor: "Anyone who writes across multiple apps and wants real-time grammar and tone help",
    },
    tool2: {
      slug: "prowritingaid",
      tagline: "Deep writing analysis for authors and professionals",
      pros: ["25+ in-depth writing reports", "Better for long-form and fiction writing", "Pacing, dialogue, and style analysis", "Scrivener integration", "One-time lifetime licence available"],
      cons: ["No real-time browser extension like Grammarly", "Slower to use — analysis based rather than inline", "Interface less polished", "Steeper learning curve"],
      bestFor: "Authors, novelists, and professionals who want deep analysis of long-form writing",
    },
    verdict: "Grammarly",
    verdictWinner: "tool1",
    verdictDetail: "Grammarly wins for everyday writing across all apps. ProWritingAid wins for authors doing deep work on long documents — its analysis is far more thorough. Most people need Grammarly. Writers working on books or long-form content should try ProWritingAid.",
  },
  "gemini-vs-claude": {
    category: "Writing & AI Assistants",
    tool1: {
      slug: "gemini",
      tagline: "Google's multimodal AI across its ecosystem",
      pros: ["Deep Google Workspace integration (Docs, Gmail, Sheets)", "Strong multimodal image and video understanding", "Large context window and fast responses", "Free tier is generous", "Real-time info via Google Search"],
      cons: ["Writing can feel less polished than Claude", "Occasional refusals on benign prompts", "Best features tied to Google ecosystem", "Consistency varies across model versions"],
      bestFor: "Google Workspace users who want AI inside the tools they already use",
    },
    tool2: {
      slug: "claude",
      tagline: "Anthropic's thoughtful AI for nuanced work",
      pros: ["Exceptional long-form and nuanced writing", "Handles very large documents natively", "Follows complex, multi-step instructions well", "Strong reasoning and low hallucination"],
      cons: ["No native image generation", "Smaller ecosystem and fewer integrations", "No built-in web browsing on lower tiers"],
      bestFor: "Long documents, careful writing, and complex reasoning tasks",
    },
    verdict: "Claude",
    verdictWinner: "tool2",
    verdictDetail: "For writing quality and careful reasoning, Claude leads. For Google-ecosystem integration and multimodal breadth, Gemini wins. Workspace-heavy users lean Gemini; writers and analysts lean Claude.",
  },
  "perplexity-vs-gemini": {
    category: "Research & Search",
    tool1: {
      slug: "perplexity",
      tagline: "AI answer engine with cited sources",
      pros: ["Every answer cites its sources", "Purpose-built for research and fact-finding", "Focus mode for academic and specific domains", "Fast, current web results"],
      cons: ["Weaker at long-form creative writing", "Fewer integrations than Gemini", "Best features behind Pro tier"],
      bestFor: "Research, fact-checking, and anyone who needs cited, current answers",
    },
    tool2: {
      slug: "gemini",
      tagline: "Google's multimodal AI across its ecosystem",
      pros: ["Deep Google integration and multimodal skills", "Handles creative and productivity tasks too", "Generous free tier", "Real-time Google Search grounding"],
      cons: ["Citations less transparent than Perplexity", "Can over-refuse benign prompts", "Best features tied to Google ecosystem"],
      bestFor: "General-purpose use with Google integration and multimodal needs",
    },
    verdict: "Perplexity",
    verdictWinner: "tool1",
    verdictDetail: "For research where sources matter, Perplexity's citations win. For all-round assistance and Google integration, Gemini is broader. Pick Perplexity to research, Gemini to do.",
  },
  "jasper-vs-writesonic": {
    category: "AI Copywriting",
    tool1: {
      slug: "jasper",
      tagline: "Enterprise AI writing for marketing teams",
      pros: ["Strong brand-voice and team features", "50+ marketing templates", "Polished, on-brand output", "Good integrations for marketing stacks"],
      cons: ["More expensive than most rivals", "Overkill for solo/light users", "No free plan, trial only"],
      bestFor: "Marketing teams that need on-brand content at scale",
    },
    tool2: {
      slug: "writesonic",
      tagline: "AI writer with built-in SEO optimization",
      pros: ["Built-in SEO optimization for blog posts", "More affordable than Jasper", "100+ templates", "Free tier to start"],
      cons: ["Brand-voice control weaker than Jasper", "Quality varies on long-form", "Interface can feel cluttered"],
      bestFor: "Bloggers and SMBs who want SEO-focused content on a budget",
    },
    verdict: "Jasper",
    verdictWinner: "tool1",
    verdictDetail: "Jasper wins for teams needing brand consistency and polish; Writesonic wins on price and built-in SEO. Choose Jasper for a marketing team, Writesonic for solo bloggers watching cost.",
  },
  "canva-ai-vs-adobe-firefly": {
    category: "AI Design",
    tool1: {
      slug: "canva-ai",
      tagline: "AI design tools for everyone",
      pros: ["Easiest for non-designers", "Huge template library plus AI generation", "Everything in one web app", "Generous free tier"],
      cons: ["Less control than pro tools", "Generic look if templates overused", "Advanced editing is limited"],
      bestFor: "Non-designers making social graphics, docs, and quick visuals",
    },
    tool2: {
      slug: "adobe-firefly",
      tagline: "Commercially-safe AI inside Adobe",
      pros: ["Trained on licensed, commercially-safe content", "Integrates with Photoshop and Illustrator", "Professional-grade control", "Strong generative fill and expand"],
      cons: ["Requires Adobe ecosystem familiarity", "Subscription cost", "Steeper learning curve than Canva"],
      bestFor: "Professional designers who need control and commercial safety",
    },
    verdict: "Depends on skill level",
    verdictWinner: "tie",
    verdictDetail: "Canva AI wins for speed and non-designers; Adobe Firefly wins for professionals needing control and licensed-content safety. Beginners pick Canva, pros pick Firefly.",
  },
  "leonardo-ai-vs-midjourney": {
    category: "AI Image Generation",
    tool1: {
      slug: "leonardo-ai",
      tagline: "Fine-tuned models for game and product art",
      pros: ["Fine-tuned models for consistent characters/assets", "Generous free daily credits", "Fine control over models and settings", "Great for game and product imagery"],
      cons: ["Slightly behind Midjourney on pure art quality", "More settings can overwhelm beginners", "Best output needs tuning"],
      bestFor: "Game artists, product teams, and consistent-asset workflows",
    },
    tool2: {
      slug: "midjourney",
      tagline: "The gold standard for AI art",
      pros: ["Best-in-class visual quality and aesthetics", "Excellent for concept art and mood", "Strong, active community", "Consistent, striking results"],
      cons: ["Paid-only, no free tier", "Less fine-grained control", "Historically Discord-based workflow"],
      bestFor: "Anyone who wants the most visually stunning AI art",
    },
    verdict: "Midjourney",
    verdictWinner: "tool2",
    verdictDetail: "Midjourney wins on raw art quality; Leonardo wins on control, free credits, and consistent assets. Pick Midjourney for beauty, Leonardo for repeatable production work.",
  },
  "ideogram-vs-midjourney": {
    category: "AI Image Generation",
    tool1: {
      slug: "ideogram",
      tagline: "AI images with readable text",
      pros: ["Renders legible text in images (logos, posters)", "Free tier available", "Good prompt adherence", "Strong for graphic design use cases"],
      cons: ["Art quality slightly below Midjourney", "Smaller community", "Fewer style controls"],
      bestFor: "Posters, logos, and any image that needs readable text",
    },
    tool2: {
      slug: "midjourney",
      tagline: "The gold standard for AI art",
      pros: ["Best-in-class visual quality", "Excellent aesthetics and concept art", "Large, active community"],
      cons: ["Struggles to render clean text", "Paid-only", "Less control over exact output"],
      bestFor: "Pure visual quality and artistic imagery",
    },
    verdict: "Depends on need",
    verdictWinner: "tie",
    verdictDetail: "Need readable text in the image? Ideogram wins clearly. Want the most beautiful art with no text? Midjourney. They solve different problems, so many designers use both.",
  },
  "gamma-vs-beautiful-ai": {
    category: "AI Presentations",
    tool1: {
      slug: "gamma",
      tagline: "Generate full decks from a prompt",
      pros: ["Fastest way to a complete deck", "Flexible cards that work as web pages too", "Good free tier", "Clean, modern default styling"],
      cons: ["Less template variety than Beautiful.ai", "Fine layout control is limited", "Exports can need cleanup"],
      bestFor: "Speed — turning an idea into a styled deck in minutes",
    },
    tool2: {
      slug: "beautiful-ai",
      tagline: "Polished slides with smart design",
      pros: ["Auto-applies professional design rules", "Very polished, consistent look", "Good for brand-consistent decks", "Team features"],
      cons: ["Slower than Gamma for first draft", "Subscription required for full use", "Less flexible than open canvases"],
      bestFor: "Polished, on-brand presentations for business use",
    },
    verdict: "Gamma",
    verdictWinner: "tool1",
    verdictDetail: "Gamma wins for speed and getting a full deck instantly; Beautiful.ai wins for consistent, polished design. Draft fast with Gamma, polish for stakeholders with Beautiful.ai.",
  },
  "otter-ai-vs-fireflies-ai": {
    category: "Meeting Notes",
    tool1: {
      slug: "otter-ai",
      tagline: "Real-time transcription and notes",
      pros: ["Excellent live transcription", "Strong free tier", "Clean, searchable notes", "Good mobile app for in-person meetings"],
      cons: ["Summaries less action-oriented than Fireflies", "Integrations narrower", "Speaker labeling can slip"],
      bestFor: "Live transcription and note-taking, including in-person meetings",
    },
    tool2: {
      slug: "fireflies-ai",
      tagline: "AI meeting assistant that joins calls",
      pros: ["Joins and records calls automatically", "Strong action-item and summary extraction", "Wide CRM and app integrations", "Good search across meetings"],
      cons: ["Free tier more limited", "Bot-joins-call setup for some tools", "Occasional transcription errors"],
      bestFor: "Teams that want automatic call recording and CRM-synced summaries",
    },
    verdict: "Depends on use",
    verdictWinner: "tie",
    verdictDetail: "Otter wins for live/in-person transcription and its free tier; Fireflies wins for auto-joining calls and action-item extraction with CRM sync. Solo note-takers lean Otter, sales/teams lean Fireflies.",
  },
  "quillbot-vs-grammarly": {
    category: "Writing & Editing",
    tool1: {
      slug: "quillbot",
      tagline: "Paraphrasing and rewriting tool",
      pros: ["Best-in-class paraphrasing and rewriting", "Summarizer and citation tools", "Affordable", "Good for students and researchers"],
      cons: ["Weaker real-time grammar than Grammarly", "Fewer style/tone features", "Narrower use case"],
      bestFor: "Paraphrasing, summarizing, and rewording existing text",
    },
    tool2: {
      slug: "grammarly",
      tagline: "Real-time grammar, clarity, and tone",
      pros: ["Excellent real-time grammar and clarity", "Works everywhere via browser extension", "Tone and style suggestions", "Strong free tier"],
      cons: ["Paraphrasing weaker than Quillbot", "Premium needed for advanced features", "Can over-suggest edits"],
      bestFor: "Everyday grammar, clarity, and tone across all your writing",
    },
    verdict: "Depends on task",
    verdictWinner: "tie",
    verdictDetail: "Grammarly wins for catching errors and improving clarity as you write; Quillbot wins for rewording and summarizing. They complement each other — many writers use both.",
  },
  "tabnine-vs-github-copilot": {
    category: "AI Coding",
    tool1: {
      slug: "tabnine",
      tagline: "Privacy-first AI code completion",
      pros: ["Runs locally/privately for security", "Can train on your own codebase", "Good for regulated/enterprise teams", "Multi-IDE support"],
      cons: ["Completions less powerful than Copilot", "Smaller model ecosystem", "Best features on paid tiers"],
      bestFor: "Privacy-conscious teams that can't send code to the cloud",
    },
    tool2: {
      slug: "github-copilot",
      tagline: "AI pair programmer in your editor",
      pros: ["Best-in-class code suggestions", "Deep GitHub and VS Code integration", "Chat and multi-file features", "Huge training base"],
      cons: ["Cloud-based — code leaves your machine", "Subscription cost", "Occasional confidently-wrong suggestions"],
      bestFor: "Most developers wanting the strongest everyday autocomplete",
    },
    verdict: "GitHub Copilot",
    verdictWinner: "tool2",
    verdictDetail: "Copilot wins on raw suggestion quality and integration; Tabnine wins when privacy and on-prem control are non-negotiable. Pick Copilot for power, Tabnine for security requirements.",
  },
  "taskade-vs-notion-ai": {
    category: "Productivity",
    tool1: {
      slug: "taskade",
      tagline: "Tasks, notes, and AI agents in one",
      pros: ["Built-in AI agents that act inside projects", "Multiple views (list, board, mind map)", "Generous free tier", "Real-time collaboration"],
      cons: ["Smaller ecosystem than Notion", "Fewer third-party integrations", "Less powerful databases"],
      bestFor: "Solo users and small teams wanting tasks plus AI in one place",
    },
    tool2: {
      slug: "notion-ai",
      tagline: "AI built into the Notion workspace",
      pros: ["Powerful databases and flexibility", "AI integrated into a mature workspace", "Huge template and integration ecosystem", "Great for docs and wikis"],
      cons: ["AI is a paid add-on", "Steeper learning curve", "Can get complex to organize"],
      bestFor: "Teams already building docs and wikis in Notion",
    },
    verdict: "Depends on setup",
    verdictWinner: "tie",
    verdictDetail: "Notion AI wins if you want a powerful, flexible workspace with AI layered in; Taskade wins for lightweight tasks with AI agents built in. Notion for depth, Taskade for speed.",
  },
  "sudowrite-vs-jasper": {
    category: "AI Writing",
    tool1: {
      slug: "sudowrite",
      tagline: "AI writing built for fiction",
      pros: ["Purpose-built for novelists and fiction", "Story Bible keeps long narratives consistent", "Describe and Brainstorm creative tools", "Preserves the author's voice"],
      cons: ["Not built for marketing copy", "Subscription by word credits", "Learning curve for its tools"],
      bestFor: "Novelists and creative writers working on long-form fiction",
    },
    tool2: {
      slug: "jasper",
      tagline: "Enterprise AI writing for marketing",
      pros: ["Built for marketing and business copy", "Brand voice and 50+ templates", "Team and workflow features", "Polished, on-brand output"],
      cons: ["Not designed for fiction", "Expensive for individuals", "No free plan"],
      bestFor: "Marketing teams producing business and ad copy",
    },
    verdict: "Depends on genre",
    verdictWinner: "tie",
    verdictDetail: "Writing a novel? Sudowrite wins decisively. Writing marketing copy? Jasper wins. They target completely different writers, so the choice is about what you write.",
  },
  "dall-e-3-vs-stable-diffusion": {
    category: "AI Image Generation",
    tool1: {
      slug: "dall-e-3",
      tagline: "OpenAI's image model built into ChatGPT",
      pros: ["Excellent prompt understanding via ChatGPT integration", "Great at following complex, detailed instructions", "Strong text rendering in images", "Easiest onboarding, no separate setup"],
      cons: ["Less stylistic control than Stable Diffusion", "No local/offline option", "Can be conservative on certain content"],
      bestFor: "Anyone who wants great results with zero setup, right inside ChatGPT",
    },
    tool2: {
      slug: "stable-diffusion",
      tagline: "Open-source, fully customizable image AI",
      pros: ["Free and open-source, runs locally", "Massive ecosystem of custom models and styles", "Full control over every parameter", "No content restrictions from a central provider"],
      cons: ["Steep learning curve for non-technical users", "Requires decent hardware or a paid host", "Quality depends heavily on chosen model/settings"],
      bestFor: "Users who want full control, custom styles, or local/offline generation",
    },
    verdict: "Depends on need",
    verdictWinner: "tie",
    verdictDetail: "DALL·E 3 wins for ease and instruction-following via ChatGPT; Stable Diffusion wins for control, customization, and cost at scale. Casual users pick DALL·E 3, power users and hobbyists pick Stable Diffusion.",
  },
  "krea-vs-midjourney": {
    category: "AI Image Generation",
    tool1: {
      slug: "krea",
      tagline: "Real-time AI image generation and upscaling",
      pros: ["Real-time generation as you type or sketch", "Strong upscaling and enhancement tools", "Good for rapid iteration and mood exploration", "Useful free tier"],
      cons: ["Less polished final aesthetic than Midjourney", "Smaller style range", "Newer, smaller community"],
      bestFor: "Rapid ideation, sketch-to-image, and real-time creative exploration",
    },
    tool2: {
      slug: "midjourney",
      tagline: "The gold standard for AI art",
      pros: ["Best-in-class visual quality and aesthetics", "Excellent for concept art and mood", "Strong, active community"],
      cons: ["No real-time generation", "Paid-only, no free tier", "Discord-based workflow history"],
      bestFor: "Anyone who wants the most visually stunning finished AI art",
    },
    verdict: "Depends on stage",
    verdictWinner: "tie",
    verdictDetail: "Krea wins for real-time ideation and speed; Midjourney wins for final polished output. Many creators sketch ideas fast in Krea, then finish in Midjourney.",
  },
  "runway-vs-d-id": {
    category: "AI Video Generation",
    tool1: {
      slug: "runway",
      tagline: "Generative AI video from text and images",
      pros: ["Powerful text-to-video and image-to-video generation", "Strong camera and motion control", "Wide creative use cases beyond talking heads", "Active model updates (Gen-3/4)"],
      cons: ["Credits can get expensive at scale", "Learning curve for best results", "Output length still limited per generation"],
      bestFor: "Creative, cinematic video generation from prompts or images",
    },
    tool2: {
      slug: "d-id",
      tagline: "Talking-avatar videos from a photo and script",
      pros: ["Turns any photo into a talking avatar fast", "Simple script-to-video workflow", "Good for explainers and personalized outreach", "Affordable for short clips"],
      cons: ["Limited to talking-head style videos", "Can look uncanny with poor source photos", "Less creative range than Runway"],
      bestFor: "Turning a photo and script into a talking-head video quickly",
    },
    verdict: "Depends on use case",
    verdictWinner: "tie",
    verdictDetail: "Runway wins for creative, cinematic generation; D-ID wins specifically for fast talking-avatar videos from a photo. Pick based on whether you need a presenter or a scene.",
  },
  "pictory-vs-invideo-ai": {
    category: "AI Video Editing",
    tool1: {
      slug: "pictory",
      tagline: "Turn scripts and articles into videos",
      pros: ["Excellent at turning long text/scripts into video automatically", "Strong auto-captioning and highlight extraction", "Good stock footage and voice library", "Great for repurposing blog content"],
      cons: ["Less flexible for from-scratch creative video", "Templates can look generic", "Editing precision below manual tools"],
      bestFor: "Repurposing articles, scripts, and long-form content into video fast",
    },
    tool2: {
      slug: "invideo-ai",
      tagline: "Full videos generated from a single prompt",
      pros: ["Generates a complete video from one prompt, including scenes and voiceover", "Good template variety for social and marketing", "Built-in AI avatars and voices", "Fast for social-ready content"],
      cons: ["Less control over exact scene composition", "Stock footage matches can be hit-or-miss", "Best results need some prompt iteration"],
      bestFor: "Fast, prompt-to-finished-video for social and marketing content",
    },
    verdict: "Depends on source",
    verdictWinner: "tie",
    verdictDetail: "Pictory wins when you're starting from existing text/scripts; Invideo AI wins for generating a video from a single idea with no source material. Choose based on what you're starting with.",
  },
  "capcut-ai-vs-invideo-ai": {
    category: "AI Video Editing",
    tool1: {
      slug: "capcut-ai",
      tagline: "Free AI editing built for short-form video",
      pros: ["Completely free with powerful AI features", "Best-in-class for TikTok/Reels/Shorts style editing", "Huge template and effects library", "Mobile and desktop, very fast workflow"],
      cons: ["Less suited to long-form or corporate video", "Some features tied to TikTok's ecosystem", "Fewer 'generate whole video' capabilities"],
      bestFor: "Short-form social video editing, captions, and trending effects",
    },
    tool2: {
      slug: "invideo-ai",
      tagline: "Full videos generated from a single prompt",
      pros: ["Generates complete videos from a text prompt", "Better for longer marketing and explainer videos", "Built-in AI voiceover and avatars", "Good for business use cases"],
      cons: ["Paid for full features", "Less optimized specifically for short-form trends", "Iteration needed for best output"],
      bestFor: "Prompt-to-video generation for marketing and explainer content",
    },
    verdict: "CapCut AI",
    verdictWinner: "tool1",
    verdictDetail: "For short-form social content, CapCut AI's free tools and trend-aware editing win easily. For generating longer marketing videos from a prompt, Invideo AI is the better fit.",
  },
  "d-id-vs-heygen": {
    category: "AI Avatar Video",
    tool1: {
      slug: "d-id",
      tagline: "Talking-avatar videos from a photo and script",
      pros: ["Works from a single static photo", "Fast, simple script-to-video workflow", "Affordable for short clips", "Good voice library selection"],
      cons: ["Avatar realism below HeyGen's dedicated avatars", "Limited customization of expressions", "Best for short, simple clips"],
      bestFor: "Quick talking-head videos from any photo",
    },
    tool2: {
      slug: "heygen",
      tagline: "Professional AI avatars for business video",
      pros: ["More realistic, professional-grade avatars", "Custom avatar creation from your own footage", "Strong for training, sales, and localized video", "Multi-language dubbing built in"],
      cons: ["Pricier than D-ID for equivalent output", "Custom avatar setup takes more effort", "Overkill for one-off simple clips"],
      bestFor: "Professional business video, training content, and custom branded avatars",
    },
    verdict: "HeyGen",
    verdictWinner: "tool2",
    verdictDetail: "HeyGen wins for professional, branded avatar video and multi-language business content. D-ID wins for quick, cheap talking-head clips from a single photo.",
  },
  "rytr-vs-writesonic": {
    category: "AI Writing",
    tool1: {
      slug: "rytr",
      tagline: "Affordable AI writing assistant",
      pros: ["Very affordable, generous free tier", "Good range of templates for everyday writing", "Simple, fast interface", "Solid for blogs, emails, and social copy"],
      cons: ["Less powerful for long-form SEO content", "Fewer advanced marketing features", "Output can need more editing than pricier tools"],
      bestFor: "Budget-conscious writers needing everyday content fast",
    },
    tool2: {
      slug: "writesonic",
      tagline: "AI writer with built-in SEO optimization",
      pros: ["Built-in SEO optimization for blog content", "100+ templates for varied use cases", "Stronger for long-form articles", "Free tier to start"],
      cons: ["Pricier at scale than Rytr", "Interface can feel busier", "Quality varies more on very long-form"],
      bestFor: "Bloggers and SMBs who want SEO-focused long-form content",
    },
    verdict: "Depends on budget",
    verdictWinner: "tie",
    verdictDetail: "Writesonic wins for SEO-focused long-form content; Rytr wins on price for everyday short-form writing. Heavy bloggers lean Writesonic, budget users lean Rytr.",
  },
  "rytr-vs-copy-ai": {
    category: "AI Copywriting",
    tool1: {
      slug: "rytr",
      tagline: "Affordable AI writing assistant",
      pros: ["Very affordable, generous free tier", "Broad template range for everyday copy", "Fast, simple to use", "Good for solo creators and small businesses"],
      cons: ["Less marketing-team-oriented than Copy.ai", "Fewer workflow/automation features", "Basic brand-voice controls"],
      bestFor: "Solo creators and small businesses on a budget",
    },
    tool2: {
      slug: "copy-ai",
      tagline: "AI copywriting for ads, emails, and social",
      pros: ["Strong workflow automation for marketing teams", "Good brand voice and multi-step campaigns", "Solid free tier", "Built for repeatable marketing processes"],
      cons: ["Best features behind paid plans", "Can be more than solo users need", "Learning curve for workflow features"],
      bestFor: "Marketing teams wanting repeatable, automated copy workflows",
    },
    verdict: "Depends on team size",
    verdictWinner: "tie",
    verdictDetail: "Copy.ai wins for teams wanting workflow automation and brand consistency; Rytr wins for solo users who want simple, affordable copy fast.",
  },
  "anyword-vs-copy-ai": {
    category: "AI Copywriting",
    tool1: {
      slug: "anyword",
      tagline: "Performance-predicting AI copywriter",
      pros: ["Predicts copy performance before you publish", "Data-driven templates from top performers", "Good for A/B testing ad and email copy", "Strong for performance marketers"],
      cons: ["Pricier than general copywriting tools", "Prediction score is a guide, not a guarantee", "Less general-purpose than Copy.ai"],
      bestFor: "Performance marketers who want data behind their copy choices",
    },
    tool2: {
      slug: "copy-ai",
      tagline: "AI copywriting for ads, emails, and social",
      pros: ["Broad general-purpose copywriting", "Strong workflow automation", "Good brand voice controls", "Generous free tier"],
      cons: ["No built-in performance prediction", "Templates less data-driven than Anyword", "Best features need paid plan"],
      bestFor: "General marketing copy across ads, emails, and social with workflow automation",
    },
    verdict: "Anyword",
    verdictWinner: "tool1",
    verdictDetail: "Anyword wins specifically for performance marketers who want predictive scoring on copy variants. Copy.ai wins as a more general-purpose, workflow-friendly copywriting tool.",
  },
  "capcut-ai-vs-descript": {
    category: "AI Video Editing",
    tool1: {
      slug: "capcut-ai",
      tagline: "Free AI editing built for short-form video",
      pros: ["Completely free with strong AI features", "Best for TikTok/Reels/Shorts style editing", "Huge effects and template library", "Very fast mobile-first workflow"],
      cons: ["Not built for podcast-style long-form editing", "Less powerful transcript-based editing", "Limited multi-track audio tools"],
      bestFor: "Fast, free short-form social video editing",
    },
    tool2: {
      slug: "descript",
      tagline: "Edit video and podcasts by editing text",
      pros: ["Edit video/audio by editing a text transcript", "Excellent for podcasts and talking-head content", "Overdub and filler-word removal", "Strong for long-form spoken content"],
      cons: ["Less optimized for short-form trend editing", "Steeper learning curve than CapCut", "Paid plans needed for full features"],
      bestFor: "Podcast and long-form talking-head editing via transcript",
    },
    verdict: "Depends on content type",
    verdictWinner: "tie",
    verdictDetail: "CapCut AI wins for free, fast short-form social editing. Descript wins decisively for podcasts and long-form spoken content edited by text. Very different jobs, both free to start.",
  },
  "krea-vs-leonardo-ai": {
    category: "AI Image Generation",
    tool1: {
      slug: "krea",
      tagline: "Real-time AI image generation and upscaling",
      pros: ["Real-time generation and iteration", "Strong upscaling and enhancement", "Good for fast mood and concept exploration", "Useful free tier"],
      cons: ["Less fine-grained model control than Leonardo", "Smaller style/model library", "Newer platform, smaller community"],
      bestFor: "Fast, real-time creative exploration and upscaling",
    },
    tool2: {
      slug: "leonardo-ai",
      tagline: "Fine-tuned models for game and product art",
      pros: ["Fine-tuned models for consistent characters and assets", "Generous free daily credits", "Strong control via Elements and negative prompts", "Great for game and product imagery"],
      cons: ["No real-time generation mode", "More settings can overwhelm beginners", "Best output needs some tuning"],
      bestFor: "Game artists, product teams, and consistent-asset production work",
    },
    verdict: "Depends on need",
    verdictWinner: "tie",
    verdictDetail: "Krea wins for real-time speed and upscaling; Leonardo wins for controlled, consistent production art with fine-tuned models. Explorers pick Krea, production teams pick Leonardo.",
  },
  "zapier-ai-vs-notion-ai": {
    category: "AI Productivity",
    tool1: {
      slug: "zapier-ai",
      tagline: "AI-powered automation across your apps",
      pros: ["Connects thousands of apps with AI-assisted automation", "Great for automating repetitive cross-app tasks", "AI steps for summarizing, classifying, and drafting", "Free tier to start"],
      cons: ["Not a workspace/docs tool itself", "Complex workflows can be tricky to debug", "Costs scale with task volume"],
      bestFor: "Automating tasks and data flow between the apps you already use",
    },
    tool2: {
      slug: "notion-ai",
      tagline: "AI built into the Notion workspace",
      pros: ["AI integrated into a mature docs/database workspace", "Great for writing, summarizing, and organizing knowledge", "Huge template and integration ecosystem", "Familiar to teams already using Notion"],
      cons: ["AI is a paid add-on", "Not built for cross-app task automation", "Steeper learning curve than simple tools"],
      bestFor: "Teams that want AI-assisted docs, wikis, and databases in one workspace",
    },
    verdict: "Depends on job",
    verdictWinner: "tie",
    verdictDetail: "They solve different problems: Zapier AI automates actions between apps; Notion AI enhances a docs/knowledge workspace. Many teams use both together rather than choosing one.",
  },
};

export function generateStaticParams() {
  return Object.keys(COMPARISONS).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const data = COMPARISONS[slug];
  if (!data) return { title: "Not Found" };
  const t1 = resolveTool(data.tool1);
  const t2 = resolveTool(data.tool2);
  const title = `${t1.name} vs ${t2.name} (${new Date().getFullYear()}) — Which is Better?`;
  const description = `${t1.name} vs ${t2.name}: a complete side-by-side comparison of features, pricing, pros and cons. Find out which is best for your use case.`;
  return {
    title,
    description,
    openGraph: { title, description, type: "website" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function ComparePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = COMPARISONS[slug];
  if (!data) notFound();

  const { verdict, verdictWinner, verdictDetail } = data;
  const tool1 = resolveTool(data.tool1);
  const tool2 = resolveTool(data.tool2);

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `Is ${tool1.name} better than ${tool2.name}?`,
        acceptedAnswer: { "@type": "Answer", text: verdictDetail },
      },
      {
        "@type": "Question",
        name: `What is ${tool1.name} best for?`,
        acceptedAnswer: { "@type": "Answer", text: tool1.bestFor },
      },
      {
        "@type": "Question",
        name: `What is ${tool2.name} best for?`,
        acceptedAnswer: { "@type": "Answer", text: tool2.bestFor },
      },
      {
        "@type": "Question",
        name: `Is ${tool1.name} free?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: tool1.pricing === "Free" ? `Yes, ${tool1.name} is completely free.` : tool1.pricing === "Freemium" ? `${tool1.name} has a free plan with limited features.` : `${tool1.name} is a paid tool.`,
        },
      },
      {
        "@type": "Question",
        name: `Is ${tool2.name} free?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: tool2.pricing === "Free" ? `Yes, ${tool2.name} is completely free.` : tool2.pricing === "Freemium" ? `${tool2.name} has a free plan with limited features.` : `${tool2.name} is a paid tool.`,
        },
      },
    ],
  };

  return (
    <div className="flex flex-col min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <SiteHeader active="/compare" />

      <main className="v2-page">
        <div className="v2-pagehead">
          <div className="v2-crumb">
            <Link href="/">HOME</Link>
            <i>//</i>
            <Link href="/compare">COMPARE</Link>
            <i>//</i>
            <span className="v2-crumb-cur">{tool1.name} VS {tool2.name}</span>
          </div>
          <h1 className="v2-pagetitle">{tool1.name} <span className="v2-tred">VS</span> {tool2.name}</h1>
          <p className="v2-pagelead">A complete side-by-side engagement — features, pricing, pros, cons, and a clear verdict.</p>
          <div className="v2-readbar">
            <span className="flex items-center gap-2"><i className="v2-dot v2-dot-red" /> {data.category.toUpperCase()}</span>
          </div>
        </div>

        {/* Side-by-side VS cards */}
        <div className="v2-vsgrid">
          {[tool1, tool2].map((tool, i) => {
            const isWinner = (i === 0 && verdictWinner === "tool1") || (i === 1 && verdictWinner === "tool2");
            return (
              <div key={tool.name} className={`v2-panel v2-vscard${isWinner ? " is-win" : ""}`}>
                <i className="v2-cb v2-cb-tl" /><i className="v2-cb v2-cb-tr" /><i className="v2-cb v2-cb-bl" /><i className="v2-cb v2-cb-br" />
                {isWinner && <span className="v2-vs-pick">◆ OUR PICK</span>}
                <div className="v2-vs-top">
                  <span className="v2-mark" style={{ width: 44, height: 44, flexShrink: 0 }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`https://www.google.com/s2/favicons?domain=${tool.domain}&sz=128`} alt={tool.name} width={26} height={26} />
                  </span>
                  <div>
                    <div className="v2-vs-name">{tool.name}</div>
                    <span className={`v2-pill v2-pill-${tool.pricing.toLowerCase()}`} style={{ marginTop: 4 }}>{tool.pricing}</span>
                  </div>
                </div>
                <p className="v2-vs-tag">{tool.tagline}</p>

                <p className="v2-vs-sub">Pros</p>
                <ul className="v2-vs-list">
                  {tool.pros.map((p) => (
                    <li key={p}><span className="v2-yes">+</span>{p}</li>
                  ))}
                </ul>

                <p className="v2-vs-sub">Cons</p>
                <ul className="v2-vs-list">
                  {tool.cons.map((c) => (
                    <li key={c}><span className="v2-no">−</span>{c}</li>
                  ))}
                </ul>

                <div className="v2-vs-bestfor">
                  <p className="v2-vs-sub" style={{ marginBottom: 5 }}>Best for</p>
                  <p className="v2-trow-desc" style={{ margin: 0 }}>{tool.bestFor}</p>
                </div>

                <a href={getToolUrl(tool.name, tool.url)} target="_blank" rel="sponsored noopener noreferrer"
                  className={`v2-vs-cta ${isWinner ? "v2-vs-cta-win" : "v2-vs-cta-alt"}`}>
                  Try {tool.name} ▸
                </a>
              </div>
            );
          })}
        </div>

        {/* Verdict */}
        <div className="v2-panel v2-verdict">
          <i className="v2-cb v2-cb-tl" /><i className="v2-cb v2-cb-tr" /><i className="v2-cb v2-cb-bl" /><i className="v2-cb v2-cb-br" />
          <p className="v2-verdict-h">▸ FINAL VERDICT</p>
          <h2 className="v2-verdict-title">
            {verdictWinner === "tie" ? "It's a tie — depends on your use case" : `${verdict} wins for most users`}
          </h2>
          <p>{verdictDetail}</p>
        </div>

        {/* More comparisons */}
        <p className="v2-seclabel">▦ MORE ENGAGEMENTS</p>
        <div className="v2-relgrid">
          {Object.entries(COMPARISONS)
            .filter(([s]) => s !== slug)
            .slice(0, 6)
            .map(([s, c]) => (
              <Link key={s} href={`/compare/${s}`} className="v2-relchip">
                {resolveTool(c.tool1).name} vs {resolveTool(c.tool2).name}
              </Link>
            ))}
        </div>

        <NewsletterSignup compact />
      </main>

      <SiteFooter />
    </div>
  );
}
