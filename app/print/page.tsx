import type { Metadata } from "next";
import Link from "next/link";
import { Printer } from "lucide-react";
import { PageHeader } from "@/components/beldar/primitives";
import { printSheets } from "@/content/print";

export const metadata: Metadata = { title: "Print Center" };

export default function PrintIndex() {
  return (
    <>
      <PageHeader code="PRN-7" title="Print Center" stamp="Paper copies for the workbench" lede="Clean, chrome-free sheets. Each uses your saved data where it helps (prices, names, measurements)." />
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {printSheets.map((p) => (
          <li key={p.id}>
            <Link href={`/print/${p.id}`} className="flex min-h-28 flex-col justify-between rounded-lg border-2 border-ink bg-card p-4 hover:bg-paper-2">
              <Printer className="size-6" aria-hidden />
              <span>
                <span className="block font-display text-xl font-bold uppercase">{p.title}</span>
                <span className="text-sm text-ink-2">{p.desc}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
