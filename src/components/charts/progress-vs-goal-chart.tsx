"use client";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Bar, BarChart, XAxis, YAxis, CartesianGrid } from "recharts";
import { useTranslation } from "@/contexts/locale-context";

export type ProgressRow = {
  name: string;
  kgPerdidos: number;
};

type ProgressVsGoalChartProps = {
  data: ProgressRow[];
  className?: string;
};

export function ProgressVsGoalChart({ data, className }: ProgressVsGoalChartProps) {
  const { t } = useTranslation();

  if (data.length === 0) {
    return (
      <div className="flex h-[300px] items-center justify-center rounded-lg border border-dashed text-muted-foreground">
        {t("dashboard.selectPeopleProgress")}
      </div>
    );
  }

  const chartConfigI18n = {
    name: { label: t("dashboard.person") },
    kgPerdidos: {
      label: t("dashboard.chartKgLost"),
      color: "var(--chart-1)",
    },
  };

  return (
    <ChartContainer config={chartConfigI18n} className={className ?? "min-h-[300px] w-full"}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ left: 12, right: 12 }}
      >
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" horizontal={false} />
        <XAxis type="number" tickFormatter={(v) => `${v} kg`} />
        <YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 12 }} />
        <ChartTooltip
          content={
            <ChartTooltipContent
              formatter={(value) => [
                Number(value).toFixed(2),
                t("dashboard.chartKgLostTooltip"),
              ]}
              labelFormatter={(label) => label}
            />
          }
        />
        <Bar
          dataKey="kgPerdidos"
          name="Kg perdidos"
          fill="var(--chart-1)"
          radius={[0, 4, 4, 0]}
        />
      </BarChart>
    </ChartContainer>
  );
}
