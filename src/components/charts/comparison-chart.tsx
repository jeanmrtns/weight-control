"use client";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Line, LineChart, XAxis, YAxis, CartesianGrid, Legend } from "recharts";
import { useTranslation } from "@/contexts/locale-context";

export type ComparisonSeries = {
  name: string;
  color: string;
  dataKey: string;
};

export type ComparisonDataPoint = Record<string, string | number>;

type ComparisonChartProps = {
  data: ComparisonDataPoint[];
  series: ComparisonSeries[];
  className?: string;
};

export function ComparisonChart({ data, series, className }: ComparisonChartProps) {
  const { t } = useTranslation();

  if (data.length === 0) {
    return (
      <div className="flex h-[300px] items-center justify-center rounded-lg border border-dashed text-muted-foreground">
        {t("dashboard.noDataToCompare")}
      </div>
    );
  }

  const chartConfig: ChartConfig = {
    date: { label: "Data" },
    ...Object.fromEntries(
      series.map((s) => [s.dataKey, { label: s.name, color: s.color }])
    ),
  };

  return (
    <ChartContainer config={chartConfig} className={className ?? "min-h-[300px] w-full"}>
      <LineChart data={data} margin={{ left: 12, right: 12 }}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis
          dataKey="date"
          tickFormatter={(v) => {
            const d = new Date(v);
            return `${d.getDate()}/${d.getMonth() + 1}`;
          }}
        />
        <YAxis domain={["auto", "auto"]} tickFormatter={(v) => `${v} kg`} />
        <ChartTooltip
          content={
            <ChartTooltipContent
              formatter={(value) => [`${value} kg`, t("common.weight")]}
              labelFormatter={(_, payload) => {
                const p = payload?.[0]?.payload as ComparisonDataPoint | undefined;
                const d = p?.date;
                return d ? new Date(String(d)).toLocaleDateString("pt-BR") : "";
              }}
            />
          }
        />
        <Legend />
        {series.map((s) => (
          <Line
            key={s.dataKey}
            type="monotone"
            dataKey={s.dataKey}
            name={s.name}
            stroke={s.color}
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
          />
        ))}
      </LineChart>
    </ChartContainer>
  );
}
