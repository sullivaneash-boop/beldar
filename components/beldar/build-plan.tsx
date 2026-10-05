"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Circle, CircleDot, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useHydrated, useProject } from "@/lib/state/store";
import { assigneeFor, phaseProgress, type PhaseStatus } from "@/lib/derive";
import { phases, gateById } from "@/content/phases";
import { tasks } from "@/content/tasks";
import type { Assignee } from "@/types/state";
import { TaskRow } from "./task-row";

const statusMeta: Record<PhaseStatus, { label: string; icon: typeof Circle; cls: string }> = {
  complete: { label: "Complete", icon: CheckCircle2, cls: "text-ok" },
  active: { label: "In progress", icon: CircleDot, cls: "text-denim" },
  ready: { label: "Ready", icon: Circle, cls: "text-ink-2" },
  locked: { label: "Waiting", icon: Lock, cls: "text-ink-3" },
};

export function PhaseStatusBadge({ status }: { status: PhaseStatus }) {
  const m = statusMeta[status];
  const Icon = m.icon;
  return (
    <span className={cn("label-caps inline-flex items-center gap-1", m.cls)}>
      <Icon className="size-3.5" aria-hidden /> {m.label}
    </span>
  );
}

export function BuildPlan() {
  const s = useProject();
  const hydrated = useHydrated();
  const [who, setWho] = useState<Assignee | "all">("all");
  const [hideDone, setHideDone] = useState(false);

  return (
    <div>
      <div className="no-print sticky top-14 z-20 -mx-4 mb-4 flex flex-wrap items-center gap-2 border-b border-rule bg-paper/95 px-4 py-2 backdrop-blur sm:-mx-6 sm:px-6 lg:top-0 lg:-mx-10 lg:px-10">
        <span className="label-caps text-ink-3">Show</span>
        {(["all", "sully", "mom", "sister", "unassigned"] as const).map((id) => (
          <button
            key={id}
            type="button"
            aria-pressed={who === id}
            onClick={() => setWho(id)}
            className={cn("min-h-9 rounded-full border px-3 text-sm", who === id ? "border-ink bg-ink text-paper" : "border-rule text-ink-2 hover:bg-paper-2")}
          >
            {id === "all" ? "Everyone" : id === "unassigned" ? "Unassigned" : s.settings.people[id]}
          </button>
        ))}
        <label className="ml-auto inline-flex min-h-9 items-center gap-2 text-sm">
          <input type="checkbox" checked={hideDone} onChange={(e) => setHideDone(e.target.checked)} className="size-4 accent-[var(--ink)]" />
          Hide completed
        </label>
      </div>

      <ol className="relative flex flex-col gap-4">
        {phases.map((phase) => {
          const pp = hydrated ? phaseProgress(s, phase) : { done: 0, total: 0, pct: 0, status: "ready" as PhaseStatus };
          const list = tasks
            .filter((t) => t.phaseId === phase.id)
            .filter((t) => who === "all" || assigneeFor(s, t) === who)
            .filter((t) => !hideDone || !s.tasks[t.id]);
          if (who !== "all" && list.length === 0) return null;
          return (
            <li key={phase.id} id={phase.slug} className="print-avoid-break">
              <details open={pp.status === "active" || pp.status === "ready"} className="group rounded-lg border border-rule bg-card open:border-ink">
                <summary className="flex cursor-pointer list-none items-start gap-4 p-4 [&::-webkit-details-marker]:hidden">
                  <div className="flex w-14 shrink-0 flex-col items-center">
                    <span className="font-mono text-xs text-ink-3">{phase.code}</span>
                    <span className="font-display text-3xl font-bold tabular">{String(phase.order).padStart(2, "0")}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      <h2 className="font-display text-2xl font-bold uppercase">{phase.title}</h2>
                      <PhaseStatusBadge status={pp.status} />
                    </div>
                    <p className="mt-0.5 text-[0.9375rem] text-ink-2">{phase.goal}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-xs text-ink-2">
                      {phase.targetDate ? <span>Target {new Date(phase.targetDate + "T12:00").toLocaleDateString(undefined, { month: "short", day: "numeric" })}</span> : null}
                      <span>{phase.estimatedDuration}</span>
                      <span>{phase.budgetNote}</span>
                      {phase.gateIds.map((g) => (
                        <span key={g} className="rounded-sm bg-ink px-1 text-paper">{gateById[g].code}</span>
                      ))}
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-paper-2" aria-hidden>
                        <div className="h-full bg-denim transition-[width] duration-500" style={{ width: `${pp.pct}%` }} />
                      </div>
                      <span className="font-mono text-xs tabular">
                        {pp.done}/{pp.total}
                      </span>
                    </div>
                  </div>
                  <span className="mt-2 text-ink-3 transition-transform group-open:rotate-90" aria-hidden>
                    ▸
                  </span>
                </summary>
                <div className="border-t border-rule px-4 pb-4">
                  {phase.skippable ? <p className="mt-3 rounded-md bg-caution-bg p-2 text-sm text-caution">{phase.skippable}</p> : null}
                  <ul className="divide-y divide-rule">
                    {list.map((t) => (
                      <TaskRow key={t.id} task={t} />
                    ))}
                  </ul>
                  <Link href={`/build/${phase.slug}`} className="mt-1 inline-flex min-h-11 items-center gap-1 font-medium text-denim underline underline-offset-2">
                    Phase brief: prerequisites, materials, mistakes to avoid <ArrowRight className="size-4" />
                  </Link>
                </div>
              </details>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
