"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { PersonForm } from "@/components/person-form";
import type { PersonFormData } from "@/components/person-form";
import { useTranslation } from "@/contexts/locale-context";

export default function NewPersonPage() {
  const router = useRouter();
  const { t } = useTranslation();

  const handleSubmit = async (data: PersonFormData) => {
    try {
      const res = await fetch("/api/people", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          birthDate: data.birthDate || null,
          height: parseFloat(data.height),
          gender: data.gender || null,
          targetWeight: data.targetWeight ? parseFloat(data.targetWeight) : null,
        }),
      });
      if (!res.ok) {
        toast.error(t("toast.tryAgain"));
        return;
      }
      const person = await res.json();
      toast.success(t("toast.personCreated"));
      router.push(`/people/${person.id}`);
      router.refresh();
    } catch {
      toast.error(t("toast.tryAgain"));
      throw new Error(t("errors.createPerson"));
    }
  };

  return (
    <div className="mx-auto max-w-md space-y-6">
      <h1 className="text-2xl font-bold">{t("people.newPerson")}</h1>
      <PersonForm onSubmit={handleSubmit} onCancel={() => router.back()} />
    </div>
  );
}
