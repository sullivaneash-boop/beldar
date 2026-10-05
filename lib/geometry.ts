/**
 * Truncated cone (frustum) flat-pattern geometry.
 *
 * Research: r₁ = C / (2π); r₂ = 1.5–2"; h ≈ 10–11". These inputs go into a
 * frustum calculator (Templatemaker.nl). The flat pattern is an annular
 * sector: long convex bottom arc, shorter concave top arc, two straight sides.
 * The math below is the standard development of a right frustum — the same
 * calculation the referenced generator performs. All units: inches.
 */
export type FrustumInput = { circumference: number; height: number; topRadius: number };

export type FrustumResult = {
  r1: number;
  r2: number;
  h: number;
  slant: number;
  outerRadius: number;
  innerRadius: number;
  angleDeg: number;
  bottomArc: number;
  topArc: number;
  topDiameter: number;
  chord: number;
  /** Pattern bounding box for laying out on the foam roll. */
  width: number;
  depth: number;
  issues: string[];
};

export function frustum({ circumference: C, height: h, topRadius: r2 }: FrustumInput): FrustumResult | null {
  if (!(C > 0 && h > 0 && r2 > 0)) return null;
  const r1 = C / (2 * Math.PI);
  const issues: string[] = [];
  if (r2 >= r1) {
    issues.push("Top radius must be smaller than the base radius.");
    return null;
  }
  const slant = Math.hypot(h, r1 - r2);
  const outerRadius = (slant * r1) / (r1 - r2);
  const innerRadius = outerRadius - slant;
  const angleRad = (2 * Math.PI * r1) / outerRadius;
  const angleDeg = (angleRad * 180) / Math.PI;
  const chord = 2 * outerRadius * Math.sin(Math.min(angleRad, Math.PI) / 2);
  const width = angleRad >= Math.PI ? 2 * outerRadius : chord;
  const depth = outerRadius - innerRadius * Math.cos(Math.min(angleRad, Math.PI) / 2);

  if (C < 18 || C > 28) issues.push("That circumference is outside typical adult head sizes (≈20–25\"). Re-measure over the brow ridge and just above the ears.");
  if (r2 < 1.5) issues.push("Top radius under 1.5\" risks the 'wizard hat' failure mode.");
  if (r2 > 2) issues.push("Research recommends a 1.5–2\" top radius.");
  if (h < 10 || h > 11) issues.push("Research strongly supports a 10–11\" finished height from the brow line.");

  return {
    r1, r2, h, slant, outerRadius, innerRadius, angleDeg,
    bottomArc: C, topArc: 2 * Math.PI * r2, topDiameter: 2 * r2, chord, width, depth, issues,
  };
}

export const IN_TO_CM = 2.54;

export function fmt(inches: number, units: "in" | "cm", digits = 2) {
  if (units === "cm") return `${(inches * IN_TO_CM).toFixed(1)} cm`;
  return `${inches.toFixed(digits)}"`;
}

/** SVG path for the annular sector, centered at (0,0), opening upward-symmetric. */
export function sectorPath(R: number, r: number, angleDeg: number, scale = 1, cx = 0, cy = 0) {
  const a = (angleDeg * Math.PI) / 180;
  const start = -Math.PI / 2 - a / 2;
  const end = -Math.PI / 2 + a / 2;
  const p = (rad: number, ang: number) => [cx + rad * scale * Math.cos(ang), cy + rad * scale * Math.sin(ang)] as const;
  const [x1, y1] = p(R, start);
  const [x2, y2] = p(R, end);
  const [x3, y3] = p(r, end);
  const [x4, y4] = p(r, start);
  const large = a > Math.PI ? 1 : 0;
  return `M ${x1} ${y1} A ${R * scale} ${R * scale} 0 ${large} 1 ${x2} ${y2} L ${x3} ${y3} A ${r * scale} ${r * scale} 0 ${large} 0 ${x4} ${y4} Z`;
}

/** Full-scale SVG pattern file (1 SVG unit = 1 inch) for printing at 100%. */
export function patternSvg(f: FrustumResult) {
  const pad = 1;
  const a = (f.angleDeg * Math.PI) / 180;
  const minY = -f.outerRadius;
  const maxY = a >= Math.PI ? f.outerRadius : -f.innerRadius * Math.cos(Math.min(a, Math.PI) / 2);
  const halfW = f.width / 2;
  const w = f.width + pad * 2;
  const hgt = maxY - minY + pad * 2;
  const d = sectorPath(f.outerRadius, f.innerRadius, f.angleDeg, 1, 0, 0);
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${w.toFixed(3)}in" height="${hgt.toFixed(3)}in" viewBox="${(-halfW - pad).toFixed(3)} ${(minY - pad).toFixed(3)} ${w.toFixed(3)} ${hgt.toFixed(3)}">
  <title>Beldar Build HQ — frustum pattern (print at 100%)</title>
  <path d="${d}" fill="none" stroke="#000" stroke-width="0.02"/>
  <text x="0" y="${(-(f.outerRadius + f.innerRadius) / 2).toFixed(3)}" font-family="monospace" font-size="0.35" text-anchor="middle">r1=${f.r1.toFixed(2)} r2=${f.r2.toFixed(2)} h=${f.h.toFixed(2)} | R=${f.outerRadius.toFixed(2)} r=${f.innerRadius.toFixed(2)} θ=${f.angleDeg.toFixed(1)}°</text>
  <text x="0" y="${(-(f.outerRadius + f.innerRadius) / 2 + 0.5).toFixed(3)}" font-family="monospace" font-size="0.3" text-anchor="middle">Verify: bottom arc = ${f.bottomArc.toFixed(2)} in. Paper test (Prototype 0) before cutting foam.</text>
  <line x1="-0.5" y1="${(minY + 0.2).toFixed(3)}" x2="0.5" y2="${(minY + 0.2).toFixed(3)}" stroke="#000" stroke-width="0.02"/>
  <text x="0.6" y="${(minY + 0.3).toFixed(3)}" font-family="monospace" font-size="0.25">1 in scale check</text>
</svg>`;
}
