import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { IndividualDashboard } from "@/components/dashboard/individual-dashboard";
import { DashboardHeading } from "@/components/dashboard-heading";
import { calculateBMI, getWeightTrend } from "@/lib/bmi";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function PersonDashboardPage({ params }: Props) {
  const { id } = await params;
  const person = await prisma.person.findUnique({
    where: { id },
    include: {
      weightEntries: { orderBy: { date: "asc" } },
    },
  });

  if (!person) notFound();

  const height = Number(person.height);
  const entries = person.weightEntries.map((e) => ({
    date: e.date.toISOString().slice(0, 10),
    weight: Number(e.weight),
  }));
  const weights = entries.map((e) => e.weight);
  const currentWeight = weights.length > 0 ? weights[weights.length - 1] : null;
  const firstWeight = weights.length > 0 ? weights[0] : null;
  const bmi = currentWeight && height ? calculateBMI(currentWeight, height) : null;
  const trend = getWeightTrend(weights, 3);
  const targetWeight =
    person.targetWeight != null ? Number(person.targetWeight) : null;

  return (
    <div className="min-w-0 space-y-6">
      <DashboardHeading personName={person.name} />
      <IndividualDashboard
        personId={id}
        personName={person.name}
        entries={entries}
        heightCm={height}
        currentWeight={currentWeight ?? undefined}
        firstWeight={firstWeight ?? undefined}
        targetWeight={targetWeight ?? undefined}
        bmi={bmi ?? undefined}
        trend={trend}
      />
    </div>
  );
}
