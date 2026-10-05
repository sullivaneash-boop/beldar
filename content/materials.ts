import type { BudgetTier, CompatibilityRow, Material } from "@/types/content";

export const budgetTiers: BudgetTier[] = [
  {
    id: "budget",
    title: "Minimum Viable Beldar",
    description: "Budget tier. Upholstery foam cone sealed with latex on a Woochie latex cap.",
    method: "Fallback method — latex edge must be mechanically stippled (it can't be dissolved), so the forehead seam is more visible.",
    recommended: false,
  },
  {
    id: "recommended",
    title: "Recommended Build (Master Plan)",
    description: "Hybrid EVA foam frustum + foam clay dome + Kryolan Glatzan vinyl cap, melted with acetone.",
    method: "Primary DIY recommendation. Lightweight, rigid, zero-ridge melted edge.",
    recommended: true,
  },
  {
    id: "deluxe",
    title: "Deluxe / SFX Upgrades",
    description: "Recommended build plus optional pro upgrades (Telesis 8, Pros-Aide No-Tack, Super Baldiez).",
    method: "Optional. Extreme sweat resistance and matte PAX base.",
    recommended: false,
  },
];

/**
 * Prices are the research's Q3 2026 estimates ("volatility in the specialty
 * chemicals market applies"). Items with no `estimate` are referenced by a
 * procedure step but not priced in the research — we don't invent prices.
 */
export const materials: Material[] = [
  // ── Recommended build ───────────────────────────────────────────────
  {
    id: "eva-foam", name: "EVA foam (high-density)", purpose: "Rigid, lightweight cone structure and the 2\" internal support band.",
    qty: "1 roll", spec: "4mm or 5mm high-density", category: "structure", tiers: ["recommended", "deluxe"], mustHave: true, consumable: false,
    estimate: 20, retailer: "Cosplay retailer", preferred: "5mm high-density EVA roll", alternative: "4mm high-density EVA",
    warning: "Painted EVA foam is highly flammable — keep away from candles and open flame.",
    searchPhrase: "5mm high density EVA foam roll cosplay", usedIn: ["t-cut-heat", "t-support-band"], sourceIds: ["s6", "s9"],
  },
  {
    id: "foam-clay", name: "EVA foam clay (air-dry)", purpose: "Sculpting the organic parabolic dome tip.",
    qty: "1 tub", spec: "300g, air dry", category: "structure", tiers: ["recommended", "deluxe"], mustHave: true, consumable: true,
    estimate: 15, retailer: "Cosplay retailer", searchPhrase: "EVA foam clay air dry 300g", usedIn: ["t-dome"], sourceIds: ["s24"],
  },
  {
    id: "barge", name: "Barge All-Purpose Contact Cement", purpose: "Permanently bonding EVA seams; cementing the Glatzan cap inside the rim.",
    qty: "1", spec: "Quart", category: "adhesive", tiers: ["recommended", "deluxe"], mustHave: true, consumable: true,
    estimate: 25, retailer: "Hardware store", warning: "Highly toxic VOCs — outdoors or heavily ventilated garage, organic vapor respirator.",
    searchPhrase: "Barge all purpose contact cement quart", usedIn: ["t-cement", "t-cap-integrate"], sourceIds: ["s22", "s37", "s38"],
  },
  {
    id: "glatzan", name: "Kryolan Glatzan bald cap (vinyl)", purpose: "Vinyl skirt whose edge melts invisibly into skin with acetone.",
    qty: "1 (consider a spare — see note)", spec: "Large", category: "cap", tiers: ["recommended", "deluxe"], mustHave: true, consumable: true,
    estimate: 24, retailer: "SFX retailer", alternative: "Woochie latex cap (budget tier — cannot be acetone-melted)",
    warning: "Never use acetone on a latex cap — it warps and ruins the edge.",
    note: "Prototype 2 needs a 'spare piece of Glatzan cap edge' for acetone practice, and the vinyl skirt is usually destroyed on removal. The research prices one cap; decide if you want a second.",
    searchPhrase: "Kryolan Glatzan bald cap large", usedIn: ["t-cap-integrate", "t-acetone-practice", "t-trim-glue"], sourceIds: ["s7", "s28"],
  },
  {
    id: "acetone", name: "Acetone, 100% pure", purpose: "Melting the Glatzan edge into the skin.",
    qty: "1", spec: "8 oz, 100% pure", category: "cap", tiers: ["recommended", "deluxe"], mustHave: true, consumable: true,
    estimate: 6, retailer: "Pharmacy", warning: "Used inches from the eyes. Eyes tightly closed, minimal liquid, high ventilation.",
    searchPhrase: "100% pure acetone 8 oz", usedIn: ["t-acetone-practice", "t-acetone-melt"], sourceIds: ["s7", "s59"],
  },
  {
    id: "pros-aide", name: "Pros-Aide The Original", purpose: "Skin adhesive and the base of PAX paint.",
    qty: "1", spec: "2 oz", category: "adhesive", tiers: ["recommended", "deluxe"], mustHave: true, consumable: true,
    estimate: 20, retailer: "SFX retailer", warning: "24-hour patch test on the inner wrist before any facial use.",
    note: "Decant 1 oz into a travel bottle for the party repair kit.",
    searchPhrase: "Pros-Aide The Original 2 oz", usedIn: ["t-patch-test", "t-mix-pax", "t-trim-glue"], sourceIds: ["s20", "s39"],
  },
  {
    id: "liquitex", name: "Liquitex Heavy Body acrylics", purpose: "Pigment for PAX paint: Titanium White, Yellow Ochre, Burnt Sienna.",
    qty: "3 tubes", spec: "Heavy Body — Titanium White, Yellow Ochre, Burnt Sienna", category: "paint", tiers: ["recommended", "deluxe"], mustHave: true, consumable: true,
    estimate: 24, retailer: "Art supply", searchPhrase: "Liquitex heavy body titanium white yellow ochre burnt sienna", usedIn: ["t-mix-pax"], sourceIds: ["s17", "s40"],
  },
  {
    id: "skin-prep", name: "Mehron Skin Prep Pro", purpose: "Antiperspirant skin barrier — mandatory to keep sweat from breaking the bond.",
    qty: "1", spec: "4 oz", category: "skin-care", tiers: ["recommended", "deluxe"], mustHave: true, consumable: true,
    estimate: 14, retailer: "SFX retailer", searchPhrase: "Mehron Skin Prep Pro 4 oz", usedIn: ["t-hair-skin"], sourceIds: ["s34", "s53"],
  },
  {
    id: "super-solv", name: "Telesis Super Solv", purpose: "Pro-grade, fast and safe Pros-Aide removal.",
    qty: "1", spec: "4 oz", category: "removal", tiers: ["recommended", "deluxe"], mustHave: true, consumable: true,
    estimate: 28, retailer: "SFX retailer", alternative: "Isopropyl Myristate (gentler, oil-based)",
    note: "Research lists Super Solv in the Recommended table; its JSON appendix tags it 'Deluxe'. We follow the table.",
    searchPhrase: "Telesis Super Solv 4 oz", usedIn: ["t-removal"], sourceIds: ["s54"],
  },
  {
    id: "rmgp", name: "Kryolan Rubber Mask Grease Paint palette", purpose: "Organic mottling, redness, veins and highlights over PAX.",
    qty: "1", spec: "12-color", category: "paint", tiers: ["recommended", "deluxe"], mustHave: true, consumable: true,
    estimate: 30, retailer: "SFX retailer", alternative: "Mehron RMGP palette",
    searchPhrase: "Kryolan rubber mask grease paint palette 12 color", usedIn: ["t-paint-test"], sourceIds: ["s19"],
  },
  {
    id: "setting-powder", name: "Translucent setting powder", purpose: "Killing PAX tackiness.",
    qty: "1", spec: "1.5 oz", category: "paint", tiers: ["recommended", "deluxe"], mustHave: true, consumable: true,
    estimate: 12, retailer: "Cosmetics store", searchPhrase: "translucent setting powder 1.5 oz", usedIn: ["t-paint-test"], sourceIds: ["s17"],
  },
  {
    id: "liquid-latex", name: "Cosmetic liquid latex", purpose: "Sealing the EVA/clay surface (3–4 thin layers). Also the budget-tier sealant/edge blender.",
    qty: "1", spec: "16 oz", category: "paint", tiers: ["budget", "recommended", "deluxe"], mustHave: true, consumable: true,
    estimate: 18, retailer: "SFX retailer", alternative: "HexFlex flexible primer, or PlastiDip if anyone has a latex allergy",
    warning: "Latex allergy: substitute a synthetic sealant and use polyurethane (not latex) sponges.",
    note: "Priced only in the Budget table, but the Recommended procedure's Surface Sealing step requires it (or a flexible primer).",
    searchPhrase: "cosmetic liquid latex 16 oz", usedIn: ["t-seal"], sourceIds: ["s10", "s26"],
  },

  // ── Budget tier ─────────────────────────────────────────────────────
  {
    id: "upholstery-foam", name: "Upholstery foam", purpose: "Budget cone structure (carved).",
    qty: "1 yd", spec: "1/2\" thick", category: "structure", tiers: ["budget"], mustHave: false, consumable: false,
    estimate: 10, retailer: "Craft store", searchPhrase: "upholstery foam 1/2 inch", usedIn: [], sourceIds: ["s10"],
  },
  {
    id: "woochie-cap", name: "Woochie latex bald cap", purpose: "Budget forehead transition.",
    qty: "1", spec: "Standard", category: "cap", tiers: ["budget"], mustHave: false, consumable: true,
    estimate: 12, retailer: "Costume shop", warning: "Latex cannot be dissolved with acetone; edge must be stippled and stays more visible.",
    searchPhrase: "Woochie latex bald cap", usedIn: [], sourceIds: ["s11"],
  },
  {
    id: "pros-aide-1oz", name: "Pros-Aide The Original (1 oz)", purpose: "Budget-tier skin adhesive.",
    qty: "1", spec: "1 oz", category: "adhesive", tiers: ["budget"], mustHave: false, consumable: true,
    estimate: 12, retailer: "SFX retailer", searchPhrase: "Pros-Aide The Original 1 oz", usedIn: [], sourceIds: ["s20"],
  },
  {
    id: "ipm", name: "Isopropyl Myristate", purpose: "Safe, gentler oil-based Pros-Aide removal and post-removal skin cleanup.",
    qty: "1", spec: "4 oz", category: "removal", tiers: ["budget"], mustHave: false, consumable: true,
    estimate: 14, retailer: "SFX retailer", note: "Budget-tier remover. In the Recommended build it's the gentler alternative to Super Solv and is used in aftercare.",
    searchPhrase: "isopropyl myristate 4 oz makeup remover", usedIn: ["t-removal"], sourceIds: ["s54"],
  },
  {
    id: "creme-palette", name: "Creme foundation palette", purpose: "Budget coloring; in the Recommended build, face/neck/ear integration.",
    qty: "1", spec: "6-color (requires setting powder)", category: "paint", tiers: ["budget"], mustHave: false, consumable: true,
    estimate: 15, retailer: "Costume shop", note: "Recommended build still needs creme foundation for the lower face, neck and ears — color-matched to the RMGP tones.",
    searchPhrase: "creme foundation palette 6 color stage makeup", usedIn: ["t-paint-test"], sourceIds: [],
  },

  // ── Deluxe ──────────────────────────────────────────────────────────
  {
    id: "telesis-8", name: "Telesis 8 silicone adhesive", purpose: "Extreme sweat resistance.",
    qty: "1", spec: "2 oz", category: "adhesive", tiers: ["deluxe"], mustHave: false, consumable: true,
    estimate: 90, retailer: "SFX retailer", searchPhrase: "Telesis 8 silicone adhesive 2 oz", usedIn: [], sourceIds: [],
  },
  {
    id: "pros-aide-notack", name: "Pros-Aide No-Tack", purpose: "Preferred PAX base — dries matte.",
    qty: "1", spec: "2 oz", category: "adhesive", tiers: ["deluxe"], mustHave: false, consumable: true,
    estimate: 23, retailer: "SFX retailer", note: "The PAX step says 'preferably the No-Tack variant'.",
    searchPhrase: "Pros-Aide No Tack 2 oz", usedIn: ["t-mix-pax"], sourceIds: ["s17"],
  },
  {
    id: "super-baldiez", name: "Super Baldiez", purpose: "Polyurethane cap plastic (pro method; melts with 99% IPA).",
    qty: "1", spec: "4 oz", category: "cap", tiers: ["deluxe"], mustHave: false, consumable: true,
    estimate: 35, retailer: "SFX retailer", searchPhrase: "Super Baldiez cap plastic 4 oz", usedIn: [], sourceIds: ["s12", "s32"],
  },

  // ── Prototype kits (costed in the Prototype/Test Process) ───────────
  {
    id: "cardstock", name: "Heavy cardstock + masking tape", purpose: "Prototype 0 paper silhouette.",
    qty: "A few sheets + 1 roll", spec: "Heavy cardstock", category: "prototype", tiers: ["budget", "recommended", "deluxe"], mustHave: true, consumable: true,
    estimate: 2, searchPhrase: "heavy cardstock masking tape", usedIn: ["t-paper"], sourceIds: [],
  },
  {
    id: "proto-foam", name: "Cheap EVA anti-fatigue floor mats + hot glue", purpose: "Prototype 1 structural/balance test.",
    qty: "As needed", spec: "Cheap EVA mats; hot glue for temporary hold", category: "prototype", tiers: ["recommended", "deluxe"], mustHave: false, consumable: true,
    estimate: 10, note: "Skippable on the accelerated schedule.", searchPhrase: "EVA foam interlocking floor mats", usedIn: ["t-proto1"], sourceIds: [],
  },

  // ── Referenced in procedures (no research price) ────────────────────
  { id: "tape-measure", name: "Flexible tailor's tape", purpose: "Head measurements.", qty: "1", spec: "Flexible", category: "tools", tiers: [], mustHave: true, consumable: false, searchPhrase: "flexible tailor measuring tape", usedIn: ["t-measure"], sourceIds: [] },
  { id: "knife", name: "Sharp utility knife or scalpel + spare blades", purpose: "Clean 90° EVA cuts. Change blades frequently.", qty: "1 + blades", spec: "Very sharp", category: "tools", tiers: [], mustHave: true, consumable: false, searchPhrase: "snap off utility knife blades cosplay", usedIn: ["t-cut-heat"], sourceIds: ["s36"] },
  { id: "cutting-mat", name: "Cutting mat", purpose: "Hold blade at a strict 90° to the mat.", qty: "1", spec: "Self-healing", category: "tools", tiers: [], mustHave: true, consumable: false, searchPhrase: "self healing cutting mat large", usedIn: ["t-cut-heat"], sourceIds: ["s36"] },
  { id: "heat-gun", name: "Heat gun", purpose: "Heat-shaping EVA into conical memory.", qty: "1", spec: "Industrial heat gun", category: "tools", tiers: [], mustHave: true, consumable: false, warning: "Burn risk.", searchPhrase: "heat gun for EVA foam", usedIn: ["t-cut-heat"], sourceIds: ["s36"] },
  { id: "form", name: "Curved form (large pot or mannequin head)", purpose: "Holding heated foam while it cools.", qty: "1", spec: "", category: "tools", tiers: [], mustHave: true, consumable: false, searchPhrase: "mannequin head foam", usedIn: ["t-cut-heat"], sourceIds: ["s36"] },
  { id: "respirator", name: "Organic vapor respirator", purpose: "Required while using Barge contact cement.", qty: "1", spec: "Organic vapor cartridges", category: "safety", tiers: [], mustHave: true, consumable: false, warning: "Not optional for Barge.", searchPhrase: "organic vapor respirator half mask", usedIn: ["t-cement", "t-cap-integrate"], sourceIds: ["s37"] },
  { id: "sandpaper", name: "High-grit sandpaper / rotary tool (low speed)", purpose: "Lightly sanding prominent seams before sealing.", qty: "1 pack", spec: "High grit", category: "tools", tiers: [], mustHave: true, consumable: true, searchPhrase: "high grit sandpaper assortment", usedIn: ["t-seal"], sourceIds: [] },
  { id: "sponges", name: "Cosmetic sponges (dense + torn/stipple)", purpose: "Stippling PAX and RMGP; pre-loaded powder sponge in repair kit.", qty: "Pack", spec: "Polyurethane if anyone is latex-allergic", category: "application", tiers: [], mustHave: true, consumable: true, searchPhrase: "polyurethane makeup stipple sponges", usedIn: ["t-paint-test"], sourceIds: ["s10"] },
  { id: "puff-brush", name: "Velour puff + large fluffy brush", purpose: "Press powder into PAX; dust off excess.", qty: "1 each", spec: "", category: "application", tiers: [], mustHave: true, consumable: false, searchPhrase: "velour powder puff fluffy powder brush", usedIn: ["t-paint-test"], sourceIds: ["s17"] },
  { id: "detail-brush", name: "Fine-tipped detail brush", purpose: "Capillaries/veins; acetone melt (or cotton swab).", qty: "1–2", spec: "Small, firm", category: "application", tiers: [], mustHave: true, consumable: false, searchPhrase: "fine detail makeup brush", usedIn: ["t-paint-test", "t-acetone-melt"], sourceIds: [] },
  { id: "marker", name: "Washable cosmetic marker", purpose: "Tracing hairline, brow ridge and ears onto the vinyl.", qty: "1", spec: "Washable", category: "application", tiers: [], mustHave: true, consumable: true, searchPhrase: "washable cosmetic marker", usedIn: ["t-fit-trace"], sourceIds: ["s28"] },
  { id: "swabs", name: "Cotton swabs (Q-tips)", purpose: "Acetone melt, removal, repair kit.", qty: "1 box", spec: "", category: "application", tiers: [], mustHave: true, consumable: true, searchPhrase: "cotton swabs", usedIn: ["t-acetone-melt", "t-removal"], sourceIds: [] },
  { id: "hair-gel", name: "Strong-hold, alcohol-free hair gel", purpose: "Flatten hair to the skull.", qty: "1", spec: "Alcohol-free", category: "skin-care", tiers: [], mustHave: true, consumable: true, searchPhrase: "strong hold alcohol free hair gel", usedIn: ["t-hair-skin"], sourceIds: ["s28"] },
  { id: "astringent", name: "Astringent or witch hazel", purpose: "Strip natural oils from forehead and temples.", qty: "1", spec: "", category: "skin-care", tiers: [], mustHave: true, consumable: true, searchPhrase: "witch hazel astringent", usedIn: ["t-hair-skin"], sourceIds: [] },
  { id: "barrier-spray", name: "Mehron Barrier Spray", purpose: "Final misting to lock makeup.", qty: "1", spec: "", category: "paint", tiers: [], mustHave: true, consumable: true, searchPhrase: "Mehron Barrier Spray", usedIn: ["t-paint-test"], sourceIds: [] },
  { id: "pros-aide-cream", name: "Pros-Aide Cream", purpose: "Filling a visible forehead ridge before re-painting with PAX.", qty: "1", spec: "", category: "adhesive", tiers: [], mustHave: false, consumable: true, note: "Repair item (Failure Modes table).", searchPhrase: "Pros-Aide Cream", usedIn: [], sourceIds: ["s58"] },
  { id: "latex-alt", name: "HexFlex / PlastiDip (latex-free sealant)", purpose: "Substitute for liquid latex if anyone has a latex allergy.", qty: "1", spec: "", category: "paint", tiers: [], mustHave: false, consumable: true, searchPhrase: "HexFlex flexible foam primer", usedIn: ["t-seal"], sourceIds: ["s10", "s26"] },
  { id: "kit-bag", name: "Repair kit: ziplock bag + 1 oz travel bottle", purpose: "60-second emergency repair kit in the front overall pocket.", qty: "1 each", spec: "Small ziplock; 1 oz bottle", category: "application", tiers: [], mustHave: true, consumable: false, searchPhrase: "1 oz travel bottle", usedIn: ["t-kit"], sourceIds: [] },
  { id: "alcohol", name: "Alcohol (skin cleaning)", purpose: "Clean the skin before re-applying Pros-Aide to a lifted edge.", qty: "1", spec: "", category: "skin-care", tiers: [], mustHave: true, consumable: true, note: "Failure Modes table: 'Clean the skin with alcohol, re-apply Pros-Aide'.", searchPhrase: "isopropyl alcohol", usedIn: [], sourceIds: [] },
  { id: "aftercare", name: "Coconut oil, gentle cleanser, heavy moisturizer", purpose: "Post-removal skin cleanup and aftercare.", qty: "1 each", spec: "", category: "skin-care", tiers: [], mustHave: true, consumable: true, searchPhrase: "heavy moisturizer sensitive skin", usedIn: ["t-removal"], sourceIds: ["s56"] },
];

export const materialById = Object.fromEntries(materials.map((m) => [m.id, m])) as Record<string, Material>;

export const materialCategoryLabels: Record<Material["category"], string> = {
  structure: "Structure",
  adhesive: "Adhesives",
  cap: "Bald cap & melt",
  paint: "Paint & sealing",
  "skin-care": "Skin & hair prep",
  removal: "Removal",
  tools: "Tools",
  prototype: "Prototype kits",
  application: "Application supplies",
  safety: "Safety gear",
};

export const compatibility: CompatibilityRow[] = [
  { a: "EVA foam", b: "Barge contact cement", status: "recommended", note: "Creates a permanent, highly flexible cross-linked bond.", sourceIds: ["s22"] },
  { a: "Glatzan (vinyl) bald cap", b: "Acetone", status: "recommended", note: "Acetone breaks down the vinyl polymer, melting the edge seamlessly into the skin.", sourceIds: ["s8"] },
  { a: "Latex bald cap", b: "Acetone", status: "avoid", note: "Acetone does not dissolve latex; it will warp, wrinkle, and ruin the edge.", sourceIds: [] },
  { a: "Super Baldiez (PU cap)", b: "99% isopropyl alcohol", status: "recommended", note: "IPA dissolves the polyurethane edges without irritating the skin.", sourceIds: ["s32"] },
  { a: "Latex / foam latex", b: "Standard oil-based makeup", status: "avoid", note: "Petroleum and mineral oils rapidly degrade latex. Use castor-oil based RMGP or seal heavily with PAX.", sourceIds: ["s19"] },
  { a: "Pros-Aide", b: "Skin Prep Pro (antiperspirant)", status: "recommended", note: "Drastically increases adhesion duration by blocking sweat from compromising the acrylic bond.", sourceIds: ["s34"] },
  { a: "Pros-Aide", b: "Micellar water / soap", status: "avoid", note: "Ineffective for removal; scrubbing leads to severe skin tearing. Use Super Solv or Isopropyl Myristate.", sourceIds: ["s35"] },
];

export function searchLinks(phrase: string) {
  const q = encodeURIComponent(phrase);
  return [
    { label: "Amazon", url: `https://www.amazon.com/s?k=${q}` },
    { label: "eBay", url: `https://www.ebay.com/sch/i.html?_nkw=${q}` },
    { label: "Etsy", url: `https://www.etsy.com/search?q=${q}` },
  ];
}
