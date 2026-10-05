"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { Search } from "lucide-react";
import type { SearchItem } from "@/lib/search-index";
import { cn } from "@/lib/utils";

const EVENT = "beldar:open-palette";
export function openCommandPalette() {
  window.dispatchEvent(new Event(EVENT));
}

type Mod = typeof import("@/lib/search-index");

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [mod, setMod] = useState<{ m: Mod; items: SearchItem[] } | null>(null);
  const [active, setActive] = useState(0);
  const router = useRouter();
  const listRef = useRef<HTMLUListElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener(EVENT, onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(EVENT, onOpen);
    };
  }, []);

  useEffect(() => {
    if (open && !mod) {
      import("@/lib/search-index").then((m) => setMod({ m, items: m.buildIndex() }));
    }
  }, [open, mod]);

  const results = useMemo(() => (mod ? mod.m.searchIndex(mod.items, query) : []), [mod, query]);

  const go = (item: SearchItem) => {
    setOpen(false);
    setQuery("");
    router.push(item.href);
  };

  return (
    <DialogPrimitive.Root
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (!o) setQuery("");
      }}
    >
      <DialogPrimitive.Portal>
        <DialogPrimitive.Backdrop className="fixed inset-0 z-50 bg-ink/30 data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0" />
        <DialogPrimitive.Popup initialFocus={inputRef} className="fixed top-[8vh] left-1/2 z-50 flex max-h-[80dvh] w-[min(640px,calc(100vw-1.5rem))] -translate-x-1/2 flex-col overflow-hidden rounded-xl border border-rule-strong bg-card shadow-2xl outline-none data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95">
          <div className="flex items-center justify-between border-b border-rule bg-paper-2 px-4 py-2">
            <DialogPrimitive.Title className="label-caps text-ink-2">Query Remulak Database</DialogPrimitive.Title>
            <DialogPrimitive.Close className="label-caps rounded px-2 py-1 text-ink-3 hover:bg-paper">Esc</DialogPrimitive.Close>
          </div>
          <label className="flex items-center gap-3 border-b border-rule px-4">
            <Search className="size-5 text-ink-3" aria-hidden />
            <span className="sr-only">Search tasks, materials, warnings, troubleshooting, wardrobe and sources</span>
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setActive(0);
              }}
              onKeyDown={(e) => {
                if (e.key === "ArrowDown") {
                  e.preventDefault();
                  setActive((a) => Math.min(a + 1, results.length - 1));
                } else if (e.key === "ArrowUp") {
                  e.preventDefault();
                  setActive((a) => Math.max(a - 1, 0));
                } else if (e.key === "Enter" && results[active]) {
                  e.preventDefault();
                  go(results[active]);
                }
              }}
              placeholder="Search tasks, materials, warnings, fixes…"
              className="h-14 flex-1 bg-transparent text-base outline-none placeholder:text-ink-3"
              role="combobox"
              aria-expanded
              aria-controls="palette-results"
              aria-activedescendant={results[active] ? `pr-${results[active].kind}-${results[active].id}` : undefined}
            />
          </label>
          <ul ref={listRef} id="palette-results" role="listbox" className="flex-1 overflow-y-auto p-2">
            {!mod ? <li className="p-4 text-sm text-ink-3">Loading index…</li> : null}
            {mod && results.length === 0 ? (
              <li className="p-6 text-center text-sm text-ink-2">No matches. Try “acetone”, “tilt”, “overalls” or “patch test”.</li>
            ) : null}
            {results.map((r, i) => (
              <li key={`${r.kind}-${r.id}`} id={`pr-${r.kind}-${r.id}`} role="option" aria-selected={i === active}>
                <button
                  type="button"
                  onClick={() => go(r)}
                  onMouseMove={() => setActive(i)}
                  className={cn("flex w-full items-start gap-3 rounded-md px-3 py-2.5 text-left", i === active && "bg-paper-2")}
                >
                  <span className="label-caps mt-0.5 w-24 shrink-0 text-ink-3">{r.kind}</span>
                  <span className="min-w-0">
                    <span className="block font-medium">{r.title}</span>
                    <span className="line-clamp-1 text-sm text-ink-2">{r.subtitle}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </DialogPrimitive.Popup>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
