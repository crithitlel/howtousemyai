// PROMPT LIBRARIES — copy-paste prompt collections per tool.
// Pilot set: ChatGPT, Midjourney, Claude, Gemini, Suno.
// Each prompt should be genuinely usable as-is, with [BRACKETED] slots the
// reader replaces. Sections group prompts by job-to-be-done.

export interface PromptSection {
  title: string;
  prompts: string[];
}

export interface PromptLibrary {
  toolName: string;
  toolSlug: string; // must match /tools/[slug]
  title: string;
  description: string; // meta description
  intro: string;
  sections: PromptSection[];
  tips: string[];
}

export const PROMPT_LIBS: Record<string, PromptLibrary> = {
  chatgpt: {
    toolName: "ChatGPT",
    toolSlug: "chatgpt",
    title: "ChatGPT Prompts That Actually Work",
    description:
      "Copy-paste ChatGPT prompts for writing, work, marketing, learning, and coding — organized by task, with tips for adapting each one.",
    intro:
      "The difference between a mediocre and a great ChatGPT answer is almost always the prompt. These are battle-tested patterns organized by job — copy one, replace the [BRACKETS], and iterate from there.",
    sections: [
      {
        title: "Writing & Editing",
        prompts: [
          "Rewrite the following text to be clearer and 30% shorter without losing any key information. Keep my tone: [PASTE TEXT]",
          "Act as a tough editor. Critique this draft for structure, clarity, and weak arguments — then show a revised version: [PASTE DRAFT]",
          "Write 5 different opening paragraphs for an article about [TOPIC], each with a different hook: a question, a statistic, a story, a bold claim, and a common myth.",
          "Turn these rough bullet points into a polished [EMAIL/BLOG POST/REPORT] in a [FRIENDLY/FORMAL] tone: [PASTE BULLETS]",
          "Proofread this text. List every error you find in a table (error, correction, reason), then output the corrected version: [PASTE TEXT]",
          "Write a [LENGTH]-word article about [TOPIC] for [AUDIENCE]. Use short paragraphs, subheadings, and concrete examples. Avoid filler phrases and clichés.",
        ],
      },
      {
        title: "Work & Productivity",
        prompts: [
          "Summarize this document in 3 levels: one sentence, one paragraph, and one page of key points with page references: [PASTE TEXT]",
          "I have these tasks today: [LIST TASKS]. Organize them by urgency and energy required, and propose a realistic schedule with time blocks.",
          "Draft a diplomatic reply to this difficult email. I want to [YOUR GOAL] without damaging the relationship: [PASTE EMAIL]",
          "Turn these meeting notes into: 1) a decision log, 2) action items with owners and deadlines, 3) a 3-sentence summary for people who missed it: [PASTE NOTES]",
          "Explain [COMPLEX TOPIC] to me like I'm a smart 15-year-old, then again at an expert level, then give me 3 questions to test my understanding.",
          "Act as my devil's advocate. I'm about to decide: [DECISION]. Give the strongest case against it and what I might be underestimating.",
        ],
      },
      {
        title: "Marketing & Business",
        prompts: [
          "Write 10 email subject lines for [CAMPAIGN/OFFER] targeting [AUDIENCE]. Mix curiosity, urgency, and benefit-led angles. Max 45 characters each.",
          "Create a competitor analysis framework for [YOUR PRODUCT] vs [COMPETITOR]. Compare positioning, pricing, strengths, weaknesses, and messaging gaps I can exploit.",
          "Generate 20 content ideas for [NICHE] ranked by likely engagement. For each: a working title, the hook, and the target keyword.",
          "Write a landing page for [PRODUCT]: headline, subheadline, 3 benefit blocks, social proof section, FAQ (5 questions), and CTA. Audience: [WHO]. Objection to overcome: [OBJECTION].",
          "Act as a customer who just churned from [PRODUCT]. Write the honest internal monologue of why you left, then convert it into 3 retention fixes.",
        ],
      },
      {
        title: "Learning & Research",
        prompts: [
          "Create a 30-day learning plan for [SKILL], 45 minutes per day. Structure: week themes, daily tasks, one free resource per day, and a weekly self-test.",
          "I'll paste text. Extract: key claims, the evidence given for each, and which claims are opinion vs fact. Format as a table: [PASTE TEXT]",
          "Teach me [TOPIC] using the Feynman technique: explain it simply, identify the gaps in your own explanation, then refine it twice.",
          "Quiz me on [TOPIC] with 10 questions, one at a time, increasing difficulty. After each answer, tell me if I'm right and explain why in 2 sentences.",
          "Compare the top 3 schools of thought on [TOPIC]. For each: core idea, best argument, biggest weakness, and one must-read source.",
        ],
      },
      {
        title: "Coding & Technical",
        prompts: [
          "Review this code for bugs, edge cases, and readability. Rank issues by severity and show the fixed code: [PASTE CODE]",
          "Explain what this code does line by line, as if onboarding a junior developer, then suggest one refactor: [PASTE CODE]",
          "Write a [LANGUAGE] function that [EXACT BEHAVIOR]. Include input validation, error handling, and 3 unit tests covering edge cases.",
          "I'm getting this error: [PASTE ERROR]. Here's the relevant code: [PASTE CODE]. List the 3 most likely causes in order of probability and how to verify each.",
          "Act as a system design interviewer. Ask me to design [SYSTEM], challenge my answers, and score me at the end with specific improvements.",
        ],
      },
    ],
    tips: [
      "Give it a role ('Act as a...') — it consistently changes the depth and vocabulary of the answer.",
      "Show, don't describe: paste an example of the tone or format you want and say 'match this.'",
      "Iterate in the same chat — 'make it shorter,' 'less formal,' 'add examples' — instead of restarting.",
      "Ask it to critique its own answer ('what's weak about this?') before you accept it.",
    ],
  },

  midjourney: {
    toolName: "Midjourney",
    toolSlug: "midjourney",
    title: "Midjourney Prompts & Formulas",
    description:
      "Copy-paste Midjourney prompts for portraits, products, landscapes, logos, and concept art — plus the parameter cheatsheet that controls quality.",
    intro:
      "Midjourney rewards structure: subject, style, lighting, camera, then parameters. These formulas and ready prompts cover the most common jobs — swap the [BRACKETS] and tune parameters like --ar and --stylize to taste.",
    sections: [
      {
        title: "Portraits & Characters",
        prompts: [
          "cinematic portrait of [SUBJECT], soft window light, shallow depth of field, 85mm lens, Kodak Portra 400, subtle film grain --ar 4:5",
          "character concept art of [CHARACTER DESCRIPTION], full body, neutral pose, front view, detailed costume design, clean background, artstation style --ar 2:3",
          "candid street photography of [SUBJECT] in [CITY], golden hour, motion blur in background, Leica look, documentary style --ar 3:2",
          "dramatic low-key studio portrait of [SUBJECT], single rim light, black background, high contrast, editorial photography --ar 4:5",
          "[SUBJECT] as a Pixar-style 3D character, expressive eyes, soft global illumination, high detail render --ar 1:1",
        ],
      },
      {
        title: "Products & Brand Shots",
        prompts: [
          "premium product photography of [PRODUCT], floating on pastel gradient background, soft studio lighting, subtle reflection, advertising style --ar 4:5",
          "[PRODUCT] on a wet black slate surface, dramatic spotlight, water droplets, dark moody advertising shot, ultra detailed --ar 1:1",
          "flat lay of [PRODUCT + RELATED ITEMS], top-down view, warm natural light, linen texture background, lifestyle brand aesthetic --ar 1:1",
          "[PRODUCT] exploded view, technical illustration style, labeled components, clean white background, isometric perspective --ar 16:9",
          "billboard advertisement mockup for [BRAND/PRODUCT], bold minimal composition, single striking visual, lots of negative space for text --ar 16:9",
        ],
      },
      {
        title: "Landscapes & Environments",
        prompts: [
          "aerial drone shot of [LANDSCAPE] at sunrise, volumetric fog in valleys, god rays, National Geographic style --ar 16:9",
          "[LOCATION] in heavy rain at night, neon reflections on wet streets, cyberpunk atmosphere, cinematic composition --ar 21:9",
          "cozy interior of [SPACE], warm lamp light, rainy window, detailed textures, Studio Ghibli inspired --ar 3:2",
          "epic fantasy landscape, [DESCRIBE SCENE], dramatic scale, tiny figure for perspective, matte painting style, trending on artstation --ar 21:9",
          "minimalist architectural photography of [BUILDING/STRUCTURE], strong geometric shadows, single accent color, Fstoppers style --ar 4:5",
        ],
      },
      {
        title: "Logos & Graphic Design",
        prompts: [
          "minimal vector logo for [BRAND], [ANIMAL/OBJECT] mark, flat design, 2 colors, clean geometry, white background --no photo detail, gradients",
          "vintage badge logo for [BRAND], [THEME] elements, circular composition, distressed texture, screen-print style --ar 1:1",
          "abstract geometric icon representing [CONCEPT], gradient of [COLOR 1] to [COLOR 2], modern tech branding, app icon style --ar 1:1",
          "hand-drawn mascot logo of [CHARACTER] for [BRAND TYPE], friendly expression, bold outlines, 3-color palette --ar 1:1",
        ],
      },
      {
        title: "Styles Worth Stealing",
        prompts: [
          "[ANY SUBJECT], double exposure with [SECOND ELEMENT], silhouette blend, minimal background",
          "[ANY SUBJECT] in isometric 3D diorama style, miniature scale, soft shadows, pastel palette --ar 1:1",
          "[ANY SUBJECT] as a risograph print, 2-color, visible grain, slight misregistration, zine aesthetic",
          "[ANY SUBJECT] in the style of a 1960s science textbook illustration, halftone shading, muted primaries",
          "[ANY SUBJECT] made entirely of [MATERIAL: glass/paper/moss/neon wire], studio lighting, macro detail --ar 1:1",
        ],
      },
    ],
    tips: [
      "Structure prompts as: subject → style → lighting → camera/medium → parameters. Order matters less than completeness.",
      "--ar sets aspect ratio (4:5 portraits, 16:9 scenes, 1:1 products). --stylize 50–250 keeps results closer to your prompt.",
      "Use --no [thing] to remove elements (e.g. --no text, watermark, hands).",
      "Feed it a reference: paste an image URL first to guide composition and palette.",
    ],
  },

  claude: {
    toolName: "Claude",
    toolSlug: "claude",
    title: "Claude Prompts for Deep Work",
    description:
      "Copy-paste Claude prompts for long documents, careful writing, analysis, and coding — designed around what Claude does best.",
    intro:
      "Claude shines at long documents, nuanced writing, and careful multi-step reasoning. These prompts lean into those strengths — especially pasting large amounts of context and asking for structured, thoughtful output.",
    sections: [
      {
        title: "Long Documents & Analysis",
        prompts: [
          "I'm pasting a long document. First summarize it in 5 bullets, then answer: what are the 3 weakest arguments, what's missing entirely, and what would a skeptical expert challenge first? [PASTE DOCUMENT]",
          "Compare these two documents. Build a table of: agreements, direct contradictions, and topics only one covers. Then tell me which is more credible and why: [PASTE BOTH]",
          "Here's a contract/agreement. Explain it in plain English section by section, flag anything unusual or one-sided, and list questions I should ask before signing: [PASTE TEXT]",
          "I'm pasting raw interview/meeting transcripts. Extract every distinct opinion expressed, who holds it, and where people disagree — quote the exact lines: [PASTE TRANSCRIPT]",
          "Read this report and produce an executive brief: situation, complication, key numbers, decision required, and your recommendation with confidence level: [PASTE REPORT]",
        ],
      },
      {
        title: "Writing With Nuance",
        prompts: [
          "Write a difficult message: I need to tell [WHO] that [HARD TRUTH] while preserving the relationship. Give me 3 versions: direct, gentle, and formal — and say which you'd send.",
          "Here's my draft. Don't rewrite it — instead, ask me the 5 questions whose answers would most improve it, then wait for my replies: [PASTE DRAFT]",
          "Adapt this text for 3 audiences: a CEO (skimmable, business impact), an engineer (precise, technical), and a new customer (warm, jargon-free): [PASTE TEXT]",
          "Write [PIECE] in my voice. Here are 2 samples of my writing — match sentence rhythm, vocabulary level, and how I open and close: [PASTE SAMPLES]",
          "Critique this piece the way a top editor at [PUBLICATION] would: line-level notes plus a verdict on whether the core idea is strong enough: [PASTE TEXT]",
        ],
      },
      {
        title: "Thinking & Decisions",
        prompts: [
          "Help me think through [DECISION] with a structure: what I control vs don't, reversible vs irreversible aspects, best/worst/most-likely outcomes, and what evidence would change my mind.",
          "Steelman both sides of [ISSUE] so well that a supporter of each would say 'that's fair.' Then identify the crux — the single question that actually decides it.",
          "I believe [BELIEF/PLAN]. Act as a red team: attack the assumptions, find the failure modes, and rate the overall risk 1–10 with reasoning.",
          "Walk me through [PROBLEM] using first principles: strip away assumptions, list what's fundamentally true, and rebuild the solution from scratch.",
          "I keep going back and forth on [DILEMMA]. Interview me one question at a time to uncover what I actually want, then reflect it back.",
        ],
      },
      {
        title: "Coding & Technical",
        prompts: [
          "Here's my codebase context and a bug: [PASTE CODE + ERROR]. Reason step by step about the root cause before proposing any fix. Then give the minimal patch.",
          "Refactor this code for readability without changing behavior. Explain each change and why it's safer or clearer: [PASTE CODE]",
          "Write comprehensive tests for this function: happy path, edge cases, and failure modes. Use [FRAMEWORK]: [PASTE CODE]",
          "Act as a senior engineer reviewing my architecture plan: [DESCRIBE PLAN]. What breaks at 10x scale? What's over-engineered today?",
          "Translate this [LANGUAGE A] code to [LANGUAGE B], keeping idiomatic style in the target language — not a literal translation: [PASTE CODE]",
        ],
      },
    ],
    tips: [
      "Paste everything — Claude handles very long context well, and more context reliably beats clever phrasing.",
      "Ask it to reason before answering ('think step by step, then answer') for analysis-heavy tasks.",
      "Use 'don't rewrite — ask me questions first' to keep control of your own voice in writing tasks.",
      "Give it your writing samples when tone matters; it's unusually good at matching them.",
    ],
  },

  gemini: {
    toolName: "Gemini",
    toolSlug: "gemini",
    title: "Gemini Prompts for Google Power Users",
    description:
      "Copy-paste Gemini prompts for Gmail, Docs, Sheets, research with sources, and multimodal tasks — built around Google's ecosystem strengths.",
    intro:
      "Gemini's edge is the Google ecosystem and multimodality: live information, Workspace integration, and understanding images and video. These prompts lean into exactly that.",
    sections: [
      {
        title: "Gmail & Communication",
        prompts: [
          "Summarize this email thread and draft a reply that [YOUR GOAL]. Keep it under 120 words and match the sender's formality: [PASTE THREAD]",
          "Turn these scattered thoughts into a clear, skimmable email with a subject line, one-line ask up front, and bullet details: [PASTE THOUGHTS]",
          "Write 3 versions of a follow-up email for [SITUATION]: polite nudge (day 3), firmer check-in (day 7), final notice (day 14).",
          "Rewrite this email to sound confident instead of apologetic — remove hedging words but keep it friendly: [PASTE EMAIL]",
        ],
      },
      {
        title: "Docs, Sheets & Workspace",
        prompts: [
          "Create a project plan table for [PROJECT]: phases, tasks, owners, deadlines, dependencies, and status column — ready to paste into Sheets.",
          "I'll paste spreadsheet data. Identify trends, outliers, and the 3 most decision-relevant insights, then suggest 2 charts that would show them best: [PASTE DATA]",
          "Write the formula I need in Google Sheets: I want to [EXACT GOAL, e.g. 'sum column B where column A contains X and date in C is this month']. Explain it briefly.",
          "Outline a [DOC TYPE: proposal/brief/one-pager] for [TOPIC] with section headings and 2-3 bullet prompts under each, so I can fill it in fast.",
        ],
      },
      {
        title: "Research With Fresh Info",
        prompts: [
          "What are the most recent developments in [TOPIC] as of this month? Cite sources with links and separate confirmed facts from speculation.",
          "Compare [PRODUCT A] vs [PRODUCT B] using current prices and features. Build a table and end with 'choose A if… / choose B if…'.",
          "Find 5 recent, credible articles about [TOPIC], summarize each in 2 sentences, and note any points where they disagree.",
          "I'm traveling to [PLACE] on [DATES]. Build an itinerary using realistic opening hours and travel times, with a rainy-day backup for each day.",
        ],
      },
      {
        title: "Multimodal (Images & Video)",
        prompts: [
          "[ATTACH IMAGE] Describe everything relevant in this image, then answer: [YOUR QUESTION ABOUT IT]",
          "[ATTACH SCREENSHOT] Explain what's happening in this error/interface and give me step-by-step instructions to fix or proceed.",
          "[ATTACH PHOTO OF DOCUMENT] Extract all text and structure it as a clean table/list. Flag anything you're unsure you read correctly.",
          "[ATTACH CHART] Interpret this chart: the trend, the anomaly, and the one-sentence takeaway I should tell my team.",
        ],
      },
      {
        title: "Everyday Power Moves",
        prompts: [
          "Plan my week: here are my commitments and goals: [PASTE]. Build a realistic schedule with focus blocks, buffers, and one thing to drop.",
          "Explain [TOPIC IN THE NEWS] neutrally: what happened, why it matters, what the main sides claim, and what's still unknown.",
          "Create a comparison of the top 3 options for [PURCHASE/SERVICE] in my budget of [AMOUNT], with current typical prices and one gotcha per option.",
          "Draft a YouTube script outline about [TOPIC]: hook (first 15 seconds), 3 sections with talking points, and an ending CTA.",
        ],
      },
    ],
    tips: [
      "Use Gemini inside Gmail/Docs/Sheets for context-aware help — it reads the document you're in.",
      "Ask for sources and links when researching; Gemini can ground answers in live search results.",
      "Attach images and screenshots liberally — multimodal questions are where it beats most rivals.",
      "For Sheets formulas, describe the goal in plain words and let it write the syntax.",
    ],
  },

  suno: {
    toolName: "Suno",
    toolSlug: "suno",
    title: "Suno Prompts & Song Formulas",
    description:
      "Copy-paste Suno prompts for every genre — style descriptions, lyric structures, and instrumental formulas that produce radio-quality AI songs.",
    intro:
      "Suno takes two inputs: a style description and (optionally) lyrics. The style box wants genre, mood, era, instruments, and vocal type — the lyrics box wants structure tags like [Verse] and [Chorus]. These formulas cover both.",
    sections: [
      {
        title: "Style Prompts by Genre",
        prompts: [
          "melancholic indie folk, fingerpicked acoustic guitar, soft male vocals, tape hiss, intimate bedroom recording, slow tempo",
          "upbeat 80s synthwave, punchy drum machine, neon arpeggios, female vocals with reverb, driving bassline, 118 bpm",
          "gritty southern rock, slide guitar, raspy male vocals, stomping rhythm, whiskey-bar energy",
          "lo-fi hip hop, dusty vinyl texture, jazzy piano samples, laid-back boom bap drums, instrumental",
          "epic orchestral trailer music, massive percussion, choir swells, heroic brass theme, cinematic build",
          "sunny reggae-pop, offbeat guitar skank, warm bass, relaxed male vocals, beach-day mood",
          "dark melodic techno, hypnotic pulse, analog synth stabs, minimal vocals, late-night warehouse feel, 124 bpm",
        ],
      },
      {
        title: "Lyric Structure Templates",
        prompts: [
          "[Verse 1]\\n(4 lines setting the scene about [TOPIC])\\n[Chorus]\\n(4 catchy lines, repeat the hook phrase '[HOOK]')\\n[Verse 2]\\n(4 lines developing the story)\\n[Chorus]\\n[Bridge]\\n(2-3 lines, emotional shift)\\n[Chorus]",
          "[Intro]\\n(spoken or hummed line)\\n[Verse]\\n[Pre-Chorus]\\n(2 lines building tension)\\n[Chorus]\\n[Verse]\\n[Pre-Chorus]\\n[Chorus]\\n[Outro]\\n(fade on the hook)",
          "Write a song about [SPECIFIC MOMENT, not a general theme] — small concrete details beat big abstract words. Mention [OBJECT], [PLACE], and [TIME OF DAY].",
          "[Chorus]\\nStart the song with the chorus for instant hook — then [Verse 1] explains how we got here.",
        ],
      },
      {
        title: "Instrumentals & Background Music",
        prompts: [
          "calm ambient piano, soft pad textures, gentle rainfall atmosphere, no drums, meditative, instrumental",
          "corporate background music, light acoustic guitar, subtle percussion, optimistic and unobtrusive, instrumental",
          "energetic sports montage rock, driving drums, power chords, rising intensity, instrumental",
          "cozy jazz café trio, brushed drums, walking upright bass, warm piano, low-key, instrumental",
          "8-bit video game theme, chiptune melody, upbeat loop-friendly structure, instrumental",
        ],
      },
      {
        title: "Occasions & Fun",
        prompts: [
          "happy birthday song for [NAME], mention [INSIDE JOKE/HOBBY], upbeat pop, singalong chorus with their name",
          "wedding first-dance ballad about [COUPLE'S STORY], soft piano and strings, romantic male-female duet",
          "funny country song about [MUNDANE PROBLEM, e.g. losing the TV remote], exaggerated twang, storytelling verses",
          "hype anthem for [TEAM/EVENT NAME], stadium chant chorus, heavy drums, crowd energy",
          "lullaby for [CHILD'S NAME], gentle female humming, music box melody, very slow and soft",
        ],
      },
    ],
    tips: [
      "Keep style and lyrics separate: genre/mood/instruments in the style box, actual words in the lyrics box.",
      "Structure tags like [Verse], [Chorus], [Bridge], [Outro] strongly steer song shape — use them.",
      "Generate 3–4 takes of the same prompt and keep the best; variance between runs is big.",
      "Concrete beats abstract in lyrics: 'coffee going cold on the dashboard' outperforms 'feeling sad.'",
    ],
  },

  elevenlabs: {
    toolName: "ElevenLabs",
    toolSlug: "elevenlabs",
    title: "ElevenLabs Prompts & Voice Direction",
    description:
      "Copy-paste ElevenLabs scripts and voice-direction patterns for narration, ads, audiobooks, and character voices — plus settings that make AI voices sound human.",
    intro:
      "ElevenLabs quality depends on two things: how you write the script and how you set stability/similarity. These patterns cover both — punctuation is your directing tool.",
    sections: [
      {
        title: "Narration & Voiceover Scripts",
        prompts: [
          "Welcome to [CHANNEL/BRAND]. Today, we're exploring [TOPIC] — and by the end of this video, you'll know exactly how to [OUTCOME]. Let's dive in.",
          "Have you ever wondered why [QUESTION]? The answer is more surprising than you'd think... [PAUSE] It all starts with [TOPIC].",
          "Chapter [N]. [CHAPTER TITLE]. ... [FIRST PARAGRAPH OF CHAPTER — keep sentences under 20 words for natural pacing.]",
          "In this tutorial, we'll cover three things: first, [POINT 1]. Second, [POINT 2]. And finally, [POINT 3]. Let's start with the basics.",
        ],
      },
      {
        title: "Ads & Promos",
        prompts: [
          "Tired of [PAIN POINT]? Meet [PRODUCT] — the easiest way to [BENEFIT]. Try it free at [WEBSITE]. [PRODUCT]. [TAGLINE].",
          "This week only: [OFFER]. Don't miss it — visit [WEBSITE] today.",
          "[PRODUCT] helped over [NUMBER] people [ACHIEVE RESULT]. You could be next. Start free at [WEBSITE].",
        ],
      },
      {
        title: "Character & Emotion Direction",
        prompts: [
          "Write dialogue with emotional cues in the text itself: \"I can't believe it... we actually did it! We really, truly did it!\" — repetition and ellipses create excitement better than settings.",
          "For a calm, trustworthy tone: short declarative sentences. Periods, not exclamation marks. \"This is how it works. Step by step. No surprises.\"",
          "For suspense: trailing ellipses and em-dashes. \"Something was wrong... the door — the one I'd locked — stood open.\"",
        ],
      },
      {
        title: "Settings That Matter",
        prompts: [
          "Stability 40-50% + Similarity 75% = expressive narration (YouTube, stories). Stability 70%+ = consistent corporate/e-learning reads.",
          "Long audiobook? Generate chapter by chapter, same seed voice, and keep paragraphs under 800 characters per generation for consistency.",
          "Use speaker boost for quiet source voices; turn it off if the voice sounds compressed or artifacts appear.",
        ],
      },
    ],
    tips: [
      "Punctuation is direction: ellipses add pauses, dashes add drama, ALL CAPS adds emphasis (sparingly).",
      "Keep sentences under ~20 words — long clauses cause robotic pacing.",
      "Generate 2-3 takes; picking the best beats fiddling with settings endlessly.",
      "Spell out numbers, acronyms, and URLs the way you want them spoken (\"eleven labs dot io\").",
    ],
  },

  runway: {
    toolName: "Runway",
    toolSlug: "runway",
    title: "Runway Prompts for AI Video",
    description:
      "Copy-paste Runway Gen prompts for cinematic shots, product videos, camera moves, and stylized footage — structured for motion, not just imagery.",
    intro:
      "Runway rewards motion-first prompts: describe the camera move, the subject action, and the atmosphere — in that order. These patterns produce usable shots instead of pretty stills that barely move.",
    sections: [
      {
        title: "Cinematic Shots",
        prompts: [
          "slow dolly-in on [SUBJECT] standing in [LOCATION], shallow depth of field, golden hour backlight, cinematic 35mm, subtle atmospheric haze",
          "aerial drone shot flying over [LANDSCAPE], camera slowly tilting down, morning fog rolling through, epic scale",
          "handheld tracking shot following [SUBJECT] walking through [BUSY LOCATION], motion blur on crowd, documentary energy",
          "static wide shot of [SCENE], only [ONE ELEMENT] moving — wind in trees, flickering neon — everything else still, moody and quiet",
        ],
      },
      {
        title: "Product & Brand Video",
        prompts: [
          "360-degree orbit around [PRODUCT] floating on dark background, studio rim lighting, slow rotation, premium ad aesthetic",
          "macro close-up of [PRODUCT DETAIL], light sweeping across the surface, water droplets, ultra slow motion",
          "[PRODUCT] assembling itself from parts mid-air, clean white studio, satisfying precise motion, minimal shadows",
        ],
      },
      {
        title: "Camera Language That Works",
        prompts: [
          "Start prompts with the camera move: \"slow push-in\", \"orbit left\", \"crane up\", \"tracking shot\" — Gen models obey camera verbs better than adjectives.",
          "One subject action per clip: \"she turns toward camera\" works; three simultaneous actions collapse into mush.",
          "Add \"subtle motion\" or \"gentle camera drift\" to keep b-roll calm instead of warping.",
        ],
      },
      {
        title: "Stylized & Experimental",
        prompts: [
          "[SCENE] in the style of a 1980s VHS home video, tape grain, slight tracking errors, warm faded colors",
          "timelapse of [SUBJECT/SCENE] transforming from [STATE A] to [STATE B], clouds streaking overhead",
          "[SUBJECT] made of flowing liquid chrome, morphing slowly, black void background, studio reflections",
        ],
      },
    ],
    tips: [
      "Camera verb first, subject action second, style last — order changes results dramatically.",
      "Shorter prompts often move better; over-described scenes render as near-stills.",
      "Use image-to-video with a strong keyframe when you need brand-exact looks.",
      "Generate 4-second tests before spending credits on longer takes.",
    ],
  },

  "canva-ai": {
    toolName: "Canva AI",
    toolSlug: "canva-ai",
    title: "Canva AI Prompts (Magic Studio)",
    description:
      "Copy-paste prompts for Canva's Magic Design, Magic Write, and Magic Media — social posts, presentations, product images, and brand copy.",
    intro:
      "Canva's AI tools each want different prompting: Magic Design wants the deliverable + audience, Magic Media wants visual detail, Magic Write wants tone + format. Sorted accordingly.",
    sections: [
      {
        title: "Magic Media (Image Generation)",
        prompts: [
          "flat-lay photo of [PRODUCT/ITEMS] on pastel background, soft natural light, minimal props, Instagram aesthetic",
          "isometric 3D illustration of [CONCEPT], soft gradients, [BRAND COLOR] palette, clean tech-startup style",
          "watercolor illustration of [SUBJECT], loose brushstrokes, white background, gentle earthy tones",
          "photo of [PERSON TYPE] using [PRODUCT/SERVICE] in [SETTING], candid, bright airy lighting, lifestyle brand feel",
        ],
      },
      {
        title: "Magic Write (Copy)",
        prompts: [
          "Write 5 Instagram captions for [POST TOPIC] in a [PLAYFUL/PROFESSIONAL] voice, each under 125 characters, with one emoji and one hashtag.",
          "Write a 3-slide carousel script about [TOPIC]: hook slide, value slide, CTA slide. Max 20 words per slide.",
          "Turn these bullet points into a short brand story for our About page, warm and confident, 120 words: [PASTE BULLETS]",
          "Write 10 headline options for a [FLYER/BANNER] promoting [OFFER], max 8 words each, action-first.",
        ],
      },
      {
        title: "Magic Design & Presentations",
        prompts: [
          "A pitch deck for [BUSINESS] targeting [INVESTOR/CLIENT TYPE], modern minimal style in [BRAND COLORS]",
          "An Instagram story series (3 frames) announcing [EVENT/LAUNCH], bold typography, high contrast",
          "A one-page infographic explaining [PROCESS] in 4 steps, friendly icons, [COLOR] accent",
        ],
      },
    ],
    tips: [
      "Set your Brand Kit first — every AI output then inherits your fonts and colors automatically.",
      "For Magic Media, name a style (flat-lay, isometric, watercolor) — unstyled prompts return generic stock looks.",
      "Magic Write inside a design keeps text lengths fitting the template; use it there, not in a blank doc.",
      "Generate, then edit manually — Canva's strength is that AI output lands in a fully editable canvas.",
    ],
  },

  "leonardo-ai": {
    toolName: "Leonardo.ai",
    toolSlug: "leonardo-ai",
    title: "Leonardo.ai Prompts & Model Picks",
    description:
      "Copy-paste Leonardo.ai prompts for game assets, consistent characters, product shots, and concept art — with negative prompts and model guidance.",
    intro:
      "Leonardo's edge is control: model choice, Elements, and negative prompts. These patterns pair a strong positive prompt with the negative prompt that keeps results clean.",
    sections: [
      {
        title: "Game Assets & Icons",
        prompts: [
          "game icon of [ITEM: potion bottle/sword/shield], stylized hand-painted look, vibrant colors, centered, dark simple background, high detail — Negative: text, watermark, blurry, cropped",
          "isometric fantasy building, [TYPE: tavern/blacksmith/tower], warm window light, detailed stonework, game art style — Negative: people, text, photo-realism",
          "sprite sheet style, [CREATURE] in 4 poses, consistent design, flat lighting, white background — Negative: shadows, background scenery",
        ],
      },
      {
        title: "Consistent Characters",
        prompts: [
          "character reference sheet of [CHARACTER DESCRIPTION], front view and side view, neutral pose, flat lighting, plain background, concept art style — Negative: multiple characters, busy background",
          "portrait of [SAME CHARACTER DESCRIPTION], now [NEW POSE/EMOTION/SCENE] — reuse the exact same descriptor phrase every generation; consistency comes from repeated wording plus the same model and seed.",
        ],
      },
      {
        title: "Product & Marketing",
        prompts: [
          "commercial product photo of [PRODUCT], floating with dynamic splash of [LIQUID/ELEMENT], studio lighting, dark backdrop, advertising style — Negative: text, watermark, deformed",
          "[PRODUCT] on marble surface with soft morning window light, minimal styling, premium lifestyle aesthetic — Negative: clutter, oversaturation",
        ],
      },
      {
        title: "Concept Art & Environments",
        prompts: [
          "epic environment concept art, [SCENE DESCRIPTION], dramatic scale, volumetric light rays, matte painting quality — Negative: characters, text, frame",
          "moody interior of [LOCATION], cinematic lighting, detailed props telling a story, unreal engine render style — Negative: people, blur, distortion",
        ],
      },
    ],
    tips: [
      "Pick the model to match the job (Phoenix/photoreal vs stylized models) — the same prompt changes completely across models.",
      "Always fill the negative prompt: \"text, watermark, blurry, extra fingers, deformed\" fixes half of all bad outputs.",
      "For character consistency: identical descriptor phrase + same model + fixed seed.",
      "Use Elements sliders at low strength first — stacking them high overcooks the style.",
    ],
  },

  perplexity: {
    toolName: "Perplexity",
    toolSlug: "perplexity",
    title: "Perplexity Prompts for Research",
    description:
      "Copy-paste Perplexity prompts for deep research, buying decisions, fact-checking, and staying current — built around cited, source-backed answers.",
    intro:
      "Perplexity is a research engine, not a chatbot — the best prompts ask focused questions and demand sources, comparisons, and recency. These patterns get cited answers you can actually verify.",
    sections: [
      {
        title: "Deep Research",
        prompts: [
          "Give me a structured overview of [TOPIC]: current state, key players, main debates, and what changed in the last 12 months. Cite sources for each section.",
          "What does the peer-reviewed research actually say about [CLAIM/TOPIC]? Separate strong evidence from preliminary findings, with citations.",
          "Build a timeline of [EVENT/DEVELOPMENT] with dates and sources, then summarize the three most important turning points.",
          "Who are the leading experts/critics on [TOPIC] and what does each argue? One paragraph per person with a source.",
        ],
      },
      {
        title: "Buying & Comparison Research",
        prompts: [
          "Compare [PRODUCT A] vs [PRODUCT B] vs [PRODUCT C] on price, key features, and known problems, using reviews from the last 6 months. Table format, then a recommendation by use case.",
          "What are the most common complaints about [PRODUCT/SERVICE] in recent user reviews and forums? Group them by theme with sources.",
          "What's the best [PRODUCT CATEGORY] under [BUDGET] as of right now? Prioritize recent reviews and note anything about to be replaced by a newer model.",
        ],
      },
      {
        title: "Fact-Checking & Verification",
        prompts: [
          "Is this claim accurate: \"[PASTE CLAIM]\"? Rate it true/mostly true/misleading/false, explain the nuance, and cite primary sources.",
          "Find the original source of this statistic: \"[STAT]\". Who first published it, when, and is it still current?",
          "What do credible sources on different sides say about [CONTESTED TOPIC]? Present the strongest sourced version of each position.",
        ],
      },
      {
        title: "Staying Current",
        prompts: [
          "What happened in [INDUSTRY/TOPIC] this week? Top 5 developments, one sentence each, with sources, ranked by importance.",
          "Summarize the latest on [ONGOING STORY] as of today — what's confirmed, what's rumored, what's next.",
          "What new [TOOLS/PAPERS/PRODUCTS] in [FIELD] launched this month that are worth attention? One line on why each matters.",
        ],
      },
    ],
    tips: [
      "Ask one focused question per query — Perplexity's citations get vague when you bundle topics.",
      "Add \"from the last 6 months\" or \"as of this week\" to force recency.",
      "Click through to sources on anything important — synthesis is good, but verify before you cite.",
      "Use Focus modes (Academic, Reddit) to steer which sources it searches.",
    ],
  },
};

export const PROMPT_SLUGS = Object.keys(PROMPT_LIBS);
