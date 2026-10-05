/**
 * Canonical content types. Everything in /content is version-controlled
 * research transformed from BELDAR_RESEARCH.md. User progress lives
 * separately in lib/state (see types/state.ts).
 */

/** Evidence labels. Preserve the research's own confidence wording. */
export type Confidence =
  | "confirmed"
  | "strongly-supported"
  | "likely"
  | "estimated"
  | "diy-recommendation"
  | "requires-prototyping"
  | "research-gap";

export type HelperRole = "wearer" | "helper" | "any";

export type SourceCategory =
  | "film-reference"
  | "wardrobe"
  | "prosthetics"
  | "manufacturer"
  | "sfx-technique"
  | "shopping"
  | "reference-image"
  | "community";

export type Reliability = "primary" | "manufacturer" | "professional" | "retail" | "community" | "tangential";

export type Source = {
  /** Matches the citation number in BELDAR_RESEARCH.md ("s13" = [13]). */
  id: string;
  n: number;
  title: string;
  publisher: string;
  url: string;
  category: SourceCategory;
  reliability: Reliability;
  supports: string;
};

export type Warning = {
  id: string;
  level: "critical" | "caution";
  title: string;
  body: string;
  sourceIds: string[];
};

export type Phase = {
  id: string;
  slug: string;
  order: number;
  code: string;
  title: string;
  description: string;
  goal: string;
  /** Comfortable-schedule target date (research "Build Timeline"), ISO. */
  targetDate?: string;
  scheduleNote?: string;
  estimatedDuration: string;
  budgetNote: string;
  materialIds: string[];
  helper: string;
  completionCriteria: string[];
  mistakes: string[];
  gateIds: string[];
  /** Phase may be skipped under the accelerated schedule. */
  skippable?: string;
  sourceIds: string[];
};

export type Task = {
  id: string;
  /** Research master checklist ID ("001"…"016") when it maps 1:1. */
  checklistId?: string;
  phaseId: string;
  title: string;
  summary: string;
  why: string;
  instructions: string[];
  measurement?: string;
  prerequisites: string[];
  /** Decision gates that must be passed before this task can be done. */
  blockedByGates?: string[];
  materialIds: string[];
  toolIds: string[];
  durationLabel: string;
  durationMinutes?: number;
  costLabel?: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  helper: "required" | "recommended" | "solo";
  defaultRole?: HelperRole;
  warningIds?: string[];
  watchOut: string[];
  completionCriteria: string[];
  confidence?: Confidence;
  sourceIds: string[];
  referenceLink?: { label: string; url: string };
};

export type DecisionGate = {
  id: string;
  code: string;
  title: string;
  criteria: string;
  /** Plain-language "don't do X until" rule. */
  rule: string;
  blocksTaskIds: string[];
  evidenceTaskIds: string[];
  origin: string;
  sourceIds: string[];
};

export type MaterialCategory =
  | "structure"
  | "adhesive"
  | "cap"
  | "paint"
  | "skin-care"
  | "removal"
  | "tools"
  | "prototype"
  | "application"
  | "safety";

export type BudgetTierId = "budget" | "recommended" | "deluxe";

export type Material = {
  id: string;
  name: string;
  purpose: string;
  qty: string;
  spec: string;
  category: MaterialCategory;
  /** Research tier tables this item is priced in. Empty = only referenced in a procedure. */
  tiers: BudgetTierId[];
  mustHave: boolean;
  consumable: boolean;
  /** Research estimate in USD; undefined when the research gives no price. */
  estimate?: number;
  retailer?: string;
  preferred?: string;
  alternative?: string;
  warning?: string;
  searchPhrase: string;
  usedIn: string[];
  sourceIds: string[];
  note?: string;
};

export type BudgetTier = {
  id: BudgetTierId;
  title: string;
  description: string;
  method: string;
  recommended: boolean;
};

export type CompatibilityRow = {
  a: string;
  b: string;
  status: "recommended" | "avoid";
  note: string;
  sourceIds: string[];
};

export type OutfitPiece = {
  id: string;
  name: string;
  spec: string[];
  colors: string[];
  fabric: string;
  brands: string[];
  fit?: string;
  searchPhrases: string[];
  priceRange?: string;
  ease?: string;
  confidence: Confidence;
  tracks: { exact: string; vintage: string; modern: string };
  sourceIds: string[];
};

export type Outfit = {
  id: string;
  name: string;
  context: string;
  reference: string;
  confidence: Confidence;
  recognizability: number;
  difficulty: number;
  practicality: number;
  primary: boolean;
  summary: string;
  pieceIds: string[];
  researched: boolean;
  sourceIds: string[];
};

export type MakeupSection = {
  id: string;
  order: number;
  title: string;
  stage: string;
  zones: string[];
  products: string[];
  steps: string[];
  watchOut?: string[];
  confidence?: Confidence;
  sourceIds: string[];
};

export type PaintZone = {
  id: string;
  label: string;
  color: string;
  pattern: "solid" | "stipple" | "lines" | "dots" | "highlight" | "hatch";
  description: string;
  product: string;
};

export type ApplicationStep = {
  id: string;
  stage: "prep" | "cap" | "cone" | "blend" | "paint" | "wardrobe" | "final" | "kit" | "leave";
  /** Minutes before party start (T-minus). */
  tMinus: number;
  durationMinutes: number;
  title: string;
  detail: string;
  role: HelperRole;
  safety?: string;
  taskId?: string;
  origin: "research" | "app";
  sourceIds: string[];
};

export type FailureMode = {
  id: string;
  symptom: string;
  aliases: string[];
  cause: string;
  immediateFix: string;
  permanentFix: string;
  prevention?: string;
  rebuild: "no" | "yes" | "replace-garment" | "maybe";
  taskIds: string[];
  confidence: Confidence;
  sourceIds: string[];
};

export type SurvivalCard = {
  id: string;
  title: string;
  prompt: string;
  tone: "urgent" | "normal";
  icon: string;
  steps: string[];
  doNot?: string[];
  gap?: string;
  sourceIds: string[];
};

export type SafetySection = {
  id: string;
  title: string;
  items: { text: string; level: "critical" | "caution" | "info"; sourceIds: string[] }[];
};

export type RehearsalCheck = {
  id: string;
  area: string;
  question: string;
  checkpoint: 15 | 30 | 60 | 120;
  /** A "fail" on a critical check produces NO-GO. */
  critical: boolean;
  failAdvice: string;
  sourceIds: string[];
};

export type MeasurementDef = {
  id: "circumference" | "foreheadWidth" | "earToEar" | "height" | "topRadius";
  symbol?: string;
  label: string;
  how: string;
  defaultValue?: number;
  range?: [number, number];
  confidence: Confidence;
  usedInFormula: boolean;
  sourceIds: string[];
};

export type ReferenceFact = {
  label: string;
  value: string;
  confidence: Confidence;
  note?: string;
  sourceIds: string[];
};

export type Alert = {
  id: string;
  text: string;
  level: "critical" | "caution";
  /** Alert is hidden once this task is done or gate passed. */
  untilTaskId?: string;
  untilGateId?: string;
  href: string;
};
