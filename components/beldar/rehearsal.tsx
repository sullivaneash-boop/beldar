"use client";

import { useEffect, useState } from "react";
import { AnimatePresence } from "motion/react";
import { Play, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { actions } from "@/lib/state/actions";
import { useHydrated, useProject } from "@/lib/state/store";
import { rehearsalVerdict } from "@/lib/derive";
import { rehearsalChecks } from "@/content/cone";
import type { RehearsalAnswer } from "@/types/state";
import { Stamp } from "./gate-card";

const answers: { id: RehearsalAnswer; label: string; cls: string }[] = [
  { id: "pass", label: "Fine", cls: "border-ok bg-ok text-paper" },
  { id: "minor", label: "Minor issue", cls: "border-caution bg-caution-bg text-caution" },
  { id: "fail", label: "Problem", cls: "border-signal bg-signal text-paper" },
];

function useElapsed(startedAt?: string) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (!startedAt) return;
    const id = setInterval(() => setNow(Date.now()), 15_000);
    return () => clearInterval(id);
  }, [startedAt]);
  return startedAt ? Math.max(0, Math.floor((now - new Date(startedAt).getTime()) / 60000)) : 0;
}

export function Rehearsal() {
  const s = useProject();
  const hydrated = useHydrated();
  const r = s.rehearsal;
  const elapsed = useElapsed(hydrated ? r.startedAt : undefined);
  const v = rehearsalVerdict(s);

  return (
    <div>
      <div className="sticky top-14 z-20 -mx-4 mb-6 flex flex-wrap items-center gap-4 border-b-2 border-ink bg-paper/97 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6 lg:top-0 lg:-mx-10 lg:px-10">
        {hydrated && r.startedAt ? (
          <>
            <div>
              <p className="label-caps text-ink-3">Started</p>
              <p className="font-mono font-semibold">{new Date(r.startedAt).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })}</p>
            </div>
            <div>
              <p className="label-caps text-ink-3">Elapsed</p>
              <p className="font-display text-3xl font-bold tabular">
                {Math.floor(elapsed / 60)}:{String(elapsed % 60).padStart(2, "0")}
              </p>
            </div>
          </>
        ) : (
          <button type="button" onClick={actions.startRehearsal} className="inline-flex min-h-12 items-center gap-2 rounded-md bg-ink px-5 font-semibold text-paper">
            <Play className="size-5" /> Start 2-hour rehearsal
          </button>
        )}
        <div>
          <p className="label-caps text-ink-3">Answered</p>
          <p className="font-display text-3xl font-bold tabular">
            {hydrated ? v.answered : 0}/{v.total}
          </p>
        </div>
        {hydrated && r.startedAt ? (
          <button
            type="button"
            onClick={() => confirm("Reset the rehearsal and clear answers?") && actions.resetRehearsal()}
            className="ml-auto inline-flex min-h-10 items-center gap-1.5 rounded-md border border-rule px-3 text-sm hover:border-ink"
          >
            <RotateCcw className="size-4" /> Reset
          </button>
        ) : null}
      </div>

      <div className="flex flex-col gap-8">
        {([15, 30, 60, 120] as const).map((cp) => {
          const reached = hydrated && r.startedAt && elapsed >= cp;
          return (
            <section key={cp} aria-labelledby={`cp-${cp}`}>
              <div className="mb-2 flex items-center gap-3">
                <h2 id={`cp-${cp}`} className="font-display text-3xl font-extrabold uppercase">
                  {cp} min
                </h2>
                {reached ? <span className="label-caps rounded-sm bg-remulak px-1.5 py-0.5 text-[#1d1c1a]">Checkpoint reached</span> : null}
              </div>
              <ul className="flex flex-col gap-2">
                {rehearsalChecks
                  .filter((c) => c.checkpoint === cp)
                  .map((c) => {
                    const a = hydrated ? r.answers[c.id] : undefined;
                    return (
                      <li key={c.id} className={cn("rounded-lg border bg-card p-3", a === "fail" ? "border-signal" : a === "minor" ? "border-caution" : a === "pass" ? "border-ok/50" : "border-rule")}>
                        <p className="label-caps text-ink-3">
                          {c.area}
                          {c.critical ? " · critical" : ""}
                        </p>
                        <p className="mt-0.5 text-[1.0625rem] font-medium">{c.question}</p>
                        <div role="radiogroup" aria-label={c.question} className="mt-2 grid grid-cols-3 gap-1.5">
                          {answers.map((ans) => (
                            <button
                              key={ans.id}
                              type="button"
                              role="radio"
                              aria-checked={a === ans.id}
                              onClick={() => actions.answerRehearsal(c.id, a === ans.id ? undefined : ans.id)}
                              className={cn("glue-target min-h-11 rounded-md border-2 text-sm font-semibold", a === ans.id ? ans.cls : "border-rule text-ink-2 hover:border-ink")}
                            >
                              {ans.label}
                            </button>
                          ))}
                        </div>
                        {a && a !== "pass" ? <p className="mt-2 rounded-md bg-paper-2 p-2 text-sm">→ {c.failAdvice}</p> : null}
                      </li>
                    );
                  })}
              </ul>
            </section>
          );
        })}
      </div>

      <label className="mt-8 block">
        <span className="label-caps text-ink-3">Rehearsal notes</span>
        <textarea
          key={hydrated ? "h" : "s"}
          defaultValue={hydrated ? r.notes : ""}
          onBlur={(e) => actions.setRehearsalNotes(e.target.value)}
          rows={4}
          className="mt-1 w-full rounded-md border border-rule-strong bg-card p-3"
        />
      </label>

      <section className="mt-8 rounded-lg border-2 border-ink bg-card p-5" aria-live="polite">
        <h2 className="font-display text-2xl font-bold uppercase">Verdict</h2>
        {!hydrated || !v.verdict ? (
          <p className="mt-2 text-ink-2">Answer all {v.total} checks to get a verdict ({hydrated ? v.total - v.answered : v.total} left).</p>
        ) : (
          <div className="mt-3">
            <AnimatePresence mode="wait">
              <Stamp key={v.verdict} text={v.verdict} tone={v.verdict === "NO-GO" ? "signal" : "ok"} className="text-3xl" />
            </AnimatePresence>
            {v.criticalFails.length ? (
              <div className="mt-4">
                <p className="font-semibold text-signal">Critical problems:</p>
                <ul className="mt-1 list-disc pl-5">
                  {v.criticalFails.map((c) => (
                    <li key={c.id}>
                      {c.question} — {c.failAdvice}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            {v.otherIssues.length ? (
              <div className="mt-4">
                <p className="font-semibold">Fix before Halloween:</p>
                <ul className="mt-1 list-disc pl-5">
                  {v.otherIssues.map((c) => (
                    <li key={c.id}>
                      {c.question} — {c.failAdvice}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            {v.verdict !== "NO-GO" && !s.tasks["t-rehearsal"] ? (
              <button type="button" onClick={() => actions.setTask("t-rehearsal", "done")} className="mt-4 min-h-12 rounded-md bg-ink px-5 font-semibold text-paper">
                Mark rehearsal task complete
              </button>
            ) : null}
          </div>
        )}
        <p className="mt-4 text-xs text-ink-3">
          This is a self-check summary of your own answers, not a safety certification. If anyone feels unwell, stop.
        </p>
      </section>
    </div>
  );
}
