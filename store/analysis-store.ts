import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  AnalysisResult,
  LoadingStage,
  SavedAnalysis,
  StartupCategory,
  WorkflowStatus,
} from "@/lib/types";
import { generateId } from "@/lib/utils";

interface AnalysisState {
  // ── Current request ───────────────────────────────────────────────────────
  idea: string;
  category: StartupCategory;
  // ── Workflow state ────────────────────────────────────────────────────────
  status: WorkflowStatus;
  loadingStage: LoadingStage;
  error: string | null;
  // ── Result ────────────────────────────────────────────────────────────────
  result: AnalysisResult | null;
  // ── History ───────────────────────────────────────────────────────────────
  savedAnalyses: SavedAnalysis[];
  // ── Actions ───────────────────────────────────────────────────────────────
  setIdea: (idea: string) => void;
  setCategory: (category: StartupCategory) => void;
  setStatus: (status: WorkflowStatus) => void;
  setLoadingStage: (stage: LoadingStage) => void;
  setError: (error: string | null) => void;
  setResult: (result: AnalysisResult) => void;
  saveCurrentAnalysis: () => void;
  deleteAnalysis: (id: string) => void;
  loadAnalysis: (analysis: SavedAnalysis) => void;
  reset: () => void;
}

const initialState = {
  idea: "",
  category: "AI" as StartupCategory,
  status: "idle" as WorkflowStatus,
  loadingStage: null as LoadingStage,
  error: null,
  result: null,
};

export const useAnalysisStore = create<AnalysisState>()(
  persist(
    (set, get) => ({
      ...initialState,
      savedAnalyses: [],

      setIdea: (idea) => set({ idea }),
      setCategory: (category) => set({ category }),
      setStatus: (status) => set({ status }),
      setLoadingStage: (loadingStage) => set({ loadingStage }),
      setError: (error) => set({ error }),
      setResult: (result) => set({ result }),

      saveCurrentAnalysis: () => {
        const { idea, category, result, savedAnalyses } = get();
        if (!result) return;
        const analysis: SavedAnalysis = {
          id: generateId(),
          idea,
          category,
          createdAt: new Date().toISOString(),
          result,
        };
        set({ savedAnalyses: [analysis, ...savedAnalyses].slice(0, 20) });
      },

      deleteAnalysis: (id) =>
        set((state) => ({
          savedAnalyses: state.savedAnalyses.filter((a) => a.id !== id),
        })),

      loadAnalysis: (analysis) =>
        set({
          idea: analysis.idea,
          category: analysis.category,
          result: analysis.result,
          status: "completed",
          error: null,
          loadingStage: null,
        }),

      reset: () => set({ ...initialState }),
    }),
    {
      name: "ceo-simulator-analysis",
      partialize: (state) => ({ savedAnalyses: state.savedAnalyses }),
    }
  )
);
