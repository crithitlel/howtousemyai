import Link from "next/link";
import Logo from "./components/Logo";

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-white/85 backdrop-blur border-b border-[#eef2fa] px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <Logo size={32} />
            <span className="brand-mark">HowToUseMy<span className="brand-ai">AI</span></span>
          </Link>
          <nav className="hidden md:flex items-center gap-7 text-sm">
            <Link href="/#tools" className="lux-navlink">Browse</Link>
            <Link href="/recommend?q=what+is+the+best+AI+tool+for+me" className="lux-navlink">Recommend Me</Link>
            <Link href="/submit" className="submit-chip">+ Submit a Tool</Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-6 py-20">
        <div className="text-center">
          <p className="display-head text-[96px] font-bold leading-none text-[#0a1129] mb-4">
            404
          </p>
          <p className="text-sm text-[#5a6b8c] mb-8">This page doesn&apos;t exist.</p>
          <Link
            href="/"
            className="inline-block bg-[#1877F2] hover:bg-[#166FE5] text-white text-sm font-semibold px-6 py-2.5 rounded-lg transition-colors"
          >
            Go back home
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#eef2fa] px-6 py-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#8a9bb8]">
          <div className="flex items-center gap-2">
            <Logo size={20} />
            <span className="brand-mark brand-mark-sm">HowToUseMy<span className="brand-ai">AI</span></span>
          </div>
          <p>© {new Date().getFullYear()} HowToUseMyAI. All rights reserved.</p>
          <div className="flex gap-5">
            <a href="/privacy" className="lux-footlink">Privacy</a>
            <a href="/terms" className="lux-footlink">Terms</a>
            <Link href="/submit" className="lux-footlink">Submit a Tool</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
