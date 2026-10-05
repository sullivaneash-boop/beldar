"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { failureModes, rebuildLabels } from "@/content/troubleshooting";
import { taskById } from "@/content/tasks";
import { ConfidenceBadge, SourceRefs } from "./primitives";

export function Troubleshooter() {
  const [q, setQ] = useState("");
  const [rebuildOnly, setRebuildOnly] = useState(false);
  const list = useMemo(() => {
    const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
    return failureModes.filter((f) => {
      if (rebuildOnly && f.rebuild === "no") return false;
      const hay = `${f.symptom} ${f.aliases.join(" ")} ${f.cause} ${f.immediateFix} ${f.permanentFix}`.toLowerCase();
      return terms.every((t) => hay.includes(t));
    });
  }, [q, rebuildOnly]);

  return (
    <div>
      <div className="no-print mb-5 flex flex-wrap items-center gap-3">
        <label className="flex min-h-12 flex-1 items-center gap-2 rounded-lg border-2 border-ink bg-card px-3">
          <Search className="size-5 text-ink-3" aria-hidden />
          <span className="sr-only">Describe the symptom</span>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="What's wrong? e.g. tilt, wrinkles, crust, tacky" className="h-12 w-full bg-transparent text-base outline-none" />
        </label>
        <label className="inline-flex min-h-11 items-center gap-2 text-sm">
          <input type="checkbox" checked={rebuildOnly} onChange={(e) => setRebuildOnly(e.target.checked)} className="size-4 accent-[var(--ink)]" />
          Might need rebuilding
        </label>
      </div>
      {list.length === 0 ? (
        <p className="rounded-lg border border-dashed border-rule-strong p-8 text-center text-ink-2">
          Nothing in the research matches that. Try other words, or check <Link href="/safety" className="underline">Safety</Link>.
        </p>
      ) : null}
      <div className="grid gap-3 lg:grid-cols-2">
        {list.map((f) => (
          <article key={f.id} id={f.id} className="scroll-mt-24 rounded-lg border border-rule bg-card p-4">
            <div className="flex items-start justify-between gap-2">
              <h2 className="font-display text-2xl leading-tight font-bold uppercase">{f.symptom}</h2>
              <span className={cn("label-caps shrink-0 rounded-sm border px-1.5 py-0.5", f.rebuild === "no" ? "border-ok/40 text-ok" : f.rebuild === "maybe" ? "border-caution/50 text-caution" : "border-signal/50 text-signal")}>
                {rebuildLabels[f.rebuild]}
              </span>
            </div>
            <dl className="mt-3 grid gap-2 text-[0.9375rem]">
              <div>
                <dt className="label-caps text-ink-3">Likely cause</dt>
                <dd>{f.cause}</dd>
              </div>
              <div className="rounded-md bg-signal-bg p-2">
                <dt className="label-caps text-signal">Immediate fix</dt>
                <dd className="font-medium">{f.immediateFix}</dd>
              </div>
              <div className="rounded-md bg-paper-2 p-2">
                <dt className="label-caps text-ink-3">Permanent fix</dt>
                <dd>{f.permanentFix}</dd>
              </div>
              {f.prevention ? (
                <div>
                  <dt className="label-caps text-ink-3">Prevention</dt>
                  <dd>{f.prevention}</dd>
                </div>
              ) : null}
            </dl>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
              <ConfidenceBadge level={f.confidence} />
              {f.taskIds.map((t) => (
                <Link key={t} href={`/guide/${t}`} className="rounded-sm border border-rule px-1.5 py-0.5 hover:border-ink">
                  → {taskById[t]?.title}
                </Link>
              ))}
              <SourceRefs ids={f.sourceIds} />
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
