import type { FailureMode } from "@/types/content";

/**
 * Symptom-based troubleshooting. The first six rows are the research's
 * Failure Modes table; the rest are assembled from cautions stated elsewhere
 * in the research (procedure steps, compatibility matrix, prototype notes).
 * Where the research has no fix, we say so.
 */
export const failureModes: FailureMode[] = [
  {
    id: "wizard-hat", symptom: "Cone looks like a wizard hat / dunce cap", aliases: ["dunce cap", "traffic cone", "too pointy", "party hat", "sharp tip"],
    cause: "Frustum pattern top radius is too small; tip is too sharp.",
    immediateFix: "Before sealing: cut off the top 2 inches.",
    permanentFix: "Apply more foam clay and re-sculpt a wider, rounded parabolic dome.",
    prevention: "Ensure the top opening pattern has at least a 1.5\" radius before adding foam clay.",
    rebuild: "no", taskIds: ["t-dome", "t-measure"], confidence: "confirmed", sourceIds: [],
  },
  {
    id: "tilt-back", symptom: "Headpiece tilts / leans backward", aliases: ["leans back", "falls back", "tilting", "not plumb"],
    cause: "Base of the cone was patterned completely flat instead of matching the skull slope.",
    immediateFix: "Stop before adhering the cap.",
    permanentFix: "Recut the bottom edge of the EVA foam until it sits perfectly plumb / parallel to the ground.",
    prevention: "Execute Prototype 1 and trim the base angle there.",
    rebuild: "no", taskIds: ["t-proto1", "t-cap-integrate"], confidence: "confirmed", sourceIds: [],
  },
  {
    id: "edge-visible", symptom: "Forehead edge is visible", aliases: ["seam visible", "ridge", "line on forehead", "shadow line in flash"],
    cause: "Acetone melt failed, or a thick latex cap was used instead of vinyl.",
    immediateFix: "Fill the visible ridge with Pros-Aide Cream and let it dry.",
    permanentFix: "Re-paint with PAX. Use Kryolan Glatzan and practice the acetone melt on scrap first.",
    prevention: "Use Glatzan (vinyl). Practice the melt on a scrap piece (Prototype 2).",
    rebuild: "no", taskIds: ["t-acetone-practice", "t-acetone-melt"], confidence: "confirmed", sourceIds: ["s58"],
  },
  {
    id: "lifting", symptom: "Adhesive peeling / edge lifting from sweat", aliases: ["seam lifting", "edge lifting", "peeling", "coming unstuck"],
    cause: "Natural skin oils or excessive perspiration broke down the acrylic bond.",
    immediateFix: "Clean the skin with alcohol, re-apply Pros-Aide, wait until clear, press firmly (60-second repair).",
    permanentFix: "Liberally apply Mehron Skin Prep Pro before application.",
    prevention: "Astringent + Skin Prep Pro during prep.",
    rebuild: "no", taskIds: ["t-hair-skin", "t-trim-glue"], confidence: "confirmed", sourceIds: ["s34"],
  },
  {
    id: "paint-cracking", symptom: "Paint is cracking / flaking", aliases: ["flaking", "cracks", "paint peeling"],
    cause: "Standard acrylic or creme foundation used directly on the foam structure.",
    immediateFix: "Stipple new layers of PAX paint directly over the cracked areas.",
    permanentFix: "Use PAX (50% Pros-Aide) as the base everywhere on the appliance.",
    rebuild: "no", taskIds: ["t-mix-pax", "t-paint"], confidence: "confirmed", sourceIds: ["s21"],
  },
  {
    id: "overalls-modern", symptom: "Overalls look modern / trendy", aliases: ["slim fit", "dark denim", "fashion overalls"],
    cause: "Purchased slim-fit or dark raw indigo fashion denim.",
    immediateFix: "—",
    permanentFix: "Buy baggy, medium-wash utilitarian workwear (Liberty or Round House).",
    rebuild: "replace-garment", taskIds: ["t-source-clothing"], confidence: "confirmed", sourceIds: ["s43"],
  },
  {
    id: "wont-stick", symptom: "Adhesive won't stick", aliases: ["not sticking", "pros-aide not working", "slides"],
    cause: "Pros-Aide applied before it turned clear (wet, white Pros-Aide traps moisture), or oily skin.",
    immediateFix: "Wait until the Pros-Aide turns completely clear (3–5 min) before pressing.",
    permanentFix: "Strip oils with astringent/witch hazel and use Skin Prep Pro before gluing.",
    rebuild: "no", taskIds: ["t-trim-glue", "t-hair-skin"], confidence: "confirmed", sourceIds: ["s39"],
  },
  {
    id: "white-crust", symptom: "White crust along the edge", aliases: ["crusty edge", "white residue"],
    cause: "Too much Pros-Aide was used, or insufficient acetone was applied during the melt.",
    immediateFix: "Research gives cause only. Practice with thinner adhesive and a full acetone pass on scrap.",
    permanentFix: "Use thin Pros-Aide layers; complete the melt along the whole outer edge.",
    rebuild: "no", taskIds: ["t-acetone-practice"], confidence: "strongly-supported", sourceIds: [],
  },
  {
    id: "gummy-vinyl", symptom: "Vinyl goes gummy or stringy during the melt", aliases: ["stringy", "gummy", "rolling edge"],
    cause: "Technique — the research calls out this exact failure as what the helper must learn to avoid.",
    immediateFix: "Stop and practice on scrap Glatzan before touching the real edge.",
    permanentFix: "Repeat Prototype 2 until the edge disappears cleanly. Use minimal liquid and gentle swipes.",
    rebuild: "no", taskIds: ["t-acetone-practice"], confidence: "requires-prototyping", sourceIds: ["s7"],
  },
  {
    id: "cap-wrinkles", symptom: "Bald cap wrinkles", aliases: ["wrinkled cap", "creases", "bunching"],
    cause: "Vinyl not pulled taut during placement, or pressed down in large sections.",
    immediateFix: "Work in small 2\" sections and press firmly, ensuring no wrinkles form.",
    permanentFix: "During positioning, pull the skirt down tautly over brows, temples and ears before tracing.",
    rebuild: "maybe", taskIds: ["t-fit-trace", "t-trim-glue"], confidence: "strongly-supported", sourceIds: ["s4"],
  },
  {
    id: "acetone-latex", symptom: "Cap edge warped after acetone", aliases: ["warped edge", "latex cap acetone"],
    cause: "Acetone used on a latex cap. Acetone doesn't dissolve latex; it warps and wrinkles it.",
    immediateFix: "Stop applying acetone.",
    permanentFix: "Use a Kryolan Glatzan vinyl cap for the melted edge. A latex cap must be stippled instead.",
    rebuild: "yes", taskIds: ["t-cap-integrate"], confidence: "confirmed", sourceIds: [],
  },
  {
    id: "colors", symptom: "Skin colors don't match", aliases: ["color mismatch", "face doesn't match cone", "wrong tone"],
    cause: "PAX not tinted to the wearer, or lower face not integrated.",
    immediateFix: "Blend creme foundation, color-matched to the RMGP tones, onto the lower face, neck and ears.",
    permanentFix: "Re-mix PAX (Titanium White + touch of Yellow Ochre + micro-drop Burnt Sienna) to match the wearer's neck and chest.",
    rebuild: "no", taskIds: ["t-mix-pax", "t-paint"], confidence: "strongly-supported", sourceIds: [],
  },
  {
    id: "tacky", symptom: "Paint stays tacky / sticks to clothes", aliases: ["sticky", "tacky paint"],
    cause: "PAX not powdered, or dried with high heat.",
    immediateFix: "Press in a heavy coat of translucent powder with a velour puff; dust off.",
    permanentFix: "Never accelerate PAX drying with high heat — it remains permanently tacky.",
    rebuild: "no", taskIds: ["t-paint"], confidence: "confirmed", sourceIds: ["s17"],
  },
  {
    id: "too-hot", symptom: "Cone is too hot", aliases: ["overheating", "sweating", "hot head"],
    cause: "EVA foam is a thermal insulator; heat builds rapidly inside the cone.",
    immediateFix: "Drink water — cranial heat retention causes rapid, unnoticed dehydration. Watch for edge lifting from sweat.",
    permanentFix: "Skin Prep Pro is mandatory. Use the 2-hour rehearsal to identify heat build-up and ventilation issues.",
    rebuild: "maybe", taskIds: ["t-rehearsal", "t-hair-skin"], confidence: "research-gap", sourceIds: ["s34"],
  },
  {
    id: "wobble", symptom: "Cone wobbles / doesn't grip", aliases: ["loose", "shifting", "cone shifted", "unstable"],
    cause: "Inaccurate head circumference; the bottom arc length decides whether the internal support grips.",
    immediateFix: "Do not hold the cone up by the glued edge.",
    permanentFix: "Re-measure circumference, re-check the pattern with Prototype 0, and refit the 2\" support band.",
    rebuild: "maybe", taskIds: ["t-measure", "t-support-band"], confidence: "strongly-supported", sourceIds: [],
  },
  {
    id: "headache", symptom: "Pressure points / headache", aliases: ["headache", "pressure", "neck strain", "uncomfortable"],
    cause: "Support band pressure, or weight/leverage of the extension.",
    immediateFix: "Remove the unglued structure.",
    permanentFix: "Adjust the support band and re-run the 30-minute comfort test (Gate 2) before skin adhesion.",
    rebuild: "maybe", taskIds: ["t-comfort-test"], confidence: "requires-prototyping", sourceIds: ["s9"],
  },
  {
    id: "oil-makeup", symptom: "Latex surface getting soft / degrading", aliases: ["latex breaking down", "gooey"],
    cause: "Petroleum or mineral-oil based makeup on latex.",
    immediateFix: "Stop using oil-based products on latex areas.",
    permanentFix: "Use castor-oil based RMGP, or seal heavily with PAX.",
    rebuild: "maybe", taskIds: ["t-paint"], confidence: "confirmed", sourceIds: ["s19"],
  },
];

export const rebuildLabels: Record<FailureMode["rebuild"], string> = {
  no: "No rebuild",
  yes: "Rebuild needed",
  "replace-garment": "Replace garment",
  maybe: "Depends on severity",
};
