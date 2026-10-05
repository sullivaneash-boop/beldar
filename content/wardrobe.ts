import type { Outfit, OutfitPiece } from "@/types/content";

export const outfitPieces: OutfitPiece[] = [
  {
    id: "overalls", name: "Rigid denim bib overalls",
    spec: ["Classic men's rigid denim bib overalls", "Baggy, utilitarian fit", "Liberty: distinct green zipper accents on the front bib"],
    colors: ["Medium blue wash"], fabric: "Rigid denim. Not dark raw indigo, not acid-washed, not heavily distressed.",
    brands: ["Liberty", "Round House"],
    fit: "Sized by maximum belly circumference, not natural waist. Add 4–6\" to the wearer's standard jean waist for the slightly oversized drape.",
    searchPhrases: ["Liberty men's rigid denim bib overalls medium wash", "Round House vintage bib overalls"],
    priceRange: "$45 – $65", ease: "Extremely easy (Amazon, Walmart, Tractor Supply)", confidence: "strongly-supported",
    tracks: {
      exact: "Liberty rigid bib overalls with green zipper accents — highly accurate, easily accessible match.",
      vintage: "Round House heavyweight denim overalls — correct vintage drape and hardware.",
      modern: "Any baggy medium-wash utilitarian workwear bib overall (not slim-fit fashion denim).",
    },
    sourceIds: ["s43", "s44", "s45"],
  },
  {
    id: "shirt", name: "90s abstract camp-collar shirt",
    spec: ["Men's short-sleeve button-down", "Cuban / camp collar", "Chaotic abstract geometric or brushstroke pattern", "Late-80s/early-90s 'Memphis design' / jazz-cup aesthetic"],
    colors: ["Stark black", "White", "Subtle earthy or jewel-toned accents"],
    fabric: "Rayon, silk or viscose — fluid, silky drape that falls softly under rigid overall straps. Stiff cotton poplin bunches incorrectly.",
    brands: ["Natural Issue", "Campia Moda", "Perry Ellis", "Jhane Barnes"],
    searchPhrases: ["Vintage 90s mens geometric abstract pattern rayon short sleeve shirt", "Natural Issue abstract shirt", "Mens 90s retro memphis style camp shirt", "Coofandy abstract button down"],
    priceRange: "$25 – $50 vintage · $20 – $30 modern", ease: "Vintage: moderate (eBay, Etsy, Grailed, Depop). Modern: easy.", confidence: "confirmed",
    tracks: {
      exact: "No exact screen-used match is identified in the research.",
      vintage: "Authentic 1990s rayon shirt from Natural Issue, Campia Moda, Perry Ellis or Jhane Barnes. DIY RECOMMENDATION: prioritize this.",
      modern: "Memphis-style camp shirt (e.g. Coofandy). Confidence: estimated — polyester reproductions lack the rayon weight and drape.",
    },
    sourceIds: ["s46", "s47", "s48", "s49", "s50"],
  },
  {
    id: "footwear", name: "Footwear",
    spec: ["1990s-era brown leather loafers", "or chunky white 'dad sneakers'"],
    colors: ["Brown leather", "White"], fabric: "Leather",
    brands: [], searchPhrases: ["Vintage 90s brown leather loafers", "Dad sneakers"],
    priceRange: "$20 – $40", ease: "Easy (thrift stores, secondary markets)", confidence: "likely",
    tracks: { exact: "Not identified.", vintage: "Thrift-store 90s brown loafers.", modern: "Chunky white dad sneakers." },
    sourceIds: [],
  },
  {
    id: "belt", name: "Simple leather belt (optional)",
    spec: ["Worn functionally under the overalls if needed"], colors: ["Brown/black leather"], fabric: "Leather",
    brands: [], searchPhrases: ["plain leather belt"], confidence: "likely",
    tracks: { exact: "Not identified.", vintage: "Any plain leather belt.", modern: "Any plain leather belt." },
    sourceIds: [],
  },
];

export const pieceById = Object.fromEntries(outfitPieces.map((p) => [p.id, p])) as Record<string, OutfitPiece>;

export const outfits: Outfit[] = [
  {
    id: "fireworks", name: "Fireworks-scene casual",
    context: "Beldar's casual party attire in the fireworks scene, Coneheads (1993).",
    reference: "Film stills (Paramount 1993) — private reference only; screen-used wardrobe documented by YourProps.",
    confidence: "confirmed", recognizability: 5, difficulty: 2, practicality: 5, primary: true,
    summary: "Iconic and highly recognizable. Vastly superior to the gray jumpsuits, with much better party practicality. Button-front shirt means nothing pulls over the finished appliance.",
    pieceIds: ["overalls", "shirt", "footwear", "belt"], researched: true, sourceIds: ["s42"],
  },
  {
    id: "jumpsuit", name: "Gray jumpsuit",
    context: "Generic gray jumpsuits referenced by the research as the alternative look.",
    reference: "Mentioned only in comparison.",
    confidence: "research-gap", recognizability: 2, difficulty: 2, practicality: 2, primary: false,
    summary: "The research calls the gray jumpsuits generic and less practical, and doesn't detail them. Not recommended; no sourcing data.",
    pieceIds: [], researched: false, sourceIds: ["s42"],
  },
];

export const characterDetails = [
  { title: "Five-second recognition pose", body: "Stand perfectly rigid, arms stiffly at the sides, chin slightly elevated, staring blankly past the observer." },
  { title: "Phrases", body: "A flat, monotone \"Mebs\" as a greeting. Refer to party snacks as \"mass quantities.\" Don't quote lines all night." },
  { title: "Prop foods", body: "A large raw yellow onion with a single bite taken out of it, or a generic unbranded roll of toilet paper." },
  { title: "Accessory", body: "A large retro-futuristic plastic prop resembling a sub-space communicator or sensor device." },
  { title: "Delivery", body: "Facial expression characteristically rigid, with a flat, rapid vocal delivery." },
];
