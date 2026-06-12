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
    url: "https://chatgpt.com",
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
    url: "https://stability.ai/stable-image",
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
    url: "https://cursor.com",
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
    url: "https://aws.amazon.com/q/developer/",
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
    url: "https://www.jacquard.com",
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
    url: "https://www.salesloft.com/platform/drift/",
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

  // Writing — additional
  {
    name: "Rytr",
    domain: "rytr.me",
    icon: "✍️",
    pricing: "Freemium",
    category: "Writing",
    shortDescription: "Affordable AI writing assistant for blogs, emails, and social content.",
    fullDescription: "Rytr is a budget-friendly AI writing assistant with 40+ use cases and 20+ tones of voice. It generates blog sections, email copy, product descriptions, and social captions in seconds, with a generous free tier that makes it accessible to solo creators.",
    bestFor: ["Budget-conscious content creators", "Blog intros and outlines", "Email copy and subject lines", "Social media captions"],
    steps: ["Sign up for free at rytr.me.", "Choose a use case (Blog Section, Email, Product Description, etc.) and set your tone.", "Enter a brief and click Ryte for me — edit and expand the output as needed."],
    url: "https://rytr.me",
  },
  {
    name: "Hypotenuse AI",
    domain: "hypotenuse.ai",
    icon: "🛒",
    pricing: "Freemium",
    category: "Writing",
    shortDescription: "AI content writer built for e-commerce product descriptions at scale.",
    fullDescription: "Hypotenuse AI specialises in bulk e-commerce content — generate hundreds of unique, SEO-optimised product descriptions from a spreadsheet in minutes. It also writes blog posts, ad copy, and social content with brand voice controls.",
    bestFor: ["Bulk product description generation", "E-commerce SEO content", "Brand-consistent copywriting", "Catalog content at scale"],
    steps: ["Sign up at hypotenuse.ai and set your brand voice.", "Upload a CSV of product names and attributes.", "Generate descriptions in bulk and export back to your platform."],
    url: "https://hypotenuse.ai",
  },
  {
    name: "Longshot AI",
    domain: "longshot.ai",
    icon: "📰",
    pricing: "Freemium",
    category: "Writing",
    shortDescription: "AI writer that creates factually grounded long-form content.",
    fullDescription: "Longshot AI differentiates itself by grounding content in real-time web research, reducing hallucinations in long-form blog posts and articles. It includes a fact-checking layer that cites sources, making it suited for authoritative SEO content.",
    bestFor: ["Factually accurate blog posts", "Research-backed articles", "SEO long-form content", "Reducing AI hallucinations"],
    steps: ["Create an account at longshot.ai.", "Enter your topic and let FactGPT pull in real-time research sources.", "Generate the full article and verify citations before publishing."],
    url: "https://longshot.ai",
  },
  {
    name: "Ink Editor",
    domain: "inkforall.com",
    icon: "🖋️",
    pricing: "Freemium",
    category: "Writing",
    shortDescription: "SEO-optimised AI writing assistant with real-time content scoring.",
    fullDescription: "INK Editor combines AI writing with an SEO co-pilot that scores your content in real time against top-ranking pages. It suggests keyword usage, structure improvements, and readability fixes as you write, helping you rank without switching tools.",
    bestFor: ["SEO content writing", "Real-time keyword optimisation", "Blog posts and landing pages", "Content scoring and improvement"],
    steps: ["Download the INK desktop app or use the web editor at inkforall.com.", "Enter your target keyword and start writing.", "Follow the SEO score panel to hit the recommended keyword and structure targets."],
    url: "https://inkforall.com",
  },
  {
    name: "TextCortex",
    domain: "textcortex.com",
    icon: "🧠",
    pricing: "Freemium",
    category: "Writing",
    shortDescription: "AI writing assistant with a browser extension that works everywhere.",
    fullDescription: "TextCortex is an AI writing assistant with a browser extension that works across 4,000+ apps — Gmail, Notion, LinkedIn, and more. Its Zeno AI persona can be trained on your own documents to match your exact writing style.",
    bestFor: ["Writing anywhere in the browser", "Brand voice personalisation", "Email and document drafting", "Multi-platform content creation"],
    steps: ["Install the TextCortex extension from textcortex.com.", "Highlight any text and press the shortcut to rewrite, expand, or translate.", "Train your custom persona by uploading your own writing samples."],
    url: "https://textcortex.com",
  },
  {
    name: "ProWritingAid",
    domain: "prowritingaid.com",
    icon: "📋",
    pricing: "Freemium",
    category: "Writing",
    shortDescription: "In-depth grammar, style, and readability checker for authors and professionals.",
    fullDescription: "ProWritingAid goes deeper than Grammarly with 25+ detailed writing reports covering style, pacing, dialogue, overused words, clichés, and sentence length variation. It integrates with Word, Google Docs, Scrivener, and Chrome.",
    bestFor: ["Authors and novelists", "Academic writing", "Deep style analysis", "Scrivener and Word integration"],
    steps: ["Install the ProWritingAid app or browser extension at prowritingaid.com.", "Paste your document or write directly in the editor.", "Run the Summary Report for an overview, then explore individual reports for specific issues."],
    url: "https://prowritingaid.com",
  },
  {
    name: "Pi AI",
    domain: "pi.ai",
    icon: "🥧",
    pricing: "Free",
    category: "Writing",
    shortDescription: "Personal AI companion focused on thoughtful conversation and emotional support.",
    fullDescription: "Pi by Inflection AI is designed for personal, empathetic conversation rather than task completion. It remembers context across long conversations, asks follow-up questions, and is particularly effective for brainstorming, journalling, and thinking through complex decisions.",
    bestFor: ["Thoughtful brainstorming conversations", "Journalling and self-reflection", "Emotional support and coaching", "Exploring ideas without judgment"],
    steps: ["Visit pi.ai and start chatting — no account required to begin.", "Talk naturally, Pi will ask questions and remember what you share.", "Use voice mode for a more personal, conversational experience."],
    url: "https://pi.ai",
  },
  {
    name: "Meta AI",
    domain: "meta.ai",
    icon: "🔵",
    pricing: "Free",
    category: "Writing",
    shortDescription: "Meta's free AI assistant built into WhatsApp, Instagram, and Facebook.",
    fullDescription: "Meta AI is a free AI assistant powered by Llama, available directly inside WhatsApp, Instagram, Facebook, and Messenger. It can answer questions, generate images, help draft messages, and assist with research — all within apps you already use daily.",
    bestFor: ["Quick answers inside social apps", "WhatsApp and Messenger assistance", "Free AI image generation", "Casual research and writing help"],
    steps: ["Open WhatsApp, Instagram, or Facebook and tap the Meta AI icon.", "Type your question or request in the chat interface.", "For image generation, type 'imagine' followed by your description."],
    url: "https://meta.ai",
  },

  // Images — additional
  {
    name: "Flux",
    domain: "blackforestlabs.ai",
    icon: "🌊",
    pricing: "Free",
    category: "Images",
    shortDescription: "State-of-the-art open-source image generation model by Black Forest Labs.",
    fullDescription: "Flux by Black Forest Labs is one of the most capable open-source image generation models available. It produces photorealistic and artistic images with exceptional prompt adherence, and is available free via Replicate, fal.ai, and various web UIs.",
    bestFor: ["Photorealistic image generation", "High prompt-adherence results", "Open-source flexibility", "API integration for developers"],
    steps: ["Try Flux free at fal.ai or replicate.com — no account needed for basic use.", "Write a detailed prompt describing your image, including style, lighting, and composition.", "Iterate by refining your prompt — Flux follows instructions very accurately."],
    url: "https://blackforestlabs.ai",
  },
  {
    name: "Imagen 3",
    domain: "deepmind.google",
    icon: "🖼️",
    pricing: "Freemium",
    category: "Images",
    shortDescription: "Google's highest-quality text-to-image model.",
    fullDescription: "Imagen 3 is Google DeepMind's flagship image generation model, producing photorealistic images with excellent detail, accurate text rendering, and strong prompt following. It is available through Google's ImageFX tool and the Gemini API.",
    bestFor: ["Photorealistic image generation", "Accurate text in images", "Google ecosystem integration", "API use via Vertex AI"],
    steps: ["Access Imagen 3 free at labs.google/fx/tools/image-fx.", "Type a detailed text description of the image you want.", "Browse and download generated images, or iterate with new prompts."],
    url: "https://deepmind.google/technologies/imagen-3",
  },
  {
    name: "NightCafe",
    domain: "nightcafe.studio",
    icon: "🌙",
    pricing: "Freemium",
    category: "Images",
    shortDescription: "AI art generator with multiple style algorithms and a creative community.",
    fullDescription: "NightCafe Studio offers multiple AI art algorithms including Stable Diffusion, DALL-E, and its own models. It has a social community where creators share work and compete in daily challenges, making it one of the most active AI art communities online.",
    bestFor: ["Experimenting with multiple AI models", "AI art community and sharing", "Daily creative challenges", "Beginner-friendly image generation"],
    steps: ["Create a free account at nightcafe.studio.", "Choose an algorithm (Stable Diffusion is recommended for beginners) and enter your prompt.", "Share your creation to the community feed or save it to your collection."],
    url: "https://nightcafe.studio",
  },
  {
    name: "Artbreeder",
    domain: "artbreeder.com",
    icon: "🌿",
    pricing: "Freemium",
    category: "Images",
    shortDescription: "Blend and evolve AI-generated images collaboratively.",
    fullDescription: "Artbreeder uses generative models to let you blend, evolve, and remix images in ways that go beyond text prompting. Drag sliders to adjust age, hair, style, and mood on portraits, or blend two images together to create something entirely new.",
    bestFor: ["Portrait and character creation", "Image blending and remixing", "Creative exploration without prompts", "Fantasy and sci-fi character design"],
    steps: ["Sign up at artbreeder.com — free tier includes generous monthly credits.", "Choose a category (Portraits, Landscapes, etc.) and start with an existing image.", "Use the gene sliders or blend with another image to evolve the result."],
    url: "https://artbreeder.com",
  },

  // Coding — additional
  {
    name: "Windsurf",
    domain: "codeium.com",
    icon: "🏄",
    pricing: "Freemium",
    category: "Coding",
    shortDescription: "AI-first code editor with deep codebase understanding.",
    fullDescription: "Windsurf by Codeium is an AI-native code editor that combines the familiarity of VS Code with powerful agentic AI that can understand and edit across your entire codebase. Its Cascade feature can plan and execute multi-file changes autonomously.",
    bestFor: ["Full codebase AI editing", "Multi-file refactoring", "AI that understands project context", "Cursor alternative"],
    steps: ["Download Windsurf from codeium.com/windsurf.", "Open your project — Windsurf indexes the codebase automatically.", "Use Cascade to describe a change; it plans and implements across multiple files."],
    url: "https://codeium.com/windsurf",
  },
  {
    name: "Bolt.new",
    domain: "bolt.new",
    icon: "⚡",
    pricing: "Freemium",
    category: "Coding",
    shortDescription: "Build full-stack web apps from a single prompt in the browser.",
    fullDescription: "Bolt.new by StackBlitz lets you generate, run, edit, and deploy full-stack web applications entirely in the browser — no local setup required. Describe the app you want and Bolt scaffolds the code, installs dependencies, and runs it live.",
    bestFor: ["Full-stack app prototyping", "No-setup browser development", "Rapid MVP creation", "Non-developers building web apps"],
    steps: ["Go to bolt.new — no account needed to start.", "Describe the app you want to build in plain English.", "Bolt generates and runs the code live; iterate by chatting with it."],
    url: "https://bolt.new",
  },
  {
    name: "V0 by Vercel",
    domain: "v0.dev",
    icon: "🎨",
    pricing: "Freemium",
    category: "Coding",
    shortDescription: "Generate React UI components from text descriptions.",
    fullDescription: "V0 by Vercel generates React and Tailwind CSS UI components from plain-text descriptions. Describe a component — a dashboard, a login form, a pricing table — and V0 outputs production-ready code that you can copy directly into your Next.js project.",
    bestFor: ["React UI component generation", "Tailwind CSS layouts", "Next.js project scaffolding", "Frontend prototyping"],
    steps: ["Visit v0.dev and describe the UI component you need.", "V0 generates multiple variants — pick the one closest to your vision.", "Copy the code into your project or click 'Open in StackBlitz' to edit live."],
    url: "https://v0.dev",
  },
  {
    name: "Devin",
    domain: "cognition.ai",
    icon: "🤖",
    pricing: "Paid",
    category: "Coding",
    shortDescription: "The world's first fully autonomous AI software engineer.",
    fullDescription: "Devin by Cognition is an autonomous AI software engineer that can plan and execute complex engineering tasks end-to-end — writing code, running tests, fixing bugs, and deploying services — using its own shell, browser, and code editor.",
    bestFor: ["End-to-end feature implementation", "Autonomous bug fixing", "Long-horizon engineering tasks", "Delegating repetitive dev work"],
    steps: ["Request access at cognition.ai and set up your workspace.", "Assign Devin a task in natural language — it plans its own approach.", "Monitor progress in the dashboard and review changes before merging."],
    url: "https://cognition.ai",
  },
  {
    name: "Aider",
    domain: "aider.chat",
    icon: "💻",
    pricing: "Free",
    category: "Coding",
    shortDescription: "Open-source AI pair programmer that edits code in your local terminal.",
    fullDescription: "Aider is an open-source command-line AI coding assistant that edits files in your local git repository. It supports all major LLMs (GPT-4, Claude, Gemini) and creates proper git commits for every change, making it a powerful tool for developers who prefer the terminal.",
    bestFor: ["Terminal-first developers", "Open-source AI coding", "Git-integrated AI edits", "Using your own API keys"],
    steps: ["Install with pip: pip install aider-chat.", "Run aider in your project directory with your preferred model.", "Describe changes in plain English — Aider edits files and commits automatically."],
    url: "https://aider.chat",
  },
  {
    name: "Continue",
    domain: "continue.dev",
    icon: "▶️",
    pricing: "Free",
    category: "Coding",
    shortDescription: "Open-source AI coding assistant for VS Code and JetBrains.",
    fullDescription: "Continue is a free, open-source AI coding assistant that adds a chat sidebar and inline autocomplete to VS Code and JetBrains. It supports any LLM including local models via Ollama, giving full control over which AI powers your coding experience.",
    bestFor: ["Open-source AI code assistant", "Local LLM integration", "VS Code and JetBrains users", "Privacy-first AI coding"],
    steps: ["Install Continue from the VS Code or JetBrains marketplace.", "Configure your preferred model (Ollama, OpenAI, Anthropic, etc.) in config.json.", "Open the chat sidebar to ask questions or select code and ask for edits."],
    url: "https://continue.dev",
  },
  {
    name: "Mistral AI",
    domain: "mistral.ai",
    icon: "🌬️",
    pricing: "Freemium",
    category: "Coding",
    shortDescription: "High-performance open-source AI models excellent at coding.",
    fullDescription: "Mistral AI produces some of the best open-source language models for coding — Mistral Large and Codestral are particularly strong at code generation, completion, and debugging. Access via Le Chat (their consumer interface) or the Mistral API.",
    bestFor: ["Fast, efficient code generation", "Open-weight model deployment", "API integration for developers", "European-hosted AI alternative"],
    steps: ["Try Le Chat free at chat.mistral.ai.", "For coding, select Mistral Large or Codestral models.", "For API access, sign up at console.mistral.ai and use the REST API or SDK."],
    url: "https://mistral.ai",
  },

  // Video — additional
  {
    name: "Sora",
    domain: "openai.com",
    icon: "🎬",
    pricing: "Paid",
    category: "Video",
    shortDescription: "OpenAI's text-to-video model that generates cinematic AI videos.",
    fullDescription: "Sora by OpenAI generates high-quality, up to 20-second video clips from text prompts or images. It understands physical motion, camera movement, and scene composition, making it one of the most capable text-to-video models available to consumers.",
    bestFor: ["Text-to-video generation", "Cinematic AI video clips", "Creative video storytelling", "Image-to-video animation"],
    steps: ["Access Sora at openai.com/sora — available to ChatGPT Plus and Pro subscribers.", "Write a detailed prompt including scene, motion, camera angle, and mood.", "Generate multiple variations and download your favourite clip."],
    url: "https://openai.com/sora",
  },
  {
    name: "Kling AI",
    domain: "klingai.com",
    icon: "🎥",
    pricing: "Freemium",
    category: "Video",
    shortDescription: "High-quality text-to-video and image-to-video AI from Kuaishou.",
    fullDescription: "Kling AI by Kuaishou generates up to 3-minute HD video clips from text or images. It produces smooth, realistic motion and supports advanced features like character consistency and camera control, positioning it as a strong Sora competitor.",
    bestFor: ["Realistic AI video generation", "Image-to-video animation", "Long AI video clips", "Realistic human motion"],
    steps: ["Create an account at klingai.com.", "Choose Text to Video or Image to Video and enter your prompt.", "Select duration and quality settings, then generate and download."],
    url: "https://klingai.com",
  },
  {
    name: "Opus Clip",
    domain: "opus.pro",
    icon: "✂️",
    pricing: "Freemium",
    category: "Video",
    shortDescription: "AI that turns long videos into viral short clips automatically.",
    fullDescription: "Opus Clip uses AI to identify the most engaging moments in long-form videos — podcasts, webinars, interviews — and automatically cuts, reframes for vertical, adds captions, and scores each clip for virality potential.",
    bestFor: ["Podcast and webinar clipping", "YouTube to TikTok/Reels conversion", "Automated caption generation", "Content repurposing at scale"],
    steps: ["Paste any YouTube or upload a video at opus.pro.", "AI automatically extracts the best clips with captions and virality scores.", "Download clips or schedule them to post across social platforms."],
    url: "https://opus.pro",
  },
  {
    name: "Pictory",
    domain: "pictory.ai",
    icon: "🎞️",
    pricing: "Paid",
    category: "Video",
    shortDescription: "Turn blog posts and scripts into branded videos automatically.",
    fullDescription: "Pictory converts long-form text — blog posts, scripts, or articles — into short, branded videos by matching content to stock footage, adding captions, and syncing a voiceover. Ideal for content marketers who want to repurpose written content into video.",
    bestFor: ["Blog-to-video conversion", "Branded marketing videos", "Auto-captioned social videos", "Content repurposing"],
    steps: ["Sign up at pictory.ai and paste your script or blog URL.", "AI matches scenes to stock video clips automatically.", "Edit captions, swap clips, add your logo and voice, then export."],
    url: "https://pictory.ai",
  },
  {
    name: "Pika",
    domain: "pika.art",
    icon: "⚡",
    pricing: "Freemium",
    category: "Video",
    shortDescription: "AI video generation and editing from text or images.",
    fullDescription: "Pika is an AI video tool that generates and edits video from text prompts, images, or existing footage. Its unique modify-region feature lets you change specific parts of a video while keeping the rest intact, and it excels at stylised, creative video content.",
    bestFor: ["Creative AI video generation", "Modifying specific video regions", "Image-to-video animation", "Stylised video content"],
    steps: ["Sign up at pika.art — free tier available.", "Choose text-to-video, image-to-video, or modify an existing clip.", "Enter your prompt and select style, aspect ratio, and motion intensity."],
    url: "https://pika.art",
  },
  {
    name: "Luma AI",
    domain: "lumalabs.ai",
    icon: "💫",
    pricing: "Freemium",
    category: "Video",
    shortDescription: "AI video generation with Dream Machine and 3D capture.",
    fullDescription: "Luma AI offers two flagship products: Dream Machine for text-to-video generation with fluid, cinematic motion, and Luma 3D for photorealistic 3D scene capture using just a phone. Dream Machine is available free with daily generation limits.",
    bestFor: ["Cinematic text-to-video generation", "3D scene capture", "Smooth, realistic video motion", "Creative short video content"],
    steps: ["Access Dream Machine free at lumalabs.ai/dream-machine.", "Write a cinematic prompt describing the scene and camera movement.", "Generate and download your clip — upgrade for longer clips and priority queue."],
    url: "https://lumalabs.ai",
  },

  // Music — additional
  {
    name: "AIVA",
    domain: "aiva.ai",
    icon: "🎼",
    pricing: "Freemium",
    category: "Music",
    shortDescription: "AI composer specialising in cinematic and orchestral music.",
    fullDescription: "AIVA is an AI music composition tool trained on classical and cinematic scores. It generates original orchestral, cinematic, and ambient tracks with full stems, making it ideal for game developers, filmmakers, and content creators needing custom background music.",
    bestFor: ["Cinematic and orchestral music", "Game and film soundtracks", "Royalty-free background music", "Music with downloadable stems"],
    steps: ["Sign up for free at aiva.ai.", "Choose a style preset (Cinematic, Ambient, Electronic, etc.) and set duration.", "Download the generated track — stems available on paid plans."],
    url: "https://aiva.ai",
  },
  {
    name: "Beatoven.ai",
    domain: "beatoven.ai",
    icon: "🥁",
    pricing: "Freemium",
    category: "Music",
    shortDescription: "AI music generator that creates mood-matched tracks for videos.",
    fullDescription: "Beatoven.ai generates unique, royalty-free background music tracks matched to a specific mood, genre, and duration. You can split a track into sections and assign different moods to each part — perfect for YouTube videos, podcasts, and ads.",
    bestFor: ["YouTube and podcast background music", "Mood-specific music generation", "Section-by-section mood control", "Royalty-free licensing"],
    steps: ["Create a free account at beatoven.ai.", "Set your track duration and choose a genre and mood.", "Optionally split the track into sections and assign different moods to each."],
    url: "https://beatoven.ai",
  },
  {
    name: "Musicfy",
    domain: "musicfy.lol",
    icon: "🎤",
    pricing: "Freemium",
    category: "Music",
    shortDescription: "AI voice cloning and song cover generation.",
    fullDescription: "Musicfy lets you create AI song covers using the voices of famous artists or your own cloned voice. Convert any song into a different AI voice in seconds — useful for music production, content creation, and vocal experimentation.",
    bestFor: ["AI song covers and remixes", "Voice cloning for music", "Vocal style transfer", "Music content creation"],
    steps: ["Go to musicfy.lol and sign in for free.", "Upload or paste the song you want to convert.", "Select an AI voice style and generate your cover."],
    url: "https://musicfy.lol",
  },
  {
    name: "Stable Audio",
    domain: "stability.ai",
    icon: "🔊",
    pricing: "Freemium",
    category: "Music",
    shortDescription: "Stability AI's text-to-audio model for music and sound effects.",
    fullDescription: "Stable Audio by Stability AI generates high-quality stereo music and sound effects from text prompts. It supports up to 3-minute track generation with precise control over genre, instruments, BPM, and mood, outputting full 44.1kHz stereo audio.",
    bestFor: ["High-quality music generation", "Sound effect creation", "Genre and instrument control", "Long-form audio generation"],
    steps: ["Sign up at stability.ai/stable-audio.", "Write a detailed prompt including genre, instruments, BPM, and mood.", "Generate and download — iterate by adjusting the prompt."],
    url: "https://stability.ai/stable-audio",
  },

  // Research — additional
  {
    name: "Grok",
    domain: "x.ai",
    icon: "🤖",
    pricing: "Freemium",
    category: "Research",
    shortDescription: "xAI's AI assistant with real-time X/Twitter data access.",
    fullDescription: "Grok by xAI is an AI assistant with a distinct personality and real-time access to posts on X (formerly Twitter). It is particularly useful for researching current events, trending topics, and social discourse that other AI tools lack access to.",
    bestFor: ["Real-time news and trending topics", "X/Twitter data research", "Current events analysis", "Social sentiment research"],
    steps: ["Access Grok at x.ai or via the X app on Premium+ plan.", "Ask about current events — Grok can search X in real time.", "Use DeepSearch mode for more thorough web and X research."],
    url: "https://x.ai/grok",
  },
  {
    name: "Gemini",
    domain: "gemini.google.com",
    icon: "✨",
    pricing: "Freemium",
    category: "Research",
    shortDescription: "Google's AI assistant with deep Search and Workspace integration.",
    fullDescription: "Gemini is Google's flagship AI assistant, available in a free tier and an Advanced tier. It integrates natively with Google Search, Gmail, Docs, Sheets, and Drive, and its Gemini 1.5 Pro model handles very long documents with a 1M-token context window.",
    bestFor: ["Research with Google Search grounding", "Google Workspace integration", "Long document analysis", "Multimodal queries (text, images, video)"],
    steps: ["Go to gemini.google.com and sign in with your Google account.", "Ask research questions — Gemini cites Google Search results automatically.", "Connect to Gmail and Docs in settings for Workspace-integrated assistance."],
    url: "https://gemini.google.com",
  },
  {
    name: "You.com",
    domain: "you.com",
    icon: "🔎",
    pricing: "Freemium",
    category: "Research",
    shortDescription: "AI search engine with cited answers and research modes.",
    fullDescription: "You.com is an AI search engine that provides cited answers sourced from the web. Its Research mode conducts multi-step research, synthesises multiple sources, and produces detailed reports — useful for competitive research, due diligence, and topic deep-dives.",
    bestFor: ["Cited research with web sources", "Competitive and market research", "Multi-step research reports", "Ad-free AI search"],
    steps: ["Go to you.com — no account needed for basic use.", "Type your research question and select Research mode for deep multi-source analysis.", "Review the cited answer and click through to primary sources."],
    url: "https://you.com",
  },
  {
    name: "Typeset (SciSpace)",
    domain: "typeset.io",
    icon: "🔬",
    pricing: "Freemium",
    category: "Research",
    shortDescription: "AI research assistant for reading and understanding scientific papers.",
    fullDescription: "SciSpace (formerly Typeset) is an AI research platform that lets you upload or search for academic papers and get plain-English explanations of complex sections. Its Copilot feature answers follow-up questions about specific tables, figures, and methods.",
    bestFor: ["Understanding academic papers", "Scientific literature review", "Research paper Q&A", "Finding and summarising studies"],
    steps: ["Go to typeset.io and upload a PDF or search for a paper by title.", "Use the AI Copilot to highlight confusing sections and ask questions.", "Export your notes and summaries to your reference manager."],
    url: "https://typeset.io",
  },
  {
    name: "Perplexity",
    domain: "perplexity.ai",
    icon: "🔍",
    pricing: "Freemium",
    category: "Research",
    shortDescription: "AI search that gives direct, cited answers from the web.",
    fullDescription: "Perplexity AI is a conversational search engine that provides direct, sourced answers instead of a list of links. It conducts real-time web research for every query, cites every claim, and supports follow-up questions — making it the fastest way to research any topic.",
    bestFor: ["Fast research with citations", "Current events and news", "Quick fact-checking", "Replacing traditional Google searches"],
    steps: ["Go to perplexity.ai — free with no account required.", "Type your research question in natural language.", "Review the cited answer and click sources to verify. Use Pro Search for deeper research."],
    url: "https://perplexity.ai",
  },
  {
    name: "Merlin",
    domain: "getmerlin.in",
    icon: "🧙",
    pricing: "Freemium",
    category: "Research",
    shortDescription: "AI browser extension for research and summarising web pages.",
    fullDescription: "Merlin is a browser extension that brings GPT-4, Claude, and Gemini directly into your browser. Summarise any web page, YouTube video, or PDF with one click, ask questions about what you're reading, and write AI-assisted responses in Gmail or LinkedIn.",
    bestFor: ["Summarising web pages instantly", "YouTube video summaries", "In-browser AI research", "Writing assistance in Gmail and LinkedIn"],
    steps: ["Install Merlin from getmerlin.in or your browser's extension store.", "Visit any webpage and click the Merlin icon to summarise.", "Use the chat panel to ask questions about the current page."],
    url: "https://getmerlin.in",
  },
  {
    name: "Kagi",
    domain: "kagi.com",
    icon: "🔏",
    pricing: "Paid",
    category: "Research",
    shortDescription: "Privacy-first AI search engine with no ads.",
    fullDescription: "Kagi is a paid, ad-free search engine with powerful AI features including universal summaries for any URL, a research assistant, and personalised results that you control. Its FastGPT answers questions instantly with citations, and it never sells your data.",
    bestFor: ["Ad-free, private search", "Universal web page summaries", "Unbiased search results", "Power users who value privacy"],
    steps: ["Sign up at kagi.com — $5/month for 300 searches.", "Use FastGPT for instant AI answers at the top of results.", "Install the browser extension and use the Universal Summariser on any URL."],
    url: "https://kagi.com",
  },

  // Productivity — additional
  {
    name: "Zapier AI",
    domain: "zapier.com",
    icon: "⚡",
    pricing: "Freemium",
    category: "Productivity",
    shortDescription: "AI-powered automation across 7,000+ apps with natural language setup.",
    fullDescription: "Zapier's AI features let you build automations by describing what you want in plain English. The AI Zap builder creates multi-step workflows automatically, and Zapier's AI Actions let you trigger Zapier from ChatGPT and other AI tools.",
    bestFor: ["Natural language automation setup", "Cross-app workflow automation", "AI-triggered automations", "No-code productivity workflows"],
    steps: ["Sign up at zapier.com and click 'Try AI Zap builder'.", "Describe the automation you want in plain English.", "Review the generated Zap, connect your apps, and turn it on."],
    url: "https://zapier.com/ai",
  },
  {
    name: "Make (Integromat)",
    domain: "make.com",
    icon: "🔧",
    pricing: "Freemium",
    category: "Productivity",
    shortDescription: "Visual no-code automation platform for complex multi-step workflows.",
    fullDescription: "Make (formerly Integromat) is a visual automation platform that handles complex, multi-step workflows with advanced logic, data transformations, and error handling. Its drag-and-drop canvas shows data flowing between apps in real time.",
    bestFor: ["Complex multi-step automations", "Data transformation workflows", "Advanced conditional logic", "Zapier alternative with more control"],
    steps: ["Sign up free at make.com.", "Click 'Create a new scenario' and add your first app module.", "Build your workflow visually by connecting modules with conditions and data mappers."],
    url: "https://make.com",
  },
  {
    name: "Clockwise",
    domain: "getclockwise.com",
    icon: "🕐",
    pricing: "Freemium",
    category: "Productivity",
    shortDescription: "AI calendar assistant that optimises your schedule for deep work.",
    fullDescription: "Clockwise uses AI to automatically move flexible meetings to create long uninterrupted blocks of Focus Time. It syncs across team calendars to find meeting times that work for everyone and protects your most productive hours.",
    bestFor: ["Creating deep work blocks", "Team meeting scheduling", "Calendar optimisation", "Protecting focus time"],
    steps: ["Connect your Google Calendar at getclockwise.com.", "Set your Focus Time preferences (hours, protected periods).", "Let Clockwise auto-schedule meetings and protect your focus blocks."],
    url: "https://getclockwise.com",
  },

  // Marketing — additional
  {
    name: "Klaviyo AI",
    domain: "klaviyo.com",
    icon: "📧",
    pricing: "Freemium",
    category: "Marketing",
    shortDescription: "AI email and SMS marketing platform for e-commerce.",
    fullDescription: "Klaviyo is the leading email and SMS marketing platform for e-commerce, now with AI features for subject line generation, send time optimisation, predictive customer lifetime value, and automated product recommendations.",
    bestFor: ["E-commerce email marketing", "AI-powered segmentation", "SMS and email automation", "Shopify and WooCommerce integration"],
    steps: ["Connect your store at klaviyo.com — free up to 250 contacts.", "Set up AI-recommended flows: abandoned cart, welcome series, post-purchase.", "Use AI subject line suggestions when drafting campaigns."],
    url: "https://klaviyo.com",
  },
  {
    name: "Predis.ai",
    domain: "predis.ai",
    icon: "📱",
    pricing: "Freemium",
    category: "Marketing",
    shortDescription: "Generate social media posts with AI visuals from a single prompt.",
    fullDescription: "Predis.ai generates complete social media posts — copy, hashtags, and branded visuals — from a single text prompt. It supports all major platforms and lets you maintain brand colours, fonts, and logo across all generated content.",
    bestFor: ["Complete social posts with visuals", "Brand-consistent social content", "Bulk social media generation", "Small business social marketing"],
    steps: ["Sign up at predis.ai and set up your brand kit.", "Enter a topic or product and select your platform.", "AI generates post copy and branded visual — edit and schedule or download."],
    url: "https://predis.ai",
  },
  {
    name: "Lately AI",
    domain: "lately.ai",
    icon: "♻️",
    pricing: "Paid",
    category: "Marketing",
    shortDescription: "AI that repurposes long content into dozens of social posts.",
    fullDescription: "Lately AI analyses your best-performing social content to learn your brand voice, then automatically repurposes long-form content — blog posts, podcasts, videos, whitepapers — into dozens of platform-optimised social media posts.",
    bestFor: ["Content repurposing at scale", "Learning and replicating brand voice", "Podcast and blog to social posts", "Enterprise content marketing teams"],
    steps: ["Connect your social channels at lately.ai to train the AI on your voice.", "Upload a piece of long-form content (blog, podcast transcript, video).", "AI generates a batch of social posts — review, edit, and schedule."],
    url: "https://lately.ai",
  },
  {
    name: "Clearscope",
    domain: "clearscope.io",
    icon: "📈",
    pricing: "Paid",
    category: "Marketing",
    shortDescription: "AI content optimisation platform that helps content rank on Google.",
    fullDescription: "Clearscope analyses top-ranking pages for your target keyword and generates a real-time content grading report showing which terms and topics you need to cover. It integrates with Google Docs and WordPress for in-editor optimisation.",
    bestFor: ["SEO content optimisation", "Content briefs for writers", "Google Docs SEO integration", "Editorial content strategy"],
    steps: ["Create a report at clearscope.io by entering your target keyword.", "Review the recommended terms and content grade targets.", "Write or paste your content into the editor and optimise to hit an A or A+ grade."],
    url: "https://clearscope.io",
  },
  {
    name: "Brand24",
    domain: "brand24.com",
    icon: "📣",
    pricing: "Paid",
    category: "Marketing",
    shortDescription: "AI social listening and brand monitoring tool.",
    fullDescription: "Brand24 monitors millions of online sources — social media, news, blogs, forums, podcasts — for mentions of your brand, competitors, or keywords in real time. AI sentiment analysis and influence scoring help you prioritise which mentions to act on.",
    bestFor: ["Brand reputation monitoring", "Competitor tracking", "PR crisis detection", "Influencer identification"],
    steps: ["Sign up at brand24.com and enter your brand name as a keyword.", "Configure additional keywords (competitors, products, industry terms).", "Monitor the feed and set up instant alerts for negative mentions."],
    url: "https://brand24.com",
  },

  // Analytics — additional
  {
    name: "DataRobot",
    domain: "datarobot.com",
    icon: "🤖",
    pricing: "Paid",
    category: "Analytics",
    shortDescription: "Enterprise AI platform for automated machine learning.",
    fullDescription: "DataRobot is an enterprise AutoML platform that automates the end-to-end process of building, deploying, and monitoring machine learning models. Business analysts and data scientists can build production-grade predictive models without writing ML code.",
    bestFor: ["Enterprise AutoML", "Predictive model deployment", "Business forecasting at scale", "Model monitoring and governance"],
    steps: ["Contact DataRobot at datarobot.com to start a trial.", "Upload your dataset and select the target column to predict.", "DataRobot trains hundreds of models, selects the best, and deploys it to an API."],
    url: "https://datarobot.com",
  },
  {
    name: "Polymer",
    domain: "polymersearch.com",
    icon: "🔮",
    pricing: "Freemium",
    category: "Analytics",
    shortDescription: "Turn spreadsheets into interactive AI-powered dashboards.",
    fullDescription: "Polymer transforms spreadsheets and CSV files into interactive, shareable dashboards in minutes — no SQL or BI expertise required. Its AI automatically suggests the most insightful charts and lets you query your data in natural language.",
    bestFor: ["Spreadsheet-to-dashboard conversion", "Non-technical data visualisation", "Shareable team dashboards", "Natural language data queries"],
    steps: ["Upload your spreadsheet or CSV at polymersearch.com.", "AI suggests dashboard layouts and chart types automatically.", "Customise and share a link to your interactive dashboard."],
    url: "https://polymersearch.com",
  },
  {
    name: "Hex",
    domain: "hex.tech",
    icon: "⬡",
    pricing: "Freemium",
    category: "Analytics",
    shortDescription: "Collaborative AI data workspace for SQL, Python, and charts.",
    fullDescription: "Hex is a modern data workspace where analysts and data scientists collaborate on notebooks combining SQL, Python, and interactive charts. Its Magic AI feature generates and explains SQL and Python code from natural language, accelerating analysis.",
    bestFor: ["Data analysis collaboration", "AI-assisted SQL and Python", "Shareable interactive notebooks", "Modern BI and analytics teams"],
    steps: ["Sign up at hex.tech — free for individual use.", "Create a new project and connect your data warehouse.", "Use Magic AI to generate SQL queries from plain-English questions."],
    url: "https://hex.tech",
  },
  {
    name: "Equals",
    domain: "equals.com",
    icon: "🟰",
    pricing: "Freemium",
    category: "Analytics",
    shortDescription: "AI-powered spreadsheet connected directly to your database.",
    fullDescription: "Equals is a next-generation spreadsheet that connects directly to databases, data warehouses, and APIs. Its AI Copilot writes SQL queries from plain English, automatically builds charts, and helps non-technical users analyse live data.",
    bestFor: ["Live database-connected spreadsheets", "SQL generation from plain English", "Startup and SaaS analytics", "Replacing manual data exports"],
    steps: ["Connect your database at equals.com — Postgres, MySQL, Snowflake, and more.", "Open a new sheet and ask AI Copilot to write your first query.", "Build charts from query results and share your live spreadsheet with your team."],
    url: "https://equals.com",
  },
  {
    name: "Deepnote",
    domain: "deepnote.com",
    icon: "📓",
    pricing: "Freemium",
    category: "Analytics",
    shortDescription: "Collaborative AI data science notebook for teams.",
    fullDescription: "Deepnote is a cloud-based data science notebook that supports Python and SQL with real-time collaboration like Google Docs. Its AI features auto-complete code, explain errors, and generate analyses from natural language queries.",
    bestFor: ["Collaborative data science", "Python and SQL notebooks", "AI-assisted code generation", "Sharing reproducible analyses"],
    steps: ["Sign up at deepnote.com — free for individuals.", "Create a project and connect your data source.", "Write code with AI autocomplete or use the AI chat to generate entire analysis blocks."],
    url: "https://deepnote.com",
  },

  // Presentations — additional
  {
    name: "Pitch",
    domain: "pitch.com",
    icon: "🎯",
    pricing: "Freemium",
    category: "Presentations",
    shortDescription: "Collaborative presentation tool with AI writing and design assistance.",
    fullDescription: "Pitch is a modern presentation platform built for teams, with real-time collaboration, version history, and AI-assisted content generation. Its AI can generate entire slide decks from a brief, write speaker notes, and suggest visual improvements.",
    bestFor: ["Team presentation collaboration", "Investor pitch decks", "AI-generated slide content", "Modern design templates"],
    steps: ["Sign up at pitch.com — free for individuals and small teams.", "Start from a template or let AI generate a deck from your topic.", "Collaborate in real time, assign slides to teammates, and share a live link."],
    url: "https://pitch.com",
  },
  {
    name: "Presentations.ai",
    domain: "presentations.ai",
    icon: "🪄",
    pricing: "Freemium",
    category: "Presentations",
    shortDescription: "Generate entire slide decks from a text prompt.",
    fullDescription: "Presentations.ai generates complete, professionally designed slide decks from a single text description. Specify your topic, audience, and style, and the AI produces a full deck with layouts, content, and visuals ready to present or customise.",
    bestFor: ["Instant full deck generation", "Non-designers needing polished slides", "Quick pitch or proposal decks", "Multiple design style options"],
    steps: ["Visit presentations.ai and describe your presentation topic.", "Choose a design style from the generated options.", "Edit individual slides and download as PPTX or share a link."],
    url: "https://presentations.ai",
  },
  {
    name: "Slidesgo",
    domain: "slidesgo.com",
    icon: "🎨",
    pricing: "Freemium",
    category: "Presentations",
    shortDescription: "AI-powered presentation templates for Google Slides and PowerPoint.",
    fullDescription: "Slidesgo offers thousands of free, professionally designed presentation templates for Google Slides and PowerPoint, plus an AI presentation maker that generates custom decks from a topic description. Freepik integration adds AI-generated images directly to slides.",
    bestFor: ["Free professional slide templates", "Google Slides and PowerPoint users", "AI-customised template generation", "Education and business presentations"],
    steps: ["Go to slidesgo.com and search for your topic or use the AI maker.", "Choose a template and click Edit in Google Slides or download for PowerPoint.", "Replace placeholder content with your own and add AI images via Freepik."],
    url: "https://slidesgo.com",
  },

  // Customer Support — additional
  {
    name: "Kustomer",
    domain: "kustomer.com",
    icon: "💁",
    pricing: "Paid",
    category: "Customer Support",
    shortDescription: "AI CRM for customer service with full conversation history.",
    fullDescription: "Kustomer is a customer service CRM that gives agents a complete timeline of every customer interaction across all channels. Its AI features include automated routing, suggested responses, sentiment analysis, and a self-service bot.",
    bestFor: ["Omnichannel customer service CRM", "Full customer conversation history", "AI-assisted agent responses", "High-touch customer service teams"],
    steps: ["Contact Kustomer at kustomer.com to start a trial.", "Import customer data and connect your support channels.", "Use AI routing rules and suggested replies to speed up agent response times."],
    url: "https://kustomer.com",
  },
  {
    name: "Gladly",
    domain: "gladly.com",
    icon: "😊",
    pricing: "Paid",
    category: "Customer Support",
    shortDescription: "People-centred AI customer service platform.",
    fullDescription: "Gladly is a customer service platform built around the customer rather than tickets. It provides a lifelong conversation view across all channels and uses AI for hero (agent) assistance, self-service, and proactive outreach, popular with retail and DTC brands.",
    bestFor: ["Retail and DTC customer service", "People-first support approach", "Lifetime customer conversation view", "High-value customer relationships"],
    steps: ["Contact Gladly at gladly.com to arrange an enterprise demo.", "Connect your support channels and import customer data.", "Configure AI-powered self-service and agent assist features."],
    url: "https://gladly.com",
  },
  {
    name: "Chaindesk",
    domain: "chaindesk.ai",
    icon: "🔗",
    pricing: "Freemium",
    category: "Customer Support",
    shortDescription: "Build a custom AI chatbot from your own data in minutes.",
    fullDescription: "Chaindesk lets you create a custom ChatGPT-style chatbot trained on your own documents, website, and data sources — no coding required. Deploy it as a widget on your site or integrate via API for customer support, internal knowledge bases, and lead capture.",
    bestFor: ["Custom chatbot from your own docs", "Website customer support bot", "Internal knowledge base assistant", "No-code chatbot creation"],
    steps: ["Sign up at chaindesk.ai and create a new agent.", "Upload your documents or enter your website URL for scraping.", "Customise the bot persona and embed it on your website with a snippet."],
    url: "https://chaindesk.ai",
  },
  {
    name: "Botpress",
    domain: "botpress.com",
    icon: "🤖",
    pricing: "Freemium",
    category: "Customer Support",
    shortDescription: "Open-source AI chatbot platform for developers and enterprises.",
    fullDescription: "Botpress is an open-source conversational AI platform for building sophisticated chatbots with LLM integration, visual flow builder, and multi-channel deployment. Its Studio IDE lets developers build enterprise chatbots with full code control.",
    bestFor: ["Developer-built custom chatbots", "Open-source chatbot platform", "Complex conversational flows", "Enterprise chatbot deployment"],
    steps: ["Sign up at botpress.com or self-host the open-source version.", "Use the visual Studio to design conversation flows.", "Integrate LLM knowledge bases and deploy to your website, WhatsApp, or Slack."],
    url: "https://botpress.com",
  },

  // HR — additional
  {
    name: "Beamery",
    domain: "beamery.com",
    icon: "🌟",
    pricing: "Paid",
    category: "HR & Recruiting",
    shortDescription: "AI talent lifecycle management platform.",
    fullDescription: "Beamery is a talent lifecycle management platform that uses AI to match candidates to roles, infer skills from job history, identify internal mobility opportunities, and predict workforce trends — giving large enterprises a strategic view of their talent.",
    bestFor: ["Enterprise talent management", "Skills-based hiring", "Internal mobility programmes", "Workforce planning and forecasting"],
    steps: ["Contact Beamery at beamery.com for an enterprise demo.", "Integrate with your existing ATS and HRIS systems.", "Use AI talent matching and skills inference to find the best fit candidates."],
    url: "https://beamery.com",
  },
  {
    name: "Eightfold AI",
    domain: "eightfold.ai",
    icon: "♾️",
    pricing: "Paid",
    category: "HR & Recruiting",
    shortDescription: "AI platform for talent acquisition and workforce intelligence.",
    fullDescription: "Eightfold AI uses a deep-learning talent intelligence platform to match candidates to roles based on potential rather than just keywords. It helps enterprises with talent acquisition, retention, diversity hiring, and workforce planning at scale.",
    bestFor: ["Skills-based talent matching", "Diversity and inclusion hiring", "Workforce intelligence", "Large-scale talent acquisition"],
    steps: ["Contact Eightfold at eightfold.ai for an enterprise demonstration.", "Integrate with your current ATS and HR data sources.", "Use Talent Intelligence dashboards to identify hiring and retention opportunities."],
    url: "https://eightfold.ai",
  },
  {
    name: "Greenhouse AI",
    domain: "greenhouse.com",
    icon: "🌱",
    pricing: "Paid",
    category: "HR & Recruiting",
    shortDescription: "Leading ATS with AI-powered hiring tools.",
    fullDescription: "Greenhouse is one of the most widely used applicant tracking systems, with AI features for job description optimisation, candidate scoring, interview question suggestions, and hiring analytics to eliminate bias and improve structured hiring.",
    bestFor: ["Structured hiring processes", "ATS with AI assist", "Interview calibration", "Data-driven hiring decisions"],
    steps: ["Set up Greenhouse at greenhouse.com and connect your job boards.", "Use AI Assist to write inclusive job descriptions.", "Configure scorecards and let AI surface the best-matched applicants."],
    url: "https://greenhouse.com",
  },
  {
    name: "Findem",
    domain: "findem.ai",
    icon: "🔍",
    pricing: "Paid",
    category: "HR & Recruiting",
    shortDescription: "AI talent sourcing with 3D data attributes.",
    fullDescription: "Findem uses AI and what it calls '3D data' — combining professional profiles, company data, and time-series signals — to surface uniquely qualified passive candidates. It identifies talent based on rich attributes like career trajectory and company growth signals.",
    bestFor: ["Passive candidate sourcing", "Data-enriched talent search", "Diversity sourcing goals", "Reducing agency dependency"],
    steps: ["Contact Findem at findem.ai to set up your account.", "Define your ideal candidate profile using attribute-based search.", "Launch automated outreach campaigns to sourced candidates."],
    url: "https://findem.ai",
  },
  {
    name: "Leena AI",
    domain: "leena.ai",
    icon: "🤖",
    pricing: "Paid",
    category: "HR & Recruiting",
    shortDescription: "AI employee assistant for HR queries and onboarding.",
    fullDescription: "Leena AI is an autonomous HR agent that handles employee queries about policies, benefits, payroll, and onboarding across chat interfaces. It integrates with HRIS systems like Workday and SAP SuccessFactors to resolve HR tickets without human intervention.",
    bestFor: ["HR query automation", "Employee onboarding assistance", "HR ticket deflection", "Workday and SAP SuccessFactors integration"],
    steps: ["Contact Leena AI at leena.ai to start an enterprise pilot.", "Connect your HRIS and upload HR policy documents.", "Deploy the assistant on Slack, Teams, or your intranet for employees."],
    url: "https://leena.ai",
  },
  {
    name: "Manatal",
    domain: "manatal.com",
    icon: "👥",
    pricing: "Paid",
    category: "HR & Recruiting",
    shortDescription: "AI-powered ATS for recruitment agencies and HR teams.",
    fullDescription: "Manatal is an affordable AI-powered ATS designed for recruitment agencies and SMB HR teams. It enriches candidate profiles with LinkedIn and social data, scores candidates against job requirements, and provides AI-generated recommendations.",
    bestFor: ["Recruitment agencies", "SMB hiring teams", "Candidate scoring and ranking", "Affordable ATS with AI features"],
    steps: ["Sign up at manatal.com — 14-day free trial available.", "Post jobs and import or manually add candidates.", "Use AI scoring to rank applicants and review AI-recommended candidates first."],
    url: "https://manatal.com",
  },

  // Finance — additional
  {
    name: "Trullion",
    domain: "trullion.com",
    icon: "📑",
    pricing: "Paid",
    category: "Finance",
    shortDescription: "AI accounting platform for lease and revenue recognition.",
    fullDescription: "Trullion is an AI-powered accounting platform that automates complex lease accounting (ASC 842, IFRS 16) and revenue recognition (ASC 606). It extracts data from contracts using AI, posts entries to your ERP, and maintains the audit trail.",
    bestFor: ["Lease accounting automation", "Revenue recognition compliance", "Contract data extraction", "Audit-ready financial reporting"],
    steps: ["Contact Trullion at trullion.com to start a pilot.", "Upload your contracts — AI extracts key terms automatically.", "Review AI-generated journal entries and push to your ERP."],
    url: "https://trullion.com",
  },
  {
    name: "Booke AI",
    domain: "booke.ai",
    icon: "📚",
    pricing: "Freemium",
    category: "Finance",
    shortDescription: "AI bookkeeping automation for accountants and small businesses.",
    fullDescription: "Booke AI automates bookkeeping reconciliation using AI that categorises transactions, identifies anomalies, and resolves discrepancies with explainability. It integrates with QuickBooks and Xero, and its client portal streamlines document collection.",
    bestFor: ["Automated transaction categorisation", "Bookkeeping reconciliation", "QuickBooks and Xero users", "Accounting firms serving SMBs"],
    steps: ["Connect your QuickBooks or Xero account at booke.ai.", "AI automatically categorises uncategorised transactions.", "Review AI suggestions, accept in bulk, and export the clean data."],
    url: "https://booke.ai",
  },
  {
    name: "Planful",
    domain: "planful.com",
    icon: "📋",
    pricing: "Paid",
    category: "Finance",
    shortDescription: "AI financial planning and analysis (FP&A) platform.",
    fullDescription: "Planful is a cloud-based financial planning and analysis platform with AI-powered forecasting, scenario modelling, and reporting. Finance teams use it to replace spreadsheet-based budgeting with collaborative, automated planning cycles.",
    bestFor: ["FP&A and budgeting automation", "Financial scenario modelling", "Replacing Excel-based planning", "CFO and finance team reporting"],
    steps: ["Contact Planful at planful.com to schedule a demo.", "Connect your ERP and historical financial data.", "Build your budget model and run AI-assisted forecast scenarios."],
    url: "https://planful.com",
  },
  {
    name: "Mosaic Tech",
    domain: "mosaic.tech",
    icon: "🧩",
    pricing: "Paid",
    category: "Finance",
    shortDescription: "AI-powered strategic finance platform for hypergrowth companies.",
    fullDescription: "Mosaic Tech is a strategic finance platform that gives CFOs and finance teams real-time visibility into metrics, automated reporting, and AI-assisted forecasting. It integrates with your ERP, CRM, and billing systems to provide a single source of financial truth.",
    bestFor: ["SaaS and hypergrowth company finance", "Real-time financial dashboards", "Automated board and investor reporting", "Strategic finance planning"],
    steps: ["Contact Mosaic at mosaic.tech to start a trial.", "Connect your data sources — NetSuite, Salesforce, Stripe, etc.", "Use pre-built SaaS metric dashboards and AI forecasting tools."],
    url: "https://mosaic.tech",
  },
  {
    name: "Stampli",
    domain: "stampli.com",
    icon: "🏷️",
    pricing: "Paid",
    category: "Finance",
    shortDescription: "AI accounts payable automation centred on collaboration.",
    fullDescription: "Stampli is an AP automation platform that uses AI (Billy the Bot) to learn your company's coding patterns and auto-code invoices. Its communication hub keeps all invoice-related conversations on the invoice itself, eliminating email chains.",
    bestFor: ["Accounts payable automation", "Invoice coding and approval", "AP team collaboration", "ERP-agnostic AP solution"],
    steps: ["Contact Stampli at stampli.com to set up your account.", "Connect your ERP — Stampli integrates with 70+ systems.", "Billy the Bot learns your coding patterns within the first few invoices."],
    url: "https://stampli.com",
  },
  {
    name: "Vena",
    domain: "venasolutions.com",
    icon: "💹",
    pricing: "Paid",
    category: "Finance",
    shortDescription: "Excel-native AI financial planning and reporting platform.",
    fullDescription: "Vena is a financial planning and analysis platform that uses Excel as its interface — keeping the familiarity finance teams love while adding a centralised database, workflow automation, and AI-powered forecasting. Ideal for mid-market companies.",
    bestFor: ["Excel-based FP&A modernisation", "Mid-market financial planning", "Budget and forecast automation", "Finance teams attached to Excel"],
    steps: ["Contact Vena at venasolutions.com to start a pilot.", "Install the Vena Excel add-in and connect your data sources.", "Use existing Excel models inside Vena with added workflow and AI features."],
    url: "https://venasolutions.com",
  },
  {
    name: "Brex AI",
    domain: "brex.com",
    icon: "💳",
    pricing: "Freemium",
    category: "Finance",
    shortDescription: "AI-powered spend management and corporate cards for startups.",
    fullDescription: "Brex is a spend management platform for startups and growing companies with AI-powered features for automatic expense categorisation, spend insights, budget alerts, and a built-in AI assistant that answers finance questions from your own spending data.",
    bestFor: ["Startup expense management", "Corporate card with AI insights", "Automated expense reporting", "Finance AI on your own spend data"],
    steps: ["Apply for a Brex account at brex.com — no personal guarantee required.", "Issue cards to employees and set smart spending limits.", "Use the AI assistant to query your spending data and surface insights."],
    url: "https://brex.com",
  },
];

function slugify(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

const PRICING_STYLES: Record<string, { badge: string; label: string }> = {
  Free: { badge: "bg-[#142a4d] text-[#1877F2]", label: "FREE" },
  Freemium: { badge: "bg-[#142a4d] text-[#1877F2]", label: "FREEMIUM" },
  Paid: { badge: "bg-[#3a1524] text-[#ff6b85]", label: "PAID" },
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
      <div className="min-h-screen">
        <div className="px-6 pt-6 pb-2 max-w-3xl mx-auto">
          <button onClick={() => router.push("/")} className="text-sm text-[#1877F2] hover:underline">
            ← Back to all tools
          </button>
        </div>
        <div className="max-w-3xl mx-auto px-6 py-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-[#0d1729] border border-[#233150] flex items-center justify-center text-3xl flex-shrink-0">
              <img
                src={`https://www.google.com/s2/favicons?domain=${basicTool.domain}&sz=64`}
                alt={basicTool.name}
                className="w-8 h-8 object-contain"
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#e9eef8]">{basicTool.name}</h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs px-2 py-0.5 rounded-full bg-[#0d1729] text-[#93a4c3] font-medium">{basicTool.category}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${basicTool.pricing === "Paid" ? "bg-[#3a1524] text-[#ff6b85]" : "bg-[#142a4d] text-[#1877F2]"}`}>{basicTool.pricing}</span>
              </div>
            </div>
          </div>
          <p className="text-[#c6d2e6] text-base leading-relaxed mb-8">{basicTool.description}</p>
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
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-6">
        <h1 className="text-2xl font-semibold text-[#e9eef8]">Tool not found</h1>
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

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `What is ${tool.name}?`,
        acceptedAnswer: { "@type": "Answer", text: tool.fullDescription },
      },
      {
        "@type": "Question",
        name: `Is ${tool.name} free?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: tool.pricing === "Free"
            ? `Yes, ${tool.name} is completely free to use.`
            : tool.pricing === "Freemium"
            ? `${tool.name} offers a free plan with limited features. Paid plans unlock more advanced capabilities.`
            : `${tool.name} is a paid tool. Visit their website for current pricing details.`,
        },
      },
      {
        "@type": "Question",
        name: `What is ${tool.name} best for?`,
        acceptedAnswer: { "@type": "Answer", text: tool.bestFor.join(", ") + "." },
      },
      {
        "@type": "Question",
        name: `How do I get started with ${tool.name}?`,
        acceptedAnswer: { "@type": "Answer", text: tool.steps[0] },
      },
    ],
  };

  return (
    <div className="min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
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
          <div className="w-16 h-16 rounded-2xl bg-[#0d1729] border border-[#233150] flex items-center justify-center overflow-hidden flex-shrink-0">
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
              style={{ fontFamily: "var(--font-playfair), serif" }}
            >
              {tool.name}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${pricing.badge}`}>
                {pricing.label}
              </span>
              <span className="text-[11px] text-[#93a4c3] bg-[#0d1729] border border-[#233150] px-2.5 py-0.5 rounded-full">
                {tool.category}
              </span>
            </div>
            <p className="text-[11px] text-[#6b7c9c] mt-1.5">
              Last verified {new Date().toLocaleString("en-US", { month: "long", year: "numeric" })}
            </p>
          </div>
        </div>

        {/* Description */}
        <p className="text-base text-[#e9eef8] leading-relaxed mb-8">
          {tool.fullDescription}
        </p>

        {/* Best for */}
        <div className="mb-8">
          <h2 className="tech-label mb-3">
            Best for
          </h2>
          <ul className="flex flex-col gap-2">
            {tool.bestFor.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-[#93a4c3]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1877F2] mt-2 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* How to get started */}
        <div className="mb-8">
          <h2 className="tech-label mb-3">
            How to get started
          </h2>
          <ol className="flex flex-col gap-3">
            {tool.steps.map((step, i) => (
              <li key={i} className="flex gap-3 items-start">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#142a4d] text-[#1877F2] text-xs font-bold flex items-center justify-center mt-0.5">
                  {i + 1}
                </span>
                <p className="text-sm text-[#93a4c3] leading-relaxed">{step}</p>
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
        <div className="bg-[#0d1729] border-t border-[#233150] px-6 py-10">
          <div className="max-w-3xl mx-auto">
            <h2
              className="text-lg font-semibold text-[#e9eef8] mb-5"
              style={{ fontFamily: "var(--font-playfair), serif" }}
            >
              Similar tools
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {similar.map((t) => (
                <button
                  key={t.name}
                  onClick={() => router.push(`/tools/${slugify(t.name)}`)}
                  className="tool-card text-left bg-[#101b32] border border-[#233150] rounded-xl p-4 flex flex-col gap-3 overflow-hidden"
                >
                  <div className="w-9 h-9 rounded-lg bg-[#0d1729] border border-[#233150] flex items-center justify-center overflow-hidden">
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
                    <h3 className="text-sm font-semibold text-[#e9eef8] group-hover:text-[#1877F2]">
                      {t.name}
                    </h3>
                    <p className="text-xs text-[#93a4c3] mt-1 leading-relaxed line-clamp-2">
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
