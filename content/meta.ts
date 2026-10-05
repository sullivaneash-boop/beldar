import type { Confidence } from "@/types/content";

export const projectMeta = {
  character: "Beldar Conehead",
  film: "Coneheads (1993)",
  event: "Halloween 2026",
  defaultHalloween: "2026-10-31",
  defaultPartyStart: "20:00",
  researchDate: "2026-10-05",
  researchConfidence: "9 / 10",
  primaryMethod: "Hybrid EVA foam frustum with integrated Glatzan vinyl cap",
  fallbackMethod: "Upholstery foam with latex skin",
  advancedMethod: "Encapsulated platinum silicone",
  difficulty: "Intermediate DIY",
};

export const confidenceMeta: Record<Confidence, { label: string; short: string; description: string }> = {
  confirmed: { label: "Confirmed", short: "CONF", description: "Directly documented by primary or authoritative sources." },
  "strongly-supported": { label: "Strongly Supported", short: "STRONG", description: "Multiple sources or strong reasoning agree." },
  likely: { label: "Likely", short: "LIKELY", description: "Reasonable but lightly sourced." },
  estimated: { label: "Estimated", short: "EST", description: "An informed estimate — verify on your build." },
  "diy-recommendation": { label: "DIY Recommendation", short: "DIY", description: "The research's recommended approach for a home build." },
  "requires-prototyping": { label: "Requires Prototyping", short: "PROTO", description: "Can only be settled by a physical test." },
  "research-gap": { label: "Research Gap", short: "GAP", description: "The research doesn't cover this. We flag it rather than guess." },
};

export type MethodOption = {
  id: string;
  name: string;
  verdict: "recommended" | "fallback" | "advanced" | "rejected";
  summary: string;
  pros: string[];
  cons: string[];
  sourceIds: string[];
};

export const methods: MethodOption[] = [
  { id: "hybrid", name: "Hybrid EVA frustum + Glatzan vinyl cap", verdict: "recommended",
    summary: "4–5mm EVA truncated cone, foam-clay dome, Glatzan cap cemented inside the rim, acetone-melted edge.",
    pros: ["Lightweight, rigid, survives crowds", "No overheating or severe neck fatigue", "Chemically melted zero-ridge edge"], cons: ["Requires precise patterning and a paper test", "Acetone melt takes practice"], sourceIds: ["s6", "s7", "s9"] },
  { id: "upholstery", name: "Upholstery foam + latex + Woochie cap", verdict: "fallback",
    summary: "Carved block foam sealed with liquid latex, integrated into a latex bald cap.",
    pros: ["Highly affordable"], cons: ["Latex edge can't be dissolved — must be stippled", "More visible forehead seam"], sourceIds: ["s10", "s11"] },
  { id: "silicone", name: "Encapsulated platinum silicone", verdict: "advanced",
    summary: "Life-cast, Chavant sculpt, epoxy/fiberglass mold, hollow PlatSil appliance with Super Baldiez.",
    pros: ["Organic translucency and movement", "Replicates the film appliance's light scattering"], cons: ["Exceedingly heavy", "Life-casting, vacuum degassing", "$500+", "Significant SFX expertise"], sourceIds: ["s4", "s5", "s12"] },
  { id: "foam-latex", name: "Foam latex (movie method)", verdict: "rejected",
    summary: "What the 1993 production used.",
    pros: ["Screen-accurate, breathable"], cons: ["Toxic ammonia off-gassing", "Dedicated baking ovens", "Volatile failure rate for novices", "Hot, sweat-trapping, fragile edges"], sourceIds: ["s1", "s2"] },
  { id: "gelatin", name: "Gelatin", verdict: "rejected", summary: "Cast gelatin appliance.",
    pros: ["Inexpensive, easy to cast"], cons: ["Melts and slides off with body heat and sweat"], sourceIds: ["s3"] },
  { id: "rigid", name: "Papier-mâché / Worbla shell", verdict: "rejected", summary: "Rigid thermoplastic or paper shell.",
    pros: [], cons: ["Heavy", "Cracks under flex", "Dangerous hard edges against the skull"], sourceIds: ["s6"] },
  { id: "premade", name: "Modified party-store cone", verdict: "rejected", summary: "Off-the-shelf costume cone.",
    pros: ["Fast"], cons: ["Incorrect tapers", "Sharp, toy-like points"], sourceIds: [] },
];

export const borrowFromMovie = [
  "Pros-Aide as the primary skin adhesive (not spirit gum).",
  "PAX paint to seal porous materials with a flexible, crack-proof base.",
  "RMGP for organic, translucent skin mottling.",
];
export const dontReplicate = [
  "Casting and baking foam latex at home.",
  "A solid, heavy prosthetic — neck fatigue over 4–6 hours and an unmanageable center of gravity.",
];

/** Research "Comfortable Schedule" working back from Oct 31. */
export const schedule = [
  { date: "2026-09-15", tMinus: 45, label: "Materials", detail: "Order all specialty SFX materials and clothing.", phaseId: "acquire" },
  { date: "2026-10-01", tMinus: 30, label: "Prototyping", detail: "Prototype 0 paper template + Prototype 1 structural cone. Verify fit, balance, circumference.", phaseId: "proto0" },
  { date: "2026-10-10", tMinus: 21, label: "Fabrication", detail: "Finalize the master EVA cone; complete the foam clay dome.", phaseId: "fabricate" },
  { date: "2026-10-14", tMinus: 17, label: "Sealing", detail: "Liquid latex sealant; 48 hours outgassing and curing.", phaseId: "seal" },
  { date: "2026-10-17", tMinus: 14, label: "Assembly", detail: "Adhere the Glatzan cap inside the foam cone.", phaseId: "integrate" },
  { date: "2026-10-21", tMinus: 10, label: "Safety test", detail: "24-hour patch test of Pros-Aide and liquid latex on the inner arm.", phaseId: "skin-tests" },
  { date: "2026-10-24", tMinus: 7, label: "Pre-painting", detail: "Pre-paint upper cone with base PAX.", phaseId: "skin-tests" },
  { date: "2026-10-28", tMinus: 3, label: "Dress rehearsal", detail: "Wear unglued structure with overalls and shirt: gravity, neck strain, thermal comfort.", phaseId: "rehearsal" },
  { date: "2026-10-31", tMinus: 0, label: "Application day", detail: "Halloween.", phaseId: "deploy" },
];

export const acceleratedSchedule = {
  summary: "If starting late, skip Prototype 1, rely heavily on accurate initial measurements, and use a hair dryer on a cool setting to speed contact cement and latex drying.",
  warning: "Do not accelerate PAX paint drying with high heat — it will remain permanently tacky.",
};

export const helperRoleLabels = { wearer: "Wearer", helper: "Helper 1", any: "Anyone" } as const;
