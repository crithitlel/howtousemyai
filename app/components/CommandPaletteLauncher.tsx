"use client";

import { useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";

// The palette body imports the full TOOLS list + search engine (~50-60KB of
// JS), so it's dynamically imported and only fetched on the first open. This
// launcher is the only piece in every page's initial bundle: two listeners
// and a boolean.
const CommandPalette = dynamic(() => import("./CommandPalette"), { ssr: false });

export default function CommandPaletteLauncher() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener("open-cmdk", onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("open-cmdk", onOpen);
    };
  }, []);

  const close = useCallback(() => setOpen(false), []);

  if (!open) return null;
  return <CommandPalette onClose={close} />;
}
