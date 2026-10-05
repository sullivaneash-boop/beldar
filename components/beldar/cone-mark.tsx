import { cn } from "@/lib/utils";

/**
 * Original abstract cone mark: an elongated parabolic dome over a brow line,
 * with a center axis. Not a likeness of any person or film artwork.
 */
export function ConeMark({ className, title }: { className?: string; title?: string }) {
  return (
    <svg viewBox="0 0 32 40" className={cn("shrink-0", className)} role={title ? "img" : undefined} aria-hidden={title ? undefined : true}>
      {title ? <title>{title}</title> : null}
      <path d="M5 34 C 7 22, 11 6, 16.5 3.2 C 21 6, 25 22, 27 34 Z" fill="var(--flesh)" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M16.5 4 V 34" stroke="currentColor" strokeWidth="0.8" strokeDasharray="1.6 1.6" opacity="0.55" />
      <path d="M3 34 H 29" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M8 26 Q 16.5 23.5 25 26" stroke="currentColor" strokeWidth="0.8" fill="none" opacity="0.5" />
    </svg>
  );
}

/**
 * Cone-shaped progress indicator. Fills from the brow line upward.
 */
export function ConeProgress({ pct, className, label }: { pct: number; className?: string; label?: string }) {
  const clamped = Math.max(0, Math.min(100, pct));
  const fillY = 36 - (clamped / 100) * 33;
  const id = `cone-clip-${Math.round(clamped)}`;
  return (
    <svg viewBox="0 0 32 40" className={cn("shrink-0", className)} role="img" aria-label={label ?? `${clamped}% complete`}>
      <defs>
        <clipPath id={id}>
          <path d="M5 36 C 7 24, 11 7, 16.5 3.5 C 22 7, 26 24, 28 36 Z" />
        </clipPath>
      </defs>
      <path d="M5 36 C 7 24, 11 7, 16.5 3.5 C 22 7, 26 24, 28 36 Z" fill="var(--paper-2)" />
      <rect x="0" y={fillY} width="32" height="40" fill="var(--flesh-2)" clipPath={`url(#${id})`} style={{ transition: "y 600ms cubic-bezier(.2,.7,.2,1)" }} />
      <path d="M5 36 C 7 24, 11 7, 16.5 3.5 C 22 7, 26 24, 28 36 Z" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M3 36 H 30" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}
