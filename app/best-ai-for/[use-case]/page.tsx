import { notFound } from "next/navigation";
import Link from "next/link";
import SiteHeader from "../../components/SiteHeader";
import SiteFooter from "../../components/SiteFooter";

const USE_CASES: Record<string, {
  title: string;
  description: string;
  tools: { name: string; domain: string; url: string; description: string; pricing: string; why: string }[];
}> = {
  "writing": {
    title: "Best AI Tools for Writing",
    description: "The top AI writing tools to help you write faster, better, and smarter. From blog posts to marketing copy.",
    tools: [
      { name: "ChatGPT", domain: "openai.com", url: "https://chat.openai.com", pricing: "Freemium", description: "The world's most popular AI for drafting, editing, and brainstorming any type of content.", why: "Best all-around writing assistant" },
      { name: "Jasper", domain: "jasper.ai", url: "https://jasper.ai", pricing: "Paid", description: "Purpose-built for marketing teams with 50+ templates for every content type.", why: "Best for marketing copy" },
      { name: "Copy.ai", domain: "copy.ai", url: "https://copy.ai", pricing: "Freemium", description: "Generate high-converting copy for ads, emails, and social media in seconds.", why: "Best for short-form copy" },
      { name: "Grammarly", domain: "grammarly.com", url: "https://grammarly.com", pricing: "Freemium", description: "AI writing assistant that checks grammar, style, clarity, and tone in real time.", why: "Best for editing & proofreading" },
      { name: "Writesonic", domain: "writesonic.com", url: "https://writesonic.com", pricing: "Freemium", description: "Long-form AI writer with SEO optimization built in.", why: "Best for SEO blog posts" },
      { name: "Quillbot", domain: "quillbot.com", url: "https://quillbot.com", pricing: "Freemium", description: "Paraphrase, summarize, and rewrite any text with AI.", why: "Best for paraphrasing" },
    ],
  },
  "video": {
    title: "Best AI Tools for Video Creation",
    description: "Create, edit, and produce professional videos with AI, no camera or editing experience needed.",
    tools: [
      { name: "HeyGen", domain: "heygen.com", url: "https://heygen.com", pricing: "Freemium", description: "Create AI avatar videos with realistic lip-sync in 100+ languages.", why: "Best for AI avatar videos" },
      { name: "Synthesia", domain: "synthesia.io", url: "https://synthesia.io", pricing: "Paid", description: "Professional AI video platform used by 50,000+ companies worldwide.", why: "Best for corporate training videos" },
      { name: "Runway", domain: "runwayml.com", url: "https://runwayml.com", pricing: "Freemium", description: "AI video generation and editing with text-to-video capabilities.", why: "Best for creative video generation" },
      { name: "Descript", domain: "descript.com", url: "https://descript.com", pricing: "Freemium", description: "Edit video by editing text, the easiest video editor ever made.", why: "Best for podcast & interview videos" },
      { name: "Pictory", domain: "pictory.ai", url: "https://pictory.ai", pricing: "Paid", description: "Turn blog posts and scripts into short videos automatically.", why: "Best for repurposing content" },
      { name: "Lumen5", domain: "lumen5.com", url: "https://lumen5.com", pricing: "Freemium", description: "Transform articles into engaging social media videos with AI.", why: "Best for social media videos" },
    ],
  },
  "image-generation": {
    title: "Best AI Tools for Image Generation",
    description: "Generate stunning, unique images from text descriptions. From art to product photos, no design skills needed.",
    tools: [
      { name: "Midjourney", domain: "midjourney.com", url: "https://midjourney.com", pricing: "Paid", description: "The gold standard for AI art,produces the most visually stunning results.", why: "Best image quality" },
      { name: "DALL-E 3", domain: "openai.com", url: "https://chatgpt.com", pricing: "Freemium", description: "OpenAI's image generator, integrated directly into ChatGPT.", why: "Best for following text prompts exactly" },
      { name: "Adobe Firefly", domain: "adobe.com", url: "https://firefly.adobe.com", pricing: "Freemium", description: "Commercially safe AI images built into Adobe's creative suite.", why: "Best for commercial use" },
      { name: "Leonardo.ai", domain: "leonardo.ai", url: "https://leonardo.ai", pricing: "Freemium", description: "Fine-tuned models for game art, product images, and consistent characters.", why: "Best for game & product assets" },
      { name: "Stable Diffusion", domain: "stability.ai", url: "https://stability.ai/stable-image", pricing: "Free", description: "Open-source image generation with no usage limits.", why: "Best free option" },
      { name: "Ideogram", domain: "ideogram.ai", url: "https://ideogram.ai", pricing: "Freemium", description: "AI image generator that actually renders text correctly in images.", why: "Best for images with text" },
    ],
  },
  "coding": {
    title: "Best AI Tools for Coding",
    description: "Write, debug, and review code faster with AI. From autocomplete to full app generation.",
    tools: [
      { name: "GitHub Copilot", domain: "github.com", url: "https://github.com/features/copilot", pricing: "Freemium", description: "AI pair programmer that suggests code in real time inside your editor.", why: "Best for daily coding" },
      { name: "Cursor", domain: "cursor.com", url: "https://cursor.com", pricing: "Freemium", description: "AI-first code editor that can write and edit entire files at once.", why: "Best AI code editor" },
      { name: "Claude", domain: "anthropic.com", url: "https://claude.ai", pricing: "Freemium", description: "Excellent at understanding large codebases and complex debugging tasks.", why: "Best for complex debugging" },
      { name: "Replit AI", domain: "replit.com", url: "https://replit.com", pricing: "Freemium", description: "Build and deploy full apps in the browser with AI assistance.", why: "Best for beginners" },
      { name: "Tabnine", domain: "tabnine.com", url: "https://tabnine.com", pricing: "Freemium", description: "Private AI code completion that runs locally for security.", why: "Best for privacy-conscious teams" },
      { name: "ChatGPT", domain: "openai.com", url: "https://chat.openai.com", pricing: "Freemium", description: "Great for explaining code, writing boilerplate, and learning new languages.", why: "Best for learning & explaining" },
    ],
  },
  "music": {
    title: "Best AI Tools for Music Creation",
    description: "Create original music, beats, and sound effects with AI, no musical experience required.",
    tools: [
      { name: "Suno", domain: "suno.ai", url: "https://suno.ai", pricing: "Freemium", description: "Generate full songs with vocals, lyrics, and production from a text prompt.", why: "Best for full song generation" },
      { name: "Udio", domain: "udio.com", url: "https://udio.com", pricing: "Freemium", description: "Create studio-quality music in any genre from text descriptions.", why: "Best audio quality" },
      { name: "Mubert", domain: "mubert.com", url: "https://mubert.com", pricing: "Freemium", description: "Generate royalty-free background music for videos and podcasts.", why: "Best for background music" },
      { name: "Soundraw", domain: "soundraw.io", url: "https://soundraw.io", pricing: "Paid", description: "AI music generator with full commercial license for creators.", why: "Best for commercial projects" },
      { name: "Boomy", domain: "boomy.com", url: "https://boomy.com", pricing: "Freemium", description: "Create and release music to streaming platforms instantly with AI.", why: "Best for releasing music" },
      { name: "AIVA", domain: "aiva.ai", url: "https://aiva.ai", pricing: "Freemium", description: "AI composer specializing in cinematic and orchestral music.", why: "Best for cinematic scores" },
    ],
  },
  "productivity": {
    title: "Best AI Tools for Productivity",
    description: "Work smarter with AI tools that automate tasks, organize your work, and save you hours every day.",
    tools: [
      { name: "Notion AI", domain: "notion.so", url: "https://notion.so", pricing: "Freemium", description: "AI built into your workspace,summarize, write, and organize without switching tabs.", why: "Best all-in-one workspace" },
      { name: "Otter.ai", domain: "otter.ai", url: "https://otter.ai", pricing: "Freemium", description: "Transcribe meetings in real time and generate automatic summaries.", why: "Best for meeting notes" },
      { name: "Motion", domain: "usemotion.com", url: "https://usemotion.com", pricing: "Paid", description: "AI that automatically schedules your tasks around your meetings.", why: "Best for scheduling" },
      { name: "Zapier", domain: "zapier.com", url: "https://zapier.com", pricing: "Freemium", description: "Connect 5,000+ apps and automate workflows without code.", why: "Best for automation" },
      { name: "Reclaim.ai", domain: "reclaim.ai", url: "https://reclaim.ai", pricing: "Freemium", description: "AI calendar assistant that protects time for your priorities.", why: "Best for time blocking" },
      { name: "Superhuman", domain: "superhuman.com", url: "https://superhuman.com", pricing: "Paid", description: "The fastest email experience ever made, powered by AI.", why: "Best for email" },
    ],
  },
  "marketing": {
    title: "Best AI Tools for Marketing",
    description: "Grow your business faster with AI marketing tools for content, ads, SEO, and social media.",
    tools: [
      { name: "Jasper", domain: "jasper.ai", url: "https://jasper.ai", pricing: "Paid", description: "The #1 AI marketing platform for enterprise content teams.", why: "Best for content teams" },
      { name: "Surfer SEO", domain: "surferseo.com", url: "https://surferseo.com", pricing: "Paid", description: "AI-powered SEO tool that helps you write content that ranks on Google.", why: "Best for SEO content" },
      { name: "AdCreative.ai", domain: "adcreative.ai", url: "https://adcreative.ai", pricing: "Paid", description: "Generate high-converting ad creatives with AI in seconds.", why: "Best for paid ads" },
      { name: "Copy.ai", domain: "copy.ai", url: "https://copy.ai", pricing: "Freemium", description: "AI copywriting for ads, emails, landing pages, and social media.", why: "Best for copywriting" },
      { name: "Lately", domain: "lately.ai", url: "https://lately.ai", pricing: "Paid", description: "Repurpose long content into dozens of social media posts automatically.", why: "Best for social media" },
      { name: "Phrasee", domain: "phrasee.co", url: "https://phrasee.co", pricing: "Paid", description: "AI that writes and optimizes email subject lines to boost open rates.", why: "Best for email marketing" },
    ],
  },
  "research": {
    title: "Best AI Tools for Research",
    description: "Find, analyze, and summarize information faster with AI research tools.",
    tools: [
      { name: "Perplexity AI", domain: "perplexity.ai", url: "https://perplexity.ai", pricing: "Freemium", description: "AI search engine that gives cited, accurate answers instead of a list of links.", why: "Best for quick research" },
      { name: "Elicit", domain: "elicit.org", url: "https://elicit.org", pricing: "Freemium", description: "AI research assistant that finds and summarizes academic papers.", why: "Best for academic research" },
      { name: "Claude", domain: "anthropic.com", url: "https://claude.ai", pricing: "Freemium", description: "Analyze long documents, PDFs, and research papers with 200k context window.", why: "Best for document analysis" },
      { name: "Consensus", domain: "consensus.app", url: "https://consensus.app", pricing: "Freemium", description: "Search engine that pulls insights directly from scientific research.", why: "Best for scientific consensus" },
      { name: "ChatGPT", domain: "openai.com", url: "https://chat.openai.com", pricing: "Freemium", description: "Summarize, explain, and analyze any topic with web browsing.", why: "Best all-around" },
      { name: "Explainpaper", domain: "explainpaper.com", url: "https://explainpaper.com", pricing: "Free", description: "Upload a research paper and get confusing sections explained in plain English.", why: "Best for understanding papers" },
    ],
  },
  "design": {
    title: "Best AI Tools for Design",
    description: "Create stunning visuals, logos, and UI designs with AI — no design experience needed.",
    tools: [
      { name: "Canva AI", domain: "canva.com", url: "https://canva.com", pricing: "Freemium", description: "The world's most popular design tool with AI-powered generation, editing, and templates.", why: "Best all-around design tool" },
      { name: "Adobe Firefly", domain: "adobe.com", url: "https://firefly.adobe.com", pricing: "Freemium", description: "Commercially safe generative AI built into Adobe Creative Cloud.", why: "Best for professional designers" },
      { name: "Looka", domain: "looka.com", url: "https://looka.com", pricing: "Paid", description: "AI logo maker and brand identity generator for startups and small businesses.", why: "Best for logo design" },
      { name: "Framer", domain: "framer.com", url: "https://framer.com", pricing: "Freemium", description: "Build beautiful websites with AI, no code required.", why: "Best for website design" },
      { name: "Galileo AI", domain: "usegalileo.ai", url: "https://usegalileo.ai", pricing: "Paid", description: "Generate editable UI designs from text descriptions in seconds.", why: "Best for UI/UX design" },
      { name: "Midjourney", domain: "midjourney.com", url: "https://midjourney.com", pricing: "Paid", description: "Generate stunning concept art and design assets from text prompts.", why: "Best for concept art" },
    ],
  },
  "seo": {
    title: "Best AI Tools for SEO",
    description: "Rank higher on Google with AI-powered SEO tools for content, keywords, and technical optimization.",
    tools: [
      { name: "Surfer SEO", domain: "surferseo.com", url: "https://surferseo.com", pricing: "Paid", description: "Write and optimize content that ranks on Google with real-time SEO scoring.", why: "Best for content optimization" },
      { name: "Semrush", domain: "semrush.com", url: "https://semrush.com", pricing: "Paid", description: "All-in-one SEO platform for keyword research, competitor analysis, and site audits.", why: "Best all-in-one SEO platform" },
      { name: "Ahrefs", domain: "ahrefs.com", url: "https://ahrefs.com", pricing: "Paid", description: "Industry-leading backlink analysis and keyword research tool.", why: "Best for backlink analysis" },
      { name: "Clearscope", domain: "clearscope.io", url: "https://clearscope.io", pricing: "Paid", description: "AI content optimization platform that helps you write content Google loves.", why: "Best for content briefs" },
      { name: "Frase", domain: "frase.io", url: "https://frase.io", pricing: "Paid", description: "Research, write, and optimize SEO content 10x faster with AI.", why: "Best for research + writing combo" },
      { name: "ChatGPT", domain: "openai.com", url: "https://chat.openai.com", pricing: "Freemium", description: "Use for keyword ideation, meta descriptions, title tags, and content outlines.", why: "Best free starting point" },
    ],
  },
  "social-media": {
    title: "Best AI Tools for Social Media",
    description: "Grow your social media presence faster with AI tools for content creation, scheduling, and analytics.",
    tools: [
      { name: "Buffer", domain: "buffer.com", url: "https://buffer.com", pricing: "Freemium", description: "AI-powered social media scheduler with content suggestions for all major platforms.", why: "Best for scheduling" },
      { name: "Taplio", domain: "taplio.com", url: "https://taplio.com", pricing: "Paid", description: "AI tool for growing your LinkedIn audience with posts, outreach, and analytics.", why: "Best for LinkedIn growth" },
      { name: "FeedHive", domain: "feedhive.com", url: "https://feedhive.com", pricing: "Paid", description: "AI social media platform with conditional posting, recycling, and performance predictions.", why: "Best for power users" },
      { name: "Jasper", domain: "jasper.ai", url: "https://jasper.ai", pricing: "Paid", description: "Generate on-brand social media captions and ad copy at scale.", why: "Best for brand teams" },
      { name: "Predis.ai", domain: "predis.ai", url: "https://predis.ai", pricing: "Freemium", description: "Generate social media posts with visuals from a single text prompt.", why: "Best for visual posts" },
      { name: "Lately", domain: "lately.ai", url: "https://lately.ai", pricing: "Paid", description: "Repurpose long-form content into dozens of social media posts automatically.", why: "Best for content repurposing" },
    ],
  },
  "presentations": {
    title: "Best AI Tools for Presentations",
    description: "Create beautiful, professional presentations in minutes with AI — no design skills required.",
    tools: [
      { name: "Gamma", domain: "gamma.app", url: "https://gamma.app", pricing: "Freemium", description: "Generate complete slide decks from a text prompt in under a minute.", why: "Best for speed" },
      { name: "Beautiful.ai", domain: "beautiful.ai", url: "https://beautiful.ai", pricing: "Freemium", description: "Smart slide templates that auto-format as you add content.", why: "Best for polished slides" },
      { name: "Pitch", domain: "pitch.com", url: "https://pitch.com", pricing: "Freemium", description: "Collaborative presentation tool with AI writing and design assistance.", why: "Best for team collaboration" },
      { name: "Canva AI", domain: "canva.com", url: "https://canva.com/presentations", pricing: "Freemium", description: "Create presentations with AI-generated designs, images, and speaker notes.", why: "Best for non-designers" },
      { name: "SlidesAI", domain: "slidesai.io", url: "https://slidesai.io", pricing: "Freemium", description: "Turn any text or document into a Google Slides presentation instantly.", why: "Best for Google Slides users" },
      { name: "Plus AI", domain: "plusai.com", url: "https://plusai.com", pricing: "Paid", description: "Add AI-powered slide generation directly inside Google Slides and PowerPoint.", why: "Best add-on for existing tools" },
    ],
  },
  "data-analysis": {
    title: "Best AI Tools for Data Analysis",
    description: "Analyze data, build charts, and find insights faster with AI — no SQL or coding required.",
    tools: [
      { name: "Julius", domain: "julius.ai", url: "https://julius.ai", pricing: "Freemium", description: "Chat with your data — upload CSVs and get charts, analysis, and insights instantly.", why: "Best for non-technical users" },
      { name: "ChatGPT", domain: "openai.com", url: "https://chat.openai.com", pricing: "Freemium", description: "Advanced Data Analysis mode lets you upload files and run Python analysis in-browser.", why: "Best all-around data tool" },
      { name: "Obviously AI", domain: "obviously.ai", url: "https://obviously.ai", pricing: "Paid", description: "Build and deploy predictive ML models without writing any code.", why: "Best for predictions" },
      { name: "Polymer", domain: "polymersearch.com", url: "https://polymersearch.com", pricing: "Freemium", description: "Turn spreadsheets into interactive dashboards with AI in minutes.", why: "Best for dashboards" },
      { name: "Rows", domain: "rows.com", url: "https://rows.com", pricing: "Freemium", description: "AI-powered spreadsheet that can fetch live data, run analysis, and summarize results.", why: "Best AI spreadsheet" },
      { name: "Tableau", domain: "tableau.com", url: "https://tableau.com", pricing: "Paid", description: "Industry-leading data visualization platform with AI-powered insights.", why: "Best for enterprise BI" },
    ],
  },
  "customer-support": {
    title: "Best AI Tools for Customer Support",
    description: "Automate customer service, reduce ticket volume, and delight customers 24/7 with AI.",
    tools: [
      { name: "Intercom", domain: "intercom.com", url: "https://intercom.com", pricing: "Paid", description: "AI-first customer service platform with Fin AI agent that resolves 50%+ of tickets automatically.", why: "Best all-in-one platform" },
      { name: "Tidio", domain: "tidio.com", url: "https://tidio.com", pricing: "Freemium", description: "AI chatbot and live chat tool for e-commerce, easy to set up in minutes.", why: "Best for e-commerce" },
      { name: "Zendesk AI", domain: "zendesk.com", url: "https://zendesk.com", pricing: "Paid", description: "AI agents and automation built into the world's most popular support platform.", why: "Best for large support teams" },
      { name: "Freshdesk", domain: "freshdesk.com", url: "https://freshdesk.com", pricing: "Freemium", description: "AI-powered helpdesk with automated ticket routing and suggested replies.", why: "Best value for SMBs" },
      { name: "Forethought", domain: "forethought.ai", url: "https://forethought.ai", pricing: "Paid", description: "Generative AI for support that triages, assists, and resolves tickets autonomously.", why: "Best for enterprise" },
      { name: "Chatbase", domain: "chatbase.co", url: "https://chatbase.co", pricing: "Freemium", description: "Build a custom AI chatbot trained on your docs and website in minutes.", why: "Best for building custom chatbots" },
    ],
  },
  "translation": {
    title: "Best AI Tools for Translation",
    description: "Translate text, documents, and websites accurately into 100+ languages with AI.",
    tools: [
      { name: "DeepL", domain: "deepl.com", url: "https://deepl.com", pricing: "Freemium", description: "The most accurate AI translator, consistently outperforming Google Translate for European languages.", why: "Best translation accuracy" },
      { name: "Google Translate", domain: "translate.google.com", url: "https://translate.google.com", pricing: "Free", description: "Free translation for 130+ languages with camera, voice, and document support.", why: "Best free option" },
      { name: "Claude", domain: "anthropic.com", url: "https://claude.ai", pricing: "Freemium", description: "Translate with nuance, tone preservation, and cultural context for complex documents.", why: "Best for nuanced translation" },
      { name: "Lokalise AI", domain: "lokalise.com", url: "https://lokalise.com", pricing: "Paid", description: "AI translation management platform for software localization teams.", why: "Best for software localization" },
      { name: "Smartcat", domain: "smartcat.com", url: "https://smartcat.com", pricing: "Freemium", description: "AI translation platform with human review workflows for businesses.", why: "Best for document translation" },
      { name: "Reverso", domain: "reverso.net", url: "https://reverso.net", pricing: "Freemium", description: "Context-aware translation with examples from real-world usage.", why: "Best for language learners" },
    ],
  },
  "education": {
    title: "Best AI Tools for Learning & Education",
    description: "Learn faster, study smarter, and teach more effectively with AI-powered education tools.",
    tools: [
      { name: "Khan Academy AI", domain: "khanacademy.org", url: "https://khanacademy.org", pricing: "Free", description: "Khanmigo is a free AI tutor that guides students through any subject with Socratic teaching.", why: "Best free AI tutor" },
      { name: "Duolingo", domain: "duolingo.com", url: "https://duolingo.com", pricing: "Freemium", description: "AI-powered language learning with personalized lessons, speaking practice, and conversation.", why: "Best for language learning" },
      { name: "Quizlet", domain: "quizlet.com", url: "https://quizlet.com", pricing: "Freemium", description: "AI study tools including flashcard generation, practice tests, and Q&A from any material.", why: "Best for studying and memorization" },
      { name: "Socratic", domain: "socratic.org", url: "https://socratic.org", pricing: "Free", description: "Google's AI homework helper — snap a photo of any question and get a step-by-step explanation.", why: "Best for homework help" },
      { name: "Coursera", domain: "coursera.org", url: "https://coursera.org", pricing: "Freemium", description: "AI-recommended courses and certificates from top universities worldwide.", why: "Best for professional courses" },
      { name: "Claude", domain: "anthropic.com", url: "https://claude.ai", pricing: "Freemium", description: "Explain any concept in plain English, generate practice questions, and tutor on any topic.", why: "Best personal AI tutor" },
    ],
  },
  "automation": {
    title: "Best AI Tools for Automation",
    description: "Automate repetitive tasks and build powerful workflows that save hours every week.",
    tools: [
      { name: "Zapier", domain: "zapier.com", url: "https://zapier.com", pricing: "Freemium", description: "Connect 7,000+ apps and automate workflows with AI — no code required.", why: "Best for app integrations" },
      { name: "Make", domain: "make.com", url: "https://make.com", pricing: "Freemium", description: "Visual workflow builder for complex multi-step automations with advanced logic.", why: "Best for complex workflows" },
      { name: "n8n", domain: "n8n.io", url: "https://n8n.io", pricing: "Free", description: "Open-source workflow automation with 400+ integrations — self-host for full control.", why: "Best open-source option" },
      { name: "Bardeen", domain: "bardeen.ai", url: "https://bardeen.ai", pricing: "Freemium", description: "AI browser automation that can scrape, fill forms, and automate web tasks.", why: "Best for browser automation" },
      { name: "Relay.app", domain: "relay.app", url: "https://relay.app", pricing: "Freemium", description: "Human-in-the-loop automation that combines AI and human judgment.", why: "Best for human+AI workflows" },
      { name: "Activepieces", domain: "activepieces.com", url: "https://activepieces.com", pricing: "Free", description: "Open-source Zapier alternative with AI actions built in.", why: "Best free Zapier alternative" },
    ],
  },
  "audio": {
    title: "Best AI Tools for Audio & Podcasts",
    description: "Record, edit, transcribe, and enhance audio with AI — professional results without a studio.",
    tools: [
      { name: "Descript", domain: "descript.com", url: "https://descript.com", pricing: "Freemium", description: "Edit audio by editing text — the easiest podcast editor ever made, powered by AI.", why: "Best for podcast editing" },
      { name: "ElevenLabs", domain: "elevenlabs.io", url: "https://elevenlabs.io", pricing: "Freemium", description: "Generate ultra-realistic AI voices and clone your own voice for narration.", why: "Best for AI voiceovers" },
      { name: "Adobe Podcast", domain: "podcast.adobe.com", url: "https://podcast.adobe.com", pricing: "Freemium", description: "Remove background noise and enhance audio quality to studio-grade with one click.", why: "Best for audio enhancement" },
      { name: "Otter.ai", domain: "otter.ai", url: "https://otter.ai", pricing: "Freemium", description: "Transcribe audio and video in real time with speaker identification.", why: "Best for transcription" },
      { name: "Cleanvoice", domain: "cleanvoice.ai", url: "https://cleanvoice.ai", pricing: "Paid", description: "Automatically remove filler words, mouth sounds, and silences from recordings.", why: "Best for cleaning up recordings" },
      { name: "Murf", domain: "murf.ai", url: "https://murf.ai", pricing: "Freemium", description: "Create professional voiceovers with 120+ AI voices in 20+ languages.", why: "Best for voiceover production" },
    ],
  },
  "sales": {
    title: "Best AI Tools for Sales",
    description: "Close more deals faster with AI tools for prospecting, outreach, call analysis, and forecasting.",
    tools: [
      { name: "Gong", domain: "gong.io", url: "https://gong.io", pricing: "Paid", description: "AI revenue intelligence platform that analyzes calls, emails, and deals to improve win rates.", why: "Best for sales intelligence" },
      { name: "Apollo.io", domain: "apollo.io", url: "https://apollo.io", pricing: "Freemium", description: "All-in-one sales platform with 275M contacts, AI email writing, and sequencing.", why: "Best for prospecting" },
      { name: "Lavender", domain: "lavender.ai", url: "https://lavender.ai", pricing: "Freemium", description: "AI email coach that scores your sales emails and suggests improvements in real time.", why: "Best for email personalization" },
      { name: "Outreach", domain: "outreach.io", url: "https://outreach.io", pricing: "Paid", description: "AI sales execution platform for sequences, forecasting, and deal management.", why: "Best for enterprise sales" },
      { name: "Clay", domain: "clay.com", url: "https://clay.com", pricing: "Freemium", description: "Enrich prospect data from 50+ sources and generate hyper-personalized outreach at scale.", why: "Best for outbound enrichment" },
      { name: "ChatGPT", domain: "openai.com", url: "https://chat.openai.com", pricing: "Freemium", description: "Write cold emails, generate objection responses, and create sales scripts instantly.", why: "Best free sales writing tool" },
    ],
  },
  "email": {
    title: "Best AI Tools for Email",
    description: "Write better emails faster, manage your inbox with AI, and automate your email workflows.",
    tools: [
      { name: "Superhuman", domain: "superhuman.com", url: "https://superhuman.com", pricing: "Paid", description: "The fastest email experience ever built — AI triage, summaries, and instant replies.", why: "Best overall email AI" },
      { name: "Gmail AI", domain: "gmail.com", url: "https://gmail.com", pricing: "Freemium", description: "Smart Compose and Gemini AI built into Gmail for drafting and summarizing emails.", why: "Best free option" },
      { name: "Lavender", domain: "lavender.ai", url: "https://lavender.ai", pricing: "Freemium", description: "AI email coach that scores and improves your sales and outreach emails.", why: "Best for sales emails" },
      { name: "Shortwave", domain: "shortwave.com", url: "https://shortwave.com", pricing: "Freemium", description: "AI email client that auto-triages, summarizes threads, and drafts replies.", why: "Best AI email client" },
      { name: "Missive", domain: "missive.app", url: "https://missive.app", pricing: "Paid", description: "Team email client with AI drafting and shared inboxes.", why: "Best for teams" },
      { name: "Claude", domain: "anthropic.com", url: "https://claude.ai", pricing: "Freemium", description: "Draft professional emails of any length, tone, or complexity in seconds.", why: "Best for complex email writing" },
    ],
  },
  "resume": {
    title: "Best AI Tools for Resume & Job Search",
    description: "Land more interviews with AI tools that write, optimize, and tailor your resume for every job.",
    tools: [
      { name: "Teal", domain: "tealhq.com", url: "https://tealhq.com", pricing: "Freemium", description: "AI resume builder that tailors your resume to each job description automatically.", why: "Best all-in-one job search platform" },
      { name: "Kickresume", domain: "kickresume.com", url: "https://kickresume.com", pricing: "Freemium", description: "AI resume and cover letter builder with 35+ ATS-friendly templates.", why: "Best for templates" },
      { name: "Resume.io", domain: "resume.io", url: "https://resume.io", pricing: "Paid", description: "Professional resume builder with AI writing assistance and ATS optimization.", why: "Best for clean professional resumes" },
      { name: "Rezi", domain: "rezi.ai", url: "https://rezi.ai", pricing: "Freemium", description: "ATS-optimized resume builder that scores your resume against job descriptions.", why: "Best for ATS optimization" },
      { name: "ChatGPT", domain: "openai.com", url: "https://chat.openai.com", pricing: "Freemium", description: "Paste any job description and ask ChatGPT to tailor your resume bullet points instantly.", why: "Best free resume tailoring" },
      { name: "LinkedIn AI", domain: "linkedin.com", url: "https://linkedin.com", pricing: "Freemium", description: "AI-powered profile writing, job matching, and application insights built into LinkedIn.", why: "Best for LinkedIn optimization" },
    ],
  },
  "legal": {
    title: "Best AI Tools for Legal Work",
    description: "Draft contracts, review documents, and research case law faster with AI legal tools.",
    tools: [
      { name: "Harvey", domain: "harvey.ai", url: "https://harvey.ai", pricing: "Paid", description: "AI for law firms — draft, review, and analyze legal documents with GPT-4 fine-tuned on legal data.", why: "Best for law firms" },
      { name: "Spellbook", domain: "spellbook.legal", url: "https://spellbook.legal", pricing: "Paid", description: "AI contract drafting and review tool that works inside Microsoft Word.", why: "Best for contract review" },
      { name: "DoNotPay", domain: "donotpay.com", url: "https://donotpay.com", pricing: "Paid", description: "AI lawyer for consumers — fight parking tickets, cancel subscriptions, and draft demand letters.", why: "Best for consumers" },
      { name: "Casetext", domain: "casetext.com", url: "https://casetext.com", pricing: "Paid", description: "AI legal research tool that finds relevant case law and statutes in seconds.", why: "Best for legal research" },
      { name: "Claude", domain: "anthropic.com", url: "https://claude.ai", pricing: "Freemium", description: "Analyze long contracts, explain legal language, and draft basic legal documents.", why: "Best free legal AI" },
      { name: "Ironclad", domain: "ironcladapp.com", url: "https://ironcladapp.com", pricing: "Paid", description: "AI-powered contract lifecycle management for legal and business teams.", why: "Best for contract management" },
    ],
  },
};

const SLUG_MAP: Record<string, string> = {
  "writing": "writing",
  "video": "video",
  "video-creation": "video",
  "video-editing": "video",
  "image-generation": "image-generation",
  "images": "image-generation",
  "image-creation": "image-generation",
  "coding": "coding",
  "programming": "coding",
  "development": "coding",
  "music": "music",
  "music-creation": "music",
  "productivity": "productivity",
  "marketing": "marketing",
  "research": "research",
  "design": "design",
  "graphic-design": "design",
  "ui-design": "design",
  "seo": "seo",
  "search-engine-optimization": "seo",
  "social-media": "social-media",
  "social": "social-media",
  "presentations": "presentations",
  "slides": "presentations",
  "pitch-decks": "presentations",
  "data-analysis": "data-analysis",
  "data": "data-analysis",
  "analytics": "data-analysis",
  "customer-support": "customer-support",
  "chatbots": "customer-support",
  "support": "customer-support",
  "translation": "translation",
  "translate": "translation",
  "education": "education",
  "learning": "education",
  "studying": "education",
  "automation": "automation",
  "workflows": "automation",
  "audio": "audio",
  "podcasts": "audio",
  "podcast": "audio",
  "sales": "sales",
  "email": "email",
  "emails": "email",
  "resume": "resume",
  "job-search": "resume",
  "cv": "resume",
  "legal": "legal",
  "contracts": "legal",
};

export function generateStaticParams() {
  return Object.keys(USE_CASES).map((slug) => ({ "use-case": slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ "use-case": string }> }) {
  const { "use-case": slug } = await params;
  const key = SLUG_MAP[slug] || slug;
  const data = USE_CASES[key];
  if (!data) return { title: "Not Found" };
  const year = new Date().getFullYear();
  return {
    title: `${data.title} (${year}) — HowToUseMyAI`,
    description: data.description,
    openGraph: {
      title: `${data.title} (${year}) — HowToUseMyAI`,
      description: data.description,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${data.title} (${year}) — HowToUseMyAI`,
      description: data.description,
    },
  };
}

export default async function BestAIForPage({ params }: { params: Promise<{ "use-case": string }> }) {
  const { "use-case": slug } = await params;
  const key = SLUG_MAP[slug] || slug;
  const data = USE_CASES[key];
  if (!data) notFound();

  const freeTools = data!.tools.filter((t) => t.pricing === "Free" || t.pricing === "Freemium");
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `What is the ${data!.title.toLowerCase()}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `The best AI tools for this category include ${data!.tools.slice(0, 3).map((t) => t.name).join(", ")}. ${data!.description}`,
        },
      },
      {
        "@type": "Question",
        name: `Is there a free AI tool for ${data!.title.replace("Best AI Tools for ", "").toLowerCase()}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: freeTools.length > 0
            ? `Yes, ${freeTools.slice(0, 2).map((t) => t.name).join(" and ")} offer free plans you can start with today.`
            : `Most tools in this category are paid, but many offer free trials so you can test before buying.`,
        },
      },
      {
        "@type": "Question",
        name: `Which ${data!.title.replace("Best AI Tools for ", "").toLowerCase()} AI tool should I use?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `${data!.tools[0].name} is our top pick — ${data!.tools[0].why.toLowerCase()}. ${data!.tools[1]?.name} is also excellent if you need ${data!.tools[1]?.why.toLowerCase()}.`,
        },
      },
    ],
  };

  const sectorName = data.title.replace("Best AI Tools for ", "");

  return (
    <div className="flex flex-col min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <SiteHeader active="/best-ai-for" />

      <main className="v2-page">
        <div className="v2-pagehead">
          <div className="v2-crumb">
            <Link href="/">NODE</Link>
            <i>//</i>
            <Link href="/best-ai-for">USE CASES</Link>
            <i>//</i>
            <span className="v2-crumb-cur">{sectorName.toUpperCase()}</span>
          </div>
          <h1 className="v2-pagetitle">{data.title}</h1>
          <p className="v2-pagelead">{data.description}</p>
          <div className="v2-readbar">
            <span className="flex items-center gap-2"><i className="v2-dot v2-dot-ok" /> RANKED SHORTLIST</span>
            <span className="v2-readbar-sep" />
            <span><b>{data.tools.length}</b> <span className="v2-readbar-dim">TOOLS</span></span>
          </div>
        </div>

        <div className="v2-stack">
          {data.tools.map((tool, i) => (
            <a
              key={tool.name}
              href={tool.url}
              target="_blank"
              rel="noopener noreferrer"
              className="v2-panel v2-trow"
            >
              <i className="v2-cb v2-cb-tl" /><i className="v2-cb v2-cb-tr" /><i className="v2-cb v2-cb-bl" /><i className="v2-cb v2-cb-br" />
              <span className="v2-trow-rank">{String(i + 1).padStart(2, "0")}</span>
              <span className="v2-mark" style={{ width: 40, height: 40, flexShrink: 0 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`https://www.google.com/s2/favicons?domain=${tool.domain}&sz=128`} alt={tool.name} width={23} height={23} loading="lazy" />
              </span>
              <div className="v2-trow-body">
                <div className="v2-trow-head">
                  <span className="v2-trow-name">{tool.name}</span>
                  {i === 0 && <span className="v2-toppick">TOP PICK</span>}
                  <span className={`v2-pill v2-pill-${tool.pricing.toLowerCase()}`}>{tool.pricing}</span>
                </div>
                <p className="v2-trow-desc">{tool.description}</p>
                <span className="v2-trow-why"><i>▸</i> {tool.why}</span>
              </div>
            </a>
          ))}
        </div>

        <div className="v2-ctapanel v2-panel">
          <i className="v2-cb v2-cb-tl" /><i className="v2-cb v2-cb-tr" /><i className="v2-cb v2-cb-bl" /><i className="v2-cb v2-cb-br" />
          <p>Not sure which one to pick for your exact task?</p>
          <Link
            href={`/recommend?q=${encodeURIComponent(data.title.replace("Best AI Tools for ", "I want to "))}`}
            className="v2-ctabtn"
          >
            ◆ GET A PERSONALIZED MATCH
          </Link>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
