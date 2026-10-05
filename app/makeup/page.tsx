import type { Metadata } from "next";
import { MakeupTests } from "@/components/beldar/makeup-tests";
import { PaintMap } from "@/components/beldar/paint-map";
import { ConfidenceBadge, PageHeader, Panel, SafetyAlert, SectionTitle, SourceRefs } from "@/components/beldar/primitives";
import { makeupSections } from "@/content/makeup";

export const metadata: Metadata = { title: "Makeup Station" };

export default function MakeupPage() {
  return (
    <>
      <PageHeader
        code="FACE-07"
        title="Makeup & Prosthetic Station"
        stamp="PAX + RMGP protocol"
        lede="The appliance spans EVA foam, latex, vinyl and skin. Standard foundation flakes off that mix. The industry answer, used on the 1993 production too: PAX paint as a flexible base, powdered, then Rubber Mask Grease Paint for life."
      />

      <div className="mb-6 grid gap-3 md:grid-cols-2">
        <SafetyAlert level="caution" title="Never heat-dry PAX">It stays permanently tacky. Powder it heavily instead.</SafetyAlert>
        <SafetyAlert level="critical" title="Acetone near the eyes">Wearer&apos;s eyes tightly closed; minimal liquid on the swab; high ventilation.</SafetyAlert>
      </div>

      <section id="paint-map" className="scroll-mt-24">
        <SectionTitle kicker="Original diagram">Paint map</SectionTitle>
        <Panel>
          <PaintMap />
        </Panel>
      </section>

      <section className="mt-10">
        <SectionTitle kicker={`${makeupSections.length} stations`}>Application sequence</SectionTitle>
        <ol className="grid gap-3 md:grid-cols-2">
          {makeupSections.map((m) => (
            <li key={m.id} id={m.id} className="scroll-mt-24 rounded-lg border border-rule bg-card p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="label-caps text-ink-3">
                    {String(m.order).padStart(2, "0")} · {m.stage}
                  </p>
                  <h3 className="font-display text-2xl font-bold uppercase">{m.title}</h3>
                </div>
                {m.confidence ? <ConfidenceBadge level={m.confidence} /> : null}
              </div>
              <p className="mt-1 text-sm text-ink-2">
                <span className="font-medium text-ink">Zones:</span> {m.zones.join(", ")}
              </p>
              <ul className="mt-2 flex flex-wrap gap-1">
                {m.products.map((p) => (
                  <li key={p} className="rounded-sm bg-paper-2 px-1.5 py-0.5 font-mono text-xs">
                    {p}
                  </li>
                ))}
              </ul>
              <ol className="mt-3 list-decimal space-y-1 pl-5 text-[0.9375rem]">
                {m.steps.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ol>
              {m.watchOut?.map((w) => (
                <p key={w} className="mt-2 rounded-md bg-caution-bg p-2 text-sm">
                  {w}
                </p>
              ))}
              <SourceRefs ids={m.sourceIds} className="mt-2" />
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-10">
        <SectionTitle kicker="Device-local">Practice tests</SectionTitle>
        <MakeupTests />
      </section>
    </>
  );
}
