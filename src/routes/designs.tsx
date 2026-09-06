import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import { QueryBoundary } from "@/components/common/DataState";
import { DataTable, RecordDetails } from "@/components/common/RecordTable";
import { PageHeader } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDesigns } from "@/hooks/use-api";
import { entityId, flatten, labelOf, type Record$ } from "@/lib/fields";

export const Route = createFileRoute("/designs")({
  head: () => ({
    meta: [
      { title: "Design Explorer — Shelter Design Catalogue" },
      {
        name: "description",
        content:
          "Search, filter and inspect the shelter designs served by the backend, then continue to thermal prediction or comparison.",
      },
      { property: "og:title", content: "Design Explorer — Shelter Design Catalogue" },
      {
        property: "og:description",
        content: "Browse shelter geometry, materials and openings returned by the API.",
      },
    ],
  }),
  component: DesignExplorer,
});

const PAGE_SIZE = 25;

function DesignExplorer() {
  const designs = useDesigns();
  const [search, setSearch] = useState("");
  const [filterField, setFilterField] = useState("");
  const [filterValue, setFilterValue] = useState("");
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState<Record$ | null>(null);

  const rows = designs.data ?? [];

  const columns = useMemo(() => {
    if (!rows.length) return [];
    const keys = Object.keys(flatten(rows[0]!));
    return keys.slice(0, 8);
  }, [rows]);

  const filterableFields = useMemo(() => {
    if (!rows.length) return [];
    const flat = flatten(rows[0]!);
    return Object.keys(flat).filter((key) => {
      const values = new Set(rows.slice(0, 300).map((row) => String(flatten(row)[key])));
      return values.size > 1 && values.size <= 12;
    });
  }, [rows]);

  const filterOptions = useMemo(() => {
    if (!filterField) return [];
    return Array.from(new Set(rows.map((row) => String(flatten(row)[filterField])))).sort();
  }, [rows, filterField]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return rows.filter((row) => {
      const flat = flatten(row);
      if (filterField && filterValue && String(flat[filterField]) !== filterValue) return false;
      if (!term) return true;
      return Object.values(flat).some((value) => String(value).toLowerCase().includes(term));
    });
  }, [rows, search, filterField, filterValue]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pageCount - 1);
  const visible = filtered.slice(current * PAGE_SIZE, current * PAGE_SIZE + PAGE_SIZE);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Design Explorer"
        subtitle="Shelter designs exactly as returned by GET /designs — geometry, materials, openings and orientation."
      />

      <QueryBoundary
        isLoading={designs.isLoading}
        error={designs.error}
        isEmpty={!designs.isLoading && !designs.error && rows.length === 0}
        loadingLabel="Loading shelter designs…"
        emptyLabel="The API returned no shelter designs."
        onRetry={() => designs.refetch()}
      >
        <div className="flex flex-wrap items-end gap-3 rounded-lg border border-border bg-card p-4">
          <div className="min-w-56 flex-1">
            <label htmlFor="design-search" className="mb-1 block text-xs uppercase tracking-wide text-muted-foreground">
              Search designs
            </label>
            <Input
              id="design-search"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(0);
              }}
              placeholder="Search any field…"
            />
          </div>
          {filterableFields.length ? (
            <>
              <div>
                <label htmlFor="filter-field" className="mb-1 block text-xs uppercase tracking-wide text-muted-foreground">
                  Filter field
                </label>
                <select
                  id="filter-field"
                  value={filterField}
                  onChange={(event) => {
                    setFilterField(event.target.value);
                    setFilterValue("");
                    setPage(0);
                  }}
                  className="h-9 rounded-md border border-input bg-background px-3 text-sm text-foreground"
                >
                  <option value="">None</option>
                  {filterableFields.map((field) => (
                    <option key={field} value={field}>
                      {labelOf(field)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="filter-value" className="mb-1 block text-xs uppercase tracking-wide text-muted-foreground">
                  Value
                </label>
                <select
                  id="filter-value"
                  value={filterValue}
                  disabled={!filterField}
                  onChange={(event) => {
                    setFilterValue(event.target.value);
                    setPage(0);
                  }}
                  className="h-9 rounded-md border border-input bg-background px-3 text-sm text-foreground disabled:opacity-50"
                >
                  <option value="">All</option>
                  {filterOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </>
          ) : null}
          <p className="ml-auto text-xs text-muted-foreground">
            {filtered.length} of {rows.length} designs
          </p>
        </div>

        <DataTable
          rows={visible}
          columns={columns}
          caption="Shelter designs returned by the API"
          rowId={entityId}
          selectedId={selected ? entityId(selected) : undefined}
          onRowSelect={setSelected}
        />

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>
            Page {current + 1} of {pageCount}
          </span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={current === 0} onClick={() => setPage(current - 1)}>
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={current >= pageCount - 1}
              onClick={() => setPage(current + 1)}
            >
              Next
            </Button>
          </div>
        </div>

        {selected ? (
          <div className="space-y-3">
            <RecordDetails record={selected} title={`Design ${entityId(selected)} — all returned fields`} />
            <div className="flex flex-wrap gap-2">
              <Button asChild>
                <Link to="/prediction" search={{ design: entityId(selected) }}>
                  Run thermal prediction
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/comparison" search={{ design: entityId(selected) }}>
                  Compare physics vs ML
                </Link>
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">Select a row to see every field and continue to analysis.</p>
        )}
      </QueryBoundary>
    </div>
  );
}
