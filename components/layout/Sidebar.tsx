"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Cpu,
  Settings,
  SunMedium,
  Moon,
  History,
  Trash2,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useAnalysisStore } from "@/store/analysis-store";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { truncate, formatDate, cn } from "@/lib/utils";
import { APP_NAME } from "@/lib/constants";

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  const { savedAnalyses, loadAnalysis, deleteAnalysis } = useAnalysisStore();

  useEffect(() => { setMounted(true); }, []);

  return (
    <motion.aside
      animate={{ width: collapsed ? 56 : 240 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
      className="relative hidden lg:block h-full shrink-0 z-20"
      aria-label="Sidebar navigation"
    >
      <div className="flex flex-col w-full h-full border-r border-border bg-sidebar overflow-hidden">
        {/* Top: Brand */}
      <div className="flex items-center gap-2 h-14 px-3 border-b border-border shrink-0">
        <div className="w-7 h-7 border border-terracotta rounded-sm flex items-center justify-center shrink-0" aria-hidden="true">
          <Cpu className="w-3.5 h-3.5 text-terracotta" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="font-display text-sm font-semibold text-foreground whitespace-nowrap"
            >
              {APP_NAME}
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Nav links */}
      <nav className="px-2 pt-3 space-y-0.5" aria-label="Main navigation">
        {[
          { href: "/", label: "Home" },
          { href: "/dashboard", label: "Analyse" },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-2 px-2 py-2 rounded-sm text-sm transition-colors duration-100",
              pathname === item.href
                ? "bg-accent text-foreground font-medium"
                : "text-muted-foreground hover:text-foreground hover:bg-accent"
            )}
            aria-current={pathname === item.href ? "page" : undefined}
          >
            <span
              className={cn(
                "w-1.5 h-1.5 rounded-full shrink-0",
                pathname === item.href ? "bg-terracotta" : "bg-border"
              )}
              aria-hidden="true"
            />
            <AnimatePresence>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  {item.label}
                </motion.span>
              )}
            </AnimatePresence>
          </Link>
        ))}
      </nav>

      <Separator className="my-3" />

      {/* Saved analyses */}
      {!collapsed && (
        <div className="flex-1 flex flex-col gap-2 px-2 min-h-0">
          <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest px-2">
            History
          </p>
          <ScrollArea className="flex-1">
            {savedAnalyses.length === 0 ? (
              <p className="text-xs text-muted-foreground/50 px-2 italic">
                No saved analyses yet.
              </p>
            ) : (
              <div className="space-y-0.5">
                {savedAnalyses.map((a) => (
                  <div
                    key={a.id}
                    className="group flex items-start gap-2 px-2 py-2 rounded-sm hover:bg-accent cursor-pointer transition-colors"
                    onClick={() => loadAnalysis(a)}
                    role="button"
                    tabIndex={0}
                    aria-label={`Load analysis: ${truncate(a.idea, 40)}`}
                    onKeyDown={(e) => e.key === "Enter" && loadAnalysis(a)}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-foreground leading-snug line-clamp-2">
                        {truncate(a.idea, 60)}
                      </p>
                      <p className="text-xs text-muted-foreground/60 mt-0.5 font-mono">
                        {a.category} · {formatDate(a.createdAt)}
                      </p>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); deleteAnalysis(a.id); }}
                      className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-opacity shrink-0 mt-0.5"
                      aria-label={`Delete analysis: ${truncate(a.idea, 30)}`}
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      )}

      {collapsed && (
        <div className="flex-1 flex flex-col items-center pt-2 gap-2">
          <History className="w-4 h-4 text-muted-foreground" aria-label="History" />
        </div>
      )}

      <Separator className="mt-auto" />

      {/* Bottom: Theme + Settings */}
      <div className="flex items-center justify-between px-3 py-2">
        <ThemeToggle />
        {!collapsed && (
          <Link
            href="#"
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Settings"
          >
            <Settings className="w-4 h-4" />
          </Link>
        )}
      </div>

      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed((p) => !p)}
        className={cn(
          "absolute -right-3 top-14 z-10 w-6 h-6 rounded-full",
          "border border-border bg-sidebar flex items-center justify-center",
          "text-muted-foreground hover:text-foreground transition-colors"
        )}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        aria-expanded={!collapsed}
      >
        {collapsed ? (
          <ChevronRight className="w-3.5 h-3.5" />
        ) : (
          <ChevronLeft className="w-3.5 h-3.5" />
        )}
      </button>
    </motion.aside>
  );
}
