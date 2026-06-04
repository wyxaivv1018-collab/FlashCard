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

    const now = new Date();

    // Get cards that are due for review (nextReviewAt <= now)
    const dueRecords = await prisma.reviewRecord.findMany({
      where: {
        userId: user.id,
        nextReviewAt: { lte: now },
      },
      include: {
        card: true,
      },
      orderBy: { nextReviewAt: "asc" },
    });

    // Get all approved cards
    const allCards = await prisma.card.findMany({
      where: { status: "approved" },
    });

    // Get IDs of cards already reviewed
    const reviewedCardIds = new Set(
      (
        await prisma.reviewRecord.findMany({
          where: { userId: user.id },
          select: { cardId: true },
        })
      ).map((r) => r.cardId)
    );

    // New cards: not yet reviewed
    const newCards = allCards.filter((c) => !reviewedCardIds.has(c.id));

    // Combine: due cards first, then new cards
    const dueCards = dueRecords.map((r) => r.card);
    const combined = [...dueCards, ...newCards];

    // Count today's reviews for free user limit check
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000);

    const todayReviewed = await prisma.reviewRecord.count({
      where: {
        userId: user.id,
        createdAt: { gte: startOfDay, lt: endOfDay },
      },
    });

    return NextResponse.json({
      cards: combined.map((c) => ({
        id: c.id,
        question: c.question,
        answer: c.answer,
        explanation: c.explanation,
        source: c.source,
        category: c.category,
        province: c.province,
      })),
      total: combined.length,
      todayReviewed,
      dailyLimit: 30,
      isVip: user.isVip,
    });
  } catch (error) {
    console.error("GET /api/review/today error:", error);
    return NextResponse.json({ error: "服务器错误" }, { status: 500 });
  }
}
