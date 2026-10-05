"use client";

import { useState } from "react";
import { Download, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { actions } from "@/lib/state/actions";
import { useHydrated, useProject } from "@/lib/state/store";
import { currentPhase } from "@/lib/derive";
import { exportLogJson, exportLogMarkdown } from "@/lib/state/transfer";
import { phaseById, phases } from "@/content/phases";
import type { LogResult } from "@/types/state";
import { ResultPicker, resultLabels } from "./makeup-tests";
import { PhotoPicker, PhotoThumb } from "./photos";

export function BuildLog() {
  const s = useProject();
  const hydrated = useHydrated();
  const [phaseId, setPhaseId] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [issue, setIssue] = useState("");
  const [nextAction, setNextAction] = useState("");
  const [result, setResult] = useState<LogResult | undefined>();
  const [photoIds, setPhotoIds] = useState<string[]>([]);
  const effectivePhase = phaseId ?? (hydrated ? currentPhase(s).id : phases[0].id);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.3fr]">
      <form
        className="flex flex-col gap-3 self-start rounded-lg border-2 border-ink bg-card p-4"
        onSubmit={(e) => {
          e.preventDefault();
          if (!note.trim() && !result) return;
          actions.addLog({ date: new Date().toISOString(), phaseId: effectivePhase, note: note.trim(), result, issue: issue.trim() || undefined, nextAction: nextAction.trim() || undefined, photoIds });
          setNote("");
          setIssue("");
          setNextAction("");
          setResult(undefined);
          setPhotoIds([]);
        }}
      >
        <h2 className="font-display text-2xl font-bold uppercase">New entry</h2>
        <label className="text-sm">
          <span className="text-ink-3">Phase</span>
          <select value={effectivePhase} onChange={(e) => setPhaseId(e.target.value)} className="mt-1 h-11 w-full rounded-md border border-rule-strong bg-paper px-2">
            {phases.map((p) => (
              <option key={p.id} value={p.id}>
                {p.code} {p.title}
              </option>
            ))}
          </select>
        </label>
        <div>
          <p className="mb-1 text-sm text-ink-3">Quick result</p>
          <ResultPicker value={result} onChange={setResult} />
        </div>
        <label className="text-sm">
          <span className="text-ink-3">What happened</span>
          <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={3} className="mt-1 w-full rounded-md border border-rule-strong bg-paper p-2" />
        </label>
        <label className="text-sm">
          <span className="text-ink-3">Issue (optional)</span>
          <input value={issue} onChange={(e) => setIssue(e.target.value)} className="mt-1 h-11 w-full rounded-md border border-rule-strong bg-paper px-2" />
        </label>
        <label className="text-sm">
          <span className="text-ink-3">Next action (optional)</span>
          <input value={nextAction} onChange={(e) => setNextAction(e.target.value)} className="mt-1 h-11 w-full rounded-md border border-rule-strong bg-paper px-2" />
        </label>
        <div className="flex flex-wrap gap-2">
          {photoIds.map((id) => (
            <PhotoThumb key={id} id={id} onRemove={() => setPhotoIds((p) => p.filter((x) => x !== id))} />
          ))}
        </div>
        <PhotoPicker onAdd={(id) => setPhotoIds((p) => [...p, id])} />
        <button type="submit" className="min-h-12 rounded-md bg-ink font-semibold text-paper">
          Save entry
        </button>
      </form>

      <div>
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <p className="label-caps flex-1 text-ink-3">{hydrated ? s.log.length : 0} entries · stored on this device</p>
          <button type="button" onClick={exportLogMarkdown} className="inline-flex min-h-10 items-center gap-1.5 rounded-md border border-rule bg-card px-3 text-sm hover:border-ink">
            <Download className="size-4" /> Markdown
          </button>
          <button type="button" onClick={exportLogJson} className="inline-flex min-h-10 items-center gap-1.5 rounded-md border border-rule bg-card px-3 text-sm hover:border-ink">
            <Download className="size-4" /> JSON
          </button>
        </div>
        {!hydrated || s.log.length === 0 ? (
          <p className="rounded-lg border border-dashed border-rule-strong p-8 text-center text-ink-2">No log entries yet. Fabrication schedule nominal.</p>
        ) : (
          <ol className="relative flex flex-col gap-3 border-l-2 border-rule pl-4">
            {s.log.map((e) => (
              <li key={e.id} className="relative rounded-lg border border-rule bg-card p-3">
                <span className="absolute top-4 -left-[1.4rem] size-3 rotate-45 border-2 border-ink bg-paper" aria-hidden />
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-mono text-xs text-ink-3">
                    {new Date(e.date).toLocaleString()} · {phaseById[e.phaseId]?.code} {phaseById[e.phaseId]?.title}
                  </p>
                  {e.result ? <span className={cn("rounded-full border px-2 py-0.5 text-xs font-semibold", resultLabels[e.result].cls)}>{resultLabels[e.result].label}</span> : null}
                </div>
                {e.note ? <p className="mt-1 whitespace-pre-wrap">{e.note}</p> : null}
                {e.issue ? <p className="mt-1 text-sm"><span className="font-semibold text-signal">Issue:</span> {e.issue}</p> : null}
                {e.nextAction ? <p className="mt-1 text-sm"><span className="font-semibold">Next:</span> {e.nextAction}</p> : null}
                {e.photoIds.length ? (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {e.photoIds.map((id) => (
                      <PhotoThumb key={id} id={id} />
                    ))}
                  </div>
                ) : null}
                <button
                  type="button"
                  onClick={() => confirm("Delete this log entry?") && actions.removeLog(e.id)}
                  className="mt-1 inline-flex min-h-9 items-center gap-1 text-sm text-ink-3 hover:text-signal"
                >
                  <Trash2 className="size-3.5" /> Delete
                </button>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}
