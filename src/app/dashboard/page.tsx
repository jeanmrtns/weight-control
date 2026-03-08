import { prisma } from "@/lib/db";
import { DashboardPageContent } from "@/components/dashboard-page-content";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const people = await prisma.person.findMany({
    orderBy: { name: "asc" },
    include: {
      weightEntries: { orderBy: { date: "asc" } },
    },
  });

  const peopleSerialized = people.map((p) => ({
    id: p.id,
    name: p.name,
    height: Number(p.height),
    targetWeight: p.targetWeight != null ? Number(p.targetWeight) : null,
    weightEntries: p.weightEntries.map((e) => ({
      date: e.date.toISOString().slice(0, 10),
      weight: Number(e.weight),
    })),
  }));

  return <DashboardPageContent people={peopleSerialized} />;
}
