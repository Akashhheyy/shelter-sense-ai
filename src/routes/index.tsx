import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BarChart3, GitCompareArrows, ListTree, Sparkles } from "lucide-react";

import { StatCard } from "@/components/common/MetricCard";
import { ErrorState, LoadingState } from "@/components/common/DataState";
import { PageHeader } from "@/components/layout/AppShell";
import { RecordDetails } from "@/components/common/RecordTable";
import { useDesigns, useHealth, useScenarios } from "@/hooks/use-api";
import { isObject } from "@/lib/fields";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — Passive Shelter Thermal Intelligence" },
      {
        name: "description",
        content:
          "Live system overview of shelter designs, weather scenarios and API status for the passive shelter thermal decision-support system.",
      },
      { property: "og:title", content: "Dashboard — Passive Shelter Thermal Intelligence" },
      {
        property: "og:description",
        content: "Shelter designs, NASA POWER weather scenarios and API status at a glance.",
      },
    ],
  }),
  component: Dashboard,
});

const WORKFLOW = ["Design", "Weather", "Physics", "ML", "Recommendation"];

const ACTIONS = [
  { to: "/designs", label: "Explore Designs", icon: ListTree, desc: "Browse the shelter design catalogue" },
  { to: "/prediction", label: "Run Prediction", icon: BarChart3, desc: "Predict thermal performance" },
  { to: "/recommendations", label: "View Recommendations", icon: Sparkles, desc: "Rank candidate designs" },
  { to: "/comparison", label: "Compare Physics vs ML", icon: GitCompareArrows, desc: "Inspect surrogate agreement" },
] as const;

function Dashboard() {
  const health = useHealth();
  const designs = useDesigns();
  const scenarios = useScenarios();

  const healthRecord = isObject(health.data) ? health.data : null;

  return (
    <div className="space-y-8">
      <PageHeader
        title="Passive Shelter Thermal Intelligence"
        subtitle="Location-specific thermal performance analysis using physics-based simulation, NASA POWER weather data, and machine-learning prediction."
      />

      <section aria-label="Analysis workflow" className="rounded-lg border border-border bg-card p-5">
        <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Workflow</h2>
        <ol className="mt-4 flex flex-wrap items-center gap-2">
          {WORKFLOW.map((step, index) => (
            <li key={step} className="flex items-center gap-2">
              <span className="rounded-md border border-border bg-secondary/50 px-3 py-1.5 font-mono text-xs uppercase tracking-wider text-foreground">
                {step}
              </span>
              {index < WORKFLOW.length - 1 ? (
                <ArrowRight className="size-3.5 text-accent" aria-hidden="true" />
              ) : null}
            </li>
          ))}
        </ol>
      </section>

      <section aria-label="System status" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          label="Shelter designs"
          value={designs.isLoading ? "…" : designs.error ? "n/a" : String(designs.data?.length ?? 0)}
          sublabel={designs.error ? "GET /designs failed" : "Loaded from GET /designs"}
          tone={designs.error ? "warn" : "default"}
        />
        <StatCard
          label="Weather scenarios"
          value={scenarios.isLoading ? "…" : scenarios.error ? "n/a" : String(scenarios.data?.length ?? 0)}
          sublabel={scenarios.error ? "GET /scenarios failed" : "Loaded from GET /scenarios"}
          tone={scenarios.error ? "warn" : "default"}
        />
        <StatCard
          label="API status"
          value={health.isLoading ? "checking" : health.error ? "unreachable" : "online"}
          sublabel="GET /health"
          tone={health.error ? "warn" : health.isLoading ? "default" : "ok"}
        />
      </section>

      <section aria-label="Backend health report" className="space-y-3">
        <h2 className="text-sm font-semibold text-foreground">Backend health report</h2>
        {health.isLoading ? (
          <LoadingState label="Checking API health…" />
        ) : health.error ? (
          <ErrorState
            message={health.error instanceof Error ? health.error.message : "Health check failed."}
            onRetry={() => health.refetch()}
            retrying={health.isFetching}
          />
        ) : healthRecord ? (
          <RecordDetails record={healthRecord} title="Fields reported by /health" />
        ) : null}
      </section>

      <section aria-label="Quick actions" className="space-y-3">
        <h2 className="text-sm font-semibold text-foreground">Quick actions</h2>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {ACTIONS.map(({ to, label, icon: Icon, desc }) => (
            <Link
              key={to}
              to={to}
              className="group rounded-lg border border-border bg-card p-5 transition-colors hover:border-accent/60"
            >
              <Icon className="size-5 text-accent" aria-hidden="true" />
              <p className="mt-3 text-sm font-semibold text-foreground">{label}</p>
              <p className="mt-1 text-xs text-muted-foreground">{desc}</p>
              <span className="mt-3 inline-flex items-center gap-1 text-xs text-accent">
                Open <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
