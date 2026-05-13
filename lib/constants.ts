import type { Agent, Artifact, LoadingStage, StartupCategory } from "./types";

// ─── App Meta ─────────────────────────────────────────────────────────────────

export const APP_NAME = "The Boardroom";
export const APP_TAGLINE = "Multi-Agent Startup Intelligence";
export const APP_DESCRIPTION =
  "A calm operating system for startup thinking. Submit an idea; watch CEO, CTO, Marketing, and Finance agents synthesise strategic intelligence.";

// ─── Categories ───────────────────────────────────────────────────────────────

export const CATEGORIES: { value: StartupCategory; label: string }[] = [
  { value: "AI", label: "Artificial Intelligence" },
  { value: "SaaS", label: "SaaS / Software" },
  { value: "Fintech", label: "Fintech" },
  { value: "Healthtech", label: "Healthtech" },
  { value: "Edtech", label: "Edtech" },
  { value: "Ecommerce", label: "E-commerce" },
  { value: "Climate", label: "Climate / Sustainability" },
  { value: "B2B", label: "B2B Enterprise" },
  { value: "B2C", label: "B2C Consumer" },
  { value: "DeepTech", label: "Deep Tech" },
  { value: "Other", label: "Other" },
];

// ─── Agents ───────────────────────────────────────────────────────────────────

export const AGENTS: Agent[] = [
  {
    id: "ceo",
    name: "Chief Executive",
    role: "CEO",
    description: "Strategic vision, market positioning, competitive landscape",
    accentColor: "var(--terracotta)",
    symbol: "01",
  },
  {
    id: "cto",
    name: "Chief Technology",
    role: "CTO",
    description: "Technical architecture, feasibility, build vs. buy decisions",
    accentColor: "var(--indigo-accent)",
    symbol: "02",
  },
  {
    id: "marketing",
    name: "Growth & Marketing",
    role: "CMO",
    description: "Go-to-market strategy, user acquisition, positioning",
    accentColor: "var(--ochre)",
    symbol: "03",
  },
  {
    id: "finance",
    name: "Finance & Viability",
    role: "CFO",
    description: "Unit economics, runway, revenue models, investor metrics",
    accentColor: "var(--saffron)",
    symbol: "04",
  },
  {
    id: "synthesis",
    name: "Executive Synthesis",
    role: "Board",
    description: "Cross-functional integration and executive recommendation",
    accentColor: "var(--foreground)",
    symbol: "⊕",
  },
];

// ─── Loading stages ───────────────────────────────────────────────────────────

export const LOADING_STAGES: {
  id: LoadingStage;
  label: string;
  detail: string;
  duration: number; // rough ms hint for animation
}[] = [
  {
    id: "ceo",
    label: "CEO analysing market viability",
    detail: "Strategic positioning and competitive landscape mapping…",
    duration: 10000,
  },
  {
    id: "cto",
    label: "CTO validating architecture",
    detail: "Technical feasibility, stack selection, and build paths…",
    duration: 9000,
  },
  {
    id: "marketing",
    label: "Marketing identifying growth vectors",
    detail: "Channel strategy, ICP definition, and messaging frameworks…",
    duration: 9000,
  },
  {
    id: "finance",
    label: "Finance calculating unit economics",
    detail: "Revenue modelling, burn rate, and investor-grade metrics…",
    duration: 9000,
  },
  {
    id: "synthesis",
    label: "Synthesising executive intelligence",
    detail: "Cross-functional integration and board-level recommendation…",
    duration: 8000,
  },
  {
    id: "artifacts",
    label: "Generating strategic artefacts",
    detail: "Pitch deck, roadmap, and budget documents being compiled…",
    duration: 6000,
  },
];

// ─── Artifacts ────────────────────────────────────────────────────────────────

export const ARTIFACTS: Artifact[] = [
  {
    id: "pitchDeck",
    label: "Pitch Deck",
    description: "Investor-ready narrative and slide structure",
  },
  {
    id: "roadmap",
    label: "Product Roadmap",
    description: "Phased development plan with milestones",
  },
  {
    id: "budget",
    label: "Financial Budget",
    description: "Cost breakdown and unit economics model",
  },
];

// ─── Example ideas ────────────────────────────────────────────────────────────

export const EXAMPLE_IDEAS: { idea: string; category: StartupCategory }[] = [
  {
    idea: "AI-powered vernacular language tutor for rural India using WhatsApp",
    category: "Edtech",
  },
  {
    idea: "Embedded finance platform for kiryana stores in tier-2 cities",
    category: "Fintech",
  },
  {
    idea: "B2B SaaS for automated GST reconciliation and compliance for SMEs",
    category: "SaaS",
  },
  {
    idea: "Precision agriculture drone network with crop disease AI for small farmers",
    category: "AI",
  },
  {
    idea: "Telemedicine platform specialising in mental health for college students",
    category: "Healthtech",
  },
];

// ─── Nav items ────────────────────────────────────────────────────────────────

export const NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/dashboard", label: "Analyse" },
];
