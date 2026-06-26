// ─────────────────────────────────────────────────────────────────────────────
// Intent-aware search. Goes beyond substring matching by mapping natural-language
// wording (synonyms, intents, capabilities, use-cases) onto the tag taxonomy, then
// ranking tools by a blend of name match, tag overlap, and description hits.
//
// Examples that now resolve correctly:
//   "photo editor"               → image-generation / image-editing
//   "free chatgpt alternative"   → chat-assistant + free-tier
//   "make a voiceover"           → audio
//   "summarize a pdf"            → summarization
//   "turn text into video"       → video
// ─────────────────────────────────────────────────────────────────────────────

import { TAGGED_TOOLS, tagsForTool, type TaggedTool } from "./tags";

// Phrase → tag ids. Phrases are matched as substrings of the lowercased query, so
// multi-word intents ("text to speech") work. Order doesn't matter; all matches apply.
const SYNONYMS: Array<[string[], string[]]> = [
  [["photo", "picture", "art", "artwork", "drawing", "illustration", "logo", "image", "generate image", "ai art"], ["image-generation"]],
  [["edit photo", "edit image", "upscale", "remove background", "retouch", "enhance image"], ["image-editing"]],
  [["write", "writing", "essay", "blog", "article", "copy", "content", "draft", "email", "letter"], ["writing"]],
  [["code", "coding", "program", "developer", "build app", "website", "app", "debug", "function"], ["coding"]],
  [["video", "youtube", "reel", "tiktok", "film", "movie", "clip", "make a video"], ["video"]],
  [["voice", "voiceover", "voice over", "speech", "text to speech", "tts", "narration", "audiobook", "podcast"], ["audio"]],
  [["music", "song", "soundtrack", "beat", "compose"], ["audio"]],
  [["research", "find information", "answers", "search", "cite", "sources", "scholar"], ["research"]],
  [["summarize", "summary", "tldr", "condense", "shorten"], ["summarization"]],
  [["translate", "translation", "language"], ["translation"]],
  [["transcribe", "transcription", "subtitles", "captions", "speech to text"], ["transcription"]],
  [["presentation", "slides", "deck", "pitch", "powerpoint", "keynote"], ["presentations"]],
  [["marketing", "ads", "advertis", "seo", "social media", "campaign"], ["marketing"]],
  [["analytics", "data", "dashboard", "insights", "metrics", "chart"], ["analytics"]],
  [["productivity", "notes", "organize", "meeting", "calendar", "automate task"], ["productivity"]],
  [["customer support", "support", "helpdesk", "chatbot for", "service"], ["support"]],
  [["resume", "cv", "hiring", "recruit", "interview", "job"], ["hr"]],
  [["finance", "invoice", "expense", "accounting", "budget", "tax"], ["finance"]],
  [["design", "graphic", "mockup", "brand", "ui ", "ux"], ["design"]],
  [["chatbot", "assistant", "chat", "talk to", "conversation", "agent", "copilot"], ["chat-assistant"]],
  [["automate", "automation", "no-code", "no code", "workflow"], ["automation"]],
  [["free", "no cost", "without paying", "budget"], ["free-tier"]],
  [["open source", "open-source", "self-host"], ["open-source"]],
  [["api", "integrate", "developer access"], ["api"]],
  [["extension", "chrome", "browser"], ["browser-extension"]],
];

const STOP = new Set(["the", "a", "an", "for", "to", "of", "and", "or", "my", "me", "i", "with", "best", "ai", "tool", "tools", "how", "do", "use", "using", "want", "need", "can", "that", "is", "in", "on", "what", "which", "good", "create", "make", "get"]);

function tokenize(q: string): string[] {
  return q.toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter((w) => w.length > 2 && !STOP.has(w));
}

/** Expand a free-text query into the set of tag ids it implies. */
export function intentTags(query: string): string[] {
  const q = ` ${query.toLowerCase()} `;
  const tags = new Set<string>();
  for (const [phrases, ids] of SYNONYMS) {
    if (phrases.some((p) => q.includes(p))) ids.forEach((id) => tags.add(id));
  }
  return Array.from(tags);
}

export type SearchResult = TaggedTool & { score: number };

/**
 * Rank tools for a query. Combines:
 *  - exact / prefix / substring name match (highest)
 *  - intent-tag overlap (synonym & capability aware)
 *  - description token hits (fallback recall)
 */
export function searchTools(query: string, limit = 8): SearchResult[] {
  const term = query.trim().toLowerCase();
  if (!term) return [];
  const tokens = tokenize(term);
  const wantTags = intentTags(term);

  const scored = TAGGED_TOOLS.map((t) => {
    const name = t.name.toLowerCase();
    const desc = t.description.toLowerCase();
    let score = 0;

    if (name === term) score += 120;
    else if (name.startsWith(term)) score += 70;
    else if (name.includes(term)) score += 50;

    // intent-tag overlap — the core of "find it even if wording differs"
    const tags = t.tags;
    for (const wt of wantTags) if (tags.includes(wt)) score += 18;

    // raw token recall across name + description
    for (const tok of tokens) {
      if (name.includes(tok)) score += 10;
      else if (desc.includes(tok)) score += 4;
    }

    // gentle boost for featured tools on otherwise-equal matches
    if (score > 0 && t.isFeatured) score += 2;

    return { ...t, score };
  })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name));

  return scored.slice(0, limit);
}

export { tagsForTool };
