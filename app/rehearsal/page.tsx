import type { Metadata } from "next";
import { PageHeader } from "@/components/beldar/primitives";
import { Rehearsal } from "@/components/beldar/rehearsal";

export const metadata: Metadata = { title: "Rehearsal Mode" };

export default function RehearsalPage() {
  return (
    <>
      <PageHeader
        code="DRILL-2H"
        title="Rehearsal Mode"
        stamp="T-3 days · Oct 28"
        lede="Wear the complete costume — unglued headpiece, shirt, overalls — for at least two hours, walking and sitting. Do NOT make Halloween night the first full test."
      />
      <Rehearsal />
    </>
  );
}
