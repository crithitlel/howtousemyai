import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Tool Recommender — Describe Your Task",
  description: "Describe what you want to accomplish and get matched to the best AI tool for the job, with step-by-step instructions to get started.",
  alternates: { canonical: "/recommend" },
};

export default function RecommendLayout({ children }: { children: React.ReactNode }) {
  return children;
}
