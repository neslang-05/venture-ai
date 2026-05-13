"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Lightbulb } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { CategorySelector } from "./CategorySelector";
import { EXAMPLE_IDEAS } from "@/lib/constants";
import type { StartupCategory } from "@/lib/types";
import { cn } from "@/lib/utils";

const MIN_LENGTH = 20;
const MAX_LENGTH = 600;

interface IdeaInputProps {
  value: string;
  category: StartupCategory;
  onIdeaChange: (idea: string) => void;
  onCategoryChange: (category: StartupCategory) => void;
  onSubmit: () => void;
  isLoading?: boolean;
  className?: string;
  showExamples?: boolean;
}

export function IdeaInput({
  value,
  category,
  onIdeaChange,
  onCategoryChange,
  onSubmit,
  isLoading,
  className,
  showExamples = false,
}: IdeaInputProps) {
  const [showingExamples, setShowingExamples] = useState(false);
  const isValid = value.trim().length >= MIN_LENGTH;
  const remaining = MAX_LENGTH - value.length;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter" && isValid && !isLoading) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <div className={cn("space-y-3", className)}>
      {/* Idea textarea */}
      <div className="relative">
        <Textarea
          id="startup-idea"
          value={value}
          onChange={(e) => onIdeaChange(e.target.value.slice(0, MAX_LENGTH))}
          onKeyDown={handleKeyDown}
          placeholder="Describe your startup idea in detail. The more specific, the richer the analysis."
          rows={4}
          disabled={isLoading}
          aria-label="Startup idea"
          aria-describedby="idea-hint"
          className={cn(
            "resize-none bg-muted border-border text-foreground placeholder:text-muted-foreground",
            "text-sm leading-relaxed font-sans p-4",
            "focus-visible:ring-1 focus-visible:ring-ring focus-visible:border-ring",
            "transition-colors duration-150",
            !isValid && value.length > 0 && "border-terracotta/50"
          )}
        />
        {/* Char count */}
        <span
          id="idea-hint"
          className={cn(
            "absolute bottom-3 right-3 text-xs tabular-nums",
            remaining < 50 ? "text-saffron" : "text-muted-foreground"
          )}
          aria-live="polite"
        >
          {remaining}
        </span>
      </div>

      {/* Category + Submit row */}
      <div className="flex gap-2">
        <CategorySelector
          value={category}
          onChange={onCategoryChange}
          disabled={isLoading}
          className="w-48 shrink-0"
        />
        <Button
          id="submit-analysis"
          onClick={onSubmit}
          disabled={!isValid || isLoading}
          className={cn(
            "flex-1 h-11 font-display font-medium tracking-wide text-sm",
            "bg-foreground text-background hover:bg-foreground/90",
            "transition-all duration-150",
            "disabled:opacity-40"
          )}
          aria-label="Analyse startup idea"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span className="inline-block w-4 h-4 border border-current border-t-transparent rounded-full animate-spin" aria-hidden="true" />
              Analysing…
            </span>
          ) : (
            <span className="flex items-center gap-2">
              Analyse
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </span>
          )}
        </Button>
      </div>

      {/* Keyboard hint */}
      <p className="text-xs text-muted-foreground">
        Press{" "}
        <kbd className="font-mono text-xs border border-border px-1 py-0.5 rounded-sm">
          ⌘ Enter
        </kbd>{" "}
        to submit.
      </p>

      {/* Example ideas */}
      {showExamples && (
        <div>
          <button
            onClick={() => setShowingExamples((p) => !p)}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
            aria-expanded={showingExamples}
            aria-controls="example-ideas"
          >
            <Lightbulb className="w-3.5 h-3.5" aria-hidden="true" />
            {showingExamples ? "Hide" : "Show"} example ideas
          </button>
          <AnimatePresence>
            {showingExamples && (
              <motion.ul
                id="example-ideas"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="mt-2 space-y-1.5 overflow-hidden"
              >
                {EXAMPLE_IDEAS.map((ex, i) => (
                  <li key={i}>
                    <button
                      onClick={() => {
                        onIdeaChange(ex.idea);
                        onCategoryChange(ex.category);
                        setShowingExamples(false);
                      }}
                      className={cn(
                        "w-full text-left text-xs text-muted-foreground",
                        "border border-border rounded-sm px-3 py-2",
                        "hover:border-border/60 hover:text-foreground hover:bg-accent",
                        "transition-colors duration-100"
                      )}
                    >
                      <span className="text-ochre font-mono mr-1.5">{ex.category}</span>
                      {ex.idea}
                    </button>
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
