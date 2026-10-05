import type { Metadata } from "next";
import { PageHeader } from "@/components/beldar/primitives";
import { Troubleshooter } from "@/components/beldar/troubleshooter";

export const metadata: Metadata = { title: "Troubleshooting" };

export default function TroubleshootingPage() {
  return (
    <>
      <PageHeader
        code="DIAG-6"
        title="Troubleshooting"
        stamp="Symptom → fix"
        lede="The first six entries are the research's Failure Modes table. The rest are assembled from cautions elsewhere in the research. Where the research has no fix, the card says so."
      />
      <Troubleshooter />
    </>
  );
}
