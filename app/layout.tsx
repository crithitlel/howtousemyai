import type { Metadata } from "next";
import { Inter, Space_Grotesk, Fraunces, Chakra_Petch } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import CommandPalette from "./components/CommandPalette";
import CompareTray from "./components/CompareTray";
import SystemBackdrop from "./components/SystemBackdrop";

const GA_ID = "G-CHP8YLK0PE";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-tech",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

// HUD / command-center display — squared technical face for headlines.
const chakraPetch = Chakra_Petch({
  variable: "--font-hud",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

// Luxury editorial display serif — high-contrast, optical sizing.
const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz", "SOFT"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://howtousemyai.com"),
  alternates: { canonical: "/" },
  title: "HowToUseMyAI - Find the Perfect AI Tool",
  description: "Describe what you want to accomplish and instantly find the best AI tool for the job — with step-by-step instructions to get started.",
  openGraph: {
    title: "HowToUseMyAI - Find the Perfect AI Tool",
    description: "Describe what you want to accomplish and instantly find the best AI tool for the job.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "HowToUseMyAI - Find the Perfect AI Tool",
    description: "Describe what you want to accomplish and instantly find the best AI tool for the job.",
  },
  verification: {
    google: "60Dp-z8Y06HhsSsHo3j9zBYpMklLWkVFz3IieXp9EAU",
  },
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "HowToUseMyAI",
  url: "https://howtousemyai.com",
  description: "Find the best AI tool for any task with step-by-step guides.",
  potentialAction: {
    "@type": "SearchAction",
    target: { "@type": "EntryPoint", urlTemplate: "https://howtousemyai.com/recommend?q={search_term_string}" },
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable} ${chakraPetch.variable} ${fraunces.variable} h-full antialiased`}>
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
        {(GA_ID as string) !== "G-XXXXXXXXXX" && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
            <Script id="ga-init" strategy="afterInteractive">{`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_ID}');
            `}</Script>
          </>
        )}
      </head>
      <body className="min-h-full flex flex-col bg-[#070d20]" style={{ fontFamily: "var(--font-tech), var(--font-inter), sans-serif" }}>
        <div className="site-bg" aria-hidden="true" />
        <SystemBackdrop />
        <CommandPalette />
        <CompareTray />
        <div className="relative z-[1] flex flex-col flex-1 min-h-full">
          <div className="site-frame flex flex-col flex-1 min-h-full">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
