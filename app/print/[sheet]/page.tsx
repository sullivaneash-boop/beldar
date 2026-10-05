import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PrintSheet } from "@/components/beldar/print-sheets";
import { printSheets } from "@/content/print";

export function generateStaticParams() {
  return printSheets.map((p) => ({ sheet: p.id }));
}

export async function generateMetadata({ params }: PageProps<"/print/[sheet]">): Promise<Metadata> {
  const { sheet } = await params;
  return { title: printSheets.find((p) => p.id === sheet)?.title ?? "Print" };
}

export default async function PrintSheetPage({ params }: PageProps<"/print/[sheet]">) {
  const { sheet } = await params;
  const meta = printSheets.find((p) => p.id === sheet);
  if (!meta) notFound();
  return <PrintSheet id={meta.id} />;
}
