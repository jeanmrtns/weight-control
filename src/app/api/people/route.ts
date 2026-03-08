import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";

const createPersonSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  birthDate: z.string().optional().transform((s) => (s ? new Date(s) : undefined)),
  height: z.number().positive("Altura deve ser positiva"),
  gender: z.enum(["male", "female", "other"]).optional(),
  targetWeight: z.number().positive().optional().nullable(),
});

export async function GET() {
  try {
    const people = await prisma.person.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: { select: { weightEntries: true } },
      },
    });
    return NextResponse.json(
      people.map((p) => ({
        ...p,
        height: Number(p.height),
        targetWeight: p.targetWeight != null ? Number(p.targetWeight) : null,
      }))
    );
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Erro ao listar pessoas" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = createPersonSchema.safeParse({
      ...body,
      height: body.height != null ? Number(body.height) : undefined,
      targetWeight: body.targetWeight != null ? Number(body.targetWeight) : undefined,
    });
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Dados inválidos", details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const person = await prisma.person.create({
      data: {
        name: parsed.data.name,
        birthDate: parsed.data.birthDate,
        height: parsed.data.height,
        gender: parsed.data.gender ?? null,
        targetWeight: parsed.data.targetWeight ?? null,
      },
    });
    return NextResponse.json({
      ...person,
      height: Number(person.height),
      targetWeight: person.targetWeight != null ? Number(person.targetWeight) : null,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Erro ao criar pessoa" }, { status: 500 });
  }
}
