import { AlertTriangle, Inbox, Loader2, RefreshCw } from "lucide-react";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";

export function LoadingState({ label }: { label: string }) {
  return (
    <div
      className="flex items-center gap-3 rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground"
      role="status"
      aria-live="polite"
    >
      <Loader2 className="size-4 animate-spin text-accent" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}

export function ErrorState({
  message,
  onRetry,
  retrying,
}: {
  message: string;
  onRetry?: () => void;
  retrying?: boolean;
}) {
  return (
    <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-6" role="alert">
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-0.5 size-4 text-destructive" aria-hidden="true" />
        <div className="space-y-3">
          <p className="text-sm text-foreground">{message}</p>
          {onRetry ? (
            <Button variant="outline" size="sm" onClick={onRetry} disabled={retrying}>
              <RefreshCw className={`size-3.5 ${retrying ? "animate-spin" : ""}`} aria-hidden="true" />
              {retrying ? "Retrying…" : "Retry"}
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-dashed border-border bg-card/50 p-6 text-sm text-muted-foreground">
      <Inbox className="size-4" aria-hidden="true" />
      <span>{message}</span>
    </div>
  );
}

export function QueryBoundary({
  isLoading,
  error,
  isEmpty,
  loadingLabel,
  emptyLabel,
  onRetry,
  children,
}: {
  isLoading: boolean;
  error: unknown;
  isEmpty?: boolean;
  loadingLabel: string;
  emptyLabel?: string;
  onRetry?: () => void;
  children: ReactNode;
}) {
  if (isLoading) return <LoadingState label={loadingLabel} />;
  if (error)
    return (
      <ErrorState
        message={error instanceof Error ? error.message : "An unexpected error occurred."}
        onRetry={onRetry}
      />
    );
  if (isEmpty) return <EmptyState message={emptyLabel ?? "The API returned no records."} />;
  return <>{children}</>;
}
