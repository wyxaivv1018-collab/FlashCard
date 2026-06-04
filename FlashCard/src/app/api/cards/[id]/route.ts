import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const card = await prisma.card.findUnique({
      where: { id },
    });

    if (!card) {
      return NextResponse.json({ error: "卡片不存在" }, { status: 404 });
    }

    return NextResponse.json({
      id: card.id,
      question: card.question,
      answer: card.answer,
      explanation: card.explanation,
      source: card.source,
      category: card.category,
      province: card.province,
      publishDate: card.publishDate?.toISOString() ?? null,
    });
  } catch (error) {
    console.error("GET /api/cards/[id] error:", error);
    return NextResponse.json({ error: "服务器错误" }, { status: 500 });
  }
}
