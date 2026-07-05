// COST CALCULATOR DATA — approximate starting monthly prices for popular
// paid tools, for the Stack Cost Calculator.
//
// IMPORTANT: these are ROUGH, TYPICAL starting prices for the lowest paid
// tier, not live pricing. Prices change often and vary by region/plan/annual
// billing. Every entry links to the tool's real pricing page — the
// calculator UI must always show a "verify current price" disclaimer and
// never claim these numbers are authoritative or current.

export interface PricedTool {
  name: string; // must match lib/tools.ts
  toolSlug: string; // for /tools/[slug] link
  monthlyUSD: number; // approx starting paid-tier price, monthly billing
  pricingUrl: string; // official pricing page
  note?: string; // e.g. "billed annually", "per seat"
}

export const PRICED_TOOLS: PricedTool[] = [
  { name: "ChatGPT", toolSlug: "chatgpt", monthlyUSD: 20, pricingUrl: "https://openai.com/chatgpt/pricing/" },
  { name: "Claude", toolSlug: "claude", monthlyUSD: 20, pricingUrl: "https://claude.ai/settings/billing" },
  { name: "Gemini", toolSlug: "gemini", monthlyUSD: 20, pricingUrl: "https://one.google.com/about/google-ai-plans/" },
  { name: "Perplexity", toolSlug: "perplexity", monthlyUSD: 20, pricingUrl: "https://www.perplexity.ai/pro" },
  { name: "Midjourney", toolSlug: "midjourney", monthlyUSD: 10, pricingUrl: "https://www.midjourney.com/account/", note: "basic plan" },
  { name: "Grammarly", toolSlug: "grammarly", monthlyUSD: 12, pricingUrl: "https://www.grammarly.com/premium", note: "often billed annually" },
  { name: "Jasper", toolSlug: "jasper", monthlyUSD: 39, pricingUrl: "https://www.jasper.ai/pricing" },
  { name: "Notion AI", toolSlug: "notion-ai", monthlyUSD: 10, pricingUrl: "https://www.notion.so/pricing", note: "add-on per member" },
  { name: "GitHub Copilot", toolSlug: "github-copilot", monthlyUSD: 10, pricingUrl: "https://github.com/features/copilot/plans" },
  { name: "Cursor", toolSlug: "cursor", monthlyUSD: 20, pricingUrl: "https://www.cursor.com/pricing" },
  { name: "ElevenLabs", toolSlug: "elevenlabs", monthlyUSD: 5, pricingUrl: "https://elevenlabs.io/pricing", note: "starter plan" },
  { name: "Runway", toolSlug: "runway", monthlyUSD: 12, pricingUrl: "https://runwayml.com/pricing" },
  { name: "Canva AI", toolSlug: "canva-ai", monthlyUSD: 13, pricingUrl: "https://www.canva.com/pricing/", note: "Canva Pro" },
  { name: "Gamma", toolSlug: "gamma", monthlyUSD: 8, pricingUrl: "https://gamma.app/pricing" },
  { name: "Descript", toolSlug: "descript", monthlyUSD: 12, pricingUrl: "https://www.descript.com/pricing" },
  { name: "Synthesia", toolSlug: "synthesia", monthlyUSD: 18, pricingUrl: "https://www.synthesia.io/pricing", note: "annual billing" },
  { name: "Surfer SEO", toolSlug: "surfer-seo", monthlyUSD: 89, pricingUrl: "https://surferseo.com/pricing/" },
  { name: "Semrush", toolSlug: "semrush", monthlyUSD: 117, pricingUrl: "https://www.semrush.com/prices/" },
  { name: "Leonardo.ai", toolSlug: "leonardo-ai", monthlyUSD: 10, pricingUrl: "https://leonardo.ai/pricing/" },
  { name: "Suno", toolSlug: "suno", monthlyUSD: 10, pricingUrl: "https://suno.com/pricing" },
  { name: "Superhuman", toolSlug: "superhuman", monthlyUSD: 30, pricingUrl: "https://superhuman.com/pricing" },
  { name: "Kagi", toolSlug: "kagi", monthlyUSD: 10, pricingUrl: "https://kagi.com/pricing" },
];

export const PRICED_TOOL_NAMES = PRICED_TOOLS.map((t) => t.name);
