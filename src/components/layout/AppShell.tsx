import { Link } from "@tanstack/react-router";
import {
  Activity,
  BarChart3,
  CloudSun,
  GitCompareArrows,
  Info,
  LayoutDashboard,
  ListTree,
  Menu,
  Sparkles,
  X,
} from "lucide-react";
import { useState, type ReactNode } from "react";

import { useHealth } from "@/hooks/use-api";
import { API_BASE_URL } from "@/lib/api";

const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/designs", label: "Design Explorer", icon: ListTree },
  { to: "/prediction", label: "Thermal Prediction", icon: BarChart3 },
  { to: "/recommendations", label: "Recommendations", icon: Sparkles },
  { to: "/comparison", label: "Comparison", icon: GitCompareArrows },
  { to: "/scenarios", label: "Weather Scenarios", icon: CloudSun },
  { to: "/about", label: "About", icon: Info },
] as const;

export function SystemStatus() {
  const { isLoading, error } = useHealth();
  const state = isLoading ? "checking" : error ? "offline" : "online";
  const color =
    state === "online" ? "bg-accent" : state === "offline" ? "bg-destructive" : "bg-muted-foreground";
  const text = state === "online" ? "API online" : state === "offline" ? "API unreachable" : "Checking API…";

  return (
    <div className="flex items-center gap-2 text-xs text-muted-foreground" aria-live="polite">
      <span className={`size-2 rounded-full ${color}`} aria-hidden="true" />
      <span>{text}</span>
    </div>
  );
}

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav aria-label="Main navigation" className="space-y-1">
      {NAV.map(({ to, label, icon: Icon }) => (
        <Link
          key={to}
          to={to}
          onClick={onNavigate}
          activeOptions={{ exact: to === "/" }}
          className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          activeProps={{ className: "bg-secondary text-foreground font-medium" }}
        >
          <Icon className="size-4 shrink-0" aria-hidden="true" />
          {label}
        </Link>
      ))}
    </nav>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b border-border bg-card/95 backdrop-blur">
        <div className="flex items-center gap-4 px-4 py-3 lg:px-6">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="rounded-md p-2 text-muted-foreground hover:bg-secondary lg:hidden"
            aria-label={open ? "Close navigation" : "Open navigation"}
            aria-expanded={open}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
          <div className="flex items-center gap-3">
            <Activity className="size-5 text-accent" aria-hidden="true" />
            <div className="leading-tight">
              <p className="text-sm font-semibold tracking-tight text-foreground">
                Passive Shelter Thermal Intelligence
              </p>
              <p className="hidden text-xs text-muted-foreground sm:block">
                Physics simulation · NASA POWER weather · ML surrogate
              </p>
            </div>
          </div>
          <div className="ml-auto flex flex-col items-end gap-0.5">
            <SystemStatus />
            <code className="hidden text-[0.65rem] text-muted-foreground md:block">{API_BASE_URL}</code>
          </div>
        </div>
      </header>

      <div className="flex">
        <aside className="sticky top-[57px] hidden h-[calc(100vh-57px)] w-64 shrink-0 border-r border-border bg-card px-3 py-5 lg:block">
          <NavLinks />
        </aside>

        {open ? (
          <div className="fixed inset-x-0 top-[57px] z-20 border-b border-border bg-card px-3 py-4 lg:hidden">
            <NavLinks onNavigate={() => setOpen(false)} />
          </div>
        ) : null}

        <main className="min-w-0 flex-1 px-4 py-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  );
}

export function PageHeader({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">{title}</h1>
        {subtitle ? <p className="mt-1 max-w-3xl text-sm text-muted-foreground">{subtitle}</p> : null}
      </div>
      {children}
    </div>
  );
}
