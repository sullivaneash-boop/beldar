import { gateById, gates, phases } from "@/content/phases";
import { materials } from "@/content/materials";
import { taskById, tasks } from "@/content/tasks";
import { outfitPieces } from "@/content/wardrobe";
import { alerts } from "@/content/warnings";
import { rehearsalChecks } from "@/content/cone";
import type { BudgetTierId, Material, Phase, Task } from "@/types/content";
import type { Assignee, PersonId, ProjectState } from "@/types/state";

export type TaskState = "done" | "skipped" | "available" | "locked";

export function isComplete(s: ProjectState, taskId: string) {
  return !!s.tasks[taskId];
}

export function gatePassed(s: ProjectState, gateId: string) {
  return s.gates[gateId]?.status === "passed";
}

export function lockReasons(s: ProjectState, task: Task): string[] {
  const reasons: string[] = [];
  for (const p of task.prerequisites) if (!isComplete(s, p)) reasons.push(taskById[p]?.title ?? p);
  for (const g of task.blockedByGates ?? []) if (!gatePassed(s, g)) reasons.push(`${gateById[g].code} — ${gateById[g].title}`);
  return reasons;
}

export function taskState(s: ProjectState, task: Task): TaskState {
  const rec = s.tasks[task.id];
  if (rec) return rec.status;
  return lockReasons(s, task).length ? "locked" : "available";
}

export function progress(s: ProjectState) {
  const done = tasks.filter((t) => isComplete(s, t.id)).length;
  return { done, total: tasks.length, pct: Math.round((done / tasks.length) * 100) };
}

export type PhaseStatus = "complete" | "active" | "ready" | "locked";

export function phaseProgress(s: ProjectState, phase: Phase) {
  const list = tasks.filter((t) => t.phaseId === phase.id);
  const done = list.filter((t) => isComplete(s, t.id)).length;
  const available = list.some((t) => taskState(s, t) === "available");
  const status: PhaseStatus = done === list.length ? "complete" : done > 0 ? "active" : available ? "ready" : "locked";
  return { done, total: list.length, pct: list.length ? Math.round((done / list.length) * 100) : 0, status };
}

export function currentPhase(s: ProjectState) {
  return phases.find((p) => phaseProgress(s, p).status !== "complete") ?? phases[phases.length - 1];
}

export function upNext(s: ProjectState, n = 5, person?: PersonId) {
  return tasks
    .filter((t) => taskState(s, t) === "available")
    .filter((t) => !person || assigneeFor(s, t) === person)
    .slice(0, n);
}

/** Effective assignee: explicit assignment, else the research role mapped to settings. */
export function assigneeFor(s: ProjectState, task: Task): Assignee {
  const explicit = s.assignments[task.id];
  if (explicit) return explicit;
  if (task.defaultRole === "helper") return s.settings.leadHelper;
  if (task.defaultRole === "wearer") return s.settings.wearer;
  return "unassigned";
}

export function roleAssignee(s: ProjectState, key: string, role: "wearer" | "helper" | "any"): Assignee {
  const explicit = s.assignments[key];
  if (explicit) return explicit;
  if (role === "helper") return s.settings.leadHelper;
  if (role === "wearer") return s.settings.wearer;
  return "unassigned";
}

export function nextGate(s: ProjectState) {
  return gates.find((g) => !gatePassed(s, g.id));
}

export function activeAlerts(s: ProjectState) {
  return alerts.filter((a) => {
    if (a.untilTaskId && isComplete(s, a.untilTaskId)) return false;
    if (a.untilGateId && gatePassed(s, a.untilGateId)) return false;
    return true;
  });
}

export function inTier(m: Material, tier: BudgetTierId) {
  return m.tiers.includes(tier);
}

/** Materials relevant to the selected tier: priced in it, or procedure items the tier needs. */
export function tierMaterials(tier: BudgetTierId) {
  return materials.filter((m) => inTier(m, tier) || (tier !== "budget" && m.tiers.length === 0));
}

export function budget(s: ProjectState) {
  const tier = s.settings.budgetTier;
  const planned = materials.filter((m) => inTier(m, tier) && s.materials[m.id]?.status !== "skip").reduce((a, m) => a + (m.estimate ?? 0), 0);
  const wardrobeLow = 45 + 25 + 20;
  const wardrobeHigh = 65 + 50 + 40;
  const spentMaterials = Object.values(s.materials).reduce((a, r) => a + (r.actual ?? 0), 0);
  const spentWardrobe = Object.values(s.wardrobe).reduce((a, r) => a + (r.actual ?? 0), 0);
  const spent = spentMaterials + spentWardrobe;
  const target = s.settings.targetBudget ?? planned + Math.round((wardrobeLow + wardrobeHigh) / 2);
  const unpriced = tierMaterials(tier).filter((m) => m.estimate === undefined).length;
  return { tier, planned, wardrobeLow, wardrobeHigh, spentMaterials, spentWardrobe, spent, target, remaining: target - spent, unpriced, targetIsCustom: s.settings.targetBudget !== null };
}

export function shopping(s: ProjectState) {
  const list = tierMaterials(s.settings.budgetTier).filter((m) => m.mustHave || s.materials[m.id]?.status);
  const counts = { need: 0, ordered: 0, received: 0, skip: 0 };
  for (const m of list) counts[s.materials[m.id]?.status ?? "need"]++;
  for (const p of outfitPieces.filter((p) => p.id !== "belt")) counts[s.wardrobe[p.id]?.status ?? "need"]++;
  return { ...counts, total: list.length + 3 };
}

export function daysUntil(dateISO: string, from = new Date()) {
  const [y, m, d] = dateISO.split("-").map(Number);
  const target = new Date(y, m - 1, d);
  const start = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  return Math.round((target.getTime() - start.getTime()) / 86_400_000);
}

export function rehearsalVerdict(s: ProjectState) {
  const answered = rehearsalChecks.filter((c) => s.rehearsal.answers[c.id]);
  const criticalFails = rehearsalChecks.filter((c) => c.critical && s.rehearsal.answers[c.id] === "fail");
  const otherIssues = rehearsalChecks.filter(
    (c) => (s.rehearsal.answers[c.id] === "fail" && !c.critical) || s.rehearsal.answers[c.id] === "minor",
  );
  const verdict: "GO" | "GO WITH FIXES" | "NO-GO" | null =
    answered.length < rehearsalChecks.length ? null : criticalFails.length ? "NO-GO" : otherIssues.length ? "GO WITH FIXES" : "GO";
  return { answered: answered.length, total: rehearsalChecks.length, criticalFails, otherIssues, verdict };
}

export function personName(s: ProjectState, who: Assignee) {
  return who === "unassigned" ? "Unassigned" : s.settings.people[who];
}
