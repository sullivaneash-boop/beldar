"use client";

import { useRef, useState } from "react";
import { Download, Moon, Monitor, Sun, Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { actions } from "@/lib/state/actions";
import { resetProject, useHydrated, useProject, useStorageError } from "@/lib/state/store";
import { clearPhotos } from "@/lib/state/photos";
import { applyImport, exportProject } from "@/lib/state/transfer";
import { parseImport, type ImportResult } from "@/lib/state/validate";
import { budgetTiers } from "@/content/materials";
import { outfits } from "@/content/wardrobe";
import type { PersonId, Settings } from "@/types/state";
import { SafetyAlert } from "./primitives";

function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <label className="block">
      <span className="text-sm font-medium">{label}</span>
      <div className="mt-1">{children}</div>
      {hint ? <span className="mt-1 block text-xs text-ink-3">{hint}</span> : null}
    </label>
  );
}
const input = "h-11 w-full rounded-md border border-rule-strong bg-paper px-3";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-rule bg-card p-4 sm:p-5">
      <h2 className="mb-4 font-display text-2xl font-bold uppercase">{title}</h2>
      {children}
    </section>
  );
}

function Toggle<T extends string>({ value, options, onChange, label }: { value: T; options: [T, string, React.ReactNode?][]; onChange: (v: T) => void; label: string }) {
  return (
    <div role="radiogroup" aria-label={label} className="flex flex-wrap gap-1.5">
      {options.map(([v, l, icon]) => (
        <button
          key={v}
          type="button"
          role="radio"
          aria-checked={value === v}
          onClick={() => onChange(v)}
          className={cn("inline-flex min-h-11 items-center gap-1.5 rounded-md border px-3 text-sm", value === v ? "border-ink bg-ink text-paper" : "border-rule hover:border-ink")}
        >
          {icon}
          {l}
        </button>
      ))}
    </div>
  );
}

export function SettingsPanel() {
  const s = useProject();
  const hydrated = useHydrated();
  const storageError = useStorageError();
  const set = (patch: Partial<Settings>) => actions.setSettings(patch);
  const st = s.settings;
  const [includePhotos, setIncludePhotos] = useState(true);
  const [pending, setPending] = useState<ImportResult | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  if (!hydrated) return <p className="text-ink-3">Loading local settings…</p>;
  const persons = Object.keys(st.people) as PersonId[];

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      {storageError ? (
        <SafetyAlert level="critical" title="This browser isn't saving data" className="lg:col-span-2">
          Storage is full or blocked (private browsing?). Export a backup now.
        </SafetyAlert>
      ) : null}

      <Section title="Crew">
        <div className="grid gap-3 sm:grid-cols-3">
          {persons.map((id) => (
            <Field key={id} label={`Helper ${persons.indexOf(id) + 1}`}>
              <input key={st.people[id]} defaultValue={st.people[id]} maxLength={40} onBlur={(e) => e.target.value.trim() && actions.setPersonName(id, e.target.value.trim())} className={input} />
            </Field>
          ))}
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <Field label="Wearer" hint="Gets 'Wearer' steps in Halloween Mode by default.">
            <select value={st.wearer} onChange={(e) => set({ wearer: e.target.value as PersonId })} className={input}>
              {persons.map((id) => (
                <option key={id} value={id}>
                  {st.people[id]}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Helper 1 (lead helper)" hint="Gets helper-required steps (glue, melt, paint) by default.">
            <select value={st.leadHelper} onChange={(e) => set({ leadHelper: e.target.value as PersonId })} className={input}>
              {persons.map((id) => (
                <option key={id} value={id}>
                  {st.people[id]}
                </option>
              ))}
            </select>
          </Field>
        </div>
      </Section>

      <Section title="Mission parameters">
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Halloween date">
            <input type="date" value={st.halloweenDate} onChange={(e) => e.target.value && set({ halloweenDate: e.target.value })} className={input} />
          </Field>
          <Field label="Party start time" hint="Halloween Mode counts back from this.">
            <input type="time" value={st.partyStart} onChange={(e) => e.target.value && set({ partyStart: e.target.value })} className={input} />
          </Field>
          <Field label="Outfit">
            <select value={st.outfitId} onChange={(e) => set({ outfitId: e.target.value })} className={input}>
              {outfits.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Build tier">
            <select value={st.budgetTier} onChange={(e) => set({ budgetTier: e.target.value as Settings["budgetTier"] })} className={input}>
              {budgetTiers.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.title}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Target budget ($)" hint="Leave blank to use the research estimate.">
            <input
              key={String(st.targetBudget)}
              inputMode="decimal"
              defaultValue={st.targetBudget ?? ""}
              onBlur={(e) => {
                const n = parseFloat(e.target.value.replace(/[$,]/g, ""));
                set({ targetBudget: Number.isFinite(n) && n > 0 ? n : null });
              }}
              className={input}
            />
          </Field>
          <Field label="Measurement units">
            <Toggle label="Units" value={st.units} onChange={(units) => set({ units })} options={[["in", "Inches"], ["cm", "Centimeters"]]} />
          </Field>
        </div>
      </Section>

      <Section title="Display">
        <div className="flex flex-col gap-4">
          <Field label="Theme">
            <Toggle
              label="Theme"
              value={st.theme}
              onChange={(theme) => set({ theme })}
              options={[
                ["system", "System", <Monitor key="m" className="size-4" />],
                ["light", "Day shift", <Sun key="s" className="size-4" />],
                ["dark", "Night shift", <Moon key="d" className="size-4" />],
              ]}
            />
          </Field>
          <Field label="Motion" hint="'System' follows your device's reduced-motion setting.">
            <Toggle label="Motion" value={st.motion} onChange={(motion) => set({ motion })} options={[["system", "System"], ["reduce", "Reduce motion"]]} />
          </Field>
          <Field label="Glue mode" hint="Huge buttons and press-and-hold completion in the Guided Build.">
            <Toggle label="Glue mode" value={st.glueMode ? "on" : "off"} onChange={(v) => set({ glueMode: v === "on" })} options={[["off", "Off"], ["on", "Hands covered in glue"]]} />
          </Field>
        </div>
      </Section>

      <Section title="Backup & restore">
        <p className="text-sm text-ink-2">
          All progress lives only in this browser on this device — no account, no server, no analytics. Export regularly, and import the file on another phone to
          share the project state.
        </p>
        <label className="mt-3 inline-flex min-h-10 items-center gap-2 text-sm">
          <input type="checkbox" checked={includePhotos} onChange={(e) => setIncludePhotos(e.target.checked)} className="size-4 accent-[var(--ink)]" />
          Include photos (bigger file)
        </label>
        <div className="mt-2 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={async () => {
              await exportProject(includePhotos);
              setMessage("Exported. Keep the file somewhere safe.");
            }}
            className="inline-flex min-h-11 items-center gap-2 rounded-md bg-ink px-4 font-semibold text-paper"
          >
            <Download className="size-4" /> Export project data
          </button>
          <button type="button" onClick={() => fileRef.current?.click()} className="inline-flex min-h-11 items-center gap-2 rounded-md border-2 border-ink px-4 font-semibold">
            <Upload className="size-4" /> Import project data
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            className="sr-only"
            onChange={async (e) => {
              const f = e.target.files?.[0];
              e.target.value = "";
              if (!f) return;
              if (f.size > 60 * 1024 * 1024) {
                setPending({ ok: false, error: "That file is over 60 MB — too large to be a project export." });
                return;
              }
              setPending(parseImport(await f.text()));
            }}
          />
        </div>
        {pending ? (
          pending.ok ? (
            <div className="mt-3 rounded-md border-2 border-caution bg-caution-bg p-3 text-sm">
              <p className="font-semibold">Replace this device&apos;s project with the imported file?</p>
              <p className="mt-1">
                It contains {pending.summary.join(", ")}
                {pending.file.exportedAt ? ` (exported ${new Date(pending.file.exportedAt).toLocaleString()})` : ""}.
              </p>
              <div className="mt-2 flex gap-2">
                <button
                  type="button"
                  className="min-h-10 rounded-md bg-ink px-3 font-semibold text-paper"
                  onClick={async () => {
                    await applyImport(pending.file);
                    setPending(null);
                    setMessage("Import complete.");
                  }}
                >
                  Replace & import
                </button>
                <button type="button" className="min-h-10 rounded-md px-3 hover:bg-paper" onClick={() => setPending(null)}>
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <SafetyAlert level="caution" title="Import failed" className="mt-3">
              {pending.error}
            </SafetyAlert>
          )
        ) : null}
        {message ? (
          <p role="status" className="mt-3 text-sm font-medium text-ok">
            {message}
          </p>
        ) : null}
      </Section>

      <Section title="Reset">
        <p className="text-sm text-ink-2">Resetting can&apos;t be undone. Export first.</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              if (confirm("Clear all progress, prices, notes, tests and log entries? Names and settings are kept.")) {
                resetProject(true);
                setMessage("Progress reset.");
              }
            }}
            className="min-h-11 rounded-md border-2 border-signal px-4 font-semibold text-signal hover:bg-signal-bg"
          >
            Reset progress
          </button>
          <button
            type="button"
            onClick={async () => {
              if (confirm("Erase EVERYTHING on this device, including settings and photos?")) {
                resetProject(false);
                await clearPhotos().catch(() => {});
                setMessage("Everything erased.");
              }
            }}
            className="min-h-11 rounded-md bg-signal px-4 font-semibold text-paper"
          >
            Erase all data
          </button>
        </div>
      </Section>
    </div>
  );
}
