"use client";

import { useEffect, useState } from "react";

// Isolated so its 1/sec tick doesn't force the whole page to re-render.
export default function LiveClock() {
  const [clock, setClock] = useState("--:--:--");

  useEffect(() => {
    const fmt = () => {
      setClock(
        new Date().toLocaleTimeString("en-US", {
          timeZone: "America/New_York",
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    };
    fmt();
    const id = setInterval(fmt, 1000);
    return () => clearInterval(id);
  }, []);

  return <span className="v2-stat v2-mono">{clock} ET</span>;
}
