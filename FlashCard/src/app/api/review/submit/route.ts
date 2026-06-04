import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { MOCK_USER_ID } from "@/lib/mock-user";
import { computeNextReview } from "@/lib/sm2";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { cardId, rating } = body;

    if (!cardId || (rating !== 1 && rating !== 4)) {
      return NextResponse.json(
        { error: "参数错误" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { mockId: MOCK_USER_ID },
    });
    if (!user) {
      return NextResponse.json({ error: "用户不存在" }, { status: 404 });
    }

    // Check daily limit for non-VIP users
    if (!user.isVip) {
      const now = new Date();
      const startOfDay = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate()
      );
      const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000);

      const todayReviewed = await prisma.reviewRecord.count({
        where: {
          userId: user.id,
          createdAt: { gte: startOfDay, lt: endOfDay },
        },
      });

      if (todayReviewed >= 30) {
        return NextResponse.json({
          limitReached: true,
          message: "今日免费额度已用完，开通会员即可无限刷题",
        });
      }
    }

    // Find existing review record or create new
    const existing = await prisma.reviewRecord.findUnique({
      where: {
        userId_cardId: { userId: user.id, cardId },
      },
    });

    const newReviewCount = (existing?.reviewCount ?? 0) + 1;
    const nextReviewAt = computeNextReview(rating, existing?.reviewCount ?? 0);

    await prisma.reviewRecord.upsert({
      where: {
        userId_cardId: { userId: user.id, cardId },
      },
      create: {
        userId: user.id,
        cardId,
        rating,
        reviewCount: 1,
        nextReviewAt,
      },
      update: {
        rating,
        reviewCount: newReviewCount,
        nextReviewAt,
      },
    });

    // Upsert DailyStat
    const today = new Date();
    const dateOnly = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );

    const existingStat = await prisma.dailyStat.findUnique({
      where: {
        userId_date: { userId: user.id, date: dateOnly },
      },
    });

    await prisma.dailyStat.upsert({
      where: {
        userId_date: { userId: user.id, date: dateOnly },
      },
      create: {
        userId: user.id,
        date: dateOnly,
        reviewedCount: 1,
        correctCount: rating === 4 ? 1 : 0,
        studyMinutes: 1,
      },
      update: {
        reviewedCount: (existingStat?.reviewedCount ?? 0) + 1,
        correctCount:
          (existingStat?.correctCount ?? 0) + (rating === 4 ? 1 : 0),
        studyMinutes: (existingStat?.studyMinutes ?? 0) + 1,
      },
    });

    // Update streak days: only on first review of the day
    const isFirstReviewToday = !existingStat;
    if (isFirstReviewToday) {
      const yesterday = new Date(dateOnly);
      yesterday.setDate(yesterday.getDate() - 1);

      const yesterdayStat = await prisma.dailyStat.findUnique({
        where: {
          userId_date: { userId: user.id, date: yesterday },
        },
      });

      if (yesterdayStat && yesterdayStat.reviewedCount > 0) {
        // Yesterday was reviewed, increment streak
        await prisma.user.update({
          where: { id: user.id },
          data: { streakDays: user.streakDays + 1 },
        });
      } else {
        // Streak broken, reset to 1
        await prisma.user.update({
          where: { id: user.id },
          data: { streakDays: 1 },
        });
      }
    }

    return NextResponse.json({
      success: true,
      nextReviewAt: nextReviewAt.toISOString(),
    });
  } catch (error) {
    console.error("POST /api/review/submit error:", error);
    return NextResponse.json({ error: "服务器错误" }, { status: 500 });
  }
}
