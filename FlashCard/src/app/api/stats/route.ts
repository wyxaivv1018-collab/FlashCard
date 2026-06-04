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

    // Total stats
    const totalReviewed = await prisma.reviewRecord.count({
      where: { userId: user.id },
    });

    const totalCorrect = await prisma.reviewRecord.count({
      where: { userId: user.id, rating: 4 },
    });

    const accuracy =
      totalReviewed > 0 ? Math.round((totalCorrect / totalReviewed) * 100) : 0;

    // Last 7 days stats
    const today = new Date();
    const last7Days: { date: string; count: number; correct: number }[] = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() - i
      );
      const stat = await prisma.dailyStat.findUnique({
        where: {
          userId_date: { userId: user.id, date },
        },
      });

      last7Days.push({
        date: `${date.getMonth() + 1}/${date.getDate()}`,
        count: stat?.reviewedCount ?? 0,
        correct: stat?.correctCount ?? 0,
      });
    }

    return NextResponse.json({
      totalReviewed,
      totalCorrect,
      accuracy,
      streakDays: user.streakDays,
      last7Days,
    });
  } catch (error) {
    console.error("GET /api/stats error:", error);
    return NextResponse.json({ error: "服务器错误" }, { status: 500 });
  }
}
