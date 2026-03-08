import { prisma } from "@/lib/db";
import { PeopleContent } from "@/components/people-content";

export const dynamic = "force-dynamic";

export default async function PeoplePage() {
  const people = await prisma.person.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { weightEntries: true } } },
  });

  const serialized = people.map((p) => ({
    id: p.id,
    name: p.name,
    height: Number(p.height),
    targetWeight: p.targetWeight != null ? Number(p.targetWeight) : null,
    _count: p._count,
  }));

  return <PeopleContent people={serialized} />;
}
