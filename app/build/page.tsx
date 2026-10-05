import type { Metadata } from "next";
import { BuildPlan } from "@/components/beldar/build-plan";
import { GateCard } from "@/components/beldar/gate-card";
import { Panel, PageHeader, SectionTitle, SourceRefs } from "@/components/beldar/primitives";
import { borrowFromMovie, dontReplicate, methods } from "@/content/meta";
import { gates } from "@/content/phases";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Master Build Plan" };

const verdictStyle = {
  recommended: "border-ok bg-ok-bg",
  fallback: "border-caution/50 bg-caution-bg",
  advanced: "border-denim/40 bg-paper-2",
  rejected: "border-rule bg-card opacity-80",
};
const verdictLabel = { recommended: "Recommended", fallback: "Budget fallback", advanced: "Pro-level", rejected: "Not for home" };

export default function BuildPage() {
  return (
    <>
      <PageHeader
        code="PLAN-11"
        title="Master Build Plan"
        stamp="Phase-based roadmap"
        lede="Eleven phases from measuring tape to party. Tasks unlock in the research's order — you can't glue before the patch test, and you can't seal before the silhouette gate."
      />

      <BuildPlan />

      <section id="gates" className="mt-10">
        <SectionTitle kicker="Go / no-go checkpoints">Decision gates</SectionTitle>
        <p className="mb-4 max-w-3xl text-ink-2">
          The research lists three gates in prose and three in its data appendix. Two overlap; all five are kept here.
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          {gates.map((g) => (
            <GateCard key={g.id} gate={g} />
          ))}
        </div>
      </section>

      <section className="mt-10">
        <SectionTitle kicker="Why this method">Construction method</SectionTitle>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {methods.map((m) => (
            <article key={m.id} className={cn("rounded-lg border-2 p-4", verdictStyle[m.verdict])}>
              <p className="label-caps text-ink-2">{verdictLabel[m.verdict]}</p>
              <h3 className="mt-1 font-display text-xl font-bold uppercase">{m.name}</h3>
              <p className="mt-1 text-sm text-ink-2">{m.summary}</p>
              <ul className="mt-2 space-y-0.5 text-sm">
                {m.pros.map((p) => (
                  <li key={p}>
                    <span className="text-ok" aria-hidden>+ </span>
                    <span className="sr-only">Pro: </span>
                    {p}
                  </li>
                ))}
                {m.cons.map((c) => (
                  <li key={c}>
                    <span className="text-signal" aria-hidden>− </span>
                    <span className="sr-only">Con: </span>
                    {c}
                  </li>
                ))}
              </ul>
              <SourceRefs ids={m.sourceIds} className="mt-2" />
            </article>
          ))}
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <Panel>
            <h3 className="font-display text-xl font-bold uppercase">Borrow from the 1993 production</h3>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-[0.9375rem]">
              {borrowFromMovie.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </Panel>
          <Panel>
            <h3 className="font-display text-xl font-bold uppercase">Don&apos;t replicate</h3>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-[0.9375rem]">
              {dontReplicate.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </Panel>
        </div>
      </section>
    </>
  );
}
