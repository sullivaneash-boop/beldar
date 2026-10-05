"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, CalendarDays, Clock, LifeBuoy, ShieldAlert, Triangle, Wallet } from "lucide-react";
import { cn, usd } from "@/lib/utils";
import { useHydrated, useProject } from "@/lib/state/store";
import {
  activeAlerts, assigneeFor, budget, currentPhase, daysUntil, nextGate, phaseProgress, progress, shopping, upNext,
} from "@/lib/derive";
import { phases } from "@/content/phases";
import { schedule, acceleratedSchedule } from "@/content/meta";
import type { PersonId } from "@/types/state";
import { ConeProgress } from "./cone-mark";
import { GateCard, Stamp } from "./gate-card";
import { Avatar, TaskCheckbox } from "./task-controls";
import { Panel, SafetyAlert, Stat } from "./primitives";

function statusLine(pct: number) {
  if (pct === 0) return "Awaiting terrestrial acquisition.";
  if (pct < 25) return "Human disguise fabrication: initiated.";
  if (pct < 60) return "Structural cone integrity: nominal.";
  if (pct < 100) return "Disguise approaching deployment readiness.";
  return "Approved for deployment. Consume mass quantities.";
}

export function Dashboard() {
  const s = useProject();
  const hydrated = useHydrated();
  const [person, setPerson] = useState<PersonId | "all">("all");

  if (!hydrated) {
    return (
      <div className="grid min-h-[40vh] place-items-center" aria-busy="true">
        <motion.div animate={{ scaleY: [1, 1.12, 1] }} transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }} style={{ originY: 1 }}>
          <ConeProgress pct={0} className="h-14 w-11 text-ink-3" label="Loading project data" />
        </motion.div>
      </div>
    );
  }

  const p = progress(s);
  const phase = currentPhase(s);
  const pp = phaseProgress(s, phase);
  const days = daysUntil(s.settings.halloweenDate);
  const b = budget(s);
  const shop = shopping(s);
  const gate = nextGate(s);
  const alerts = activeAlerts(s);
  const next = upNext(s, 5, person === "all" ? undefined : person);
  const latestComplete = [...phases].reverse().find((ph) => phaseProgress(s, ph).status === "complete");
  const today = new Date();
  const behind = schedule.filter((m) => {
    const ph = phases.find((x) => x.id === m.phaseId);
    return ph && daysUntil(m.date, today) < 0 && phaseProgress(s, ph).status !== "complete";
  });

  return (
    <div className="flex flex-col gap-5">
      <p className="label-caps flex items-center gap-2 text-remulak-ink">
        <span className="inline-block size-2 rounded-full bg-remulak ring-2 ring-remulak/40" aria-hidden />
        System status · {statusLine(p.pct)}
      </p>

      {/* KPI band */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Panel className="col-span-2 flex items-center gap-4 lg:col-span-1">
          <ConeProgress pct={p.pct} className="h-20 w-16 text-ink" />
          <Stat label="Overall progress" value={`${p.pct}%`} sub={`${p.done} of ${p.total} tasks`} />
        </Panel>
        <Panel>
          <Stat label="Until Halloween" value={days >= 0 ? days : 0} sub={days === 0 ? "It's today. Deploy." : days < 0 ? "Halloween has passed" : `days · ${new Date(s.settings.halloweenDate + "T12:00").toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })}`} />
        </Panel>
        <Panel>
          <Stat label="Current phase" value={<span className="text-2xl sm:text-[1.75rem]">{phase.code}</span>} sub={<Link href={`/build/${phase.slug}`} className="font-medium text-ink underline underline-offset-2">{phase.title}</Link>} />
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-paper-2" aria-hidden>
            <div className="h-full bg-denim" style={{ width: `${pp.pct}%` }} />
          </div>
        </Panel>
        <Panel className="col-span-2 lg:col-span-1">
          <p className="label-caps flex items-center gap-1.5 text-ink-3">
            <Wallet className="size-3.5" aria-hidden /> Terrestrial currency
          </p>
          <dl className="mt-2 grid grid-cols-3 gap-2 font-mono text-sm tabular">
            <div>
              <dt className="text-ink-3 text-xs">Planned</dt>
              <dd className="font-semibold">{usd(b.target)}</dd>
            </div>
            <div>
              <dt className="text-ink-3 text-xs">Spent</dt>
              <dd className="font-semibold">{usd(b.spent)}</dd>
            </div>
            <div>
              <dt className="text-ink-3 text-xs">Left</dt>
              <dd className={cn("font-semibold", b.remaining < 0 && "text-signal")}>{usd(b.remaining)}</dd>
            </div>
          </dl>
          <Link href="/materials" className="mt-2 inline-block text-xs text-ink-2 underline underline-offset-2">
            {b.targetIsCustom ? "Your target budget" : "Research estimate incl. wardrobe midpoint"} →
          </Link>
        </Panel>
      </div>

      {latestComplete ? (
        <div className="flex flex-wrap items-center gap-3 rounded-lg border border-ok/40 bg-ok-bg px-4 py-3">
          <Stamp text={`${latestComplete.code} accepted by Remulak`} className="text-base" />
          <span className="text-sm text-ink-2">{latestComplete.title} complete.</span>
        </div>
      ) : null}

      <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        {/* Up next */}
        <Panel>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-display text-2xl font-bold uppercase">Up next</h2>
            <div className="flex flex-wrap gap-1" role="group" aria-label="Filter by person">
              {(["all", "sully", "mom", "sister"] as const).map((id) => (
                <button
                  key={id}
                  type="button"
                  aria-pressed={person === id}
                  onClick={() => setPerson(id)}
                  className={cn("min-h-9 rounded-full border px-3 text-sm", person === id ? "border-ink bg-ink text-paper" : "border-rule text-ink-2 hover:bg-paper-2")}
                >
                  {id === "all" ? "Everyone" : `${s.settings.people[id]}'s jobs`}
                </button>
              ))}
            </div>
          </div>
          {next.length === 0 ? (
            <p className="mt-6 mb-4 text-center text-ink-2">
              {person === "all" ? "Fabrication schedule nominal. Nothing is unlocked right now." : `No unlocked jobs assigned to ${s.settings.people[person as PersonId]}. Assign tasks from the Build Plan.`}
            </p>
          ) : (
            <ol className="mt-3 divide-y divide-rule">
              {next.map((t) => (
                <li key={t.id} className="flex items-center gap-3 py-3">
                  <TaskCheckbox task={t} />
                  <Link href={`/guide/${t.id}`} className="group min-w-0 flex-1">
                    <span className="block font-semibold group-hover:underline">{t.title}</span>
                    <span className="block truncate text-sm text-ink-2">
                      {phases.find((x) => x.id === t.phaseId)?.code} · {t.durationLabel}
                      {t.checklistId ? ` · #${t.checklistId}` : ""}
                    </span>
                  </Link>
                  <Avatar who={assigneeFor(s, t)} />
                  <ArrowRight className="size-4 text-ink-3" aria-hidden />
                </li>
              ))}
            </ol>
          )}
          <Link href="/guide" className="mt-2 inline-flex min-h-11 items-center gap-2 rounded-md bg-ink px-4 font-semibold text-paper">
            Start guided build <ArrowRight className="size-4" />
          </Link>
        </Panel>

        <div className="flex flex-col gap-5">
          {/* Alerts */}
          <Panel>
            <h2 className="flex items-center gap-2 font-display text-2xl font-bold uppercase">
              <ShieldAlert className="size-5 text-signal" aria-hidden /> Critical alerts
            </h2>
            <div className="mt-3 flex flex-col gap-2">
              {alerts.slice(0, 4).map((a) => (
                <Link key={a.id} href={a.href} className="block">
                  <SafetyAlert level={a.level} title={a.text} className="hover:brightness-[0.98]" />
                </Link>
              ))}
            </div>
          </Panel>
          {gate ? (
            <div>
              <p className="label-caps mb-2 text-ink-3">Next decision gate</p>
              <GateCard gate={gate} compact />
            </div>
          ) : (
            <Panel className="border-ok">
              <Stamp text="All gates passed" />
            </Panel>
          )}
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_1.4fr]">
        {/* Shopping */}
        <Panel>
          <h2 className="font-display text-2xl font-bold uppercase">Shopping status</h2>
          <p className="text-sm text-ink-2">{s.settings.budgetTier === "recommended" ? "Recommended build" : s.settings.budgetTier === "budget" ? "Budget build" : "Deluxe build"} · materials + wardrobe</p>
          {shop.need === 0 ? (
            <p className="mt-4 font-medium text-ok">All terrestrial materials acquired.</p>
          ) : null}
          <div className="mt-3 flex h-3 overflow-hidden rounded-full bg-paper-2" aria-hidden>
            <div className="bg-ok" style={{ width: `${(shop.received / shop.total) * 100}%` }} />
            <div className="bg-denim-2" style={{ width: `${(shop.ordered / shop.total) * 100}%` }} />
          </div>
          <dl className="mt-3 grid grid-cols-3 gap-2 text-center">
            {[
              ["Need to buy", shop.need, "text-signal"],
              ["Ordered", shop.ordered, "text-denim"],
              ["Received", shop.received, "text-ok"],
            ].map(([label, n, c]) => (
              <div key={label as string} className="rounded-md bg-paper-2 py-2">
                <dd className={cn("font-display text-3xl font-bold", c as string)}>{n}</dd>
                <dt className="text-xs text-ink-2">{label}</dt>
              </div>
            ))}
          </dl>
          <Link href="/materials?status=need" className="mt-3 inline-flex min-h-11 items-center gap-1 font-medium text-denim underline underline-offset-2">
            Open shopping list <ArrowRight className="size-4" />
          </Link>
        </Panel>

        {/* Schedule */}
        <Panel>
          <h2 className="flex items-center gap-2 font-display text-2xl font-bold uppercase">
            <CalendarDays className="size-5" aria-hidden /> Research schedule
          </h2>
          {behind.length ? (
            <SafetyAlert level="caution" title={`${behind.length} milestone${behind.length > 1 ? "s" : ""} past the comfortable-schedule date`} className="mt-3">
              {acceleratedSchedule.summary} <strong>{acceleratedSchedule.warning}</strong>
            </SafetyAlert>
          ) : null}
          <ol className="mt-3 flex flex-col">
            {schedule.map((m) => {
              const ph = phases.find((x) => x.id === m.phaseId)!;
              const st = phaseProgress(s, ph).status;
              const d = daysUntil(m.date, today);
              const late = d < 0 && st !== "complete";
              return (
                <li key={m.date + m.label} className="grid grid-cols-[4.5rem_1rem_1fr] items-start gap-2 py-1.5">
                  <span className="font-mono text-xs text-ink-2 tabular">
                    {new Date(m.date + "T12:00").toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                  </span>
                  <Triangle
                    className={cn("mt-0.5 size-3.5", st === "complete" ? "fill-ok text-ok" : late ? "fill-signal text-signal" : d <= 7 && d >= 0 ? "fill-remulak text-remulak-ink" : "text-rule-strong")}
                    aria-hidden
                  />
                  <span className="text-sm">
                    <span className="font-semibold">{m.label}</span>
                    <span className="text-ink-2"> — {m.detail}</span>
                    {st === "complete" ? <span className="sr-only"> (complete)</span> : late ? <span className="font-medium text-signal"> Behind.</span> : null}
                  </span>
                </li>
              );
            })}
          </ol>
        </Panel>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Link href="/halloween" className="group flex min-h-20 items-center gap-3 rounded-lg border-2 border-ink bg-card p-4 hover:bg-paper-2">
          <Clock className="size-7" aria-hidden />
          <span>
            <span className="block font-display text-xl font-bold uppercase">Halloween mode</span>
            <span className="text-sm text-ink-2">Preflight checklist for application day</span>
          </span>
        </Link>
        <Link href="/survival" className="group flex min-h-20 items-center gap-3 rounded-lg border-2 border-signal bg-signal-bg p-4">
          <LifeBuoy className="size-7 text-signal" aria-hidden />
          <span>
            <span className="block font-display text-xl font-bold text-signal uppercase">Party survival</span>
            <span className="text-sm text-ink-2">Seam lifting? Too hot? Open this.</span>
          </span>
        </Link>
        <Link href="/cone-lab" className="group flex min-h-20 items-center gap-3 rounded-lg border-2 border-ink bg-card p-4 hover:bg-paper-2">
          <Triangle className="size-7" aria-hidden />
          <span>
            <span className="block font-display text-xl font-bold uppercase">Cone Lab</span>
            <span className="text-sm text-ink-2">Measurements → pattern</span>
          </span>
        </Link>
      </div>
    </div>
  );
}
