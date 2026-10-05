import type { Metadata } from "next";
import { ConeLab } from "@/components/beldar/cone-lab";
import { ConfidenceBadge, ExtLink, PageHeader, Panel, SectionTitle, SourceRefs } from "@/components/beldar/primitives";
import { referenceFacts } from "@/content/cone";

export const metadata: Metadata = { title: "Cone Lab" };

export default function ConeLabPage() {
  return (
    <>
      <PageHeader
        code="LAB-C"
        title="Cone Lab"
        stamp="Human forehead interface"
        lede={
          <>
            Measure the head, get the truncated-cone pattern. The research formula is <span className="font-mono">r₁ = C ÷ 2π</span> with a top radius of 1.5–2″
            and a finished height of about 10–11″ from the brow line.
          </>
        }
      />
      <ConeLab />

      <section className="mt-10">
        <SectionTitle kicker="Known & reference values">Target silhouette</SectionTitle>
        <Panel className="p-0 sm:p-0">
          <dl className="divide-y divide-rule">
            {referenceFacts.map((f) => (
              <div key={f.label} className="grid gap-1 p-3 sm:grid-cols-[1.2fr_1fr_auto] sm:items-center sm:gap-4 sm:px-5">
                <dt className="font-medium">{f.label}</dt>
                <dd className="font-mono text-sm">
                  {f.value}
                  {f.note ? <span className="block font-sans text-xs text-ink-3">{f.note}</span> : null}
                </dd>
                <dd className="flex items-center gap-2">
                  <ConfidenceBadge level={f.confidence} />
                  <SourceRefs ids={f.sourceIds} />
                </dd>
              </div>
            ))}
          </dl>
        </Panel>
        <p className="mt-3 text-sm text-ink-2">
          External pattern generator: <ExtLink href="https://www.templatemaker.nl/en/cone/">Templatemaker.nl — truncated cone</ExtLink>
        </p>
      </section>
    </>
  );
}
