"use client";

// Tiny island: the ⌘K button in headers. Kept separate so server-rendered
// headers/pages don't need a client boundary for one onClick.
export default function CmdkTrigger() {
  return (
    <button
      type="button"
      className="v2-cmdk-trigger"
      onClick={() => window.dispatchEvent(new Event("open-cmdk"))}
      aria-label="Open command palette"
    >
      <span className="v2-cmdk-ico">⌘</span>K<span className="v2-cmdk-txt">SEARCH</span>
    </button>
  );
}
