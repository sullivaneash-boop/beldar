import { ConeDiagramSide } from "@/components/beldar/cone-diagram";
import { Dashboard } from "@/components/beldar/dashboard";
import { projectMeta } from "@/content/meta";

export default function Home() {
  return (
    <>
      <section className="mb-6 grid items-end gap-4 border-b-2 border-ink pb-5 md:grid-cols-[1fr_minmax(0,440px)]">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="label-caps rounded-sm bg-ink px-1.5 py-0.5 text-paper">Form RFB-1993</span>
            <span className="label-caps text-ink-3">Remulak Fabrication Bureau · Human Disguise Division</span>
          </div>
          <h1 className="mt-4 font-display text-[3.25rem] leading-[0.88] font-extrabold tracking-wide uppercase sm:text-7xl lg:text-8xl">
            Beldar
            <br />
            Build HQ
          </h1>
          <p className="mt-3 font-mono text-sm text-ink-2">
            Halloween 2026 · {projectMeta.character}, {projectMeta.film}
          </p>
          <p className="mt-2 max-w-xl text-[1.0625rem] text-ink-2">
            Everything for the costume, in one place: the build sequence, the cone math, what to buy, how to glue it, and what to do when an edge
            lifts at the party.
          </p>
          <p className="mt-3 text-sm text-ink-3">
            Method: <span className="font-medium text-ink">{projectMeta.primaryMethod}</span>
          </p>
        </div>
        <div className="hidden rounded-lg border border-rule bg-card/70 p-2 sm:block">
          <ConeDiagramSide />
        </div>
      </section>
      <Dashboard />
    </>
  );
}
