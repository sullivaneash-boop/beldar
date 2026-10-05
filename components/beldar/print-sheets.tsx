"use client";

import Link from "next/link";
import { ArrowLeft, Printer } from "lucide-react";
import { usd } from "@/lib/utils";
import { useHydrated, useProject } from "@/lib/state/store";
import { personName, roleAssignee, tierMaterials } from "@/lib/derive";
import { fmt, frustum } from "@/lib/geometry";
import { materialCategoryLabels } from "@/content/materials";
import { measurementDefs } from "@/content/cone";
import { phases } from "@/content/phases";
import { tasks } from "@/content/tasks";
import { applicationSteps, makeupSections, stageLabels } from "@/content/makeup";
import { repairKit, survivalCards } from "@/content/survival";
import { ConeMark } from "./cone-mark";
import { printSheets, type PrintSheetId } from "@/content/print";


const Box = () => <span className="inline-block size-4 shrink-0 border-2 border-ink align-middle" aria-hidden />;

function Sheet({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-card p-6 text-ink print:bg-white print:p-0">
      <div className="mb-4 flex items-center justify-between border-b-2 border-ink pb-2">
        <div className="flex items-center gap-2">
          <ConeMark className="h-8 w-6" />
          <div>
            <p className="font-display text-2xl leading-none font-extrabold uppercase">{title}</p>
            <p className="label-caps">Beldar Build HQ · Halloween 2026</p>
          </div>
        </div>
        <p className="font-mono text-xs">Printed ____/____</p>
      </div>
      {children}
    </div>
  );
}

export function PrintSheet({ id }: { id: PrintSheetId }) {
  const s = useProject();
  const hydrated = useHydrated();
  const meta = printSheets.find((p) => p.id === id)!;
  const units = s.settings.units;

  let body: React.ReactNode = null;
  if (id === "shopping" || id === "materials") {
    const list = tierMaterials(s.settings.budgetTier).filter((m) => id === "materials" || (m.mustHave && (s.materials[m.id]?.status ?? "need") === "need"));
    const cats = Array.from(new Set(list.map((m) => m.category)));
    body = (
      <>
        {cats.map((c) => (
          <div key={c} className="mb-4 print-avoid-break">
            <h3 className="mb-1 font-display text-lg font-bold uppercase">{materialCategoryLabels[c]}</h3>
            <table className="w-full border-collapse text-sm">
              <tbody>
                {list
                  .filter((m) => m.category === c)
                  .map((m) => (
                    <tr key={m.id} className="border-b border-rule align-top">
                      <td className="w-6 py-1.5">
                        <Box />
                      </td>
                      <td className="py-1.5 pr-2">
                        <span className="font-semibold">{m.name}</span> — {m.qty}
                        {m.spec ? `, ${m.spec}` : ""}
                        <span className="block text-xs text-ink-2">{m.purpose}</span>
                      </td>
                      <td className="py-1.5 pr-2 text-xs">{id === "materials" ? s.materials[m.id]?.status ?? "need" : m.retailer ?? ""}</td>
                      <td className="py-1.5 text-right font-mono">{m.estimate !== undefined ? usd(m.estimate) : "—"}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        ))}
        {list.length === 0 ? <p>All terrestrial materials acquired.</p> : null}
        <p className="mt-2 text-xs">Prices are research estimates (Q3 2026) and fluctuate.</p>
      </>
    );
  } else if (id === "measurements") {
    const m = s.measurements;
    const f = m.circumference ? frustum({ circumference: m.circumference, height: m.height ?? 10.5, topRadius: m.topRadius ?? 1.75 }) : null;
    body = (
      <div className="grid gap-4">
        <table className="w-full border-collapse text-sm">
          <tbody>
            {measurementDefs.map((d) => (
              <tr key={d.id} className="border-b border-ink/40 align-top">
                <td className="py-3 pr-3">
                  <span className="font-semibold">
                    {d.label} {d.symbol ? `(${d.symbol})` : ""}
                  </span>
                  <span className="block text-xs">{d.how}</span>
                </td>
                <td className="w-40 py-3 font-mono text-lg">{hydrated && m[d.id] !== undefined ? fmt(m[d.id]!, units) : "________"}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="rounded border-2 border-ink p-3 font-mono text-sm">
          <p className="font-semibold">r₁ = C ÷ 2π · s = √(h² + (r₁−r₂)²) · R = s·r₁ ÷ (r₁−r₂) · θ = 360°·r₁ ÷ R</p>
          {f ? (
            <p className="mt-2">
              r₁ {fmt(f.r1, units)} · r₂ {fmt(f.r2, units)} · h {fmt(f.h, units)} · R {fmt(f.outerRadius, units)} · inner {fmt(f.innerRadius, units)} · θ {f.angleDeg.toFixed(1)}° · bottom arc {fmt(f.bottomArc, units)} · top arc {fmt(f.topArc, units)}
            </p>
          ) : (
            <p className="mt-2">r₁ ______ · R ______ · inner ______ · θ ______ · bottom arc ______</p>
          )}
        </div>
        <p className="text-sm">Paper template (Prototype 0) is mandatory before cutting foam. Rests securely without holding it? <Box /> yes</p>
      </div>
    );
  } else if (id === "checklist") {
    body = phases.map((p) => (
      <div key={p.id} className="mb-3 print-avoid-break">
        <h3 className="font-display text-lg font-bold uppercase">
          {p.code} {p.title}
        </h3>
        <ul className="text-sm">
          {tasks
            .filter((t) => t.phaseId === p.id)
            .map((t) => (
              <li key={t.id} className="flex items-start gap-2 border-b border-rule py-1">
                {hydrated && s.tasks[t.id] ? <span className="inline-grid size-4 place-items-center border-2 border-ink text-[10px]">✓</span> : <Box />}
                <span className="flex-1">
                  {t.title} <span className="text-xs text-ink-2">— {t.completionCriteria[0]}</span>
                </span>
                <span className="font-mono text-xs">{t.durationLabel}</span>
              </li>
            ))}
        </ul>
      </div>
    ));
  } else if (id === "makeup") {
    body = (
      <ol className="grid gap-2 text-sm sm:grid-cols-2 print:grid-cols-2">
        {makeupSections.map((m) => (
          <li key={m.id} className="rounded border border-ink/40 p-2 print-avoid-break">
            <p className="font-semibold">
              {m.order}. {m.title} <span className="font-mono text-xs">· {m.stage}</span>
            </p>
            <ul className="mt-1 list-disc pl-4">
              {m.steps.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    );
  } else if (id === "halloween") {
    body = (
      <table className="w-full border-collapse text-sm">
        <tbody>
          {applicationSteps.map((st) => (
            <tr key={st.id} className="border-b border-ink/40 align-top">
              <td className="w-6 py-2">
                <Box />
              </td>
              <td className="w-14 py-2 font-mono">T-{st.tMinus}</td>
              <td className="py-2 pr-2">
                <span className="label-caps">{stageLabels[st.stage]}</span>
                <span className="block font-semibold">{st.title}</span>
                <span className="block text-xs">{st.detail}</span>
                {st.safety ? <span className="block text-xs font-semibold">⚠ {st.safety}</span> : null}
              </td>
              <td className="w-24 py-2 text-xs">{hydrated ? personName(s, roleAssignee(s, `h:${st.id}`, st.role)) : ""}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  } else if (id === "repair-card") {
    const seam = survivalCards.find((c) => c.id === "seam")!;
    const remove = survivalCards.find((c) => c.id === "remove")!;
    body = (
      <div className="grid w-full max-w-[7in] grid-cols-2 gap-0 border-2 border-dashed border-ink print:max-w-none">
        {[seam, remove].map((c) => (
          <div key={c.id} className="border-r-2 border-dashed border-ink p-3 last:border-r-0">
            <p className="font-display text-xl font-extrabold uppercase">{c.title}</p>
            <ol className="mt-1 list-decimal pl-4 text-[11px] leading-snug">
              {c.steps.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ol>
          </div>
        ))}
        <div className="col-span-2 border-t-2 border-dashed border-ink p-3 text-[11px]">
          <span className="font-semibold">Kit:</span> {repairKit.join(" · ")} · <span className="font-semibold">No candles. Drink water.</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="no-print mb-4 flex flex-wrap items-center gap-2">
        <Link href="/print" className="inline-flex min-h-11 items-center gap-1 rounded-md border border-rule bg-card px-3 text-sm">
          <ArrowLeft className="size-4" /> Print Center
        </Link>
        <button type="button" onClick={() => window.print()} className="inline-flex min-h-11 items-center gap-2 rounded-md bg-ink px-4 font-semibold text-paper">
          <Printer className="size-4" /> Print {meta.title.toLowerCase()}
        </button>
      </div>
      <div className="rounded-lg border border-rule shadow-sm print:border-0 print:shadow-none">
        <Sheet title={meta.title}>{body}</Sheet>
      </div>
    </div>
  );
}
