"use client";

import { useRouter } from "next/navigation";
import { motion, type Variants } from "framer-motion";
import { ArrowRight, Cpu, Layers, FileText, TrendingUp } from "lucide-react";
import { IdeaInput } from "@/components/workflow/IdeaInput";
import { useAnalysisStore } from "@/store/analysis-store";
import { MobileNavigation } from "@/components/layout/MobileNavigation";
import { APP_NAME, APP_TAGLINE, AGENTS } from "@/lib/constants";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { cn } from "@/lib/utils";

// ─── Fade-in stagger helper ───────────────────────────────────────────────────
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
  }),
};

// ─── Features data ────────────────────────────────────────────────────────────
const FEATURES = [
  {
    icon: Cpu,
    title: "Multi-Agent Orchestration",
    desc: "Four specialised AI agents analyse your idea in parallel — CEO, CTO, Marketing, and Finance.",
  },
  {
    icon: Layers,
    title: "Executive Synthesis",
    desc: "A board-level synthesis integrates all perspectives into a unified strategic recommendation.",
  },
  {
    icon: FileText,
    title: "Strategic Artefacts",
    desc: "Auto-generated pitch deck, product roadmap, and financial budget — ready for refinement.",
  },
  {
    icon: TrendingUp,
    title: "Editorial Intelligence",
    desc: "Outputs are structured as editorial intelligence reports, not raw AI text.",
  },
];

// ─── Decorative geometric SVG ─────────────────────────────────────────────────
function TempleGeometry() {
  return (
    <svg
      className="absolute right-0 top-0 w-64 h-64 opacity-[0.04] pointer-events-none select-none"
      viewBox="0 0 200 200"
      fill="none"
      aria-hidden="true"
    >
      <rect x="10" y="10" width="180" height="180" stroke="#F5F5F4" strokeWidth="0.5" />
      <rect x="30" y="30" width="140" height="140" stroke="#F5F5F4" strokeWidth="0.5" />
      <rect x="50" y="50" width="100" height="100" stroke="#F5F5F4" strokeWidth="0.5" />
      <rect x="70" y="70" width="60" height="60" stroke="#F5F5F4" strokeWidth="0.5" />
      <line x1="100" y1="10" x2="100" y2="190" stroke="#F5F5F4" strokeWidth="0.5" />
      <line x1="10" y1="100" x2="190" y2="100" stroke="#F5F5F4" strokeWidth="0.5" />
      <circle cx="100" cy="100" r="40" stroke="#B55239" strokeWidth="0.5" />
      <circle cx="100" cy="100" r="20" stroke="#C79A3B" strokeWidth="0.5" />
      <circle cx="100" cy="100" r="5" fill="#B55239" />
    </svg>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function HomePage() {
  const router = useRouter();
  const { idea, category, setIdea, setCategory } = useAnalysisStore();

  const handleSubmit = () => {
    if (idea.trim().length < 20) return;
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* ── Top bar ─────────────────────────────────────────────────────────── */}
      <header className="flex items-center justify-between h-14 px-5 lg:px-10 border-b border-border shrink-0">
        <div className="flex items-center gap-2">
          <div
            className="w-6 h-6 border border-terracotta rounded-sm flex items-center justify-center"
            aria-hidden="true"
          >
            <Cpu className="w-3 h-3 text-terracotta" />
          </div>
          <span className="font-display text-sm font-semibold text-foreground">
            {APP_NAME}
          </span>
        </div>
        <nav className="flex items-center gap-5" aria-label="Top navigation">
          <ThemeToggle />
          <a
            href="/dashboard"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors font-display"
          >
            Analyse
          </a>
          <a
            href="#features"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors font-display"
          >
            How it works
          </a>
        </nav>
      </header>

      {/* ── Hero ────────────────────────────────────────────────────────────── */}
      <main className="flex-1 flex flex-col pb-20 lg:pb-0">
        <section
          className="relative overflow-hidden border-b border-border"
          aria-labelledby="hero-heading"
        >
          <TempleGeometry />

          <div className="max-w-3xl mx-auto px-5 lg:px-10 py-16 lg:py-24">
            {/* Kicker */}
            <motion.p
              custom={0}
              variants={fadeUp}
              initial="hidden"
              animate="show"
              className="font-mono text-xs text-terracotta uppercase tracking-widest mb-5"
            >
              {APP_TAGLINE}
            </motion.p>

            {/* Headline */}
            <motion.h1
              id="hero-heading"
              custom={1}
              variants={fadeUp}
              initial="hidden"
              animate="show"
              className="font-display text-4xl lg:text-5xl font-semibold text-foreground leading-[1.15] tracking-tight mb-4"
            >
              A calm operating system{" "}
              <br className="hidden lg:block" />
              for startup intelligence.
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              custom={2}
              variants={fadeUp}
              initial="hidden"
              animate="show"
              className="text-muted-foreground text-base lg:text-lg leading-relaxed mb-10 max-w-xl"
            >
              Submit an idea. Watch four specialised AI agents — CEO, CTO,
              Marketing, Finance — synthesise strategic intelligence and generate
              artefacts.
            </motion.p>

            {/* Tamil accent text */}
            <motion.p
              custom={2.5}
              variants={fadeUp}
              initial="hidden"
              animate="show"
              className="font-tamil text-xs text-muted-foreground/40 mb-8 tracking-wide"
              aria-hidden="true"
            >
              உத்வேகம் · ஆய்வு · உத்தி — Idea · Analysis · Strategy
            </motion.p>

            {/* Input form */}
            <motion.div
              custom={3}
              variants={fadeUp}
              initial="hidden"
              animate="show"
              className="border border-border rounded-sm p-5 bg-card"
            >
              <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-3">
                Enter your startup idea
              </p>
              <IdeaInput
                value={idea}
                category={category}
                onIdeaChange={setIdea}
                onCategoryChange={setCategory}
                onSubmit={handleSubmit}
                showExamples
              />
            </motion.div>
          </div>
        </section>

        {/* ── Agent overview strip ─────────────────────────────────────────── */}
        <section
          className="border-b border-border"
          aria-labelledby="agents-heading"
        >
          <div className="max-w-5xl mx-auto px-5 lg:px-10 py-10">
            <p
              id="agents-heading"
              className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-6"
            >
              The Intelligence Council
            </p>
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
              {AGENTS.map((agent, i) => (
                <motion.div
                  key={agent.id}
                  custom={i}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                  className="border border-border rounded-sm p-3 bg-card"
                >
                  <span
                    className="font-mono text-xs"
                    style={{ color: agent.accentColor }}
                  >
                    {agent.symbol}
                  </span>
                  <p className="font-display text-sm font-semibold text-foreground mt-2 leading-tight">
                    {agent.name}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1 leading-snug">
                    {agent.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Features ────────────────────────────────────────────────────── */}
        <section
          id="features"
          className="border-b border-border"
          aria-labelledby="features-heading"
        >
          <div className="max-w-5xl mx-auto px-5 lg:px-10 py-12">
            <p
              id="features-heading"
              className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-8"
            >
              What you get
            </p>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {FEATURES.map((feat, i) => (
                <motion.div
                  key={feat.title}
                  custom={i}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                  className="flex gap-4 border border-border rounded-sm p-4 bg-card"
                >
                  <div className="shrink-0 w-8 h-8 border border-border rounded-sm flex items-center justify-center">
                    <feat.icon className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="font-display text-sm font-semibold text-foreground">
                      {feat.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                      {feat.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Workflow visualisation ───────────────────────────────────────── */}
        <section aria-labelledby="workflow-heading">
          <div className="max-w-3xl mx-auto px-5 lg:px-10 py-12">
            <p
              id="workflow-heading"
              className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-6"
            >
              The workflow
            </p>
            <ol className="relative space-y-0" aria-label="Analysis workflow steps">
              {[
                { n: "01", label: "Submit idea", detail: "Describe your startup concept. The richer the detail, the better the output." },
                { n: "02", label: "Agents activate", detail: "CEO, CTO, Marketing, and Finance agents run their analysis sequentially via n8n." },
                { n: "03", label: "Synthesis", detail: "The executive synthesis agent integrates all perspectives into a unified recommendation." },
                { n: "04", label: "Artefacts generated", detail: "Pitch deck, roadmap, and budget documents are auto-generated in markdown." },
                { n: "05", label: "Explore & refine", detail: "Switch between agent tabs, view artefacts, and save analyses to history." },
              ].map((step, i) => (
                <motion.li
                  key={step.n}
                  custom={i}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                  className={cn(
                    "flex gap-5 py-4",
                    i < 4 && "border-b border-border/50"
                  )}
                >
                  <span className="font-mono text-xs text-terracotta shrink-0 w-6 pt-0.5">
                    {step.n}
                  </span>
                  <div>
                    <p className="font-display text-sm font-semibold text-foreground">
                      {step.label}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                      {step.detail}
                    </p>
                  </div>
                </motion.li>
              ))}
            </ol>
          </div>
        </section>

        {/* ── CTA ─────────────────────────────────────────────────────────── */}
        <section className="border-t border-border bg-card">
          <div className="max-w-3xl mx-auto px-5 lg:px-10 py-12 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div>
              <p className="font-display text-xl font-semibold text-foreground">
                Ready to think strategically?
              </p>
              <p className="text-muted-foreground text-sm mt-1">
                Submit your first idea — it takes 30–60 seconds.
              </p>
            </div>
            <a
              href="/dashboard"
              className={cn(
                "inline-flex items-center gap-2 px-5 py-3",
                "bg-foreground text-background rounded-sm",
                "font-display text-sm font-medium",
                "hover:bg-foreground/90 transition-colors",
                "focus-visible:outline-2 focus-visible:outline-offset-2"
              )}
            >
              Start analysing
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </a>
          </div>
        </section>

        {/* ── Footer ──────────────────────────────────────────────────────── */}
        <footer className="border-t border-border px-5 lg:px-10 py-5">
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <p className="text-xs text-muted-foreground/50 font-mono">
              {APP_NAME} · Multi-Agent Startup Intelligence
            </p>
            <p className="font-tamil text-xs text-muted-foreground/30" aria-hidden="true">
              வெற்றி
            </p>
          </div>
        </footer>
      </main>

      <MobileNavigation />
    </div>
  );
}
