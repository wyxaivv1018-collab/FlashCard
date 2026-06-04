import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { MOCK_USER_ID } from "@/lib/mock-user";

export async function POST() {
  try {
    const user = await prisma.user.findUnique({
      where: { mockId: MOCK_USER_ID },
    });
    if (!user) {
      return NextResponse.json({ error: "用户不存在" }, { status: 404 });
    }

    // Mock payment: activate VIP for 30 days
    const now = new Date();
    const expireAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    // Create subscription record
    await prisma.subscription.create({
      data: {
        userId: user.id,
        amount: 9.9,
        status: "active",
        expireAt,
      },
    });

    // Update user VIP status
    await prisma.user.update({
      where: { id: user.id },
      data: {
        isVip: true,
        vipExpireAt: expireAt,
      },
    });

    return NextResponse.json({
      success: true,
      message: "支付成功！会员已激活，有效期至 " + expireAt.toLocaleDateString("zh-CN"),
      vipExpireAt: expireAt.toISOString(),
    });
  } catch (error) {
    console.error("POST /api/payment/create error:", error);
    return NextResponse.json({ error: "服务器错误" }, { status: 500 });
  }
}
