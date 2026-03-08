import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";

const updateWeightSchema = z.object({
  weight: z.number().positive().optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  note: z.string().optional().nullable(),
});

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = updateWeightSchema.safeParse({
      ...body,
      weight: body.weight != null ? Number(body.weight) : undefined,
    });
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Dados inválidos", details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const entry = await prisma.weightEntry.update({
      where: { id },
      data: {
        ...(parsed.data.weight != null && { weight: parsed.data.weight }),
        ...(parsed.data.date != null && { date: new Date(parsed.data.date) }),
        ...(parsed.data.note !== undefined && { note: parsed.data.note }),
      },
    });
    return NextResponse.json({
      ...entry,
      weight: Number(entry.weight),
      date: entry.date.toISOString().slice(0, 10),
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Erro ao atualizar registro" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.weightEntry.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Erro ao excluir registro" }, { status: 500 });
  }
}
