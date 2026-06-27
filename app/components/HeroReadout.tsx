"use client";

import { TOOLS } from "@/lib/tools";

const NODES = TOOLS.length;
const SECTORS = new Set(TOOLS.map((t) => t.category)).size;
const FREE = TOOLS.filter((t) => t.pricing !== "Paid").length;

export default function HeroReadout() {
  // Quiet trust line under the search. Static numbers (no count-up — the ticking
  // pulled the eye and made it pop), one muted row, tools + free lead. A single
  // subtle ping keeps the command-center feel without shouting.
  return (
    <div className="v2-readout" aria-hidden="true">
      <span className="v2-ping" />
      <span className="v2-readout-line">
        <b>{NODES}</b> tools
        <i className="v2-readout-dot" />
        <b>{FREE}</b> free to try
        <i className="v2-readout-dot" />
        <b>{SECTORS}</b> categories
      </span>
    </div>
  );
}
