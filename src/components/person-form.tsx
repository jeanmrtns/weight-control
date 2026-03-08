"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/contexts/locale-context";

export type PersonFormData = {
  name: string;
  birthDate: string;
  height: string;
  gender: string;
  targetWeight: string;
};

const defaultData: PersonFormData = {
  name: "",
  birthDate: "",
  height: "",
  gender: "",
  targetWeight: "",
};

type PersonFormProps = {
  initialData?: Partial<PersonFormData>;
  onSubmit: (data: PersonFormData) => void | Promise<void>;
  onCancel?: () => void;
  submitLabel?: string;
};

export function PersonForm({
  initialData,
  onSubmit,
  onCancel,
  submitLabel,
}: PersonFormProps) {
  const { t } = useTranslation();
  const [data, setData] = useState<PersonFormData>({
    ...defaultData,
    ...initialData,
    birthDate: initialData?.birthDate?.slice(0, 10) ?? "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>{t("personForm.title")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">{t("personForm.name")}</Label>
            <Input
              id="name"
              value={data.name}
              onChange={(e) => setData((d) => ({ ...d, name: e.target.value }))}
              required
              placeholder={t("personForm.namePlaceholder")}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="birthDate">{t("personForm.birthDate")}</Label>
            <Input
              id="birthDate"
              type="date"
              value={data.birthDate}
              onChange={(e) => setData((d) => ({ ...d, birthDate: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="height">{t("personForm.height")}</Label>
            <Input
              id="height"
              type="number"
              min={50}
              max={250}
              step={0.1}
              value={data.height}
              onChange={(e) => setData((d) => ({ ...d, height: e.target.value }))}
              required
              placeholder={t("personForm.heightPlaceholder")}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="gender">{t("personForm.gender")}</Label>
            <select
              id="gender"
              value={data.gender}
              onChange={(e) => setData((d) => ({ ...d, gender: e.target.value }))}
              className={cn(
                "flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm",
                "focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring",
                "disabled:opacity-50"
              )}
            >
              <option value="">{t("common.select")}</option>
              <option value="male">{t("personForm.genderMale")}</option>
              <option value="female">{t("personForm.genderFemale")}</option>
              <option value="other">{t("personForm.genderOther")}</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="targetWeight">{t("personForm.targetWeight")}</Label>
            <Input
              id="targetWeight"
              type="number"
              min={20}
              max={300}
              step={0.1}
              value={data.targetWeight}
              onChange={(e) => setData((d) => ({ ...d, targetWeight: e.target.value }))}
              placeholder={t("personForm.targetWeightPlaceholder")}
            />
          </div>
          <div className="flex gap-2 pt-2">
            <Button type="submit" disabled={loading}>
              {loading ? t("common.registering") : (submitLabel ?? t("common.save"))}
            </Button>
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                {t("common.cancel")}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
