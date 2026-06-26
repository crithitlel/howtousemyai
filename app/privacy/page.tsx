import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "What HowToUseMyAI collects, how we use it, and what we never do with your data.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />

      <main className="v2-page">
        <div className="v2-pagehead">
          <div className="v2-crumb">
            <Link href="/">HOME</Link>
            <i>//</i>
            <span className="v2-crumb-cur">PRIVACY</span>
          </div>
          <h1 className="v2-pagetitle">PRIVACY<span className="v2-tred">.</span>POLICY</h1>
          <p className="v2-pagelead">Last updated: May 2026 — what we collect, how we use it, and what we never do.</p>
        </div>

        <div className="v2-prose">
          <section>
            <h2>What We Collect</h2>
            <p>
              We collect your email address when you sign up for our newsletter. If you submit a tool
              to our directory, we also collect your name and the information you provide in the
              submission form. We do not collect any other personal information without your knowledge.
            </p>
          </section>

          <section>
            <h2>How We Use It</h2>
            <p>
              Your email is used solely to send you our newsletter about new AI tools and updates.
              You can unsubscribe at any time using the link in any email we send. We use basic
              analytics (page views, referral sources) to understand how people find and use the
              site so we can improve it. We do not sell your data to anyone.
            </p>
          </section>

          <section>
            <h2>Cookies</h2>
            <p>
              We use minimal cookies necessary to operate the site — for example, to remember your
              preferences between visits. We may also use analytics cookies (such as those set by
              Google Analytics or similar services) to understand site traffic. You can disable
              cookies in your browser settings at any time.
            </p>
          </section>

          <section>
            <h2>Third Party Links</h2>
            <p>
              HowToUseMyAI is a directory — we link to external AI tools and services. When you
              click through to a third-party site, their own privacy policy applies. We have no
              control over and take no responsibility for the content or practices of those sites.
              We recommend reviewing their policies before providing any personal information.
            </p>
          </section>

          <section>
            <h2>Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy or how we handle your data,
              please reach out to us via the <Link href="/submit">Submit a Tool</Link> page or email
              us directly. We will respond as promptly as we can.
            </p>
          </section>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
