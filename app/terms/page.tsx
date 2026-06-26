import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The rules of engagement for using the HowToUseMyAI directory.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />

      <main className="v2-page">
        <div className="v2-pagehead">
          <div className="v2-crumb">
            <Link href="/">HOME</Link>
            <i>//</i>
            <span className="v2-crumb-cur">TERMS</span>
          </div>
          <h1 className="v2-pagetitle">TERMS<span className="v2-tred">.</span>OF SERVICE</h1>
          <p className="v2-pagelead">Last updated: May 2026 — the rules of engagement for using this directory.</p>
        </div>

        <div className="v2-prose">
          <section>
            <h2>Use of Service</h2>
            <p>
              HowToUseMyAI is a free-to-use AI tool directory. By accessing this site, you agree
              to use it for lawful purposes only. You must not attempt to scrape, reverse engineer,
              or otherwise misuse this site or its content. We reserve the right to restrict access
              if these terms are violated.
            </p>
          </section>

          <section>
            <h2>Intellectual Property</h2>
            <p>
              The content on HowToUseMyAI — including descriptions, guides, and the site design —
              is our original work and is protected by copyright. The AI tools listed in our
              directory are the property of their respective owners. We do not claim any ownership
              over third-party tools, logos, or trademarks that appear on this site.
            </p>
          </section>

          <section>
            <h2>Disclaimer</h2>
            <p>
              HowToUseMyAI is a directory service. We list and describe AI tools to help people
              discover them — we do not build, operate, or officially endorse any of the tools
              featured. Tool availability, pricing, and features may change without notice. Always
              verify current information directly on each tool&apos;s website before making purchasing
              decisions.
            </p>
          </section>

          <section>
            <h2>Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by law, HowToUseMyAI shall not be liable for any
              direct, indirect, incidental, or consequential damages arising from your use of this
              site or any of the tools we link to. Your use of any AI tool listed here is at your
              own risk and subject to that tool&apos;s own terms.
            </p>
          </section>

          <section>
            <h2>Changes to Terms</h2>
            <p>
              We may update these Terms of Service from time to time. Changes will be reflected
              by the &quot;Last updated&quot; date at the top of this page. Continued use of the site
              after any changes constitutes your acceptance of the updated terms.
            </p>
          </section>

          <section>
            <h2>Contact</h2>
            <p>
              If you have questions about these Terms, please reach out via the{" "}
              <Link href="/submit">Submit a Tool</Link> page. We&apos;re happy to clarify anything.
            </p>
          </section>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
