"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/contexts/locale-context";

const LEVEL_IDS = [
  "underweight",
  "normal",
  "overweight",
  "obesity_1",
  "obesity_2",
  "obesity_3",
] as const;

const BADGE_CLASSES: Record<string, string> = {
  underweight: "bg-sky-500/20 text-sky-700 dark:text-sky-300",
  normal: "bg-green-500/20 text-green-700 dark:text-green-300",
  overweight: "bg-amber-500/20 text-amber-700 dark:text-amber-300",
  obesity_1: "bg-orange-500/20 text-orange-700 dark:text-orange-300",
  obesity_2: "bg-red-500/20 text-red-700 dark:text-red-300",
  obesity_3: "bg-red-700/30 text-red-800 dark:text-red-200",
};

function imcKey(id: string): string {
  return id.replace("_", "");
}

export function IMCPageContent() {
  const { t } = useTranslation();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">{t("imc.pageTitle")}</h1>
        <p className="mt-2 text-muted-foreground">{t("imc.pageIntro")}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {LEVEL_IDS.map((id) => {
          const key = imcKey(id);
          return (
            <Card key={id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-base">{t(`imc.${key}.label`)}</CardTitle>
                <Badge
                  variant="secondary"
                  className={cn("font-medium", BADGE_CLASSES[id])}
                >
                  {t(`imc.${key}.range`)}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  {t(`imc.${key}.description`)}
                </p>
                <p className="text-sm">
                  <span className="font-medium text-foreground">
                    {t("common.recommendations")}:{" "}
                  </span>
                  <span className="text-muted-foreground">
                    {t(`imc.${key}.recommendations`)}
                  </span>
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="border-muted">
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground">
            <strong>{t("imc.formula")}</strong> {t("imc.formulaDetail")}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
