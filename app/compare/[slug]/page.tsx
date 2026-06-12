import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import Logo from "../../components/Logo";

interface CompareTool {
  name: string;
  domain: string;
  icon: string;
  pricing: "Free" | "Freemium" | "Paid";
  tagline: string;
  pros: string[];
  cons: string[];
  bestFor: string;
  url: string;
}

interface Comparison {
  tool1: CompareTool;
  tool2: CompareTool;
  verdict: string;
  verdictWinner: "tool1" | "tool2" | "tie";
  verdictDetail: string;
  category: string;
}

const COMPARISONS: Record<string, Comparison> = {
  "chatgpt-vs-claude": {
    category: "Writing & AI Assistants",
    tool1: {
      name: "ChatGPT", domain: "openai.com", icon: "💬", pricing: "Freemium",
      tagline: "The world's most popular AI assistant",
      pros: ["Largest user base and community", "Excellent plugin and GPT ecosystem", "Strong at coding and structured tasks", "DALL-E 3 image generation built in", "Voice mode and mobile apps"],
      cons: ["Can be verbose and over-explain", "Knowledge cutoff without browsing", "GPT-4 rate-limited on free tier", "Less nuanced on sensitive topics"],
      bestFor: "General-purpose tasks, coding, and users who want the widest ecosystem",
      url: "https://chat.openai.com",
    },
    tool2: {
      name: "Claude", domain: "anthropic.com", icon: "🤖", pricing: "Freemium",
      tagline: "Anthropic's thoughtful AI for nuanced work",
      pros: ["200k context window handles huge documents", "More nuanced, careful writing style", "Better at following complex instructions", "Stronger reasoning and analysis", "Less prone to hallucination"],
      cons: ["Smaller ecosystem than ChatGPT", "No image generation", "Fewer integrations and plugins", "Less known outside tech circles"],
      bestFor: "Long documents, nuanced writing, and tasks requiring careful reasoning",
      url: "https://claude.ai",
    },
    verdict: "Claude",
    verdictWinner: "tool2",
    verdictDetail: "For pure writing quality and handling complex, nuanced tasks, Claude edges ahead. But if you want the broadest ecosystem, integrations, and image generation, ChatGPT wins. Most power users keep both.",
  },
  "chatgpt-vs-gemini": {
    category: "AI Assistants",
    tool1: {
      name: "ChatGPT", domain: "openai.com", icon: "💬", pricing: "Freemium",
      tagline: "The world's most popular AI assistant",
      pros: ["Best-in-class GPT-4o model", "Huge plugin and GPT store ecosystem", "DALL-E 3 image generation", "Excellent coding ability", "Strong track record and reliability"],
      cons: ["Not deeply integrated with Google services", "Separate app from existing workflows", "Can hallucinate confidently", "Rate limits on free tier"],
      bestFor: "Standalone AI tasks, coding, content creation, and users outside Google ecosystem",
      url: "https://chat.openai.com",
    },
    tool2: {
      name: "Gemini", domain: "gemini.google.com", icon: "✨", pricing: "Freemium",
      tagline: "Google's AI deeply integrated with Search and Workspace",
      pros: ["Native Google Search grounding", "Gmail, Docs, Drive integration", "1M token context window on Advanced", "Free tier is generous", "Best for Google Workspace users"],
      cons: ["Weaker coding than ChatGPT", "Less consistent quality", "Ecosystem still maturing", "Advanced tier is expensive"],
      bestFor: "Google Workspace users, research with cited sources, and Gmail/Docs workflows",
      url: "https://gemini.google.com",
    },
    verdict: "ChatGPT",
    verdictWinner: "tool1",
    verdictDetail: "ChatGPT leads on raw capability and consistency. Gemini wins if you live in Google Workspace — the integrations are genuinely useful. For everything else, ChatGPT is the stronger choice.",
  },
  "midjourney-vs-dall-e-3": {
    category: "Image Generation",
    tool1: {
      name: "Midjourney", domain: "midjourney.com", icon: "🎨", pricing: "Paid",
      tagline: "The gold standard for AI art quality",
      pros: ["Highest aesthetic quality of any AI image tool", "Exceptional at artistic and stylised images", "Active Discord community with inspiration", "v6 model is photorealistic", "Consistent character and style control"],
      cons: ["No free tier", "Discord-only interface (until recently)", "Less accurate at following exact text prompts", "Can't generate images with accurate text"],
      bestFor: "Artists, designers, and anyone who prioritises image quality over everything else",
      url: "https://midjourney.com",
    },
    tool2: {
      name: "DALL-E 3", domain: "openai.com", icon: "🖼️", pricing: "Freemium",
      tagline: "OpenAI's image model integrated into ChatGPT",
      pros: ["Excellent at following exact text prompts", "Integrated into ChatGPT for easy access", "Better at rendering text in images", "Free tier via ChatGPT", "Great for precise, literal image requests"],
      cons: ["Less artistic flair than Midjourney", "Lower aesthetic ceiling", "Limited fine-tuning control", "Slower generation"],
      bestFor: "Precise, literal images and users already using ChatGPT",
      url: "https://chatgpt.com",
    },
    verdict: "Midjourney",
    verdictWinner: "tool1",
    verdictDetail: "For pure image quality and artistic output, Midjourney wins clearly. DALL-E 3 is better when you need exact prompt adherence or have text in your image. If budget isn't a concern, Midjourney is the clear choice.",
  },
  "github-copilot-vs-cursor": {
    category: "AI Coding",
    tool1: {
      name: "GitHub Copilot", domain: "github.com", icon: "🐙", pricing: "Paid",
      tagline: "Microsoft's AI pair programmer inside your editor",
      pros: ["Works in VS Code, JetBrains, Vim, and more", "Deep GitHub and pull request integration", "Battle-tested by millions of developers", "Copilot Chat for code explanations", "Enterprise security and compliance options"],
      cons: ["Autocomplete-focused, not agentic", "Can't make multi-file changes autonomously", "Suggestions can feel generic", "Pricier than alternatives"],
      bestFor: "Developers who want reliable autocomplete across any editor or IDE",
      url: "https://github.com/features/copilot",
    },
    tool2: {
      name: "Cursor", domain: "cursor.com", icon: "⌨️", pricing: "Freemium",
      tagline: "The AI-first code editor that thinks in whole files",
      pros: ["Can edit entire files and multi-file changes", "Understands full codebase context", "Composer mode for agentic coding", "Faster for large refactors", "Free tier is generous"],
      cons: ["VS Code fork — switching cost for other editors", "Less stable than GitHub Copilot", "Codebase indexing can be slow", "Smaller company, less enterprise trust"],
      bestFor: "Developers who want AI that can plan and implement across the whole codebase",
      url: "https://cursor.com",
    },
    verdict: "Cursor",
    verdictWinner: "tool2",
    verdictDetail: "Cursor is the better tool for ambitious, agentic coding — writing whole features rather than completing single lines. GitHub Copilot wins on stability, IDE flexibility, and enterprise trust. Many developers use both.",
  },
  "jasper-vs-copy-ai": {
    category: "AI Writing & Copywriting",
    tool1: {
      name: "Jasper", domain: "jasper.ai", icon: "✍️", pricing: "Paid",
      tagline: "Enterprise AI writing for marketing teams",
      pros: ["50+ marketing-specific templates", "Brand voice settings keep content on-brand", "Campaigns feature for multi-channel content", "Integrates with Surfer SEO", "Strong enterprise support"],
      cons: ["Expensive — starts at $49/month", "Overkill for solo creators", "Steeper learning curve", "Output still needs editing"],
      bestFor: "Marketing teams producing high volumes of on-brand content",
      url: "https://jasper.ai",
    },
    tool2: {
      name: "Copy.ai", domain: "copy.ai", icon: "📣", pricing: "Freemium",
      tagline: "Fast AI copywriting for individuals and teams",
      pros: ["Generous free tier", "Faster for short-form copy", "Workflows for repeatable content processes", "Easier to get started", "Good for social and ad copy"],
      cons: ["Less brand control than Jasper", "Weaker long-form content", "Output can feel templated", "Fewer enterprise features"],
      bestFor: "Individuals and small teams who need fast short-form copy without the enterprise price tag",
      url: "https://copy.ai",
    },
    verdict: "tie",
    verdictWinner: "tie",
    verdictDetail: "It depends on your budget and scale. Jasper is worth it for marketing teams needing brand consistency at volume. Copy.ai is the smarter choice for solopreneurs and small teams — the free tier alone covers most use cases.",
  },
  "perplexity-vs-chatgpt": {
    category: "Research & AI Search",
    tool1: {
      name: "Perplexity AI", domain: "perplexity.ai", icon: "🔍", pricing: "Freemium",
      tagline: "AI search that cites every answer",
      pros: ["Real-time web search on every query", "Every claim is cited with sources", "Faster for research tasks", "Pro Search does deep multi-step research", "Clean, focused interface"],
      cons: ["Less capable at creative or generative tasks", "Not ideal for writing or coding", "Answers limited by web sources", "Smaller context window"],
      bestFor: "Research, fact-checking, and any task where cited, accurate answers matter",
      url: "https://perplexity.ai",
    },
    tool2: {
      name: "ChatGPT", domain: "openai.com", icon: "💬", pricing: "Freemium",
      tagline: "The world's most versatile AI assistant",
      pros: ["Far more versatile — writes, codes, analyses", "Better at creative and generative tasks", "Larger context window", "Can browse the web too", "Plugin ecosystem extends capabilities"],
      cons: ["Web browsing is optional, not default", "Citations less reliable", "Can hallucinate confidently", "Slower for pure research tasks"],
      bestFor: "Everything except pure research — writing, coding, analysis, brainstorming",
      url: "https://chat.openai.com",
    },
    verdict: "Perplexity AI",
    verdictWinner: "tool1",
    verdictDetail: "For research specifically, Perplexity wins — it's faster, always cites sources, and is purpose-built for finding information. For everything else, ChatGPT is more capable. Use Perplexity to research, ChatGPT to create.",
  },
  "heygen-vs-synthesia": {
    category: "AI Video",
    tool1: {
      name: "HeyGen", domain: "heygen.com", icon: "🎬", pricing: "Freemium",
      tagline: "AI avatar videos with realistic lip-sync",
      pros: ["Best-in-class lip-sync quality", "Video translation in 100+ languages", "Generous free tier (1 credit/month)", "Fast generation times", "Strong API for developers"],
      cons: ["Avatar quality varies by plan", "Limited customisation on free tier", "Less enterprise focus", "Newer company"],
      bestFor: "Creators, marketers, and developers needing realistic avatar videos at scale",
      url: "https://heygen.com",
    },
    tool2: {
      name: "Synthesia", domain: "synthesia.io", icon: "🎥", pricing: "Paid",
      tagline: "Enterprise AI video for training and comms",
      pros: ["Trusted by 50,000+ companies", "Strong compliance and enterprise security", "Better customisation for brand videos", "Wider avatar library", "Robust template system"],
      cons: ["No free tier", "More expensive", "Slower iteration for creative work", "Less flexible for consumer use"],
      bestFor: "Enterprises producing training videos, internal communications, and compliance content",
      url: "https://synthesia.io",
    },
    verdict: "HeyGen",
    verdictWinner: "tool1",
    verdictDetail: "HeyGen wins on value — better lip-sync, a free tier, and faster generation. Synthesia wins for enterprise teams that need compliance, security, and a trusted vendor. For most creators and marketers, HeyGen is the better choice.",
  },
  "suno-vs-udio": {
    category: "AI Music",
    tool1: {
      name: "Suno", domain: "suno.ai", icon: "🎵", pricing: "Freemium",
      tagline: "Generate full songs with vocals from a text prompt",
      pros: ["Easiest to use — one prompt creates a full song", "Impressive vocal quality", "Great genre variety", "Free tier with daily credits", "Fastest results"],
      cons: ["Less control over individual elements", "Lyrics can be repetitive", "Limited stem export options", "Copyright questions still unresolved"],
      bestFor: "Quick full-song generation and creators who want results with minimal effort",
      url: "https://suno.ai",
    },
    tool2: {
      name: "Udio", domain: "udio.com", icon: "🎶", pricing: "Freemium",
      tagline: "Studio-quality AI music with more creative control",
      pros: ["Higher audio fidelity on many genres", "More granular prompt control", "Better for niche genres", "Section-by-section generation", "Strong community and inspiration feed"],
      cons: ["Slightly steeper learning curve", "Less consistent results", "Slower generation", "Smaller free tier"],
      bestFor: "Musicians and producers who want more control and higher audio quality",
      url: "https://udio.com",
    },
    verdict: "tie",
    verdictWinner: "tie",
    verdictDetail: "Both are excellent and improving rapidly. Suno is easier and faster for quick results. Udio often produces higher-fidelity audio with more creative control. Try both on the same prompt and pick whichever sounds better for your genre.",
  },
  "midjourney-vs-stable-diffusion": {
    category: "Image Generation",
    tool1: {
      name: "Midjourney", domain: "midjourney.com", icon: "🎨", pricing: "Paid",
      tagline: "Best image quality, no technical setup",
      pros: ["Highest aesthetic quality output", "No technical knowledge required", "Consistent, reliable results", "Active community and inspiration", "Frequent model updates"],
      cons: ["Paid only — no free tier", "No local/offline use", "Less control over fine details", "Closed source"],
      bestFor: "Anyone who wants the best-looking AI images without any technical setup",
      url: "https://midjourney.com",
    },
    tool2: {
      name: "Stable Diffusion", domain: "stability.ai", icon: "⚡", pricing: "Free",
      tagline: "Open-source image generation with unlimited control",
      pros: ["Completely free and open-source", "Run locally for total privacy", "Thousands of community fine-tuned models", "Full control via ComfyUI or A1111", "No usage limits when self-hosted"],
      cons: ["Requires technical setup", "Quality depends heavily on prompting skill", "Time-consuming to get great results", "Hardware requirements for local use"],
      bestFor: "Developers, researchers, and power users who want full control and no usage limits",
      url: "https://stability.ai/stable-image",
    },
    verdict: "Midjourney",
    verdictWinner: "tool1",
    verdictDetail: "Midjourney wins for output quality and ease of use. Stable Diffusion wins for cost, privacy, and unlimited customisation. Choose Midjourney if you want great results fast. Choose Stable Diffusion if you want total control and don't mind the setup.",
  },
  "notion-ai-vs-chatgpt": {
    category: "Writing & Productivity",
    tool1: {
      name: "Notion AI", domain: "notion.so", icon: "🗂️", pricing: "Freemium",
      tagline: "AI built into your workspace",
      pros: ["Works directly inside your Notion pages", "Summarise, edit, and generate without switching tabs", "Understands context from your existing notes", "Ask AI about your whole workspace", "Seamless workflow integration"],
      cons: ["Only useful if you already use Notion", "Less capable than standalone AI tools", "Add-on cost on top of Notion subscription", "Limited to Notion's interface"],
      bestFor: "Notion users who want AI assistance without leaving their workspace",
      url: "https://notion.so/product/ai",
    },
    tool2: {
      name: "ChatGPT", domain: "openai.com", icon: "💬", pricing: "Freemium",
      tagline: "The most capable standalone AI assistant",
      pros: ["Far more capable at complex tasks", "Better at long-form writing and reasoning", "Broader range of use cases", "More up-to-date knowledge with browsing", "Better value for money"],
      cons: ["Context-switching away from your notes", "Doesn't know your Notion content", "Separate interface to manage", "Less integrated into workflows"],
      bestFor: "Power users who want the most capable AI for writing, research, and complex tasks",
      url: "https://chat.openai.com",
    },
    verdict: "ChatGPT",
    verdictWinner: "tool2",
    verdictDetail: "ChatGPT is significantly more capable. Notion AI wins only if staying inside Notion matters more than output quality. Most serious users keep ChatGPT for heavy lifting and use Notion AI for quick in-context edits.",
  },
  "surfer-seo-vs-clearscope": {
    category: "SEO Content Tools",
    tool1: {
      name: "Surfer SEO", domain: "surferseo.com", icon: "🏄", pricing: "Paid",
      tagline: "Write and optimise content that ranks on Google",
      pros: ["Real-time content editor with SEO score", "Built-in AI writer (Surfy)", "Keyword research and content planning", "SERP analyser for competitor insights", "More affordable entry price"],
      cons: ["Can over-optimise content", "Keyword stuffing risk if followed blindly", "Interface can feel overwhelming", "Accuracy varies by niche"],
      bestFor: "Content marketers who want an all-in-one tool for research, writing, and optimisation",
      url: "https://surferseo.com",
    },
    tool2: {
      name: "Clearscope", domain: "clearscope.io", icon: "📈", pricing: "Paid",
      tagline: "The gold standard for content optimisation",
      pros: ["More accurate NLP analysis", "Cleaner, simpler interface", "Better Google Docs integration", "Trusted by larger enterprises", "More reliable content grades"],
      cons: ["No built-in AI writer", "More expensive", "Less keyword research functionality", "Fewer features overall"],
      bestFor: "Editorial teams and agencies who prioritise content quality and accuracy above all",
      url: "https://clearscope.io",
    },
    verdict: "Surfer SEO",
    verdictWinner: "tool1",
    verdictDetail: "Surfer SEO wins on value — you get keyword research, a content editor, and an AI writer in one tool at a lower price. Clearscope is more accurate and better loved by enterprise editorial teams who already have writers. For most, Surfer is the better starting point.",
  },
  "grammarly-vs-prowritingaid": {
    category: "Writing & Editing",
    tool1: {
      name: "Grammarly", domain: "grammarly.com", icon: "📝", pricing: "Freemium",
      tagline: "AI writing assistant that works everywhere",
      pros: ["Works across every app via browser extension", "Real-time suggestions as you type", "Tone detector and rewrite suggestions", "Generous free tier", "Excellent mobile keyboard"],
      cons: ["Surface-level style suggestions on free tier", "Can be overly aggressive with suggestions", "Less useful for long-form creative writing", "Premium features gated"],
      bestFor: "Anyone who writes across multiple apps and wants real-time grammar and tone help",
      url: "https://grammarly.com",
    },
    tool2: {
      name: "ProWritingAid", domain: "prowritingaid.com", icon: "📋", pricing: "Freemium",
      tagline: "Deep writing analysis for authors and professionals",
      pros: ["25+ in-depth writing reports", "Better for long-form and fiction writing", "Pacing, dialogue, and style analysis", "Scrivener integration", "One-time lifetime licence available"],
      cons: ["No real-time browser extension like Grammarly", "Slower to use — analysis based rather than inline", "Interface less polished", "Steeper learning curve"],
      bestFor: "Authors, novelists, and professionals who want deep analysis of long-form writing",
      url: "https://prowritingaid.com",
    },
    verdict: "Grammarly",
    verdictWinner: "tool1",
    verdictDetail: "Grammarly wins for everyday writing across all apps. ProWritingAid wins for authors doing deep work on long documents — its analysis is far more thorough. Most people need Grammarly. Writers working on books or long-form content should try ProWritingAid.",
  },
};

const PRICING_STYLES: Record<string, string> = {
  Free: "bg-green-50 text-green-700",
  Freemium: "bg-[#142a4d] text-[#1877F2]",
  Paid: "bg-[#3a1524] text-[#ff6b85]",
};

export function generateStaticParams() {
  return Object.keys(COMPARISONS).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const data = COMPARISONS[slug];
  if (!data) return { title: "Not Found" };
  const title = `${data.tool1.name} vs ${data.tool2.name} (${new Date().getFullYear()}) — Which is Better?`;
  const description = `${data.tool1.name} vs ${data.tool2.name}: a complete side-by-side comparison of features, pricing, pros and cons. Find out which is best for your use case.`;
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

  const { tool1, tool2, verdict, verdictWinner, verdictDetail } = data;

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
    <div className="flex flex-col min-h-screen bg-[#101b32]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <header className="sticky top-0 z-20 bg-[#101b32] border-b border-[#233150] px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <Logo size={28} />
            <span className="font-semibold text-[#1877F2] text-sm tracking-tight">HowToUseMyAI</span>
          </Link>
          <span className="text-xs text-[#93a4c3] bg-[#0d1729] border border-[#233150] px-3 py-1 rounded-full">{data.category}</span>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-10">

        {/* Breadcrumb */}
        <div className="text-xs text-[#93a4c3] mb-6 flex items-center gap-1.5">
          <Link href="/" className="hover:text-[#1877F2]">Home</Link>
          <span>›</span>
          <Link href="/compare" className="hover:text-[#1877F2]">Compare</Link>
          <span>›</span>
          <span className="text-[#e9eef8]">{tool1.name} vs {tool2.name}</span>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-semibold text-[#e9eef8] mb-2" style={{ fontFamily: "var(--font-playfair), serif" }}>
          {tool1.name} vs {tool2.name}
        </h1>
        <p className="text-[#93a4c3] text-sm mb-10">
          A complete side-by-side comparison to help you pick the right tool.
        </p>

        {/* Side-by-side cards */}
        <div className="grid grid-cols-2 gap-5 mb-10">
          {[tool1, tool2].map((tool, i) => {
            const isWinner = (i === 0 && verdictWinner === "tool1") || (i === 1 && verdictWinner === "tool2");
            return (
              <div key={tool.name} className={`relative bg-[#101b32] border-2 rounded-2xl p-6 ${isWinner ? "border-[#1877F2]" : "border-[#233150]"}`}>
                {isWinner && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#1877F2] text-white text-[10px] font-bold px-3 py-1 rounded-full">
                    OUR PICK
                  </div>
                )}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-[#0d1729] border border-[#233150] flex items-center justify-center overflow-hidden">
                    <img src={`https://www.google.com/s2/favicons?domain=${tool.domain}&sz=64`} alt={tool.name} width={32} height={32} className="rounded object-contain" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-[#e9eef8]">{tool.name}</h2>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${PRICING_STYLES[tool.pricing]}`}>
                      {tool.pricing.toUpperCase()}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-[#93a4c3] mb-4 leading-relaxed">{tool.tagline}</p>

                <div className="mb-4">
                  <p className="text-[10px] font-bold text-[#e9eef8] uppercase tracking-wider mb-2">Pros</p>
                  <ul className="flex flex-col gap-1.5">
                    {tool.pros.map((p) => (
                      <li key={p} className="flex items-start gap-1.5 text-xs text-[#93a4c3]">
                        <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>{p}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mb-5">
                  <p className="text-[10px] font-bold text-[#e9eef8] uppercase tracking-wider mb-2">Cons</p>
                  <ul className="flex flex-col gap-1.5">
                    {tool.cons.map((c) => (
                      <li key={c} className="flex items-start gap-1.5 text-xs text-[#93a4c3]">
                        <span className="text-[#ff6b85] mt-0.5 flex-shrink-0">✕</span>{c}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-[#0d1729] rounded-lg p-3 mb-5">
                  <p className="text-[10px] font-bold text-[#e9eef8] uppercase tracking-wider mb-1">Best for</p>
                  <p className="text-xs text-[#93a4c3] leading-relaxed">{tool.bestFor}</p>
                </div>

                <a
                  href={tool.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`block text-center text-xs font-semibold py-2.5 rounded-lg transition-colors ${isWinner ? "bg-[#1877F2] text-white hover:bg-[#166FE5]" : "bg-[#101b32] border border-[#233150] text-[#e9eef8] hover:border-[#1877F2] hover:text-[#1877F2]"}`}
                >
                  Try {tool.name}
                </a>
              </div>
            );
          })}
        </div>

        {/* Verdict */}
        <div className="bg-[#10213d] border border-[#23406e] rounded-2xl p-6 mb-10">
          <p className="text-xs font-bold text-[#1877F2] uppercase tracking-wider mb-2">Our Verdict</p>
          <h2 className="text-lg font-bold text-[#e9eef8] mb-3">
            {verdictWinner === "tie" ? "It\'s a tie — depends on your use case" : `${verdict} wins for most users`}
          </h2>
          <p className="text-sm text-[#93a4c3] leading-relaxed">{verdictDetail}</p>
        </div>

        {/* More comparisons */}
        <div className="mb-10">
          <h2 className="text-sm font-semibold text-[#e9eef8] mb-4">More comparisons</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {Object.entries(COMPARISONS)
              .filter(([s]) => s !== slug)
              .slice(0, 6)
              .map(([s, c]) => (
                <Link
                  key={s}
                  href={`/compare/${s}`}
                  className="bg-[#0d1729] border border-[#233150] rounded-xl px-4 py-3 text-xs font-medium text-[#93a4c3] hover:border-[#1877F2] hover:text-[#1877F2] transition-all"
                >
                  {c.tool1.name} vs {c.tool2.name}
                </Link>
              ))}
          </div>
        </div>
      </main>

      <footer className="border-t border-[#233150] px-6 py-6">
        <div className="max-w-4xl mx-auto flex flex-wrap gap-4 justify-between items-center text-xs text-[#93a4c3]">
          <Link href="/" className="flex items-center gap-2">
            <Logo size={18} />
            <span>HowToUseMyAI</span>
          </Link>
          <Link href="/compare" className="hover:text-[#1877F2]">All Comparisons</Link>
          <Link href="/privacy" className="hover:text-[#1877F2]">Privacy</Link>
        </div>
      </footer>
    </div>
  );
}
