import { prisma } from "@/lib/db";
import { HomeContent } from "@/components/home-content";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [peopleCount, recentEntries] = await Promise.all([
    prisma.person.count(),
    prisma.weightEntry.findMany({
      take: 5,
      orderBy: { date: "desc" },
      include: { person: true },
    }),
  ]);

  const serialized = recentEntries.map((e) => ({
    id: e.id,
    weight: Number(e.weight),
    date: e.date.toISOString().slice(0, 10),
    person: { name: e.person.name },
  }));

  return <HomeContent peopleCount={peopleCount} recentEntries={serialized} />;
}
