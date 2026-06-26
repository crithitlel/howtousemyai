import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Submit an AI Tool",
  description: "Know an AI tool that belongs in the directory? Submit it for review and inclusion on HowToUseMyAI.",
  alternates: { canonical: "/submit" },
};

export default function SubmitLayout({ children }: { children: React.ReactNode }) {
  return children;
}
