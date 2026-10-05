import type { Metadata } from "next";
import { HalloweenMode } from "@/components/beldar/halloween-mode";
import { PageHeader } from "@/components/beldar/primitives";

export const metadata: Metadata = { title: "Halloween Mode" };

export default function HalloweenPage() {
  return (
    <>
      <PageHeader
        code="DEPLOY"
        title="Halloween Mode"
        stamp="Application-day preflight"
        lede="The research's application timeline, working back from party start (change the time in Settings). Wearer + one dedicated helper. Tick each item as you go."
      />
      <HalloweenMode />
    </>
  );
}
