"use client";

import { motion } from "framer-motion";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";
import type { AnalysisScores } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ScoresVisualizerProps {
  scores: AnalysisScores;
  className?: string;
}

export function ScoresVisualizer({ scores, className }: ScoresVisualizerProps) {
  const chartData = [
    { subject: "Severity", A: scores.severityScore, fullMark: 10 },
    { subject: "TAM", A: scores.tamScore, fullMark: 10 },
    { subject: "Whitespace", A: scores.whitespaceScore, fullMark: 10 },
    { subject: "Frequency", A: scores.frequencyScore, fullMark: 10 },
  ];

  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-3 gap-6", className)}>
      {/* Chart Section */}
      <div className="md:col-span-1 border border-border rounded-sm bg-card p-4 flex flex-col items-center justify-center min-h-[250px]">
        <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest self-start w-full mb-2">
          Dimension Mapping
        </p>
        <div className="w-full h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
              <PolarGrid stroke="var(--border)" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: "var(--foreground)", fontSize: 10, fontFamily: "var(--font-mono)" }} />
              <PolarRadiusAxis angle={30} domain={[0, 10]} tick={false} axisLine={false} />
              <Radar
                name="Score"
                dataKey="A"
                stroke="var(--terracotta)"
                fill="var(--terracotta)"
                fillOpacity={0.3}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Metrics Section */}
      <div className="md:col-span-2 grid grid-cols-2 gap-4">
        {/* Main Itch Score */}
        <div className="col-span-2 border border-terracotta/30 bg-terracotta/5 rounded-sm p-5 flex items-center justify-between">
          <div>
            <h3 className="font-display text-lg font-semibold text-foreground">
              Total Validation Score
            </h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-sm">
              Composite viability metric based on severity, market size, competition, and frequency.
            </p>
          </div>
          <div className="relative w-24 h-24 flex items-center justify-center">
            {/* Simple SVG circle progress */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                className="text-border"
              />
              <motion.circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                strokeDasharray="251.2"
                strokeDashoffset={251.2 - (251.2 * scores.itchScore) / 100}
                className="text-terracotta transition-all duration-1000 ease-out"
                strokeLinecap="round"
                initial={{ strokeDashoffset: 251.2 }}
                animate={{ strokeDashoffset: 251.2 - (251.2 * scores.itchScore) / 100 }}
              />
            </svg>
            <span className="absolute font-mono text-2xl text-foreground">
              {scores.itchScore}
            </span>
          </div>
        </div>

        {/* 4 sub scores */}
        {[
          { label: "Severity Score", value: scores.severityScore },
          { label: "TAM Score", value: scores.tamScore },
          { label: "Whitespace Score", value: scores.whitespaceScore },
          { label: "Frequency Score", value: scores.frequencyScore },
        ].map((metric) => (
          <div key={metric.label} className="border border-border rounded-sm bg-card p-4">
            <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-2">
              {metric.label}
            </p>
            <p className="font-display text-2xl text-foreground">
              {metric.value} <span className="text-sm text-muted-foreground font-mono">/10</span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
