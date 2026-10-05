import type { Metadata } from "next";
import { Suspense } from "react";
import { MaterialsBrowser } from "@/components/beldar/materials-browser";
import { PageHeader, SectionTitle, SourceRefs } from "@/components/beldar/primitives";
import { compatibility } from "@/content/materials";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Materials & Shopping" };

export default function MaterialsPage() {
  return (
    <>
      <PageHeader
        code="ACQ-01"
        title="Materials & Shopping"
        stamp="Terrestrial acquisition"
        lede="Every material the research names, with its spec, the research's estimated price, and room for what you actually paid. Status and prices save on this device."
      />
      <Suspense>
        <MaterialsBrowser />
      </Suspense>

      <section className="mt-10">
        <SectionTitle kicker="Mixing the wrong things fails">Compatibility matrix</SectionTitle>
        <ul className="grid gap-2 md:grid-cols-2">
          {compatibility.map((c) => (
            <li key={c.a + c.b} className={cn("rounded-lg border-l-4 bg-card p-3", c.status === "recommended" ? "border-ok" : "border-signal")}>
              <p className="font-semibold">
                {c.a} <span className="text-ink-3">+</span> {c.b}
              </p>
              <p className={cn("label-caps mt-0.5", c.status === "recommended" ? "text-ok" : "text-signal")}>{c.status === "recommended" ? "✓ Recommended" : "✕ Avoid"}</p>
              <p className="mt-1 text-sm text-ink-2">
                {c.note} <SourceRefs ids={c.sourceIds} />
              </p>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
