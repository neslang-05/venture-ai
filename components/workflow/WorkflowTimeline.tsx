"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Circle, Loader2 } from "lucide-react";
import { LOADING_STAGES } from "@/lib/constants";
import type { LoadingStage, WorkflowStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

interface WorkflowTimelineProps {
  status: WorkflowStatus;
  currentStage: LoadingStage;
  className?: string;
}

export function WorkflowTimeline({
  status,
  currentStage,
  className,
}: WorkflowTimelineProps) {
  if (status === "idle") return null;

  const currentIdx = LOADING_STAGES.findIndex((s) => s.id === currentStage);

  return (
    <div
      className={cn("space-y-0", className)}
      role="status"
      aria-label="Analysis workflow progress"
      aria-live="polite"
    >
      {LOADING_STAGES.map((stage, idx) => {
        const isDone = status === "completed" || idx < currentIdx;
        const isActive = idx === currentIdx && status === "loading";
        const isPending = idx > currentIdx && status === "loading";

        return (
          <motion.div
            key={stage.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.08, duration: 0.3 }}
            className={cn(
              "flex items-start gap-3 py-2.5",
              idx < LOADING_STAGES.length - 1 && "border-b border-border/50"
            )}
          >
            {/* Icon */}
            <div className="mt-0.5 shrink-0">
              {isDone ? (
                <CheckCircle2
                  className="w-4 h-4 text-ochre"
                  aria-label="Completed"
                />
              ) : isActive ? (
                <Loader2
                  className="w-4 h-4 text-terracotta animate-spin"
                  aria-label="In progress"
                />
              ) : (
                <Circle
                  className="w-4 h-4 text-border"
                  aria-label="Pending"
                />
              )}
            </div>

            {/* Label */}
            <div className="flex-1 min-w-0">
              <p
                className={cn(
                  "text-sm font-display font-medium leading-tight",
                  isDone
                    ? "text-muted-foreground line-through decoration-muted-foreground/40"
                    : isActive
                    ? "text-foreground"
                    : isPending
                    ? "text-muted-foreground/50"
                    : "text-muted-foreground"
                )}
              >
                {stage.label}
              </p>
              <AnimatePresence>
                {isActive && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-xs text-muted-foreground mt-0.5 leading-snug"
                  >
                    {stage.detail}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
