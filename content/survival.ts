import type { SafetySection, SurvivalCard } from "@/types/content";

export const survivalCards: SurvivalCard[] = [
  {
    id: "seam", title: "Seam lifting", prompt: "What do I do?", tone: "urgent", icon: "bandage",
    steps: [
      "Get the ziplock repair kit from the front overall pocket.",
      "Clean the skin under the lifted edge with a Q-tip.",
      "Apply Pros-Aide from the 1 oz travel bottle to skin and the vinyl edge.",
      "Wait until it turns completely clear — do not press while white.",
      "Press the edge back into place firmly.",
      "Dab with the powder-loaded sponge to kill shine and tack.",
    ],
    doNot: ["Don't press wet, white Pros-Aide — it won't stick.", "Don't pull the edge further to 'fix' it."],
    sourceIds: ["s39"],
  },
  {
    id: "shifted", title: "Cone shifted", prompt: "Fix it.", tone: "normal", icon: "move",
    steps: [
      "Don't pull on the cone — the vinyl skirt is glued to skin.",
      "Check the glued edge. If it's lifting, use Seam lifting.",
      "The cone's stability comes from the 2\" support band gripping the cranial ridge. If it's loose, that's a fit problem to fix after the party (re-measure, refit the band).",
      "If it's uncomfortable or unsafe, use Emergency removal.",
    ],
    gap: "The research has no on-the-night re-seating procedure for a glued cone.",
    sourceIds: [],
  },
  {
    id: "rubbed", title: "Makeup rubbed off", prompt: "Repair.", tone: "normal", icon: "paintbrush",
    steps: [
      "Dab shiny or tacky areas with the powder-loaded sponge from the kit.",
      "If paint has cracked or worn through, a real fix means stippling new PAX — that's at home, not in the kit.",
    ],
    gap: "The research's repair kit carries powder, not paint.",
    sourceIds: ["s17"],
  },
  {
    id: "hot", title: "Too hot", prompt: "Cool down safely.", tone: "normal", icon: "thermometer",
    steps: [
      "Drink water now. Cranial heat retention causes rapid, often unnoticed dehydration.",
      "Step away from heaters, crowds and candles.",
      "Sweat breaks the adhesive — check the edges and use Seam lifting if needed.",
      "If you feel unwell, take the costume off using Emergency removal and get help. Your health comes first.",
    ],
    sourceIds: [],
  },
  {
    id: "remove", title: "Need to remove the costume", prompt: "Emergency removal.", tone: "urgent", icon: "siren",
    steps: [
      "NEVER pull, tear or rip the cap off dry.",
      "Saturate a Q-tip or soft brush with Super Solv (or Isopropyl Myristate).",
      "Work it under the edge of the vinyl. Wait 15–30 seconds.",
      "Slowly roll the cap backward, continuously brushing remover into the exposed adhesive. Don't force it.",
      "Afterward: massage Isopropyl Myristate or coconut oil into the skin, wash with warm water and gentle cleanser, then a heavy moisturizer.",
    ],
    doNot: ["Micellar water, makeup wipes, soap and water don't work on Pros-Aide — scrubbing tears skin."],
    gap: "The 60-second kit contains no remover. Decide ahead of time whether to carry Super Solv / IPM or keep it at the venue.",
    sourceIds: ["s39", "s54", "s55"],
  },
  {
    id: "bathroom", title: "Bathroom strategy", prompt: "Straps & hardware.", tone: "normal", icon: "door",
    steps: [
      "Bib overalls unbuckle at the shoulders.",
      "When re-buckling, keep the metal strap hardware away from the forehead and temple edge — it can snag or scrape the prosthetic.",
    ],
    sourceIds: [],
  },
  {
    id: "transport", title: "Transportation", prompt: "Headroom.", tone: "normal", icon: "car",
    steps: [
      "Best: apply on-site, after you arrive.",
      "Otherwise: a vehicle with substantial headroom (SUV, truck, minivan) with the passenger seat fully reclined.",
    ],
    sourceIds: [],
  },
  {
    id: "spatial", title: "Doorways, stairs & hugs", prompt: "You're a foot taller.", tone: "normal", icon: "ruler",
    steps: [
      "The ~10\" extension shifts your center of gravity and spatial awareness.",
      "Duck for doorways, low light fixtures and ceiling fans.",
      "Take stairs deliberately.",
      "Hug sideways — don't impale anyone.",
      "Stay away from candles and open flame: painted EVA foam is highly flammable.",
    ],
    sourceIds: [],
  },
];

export const repairKit = [
  "Q-tips",
  "1 oz travel bottle of Pros-Aide",
  "Small cosmetic sponge pre-loaded with translucent setting powder",
  "All in a small ziplock bag, front overall pocket",
];

export const safetySections: SafetySection[] = [
  {
    id: "before-building", title: "Before building",
    items: [
      { text: "Ask everyone about latex allergies. If anyone is allergic, use PlastiDip or HexFlex instead of liquid latex, and polyurethane sponges only.", level: "caution", sourceIds: ["s10"] },
      { text: "Schedule the 24-hour Pros-Aide patch test well before Halloween (comfortable schedule: Oct 21).", level: "caution", sourceIds: ["s52"] },
      { text: "Don't attempt foam latex at home: it requires dedicated ovens due to toxic ammonia off-gassing.", level: "info", sourceIds: ["s1"] },
    ],
  },
  {
    id: "fabrication", title: "During fabrication",
    items: [
      { text: "Barge Contact Cement emits highly toxic VOCs. Outdoors or a heavily ventilated garage, with an organic vapor respirator.", level: "critical", sourceIds: ["s22", "s37"] },
      { text: "Heat gun: warm foam evenly until glossy. Hot foam and the gun can burn.", level: "caution", sourceIds: ["s36"] },
      { text: "Blades: highly sharpened, held at 90°, changed frequently.", level: "caution", sourceIds: ["s36"] },
      { text: "Contact cement bonds instantly; plan alignment before pressing.", level: "info", sourceIds: ["s38"] },
    ],
  },
  {
    id: "before-skin", title: "Before skin application",
    items: [
      { text: "A 24-hour patch test of Pros-Aide on the inner wrist is mandatory. Any redness, itching or hives → stop.", level: "critical", sourceIds: ["s52"] },
      { text: "Gate 2: wear the unglued structure 30 minutes with no pressure points before gluing.", level: "caution", sourceIds: [] },
      { text: "Strip skin oils with astringent; apply Skin Prep Pro.", level: "info", sourceIds: ["s34"] },
    ],
  },
  {
    id: "adhesive", title: "Adhesive safety",
    items: [
      { text: "Never pull, tear or rip a Pros-Aide prosthetic off dry — severe epidermal tearing, blistering and contact dermatitis.", level: "critical", sourceIds: ["s39"] },
      { text: "Remove only with Telesis Super Solv or Isopropyl Myristate. Micellar water, wipes and soap are ineffective.", level: "critical", sourceIds: ["s35", "s54"] },
      { text: "Use Pros-Aide, not spirit gum.", level: "info", sourceIds: ["s20"] },
    ],
  },
  {
    id: "latex", title: "Latex & allergy",
    items: [
      { text: "Known latex allergy (wearer or fabricator): substitute HexFlex / PlastiDip and use polyurethane sponges.", level: "critical", sourceIds: ["s10"] },
      { text: "Petroleum/mineral-oil makeup degrades latex — use castor-oil RMGP or seal with PAX.", level: "info", sourceIds: ["s19"] },
    ],
  },
  {
    id: "ventilation", title: "Ventilation",
    items: [
      { text: "Barge: outdoors or heavily ventilated garage + organic vapor respirator.", level: "critical", sourceIds: ["s37"] },
      { text: "Acetone melt: high ventilation.", level: "caution", sourceIds: ["s7"] },
      { text: "Liquid latex sealant: allow 48 hours for outgassing and curing.", level: "info", sourceIds: [] },
    ],
  },
  {
    id: "acetone", title: "Acetone & eyes",
    items: [
      { text: "Acetone is used inches from the eyes. Wearer keeps eyes tightly closed; helper uses minimal liquid so nothing drips.", level: "critical", sourceIds: ["s7"] },
    ],
  },
  {
    id: "night", title: "Halloween night",
    items: [
      { text: "Painted EVA foam is highly flammable. Stay away from candles, jack-o'-lanterns and open flames.", level: "critical", sourceIds: [] },
      { text: "Nearly a foot of extra height: watch low light fixtures and ceiling fans, doorways and stairs.", level: "caution", sourceIds: [] },
      { text: "Cranial heat retention → rapid, often unnoticed dehydration. Drink water consistently.", level: "caution", sourceIds: [] },
      { text: "Transport with substantial headroom, or apply on-site.", level: "info", sourceIds: [] },
    ],
  },
  {
    id: "removal", title: "Emergency removal",
    items: [
      { text: "Super Solv / IPM under the edge, 15–30 s, roll back slowly while brushing in more remover. Never force.", level: "critical", sourceIds: ["s39"] },
      { text: "Aftercare: IPM or coconut oil, warm water + gentle cleanser, heavy moisturizer.", level: "info", sourceIds: ["s56"] },
    ],
  },
];

export const safetyDisclaimer =
  "This is project guidance compiled from costume/SFX research, not medical advice. If anyone has a skin reaction, breathing trouble, or eye exposure to chemicals, stop and seek appropriate medical help.";
