import { prisma } from "@/lib/db";
import { WeightPageClient } from "./weight-page-client";
import { WeightPageTitle } from "@/components/weight-page-title";

export const dynamic = "force-dynamic";

export default async function WeightPage() {
  const people = await prisma.person.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  return (
    <div className="mx-auto max-w-md space-y-6">
      <WeightPageTitle />
      <WeightPageClient people={people} />
    </div>
  );
}
