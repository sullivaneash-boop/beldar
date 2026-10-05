import type { ApplicationStep, MakeupSection, PaintZone } from "@/types/content";

export const makeupSections: MakeupSection[] = [
  {
    id: "skin-prep", order: 1, title: "Skin prep", stage: "Prep · T-180",
    zones: ["Forehead", "Temples"], products: ["Astringent / witch hazel", "Mehron Skin Prep Pro"],
    steps: ["Wash face, forehead and temples thoroughly with astringent or witch hazel to strip natural oils.", "Helper applies Mehron Skin Prep Pro to the upper forehead and temples as an antiperspirant barrier."],
    watchOut: ["Skin Prep Pro is mandatory — sweat breaks the acrylic bond from the inside."],
    confidence: "confirmed", sourceIds: ["s34"],
  },
  {
    id: "hair-prep", order: 2, title: "Hair prep", stage: "Prep · T-180",
    zones: ["Scalp"], products: ["Strong-hold alcohol-free gel"],
    steps: ["Flatten hair aggressively to the skull with strong-hold, alcohol-free gel and comb it flat.", "Long hair: braid tightly and pin to the nape of the neck to minimize bulk."],
    sourceIds: ["s28"],
  },
  {
    id: "eyebrows", order: 3, title: "Eyebrows", stage: "Prep",
    zones: ["Brows"], products: ["Prosthetic wax (or shave)"],
    steps: ["Beldar has no eyebrows. Block them aggressively with prosthetic wax, or shave them before application."],
    watchOut: ["Research gap: no brow-blocking procedure is given. Test during Prototype 2 if using wax."],
    confidence: "research-gap", sourceIds: ["s14"],
  },
  {
    id: "cap", order: 4, title: "Cap & cone placement", stage: "Cap · T-150",
    zones: ["Upper forehead", "Temples", "Ears"], products: ["Washable cosmetic marker"],
    steps: ["Pull the cone carefully over the head: foam rim secure on the upper forehead, vinyl skirt pulled taut over brows, temples and ears.", "Trace hairline, brow ridge and ears onto the vinyl with a washable marker.", "Remove; trim excess vinyl leaving a 1\" gluing margin beyond the visual transition line, with clearance around the ears."],
    sourceIds: ["s28"],
  },
  {
    id: "adhesive", order: 5, title: "Adhesive", stage: "Cap · T-120",
    zones: ["Forehead", "Temples"], products: ["Pros-Aide"],
    steps: ["Re-seat the cap. Work in small 2\" sections.", "Thin layer of Pros-Aide on skin and the matching underside of the vinyl.", "Wait 3–5 minutes until completely clear — wet, white Pros-Aide will not stick.", "Press firmly. No wrinkles."],
    confidence: "confirmed", sourceIds: ["s39"],
  },
  {
    id: "edge", order: 6, title: "Edge blending (acetone melt)", stage: "Blend · T-90",
    zones: ["Transition line"], products: ["100% acetone", "Cotton swab or small firm brush"],
    steps: ["High ventilation; wearer's eyes tightly closed.", "Swab dipped in acetone — minimal liquid.", "Gently swipe along the extreme outer edge; the vinyl melts into a microscopic taper."],
    watchOut: ["White crust = too much Pros-Aide or not enough acetone."],
    confidence: "strongly-supported", sourceIds: ["s7", "s59"],
  },
  {
    id: "base", order: 7, title: "Base color (PAX)", stage: "Paint · T-75",
    zones: ["Cone", "Vinyl cap", "Forehead to just above eyes"], products: ["PAX: 1:1 Pros-Aide (No-Tack preferred) + Liquitex", "Dense cosmetic sponge"],
    steps: ["PAX = 1 part Pros-Aide + 1 part Liquitex Heavy Body. Titanium White + a little Yellow Ochre + a micro-drop of Burnt Sienna → pale, jaundiced flesh matching neck and chest.", "Stipple over the entire cone, the vinyl cap, and down onto the forehead, stopping just above the eyes."],
    confidence: "strongly-supported", sourceIds: ["s17", "s21"],
  },
  {
    id: "powder", order: 8, title: "Sealing the PAX (powder)", stage: "Paint · T-75",
    zones: ["Everything painted"], products: ["Translucent setting powder", "Velour puff", "Large fluffy brush"],
    steps: ["PAX stays tacky forever unless powdered. Press a heavy coat of translucent powder in with a velour puff.", "Dust off excess with a large fluffy brush."],
    watchOut: ["Never dry PAX with high heat — permanently tacky."],
    sourceIds: ["s17"],
  },
  {
    id: "shadows", order: 9, title: "Shadows & redness (RMGP)", stage: "Paint · T-45",
    zones: ["Temples", "Back of neck", "Sides of cone"], products: ["Kryolan / Mehron RMGP palette", "Torn sponge"],
    steps: ["Stipple very sheer layers of warm reds and subtle purples with a torn sponge.", "Focus on the temples, back of the neck, and subtly along the sides of the cone to break up the flat PAX tone and mimic blood flow."],
    sourceIds: ["s19", "s10"],
  },
  {
    id: "veins", order: 10, title: "Veins, mottling & freckles", stage: "Paint · T-45",
    zones: ["Temporal transition", "Dome"], products: ["RMGP", "Fine-tipped brush"],
    steps: ["Paint faint, translucent blue and red capillaries near the temporal transition zones.", "Stipple light brown freckles or sunspots sporadically across the dome."],
    sourceIds: [],
  },
  {
    id: "highlight", order: 11, title: "Highlights", stage: "Paint · T-45",
    zones: ["Front vertical ridge of cone"], products: ["Lighter flesh tone (mixed with white RMGP)"],
    steps: ["Apply a slightly lighter flesh tone to the front vertical ridge of the cone — simulates bone pushing against stretched skin."],
    sourceIds: [],
  },
  {
    id: "face", order: 12, title: "Face integration", stage: "Paint · T-45",
    zones: ["Lower face", "Neck", "Ears"], products: ["Creme foundation color-matched to RMGP tones"],
    steps: ["Wearer blends creme foundation on the lower face, neck and exposed ears for a unified complexion."],
    sourceIds: [],
  },
  {
    id: "seal", order: 13, title: "Final seal", stage: "Paint · T-15",
    zones: ["Face", "Cone"], products: ["Mehron Barrier Spray"],
    steps: ["Mist the entire face and cone with Mehron Barrier Spray to lock the makeup."],
    sourceIds: [],
  },
];

export const paintZones: PaintZone[] = [
  { id: "base", label: "PAX base", color: "#E8D3A2", pattern: "solid", description: "Entire cone, vinyl cap, and forehead down to just above the eyes.", product: "PAX (1:1 Pros-Aide + Liquitex)" },
  { id: "highlight", label: "Highlight ridge", color: "#F6EBD0", pattern: "highlight", description: "Front vertical ridge of the cone.", product: "Lighter flesh + white RMGP" },
  { id: "redness", label: "Redness / purples", color: "#C66A5A", pattern: "stipple", description: "Temples, back of neck, sides of cone — sheer stipple.", product: "RMGP warm reds + subtle purples" },
  { id: "veins", label: "Capillaries", color: "#5874A8", pattern: "lines", description: "Faint blue & red capillaries near the temporal transition zones.", product: "RMGP + fine brush" },
  { id: "freckles", label: "Freckles / sunspots", color: "#8C6239", pattern: "dots", description: "Sporadic light brown spots across the dome.", product: "RMGP + fine brush" },
  { id: "face", label: "Face integration", color: "#DDBF95", pattern: "hatch", description: "Lower face, neck and exposed ears.", product: "Creme foundation matched to RMGP" },
  { id: "melt", label: "Melted transition", color: "#1C1B19", pattern: "lines", description: "Glatzan edge melted into skin just above the brow, behind the ears.", product: "Acetone melt, then PAX" },
];

/** Halloween application timeline. tMinus = minutes before party start. */
export const applicationSteps: ApplicationStep[] = [
  { id: "h-layout", stage: "prep", tMinus: 195, durationMinutes: 15, title: "Lay out every supply", detail: "Skin Prep Pro, astringent, gel, marker, scissors, Pros-Aide, acetone, swabs, PAX, powder, puff, brushes, RMGP, foundation, Barrier Spray, remover. Open a window for ventilation.", role: "helper", origin: "app", sourceIds: [] },
  { id: "h-wash", stage: "prep", tMinus: 180, durationMinutes: 10, title: "Wash & strip oils", detail: "Wash face, forehead and temples thoroughly with astringent or witch hazel.", role: "wearer", taskId: "t-hair-skin", origin: "research", sourceIds: [] },
  { id: "h-skinprep", stage: "prep", tMinus: 170, durationMinutes: 10, title: "Apply Skin Prep Pro", detail: "Upper forehead and temples — antiperspirant barrier.", role: "helper", taskId: "t-hair-skin", origin: "research", sourceIds: ["s34"] },
  { id: "h-hair", stage: "prep", tMinus: 160, durationMinutes: 10, title: "Gel hair flat", detail: "Strong-hold, alcohol-free gel; comb flat to the skull. Long hair braided and pinned at the nape.", role: "wearer", taskId: "t-hair-skin", origin: "research", sourceIds: ["s28"] },
  { id: "h-place", stage: "cap", tMinus: 150, durationMinutes: 10, title: "Don the cone & mark trim line", detail: "Rim secure on upper forehead, skirt taut over brows, temples and ears. Helper traces hairline, brow ridge and ears with washable marker — clearance around the ears.", role: "helper", taskId: "t-fit-trace", origin: "research", sourceIds: [] },
  { id: "h-trim", stage: "cap", tMinus: 140, durationMinutes: 20, title: "Remove cone & trim vinyl", detail: "Trim excess vinyl leaving a 1\" gluing margin beyond the visual transition line.", role: "helper", taskId: "t-fit-trace", origin: "research", sourceIds: ["s28"] },
  { id: "h-glue", stage: "cone", tMinus: 120, durationMinutes: 30, title: "Glue in 2\" sections", detail: "Re-seat cone. Thin Pros-Aide on skin + cap underside, 2\" at a time. Wait 3–5 min until completely clear. Press firmly — no wrinkles.", role: "helper", safety: "Wet, white Pros-Aide won't stick. Wait until clear.", taskId: "t-trim-glue", origin: "research", sourceIds: ["s39"] },
  { id: "h-melt", stage: "blend", tMinus: 90, durationMinutes: 15, title: "Acetone melt the edge", detail: "Swab dipped in pure acetone, minimal liquid, swiped along the extreme outer edge.", role: "helper", safety: "High ventilation. Wearer's eyes tightly closed. No drips.", taskId: "t-acetone-melt", origin: "research", sourceIds: ["s7"] },
  { id: "h-pax", stage: "paint", tMinus: 75, durationMinutes: 20, title: "Stipple PAX base", detail: "Over the melted edge and blend down into the natural forehead, stopping just above the eyes.", role: "helper", taskId: "t-paint", origin: "research", sourceIds: ["s17"] },
  { id: "h-powder", stage: "paint", tMinus: 55, durationMinutes: 10, title: "Powder immediately", detail: "Heavy translucent powder pressed in with a velour puff; dust off excess. Kills the tack.", role: "helper", taskId: "t-paint", origin: "research", sourceIds: ["s17"] },
  { id: "h-rmgp", stage: "paint", tMinus: 45, durationMinutes: 20, title: "RMGP mottling, veins, highlight", detail: "Sheer reds/purples at temples, neck, cone sides. Faint blue/red capillaries at temples. Freckles on dome. Lighter highlight on the front ridge.", role: "helper", taskId: "t-paint", origin: "research", sourceIds: ["s19"] },
  { id: "h-foundation", stage: "paint", tMinus: 45, durationMinutes: 20, title: "Foundation: lower face, neck, ears", detail: "Creme foundation color-matched to the RMGP tones.", role: "wearer", taskId: "t-paint", origin: "research", sourceIds: [] },
  { id: "h-spray", stage: "paint", tMinus: 25, durationMinutes: 5, title: "Barrier Spray", detail: "Mist the whole face and cone with Mehron Barrier Spray.", role: "helper", taskId: "t-paint", origin: "research", sourceIds: [] },
  { id: "h-dress", stage: "wardrobe", tMinus: 15, durationMinutes: 10, title: "Step into overalls, button shirt", detail: "Carefully. Never pull a tight-necked garment over the finished appliance.", role: "wearer", safety: "Button-up only.", taskId: "t-dress", origin: "research", sourceIds: [] },
  { id: "h-mobility", stage: "final", tMinus: 0, durationMinutes: 5, title: "Mobility check", detail: "Turn, nod, walk a doorway. Nothing shifts.", role: "wearer", taskId: "t-dress", origin: "research", sourceIds: [] },
  { id: "h-flash", stage: "final", tMinus: 0, durationMinutes: 3, title: "Flash photo check", detail: "Photograph under bright flash to verify the seam is invisible.", role: "any", taskId: "t-dress", origin: "research", sourceIds: [] },
  { id: "h-water", stage: "final", tMinus: 0, durationMinutes: 2, title: "Hydrate", detail: "Drink water now — and consistently all night.", role: "wearer", origin: "research", sourceIds: [] },
  { id: "h-kit", stage: "kit", tMinus: 0, durationMinutes: 5, title: "Repair kit in front pocket", detail: "Ziplock: Q-tips, 1 oz Pros-Aide travel bottle, sponge pre-loaded with translucent powder.", role: "any", taskId: "t-kit", origin: "research", sourceIds: [] },
  { id: "h-leave", stage: "leave", tMinus: 0, durationMinutes: 0, title: "Transport", detail: "Ideally you applied on-site. Otherwise: vehicle with substantial headroom, passenger seat fully reclined.", role: "any", origin: "research", sourceIds: [] },
];

export const stageLabels: Record<ApplicationStep["stage"], string> = {
  prep: "Prep", cap: "Cap", cone: "Cone", blend: "Blend", paint: "Paint", wardrobe: "Wardrobe", final: "Final checks", kit: "Repair kit", leave: "Leave",
};
