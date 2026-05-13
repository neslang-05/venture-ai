import type { AnalysisRequest, AnalysisResult, ApiResponse } from "./types";

export async function analyzeStartup(
  request: AnalysisRequest,
  signal?: AbortSignal
): Promise<ApiResponse<AnalysisResult>> {
  try {
    const response = await fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
      signal,
    });

    const json = await response.json();

    if (!response.ok) {
      return {
        status: "error",
        error: json.error ?? `Request failed with status ${response.status}`,
      };
    }

    return { status: "success", data: json.data };
  } catch (err) {
    if (err instanceof Error) {
      if (err.name === "AbortError") {
        return { status: "error", error: "Request was cancelled." };
      }
      return { status: "error", error: err.message };
    }
    return { status: "error", error: "An unexpected error occurred." };
  }
}
