// ─────────────────────────────────────────────────────────────────────────────
// Multi-tag system for AI tools.
//
// DESIGN PRINCIPLE (trust): tags are DERIVED, not invented. Each tag is assigned
// only when it is supported by the tool's own category or by explicit keywords in
// its name/description. We never fabricate factual claims (e.g. "has an API",
// "Chrome extension") — those tags are applied only when the source text says so.
//
// This replaces the single-category model: every tool now resolves to many
// use-case, capability, platform, and industry tags. Search, related tools,
// filters and SEO pages all consume these.
// ─────────────────────────────────────────────────────────────────────────────

import { TOOLS, slugify, type Tool } from "./tools";

export type TagKind = "use-case" | "capability" | "platform" | "industry";

export type Tag = {
  id: string;
  label: string;
  kind: TagKind;
};

// Master taxonomy. `match` is a list of lowercase substrings/word-stems that, if
// found in a tool's "name + description + category" haystack, assign the tag.
type TagDef = Tag & { match: string[]; categories?: string[] };

const TAG_DEFS: TagDef[] = [
  // ── USE CASES (what you're trying to accomplish) ──────────────────────────
  { id: "writing", label: "Writing", kind: "use-case", categories: ["Writing"],
    match: ["writing", "write", "copywrit", "essay", "blog", "article", "content", "paraphras", "grammar", "draft"] },
  { id: "coding", label: "Coding", kind: "use-case", categories: ["Coding"],
    match: ["code", "coding", "developer", "programming", "ide", "autocomplete", "debug", "software engineer", "full-stack", "frontend", "backend"] },
  { id: "image-generation", label: "Image generation", kind: "use-case", categories: ["Images"],
    match: ["image", "art", "illustrat", "text-to-image", "photo", "picture", "logo", "diffusion"] },
  { id: "design", label: "Design", kind: "use-case", categories: ["Design"],
    match: ["design", "graphic", "background", "mockup", "ui ", "ux", "brand"] },
  { id: "video", label: "Video", kind: "use-case", categories: ["Video"],
    match: ["video", "footage", "youtube", "avatar video", "film", "clip"] },
  { id: "audio", label: "Audio & voice", kind: "use-case", categories: ["Music"],
    match: ["music", "audio", "voice", "speech", "song", "podcast", "text-to-speech", "tts", "sound", "narrat"] },
  { id: "research", label: "Research", kind: "use-case", categories: ["Research"],
    match: ["research", "search engine", "answer", "citation", "knowledge", "scholar", "literature", "paper"] },
  { id: "productivity", label: "Productivity", kind: "use-case", categories: ["Productivity"],
    match: ["productivity", "notes", "organiz", "task", "workflow", "meeting", "calendar", "automation"] },
  { id: "marketing", label: "Marketing", kind: "use-case", categories: ["Marketing"],
    match: ["marketing", "ads", "ad copy", "seo", "social media", "campaign", "email marketing", "growth"] },
  { id: "analytics", label: "Analytics", kind: "use-case", categories: ["Analytics"],
    match: ["analytics", "data", "dashboard", "insight", "metric", "chart", "bi ", "report"] },
  { id: "presentations", label: "Presentations", kind: "use-case", categories: ["Presentations"],
    match: ["presentation", "slide", "deck", "pitch"] },
  { id: "support", label: "Customer support", kind: "use-case", categories: ["Support"],
    match: ["support", "customer", "chatbot", "helpdesk", "ticket", "service"] },
  { id: "hr", label: "HR & recruiting", kind: "use-case", categories: ["HR"],
    match: ["hr ", "recruit", "hiring", "resume", "candidate", "interview", "employee"] },
  { id: "finance", label: "Finance", kind: "use-case", categories: ["Finance"],
    match: ["finance", "accounting", "invoice", "expense", "tax", "budget", "trading", "financial"] },

  // ── CAPABILITIES (cross-cutting; a tool can have several) ──────────────────
  { id: "chat-assistant", label: "Chat assistant", kind: "capability",
    match: ["assistant", "chatbot", "conversation", "chat", "companion", "copilot", "agent"] },
  { id: "summarization", label: "Summarization", kind: "capability",
    match: ["summar", "tl;dr", "condense", "digest"] },
  { id: "translation", label: "Translation", kind: "capability",
    match: ["translat", "language", "multilingual"] },
  { id: "transcription", label: "Transcription", kind: "capability",
    match: ["transcri", "caption", "subtitle", "speech-to-text"] },
  { id: "image-editing", label: "Image editing", kind: "capability",
    match: ["edit", "upscal", "remove background", "retouch", "enhance"] },
  { id: "automation", label: "Automation", kind: "capability",
    match: ["automat", "agent", "workflow", "no-code", "no code"] },
  { id: "open-source", label: "Open source", kind: "capability",
    match: ["open-source", "open source"] },

  // ── PLATFORMS (only when explicitly stated) ───────────────────────────────
  { id: "browser-extension", label: "Browser extension", kind: "platform",
    match: ["browser extension", "chrome extension", "extension for", "browser"] },
  { id: "api", label: "API access", kind: "platform",
    match: [" api", "api ", "developers and enterprises"] },
  { id: "ide-plugin", label: "IDE / editor plugin", kind: "platform",
    match: ["vs code", "jetbrains", "ide", "editor", "terminal", "visual studio"] },
  { id: "mobile-app", label: "Mobile app", kind: "platform",
    match: ["ios", "android", "mobile app", "whatsapp", "instagram"] },
  { id: "web-app", label: "Web app", kind: "platform",
    match: ["browser-based", "in the browser", "runs in the browser", "no setup", "no install"] },

  // ── INDUSTRIES (who it's built for) ───────────────────────────────────────
  { id: "for-developers", label: "For developers", kind: "industry",
    match: ["developer", "engineer", "programming", "codebase"] },
  { id: "for-marketers", label: "For marketers", kind: "industry",
    match: ["marketing team", "marketer", "ads", "seo", "campaign"] },
  { id: "for-creators", label: "For creators", kind: "industry",
    match: ["creator", "content creator", "youtube", "fiction", "creative"] },
  { id: "for-enterprise", label: "For enterprise", kind: "industry",
    match: ["enterprise", "team", "business", "organization"] },
  { id: "for-ecommerce", label: "For e-commerce", kind: "industry",
    match: ["e-commerce", "ecommerce", "product description", "shopify", "store"] },
];

export const ALL_TAGS: Tag[] = TAG_DEFS.map(({ id, label, kind }) => ({ id, label, kind }));
const TAG_BY_ID = new Map(ALL_TAGS.map((t) => [t.id, t]));
export const tagLabel = (id: string) => TAG_BY_ID.get(id)?.label ?? id;
export const tagKind = (id: string) => TAG_BY_ID.get(id)?.kind;

function haystack(t: Tool): string {
  return ` ${t.name} ${t.description} ${t.category} `.toLowerCase();
}

/** Derive the full tag set for a tool (deterministic, source-backed). */
export function deriveTags(t: Tool): string[] {
  const hay = haystack(t);
  const ids = new Set<string>();
  for (const def of TAG_DEFS) {
    // category guarantee
    if (def.categories?.includes(t.category)) { ids.add(def.id); continue; }
    if (def.match.some((kw) => hay.includes(kw))) ids.add(def.id);
  }
  // Pricing-derived capability (real signal)
  if (t.pricing === "Free" || t.pricing === "Freemium") ids.add("free-tier");
  return Array.from(ids);
}

// Pre-compute once. A tool plus its resolved tags.
export type TaggedTool = Tool & { tags: string[] };
export const TAGGED_TOOLS: TaggedTool[] = TOOLS.map((t) => ({ ...t, tags: deriveTags(t) }));
const TAGS_BY_TOOL = new Map(TAGGED_TOOLS.map((t) => [t.name, t.tags]));
export const tagsForTool = (name: string): string[] => TAGS_BY_TOOL.get(name) ?? [];

// "free-tier" is a real derived tag but not in the editorial taxonomy list above;
// register a label for it so the UI can render it.
TAG_BY_ID.set("free-tier", { id: "free-tier", label: "Has free tier", kind: "capability" });

/** Tags that actually appear on ≥1 tool, with usage counts — for filter UIs / SEO. */
export function activeTags(kind?: TagKind): Array<Tag & { count: number }> {
  const counts = new Map<string, number>();
  for (const t of TAGGED_TOOLS) for (const id of t.tags) counts.set(id, (counts.get(id) ?? 0) + 1);
  return Array.from(counts.entries())
    .map(([id, count]) => ({ ...(TAG_BY_ID.get(id) ?? { id, label: id, kind: "use-case" as TagKind }), count }))
    .filter((t) => (kind ? t.kind === kind : true))
    .sort((a, b) => b.count - a.count);
}

/** All tools carrying a given tag id. */
export function toolsByTag(tagId: string): TaggedTool[] {
  return TAGGED_TOOLS.filter((t) => t.tags.includes(tagId));
}

/**
 * Related tools by tag overlap (Jaccard-ish), far better than same-category-only.
 * Falls back gracefully and never returns the tool itself.
 */
export function relatedByTags(tool: Tool, limit = 4): TaggedTool[] {
  const mine = new Set(tagsForTool(tool.name));
  if (mine.size === 0) return [];
  return TAGGED_TOOLS
    .filter((t) => t.name !== tool.name)
    .map((t) => {
      const overlap = t.tags.filter((x) => mine.has(x)).length;
      return { t, overlap };
    })
    .filter((r) => r.overlap > 0)
    .sort((a, b) => b.overlap - a.overlap || a.t.name.localeCompare(b.t.name))
    .slice(0, limit)
    .map((r) => r.t);
}

/** Same as relatedByTags but keyed by tool name (convenient on detail pages). */
export function relatedByName(name: string, limit = 4): TaggedTool[] {
  const mine = new Set(tagsForTool(name));
  if (mine.size === 0) return [];
  return TAGGED_TOOLS
    .filter((t) => t.name !== name)
    .map((t) => ({ t, overlap: t.tags.filter((x) => mine.has(x)).length }))
    .filter((r) => r.overlap > 0)
    .sort((a, b) => b.overlap - a.overlap || a.t.name.localeCompare(b.t.name))
    .slice(0, limit)
    .map((r) => r.t);
}

export { slugify };
