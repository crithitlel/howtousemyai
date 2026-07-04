"use client";

import { useState } from "react";

/* One-click copy for a prompt string. Shows brief COPIED feedback. */
export default function CopyPromptButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      // Structure templates store newlines as literal \n — restore them.
      await navigator.clipboard.writeText(text.replace(/\\n/g, "\n"));
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      /* clipboard unavailable — no-op */
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      className={`v2-copybtn${copied ? " is-copied" : ""}`}
      aria-label="Copy prompt"
    >
      {copied ? "COPIED ✓" : "COPY"}
    </button>
  );
}
