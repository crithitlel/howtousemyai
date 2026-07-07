"use client";

import { useEffect, useState } from "react";

// Isolated so the periodic glitch flicker doesn't force the whole page to re-render.
export default function GlitchHeadline() {
  const [glitch, setGlitch] = useState(false);

  useEffect(() => {
    const id = setInterval(() => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 220);
    }, 4200);
    return () => clearInterval(id);
  }, []);

  return (
    <h1 className={`v2-display ${glitch ? "is-glitch" : ""}`} data-text="Find the right AI">
      Find the <span className="v2-display-blue">right AI</span><span className="v2-display-red">.</span>
    </h1>
  );
}
