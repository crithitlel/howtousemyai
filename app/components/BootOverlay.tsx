"use client";

import { useEffect, useState } from "react";

/**
 * 2Advanced-style boot/preloader. Shows once per browser session,
 * auto-dismisses after ~1.5s, click anywhere to skip.
 */
export default function BootOverlay() {
  const [show, setShow] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("htumai-booted")) return;
    sessionStorage.setItem("htumai-booted", "1");
    setShow(true);
    const t1 = setTimeout(() => setDone(true), 1500);
    const t2 = setTimeout(() => setShow(false), 2000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  if (!show) return null;

  const dismiss = () => {
    setDone(true);
    setTimeout(() => setShow(false), 450);
  };

  return (
    <div
      className={`boot-overlay ${done ? "boot-done" : ""}`}
      onClick={dismiss}
      role="presentation"
    >
      <div className="boot-lines">
        <div>SYS//AI.DIRECTORY <span className="dim">v3.0</span></div>
        <div className="dim">INDEXING TOOLS<span className="boot-ell" /></div>
        <div className="dim">CALIBRATING INTERFACE<span className="boot-ell" /></div>
      </div>
      <div className="boot-bar" />
      <div className="boot-skip">[ CLICK TO ENTER ]</div>
    </div>
  );
}
