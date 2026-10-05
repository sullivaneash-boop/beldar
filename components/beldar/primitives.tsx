import Link from "next/link";
import { AlertTriangle, ExternalLink, Info, ShieldAlert } from "lucide-react";
import { confidenceMeta } from "@/content/meta";
import { sourceById } from "@/content/sources";
import { warningById } from "@/content/warnings";
import type { Confidence } from "@/types/content";
import { cn } from "@/lib/utils";

export function PageHeader({
  code,
  title,
  lede,
  children,
  stamp,
}: {
  code: string;
  title: string;
  lede?: React.ReactNode;
  children?: React.ReactNode;
  stamp?: string;
}) {
  return (
    <header className="mb-6 border-b-2 border-ink pb-5 sm:mb-8">
      <div className="flex items-center gap-3">
        <span className="label-caps rounded-sm bg-ink px-1.5 py-0.5 text-paper">{code}</span>
        {stamp ? <span className="label-caps text-ink-3">{stamp}</span> : null}
      </div>
      <h1 className="mt-3 font-display text-[2.5rem] leading-[0.95] font-extrabold tracking-wide uppercase sm:text-6xl">{title}</h1>
      {lede ? <div className="mt-3 max-w-3xl text-[1.0625rem] leading-relaxed text-ink-2">{lede}</div> : null}
      {children ? <div className="mt-4">{children}</div> : null}
    </header>
  );
}

export function SectionTitle({ children, kicker, id, className }: { children: React.ReactNode; kicker?: string; id?: string; className?: string }) {
  return (
    <div id={id} className={cn("mb-3 flex items-baseline gap-3", className)}>
      <h2 className="font-display text-2xl font-bold tracking-wide uppercase sm:text-[1.75rem]">{children}</h2>
      {kicker ? <span className="label-caps text-ink-3">{kicker}</span> : null}
    </div>
  );
}

export function Panel({ className, children, as: Tag = "section", ...rest }: { className?: string; children: React.ReactNode; as?: "section" | "div" | "article" } & React.HTMLAttributes<HTMLElement>) {
  return (
    <Tag className={cn("rounded-lg border border-rule bg-card p-4 sm:p-5", className)} {...rest}>
      {children}
    </Tag>
  );
}

const confidenceStyle: Record<Confidence, string> = {
  confirmed: "border-ok/40 bg-ok-bg text-ok",
  "strongly-supported": "border-denim/30 bg-paper-2 text-denim",
  likely: "border-rule-strong bg-paper-2 text-ink-2",
  estimated: "border-caution/40 bg-caution-bg text-caution",
  "diy-recommendation": "border-remulak-ink/40 bg-remulak/30 text-remulak-ink",
  "requires-prototyping": "border-caution/40 bg-caution-bg text-caution",
  "research-gap": "border-signal/40 bg-signal-bg text-signal",
};

export function ConfidenceBadge({ level, className }: { level: Confidence; className?: string }) {
  const meta = confidenceMeta[level];
  return (
    <span title={meta.description} className={cn("label-caps inline-flex items-center rounded-sm border px-1.5 py-0.5 whitespace-nowrap", confidenceStyle[level], className)}>
      {meta.label}
    </span>
  );
}

/** Inline citation chips, linking to the source library and the original URL. */
export function SourceRefs({ ids, className }: { ids: string[]; className?: string }) {
  if (!ids.length) return null;
  return (
    <span className={cn("inline-flex flex-wrap items-center gap-1 align-middle", className)}>
      {ids.map((id) => {
        const s = sourceById[id];
        if (!s) return null;
        return (
          <Link
            key={id}
            href={`/research#${id}`}
            title={`${s.title} — ${s.publisher}`}
            className="rounded-sm border border-rule bg-paper px-1 font-mono text-[0.6875rem] leading-4 text-ink-2 hover:border-denim hover:text-denim"
          >
            [{s.n}]
          </Link>
        );
      })}
    </span>
  );
}

export function SafetyAlert({
  level = "caution",
  title,
  children,
  className,
}: {
  level?: "critical" | "caution" | "info";
  title: string;
  children?: React.ReactNode;
  className?: string;
}) {
  const Icon = level === "critical" ? ShieldAlert : level === "caution" ? AlertTriangle : Info;
  return (
    <div
      role={level === "critical" ? "alert" : undefined}
      className={cn(
        "flex gap-3 rounded-md border-l-4 p-3 text-[0.9375rem]",
        level === "critical" && "border-signal bg-signal-bg",
        level === "caution" && "border-caution bg-caution-bg",
        level === "info" && "border-denim bg-paper-2",
        className,
      )}
    >
      <Icon className={cn("mt-0.5 size-5 shrink-0", level === "critical" ? "text-signal" : level === "caution" ? "text-caution" : "text-denim")} aria-hidden />
      <div className="min-w-0">
        <p className="font-semibold">
          <span className="sr-only">{level === "critical" ? "Critical warning: " : level === "caution" ? "Caution: " : "Note: "}</span>
          {title}
        </p>
        {children ? <div className="mt-0.5 text-ink-2">{children}</div> : null}
      </div>
    </div>
  );
}

export function WarningList({ ids }: { ids?: string[] }) {
  if (!ids?.length) return null;
  return (
    <div className="flex flex-col gap-2">
      {ids.map((id) => {
        const w = warningById[id];
        if (!w) return null;
        return (
          <SafetyAlert key={id} level={w.level} title={w.title}>
            {w.body} <SourceRefs ids={w.sourceIds} />
          </SafetyAlert>
        );
      })}
    </div>
  );
}

export function ExtLink({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) {
  const external = href.startsWith("http");
  if (!external) {
    return (
      <Link href={href} className={cn("font-medium text-denim underline decoration-denim/40 underline-offset-2 hover:decoration-denim", className)}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={cn("inline-flex items-center gap-1 font-medium text-denim underline decoration-denim/40 underline-offset-2 hover:decoration-denim", className)}>
      {children}
      <ExternalLink className="size-3.5" aria-hidden />
      <span className="sr-only">(opens in new tab)</span>
    </a>
  );
}

export function Stat({ label, value, sub, className }: { label: string; value: React.ReactNode; sub?: React.ReactNode; className?: string }) {
  return (
    <div className={cn("min-w-0", className)}>
      <p className="label-caps text-ink-3">{label}</p>
      <p className="mt-1 font-display text-3xl leading-none font-bold tabular sm:text-4xl">{value}</p>
      {sub ? <p className="mt-1 text-sm text-ink-2">{sub}</p> : null}
    </div>
  );
}

export function Difficulty({ value }: { value: number }) {
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`Difficulty ${value} of 5`} title={`Difficulty ${value}/5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={cn("h-2.5 w-1.5 rounded-[1px]", i <= value ? "bg-ink" : "bg-rule")} />
      ))}
    </span>
  );
}

export function Chip({ children, className }: { children: React.ReactNode; className?: string }) {
  return <span className={cn("inline-flex items-center gap-1 rounded-sm border border-rule bg-paper px-1.5 py-0.5 text-xs text-ink-2", className)}>{children}</span>;
}
