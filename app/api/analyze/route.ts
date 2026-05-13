import { NextRequest, NextResponse } from "next/server";
import type { AnalysisResult } from "@/lib/types";

// ─── Config ───────────────────────────────────────────────────────────────────

const AZURE_ENDPOINT = process.env.AZURE_AI_FOUNDRY_ENDPOINT?.replace(/\/$/, "") ?? "";
const AZURE_KEY = process.env.AZURE_AI_FOUNDRY_KEY ?? "";
const AZURE_MODEL = process.env.AZURE_AI_FOUNDRY_MODEL ?? "gpt-4o";
const API_VERSION = "2024-02-15-preview"; // Default API version for Azure OpenAI

const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL ?? "";

const TIMEOUT_MS = 120_000; // 120 s — LLM generation can take a while

// ─── System Prompt ────────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `You are a world-class Board of Experts for a prestigious startup incubator. Your goal is to analyze the provided startup idea and output a comprehensive strategic intelligence report.
You must act as four distinct roles:
1. CEO: Focus on strategic vision, market positioning, and competitive landscape.
2. CTO: Focus on technical architecture, feasibility, and build vs. buy decisions.
3. CMO (Marketing): Focus on go-to-market strategy, user acquisition, and positioning.
4. CFO (Finance): Focus on unit economics, runway, revenue models, and investor metrics.

Finally, act as the Board to synthesize the findings and provide actionable artifacts.

Output MUST be a valid JSON object strictly matching this schema:
{
  "startupIdea": "The original idea or a refined one-sentence version",
  "ceoAnalysis": "CEO's strategic analysis (markdown format)",
  "ctoAnalysis": "CTO's technical analysis (markdown format)",
  "marketingAnalysis": "CMO's marketing analysis (markdown format)",
  "financeAnalysis": "CFO's financial analysis (markdown format)",
  "synthesis": "Board's executive synthesis (markdown format)",
  "pitchDeck": "Suggested pitch deck slide structure (markdown format)",
  "roadmap": "Phased product roadmap (markdown format)",
  "budget": "High-level financial budget and unit economics (markdown format)"
}
Do not include any code blocks, markdown wrappers like \`\`\`json, or extra text around the JSON. Only return the raw JSON object.`;

// ─── Validation ───────────────────────────────────────────────────────────────

function isValidRequest(body: unknown): body is { idea: string; category: string } {
  if (typeof body !== "object" || body === null) return false;
  const b = body as Record<string, unknown>;
  return typeof b.idea === "string" && b.idea.trim().length > 0 && typeof b.category === "string";
}

function normalizeResult(raw: Record<string, unknown>): AnalysisResult {
  const str = (v: unknown) => (typeof v === "string" ? v : "");
  return {
    startupIdea: str(raw.startupIdea),
    ceoAnalysis: str(raw.ceoAnalysis),
    ctoAnalysis: str(raw.ctoAnalysis),
    marketingAnalysis: str(raw.marketingAnalysis),
    financeAnalysis: str(raw.financeAnalysis),
    synthesis: str(raw.synthesis),
    pitchDeck: str(raw.pitchDeck),
    roadmap: str(raw.roadmap),
    budget: str(raw.budget),
  };
}

// ─── POST handler ─────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  // 1. Parse body
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { status: "error", error: "Invalid JSON body." },
      { status: 400 }
    );
  }

  // 2. Validate
  if (!isValidRequest(body)) {
    return NextResponse.json(
      { status: "error", error: "Request must include a non-empty 'idea' and 'category' field." },
      { status: 400 }
    );
  }

  // 3. Route to N8N Webhook if configured
  if (N8N_WEBHOOK_URL) {
    console.log("Dispatching to N8N Webhook:", N8N_WEBHOOK_URL);
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

    try {
      const upstream = await fetch(N8N_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        signal: controller.signal,
      });
      clearTimeout(timer);

      if (!upstream.ok) {
        const text = await upstream.text().catch(() => "");
        console.error("N8N Error:", upstream.status, text);
        return NextResponse.json(
          { status: "error", error: `N8N inference error ${upstream.status}` },
          { status: 502 }
        );
      }

      const raw = await upstream.json();
      // Handle array from N8N lastNode, or direct object
      const payload = Array.isArray(raw) ? raw[0] : raw;

      if (payload?.status === "success" && payload?.data) {
        return NextResponse.json(payload);
      } else {
        // Fallback if data is raw
        return NextResponse.json({
          status: "success",
          data: normalizeResult(payload as Record<string, unknown>),
        });
      }
    } catch (err) {
      clearTimeout(timer);
      console.error("Failed to trigger n8n webhook:", err);
      return NextResponse.json(
        { status: "error", error: "Failed to reach N8N Webhook." },
        { status: 502 }
      );
    }
  }

  // 4. Direct Azure AI Foundry call fallback
  if (!AZURE_ENDPOINT || !AZURE_KEY) {
    return NextResponse.json(
      { status: "error", error: "Azure AI Foundry credentials are not configured. Set them in .env.local." },
      { status: 503 }
    );
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    console.log("Dispatching directly to Azure AI Foundry");
    let url = "";
    if (AZURE_ENDPOINT.includes("/v1")) {
      // It's likely an OpenAI-compatible endpoint. Do not append api-version.
      let base = AZURE_ENDPOINT;
      if (base.endsWith("/responses")) {
        // Normalize if copied from Azure Playground
        base = base.replace(/\/responses$/, "");
      }
      if (base.endsWith("/chat/completions")) {
        url = base;
      } else {
        url = `${base}/chat/completions`;
      }
    } else if (AZURE_ENDPOINT.endsWith("/chat/completions")) {
      // If user provided full endpoint
      url = AZURE_ENDPOINT;
    } else {
      // Standard Azure OpenAI format
      url = `${AZURE_ENDPOINT}/openai/deployments/${AZURE_MODEL}/chat/completions?api-version=${API_VERSION}`;
    }

    const upstream = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": AZURE_KEY,
      },
      body: JSON.stringify({
        model: AZURE_MODEL,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: `Analyze this ${body.category} startup idea: ${body.idea.trim()}` }
        ],
        temperature: 0.7,
        response_format: { type: "json_object" }
      }),
      signal: controller.signal,
    });
    clearTimeout(timer);

    if (!upstream.ok) {
      const text = await upstream.text().catch(() => "");
      console.error("Azure AI Foundry Error:", upstream.status, text);
      return NextResponse.json(
        { status: "error", error: `Azure inference error ${upstream.status}: ${text.slice(0, 200)}` },
        { status: 502 }
      );
    }

    const raw = await upstream.json();
    let content = raw.choices?.[0]?.message?.content || "{}";
    
    // Clean up potential markdown JSON wrapping just in case
    content = content.replace(/^\s*```json/i, '').replace(/```\s*$/i, '').trim();

    let payload;
    try {
      payload = JSON.parse(content);
    } catch (parseError) {
      console.error("Failed to parse JSON from LLM:", content);
      return NextResponse.json(
        { status: "error", error: "The model did not return valid JSON." },
        { status: 502 }
      );
    }

    return NextResponse.json({
      status: "success",
      data: normalizeResult(payload as Record<string, unknown>),
    });
  } catch (err) {
    clearTimeout(timer);
    if (err instanceof Error && err.name === "AbortError") {
      return NextResponse.json(
        { status: "error", error: "The model inference timed out after 120 seconds. Please try again." },
        { status: 504 }
      );
    }
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { status: "error", error: `Failed to reach Azure AI Foundry: ${message}` },
      { status: 502 }
    );
  }
}
