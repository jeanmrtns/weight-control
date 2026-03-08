"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircleIcon, UserIcon, BarChart3Icon } from "@/components/icons";
import { useTranslation } from "@/contexts/locale-context";

type PersonRow = {
  id: string;
  name: string;
  height: number;
  targetWeight: number | null;
  _count: { weightEntries: number };
};

type PeopleContentProps = {
  people: PersonRow[];
};

export function PeopleContent({ people }: PeopleContentProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t("people.title")}</h1>
        <Button asChild>
          <Link href="/people/new">
            <PlusCircleIcon className="mr-2 h-4 w-4" />
            {t("people.newPerson")}
          </Link>
        </Button>
      </div>

      {people.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <UserIcon className="h-12 w-12 text-muted-foreground" />
            <p className="mt-2 text-muted-foreground">{t("people.noPeople")}</p>
            <Button asChild className="mt-4">
              <Link href="/people/new">{t("people.registerFirst")}</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {people.map((person) => (
            <Card key={person.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-base">{person.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  {t("people.heightLabel")}: {Number(person.height)} cm
                  {person.targetWeight != null &&
                    ` • ${t("people.goalLabel")}: ${Number(person.targetWeight)} kg`}
                </p>
                <p className="text-xs text-muted-foreground">
                  {person._count.weightEntries} {t("people.weightRecords")}
                </p>
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/people/${person.id}`}>{t("common.seeDetails")}</Link>
                  </Button>
                  <Button variant="secondary" size="sm" asChild>
                    <Link href={`/people/${person.id}/dashboard`}>
                      <BarChart3Icon className="mr-1 h-3 w-3" />
                      {t("people.dashboard")}
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
