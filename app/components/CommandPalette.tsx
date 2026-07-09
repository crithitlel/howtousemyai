"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { TOOLS, slugify } from "@/lib/tools";
import { searchTools } from "@/lib/search";
import { usePins } from "@/lib/useToolStore";

type Item = {
  kind: "tool" | "page";
  label: string;
  sub: string;
  icon: string;
  href: string;
  keywords: string;
};

const PAGES: Item[] = [
  { kind: "page", label: "All AI Tools", sub: "Directory", icon: "▦", href: "/tools", keywords: "tools directory all browse index" },
  { kind: "page", label: "AI Workflows", sub: "Playbooks", icon: "◆", href: "/workflows", keywords: "workflow workflows playbook multi tool chain blog video podcast campaign pitch deck app" },
  { kind: "page", label: "Best AI by Use Case", sub: "Sectors", icon: "◎", href: "/best-ai-for", keywords: "use case category best for writing coding" },
  { kind: "page", label: "Comparisons", sub: "Versus", icon: "⇄", href: "/compare", keywords: "compare vs versus matchup" },
  { kind: "page", label: "Free AI Tools", sub: "No cost", icon: "✦", href: "/free", keywords: "free no cost zero" },
  { kind: "page", label: "Recommend a Tool", sub: "Match engine", icon: "➤", href: "/recommend", keywords: "recommend match suggest find help" },
  { kind: "page", label: "Submit a Tool", sub: "Contribute", icon: "+", href: "/submit", keywords: "submit add contribute new tool" },
];

const TOOL_ITEMS: Item[] = TOOLS.map((t) => ({
  kind: "tool",
  label: t.name,
  sub: `${t.category} · ${t.pricing}`,
  icon: t.icon,
  href: `/tools/${slugify(t.name)}`,
  keywords: `${t.name} ${t.category} ${t.pricing} ${t.description}`.toLowerCase(),
}));

const ALL = [...PAGES, ...TOOL_ITEMS];
const TOOL_BY_NAME = new Map(TOOL_ITEMS.map((t) => [t.label, t]));

// Controlled body: mounted only while open. The hotkey listener lives in
// CommandPaletteLauncher so this module (which pulls in the full TOOLS list
// and search engine) is code-split out of every page's initial bundle and
// only downloads on first ⌘K.
export default function CommandPalette({ onClose }: { onClose: () => void }) {
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const { pins } = usePins();

  const pinnedItems = useMemo(
    () => pins.map((n) => TOOL_BY_NAME.get(n)).filter(Boolean) as Item[],
    [pins]
  );

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) {
      const featured = TOOL_ITEMS.filter((t) => TOOLS.find((x) => x.name === t.label)?.isFeatured && !pins.includes(t.label));
      return [...pinnedItems, ...PAGES, ...featured].slice(0, 10);
    }
    // Pages: simple name/keyword match. Tools: intent-aware engine (synonyms,
    // capabilities, use-cases) so "photo editor" / "free chatgpt alternative" resolve.
    const pageHits = PAGES.filter((p) => p.label.toLowerCase().includes(term) || p.keywords.includes(term));
    const toolHits = searchTools(term, 12).map((t) => TOOL_BY_NAME.get(t.name)).filter(Boolean) as Item[];
    return [...pageHits, ...toolHits].slice(0, 12);
  }, [q, pins, pinnedItems]);

  const close = useCallback(() => {
    setQ("");
    setActive(0);
    onClose();
  }, [onClose]);

  const go = useCallback(
    (it: Item | undefined) => {
      if (!it) return;
      close();
      router.push(it.href);
    },
    [close, router]
  );

  // focus input + lock scroll while mounted (mounted ⇔ open)
  useEffect(() => {
    document.body.style.overflow = "hidden";
    const t = setTimeout(() => inputRef.current?.focus(), 30);
    return () => {
      clearTimeout(t);
      document.body.style.overflow = "";
    };
  }, []);

  // reset active on query change
  useEffect(() => setActive(0), [q]);

  // keep active item in view
  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>(`[data-idx="${active}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [active]);

  const onInputKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      go(results[active]);
    }
  };

  return (
    <div className="cmdk-overlay" onClick={close} role="dialog" aria-modal="true" aria-label="Command palette">
      <div className="cmdk-panel" onClick={(e) => e.stopPropagation()}>
        <div className="cmdk-corner cmdk-corner-tl" />
        <div className="cmdk-corner cmdk-corner-tr" />
        <div className="cmdk-corner cmdk-corner-bl" />
        <div className="cmdk-corner cmdk-corner-br" />

        <div className="cmdk-head">
          <span className="cmdk-prompt">{">"}</span>
          <input
            ref={inputRef}
            className="cmdk-input"
            placeholder="SEARCH NODES · JUMP TO SECTOR…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={onInputKey}
            spellCheck={false}
            autoComplete="off"
          />
          <kbd className="cmdk-esc">ESC</kbd>
        </div>

        <div className="cmdk-list" ref={listRef}>
          {results.length === 0 && (
            <div className="cmdk-empty">NO SIGNAL · NO MATCHING NODE</div>
          )}
          {results.map((it, i) => (
            <button
              key={it.href}
              data-idx={i}
              className={`cmdk-row ${i === active ? "is-active" : ""}`}
              onMouseEnter={() => setActive(i)}
              onClick={() => go(it)}
            >
              <span className="cmdk-ico">{it.icon}</span>
              <span className="cmdk-label">{it.label}</span>
              <span className="cmdk-sub">{it.sub}</span>
              {it.kind === "tool" && pins.includes(it.label) && <span className="cmdk-pinmark">★</span>}
              <span className="cmdk-tag">{it.kind === "page" ? "PAGE" : "NODE"}</span>
            </button>
          ))}
        </div>

        <div className="cmdk-foot">
          <span><kbd>↑</kbd><kbd>↓</kbd> NAVIGATE</span>
          <span><kbd>↵</kbd> OPEN</span>
          <span><kbd>ESC</kbd> CLOSE</span>
          <span className="cmdk-foot-r">{results.length} RESULTS</span>
        </div>
      </div>
    </div>
  );
}
