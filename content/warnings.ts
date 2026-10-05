import type { Alert, Warning } from "@/types/content";

export const warnings: Warning[] = [
  { id: "w-barge", level: "critical", title: "Barge fumes", body: "Barge Contact Cement emits highly toxic VOCs. Use it outdoors or in a heavily ventilated garage while wearing an organic vapor respirator.", sourceIds: ["s22", "s37"] },
  { id: "w-acetone", level: "critical", title: "Acetone near the eyes", body: "Wearer keeps eyes tightly closed. Helper uses minimal liquid on a swab so nothing drips. High ventilation.", sourceIds: ["s7"] },
  { id: "w-rip", level: "critical", title: "Never rip it off dry", body: "Pulling a Pros-Aide-adhered prosthetic off dry causes severe epidermal tearing, blistering and contact dermatitis. Always use Super Solv or Isopropyl Myristate.", sourceIds: ["s39", "s54"] },
  { id: "w-patch", level: "critical", title: "Patch test first", body: "A 24-hour patch test of Pros-Aide on the inner wrist is mandatory before full facial application.", sourceIds: ["s52"] },
  { id: "w-latex", level: "caution", title: "Latex allergy", body: "If the wearer or fabricator has a known latex allergy, substitute HexFlex or PlastiDip for liquid latex and use polyurethane (not latex) sponges.", sourceIds: ["s10"] },
  { id: "w-heat", level: "caution", title: "Heat gun burns", body: "The heat gun and hot foam can burn. Warm evenly until glossy — don't scorch.", sourceIds: ["s36"] },
  { id: "w-blade", level: "caution", title: "Sharp blades", body: "Use a freshly sharpened blade at 90° to the mat; change blades frequently. Dull blades slip and tear.", sourceIds: ["s36"] },
  { id: "w-instant-bond", level: "caution", title: "No realignment", body: "Contact cement bonds instantly on contact. Align the top edges first and work down; you cannot reposition.", sourceIds: ["s38"] },
  { id: "w-flame", level: "critical", title: "Flammable cone", body: "Painted EVA foam is highly flammable. Stay away from candles, jack-o'-lanterns and open flames. Watch ceiling fans and low light fixtures.", sourceIds: [] },
  { id: "w-pax-heat", level: "caution", title: "Don't heat-dry PAX", body: "Accelerating PAX drying with high heat leaves it permanently tacky.", sourceIds: [] },
  { id: "w-wet-prosaide", level: "caution", title: "Wait until clear", body: "Wet, white Pros-Aide contains trapped moisture and will not stick. Wait (3–5 min) until it turns completely clear.", sourceIds: ["s39"] },
  { id: "w-neck", level: "caution", title: "No tight necks", body: "Do not pull tight-necked garments over the finished appliance — button-up only.", sourceIds: [] },
  { id: "w-oil-latex", level: "caution", title: "Oil degrades latex", body: "Petroleum and mineral-oil makeup rapidly degrades latex. Use castor-oil based RMGP or seal heavily with PAX.", sourceIds: ["s19"] },
  { id: "w-dehydration", level: "caution", title: "Dehydration", body: "Cranial heat retention leads to rapid, often unnoticed dehydration. Drink water consistently all night.", sourceIds: [] },
];

export const warningById = Object.fromEntries(warnings.map((w) => [w.id, w])) as Record<string, Warning>;

/** Dashboard alerts derived from the research's gates and critical warnings. */
export const alerts: Alert[] = [
  { id: "a-measure", level: "caution", text: "Do not cut foam until the paper template (Prototype 0) fits flush.", untilTaskId: "t-paper", href: "/guide/t-paper" },
  { id: "a-silhouette", level: "critical", text: "Do not seal or paint the cone until the Silhouette gate passes.", untilGateId: "g-silhouette", href: "/build/fabricate" },
  { id: "a-patch", level: "critical", text: "No Pros-Aide on the face until the 24-hour wrist patch test is clean.", untilGateId: "g-patch", href: "/guide/t-patch-test" },
  { id: "a-comfort", level: "caution", text: "Do not glue to skin until the unglued structure is worn 30 minutes with no pressure points.", untilGateId: "g-comfort", href: "/guide/t-comfort-test" },
  { id: "a-melt", level: "caution", text: "Helper must master the acetone melt on scrap vinyl before Halloween.", untilGateId: "g-melt", href: "/guide/t-acetone-practice" },
  { id: "a-remover", level: "critical", text: "Have Super Solv or Isopropyl Myristate on hand. Never rip the cap off dry.", untilTaskId: "t-removal", href: "/survival#remove" },
  { id: "a-flame", level: "critical", text: "Painted EVA foam is flammable — no candles or open flame near the cone.", href: "/safety" },
];
