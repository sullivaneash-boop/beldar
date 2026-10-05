import { projectMeta } from "@/content/meta";
import { SCHEMA_VERSION, type ProjectState } from "@/types/state";

export function createDefaultState(): ProjectState {
  return {
    schemaVersion: SCHEMA_VERSION,
    updatedAt: new Date(0).toISOString(),
    settings: {
      people: { sully: "Sully", mom: "Mom", sister: "Sister" },
      wearer: "sully",
      leadHelper: "mom",
      halloweenDate: projectMeta.defaultHalloween,
      partyStart: projectMeta.defaultPartyStart,
      outfitId: "fireworks",
      targetBudget: null,
      budgetTier: "recommended",
      units: "in",
      motion: "system",
      theme: "system",
      glueMode: false,
    },
    tasks: {},
    assignments: {},
    taskNotes: {},
    gates: {},
    materials: {},
    wardrobe: {},
    measurements: {},
    makeupTests: [],
    halloween: { steps: {} },
    rehearsal: { answers: {}, notes: "" },
    log: [],
  };
}

/** Frozen default used as the server snapshot so SSR and hydration agree. */
export const DEFAULT_STATE: ProjectState = createDefaultState();
