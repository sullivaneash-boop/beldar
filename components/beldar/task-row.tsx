"use client";

import Link from "next/link";
import { AlertTriangle, ChevronRight, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { useHydrated, useProject } from "@/lib/state/store";
import { taskState } from "@/lib/derive";
import { warningById } from "@/content/warnings";
import type { Task } from "@/types/content";
import { Difficulty } from "./primitives";
import { LockNotice, TaskAssignee, TaskCheckbox } from "./task-controls";

export function TaskRow({ task }: { task: Task }) {
  const s = useProject();
  const hydrated = useHydrated();
  const st = hydrated ? taskState(s, task) : "available";
  const critical = (task.warningIds ?? []).filter((w) => warningById[w]?.level === "critical");
  return (
    <li className={cn("py-3", (st === "done" || st === "skipped") && "opacity-70")}>
      <div className="flex items-start gap-3">
        <div className="pt-0.5">
          <TaskCheckbox task={task} />
        </div>
        <div className="min-w-0 flex-1">
          <Link href={`/guide/${task.id}`} className="group inline-flex items-center gap-1">
            <span className={cn("font-semibold group-hover:underline", st === "done" && "line-through decoration-2")}>{task.title}</span>
            <ChevronRight className="size-4 text-ink-3" aria-hidden />
          </Link>
          <p className="text-sm text-ink-2">{task.summary}</p>
          <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-2">
            {task.checklistId ? <span className="font-mono">#{task.checklistId}</span> : null}
            <span className="font-mono">{task.durationLabel}</span>
            {task.costLabel ? <span className="font-mono">{task.costLabel}</span> : null}
            <Difficulty value={task.difficulty} />
            {task.helper !== "solo" ? (
              <span className="inline-flex items-center gap-1">
                <Users className="size-3.5" aria-hidden /> Helper {task.helper}
              </span>
            ) : null}
            {critical.map((w) => (
              <span key={w} className="inline-flex items-center gap-1 font-medium text-signal">
                <AlertTriangle className="size-3.5" aria-hidden /> {warningById[w].title}
              </span>
            ))}
            {st === "skipped" ? <span className="label-caps text-ink-3">Skipped</span> : null}
            {s.tasks[task.id]?.override ? <span className="label-caps text-caution">Override</span> : null}
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <TaskAssignee task={task} />
          </div>
          {st === "locked" ? (
            <div className="mt-2">
              <LockNotice task={task} compact />
            </div>
          ) : null}
        </div>
      </div>
    </li>
  );
}
