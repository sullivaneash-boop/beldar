"use client";

import type { Assignee, BuildLogEntry, ItemRecord, MakeupTest, Measurements, ProjectState, RehearsalAnswer, Settings } from "@/types/state";
import { uid } from "@/lib/id";
import { updateProject } from "./store";

const now = () => new Date().toISOString();

function omit<T extends Record<string, unknown>>(obj: T, key: string): T {
  const next = { ...obj };
  delete next[key];
  return next;
}

export const actions = {
  setTask(id: string, status: "done" | "skipped" | "todo", override = false) {
    updateProject((s) => ({
      ...s,
      tasks: status === "todo" ? omit(s.tasks, id) : { ...s.tasks, [id]: { status, at: now(), override: override || undefined } },
    }));
  },
  assign(key: string, who: Assignee) {
    updateProject((s) => ({ ...s, assignments: who === "unassigned" ? omit(s.assignments, key) : { ...s.assignments, [key]: who } }));
  },
  setTaskNote(id: string, note: string) {
    updateProject((s) => ({ ...s, taskNotes: note ? { ...s.taskNotes, [id]: note } : omit(s.taskNotes, id) }));
  },
  setGate(id: string, status: "passed" | "failed" | "pending", note?: string) {
    updateProject((s) => ({
      ...s,
      gates: status === "pending" ? omit(s.gates, id) : { ...s.gates, [id]: { status, at: now(), note } },
    }));
  },
  setMaterial(id: string, patch: Partial<ItemRecord>) {
    updateProject((s) => ({ ...s, materials: { ...s.materials, [id]: { ...s.materials[id], ...patch } } }));
  },
  setWardrobe(id: string, patch: Partial<ItemRecord>) {
    updateProject((s) => ({ ...s, wardrobe: { ...s.wardrobe, [id]: { ...s.wardrobe[id], ...patch } } }));
  },
  setMeasurement(key: keyof Measurements, value: number | undefined) {
    updateProject((s) => ({ ...s, measurements: { ...s.measurements, [key]: value } }));
  },
  setSettings(patch: Partial<Settings>) {
    updateProject((s) => ({ ...s, settings: { ...s.settings, ...patch } }));
  },
  setPersonName(id: keyof Settings["people"], name: string) {
    updateProject((s) => ({ ...s, settings: { ...s.settings, people: { ...s.settings.people, [id]: name } } }));
  },
  addMakeupTest(test: Omit<MakeupTest, "id" | "date">) {
    updateProject((s) => ({ ...s, makeupTests: [{ ...test, id: uid(), date: now() }, ...s.makeupTests] }));
  },
  removeMakeupTest(id: string) {
    updateProject((s) => ({ ...s, makeupTests: s.makeupTests.filter((t) => t.id !== id) }));
  },
  addLog(entry: Omit<BuildLogEntry, "id">) {
    updateProject((s) => ({ ...s, log: [{ ...entry, id: uid() }, ...s.log] }));
  },
  updateLog(id: string, patch: Partial<BuildLogEntry>) {
    updateProject((s) => ({ ...s, log: s.log.map((e) => (e.id === id ? { ...e, ...patch } : e)) }));
  },
  removeLog(id: string) {
    updateProject((s) => ({ ...s, log: s.log.filter((e) => e.id !== id) }));
  },
  toggleHalloweenStep(id: string) {
    updateProject((s) => {
      const steps = s.halloween.steps[id] ? omit(s.halloween.steps, id) : { ...s.halloween.steps, [id]: now() };
      return { ...s, halloween: { ...s.halloween, steps, startedAt: s.halloween.startedAt ?? now() } };
    });
  },
  resetHalloween() {
    updateProject((s) => ({ ...s, halloween: { steps: {} } }));
  },
  startRehearsal() {
    updateProject((s) => ({ ...s, rehearsal: { ...s.rehearsal, startedAt: now(), completedAt: undefined } }));
  },
  answerRehearsal(id: string, answer: RehearsalAnswer | undefined) {
    updateProject((s) => ({
      ...s,
      rehearsal: { ...s.rehearsal, answers: answer ? { ...s.rehearsal.answers, [id]: answer } : omit(s.rehearsal.answers, id) },
    }));
  },
  setRehearsalNotes(notes: string) {
    updateProject((s) => ({ ...s, rehearsal: { ...s.rehearsal, notes } }));
  },
  completeRehearsal() {
    updateProject((s) => ({ ...s, rehearsal: { ...s.rehearsal, completedAt: now() } }));
  },
  resetRehearsal() {
    updateProject((s) => ({ ...s, rehearsal: { answers: {}, notes: "" } }));
  },
};

export type Actions = typeof actions;
export type { ProjectState };
