"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";

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
  // Spam traps: honeypot field + page-load timestamp
  const [honeypot, setHoneypot] = useState("");
  const loadedAt = useRef(Date.now());

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Bot checks: honeypot filled, or submitted under 3s after page load.
    if (honeypot || Date.now() - loadedAt.current < 3000) {
      setSubmitted(true);
      return;
    }
    await fetch("https://formspree.io/f/mbdwnbqb", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ ...form, _replyto: form.email }),
    });
    setSubmitted(true);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />

      <main className="v2-page">
        <div className="v2-pagehead">
          <div className="v2-crumb">
            <Link href="/">HOME</Link>
            <i>//</i>
            <span className="v2-crumb-cur">SUBMIT</span>
          </div>
          <h1 className="v2-pagetitle">DEPLOY<span className="v2-tred">.</span>NODE</h1>
          <p className="v2-pagelead">
            Know a great AI tool? Transmit it for review — we read every submission and add the strongest to the registry.
          </p>
        </div>

        <div className="v2-formwrap">
          {submitted ? (
            <div className="v2-panel" style={{ padding: 40, textAlign: "center", marginTop: 30 }}>
              <i className="v2-cb v2-cb-tl" /><i className="v2-cb v2-cb-tr" /><i className="v2-cb v2-cb-bl" /><i className="v2-cb v2-cb-br" />
              <p className="v2-seclabel" style={{ margin: "0 0 10px", color: "var(--v2-blue-bright)" }}>TRANSMISSION RECEIVED</p>
              <h2 className="display-head text-xl font-semibold text-[#e9eef8] mb-2">Thanks for your submission</h2>
              <p className="text-xs text-[#93a4c3] mb-6 leading-relaxed">
                We&apos;ll review your tool and add it to the directory if it&apos;s a good fit. We&apos;ll be in touch.
              </p>
              <button onClick={() => router.push("/")} className="v2-ctabtn" style={{ border: 0, cursor: "pointer" }}>
                ↩ RETURN TO MAINFRAME
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="v2-form">
              {/* Honeypot — hidden from humans, bots fill it in */}
              <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", top: "auto", width: "1px", height: "1px", overflow: "hidden" }}>
                <label htmlFor="company_website">Company Website</label>
                <input id="company_website" name="company_website" type="text" tabIndex={-1} autoComplete="off"
                  value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
              </div>

              <div className="v2-field">
                <label className="v2-label">Tool Name</label>
                <input className="v2-input" name="toolName" type="text" required placeholder="e.g. ChatGPT"
                  value={form.toolName} onChange={handleChange} />
              </div>

              <div className="v2-field">
                <label className="v2-label">Website URL</label>
                <input className="v2-input" name="websiteUrl" type="url" required placeholder="https://example.com"
                  value={form.websiteUrl} onChange={handleChange} />
              </div>

              <div className="v2-field">
                <label className="v2-label">Category</label>
                <select className="v2-select" name="category" required value={form.category} onChange={handleChange}>
                  <option value="" disabled>Select a category</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="v2-field">
                <label className="v2-label">Description</label>
                <textarea className="v2-textarea" name="description" required rows={3}
                  placeholder="What does this tool do? Who is it best for?"
                  value={form.description} onChange={handleChange} />
              </div>

              <div className="v2-field">
                <label className="v2-label">Your Email</label>
                <input className="v2-input" name="email" type="email" required placeholder="you@example.com"
                  value={form.email} onChange={handleChange} />
              </div>

              <button type="submit" className="v2-submit">▸ TRANSMIT SUBMISSION</button>
            </form>
          )}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
