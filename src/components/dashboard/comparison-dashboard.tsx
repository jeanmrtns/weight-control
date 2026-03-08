"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IMCTooltip } from "@/components/imc-tooltip";
import { TextTooltip } from "@/components/text-tooltip";
import { bmiCategoryVariants } from "@/components/bmi-badge";
import { ComparisonChart } from "@/components/charts/comparison-chart";
import { ProgressVsGoalChart } from "@/components/charts/progress-vs-goal-chart";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { calculateBMI, getWeightTrend } from "@/lib/bmi";
import { getBMIClassification } from "@/lib/bmi";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/contexts/locale-context";

const CHART_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

type PersonWithEntries = {
  id: string;
  name: string;
  height: number;
  targetWeight: number | null;
  weightEntries: { date: string; weight: number }[];
};

type ChartView = "weight" | "progress";

export function ComparisonDashboard({
  people,
}: {
  people: PersonWithEntries[];
}) {
  const { t } = useTranslation();
  const [selectedIds, setSelectedIds] = useState<string[]>(
    people.slice(0, 3).map((p) => p.id)
  );
  const [chartView, setChartView] = useState<ChartView>("weight");

  const chartData = useMemo(() => {
    const allDates = new Set<string>();
    people.forEach((p) =>
      p.weightEntries.forEach((e) => allDates.add(e.date))
    );
    const sortedDates = Array.from(allDates).sort();
    const byDate: Record<string, Record<string, string | number>> = {};
    sortedDates.forEach((d) => {
      byDate[d] = { date: d };
    });
    people.forEach((p) => {
      const key = `w_${p.id}`;
      p.weightEntries.forEach((e) => {
        const d = new Date(e.date).toISOString().slice(0, 10);
        if (byDate[d]) byDate[d][key] = Number(e.weight);
      });
    });
    return Object.values(byDate).map((row) => {
      const out: Record<string, string | number> = { date: row.date };
      selectedIds.forEach((id) => {
        const key = `w_${id}`;
        if (row[key] != null) out[key] = row[key];
      });
      return out;
    });
  }, [people, selectedIds]);

  const series = useMemo(
    () =>
      selectedIds.map((id, i) => {
        const p = people.find((x) => x.id === id);
        return {
          name: p?.name ?? "",
          dataKey: `w_${id}`,
          color: CHART_COLORS[i % CHART_COLORS.length],
        };
      }),
    [people, selectedIds]
  );

  const togglePerson = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const summary = useMemo(() => {
    return people.map((p) => {
      const height = Number(p.height);
      const entries = p.weightEntries.map((e) => Number(e.weight));
      const currentWeight = entries.length > 0 ? entries[entries.length - 1] : null;
      const firstWeight = entries.length > 0 ? entries[0] : null;
      const bmi = currentWeight && height ? calculateBMI(currentWeight, height) : null;
      const trend = getWeightTrend(entries, 3);
      const classification = bmi != null ? getBMIClassification(bmi) : null;
      const variation =
        currentWeight != null && firstWeight != null && firstWeight > 0
          ? ((currentWeight - firstWeight) / firstWeight) * 100
          : null;
      const kgPerdidos =
        firstWeight != null && currentWeight != null ? firstWeight - currentWeight : null;
      const targetWeight = p.targetWeight;
      const kgToGoal =
        currentWeight != null && targetWeight != null ? currentWeight - targetWeight : null;
      const totalToLose =
        firstWeight != null && targetWeight != null ? firstWeight - targetWeight : null;
      const pctToGoal =
        kgPerdidos != null && totalToLose != null && totalToLose > 0
          ? (kgPerdidos / totalToLose) * 100
          : null;
      return {
        id: p.id,
        name: p.name,
        firstWeight,
        currentWeight,
        targetWeight,
        bmi,
        trend,
        classification,
        variation,
        kgPerdidos,
        kgToGoal,
        pctToGoal,
      };
    });
  }, [people]);

  const progressChartData = useMemo(() => {
    return summary
      .filter((s) => selectedIds.includes(s.id) && s.kgPerdidos != null)
      .map((s) => ({
        name: s.name,
        kgPerdidos: s.kgPerdidos!,
      }));
  }, [summary, selectedIds]);

  return (
    <div className="min-w-0 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t("dashboard.selectPeople")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {people.map((p) => (
              <Badge
                key={p.id}
                variant={selectedIds.includes(p.id) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => togglePerson(p.id)}
              >
                {p.name}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <CardTitle>
              {chartView === "weight"
                ? t("dashboard.chartWeightTime")
                : t("dashboard.chartProgressGoal")}
            </CardTitle>
            <div className="flex rounded-lg border border-border p-0.5">
              <Button
                variant={chartView === "weight" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setChartView("weight")}
              >
                {t("dashboard.tabWeightTime")}
              </Button>
              <Button
                variant={chartView === "progress" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setChartView("progress")}
              >
                {t("dashboard.tabProgressGoal")}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="min-w-0">
          {chartView === "weight" ? (
            <ComparisonChart
              data={chartData}
              series={series.filter((s) => s.name)}
              className="min-h-[320px]"
            />
          ) : (
            <>
              <ProgressVsGoalChart data={progressChartData} className="min-h-[280px]" />
              <p className="mt-2 text-xs text-muted-foreground">
                {t("dashboard.progressChartHint")}
              </p>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("dashboard.summaryByPerson")}</CardTitle>
        </CardHeader>
        <CardContent className="min-w-0 overflow-x-auto">
          <Table className="w-full min-w-[800px]">
            <TableHeader>
              <TableRow>
                <TableHead>{t("dashboard.person")}</TableHead>
                <TableHead>{t("dashboard.initialWeight")}</TableHead>
                <TableHead>{t("dashboard.currentWeight")}</TableHead>
                <TableHead>{t("common.goal")}</TableHead>
                <TableHead>{t("dashboard.kgLost")}</TableHead>
                <TableHead>{t("dashboard.remainingToGoal")}</TableHead>
                <TableHead>{t("dashboard.pctToGoal")}</TableHead>
                <TableHead>
                  <IMCTooltip triggerIcon>IMC</IMCTooltip>
                </TableHead>
                <TableHead>{t("dashboard.classification")}</TableHead>
                <TableHead>
                  <TextTooltip
                    content={t("dashboard.trendTooltip")}
                    triggerIcon
                  >
                    <span>{t("dashboard.trend")}</span>
                  </TextTooltip>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {summary.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="font-medium">{s.name}</TableCell>
                  <TableCell>
                    {s.firstWeight != null ? `${s.firstWeight} kg` : "—"}
                  </TableCell>
                  <TableCell>
                    {s.currentWeight != null ? `${s.currentWeight} kg` : "—"}
                  </TableCell>
                  <TableCell>
                    {s.targetWeight != null ? `${s.targetWeight} kg` : "—"}
                  </TableCell>
                  <TableCell>
                    {s.kgPerdidos != null ? (
                      <span
                        className={cn(
                          s.kgPerdidos > 0 && "text-green-600 dark:text-green-400",
                          s.kgPerdidos < 0 && "text-amber-600 dark:text-amber-400"
                        )}
                      >
                        {s.kgPerdidos.toFixed(1)} kg
                      </span>
                    ) : (
                      "—"
                    )}
                  </TableCell>
                  <TableCell>
                    {s.kgToGoal != null ? (
                      <span className={cn(s.kgToGoal > 0 && "text-amber-600 dark:text-amber-400")}>
                        {s.kgToGoal.toFixed(1)} kg
                      </span>
                    ) : (
                      "—"
                    )}
                  </TableCell>
                  <TableCell>
                    {s.pctToGoal != null ? `${s.pctToGoal.toFixed(0)}%` : "—"}
                  </TableCell>
                  <TableCell>{s.bmi ?? "—"}</TableCell>
                  <TableCell>
                    {s.classification ? (
                      <Badge
                        variant="secondary"
                        className={cn("font-medium", bmiCategoryVariants[s.classification.category])}
                      >
                        {t(`bmi.${s.classification.category}`)}
                      </Badge>
                    ) : (
                      "—"
                    )}
                  </TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        s.trend === "up" && "text-amber-600",
                        s.trend === "down" && "text-green-600"
                      )}
                    >
                      {s.trend === "up"
                        ? t("dashboard.trendUp")
                        : s.trend === "down"
                          ? t("dashboard.trendDown")
                          : t("dashboard.trendStable")}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

