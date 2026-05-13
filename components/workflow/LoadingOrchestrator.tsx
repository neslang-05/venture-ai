"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LOADING_STAGES } from "@/lib/constants";
import type { LoadingStage } from "@/lib/types";
import { cn } from "@/lib/utils";

interface LoadingOrchestratorProps {
  currentStage: LoadingStage;
  className?: string;
}

const SHIMMER_LINES = [4, 6, 5, 7, 3] as const;

export function LoadingOrchestrator({
  currentStage,
  className,
}: LoadingOrchestratorProps) {
  const stage = LOADING_STAGES.find((s) => s.id === currentStage);
  const [dots, setDots] = useState(".");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setDots((d) => (d.length >= 3 ? "." : d + "."));
    }, 500);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div
      className={cn("space-y-8 py-8 px-2", className)}
      role="status"
      aria-label={stage ? stage.label : "Loading"}
      aria-live="polite"
    >
      {/* Stage indicator */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          {/* Pulsing dot */}
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-terracotta opacity-60" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-terracotta" />
          </span>
          <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest">
            Active
          </p>
        </div>

        <AnimatePresence mode="wait">
          {stage && (
            <motion.div
              key={stage.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            >
              <h2 className="font-display text-xl font-semibold text-foreground leading-tight">
                {stage.label}
                <span className="text-muted-foreground">{dots}</span>
              </h2>
              <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                {stage.detail}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Stage progress pills */}
      <div className="flex gap-1.5" aria-hidden="true">
        {LOADING_STAGES.map((s, i) => {
          const currentIdx = LOADING_STAGES.findIndex((ls) => ls.id === currentStage);
          const isDone = i < currentIdx;
          const isActive = i === currentIdx;
          return (
            <motion.div
              key={s.id}
              className={cn(
                "h-0.5 flex-1 rounded-full transition-colors duration-500",
                isDone ? "bg-ochre" : isActive ? "bg-terracotta" : "bg-border"
              )}
              animate={isActive ? { opacity: [0.5, 1, 0.5] } : {}}
              transition={isActive ? { repeat: Infinity, duration: 1.5 } : {}}
            />
          );
        })}
      </div>

      {/* Shimmer skeleton blocks */}
      <div className="space-y-4" aria-hidden="true">
        {SHIMMER_LINES.map((lines, blockIdx) => (
          <motion.div
            key={blockIdx}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: blockIdx * 0.1 }}
            className="space-y-2"
          >
            {Array.from({ length: lines }).map((_, lineIdx) => (
              <div
                key={lineIdx}
                className={cn(
                  "h-2.5 rounded-full bg-muted animate-pulse",
                  lineIdx === lines - 1 ? "w-3/5" : "w-full"
                )}
                style={{ animationDelay: `${(blockIdx * lines + lineIdx) * 60}ms` }}
              />
            ))}
          </motion.div>
        ))}
      </div>

      {/* Bottom hint */}
      <p className="text-xs text-muted-foreground/50 font-mono">
        Multi-agent orchestration in progress. This takes 30–60 seconds.
      </p>
    </div>
  );
}
