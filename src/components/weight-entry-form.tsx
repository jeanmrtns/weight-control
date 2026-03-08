"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeSelect } from "@/components/ui/theme-select";
import { useTranslation } from "@/contexts/locale-context";

type PersonOption = { id: string; name: string };

type WeightEntryFormProps = {
  people: PersonOption[];
  defaultPersonId?: string;
  defaultDate?: string;
  onSubmit: (data: { personId: string; weight: number; date: string; note?: string }) => void | Promise<void>;
  onCancel?: () => void;
};

export function WeightEntryForm({
  people,
  defaultPersonId,
  defaultDate,
  onSubmit,
  onCancel,
}: WeightEntryFormProps) {
  const { t } = useTranslation();
  const [personId, setPersonId] = useState(defaultPersonId || "");
  const [weight, setWeight] = useState("");
  const [date, setDate] = useState(defaultDate || new Date().toISOString().slice(0, 10));
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (defaultPersonId) setPersonId(defaultPersonId);
    if (defaultDate) setDate(defaultDate);
  }, [defaultPersonId, defaultDate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const w = parseFloat(weight);
    if (!personId || !weight || isNaN(w) || w <= 0) return;
    setLoading(true);
    try {
      await onSubmit({
        personId,
        weight: w,
        date,
        note: note.trim() || undefined,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>{t("weightForm.title")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="person">{t("weightForm.person")}</Label>
            <ThemeSelect
              id="person"
              value={personId}
              onChange={setPersonId}
              options={people.map((p) => ({ value: p.id, label: p.name }))}
              placeholder={t("weightForm.personPlaceholder")}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="date">{t("weightForm.date")}</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="weight">{t("weightForm.weight")}</Label>
            <Input
              id="weight"
              type="number"
              min={20}
              max={300}
              step={0.1}
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              required
              placeholder={t("weightForm.weightPlaceholder")}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="note">{t("weightForm.note")}</Label>
            <Input
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={t("weightForm.notePlaceholder")}
            />
          </div>
          <div className="flex gap-2 pt-2">
            <Button type="submit" disabled={loading || !personId || !weight}>
              {loading ? t("common.registering") : t("common.register")}
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
