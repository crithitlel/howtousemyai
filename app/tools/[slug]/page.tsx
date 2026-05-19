"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { TOOLS, slugify as libSlugify } from "@/lib/tools";
import { getToolUrl } from "@/lib/affiliates";

interface ToolData {
  name: string;
  domain: string;
  icon: string;
  pricing: "Free" | "Freemium" | "Paid";
  category: string;
  shortDescription: string;
  fullDescription: string;
  bestFor: string[];
  steps: [string, string, string];
  url: string;
}

export const TOOLS_DATA: ToolData[] = [
  // Writing
  {
    name: "ChatGPT",
    domain: "openai.com",
    icon: "💬",
    pricing: "Freemium",
    category: "Writing",
    shortDescription: "The world's most popular AI assistant for writing, coding, research and more.",
    fullDescription: "ChatGPT by OpenAI is the world's most widely used AI assistant, capable of drafting emails, writing essays, generating code, summarizing documents, and engaging in detailed research conversations. It powers millions of workflows across every industry.",
    bestFor: ["Blog posts and long-form articles", "Email drafting and proofreading", "Brainstorming and ideation", "Research summaries and Q&A"],
    steps: ["Go to chat.openai.com and create a free account.", "Type your request in plain English, be specific about tone, length, and format.", "Refine by asking it to adjust, expand, or rewrite until you're happy."],
    url: "https://chat.openai.com",
  },
  {
    name: "Claude",
    domain: "anthropic.com",
    icon: "🤖",
    pricing: "Freemium",
    category: "Writing",
    shortDescription: "Anthropic's AI assistant for nuanced writing and complex reasoning.",
    fullDescription: "Claude by Anthropic excels at nuanced, long-form writing and follows complex multi-step instructions with exceptional accuracy. It handles large documents natively and is preferred for tasks requiring careful reasoning, careful fact-handling, and sensitive topics.",
    bestFor: ["Long documents and reports", "Nuanced, careful writing", "Complex reasoning tasks", "Research summaries"],
    steps: ["Visit claude.ai and sign in with Google or email.", "Paste your outline or context and describe your tone and audience.", "Use follow-up messages to refine individual sections."],
    url: "https://claude.ai",
  },
  {
    name: "Jasper",
    domain: "jasper.ai",
    icon: "✍️",
    pricing: "Paid",
    category: "Writing",
    shortDescription: "AI writing platform for marketing teams and content creators.",
    fullDescription: "Jasper is an enterprise-grade AI writing platform purpose-built for marketing teams. It offers 50+ templates covering everything from ad copy to long-form blog posts, plus brand voice settings so all output stays on-brand.",
    bestFor: ["Marketing copy and ads", "Product descriptions at scale", "Content briefs and SEO articles", "Brand-consistent writing"],
    steps: ["Start a free trial at jasper.ai and set up your brand voice.", "Choose a template, Blog Post, Ad Copy, Product Description, etc.", "Generate, review, and export content directly to your CMS."],
    url: "https://jasper.ai",
  },
  {
    name: "Copy.ai",
    domain: "copy.ai",
    icon: "📣",
    pricing: "Freemium",
    category: "Writing",
    shortDescription: "AI copywriting tool for ads, emails, and social media content.",
    fullDescription: "Copy.ai is a workflow-driven AI platform focused on marketing copy. It generates multiple variants of ad copy, email sequences, and social captions, letting you A/B test ideas quickly without a full copywriting team.",
    bestFor: ["Ad copy for Facebook and Google", "Email nurture sequences", "Social media captions", "Multiple copy variants for testing"],
    steps: ["Create a free account at copy.ai.", "Choose a workflow, Blog Post Wizard, Ad Copy, Email Sequence, etc.", "Enter your product or topic and generate multiple variants to choose from."],
    url: "https://copy.ai",
  },
  {
    name: "Grammarly",
    domain: "grammarly.com",
    icon: "📝",
    pricing: "Freemium",
    category: "Writing",
    shortDescription: "AI writing assistant that checks grammar, style, and tone everywhere.",
    fullDescription: "Grammarly is the most widely used writing assistant, running as a browser extension and desktop app that checks grammar, spelling, style, and tone across every platform, from Gmail to Google Docs to Slack.",
    bestFor: ["Emails and professional documents", "Grammar and spelling fixes", "Tone adjustment for different audiences", "Academic and business writing"],
    steps: ["Install the Grammarly extension at grammarly.com, it works in all browsers.", "Write anywhere and see inline suggestions appear automatically.", "Accept fixes and use the tone detector to match your audience."],
    url: "https://grammarly.com",
  },
  {
    name: "Writesonic",
    domain: "writesonic.com",
    icon: "🖊️",
    pricing: "Freemium",
    category: "Writing",
    shortDescription: "AI writer with 100+ templates for blogs, ads, and social content.",
    fullDescription: "Writesonic offers over 100 AI writing templates covering SEO articles, product descriptions, landing pages, ad copy, and social media content. Its Botsonic feature lets you build custom AI chatbots for your website.",
    bestFor: ["SEO blog posts at scale", "Product descriptions", "Landing page copy", "Social media content"],
    steps: ["Sign up at writesonic.com and choose a template.", "Enter your topic, target keywords, and brand tone.", "Generate, review, and export your content directly."],
    url: "https://writesonic.com",
  },
  {
    name: "Quillbot",
    domain: "quillbot.com",
    icon: "🔄",
    pricing: "Freemium",
    category: "Writing",
    shortDescription: "AI paraphrasing and summarizing tool.",
    fullDescription: "Quillbot is the leading AI paraphrasing tool, helping writers reword sentences, summarize long documents, and improve clarity. It offers multiple paraphrase modes from Standard to Creative, and integrates directly with Google Docs and Word.",
    bestFor: ["Paraphrasing to avoid repetition", "Summarizing long documents", "Academic rewriting", "Improving sentence clarity"],
    steps: ["Go to quillbot.com, no account needed for basic use.", "Paste your text and choose a paraphrase mode (Standard, Fluency, Creative, etc.).", "Click Paraphrase and review the rewritten text, adjusting synonyms as needed."],
    url: "https://quillbot.com",
  },
  {
    name: "Sudowrite",
    domain: "sudowrite.com",
    icon: "📖",
    pricing: "Paid",
    category: "Writing",
    shortDescription: "AI writing tool for fiction and creative writing.",
    fullDescription: "Sudowrite is purpose-built for fiction writers, novelists, screenwriters, and storytellers. It helps you brainstorm plot twists, write vivid descriptions, develop characters, and beat writer's block with tools designed for creative narrative work.",
    bestFor: ["Novel writing and long-form fiction", "Character development", "Plot brainstorming", "Overcoming writer's block"],
    steps: ["Sign up at sudowrite.com and start a new project.", "Paste your existing writing or start fresh, Sudowrite reads your style.", "Use tools like Describe, Brainstorm, or Write to expand your story."],
    url: "https://sudowrite.com",
  },
  {
    name: "Hemingway Editor",
    domain: "hemingwayapp.com",
    icon: "✂️",
    pricing: "Free",
    category: "Writing",
    shortDescription: "Makes your writing bold and clear.",
    fullDescription: "The Hemingway Editor highlights complex sentences, passive voice, adverbs, and readability issues, pushing you toward cleaner, bolder prose. It gives each piece a readability grade and works entirely in the browser for free.",
    bestFor: ["Simplifying dense writing", "Improving readability scores", "Removing filler words and passive voice", "Blog posts and content marketing"],
    steps: ["Go to hemingwayapp.com, no account needed.", "Paste your text and review the color-coded highlights.", "Fix red (very hard) and yellow (hard) sentences, then check the readability grade."],
    url: "https://hemingwayapp.com",
  },
  {
    name: "Wordtune",
    domain: "wordtune.com",
    icon: "🎯",
    pricing: "Freemium",
    category: "Writing",
    shortDescription: "AI that rewrites sentences to sound better.",
    fullDescription: "Wordtune rewrites sentences in real time, offering alternatives that are more casual, formal, concise, or expanded, perfect for non-native English speakers or anyone who wants to punch up their writing without changing the meaning.",
    bestFor: ["Rewriting awkward sentences", "Adjusting formality level", "Non-native English improvement", "Email and message polish"],
    steps: ["Install the Wordtune extension at wordtune.com.", "Highlight any sentence in your document or email.", "Choose from suggested rewrites, casual, formal, shorter, or longer."],
    url: "https://wordtune.com",
  },
  {
    name: "Anyword",
    domain: "anyword.com",
    icon: "📊",
    pricing: "Paid",
    category: "Writing",
    shortDescription: "AI copywriting with performance predictions.",
    fullDescription: "Anyword combines AI copywriting with predictive performance scoring, each piece of copy gets a score predicting its click-through and conversion rate based on audience data, making it a powerful tool for performance marketers.",
    bestFor: ["High-converting ad copy", "Email subject lines", "Landing page optimization", "Performance marketing teams"],
    steps: ["Sign up at anyword.com and connect your ad accounts.", "Choose your copy type and target audience.", "Generate variants and sort by predicted performance score."],
    url: "https://anyword.com",
  },

  // Image Generation
  {
    name: "Midjourney",
    domain: "midjourney.com",
    icon: "🎨",
    pricing: "Paid",
    category: "Image Generation",
    shortDescription: "Generate stunning, artistic images from text prompts.",
    fullDescription: "Midjourney is the gold standard for AI art generation, producing breathtaking, stylized images that rival professional illustration. It runs via Discord and requires a paid subscription, but the quality is unmatched for editorial, concept, and brand imagery.",
    bestFor: ["Concept art and illustrations", "Editorial and marketing visuals", "Brand imagery and mood boards", "Fine art and experimental images"],
    steps: ["Join the Midjourney Discord at midjourney.com and subscribe to a plan.", "Type /imagine followed by a detailed prompt in any bot channel.", "Use U (upscale) and V (variation) buttons to refine your favorite result."],
    url: "https://midjourney.com",
  },
  {
    name: "DALL-E 3",
    domain: "openai.com",
    icon: "🖼️",
    pricing: "Freemium",
    category: "Image Generation",
    shortDescription: "OpenAI's image generation model integrated into ChatGPT.",
    fullDescription: "DALL-E 3 is OpenAI's latest image generation model, notable for its exceptional prompt fidelity and ability to render text accurately within images. It's integrated directly into ChatGPT, making it accessible to anyone with a free account.",
    bestFor: ["Accurate text rendering in images", "Photorealistic scenes", "Social media graphics", "Quick image generation via ChatGPT"],
    steps: ["Open ChatGPT at chat.openai.com, free users get limited DALL-E access.", "Type 'Create an image of...' and describe your scene with style and mood.", "Download or ask ChatGPT to iterate with specific changes."],
    url: "https://labs.openai.com",
  },
  {
    name: "Adobe Firefly",
    domain: "adobe.com",
    icon: "🔥",
    pricing: "Freemium",
    category: "Image Generation",
    shortDescription: "Commercially safe AI image generation built into Adobe tools.",
    fullDescription: "Adobe Firefly is trained exclusively on licensed Adobe Stock images, making it the only major AI image generator that is completely commercially safe. It integrates natively into Photoshop, Illustrator, and Express for seamless professional workflows.",
    bestFor: ["Commercial-safe image generation", "Product photography backgrounds", "Design asset creation", "Integration with Adobe Creative Cloud"],
    steps: ["Go to firefly.adobe.com and sign in with a free Adobe ID.", "Enter a prompt and adjust style, color, and composition sliders.", "Open in Photoshop to edit further, or download directly."],
    url: "https://firefly.adobe.com",
  },
  {
    name: "Stable Diffusion",
    domain: "stability.ai",
    icon: "⚡",
    pricing: "Free",
    category: "Image Generation",
    shortDescription: "Open-source image model with no usage limits.",
    fullDescription: "Stable Diffusion is the leading open-source image generation model, run it locally for free with no usage limits, or use hosted platforms like DreamStudio. It supports fine-tuned models (LoRAs), inpainting, and a huge community of custom checkpoints.",
    bestFor: ["Unlimited image generation", "Custom fine-tuned models", "Privacy-conscious generation (local)", "High-volume creative workflows"],
    steps: ["Use DreamStudio at dreamstudio.ai for instant cloud access.", "Write a detailed prompt and a negative prompt to exclude unwanted elements.", "Adjust steps and CFG scale, higher CFG means closer to your prompt."],
    url: "https://dreamstudio.ai",
  },
  {
    name: "Leonardo.ai",
    domain: "leonardo.ai",
    icon: "🎭",
    pricing: "Freemium",
    category: "Image Generation",
    shortDescription: "Fine-tuned image generation for game art and product design.",
    fullDescription: "Leonardo.ai offers a platform for fine-tuned image generation with a focus on game assets, characters, and product design. It provides pre-trained models for specific styles plus a canvas tool for detailed editing.",
    bestFor: ["Game art and character design", "Product visualization", "Consistent character generation", "Style-specific fine-tuned outputs"],
    steps: ["Create an account at leonardo.ai and select a fine-tuned model.", "Write your prompt and set image dimensions and style.", "Use the Canvas tool to edit specific areas or generate variations."],
    url: "https://leonardo.ai",
  },
  {
    name: "Canva AI",
    domain: "canva.com",
    icon: "🖌️",
    pricing: "Freemium",
    category: "Image Generation",
    shortDescription: "Design platform with AI image generation built in.",
    fullDescription: "Canva AI integrates powerful image generation directly into Canva's design platform, letting you create images, remove backgrounds, expand images, and generate entire design layouts with AI, all without leaving your design workflow.",
    bestFor: ["Social media graphics", "Presentations and documents", "Marketing materials", "Non-designers who need great visuals"],
    steps: ["Go to canva.com and open or create a design.", "Click 'Apps' and choose 'Text to Image' to generate images with AI.", "Insert generated images directly into your design and customize."],
    url: "https://canva.com",
  },
  {
    name: "Ideogram",
    domain: "ideogram.ai",
    icon: "🔤",
    pricing: "Freemium",
    category: "Image Generation",
    shortDescription: "AI image generator great for text in images.",
    fullDescription: "Ideogram specializes in generating images with accurate, readable text rendered inside them, a major weakness of most AI image tools. It's ideal for creating posters, logos, signs, and any image where typography matters.",
    bestFor: ["Images with text overlays", "Poster and sign design", "Logo concepts", "Typography-focused visuals"],
    steps: ["Go to ideogram.ai and create a free account.", "Describe your image and include any text you want rendered, put it in quotes.", "Choose a style (realistic, design, 3D) and generate."],
    url: "https://ideogram.ai",
  },
  {
    name: "Playground AI",
    domain: "playground.com",
    icon: "🎮",
    pricing: "Free",
    category: "Image Generation",
    shortDescription: "Free AI image generator with powerful controls.",
    fullDescription: "Playground AI is a generous free-tier image generator offering 500 images per day with powerful controls including negative prompts, guidance scale, and multiple model options. It's one of the best free alternatives to Midjourney.",
    bestFor: ["High-volume free image generation", "Experimentation with different models", "Social media content", "Design mockups"],
    steps: ["Go to playground.com and sign up for a free account.", "Enter your prompt and adjust quality, guidance scale, and model.", "Generate up to 500 images free per day and download your favorites."],
    url: "https://playground.com",
  },
  {
    name: "Remove.bg",
    domain: "remove.bg",
    icon: "✂️",
    pricing: "Freemium",
    category: "Image Generation",
    shortDescription: "Remove image backgrounds instantly with AI.",
    fullDescription: "Remove.bg uses AI to remove image backgrounds in seconds with exceptional edge accuracy, hair, fur, and complex shapes included. It's the fastest way to create transparent PNGs for product photos, headshots, and design work.",
    bestFor: ["Product photography backgrounds", "Headshot and portrait cutouts", "Design asset preparation", "E-commerce product images"],
    steps: ["Go to remove.bg and upload your image, no account needed for one-off use.", "The AI removes the background automatically in about 5 seconds.", "Download the transparent PNG or add a new background color/image."],
    url: "https://remove.bg",
  },
  {
    name: "Clipdrop",
    domain: "clipdrop.co",
    icon: "📷",
    pricing: "Freemium",
    category: "Image Generation",
    shortDescription: "Suite of AI image editing tools by Stability AI.",
    fullDescription: "Clipdrop by Stability AI is a comprehensive suite of AI image editing tools including background removal, image upscaling, relighting, generative fill, and text-to-image, all in one web-based platform.",
    bestFor: ["Image background removal and replacement", "Photo relighting and enhancement", "Image upscaling", "Quick AI-powered edits"],
    steps: ["Go to clipdrop.co and choose the tool you need.", "Upload your image and let the AI process it automatically.", "Download the result or chain multiple tools together."],
    url: "https://clipdrop.co",
  },

  // Coding
  {
    name: "GitHub Copilot",
    domain: "github.com",
    icon: "💻",
    pricing: "Freemium",
    category: "Coding",
    shortDescription: "AI pair programmer that suggests code completions in real time.",
    fullDescription: "GitHub Copilot is the most widely adopted AI coding assistant, trained on billions of lines of public code. It suggests entire functions, generates boilerplate, and completes code inline as you type in VS Code, JetBrains, and other IDEs.",
    bestFor: ["Everyday code completion", "Boilerplate and repetitive code", "Learning new languages", "Documentation and comments"],
    steps: ["Install the GitHub Copilot extension in VS Code from the marketplace.", "Start typing a comment describing what you want the function to do.", "Press Tab to accept the suggestion or cycle through alternatives with Alt+]."],
    url: "https://github.com/features/copilot",
  },
  {
    name: "Cursor",
    domain: "cursor.sh",
    icon: "⌨️",
    pricing: "Freemium",
    category: "Coding",
    shortDescription: "AI-first code editor that understands your entire codebase.",
    fullDescription: "Cursor is a VS Code fork with deep AI integration, it understands your entire codebase, can edit multiple files simultaneously, and lets you have conversations about your code. It's the preferred editor for developers who want AI deeply embedded in their workflow.",
    bestFor: ["Codebase-wide refactoring", "Multi-file edits", "Understanding unfamiliar codebases", "AI-assisted debugging"],
    steps: ["Download Cursor at cursor.sh, it imports your VS Code settings automatically.", "Press Cmd+K to edit inline, or Cmd+L to open the chat panel.", "Use @ to reference specific files, folders, or docs in your prompt."],
    url: "https://cursor.sh",
  },
  {
    name: "Replit AI",
    domain: "replit.com",
    icon: "🔧",
    pricing: "Freemium",
    category: "Coding",
    shortDescription: "Browser-based coding with AI assistance, no setup required.",
    fullDescription: "Replit AI is a fully browser-based coding environment with built-in AI that can write, debug, and explain code. It's ideal for beginners, quick prototypes, and anyone who doesn't want to deal with local development setup.",
    bestFor: ["Quick prototypes and experiments", "Learning to code", "Browser-based development", "Collaborative coding"],
    steps: ["Go to replit.com and create a new Repl in any language.", "Describe what you want to build to the AI assistant in the chat panel.", "Run and share your app instantly from the browser with one click."],
    url: "https://replit.com",
  },
  {
    name: "Tabnine",
    domain: "tabnine.com",
    icon: "🛠️",
    pricing: "Freemium",
    category: "Coding",
    shortDescription: "Privacy-first AI code completion for all major IDEs.",
    fullDescription: "Tabnine is an enterprise-ready AI code completion tool with a strong focus on privacy and security. It can run models locally on-device, making it the preferred choice for teams who cannot send code to external servers.",
    bestFor: ["Enterprise and security-conscious teams", "Privacy-first development", "All major IDEs", "Team coding consistency"],
    steps: ["Install the Tabnine plugin in your IDE (VS Code, IntelliJ, etc.).", "Tabnine learns your team's codebase style over time automatically.", "Get context-aware suggestions as you type and accept with Tab."],
    url: "https://tabnine.com",
  },
  {
    name: "Codeium",
    domain: "codeium.com",
    icon: "⚡",
    pricing: "Free",
    category: "Coding",
    shortDescription: "Free AI code completion for 70+ languages.",
    fullDescription: "Codeium offers unlimited free AI code completion across 70+ programming languages and all major IDEs. It's the best free alternative to GitHub Copilot, with no usage limits and support for everything from Python to Rust.",
    bestFor: ["Free unlimited code completion", "Students and hobbyists", "Polyglot developers", "Teams on a budget"],
    steps: ["Install the Codeium extension at codeium.com for your IDE.", "Create a free account, completions are unlimited with no credit card.", "Code as normal and accept AI suggestions with Tab."],
    url: "https://codeium.com",
  },
  {
    name: "Amazon CodeWhisperer",
    domain: "aws.amazon.com",
    icon: "☁️",
    pricing: "Free",
    category: "Coding",
    shortDescription: "AWS AI coding assistant.",
    fullDescription: "Amazon CodeWhisperer is AWS's free AI coding assistant, optimized for AWS services and cloud development. It integrates with VS Code and JetBrains and provides real-time code suggestions with security scanning for vulnerabilities.",
    bestFor: ["AWS and cloud development", "Security vulnerability scanning", "Python, Java, and TypeScript", "AWS SDK usage"],
    steps: ["Install the AWS Toolkit extension in VS Code or JetBrains.", "Sign in with a free AWS Builder ID, no AWS account required.", "Code with AI suggestions and run the built-in security scans."],
    url: "https://aws.amazon.com/codewhisperer",
  },
  {
    name: "Sourcegraph Cody",
    domain: "sourcegraph.com",
    icon: "🔍",
    pricing: "Freemium",
    category: "Coding",
    shortDescription: "AI coding assistant with codebase context.",
    fullDescription: "Sourcegraph Cody is an AI coding assistant that indexes your entire codebase to provide deeply contextual suggestions. It can answer questions about your code, find usages, explain functions, and generate code that fits your existing patterns.",
    bestFor: ["Large codebase navigation", "Understanding legacy code", "Contextual code generation", "Enterprise teams"],
    steps: ["Install the Cody extension in VS Code at sourcegraph.com/cody.", "Sign up for a free account and connect your codebase.", "Ask questions about your code or generate code with full context."],
    url: "https://sourcegraph.com/cody",
  },
  {
    name: "Pieces for Developers",
    domain: "pieces.app",
    icon: "🧩",
    pricing: "Freemium",
    category: "Coding",
    shortDescription: "AI-powered developer workflow tool.",
    fullDescription: "Pieces for Developers is an AI-powered workflow tool that saves, organizes, and enriches your code snippets with AI context. It learns from your development patterns and can surface the right snippet at the right time across all your tools.",
    bestFor: ["Code snippet management", "Developer workflow automation", "Cross-IDE context sharing", "Team knowledge sharing"],
    steps: ["Download Pieces at pieces.app and install the desktop app.", "Install the IDE plugin for VS Code or JetBrains.", "Save snippets with one click and let AI tag and describe them automatically."],
    url: "https://pieces.app",
  },

  // Video
  {
    name: "Runway",
    domain: "runwayml.com",
    icon: "🎬",
    pricing: "Freemium",
    category: "Video",
    shortDescription: "Professional AI video generation and editing for creators.",
    fullDescription: "Runway is the leading professional AI video platform, offering text-to-video, image-to-video, video-to-video transformation, green screen removal, and a full suite of AI editing tools. Gen-3 Alpha produces cinematic-quality clips.",
    bestFor: ["AI-generated video clips", "Visual effects and compositing", "Creative video editing", "Professional content production"],
    steps: ["Create an account at runwayml.com and open Gen-3 Alpha.", "Write a text prompt describing your scene, camera movement, and style.", "Generate, download, and chain clips in Runway's timeline editor."],
    url: "https://runwayml.com",
  },
  {
    name: "HeyGen",
    domain: "heygen.com",
    icon: "🎥",
    pricing: "Freemium",
    category: "Video",
    shortDescription: "Create AI avatar videos with realistic human presenters.",
    fullDescription: "HeyGen lets you create professional avatar videos at scale, either using stock AI avatars or cloning your own voice and likeness with 2 minutes of footage. It supports 40+ languages and produces polished videos in minutes.",
    bestFor: ["Personalized sales and marketing videos", "HR onboarding content", "Multilingual video localization", "Social media presenter videos"],
    steps: ["Create a free account at heygen.com.", "Pick a stock avatar or record 2 minutes to clone yourself.", "Type your script and hit Generate, video ready in minutes with auto-captions."],
    url: "https://heygen.com",
  },
  {
    name: "Synthesia",
    domain: "synthesia.io",
    icon: "📹",
    pricing: "Paid",
    category: "Video",
    shortDescription: "AI presenter videos with avatars reading your script.",
    fullDescription: "Synthesia is the enterprise standard for AI presenter videos, used by companies like Google, Nike, and Reuters. It creates polished training, product, and explainer videos with realistic AI avatars in 120+ languages.",
    bestFor: ["Corporate training videos", "Product demo videos", "Multilingual content at scale", "Internal communications"],
    steps: ["Sign up at synthesia.io and choose an AI avatar from 140+ options.", "Paste your script, the avatar lip-syncs it perfectly.", "Select a background, add slides, and click Generate."],
    url: "https://synthesia.io",
  },
  {
    name: "CapCut AI",
    domain: "capcut.com",
    icon: "✂️",
    pricing: "Free",
    category: "Video",
    shortDescription: "Free AI video editor with auto-captions and effects.",
    fullDescription: "CapCut is a free, full-featured AI video editor by ByteDance with automatic captions, background removal, text-to-video, AI effects, and viral social media templates. It works on mobile and web.",
    bestFor: ["TikTok, Reels, and YouTube Shorts", "Auto-caption generation", "Quick social video edits", "Beginners to video editing"],
    steps: ["Go to capcut.com, completely free with no watermark limits.", "Import your footage and click Auto Captions for instant subtitles.", "Apply AI effects and transitions, then export in one click."],
    url: "https://capcut.com",
  },
  {
    name: "Descript",
    domain: "descript.com",
    icon: "🎞️",
    pricing: "Freemium",
    category: "Video",
    shortDescription: "Edit video by editing its transcript, the easiest video editor.",
    fullDescription: "Descript lets you edit audio and video by editing the auto-generated transcript like a document, delete words to cut clips, rearrange sentences to reorder scenes. It also features Overdub for fixing audio mistakes by typing.",
    bestFor: ["YouTube video editing", "Podcast production", "Removing filler words automatically", "Repurposing long-form content"],
    steps: ["Download Descript at descript.com and import your video or audio.", "Edit the auto-generated transcript to cut and rearrange clips.", "Use Overdub to fix audio mistakes by typing replacement words."],
    url: "https://descript.com",
  },
  {
    name: "Invideo AI",
    domain: "invideo.ai",
    icon: "▶️",
    pricing: "Freemium",
    category: "Video",
    shortDescription: "Turn a text prompt into a full YouTube-ready video.",
    fullDescription: "Invideo AI turns a text prompt into a complete YouTube-ready video with AI-generated script, stock footage, voiceover, and captions, all in under 10 minutes. It's the fastest way to produce explainer and news-style videos.",
    bestFor: ["YouTube explainer videos", "News-style content", "Faceless video channels", "Content repurposing"],
    steps: ["Go to invideo.ai and describe your video topic.", "AI generates the script, selects stock clips, and adds voiceover automatically.", "Edit any scene in the browser and export in HD."],
    url: "https://invideo.ai",
  },
  {
    name: "Pika Labs",
    domain: "pika.art",
    icon: "🎆",
    pricing: "Freemium",
    category: "Video",
    shortDescription: "AI video generation from text and images.",
    fullDescription: "Pika Labs is an AI video generation platform that creates short, high-quality video clips from text prompts or static images. Its 'Pikaffects' feature adds cinematic effects like explosions, melting, and crushing to any image.",
    bestFor: ["Short cinematic clips", "Animating still images", "Creative video effects", "Social media video content"],
    steps: ["Go to pika.art and create a free account.", "Type a text prompt or upload an image to animate.", "Generate and download your clip, or apply Pikaffects for creative transformations."],
    url: "https://pika.art",
  },
  {
    name: "D-ID",
    domain: "d-id.com",
    icon: "👤",
    pricing: "Freemium",
    category: "Video",
    shortDescription: "Create talking avatar videos from a photo.",
    fullDescription: "D-ID turns any photo into a talking avatar video, upload a portrait and type a script, and the AI animates the face realistically with synchronized lip movement and natural expression. Great for personalized video messages.",
    bestFor: ["Talking photo avatars", "Personalized video messages", "Historical character animations", "Educational content"],
    steps: ["Go to d-id.com and create an account.", "Upload a portrait photo and paste your script.", "Generate the talking video and download or share via link."],
    url: "https://d-id.com",
  },
  {
    name: "Loom AI",
    domain: "loom.com",
    icon: "📽️",
    pricing: "Freemium",
    category: "Video",
    shortDescription: "Async video messaging with AI summaries.",
    fullDescription: "Loom AI enhances the popular async video messaging app with AI-generated titles, summaries, chapters, and action items. It automatically transcribes your recordings and identifies key moments so viewers can skim without watching the full video.",
    bestFor: ["Async team communication", "Video meeting replacements", "Product demos and feedback", "Auto-generated video summaries"],
    steps: ["Install Loom at loom.com and record your screen or face.", "AI automatically generates a title, summary, and chapters.", "Share the link, viewers see the AI summary before deciding to watch."],
    url: "https://loom.com",
  },
  {
    name: "Captions",
    domain: "captions.ai",
    icon: "💬",
    pricing: "Freemium",
    category: "Video",
    shortDescription: "AI video editor with auto-captions and effects.",
    fullDescription: "Captions is an AI video editor focused on content creators, it adds accurate auto-captions, removes filler words, generates B-roll, adds AI eye contact correction, and creates short clips from long videos automatically.",
    bestFor: ["Creator auto-captions", "Filler word removal", "Eye contact correction", "Short-form content creation"],
    steps: ["Download the Captions app or go to captions.ai.", "Upload your video and let AI generate captions and identify filler words.", "Apply AI effects, export, and post directly to social platforms."],
    url: "https://captions.ai",
  },

  // Music
  {
    name: "Suno",
    domain: "suno.com",
    icon: "🎵",
    pricing: "Freemium",
    category: "Music",
    shortDescription: "Create full songs with lyrics and music from a text prompt.",
    fullDescription: "Suno is the leading AI music generator, producing complete radio-quality songs, vocals, instruments, lyrics, from a simple text prompt. It supports any genre and has become the go-to tool for anyone who wants original music without musical training.",
    bestFor: ["Original songs with vocals", "Jingles and branded music", "Background music for videos", "Any genre on demand"],
    steps: ["Go to suno.com and sign in with Google, free plan included.", "Click Create and describe your song genre, mood, and theme.", "Generate two variations, pick your favorite, and download."],
    url: "https://suno.com",
  },
  {
    name: "Udio",
    domain: "udio.com",
    icon: "🎶",
    pricing: "Freemium",
    category: "Music",
    shortDescription: "Generate original music tracks in any genre from text.",
    fullDescription: "Udio produces high-fidelity AI music with exceptional sonic quality and fine-grained style controls. Its track extension feature lets you seamlessly lengthen tracks, and it excels at complex compositions in challenging genres.",
    bestFor: ["High-fidelity instrumental music", "Genre-specific compositions", "Extended music tracks", "Experimental music styles"],
    steps: ["Visit udio.com and create a free account.", "Enter a prompt with genre, instruments, and mood.", "Use Extend to make tracks longer or remix specific sections."],
    url: "https://udio.com",
  },
  {
    name: "Mubert",
    domain: "mubert.com",
    icon: "🎼",
    pricing: "Freemium",
    category: "Music",
    shortDescription: "Royalty-free AI background music for videos and podcasts.",
    fullDescription: "Mubert generates adaptive, royalty-free background music for any use case, YouTube videos, podcasts, apps, and live streams. It creates music to a precise duration and lets you set mood, BPM, and genre.",
    bestFor: ["Royalty-free background music", "YouTube and podcast soundtracks", "Precise duration music generation", "App and game soundscapes"],
    steps: ["Go to mubert.com/generate and select your use case.", "Set mood, genre, BPM, and exact duration.", "Generate, preview, and download with a royalty-free license."],
    url: "https://mubert.com",
  },
  {
    name: "Soundraw",
    domain: "soundraw.io",
    icon: "🎸",
    pricing: "Freemium",
    category: "Music",
    shortDescription: "AI music generator for content creators.",
    fullDescription: "Soundraw lets you generate and fully customize AI music, adjust tempo, instruments, and structure section by section. Unlike most AI music tools, you can edit the generated music in detail before downloading.",
    bestFor: ["Customizable background music", "YouTube and content creator soundtracks", "Mood-specific music generation", "Royalty-free music libraries"],
    steps: ["Go to soundraw.io and choose a mood, genre, and length.", "AI generates multiple tracks, pick the closest match.", "Customize instruments, tempo, and structure section by section, then download."],
    url: "https://soundraw.io",
  },
  {
    name: "Boomy",
    domain: "boomy.com",
    icon: "🎤",
    pricing: "Freemium",
    category: "Music",
    shortDescription: "Create and release AI-generated songs.",
    fullDescription: "Boomy is unique in that it lets you create AI-generated songs and release them to Spotify, Apple Music, and other streaming platforms to earn royalties. It's the simplest path from AI music creation to commercial release.",
    bestFor: ["Creating and releasing music", "Passive income from AI songs", "Beginner music producers", "Quick song generation"],
    steps: ["Go to boomy.com and click Create Song.", "Choose a music style and let AI generate a complete track.", "Customize, claim ownership, and submit to streaming platforms."],
    url: "https://boomy.com",
  },
  {
    name: "Loudly",
    domain: "loudly.com",
    icon: "🔊",
    pricing: "Freemium",
    category: "Music",
    shortDescription: "AI music generation with style controls.",
    fullDescription: "Loudly combines AI music generation with a library of 170,000+ royalty-free tracks. Its smart filters let you dial in mood, energy level, instruments, and genre to find or generate exactly the track you need.",
    bestFor: ["Royalty-free music library access", "Mood and energy-based search", "Content creator soundtracks", "Podcast and video music"],
    steps: ["Go to loudly.com and sign up for a free account.", "Choose mood, energy, genre, and instruments to describe your track.", "Generate AI music or search the library, then download royalty-free."],
    url: "https://loudly.com",
  },

  // Research
  {
    name: "Perplexity AI",
    domain: "perplexity.ai",
    icon: "🔍",
    pricing: "Freemium",
    category: "Research",
    shortDescription: "AI-powered search engine with cited, real-time answers.",
    fullDescription: "Perplexity AI is an AI-powered search engine that provides direct, cited answers to complex questions using real-time web data. It has replaced traditional search for millions of users who need accurate, sourced information quickly.",
    bestFor: ["Fact-finding with citations", "Real-time information research", "Competitive intelligence", "Quick literature overviews"],
    steps: ["Go to perplexity.ai, no account required for basic search.", "Ask your question; enable Focus: Academic for scholarly sources.", "Click citations to verify, then use Follow-up questions to dig deeper."],
    url: "https://perplexity.ai",
  },
  {
    name: "Elicit",
    domain: "elicit.com",
    icon: "📚",
    pricing: "Freemium",
    category: "Research",
    shortDescription: "AI research assistant trained on academic papers.",
    fullDescription: "Elicit is an AI research assistant specifically trained on academic literature. It finds relevant papers, extracts key findings, and lets you compare results across studies, an essential tool for systematic reviews and academic research.",
    bestFor: ["Academic literature reviews", "Systematic reviews", "Evidence synthesis", "Finding key papers on a topic"],
    steps: ["Visit elicit.com and create a free account.", "Type your research question, Elicit surfaces the most relevant papers.", "Use extraction columns to pull key findings side-by-side across studies."],
    url: "https://elicit.com",
  },
  {
    name: "Consensus",
    domain: "consensus.app",
    icon: "🔬",
    pricing: "Freemium",
    category: "Research",
    shortDescription: "AI search engine for scientific and medical evidence.",
    fullDescription: "Consensus is an AI search engine that extracts findings directly from peer-reviewed papers, giving you evidence-backed answers to scientific questions. It's especially valuable for medical, nutrition, and health research.",
    bestFor: ["Medical and health research", "Scientific evidence verification", "Nutrition and lifestyle research", "Academic citations"],
    steps: ["Go to consensus.app and ask your research question.", "Get answers extracted directly from peer-reviewed papers with citations.", "Filter by study type and export references."],
    url: "https://consensus.app",
  },
  {
    name: "Otter.ai",
    domain: "otter.ai",
    icon: "🎙️",
    pricing: "Freemium",
    category: "Research",
    shortDescription: "AI meeting recorder and transcriber with instant summaries.",
    fullDescription: "Otter.ai automatically transcribes meetings, interviews, and lectures in real time, generating searchable transcripts and AI summaries. It integrates with Zoom, Google Meet, and Microsoft Teams.",
    bestFor: ["Meeting transcription", "Interview notes", "Lecture capture", "Async meeting summaries"],
    steps: ["Go to otter.ai and connect your Google or Zoom calendar.", "Join any meeting, Otter auto-joins and transcribes live.", "Search highlights and share the AI summary after the call."],
    url: "https://otter.ai",
  },
  {
    name: "Semantic Scholar",
    domain: "semanticscholar.org",
    icon: "🎓",
    pricing: "Free",
    category: "Research",
    shortDescription: "Free AI-powered academic search engine.",
    fullDescription: "Semantic Scholar is a free AI-powered academic search engine from the Allen Institute for AI, indexing 220 million papers. Its AI Summarizer generates paper highlights, and it maps citation relationships to help researchers find the most influential work.",
    bestFor: ["Free academic paper search", "Citation network exploration", "Discovering influential papers", "AI-summarized paper highlights"],
    steps: ["Go to semanticscholar.org, completely free, no account needed.", "Search your topic and use filters for year, field, and study type.", "Click a paper to see AI-generated highlights and its citation network."],
    url: "https://semanticscholar.org",
  },
  {
    name: "Scite",
    domain: "scite.ai",
    icon: "📋",
    pricing: "Freemium",
    category: "Research",
    shortDescription: "AI tool that shows how papers have been cited.",
    fullDescription: "Scite analyzes citation context, showing whether papers are cited supportively, contrastingly, or just mentioned. This helps researchers quickly assess the credibility and controversy around any scientific claim.",
    bestFor: ["Citation context analysis", "Credibility assessment of papers", "Identifying contested research", "Systematic evidence review"],
    steps: ["Go to scite.ai and search for a paper or claim.", "See whether citing papers support, contrast, or just mention the original.", "Filter by citation type to find the most relevant supporting or contradicting evidence."],
    url: "https://scite.ai",
  },
  {
    name: "Research Rabbit",
    domain: "researchrabbitapp.com",
    icon: "🐇",
    pricing: "Free",
    category: "Research",
    shortDescription: "AI paper discovery and visualization.",
    fullDescription: "Research Rabbit is a free AI-powered literature discovery tool that maps citation networks visually, helping researchers find related papers they didn't know existed. It's often described as 'Spotify for research papers.'",
    bestFor: ["Literature discovery", "Citation network visualization", "Finding related papers", "Building reading lists"],
    steps: ["Go to researchrabbitapp.com and create a free account.", "Add a paper you know is relevant to start building your collection.", "Let AI surface related papers and visualize the citation network."],
    url: "https://researchrabbitapp.com",
  },
  {
    name: "Explainpaper",
    domain: "explainpaper.com",
    icon: "📄",
    pricing: "Freemium",
    category: "Research",
    shortDescription: "Upload a paper and AI explains the hard parts.",
    fullDescription: "Explainpaper lets you upload any academic paper and highlight confusing text to get plain-English AI explanations. It makes dense technical literature accessible to students and practitioners without deep domain expertise.",
    bestFor: ["Understanding technical papers", "Students reading outside their field", "Quick paper comprehension", "Making research accessible"],
    steps: ["Go to explainpaper.com and upload a PDF paper.", "Highlight any confusing text and click Explain.", "Ask follow-up questions to go deeper on any concept."],
    url: "https://explainpaper.com",
  },

  // Productivity
  {
    name: "Notion AI",
    domain: "notion.so",
    icon: "🗂️",
    pricing: "Freemium",
    category: "Productivity",
    shortDescription: "AI built into Notion for writing, summarizing and organizing.",
    fullDescription: "Notion AI is embedded directly into Notion's workspace, letting you draft content, summarize pages, translate text, extract action items from notes, and auto-fill databases, all within your existing Notion setup.",
    bestFor: ["Summarizing meeting notes", "Drafting documents in Notion", "Action item extraction", "Database auto-fill"],
    steps: ["Open any Notion page and press Space to activate AI.", "Ask it to draft, summarize, or improve the existing content.", "Use AI on databases to auto-fill properties or generate content at scale."],
    url: "https://notion.so/product/ai",
  },
  {
    name: "Reclaim.ai",
    domain: "reclaim.ai",
    icon: "📅",
    pricing: "Freemium",
    category: "Productivity",
    shortDescription: "AI calendar optimizer that auto-schedules your tasks.",
    fullDescription: "Reclaim.ai integrates with your Google Calendar and automatically schedules your tasks, habits, and buffer time around existing meetings. It dynamically reschedules when priorities shift.",
    bestFor: ["Automatic task scheduling", "Focus time blocking", "Calendar optimization", "Habit scheduling"],
    steps: ["Connect your Google Calendar at reclaim.ai.", "Add your tasks and habits with time estimates and priorities.", "Reclaim auto-schedules them around your existing meetings and reschedules as needed."],
    url: "https://reclaim.ai",
  },
  {
    name: "Motion",
    domain: "usemotion.com",
    icon: "⏱️",
    pricing: "Paid",
    category: "Productivity",
    shortDescription: "AI that builds your perfect daily schedule automatically.",
    fullDescription: "Motion is an AI-powered task and calendar manager that builds your optimal daily schedule automatically based on deadlines, priorities, and meeting availability. Incomplete tasks are automatically rescheduled without manual intervention.",
    bestFor: ["Automatic daily schedule creation", "Deadline tracking", "Task prioritization", "Time management"],
    steps: ["Sign up at usemotion.com and add your tasks and deadlines.", "Connect your calendar, Motion builds your optimal schedule automatically.", "Incomplete tasks are rescheduled to the next best available slot."],
    url: "https://usemotion.com",
  },
  {
    name: "Mem",
    domain: "mem.ai",
    icon: "🧠",
    pricing: "Freemium",
    category: "Productivity",
    shortDescription: "AI-powered note-taking that organizes itself.",
    fullDescription: "Mem is an AI note-taking app that automatically organizes your notes using AI, no folders or tags required. Its chat feature lets you ask questions across all your notes, making your knowledge base searchable in natural language.",
    bestFor: ["Automatic note organization", "Knowledge base Q&A", "Meeting note capture", "Personal knowledge management"],
    steps: ["Sign up at mem.ai and start creating notes, no folder structure needed.", "Capture notes naturally and Mem's AI tags and connects them automatically.", "Use the chat feature to ask questions across your entire knowledge base."],
    url: "https://mem.ai",
  },
  {
    name: "Taskade",
    domain: "taskade.com",
    icon: "✅",
    pricing: "Freemium",
    category: "Productivity",
    shortDescription: "AI project management and team collaboration.",
    fullDescription: "Taskade is an AI-powered project management and collaboration tool that can generate project plans, write tasks, summarize docs, and run AI agents, all within a real-time collaborative workspace for teams.",
    bestFor: ["AI-generated project plans", "Team collaboration", "Task automation with AI agents", "Flexible views: list, board, mind map"],
    steps: ["Sign up at taskade.com and create a new project.", "Use AI to generate a project plan from a simple description.", "Collaborate with your team in real time and use AI agents to automate tasks."],
    url: "https://taskade.com",
  },
  {
    name: "Fireflies.ai",
    domain: "fireflies.ai",
    icon: "🔥",
    pricing: "Freemium",
    category: "Productivity",
    shortDescription: "AI meeting assistant that records and transcribes.",
    fullDescription: "Fireflies.ai automatically joins your video meetings to record, transcribe, and summarize. It extracts action items, key decisions, and searchable highlights, making every meeting accessible after the fact.",
    bestFor: ["Automatic meeting transcription", "Action item extraction", "Meeting search and recall", "Team meeting archives"],
    steps: ["Sign up at fireflies.ai and connect your calendar and meeting tools.", "Fireflies automatically joins meetings and starts recording.", "Access transcripts, summaries, and action items in your dashboard after each meeting."],
    url: "https://fireflies.ai",
  },
  {
    name: "Superhuman",
    domain: "superhuman.com",
    icon: "⚡",
    pricing: "Paid",
    category: "Productivity",
    shortDescription: "AI-powered email client.",
    fullDescription: "Superhuman is a premium AI-powered email client that dramatically speeds up email processing with keyboard shortcuts, AI triage, instant search, and AI email drafting. It's used by high-performers who process hundreds of emails daily.",
    bestFor: ["High-volume email management", "Fast email triage", "AI email drafting", "Inbox zero workflow"],
    steps: ["Apply at superhuman.com and complete the onboarding call.", "Learn the keyboard shortcuts, the entire interface is keyboard-driven.", "Use AI to draft replies and let AI triage automatically sort your inbox."],
    url: "https://superhuman.com",
  },

  // Marketing
  {
    name: "Surfer SEO",
    domain: "surferseo.com",
    icon: "📈",
    pricing: "Paid",
    category: "Marketing",
    shortDescription: "Data-driven SEO tool to rank higher on Google.",
    fullDescription: "Surfer SEO analyzes the top-ranking pages for your keyword and tells you exactly what content to include, how long it should be, and which NLP terms to use to maximize your chances of ranking on Google.",
    bestFor: ["SEO-optimized blog posts", "Content briefs and outlines", "SERP analysis", "Content editing for rankings"],
    steps: ["Sign up at surferseo.com and create a new Content Editor.", "Enter your target keyword, Surfer analyzes the top 10 results.", "Write content following the Content Score recommendations to optimize."],
    url: "https://surferseo.com",
  },
  {
    name: "AdCreative.ai",
    domain: "adcreative.ai",
    icon: "📢",
    pricing: "Paid",
    category: "Marketing",
    shortDescription: "Generate high-converting ad creatives and banners with AI.",
    fullDescription: "AdCreative.ai generates high-converting ad banners and creatives by learning from millions of top-performing ads. It provides a conversion score for each creative and connects directly to your Meta and Google ad accounts.",
    bestFor: ["Facebook and Instagram ads", "Google Display ads", "High-volume creative testing", "Performance marketing teams"],
    steps: ["Connect your brand at adcreative.ai and upload your logo and colors.", "Describe your product and target audience.", "Generate dozens of ad variants and download those with the highest conversion score."],
    url: "https://adcreative.ai",
  },
  {
    name: "Buffer",
    domain: "buffer.com",
    icon: "📱",
    pricing: "Freemium",
    category: "Marketing",
    shortDescription: "AI-powered social media scheduling and analytics.",
    fullDescription: "Buffer is a social media management platform with AI-powered features including an AI assistant that suggests post ideas, rewrites copy for different platforms, and analyzes which content drives the most engagement.",
    bestFor: ["Social media scheduling", "Multi-platform content management", "AI post generation", "Analytics and performance tracking"],
    steps: ["Sign up at buffer.com and connect your social accounts.", "Use the AI assistant to generate post ideas or rewrite content for each platform.", "Schedule your posts and review analytics in the dashboard."],
    url: "https://buffer.com",
  },
  {
    name: "Mailchimp AI",
    domain: "mailchimp.com",
    icon: "📧",
    pricing: "Freemium",
    category: "Marketing",
    shortDescription: "Email marketing platform with AI content suggestions.",
    fullDescription: "Mailchimp is the world's leading email marketing platform, now with AI features including subject line suggestions, send time optimization, content generation, and predictive audience segmentation.",
    bestFor: ["Email marketing campaigns", "Newsletter creation", "Audience segmentation", "Automated email sequences"],
    steps: ["Sign up at mailchimp.com, free for up to 500 contacts.", "Create a campaign and use AI to generate subject lines and body copy.", "Set up automated sequences and let AI optimize send times."],
    url: "https://mailchimp.com",
  },
  {
    name: "Semrush",
    domain: "semrush.com",
    icon: "🔍",
    pricing: "Paid",
    category: "Marketing",
    shortDescription: "Comprehensive AI SEO and marketing platform.",
    fullDescription: "Semrush is the industry-leading all-in-one SEO and digital marketing platform with AI-powered tools for keyword research, competitor analysis, backlink auditing, content optimization, and PPC campaign management.",
    bestFor: ["Keyword research and tracking", "Competitor SEO analysis", "Backlink auditing", "Content marketing strategy"],
    steps: ["Sign up at semrush.com and enter your domain or competitor's domain.", "Explore the Keyword Magic Tool to find high-value keywords.", "Use Content Analyzer to audit and improve existing pages."],
    url: "https://semrush.com",
  },
  {
    name: "Hootsuite",
    domain: "hootsuite.com",
    icon: "🦉",
    pricing: "Paid",
    category: "Marketing",
    shortDescription: "AI social media management and scheduling.",
    fullDescription: "Hootsuite is the enterprise social media management platform with AI-powered caption writing, best-time-to-post recommendations, social listening, and comprehensive analytics across all major platforms.",
    bestFor: ["Enterprise social media management", "Social listening and monitoring", "Multi-account scheduling", "Team collaboration on social"],
    steps: ["Sign up at hootsuite.com and connect your social accounts.", "Use OwlyWriter AI to generate captions and post ideas.", "Schedule posts at AI-recommended optimal times and monitor performance."],
    url: "https://hootsuite.com",
  },
  {
    name: "Recently.ai",
    domain: "recently.ai",
    icon: "♻️",
    pricing: "Freemium",
    category: "Marketing",
    shortDescription: "AI social media content repurposing.",
    fullDescription: "Recently.ai automatically repurposes long-form content, blog posts, podcasts, videos, into social media posts for every platform. It extracts key quotes, generates platform-specific copy, and schedules posts automatically.",
    bestFor: ["Content repurposing at scale", "Podcast to social posts", "Blog post distribution", "Automated social content"],
    steps: ["Sign up at recently.ai and connect your content sources.", "Add a blog post, podcast episode, or video URL.", "AI generates platform-specific posts and schedules them across your accounts."],
    url: "https://recently.ai",
  },
  {
    name: "Phrasee",
    domain: "phrasee.co",
    icon: "🗣️",
    pricing: "Paid",
    category: "Marketing",
    shortDescription: "AI brand language and email subject line optimizer.",
    fullDescription: "Phrasee uses AI to generate and optimize brand-compliant marketing copy, especially email subject lines and push notifications. It learns your brand voice and predicts performance before you send.",
    bestFor: ["Email subject line optimization", "Push notification copy", "Brand language consistency", "Enterprise marketing teams"],
    steps: ["Set up your brand voice at phrasee.co with your team.", "Generate subject line variants for your email campaign.", "Deploy the AI-predicted winner and feed results back to improve future predictions."],
    url: "https://phrasee.co",
  },

  // Data Analysis
  {
    name: "Julius AI",
    domain: "julius.ai",
    icon: "📊",
    pricing: "Freemium",
    category: "Data Analysis",
    shortDescription: "Chat with your data, upload spreadsheets and get instant analysis.",
    fullDescription: "Julius AI is a conversational data analysis tool, upload any CSV, Excel, or database and ask questions in plain English. Julius writes and runs the analysis code automatically, generating charts and explaining insights.",
    bestFor: ["Data exploration and analysis", "CSV and spreadsheet analysis", "Automated chart generation", "Non-technical data users"],
    steps: ["Go to julius.ai and upload your CSV or Excel file.", "Ask your question in plain English, 'Show monthly revenue trends.'", "Julius generates and runs the code, displays charts, and explains the findings."],
    url: "https://julius.ai",
  },
  {
    name: "Akkio",
    domain: "akkio.com",
    icon: "🔢",
    pricing: "Freemium",
    category: "Data Analysis",
    shortDescription: "No-code AI analytics for predictions and dashboards.",
    fullDescription: "Akkio is a no-code AI analytics platform for building predictive models from spreadsheet data. Point it at your dataset, tell it what to predict, and it trains and deploys a model in minutes, no data science expertise needed.",
    bestFor: ["Predictive analytics without coding", "Lead scoring models", "Churn prediction", "Sales forecasting"],
    steps: ["Create a free account at akkio.com and upload your dataset.", "Select your target column and click Train Model.", "Review accuracy metrics and deploy the model for live predictions."],
    url: "https://akkio.com",
  },
  {
    name: "Tableau AI",
    domain: "tableau.com",
    icon: "📉",
    pricing: "Paid",
    category: "Data Analysis",
    shortDescription: "AI-powered business intelligence and visualization.",
    fullDescription: "Tableau is the enterprise standard for business intelligence, now with Tableau AI (Einstein Copilot) for natural language queries, automated insight generation, and predictive analytics, turning complex data into interactive dashboards.",
    bestFor: ["Enterprise business intelligence", "Interactive dashboard creation", "Natural language data queries", "Executive reporting"],
    steps: ["Set up Tableau at tableau.com and connect your data sources.", "Use Ask Data to query your data in plain English.", "Build interactive dashboards and share with stakeholders."],
    url: "https://tableau.com",
  },
  {
    name: "Obviously AI",
    domain: "obviously.ai",
    icon: "💡",
    pricing: "Freemium",
    category: "Data Analysis",
    shortDescription: "No-code AI predictions from any dataset.",
    fullDescription: "Obviously AI enables non-technical users to build predictive AI models from any dataset in minutes. Upload a spreadsheet, choose what you want to predict, and get a deployed model with plain-English explanations of the key factors.",
    bestFor: ["Business predictions without coding", "Customer behavior modeling", "Inventory and demand forecasting", "Marketing attribution"],
    steps: ["Go to obviously.ai and upload your dataset.", "Select the column you want to predict.", "Click Train and review the accuracy, then deploy via API or integration."],
    url: "https://obviously.ai",
  },
  {
    name: "MonkeyLearn",
    domain: "monkeylearn.com",
    icon: "🐒",
    pricing: "Freemium",
    category: "Data Analysis",
    shortDescription: "AI text analysis and classification.",
    fullDescription: "MonkeyLearn is a no-code AI text analysis platform for classifying, tagging, and extracting data from text at scale, perfect for sentiment analysis, support ticket classification, and survey response analysis.",
    bestFor: ["Sentiment analysis at scale", "Support ticket classification", "Survey response analysis", "Text data extraction"],
    steps: ["Sign up at monkeylearn.com and choose a pre-built model or create your own.", "Upload your text data or connect via API.", "Run analysis and visualize results in the built-in dashboard."],
    url: "https://monkeylearn.com",
  },

  // Presentations
  {
    name: "Gamma",
    domain: "gamma.app",
    icon: "🖥️",
    pricing: "Freemium",
    category: "Presentations",
    shortDescription: "AI presentation builder that generates beautiful decks instantly.",
    fullDescription: "Gamma creates stunning presentations, documents, and web pages from a text prompt in under a minute. Unlike traditional slide software, Gamma's format is flexible and responsive, and its AI can redesign entire decks with one click.",
    bestFor: ["Business presentations", "Pitch decks", "Quick visual reports", "Replacing traditional PowerPoint"],
    steps: ["Go to gamma.app and sign in for free.", "Paste your outline or type a topic and let Gamma generate the deck.", "Edit any slide with the AI-assisted editor inline."],
    url: "https://gamma.app",
  },
  {
    name: "Beautiful.ai",
    domain: "beautiful.ai",
    icon: "✨",
    pricing: "Freemium",
    category: "Presentations",
    shortDescription: "Smart slide designer that auto-formats as you type.",
    fullDescription: "Beautiful.ai's Smart Slides automatically adjust layouts, resize elements, and maintain visual consistency as you add content, eliminating the tedious manual formatting that slows down traditional slide creation.",
    bestFor: ["Corporate and team presentations", "Polished professional slides", "Consistent slide formatting", "Executive reports"],
    steps: ["Sign up at beautiful.ai and choose a template.", "Add your content, Smart Slides adjust layouts automatically.", "Share a link or export as PDF or PPTX."],
    url: "https://beautiful.ai",
  },
  {
    name: "Tome",
    domain: "tome.app",
    icon: "📖",
    pricing: "Freemium",
    category: "Presentations",
    shortDescription: "AI storytelling format blending slides with narrative text.",
    fullDescription: "Tome is an AI-native format that blends slides with narrative text and live data embeds. Its AI generates entire presentations from a prompt, and it supports live Figma, Loom, and data embeds that update automatically.",
    bestFor: ["Investor decks and narrative reports", "Interactive presentations", "Live data-embedded slides", "Storytelling-driven content"],
    steps: ["Visit tome.app and click Generate to create from a prompt.", "Describe your story and audience, Tome structures it for you.", "Add live embeds like Figma, Loom, or charts, and share a link."],
    url: "https://tome.app",
  },
  {
    name: "SlidesAI",
    domain: "slidesai.io",
    icon: "📑",
    pricing: "Freemium",
    category: "Presentations",
    shortDescription: "AI that creates presentations from text.",
    fullDescription: "SlidesAI is a Google Slides add-on that generates complete presentations directly in Google Slides from any text, blog posts, meeting notes, outlines. It creates slides with appropriate layouts and visuals automatically.",
    bestFor: ["Google Slides integration", "Converting text to slides", "Quick presentation creation", "Google Workspace users"],
    steps: ["Install SlidesAI from the Google Workspace Marketplace.", "Open a Google Slides presentation and go to Extensions > SlidesAI.", "Paste your text and click Generate, slides are created instantly."],
    url: "https://slidesai.io",
  },
  {
    name: "Decktopus",
    domain: "decktopus.com",
    icon: "🎴",
    pricing: "Freemium",
    category: "Presentations",
    shortDescription: "AI presentation builder with smart design.",
    fullDescription: "Decktopus is an AI presentation builder that creates fully designed slide decks from a topic and audience description. It includes smart layouts, stock imagery, icon libraries, and AI-generated talking points for each slide.",
    bestFor: ["Fast professional presentations", "Smart design automation", "Presenter notes generation", "Beginner presenters"],
    steps: ["Go to decktopus.com and describe your presentation topic and audience.", "AI generates a complete deck with layouts, images, and talking points.", "Customize colors, fonts, and content, then present directly or export."],
    url: "https://decktopus.com",
  },
  {
    name: "MagicSlides",
    domain: "magicslides.app",
    icon: "🪄",
    pricing: "Freemium",
    category: "Presentations",
    shortDescription: "Create Google Slides with AI instantly.",
    fullDescription: "MagicSlides is a Google Slides add-on that generates complete slide decks from a topic in seconds. Enter a title, choose a number of slides, and AI creates a fully formatted presentation with relevant content.",
    bestFor: ["Instant Google Slides creation", "Quick topic presentations", "Google Workspace integration", "Students and educators"],
    steps: ["Install MagicSlides from the Google Workspace Marketplace.", "Go to Extensions > MagicSlides and enter your topic.", "Choose the number of slides and click Generate, done in seconds."],
    url: "https://magicslides.app",
  },

  // Customer Support
  {
    name: "Intercom AI",
    domain: "intercom.com",
    icon: "💬",
    pricing: "Paid",
    category: "Customer Support",
    shortDescription: "AI support agent trained on your docs, resolves queries 24/7.",
    fullDescription: "Fin by Intercom is an AI support agent that resolves 50%+ of customer queries automatically by learning from your help center documentation. It handles complex multi-turn conversations and seamlessly escalates to human agents.",
    bestFor: ["Automated customer support", "Help center Q&A", "Ticket deflection", "24/7 support coverage"],
    steps: ["Set up Intercom at intercom.com and connect your help center.", "Enable Fin in Inbox settings, it auto-responds to conversations.", "Review resolutions in the dashboard and add missing answers."],
    url: "https://intercom.com/fin",
  },
  {
    name: "Tidio",
    domain: "tidio.com",
    icon: "🤝",
    pricing: "Freemium",
    category: "Customer Support",
    shortDescription: "AI chatbot for e-commerce that qualifies leads and supports customers.",
    fullDescription: "Tidio is an AI-powered chat platform for e-commerce with Lyro AI, a conversational bot that handles customer queries, tracks orders, processes refunds, and qualifies leads, all without human intervention.",
    bestFor: ["E-commerce customer support", "Lead qualification", "Order tracking automation", "Small business live chat"],
    steps: ["Install Tidio at tidio.com by pasting a snippet on your site.", "Enable Lyro AI and connect your FAQ, it learns common questions automatically.", "Set escalation rules so complex queries route to live agents."],
    url: "https://tidio.com",
  },
  {
    name: "Drift",
    domain: "drift.com",
    icon: "💼",
    pricing: "Freemium",
    category: "Customer Support",
    shortDescription: "AI chatbot that qualifies leads and books meetings automatically.",
    fullDescription: "Drift is a conversational marketing platform with AI chatbots that qualify inbound leads, answer product questions, and book sales meetings automatically, turning website visitors into pipeline.",
    bestFor: ["B2B lead qualification", "Automated meeting booking", "Sales pipeline generation", "Conversational marketing"],
    steps: ["Set up Drift at drift.com and install the website widget.", "Configure your chatbot playbooks to qualify leads automatically.", "Connect your calendar so Drift books meetings directly."],
    url: "https://drift.com",
  },
  {
    name: "Zendesk AI",
    domain: "zendesk.com",
    icon: "🎫",
    pricing: "Paid",
    category: "Customer Support",
    shortDescription: "AI-powered customer support with smart ticket routing.",
    fullDescription: "Zendesk AI enhances the leading customer support platform with intelligent ticket triage, smart auto-responses, sentiment analysis, agent assist suggestions, and predictive customer satisfaction scoring.",
    bestFor: ["Enterprise customer support", "Smart ticket routing", "Agent productivity", "Support analytics"],
    steps: ["Set up Zendesk at zendesk.com and import your help content.", "Enable AI triage to automatically categorize and route incoming tickets.", "Use Agent Assist to get AI-suggested replies that agents can send with one click."],
    url: "https://zendesk.com",
  },
  {
    name: "Freshdesk AI",
    domain: "freshdesk.com",
    icon: "🌿",
    pricing: "Freemium",
    category: "Customer Support",
    shortDescription: "AI customer support with smart routing.",
    fullDescription: "Freshdesk AI uses Freddy AI to power intelligent ticket routing, auto-resolution of common queries, agent assistance, and predictive analytics, making it a cost-effective Zendesk alternative with a generous free tier.",
    bestFor: ["SMB customer support", "Automated ticket resolution", "Agent assist features", "Free-tier customer service"],
    steps: ["Sign up at freshdesk.com, free for up to 10 agents.", "Enable Freddy AI in settings to activate smart routing and auto-responses.", "Review the AI's suggestions in the dashboard and approve or train it further."],
    url: "https://freshdesk.com",
  },
  {
    name: "Forethought",
    domain: "forethought.ai",
    icon: "🧠",
    pricing: "Paid",
    category: "Customer Support",
    shortDescription: "AI that resolves support tickets automatically.",
    fullDescription: "Forethought is an AI platform for customer support automation that triages, routes, and resolves support tickets automatically. Its Solve product deflects tickets before they reach agents; Triage routes complex ones intelligently.",
    bestFor: ["High-volume ticket deflection", "Support automation", "Agent workflow optimization", "Enterprise support teams"],
    steps: ["Contact Forethought at forethought.ai to start a trial.", "Connect your existing support platform (Zendesk, Salesforce, etc.).", "Deploy Solve for deflection and Triage for intelligent routing."],
    url: "https://forethought.ai",
  },
  {
    name: "Ada",
    domain: "ada.cx",
    icon: "🤖",
    pricing: "Paid",
    category: "Customer Support",
    shortDescription: "AI customer service automation platform.",
    fullDescription: "Ada is an AI customer service automation platform that handles millions of customer interactions across chat, email, and voice. It integrates with your existing systems to resolve queries end-to-end without human intervention.",
    bestFor: ["Enterprise-scale automation", "Omnichannel support", "Self-service customer resolution", "Reducing support costs"],
    steps: ["Contact Ada at ada.cx to begin onboarding.", "Connect Ada to your knowledge base, CRM, and support systems.", "Configure automation flows and go live across all support channels."],
    url: "https://ada.cx",
  },

  // HR & Recruiting
  {
    name: "Workday AI",
    domain: "workday.com",
    icon: "👔",
    pricing: "Paid",
    category: "HR & Recruiting",
    shortDescription: "AI-powered HR and workforce management.",
    fullDescription: "Workday AI embeds machine learning throughout its HR platform, skills inference, succession planning, attrition prediction, pay equity analysis, and intelligent talent recommendations, helping large enterprises make data-driven people decisions.",
    bestFor: ["Enterprise HR management", "Workforce planning", "Skills and succession planning", "Pay equity analysis"],
    steps: ["Contact Workday at workday.com to arrange an enterprise demo.", "Work with implementation partners to connect your HR data.", "Use AI-powered dashboards for skills gaps, attrition risk, and planning."],
    url: "https://workday.com",
  },
  {
    name: "HireVue",
    domain: "hirevue.com",
    icon: "🎥",
    pricing: "Paid",
    category: "HR & Recruiting",
    shortDescription: "AI video interviewing and assessment platform.",
    fullDescription: "HireVue is an AI video interviewing platform that lets candidates record interviews on their schedule. Its AI analyzes responses for job-relevant competencies, reducing screening time by up to 90% and improving quality of hire.",
    bestFor: ["High-volume candidate screening", "Structured video interviews", "Competency-based assessment", "Reducing time-to-hire"],
    steps: ["Contact HireVue at hirevue.com to set up your account.", "Build structured interview guides with AI-suggested competency questions.", "Send video interview invitations, candidates complete on their schedule."],
    url: "https://hirevue.com",
  },
  {
    name: "Paradox",
    domain: "paradox.ai",
    icon: "🤖",
    pricing: "Paid",
    category: "HR & Recruiting",
    shortDescription: "AI recruiting assistant named Olivia.",
    fullDescription: "Paradox's AI assistant Olivia automates high-volume recruiting tasks, screening candidates via conversational chat, scheduling interviews, sending reminders, and onboarding new hires, all through a natural language interface on any messaging platform.",
    bestFor: ["High-volume recruiting automation", "Candidate screening at scale", "Interview scheduling automation", "Retail and hospitality hiring"],
    steps: ["Contact Paradox at paradox.ai to configure Olivia for your hiring process.", "Define screening questions and scheduling rules.", "Candidates interact with Olivia via SMS, WhatsApp, or your career site."],
    url: "https://paradox.ai",
  },
  {
    name: "Fetcher",
    domain: "fetcher.ai",
    icon: "🎣",
    pricing: "Paid",
    category: "HR & Recruiting",
    shortDescription: "AI talent sourcing and outreach automation.",
    fullDescription: "Fetcher automates talent sourcing by using AI to find and engage qualified candidates at scale. It sends personalized outreach sequences, tracks engagement, and surfaces warm candidates to your recruiters.",
    bestFor: ["Passive candidate sourcing", "Automated outreach sequences", "Diversity hiring goals", "Reducing recruiter workload"],
    steps: ["Sign up at fetcher.ai and define your ideal candidate profile.", "AI sources and ranks candidates from LinkedIn and other networks.", "Automated personalized outreach is sent, track opens and replies in the dashboard."],
    url: "https://fetcher.ai",
  },

  // Finance
  {
    name: "Zest AI",
    domain: "zest.ai",
    icon: "💳",
    pricing: "Paid",
    category: "Finance",
    shortDescription: "AI credit underwriting platform.",
    fullDescription: "Zest AI is an AI-powered credit underwriting platform that helps lenders approve more good loans and fewer bad ones. Its machine learning models analyze thousands of variables to score creditworthiness more accurately than traditional FICO-based approaches.",
    bestFor: ["Credit risk modeling", "Loan origination optimization", "Fair lending compliance", "Alternative credit scoring"],
    steps: ["Contact Zest AI at zest.ai to arrange a demo.", "Connect your loan data for model training.", "Deploy the AI model alongside your existing underwriting workflow."],
    url: "https://zest.ai",
  },
  {
    name: "Domo",
    domain: "domo.com",
    icon: "📊",
    pricing: "Paid",
    category: "Finance",
    shortDescription: "AI business intelligence platform.",
    fullDescription: "Domo is a cloud-based business intelligence platform with AI-powered data visualization, natural language queries, and predictive analytics. It connects to 1,000+ data sources and delivers real-time dashboards for finance, operations, and sales.",
    bestFor: ["Real-time business dashboards", "CFO and finance reporting", "Multi-source data integration", "Executive decision-making"],
    steps: ["Contact Domo at domo.com to set up your account.", "Connect your data sources, ERP, CRM, spreadsheets, databases.", "Build dashboards and use AI-powered Ask Data to query in plain English."],
    url: "https://domo.com",
  },
  {
    name: "Vic.ai",
    domain: "vic.ai",
    icon: "🧾",
    pricing: "Paid",
    category: "Finance",
    shortDescription: "AI accounts payable automation.",
    fullDescription: "Vic.ai is an AI-powered accounts payable automation platform that extracts invoice data, codes GL accounts, routes for approval, and processes payments automatically, eliminating manual AP work and reducing processing costs.",
    bestFor: ["Invoice processing automation", "GL coding automation", "AP workflow management", "Finance team efficiency"],
    steps: ["Contact Vic.ai at vic.ai to start the onboarding process.", "Connect your ERP (SAP, Oracle, NetSuite, etc.).", "Feed invoices to Vic.ai, it extracts, codes, and routes them automatically."],
    url: "https://vic.ai",
  },
];

function slugify(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

const PRICING_STYLES: Record<string, { badge: string; label: string }> = {
  Free: { badge: "bg-[#E7F3FF] text-[#1877F2]", label: "FREE" },
  Freemium: { badge: "bg-[#E7F3FF] text-[#1877F2]", label: "FREEMIUM" },
  Paid: { badge: "bg-[#fff0f3] text-[#e41e3f]", label: "PAID" },
};

export default function ToolPage() {
  const params = useParams();
  const router = useRouter();
  const slug = typeof params.slug === "string" ? params.slug : "";

  const tool = TOOLS_DATA.find((t) => slugify(t.name) === slug);

  // Fallback: look up basic info from the shared tools list
  const basicTool = !tool ? TOOLS.find((t) => libSlugify(t.name) === slug) : null;

  if (!tool && basicTool) {
    return (
      <div className="min-h-screen bg-white">
        <div className="px-6 pt-6 pb-2 max-w-3xl mx-auto">
          <button onClick={() => router.push("/")} className="text-sm text-[#1877F2] hover:underline">
            ← Back to all tools
          </button>
        </div>
        <div className="max-w-3xl mx-auto px-6 py-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-[#f7f8fa] border border-[#e4e6ea] flex items-center justify-center text-3xl flex-shrink-0">
              <img
                src={`https://www.google.com/s2/favicons?domain=${basicTool.domain}&sz=64`}
                alt={basicTool.name}
                className="w-8 h-8 object-contain"
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#1c1e21]">{basicTool.name}</h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs px-2 py-0.5 rounded-full bg-[#f0f2f5] text-[#65676b] font-medium">{basicTool.category}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${basicTool.pricing === "Paid" ? "bg-[#fff0f3] text-[#e41e3f]" : "bg-[#E7F3FF] text-[#1877F2]"}`}>{basicTool.pricing}</span>
              </div>
            </div>
          </div>
          <p className="text-[#444] text-base leading-relaxed mb-8">{basicTool.description}</p>
          <a
            href={getToolUrl(basicTool.name, basicTool.url)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-[#1877F2] hover:bg-[#166FE5] text-white text-sm font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            Visit {basicTool.name}
          </a>
        </div>
      </div>
    );
  }

  if (!tool) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4 px-6">
        <h1 className="text-2xl font-semibold text-[#1c1e21]">Tool not found</h1>
        <Link href="/" className="text-[#1877F2] text-sm hover:underline">
          ← Back to all tools
        </Link>
      </div>
    );
  }

  const similar = TOOLS_DATA.filter(
    (t) => t.category === tool.category && t.name !== tool.name
  ).slice(0, 3);

  const pricing = PRICING_STYLES[tool.pricing];

  return (
    <div className="min-h-screen bg-white">
      {/* Top nav */}
      <div className="px-6 pt-6 pb-2 max-w-3xl mx-auto">
        <button
          onClick={() => router.push("/")}
          className="text-sm text-[#1877F2] hover:underline"
        >
          ← All Tools
        </button>
      </div>

      {/* Hero section */}
      <div className="px-6 pt-6 pb-10 max-w-3xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-[#f7f8fa] border border-[#e4e6ea] flex items-center justify-center overflow-hidden flex-shrink-0">
            <img
              src={`https://www.google.com/s2/favicons?domain=${tool.domain}&sz=64`}
              alt={tool.name}
              width={48}
              height={48}
              className="rounded-lg object-contain"
              onError={(e) => {
                const el = e.currentTarget;
                el.style.display = "none";
                if (el.nextElementSibling) (el.nextElementSibling as HTMLElement).style.display = "flex";
              }}
            />
            <span className="text-3xl hidden items-center justify-center w-full h-full">{tool.icon}</span>
          </div>
          <div>
            <h1
              className="text-[32px] font-semibold text-[#1877F2] leading-tight"
              style={{ fontFamily: "var(--font-playfair), serif", fontStyle: "italic" }}
            >
              {tool.name}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${pricing.badge}`}>
                {pricing.label}
              </span>
              <span className="text-[11px] text-[#65676b] bg-[#f7f8fa] border border-[#e4e6ea] px-2.5 py-0.5 rounded-full">
                {tool.category}
              </span>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-base text-[#1c1e21] leading-relaxed mb-8">
          {tool.fullDescription}
        </p>

        {/* Best for */}
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-[#1c1e21] uppercase tracking-wider mb-3">
            Best for
          </h2>
          <ul className="flex flex-col gap-2">
            {tool.bestFor.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-[#65676b]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1877F2] mt-2 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* How to get started */}
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-[#1c1e21] uppercase tracking-wider mb-3">
            How to get started
          </h2>
          <ol className="flex flex-col gap-3">
            {tool.steps.map((step, i) => (
              <li key={i} className="flex gap-3 items-start">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#E7F3FF] text-[#1877F2] text-xs font-bold flex items-center justify-center mt-0.5">
                  {i + 1}
                </span>
                <p className="text-sm text-[#65676b] leading-relaxed">{step}</p>
              </li>
            ))}
          </ol>
        </div>

        {/* CTA */}
        <a
          href={getToolUrl(tool.name, tool.url)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-[#1877F2] hover:bg-[#166FE5] text-white text-sm font-semibold px-8 py-3.5 rounded-xl transition-colors"
        >
          Visit {tool.name}
        </a>
      </div>

      {/* Similar tools */}
      {similar.length > 0 && (
        <div className="bg-[#f7f8fa] border-t border-[#e4e6ea] px-6 py-10">
          <div className="max-w-3xl mx-auto">
            <h2
              className="text-lg font-semibold text-[#1c1e21] mb-5"
              style={{ fontFamily: "var(--font-playfair), serif", fontStyle: "italic" }}
            >
              Similar tools
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {similar.map((t) => (
                <button
                  key={t.name}
                  onClick={() => router.push(`/tools/${slugify(t.name)}`)}
                  className="tool-card text-left bg-white border border-[#e4e6ea] rounded-xl p-4 flex flex-col gap-3 overflow-hidden"
                >
                  <div className="w-9 h-9 rounded-lg bg-[#f7f8fa] border border-[#e4e6ea] flex items-center justify-center overflow-hidden">
                    <img
                      src={`https://www.google.com/s2/favicons?domain=${t.domain}&sz=64`}
                      alt={t.name}
                      width={24}
                      height={24}
                      className="rounded object-contain"
                      onError={(e) => {
                        const el = e.currentTarget;
                        el.style.display = "none";
                        if (el.nextElementSibling) (el.nextElementSibling as HTMLElement).style.display = "flex";
                      }}
                    />
                    <span className="text-lg hidden items-center justify-center w-full h-full">{t.icon}</span>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-[#1c1e21] group-hover:text-[#1877F2]">
                      {t.name}
                    </h3>
                    <p className="text-xs text-[#65676b] mt-1 leading-relaxed line-clamp-2">
                      {t.shortDescription}
                    </p>
                  </div>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full self-start ${PRICING_STYLES[t.pricing].badge}`}>
                    {t.pricing.toUpperCase()}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
