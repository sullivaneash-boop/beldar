import type { Metadata } from "next";
import { GuideIndex } from "@/components/beldar/guide-index";
import { PageHeader } from "@/components/beldar/primitives";

export const metadata: Metadata = { title: "Guided Build" };

export default function GuidePage() {
  return (
    <>
      <PageHeader
        code="GUIDE"
        title="Guided Build"
        stamp="One step at a time"
        lede="A distraction-free walkthrough for the garage or craft table. Big text, sticky controls, and a glue-hands mode with giant buttons."
      />
      <GuideIndex />
    </>
  );
}
