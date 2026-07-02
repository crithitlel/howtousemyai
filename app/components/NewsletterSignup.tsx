"use client";

import { useState } from "react";

/**
 * Shared OPEN.CHANNEL newsletter capture panel. Reuses the v2-news styles from
 * globals.css so it matches the homepage transmission panel everywhere.
 * Posts to Formspree; success is only shown when the request actually lands.
 */
export default function NewsletterSignup({
  compact = false,
  secnum,
  className = "",
}: {
  compact?: boolean;
  secnum?: string;
  className?: string;
}) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "busy" | "done" | "error">("idle");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || state === "busy") return;
    setState("busy");
    try {
      const res = await fetch("https://formspree.io/f/mbdwnbqb", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ email, _subject: "New subscriber" }),
      });
      setState(res.ok ? "done" : "error");
    } catch {
      setState("error");
    }
  };

  return (
    <div className={`v2-frame v2-news${compact ? " v2-news-compact" : ""} ${className}`}>
      <i className="v2-cb v2-cb-tl" /><i className="v2-cb v2-cb-tr" />
      <i className="v2-cb v2-cb-bl" /><i className="v2-cb v2-cb-br" />
      {secnum && <span className="v2-secnum v2-secnum-on-dark">{secnum}</span>}
      <h2 className="v2-news-title">OPEN<span className="v2-tred">.</span>CHANNEL</h2>
      <p className="v2-news-lead">// WEEKLY TRANSMISSION · THE BEST NEW AI TOOLS, DECRYPTED · ZERO NOISE</p>
      {state === "done" ? (
        <p className="v2-news-done"><i className="v2-dot v2-dot-ok" />CHANNEL OPEN — CHECK YOUR INBOX</p>
      ) : (
        <>
          <form className="v2-news-form" onSubmit={submit}>
            <span className="v2-news-pre">▸</span>
            <input
              type="email"
              required
              placeholder="ENTER FREQUENCY // you@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={state === "busy"}
            />
            <button type="submit" disabled={state === "busy"}>
              {state === "busy" ? "SENDING…" : "TRANSMIT"}
            </button>
          </form>
          {state === "error" && (
            <p className="v2-news-err">// TRANSMISSION FAILED — CHECK CONNECTION AND RETRY</p>
          )}
        </>
      )}
    </div>
  );
}
