"use client";

import { useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, RefreshCw, BookmarkPlus, Cpu, PanelRight } from "lucide-react";
import { useAnalysisStore } from "@/store/analysis-store";
import { analyzeStartup } from "@/lib/api";
import { LOADING_STAGES } from "@/lib/constants";
import { Sidebar } from "@/components/layout/Sidebar";
import { MobileNavigation } from "@/components/layout/MobileNavigation";
import { IdeaInput } from "@/components/workflow/IdeaInput";
import { WorkflowTimeline } from "@/components/workflow/WorkflowTimeline";
import { LoadingOrchestrator } from "@/components/workflow/LoadingOrchestrator";
import { ScoresVisualizer } from "@/components/workflow/ScoresVisualizer";
import { AgentTabs } from "@/components/agent/AgentTabs";
import { ArtifactViewer } from "@/components/artifacts/ArtifactViewer";
import { ErrorBoundary } from "@/components/shared/ErrorBoundary";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

// ─── Stage advancement logic ──────────────────────────────────────────────────
function useStageAdvancer() {
  const { status, loadingStage, setLoadingStage } = useAnalysisStore();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (status !== "loading") return;

    const currentIdx = LOADING_STAGES.findIndex((s) => s.id === loadingStage);
    const nextIdx = currentIdx + 1;

    if (nextIdx < LOADING_STAGES.length) {
      const current = LOADING_STAGES[currentIdx];
      timerRef.current = setTimeout(() => {
        setLoadingStage(LOADING_STAGES[nextIdx].id);
      }, current?.duration ?? 9000);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [status, loadingStage, setLoadingStage]);
}

// ─── Dashboard Page ───────────────────────────────────────────────────────────
export default function DashboardPage() {
  const {
    idea,
    category,
    status,
    loadingStage,
    error,
    result,
    setIdea,
    setCategory,
    setStatus,
    setLoadingStage,
    setError,
    setResult,
    saveCurrentAnalysis,
    reset,
  } = useAnalysisStore();

  const abortRef = useRef<AbortController | null>(null);

  // advance stages while loading
  useStageAdvancer();

  const handleSubmit = useCallback(async () => {
    if (idea.trim().length < 20 || status === "loading") return;

    // abort previous
    abortRef.current?.abort();
    abortRef.current = new AbortController();

    reset();
    setStatus("loading");
    setLoadingStage(LOADING_STAGES[0].id);
    setError(null);

    const response = await analyzeStartup(
      { idea, category },
      abortRef.current.signal
    );

    if (response.status === "error") {
      setStatus("error");
      setError(response.error ?? "An unknown error occurred.");
      setLoadingStage(null);
    } else if (response.data) {
      setResult(response.data);
      setStatus("completed");
      setLoadingStage(null);
    }
  }, [idea, category, status, reset, setStatus, setLoadingStage, setError, setResult]);

  // Auto-start analysis if routed with an existing idea and status is idle
  useEffect(() => {
    if (status === "idle" && idea.trim().length >= 20) {
      handleSubmit();
    }
  }, [status, idea, handleSubmit]);

  // re-apply idea from store if navigated from landing page
  const isLoading = status === "loading";
  const isCompleted = status === "completed";
  const isError = status === "error";

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="flex items-center justify-between h-14 px-5 border-b border-border shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-terracotta" aria-hidden="true" />
            <p className="font-display text-sm font-medium text-foreground">
              Analysis
            </p>
            {isCompleted && result && (
              <span className="font-mono text-xs text-muted-foreground hidden sm:inline">
                — {result.startupIdea || idea}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle className="lg:hidden mr-2" />
            {isCompleted && result && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={saveCurrentAnalysis}
                  className="text-xs text-muted-foreground hover:text-foreground gap-1.5"
                  aria-label="Save this analysis to history"
                >
                  <BookmarkPlus className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Save</span>
                </Button>

                {/* Artifacts drawer (mobile + desktop toggle) */}
                <Sheet>
                  <SheetTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs gap-1.5 xl:hidden"
                      aria-label="View strategic artefacts"
                    >
                      <PanelRight className="w-3.5 h-3.5" />
                      Artefacts
                    </Button>
                  </SheetTrigger>
                  <SheetContent
                    side="right"
                    className="w-full sm:w-[480px] bg-background border-border p-5 overflow-y-auto"
                  >
                    <SheetHeader className="mb-4">
                      <SheetTitle className="font-display text-sm font-semibold text-foreground">
                        Strategic Artefacts
                      </SheetTitle>
                    </SheetHeader>
                    <ArtifactViewer result={result} />
                  </SheetContent>
                </Sheet>
              </>
            )}

            {isCompleted && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => reset()}
                className="text-xs text-muted-foreground hover:text-foreground gap-1.5"
                aria-label="Start a new analysis"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">New</span>
              </Button>
            )}
          </div>
        </header>

        {/* Body */}
        <div className="flex-1 flex overflow-hidden">
          {/* ── Left / main analysis column ────────────────────────────── */}
          <main
            className="flex-1 overflow-y-auto min-w-0"
            aria-label="Main analysis area"
          >
            <div className="max-w-4xl mx-auto px-5 py-6 pb-24 lg:pb-8 space-y-6">

              {/* Idea input — only visible when NOT completed */}
              {!isCompleted && (
                <section aria-labelledby="input-heading">
                  <div className="flex items-center gap-2 mb-3">
                    <Cpu className="w-3.5 h-3.5 text-terracotta" aria-hidden="true" />
                    <h1
                      id="input-heading"
                      className="font-mono text-xs text-muted-foreground uppercase tracking-widest"
                    >
                      Submit idea
                    </h1>
                  </div>
                  <div className="border border-border rounded-sm p-4 bg-card">
                    <IdeaInput
                      value={idea}
                      category={category}
                      onIdeaChange={setIdea}
                      onCategoryChange={setCategory}
                      onSubmit={handleSubmit}
                      isLoading={isLoading}
                      showExamples={status === "idle"}
                    />
                  </div>
                </section>
              )}

              {/* ── Loading state ─────────────────────────────────────── */}
              <AnimatePresence mode="wait">
                {isLoading && (
                  <motion.section
                    key="loading"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.3 }}
                    aria-labelledby="loading-heading"
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_220px] gap-5">
                      <div className="border border-border rounded-sm bg-card overflow-hidden">
                        <LoadingOrchestrator
                          currentStage={loadingStage}
                          className="px-5"
                        />
                      </div>
                      <div className="border border-border rounded-sm bg-card p-4">
                        <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-3">
                          Stages
                        </p>
                        <WorkflowTimeline
                          status={status}
                          currentStage={loadingStage}
                        />
                      </div>
                    </div>
                  </motion.section>
                )}

                {/* ── Error state ───────────────────────────────────── */}
                {isError && (
                  <motion.section
                    key="error"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    aria-live="assertive"
                    aria-label="Analysis error"
                  >
                    <div className="border border-terracotta/30 rounded-sm bg-card p-5 flex gap-4">
                      <AlertTriangle
                        className="w-5 h-5 text-terracotta shrink-0 mt-0.5"
                        aria-hidden="true"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-display text-sm font-semibold text-foreground">
                          Analysis failed
                        </p>
                        <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                          {error}
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleSubmit}
                          className="mt-3 text-xs gap-1.5"
                        >
                          <RefreshCw className="w-3 h-3" />
                          Retry
                        </Button>
                      </div>
                    </div>
                  </motion.section>
                )}

                {/* ── Results ───────────────────────────────────────── */}
                {isCompleted && result && (
                  <motion.section
                    key="results"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    aria-label="Analysis results"
                  >
                    {/* Header Idea Title */}
                    <div className="mb-6">
                      <h2 className="text-2xl font-display font-semibold text-foreground">
                        {result.startupIdea || idea}
                      </h2>
                      <p className="text-sm text-muted-foreground font-mono uppercase tracking-widest mt-1">
                        {category}
                      </p>
                    </div>

                    {/* Scores Overview */}
                    {result.scores && (
                      <div className="border border-border rounded-sm bg-card p-4 mb-6">
                        <ScoresVisualizer scores={result.scores} />
                      </div>
                    )}

                    {/* Two panel layout */}
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
                      {/* Left Panel: Agent Tabs */}
                      <ErrorBoundary>
                        <div className="border border-border rounded-sm bg-card flex flex-col overflow-hidden h-[600px]">
                          <AgentTabs result={result} className="h-full" />
                        </div>
                      </ErrorBoundary>

                      {/* Right Panel: Artifacts */}
                      <ErrorBoundary>
                        <div className="border border-border rounded-sm bg-card flex flex-col overflow-hidden h-[600px]">
                          <ArtifactViewer result={result} className="h-full" />
                        </div>
                      </ErrorBoundary>
                    </div>
                  </motion.section>
                )}

                {/* ── Idle empty state ──────────────────────────────── */}
                {status === "idle" && (
                  <motion.div
                    key="idle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-center py-16"
                    aria-hidden="true"
                  >
                    <div className="inline-flex items-center justify-center w-12 h-12 border border-border rounded-sm mb-4">
                      <Cpu className="w-5 h-5 text-muted-foreground/40" />
                    </div>
                    <p className="font-display text-sm text-muted-foreground">
                      Enter a startup idea above to begin analysis.
                    </p>
                    <p className="text-xs text-muted-foreground/50 mt-1 font-mono">
                      30–60 seconds · 4 agents · 3 artefacts
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </main>


        </div>
      </div>

      <MobileNavigation />
    </div>
  );
}
