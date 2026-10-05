import type { Metadata } from "next";
import { PageHeader } from "@/components/beldar/primitives";
import { SettingsPanel } from "@/components/beldar/settings-panel";

export const metadata: Metadata = { title: "Settings" };

export default function SettingsPage() {
  return (
    <>
      <PageHeader code="SYS-CFG" title="Settings" stamp="Local-only" lede="Names, dates, budget, display, and backups." />
      <SettingsPanel />
    </>
  );
}
