"use client";

import { motion } from "framer-motion";
import { wordCount } from "@/lib/utils";
import type { Agent } from "@/lib/types";
import { cn } from "@/lib/utils";

interface AgentCardProps {
  agent: Agent;
  content: string;
  isActive?: boolean;
  onClick?: () => void;
  className?: string;
}

export function AgentCard({
  agent,
  content,
  isActive,
  onClick,
  className,
}: AgentCardProps) {
  const wc = wordCount(content);
  const hasContent = content.trim().length > 0;

  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.1 }}
      aria-pressed={isActive}
      aria-label={`${agent.name} analysis${hasContent ? `, ${wc} words` : ""}`}
      className={cn(
        "w-full text-left rounded-sm border transition-all duration-150 p-3 group",
        isActive
          ? "border-border bg-accent"
          : "border-transparent bg-transparent hover:border-border hover:bg-accent/50",
        className
      )}
    >
      <div className="flex items-start gap-3">
        {/* Symbol badge */}
        <div
          className="shrink-0 w-8 h-8 flex items-center justify-center rounded-sm border"
          style={{
            borderColor: agent.accentColor,
            color: agent.accentColor,
          }}
          aria-hidden="true"
        >
          <span className="font-mono text-xs font-medium">{agent.symbol}</span>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline justify-between gap-1">
            <p
              className="font-display text-sm font-semibold text-foreground leading-tight truncate"
            >
              {agent.name}
            </p>
            <span
              className="text-xs font-mono shrink-0"
              style={{ color: agent.accentColor }}
            >
              {agent.role}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5 leading-snug line-clamp-2">
            {agent.description}
          </p>
          {hasContent && (
            <p className="text-xs text-muted-foreground/60 mt-1 font-mono">
              {wc} words
            </p>
          )}
          {!hasContent && (
            <p className="text-xs text-muted-foreground/40 mt-1 italic">
              Pending…
            </p>
          )}
        </div>
      </div>
    </motion.button>
  );
}
