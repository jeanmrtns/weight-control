"use client";

import { useTranslation } from "@/contexts/locale-context";
import { ComparisonDashboard } from "@/components/dashboard/comparison-dashboard";

type PersonWithEntries = {
  id: string;
  name: string;
  height: number;
  targetWeight: number | null;
  weightEntries: { date: string; weight: number }[];
};

export function DashboardPageContent({
  people,
}: {
  people: PersonWithEntries[];
}) {
  const { t } = useTranslation();

  return (
    <div className="min-w-0 space-y-6">
      <h1 className="text-2xl font-bold">{t("dashboard.title")}</h1>
      <ComparisonDashboard people={people} />
    </div>
  );
}
