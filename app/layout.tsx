import type { Metadata, Viewport } from "next";
import { Big_Shoulders, IBM_Plex_Mono, Public_Sans } from "next/font/google";
import { CommandPalette } from "@/components/beldar/command-palette";
import { PreferencesSync, PwaRegister } from "@/components/beldar/preferences-sync";
import { preferencesScript } from "@/lib/preferences-script";
import { MobileTabBar, MobileTopBar, Sidebar } from "@/components/beldar/shell";
import "./globals.css";

const display = Big_Shoulders({ variable: "--font-display", subsets: ["latin"], axes: ["opsz"] });
const body = Public_Sans({ variable: "--font-body", subsets: ["latin"] });
const mono = IBM_Plex_Mono({ variable: "--font-plex-mono", subsets: ["latin"], weight: ["400", "500", "600"] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000"),
  title: { default: "Beldar Build HQ — Halloween 2026", template: "%s · Beldar Build HQ" },
  description: "Interactive fabrication guide and project tracker for the Beldar Conehead costume build.",
  applicationName: "Beldar Build HQ",
  appleWebApp: { capable: true, title: "Beldar HQ", statusBarStyle: "default" },
  robots: { index: false, follow: false },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4efe3" },
    { media: "(prefers-color-scheme: dark)", color: "#13161b" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" suppressHydrationWarning className={`${display.variable} ${body.variable} ${mono.variable} antialiased`}>
      <body className="min-h-dvh">
        <script dangerouslySetInnerHTML={{ __html: preferencesScript }} />
        <a href="#main" className="sr-only z-50 rounded bg-ink px-3 py-2 text-paper focus:not-sr-only focus:fixed focus:top-2 focus:left-2">
          Skip to content
        </a>
        <PreferencesSync>
          <div className="flex min-h-dvh">
            <Sidebar />
            <div className="flex min-w-0 flex-1 flex-col">
              <MobileTopBar />
              <main id="main" className="bg-grid flex-1 px-4 pt-5 pb-28 sm:px-6 lg:px-10 lg:pt-8 lg:pb-16">
                <div className="mx-auto w-full max-w-6xl">{children}</div>
              </main>
            </div>
          </div>
          <MobileTabBar />
          <CommandPalette />
          <PwaRegister />
        </PreferencesSync>
      </body>
    </html>
  );
}
