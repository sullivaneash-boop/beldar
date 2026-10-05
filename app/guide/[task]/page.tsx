import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Ruler } from "lucide-react";
import { GuideControls } from "@/components/beldar/guide-controls";
import { ConfidenceBadge, Difficulty, ExtLink, SafetyAlert, SourceRefs, WarningList } from "@/components/beldar/primitives";
import { materialById } from "@/content/materials";
import { gateById, phaseById } from "@/content/phases";
import { taskById, tasks } from "@/content/tasks";

export function generateStaticParams() {
  return tasks.map((t) => ({ task: t.id }));
}

export async function generateMetadata({ params }: PageProps<"/guide/[task]">): Promise<Metadata> {
  const { task } = await params;
  return { title: taskById[task]?.title ?? "Guided build" };
}

function Block({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-rule py-5">
      <h2 className="label-caps mb-2 text-ink-3">{label}</h2>
      {children}
    </section>
  );
}

export default async function GuideStep({ params }: PageProps<"/guide/[task]">) {
  const { task: id } = await params;
  const task = taskById[id];
  if (!task) notFound();
  const index = tasks.findIndex((t) => t.id === id);
  const phase = phaseById[task.phaseId];
  const mats = task.materialIds.map((m) => materialById[m]).filter(Boolean);
  const tools = task.toolIds.map((m) => materialById[m]).filter(Boolean);

  return (
    <article className="mx-auto max-w-3xl pb-24">
      <GuideControls taskId={task.id} prevId={tasks[index - 1]?.id} nextId={tasks[index + 1]?.id} index={index} total={tasks.length} />

      <header>
        <p className="label-caps text-ink-3">
          <Link href={`/build/${phase.slug}`} className="hover:underline">
            {phase.code} · {phase.title}
          </Link>
          {task.checklistId ? ` · Checklist #${task.checklistId}` : ""}
        </p>
        <h1 className="mt-2 font-display text-[2.6rem] leading-[0.95] font-extrabold uppercase sm:text-6xl">{task.title}</h1>
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-ink-2">
          <span className="font-mono">{task.durationLabel}</span>
          {task.costLabel ? <span className="font-mono">{task.costLabel}</span> : null}
          <span className="inline-flex items-center gap-1.5">
            Difficulty <Difficulty value={task.difficulty} />
          </span>
          <span>{task.helper === "required" ? "Helper required" : task.helper === "recommended" ? "Helper recommended" : "Solo"}</span>
          {task.confidence ? <ConfidenceBadge level={task.confidence} /> : null}
        </div>
      </header>

      {(task.blockedByGates ?? []).map((g) => (
        <SafetyAlert key={g} level="critical" title={`${gateById[g].code} — ${gateById[g].title} must pass first`} className="mt-4">
          {gateById[g].rule}
        </SafetyAlert>
      ))}

      <Block label="What we're doing">
        <p className="text-xl leading-snug font-medium">{task.summary}</p>
      </Block>
      <Block label="Why this matters">
        <p className="text-[1.0625rem] leading-relaxed text-ink-2">{task.why}</p>
      </Block>

      {task.measurement ? (
        <div className="my-2 flex items-start gap-3 rounded-lg border-2 border-denim bg-paper-2 p-4">
          <Ruler className="mt-1 size-6 shrink-0 text-denim" aria-hidden />
          <div>
            <p className="label-caps text-denim">Important measurement</p>
            <p className="mt-1 font-mono text-xl leading-snug font-semibold">{task.measurement}</p>
          </div>
        </div>
      ) : null}

      {mats.length || tools.length ? (
        <Block label="Materials & tools">
          <div className="grid gap-4 sm:grid-cols-2">
            {mats.length ? (
              <div>
                <p className="mb-1.5 text-sm font-semibold">Materials</p>
                <ul className="space-y-1.5">
                  {mats.map((m) => (
                    <li key={m.id}>
                      <Link href={`/materials#${m.id}`} className="block rounded-md border border-rule bg-card px-3 py-2 hover:border-ink">
                        <span className="font-medium">{m.name}</span>
                        <span className="block text-sm text-ink-2">{m.spec}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            {tools.length ? (
              <div>
                <p className="mb-1.5 text-sm font-semibold">Tools</p>
                <ul className="space-y-1.5">
                  {tools.map((m) => (
                    <li key={m.id}>
                      <Link href={`/materials#${m.id}`} className="block rounded-md border border-rule bg-card px-3 py-2 hover:border-ink">
                        <span className="font-medium">{m.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </Block>
      ) : null}

      <Block label="Instructions">
        <ol className="space-y-4">
          {task.instructions.map((step, i) => (
            <li key={i} className="flex gap-4">
              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-ink font-mono text-sm font-semibold text-paper">{i + 1}</span>
              <p className="pt-1 text-[1.1875rem] leading-relaxed">{step}</p>
            </li>
          ))}
        </ol>
      </Block>

      {task.warningIds?.length || task.watchOut.length ? (
        <Block label="Watch out">
          <div className="flex flex-col gap-2">
            <WarningList ids={task.warningIds} />
            {task.watchOut.map((w) => (
              <SafetyAlert key={w} level={w.startsWith("Research gap") ? "info" : "caution"} title={w} />
            ))}
          </div>
        </Block>
      ) : null}

      <Block label="Success should look like">
        <ul className="space-y-2">
          {task.completionCriteria.map((c) => (
            <li key={c} className="flex items-start gap-3 rounded-md bg-ok-bg p-3 text-[1.0625rem] font-medium">
              <span className="text-ok" aria-hidden>
                ▲
              </span>
              {c}
            </li>
          ))}
        </ul>
      </Block>

      {task.referenceLink || task.sourceIds.length ? (
        <Block label="Reference">
          <div className="flex flex-wrap items-center gap-3">
            {task.referenceLink ? <ExtLink href={task.referenceLink.url}>{task.referenceLink.label}</ExtLink> : null}
            {task.sourceIds.length ? (
              <span className="text-sm text-ink-2">
                Sources <SourceRefs ids={task.sourceIds} />
              </span>
            ) : null}
          </div>
        </Block>
      ) : null}
    </article>
  );
}
