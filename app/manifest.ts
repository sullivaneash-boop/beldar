import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Beldar Build HQ",
    short_name: "Beldar HQ",
    description: "Interactive fabrication guide and project tracker for the Beldar Conehead costume build.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#f4efe3",
    theme_color: "#1d1c1a",
    categories: ["productivity", "lifestyle"],
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/pwa-icon/192", sizes: "192x192", type: "image/png" },
      { src: "/pwa-icon/512", sizes: "512x512", type: "image/png" },
      { src: "/pwa-icon/maskable-512", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    shortcuts: [
      { name: "Party Survival", url: "/survival" },
      { name: "Halloween Mode", url: "/halloween" },
      { name: "Guided Build", url: "/guide" },
    ],
  };
}
