"use client";

import { useTranslation } from "@/contexts/locale-context";

export function WeightPageTitle() {
  const { t } = useTranslation();
  return <h1 className="text-2xl font-bold">{t("weightForm.title")}</h1>;
}
