import Link from "next/link";
import Logo from "./components/Logo";

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Dark navy header */}
      <header className="sticky top-0 z-20 bg-[#0a0f1e] border-b border-white/5 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <Logo size={32} />
            <span className="font-semibold text-white text-base tracking-tight">HowToUseMyAI</span>
          </Link>
          <nav className="hidden md:flex items-center gap-7 text-sm">
            <Link href="/#tools" className="text-white/50 hover:text-white transition-colors">Browse</Link>
            <Link href="/recommend?q=what+is+the+best+AI+tool+for+me" className="text-white/50 hover:text-white transition-colors">Recommend Me</Link>
            <Link href="/submit" className="text-[#1877F2] font-medium hover:opacity-80 transition-opacity">+ Submit a Tool</Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-6 py-20 bg-white">
        <div className="text-center">
          <p
            className="text-[96px] font-medium leading-none text-[#1877F2] mb-4"
            style={{ fontFamily: "var(--font-playfair), serif" }}
          >
            404
          </p>
          <p className="text-sm text-[#65676b] mb-8">This page doesn&apos;t exist.</p>
          <Link
            href="/"
            className="inline-block bg-[#1877F2] hover:bg-[#166FE5] text-white text-sm font-semibold px-6 py-2.5 rounded-lg transition-colors"
          >
            Go back home
          </Link>
        </div>
      </main>

      {/* Dark navy footer */}
      <footer className="bg-[#0a0f1e] border-t border-white/5 px-6 py-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/30">
          <div className="flex items-center gap-2">
            <Logo size={20} />
            <span className="font-medium text-white/60">HowToUseMyAI</span>
          </div>
          <p>© {new Date().getFullYear()} HowToUseMyAI. All rights reserved.</p>
          <div className="flex gap-5">
            <a href="/privacy" className="hover:text-white/60 transition-colors">Privacy</a>
            <a href="/terms" className="hover:text-white/60 transition-colors">Terms</a>
            <Link href="/submit" className="hover:text-white/60 transition-colors">Submit a Tool</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
