import Link from "next/link";
import Logo from "../components/Logo";

export const metadata = {
  title: "Affiliate Disclosure — HowToUseMyAI",
  description:
    "How HowToUseMyAI uses affiliate links and why they never affect which tools we recommend.",
};

export default function DisclosurePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 px-6 py-12">
        <div className="max-w-3xl mx-auto">

          {/* Back link */}
          <Link
            href="/"
            className="back-link inline-block mb-10"
          >
            ‹ Return.To.Index
          </Link>

          {/* Logo + brand heading */}
          <div className="flex flex-col items-center text-center mb-10">
            <Logo size={40} />
            <h2
              className="display-head mt-3 text-lg font-medium text-[#1877F2]"
            >
              HowToUseMyAI
            </h2>
          </div>

          {/* Page title */}
          <h1
            className="display-head text-3xl font-medium text-[#1877F2] text-center mb-2"
          >
            Affiliate Disclosure
          </h1>
          <p className="text-sm text-[#93a4c3] text-center mb-14">Last updated: June 2026</p>

          {/* Sections */}
          <div className="flex flex-col gap-12 text-[#e9eef8]">

            <section>
              <h2 className="text-lg font-semibold mb-3">The Short Version</h2>
              <p className="text-sm text-[#93a4c3] leading-relaxed">
                Some links on this site are affiliate links. If you click one and sign up for a paid
                plan, we may earn a commission at no extra cost to you. That is how we keep the site
                free to use.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-3">What It Does Not Change</h2>
              <p className="text-sm text-[#93a4c3] leading-relaxed">
                Affiliate relationships never affect which tools we list, how we describe them, or
                where they appear in search results and recommendations. Tools without affiliate
                programs sit right next to tools with them, ranked by the same criteria. Nobody can
                pay to be listed, featured, or ranked higher.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-3">How It Works</h2>
              <p className="text-sm text-[#93a4c3] leading-relaxed">
                When a tool we already list happens to offer an affiliate program, we may use a
                tracked link instead of a plain one. The price you pay is identical either way. We
                never use affiliate links for tools we would not recommend on their own merits.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-3">Questions</h2>
              <p className="text-sm text-[#93a4c3] leading-relaxed">
                If anything here is unclear, reach out via the{" "}
                <Link href="/submit" className="text-[#1877F2] hover:underline">
                  Submit a Tool
                </Link>{" "}
                page and we will get back to you.
              </p>
            </section>

          </div>
        </div>
      </main>

      <footer className="border-t border-[#233150] px-6 py-8 mt-10">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#93a4c3]">
          <p>© {new Date().getFullYear()} HowToUseMyAI. All rights reserved.</p>
          <div className="flex gap-5">
            <Link href="/about" className="nav-link">About</Link>
            <Link href="/privacy" className="nav-link">Privacy</Link>
            <Link href="/terms" className="nav-link">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
