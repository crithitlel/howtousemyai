import Link from "next/link";
import Logo from "../components/Logo";

export default function TermsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
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
            Terms of Service
          </h1>
          <p className="text-sm text-[#65676b] text-center mb-14">Last updated: May 2026</p>

          {/* Sections */}
          <div className="flex flex-col gap-12 text-[#1c1e21]">

            <section>
              <h2 className="text-lg font-semibold mb-3">Use of Service</h2>
              <p className="text-sm text-[#65676b] leading-relaxed">
                HowToUseMyAI is a free-to-use AI tool directory. By accessing this site, you agree
                to use it for lawful purposes only. You must not attempt to scrape, reverse engineer,
                or otherwise misuse this site or its content. We reserve the right to restrict access
                if these terms are violated.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-3">Intellectual Property</h2>
              <p className="text-sm text-[#65676b] leading-relaxed">
                The content on HowToUseMyAI — including descriptions, guides, and the site design —
                is our original work and is protected by copyright. The AI tools listed in our
                directory are the property of their respective owners. We do not claim any ownership
                over third-party tools, logos, or trademarks that appear on this site.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-3">Disclaimer</h2>
              <p className="text-sm text-[#65676b] leading-relaxed">
                HowToUseMyAI is a directory service. We list and describe AI tools to help people
                discover them — we do not build, operate, or officially endorse any of the tools
                featured. Tool availability, pricing, and features may change without notice. Always
                verify current information directly on each tool&apos;s website before making purchasing
                decisions.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-3">Limitation of Liability</h2>
              <p className="text-sm text-[#65676b] leading-relaxed">
                To the fullest extent permitted by law, HowToUseMyAI shall not be liable for any
                direct, indirect, incidental, or consequential damages arising from your use of this
                site or any of the tools we link to. Your use of any AI tool listed here is at your
                own risk and subject to that tool&apos;s own terms.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-3">Changes to Terms</h2>
              <p className="text-sm text-[#65676b] leading-relaxed">
                We may update these Terms of Service from time to time. Changes will be reflected
                by the &quot;Last updated&quot; date at the top of this page. Continued use of the site
                after any changes constitutes your acceptance of the updated terms.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-3">Contact</h2>
              <p className="text-sm text-[#65676b] leading-relaxed">
                If you have questions about these Terms, please reach out via the{" "}
                <Link href="/submit" className="text-[#1877F2] hover:underline">
                  Submit a Tool
                </Link>{" "}
                page. We&apos;re happy to clarify anything.
              </p>
            </section>

          </div>
        </div>
      </main>

      <footer className="border-t border-[#e4e6ea] px-6 py-8 mt-10">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#65676b]">
          <p>© {new Date().getFullYear()} HowToUseMyAI. All rights reserved.</p>
          <div className="flex gap-5">
            <Link href="/privacy" className="hover:text-[#1877F2] transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-[#1877F2] transition-colors">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
