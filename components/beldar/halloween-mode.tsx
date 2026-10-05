"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Check, RotateCcw, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import { actions } from "@/lib/state/actions";
import { useHydrated, useProject } from "@/lib/state/store";
import { personName, roleAssignee } from "@/lib/derive";
import { applicationSteps, stageLabels } from "@/content/makeup";
import { helperRoleLabels } from "@/content/meta";
import type { Assignee, PersonId } from "@/types/state";
import { AssigneeSelect, Avatar } from "./task-controls";
import { Stamp } from "./gate-card";

function useNow(intervalMs = 30_000) {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    const tick = () => setNow(new Date());
    tick();
    const id = setInterval(tick, intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return now;
}

function partyDate(date: string, time: string) {
  const [y, m, d] = date.split("-").map(Number);
  const [hh, mm] = time.split(":").map(Number);
  return new Date(y, m - 1, d, hh, mm);
}

const fmtTime = (d: Date) => d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });

function countdown(ms: number) {
  const neg = ms < 0;
  const total = Math.abs(Math.round(ms / 60000));
  const days = Math.floor(total / 1440);
  const h = Math.floor((total % 1440) / 60);
  const m = total % 60;
  const str = days > 0 ? `${days}d ${h}h ${m}m` : `${h}h ${String(m).padStart(2, "0")}m`;
  return neg ? `+${str}` : str;
}

export function HalloweenMode() {
  const s = useProject();
  const hydrated = useHydrated();
  const now = useNow();
  const [who, setWho] = useState<PersonId | "all">("all");
  const party = partyDate(s.settings.halloweenDate, s.settings.partyStart);
  const start = new Date(party.getTime() - applicationSteps[0].tMinus * 60000);
  const steps = applicationSteps.filter((st) => who === "all" || roleAssignee(s, `h:${st.id}`, st.role) === who);
  const doneCount = hydrated ? applicationSteps.filter((st) => s.halloween.steps[st.id]).length : 0;
  const allDone = doneCount === applicationSteps.length;
  const nextStep = applicationSteps.find((st) => !s.halloween.steps[st.id]);
  const stages = Array.from(new Set(steps.map((st) => st.stage)));

  return (
    <div>
      <div className="sticky top-14 z-20 -mx-4 mb-5 border-b-2 border-ink bg-paper/97 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6 lg:top-0 lg:-mx-10 lg:px-10">
        <div className="flex flex-wrap items-end gap-x-6 gap-y-2">
          <div>
            <p className="label-caps text-ink-3">Party starts</p>
            <p className="font-display text-3xl font-bold tabular">{hydrated ? fmtTime(party) : "8:00 PM"}</p>
          </div>
          <div>
            <p className="label-caps text-ink-3">{now && now < start ? "Begin prep in" : "Party in"}</p>
            <p className="font-display text-3xl font-bold tabular">
              {now && hydrated ? countdown((now < start ? start : party).getTime() - now.getTime()) : "—"}
            </p>
          </div>
          <div>
            <p className="label-caps text-ink-3">Checklist</p>
            <p className="font-display text-3xl font-bold tabular">
              {doneCount}/{applicationSteps.length}
            </p>
          </div>
          <div className="ml-auto flex flex-wrap gap-1" role="group" aria-label="Filter by person">
            {(["all", "sully", "mom", "sister"] as const).map((id) => (
              <button
                key={id}
                type="button"
                aria-pressed={who === id}
                onClick={() => setWho(id)}
                className={cn("min-h-10 rounded-full border px-3 text-sm", who === id ? "border-ink bg-ink text-paper" : "border-rule bg-card")}
              >
                {id === "all" ? "Everyone" : s.settings.people[id]}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-paper-2" aria-hidden>
          <div className="h-full bg-ok transition-[width] duration-500" style={{ width: `${(doneCount / applicationSteps.length) * 100}%` }} />
        </div>
      </div>

      {allDone ? (
        <div className="mb-6 rounded-lg border-2 border-ok bg-ok-bg p-6 text-center">
          <Stamp text="Approved for deployment" className="text-2xl" />
          <p className="mt-3 text-ink-2">Hydrate. Repair kit in the front pocket. No candles.</p>
          <Link href="/survival" className="mt-3 inline-flex min-h-12 items-center rounded-md bg-ink px-5 font-semibold text-paper">
            Open Party Survival
          </Link>
        </div>
      ) : nextStep && hydrated ? (
        <p className="mb-5 text-[1.0625rem]">
          <span className="label-caps mr-2 rounded-sm bg-remulak px-1.5 py-0.5 text-[#1d1c1a]">Now</span>
          <strong>{nextStep.title}</strong> — {helperRoleLabels[nextStep.role]} · {personName(s, roleAssignee(s, `h:${nextStep.id}`, nextStep.role))}
        </p>
      ) : null}

      <div className="flex flex-col gap-8">
        {stages.map((stage) => (
          <section key={stage} aria-labelledby={`stage-${stage}`}>
            <h2 id={`stage-${stage}`} className="mb-2 flex items-center gap-3 font-display text-3xl font-extrabold uppercase">
              <span className="h-0.5 w-6 bg-ink" aria-hidden />
              {stageLabels[stage]}
            </h2>
            <ol className="flex flex-col gap-2">
              {steps
                .filter((st) => st.stage === stage)
                .map((st) => {
                  const done = hydrated && !!s.halloween.steps[st.id];
                  const at = new Date(party.getTime() - st.tMinus * 60000);
                  const assignee: Assignee = hydrated ? roleAssignee(s, `h:${st.id}`, st.role) : "unassigned";
                  return (
                    <li key={st.id} className={cn("rounded-lg border-2 bg-card", done ? "border-ok/60" : "border-ink")}>
                      <div className="flex items-stretch">
                        <button
                          type="button"
                          role="checkbox"
                          aria-checked={done}
                          aria-label={`${st.title}: ${done ? "done" : "not done"}`}
                          onClick={() => actions.toggleHalloweenStep(st.id)}
                          className={cn("grid w-20 shrink-0 place-items-center rounded-l-md border-r-2 sm:w-24", done ? "border-ok/60 bg-ok text-paper" : "border-ink hover:bg-paper-2")}
                        >
                          {done ? <Check className="size-9" strokeWidth={3} /> : <span className="size-9 rounded-md border-[3px] border-ink" />}
                        </button>
                        <div className="min-w-0 flex-1 p-3 sm:p-4">
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-sm">
                            <span className="font-semibold tabular">{st.tMinus ? `T-${st.tMinus}` : "T-0"}</span>
                            <span className="text-ink-2 tabular">{hydrated ? fmtTime(at) : ""}</span>
                            {st.durationMinutes ? <span className="text-ink-3">~{st.durationMinutes} min</span> : null}
                            <span className="label-caps text-ink-3">{helperRoleLabels[st.role]}</span>
                            {st.origin === "app" ? <span className="label-caps text-ink-3">· app suggestion</span> : null}
                          </div>
                          <h3 className={cn("mt-1 text-xl font-semibold", done && "text-ink-3 line-through")}>{st.title}</h3>
                          <p className="mt-0.5 text-[0.9375rem] text-ink-2">{st.detail}</p>
                          {st.safety ? (
                            <p className="mt-2 flex items-start gap-2 rounded-md bg-signal-bg p-2 text-sm font-medium">
                              <ShieldAlert className="mt-0.5 size-4 shrink-0 text-signal" aria-hidden /> {st.safety}
                            </p>
                          ) : null}
                          <div className="glue-hide mt-2 flex items-center gap-2">
                            <Avatar who={assignee} />
                            <AssigneeSelect taskKey={`h:${st.id}`} value={assignee} label="Who" />
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                })}
            </ol>
          </section>
        ))}
      </div>

      <button
        type="button"
        onClick={() => {
          if (confirm("Clear all Halloween checklist ticks?")) actions.resetHalloween();
        }}
        className="mt-8 inline-flex min-h-11 items-center gap-2 rounded-md border border-rule px-3 text-sm text-ink-2 hover:border-ink"
      >
        <RotateCcw className="size-4" /> Reset checklist
      </button>
    </div>
  );
}
