import Link from "next/link";
import Logo from "../components/Logo";

export default function PrivacyPage() {
  return (
    <div className="flex flex-col min-h-screen">
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
            Privacy Policy
          </h1>
          <p className="text-sm text-[#93a4c3] text-center mb-14">Last updated: May 2026</p>

          {/* Sections */}
          <div className="flex flex-col gap-12 text-[#e9eef8]">

            <section>
              <h2 className="text-lg font-semibold mb-3">What We Collect</h2>
              <p className="text-sm text-[#93a4c3] leading-relaxed">
                We collect your email address when you sign up for our newsletter. If you submit a tool
                to our directory, we also collect your name and the information you provide in the
                submission form. We do not collect any other personal information without your knowledge.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-3">How We Use It</h2>
              <p className="text-sm text-[#93a4c3] leading-relaxed">
                Your email is used solely to send you our newsletter about new AI tools and updates.
                You can unsubscribe at any time using the link in any email we send. We use basic
                analytics (page views, referral sources) to understand how people find and use the
                site so we can improve it. We do not sell your data to anyone.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-3">Cookies</h2>
              <p className="text-sm text-[#93a4c3] leading-relaxed">
                We use minimal cookies necessary to operate the site — for example, to remember your
                preferences between visits. We may also use analytics cookies (such as those set by
                Google Analytics or similar services) to understand site traffic. You can disable
                cookies in your browser settings at any time.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-3">Third Party Links</h2>
              <p className="text-sm text-[#93a4c3] leading-relaxed">
                HowToUseMyAI is a directory — we link to external AI tools and services. When you
                click through to a third-party site, their own privacy policy applies. We have no
                control over and take no responsibility for the content or practices of those sites.
                We recommend reviewing their policies before providing any personal information.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-3">Contact Us</h2>
              <p className="text-sm text-[#93a4c3] leading-relaxed">
                If you have any questions about this Privacy Policy or how we handle your data,
                please reach out to us via the{" "}
                <Link href="/submit" className="text-[#1877F2] hover:underline">
                  Submit a Tool
                </Link>{" "}
                page or email us directly. We will respond as promptly as we can.
              </p>
            </section>

          </div>
        </div>
      </main>

      <footer className="border-t border-[#233150] px-6 py-8 mt-10">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#93a4c3]">
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
