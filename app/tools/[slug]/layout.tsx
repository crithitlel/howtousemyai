import type { Metadata } from "next";
import { TOOLS, slugify } from "@/lib/tools";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tool = TOOLS.find((t) => slugify(t.name) === slug);

  if (!tool) {
    return { title: "Tool Not Found | HowToUseMyAI" };
  }

  const title = `How to Use ${tool.name} — Step-by-Step Guide | HowToUseMyAI`;
  const description = `Learn how to use ${tool.name} for ${tool.category.toLowerCase()}. Step-by-step instructions, tips, and best practices to get started fast.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      url: `https://howtousemyai.com/tools/${slug}`,
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
    alternates: {
      canonical: `https://howtousemyai.com/tools/${slug}`,
    },
  };
}

export default async function ToolLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tool = TOOLS.find((t) => slugify(t.name) === slug);

  const jsonLd = tool
    ? {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: tool.name,
        applicationCategory: tool.category,
        offers: {
          "@type": "Offer",
          price: tool.pricing === "Free" ? "0" : undefined,
          priceCurrency: "USD",
        },
        url: `https://howtousemyai.com/tools/${slug}`,
        description: tool.description,
      }
    : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      {children}
    </>
  );
}
