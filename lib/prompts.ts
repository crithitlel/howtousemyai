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
};

export const PROMPT_SLUGS = Object.keys(PROMPT_LIBS);
