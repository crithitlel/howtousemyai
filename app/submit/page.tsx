"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Logo from "../components/Logo";

const CATEGORIES = [
  "Writing", "Images", "Coding", "Video", "Music",
  "Research", "Productivity", "Marketing", "Analytics", "Presentations", "Support",
  "Design", "HR", "Finance",
];

export default function SubmitPage() {
  const router = useRouter();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    toolName: "",
    websiteUrl: "",
    category: "",
    description: "",
    email: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("https://formspree.io/f/mbdwnbqb", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ ...form, _replyto: form.email }),
    });
    setSubmitted(true);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-[#e4e6ea] px-6 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <a href="/" className="flex items-center gap-2 flex-shrink-0">
            <Logo size={24} />
            <span className="font-semibold text-[#1877F2] text-sm tracking-tight">HowToUseMyAI</span>
          </a>
          <a href="/" className="text-xs text-[#65676b] hover:text-[#1877F2] font-medium transition-colors whitespace-nowrap">← Back</a>
        </div>
      </header>

      <main className="flex-1 px-4 sm:px-6 py-14 bg-[#f7f8fa] flex items-start justify-center">
        <div className="w-full max-w-lg">
          {submitted ? (
            <div className="bg-white border border-[#e4e6ea] rounded-2xl p-10 text-center">
              <div className="w-12 h-12 rounded-full bg-[#E7F3FF] flex items-center justify-center mx-auto mb-4 text-2xl">
                🎉
              </div>
              <h2
                className="text-xl font-medium text-[#1877F2] mb-2"
                style={{ fontFamily: "var(--font-playfair), serif", fontStyle: "italic" }}
              >
                Thanks for your submission!
              </h2>
              <p className="text-xs text-[#65676b] mb-6 leading-relaxed">
                We&apos;ll review your tool and add it to the directory if it&apos;s a good fit. We&apos;ll be in touch!
              </p>
              <button
                onClick={() => router.push("/")}
                className="bg-[#1877F2] hover:bg-[#166FE5] text-white text-sm font-medium px-6 py-2.5 rounded-lg transition-colors"
              >
                Back to home
              </button>
            </div>
          ) : (
            <div className="bg-white border border-[#e4e6ea] rounded-2xl p-8">
              <h1
                className="text-2xl font-medium text-[#1877F2] mb-1 leading-snug"
                style={{ fontFamily: "var(--font-playfair), serif", fontStyle: "italic" }}
              >
                Submit a Tool
              </h1>
              <p className="text-xs text-[#65676b] mb-7">Know a great AI tool? Let us know and we&apos;ll add it to the directory.</p>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-[#1c1e21]">Tool Name</label>
                  <input
                    name="toolName"
                    type="text"
                    required
                    placeholder="e.g. ChatGPT"
                    value={form.toolName}
                    onChange={handleChange}
                    className="border border-[#dddfe2] rounded-lg px-3 py-2.5 text-sm text-[#1c1e21] placeholder-[#bcc0c4] focus:outline-none focus:border-[#1877F2] focus:ring-2 focus:ring-[#1877F2]/10 transition-all"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-[#1c1e21]">Website URL</label>
                  <input
                    name="websiteUrl"
                    type="url"
                    required
                    placeholder="https://example.com"
                    value={form.websiteUrl}
                    onChange={handleChange}
                    className="border border-[#dddfe2] rounded-lg px-3 py-2.5 text-sm text-[#1c1e21] placeholder-[#bcc0c4] focus:outline-none focus:border-[#1877F2] focus:ring-2 focus:ring-[#1877F2]/10 transition-all"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-[#1c1e21]">Category</label>
                  <select
                    name="category"
                    required
                    value={form.category}
                    onChange={handleChange}
                    className="border border-[#dddfe2] rounded-lg px-3 py-2.5 text-sm text-[#1c1e21] focus:outline-none focus:border-[#1877F2] focus:ring-2 focus:ring-[#1877F2]/10 transition-all bg-white"
                  >
                    <option value="" disabled>Select a category</option>
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-[#1c1e21]">Description</label>
                  <textarea
                    name="description"
                    required
                    rows={3}
                    placeholder="What does this tool do? Who is it best for?"
                    value={form.description}
                    onChange={handleChange}
                    className="border border-[#dddfe2] rounded-lg px-3 py-2.5 text-sm text-[#1c1e21] placeholder-[#bcc0c4] focus:outline-none focus:border-[#1877F2] focus:ring-2 focus:ring-[#1877F2]/10 transition-all resize-none"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-[#1c1e21]">Your Email</label>
                  <input
                    name="email"
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={handleChange}
                    className="border border-[#dddfe2] rounded-lg px-3 py-2.5 text-sm text-[#1c1e21] placeholder-[#bcc0c4] focus:outline-none focus:border-[#1877F2] focus:ring-2 focus:ring-[#1877F2]/10 transition-all"
                  />
                </div>

                <button
                  type="submit"
                  className="mt-2 bg-[#1877F2] hover:bg-[#166FE5] text-white text-sm font-semibold px-6 py-3 rounded-lg transition-colors"
                >
                  Submit Tool
                </button>
              </form>
            </div>
          )}
        </div>
      </main>

      <footer className="border-t border-[#e4e6ea] px-6 py-4 bg-white">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#65676b]">
          <div className="flex items-center gap-2">
            <Logo size={18} />
            <span className="font-medium text-[#1877F2]">HowToUseMyAI</span>
          </div>
          <p>© {new Date().getFullYear()} HowToUseMyAI</p>
          <div className="flex gap-5">
            <a href="/" className="hover:text-[#1877F2] transition-colors">Home</a>
            <a href="/privacy" className="hover:text-[#1877F2] transition-colors">Privacy</a>
            <a href="/terms" className="hover:text-[#1877F2] transition-colors">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
