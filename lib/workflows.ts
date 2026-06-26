// ─────────────────────────────────────────────────────────────────────────────
// AI WORKFLOWS — the core differentiator.
//
// Competitors list isolated tools. We teach complete, multi-tool workflows that
// take a real-world goal from start to finish (Research → Writing → Images →
// Voice → Video → Publishing). Each step names a real tool in our directory plus
// alternatives, and explains exactly what to do.
//
// Tool names MUST match entries in lib/tools.ts so profile links resolve.
// ─────────────────────────────────────────────────────────────────────────────

import { slugify } from "./tools";

export type WorkflowStep = {
  phase: string;
  icon: string;
  tool: string;       // primary tool (matches a tool name in the directory)
  alts?: string[];    // alternative tools for this step
  what: string;       // the job to be done in this phase
  how: string;        // concrete, plain-English instruction
};

export type Workflow = {
  slug: string;
  title: string;
  tagline: string;
  outcome: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  time: string;
  icon: string;
  steps: WorkflowStep[];
};

export const WORKFLOWS: Workflow[] = [
  {
    slug: "write-and-publish-a-blog-post",
    title: "Write & Publish a Blog Post",
    tagline: "Go from a blank page to a published, SEO-ready article using AI at every step.",
    outcome: "A researched, well-written, illustrated blog post optimized to rank on Google.",
    difficulty: "Beginner",
    time: "1–2 hours",
    icon: "📝",
    steps: [
      { phase: "Research", icon: "🔍", tool: "Perplexity", alts: ["Claude"],
        what: "Gather facts, stats, and angles with sources you can cite.",
        how: "Ask Perplexity for the key points, recent data, and common questions on your topic. Save the cited sources — you'll reference them in the draft." },
      { phase: "Draft", icon: "✍️", tool: "ChatGPT", alts: ["Claude", "Jasper"],
        what: "Turn your research and outline into a first draft.",
        how: "Paste your outline and research notes, then ask for a draft in your target tone, length, and audience. Refine section by section." },
      { phase: "Polish", icon: "🎯", tool: "Grammarly", alts: ["Quillbot"],
        what: "Fix grammar, tighten clarity, and match a consistent tone.",
        how: "Run the full draft through Grammarly, accept clarity and concision suggestions, and read it aloud once to catch anything robotic." },
      { phase: "Images", icon: "🎨", tool: "DALL-E 3", alts: ["Midjourney", "Leonardo.ai"],
        what: "Create a hero image and inline visuals.",
        how: "Describe the scene, style, and aspect ratio. Generate a featured image plus 1–2 supporting visuals that match your brand." },
      { phase: "Optimize", icon: "📈", tool: "Surfer SEO", alts: ["ChatGPT"],
        what: "Make sure the post can actually rank.",
        how: "Run the draft through Surfer, add the missing terms it suggests, write a compelling title and meta description, then publish." },
    ],
  },
  {
    slug: "create-a-faceless-youtube-video",
    title: "Create a Faceless YouTube Video",
    tagline: "Produce a narrated, illustrated video without a camera, mic skills, or editing experience.",
    outcome: "A finished, captioned YouTube video built entirely from AI-generated assets.",
    difficulty: "Intermediate",
    time: "2–4 hours",
    icon: "🎬",
    steps: [
      { phase: "Script", icon: "✍️", tool: "ChatGPT", alts: ["Claude"],
        what: "Write a tight, retention-friendly script.",
        how: "Ask for a script with a strong hook in the first 5 seconds, short punchy sentences, and clear scene-by-scene structure." },
      { phase: "Voiceover", icon: "🎙️", tool: "ElevenLabs", alts: [],
        what: "Turn the script into a natural-sounding narration.",
        how: "Paste the script, pick a voice that fits the topic, and export the audio. Adjust stability/clarity until it sounds human." },
      { phase: "Visuals", icon: "🖼️", tool: "Midjourney", alts: ["Leonardo.ai", "DALL-E 3"],
        what: "Generate the imagery for each scene.",
        how: "Create one image per scene in a consistent style and 16:9 ratio. Keep a shared style prompt so the look stays cohesive." },
      { phase: "Assemble", icon: "🎞️", tool: "Runway", alts: ["CapCut AI"],
        what: "Combine narration and visuals into a video.",
        how: "Drop in your audio and images, add simple motion/transitions, and time each visual to the narration." },
      { phase: "Caption & finish", icon: "💬", tool: "Descript", alts: ["CapCut AI"],
        what: "Add captions and final polish.",
        how: "Auto-generate captions, remove any dead air, then export at 1080p ready to upload." },
    ],
  },
  {
    slug: "produce-a-podcast-episode",
    title: "Produce a Podcast Episode",
    tagline: "Research, record, edit, and publish a clean episode with AI doing the heavy lifting.",
    outcome: "A polished podcast episode with music, show notes, and a transcript.",
    difficulty: "Intermediate",
    time: "2–3 hours",
    icon: "🎙️",
    steps: [
      { phase: "Research", icon: "🔍", tool: "Perplexity", alts: ["Claude"],
        what: "Prep talking points and questions.",
        how: "Ask for the key sub-topics, recent developments, and 8–10 strong questions for your episode or guest." },
      { phase: "Script & outline", icon: "✍️", tool: "ChatGPT", alts: ["Claude"],
        what: "Build a loose script or segment outline.",
        how: "Turn the research into an intro hook, segment flow, and smooth transitions you can speak naturally from." },
      { phase: "Edit", icon: "🎞️", tool: "Descript", alts: [],
        what: "Edit audio by editing text.",
        how: "Upload the recording, remove filler words and silences in one click, and cut by deleting transcript text." },
      { phase: "Music", icon: "🎵", tool: "Mubert", alts: ["Suno"],
        what: "Add royalty-free intro/outro music.",
        how: "Generate a short, on-mood track and layer it under your intro and outro at low volume." },
      { phase: "Show notes & transcript", icon: "📄", tool: "Claude", alts: ["Otter.ai"],
        what: "Create notes, timestamps, and a transcript.",
        how: "Paste the transcript and ask for a summary, chapter timestamps, and a description ready to publish." },
    ],
  },
  {
    slug: "run-a-social-media-campaign",
    title: "Run a Social Media Campaign",
    tagline: "Plan, create, and schedule a full multi-platform campaign with AI.",
    outcome: "A week of on-brand posts, ad creatives, and a scheduling plan — built in an afternoon.",
    difficulty: "Beginner",
    time: "1–3 hours",
    icon: "📣",
    steps: [
      { phase: "Research", icon: "🔍", tool: "Perplexity", alts: ["ChatGPT"],
        what: "Understand your audience and current trends.",
        how: "Ask what's resonating in your niche right now and which hooks and formats are performing." },
      { phase: "Copy", icon: "✍️", tool: "Jasper", alts: ["Copy.ai", "ChatGPT"],
        what: "Write platform-specific captions and hooks.",
        how: "Generate a week of posts tailored to each platform's tone and length, with strong first lines." },
      { phase: "Visuals", icon: "🎨", tool: "Canva AI", alts: ["Adobe Firefly"],
        what: "Design scroll-stopping graphics.",
        how: "Use AI templates and image generation to create a consistent set of branded post visuals." },
      { phase: "Ads", icon: "📊", tool: "AdCreative.ai", alts: [],
        what: "Produce high-converting ad creatives.",
        how: "Generate ad variations, then pick the top performers it scores highest for your goal." },
      { phase: "Schedule", icon: "📅", tool: "Buffer", alts: [],
        what: "Queue everything to post automatically.",
        how: "Load your posts, set optimal times per platform, and let Buffer publish the whole campaign." },
    ],
  },
  {
    slug: "build-a-web-app-without-a-team",
    title: "Build a Web App Without a Team",
    tagline: "Take an idea to a working web app using AI to plan, generate, and refine the code.",
    outcome: "A functioning web app prototype you built and iterated on solo.",
    difficulty: "Advanced",
    time: "A weekend",
    icon: "💻",
    steps: [
      { phase: "Plan", icon: "🧭", tool: "Claude", alts: ["ChatGPT"],
        what: "Define the spec, data model, and screens.",
        how: "Describe your idea and ask for a feature list, page structure, and a simple data model before any code." },
      { phase: "Generate", icon: "⚡", tool: "Bolt.new", alts: [],
        what: "Spin up a working full-stack starting point.",
        how: "Paste your spec and let Bolt scaffold the app in the browser. Iterate by describing changes in plain English." },
      { phase: "Refine", icon: "⌨️", tool: "Cursor", alts: [],
        what: "Take the code into a real editor and harden it.",
        how: "Open the project in Cursor and use its codebase-aware AI to fix bugs, add features, and clean things up." },
      { phase: "Assets", icon: "🎨", tool: "Canva AI", alts: ["DALL-E 3"],
        what: "Create a logo, icons, and marketing visuals.",
        how: "Generate a simple brand kit and the images you need for a landing page before you ship." },
    ],
  },
  {
    slug: "create-a-pitch-deck",
    title: "Create an Investor Pitch Deck",
    tagline: "Research the story, structure the narrative, and design a deck — all with AI.",
    outcome: "A clear, well-designed pitch deck ready to present.",
    difficulty: "Beginner",
    time: "1–2 hours",
    icon: "🖥️",
    steps: [
      { phase: "Research", icon: "🔍", tool: "Perplexity", alts: ["ChatGPT"],
        what: "Gather market size, competitors, and proof points.",
        how: "Ask for the market data, competitive landscape, and trends that strengthen your story — with sources." },
      { phase: "Narrative", icon: "✍️", tool: "Claude", alts: ["ChatGPT"],
        what: "Turn it into a tight slide-by-slide story.",
        how: "Ask for a classic pitch structure (problem, solution, market, traction, ask) with concise copy per slide." },
      { phase: "Build deck", icon: "📊", tool: "Gamma", alts: [],
        what: "Generate the actual slides.",
        how: "Paste your slide outline into Gamma and let it design a cohesive deck. Tweak layout and theme to taste." },
      { phase: "Visuals", icon: "🎨", tool: "Canva AI", alts: ["Adobe Firefly"],
        what: "Add custom graphics where you need them.",
        how: "Create any diagrams, charts, or hero images the auto-generated deck is missing." },
    ],
  },
];

export const workflowBySlug = (slug: string) => WORKFLOWS.find((w) => w.slug === slug);

/** Every tool name referenced anywhere in the workflows (primary + alts). */
export function toolsInWorkflow(w: Workflow): string[] {
  const set = new Set<string>();
  for (const s of w.steps) { set.add(s.tool); (s.alts ?? []).forEach((a) => set.add(a)); }
  return Array.from(set);
}

/** Workflows that feature a given tool (for "used in these workflows" on tool pages). */
export function workflowsUsingTool(toolName: string): Workflow[] {
  return WORKFLOWS.filter((w) => w.steps.some((s) => s.tool === toolName || (s.alts ?? []).includes(toolName)));
}

export { slugify };
