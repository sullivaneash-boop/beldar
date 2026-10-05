import { SCHEMA_VERSION, type ExportFile, type ProjectState } from "@/types/state";
import { uid } from "@/lib/id";
import { createDefaultState } from "./defaults";

type Obj = Record<string, unknown>;
const isObj = (v: unknown): v is Obj => typeof v === "object" && v !== null && !Array.isArray(v);
const str = (v: unknown, fallback = "") => (typeof v === "string" ? v : fallback);
const num = (v: unknown) => (typeof v === "number" && Number.isFinite(v) ? v : undefined);
const oneOf = <T extends string>(v: unknown, options: readonly T[], fallback: T): T =>
  typeof v === "string" && (options as readonly string[]).includes(v) ? (v as T) : fallback;

function record<T>(v: unknown, map: (x: unknown) => T | undefined): Record<string, T> {
  const out: Record<string, T> = {};
  if (!isObj(v)) return out;
  for (const [k, x] of Object.entries(v)) {
    const m = map(x);
    if (m !== undefined) out[k] = m;
  }
  return out;
}

function itemRecord(x: unknown) {
  if (!isObj(x)) return undefined;
  return {
    status: x.status === undefined ? undefined : oneOf(x.status, ["need", "ordered", "received", "skip"] as const, "need"),
    actual: num(x.actual),
    qty: typeof x.qty === "string" ? x.qty : undefined,
    url: typeof x.url === "string" ? x.url : undefined,
    retailer: typeof x.retailer === "string" ? x.retailer : undefined,
    notes: typeof x.notes === "string" ? x.notes : undefined,
    track: x.track === undefined ? undefined : oneOf(x.track, ["exact", "vintage", "modern"] as const, "vintage"),
  };
}

const results = ["worked", "adjust", "rebuild", "retest"] as const;

/**
 * Coerce unknown JSON into a valid ProjectState, filling gaps with defaults.
 * Unknown keys are dropped. Used for both localStorage loads and imports.
 */
export function normalizeState(input: unknown): ProjectState {
  const d = createDefaultState();
  if (!isObj(input)) return d;
  const s = isObj(input.settings) ? input.settings : {};
  const people = isObj(s.people) ? s.people : {};
  const persons = ["sully", "mom", "sister"] as const;
  const m = isObj(input.measurements) ? input.measurements : {};
  const h = isObj(input.halloween) ? input.halloween : {};
  const r = isObj(input.rehearsal) ? input.rehearsal : {};

  return {
    schemaVersion: SCHEMA_VERSION,
    updatedAt: str(input.updatedAt, d.updatedAt),
    settings: {
      people: {
        sully: str(people.sully, d.settings.people.sully).slice(0, 40) || d.settings.people.sully,
        mom: str(people.mom, d.settings.people.mom).slice(0, 40) || d.settings.people.mom,
        sister: str(people.sister, d.settings.people.sister).slice(0, 40) || d.settings.people.sister,
      },
      wearer: oneOf(s.wearer, persons, d.settings.wearer),
      leadHelper: oneOf(s.leadHelper, persons, d.settings.leadHelper),
      halloweenDate: /^\d{4}-\d{2}-\d{2}$/.test(str(s.halloweenDate)) ? str(s.halloweenDate) : d.settings.halloweenDate,
      partyStart: /^\d{2}:\d{2}$/.test(str(s.partyStart)) ? str(s.partyStart) : d.settings.partyStart,
      outfitId: str(s.outfitId, d.settings.outfitId),
      targetBudget: num(s.targetBudget) ?? null,
      budgetTier: oneOf(s.budgetTier, ["budget", "recommended", "deluxe"] as const, d.settings.budgetTier),
      units: oneOf(s.units, ["in", "cm"] as const, d.settings.units),
      motion: oneOf(s.motion, ["system", "reduce"] as const, d.settings.motion),
      theme: oneOf(s.theme, ["system", "light", "dark"] as const, d.settings.theme),
      glueMode: s.glueMode === true,
    },
    tasks: record(input.tasks, (x) =>
      isObj(x) && (x.status === "done" || x.status === "skipped")
        ? { status: x.status, at: str(x.at, new Date().toISOString()), override: x.override === true || undefined }
        : undefined,
    ),
    assignments: record(input.assignments, (x) =>
      typeof x === "string" && ["sully", "mom", "sister", "unassigned"].includes(x) ? (x as ProjectState["assignments"][string]) : undefined,
    ),
    taskNotes: record(input.taskNotes, (x) => (typeof x === "string" ? x : undefined)),
    gates: record(input.gates, (x) =>
      isObj(x) && (x.status === "passed" || x.status === "failed")
        ? { status: x.status, at: str(x.at, new Date().toISOString()), note: typeof x.note === "string" ? x.note : undefined }
        : undefined,
    ),
    materials: record(input.materials, itemRecord),
    wardrobe: record(input.wardrobe, itemRecord),
    measurements: {
      circumference: num(m.circumference),
      foreheadWidth: num(m.foreheadWidth),
      earToEar: num(m.earToEar),
      height: num(m.height),
      topRadius: num(m.topRadius),
      weightOz: num(m.weightOz),
    },
    makeupTests: Array.isArray(input.makeupTests)
      ? input.makeupTests.filter(isObj).map((t) => ({
          id: str(t.id, uid()),
          date: str(t.date, new Date().toISOString()),
          sectionId: str(t.sectionId),
          product: str(t.product),
          mixture: str(t.mixture),
          result: oneOf(t.result, results, "retest"),
          notes: str(t.notes),
          photoIds: Array.isArray(t.photoIds) ? t.photoIds.filter((p): p is string => typeof p === "string") : [],
        }))
      : [],
    halloween: {
      steps: record(h.steps, (x) => (typeof x === "string" ? x : undefined)),
      startedAt: typeof h.startedAt === "string" ? h.startedAt : undefined,
    },
    rehearsal: {
      startedAt: typeof r.startedAt === "string" ? r.startedAt : undefined,
      completedAt: typeof r.completedAt === "string" ? r.completedAt : undefined,
      answers: record(r.answers, (x) => (x === "pass" || x === "minor" || x === "fail" ? x : undefined)),
      notes: str(r.notes),
    },
    log: Array.isArray(input.log)
      ? input.log.filter(isObj).map((e) => ({
          id: str(e.id, uid()),
          date: str(e.date, new Date().toISOString()),
          phaseId: str(e.phaseId),
          note: str(e.note),
          result: e.result === undefined ? undefined : oneOf(e.result, results, "retest"),
          issue: typeof e.issue === "string" ? e.issue : undefined,
          nextAction: typeof e.nextAction === "string" ? e.nextAction : undefined,
          photoIds: Array.isArray(e.photoIds) ? e.photoIds.filter((p): p is string => typeof p === "string") : [],
        }))
      : [],
  };
}

export type ImportResult =
  | { ok: true; file: ExportFile; summary: string[] }
  | { ok: false; error: string };

/** Validate an import with plain-language errors. */
export function parseImport(text: string): ImportResult {
  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch {
    return { ok: false, error: "That file isn't valid JSON. Pick the .json file that Beldar Build HQ exported." };
  }
  if (!isObj(raw)) return { ok: false, error: "The file is JSON, but it's not a project export (expected an object)." };
  if (raw.app !== "beldar-build-hq" || !isObj(raw.state)) {
    return { ok: false, error: "This JSON doesn't look like a Beldar Build HQ export — it's missing the project data section." };
  }
  const version = num(raw.state.schemaVersion);
  if (version === undefined) return { ok: false, error: "The export has no data version, so it can't be safely restored." };
  if (version > SCHEMA_VERSION) {
    return { ok: false, error: `This export is from a newer version of the app (data v${version}; this app reads up to v${SCHEMA_VERSION}). Update the app, then import again.` };
  }
  const state = normalizeState(raw.state);
  const photos = Array.isArray(raw.photos)
    ? raw.photos.filter(isObj).filter((p) => typeof p.id === "string" && typeof p.dataUrl === "string" && p.dataUrl.startsWith("data:image/"))
        .map((p) => ({ id: p.id as string, dataUrl: p.dataUrl as string, createdAt: str(p.createdAt, new Date().toISOString()) }))
    : undefined;
  const done = Object.values(state.tasks).filter((t) => t.status === "done").length;
  return {
    ok: true,
    file: { app: "beldar-build-hq", exportedAt: str(raw.exportedAt), state, photos },
    summary: [
      `${done} completed task${done === 1 ? "" : "s"}`,
      `${Object.keys(state.materials).length} material records`,
      `${state.log.length} build log entr${state.log.length === 1 ? "y" : "ies"}`,
      photos?.length ? `${photos.length} photo${photos.length === 1 ? "" : "s"}` : "no photos",
    ],
  };
}
