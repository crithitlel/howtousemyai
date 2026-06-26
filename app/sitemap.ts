import { MetadataRoute } from "next";
import { TOOLS, slugify } from "@/lib/tools";
import { WORKFLOWS } from "@/lib/workflows";
import { ALL_TAGS, toolsByTag } from "@/lib/tags";

const BASE_URL = "https://howtousemyai.com";

const USE_CASES = [
  "writing", "coding", "image-generation", "video", "music",
  "research", "productivity", "marketing", "seo", "social-media",
  "design", "presentations", "data-analysis", "automation", "customer-support",
  "education", "translation", "audio", "sales", "email", "resume", "legal",
];

const COMPARE_SLUGS = [
  "chatgpt-vs-claude",
  "chatgpt-vs-gemini",
  "midjourney-vs-dall-e-3",
  "github-copilot-vs-cursor",
  "jasper-vs-copy-ai",
  "perplexity-vs-chatgpt",
  "heygen-vs-synthesia",
  "suno-vs-udio",
  "midjourney-vs-stable-diffusion",
  "notion-ai-vs-chatgpt",
  "surfer-seo-vs-clearscope",
  "grammarly-vs-prowritingaid",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const toolPages = TOOLS.map((tool) => ({
    url: `${BASE_URL}/tools/${slugify(tool.name)}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const useCasePages = USE_CASES.map((useCase) => ({
    url: `${BASE_URL}/best-ai-for/${useCase}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const comparePages = COMPARE_SLUGS.map((slug) => ({
    url: `${BASE_URL}/compare/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  // Workflow playbooks — the core differentiator; high-value how-to content.
  const workflowPages = WORKFLOWS.map((w) => ({
    url: `${BASE_URL}/workflows/${w.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  // Tag landing pages — only those that actually carry tools (mirror generateStaticParams).
  const tagPages = ALL_TAGS.filter((t) => toolsByTag(t.id).length > 0).map((t) => ({
    url: `${BASE_URL}/tags/${t.id}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${BASE_URL}/recommend`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/best-ai-for`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/tools`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/workflows`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/free`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/compare`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/submit`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.4,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/disclosure`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/privacy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.2,
    },
    {
      url: `${BASE_URL}/terms`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.2,
    },
    ...workflowPages,
    ...useCasePages,
    ...comparePages,
    ...tagPages,
    ...toolPages,
  ];
}
