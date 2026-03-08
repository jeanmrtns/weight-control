"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslation } from "@/contexts/locale-context";

type WeightEntry = {
  id: string;
  weight: number;
  date: string;
  note: string | null;
};

type WeightHistoryTableProps = {
  personId: string;
  limit?: number;
  /** Se true, mostra coluna de observação */
  showNote?: boolean;
};

export function WeightHistoryTable({
  personId,
  limit = 10,
  showNote = true,
}: WeightHistoryTableProps) {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [data, setData] = useState<{
    entries: WeightEntry[];
    total: number;
    page: number;
    totalPages: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(
      `/api/weight?personId=${encodeURIComponent(personId)}&page=${page}&limit=${limit}`
    )
      .then((res) => res.json())
      .then((json) => {
        if (json.error) throw new Error(json.error);
        setData({
          entries: json.entries,
          total: json.total,
          page: json.page,
          totalPages: json.totalPages,
        });
      })
      .catch(() => {
        toast.error(t("toast.tryAgain"));
        setData({ entries: [], total: 0, page: 1, totalPages: 0 });
      })
      .finally(() => setLoading(false));
  }, [personId, page, limit]);

  if (loading && !data) {
    return (
      <div className="space-y-3">
        <div className="flex gap-4 border-b pb-3">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-16" />
          {showNote && <Skeleton className="h-4 w-24" />}
        </div>
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex gap-4 py-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-12" />
            {showNote && <Skeleton className="h-4 w-32" />}
          </div>
        ))}
      </div>
    );
  }

  if (!data || data.entries.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        {t("weightHistory.noEntries")}{" "}
        <Link href={`/weight?personId=${personId}`} className="text-primary underline">
          {t("weightHistory.registerFirst")}
        </Link>
      </p>
    );
  }

  return (
    <div className="space-y-3">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("weightHistory.date")}</TableHead>
            <TableHead>{t("weightHistory.weight")}</TableHead>
            {showNote && <TableHead>{t("weightHistory.note")}</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.entries.map((e) => (
            <TableRow key={e.id}>
              <TableCell>
                {new Date(e.date).toLocaleDateString("pt-BR")}
              </TableCell>
              <TableCell>{e.weight}</TableCell>
              {showNote && (
                <TableCell className="text-muted-foreground">
                  {e.note || "—"}
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {data.totalPages > 1 && (
        <div className="flex flex-wrap items-center justify-between gap-2 border-t pt-3">
          <p className="text-sm text-muted-foreground">
            {data.total} {t("weightHistory.recordsPage")} {data.page} {t("weightHistory.pageOf")} {data.totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1 || loading}
            >
              {t("common.previous")}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
              disabled={page >= data.totalPages || loading}
            >
              {t("common.next")}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
