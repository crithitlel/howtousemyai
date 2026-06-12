import type { Metadata } from "next";
import { Inter, Playfair_Display, Space_Grotesk } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const GA_ID = "G-CHP8YLK0PE";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const grotesk = Space_Grotesk({
  variable: "--font-grotesk",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
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
    <html lang="en" className={`${inter.variable} ${playfair.variable} ${grotesk.variable} h-full antialiased`}>
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
      <body className="min-h-full flex flex-col bg-[#101b32]" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
