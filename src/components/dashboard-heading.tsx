"use client";

import { useTranslation } from "@/contexts/locale-context";

export function DashboardHeading({ personName }: { personName: string }) {
  const { t } = useTranslation();
  return (
    <h1 className="text-2xl font-bold truncate">
      {t("people.dashboard")} — {personName}
    </h1>
  );
}
