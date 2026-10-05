import type { Metadata } from "next";
import { Bandage, Car, DoorOpen, Move, Paintbrush, Ruler, Siren, Thermometer, type LucideIcon } from "lucide-react";
import { SourceRefs } from "@/components/beldar/primitives";
import { repairKit, survivalCards } from "@/content/survival";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Party Survival" };

const icons: Record<string, LucideIcon> = { bandage: Bandage, move: Move, paintbrush: Paintbrush, thermometer: Thermometer, siren: Siren, door: DoorOpen, car: Car, ruler: Ruler };

export default function SurvivalPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <header className="mb-5">
        <p className="label-caps text-signal">Field manual · open during the party</p>
        <h1 className="mt-1 font-display text-5xl leading-none font-extrabold uppercase sm:text-6xl">Party Survival</h1>
        <p className="mt-2 text-ink-2">Tap what&apos;s happening.</p>
      </header>

      <nav aria-label="Problems" className="mb-6 grid grid-cols-2 gap-2">
        {survivalCards.map((c) => {
          const Icon = icons[c.icon];
          return (
            <a
              key={c.id}
              href={`#${c.id}`}
              className={cn(
                "flex min-h-24 flex-col justify-between rounded-lg border-2 p-3",
                c.tone === "urgent" ? "border-signal bg-signal text-paper" : "border-ink bg-card",
              )}
            >
              <Icon className="size-7" aria-hidden />
              <span>
                <span className="block text-lg leading-tight font-bold">{c.title}</span>
                <span className={cn("text-sm", c.tone === "urgent" ? "opacity-90" : "text-ink-2")}>{c.prompt}</span>
              </span>
            </a>
          );
        })}
      </nav>

      <div className="flex flex-col gap-4">
        {survivalCards.map((c) => {
          const Icon = icons[c.icon];
          return (
            <section key={c.id} id={c.id} className={cn("scroll-mt-20 rounded-lg border-2 bg-card p-4", c.tone === "urgent" ? "border-signal" : "border-ink")}>
              <h2 className="flex items-center gap-2 font-display text-3xl font-extrabold uppercase">
                <Icon className={cn("size-7", c.tone === "urgent" && "text-signal")} aria-hidden /> {c.title}
              </h2>
              <ol className="mt-3 flex flex-col gap-3">
                {c.steps.map((st, i) => (
                  <li key={st} className="flex gap-3">
                    <span className="grid size-8 shrink-0 place-items-center rounded-full bg-ink font-mono font-semibold text-paper">{i + 1}</span>
                    <span className="pt-0.5 text-[1.125rem] leading-snug">{st}</span>
                  </li>
                ))}
              </ol>
              {c.doNot?.map((d) => (
                <p key={d} className="mt-3 rounded-md bg-signal-bg p-3 font-medium">
                  ✕ {d}
                </p>
              ))}
              {c.gap ? <p className="mt-3 rounded-md bg-paper-2 p-3 text-sm text-ink-2">Research gap: {c.gap}</p> : null}
              <SourceRefs ids={c.sourceIds} className="mt-2" />
              <a href="#main" className="mt-3 block text-sm text-ink-3 underline underline-offset-2">
                Back to all problems
              </a>
            </section>
          );
        })}

        <section id="kit" className="rounded-lg border-2 border-dashed border-ink bg-paper-2 p-4">
          <h2 className="font-display text-3xl font-extrabold uppercase">60-second repair kit</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-[1.0625rem]">
            {repairKit.map((k) => (
              <li key={k}>{k}</li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
