import { ImageResponse } from "next/og";
import { IconArt } from "@/lib/icon-art";

const sizes = { "192": 192, "512": 512, "maskable-512": 512 } as const;

export function generateStaticParams() {
  return Object.keys(sizes).map((size) => ({ size }));
}

export async function GET(_req: Request, ctx: RouteContext<"/pwa-icon/[size]">) {
  const { size } = await ctx.params;
  const px = sizes[size as keyof typeof sizes] ?? 192;
  return new ImageResponse(<IconArt size={px} maskable={size.startsWith("maskable")} />, { width: px, height: px });
}
