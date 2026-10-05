import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { GateCard } from "@/components/beldar/gate-card";
import { PageHeader, Panel, SectionTitle, SourceRefs } from "@/components/beldar/primitives";
import { TaskRow } from "@/components/beldar/task-row";
import { materialById } from "@/content/materials";
import { gateById, phaseBySlug, phases } from "@/content/phases";
import { taskById, tasksByPhase } from "@/content/tasks";

export function generateStaticParams() {
  return phases.map((p) => ({ phase: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/build/[phase]">): Promise<Metadata> {
  const { phase } = await params;
  const p = phaseBySlug[phase];
  return { title: p ? `${p.code} ${p.title}` : "Phase" };
}

export default async function PhasePage({ params }: PageProps<"/build/[phase]">) {
  const { phase: slug } = await params;
  const phase = phaseBySlug[slug];
  if (!phase) notFound();
  const list = tasksByPhase(phase.id);
  const prev = phases.find((p) => p.order === phase.order - 1);
  const next = phases.find((p) => p.order === phase.order + 1);
  const prereqs = Array.from(new Set(list.flatMap((t) => t.prerequisites).filter((id) => taskById[id]?.phaseId !== phase.id)));

  return (
    <>
      <Link href="/build" className="no-print mb-3 inline-flex min-h-11 items-center gap-1 text-sm font-medium text-ink-2 hover:text-ink">
        <ArrowLeft className="size-4" /> All phases
      </Link>
      <PageHeader code={phase.code} title={phase.title} stamp={phase.scheduleNote} lede={phase.description} />

      <div className="grid gap-5 lg:grid-cols-[1.5fr_1fr]">
        <div className="flex flex-col gap-5">
          <Panel>
            <SectionTitle kicker={`${list.length} tasks`}>Tasks</SectionTitle>
            <ul className="divide-y divide-rule">
              {list.map((t) => (
                <TaskRow key={t.id} task={t} />
              ))}
            </ul>
          </Panel>
          {phase.gateIds.length ? (
            <div className="grid gap-4">
              {phase.gateIds.map((g) => (
                <GateCard key={g} gate={gateById[g]} />
              ))}
            </div>
          ) : null}
        </div>

        <div className="flex flex-col gap-4">
          <Panel>
            <p className="label-caps text-ink-3">Goal</p>
            <p className="mt-1 font-medium">{phase.goal}</p>
            <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div>
                <dt className="label-caps text-ink-3">Duration</dt>
                <dd>{phase.estimatedDuration}</dd>
              </div>
              <div>
                <dt className="label-caps text-ink-3">Budget</dt>
                <dd>{phase.budgetNote}</dd>
              </div>
              <div className="col-span-2">
                <dt className="label-caps text-ink-3">Helper</dt>
                <dd>{phase.helper}</dd>
              </div>
              {phase.targetDate ? (
                <div className="col-span-2">
                  <dt className="label-caps text-ink-3">Comfortable-schedule target</dt>
                  <dd>{new Date(phase.targetDate + "T12:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</dd>
                </div>
              ) : null}
            </dl>
            {phase.skippable ? <p className="mt-3 rounded-md bg-caution-bg p-2 text-sm text-caution">{phase.skippable}</p> : null}
          </Panel>

          {prereqs.length ? (
            <Panel>
              <p className="label-caps text-ink-3">Prerequisites from earlier phases</p>
              <ul className="mt-2 space-y-1 text-sm">
                {prereqs.map((id) => (
                  <li key={id}>
                    <Link href={`/guide/${id}`} className="text-denim underline underline-offset-2">
                      {taskById[id].title}
                    </Link>
                  </li>
                ))}
              </ul>
            </Panel>
          ) : null}

          <Panel>
            <p className="label-caps text-ink-3">Completion criteria</p>
            <ul className="mt-2 space-y-1.5 text-[0.9375rem]">
              {phase.completionCriteria.map((c) => (
                <li key={c} className="flex gap-2">
                  <span aria-hidden className="text-ok">
                    ▲
                  </span>
                  {c}
                </li>
              ))}
            </ul>
          </Panel>

          <Panel className="border-signal/40 bg-signal-bg">
            <p className="label-caps text-signal">Mistakes to avoid</p>
            <ul className="mt-2 space-y-1.5 text-[0.9375rem]">
              {phase.mistakes.map((m) => (
                <li key={m}>— {m}</li>
              ))}
            </ul>
          </Panel>

          {phase.materialIds.length ? (
            <Panel>
              <p className="label-caps text-ink-3">Materials & tools</p>
              <ul className="mt-2 flex flex-wrap gap-1.5">
                {phase.materialIds.map((id) => (
                  <li key={id}>
                    <Link href={`/materials#${id}`} className="inline-block rounded-sm border border-rule bg-paper px-2 py-1 text-sm hover:border-denim">
                      {materialById[id]?.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </Panel>
          ) : null}
          {phase.sourceIds.length ? (
            <p className="text-sm text-ink-2">
              Sources: <SourceRefs ids={phase.sourceIds} />
            </p>
          ) : null}
        </div>
      </div>

      <nav aria-label="Phase navigation" className="no-print mt-8 flex justify-between gap-3">
        {prev ? (
          <Link href={`/build/${prev.slug}`} className="inline-flex min-h-11 items-center gap-2 rounded-md border border-rule bg-card px-3 text-sm hover:border-ink">
            <ArrowLeft className="size-4" /> {prev.code} {prev.title}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link href={`/build/${next.slug}`} className="inline-flex min-h-11 items-center gap-2 rounded-md border border-rule bg-card px-3 text-right text-sm hover:border-ink">
            {next.code} {next.title} <ArrowRight className="size-4" />
          </Link>
        ) : null}
      </nav>
    </>
  );
}
