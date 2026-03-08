"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { PersonForm } from "@/components/person-form";
import type { PersonFormData } from "@/components/person-form";
import { useTranslation } from "@/contexts/locale-context";
import { Skeleton } from "@/components/ui/skeleton";

export default function EditPersonPage() {
  const router = useRouter();
  const params = useParams();
  const { t } = useTranslation();
  const id = params.id as string;
  const [initial, setInitial] = useState<Partial<PersonFormData> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/people/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) {
          router.replace("/people");
          return;
        }
        setInitial({
          name: data.name,
          birthDate: data.birthDate?.slice(0, 10),
          height: String(data.height),
          gender: data.gender || "",
          targetWeight: data.targetWeight != null ? String(data.targetWeight) : "",
        });
      })
      .catch(() => router.replace("/people"))
      .finally(() => setLoading(false));
  }, [id, router]);

  const handleSubmit = async (data: PersonFormData) => {
    try {
      const res = await fetch(`/api/people/${id}`, {
        method: "PUT",
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
      toast.success(t("toast.personUpdated"));
      router.push(`/people/${id}`);
      router.refresh();
    } catch {
      toast.error(t("toast.tryAgain"));
      throw new Error(t("errors.updatePerson"));
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-md space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-[400px] w-full rounded-xl" />
      </div>
    );
  }
  if (!initial) return null;

  return (
    <div className="mx-auto max-w-md space-y-6">
      <h1 className="text-2xl font-bold">{t("people.editPerson")}</h1>
      <PersonForm
        initialData={initial}
        onSubmit={handleSubmit}
        onCancel={() => router.back()}
        submitLabel={t("common.saveChanges")}
      />
    </div>
  );
}
