import type { Metadata } from "next";
import { ConfidenceBadge, ExtLink, PageHeader, Panel, SectionTitle } from "@/components/beldar/primitives";
import { SourceLibrary } from "@/components/beldar/source-library";
import { confidenceMeta, projectMeta } from "@/content/meta";
import { imageManifest, reliabilityLabels } from "@/content/sources";
import type { Confidence } from "@/types/content";

export const metadata: Metadata = { title: "Research & Sources" };

export default function ResearchPage() {
  return (
    <>
      <PageHeader
        code="ARCHIVE"
        title="Research & Sources"
        stamp={`Research dated ${projectMeta.researchDate} · confidence ${projectMeta.researchConfidence}`}
        lede={
          <>
            Everything in this app comes from <span className="font-mono">BELDAR_RESEARCH.md</span> in the repository. Citation chips like{" "}
            <span className="rounded-sm border border-rule px-1 font-mono text-xs">[13]</span> throughout the app link here.
          </>
        }
      />

      <section className="mb-10 grid gap-4 lg:grid-cols-2">
        <Panel>
          <h2 className="font-display text-xl font-bold uppercase">Evidence labels</h2>
          <ul className="mt-3 flex flex-col gap-2">
            {(Object.keys(confidenceMeta) as Confidence[]).map((c) => (
              <li key={c} className="flex items-start gap-3">
                <ConfidenceBadge level={c} className="mt-0.5 w-40 justify-center" />
                <span className="text-sm text-ink-2">{confidenceMeta[c].description}</span>
              </li>
            ))}
          </ul>
        </Panel>
        <Panel>
          <h2 className="font-display text-xl font-bold uppercase">Source reliability</h2>
          <ul className="mt-3 flex flex-col gap-2 text-sm">
            {Object.values(reliabilityLabels).map((r) => (
              <li key={r.label}>
                <span className="font-semibold">{r.label}</span> — <span className="text-ink-2">{r.note}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-sm text-ink-2">
            Several citations are community forums or loosely related pages. They&apos;re kept as cited, but labeled so you can weigh them.
          </p>
        </Panel>
      </section>

      <section className="mb-10">
        <SectionTitle kicker="Linked, not copied">Reference image manifest</SectionTitle>
        <div className="grid gap-3 md:grid-cols-2">
          {imageManifest.map((r) => (
            <Panel key={r.target} as="article">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold">{r.target}</h3>
                <ConfidenceBadge level={r.reliability as Confidence} />
              </div>
              <p className="text-sm text-ink-2">{r.source}</p>
              <p className="mt-1 text-sm">{r.demonstrates}</p>
              <p className="mt-1 text-xs text-ink-3">{r.use}</p>
              <ExtLink href={r.url} className="mt-2 text-sm">
                Open reference
              </ExtLink>
            </Panel>
          ))}
        </div>
        <p className="mt-3 text-sm text-ink-2">
          Private reference photos can be placed in <span className="font-mono">public/references/private/</span> on your own machine (git-ignored). See the README in that folder.
        </p>
      </section>

      <section>
        <SectionTitle kicker="59 works cited">Source library</SectionTitle>
        <SourceLibrary />
      </section>
    </>
  );
}
