import type { BudgetTierId } from "./content";

/**
 * User project state — everything the family changes. Stored locally
 * (localStorage + IndexedDB for photos) and import/exportable as JSON.
 * Canonical research content never lives here, so research updates
 * don't erase progress.
 */
export const SCHEMA_VERSION = 1;

export type PersonId = "sully" | "mom" | "sister";
export type Assignee = PersonId | "unassigned";

export type ShopStatus = "need" | "ordered" | "received" | "skip";
export type LogResult = "worked" | "adjust" | "rebuild" | "retest";
export type RehearsalAnswer = "pass" | "minor" | "fail";

export type Settings = {
  people: Record<PersonId, string>;
  wearer: PersonId;
  leadHelper: PersonId;
  halloweenDate: string;
  partyStart: string;
  outfitId: string;
  targetBudget: number | null;
  budgetTier: BudgetTierId;
  units: "in" | "cm";
  motion: "system" | "reduce";
  theme: "system" | "light" | "dark";
  glueMode: boolean;
};

export type TaskRecord = { status: "done" | "skipped"; at: string; override?: boolean };
export type GateRecord = { status: "passed" | "failed"; at: string; note?: string };
export type ItemRecord = {
  status?: ShopStatus;
  actual?: number;
  qty?: string;
  url?: string;
  retailer?: string;
  notes?: string;
  track?: "exact" | "vintage" | "modern";
};

export type Measurements = {
  circumference?: number;
  foreheadWidth?: number;
  earToEar?: number;
  height?: number;
  topRadius?: number;
  weightOz?: number;
};

export type MakeupTest = {
  id: string;
  date: string;
  sectionId: string;
  product: string;
  mixture: string;
  result: LogResult;
  notes: string;
  photoIds: string[];
};

export type BuildLogEntry = {
  id: string;
  date: string;
  phaseId: string;
  note: string;
  result?: LogResult;
  issue?: string;
  nextAction?: string;
  photoIds: string[];
};

export type ProjectState = {
  schemaVersion: number;
  updatedAt: string;
  settings: Settings;
  tasks: Record<string, TaskRecord>;
  assignments: Record<string, Assignee>;
  taskNotes: Record<string, string>;
  gates: Record<string, GateRecord>;
  materials: Record<string, ItemRecord>;
  wardrobe: Record<string, ItemRecord>;
  measurements: Measurements;
  makeupTests: MakeupTest[];
  halloween: { steps: Record<string, string>; startedAt?: string };
  rehearsal: { startedAt?: string; completedAt?: string; answers: Record<string, RehearsalAnswer>; notes: string };
  log: BuildLogEntry[];
};

export type ExportFile = {
  app: "beldar-build-hq";
  exportedAt: string;
  state: ProjectState;
  photos?: { id: string; dataUrl: string; createdAt: string }[];
};
