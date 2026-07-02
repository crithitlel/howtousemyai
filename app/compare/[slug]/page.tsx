import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import SiteHeader from "../../components/SiteHeader";
import SiteFooter from "../../components/SiteFooter";
import NewsletterSignup from "../../components/NewsletterSignup";
import { TOOLS, slugify } from "@/lib/tools";

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
                  <p style={{ margin: 0, fontSize: 12.5, lineHeight: 1.5, color: "var(--ink-mid)" }}>{tool.bestFor}</p>
                </div>

                <a href={tool.url} target="_blank" rel="noopener noreferrer"
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
