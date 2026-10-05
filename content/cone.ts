import type { MeasurementDef, ReferenceFact, RehearsalCheck } from "@/types/content";

export const measurementDefs: MeasurementDef[] = [
  { id: "circumference", symbol: "C", label: "Head circumference", how: "Horizontally around the cranium, directly over the brow ridge and just above the ears.", confidence: "strongly-supported", usedInFormula: true, sourceIds: ["s29"] },
  { id: "height", symbol: "h", label: "Desired finished cone height", how: "Vertical height from the brow line. Research: ~10–11\" for accurate proportion.", defaultValue: 10.5, range: [10, 11], confidence: "strongly-supported", usedInFormula: true, sourceIds: [] },
  { id: "topRadius", symbol: "r₂", label: "Top radius", how: "Leaves a 3–4\" opening for the foam clay dome. Research recommends 1.5–2\"; never below 1.5\".", defaultValue: 1.75, range: [1.5, 2], confidence: "diy-recommendation", usedInFormula: true, sourceIds: [] },
  { id: "foreheadWidth", label: "Forehead width", how: "Horizontal distance between the temples.", confidence: "strongly-supported", usedInFormula: false, sourceIds: [] },
  { id: "earToEar", label: "Ear-to-ear over crown", how: "Top of left ear, over the top of the skull, to top of right ear.", confidence: "strongly-supported", usedInFormula: false, sourceIds: [] },
];

export const referenceFacts: ReferenceFact[] = [
  { label: "Screen-used appliance (flattened, unmounted)", value: "≈ 16\" tall × 10\" wide", confidence: "confirmed", note: "Do not scale this directly into a rigid extension.", sourceIds: ["s13"] },
  { label: "Visual extension above natural crown", value: "9 – 11\"", confidence: "estimated", sourceIds: ["s13"] },
  { label: "Finished cone height from brow line", value: "10 – 11\"", confidence: "strongly-supported", sourceIds: [] },
  { label: "Top radius (open tip for clay dome)", value: "1.5 – 2\" (opening 3 – 4\" dia.)", confidence: "diy-recommendation", sourceIds: [] },
  { label: "Shell material", value: "4 – 5mm high-density EVA", confidence: "strongly-supported", sourceIds: ["s6"] },
  { label: "Internal support band", value: "2\" wide EVA, around cranial ridge", confidence: "diy-recommendation", sourceIds: ["s9"] },
  { label: "Foam rim position", value: "≈ 1\" above natural hairline", confidence: "diy-recommendation", sourceIds: [] },
  { label: "Vinyl skirt below rim", value: "3 – 4\" (checklist: 3\")", confidence: "diy-recommendation", sourceIds: ["s28"] },
  { label: "Gluing margin beyond transition line", value: "1\"", confidence: "diy-recommendation", sourceIds: ["s28"] },
  { label: "Cap cement depth inside rim", value: "≈ 1\"", confidence: "diy-recommendation", sourceIds: [] },
  { label: "Profile", value: "Smooth parabolic curve, very slight backward lean", confidence: "confirmed", sourceIds: ["s13"] },
  { label: "Transition", value: "Just above brow ridge; curves down behind the ears; ears exposed", confidence: "confirmed", sourceIds: ["s15"] },
  { label: "Weight target", value: "\"Mere ounces\" — no number given", confidence: "research-gap", note: "Weigh your prototype and record it.", sourceIds: ["s9"] },
  { label: "Comfort target", value: "30 min unglued with no pressure points; 2 h rehearsal; 4 – 6 h party", confidence: "strongly-supported", sourceIds: [] },
];

export const rehearsalChecks: RehearsalCheck[] = [
  // 15 min
  { id: "r-stability", area: "Stability", question: "Cone stays put while walking — no tilt backward, no wobble.", checkpoint: 15, critical: true, failAdvice: "Recut the base angle / refit the support band before gluing (Troubleshooting: tilts backward).", sourceIds: [] },
  { id: "r-visibility", area: "Visibility", question: "Clear view ahead and to the sides; nothing in the eyeline.", checkpoint: 15, critical: false, failAdvice: "Check rim position (≈1\" above hairline) and skirt trim.", sourceIds: [] },
  { id: "r-hearing", area: "Hearing", question: "Can hear conversation normally (ears exposed).", checkpoint: 15, critical: false, failAdvice: "Ears should stay exposed — trim the skirt with ear clearance.", sourceIds: ["s15"] },
  { id: "r-doorways", area: "Movement", question: "Walked through standard doorways without hitting the frame.", checkpoint: 15, critical: false, failAdvice: "Practice ducking; mark low spots at the venue.", sourceIds: [] },
  // 30 min
  { id: "r-comfort", area: "Comfort", question: "30 minutes in: no pressure points, no headache (Gate 2).", checkpoint: 30, critical: true, failAdvice: "Adjust the support band and repeat the comfort test before skin adhesion.", sourceIds: [] },
  { id: "r-sitting", area: "Sitting", question: "Sat down and stood up without the cone bumping anything or shifting.", checkpoint: 30, critical: false, failAdvice: "Plan seating with headroom; avoid high-backed chairs.", sourceIds: [] },
  { id: "r-stairs", area: "Stairs", question: "Took stairs up and down safely.", checkpoint: 30, critical: true, failAdvice: "The extension shifts center of gravity — slow down, use the rail, and re-check balance.", sourceIds: [] },
  // 60 min
  { id: "r-heat", area: "Heat", question: "Heat inside the cone is tolerable at 1 hour.", checkpoint: 60, critical: true, failAdvice: "EVA insulates. Research offers no ventilation fix — plan breaks, water, and Skin Prep Pro. Consider shorter wear.", sourceIds: ["s34"] },
  { id: "r-neck", area: "Comfort", question: "No neck strain or fatigue.", checkpoint: 60, critical: true, failAdvice: "Check weight and balance; the cone should weigh 'mere ounces'.", sourceIds: ["s9"] },
  { id: "r-hugs", area: "Movement", question: "Hugged someone without impaling them.", checkpoint: 60, critical: false, failAdvice: "Practice the sideways hug.", sourceIds: [] },
  { id: "r-bathroom", area: "Bathroom", question: "Unbuckled and re-buckled overall straps without the hardware touching the forehead edge.", checkpoint: 60, critical: false, failAdvice: "Practice; keep hardware clear of the prosthetic edge.", sourceIds: [] },
  // 120 min
  { id: "r-hydration", area: "Heat", question: "Drank water regularly; feel fine at 2 hours.", checkpoint: 120, critical: true, failAdvice: "Dehydration sneaks up. Set reminders for the party.", sourceIds: [] },
  { id: "r-transport", area: "Transportation", question: "Sat in the planned vehicle with the cone on (or confirmed on-site application).", checkpoint: 120, critical: false, failAdvice: "Use a vehicle with substantial headroom and recline the seat, or apply on-site.", sourceIds: [] },
  { id: "r-flash", area: "Photos", question: "Photos under flash look right (silhouette; seam if a test edge is applied).", checkpoint: 120, critical: false, failAdvice: "If the seam shows a shadow line, see Troubleshooting: edge visible.", sourceIds: [] },
  { id: "r-adhesive", area: "Adhesive", question: "If a test edge was glued: still down after 2 hours.", checkpoint: 120, critical: false, failAdvice: "More Skin Prep Pro; wait until Pros-Aide is clear.", sourceIds: ["s34"] },
  { id: "r-seam", area: "Seam", question: "If a test edge was melted: still invisible.", checkpoint: 120, critical: false, failAdvice: "Practice the melt more (Prototype 2).", sourceIds: [] },
  { id: "r-paint", area: "Paint", question: "If painted: no cracking, flaking or tack.", checkpoint: 120, critical: false, failAdvice: "Use PAX, powder heavily, never heat-dry.", sourceIds: ["s17"] },
];
