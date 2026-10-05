import { tasks } from "@/content/tasks";
import { materials } from "@/content/materials";
import { warnings } from "@/content/warnings";
import { failureModes } from "@/content/troubleshooting";
import { outfitPieces } from "@/content/wardrobe";
import { sources } from "@/content/sources";
import { phases, gates } from "@/content/phases";
import { survivalCards } from "@/content/survival";
import { makeupSections } from "@/content/makeup";

export type SearchKind = "Task" | "Phase" | "Gate" | "Material" | "Warning" | "Troubleshooting" | "Wardrobe" | "Source" | "Survival" | "Makeup" | "Page";

export type SearchItem = { id: string; kind: SearchKind; title: string; subtitle: string; href: string; haystack: string };

const pages: [string, string, string][] = [
  ["Mission Control", "/", "dashboard home progress"],
  ["Master Build Plan", "/build", "phases roadmap timeline"],
  ["Guided Build", "/guide", "step by step glue mode"],
  ["Cone Lab", "/cone-lab", "measurements calculator pattern frustum radius arc"],
  ["Materials & Shopping", "/materials", "buy budget prices"],
  ["Beldar Closet", "/wardrobe", "outfit overalls shirt"],
  ["Makeup Station", "/makeup", "paint map pax rmgp"],
  ["Halloween Mode", "/halloween", "application day checklist timeline"],
  ["Party Survival", "/survival", "emergency repair kit"],
  ["Troubleshooting", "/troubleshooting", "problems fix"],
  ["Safety", "/safety", "ventilation allergy acetone"],
  ["Rehearsal Mode", "/rehearsal", "dress rehearsal go no-go"],
  ["Research & Sources", "/research", "citations bibliography references"],
  ["Build Log", "/log", "notes journal export"],
  ["Print Center", "/print", "printable sheets"],
  ["Settings", "/settings", "names import export reset"],
];

export function buildIndex(): SearchItem[] {
  const items: SearchItem[] = [];
  for (const [title, href, kw] of pages) items.push({ id: `page-${href}`, kind: "Page", title, subtitle: href, href, haystack: `${title} ${kw}` });
  for (const p of phases) items.push({ id: p.id, kind: "Phase", title: `${p.code} ${p.title}`, subtitle: p.goal, href: `/build/${p.slug}`, haystack: `${p.title} ${p.description} ${p.goal}` });
  for (const t of tasks) items.push({ id: t.id, kind: "Task", title: t.title, subtitle: t.summary, href: `/guide/${t.id}`, haystack: `${t.title} ${t.summary} ${t.instructions.join(" ")} ${t.checklistId ?? ""}` });
  for (const g of gates) items.push({ id: g.id, kind: "Gate", title: `${g.code} — ${g.title}`, subtitle: g.rule, href: "/build#gates", haystack: `${g.title} ${g.criteria} ${g.rule}` });
  for (const m of materials) items.push({ id: m.id, kind: "Material", title: m.name, subtitle: m.purpose, href: `/materials#${m.id}`, haystack: `${m.name} ${m.purpose} ${m.spec} ${m.alternative ?? ""}` });
  for (const w of warnings) items.push({ id: w.id, kind: "Warning", title: w.title, subtitle: w.body, href: "/safety", haystack: `${w.title} ${w.body}` });
  for (const f of failureModes) items.push({ id: f.id, kind: "Troubleshooting", title: f.symptom, subtitle: f.cause, href: `/troubleshooting#${f.id}`, haystack: `${f.symptom} ${f.aliases.join(" ")} ${f.cause}` });
  for (const p of outfitPieces) items.push({ id: p.id, kind: "Wardrobe", title: p.name, subtitle: p.fabric, href: `/wardrobe#${p.id}`, haystack: `${p.name} ${p.brands.join(" ")} ${p.searchPhrases.join(" ")}` });
  for (const c of survivalCards) items.push({ id: c.id, kind: "Survival", title: c.title, subtitle: c.prompt, href: `/survival#${c.id}`, haystack: `${c.title} ${c.steps.join(" ")}` });
  for (const m of makeupSections) items.push({ id: m.id, kind: "Makeup", title: m.title, subtitle: m.stage, href: `/makeup#${m.id}`, haystack: `${m.title} ${m.products.join(" ")} ${m.steps.join(" ")}` });
  for (const s of sources) items.push({ id: s.id, kind: "Source", title: `[${s.n}] ${s.title}`, subtitle: s.publisher, href: `/research#${s.id}`, haystack: `${s.title} ${s.publisher} ${s.supports}` });
  return items.map((i) => ({ ...i, haystack: i.haystack.toLowerCase() }));
}

export function searchIndex(items: SearchItem[], query: string, limit = 30) {
  const q = query.trim().toLowerCase();
  if (!q) return items.filter((i) => i.kind === "Page").slice(0, limit);
  const terms = q.split(/\s+/);
  return items
    .map((i) => {
      const title = i.title.toLowerCase();
      let score = 0;
      for (const t of terms) {
        if (!i.haystack.includes(t) && !title.includes(t)) return null;
        score += title.startsWith(t) ? 6 : title.includes(t) ? 4 : 1;
      }
      if (i.kind === "Task" || i.kind === "Survival") score += 1;
      return { i, score };
    })
    .filter((x): x is { i: SearchItem; score: number } => x !== null)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.i);
}
