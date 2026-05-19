import { MetadataRoute } from "next";
import { TOOLS, slugify } from "@/lib/tools";

const BASE_URL = "https://howtousemyai.com";

const USE_CASES = [
  "writing", "video", "image-generation", "coding", "music",
  "research", "productivity", "marketing", "analytics", "presentations",
  "design", "customer-support", "hr", "finance",
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
      url: `${BASE_URL}/submit`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.4,
    },
    ...useCasePages,
    ...toolPages,
  ];
}
