"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MarkdownRenderer } from "@/components/shared/MarkdownRenderer";
import { ARTIFACTS } from "@/lib/constants";
import type { ArtifactId, AnalysisResult } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ArtifactViewerProps {
  result: AnalysisResult;
  className?: string;
}

const ARTIFACT_KEY_MAP: Record<ArtifactId, keyof AnalysisResult> = {
  pitchDeck: "pitchDeck",
  roadmap: "roadmap",
  budget: "budget",
};

export function ArtifactViewer({ result, className }: ArtifactViewerProps) {
  const [activeId, setActiveId] = useState<ArtifactId>("pitchDeck");

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {/* Header */}
      <div className="pb-3 border-b border-border">
        <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-1">
          Strategic Artefacts
        </p>
        <p className="text-muted-foreground text-xs">
          AI-generated documents ready for refinement.
        </p>
      </div>

      <Tabs
        value={activeId}
        onValueChange={(v) => setActiveId(v as ArtifactId)}
        className="flex flex-col gap-4"
      >
        <TabsList
          className="h-auto p-0 bg-transparent border-b border-border rounded-none gap-0"
          aria-label="Artefact type"
        >
          {ARTIFACTS.map((artifact) => (
            <TabsTrigger
              key={artifact.id}
              value={artifact.id}
              className={cn(
                "rounded-none border-b-2 border-transparent px-3 py-2",
                "text-xs font-display font-medium text-muted-foreground",
                "data-[state=active]:border-terracotta data-[state=active]:text-foreground",
                "hover:text-foreground transition-colors duration-150"
              )}
            >
              {artifact.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {ARTIFACTS.map((artifact) => (
          <TabsContent
            key={artifact.id}
            value={artifact.id}
            className="mt-0"
            tabIndex={-1}
          >
            <AnimatePresence mode="wait">
              {activeId === artifact.id && (
                <motion.div
                  key={artifact.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2 }}
                >
                  <p className="text-xs text-muted-foreground mb-3">
                    {artifact.description}
                  </p>
                  <ScrollArea className="h-[calc(100vh-24rem)]">
                    <MarkdownRenderer
                      content={result[ARTIFACT_KEY_MAP[artifact.id]]}
                    />
                  </ScrollArea>
                </motion.div>
              )}
            </AnimatePresence>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
