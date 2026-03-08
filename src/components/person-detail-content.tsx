"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BMIBadge } from "@/components/bmi-badge";
import { WeightHistoryTable } from "@/components/weight-history-table";
import { PencilIcon, BarChart3Icon, PlusCircleIcon } from "@/components/icons";
import { DeletePersonDialog } from "@/components/delete-person-dialog";
import { useTranslation } from "@/contexts/locale-context";

type PersonDetailContentProps = {
  id: string;
  name: string;
  height: number;
  targetWeight: number | null;
  birthDate: string | null;
  lastWeight: number | null;
  lastWeightDate: string | null;
  bmi: number | null;
};

export function PersonDetailContent({
  id,
  name,
  height,
  targetWeight,
  birthDate,
  lastWeight,
  lastWeightDate,
  bmi,
}: PersonDetailContentProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-2xl font-bold">{name}</h1>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/people/${id}/edit`}>
              <PencilIcon className="mr-1 h-4 w-4" />
              {t("person.edit")}
            </Link>
          </Button>
          <Button size="sm" asChild>
            <Link href={`/people/${id}/dashboard`}>
              <BarChart3Icon className="mr-1 h-4 w-4" />
              {t("people.dashboard")}
            </Link>
          </Button>
          <Button size="sm" asChild>
            <Link href={`/weight?personId=${id}`}>
              <PlusCircleIcon className="mr-1 h-4 w-4" />
              {t("person.registerWeight")}
            </Link>
          </Button>
          <DeletePersonDialog personId={id} personName={name} />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t("person.details")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>{t("common.height")}: {height} cm</p>
            {targetWeight != null && (
              <p>{t("person.goalWeight")}: {targetWeight} kg</p>
            )}
            {birthDate && (
              <p>
                {t("person.birthDate")}: {new Date(birthDate).toLocaleDateString()}
              </p>
            )}
            {bmi != null && (
              <BMIBadge bmi={bmi} showDescription />
            )}
          </CardContent>
        </Card>
        {lastWeight != null && (
          <Card>
            <CardHeader>
              <CardTitle>{t("person.currentWeight")}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{lastWeight} kg</p>
              <p className="text-sm text-muted-foreground">
                {lastWeightDate ? new Date(lastWeightDate).toLocaleDateString() : ""}
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("person.weightHistory")}</CardTitle>
        </CardHeader>
        <CardContent>
          <WeightHistoryTable personId={id} showNote />
        </CardContent>
      </Card>
    </div>
  );
}
