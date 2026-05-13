"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AGENTS } from "@/lib/constants";
import type { AgentId, AnalysisResult } from "@/lib/types";
import { AgentCard } from "./AgentCard";
import { AnalysisViewer } from "./AnalysisViewer";
import { cn } from "@/lib/utils";

interface AgentTabsProps {
  result: AnalysisResult;
  className?: string;
}

const AGENT_CONTENT_MAP: Record<AgentId, keyof AnalysisResult> = {
  ceo: "ceoAnalysis",
  cto: "ctoAnalysis",
  marketing: "marketingAnalysis",
  finance: "financeAnalysis",
  synthesis: "synthesis",
};

export function AgentTabs({ result, className }: AgentTabsProps) {
  const [activeId, setActiveId] = useState<AgentId>("ceo");
  const activeAgent = AGENTS.find((a) => a.id === activeId)!;
  const content = result[AGENT_CONTENT_MAP[activeId]];

  return (
    <div className={cn("flex flex-col gap-0 lg:flex-row lg:gap-6", className)}>
      {/* Left: Agent navigation */}
      <aside className="lg:w-56 shrink-0">
        <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-3 px-1">
          Agents
        </p>
        <nav aria-label="Agent analysis navigation" className="space-y-1">
          {AGENTS.map((agent) => (
            <AgentCard
              key={agent.id}
              agent={agent}
              content={result[AGENT_CONTENT_MAP[agent.id]]}
              isActive={activeId === agent.id}
              onClick={() => setActiveId(agent.id)}
            />
          ))}
        </nav>
      </aside>

      {/* Divider */}
      <div className="hidden lg:block w-px bg-border shrink-0" aria-hidden="true" />

      {/* Right: Content */}
      <main className="flex-1 min-w-0" aria-label={`${activeAgent.name} analysis`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeId}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="h-full"
          >
            <AnalysisViewer agent={activeAgent} content={content} />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
