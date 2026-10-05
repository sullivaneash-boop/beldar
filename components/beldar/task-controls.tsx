"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { Check, Lock, RotateCcw, SkipForward } from "lucide-react";
import { cn } from "@/lib/utils";
import { actions } from "@/lib/state/actions";
import { useHydrated, useProject } from "@/lib/state/store";
import { assigneeFor, gatePassed, lockReasons, personName, taskState } from "@/lib/derive";
import { gateById } from "@/content/phases";
import { taskById } from "@/content/tasks";
import type { Task } from "@/types/content";
import type { Assignee, PersonId } from "@/types/state";

/** Square checkbox that "locks" a tiny cone into place when done. */
export function TaskCheckbox({ task, size = "md" }: { task: Task; size?: "md" | "lg" }) {
  const s = useProject();
  const hydrated = useHydrated();
  const state = hydrated ? taskState(s, task) : "available";
  const done = state === "done" || state === "skipped";
  const locked = state === "locked";
  const box = size === "lg" ? "size-9" : "size-7";
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={done}
      aria-disabled={locked}
      aria-label={`${done ? "Mark not done" : "Mark done"}: ${task.title}${locked ? " (locked — prerequisites not met)" : ""}`}
      onClick={() => {
        if (locked) return;
        actions.setTask(task.id, done ? "todo" : "done");
      }}
      className={cn(
        "relative grid shrink-0 place-items-center rounded-md border-2 transition-colors",
        box,
        done ? "border-ink bg-ink text-paper" : locked ? "cursor-not-allowed border-dashed border-rule-strong text-ink-3" : "border-ink bg-card hover:bg-paper-2",
      )}
    >
      <AnimatePresence initial={false}>
        {done ? (
          <motion.span key="d" initial={{ y: 6, opacity: 0, scale: 0.6 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ type: "spring", stiffness: 500, damping: 26 }}>
            {state === "skipped" ? <SkipForward className="size-4" /> : <Check className="size-4.5" strokeWidth={3} />}
          </motion.span>
        ) : locked ? (
          <Lock className="size-3.5" aria-hidden />
        ) : null}
      </AnimatePresence>
    </button>
  );
}

export function LockNotice({ task, compact }: { task: Task; compact?: boolean }) {
  const s = useProject();
  const hydrated = useHydrated();
  const [confirm, setConfirm] = useState(false);
  if (!hydrated) return null;
  const reasons = lockReasons(s, task);
  if (!reasons.length || s.tasks[task.id]) return null;
  return (
    <div className={cn("rounded-md border border-dashed border-rule-strong bg-paper-2 p-3 text-sm", compact && "p-2 text-xs")}>
      <p className="flex items-center gap-1.5 font-medium text-ink">
        <Lock className="size-3.5" aria-hidden /> Waiting on:
      </p>
      <ul className="mt-1 ml-5 list-disc text-ink-2">
        {task.prerequisites
          .filter((p) => !s.tasks[p])
          .map((p) => (
            <li key={p}>
              <Link href={`/guide/${p}`} className="underline underline-offset-2">
                {taskById[p]?.title}
              </Link>
            </li>
          ))}
        {(task.blockedByGates ?? [])
          .filter((g) => !gatePassed(s, g))
          .map((g) => (
            <li key={g}>
              <Link href="/build#gates" className="underline underline-offset-2">
                {gateById[g].code} — {gateById[g].title}
              </Link>
            </li>
          ))}
      </ul>
      {!compact ? (
        confirm ? (
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="text-ink-2">Mark done anyway? The research sequence exists for a reason.</span>
            <button type="button" className="min-h-9 rounded-md bg-ink px-3 text-paper" onClick={() => actions.setTask(task.id, "done", true)}>
              Override
            </button>
            <button type="button" className="min-h-9 rounded-md px-3 hover:bg-paper" onClick={() => setConfirm(false)}>
              Cancel
            </button>
          </div>
        ) : (
          <button type="button" className="mt-2 text-xs text-ink-3 underline underline-offset-2" onClick={() => setConfirm(true)}>
            Override lock…
          </button>
        )
      ) : null}
    </div>
  );
}

export function AssigneeSelect({ taskKey, value, label = "Assigned to", className }: { taskKey: string; value: Assignee; label?: string; className?: string }) {
  const s = useProject();
  const people = s.settings.people;
  return (
    <label className={cn("inline-flex items-center gap-2 text-sm", className)}>
      <span className="label-caps text-ink-3">{label}</span>
      <select
        value={value}
        onChange={(e) => actions.assign(taskKey, e.target.value as Assignee)}
        className="min-h-9 rounded-md border border-rule-strong bg-card px-2 text-sm font-medium"
      >
        <option value="unassigned">Unassigned</option>
        {(Object.keys(people) as PersonId[]).map((id) => (
          <option key={id} value={id}>
            {people[id]}
          </option>
        ))}
      </select>
    </label>
  );
}

export function TaskAssignee({ task, className }: { task: Task; className?: string }) {
  const s = useProject();
  const hydrated = useHydrated();
  return <AssigneeSelect taskKey={task.id} value={hydrated ? assigneeFor(s, task) : "unassigned"} className={className} />;
}

export function Avatar({ who }: { who: Assignee }) {
  const s = useProject();
  const name = personName(s, who);
  const colors: Record<Assignee, string> = {
    sully: "bg-denim text-denim-ink",
    mom: "bg-flesh-2 text-ink",
    sister: "bg-remulak text-[#1d1c1a]",
    unassigned: "bg-paper-2 text-ink-3 border border-dashed border-rule-strong",
  };
  return (
    <span title={name} className={cn("inline-grid size-7 shrink-0 place-items-center rounded-full font-mono text-xs font-semibold uppercase", colors[who])}>
      {who === "unassigned" ? "?" : name.slice(0, 1)}
      <span className="sr-only">{name}</span>
    </span>
  );
}

export function SkipToggle({ task }: { task: Task }) {
  const s = useProject();
  const rec = s.tasks[task.id];
  if (rec?.status === "done") return null;
  return (
    <button
      type="button"
      onClick={() => actions.setTask(task.id, rec?.status === "skipped" ? "todo" : "skipped")}
      className="inline-flex min-h-9 items-center gap-1.5 rounded-md px-2 text-sm text-ink-2 hover:bg-paper-2"
    >
      {rec?.status === "skipped" ? <RotateCcw className="size-4" /> : <SkipForward className="size-4" />}
      {rec?.status === "skipped" ? "Un-skip" : "Skip (accelerated schedule)"}
    </button>
  );
}
