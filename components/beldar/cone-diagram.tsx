import { cn } from "@/lib/utils";

type Labels = { h?: string; r1?: string; r2?: string; width?: string };

const CONE_SIDE = "M122 252 C 128 200 142 122 172 66 C 186 40 208 38 220 58 C 238 96 252 180 258 250";
const TRANSITION_SIDE = "M118 254 Q 180 262 222 254 Q 252 250 254 304";

/**
 * Original technical drawing of a Conehead-style silhouette (side profile).
 * Abstract geometry only — no likeness of any actor or film artwork.
 */
export function ConeDiagramSide({ labels = {}, className, callouts = true }: { labels?: Labels; className?: string; callouts?: boolean }) {
  const h = labels.h ?? "h ≈ 10–11″";
  const r1 = labels.r1 ?? "r₁ = C ÷ 2π";
  const r2 = labels.r2 ?? "r₂ 1.5–2″";
  return (
    <svg viewBox={callouts ? "0 0 520 400" : "30 20 300 370"} className={cn("w-full text-ink", className)} role="img" aria-labelledby="cds-title cds-desc">
      <title id="cds-title">Side view technical drawing of the cone headpiece</title>
      <desc id="cds-desc">
        A smooth parabolic dome rising {h} above the brow line with a slight backward lean. The foam rim sits about one inch above the
        hairline; a vinyl skirt continues down to a melted edge just above the brow that curves behind the ear, leaving the ear exposed.
      </desc>
      <defs>
        <pattern id="cds-hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="6" stroke="currentColor" strokeWidth="1" opacity="0.35" />
        </pattern>
        <marker id="cds-arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0 0 L10 5 L0 10 z" fill="currentColor" />
        </marker>
        <clipPath id="cds-cone">
          <path d={`${CONE_SIDE} Z`} />
        </clipPath>
      </defs>

      {/* head (abstract) */}
      <path
        d="M118 254 C 108 262 104 274 98 284 C 104 290 110 292 112 298 C 110 306 116 312 118 318 C 120 330 130 344 150 348 C 180 352 210 346 232 334 C 248 320 256 300 258 250"
        fill="var(--flesh)"
        stroke="currentColor"
        strokeWidth="1.6"
        opacity="0.9"
      />
      <path d="M232 334 C 236 352 240 366 244 382" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="M150 348 C 152 362 150 374 146 384" fill="none" stroke="currentColor" strokeWidth="1.6" />

      {/* cone body */}
      <path d={`${CONE_SIDE} Z`} fill="var(--flesh)" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      {/* dome cap (foam clay) */}
      <g clipPath="url(#cds-cone)">
        <rect x="100" y="20" width="200" height="66" fill="url(#cds-hatch)" />
        <line x1="150" y1="86" x2="250" y2="86" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
        {/* support band */}
        <rect x="110" y="224" width="160" height="12" fill="none" stroke="var(--denim)" strokeWidth="1.5" strokeDasharray="4 3" />
        {/* front highlight ridge */}
        <path d="M134 210 C 142 150 156 110 176 76" fill="none" stroke="var(--paper)" strokeWidth="5" strokeLinecap="round" opacity="0.8" />
      </g>
      {/* foam rim */}
      <path d="M124 222 Q 190 232 255 222" fill="none" stroke="currentColor" strokeWidth="1.6" />
      {/* vinyl skirt / transition */}
      <path d={TRANSITION_SIDE} fill="none" stroke="var(--signal)" strokeWidth="1.8" strokeDasharray="5 3" />
      {/* ear, exposed */}
      <ellipse cx="232" cy="276" rx="9" ry="16" fill="var(--flesh-2)" stroke="currentColor" strokeWidth="1.4" />

      {/* center axis with slight backward lean */}
      <line x1="190" y1="300" x2="205" y2="30" stroke="var(--denim)" strokeWidth="1" strokeDasharray="8 4 2 4" />
      {/* brow line */}
      <line x1="44" y1="252" x2="290" y2="252" stroke="currentColor" strokeWidth="0.8" strokeDasharray="2 3" opacity="0.7" />
      <text x="48" y="246" className="font-mono" fontSize="9" fill="currentColor" opacity="0.8">BROW LINE</text>

      {/* height dimension */}
      <line x1="64" y1="250" x2="64" y2="42" stroke="currentColor" strokeWidth="1.2" markerStart="url(#cds-arrow)" markerEnd="url(#cds-arrow)" />
      <line x1="58" y1="40" x2="200" y2="40" stroke="currentColor" strokeWidth="0.6" strokeDasharray="2 3" opacity="0.6" />
      <text x="56" y="150" transform="rotate(-90 56 150)" textAnchor="middle" className="font-mono" fontSize="11" fontWeight="600" fill="currentColor">
        {h}
      </text>
      {/* top radius */}
      <line x1="186" y1="96" x2="224" y2="96" stroke="var(--denim)" strokeWidth="1.2" markerStart="url(#cds-arrow)" markerEnd="url(#cds-arrow)" />
      <text x="205" y="110" textAnchor="middle" className="font-mono" fontSize="9.5" fill="var(--denim)" fontWeight="600">{r2}</text>
      {/* base */}
      <line x1="122" y1="372" x2="258" y2="372" stroke="currentColor" strokeWidth="1.2" markerStart="url(#cds-arrow)" markerEnd="url(#cds-arrow)" />
      <line x1="122" y1="256" x2="122" y2="378" stroke="currentColor" strokeWidth="0.6" strokeDasharray="2 3" opacity="0.5" />
      <line x1="258" y1="252" x2="258" y2="378" stroke="currentColor" strokeWidth="0.6" strokeDasharray="2 3" opacity="0.5" />
      <text x="190" y="390" textAnchor="middle" className="font-mono" fontSize="10" fontWeight="600" fill="currentColor">{r1}</text>

      {callouts ? (
        <g className="font-mono" fontSize="10" fill="currentColor">
          {[
            { y: 52, tx: 214, ty: 56, t: "FOAM CLAY DOME", s: "air-dry · 24–48 h" },
            { y: 130, tx: 236, ty: 132, t: "5mm EVA FRUSTUM", s: "Barge-cemented seam" },
            { y: 172, tx: 246, ty: 172, t: "SKIN SYSTEM", s: "latex ×3–4 → PAX → RMGP" },
            { y: 216, tx: 262, ty: 230, t: "2″ SUPPORT BAND", s: "friction grip, no straps" },
            { y: 262, tx: 254, ty: 250, t: "FOAM RIM ≈1″ ABOVE HAIRLINE", s: "Glatzan skirt 3–4″ below" },
            { y: 306, tx: 254, ty: 300, t: "MELTED EDGE", s: "acetone · behind the ear" },
            { y: 346, tx: 241, ty: 284, t: "EAR EXPOSED", s: "" },
          ].map((c) => (
            <g key={c.t}>
              <polyline points={`${c.tx},${c.ty} ${330},${c.y} ${344},${c.y}`} fill="none" stroke="currentColor" strokeWidth="0.7" opacity="0.6" />
              <circle cx={c.tx} cy={c.ty} r="2" fill="currentColor" />
              <text x="348" y={c.y + 3} fontWeight="600">{c.t}</text>
              {c.s ? (
                <text x="348" y={c.y + 15} opacity="0.7" fontSize="9">
                  {c.s}
                </text>
              ) : null}
            </g>
          ))}
        </g>
      ) : null}
    </svg>
  );
}

/** Front elevation: symmetric dome, both ears exposed. */
export function ConeDiagramFront({ labels = {}, className }: { labels?: Labels; className?: string }) {
  const h = labels.h ?? "h ≈ 10–11″";
  const w = labels.width ?? "forehead width";
  return (
    <svg viewBox="0 0 300 400" className={cn("w-full text-ink", className)} role="img" aria-labelledby="cdf-title">
      <title id="cdf-title">Front view: symmetric parabolic dome, rounded tip, both ears exposed</title>
      <defs>
        <marker id="cdf-arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0 0 L10 5 L0 10 z" fill="currentColor" />
        </marker>
      </defs>
      <path d="M92 250 C 92 300 110 350 150 362 C 190 350 208 300 208 250" fill="var(--flesh)" stroke="currentColor" strokeWidth="1.6" />
      <path d="M86 252 C 96 190 118 110 140 62 C 146 48 154 48 160 62 C 182 110 204 190 214 252 Z" fill="var(--flesh)" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M146 72 C 140 120 136 180 134 236" stroke="var(--paper)" strokeWidth="6" strokeLinecap="round" opacity="0.8" fill="none" />
      <path d="M90 226 Q 150 236 210 226" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="M86 260 Q 150 270 214 260" fill="none" stroke="var(--signal)" strokeWidth="1.8" strokeDasharray="5 3" />
      <ellipse cx="84" cy="282" rx="8" ry="17" fill="var(--flesh-2)" stroke="currentColor" strokeWidth="1.4" />
      <ellipse cx="216" cy="282" rx="8" ry="17" fill="var(--flesh-2)" stroke="currentColor" strokeWidth="1.4" />
      <line x1="150" y1="30" x2="150" y2="370" stroke="var(--denim)" strokeWidth="1" strokeDasharray="8 4 2 4" />
      <line x1="40" y1="258" x2="260" y2="258" stroke="currentColor" strokeWidth="0.8" strokeDasharray="2 3" opacity="0.7" />
      <line x1="40" y1="256" x2="40" y2="50" stroke="currentColor" strokeWidth="1.2" markerStart="url(#cdf-arrow)" markerEnd="url(#cdf-arrow)" />
      <text x="32" y="155" transform="rotate(-90 32 155)" textAnchor="middle" className="font-mono" fontSize="11" fontWeight="600" fill="currentColor">{h}</text>
      <line x1="98" y1="386" x2="202" y2="386" stroke="currentColor" strokeWidth="1.2" markerStart="url(#cdf-arrow)" markerEnd="url(#cdf-arrow)" />
      <text x="150" y="380" textAnchor="middle" className="font-mono" fontSize="10" fontWeight="600" fill="currentColor">{w}</text>
      <text x="150" y="44" textAnchor="middle" className="font-mono" fontSize="9" fill="currentColor" opacity="0.8">ROUNDED — NEVER POINTED</text>
    </svg>
  );
}
