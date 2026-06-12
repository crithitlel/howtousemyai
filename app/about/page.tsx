import Link from "next/link";
import Logo from "../components/Logo";
import { TOOLS } from "@/lib/tools";

export const metadata = {
  title: "About — HowToUseMyAI",
  description:
    "HowToUseMyAI is a hand-picked directory of AI tools with plain-English instructions, honest pricing labels, and step-by-step guides.",
};

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#101b32]">
      <main className="flex-1 px-6 py-12">
        <div className="max-w-3xl mx-auto">

          {/* Back link */}
          <Link
            href="/"
            className="inline-block text-sm text-[#1877F2] hover:text-[#166FE5] transition-colors mb-10"
          >
            ← Home
          </Link>

          {/* Logo + brand heading */}
          <div className="flex flex-col items-center text-center mb-10">
            <Logo size={40} />
            <h2
              className="mt-3 text-lg font-medium text-[#1877F2]"
              style={{ fontFamily: "var(--font-playfair), serif" }}
            >
              HowToUseMyAI
            </h2>
          </div>

          {/* Page title */}
          <h1
            className="text-3xl font-medium text-[#1877F2] text-center mb-2"
            style={{ fontFamily: "var(--font-playfair), serif" }}
          >
            About
          </h1>
          <p className="text-sm text-[#93a4c3] text-center mb-14">
            Why this site exists and how we pick tools.
          </p>

          {/* Sections */}
          <div className="flex flex-col gap-12 text-[#e9eef8]">

            <section>
              <h2 className="text-lg font-semibold mb-3">What This Site Is</h2>
              <p className="text-sm text-[#93a4c3] leading-relaxed">
                There are thousands of AI tools, and most directories just dump them all in a giant
                list. HowToUseMyAI is different: we keep a hand-picked catalog of {TOOLS.length} tools
                that actually work, and for each one we explain what it is best at, what it costs, and
                exactly how to get started in three steps. Describe what you want to do, and we match
                you with the right tool.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-3">How We Pick Tools</h2>
              <p className="text-sm text-[#93a4c3] leading-relaxed">
                Every tool in the directory is reviewed before it goes live. We look for tools that
                are actively maintained, have a real free tier or transparent pricing, and solve a
                problem better than the alternatives in their category. We remove tools that shut
                down, get abandoned, or fall behind. Listings are not paid placements: nobody can buy
                a spot in the directory or in our Editor&apos;s Picks.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-3">How We Make Money</h2>
              <p className="text-sm text-[#93a4c3] leading-relaxed">
                Some outbound links are affiliate links, which means we may earn a commission if you
                sign up for a paid plan. This never affects which tools we list or how we rank them.
                You can read the full details on our{" "}
                <Link href="/disclosure" className="text-[#1877F2] hover:underline">
                  affiliate disclosure
                </Link>{" "}
                page.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-3">Suggest a Tool</h2>
              <p className="text-sm text-[#93a4c3] leading-relaxed">
                Found an AI tool we should know about? Submit it through the{" "}
                <Link href="/submit" className="text-[#1877F2] hover:underline">
                  Submit a Tool
                </Link>{" "}
                page and we will review it. We read every submission.
              </p>
            </section>

          </div>
        </div>
      </main>

      <footer className="border-t border-[#233150] px-6 py-8 mt-10">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#93a4c3]">
          <p>© {new Date().getFullYear()} HowToUseMyAI. All rights reserved.</p>
          <div className="flex gap-5">
            <Link href="/disclosure" className="hover:text-[#1877F2] transition-colors">Disclosure</Link>
            <Link href="/privacy" className="hover:text-[#1877F2] transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-[#1877F2] transition-colors">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
