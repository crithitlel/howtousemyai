import Link from "next/link";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import { TOOLS } from "@/lib/tools";

export const metadata = {
  title: "About — HowToUseMyAI",
  description:
    "HowToUseMyAI is a hand-picked directory of AI tools with plain-English instructions, honest pricing labels, and step-by-step guides.",
};

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />

      <main className="v2-page">
        <div className="v2-pagehead">
          <div className="v2-crumb">
            <Link href="/">HOME</Link>
            <i>//</i>
            <span className="v2-crumb-cur">ABOUT</span>
          </div>
          <h1 className="v2-pagetitle">MISSION<span className="v2-tred">.</span>BRIEF</h1>
          <p className="v2-pagelead">
            Why this site exists, how we pick tools, and how to put a new one on the map.
          </p>
        </div>

        <div className="v2-prose">
          <section>
            <h2>What This Site Is</h2>
            <p>
              There are thousands of AI tools, and most directories just dump them all in a giant
              list. HowToUseMyAI is different: we keep a hand-picked catalog of {TOOLS.length} tools
              that actually work, and for each one we explain what it is best at, what it costs, and
              exactly how to get started in three steps. Describe what you want to do, and we match
              you with the right tool.
            </p>
          </section>

          <section>
            <h2>How We Pick Tools</h2>
            <p>
              Every tool in the directory is reviewed before it goes live. We look for tools that
              are actively maintained, have a real free tier or transparent pricing, and solve a
              problem better than the alternatives in their category. We remove tools that shut
              down, get abandoned, or fall behind. Listings are not paid placements: nobody can buy
              a spot in the directory or in our Editor&apos;s Picks.
            </p>
          </section>

          <section>
            <h2>Suggest a Tool</h2>
            <p>
              Found an AI tool we should know about? Submit it through the{" "}
              <Link href="/submit">Submit a Tool</Link> page and we will review it. We read every
              submission.
            </p>
          </section>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
