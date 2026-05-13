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
  const content = String(result[AGENT_CONTENT_MAP[activeId]] || "");

  return (
    <div className={cn("flex flex-col h-full", className)}>
      <div className="flex items-center gap-4 overflow-x-auto border-b border-border hide-scrollbar">
        {AGENTS.map((agent) => {
          const isActive = activeId === agent.id;
          return (
            <button
              key={agent.id}
              onClick={() => setActiveId(agent.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-3 text-xs font-display font-medium whitespace-nowrap transition-colors relative",
                isActive 
                  ? "text-foreground bg-accent/50" 
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/30"
              )}
            >
              <span className="font-mono text-xs opacity-70">{agent.symbol}</span>
              {agent.name}
              {isActive && (
                <motion.div
                  layoutId="activeAgentTab"
                  className="absolute top-0 left-0 right-0 h-[2px] bg-foreground"
                />
              )}
            </button>
          );
        })}
      </div>

      <main className="flex-1 min-w-0 mt-4 h-full overflow-y-auto" aria-label={`${activeAgent.name} analysis`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeId}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <AnalysisViewer agent={activeAgent} content={content} />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
