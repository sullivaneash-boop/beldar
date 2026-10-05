"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { paintZones } from "@/content/makeup";

const CONE = "M70 238 C 76 186 92 112 118 64 C 128 46 142 46 152 64 C 176 112 192 186 198 238";

/**
 * Original simplified head/cone diagram showing where each paint layer goes.
 * Zones use both color and texture so meaning isn't carried by color alone.
 */
export function PaintMap() {
  const [active, setActive] = useState<string | null>(null);
  const on = (id: string) => active === null || active === id;
  const op = (id: string) => (on(id) ? 1 : 0.12);

  return (
    <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <svg viewBox="0 0 268 360" className="w-full max-w-md justify-self-center text-ink" role="img" aria-label="Paint map: front view of head and cone with paint zones">
        <defs>
          <pattern id="pm-stipple" width="6" height="6" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.5" fill="#c66a5a" />
            <circle cx="5" cy="5" r="1" fill="#8a4f7d" />
          </pattern>
          <pattern id="pm-hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="6" height="6" fill="#ddbf95" />
            <line x1="0" y1="0" x2="0" y2="6" stroke="#9b7344" strokeWidth="1.4" />
          </pattern>
        </defs>
        {/* face integration */}
        <g opacity={op("face")} style={{ transition: "opacity 200ms" }}>
          <path d="M76 250 C 76 300 98 340 134 348 C 170 340 192 300 192 250 Z" fill="url(#pm-hatch)" />
          <ellipse cx="68" cy="272" rx="9" ry="18" fill="url(#pm-hatch)" />
          <ellipse cx="200" cy="272" rx="9" ry="18" fill="url(#pm-hatch)" />
          <rect x="108" y="340" width="52" height="20" fill="url(#pm-hatch)" />
        </g>
        {/* PAX base: cone + cap + forehead to above eyes */}
        <path d={`${CONE} L 192 262 Q 134 272 76 262 Z`} fill="#e8d3a2" opacity={op("base")} style={{ transition: "opacity 200ms" }} />
        {/* redness: temples + cone sides */}
        <g opacity={op("redness")} style={{ transition: "opacity 200ms" }}>
          <path d="M74 200 C 76 170 84 130 96 104 L 104 110 C 94 140 86 180 84 236 Z" fill="url(#pm-stipple)" />
          <path d="M194 200 C 192 170 184 130 172 104 L 164 110 C 174 140 182 180 184 236 Z" fill="url(#pm-stipple)" />
          <ellipse cx="82" cy="250" rx="10" ry="14" fill="url(#pm-stipple)" />
          <ellipse cx="186" cy="250" rx="10" ry="14" fill="url(#pm-stipple)" />
        </g>
        {/* highlight ridge */}
        <path d="M134 60 C 132 110 132 170 134 236" stroke="#fbf3dd" strokeWidth="12" strokeLinecap="round" fill="none" opacity={on("highlight") ? 0.95 : 0.1} />
        <path d="M134 60 C 132 110 132 170 134 236" stroke="#9b7344" strokeWidth="1" strokeDasharray="3 3" fill="none" opacity={op("highlight")} />
        {/* veins at temporal transition */}
        <g stroke="#5874a8" strokeWidth="1.3" fill="none" opacity={op("veins")} style={{ transition: "opacity 200ms" }}>
          <path d="M80 258 q 6 -8 4 -18 q -2 -6 4 -12" />
          <path d="M86 262 q 8 -4 10 -12" stroke="#b14b4b" />
          <path d="M188 258 q -6 -8 -4 -18 q 2 -6 -4 -12" />
          <path d="M182 262 q -8 -4 -10 -12" stroke="#b14b4b" />
        </g>
        {/* freckles on dome */}
        <g fill="#8c6239" opacity={op("freckles")} style={{ transition: "opacity 200ms" }}>
          {[
            [126, 74], [142, 80], [120, 96], [148, 100], [134, 90], [116, 118], [152, 124], [138, 112],
          ].map(([x, y]) => (
            <circle key={`${x}-${y}`} cx={x} cy={y} r="1.8" />
          ))}
        </g>
        {/* melt line */}
        <path d="M70 262 Q 134 274 198 262" fill="none" stroke="#1d1c1a" strokeWidth="2" strokeDasharray="5 3" opacity={op("melt")} />
        {/* outlines */}
        <path d={CONE} fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M76 250 C 76 300 98 340 134 348 C 170 340 192 300 192 250" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <ellipse cx="68" cy="272" rx="9" ry="18" fill="none" stroke="currentColor" strokeWidth="1.3" />
        <ellipse cx="200" cy="272" rx="9" ry="18" fill="none" stroke="currentColor" strokeWidth="1.3" />
        {/* eyes closed line (stop PAX above eyes) */}
        <path d="M104 284 q 10 5 20 0 M144 284 q 10 5 20 0" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <text x="134" y="300" textAnchor="middle" className="font-mono" fontSize="8" fill="currentColor" opacity="0.7">
          PAX STOPS ABOVE EYES
        </text>
      </svg>

      <div>
        <p className="label-caps mb-2 text-ink-3">Legend — tap a zone to isolate it</p>
        <ul className="flex flex-col gap-1.5">
          {paintZones.map((z) => (
            <li key={z.id}>
              <button
                type="button"
                aria-pressed={active === z.id}
                onClick={() => setActive(active === z.id ? null : z.id)}
                className={cn("flex w-full items-start gap-3 rounded-md border p-2.5 text-left", active === z.id ? "border-ink bg-card" : "border-rule bg-paper hover:border-rule-strong")}
              >
                <span className="mt-0.5 size-6 shrink-0 rounded-sm border border-ink/30" style={{ background: z.color }} aria-hidden />
                <span className="min-w-0">
                  <span className="block font-semibold">
                    {z.label} <span className="label-caps font-normal text-ink-3">· {z.pattern}</span>
                  </span>
                  <span className="block text-sm text-ink-2">{z.description}</span>
                  <span className="block font-mono text-xs text-ink-3">{z.product}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
        {active ? (
          <button type="button" onClick={() => setActive(null)} className="mt-2 min-h-10 text-sm text-denim underline underline-offset-2">
            Show all zones
          </button>
        ) : null}
      </div>
    </div>
  );
}
