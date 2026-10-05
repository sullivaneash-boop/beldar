import type { Metadata } from "next";
import { ConfidenceBadge, PageHeader, Panel, SectionTitle, SourceRefs, SafetyAlert } from "@/components/beldar/primitives";
import { CopyPhrase, OutfitSelect, PieceTracker, StillToFind } from "@/components/beldar/wardrobe-controls";
import { characterDetails, outfitPieces, outfits, pieceById } from "@/content/wardrobe";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Beldar Closet" };

function Meter({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <p className="text-xs text-ink-3">{label}</p>
      <div className="mt-1 flex gap-1" aria-label={`${label}: ${value} of 5`} role="img">
        {[1, 2, 3, 4, 5].map((i) => (
          <span key={i} className={cn("h-2 flex-1 rounded-sm", i <= value ? "bg-ink" : "bg-rule")} />
        ))}
      </div>
    </div>
  );
}

/** Original stylized swatch of the shirt's described pattern (not a reproduction of any garment). */
function ShirtSwatch() {
  return (
    <svg viewBox="0 0 120 80" className="h-20 w-full rounded-md border border-rule" role="img" aria-label="Abstract black, white and jewel-tone pattern swatch">
      <rect width="120" height="80" fill="#f3efe6" />
      <path d="M0 60 Q 20 40 40 58 T 80 50 T 120 62" stroke="#1d1c1a" strokeWidth="5" fill="none" />
      <path d="M10 10 L 30 30 M 70 8 L 60 30 M 95 20 l 15 -10" stroke="#1d1c1a" strokeWidth="3" />
      <circle cx="52" cy="22" r="7" fill="#2f6f73" />
      <rect x="84" y="34" width="14" height="14" fill="#a3342a" transform="rotate(20 91 41)" />
      <path d="M18 72 l 10 -14 l 10 14 z" fill="#c69a3c" />
      <path d="M100 70 q 6 -12 14 -4" stroke="#5b3f8c" strokeWidth="4" fill="none" />
    </svg>
  );
}

export default function WardrobePage() {
  const overalls = pieceById.overalls;
  return (
    <>
      <PageHeader
        code="WARD-93"
        title="Beldar Closet"
        stamp="Terrestrial garment protocol"
        lede="The fireworks-scene look: rigid medium-wash bib overalls over a fluid 90s abstract rayon camp shirt. Recognizable, practical, and button-front — so nothing pulls over the finished appliance."
      />

      <section className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
        {outfits.map((o) => (
          <article key={o.id} className={cn("rounded-lg p-5", o.primary ? "border-[3px] border-ink bg-card lg:row-span-2" : "border border-rule bg-paper-2")}>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="label-caps text-ink-3">{o.primary ? "Research pick" : "Alternative"}</p>
              <ConfidenceBadge level={o.confidence} />
            </div>
            <h2 className={cn("mt-1 font-display font-extrabold uppercase", o.primary ? "text-4xl sm:text-5xl" : "text-2xl")}>{o.name}</h2>
            <p className="mt-1 text-sm text-ink-2">{o.context}</p>
            <p className="mt-3 text-[0.9375rem]">{o.summary}</p>
            <div className="mt-4 grid grid-cols-3 gap-3">
              <Meter label="Recognizability" value={o.recognizability} />
              <Meter label="Difficulty" value={o.difficulty} />
              <Meter label="Party practicality" value={o.practicality} />
            </div>
            {o.pieceIds.length ? (
              <ul className="mt-4 flex flex-wrap gap-2">
                {o.pieceIds.map((p) => (
                  <li key={p}>
                    <a href={`#${p}`} className="inline-block rounded-sm border border-ink px-2 py-1 text-sm font-medium hover:bg-paper-2">
                      {pieceById[p].name}
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
            <p className="mt-3 text-xs text-ink-3">
              Reference: {o.reference} <SourceRefs ids={o.sourceIds} />
            </p>
            <div className="mt-3">
              <OutfitSelect id={o.id} primary={o.primary} />
            </div>
          </article>
        ))}
        <StillToFind />
      </section>

      <section id="overalls" className="mt-10 scroll-mt-24">
        <SectionTitle kicker="Detailed breakdown">The overalls</SectionTitle>
        <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
          <Panel>
            <div className="flex items-center gap-3">
              <span className="size-12 rounded-md border border-rule bg-[#5b7da6]" aria-hidden />
              <div>
                <p className="font-semibold">Medium blue wash, rigid denim</p>
                <p className="text-sm text-ink-2">{overalls.fabric}</p>
              </div>
            </div>
            <ul className="mt-3 list-disc space-y-1 pl-5">
              {overalls.spec.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
            <SafetyAlert level="info" title="Fit: size by belly, not waist" className="mt-3">
              {overalls.fit} <SourceRefs ids={["s45"]} />
            </SafetyAlert>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {(
                [
                  ["Exact / confirmed", overalls.tracks.exact],
                  ["Closest vintage match", overalls.tracks.vintage],
                  ["Modern substitute", overalls.tracks.modern],
                  ["Avoid", "Slim-fit, dark raw indigo, acid-washed or heavily distressed fashion denim."],
                ] as const
              ).map(([k, v]) => (
                <div key={k} className={cn("rounded-md border p-3", k === "Avoid" ? "border-signal/40 bg-signal-bg" : "border-rule bg-paper")}>
                  <p className="label-caps text-ink-3">{k}</p>
                  <p className="mt-1 text-sm">{v}</p>
                </div>
              ))}
            </div>
            <p className="mt-3 text-sm text-ink-2">
              {overalls.priceRange} · {overalls.ease} <ConfidenceBadge level={overalls.confidence} className="ml-1" /> <SourceRefs ids={overalls.sourceIds} />
            </p>
          </Panel>
          <div className="flex flex-col gap-3">
            <p className="label-caps text-ink-3">Marketplace search phrases</p>
            {overalls.searchPhrases.map((p) => (
              <CopyPhrase key={p} phrase={p} />
            ))}
            <PieceTracker piece={overalls} />
            <SafetyAlert level="caution" title="Bathroom strategy">
              The bib straps unbuckle at the shoulders. Keep the metal hardware away from the glued forehead edge when re-buckling.
            </SafetyAlert>
          </div>
        </div>
      </section>

      {outfitPieces
        .filter((p) => p.id !== "overalls")
        .map((p) => (
          <section key={p.id} id={p.id} className="mt-10 scroll-mt-24">
            <SectionTitle kicker={p.priceRange}>{p.name}</SectionTitle>
            <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
              <Panel>
                {p.id === "shirt" ? <ShirtSwatch /> : null}
                <ul className="mt-3 list-disc space-y-1 pl-5">
                  {p.spec.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
                <p className="mt-3 text-sm">
                  <span className="font-semibold">Colors:</span> {p.colors.join(", ")}
                </p>
                <p className="mt-1 text-sm">
                  <span className="font-semibold">Fabric:</span> {p.fabric}
                </p>
                {p.brands.length ? (
                  <p className="mt-1 text-sm">
                    <span className="font-semibold">Brands to target:</span> {p.brands.join(", ")}
                  </p>
                ) : null}
                <div className="mt-4 grid gap-2 sm:grid-cols-3">
                  {(
                    [
                      ["Exact / confirmed", p.tracks.exact],
                      ["Closest vintage", p.tracks.vintage],
                      ["Modern substitute", p.tracks.modern],
                    ] as const
                  ).map(([k, v]) => (
                    <div key={k} className="rounded-md border border-rule bg-paper p-3">
                      <p className="label-caps text-ink-3">{k}</p>
                      <p className="mt-1 text-sm">{v}</p>
                    </div>
                  ))}
                </div>
                <p className="mt-3 text-sm text-ink-2">
                  {p.ease} <ConfidenceBadge level={p.confidence} className="ml-1" /> <SourceRefs ids={p.sourceIds} />
                </p>
              </Panel>
              <div className="flex flex-col gap-3">
                <p className="label-caps text-ink-3">Marketplace search phrases</p>
                {p.searchPhrases.map((ph) => (
                  <CopyPhrase key={ph} phrase={ph} />
                ))}
                {p.id !== "belt" ? <PieceTracker piece={p} /> : null}
              </div>
            </div>
          </section>
        ))}

      <section className="mt-10">
        <SectionTitle kicker="Optional — for photos, not all night">Character details</SectionTitle>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {characterDetails.map((c) => (
            <Panel key={c.title} as="article">
              <h3 className="font-display text-xl font-bold uppercase">{c.title}</h3>
              <p className="mt-1 text-[0.9375rem] text-ink-2">{c.body}</p>
            </Panel>
          ))}
        </div>
      </section>
    </>
  );
}
