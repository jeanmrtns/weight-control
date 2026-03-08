import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";

const createWeightSchema = z.object({
  personId: z.string().uuid(),
  weight: z.number().positive("Peso deve ser positivo"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Data inválida (use AAAA-MM-DD)"),
  note: z.string().optional(),
});

const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const personId = searchParams.get("personId");
    const from = searchParams.get("from");
    const to = searchParams.get("to");
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const limit = Math.min(
      MAX_LIMIT,
      Math.max(1, parseInt(searchParams.get("limit") ?? String(DEFAULT_LIMIT), 10))
    );

    if (!personId) {
      return NextResponse.json(
        { error: "personId é obrigatório" },
        { status: 400 }
      );
    }

    const where: { personId: string; date?: { gte?: Date; lte?: Date } } = {
      personId,
    };
    if (from || to) {
      where.date = {};
      if (from) where.date.gte = new Date(from);
      if (to) where.date.lte = new Date(to);
    }

    const [total, entries] = await Promise.all([
      prisma.weightEntry.count({ where }),
      prisma.weightEntry.findMany({
        where,
        orderBy: { date: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      entries: entries.map((e) => ({
        id: e.id,
        weight: Number(e.weight),
        date: e.date.toISOString().slice(0, 10),
        note: e.note,
      })),
      total,
      page,
      limit,
      totalPages,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Erro ao listar registros" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = createWeightSchema.safeParse({
      ...body,
      weight: body.weight != null ? Number(body.weight) : undefined,
    });
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Dados inválidos", details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const entry = await prisma.weightEntry.create({
      data: {
        personId: parsed.data.personId,
        weight: parsed.data.weight,
        date: new Date(parsed.data.date),
        note: parsed.data.note ?? null,
      },
    });
    return NextResponse.json({
      ...entry,
      weight: Number(entry.weight),
      date: entry.date.toISOString().slice(0, 10),
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Erro ao criar registro" }, { status: 500 });
  }
}
