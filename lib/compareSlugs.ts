import { slugify } from "./tools";

// Slugs of the hand-authored editorial comparison pages in /compare/[slug].
// Keep in sync with the COMPARISONS keys in app/compare/[slug]/page.tsx.
export const COMPARE_SLUGS = new Set<string>([
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
  "gemini-vs-claude",
  "perplexity-vs-gemini",
  "jasper-vs-writesonic",
  "canva-ai-vs-adobe-firefly",
  "leonardo-ai-vs-midjourney",
  "ideogram-vs-midjourney",
  "gamma-vs-beautiful-ai",
  "otter-ai-vs-fireflies-ai",
  "quillbot-vs-grammarly",
  "tabnine-vs-github-copilot",
  "taskade-vs-notion-ai",
  "sudowrite-vs-jasper",
]);

// Returns the editorial comparison slug for a pair of tool names if one
// exists (either ordering), otherwise null.
export function findCompareSlug(nameA: string, nameB: string): string | null {
  const a = slugify(nameA);
  const b = slugify(nameB);
  const f = `${a}-vs-${b}`;
  const r = `${b}-vs-${a}`;
  if (COMPARE_SLUGS.has(f)) return f;
  if (COMPARE_SLUGS.has(r)) return r;
  return null;
}
