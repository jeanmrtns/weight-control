import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { calculateBMI } from "@/lib/bmi";
import { PersonDetailContent } from "@/components/person-detail-content";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function PersonDetailPage({ params }: Props) {
  const { id } = await params;
  const person = await prisma.person.findUnique({
    where: { id },
    include: {
      weightEntries: { orderBy: { date: "desc" }, take: 1 },
    },
  });

  if (!person) notFound();

  const height = Number(person.height);
  const lastEntry = person.weightEntries[0];
  const currentWeight = lastEntry ? Number(lastEntry.weight) : null;
  const bmi = currentWeight && height ? calculateBMI(currentWeight, height) : null;

  return (
    <PersonDetailContent
      id={id}
      name={person.name}
      height={height}
      targetWeight={person.targetWeight != null ? Number(person.targetWeight) : null}
      birthDate={person.birthDate?.toISOString().slice(0, 10) ?? null}
      lastWeight={currentWeight ?? null}
      lastWeightDate={lastEntry?.date.toISOString().slice(0, 10) ?? null}
      bmi={bmi}
    />
  );
}
