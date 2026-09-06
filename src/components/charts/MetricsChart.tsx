import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { formatNumber, labelOf } from "@/lib/fields";

const axisStyle = { fill: "oklch(0.66 0.02 230)", fontSize: 11 };
const gridColor = "oklch(0.32 0.02 235)";

const tooltipStyle = {
  backgroundColor: "oklch(0.22 0.02 240)",
  border: "1px solid oklch(0.34 0.02 235)",
  borderRadius: 8,
  color: "oklch(0.95 0.01 240)",
  fontSize: 12,
} as const;

export function SingleMetricsChart({
  title,
  data,
}: {
  title: string;
  data: Array<[string, number]>;
}) {
  const chartData = data.map(([key, value]) => ({ name: labelOf(key), value }));
  return (
    <figure className="rounded-lg border border-border bg-card p-4">
      <figcaption className="mb-4 text-sm font-semibold text-foreground">{title}</figcaption>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical" margin={{ left: 24, right: 24 }}>
            <CartesianGrid stroke={gridColor} horizontal={false} />
            <XAxis type="number" tick={axisStyle} stroke={gridColor} />
            <YAxis type="category" dataKey="name" width={190} tick={axisStyle} stroke={gridColor} />
            <Tooltip
              contentStyle={tooltipStyle}
              formatter={(value: number) => formatNumber(value)}
              cursor={{ fill: "oklch(0.30 0.02 235 / 0.4)" }}
            />
            <Bar dataKey="value" radius={[0, 3, 3, 0]} fill="oklch(0.72 0.12 200)">
              {chartData.map((entry) => (
                <Cell key={entry.name} fill="oklch(0.72 0.12 200)" />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </figure>
  );
}

export function ComparisonChart({
  title,
  data,
  seriesA,
  seriesB,
}: {
  title: string;
  data: Array<{ name: string; a: number; b: number }>;
  seriesA: string;
  seriesB: string;
}) {
  return (
    <figure className="rounded-lg border border-border bg-card p-4">
      <figcaption className="mb-4 text-sm font-semibold text-foreground">{title}</figcaption>
      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 24, right: 24 }}>
            <CartesianGrid stroke={gridColor} horizontal={false} />
            <XAxis type="number" tick={axisStyle} stroke={gridColor} />
            <YAxis type="category" dataKey="name" width={190} tick={axisStyle} stroke={gridColor} />
            <Tooltip contentStyle={tooltipStyle} formatter={(value: number) => formatNumber(value)} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="a" name={seriesA} fill="oklch(0.68 0.13 245)" radius={[0, 3, 3, 0]} />
            <Bar dataKey="b" name={seriesB} fill="oklch(0.75 0.12 190)" radius={[0, 3, 3, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </figure>
  );
}

export function RankChart({
  title,
  data,
  valueLabel,
}: {
  title: string;
  data: Array<{ name: string; value: number }>;
  valueLabel: string;
}) {
  return (
    <figure className="rounded-lg border border-border bg-card p-4">
      <figcaption className="mb-4 text-sm font-semibold text-foreground">{title}</figcaption>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ left: 8, right: 16 }}>
            <CartesianGrid stroke={gridColor} vertical={false} />
            <XAxis dataKey="name" tick={axisStyle} stroke={gridColor} interval={0} angle={-25} height={60} dy={12} />
            <YAxis tick={axisStyle} stroke={gridColor} />
            <Tooltip contentStyle={tooltipStyle} formatter={(value: number) => [formatNumber(value), valueLabel]} />
            <Bar dataKey="value" name={valueLabel} radius={[3, 3, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={entry.name} fill={index === 0 ? "oklch(0.78 0.14 185)" : "oklch(0.55 0.07 240)"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </figure>
  );
}
