"use client";

import type { ExportFile, ProjectState } from "@/types/state";
import { phaseById } from "@/content/phases";
import { getAllPhotos, putPhotos } from "./photos";
import { getProject, replaceProject } from "./store";

export function downloadFile(name: string, content: string, type: string) {
  const blob = new Blob([content], { type });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

const stamp = () => new Date().toISOString().slice(0, 10);

export async function exportProject(includePhotos: boolean) {
  const file: ExportFile = {
    app: "beldar-build-hq",
    exportedAt: new Date().toISOString(),
    state: getProject(),
    photos: includePhotos ? await getAllPhotos() : undefined,
  };
  downloadFile(`beldar-build-hq-${stamp()}.json`, JSON.stringify(file, null, 2), "application/json");
}

export async function applyImport(file: ExportFile) {
  if (file.photos?.length) await putPhotos(file.photos);
  replaceProject(file.state);
}

const resultText = { worked: "Worked", adjust: "Needs adjustment", rebuild: "Rebuild", retest: "Test again" } as const;

export function logToMarkdown(s: ProjectState) {
  const lines = ["# Beldar Build HQ — Build Log", "", `Exported ${new Date().toLocaleString()}`, ""];
  for (const e of s.log) {
    lines.push(`## ${new Date(e.date).toLocaleDateString()} — ${phaseById[e.phaseId]?.title ?? "General"}`);
    if (e.result) lines.push(`**Result:** ${resultText[e.result]}`, "");
    lines.push(e.note || "_(no note)_", "");
    if (e.issue) lines.push(`**Issue:** ${e.issue}`, "");
    if (e.nextAction) lines.push(`**Next action:** ${e.nextAction}`, "");
    if (e.photoIds.length) lines.push(`_${e.photoIds.length} photo(s) stored on device_`, "");
  }
  return lines.join("\n");
}

export function exportLogMarkdown() {
  downloadFile(`beldar-build-log-${stamp()}.md`, logToMarkdown(getProject()), "text/markdown");
}

export function exportLogJson() {
  downloadFile(`beldar-build-log-${stamp()}.json`, JSON.stringify(getProject().log, null, 2), "application/json");
}
