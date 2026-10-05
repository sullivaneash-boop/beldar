"use client";

import { useState } from "react";
import { Check, Copy, ExternalLink } from "lucide-react";
import { cn, usd } from "@/lib/utils";
import { actions } from "@/lib/state/actions";
import { useHydrated, useProject } from "@/lib/state/store";
import { searchLinks } from "@/content/materials";
import { outfitPieces } from "@/content/wardrobe";
import type { OutfitPiece } from "@/types/content";
import { StatusSegment } from "./materials-browser";

export function CopyPhrase({ phrase }: { phrase: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-md border border-rule bg-paper p-2">
      <code className="min-w-0 flex-1 font-mono text-sm break-words">&ldquo;{phrase}&rdquo;</code>
      <button
        type="button"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(phrase);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          } catch {}
        }}
        className="inline-flex min-h-9 items-center gap-1 rounded-md border border-rule px-2 text-sm hover:border-ink"
      >
        {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />} {copied ? "Copied" : "Copy"}
      </button>
      {searchLinks(phrase).map((l) => (
        <a key={l.label} href={l.url} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-9 items-center gap-1 rounded-md border border-rule px-2 text-sm hover:border-ink">
          {l.label} <ExternalLink className="size-3" aria-hidden />
        </a>
      ))}
    </div>
  );
}

export function PieceTracker({ piece }: { piece: OutfitPiece }) {
  const s = useProject();
  const hydrated = useHydrated();
  const rec = hydrated ? s.wardrobe[piece.id] ?? {} : {};
  const [draft, setDraft] = useState<string | null>(null);
  const tracks = [
    ["exact", "Exact / confirmed"],
    ["vintage", "Closest vintage"],
    ["modern", "Modern substitute"],
  ] as const;
  return (
    <div className="mt-4 rounded-lg border-2 border-ink bg-paper p-3">
      <p className="label-caps text-ink-3">Our status</p>
      <div className="mt-2">
        <StatusSegment label={piece.name} value={rec.status ?? "need"} onChange={(st) => actions.setWardrobe(piece.id, { status: st })} />
      </div>
      <fieldset className="mt-3">
        <legend className="text-xs text-ink-3">Which route are we taking?</legend>
        <div className="mt-1 flex flex-wrap gap-1">
          {tracks.map(([id, label]) => (
            <button
              key={id}
              type="button"
              aria-pressed={rec.track === id}
              onClick={() => actions.setWardrobe(piece.id, { track: rec.track === id ? undefined : id })}
              className={cn("min-h-9 rounded-full border px-3 text-sm", rec.track === id ? "border-ink bg-ink text-paper" : "border-rule hover:bg-paper-2")}
            >
              {label}
            </button>
          ))}
        </div>
      </fieldset>
      <label className="mt-3 block text-xs text-ink-3" htmlFor={`w-${piece.id}`}>
        Price paid ($)
      </label>
      <input
        id={`w-${piece.id}`}
        inputMode="decimal"
        value={draft ?? (rec.actual === undefined ? "" : String(rec.actual))}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={() => {
          if (draft === null) return;
          const n = parseFloat(draft.replace(/[$,]/g, ""));
          actions.setWardrobe(piece.id, { actual: Number.isFinite(n) ? n : undefined });
          setDraft(null);
        }}
        className="h-10 w-full rounded-md border border-rule-strong bg-card px-2 font-mono"
      />
    </div>
  );
}

export function StillToFind() {
  const s = useProject();
  const hydrated = useHydrated();
  if (!hydrated) return null;
  const missing = outfitPieces.filter((p) => p.id !== "belt" && (s.wardrobe[p.id]?.status ?? "need") !== "received" && s.wardrobe[p.id]?.status !== "skip");
  const spent = Object.values(s.wardrobe).reduce((a, r) => a + (r.actual ?? 0), 0);
  return (
    <div className="rounded-lg border border-rule bg-card p-4">
      <p className="label-caps text-ink-3">Still need to find</p>
      {missing.length ? (
        <ul className="mt-2 flex flex-wrap gap-2">
          {missing.map((p) => (
            <li key={p.id}>
              <a href={`#${p.id}`} className="inline-block rounded-full border border-signal px-3 py-1 text-sm font-medium text-signal">
                {p.name}
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-2 font-medium text-ok">Wardrobe acquired. Approved for deployment.</p>
      )}
      <p className="mt-2 font-mono text-sm text-ink-2">Wardrobe spend: {usd(spent)}</p>
    </div>
  );
}

export function OutfitSelect({ id, primary }: { id: string; primary: boolean }) {
  const s = useProject();
  const hydrated = useHydrated();
  const selected = hydrated ? s.settings.outfitId === id : primary;
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={() => actions.setSettings({ outfitId: id })}
      className={cn("min-h-10 rounded-md border-2 px-3 text-sm font-semibold", selected ? "border-ink bg-ink text-paper" : "border-rule hover:border-ink")}
    >
      {selected ? "Our chosen look ✓" : "Choose this look"}
    </button>
  );
}
