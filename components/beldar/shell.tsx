"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, Search } from "lucide-react";
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { cn } from "@/lib/utils";
import { useProject, useHydrated } from "@/lib/state/store";
import { daysUntil, progress } from "@/lib/derive";
import { ConeMark, ConeProgress } from "./cone-mark";
import { mobileTabs, navGroups } from "./nav-config";
import { openCommandPalette } from "./command-palette";

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/");
}

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav aria-label="Main" className="flex flex-col gap-5">
      {navGroups.map((g) => (
        <div key={g.group}>
          <p className="label-caps px-3 pb-1.5 text-ink-3">{g.group}</p>
          <ul className="flex flex-col gap-0.5">
            {g.items.map((item) => {
              const active = isActive(pathname, item.href);
              const Icon = item.icon;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onNavigate}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex min-h-10 items-center gap-3 rounded-md px-3 py-2 text-[0.9375rem] text-ink-2 transition-colors hover:bg-paper-2 hover:text-ink",
                      active && "bg-ink text-paper hover:bg-ink hover:text-paper",
                      item.href === "/survival" && !active && "text-signal",
                    )}
                  >
                    <Icon className="size-4.5" aria-hidden />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

function StatusBlock() {
  const s = useProject();
  const hydrated = useHydrated();
  const p = progress(s);
  const days = daysUntil(s.settings.halloweenDate);
  return (
    <div className="rounded-lg border border-rule bg-card p-3">
      <div className="flex items-center gap-3">
        <ConeProgress pct={hydrated ? p.pct : 0} className="h-10 w-8 text-ink" />
        <div className="min-w-0">
          <p className="label-caps text-ink-3">Disguise readiness</p>
          <p className="font-display text-2xl leading-none font-bold tabular">{hydrated ? `${p.pct}%` : "—"}</p>
        </div>
      </div>
      <p className="mt-2 font-mono text-xs text-ink-2 tabular">
        {hydrated ? `T-${Math.max(0, days)} days · ${p.done}/${p.total} tasks` : "Loading local data…"}
      </p>
    </div>
  );
}

export function Sidebar() {
  return (
    <aside data-chrome className="no-print sticky top-0 hidden h-dvh w-[264px] shrink-0 flex-col gap-5 overflow-y-auto border-r border-rule bg-paper px-3 py-5 lg:flex">
      <Link href="/" className="flex items-center gap-2.5 px-2">
        <ConeMark className="h-9 w-7 text-ink" />
        <span className="leading-none">
          <span className="block font-display text-[1.375rem] font-extrabold tracking-wide uppercase">Beldar Build HQ</span>
          <span className="label-caps text-ink-3">Halloween 2026</span>
        </span>
      </Link>
      <button
        type="button"
        onClick={openCommandPalette}
        className="flex min-h-10 items-center gap-2 rounded-md border border-rule bg-card px-3 text-left text-sm text-ink-3 hover:border-rule-strong"
      >
        <Search className="size-4" aria-hidden />
        <span className="flex-1">Query database…</span>
        <kbd className="rounded border border-rule px-1.5 font-mono text-[0.6875rem]">⌘K</kbd>
      </button>
      <NavList />
      <div className="mt-auto">
        <StatusBlock />
        <p className="label-caps mt-3 px-1 text-ink-3">Remulak Fabrication Protocol · local-only</p>
      </div>
    </aside>
  );
}

export function MobileTopBar() {
  const [open, setOpen] = useState(false);
  return (
    <header data-chrome className="no-print sticky top-0 z-40 flex h-14 items-center gap-2 border-b border-rule bg-paper/95 px-3 backdrop-blur lg:hidden">
      <Link href="/" className="flex min-h-11 items-center gap-2 pr-2">
        <ConeMark className="h-7 w-5.5 text-ink" />
        <span className="font-display text-lg font-extrabold tracking-wide uppercase">Beldar HQ</span>
      </Link>
      <div className="flex-1" />
      <button type="button" onClick={openCommandPalette} className="grid size-11 place-items-center rounded-md hover:bg-paper-2" aria-label="Search">
        <Search className="size-5" />
      </button>
      <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
        <DialogPrimitive.Trigger className="grid size-11 place-items-center rounded-md hover:bg-paper-2" aria-label="Open menu">
          <Menu className="size-5" />
        </DialogPrimitive.Trigger>
        <DialogPrimitive.Portal>
          <DialogPrimitive.Backdrop className="fixed inset-0 z-50 bg-ink/30 data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0" />
          <DialogPrimitive.Popup className="fixed inset-y-0 right-0 z-50 flex w-[min(320px,88vw)] flex-col gap-4 overflow-y-auto border-l border-rule bg-paper p-4 shadow-xl outline-none data-open:animate-in data-open:slide-in-from-right data-closed:animate-out data-closed:slide-out-to-right">
            <div className="flex items-center justify-between">
              <DialogPrimitive.Title className="font-display text-xl font-bold uppercase">All sections</DialogPrimitive.Title>
              <DialogPrimitive.Close className="min-h-11 rounded-md px-3 text-sm font-medium hover:bg-paper-2">Close</DialogPrimitive.Close>
            </div>
            <NavList onNavigate={() => setOpen(false)} />
            <StatusBlock />
          </DialogPrimitive.Popup>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    </header>
  );
}

export function MobileTabBar() {
  const pathname = usePathname();
  if (pathname.startsWith("/guide/")) return null;
  return (
    <nav
      data-chrome
      aria-label="Quick"
      className="no-print fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 border-t border-rule bg-paper/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden"
    >
      {mobileTabs.map((t) => {
        const active = isActive(pathname, t.href);
        const Icon = t.icon;
        const survival = t.href === "/survival";
        return (
          <Link
            key={t.href}
            href={t.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex min-h-16 flex-col items-center justify-center gap-1 text-[0.75rem] font-medium text-ink-2",
              active && "text-ink",
              survival && "text-signal",
            )}
          >
            <span className={cn("grid h-7 w-12 place-items-center rounded-full", active && (survival ? "bg-signal-bg" : "bg-paper-2"))}>
              <Icon className="size-5" aria-hidden />
            </span>
            {t.label}
          </Link>
        );
      })}
    </nav>
  );
}
