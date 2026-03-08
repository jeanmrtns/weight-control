"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { TrashIcon } from "@/components/icons";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/contexts/locale-context";

type DeletePersonDialogProps = {
  personId: string;
  personName: string;
  className?: string;
};

export function DeletePersonDialog({
  personId,
  personName,
  className,
}: DeletePersonDialogProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/people/${personId}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? t("errors.deletePerson"));
      }
      toast.success(t("toast.personDeleted"));
      router.push("/people");
      router.refresh();
    } catch (e) {
      console.error(e);
      toast.error(t("toast.tryAgain"));
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className={cn("text-destructive hover:bg-destructive/10 hover:text-destructive", className)}
        onClick={() => setOpen(true)}
      >
        <        TrashIcon className="mr-1 h-4 w-4" />
        {t("common.delete")}
      </Button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-person-title"
          aria-describedby="delete-person-desc"
        >
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => !loading && setOpen(false)}
            aria-hidden
          />
          <div className="relative z-10 w-full max-w-md rounded-xl border border-border bg-background p-4 shadow-xl">
            <h2 id="delete-person-title" className="text-lg font-semibold text-foreground">
              {t("deletePerson.title")}
            </h2>
            <p id="delete-person-desc" className="mt-2 text-sm text-muted-foreground">
              {t("deletePerson.confirm")} <strong className="text-foreground">{personName}</strong>?
              {t("deletePerson.warning")}
            </p>
            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => !loading && setOpen(false)}
                disabled={loading}
              >
                {t("common.cancel")}
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                disabled={loading}
              >
                {loading ? t("common.deleting") : t("common.delete")}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
