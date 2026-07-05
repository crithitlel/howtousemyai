import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import CostCalculator from "../components/CostCalculator";

export const metadata: Metadata = {
  title: "AI Stack Cost Calculator — Estimate Your Monthly AI Spend | HowToUseMyAI",
  description:
    "Pick the AI tools you use and see an estimated total monthly and yearly cost, with links to verify current pricing on each tool's own site.",
  alternates: { canonical: "https://howtousemyai.com/calculator" },
};

export default function CalculatorPage() {
  return (
    <div className="v2-root site-bg">
      <SiteHeader />
      <main className="v2-sec" style={{ maxWidth: 900, margin: "0 auto", padding: "clamp(28px,4vw,52px) clamp(16px,4vw,44px)" }}>
        <nav className="v2-crumb" aria-label="Breadcrumb">
          <Link href="/">HOME</Link> <span className="v2-crumb-sep">{"//"}</span> <span>COST CALCULATOR</span>
        </nav>

        <h1 className="v2-pagetitle">AI Stack Cost Calculator</h1>
        <p className="v2-pageintro">
          Select the AI tools you actually pay for (or are considering) to see your estimated
          monthly and yearly spend — one place to see the real cost of your stack.
        </p>

        <CostCalculator />
      </main>
      <SiteFooter />
    </div>
  );
}
