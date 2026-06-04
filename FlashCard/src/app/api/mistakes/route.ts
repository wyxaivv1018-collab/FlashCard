import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { MOCK_USER_ID } from "@/lib/mock-user";

export async function GET() {
  try {
    const user = await prisma.user.findUnique({
      where: { mockId: MOCK_USER_ID },
    });
    if (!user) {
      return NextResponse.json({ error: "用户不存在" }, { status: 404 });
    }

    // Get review records with rating=1 (没记住)
    const mistakeRecords = await prisma.reviewRecord.findMany({
      where: {
        userId: user.id,
        rating: 1,
      },
      include: {
        card: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      mistakes: mistakeRecords.map((r) => ({
        id: r.id,
        cardId: r.card.id,
        question: r.card.question,
        answer: r.card.answer,
        explanation: r.card.explanation,
        source: r.card.source,
        category: r.card.category,
        province: r.card.province,
        reviewCount: r.reviewCount,
        lastReviewedAt: r.createdAt.toISOString(),
      })),
    });
  } catch (error) {
    console.error("GET /api/mistakes error:", error);
    return NextResponse.json({ error: "服务器错误" }, { status: 500 });
  }
}
