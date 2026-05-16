"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Logo from "./components/Logo";

const CATEGORIES = [
  "All", "Writing", "Images",
  "Coding", "Video", "Music",
  "Research", "Productivity", "Marketing",
  "Analytics", "Presentations", "Design",
  "Support", "HR", "Finance",
];

const PRICING_OPTIONS = ["All", "Free", "Freemium", "Paid"] as const;
type PricingFilter = typeof PRICING_OPTIONS[number];

function slugify(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

type Tool = {
  name: string;
  description: string;
  category: string;
  pricing: "Free" | "Freemium" | "Paid";
  isNew: boolean;
  icon: string;
  domain: string;
  url: string;
  isFeatured: boolean;
  isNewThisWeek: boolean;
};

const TOOLS: Tool[] = [
  // Writing
  { name: "ChatGPT", description: "The world's most popular AI assistant for writing, coding, research and more.", category: "Writing", pricing: "Freemium", isNew: false, icon: "💬", domain: "openai.com", url: "https://chat.openai.com", isFeatured: true, isNewThisWeek: false },
  { name: "Claude", description: "Anthropic's AI assistant for nuanced writing and complex reasoning.", category: "Writing", pricing: "Freemium", isNew: false, icon: "🤖", domain: "anthropic.com", url: "https://claude.ai", isFeatured: true, isNewThisWeek: false },
  { name: "Grammarly", description: "AI writing assistant that checks grammar, style, and tone everywhere.", category: "Writing", pricing: "Freemium", isNew: false, icon: "📝", domain: "grammarly.com", url: "https://grammarly.com", isFeatured: true, isNewThisWeek: false },
  { name: "Jasper", description: "AI writing platform for marketing teams and content creators.", category: "Writing", pricing: "Paid", isNew: false, icon: "✍️", domain: "jasper.ai", url: "https://jasper.ai", isFeatured: false, isNewThisWeek: false },
  { name: "Copy.ai", description: "AI copywriting tool for ads, emails, and social media content.", category: "Writing", pricing: "Freemium", isNew: false, icon: "📣", domain: "copy.ai", url: "https://copy.ai", isFeatured: false, isNewThisWeek: false },
  { name: "Writesonic", description: "AI writer with 100+ templates for blogs, ads, and social content.", category: "Writing", pricing: "Freemium", isNew: false, icon: "🖊️", domain: "writesonic.com", url: "https://writesonic.com", isFeatured: false, isNewThisWeek: false },
  { name: "Quillbot", description: "AI paraphrasing and summarizing tool.", category: "Writing", pricing: "Freemium", isNew: false, icon: "🔄", domain: "quillbot.com", url: "https://quillbot.com", isFeatured: false, isNewThisWeek: false },
  { name: "Sudowrite", description: "AI writing tool for fiction and creative writing.", category: "Writing", pricing: "Paid", isNew: false, icon: "📖", domain: "sudowrite.com", url: "https://sudowrite.com", isFeatured: false, isNewThisWeek: false },
  { name: "Hemingway Editor", description: "Makes your writing bold and clear.", category: "Writing", pricing: "Free", isNew: false, icon: "✂️", domain: "hemingwayapp.com", url: "https://hemingwayapp.com", isFeatured: false, isNewThisWeek: false },
  { name: "Wordtune", description: "AI that rewrites sentences to sound better.", category: "Writing", pricing: "Freemium", isNew: false, icon: "🎯", domain: "wordtune.com", url: "https://wordtune.com", isFeatured: false, isNewThisWeek: false },
  { name: "Anyword", description: "AI copywriting with performance predictions.", category: "Writing", pricing: "Paid", isNew: false, icon: "📊", domain: "anyword.com", url: "https://anyword.com", isFeatured: false, isNewThisWeek: false },
  { name: "Rytr", description: "Affordable AI writing assistant for blogs and emails.", category: "Writing", pricing: "Freemium", isNew: false, icon: "✍️", domain: "rytr.me", url: "https://rytr.me", isFeatured: false, isNewThisWeek: false },
  { name: "Hypotenuse AI", description: "AI content writer for e-commerce product descriptions.", category: "Writing", pricing: "Freemium", isNew: false, icon: "🛒", domain: "hypotenuse.ai", url: "https://hypotenuse.ai", isFeatured: false, isNewThisWeek: false },
  { name: "Longshot AI", description: "AI writer that creates factually accurate long-form content.", category: "Writing", pricing: "Freemium", isNew: false, icon: "📰", domain: "longshot.ai", url: "https://longshot.ai", isFeatured: false, isNewThisWeek: false },
  { name: "Ink Editor", description: "SEO-optimized AI writing assistant.", category: "Writing", pricing: "Freemium", isNew: false, icon: "🖋️", domain: "inkforall.com", url: "https://inkforall.com", isFeatured: false, isNewThisWeek: false },
  { name: "TextCortex", description: "AI writing assistant with browser extension.", category: "Writing", pricing: "Freemium", isNew: false, icon: "🧠", domain: "textcortex.com", url: "https://textcortex.com", isFeatured: false, isNewThisWeek: false },
  { name: "Notion AI", description: "AI built into Notion for writing, summarizing and organizing.", category: "Writing", pricing: "Freemium", isNew: false, icon: "🗂️", domain: "notion.so", url: "https://notion.so/product/ai", isFeatured: false, isNewThisWeek: false },
  { name: "ProWritingAid", description: "In-depth grammar and style checker for authors.", category: "Writing", pricing: "Freemium", isNew: false, icon: "📋", domain: "prowritingaid.com", url: "https://prowritingaid.com", isFeatured: false, isNewThisWeek: false },
  // Image Generation
  { name: "Midjourney", description: "Generate stunning, artistic images from text prompts.", category: "Images", pricing: "Paid", isNew: false, icon: "🎨", domain: "midjourney.com", url: "https://midjourney.com", isFeatured: true, isNewThisWeek: false },
  { name: "Canva AI", description: "Design platform with AI image generation built in.", category: "Design", pricing: "Freemium", isNew: false, icon: "🖌️", domain: "canva.com", url: "https://canva.com", isFeatured: true, isNewThisWeek: false },
  { name: "DALL-E 3", description: "OpenAI's image generation model integrated into ChatGPT.", category: "Images", pricing: "Freemium", isNew: false, icon: "🖼️", domain: "openai.com", url: "https://labs.openai.com", isFeatured: false, isNewThisWeek: false },
  { name: "Adobe Firefly", description: "Commercially safe AI image generation built into Adobe tools.", category: "Design", pricing: "Freemium", isNew: false, icon: "🔥", domain: "adobe.com", url: "https://firefly.adobe.com", isFeatured: false, isNewThisWeek: false },
  { name: "Leonardo.ai", description: "Fine-tuned image generation for game art and product design.", category: "Images", pricing: "Freemium", isNew: true, icon: "🎭", domain: "leonardo.ai", url: "https://leonardo.ai", isFeatured: false, isNewThisWeek: false },
  { name: "Stable Diffusion", description: "Open-source image model with no usage limits.", category: "Images", pricing: "Free", isNew: false, icon: "⚡", domain: "stability.ai", url: "https://dreamstudio.ai", isFeatured: false, isNewThisWeek: false },
  { name: "Ideogram", description: "AI image generator great for text in images.", category: "Images", pricing: "Freemium", isNew: true, icon: "🔤", domain: "ideogram.ai", url: "https://ideogram.ai", isFeatured: false, isNewThisWeek: false },
  { name: "Playground AI", description: "Free AI image generator with powerful controls.", category: "Images", pricing: "Free", isNew: false, icon: "🎮", domain: "playground.com", url: "https://playground.com", isFeatured: false, isNewThisWeek: false },
  { name: "Remove.bg", description: "Remove image backgrounds instantly with AI.", category: "Design", pricing: "Freemium", isNew: false, icon: "✂️", domain: "remove.bg", url: "https://remove.bg", isFeatured: false, isNewThisWeek: false },
  { name: "Clipdrop", description: "Suite of AI image editing tools by Stability AI.", category: "Design", pricing: "Freemium", isNew: false, icon: "📷", domain: "clipdrop.co", url: "https://clipdrop.co", isFeatured: false, isNewThisWeek: false },
  { name: "Flux", description: "State-of-the-art open-source image generation model by Black Forest Labs.", category: "Images", pricing: "Free", isNew: true, icon: "🌊", domain: "blackforestlabs.ai", url: "https://blackforestlabs.ai", isFeatured: false, isNewThisWeek: true },
  { name: "Imagen 3", description: "Google's highest quality text-to-image model.", category: "Images", pricing: "Freemium", isNew: true, icon: "🖼️", domain: "deepmind.google", url: "https://deepmind.google/technologies/imagen-3", isFeatured: false, isNewThisWeek: false },
  { name: "NightCafe", description: "AI art generator with multiple style algorithms.", category: "Images", pricing: "Freemium", isNew: false, icon: "🌙", domain: "nightcafe.studio", url: "https://nightcafe.studio", isFeatured: false, isNewThisWeek: false },
  { name: "Artbreeder", description: "Blend and explore AI-generated artwork collaboratively.", category: "Images", pricing: "Freemium", isNew: false, icon: "🌿", domain: "artbreeder.com", url: "https://artbreeder.com", isFeatured: false, isNewThisWeek: false },
  // Coding
  { name: "GitHub Copilot", description: "AI pair programmer that suggests code completions in real time.", category: "Coding", pricing: "Freemium", isNew: false, icon: "💻", domain: "github.com", url: "https://github.com/features/copilot", isFeatured: true, isNewThisWeek: false },
  { name: "Cursor", description: "AI-first code editor that understands your entire codebase.", category: "Coding", pricing: "Freemium", isNew: true, icon: "⌨️", domain: "cursor.sh", url: "https://cursor.sh", isFeatured: false, isNewThisWeek: false },
  { name: "Replit AI", description: "Browser-based coding with AI assistance, no setup required.", category: "Coding", pricing: "Freemium", isNew: true, icon: "🔧", domain: "replit.com", url: "https://replit.com", isFeatured: false, isNewThisWeek: false },
  { name: "Tabnine", description: "Privacy-first AI code completion for all major IDEs.", category: "Coding", pricing: "Freemium", isNew: false, icon: "🛠️", domain: "tabnine.com", url: "https://tabnine.com", isFeatured: false, isNewThisWeek: false },
  { name: "Codeium", description: "Free AI code completion for 70+ languages.", category: "Coding", pricing: "Free", isNew: false, icon: "⚡", domain: "codeium.com", url: "https://codeium.com", isFeatured: false, isNewThisWeek: false },
  { name: "Amazon CodeWhisperer", description: "AWS AI coding assistant.", category: "Coding", pricing: "Free", isNew: false, icon: "☁️", domain: "aws.amazon.com", url: "https://aws.amazon.com/codewhisperer", isFeatured: false, isNewThisWeek: false },
  { name: "Sourcegraph Cody", description: "AI coding assistant with codebase context.", category: "Coding", pricing: "Freemium", isNew: false, icon: "🔍", domain: "sourcegraph.com", url: "https://sourcegraph.com/cody", isFeatured: false, isNewThisWeek: false },
  { name: "Pieces for Developers", description: "AI-powered developer workflow tool.", category: "Coding", pricing: "Freemium", isNew: false, icon: "🧩", domain: "pieces.app", url: "https://pieces.app", isFeatured: false, isNewThisWeek: false },
  { name: "Windsurf", description: "AI-native code editor with agentic coding capabilities.", category: "Coding", pricing: "Freemium", isNew: true, icon: "🏄", domain: "codeium.com", url: "https://codeium.com/windsurf", isFeatured: false, isNewThisWeek: true },
  { name: "Bolt.new", description: "AI full-stack web app builder that runs in the browser.", category: "Coding", pricing: "Freemium", isNew: true, icon: "⚡", domain: "bolt.new", url: "https://bolt.new", isFeatured: false, isNewThisWeek: false },
  { name: "V0 by Vercel", description: "Generate UI components from text descriptions.", category: "Coding", pricing: "Freemium", isNew: true, icon: "🎨", domain: "v0.dev", url: "https://v0.dev", isFeatured: false, isNewThisWeek: false },
  { name: "Devin", description: "The first AI software engineer that completes coding tasks end-to-end.", category: "Coding", pricing: "Paid", isNew: true, icon: "🤖", domain: "cognition.ai", url: "https://cognition.ai", isFeatured: false, isNewThisWeek: false },
  { name: "Aider", description: "AI pair programming in your terminal with git integration.", category: "Coding", pricing: "Free", isNew: false, icon: "💬", domain: "aider.chat", url: "https://aider.chat", isFeatured: false, isNewThisWeek: false },
  { name: "Continue", description: "Open-source AI code assistant for VS Code and JetBrains.", category: "Coding", pricing: "Free", isNew: false, icon: "🔁", domain: "continue.dev", url: "https://continue.dev", isFeatured: false, isNewThisWeek: false },
  // Video
  { name: "Runway", description: "Professional AI video generation and editing for creators.", category: "Video", pricing: "Freemium", isNew: false, icon: "🎬", domain: "runwayml.com", url: "https://runwayml.com", isFeatured: false, isNewThisWeek: false },
  { name: "HeyGen", description: "Create AI avatar videos with realistic human presenters.", category: "Video", pricing: "Freemium", isNew: true, icon: "🎥", domain: "heygen.com", url: "https://heygen.com", isFeatured: false, isNewThisWeek: false },
  { name: "Synthesia", description: "AI presenter videos with avatars reading your script.", category: "Video", pricing: "Paid", isNew: false, icon: "📹", domain: "synthesia.io", url: "https://synthesia.io", isFeatured: false, isNewThisWeek: false },
  { name: "CapCut AI", description: "Free AI video editor with auto-captions and effects.", category: "Video", pricing: "Free", isNew: false, icon: "✂️", domain: "capcut.com", url: "https://capcut.com", isFeatured: false, isNewThisWeek: false },
  { name: "Descript", description: "Edit video by editing its transcript — the easiest video editor.", category: "Video", pricing: "Freemium", isNew: false, icon: "🎞️", domain: "descript.com", url: "https://descript.com", isFeatured: false, isNewThisWeek: false },
  { name: "Invideo AI", description: "Turn a text prompt into a full YouTube-ready video.", category: "Video", pricing: "Freemium", isNew: true, icon: "▶️", domain: "invideo.ai", url: "https://invideo.ai", isFeatured: false, isNewThisWeek: false },
  { name: "Pika Labs", description: "AI video generation from text and images.", category: "Video", pricing: "Freemium", isNew: true, icon: "🎆", domain: "pika.art", url: "https://pika.art", isFeatured: false, isNewThisWeek: false },
  { name: "D-ID", description: "Create talking avatar videos from a photo.", category: "Video", pricing: "Freemium", isNew: false, icon: "👤", domain: "d-id.com", url: "https://d-id.com", isFeatured: false, isNewThisWeek: false },
  { name: "Loom AI", description: "Async video messaging with AI summaries.", category: "Video", pricing: "Freemium", isNew: false, icon: "📽️", domain: "loom.com", url: "https://loom.com", isFeatured: false, isNewThisWeek: false },
  { name: "Captions", description: "AI video editor with auto-captions and effects.", category: "Video", pricing: "Freemium", isNew: true, icon: "💬", domain: "captions.ai", url: "https://captions.ai", isFeatured: false, isNewThisWeek: false },
  { name: "Sora", description: "OpenAI's text-to-video model for cinematic AI video generation.", category: "Video", pricing: "Freemium", isNew: true, icon: "🎥", domain: "openai.com", url: "https://sora.com", isFeatured: false, isNewThisWeek: true },
  { name: "Kling AI", description: "Kuaishou's AI video generator for realistic motion videos.", category: "Video", pricing: "Freemium", isNew: true, icon: "🎬", domain: "klingai.com", url: "https://klingai.com", isFeatured: false, isNewThisWeek: false },
  { name: "Opus Clip", description: "AI that turns long videos into viral short clips automatically.", category: "Video", pricing: "Freemium", isNew: false, icon: "✂️", domain: "opus.pro", url: "https://opus.pro", isFeatured: false, isNewThisWeek: false },
  { name: "Pictory", description: "Turn blog posts and scripts into engaging videos automatically.", category: "Video", pricing: "Freemium", isNew: false, icon: "📸", domain: "pictory.ai", url: "https://pictory.ai", isFeatured: false, isNewThisWeek: false },
  // Music
  { name: "Suno", description: "Create full songs with lyrics and music from a text prompt.", category: "Music", pricing: "Freemium", isNew: true, icon: "🎵", domain: "suno.com", url: "https://suno.com", isFeatured: false, isNewThisWeek: false },
  { name: "Udio", description: "Generate original music tracks in any genre from text.", category: "Music", pricing: "Freemium", isNew: true, icon: "🎶", domain: "udio.com", url: "https://udio.com", isFeatured: false, isNewThisWeek: false },
  { name: "Mubert", description: "Royalty-free AI background music for videos and podcasts.", category: "Music", pricing: "Freemium", isNew: false, icon: "🎼", domain: "mubert.com", url: "https://mubert.com", isFeatured: false, isNewThisWeek: false },
  { name: "Soundraw", description: "AI music generator for content creators.", category: "Music", pricing: "Freemium", isNew: false, icon: "🎸", domain: "soundraw.io", url: "https://soundraw.io", isFeatured: false, isNewThisWeek: false },
  { name: "Boomy", description: "Create and release AI-generated songs.", category: "Music", pricing: "Freemium", isNew: false, icon: "🎤", domain: "boomy.com", url: "https://boomy.com", isFeatured: false, isNewThisWeek: false },
  { name: "Loudly", description: "AI music generation with style controls.", category: "Music", pricing: "Freemium", isNew: false, icon: "🔊", domain: "loudly.com", url: "https://loudly.com", isFeatured: false, isNewThisWeek: false },
  { name: "AIVA", description: "AI composer for emotional soundtracks and background music.", category: "Music", pricing: "Freemium", isNew: false, icon: "🎹", domain: "aiva.ai", url: "https://aiva.ai", isFeatured: false, isNewThisWeek: false },
  { name: "Beatoven.ai", description: "AI music generation for video and podcast creators.", category: "Music", pricing: "Freemium", isNew: false, icon: "🥁", domain: "beatoven.ai", url: "https://beatoven.ai", isFeatured: false, isNewThisWeek: false },
  { name: "Musicfy", description: "Create AI covers with any voice and convert your voice.", category: "Music", pricing: "Freemium", isNew: true, icon: "🎙️", domain: "musicfy.lol", url: "https://musicfy.lol", isFeatured: false, isNewThisWeek: false },
  { name: "Stable Audio", description: "Stability AI's high-quality audio generation tool.", category: "Music", pricing: "Freemium", isNew: true, icon: "🎵", domain: "stability.ai", url: "https://stableaudio.com", isFeatured: false, isNewThisWeek: false },
  // Research
  { name: "Perplexity AI", description: "AI-powered search engine with cited, real-time answers.", category: "Research", pricing: "Freemium", isNew: false, icon: "🔍", domain: "perplexity.ai", url: "https://perplexity.ai", isFeatured: false, isNewThisWeek: false },
  { name: "Elicit", description: "AI research assistant trained on academic papers.", category: "Research", pricing: "Freemium", isNew: false, icon: "📚", domain: "elicit.com", url: "https://elicit.com", isFeatured: false, isNewThisWeek: false },
  { name: "Consensus", description: "AI search engine for scientific and medical evidence.", category: "Research", pricing: "Freemium", isNew: true, icon: "🔬", domain: "consensus.app", url: "https://consensus.app", isFeatured: false, isNewThisWeek: false },
  { name: "Otter.ai", description: "AI meeting recorder and transcriber with instant summaries.", category: "Research", pricing: "Freemium", isNew: false, icon: "🎙️", domain: "otter.ai", url: "https://otter.ai", isFeatured: false, isNewThisWeek: false },
  { name: "Semantic Scholar", description: "Free AI-powered academic search engine.", category: "Research", pricing: "Free", isNew: false, icon: "🎓", domain: "semanticscholar.org", url: "https://semanticscholar.org", isFeatured: false, isNewThisWeek: false },
  { name: "Scite", description: "AI tool that shows how papers have been cited.", category: "Research", pricing: "Freemium", isNew: false, icon: "📋", domain: "scite.ai", url: "https://scite.ai", isFeatured: false, isNewThisWeek: false },
  { name: "Research Rabbit", description: "AI paper discovery and visualization.", category: "Research", pricing: "Free", isNew: false, icon: "🐇", domain: "researchrabbitapp.com", url: "https://researchrabbitapp.com", isFeatured: false, isNewThisWeek: false },
  { name: "Explainpaper", description: "Upload a paper and AI explains the hard parts.", category: "Research", pricing: "Freemium", isNew: false, icon: "📄", domain: "explainpaper.com", url: "https://explainpaper.com", isFeatured: false, isNewThisWeek: false },
  { name: "Grok", description: "xAI's conversational AI with real-time X/Twitter data access.", category: "Research", pricing: "Freemium", isNew: true, icon: "🔍", domain: "grok.com", url: "https://grok.com", isFeatured: false, isNewThisWeek: false },
  { name: "Gemini", description: "Google's multimodal AI for research, analysis, and reasoning.", category: "Research", pricing: "Freemium", isNew: false, icon: "✨", domain: "gemini.google.com", url: "https://gemini.google.com", isFeatured: false, isNewThisWeek: false },
  { name: "You.com", description: "AI search with cited answers and multiple AI model access.", category: "Research", pricing: "Freemium", isNew: false, icon: "🔎", domain: "you.com", url: "https://you.com", isFeatured: false, isNewThisWeek: false },
  { name: "Typeset (SciSpace)", description: "AI research assistant for reading and understanding papers.", category: "Research", pricing: "Freemium", isNew: false, icon: "📑", domain: "typeset.io", url: "https://typeset.io", isFeatured: false, isNewThisWeek: false },
  // Productivity
  { name: "Reclaim.ai", description: "AI calendar optimizer that auto-schedules your tasks.", category: "Productivity", pricing: "Freemium", isNew: true, icon: "📅", domain: "reclaim.ai", url: "https://reclaim.ai", isFeatured: false, isNewThisWeek: false },
  { name: "Motion", description: "AI that builds your perfect daily schedule automatically.", category: "Productivity", pricing: "Paid", isNew: false, icon: "⏱️", domain: "usemotion.com", url: "https://usemotion.com", isFeatured: false, isNewThisWeek: false },
  { name: "Mem", description: "AI-powered note-taking that organizes itself.", category: "Productivity", pricing: "Freemium", isNew: false, icon: "🧠", domain: "mem.ai", url: "https://mem.ai", isFeatured: false, isNewThisWeek: false },
  { name: "Taskade", description: "AI project management and team collaboration.", category: "Productivity", pricing: "Freemium", isNew: false, icon: "✅", domain: "taskade.com", url: "https://taskade.com", isFeatured: false, isNewThisWeek: false },
  { name: "Fireflies.ai", description: "AI meeting assistant that records and transcribes.", category: "Productivity", pricing: "Freemium", isNew: false, icon: "🔥", domain: "fireflies.ai", url: "https://fireflies.ai", isFeatured: false, isNewThisWeek: false },
  { name: "Superhuman", description: "AI-powered email client.", category: "Productivity", pricing: "Paid", isNew: false, icon: "⚡", domain: "superhuman.com", url: "https://superhuman.com", isFeatured: false, isNewThisWeek: false },
  { name: "Clio", description: "AI-powered to-do list that prioritizes work for you.", category: "Productivity", pricing: "Freemium", isNew: true, icon: "📋", domain: "clio.so", url: "https://clio.so", isFeatured: false, isNewThisWeek: false },
  { name: "Rays", description: "AI email summarizer and action item extractor.", category: "Productivity", pricing: "Freemium", isNew: true, icon: "📧", domain: "rays.so", url: "https://rays.so", isFeatured: false, isNewThisWeek: true },
  { name: "Merlin", description: "ChatGPT-powered browser extension for any website.", category: "Productivity", pricing: "Freemium", isNew: false, icon: "🧙", domain: "getmerlin.in", url: "https://getmerlin.in", isFeatured: false, isNewThisWeek: false },
  { name: "Kagi", description: "Premium AI-enhanced search engine with no ads.", category: "Productivity", pricing: "Paid", isNew: false, icon: "🔍", domain: "kagi.com", url: "https://kagi.com", isFeatured: false, isNewThisWeek: false },
  { name: "Zapier AI", description: "AI automation that connects 6000+ apps with natural language.", category: "Productivity", pricing: "Freemium", isNew: false, icon: "⚡", domain: "zapier.com", url: "https://zapier.com/ai", isFeatured: false, isNewThisWeek: false },
  { name: "Make (Integromat)", description: "Visual AI workflow automation platform.", category: "Productivity", pricing: "Freemium", isNew: false, icon: "🔗", domain: "make.com", url: "https://make.com", isFeatured: false, isNewThisWeek: false },
  { name: "Clockwise", description: "AI calendar assistant that protects focus time.", category: "Productivity", pricing: "Freemium", isNew: false, icon: "🕒", domain: "getclockwise.com", url: "https://getclockwise.com", isFeatured: false, isNewThisWeek: false },
  // Marketing
  { name: "Surfer SEO", description: "Data-driven SEO tool to rank higher on Google.", category: "Marketing", pricing: "Paid", isNew: false, icon: "📈", domain: "surferseo.com", url: "https://surferseo.com", isFeatured: false, isNewThisWeek: false },
  { name: "AdCreative.ai", description: "Generate high-converting ad creatives and banners with AI.", category: "Marketing", pricing: "Paid", isNew: true, icon: "📢", domain: "adcreative.ai", url: "https://adcreative.ai", isFeatured: false, isNewThisWeek: false },
  { name: "Buffer", description: "AI-powered social media scheduling and analytics.", category: "Marketing", pricing: "Freemium", isNew: false, icon: "📱", domain: "buffer.com", url: "https://buffer.com", isFeatured: false, isNewThisWeek: false },
  { name: "Mailchimp AI", description: "Email marketing platform with AI content suggestions.", category: "Marketing", pricing: "Freemium", isNew: false, icon: "📧", domain: "mailchimp.com", url: "https://mailchimp.com", isFeatured: false, isNewThisWeek: false },
  { name: "Semrush", description: "Comprehensive AI SEO and marketing platform.", category: "Marketing", pricing: "Paid", isNew: false, icon: "🔍", domain: "semrush.com", url: "https://semrush.com", isFeatured: false, isNewThisWeek: false },
  { name: "Hootsuite", description: "AI social media management and scheduling.", category: "Marketing", pricing: "Paid", isNew: false, icon: "🦉", domain: "hootsuite.com", url: "https://hootsuite.com", isFeatured: false, isNewThisWeek: false },
  { name: "Phrasee", description: "AI brand language and email subject line optimizer.", category: "Marketing", pricing: "Paid", isNew: false, icon: "🗣️", domain: "phrasee.co", url: "https://phrasee.co", isFeatured: false, isNewThisWeek: false },
  { name: "Klaviyo AI", description: "AI-powered email and SMS marketing for e-commerce.", category: "Marketing", pricing: "Freemium", isNew: false, icon: "📊", domain: "klaviyo.com", url: "https://klaviyo.com", isFeatured: false, isNewThisWeek: false },
  { name: "Predis.ai", description: "AI social media post generator with visuals.", category: "Marketing", pricing: "Freemium", isNew: false, icon: "📸", domain: "predis.ai", url: "https://predis.ai", isFeatured: false, isNewThisWeek: false },
  { name: "Lately AI", description: "AI that repurposes long content into social posts.", category: "Marketing", pricing: "Paid", isNew: false, icon: "🔄", domain: "lately.ai", url: "https://lately.ai", isFeatured: false, isNewThisWeek: false },
  { name: "Clearscope", description: "AI content optimization tool for better SEO rankings.", category: "Marketing", pricing: "Paid", isNew: false, icon: "📈", domain: "clearscope.io", url: "https://clearscope.io", isFeatured: false, isNewThisWeek: false },
  { name: "Brand24", description: "AI media monitoring and social listening tool.", category: "Marketing", pricing: "Freemium", isNew: false, icon: "👁️", domain: "brand24.com", url: "https://brand24.com", isFeatured: false, isNewThisWeek: false },
  // Data Analysis
  { name: "Julius AI", description: "Chat with your data — upload spreadsheets and get instant analysis.", category: "Analytics", pricing: "Freemium", isNew: true, icon: "📊", domain: "julius.ai", url: "https://julius.ai", isFeatured: false, isNewThisWeek: false },
  { name: "Akkio", description: "No-code AI analytics for predictions and dashboards.", category: "Analytics", pricing: "Freemium", isNew: false, icon: "🔢", domain: "akkio.com", url: "https://akkio.com", isFeatured: false, isNewThisWeek: false },
  { name: "Tableau AI", description: "AI-powered business intelligence and visualization.", category: "Analytics", pricing: "Paid", isNew: false, icon: "📉", domain: "tableau.com", url: "https://tableau.com", isFeatured: false, isNewThisWeek: false },
  { name: "Obviously AI", description: "No-code AI predictions from any dataset.", category: "Analytics", pricing: "Freemium", isNew: false, icon: "💡", domain: "obviously.ai", url: "https://obviously.ai", isFeatured: false, isNewThisWeek: false },
  { name: "MonkeyLearn", description: "AI text analysis and classification.", category: "Analytics", pricing: "Freemium", isNew: false, icon: "🐒", domain: "monkeylearn.com", url: "https://monkeylearn.com", isFeatured: false, isNewThisWeek: false },
  { name: "DataRobot", description: "Enterprise AI platform for predictive analytics.", category: "Analytics", pricing: "Paid", isNew: false, icon: "🤖", domain: "datarobot.com", url: "https://datarobot.com", isFeatured: false, isNewThisWeek: false },
  { name: "Polymer", description: "Turn spreadsheets into interactive AI-powered dashboards.", category: "Analytics", pricing: "Freemium", isNew: false, icon: "📊", domain: "polymersearch.com", url: "https://polymersearch.com", isFeatured: false, isNewThisWeek: false },
  { name: "Hex", description: "Collaborative AI data science notebook and app builder.", category: "Analytics", pricing: "Freemium", isNew: false, icon: "🔷", domain: "hex.tech", url: "https://hex.tech", isFeatured: false, isNewThisWeek: false },
  { name: "Equals", description: "AI-powered spreadsheet with live data connections.", category: "Analytics", pricing: "Freemium", isNew: true, icon: "🔢", domain: "equals.com", url: "https://equals.com", isFeatured: false, isNewThisWeek: false },
  { name: "Deepnote", description: "AI-enhanced collaborative data science notebooks.", category: "Analytics", pricing: "Freemium", isNew: false, icon: "📓", domain: "deepnote.com", url: "https://deepnote.com", isFeatured: false, isNewThisWeek: false },
  // Presentations
  { name: "Gamma", description: "AI presentation builder that generates beautiful decks instantly.", category: "Presentations", pricing: "Freemium", isNew: false, icon: "🖥️", domain: "gamma.app", url: "https://gamma.app", isFeatured: false, isNewThisWeek: false },
  { name: "Beautiful.ai", description: "Smart slide designer that auto-formats as you type.", category: "Presentations", pricing: "Freemium", isNew: false, icon: "✨", domain: "beautiful.ai", url: "https://beautiful.ai", isFeatured: false, isNewThisWeek: false },
  { name: "Tome", description: "AI storytelling format blending slides with narrative text.", category: "Presentations", pricing: "Freemium", isNew: false, icon: "📖", domain: "tome.app", url: "https://tome.app", isFeatured: false, isNewThisWeek: false },
  { name: "SlidesAI", description: "AI that creates presentations from text.", category: "Presentations", pricing: "Freemium", isNew: false, icon: "📑", domain: "slidesai.io", url: "https://slidesai.io", isFeatured: false, isNewThisWeek: false },
  { name: "Decktopus", description: "AI presentation builder with smart design.", category: "Presentations", pricing: "Freemium", isNew: false, icon: "🎴", domain: "decktopus.com", url: "https://decktopus.com", isFeatured: false, isNewThisWeek: false },
  { name: "MagicSlides", description: "Create Google Slides with AI instantly.", category: "Presentations", pricing: "Freemium", isNew: false, icon: "🪄", domain: "magicslides.app", url: "https://magicslides.app", isFeatured: false, isNewThisWeek: false },
  { name: "Pitch", description: "Collaborative presentation tool with AI writing assistance.", category: "Presentations", pricing: "Freemium", isNew: false, icon: "🎯", domain: "pitch.com", url: "https://pitch.com", isFeatured: false, isNewThisWeek: false },
  { name: "Presentations.ai", description: "AI that generates complete slide decks from a prompt.", category: "Presentations", pricing: "Freemium", isNew: true, icon: "🤖", domain: "presentations.ai", url: "https://presentations.ai", isFeatured: false, isNewThisWeek: false },
  { name: "Slidesgo", description: "AI-generated Google Slides and PowerPoint templates.", category: "Presentations", pricing: "Freemium", isNew: false, icon: "🖼️", domain: "slidesgo.com", url: "https://slidesgo.com", isFeatured: false, isNewThisWeek: false },
  // Customer Support
  { name: "Intercom AI", description: "AI support agent trained on your docs, resolves queries 24/7.", category: "Support", pricing: "Paid", isNew: false, icon: "💬", domain: "intercom.com", url: "https://intercom.com/fin", isFeatured: false, isNewThisWeek: false },
  { name: "Tidio", description: "AI chatbot for e-commerce that qualifies leads and supports customers.", category: "Support", pricing: "Freemium", isNew: false, icon: "🤝", domain: "tidio.com", url: "https://tidio.com", isFeatured: false, isNewThisWeek: false },
  { name: "Drift", description: "AI chatbot that qualifies leads and books meetings automatically.", category: "Support", pricing: "Freemium", isNew: false, icon: "💼", domain: "drift.com", url: "https://drift.com", isFeatured: false, isNewThisWeek: false },
  { name: "Zendesk AI", description: "AI-powered customer support with smart ticket routing.", category: "Support", pricing: "Paid", isNew: false, icon: "🎫", domain: "zendesk.com", url: "https://zendesk.com", isFeatured: false, isNewThisWeek: false },
  { name: "Freshdesk AI", description: "AI customer support with smart routing.", category: "Support", pricing: "Freemium", isNew: false, icon: "🌿", domain: "freshdesk.com", url: "https://freshdesk.com", isFeatured: false, isNewThisWeek: false },
  { name: "Forethought", description: "AI that resolves support tickets automatically.", category: "Support", pricing: "Paid", isNew: false, icon: "🧠", domain: "forethought.ai", url: "https://forethought.ai", isFeatured: false, isNewThisWeek: false },
  { name: "Ada", description: "AI customer service automation platform.", category: "Support", pricing: "Paid", isNew: false, icon: "🤖", domain: "ada.cx", url: "https://ada.cx", isFeatured: false, isNewThisWeek: false },
  { name: "Kustomer", description: "AI-driven CRM platform for customer service teams.", category: "Support", pricing: "Paid", isNew: false, icon: "💁", domain: "kustomer.com", url: "https://kustomer.com", isFeatured: false, isNewThisWeek: false },
  { name: "Gladly", description: "AI customer service platform centered around people, not tickets.", category: "Support", pricing: "Paid", isNew: false, icon: "😊", domain: "gladly.com", url: "https://gladly.com", isFeatured: false, isNewThisWeek: false },
  { name: "Chaindesk", description: "Build custom AI chatbots trained on your data.", category: "Support", pricing: "Freemium", isNew: true, icon: "🔗", domain: "chaindesk.ai", url: "https://chaindesk.ai", isFeatured: false, isNewThisWeek: false },
  { name: "Botpress", description: "Open-source AI chatbot platform for developers.", category: "Support", pricing: "Freemium", isNew: false, icon: "🤖", domain: "botpress.com", url: "https://botpress.com", isFeatured: false, isNewThisWeek: false },
  // HR & Recruiting
  { name: "Workday AI", description: "AI-powered HR and workforce management.", category: "HR", pricing: "Paid", isNew: false, icon: "👔", domain: "workday.com", url: "https://workday.com", isFeatured: false, isNewThisWeek: false },
  { name: "HireVue", description: "AI video interviewing and assessment platform.", category: "HR", pricing: "Paid", isNew: false, icon: "🎥", domain: "hirevue.com", url: "https://hirevue.com", isFeatured: false, isNewThisWeek: false },
  { name: "Paradox", description: "AI recruiting assistant named Olivia.", category: "HR", pricing: "Paid", isNew: false, icon: "🤖", domain: "paradox.ai", url: "https://paradox.ai", isFeatured: false, isNewThisWeek: false },
  { name: "Fetcher", description: "AI talent sourcing and outreach automation.", category: "HR", pricing: "Paid", isNew: false, icon: "🎣", domain: "fetcher.ai", url: "https://fetcher.ai", isFeatured: false, isNewThisWeek: false },
  { name: "Beamery", description: "AI talent lifecycle management platform.", category: "HR", pricing: "Paid", isNew: false, icon: "🌟", domain: "beamery.com", url: "https://beamery.com", isFeatured: false, isNewThisWeek: false },
  { name: "Eightfold AI", description: "AI talent intelligence platform for hiring and retention.", category: "HR", pricing: "Paid", isNew: false, icon: "🔮", domain: "eightfold.ai", url: "https://eightfold.ai", isFeatured: false, isNewThisWeek: false },
  { name: "Greenhouse AI", description: "AI-enhanced applicant tracking and hiring platform.", category: "HR", pricing: "Paid", isNew: false, icon: "🌱", domain: "greenhouse.io", url: "https://greenhouse.io", isFeatured: false, isNewThisWeek: false },
  { name: "Findem", description: "AI talent search with attribute-based candidate discovery.", category: "HR", pricing: "Paid", isNew: false, icon: "🔍", domain: "findem.ai", url: "https://findem.ai", isFeatured: false, isNewThisWeek: false },
  { name: "Leena AI", description: "AI employee experience and HR helpdesk platform.", category: "HR", pricing: "Paid", isNew: false, icon: "👥", domain: "leena.ai", url: "https://leena.ai", isFeatured: false, isNewThisWeek: false },
  { name: "Manatal", description: "AI recruitment software for agencies and HR teams.", category: "HR", pricing: "Paid", isNew: false, icon: "📋", domain: "manatal.com", url: "https://manatal.com", isFeatured: false, isNewThisWeek: false },
  // Finance
  { name: "Zest AI", description: "AI credit underwriting platform.", category: "Finance", pricing: "Paid", isNew: false, icon: "💳", domain: "zest.ai", url: "https://zest.ai", isFeatured: false, isNewThisWeek: false },
  { name: "Domo", description: "AI business intelligence platform.", category: "Finance", pricing: "Paid", isNew: false, icon: "📊", domain: "domo.com", url: "https://domo.com", isFeatured: false, isNewThisWeek: false },
  { name: "Vic.ai", description: "AI accounts payable automation.", category: "Finance", pricing: "Paid", isNew: false, icon: "🧾", domain: "vic.ai", url: "https://vic.ai", isFeatured: false, isNewThisWeek: false },
  { name: "Trullion", description: "AI accounting and lease management platform.", category: "Finance", pricing: "Paid", isNew: false, icon: "📑", domain: "trullion.com", url: "https://trullion.com", isFeatured: false, isNewThisWeek: false },
  { name: "Booke AI", description: "AI-powered bookkeeping automation for accountants.", category: "Finance", pricing: "Freemium", isNew: true, icon: "📒", domain: "booke.ai", url: "https://booke.ai", isFeatured: false, isNewThisWeek: true },
  { name: "Perplexity", description: "AI-powered answer engine that searches the web in real time.", category: "Research", pricing: "Freemium", isNew: false, icon: "🔍", domain: "perplexity.ai", url: "https://perplexity.ai", isFeatured: false, isNewThisWeek: true },
  { name: "Planful", description: "AI financial planning and analysis platform.", category: "Finance", pricing: "Paid", isNew: false, icon: "📈", domain: "planful.com", url: "https://planful.com", isFeatured: false, isNewThisWeek: false },
  { name: "Mosaic Tech", description: "AI strategic finance platform for real-time insights.", category: "Finance", pricing: "Paid", isNew: false, icon: "🏛️", domain: "mosaic.tech", url: "https://mosaic.tech", isFeatured: false, isNewThisWeek: false },
  { name: "Stampli", description: "AI accounts payable and invoice management.", category: "Finance", pricing: "Paid", isNew: false, icon: "🏷️", domain: "stampli.com", url: "https://stampli.com", isFeatured: false, isNewThisWeek: false },
  { name: "Vena", description: "AI-powered FP&A and corporate performance management.", category: "Finance", pricing: "Paid", isNew: false, icon: "💹", domain: "venasolutions.com", url: "https://venasolutions.com", isFeatured: false, isNewThisWeek: false },
  { name: "Brex AI", description: "AI-powered spend management and corporate cards.", category: "Finance", pricing: "Freemium", isNew: false, icon: "💳", domain: "brex.com", url: "https://brex.com", isFeatured: false, isNewThisWeek: false },
  { name: "Pika", description: "AI video generation tool for creative short-form content.", category: "Video", pricing: "Freemium", isNew: false, icon: "🎬", domain: "pika.art", url: "https://pika.art", isFeatured: false, isNewThisWeek: false },
  { name: "Luma AI", description: "Photorealistic AI video and 3D generation from text or images.", category: "Video", pricing: "Freemium", isNew: false, icon: "🌐", domain: "lumalabs.ai", url: "https://lumalabs.ai", isFeatured: false, isNewThisWeek: false },
  { name: "Mistral AI", description: "Open-source large language models for developers and enterprises.", category: "Coding", pricing: "Freemium", isNew: false, icon: "🌪️", domain: "mistral.ai", url: "https://mistral.ai", isFeatured: false, isNewThisWeek: false },
  { name: "Pi AI", description: "Personal AI companion focused on emotional support and conversation.", category: "Writing", pricing: "Free", isNew: false, icon: "🥧", domain: "pi.ai", url: "https://pi.ai", isFeatured: false, isNewThisWeek: false },
  { name: "Meta AI", description: "Meta's AI assistant built into WhatsApp, Instagram, and Facebook.", category: "Writing", pricing: "Free", isNew: false, icon: "🔵", domain: "meta.ai", url: "https://meta.ai", isFeatured: false, isNewThisWeek: false },
];

const PRICING_STYLES: Record<string, string> = {
  Free:     "bg-[#E7F3FF] text-[#1877F2]",
  Freemium: "bg-[#E7F3FF] text-[#1877F2]",
  Paid:     "bg-[#fff0f3] text-[#e41e3f]",
};

const TRENDING = [
  "YouTube video",
  "Generate images",
  "Cover letter",
  "Fix my code",
  "Make a song",
  "Research topic",
];

const HOW_IT_WORKS = [
  { icon: "💬", step: "1", title: "Describe your goal", desc: "Type what you want to do in plain English. No technical knowledge needed." },
  { icon: "🔍", step: "2", title: "We match the tools", desc: "Our system finds the best AI tools for your exact use case from 100+ options." },
  { icon: "⚡", step: "3", title: "Get started instantly", desc: "Each result comes with step-by-step instructions so you can start in minutes." },
];

const FOOTER_CATEGORIES = ["Writing", "Images", "Video", "Coding", "Music"];

function MiniToolCard({ tool }: { tool: Tool }) {
  return (
    <a
      href={`/tools/${slugify(tool.name)}`}
      className="bg-white border border-[#e4e6ea] rounded-xl p-3 flex flex-col gap-2 hover:shadow-md hover:border-[#1877F2] transition-all"
    >
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-[#f7f8fa] border border-[#e4e6ea] flex items-center justify-center overflow-hidden flex-shrink-0">
          <img
            src={`https://www.google.com/s2/favicons?domain=${tool.domain}&sz=64`}
            alt={tool.name}
            width={18}
            height={18}
            className="rounded object-contain"
            onError={(e) => {
              const t = e.currentTarget;
              t.style.display = "none";
              if (t.nextElementSibling) (t.nextElementSibling as HTMLElement).style.display = "flex";
            }}
          />
          <span className="text-sm hidden items-center justify-center w-full h-full">{tool.icon}</span>
        </div>
        <span className="text-xs font-semibold text-[#1c1e21] leading-tight">{tool.name}</span>
      </div>
      <p className="text-[10px] text-[#65676b] leading-relaxed line-clamp-2">{tool.description}</p>
    </a>
  );
}

export default function HomePage() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [activePricing, setActivePricing] = useState<PricingFilter>("All");
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const router = useRouter();

  const handleSubmit = (q: string) => {
    const trimmed = q.trim();
    if (!trimmed) return;
    router.push(`/recommend?q=${encodeURIComponent(trimmed)}`);
  };

  const scrollToTools = () => {
    document.getElementById("tool-grid")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const filtered = TOOLS.filter((t) => {
    const matchesCategory = activeCategory === "All" || t.category === activeCategory;
    const matchesPricing = activePricing === "All" || t.pricing === activePricing;
    const matchesSearch = !query.trim() || (
      t.name.toLowerCase().includes(query.toLowerCase()) ||
      t.description.toLowerCase().includes(query.toLowerCase())
    );
    return matchesCategory && matchesPricing && matchesSearch;
  });

  const newThisWeekTools = TOOLS.filter((t) => t.isNewThisWeek);
  const featuredTools = TOOLS.filter((t) => t.isFeatured);

  return (
    <div className="flex flex-col min-h-screen bg-white">

      {/* Sticky nav */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-[#e4e6ea] px-6 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <a href="/" className="flex items-center gap-2 flex-shrink-0">
            <Logo size={24} />
            <span className="font-semibold text-[#1877F2] text-sm tracking-tight">HowToUseMyAI</span>
          </a>
<a href="/submit" className="text-xs text-[#e41e3f] font-semibold hover:opacity-80 transition-opacity whitespace-nowrap">+ Submit a Tool</a>
        </div>
      </header>

      {/* Hero — Google-style */}
      <section className="bg-white px-4 sm:px-6 pt-6 sm:pt-8 pb-6 text-center">
        <div className="max-w-2xl mx-auto">


          {/* Inline search bar */}
          <div className="search-glow flex items-center bg-white rounded-full px-4 py-2 gap-2">
            <svg className="w-4 h-4 text-[#bcc0c4] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              className="flex-1 text-sm text-[#1c1e21] bg-transparent placeholder-[#bcc0c4] focus:outline-none"
              placeholder='e.g. "I want to create a YouTube video"'
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(query); }}
            />
            <button
              onClick={() => handleSubmit(query)}
              disabled={!query.trim()}
              className="bg-[#1877F2] hover:bg-[#166FE5] disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-semibold px-4 py-2 rounded-full transition-colors whitespace-nowrap flex-shrink-0"
            >
              Find My AI
            </button>
          </div>

          {/* Trending chips — scrollable single row */}
          <div className="mt-5 pb-1">
            <span className="text-xs text-[#bcc0c4] block mb-2">Try:</span>
            <div className="grid grid-cols-3 gap-2">
            {TRENDING.map((term) => (
              <button
                key={term}
                onClick={() => handleSubmit(term)}
                className="text-xs px-3 h-10 rounded-full border border-[#e4e6ea] text-[#65676b] hover:border-[#1877F2] hover:text-[#1877F2] transition-all bg-white text-center flex items-center justify-center leading-tight"
              >
                {term}
              </button>
            ))}
            </div>
          </div>
        </div>
      </section>

      {/* Category chips */}
      <section id="tools" className="px-6 pt-5 pb-3 bg-white border-b border-[#f0f2f5]">
        <div className="max-w-6xl mx-auto grid grid-cols-3 gap-2 pb-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => { setActiveCategory(cat); scrollToTools(); }}
              className={`text-xs px-3 h-10 rounded-full border font-medium transition-all text-center flex items-center justify-center leading-tight ${
                activeCategory === cat
                  ? "bg-[#1877F2] text-white border-[#1877F2] shadow-sm shadow-[#1877F2]/20"
                  : "bg-white text-[#65676b] border-[#dddfe2] hover:border-[#1877F2] hover:text-[#1877F2]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Pricing filter */}
        <div className="max-w-6xl mx-auto flex flex-wrap gap-2 mt-3 pb-2">
          {PRICING_OPTIONS.map((p) => (
            <button
              key={p}
              onClick={() => { setActivePricing(p); scrollToTools(); }}
              className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-all whitespace-nowrap flex-shrink-0 ${
                activePricing === p
                  ? "bg-[#e41e3f] text-white border-[#e41e3f] shadow-sm shadow-[#e41e3f]/20"
                  : "bg-white text-[#65676b] border-[#dddfe2] hover:border-[#e41e3f] hover:text-[#e41e3f]"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </section>

      {/* New This Week + Editor's Picks horizontal scroll sections */}
      <section className="px-4 sm:px-6 pt-6 pb-2 bg-white border-b border-[#f0f2f5]">
        <div className="max-w-6xl mx-auto space-y-6">

          {/* New This Week */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[10px] font-bold bg-[#fff0f3] text-[#e41e3f] px-2 py-0.5 rounded-full">NEW</span>
              <h2 className="text-sm font-semibold text-[#1c1e21]">New This Week</h2>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {newThisWeekTools.map((tool) => (
                <MiniToolCard key={tool.name} tool={tool} />
              ))}
            </div>
          </div>

          {/* Editor's Picks */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[10px] font-bold bg-[#E7F3FF] text-[#1877F2] px-2 py-0.5 rounded-full">⭐ PICKS</span>
              <h2 className="text-sm font-semibold text-[#1c1e21]">Editor&apos;s Picks</h2>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {featuredTools.map((tool) => (
                <MiniToolCard key={tool.name} tool={tool} />
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* Tool cards */}
      <section id="tool-grid" className="px-4 sm:px-6 py-8 flex-1 bg-[#f7f8fa]">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs text-[#65676b] mb-5">{filtered.length} tools available</p>
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {filtered.map((tool) => (
              <a
                key={tool.name}
                href={`/tools/${slugify(tool.name)}`}
                className="tool-card relative group bg-white border border-[#e4e6ea] rounded-xl p-4 flex flex-col gap-2 overflow-hidden hover:shadow-md transition-all"
              >
                {/* Top row: logo + badges */}
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-lg bg-[#f7f8fa] border border-[#e4e6ea] flex items-center justify-center overflow-hidden flex-shrink-0">
                    <img
                      src={`https://www.google.com/s2/favicons?domain=${tool.domain}&sz=64`}
                      alt={tool.name}
                      width={24}
                      height={24}
                      className="rounded object-contain"
                      onError={(e) => {
                        const t = e.currentTarget;
                        t.style.display = "none";
                        if (t.nextElementSibling) (t.nextElementSibling as HTMLElement).style.display = "flex";
                      }}
                    />
                    <span className="text-lg hidden items-center justify-center w-full h-full">{tool.icon}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {tool.isFeatured && (
                      <span className="text-[9px] font-bold bg-[#E7F3FF] text-[#1877F2] px-1.5 py-0.5 rounded-full">⭐</span>
                    )}
                    {tool.isNew && (
                      <span className="text-[9px] font-bold bg-[#fff0f3] text-[#e41e3f] px-1.5 py-0.5 rounded-full">NEW</span>
                    )}
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${PRICING_STYLES[tool.pricing]}`}>
                      {tool.pricing.toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Name + description */}
                <div>
                  <h3 className="text-sm font-semibold text-[#1c1e21] group-hover:text-[#1877F2] transition-colors leading-tight">
                    {tool.name}
                  </h3>
                  <p className="text-xs text-[#65676b] mt-1 leading-relaxed line-clamp-2">
                    {tool.description}
                  </p>
                </div>

                {/* Visit link */}
                <div className="mt-auto pt-1">
                  <span className="text-[11px] font-medium text-[#1877F2] group-hover:underline">
                    Visit tool
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-white border-t border-[#e4e6ea] px-6 py-10">
        <div className="max-w-md mx-auto text-center">
          <p className="text-xs text-[#65676b] mb-4">Get the best new AI tools in your inbox every week.</p>
          {subscribed ? (
            <p className="text-sm text-[#1877F2] font-medium">You&apos;re in!</p>
          ) : (
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (email.trim()) {
                  await fetch("https://formspree.io/f/mbdwnbqb", {
                    method: "POST",
                    headers: { "Content-Type": "application/json", Accept: "application/json" },
                    body: JSON.stringify({ email, _subject: "New newsletter subscriber" }),
                  });
                  setSubscribed(true);
                }
              }}
              className="search-glow flex items-center bg-white rounded-full px-4 py-2 gap-2"
            >
              <input
                type="email"
                required
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 text-sm text-[#1c1e21] bg-transparent placeholder-[#bcc0c4] focus:outline-none"
              />
              <button
                type="submit"
                className="bg-[#1877F2] hover:bg-[#166FE5] text-white text-xs font-semibold px-4 py-2 rounded-full transition-colors whitespace-nowrap flex-shrink-0"
              >
                Subscribe
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#e4e6ea] px-6 py-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#65676b]">
          <div className="flex items-center gap-2">
            <Logo size={18} />
            <span className="font-medium text-[#1877F2]">HowToUseMyAI</span>
          </div>
          <div className="flex gap-5">
            <a href="/" className="hover:text-[#1877F2] transition-colors">Home</a>
            <a href="/submit" className="hover:text-[#e41e3f] transition-colors text-[#e41e3f]">Submit a Tool</a>
            <a href="/privacy" className="hover:text-[#1877F2] transition-colors">Privacy</a>
            <a href="/terms" className="hover:text-[#1877F2] transition-colors">Terms</a>
          </div>
          <p>© {new Date().getFullYear()} HowToUseMyAI</p>
        </div>
      </footer>
    </div>
  );
}
