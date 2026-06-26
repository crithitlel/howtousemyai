import Link from "next/link";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import { WORKFLOWS, toolsInWorkflow } from "@/lib/workflows";

const year = new Date().getFullYear();

export const metadata = {
  title: `AI Workflows: Complete Multi-Tool Playbooks (${year}) — HowToUseMyAI`,
  description:
    "Step-by-step AI workflows that chain the right tools together to finish real tasks — write a blog post, make a video, launch a campaign, ship a web app. Each step names a tool and tells you exactly what to do.",
  openGraph: {
    title: `AI Workflows: Complete Multi-Tool Playbooks (${year})`,
    description:
      "Don't just find one tool — learn the whole workflow. Research → writing → images → voice → video → publishing, with the right AI at every step.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `AI Workflows: Complete Multi-Tool Playbooks (${year})`,
    description:
      "Step-by-step AI workflows that chain the right tools together to finish real-world tasks.",
  },
};

const DIFF_CLASS: Record<string, string> = {
  Beginner: "wf-diff-beg",
  Intermediate: "wf-diff-int",
  Advanced: "wf-diff-adv",
};

export default function WorkflowsIndexPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader active="/workflows" />

      <main className="v2-page">
        <div className="v2-pagehead">
          <div className="v2-crumb">
            <Link href="/">NODE</Link>
            <i>//</i>
            <span className="v2-crumb-cur">WORKFLOWS</span>
          </div>
          <h1 className="v2-pagetitle">AI Workflows</h1>
          <p className="v2-pagelead">
            Most directories hand you a single tool and wish you luck. We teach the <b>whole job</b> —
            the exact sequence of AI tools that takes a real task from blank page to finished result.
            Pick a goal and follow the steps.
          </p>
          <div className="v2-readbar">
            <span className="flex items-center gap-2"><i className="v2-dot v2-dot-ok" /> {WORKFLOWS.length} WORKFLOWS</span>
            <span className="v2-readbar-sep" />
            <span><b>{WORKFLOWS.reduce((n, w) => n + w.steps.length, 0)}</b> <span className="v2-readbar-dim">GUIDED STEPS</span></span>
            <span className="v2-readbar-sep" />
            <span><b>END-TO-END</b> <span className="v2-readbar-dim">TOOL CHAINS</span></span>
          </div>
        </div>

        <div className="wf-grid">
          {WORKFLOWS.map((w) => {
            const tools = toolsInWorkflow(w);
            return (
              <Link key={w.slug} href={`/workflows/${w.slug}`} className="v2-panel wf-card">
                <i className="v2-cb v2-cb-tl" /><i className="v2-cb v2-cb-tr" /><i className="v2-cb v2-cb-bl" /><i className="v2-cb v2-cb-br" />
                <div className="wf-card-top">
                  <span className="wf-card-ico">{w.icon}</span>
                  <span className={`wf-diff ${DIFF_CLASS[w.difficulty]}`}>{w.difficulty}</span>
                </div>
                <h2 className="wf-card-title">{w.title}</h2>
                <p className="wf-card-tagline">{w.tagline}</p>
                <div className="wf-card-flow">
                  {w.steps.map((s, i) => (
                    <span key={s.phase} className="wf-flow-step">
                      <span className="wf-flow-ico">{s.icon}</span>
                      <span className="wf-flow-name">{s.phase}</span>
                      {i < w.steps.length - 1 && <span className="wf-flow-arrow">→</span>}
                    </span>
                  ))}
                </div>
                <div className="wf-card-foot">
                  <span className="wf-card-meta">⏱ {w.time}</span>
                  <span className="wf-card-meta">⚙ {tools.length} tools</span>
                  <span className="wf-card-go">OPEN PLAYBOOK →</span>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="v2-ctapanel v2-panel">
          <i className="v2-cb v2-cb-tl" /><i className="v2-cb v2-cb-tr" /><i className="v2-cb v2-cb-bl" /><i className="v2-cb v2-cb-br" />
          <p>Have a task that isn&apos;t listed? Get a tool stack matched to your exact goal.</p>
          <Link href="/recommend" className="v2-ctabtn">
            ◆ GET A PERSONALIZED MATCH
          </Link>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
