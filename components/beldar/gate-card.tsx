"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";
import { actions } from "@/lib/state/actions";
import { useHydrated, useProject } from "@/lib/state/store";
import { taskById } from "@/content/tasks";
import type { DecisionGate } from "@/types/content";
import { SourceRefs } from "./primitives";

export function Stamp({ text, tone = "ok", className }: { text: string; tone?: "ok" | "signal"; className?: string }) {
  return (
    <motion.span
      initial={{ scale: 1.8, opacity: 0, rotate: -14 }}
      animate={{ scale: 1, opacity: 1, rotate: -6 }}
      exit={{ opacity: 0 }}
      transition={{ type: "spring", stiffness: 520, damping: 22 }}
      className={cn(
        "pointer-events-none inline-block rounded-sm border-[3px] px-2 py-0.5 font-display text-lg font-extrabold tracking-widest uppercase",
        tone === "ok" ? "border-ok text-ok" : "border-signal text-signal",
        className,
      )}
    >
      {text}
    </motion.span>
  );
}

export function GateCard({ gate, compact }: { gate: DecisionGate; compact?: boolean }) {
  const s = useProject();
  const hydrated = useHydrated();
  const rec = hydrated ? s.gates[gate.id] : undefined;
  const evidenceDone = gate.evidenceTaskIds.every((t) => s.tasks[t]);

  return (
    <article
      className={cn(
        "relative overflow-hidden rounded-lg border-2 bg-card p-4",
        rec?.status === "passed" ? "border-ok" : rec?.status === "failed" ? "border-signal" : "border-ink",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="label-caps text-ink-3">
            {gate.code} · Decision gate
          </p>
          <h3 className="mt-0.5 font-display text-2xl font-bold uppercase">{gate.title}</h3>
        </div>
        <AnimatePresence>
          {rec?.status === "passed" ? <Stamp key="p" text="Approved" /> : rec?.status === "failed" ? <Stamp key="f" text="Rejected" tone="signal" /> : null}
        </AnimatePresence>
      </div>
      <p className="mt-2 text-[0.9375rem] font-medium">{gate.rule}</p>
      {!compact ? (
        <p className="mt-1 text-sm text-ink-2">
          Pass when: {gate.criteria} <SourceRefs ids={gate.sourceIds} />
        </p>
      ) : null}
      {!compact && gate.evidenceTaskIds.length ? (
        <p className="mt-2 text-sm text-ink-2">
          Evidence step:{" "}
          {gate.evidenceTaskIds.map((t) => (
            <Link key={t} href={`/guide/${t}`} className="font-medium text-denim underline underline-offset-2">
              {taskById[t]?.title}
            </Link>
          ))}
          {hydrated && !evidenceDone ? <span className="text-ink-3"> (not done yet)</span> : null}
        </p>
      ) : null}
      <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label={`${gate.title} decision`}>
        <button
          type="button"
          aria-pressed={rec?.status === "passed"}
          onClick={() => actions.setGate(gate.id, rec?.status === "passed" ? "pending" : "passed")}
          className={cn("glue-target min-h-10 rounded-md border-2 px-3 text-sm font-semibold", rec?.status === "passed" ? "border-ok bg-ok text-paper" : "border-ok text-ok hover:bg-ok-bg")}
        >
          {rec?.status === "passed" ? "Passed ✓" : "Mark passed"}
        </button>
        <button
          type="button"
          aria-pressed={rec?.status === "failed"}
          onClick={() => actions.setGate(gate.id, rec?.status === "failed" ? "pending" : "failed")}
          className={cn("glue-target min-h-10 rounded-md border-2 px-3 text-sm font-semibold", rec?.status === "failed" ? "border-signal bg-signal text-paper" : "border-signal/60 text-signal hover:bg-signal-bg")}
        >
          {rec?.status === "failed" ? "Failed — fix & retest" : "Mark failed"}
        </button>
      </div>
      {!compact ? <p className="label-caps mt-3 text-ink-3">Source: {gate.origin}</p> : null}
    </article>
  );
}
