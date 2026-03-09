"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { IMCTooltip } from "@/components/imc-tooltip";
import { TextTooltip } from "@/components/text-tooltip";
import { getBMIClassification } from "@/lib/bmi";
import { bmiCategoryVariants } from "@/components/bmi-badge";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/contexts/locale-context";
import { WeightLineChart } from "@/components/charts/weight-line-chart";
import { WeightHistoryTable } from "@/components/weight-history-table";

type IndividualDashboardProps = {
  personId: string;
  personName: string;
  entries: { date: string; weight: number }[];
  heightCm: number;
  currentWeight?: number;
  firstWeight?: number;
  targetWeight?: number;
  bmi?: number;
  trend: "up" | "down" | "stable";
};

export function IndividualDashboard({
  personId,
  personName,
  entries,
  heightCm,
  currentWeight,
  firstWeight,
  targetWeight,
  bmi,
  trend,
}: IndividualDashboardProps) {
  const { t } = useTranslation();
  const variation =
    currentWeight != null && firstWeight != null && firstWeight > 0
      ? currentWeight - firstWeight
      : null;
  const variationPct =
    variation != null && firstWeight != null && firstWeight > 0
      ? ((variation / firstWeight) * 100).toFixed(1)
      : null;

  const bmiClassification = bmi != null ? getBMIClassification(bmi) : null;

  const trendLabel =
    trend === "up"
      ? t("individual.trendUp")
      : trend === "down"
        ? t("individual.trendDown")
        : t("individual.trendStable");

  return (
    <div className="min-w-0 space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {currentWeight != null && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {t("individual.currentWeight")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{currentWeight} kg</p>
            </CardContent>
          </Card>
        )}
        {firstWeight != null && currentWeight != null && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                <TextTooltip
                  content={t("individual.variationTooltip")}
                  triggerIcon
                >
                  <span>{t("individual.variation")}</span>
                </TextTooltip>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {variation != null && variation >= 0 ? "+" : ""}
                {variation?.toFixed(1)} kg
              </p>
              {variationPct != null && (
                <p className="text-sm text-muted-foreground">
                  ({variationPct}%)
                </p>
              )}
            </CardContent>
          </Card>
        )}
        {targetWeight != null && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Peso meta
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{targetWeight} kg</p>
              {currentWeight != null && currentWeight > targetWeight && (
                <p className="text-sm text-amber-600 dark:text-amber-400">
                  Acima da meta em {(currentWeight - targetWeight).toFixed(1)} kg
                </p>
              )}
            </CardContent>
          </Card>
        )}
        {bmi != null && bmiClassification && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                <IMCTooltip triggerIcon>IMC</IMCTooltip>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-2xl font-bold">{bmi}</span>
                <Badge
                  variant="secondary"
                  className={cn("font-medium", bmiCategoryVariants[bmiClassification.category])}
                >
                  {t(`bmi.${bmiClassification.category}`)}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                {t(
                  {
                    underweight: "bmi.belowRecommended",
                    normal: "bmi.healthyRange",
                    overweight: "bmi.aboveIdeal",
                    obesity1: "bmi.seeDoctor",
                    obesity2: "bmi.consultProfessional",
                    obesity3: "bmi.specializedCare",
                  }[bmiClassification.category] ?? ""
                )}
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {trend !== "stable" && (
        <Card className="border-amber-200 dark:border-amber-900">
          <CardContent className="flex items-center gap-2 pt-4">
            <Badge variant="secondary">
              {trend === "up" ? "↑" : "↓"} {trendLabel}
            </Badge>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>{t("individual.weightEvolution")}</CardTitle>
        </CardHeader>
        <CardContent className="min-w-0">
          <WeightLineChart data={entries} className="min-h-[320px]" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("individual.history")}</CardTitle>
        </CardHeader>
        <CardContent className="min-w-0 overflow-x-auto">
          <WeightHistoryTable personId={personId} showNote={false} />
        </CardContent>
      </Card>
    </div>
  );
}
