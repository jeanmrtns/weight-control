"use client";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Line, LineChart, XAxis, YAxis, CartesianGrid } from "recharts";

export type WeightDataPoint = {
  date: string;
  weight: number;
};

const chartConfig = {
  date: {
    label: "Data",
  },
  weight: {
    label: "Peso (kg)",
    color: "var(--color-chart-1)",
  },
} satisfies ChartConfig;

type WeightLineChartProps = {
  data: WeightDataPoint[];
  className?: string;
};

export function WeightLineChart({ data, className }: WeightLineChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex h-[300px] items-center justify-center rounded-lg border border-dashed text-muted-foreground">
        Nenhum registro de peso para exibir.
      </div>
    );
  }

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
              formatter={(value) => [`${value} kg`, "Peso"]}
              labelFormatter={(_, payload) => {
                const p = payload?.[0]?.payload as WeightDataPoint | undefined;
                return p ? new Date(p.date).toLocaleDateString("pt-BR") : "";
              }}
            />
          }
        />
        <Line
          type="monotone"
          dataKey="weight"
          stroke="var(--color-chart-1)"
          strokeWidth={2}
          dot={{ r: 4 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ChartContainer>
  );
}
