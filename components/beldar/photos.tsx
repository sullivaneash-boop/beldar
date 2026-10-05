"use client";

import { useEffect, useRef, useState } from "react";
import { Camera, X } from "lucide-react";
import { deletePhoto, getPhoto, savePhoto } from "@/lib/state/photos";

export function PhotoThumb({ id, onRemove }: { id: string; onRemove?: () => void }) {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    let alive = true;
    getPhoto(id).then((p) => alive && setUrl(p?.dataUrl ?? null));
    return () => {
      alive = false;
    };
  }, [id]);
  return (
    <div className="relative size-20 overflow-hidden rounded-md border border-rule bg-paper-2">
      {url ? (
        <a href={url} target="_blank" rel="noreferrer">
          {/* eslint-disable-next-line @next/next/no-img-element -- device-local data URL, nothing for next/image to optimize */}
          <img src={url} alt="Device-local test photo" className="size-full object-cover" />
        </a>
      ) : (
        <span className="grid size-full place-items-center text-xs text-ink-3">photo missing</span>
      )}
      {onRemove ? (
        <button
          type="button"
          aria-label="Remove photo"
          onClick={async () => {
            await deletePhoto(id).catch(() => {});
            onRemove();
          }}
          className="absolute top-0.5 right-0.5 grid size-6 place-items-center rounded-full bg-ink text-paper"
        >
          <X className="size-3.5" />
        </button>
      ) : null}
    </div>
  );
}

export function PhotoPicker({ onAdd }: { onAdd: (id: string) => void }) {
  const ref = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  return (
    <div>
      <input
        ref={ref}
        type="file"
        accept="image/*"
        capture="environment"
        className="sr-only"
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          setBusy(true);
          setError(null);
          try {
            onAdd(await savePhoto(file));
          } catch {
            setError("Couldn't save that photo on this device.");
          } finally {
            setBusy(false);
            e.target.value = "";
          }
        }}
      />
      <button type="button" onClick={() => ref.current?.click()} className="inline-flex min-h-10 items-center gap-1.5 rounded-md border border-dashed border-rule-strong px-3 text-sm hover:border-ink">
        <Camera className="size-4" /> {busy ? "Saving…" : "Add photo"}
      </button>
      {error ? <p className="mt-1 text-xs text-signal">{error}</p> : null}
      <p className="mt-1 text-xs text-ink-3">Photos stay on this device (not uploaded). Include them in a JSON export to back them up.</p>
    </div>
  );
}
