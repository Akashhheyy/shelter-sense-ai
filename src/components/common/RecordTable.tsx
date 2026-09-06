import { flatten, formatValue, labelOf, unitFor, type Record$ } from "@/lib/fields";

export function RecordDetails({ record, title }: { record: Record$; title?: string }) {
  const entries = Object.entries(flatten(record));
  return (
    <section className="rounded-lg border border-border bg-card">
      {title ? (
        <header className="border-b border-border px-4 py-3">
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        </header>
      ) : null}
      <dl className="grid gap-x-8 gap-y-3 p-4 sm:grid-cols-2 lg:grid-cols-3">
        {entries.map(([key, value]) => (
          <div key={key} className="min-w-0">
            <dt className="truncate text-xs uppercase tracking-wide text-muted-foreground">{labelOf(key)}</dt>
            <dd className="mt-0.5 truncate font-mono text-sm text-foreground">
              {formatValue(value)}
              {unitFor(key) ? <span className="ml-1 text-accent">{unitFor(key)}</span> : null}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export function DataTable({
  rows,
  columns,
  caption,
  onRowSelect,
  selectedId,
  rowId,
  highlightFirst,
}: {
  rows: Record$[];
  columns: string[];
  caption: string;
  onRowSelect?: (row: Record$) => void;
  selectedId?: string;
  rowId?: (row: Record$) => string;
  highlightFirst?: boolean;
}) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border bg-card">
      <table className="w-full border-collapse text-sm">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr className="border-b border-border bg-secondary/40 text-left">
            {columns.map((column) => (
              <th
                key={column}
                scope="col"
                className="whitespace-nowrap px-4 py-2.5 text-[0.7rem] font-semibold uppercase tracking-[0.1em] text-muted-foreground"
              >
                {labelOf(column)}
                {unitFor(column) ? ` (${unitFor(column)})` : ""}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => {
            const id = rowId?.(row) ?? String(index);
            const flat = flatten(row);
            const isSelected = selectedId !== undefined && selectedId === id;
            return (
              <tr
                key={id + index}
                onClick={onRowSelect ? () => onRowSelect(row) : undefined}
                tabIndex={onRowSelect ? 0 : undefined}
                onKeyDown={
                  onRowSelect
                    ? (event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          onRowSelect(row);
                        }
                      }
                    : undefined
                }
                aria-selected={onRowSelect ? isSelected : undefined}
                className={[
                  "border-b border-border/60 last:border-0",
                  onRowSelect ? "cursor-pointer focus:outline-none focus-visible:bg-secondary/60" : "",
                  isSelected ? "bg-accent/10" : "hover:bg-secondary/30",
                  highlightFirst && index === 0 ? "bg-accent/5" : "",
                ].join(" ")}
              >
                {columns.map((column) => (
                  <td key={column} className="whitespace-nowrap px-4 py-2.5 font-mono text-xs text-foreground">
                    {formatValue(flat[column])}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
