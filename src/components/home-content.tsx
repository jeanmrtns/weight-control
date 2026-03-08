"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UsersIcon, PlusCircleIcon, LayoutDashboardIcon } from "@/components/icons";
import { useTranslation } from "@/contexts/locale-context";

type HomeContentProps = {
  peopleCount: number;
  recentEntries: { id: string; weight: number; date: string; person: { name: string } }[];
};

export function HomeContent({ peopleCount, recentEntries }: HomeContentProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">{t("home.title")}</h1>
        <p className="text-muted-foreground">{t("home.subtitle")}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3 md:grid-rows-1">
        <Link href="/people" className="h-full">
          <Card className="flex h-full min-h-[120px] flex-col transition-colors hover:bg-muted/50">
            <CardHeader className="flex flex-row items-center gap-3">
              <UsersIcon className="h-5 w-5 shrink-0" />
              <span className="text-2xl font-bold tabular-nums">{peopleCount}</span>
              <div>
                <CardTitle className="text-base">{t("home.peopleCard")}</CardTitle>
                <p className="text-sm text-muted-foreground">{t("home.peopleCardSub")}</p>
              </div>
            </CardHeader>
          </Card>
        </Link>
        <Link href="/weight" className="h-full">
          <Card className="flex h-full min-h-[120px] flex-col transition-colors hover:bg-muted/50">
            <CardHeader className="flex flex-row items-center gap-2">
              <PlusCircleIcon className="h-5 w-5 shrink-0" />
              <CardTitle className="text-base">{t("home.registerWeightCard")}</CardTitle>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-sm text-muted-foreground">{t("home.registerWeightCardSub")}</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/dashboard" className="h-full">
          <Card className="flex h-full min-h-[120px] flex-col transition-colors hover:bg-muted/50">
            <CardHeader className="flex flex-row items-center gap-2">
              <LayoutDashboardIcon className="h-5 w-5 shrink-0" />
              <CardTitle className="text-base">{t("home.dashboardCard")}</CardTitle>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-sm text-muted-foreground">{t("home.dashboardCardSub")}</p>
            </CardContent>
          </Card>
        </Link>
      </div>

      {recentEntries.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>{t("home.recentEntries")}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {recentEntries.map((e) => (
                <li key={e.id} className="flex justify-between text-sm">
                  <span>{e.person.name}</span>
                  <span>
                    {Number(e.weight)} {t("home.kgOn")}{" "}
                    {new Date(e.date).toLocaleDateString()}
                  </span>
                </li>
              ))}
            </ul>
            <Button variant="link" className="mt-2 px-0" asChild>
              <Link href="/weight">{t("home.registerNewWeight")}</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
