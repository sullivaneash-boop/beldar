import type { DecisionGate, Phase } from "@/types/content";

/**
 * Phases adapted from the research's Build Timeline (comfortable schedule),
 * Prototype/Test Process and Master Checklist. Target dates are the research's
 * comfortable-schedule dates for Halloween 2026.
 */
export const phases: Phase[] = [
  {
    id: "intel", slug: "intel", order: 1, code: "PH-00", title: "Intel & Measurements",
    description: "Study the real silhouette, capture the four head measurements, and make the safety calls (allergies, eyebrows) that change what you buy.",
    goal: "Valid frustum radii from real measurements, and a shared picture of what \"Beldar\" actually looks like.",
    estimatedDuration: "~1 hour", budgetNote: "$0",
    materialIds: ["tape-measure"], helper: "A helper holds the tape level around the head.",
    completionCriteria: ["Formula outputs valid radii (checklist 001).", "Everyone agrees the target is a smooth parabolic curve with a slight backward lean — not a wizard hat."],
    mistakes: ["Scaling the 16\" flattened auction measurement into a rigid extension — comically oversized and unstable.", "Using a generic template instead of your own circumference."],
    gateIds: [], sourceIds: ["s13", "s29"],
  },
  {
    id: "acquire", slug: "acquire", order: 2, code: "PH-01", title: "Terrestrial Acquisition",
    description: "Order the specialty SFX materials and fabrication supplies. Specialty items ship slowly; the research's comfortable schedule ordered everything by Sept 15.",
    goal: "All SFX and fabrication materials in transit or received.",
    targetDate: "2026-09-15", scheduleNote: "T-45 days (comfortable schedule).",
    estimatedDuration: "~1–2 hours of ordering", budgetNote: "Checklist estimate: ~$120 for SFX items (002). See Materials for full tier totals.",
    materialIds: ["pros-aide", "glatzan", "liquitex", "rmgp", "super-solv", "eva-foam", "foam-clay", "barge", "respirator"], helper: "Solo is fine.",
    completionCriteria: ["All items in transit (checklist 002)."],
    mistakes: ["Waiting on SFX materials — they gate the patch test, PAX mixing and Prototype 2.", "Forgetting the procedure items the tier tables don't price (respirator, heat gun, blades, sponges)."],
    gateIds: [], sourceIds: [],
  },
  {
    id: "proto0", slug: "prototype-0", order: 3, code: "P-0", title: "Prototype 0 — Paper Silhouette",
    description: "Test the frustum math with cardstock before touching foam. Human heads are oval, not cylindrical — this test is mandatory.",
    goal: "Verify the base radius clears the cranial ridge and sits flush against the forehead.",
    targetDate: "2026-10-01", scheduleNote: "T-30 days.",
    estimatedDuration: "45 min – 1 hour", budgetNote: "~$2",
    materialIds: ["cardstock"], helper: "Helper recommended (checklist 004).",
    completionCriteria: ["The paper cone rests securely on the head without holding it.", "Paper cone fits flush (checklist 004)."],
    mistakes: ["Skipping this and cutting foam from untested numbers."],
    gateIds: [], sourceIds: ["s31", "s29"],
  },
  {
    id: "proto1", slug: "prototype-1", order: 4, code: "P-1", title: "Prototype 1 — Cheap Structural Cone",
    description: "A throwaway foam-mat cone held with hot glue to test center of gravity, balance and the internal support band.",
    goal: "Verify balance and the friction-fit internal support before building the real thing.",
    targetDate: "2026-10-01", scheduleNote: "T-30 days.",
    estimatedDuration: "~2 hours", budgetNote: "~$10",
    materialIds: ["proto-foam"], helper: "Wearer walks; helper watches the tilt.",
    completionCriteria: ["Cone sits plumb while walking.", "Support band grips without a chinstrap."],
    mistakes: ["Ignoring a backward tilt — recut the base angle so it sits parallel to the ground."],
    gateIds: [],
    skippable: "Accelerated schedule: \"If starting late, skip Prototype 1, rely heavily on accurate initial measurements.\"",
    sourceIds: ["s9"],
  },
  {
    id: "fabricate", slug: "fabricate", order: 5, code: "PH-02", title: "Master Cone Fabrication",
    description: "Pattern, cut, heat-shape and cement the 5mm EVA frustum, add the 2\" support band, and sculpt the foam clay dome.",
    goal: "A lightweight hollow cone with a smooth parabolic dome that passes the silhouette gate.",
    targetDate: "2026-10-10", scheduleNote: "T-21 days. Dome needs 24–48h to cure.",
    estimatedDuration: "~3 hours work + 24–48h clay cure", budgetNote: "EVA $20 · Barge $25 · Foam clay $15",
    materialIds: ["eva-foam", "barge", "foam-clay", "knife", "cutting-mat", "heat-gun", "form", "respirator"], helper: "Solo work; ventilation required for Barge.",
    completionCriteria: ["Foam holds curved memory (005).", "Seam is permanent (006).", "Dome is parabolic & smooth (007).", "Gate 1 — Silhouette passed."],
    mistakes: ["Dull blades → micro-tears and jagged edges that are nearly impossible to hide.", "Closing the tip into a sharp point (wizard hat).", "Trying to realign contact cement — it bonds instantly."],
    gateIds: ["g-silhouette"], sourceIds: ["s6", "s36", "s38", "s24"],
  },
  {
    id: "seal", slug: "seal", order: 6, code: "PH-03", title: "Surface Sealing",
    description: "Sand prominent seams lightly, then unify foam and clay with 3–4 thin layers of liquid latex (or a flexible primer).",
    goal: "A unified, skin-like surface ready for PAX.",
    targetDate: "2026-10-14", scheduleNote: "T-17 days. Allow 48 hours for outgassing and curing.",
    estimatedDuration: "48 hours (mostly drying)", budgetNote: "Liquid latex ~$18",
    materialIds: ["liquid-latex", "sandpaper", "latex-alt"], helper: "Solo.",
    completionCriteria: ["Surface is unified & dry (008)."],
    mistakes: ["Sealing before Gate 1 passes.", "Thick coats — each layer must dry transparent first."],
    gateIds: ["g-silhouette"], sourceIds: ["s10"],
  },
  {
    id: "integrate", slug: "cap-integration", order: 7, code: "PH-04", title: "Cap Integration",
    description: "Cement the Glatzan vinyl cap inside the bottom rim so a 3–4\" skirt hangs below. Then wear the unglued structure for the comfort gate.",
    goal: "Rigid cone + loose vinyl skirt as one assembly; no pressure points over 30 minutes.",
    targetDate: "2026-10-17", scheduleNote: "T-14 days.",
    estimatedDuration: "~1 hour + 30 min comfort wear", budgetNote: "Glatzan ~$24",
    materialIds: ["glatzan", "barge", "respirator"], helper: "Helper useful for the comfort test.",
    completionCriteria: ["Skirt hangs 3 inches below rim (009).", "Gate 2 — Comfort passed."],
    mistakes: ["Cementing the cap before the base angle is right — recut the bottom edge before adhering the cap."],
    gateIds: ["g-comfort"], sourceIds: ["s7", "s28"],
  },
  {
    id: "skin-tests", slug: "skin-and-seam-tests", order: 8, code: "P-2", title: "Prototype 2 — Skin & Seam Tests",
    description: "The go/no-go gate: 24-hour patch test, acetone-melt practice on scrap Glatzan, PAX mixing, a paint test and flash photography of the seam.",
    goal: "Prove the wearer's skin tolerates the products and the helper can make the edge disappear.",
    targetDate: "2026-10-21", scheduleNote: "T-10 days (patch test). Pre-paint upper cone by Oct 24 (T-7).",
    estimatedDuration: "~2 hours + 24h patch test", budgetNote: "Included in master materials",
    materialIds: ["pros-aide", "glatzan", "acetone", "liquitex", "setting-powder", "rmgp"], helper: "Helper required — they'll be doing the melt on Halloween.",
    completionCriteria: ["Zero redness or hives (010).", "Vinyl edge becomes completely invisible to the naked eye.", "Color matches wearer's neck (011).", "Seam photographs cleanly under harsh flash (Gate 3)."],
    mistakes: ["A visible white crust = too much Pros-Aide or not enough acetone.", "Making Halloween night the first full test of the prosthetic system."],
    gateIds: ["g-patch", "g-melt", "g-flash"], sourceIds: ["s52", "s7", "s17"],
  },
  {
    id: "wardrobe", slug: "wardrobe", order: 9, code: "PH-05", title: "Wardrobe",
    description: "Source the fireworks-scene look: medium-wash rigid bib overalls sized up, and a fluid 90s abstract rayon camp shirt.",
    goal: "Garments acquired and fitted (checklist 003).",
    targetDate: "2026-09-15", scheduleNote: "Ordered with materials at T-45 in the comfortable schedule.",
    estimatedDuration: "~2 hours searching + try-on", budgetNote: "Checklist estimate ~$70 (overalls $45–65, shirt $20–50, shoes $20–40)",
    materialIds: [], helper: "Anyone can hunt vintage listings.",
    completionCriteria: ["Garments acquired.", "Overalls are baggy, medium wash; shirt drapes softly under the straps."],
    mistakes: ["Slim-fit or dark raw indigo fashion denim.", "Stiff cotton poplin shirt that bunches.", "A tight-necked garment that must be pulled over the finished appliance."],
    gateIds: [], sourceIds: ["s42", "s43", "s45"],
  },
  {
    id: "rehearsal", slug: "dress-rehearsal", order: 10, code: "PH-06", title: "Full Dress Rehearsal",
    description: "Wear the complete costume (unglued headpiece, shirt, overalls) for at least 2 hours walking and sitting. Plan transport and pack the repair kit.",
    goal: "Find heat build-up, neck strain, balance and ventilation issues before Halloween.",
    targetDate: "2026-10-28", scheduleNote: "T-3 days.",
    estimatedDuration: "2+ hours", budgetNote: "$0",
    materialIds: ["kit-bag"], helper: "Helper observes and runs the checkpoints.",
    completionCriteria: ["Rehearsal verdict GO or GO WITH FIXES.", "Transport plan decided.", "Repair kit packed."],
    mistakes: ["Not practicing doorways, stairs and hugs — the extension shifts your spatial awareness."],
    gateIds: [], sourceIds: [],
  },
  {
    id: "deploy", slug: "halloween", order: 11, code: "PH-07", title: "Halloween Deployment",
    description: "Application day: skin prep, trim, glue, acetone melt, PAX + RMGP, dressing and final checks — then safe removal afterward.",
    goal: "Approved for deployment by 8:00 PM; skin undamaged at the end of the night.",
    targetDate: "2026-10-31", scheduleNote: "Start at T-180 min (5:00 PM for an 8:00 PM party).",
    estimatedDuration: "~3 hours application", budgetNote: "Uses materials already bought",
    materialIds: ["skin-prep", "pros-aide", "acetone", "setting-powder", "rmgp", "super-solv"], helper: "Wearer + one dedicated helper (Helper 1).",
    completionCriteria: ["Cap firmly attached without wrinkles (013).", "Edge is totally invisible (014).", "Makeup matches lower face (015).", "Skin is clean and undamaged after removal (016)."],
    mistakes: ["Pulling a tight-necked garment over the finished appliance.", "Ripping the cap off dry at the end of the night."],
    gateIds: [], sourceIds: ["s7", "s17", "s39"],
  },
];

export const phaseById = Object.fromEntries(phases.map((p) => [p.id, p])) as Record<string, Phase>;
export const phaseBySlug = Object.fromEntries(phases.map((p) => [p.slug, p])) as Record<string, Phase>;

/**
 * The research defines gates in two places (prose "Decision Gates" and the
 * JSON appendix) with different lists. We keep all five, noting the origin.
 */
export const gates: DecisionGate[] = [
  {
    id: "g-silhouette", code: "GATE 1", title: "Silhouette",
    criteria: "Unpainted EVA foam cone accurately mimics Beldar's parabolic dome and sits flush on the brow.",
    rule: "Do not apply any liquid latex or paint until the wearer has worn the raw structure and the height, taper and dome read as \"Beldar\" — not generic sci-fi or a party hat.",
    blocksTaskIds: ["t-seal"], evidenceTaskIds: ["t-silhouette-check"], origin: "Decision Gates §1 + JSON G1", sourceIds: [],
  },
  {
    id: "g-comfort", code: "GATE 2", title: "Comfort",
    criteria: "Unglued internal support structure worn 30 uninterrupted minutes with no pressure points inducing headaches.",
    rule: "Do not proceed to final skin adhesion until this passes.",
    blocksTaskIds: ["t-trim-glue"], evidenceTaskIds: ["t-comfort-test"], origin: "Decision Gates §2", sourceIds: [],
  },
  {
    id: "g-patch", code: "GATE 3", title: "Adhesive Patch Test",
    criteria: "Pros-Aide applied to the inner wrist for 24 hours yields zero redness or irritation.",
    rule: "No Pros-Aide on the face until the 24-hour patch test is clean.",
    blocksTaskIds: ["t-trim-glue", "t-acetone-practice"], evidenceTaskIds: ["t-patch-test"], origin: "JSON appendix G2 + Safety", sourceIds: ["s52"],
  },
  {
    id: "g-melt", code: "GATE 4", title: "Acetone Melt Practice",
    criteria: "Helper dissolves a spare vinyl cap edge on the forearm without rolling or gumming; edge invisible to the naked eye.",
    rule: "Don't attempt the acetone melt on Halloween until the helper has done it successfully in practice.",
    blocksTaskIds: ["t-acetone-melt"], evidenceTaskIds: ["t-acetone-practice"], origin: "JSON appendix G3 + Prototype 2 (\"The Go/No-Go Gate\")", sourceIds: ["s7"],
  },
  {
    id: "g-flash", code: "GATE 5", title: "Seam Photography",
    criteria: "Forehead transition photographs cleanly under a harsh camera flash without a distinct shadow line.",
    rule: "Do not consider the prosthetic system solved until the seam passes the flash test.",
    blocksTaskIds: [], evidenceTaskIds: ["t-seam-photo"], origin: "Decision Gates §3", sourceIds: [],
  },
];

export const gateById = Object.fromEntries(gates.map((g) => [g.id, g])) as Record<string, DecisionGate>;
