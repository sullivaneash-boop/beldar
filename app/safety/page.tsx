import type { Metadata } from "next";
import { PageHeader, SafetyAlert, SourceRefs } from "@/components/beldar/primitives";
import { safetyDisclaimer, safetySections } from "@/content/survival";

export const metadata: Metadata = { title: "Safety" };

export default function SafetyPage() {
  return (
    <>
      <PageHeader
        code="SAFE-0"
        title="Safety"
        stamp="Sensible, not alarmist"
        lede="The research separates real precautions from overreaction. Critical items also appear inside the build steps where they matter."
      />
      <nav aria-label="Safety sections" className="no-print mb-6 flex flex-wrap gap-2">
        {safetySections.map((s) => (
          <a key={s.id} href={`#${s.id}`} className="inline-flex min-h-10 items-center rounded-full border border-rule bg-card px-3 text-sm hover:border-ink">
            {s.title}
          </a>
        ))}
      </nav>
      <div className="grid gap-5 lg:grid-cols-2">
        {safetySections.map((s) => (
          <section key={s.id} id={s.id} className="scroll-mt-24 print-avoid-break">
            <h2 className="mb-2 font-display text-2xl font-bold uppercase">{s.title}</h2>
            <div className="flex flex-col gap-2">
              {s.items.map((i) => (
                <SafetyAlert key={i.text} level={i.level} title={i.text}>
                  {i.sourceIds.length ? <SourceRefs ids={i.sourceIds} /> : null}
                </SafetyAlert>
              ))}
            </div>
          </section>
        ))}
      </div>
      <p className="mt-8 rounded-md border border-rule bg-paper-2 p-3 text-sm text-ink-2">{safetyDisclaimer}</p>
    </>
  );
}
