// ─── Analysis Types ──────────────────────────────────────────────────────────

export type WorkflowStatus = "idle" | "loading" | "completed" | "error";

export type LoadingStage =
  | "ceo"
  | "cto"
  | "marketing"
  | "finance"
  | "synthesis"
  | "artifacts"
  | null;

export type StartupCategory =
  | "AI"
  | "SaaS"
  | "Fintech"
  | "Healthtech"
  | "Edtech"
  | "Ecommerce"
  | "Climate"
  | "B2B"
  | "B2C"
  | "DeepTech"
  | "Other";

export interface AnalysisRequest {
  idea: string;
  category: StartupCategory;
}

export interface AnalysisScores {
  severityScore: number;
  tamScore: number;
  whitespaceScore: number;
  frequencyScore: number;
  itchScore: number;
}

export interface AnalysisResult {
  startupIdea: string;
  ceoAnalysis: string;
  ctoAnalysis: string;
  marketingAnalysis: string;
  financeAnalysis: string;
  synthesis: string;
  pitchDeck: string;
  roadmap: string;
  budget: string;
  scores?: AnalysisScores;
}

export interface SavedAnalysis {
  id: string;
  idea: string;
  category: StartupCategory;
  createdAt: string;
  result: AnalysisResult;
}

// ─── API Types ────────────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: "success" | "error";
}

// ─── Agent Types ──────────────────────────────────────────────────────────────

export type AgentId = "ceo" | "cto" | "marketing" | "finance" | "synthesis";

export interface Agent {
  id: AgentId;
  name: string;
  role: string;
  description: string;
  accentColor: string;
  symbol: string;
}

// ─── Artifact Types ───────────────────────────────────────────────────────────

export type ArtifactId = "pitchDeck" | "roadmap" | "budget";

export interface Artifact {
  id: ArtifactId;
  label: string;
  description: string;
}
