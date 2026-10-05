"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { actions } from "@/lib/state/actions";
import { useHydrated, useProject } from "@/lib/state/store";
import { makeupSections } from "@/content/makeup";
import type { LogResult } from "@/types/state";
import { PhotoPicker, PhotoThumb } from "./photos";

export const resultLabels: Record<LogResult, { label: string; cls: string }> = {
  worked: { label: "Worked", cls: "border-ok bg-ok-bg text-ok" },
  adjust: { label: "Needs adjustment", cls: "border-caution bg-caution-bg text-caution" },
  rebuild: { label: "Rebuild", cls: "border-signal bg-signal-bg text-signal" },
  retest: { label: "Test again", cls: "border-denim bg-paper-2 text-denim" },
};

export function ResultPicker({ value, onChange }: { value?: LogResult; onChange: (r: LogResult) => void }) {
  return (
    <div role="radiogroup" aria-label="Result" className="flex flex-wrap gap-1.5">
      {(Object.keys(resultLabels) as LogResult[]).map((r) => (
        <button
          key={r}
          type="button"
          role="radio"
          aria-checked={value === r}
          onClick={() => onChange(r)}
          className={cn("min-h-10 rounded-full border px-3 text-sm font-medium", value === r ? resultLabels[r].cls + " border-2" : "border-rule text-ink-2 hover:bg-paper-2")}
        >
          {resultLabels[r].label}
        </button>
      ))}
    </div>
  );
}

export function MakeupTests() {
  const s = useProject();
  const hydrated = useHydrated();
  const [form, setForm] = useState({ sectionId: "base", product: "", mixture: "", notes: "", result: "retest" as LogResult, photoIds: [] as string[] });

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_1.2fr]">
      <form
        className="flex flex-col gap-3 rounded-lg border-2 border-ink bg-card p-4"
        onSubmit={(e) => {
          e.preventDefault();
          if (!form.product && !form.notes && !form.mixture) return;
          actions.addMakeupTest(form);
          setForm({ ...form, product: "", mixture: "", notes: "", photoIds: [] });
        }}
      >
        <h3 className="font-display text-xl font-bold uppercase">Log a practice test</h3>
        <label className="text-sm">
          <span className="text-ink-3">Section</span>
          <select value={form.sectionId} onChange={(e) => setForm({ ...form, sectionId: e.target.value })} className="mt-1 h-11 w-full rounded-md border border-rule-strong bg-paper px-2">
            {makeupSections.map((m) => (
              <option key={m.id} value={m.id}>
                {m.title}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm">
          <span className="text-ink-3">Product used</span>
          <input value={form.product} onChange={(e) => setForm({ ...form, product: e.target.value })} className="mt-1 h-11 w-full rounded-md border border-rule-strong bg-paper px-2" placeholder="e.g. Pros-Aide No-Tack + Liquitex" />
        </label>
        <label className="text-sm">
          <span className="text-ink-3">Mixture / ratio</span>
          <input value={form.mixture} onChange={(e) => setForm({ ...form, mixture: e.target.value })} className="mt-1 h-11 w-full rounded-md border border-rule-strong bg-paper px-2" placeholder="e.g. 1:1, 6 parts white : 1 ochre : drop sienna" />
        </label>
        <label className="text-sm">
          <span className="text-ink-3">Notes</span>
          <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={3} className="mt-1 w-full rounded-md border border-rule-strong bg-paper p-2" />
        </label>
        <ResultPicker value={form.result} onChange={(r) => setForm({ ...form, result: r })} />
        <div className="flex flex-wrap gap-2">
          {form.photoIds.map((id) => (
            <PhotoThumb key={id} id={id} onRemove={() => setForm((f) => ({ ...f, photoIds: f.photoIds.filter((p) => p !== id) }))} />
          ))}
        </div>
        <PhotoPicker onAdd={(id) => setForm((f) => ({ ...f, photoIds: [...f.photoIds, id] }))} />
        <button type="submit" className="min-h-12 rounded-md bg-ink font-semibold text-paper">
          Save test
        </button>
      </form>

      <div>
        <p className="label-caps mb-2 text-ink-3">Test history (this device)</p>
        {!hydrated || s.makeupTests.length === 0 ? (
          <p className="rounded-lg border border-dashed border-rule-strong p-6 text-center text-ink-2">No practice tests logged yet. Prototype 2 is the place to start.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {s.makeupTests.map((t) => (
              <li key={t.id} className="rounded-lg border border-rule bg-card p-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold">{makeupSections.find((m) => m.id === t.sectionId)?.title ?? t.sectionId}</p>
                    <p className="font-mono text-xs text-ink-3">{new Date(t.date).toLocaleString()}</p>
                  </div>
                  <span className={cn("rounded-full border px-2 py-0.5 text-xs font-semibold", resultLabels[t.result].cls)}>{resultLabels[t.result].label}</span>
                </div>
                {t.product ? <p className="mt-1 text-sm"><span className="text-ink-3">Product:</span> {t.product}</p> : null}
                {t.mixture ? <p className="text-sm"><span className="text-ink-3">Mix:</span> {t.mixture}</p> : null}
                {t.notes ? <p className="mt-1 text-sm text-ink-2">{t.notes}</p> : null}
                {t.photoIds.length ? (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {t.photoIds.map((id) => (
                      <PhotoThumb key={id} id={id} />
                    ))}
                  </div>
                ) : null}
                <button type="button" onClick={() => actions.removeMakeupTest(t.id)} className="mt-2 inline-flex min-h-9 items-center gap-1 text-sm text-ink-3 hover:text-signal">
                  <Trash2 className="size-3.5" /> Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
