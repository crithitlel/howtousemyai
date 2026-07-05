// AI GLOSSARY — plain-English definitions of terms people search for
// when they hit jargon in AI tool docs or articles. Each entry links to
// tools on the site that put the concept into practice.
//
// This is unclaimed content territory: directories list tools, nobody
// explains the vocabulary. Keep definitions short, concrete, and free
// of circular jargon (don't define "token" using the word "tokenize").

export interface GlossaryTerm {
  slug: string;
  term: string;
  shortDef: string; // one sentence, shown on the index and in previews
  definition: string; // 2-4 sentences, plain English
  whyItMatters: string; // why a non-technical reader should care
  example?: string; // concrete example, optional
  relatedTools: string[]; // tool names — must match lib/tools.ts
  relatedTerms: string[]; // other glossary slugs
  category: "Core Concepts" | "How AI Writes & Talks" | "How AI Sees & Creates" | "Using AI Tools";
}

export const GLOSSARY: GlossaryTerm[] = [
  {
    slug: "llm",
    term: "LLM (Large Language Model)",
    shortDef: "The type of AI that powers ChatGPT, Claude, and Gemini — trained on huge amounts of text to predict and generate language.",
    definition: "An LLM is a computer program trained on enormous amounts of text (books, websites, code) to recognize patterns in language. Once trained, it can write, answer questions, summarize, and reason about topics by predicting what text should come next, one piece at a time.",
    whyItMatters: "Almost every AI chatbot or writing tool you use is 'an LLM' under the hood — knowing this term helps you understand what these tools actually are and why they sometimes get things confidently wrong.",
    example: "ChatGPT, Claude, and Gemini are all products built around an LLM.",
    relatedTools: ["ChatGPT", "Claude", "Gemini"],
    relatedTerms: ["token", "hallucination", "context-window"],
    category: "Core Concepts",
  },
  {
    slug: "token",
    term: "Token",
    shortDef: "A chunk of text (roughly ¾ of a word) that AI models read and generate one piece at a time.",
    definition: "AI language models don't see whole words — they break text into tokens, small chunks that might be a whole word, part of a word, or punctuation. A rough rule of thumb: 100 tokens ≈ 75 words in English.",
    whyItMatters: "Tokens are how AI companies measure usage and set pricing — 'pay per token' is the actual billing unit behind most AI APIs, and context limits are measured in tokens, not words or pages.",
    example: "The sentence 'AI tools are useful' is about 5 tokens.",
    relatedTools: ["ChatGPT", "Claude"],
    relatedTerms: ["context-window", "llm"],
    category: "Core Concepts",
  },
  {
    slug: "context-window",
    term: "Context Window",
    shortDef: "The maximum amount of text an AI model can 'see' and remember at once during a conversation.",
    definition: "The context window is the model's short-term memory — measured in tokens, it's the total amount of your conversation (your messages plus its replies plus any pasted documents) the model can consider at one time. Once you exceed it, the oldest parts get dropped or the model starts to forget them.",
    whyItMatters: "If you're pasting a long document and the AI 'forgets' the beginning, you've likely hit the context window limit — this is why some tools handle huge files better than others.",
    example: "Claude's largest models support context windows of 200,000+ tokens, enough for a very long document.",
    relatedTools: ["Claude", "Gemini"],
    relatedTerms: ["token", "llm"],
    category: "Core Concepts",
  },
  {
    slug: "hallucination",
    term: "Hallucination",
    shortDef: "When an AI confidently states something false or made-up as if it were fact.",
    definition: "A hallucination is when an AI model generates information that sounds plausible and is stated with total confidence, but is actually wrong, fabricated, or not grounded in any real source — like a fake citation, an invented statistic, or a nonexistent API function.",
    whyItMatters: "This is the single biggest reason to fact-check AI output before relying on it, especially for anything factual, legal, medical, or citation-based.",
    example: "Asking an AI for a legal case citation and getting one that sounds real but doesn't actually exist.",
    relatedTools: ["Perplexity", "Claude"],
    relatedTerms: ["llm", "rag"],
    category: "Core Concepts",
  },
  {
    slug: "rag",
    term: "RAG (Retrieval-Augmented Generation)",
    shortDef: "A technique where an AI looks up real documents or sources before answering, instead of relying only on what it memorized during training.",
    definition: "RAG combines an AI model with a search step: instead of answering purely from memory, the system first retrieves relevant, up-to-date documents or web pages, then generates an answer grounded in that retrieved content — often with citations.",
    whyItMatters: "RAG is why some AI tools can cite sources and stay current on recent events, while a plain chatbot can only draw on what it learned during training (which has a cutoff date).",
    example: "Perplexity uses RAG to answer questions with live, cited web sources instead of relying only on trained-in knowledge.",
    relatedTools: ["Perplexity", "You.com"],
    relatedTerms: ["hallucination", "llm"],
    category: "Core Concepts",
  },
  {
    slug: "fine-tuning",
    term: "Fine-Tuning",
    shortDef: "Further training an existing AI model on a specific, narrower dataset to specialize it for a particular task or style.",
    definition: "Instead of building a model from scratch, fine-tuning takes an already-trained general model and trains it a bit more on a focused dataset — customer support transcripts, legal documents, a company's brand voice — so its output better matches that specific use case.",
    whyItMatters: "This is how companies build specialized AI products (like a legal-research assistant) without training a whole new model, and it's why some tools sound more 'on-brand' than generic chatbots.",
    example: "A company might fine-tune a model on its own support tickets so it answers in the company's tone and knows its product details.",
    relatedTools: ["Mistral AI"],
    relatedTerms: ["llm", "prompt-engineering"],
    category: "Core Concepts",
  },
  {
    slug: "prompt-engineering",
    term: "Prompt Engineering",
    shortDef: "The skill of writing instructions to an AI model that reliably get the output you actually want.",
    definition: "Prompt engineering is the practice of structuring your request — providing context, examples, format instructions, and constraints — so an AI model's response is accurate, well-formatted, and useful on the first try instead of requiring many rounds of back-and-forth.",
    whyItMatters: "The same AI model can produce dramatically different quality output depending on how the question is asked — this is the single highest-leverage skill for getting good results from any AI tool.",
    example: "Asking 'write a blog post' vs. 'write a 500-word blog post for beginner gardeners, friendly tone, with 3 subheadings' produces very different quality.",
    relatedTools: ["ChatGPT", "Claude", "Midjourney"],
    relatedTerms: ["zero-shot", "temperature"],
    category: "Using AI Tools",
  },
  {
    slug: "zero-shot",
    term: "Zero-Shot / Few-Shot",
    shortDef: "Whether you give an AI zero examples (zero-shot) or a few examples (few-shot) of what you want before asking it to do the task.",
    definition: "Zero-shot means asking an AI to do a task with no examples, relying purely on its training. Few-shot means showing it 2-3 examples of the input/output pattern you want first, which usually improves accuracy and consistency for specific formats.",
    whyItMatters: "If an AI keeps getting your desired format wrong, showing it 2-3 examples (few-shot) instead of just describing what you want (zero-shot) is often the fastest fix.",
    example: "Zero-shot: 'Summarize this article.' Few-shot: 'Here are 2 examples of the summary style I want: [examples]. Now summarize this article the same way.'",
    relatedTools: ["ChatGPT", "Claude"],
    relatedTerms: ["prompt-engineering"],
    category: "Using AI Tools",
  },
  {
    slug: "temperature",
    term: "Temperature",
    shortDef: "A setting that controls how random or predictable an AI's responses are — low is focused, high is creative and varied.",
    definition: "Temperature is a number (usually 0 to 1 or 0 to 2) that controls randomness in an AI model's output. Low temperature makes responses more focused, consistent, and predictable; high temperature makes them more varied, surprising, and creative — at the cost of consistency.",
    whyItMatters: "If you need consistent, factual answers (like data extraction), you want low temperature; if you want creative brainstorming or varied writing, higher temperature helps.",
    example: "Temperature 0 for a customer-support bot giving consistent answers; temperature 0.9 for brainstorming creative story ideas.",
    relatedTools: ["ChatGPT", "Claude"],
    relatedTerms: ["prompt-engineering"],
    category: "Using AI Tools",
  },
  {
    slug: "embeddings",
    term: "Embeddings",
    shortDef: "A way of converting text (or images) into numbers that capture their meaning, so a computer can compare how similar two pieces of content are.",
    definition: "An embedding turns a word, sentence, or document into a list of numbers (a vector) positioned in a mathematical space where similar meanings end up close together. This lets software compare meaning mathematically instead of just matching exact keywords.",
    whyItMatters: "Embeddings are the technology behind 'search by meaning' features and RAG systems — they're why an AI search tool can find a relevant document even if it doesn't share your exact search words.",
    example: "Searching 'cheap flights' and getting results for 'budget airfare' because their embeddings are mathematically close in meaning.",
    relatedTools: ["Perplexity"],
    relatedTerms: ["rag"],
    category: "Core Concepts",
  },
  {
    slug: "multimodal",
    term: "Multimodal AI",
    shortDef: "AI that can understand and work with more than one type of input — text, images, audio, or video — not just text.",
    definition: "A multimodal AI model can process and reason across multiple types of content in the same conversation: reading an image and answering questions about it, listening to audio, or generating an image from a text description, rather than being limited to text-only input and output.",
    whyItMatters: "This is why you can now upload a photo or screenshot to a chatbot and ask about it, or generate an image from a written description — capabilities that older, text-only AI models didn't have.",
    example: "Uploading a photo of a broken appliance and asking Gemini or ChatGPT what the problem might be.",
    relatedTools: ["Gemini", "ChatGPT"],
    relatedTerms: ["llm"],
    category: "Core Concepts",
  },
  {
    slug: "ai-agent",
    term: "AI Agent",
    shortDef: "An AI system that can take multiple steps and use tools on its own to complete a task, rather than just answering one question at a time.",
    definition: "An AI agent doesn't just respond to a single prompt — it can break a goal into steps, decide what actions to take (like searching the web, running code, or calling an API), and keep working through a task with limited human input at each step.",
    whyItMatters: "Agents are the shift from 'AI that answers questions' to 'AI that completes tasks' — understanding this term helps you evaluate tools that claim to 'automate' work versus ones that just chat.",
    example: "An AI coding agent that reads a bug report, finds the relevant file, writes a fix, and runs the tests — without being told each individual step.",
    relatedTools: ["Devin", "Aider"],
    relatedTerms: ["llm"],
    category: "Core Concepts",
  },
  {
    slug: "diffusion-model",
    term: "Diffusion Model",
    shortDef: "The technique behind most AI image generators — it starts with random noise and gradually refines it into a coherent image matching your prompt.",
    definition: "A diffusion model generates images by starting with pure visual noise (like TV static) and running many steps that gradually remove the noise in a way guided by your text prompt, until a coherent image emerges.",
    whyItMatters: "This is the core technology behind Midjourney, DALL·E, and Stable Diffusion — knowing it exists helps explain why image generators sometimes produce strange artifacts (the 'denoising' process going slightly wrong).",
    example: "Midjourney and Stable Diffusion are both built on diffusion models.",
    relatedTools: ["Midjourney", "Stable Diffusion"],
    relatedTerms: ["multimodal"],
    category: "How AI Sees & Creates",
  },
  {
    slug: "upscaling",
    term: "Upscaling",
    shortDef: "Using AI to increase an image's resolution, adding believable detail rather than just stretching it.",
    definition: "AI upscaling takes a lower-resolution image and generates a larger version, using a trained model to intelligently add texture and detail rather than simply stretching pixels (which causes blur). Good upscalers can turn a small, blurry photo into a sharp, high-resolution one.",
    whyItMatters: "This is how you can take an AI-generated or old low-res image and prepare it for print or a large display without it looking blurry or pixelated.",
    example: "Taking a 512x512 AI-generated image and upscaling it to 4K for print use.",
    relatedTools: ["Leonardo.ai", "Clipdrop"],
    relatedTerms: ["diffusion-model"],
    category: "How AI Sees & Creates",
  },
  {
    slug: "text-to-speech",
    term: "Text-to-Speech (TTS)",
    shortDef: "AI that converts written text into natural-sounding spoken audio.",
    definition: "Text-to-speech technology takes written text and generates spoken audio — modern AI-based TTS produces voices that sound remarkably human, with natural pacing, emotion, and intonation, rather than the robotic voices of older systems.",
    whyItMatters: "This is what lets you turn a script into a professional-sounding voiceover without hiring a voice actor or recording yourself.",
    example: "ElevenLabs converts a written script into a natural-sounding narrated voiceover for a video.",
    relatedTools: ["ElevenLabs", "Murf"],
    relatedTerms: ["voice-cloning"],
    category: "How AI Sees & Creates",
  },
  {
    slug: "voice-cloning",
    term: "Voice Cloning",
    shortDef: "AI that recreates a specific person's voice from a short audio sample, so it can generate new speech in that voice.",
    definition: "Voice cloning trains an AI model on a sample of someone's real voice, then uses that model to generate entirely new speech — words the person never actually said — in a voice that sounds like them.",
    whyItMatters: "This raises real consent and misuse concerns — only clone voices you have explicit permission to use, and know that many tools require verification for this reason.",
    example: "A podcaster clones their own voice to fix a flubbed word without re-recording the whole episode.",
    relatedTools: ["ElevenLabs"],
    relatedTerms: ["text-to-speech"],
    category: "How AI Sees & Creates",
  },
  {
    slug: "system-prompt",
    term: "System Prompt",
    shortDef: "Hidden background instructions that set an AI's behavior, tone, and rules before you type anything.",
    definition: "A system prompt is a set of instructions given to an AI model behind the scenes — before your conversation starts — that shapes how it should behave, what persona it should take, and what it should or shouldn't do, separate from your actual messages.",
    whyItMatters: "This is why the same underlying AI model can feel very different across products — a coding assistant and a customer-support bot might use the same base model with very different system prompts.",
    example: "A company's support chatbot might have a system prompt saying 'Only answer questions about our product, always be polite, never give legal advice.'",
    relatedTools: ["ChatGPT", "Claude"],
    relatedTerms: ["prompt-engineering"],
    category: "Using AI Tools",
  },
  {
    slug: "api",
    term: "API (Application Programming Interface)",
    shortDef: "A way for developers to plug an AI model directly into their own app or website, instead of using the AI company's chat interface.",
    definition: "An API lets a developer send requests to an AI model programmatically from their own software and get responses back, which they can then build into their own product — a chatbot, a writing tool, an automation — without users ever visiting the AI company's own website.",
    whyItMatters: "Many AI tools you use are actually built on top of someone else's AI model via API — this is why you'll see 'powered by GPT-4' or similar credits inside other products.",
    example: "A customer support tool might use OpenAI's API behind the scenes to power its chatbot, with its own interface on top.",
    relatedTools: ["ChatGPT", "Claude", "Mistral AI"],
    relatedTerms: ["llm"],
    category: "Using AI Tools",
  },
];

export const GLOSSARY_SLUGS = GLOSSARY.map((g) => g.slug);

export function glossaryBySlug(slug: string): GlossaryTerm | undefined {
  return GLOSSARY.find((g) => g.slug === slug);
}

export const GLOSSARY_CATEGORIES = Array.from(new Set(GLOSSARY.map((g) => g.category)));
