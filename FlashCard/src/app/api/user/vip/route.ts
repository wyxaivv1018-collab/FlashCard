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

    return NextResponse.json({
      isVip: user.isVip,
      vipExpireAt: user.vipExpireAt?.toISOString() ?? null,
      nickname: user.nickname,
    });
  } catch (error) {
    console.error("GET /api/user/vip error:", error);
    return NextResponse.json({ error: "服务器错误" }, { status: 500 });
  }
}
