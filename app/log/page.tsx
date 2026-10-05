import type { Metadata } from "next";
import { BuildLog } from "@/components/beldar/build-log";
import { PageHeader } from "@/components/beldar/primitives";

export const metadata: Metadata = { title: "Build Log" };

export default function LogPage() {
  return (
    <>
      <PageHeader code="LOG-RFB" title="Build Log" stamp="Field notes" lede="Quick notes as you work: what you tried, what happened, what's next. Stored on this device; export as Markdown or JSON." />
      <BuildLog />
    </>
  );
}
