import { formatValue, labelOf, unitFor } from "@/lib/fields";

export function MetricCard({
  field,
  value,
  hint,
}: {
  field: string;
  value: unknown;
  hint?: string;
}) {
  const unit = unitFor(field);
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <p className="text-[0.7rem] font-medium uppercase tracking-[0.12em] text-muted-foreground">
        {labelOf(field)}
      </p>
      <p className="mt-2 font-mono text-2xl leading-none text-foreground">
        {formatValue(value)}
        {unit ? <span className="ml-1 text-sm text-accent">{unit}</span> : null}
      </p>
      {hint ? <p className="mt-2 text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

export function StatCard({
  label,
  value,
  sublabel,
  tone = "default",
}: {
  label: string;
  value: string;
  sublabel?: string;
  tone?: "default" | "ok" | "warn";
}) {
  const toneClass =
    tone === "ok" ? "text-accent" : tone === "warn" ? "text-destructive" : "text-foreground";
  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <p className="text-[0.7rem] font-medium uppercase tracking-[0.12em] text-muted-foreground">{label}</p>
      <p className={`mt-2 font-mono text-3xl leading-none ${toneClass}`}>{value}</p>
      {sublabel ? <p className="mt-2 text-xs text-muted-foreground">{sublabel}</p> : null}
    </div>
  );
}
