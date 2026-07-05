"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { PRICED_TOOLS } from "@/lib/pricing";

/* Stack Cost Calculator — pick tools, see an estimated monthly total.
   Prices are approximate starting figures, not live data — every row
   links to the tool's real pricing page for verification. */
export default function CostCalculator() {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const toggle = (name: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  const total = useMemo(
    () => PRICED_TOOLS.filter((t) => selected.has(t.name)).reduce((sum, t) => sum + t.monthlyUSD, 0),
    [selected]
  );

  return (
    <div>
      <div className="v2-calc-grid">
        {PRICED_TOOLS.map((t) => {
          const active = selected.has(t.name);
          return (
            <button
              key={t.name}
              type="button"
              onClick={() => toggle(t.name)}
              className={`v2-calc-item v2-panel${active ? " is-active" : ""}`}
              aria-pressed={active}
            >
              <span className="v2-calc-name">{t.name}</span>
              <span className="v2-calc-price">${t.monthlyUSD}<em>/mo</em></span>
            </button>
          );
        })}
      </div>

      <div className="v2-calc-total v2-panel">
        <div>
          <span className="v2-cell-id">ESTIMATED MONTHLY TOTAL</span>
          <div className="v2-calc-totalnum">${total}<em>/mo</em></div>
          <span className="v2-calc-totalsub">{selected.size} tool{selected.size === 1 ? "" : "s"} selected · ${total * 12}/year</span>
        </div>
      </div>

      {selected.size > 0 && (
        <div className="v2-calc-breakdown">
          <h2 className="dossier-h"><span className="dossier-h-no">◆</span> Your Stack</h2>
          <ul className="v2-calc-list">
            {PRICED_TOOLS.filter((t) => selected.has(t.name)).map((t) => (
              <li key={t.name} className="v2-calc-row">
                <Link href={`/tools/${t.toolSlug}`}>{t.name}</Link>
                <span>${t.monthlyUSD}/mo{t.note ? ` · ${t.note}` : ""}</span>
                <a href={t.pricingUrl} target="_blank" rel="noopener noreferrer" className="v2-calc-verify">verify price ↗</a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <p className="v2-calc-disclaimer">
        Prices shown are approximate starting figures for each tool&apos;s lowest paid tier, not
        live data — they can change, vary by region, or differ with annual billing. Always
        confirm the current price on the tool&apos;s own pricing page before subscribing.
      </p>
    </div>
  );
}
