"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { TOOLS, slugify, type Tool } from "@/lib/tools";
import { usePins } from "@/lib/useToolStore";

export default function PinnedStrip() {
  const { pins, toggle } = usePins();
  const router = useRouter();

  const tools = useMemo(
    () => pins.map((n) => TOOLS.find((t) => t.name === n)).filter(Boolean) as Tool[],
    [pins]
  );

  if (tools.length === 0) return null;

  return (
    <div className="v2-pinned" role="region" aria-label="Pinned nodes">
      <span className="v2-pinned-tag">
        <i className="v2-pinned-star">★</i> PINNED NODES
        <em>{tools.length}</em>
      </span>
      <div className="v2-pinned-rail">
        {tools.map((t) => (
          <span key={t.name} className="v2-pinned-chip" onClick={() => router.push(`/tools/${slugify(t.name)}`)}>
            <span className="v2-pinned-ico">{t.icon}</span>
            <span className="v2-pinned-name">{t.name}</span>
            <button
              className="v2-pinned-x"
              onClick={(e) => { e.stopPropagation(); toggle(t.name); }}
              aria-label={`Unpin ${t.name}`}
            >✕</button>
          </span>
        ))}
      </div>
    </div>
  );
}
