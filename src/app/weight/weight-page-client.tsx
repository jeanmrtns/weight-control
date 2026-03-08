"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { WeightEntryForm } from "@/components/weight-entry-form";
import { useTranslation } from "@/contexts/locale-context";

type PersonOption = { id: string; name: string };

export function WeightPageClient({ people }: { people: PersonOption[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useTranslation();
  const defaultPersonId = searchParams.get("personId") ?? undefined;
  const defaultDate = new Date().toISOString().slice(0, 10);

  const handleSubmit = async (data: {
    personId: string;
    weight: number;
    date: string;
    note?: string;
  }) => {
    try {
      const res = await fetch("/api/weight", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        toast.error(err.error || t("toast.tryAgain"));
        return;
      }
      toast.success(t("toast.weightRegistered"));
      router.push(`/people/${data.personId}`);
      router.refresh();
    } catch {
      toast.error(t("toast.tryAgain"));
      throw new Error(t("errors.registerWeight"));
    }
  };

  return (
    <WeightEntryForm
      people={people}
      defaultPersonId={defaultPersonId}
      defaultDate={defaultDate}
      onSubmit={handleSubmit}
    />
  );
}
