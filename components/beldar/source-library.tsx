"use client";

import { useMemo, useState } from "react";
import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { reliabilityLabels, sourceCategoryLabels, sources } from "@/content/sources";
import type { Source } from "@/types/content";

export function SourceLibrary() {
  const [cat, setCat] = useState<Source["category"] | "all">("all");
  const [q, setQ] = useState("");
  const list = useMemo(
    () =>
      sources.filter(
        (s) => (cat === "all" || s.category === cat) && (!q || `${s.title} ${s.publisher} ${s.supports}`.toLowerCase().includes(q.toLowerCase())),
      ),
    [cat, q],
  );
  return (
    <div>
      <div className="no-print mb-4 flex flex-wrap gap-2">
        {(["all", ...Object.keys(sourceCategoryLabels)] as (Source["category"] | "all")[]).map((c) => (
          <button
            key={c}
            type="button"
            aria-pressed={cat === c}
            onClick={() => setCat(c)}
            className={cn("min-h-9 rounded-full border px-3 text-sm", cat === c ? "border-ink bg-ink text-paper" : "border-rule bg-card hover:border-ink")}
          >
            {c === "all" ? "All" : sourceCategoryLabels[c]}
            <span className="ml-1 font-mono text-xs opacity-70">{c === "all" ? sources.length : sources.filter((s) => s.category === c).length}</span>
          </button>
        ))}
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Filter…" aria-label="Filter sources" className="h-9 min-w-40 flex-1 rounded-full border border-rule bg-card px-3 text-sm" />
      </div>
      {cat === "reference-image" ? (
        <p className="mb-3 text-sm text-ink-2">Reference imagery is listed in the manifest above; no images are copied into this app.</p>
      ) : null}
      <ol className="divide-y divide-rule rounded-lg border border-rule bg-card">
        {list.map((s) => (
          <li key={s.id} id={s.id} className="grid scroll-mt-24 gap-1 p-3 target:bg-remulak/25 sm:grid-cols-[3rem_1fr_auto] sm:gap-3 sm:px-4">
            <span className="font-mono text-sm text-ink-3">[{s.n}]</span>
            <div className="min-w-0">
              <a href={s.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-start gap-1 font-semibold break-words hover:underline">
                {s.title} <ExternalLink className="mt-1 size-3.5 shrink-0" aria-hidden />
              </a>
              <p className="text-sm text-ink-2">{s.publisher}</p>
              <p className="mt-0.5 text-sm">
                <span className="text-ink-3">Supports:</span> {s.supports}
              </p>
            </div>
            <div className="flex flex-wrap items-start gap-1 sm:flex-col sm:items-end">
              <span className="label-caps rounded-sm border border-rule px-1.5 py-0.5" title={reliabilityLabels[s.reliability].note}>
                {reliabilityLabels[s.reliability].label}
              </span>
              <span className="label-caps text-ink-3">{sourceCategoryLabels[s.category]}</span>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
