import Link from "next/link";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";

export const metadata = {
  title: "Affiliate Disclosure — HowToUseMyAI",
  description:
    "How HowToUseMyAI uses affiliate links and why they never affect which tools we recommend.",
};

export default function DisclosurePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />

      <main className="v2-page">
        <div className="v2-pagehead">
          <div className="v2-crumb">
            <Link href="/">HOME</Link>
            <i>//</i>
            <span className="v2-crumb-cur">DISCLOSURE</span>
          </div>
          <h1 className="v2-pagetitle">AFFILIATE<span className="v2-tred">.</span>DISCLOSURE</h1>
          <p className="v2-pagelead">Last updated: June 2026 — how affiliate links work and what they never change.</p>
        </div>

        <div className="v2-prose">
          <section>
            <h2>The Short Version</h2>
            <p>
              Some links on this site are affiliate links. If you click one and sign up for a paid
              plan, we may earn a commission at no extra cost to you. That is how we keep the site
              free to use.
            </p>
          </section>

          <section>
            <h2>What It Does Not Change</h2>
            <p>
              Affiliate relationships never affect which tools we list, how we describe them, or
              where they appear in search results and recommendations. Tools without affiliate
              programs sit right next to tools with them, ranked by the same criteria. Nobody can
              pay to be listed, featured, or ranked higher.
            </p>
          </section>

          <section>
            <h2>How It Works</h2>
            <p>
              When a tool we already list happens to offer an affiliate program, we may use a
              tracked link instead of a plain one. The price you pay is identical either way. We
              never use affiliate links for tools we would not recommend on their own merits.
            </p>
          </section>

          <section>
            <h2>Questions</h2>
            <p>
              If anything here is unclear, reach out via the <Link href="/submit">Submit a Tool</Link>{" "}
              page and we will get back to you.
            </p>
          </section>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
