"use client";

import { MarkdownRenderer } from "@/components/shared/MarkdownRenderer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import type { Agent } from "@/lib/types";
import { cn } from "@/lib/utils";

interface AnalysisViewerProps {
  agent: Agent;
  content: string;
  isLoading?: boolean;
  className?: string;
}

export function AnalysisViewer({
  agent,
  content,
  isLoading,
  className,
}: AnalysisViewerProps) {
  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {/* Header */}
      <div className="flex items-center gap-3 pb-3 border-b border-border">
        <div
          className="w-1 h-8 rounded-full shrink-0"
          style={{ backgroundColor: agent.accentColor }}
          aria-hidden="true"
        />
        <div>
          <h2 className="font-display text-base font-semibold text-foreground leading-tight">
            {agent.name}
          </h2>
          <p className="text-xs text-muted-foreground">{agent.description}</p>
        </div>
        <span
          className="ml-auto font-mono text-xs border border-current px-2 py-0.5 rounded-sm"
          style={{ color: agent.accentColor }}
        >
          {agent.role}
        </span>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="space-y-3" aria-label="Loading analysis">
          {[80, 100, 65, 90, 75, 100, 55].map((w, i) => (
            <Skeleton
              key={i}
              className="h-3 rounded-full"
              style={{ width: `${w}%`, animationDelay: `${i * 50}ms` }}
            />
          ))}
        </div>
      ) : (
        <ScrollArea className="h-[calc(100vh-22rem)] pr-2">
          <MarkdownRenderer content={content} />
        </ScrollArea>
      )}
    </div>
  );
}
