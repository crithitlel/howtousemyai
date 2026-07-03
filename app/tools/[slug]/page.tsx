import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TOOLS, slugify } from "@/lib/tools";
import { ToolProfileClient } from "./ToolProfileClient";
import { TOOLS_DATA } from "./data";

// Pre-render every tool page at build time. Slugs come from the canonical lib
// list PLUS the dossier dataset (TOOLS_DATA), which includes a few profiles not
// yet in lib.
export function generateStaticParams() {
  const slugs = new Set<string>();
  for (const t of TOOLS) slugs.add(slugify(t.name));
  for (const t of TOOLS_DATA) slugs.add(slugify(t.name));
  return Array.from(slugs).map((slug) => ({ slug }));
}

function resolve(slug: string) {
  const dossier = TOOLS_DATA.find((t) => slugify(t.name) === slug);
  const basic = TOOLS.find((t) => slugify(t.name) === slug);
  return { dossier, basic, name: dossier?.name ?? basic?.name, category: dossier?.category ?? basic?.category };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { name, category } = resolve(slug);

  if (!name) {
    return { title: "Tool Not Found | HowToUseMyAI" };
  }

  const title = `How to Use ${name} — Step-by-Step Guide | HowToUseMyAI`;
  const description = `Learn how to use ${name} for ${(category ?? "").toLowerCase()}. Step-by-step instructions, tips, and best practices to get started fast.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      url: `https://howtousemyai.com/tools/${slug}`,
    },
    twitter: { card: "summary", title, description },
    alternates: { canonical: `https://howtousemyai.com/tools/${slug}` },
  };
}

export default async function ToolPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { dossier, basic } = resolve(slug);

  // Unknown slug → proper Next.js 404, not a degraded inline stub.
  if (!dossier && !basic) notFound();

  return <ToolProfileClient slug={slug} />;
}
