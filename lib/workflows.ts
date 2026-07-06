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
  {
    slug: "land-a-job-with-ai",
    title: "Land a Job with AI",
    tagline: "Research the role, tailor your resume, write the cover letter, and walk into the interview prepared — with AI at every step.",
    outcome: "A keyword-matched resume, a genuinely tailored cover letter, and real interview practice behind you.",
    difficulty: "Beginner",
    time: "2–3 hours",
    icon: "💼",
    steps: [
      { phase: "Research", icon: "🔍", tool: "Perplexity", alts: ["Claude"],
        what: "Understand the company, the role, and what they actually value before you write a word.",
        how: "Ask for the company's recent news, culture, likely salary range, and what similar job postings emphasize — with sources. Note 3-5 phrases the posting itself repeats." },
      { phase: "Tailor Resume", icon: "📝", tool: "ChatGPT", alts: ["Claude"],
        what: "Rewrite your resume bullets to match this specific job, not a generic version.",
        how: "Paste your existing resume and the job posting. Ask it to rewrite each bullet to mirror the posting's language and highlight your most relevant results first." },
      { phase: "Design", icon: "🎨", tool: "Canva AI", alts: ["Gamma"],
        what: "Turn the tailored content into a clean, scannable resume layout.",
        how: "Drop your rewritten bullets into a modern Canva resume template. Keep it to one page, one font, and clear section headers — recruiters skim, they don't read." },
      { phase: "Cover Letter", icon: "✉️", tool: "Claude", alts: ["ChatGPT"],
        what: "Write a cover letter that sounds like you, not a template.",
        how: "Give it your resume, the job posting, and one real reason you want this specific role. Ask for a short, direct letter — no generic opening lines like 'I am excited to apply'." },
      { phase: "Polish", icon: "🎯", tool: "Grammarly", alts: ["Quillbot"],
        what: "Catch typos, awkward phrasing, and tone issues before anything gets sent.",
        how: "Run both the resume and cover letter through Grammarly. Read the cover letter aloud once — anything that sounds stiff, rewrite in your own words." },
      { phase: "Interview Prep", icon: "🎙️", tool: "Otter.ai", alts: ["ChatGPT"],
        what: "Practice out loud and actually review how you sound, not just what you'd say in your head.",
        how: "Ask an AI to generate likely interview questions for this role, record yourself answering out loud, then use Otter.ai's transcript to spot rambling, filler words, and weak answers to tighten up." },
    ],
  },
  {
    slug: "repurpose-long-form-content-into-social-posts",
    title: "Repurpose Long-Form Content into Social Posts",
    tagline: "Turn one podcast, video, or article into a week of blog and social content — without writing it all from scratch.",
    outcome: "A blog post plus a full week of platform-ready social posts, all pulled from content you already made.",
    difficulty: "Beginner",
    time: "1–2 hours",
    icon: "♻️",
    steps: [
      { phase: "Transcribe", icon: "🎙️", tool: "Otter.ai", alts: [],
        what: "Turn your podcast, video, or recorded talk into searchable text.",
        how: "Upload the audio or video file to Otter.ai and export the full transcript once it finishes processing." },
      { phase: "Extract & Write", icon: "✍️", tool: "ChatGPT", alts: ["Claude"],
        what: "Pull out the best ideas and turn them into a proper blog post.",
        how: "Paste the transcript and ask for the 5 most quotable or useful moments, then have it draft a blog post structured around those points." },
      { phase: "Social Posts", icon: "📱", tool: "Lately AI", alts: ["Predis.ai"],
        what: "Turn the same source material into a week of platform-specific posts.",
        how: "Feed it the transcript or blog post and generate a batch of posts for each platform you use — trim any that sound generic before scheduling." },
      { phase: "Graphics", icon: "🎨", tool: "Canva AI", alts: [],
        what: "Make each post visually scroll-stopping.",
        how: "Create a simple branded template once, then swap in a new quote or stat from your content for each post." },
    ],
  },
  {
    slug: "build-a-brand-identity-with-ai",
    title: "Build a Brand Identity with AI",
    tagline: "Go from zero to a logo, color palette, brand voice, and starter assets — no designer required.",
    outcome: "A usable logo, color and font direction, a short brand voice guide, and a first batch of on-brand visuals.",
    difficulty: "Beginner",
    time: "2–3 hours",
    icon: "🎨",
    steps: [
      { phase: "Explore", icon: "🖼️", tool: "Midjourney", alts: ["Ideogram"],
        what: "Find a visual direction before committing to anything.",
        how: "Generate a spread of logo and mood-board concepts in different styles. Don't judge individual images — look for a direction you keep coming back to." },
      { phase: "Logo & Colors", icon: "✨", tool: "Canva AI", alts: [],
        what: "Turn your chosen direction into an actual usable logo and color palette.",
        how: "Use Canva's brand kit tools to generate logo variations and a matching color palette based on the style you picked." },
      { phase: "Brand Voice", icon: "🗣️", tool: "ChatGPT", alts: ["Claude"],
        what: "Define how your brand sounds in writing, not just how it looks.",
        how: "Describe your brand in a few sentences and ask for 3 tone-of-voice options with example taglines and a short do's-and-don'ts list for writing copy." },
      { phase: "Assets", icon: "📐", tool: "Adobe Firefly", alts: ["Leonardo.ai"],
        what: "Produce your first batch of on-brand marketing visuals.",
        how: "Using your locked-in colors and style, generate social headers, a hero banner, and any icons you need — commercially safe to use." },
    ],
  },
  {
    slug: "study-for-an-exam-with-ai",
    title: "Study for an Exam with AI",
    tagline: "Turn a syllabus or a stack of notes into a focused study plan, clear explanations, and real practice questions.",
    outcome: "A prioritized study plan, plain-English explanations of the hard topics, and a self-made practice quiz.",
    difficulty: "Beginner",
    time: "Ongoing, ~1 hour to set up",
    icon: "📚",
    steps: [
      { phase: "Scope It Out", icon: "🔍", tool: "Perplexity", alts: ["ChatGPT"],
        what: "Figure out what's actually going to be tested before you start memorizing everything.",
        how: "Ask for the core topics typically covered by this exam or course, and which ones are most commonly tested or hardest for students." },
      { phase: "Learn", icon: "💡", tool: "Claude", alts: ["ChatGPT"],
        what: "Get explanations that actually make sense, not textbook jargon.",
        how: "Paste in your hardest topics and ask for a plain-English explanation, then a slightly harder one, using the Feynman technique — explain it simply, then refine." },
      { phase: "Digitize Notes", icon: "🎙️", tool: "Otter.ai", alts: [],
        what: "Turn recorded lectures or study sessions into text you can actually search and reuse.",
        how: "Record lectures or your own spoken summaries, then use Otter's transcript to pull out key points instead of re-listening to hours of audio." },
      { phase: "Organize & Quiz", icon: "🗂️", tool: "Notion AI", alts: ["ChatGPT"],
        what: "Turn scattered notes into an organized study plan and a practice quiz.",
        how: "Paste your notes and ask for a prioritized study schedule plus a set of practice questions — one at a time, checking your answer before moving on." },
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
