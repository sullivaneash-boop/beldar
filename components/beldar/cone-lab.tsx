"use client";

import { useState } from "react";
import Link from "next/link";
import { Download, Printer } from "lucide-react";
import { cn } from "@/lib/utils";
import { actions } from "@/lib/state/actions";
import { useHydrated, useProject } from "@/lib/state/store";
import { IN_TO_CM, fmt, frustum, patternSvg, sectorPath } from "@/lib/geometry";
import { measurementDefs } from "@/content/cone";
import type { Measurements } from "@/types/state";
import { ConeDiagramFront, ConeDiagramSide } from "./cone-diagram";
import { ConfidenceBadge, SafetyAlert } from "./primitives";

function MeasurementInput({
  id, label, symbol, how, units: unitsIn, value, placeholder, onChange, confidence, range, unitLabel,
}: {
  unitLabel?: string;
  id: string; label: string; symbol?: string; how: string; units: "in" | "cm"; value: number | undefined; placeholder?: number;
  onChange: (inches: number | undefined) => void; confidence: React.ComponentProps<typeof ConfidenceBadge>["level"]; range?: [number, number];
}) {
  const units = unitLabel ? "in" : unitsIn;
  const shown = value === undefined ? "" : units === "cm" ? +(value * IN_TO_CM).toFixed(1) : +value.toFixed(2);
  const [draft, setDraft] = useState<string | null>(null);
  return (
    <div className="rounded-lg border border-rule bg-card p-3">
      <div className="flex flex-wrap items-start justify-between gap-x-2 gap-y-1">
        <label htmlFor={id} className="font-semibold">
          {label} {symbol ? <span className="font-mono text-denim">({symbol})</span> : null}
        </label>
        <ConfidenceBadge level={confidence} />
      </div>
      <p className="mt-0.5 text-sm text-ink-2">{how}</p>
      <div className="mt-2 flex items-center gap-2">
        <input
          id={id}
          inputMode="decimal"
          value={draft ?? String(shown)}
          placeholder={placeholder !== undefined ? String(units === "cm" ? +(placeholder * IN_TO_CM).toFixed(1) : placeholder) : "—"}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={() => {
            if (draft === null) return;
            const n = parseFloat(draft.replace(",", "."));
            onChange(Number.isFinite(n) && n > 0 ? (units === "cm" ? n / IN_TO_CM : n) : undefined);
            setDraft(null);
          }}
          onKeyDown={(e) => e.key === "Enter" && (e.target as HTMLInputElement).blur()}
          className="h-12 w-full rounded-md border border-rule-strong bg-paper px-3 font-mono text-lg tabular"
        />
        <span className="w-8 font-mono text-sm text-ink-2">{unitLabel ?? units}</span>
      </div>
      {range ? (
        <p className="mt-1 font-mono text-xs text-ink-3">
          Research range {fmt(range[0], units, 1)}–{fmt(range[1], units, 1)}
        </p>
      ) : null}
    </div>
  );
}

export function ConeLab() {
  const s = useProject();
  const hydrated = useHydrated();
  const units = s.settings.units;
  const m = hydrated ? s.measurements : ({} as Measurements);
  const height = m.height ?? 10.5;
  const topRadius = m.topRadius ?? 1.75;
  const f = m.circumference ? frustum({ circumference: m.circumference, height, topRadius }) : null;

  const download = () => {
    if (!f) return;
    const blob = new Blob([patternSvg(f)], { type: "image/svg+xml" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `beldar-frustum-pattern-C${f.bottomArc.toFixed(1)}in.svg`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const out = (label: string, v: string, note?: string) => (
    <div className="border-b border-rule py-2 last:border-0">
      <div className="flex items-baseline justify-between gap-3">
        <dt className="text-sm text-ink-2">{label}</dt>
        <dd className="font-mono text-lg font-semibold tabular">{v}</dd>
      </div>
      {note ? <p className="text-xs text-ink-3">{note}</p> : null}
    </div>
  );

  // preview scaling
  const previewScale = f ? 260 / Math.max(f.width, f.depth) : 1;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-2">
        <span className="label-caps text-ink-3">Units</span>
        {(["in", "cm"] as const).map((u) => (
          <button
            key={u}
            type="button"
            aria-pressed={units === u}
            onClick={() => actions.setSettings({ units: u })}
            className={cn("min-h-10 rounded-md border px-4 font-mono text-sm", units === u ? "border-ink bg-ink text-paper" : "border-rule bg-card")}
          >
            {u === "in" ? "inches" : "centimeters"}
          </button>
        ))}
        <span className="text-xs text-ink-3">Stored in inches (the research&apos;s unit).</span>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
        <div className="grid content-start gap-3 sm:grid-cols-2 lg:grid-cols-1 2xl:grid-cols-2">
          {measurementDefs.map((d) => (
            <MeasurementInput
              key={d.id}
              id={`m-${d.id}`}
              label={d.label}
              symbol={d.symbol}
              how={d.how}
              units={units}
              confidence={d.confidence}
              range={d.range}
              placeholder={d.defaultValue}
              value={m[d.id]}
              onChange={(v) => actions.setMeasurement(d.id, v)}
            />
          ))}
          <MeasurementInput
            id="m-weight"
            label="Prototype weight"
            how="Weigh your structural prototype. Research only says 'mere ounces'."
            units="in"
            unitLabel="oz"
            confidence="research-gap"
            value={m.weightOz}
            onChange={(v) => actions.setMeasurement("weightOz", v)}
          />
        </div>

        <div className="flex flex-col gap-4">
          <section className="rounded-lg border-2 border-ink bg-card p-4" aria-live="polite">
            <h2 className="font-display text-2xl font-bold uppercase">Pattern output</h2>
            {!f ? (
              <p className="mt-3 text-ink-2">
                Enter the head circumference (C) to generate the frustum pattern. Height defaults to 10.5″ and top radius to 1.75″ (mid-range of the research) until you set them.
              </p>
            ) : (
              <>
                <dl className="mt-2">
                  {out("Base radius r₁ = C ÷ 2π", fmt(f.r1, units))}
                  {out("Top radius r₂", fmt(f.r2, units), `Top opening ${fmt(f.topDiameter, units, 1)} across — research: approx 3–4″`)}
                  {out("Height h", fmt(f.h, units))}
                  {out("Slant height (side seam length)", fmt(f.slant, units))}
                  {out("Pattern outer radius R", fmt(f.outerRadius, units), "Compass/string radius for the long convex bottom arc")}
                  {out("Pattern inner radius", fmt(f.innerRadius, units), "Radius for the shorter concave top arc")}
                  {out("Sector angle θ", `${f.angleDeg.toFixed(1)}°`)}
                  {out("Bottom arc length", fmt(f.bottomArc, units), "Must equal your head circumference")}
                  {out("Top arc length", fmt(f.topArc, units))}
                  {out("Foam needed (bounding box)", `${fmt(f.width, units, 1)} × ${fmt(f.depth, units, 1)}`, "One continuous piece; add margin. Two halves is also allowed.")}
                </dl>
                <svg viewBox={`${-150} ${-20} 300 ${f.depth * previewScale + 40}`} className="mt-3 w-full text-ink" role="img" aria-label="Flat pattern preview">
                  <path d={sectorPath(f.outerRadius, f.innerRadius, f.angleDeg, previewScale, 0, f.outerRadius * previewScale - 10)} fill="var(--flesh)" stroke="currentColor" strokeWidth="1.5" />
                  <text x="0" y={(f.outerRadius - (f.outerRadius + f.innerRadius) / 2) * previewScale + 6} textAnchor="middle" fontSize="11" className="font-mono" fill="currentColor">
                    θ {f.angleDeg.toFixed(1)}°
                  </text>
                </svg>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button type="button" onClick={download} className="inline-flex min-h-11 items-center gap-2 rounded-md bg-ink px-4 font-semibold text-paper">
                    <Download className="size-4" /> 1:1 SVG pattern
                  </button>
                  <Link href="/print/measurements" className="inline-flex min-h-11 items-center gap-2 rounded-md border border-ink px-4 font-semibold">
                    <Printer className="size-4" /> Worksheet
                  </Link>
                </div>
                <p className="mt-2 text-xs text-ink-3">
                  The SVG is drawn at true size (1 unit = 1 inch). Print at 100% with tiling, or use Templatemaker.nl with the same r₁, r₂, h.
                </p>
              </>
            )}
          </section>
          {f?.issues.map((i) => (
            <SafetyAlert key={i} level="caution" title={i} />
          ))}
          <SafetyAlert level="caution" title="Requires prototyping">
            Heads are oval, not cylindrical. The foam base deforms slightly to fit, but a paper template test (Prototype 0) is mandatory before cutting foam. The clay dome adds a little height above h — check the finished height on the paper cone.
          </SafetyAlert>
          <p className="text-xs text-ink-3">
            Math: standard right-frustum development (the same calculation as the Templatemaker.nl generator the research cites). Slant s = √(h² + (r₁−r₂)²), R = s·r₁/(r₁−r₂), θ = 360°·r₁/R.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <figure className="rounded-lg border border-rule bg-card p-3">
          <ConeDiagramFront labels={{ h: f ? `h = ${fmt(f.h, units, 1)}` : undefined, width: m.foreheadWidth ? `forehead ${fmt(m.foreheadWidth, units, 1)}` : undefined }} />
          <figcaption className="label-caps mt-1 text-center text-ink-3">Front elevation</figcaption>
        </figure>
        <figure className="rounded-lg border border-rule bg-card p-3">
          <ConeDiagramSide callouts={false} labels={f ? { h: `h = ${fmt(f.h, units, 1)}`, r1: `r₁ = ${fmt(f.r1, units)}`, r2: `r₂ ${fmt(f.r2, units)}` } : undefined} />
          <figcaption className="label-caps mt-1 text-center text-ink-3">Side profile · slight backward lean</figcaption>
        </figure>
      </div>
    </div>
  );
}
