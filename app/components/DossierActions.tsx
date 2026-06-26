"use client";

import { usePins, useCompare, MAX_COMPARE } from "@/lib/useToolStore";

export default function DossierActions({ name }: { name: string }) {
  const { isPinned, toggle: togglePin } = usePins();
  const { inCompare, toggle: toggleCompare, isFull } = useCompare();
  const pinned = isPinned(name);
  const comparing = inCompare(name);

  return (
    <div className="dossier-actions">
      <button
        type="button"
        className={`dossier-act ${pinned ? "is-on" : ""}`}
        onClick={() => togglePin(name)}
      >
        <span className="dossier-act-ico">{pinned ? "★" : "☆"}</span>
        {pinned ? "PINNED" : "PIN NODE"}
      </button>
      <button
        type="button"
        className={`dossier-act ${comparing ? "is-on" : ""}`}
        onClick={() => toggleCompare(name)}
        disabled={!comparing && isFull}
        title={!comparing && isFull ? `Compare is full (${MAX_COMPARE} max)` : undefined}
      >
        <span className="dossier-act-ico">⇄</span>
        {comparing ? "IN COMPARE" : "ADD TO COMPARE"}
      </button>
    </div>
  );
}
