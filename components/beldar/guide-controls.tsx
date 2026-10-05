"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ArrowRight, Check, Hand, Sun, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { actions } from "@/lib/state/actions";
import { useHydrated, useProject } from "@/lib/state/store";
import { taskState, upNext } from "@/lib/derive";
import { taskById } from "@/content/tasks";
import { LockNotice, TaskAssignee } from "./task-controls";
import { ConeProgress } from "./cone-mark";

type WakeLockSentinelLike = { release: () => Promise<void>; addEventListener: (t: string, f: () => void) => void };

function useWakeLock() {
  const [on, setOn] = useState(false);
  const ref = useRef<WakeLockSentinelLike | null>(null);
  const hydrated = useHydrated();
  // Only known after hydration — checking navigator during render would mismatch the server HTML.
  const supported = hydrated && "wakeLock" in navigator;

  useEffect(() => {
    if (!on || !supported) return;
    let cancelled = false;
    const request = async () => {
      try {
        const nav = navigator as Navigator & { wakeLock: { request: (t: "screen") => Promise<WakeLockSentinelLike> } };
        const lock = await nav.wakeLock.request("screen");
        if (cancelled) return lock.release();
        ref.current = lock;
      } catch {
        setOn(false);
      }
    };
    request();
    const onVis = () => {
      if (document.visibilityState === "visible") request();
    };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      cancelled = true;
      document.removeEventListener("visibilitychange", onVis);
      ref.current?.release().catch(() => {});
      ref.current = null;
    };
  }, [on, supported]);

  return { on, setOn, supported };
}

/** Press-and-hold button used in glue mode to prevent accidental completes. */
function HoldButton({ onConfirm, children, className, disabled }: { onConfirm: () => void; children: React.ReactNode; className?: string; disabled?: boolean }) {
  const [holding, setHolding] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const start = () => {
    if (disabled) return;
    setHolding(true);
    timer.current = setTimeout(() => {
      setHolding(false);
      onConfirm();
    }, 700);
  };
  const cancel = () => {
    setHolding(false);
    clearTimeout(timer.current);
  };
  return (
    <button
      type="button"
      disabled={disabled}
      onPointerDown={start}
      onPointerUp={cancel}
      onPointerLeave={cancel}
      onContextMenu={(e) => e.preventDefault()}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onConfirm();
        }
      }}
      className={cn("relative overflow-hidden", className)}
    >
      <span className={cn("absolute inset-y-0 left-0 bg-ok/40", holding ? "w-full transition-[width] duration-700 ease-linear" : "w-0")} aria-hidden />
      <span className="relative inline-flex items-center gap-2">{children}</span>
    </button>
  );
}

export function GuideControls({ taskId, prevId, nextId, index, total }: { taskId: string; prevId?: string; nextId?: string; index: number; total: number }) {
  const s = useProject();
  const hydrated = useHydrated();
  const router = useRouter();
  const task = taskById[taskId];
  const st = hydrated ? taskState(s, task) : "available";
  const done = st === "done" || st === "skipped";
  const locked = st === "locked";
  const glue = s.settings.glueMode;
  const wake = useWakeLock();
  const [justDone, setJustDone] = useState(false);

  const complete = () => {
    if (done) {
      actions.setTask(taskId, "todo");
      return;
    }
    actions.setTask(taskId, "done");
    setJustDone(true);
    setTimeout(() => setJustDone(false), 1400);
  };

  const nextAvailable = hydrated ? upNext(s, 1)[0] : undefined;

  return (
    <>
      {/* top utility bar */}
      <div className="no-print mb-4 flex flex-wrap items-center gap-2">
        <Link href="/guide" className="glue-target inline-flex min-h-11 items-center gap-1.5 rounded-md border border-rule bg-card px-3 text-sm font-medium hover:border-ink">
          <X className="size-4" /> Exit guide
        </Link>
        <span className="font-mono text-sm text-ink-2 tabular">
          {index + 1}/{total}
        </span>
        <div className="flex-1" />
        <button
          type="button"
          aria-pressed={glue}
          onClick={() => actions.setSettings({ glueMode: !glue })}
          className={cn("inline-flex min-h-11 items-center gap-1.5 rounded-md border px-3 text-sm font-medium", glue ? "border-ink bg-remulak text-[#1d1c1a]" : "border-rule bg-card hover:border-ink")}
        >
          <Hand className="size-4" /> {glue ? "Glue mode on" : <><span className="sm:hidden">Glue mode</span><span className="hidden sm:inline">Hands covered in glue?</span></>}
        </button>
        {wake.supported ? (
          <button
            type="button"
            aria-pressed={wake.on}
            onClick={() => wake.setOn(!wake.on)}
            className={cn("glue-hide inline-flex min-h-11 items-center gap-1.5 rounded-md border px-3 text-sm font-medium", wake.on ? "border-ink bg-ink text-paper" : "border-rule bg-card hover:border-ink")}
          >
            <Sun className="size-4" /> {wake.on ? "Awake" : "Keep awake"}
          </button>
        ) : null}
      </div>
      {glue ? (
        <p className="mb-4 rounded-md bg-remulak/40 p-3 text-sm font-medium text-ink">
          Glue mode: giant buttons, and <strong>press-and-hold</strong> to complete a step so a smudgy tap can&apos;t mark it by accident.
        </p>
      ) : null}
      {locked ? (
        <div className="mb-4">
          <LockNotice task={task} />
        </div>
      ) : null}
      <div className="glue-hide mb-4">
        <TaskAssignee task={task} />
      </div>

      {/* sticky bottom step bar */}
      <div
        data-chrome
        className="no-print fixed inset-x-0 bottom-0 z-40 border-t-2 border-ink bg-paper/97 px-3 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur lg:left-[264px]"
      >
        <div className="mx-auto grid max-w-4xl grid-cols-[1fr_1.6fr_1fr] gap-2">
          <button
            type="button"
            disabled={!prevId}
            onClick={() => prevId && router.push(`/guide/${prevId}`)}
            className={cn("inline-flex items-center justify-center gap-1.5 rounded-lg border-2 border-ink bg-card font-semibold disabled:opacity-30", glue ? "min-h-20 text-xl" : "min-h-14")}
          >
            <ArrowLeft className={glue ? "size-7" : "size-5"} /> <span className={cn(glue && "sr-only sm:not-sr-only")}>Previous</span>
          </button>
          {glue && !done ? (
            <HoldButton
              disabled={locked}
              onConfirm={complete}
              className={cn("rounded-lg border-2 border-ok bg-ok font-semibold text-paper disabled:opacity-40", "min-h-20 text-xl")}
            >
              <Check className="size-7" /> Hold to complete
            </HoldButton>
          ) : (
            <button
              type="button"
              disabled={locked && !done}
              onClick={complete}
              aria-pressed={done}
              className={cn(
                "inline-flex items-center justify-center gap-2 rounded-lg border-2 font-semibold disabled:opacity-40",
                done ? "border-ok bg-ok-bg text-ok" : "border-ok bg-ok text-paper",
                glue ? "min-h-20 text-xl" : "min-h-14 text-lg",
              )}
            >
              <Check className={glue ? "size-7" : "size-5"} /> {done ? (st === "skipped" ? "Skipped — undo" : "Done — undo") : locked ? "Locked" : "Complete step"}
            </button>
          )}
          <button
            type="button"
            disabled={!nextId}
            onClick={() => nextId && router.push(`/guide/${nextId}`)}
            className={cn("inline-flex items-center justify-center gap-1.5 rounded-lg border-2 border-ink bg-ink font-semibold text-paper disabled:opacity-30", glue ? "min-h-20 text-xl" : "min-h-14")}
          >
            <span className={cn(glue && "sr-only sm:not-sr-only")}>Next</span> <ArrowRight className={glue ? "size-7" : "size-5"} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {justDone ? (
          <motion.div
            role="status"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="fixed inset-x-0 bottom-28 z-50 mx-auto flex w-fit items-center gap-3 rounded-full border-2 border-ok bg-card px-4 py-2 shadow-lg lg:left-[264px]"
          >
            <motion.span initial={{ y: 10, scaleY: 0.4 }} animate={{ y: 0, scaleY: 1 }} transition={{ type: "spring", stiffness: 400, damping: 18 }} style={{ originY: 1 }}>
              <ConeProgress pct={100} className="h-7 w-5.5 text-ok" label="Step complete" />
            </motion.span>
            <span className="font-semibold">Step locked in.</span>
            {nextAvailable && nextAvailable.id !== taskId ? (
              <Link href={`/guide/${nextAvailable.id}`} className="text-sm font-medium text-denim underline underline-offset-2">
                Next up: {nextAvailable.title}
              </Link>
            ) : null}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
