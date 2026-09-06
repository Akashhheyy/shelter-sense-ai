/**
 * Helpers for rendering whatever fields the backend actually returns.
 * No values are invented here - only labels, units and formatting.
 */

const ACRONYMS: Record<string, string> = {
  id: "ID",
  ml: "ML",
  ua: "UA",
  kwh: "kWh",
  c: "°C",
  hvac: "HVAC",
  nasa: "NASA",
};

export function humanize(key: string): string {
  return key
    .replace(/^_+/, "")
    .split(/[_\s]+|(?<=[a-z])(?=[A-Z])/)
    .filter(Boolean)
    .map((word) => {
      const lower = word.toLowerCase();
      if (ACRONYMS[lower]) return ACRONYMS[lower];
      return lower.charAt(0).toUpperCase() + lower.slice(1);
    })
    .join(" ");
}

export function unitFor(key: string): string | null {
  const k = key.toLowerCase();
  if (k.endsWith("_c") || k.includes("temperature_c") || k.includes("celsius")) return "°C";
  if (k.includes("kwh")) return "kWh";
  if (k.includes("degree_hours") || k.includes("degree-hours")) return "degree-hours";
  if (k.startsWith("percent") || k.includes("percent") || k.includes("_pct")) return "%";
  if (k.includes("_m2") || k.includes("area")) return "m²";
  if (k.includes("_m3") || k.includes("volume")) return "m³";
  if (k.includes("_deg") || k.includes("azimuth") || k.includes("orientation")) return "°";
  if (k.includes("_m") && k.split("_").pop() === "m") return "m";
  return null;
}

export function formatNumber(value: number): string {
  if (!Number.isFinite(value)) return "—";
  const abs = Math.abs(value);
  if (abs !== 0 && abs < 0.01) return value.toExponential(2);
  if (Number.isInteger(value)) return value.toLocaleString();
  return value.toLocaleString(undefined, { maximumFractionDigits: abs < 10 ? 3 : 2 });
}

export function formatValue(value: unknown): string {
  if (value === null || value === undefined) return "—";
  if (typeof value === "number") return formatNumber(value);
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value === "string") return value.length ? value : "—";
  if (Array.isArray(value)) {
    if (!value.length) return "—";
    if (value.every((v) => typeof v !== "object")) return value.map((v) => formatValue(v)).join(", ");
    return `${value.length} items`;
  }
  return JSON.stringify(value);
}

export type Record$ = Record<string, unknown>;

/** Pulls a list out of common FastAPI response envelopes. */
export function extractList(payload: unknown): Record$[] {
  if (Array.isArray(payload)) return payload.filter(isObject);
  if (isObject(payload)) {
    for (const key of ["designs", "scenarios", "items", "results", "data", "records", "candidates", "ranked", "ranking"]) {
      const value = payload[key];
      if (Array.isArray(value)) return value.filter(isObject);
    }
    for (const value of Object.values(payload)) {
      if (Array.isArray(value) && value.some(isObject)) return value.filter(isObject);
    }
  }
  return [];
}

export function isObject(value: unknown): value is Record$ {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

const ID_KEYS = ["design_id", "designId", "scenario_id", "scenarioId", "id", "_id", "name", "label", "code"];

export function entityId(record: Record$): string {
  for (const key of ID_KEYS) {
    const value = record[key];
    if (typeof value === "string" || typeof value === "number") return String(value);
  }
  const first = Object.values(record).find((v) => typeof v === "string" || typeof v === "number");
  return first !== undefined ? String(first) : "";
}

export function entityLabel(record: Record$): string {
  const id = entityId(record);
  const extras = ["location", "location_name", "city", "season", "material", "climate"]
    .map((key) => record[key])
    .filter((v) => typeof v === "string" && v.length) as string[];
  return extras.length ? `${id} — ${extras.slice(0, 2).join(", ")}` : id;
}

/** Flattens nested objects one level deep into dotted keys for tables/cards. */
export function flatten(record: Record$, prefix = ""): Record$ {
  const out: Record$ = {};
  for (const [key, value] of Object.entries(record)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (isObject(value)) Object.assign(out, flatten(value, path));
    else out[path] = value;
  }
  return out;
}

export function numericEntries(record: Record$): Array<[string, number]> {
  return Object.entries(flatten(record)).filter(
    (entry): entry is [string, number] => typeof entry[1] === "number" && Number.isFinite(entry[1]),
  );
}

export function labelOf(path: string): string {
  return path.split(".").map(humanize).join(" · ");
}
