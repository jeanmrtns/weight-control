import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";

const updatePersonSchema = z.object({
  name: z.string().min(1).optional(),
  birthDate: z.string().optional().transform((s) => (s ? new Date(s) : undefined)),
  height: z.number().positive().optional(),
  gender: z.enum(["male", "female", "other"]).optional().nullable(),
  targetWeight: z.number().positive().optional().nullable(),
});

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const person = await prisma.person.findUnique({
      where: { id },
      include: {
        weightEntries: {
          orderBy: { date: "desc" },
          take: 50,
        },
      },
    });
    if (!person) return NextResponse.json({ error: "Pessoa não encontrada" }, { status: 404 });
    return NextResponse.json({
      ...person,
      height: Number(person.height),
      targetWeight: person.targetWeight != null ? Number(person.targetWeight) : null,
      weightEntries: person.weightEntries.map((e) => ({
        ...e,
        weight: Number(e.weight),
        date: e.date.toISOString().slice(0, 10),
      })),
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Erro ao buscar pessoa" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = updatePersonSchema.safeParse({
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
    const person = await prisma.person.update({
      where: { id },
      data: {
        ...(parsed.data.name != null && { name: parsed.data.name }),
        ...(parsed.data.birthDate !== undefined && { birthDate: parsed.data.birthDate }),
        ...(parsed.data.height != null && { height: parsed.data.height }),
        ...(parsed.data.gender !== undefined && { gender: parsed.data.gender }),
        ...(parsed.data.targetWeight !== undefined && { targetWeight: parsed.data.targetWeight }),
      },
    });
    return NextResponse.json({
      ...person,
      height: Number(person.height),
      targetWeight: person.targetWeight != null ? Number(person.targetWeight) : null,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Erro ao atualizar pessoa" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.person.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Erro ao excluir pessoa" }, { status: 500 });
  }
}
