"use client";

import Link from "next/link";
import { ArrowRight, Check, Lock, SkipForward } from "lucide-react";
import { cn } from "@/lib/utils";
import { useHydrated, useProject } from "@/lib/state/store";
import { taskState, upNext } from "@/lib/derive";
import { phases } from "@/content/phases";
import { tasks } from "@/content/tasks";

export function GuideIndex() {
  const s = useProject();
  const hydrated = useHydrated();
  const next = hydrated ? upNext(s, 1)[0] : undefined;
  return (
    <div>
      <Link
        href={next ? `/guide/${next.id}` : `/guide/${tasks[0].id}`}
        className="mb-8 flex min-h-20 items-center justify-between gap-4 rounded-lg border-2 border-ink bg-ink p-5 text-paper"
      >
        <span>
          <span className="label-caps block opacity-70">{next ? "Resume — next unlocked step" : hydrated ? "All unlocked steps done" : "Start"}</span>
          <span className="font-display text-3xl font-bold uppercase">{next ? next.title : tasks[0].title}</span>
        </span>
        <ArrowRight className="size-8 shrink-0" aria-hidden />
      </Link>

      <div className="flex flex-col gap-6">
        {phases.map((p) => (
          <section key={p.id}>
            <h2 className="label-caps mb-2 text-ink-3">
              {p.code} · {p.title}
            </h2>
            <ol className="overflow-hidden rounded-lg border border-rule bg-card">
              {tasks
                .filter((t) => t.phaseId === p.id)
                .map((t) => {
                  const n = tasks.indexOf(t) + 1;
                  const st = hydrated ? taskState(s, t) : "available";
                  return (
                    <li key={t.id} className="border-b border-rule last:border-0">
                      <Link href={`/guide/${t.id}`} className="flex min-h-14 items-center gap-3 px-4 py-2 hover:bg-paper-2">
                        <span className="w-7 font-mono text-sm text-ink-3 tabular">{String(n).padStart(2, "0")}</span>
                        <span
                          className={cn(
                            "grid size-6 place-items-center rounded-full border",
                            st === "done" && "border-ok bg-ok text-paper",
                            st === "skipped" && "border-rule-strong bg-paper-2 text-ink-3",
                            st === "locked" && "border-dashed border-rule-strong text-ink-3",
                            st === "available" && "border-ink",
                          )}
                          aria-label={st}
                        >
                          {st === "done" ? <Check className="size-3.5" /> : st === "skipped" ? <SkipForward className="size-3" /> : st === "locked" ? <Lock className="size-3" /> : null}
                        </span>
                        <span className={cn("flex-1 font-medium", st === "done" && "text-ink-3 line-through")}>{t.title}</span>
                        <span className="hidden font-mono text-xs text-ink-3 sm:inline">{t.durationLabel}</span>
                      </Link>
                    </li>
                  );
                })}
            </ol>
          </section>
        ))}
      </div>
    </div>
  );
}
