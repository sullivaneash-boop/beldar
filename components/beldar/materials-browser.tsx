"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AlertTriangle, ExternalLink } from "lucide-react";
import { cn, usd } from "@/lib/utils";
import { actions } from "@/lib/state/actions";
import { useHydrated, useProject } from "@/lib/state/store";
import { budget, inTier } from "@/lib/derive";
import { budgetTiers, materialCategoryLabels, materials, searchLinks } from "@/content/materials";
import type { BudgetTierId, Material } from "@/types/content";
import type { ItemRecord, ShopStatus } from "@/types/state";
import { SourceRefs } from "./primitives";

const statuses: { id: ShopStatus; label: string; cls: string }[] = [
  { id: "need", label: "Need", cls: "border-signal text-signal data-[on=true]:bg-signal data-[on=true]:text-paper" },
  { id: "ordered", label: "Ordered", cls: "border-denim text-denim data-[on=true]:bg-denim data-[on=true]:text-denim-ink" },
  { id: "received", label: "Received", cls: "border-ok text-ok data-[on=true]:bg-ok data-[on=true]:text-paper" },
  { id: "skip", label: "Skip", cls: "border-rule-strong text-ink-3 data-[on=true]:bg-ink-3 data-[on=true]:text-paper" },
];

export function StatusSegment({ value, onChange, label }: { value: ShopStatus; onChange: (s: ShopStatus) => void; label: string }) {
  return (
    <div role="radiogroup" aria-label={`${label} status`} className="grid grid-cols-4 gap-1">
      {statuses.map((st) => (
        <button
          key={st.id}
          type="button"
          role="radio"
          aria-checked={value === st.id}
          data-on={value === st.id}
          onClick={() => onChange(st.id)}
          className={cn("min-h-10 rounded-md border px-1 text-xs font-semibold sm:text-sm", st.cls)}
        >
          {st.label}
        </button>
      ))}
    </div>
  );
}

function PriceInput({ value, onChange, id }: { value?: number; onChange: (n: number | undefined) => void; id: string }) {
  const [draft, setDraft] = useState<string | null>(null);
  return (
    <input
      id={id}
      inputMode="decimal"
      placeholder="0.00"
      value={draft ?? (value === undefined ? "" : String(value))}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={() => {
        if (draft === null) return;
        const n = parseFloat(draft.replace(/[$,]/g, ""));
        onChange(Number.isFinite(n) && n >= 0 ? Math.round(n * 100) / 100 : undefined);
        setDraft(null);
      }}
      className="h-10 w-full rounded-md border border-rule-strong bg-paper px-2 font-mono tabular"
    />
  );
}

function MaterialCard({ m, rec }: { m: Material; rec: ItemRecord }) {
  const status = rec.status ?? "need";
  return (
    <article id={m.id} className={cn("scroll-mt-24 rounded-lg border bg-card p-4", status === "received" ? "border-ok/50" : "border-rule", status === "skip" && "opacity-60")}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="label-caps text-ink-3">
            {materialCategoryLabels[m.category]} · {m.mustHave ? "Must-have" : "Optional"} · {m.consumable ? "Consumable" : "Reusable"}
          </p>
          <h3 className="mt-0.5 text-lg leading-tight font-semibold">{m.name}</h3>
        </div>
        <div className="text-right">
          <p className="font-mono text-lg font-semibold tabular">{m.estimate !== undefined ? usd(m.estimate) : "—"}</p>
          <p className="text-xs text-ink-3">{m.estimate !== undefined ? "research est." : "not priced"}</p>
        </div>
      </div>
      <p className="mt-1 text-[0.9375rem] text-ink-2">{m.purpose}</p>
      <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5 text-sm">
        <dt className="text-ink-3">Qty</dt>
        <dd>{m.qty}</dd>
        {m.spec ? (
          <>
            <dt className="text-ink-3">Spec</dt>
            <dd>{m.spec}</dd>
          </>
        ) : null}
        {m.preferred ? (
          <>
            <dt className="text-ink-3">Preferred</dt>
            <dd>{m.preferred}</dd>
          </>
        ) : null}
        {m.alternative ? (
          <>
            <dt className="text-ink-3">Alternative</dt>
            <dd>{m.alternative}</dd>
          </>
        ) : null}
        {m.retailer ? (
          <>
            <dt className="text-ink-3">Where</dt>
            <dd>{m.retailer}</dd>
          </>
        ) : null}
        <dt className="text-ink-3">Tiers</dt>
        <dd>{m.tiers.length ? m.tiers.map((t) => budgetTiers.find((b) => b.id === t)!.title.split(" ")[0]).join(", ") : "Procedure item"}</dd>
      </dl>
      {m.warning ? (
        <p className="mt-2 flex gap-2 rounded-md bg-signal-bg p-2 text-sm">
          <AlertTriangle className="mt-0.5 size-4 shrink-0 text-signal" aria-hidden />
          {m.warning}
        </p>
      ) : null}
      {m.note ? <p className="mt-2 rounded-md bg-paper-2 p-2 text-sm text-ink-2">{m.note}</p> : null}

      <div className="mt-3">
        <StatusSegment label={m.name} value={status} onChange={(st) => actions.setMaterial(m.id, { status: st })} />
      </div>
      <div className="mt-2 grid grid-cols-2 gap-2">
        <label className="text-xs text-ink-3" htmlFor={`price-${m.id}`}>
          Actual price ($)
          <PriceInput id={`price-${m.id}`} value={rec.actual} onChange={(n) => actions.setMaterial(m.id, { actual: n })} />
        </label>
        <label className="text-xs text-ink-3">
          Qty bought
          <input
            defaultValue={rec.qty ?? ""}
            onBlur={(e) => actions.setMaterial(m.id, { qty: e.target.value || undefined })}
            className="h-10 w-full rounded-md border border-rule-strong bg-paper px-2"
          />
        </label>
      </div>
      <details className="mt-2">
        <summary className="min-h-10 cursor-pointer py-2 text-sm font-medium text-denim">Retailer, link & notes</summary>
        <div className="grid gap-2">
          <label className="text-xs text-ink-3">
            Retailer
            <input defaultValue={rec.retailer ?? ""} onBlur={(e) => actions.setMaterial(m.id, { retailer: e.target.value || undefined })} className="h-10 w-full rounded-md border border-rule-strong bg-paper px-2 text-sm text-ink" />
          </label>
          <label className="text-xs text-ink-3">
            Product URL
            <input type="url" defaultValue={rec.url ?? ""} onBlur={(e) => actions.setMaterial(m.id, { url: e.target.value || undefined })} className="h-10 w-full rounded-md border border-rule-strong bg-paper px-2 text-sm text-ink" />
          </label>
          <label className="text-xs text-ink-3">
            Notes
            <textarea defaultValue={rec.notes ?? ""} onBlur={(e) => actions.setMaterial(m.id, { notes: e.target.value || undefined })} rows={2} className="w-full rounded-md border border-rule-strong bg-paper p-2 text-sm text-ink" />
          </label>
        </div>
      </details>
      <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
        <span className="text-ink-3">Search:</span>
        {searchLinks(m.searchPhrase).map((l) => (
          <a key={l.label} href={l.url} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-9 items-center gap-1 rounded-md border border-rule px-2 hover:border-ink">
            {l.label} <ExternalLink className="size-3" aria-hidden />
          </a>
        ))}
        {rec.url ? (
          <a href={rec.url} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-9 items-center gap-1 rounded-md bg-ink px-2 text-paper">
            Saved link <ExternalLink className="size-3" aria-hidden />
          </a>
        ) : null}
        <SourceRefs ids={m.sourceIds} />
      </div>
    </article>
  );
}

type Filter = {
  tier: BudgetTierId | "all";
  category: Material["category"] | "all";
  need: "all" | "must" | "optional";
  status: ShopStatus | "all";
  use: "all" | "consumable" | "reusable";
};

export function MaterialsBrowser() {
  const s = useProject();
  const hydrated = useHydrated();
  const params = useSearchParams();
  const initialStatus = params.get("status") as ShopStatus | null;
  const [f, setF] = useState<Filter>({ tier: "all", category: "all", need: "all", status: initialStatus ?? "all", use: "all" });
  const tier = s.settings.budgetTier;

  const list = useMemo(
    () =>
      materials.filter((m) => {
        const rec = s.materials[m.id] ?? {};
        const scopeTier = f.tier === "all" ? tier : f.tier;
        if (!(inTier(m, scopeTier) || (m.tiers.length === 0 && scopeTier !== "budget"))) return false;
        if (f.category !== "all" && m.category !== f.category) return false;
        if (f.need === "must" && !m.mustHave) return false;
        if (f.need === "optional" && m.mustHave) return false;
        if (f.status !== "all" && (rec.status ?? "need") !== f.status) return false;
        if (f.use === "consumable" && !m.consumable) return false;
        if (f.use === "reusable" && m.consumable) return false;
        return true;
      }),
    [f, s.materials, tier],
  );

  const b = budget(s);
  const est = list.reduce((a, m) => a + (s.materials[m.id]?.status === "skip" ? 0 : m.estimate ?? 0), 0);
  const actual = list.reduce((a, m) => a + (s.materials[m.id]?.actual ?? 0), 0);

  const select = <K extends keyof Filter>(key: K, label: string, options: [Filter[K], string][]) => (
    <label className="flex flex-col text-xs text-ink-3">
      {label}
      <select value={f[key] as string} onChange={(e) => setF({ ...f, [key]: e.target.value })} className="h-10 rounded-md border border-rule-strong bg-card px-2 text-sm text-ink">
        {options.map(([v, l]) => (
          <option key={v as string} value={v as string}>
            {l}
          </option>
        ))}
      </select>
    </label>
  );

  return (
    <div>
      <section aria-label="Build tier" className="mb-5 grid gap-3 md:grid-cols-3">
        {budgetTiers.map((t) => (
          <button
            key={t.id}
            type="button"
            aria-pressed={tier === t.id}
            onClick={() => actions.setSettings({ budgetTier: t.id })}
            className={cn("rounded-lg border-2 p-4 text-left", tier === t.id ? "border-ink bg-card" : "border-rule bg-paper hover:border-rule-strong")}
          >
            <p className="label-caps text-ink-3">{t.recommended ? "Research recommendation" : t.id === "budget" ? "Fallback" : "Optional"}</p>
            <p className="mt-0.5 font-display text-xl font-bold uppercase">{t.title}</p>
            <p className="mt-1 text-sm text-ink-2">{t.description}</p>
            <p className="mt-2 font-mono text-sm font-semibold">
              {usd(materials.filter((m) => inTier(m, t.id)).reduce((a, m) => a + (m.estimate ?? 0), 0))} est.
            </p>
          </button>
        ))}
      </section>

      <section className="mb-5 grid grid-cols-3 gap-3 rounded-lg border-2 border-ink bg-card p-4" aria-live="polite">
        <div>
          <p className="label-caps text-ink-3">Estimated</p>
          <p className="font-display text-3xl font-bold tabular">{usd(est)}</p>
        </div>
        <div>
          <p className="label-caps text-ink-3">Actual</p>
          <p className="font-display text-3xl font-bold tabular">{hydrated ? usd(actual) : "—"}</p>
        </div>
        <div>
          <p className="label-caps text-ink-3">Difference</p>
          <p className={cn("font-display text-3xl font-bold tabular", actual - est > 0 ? "text-signal" : "text-ok")}>
            {hydrated ? `${actual - est > 0 ? "+" : ""}${usd(actual - est)}` : "—"}
          </p>
        </div>
        <p className="col-span-3 text-xs text-ink-3">
          Totals for items shown. Whole project incl. wardrobe: spent {hydrated ? usd(b.spent) : "—"}. {b.unpriced} procedure items have no research price. Research note: prices are Q3 2026
          estimates and fluctuate — use the search links rather than trusting a number.
        </p>
      </section>

      <div className="no-print mb-4 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
        {select("tier", "Tier", [["all", "Selected tier"], ["budget", "Budget"], ["recommended", "Recommended"], ["deluxe", "Deluxe"]])}
        {select("category", "Category", [["all", "All"], ...(Object.entries(materialCategoryLabels) as [Material["category"], string][])])}
        {select("need", "Required", [["all", "All"], ["must", "Must-have"], ["optional", "Optional"]])}
        {select("status", "Status", [["all", "All"], ["need", "Need to buy"], ["ordered", "Ordered"], ["received", "Received"], ["skip", "Skipped"]])}
        {select("use", "Use", [["all", "All"], ["consumable", "Consumable"], ["reusable", "Reusable"]])}
      </div>

      {list.length === 0 ? (
        <p className="rounded-lg border border-dashed border-rule-strong p-8 text-center text-ink-2">
          {f.status === "need" ? "All terrestrial materials acquired." : "No materials match these filters."}
        </p>
      ) : (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {list.map((m) => (
            <MaterialCard key={m.id + (hydrated ? ":h" : "")} m={m} rec={hydrated ? s.materials[m.id] ?? {} : {}} />
          ))}
        </div>
      )}
    </div>
  );
}
