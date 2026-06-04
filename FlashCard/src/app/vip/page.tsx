"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Crown, Check, X, Sparkles } from "lucide-react";

export default function VipPage() {
  const [isVip, setIsVip] = useState(false);
  const [vipExpireAt, setVipExpireAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [payResult, setPayResult] = useState<string | null>(null);

  useEffect(() => {
    async function fetchVipStatus() {
      try {
        const res = await fetch("/api/user/vip");
        const data = await res.json();
        setIsVip(data.isVip);
        setVipExpireAt(data.vipExpireAt);
      } catch (err) {
        console.error("Failed to fetch VIP status:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchVipStatus();
  }, []);

  const handlePay = async () => {
    setPaying(true);
    setPayResult(null);
    try {
      const res = await fetch("/api/payment/create", {
        method: "POST",
      });
      const data = await res.json();
      if (data.success) {
        setIsVip(true);
        setVipExpireAt(data.vipExpireAt);
        setPayResult(data.message);
      } else {
        setPayResult("支付失败，请重试");
      }
    } catch (err) {
      setPayResult("支付失败，请重试");
    } finally {
      setPaying(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-pulse text-gray-400">加载中...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pt-2">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-amber-400 to-orange-500 p-3 mb-3">
          <Crown className="h-6 w-6 text-white" />
        </div>
        <h1 className="text-xl font-bold text-gray-900">开通会员</h1>
        <p className="text-sm text-gray-500 mt-1">
          解锁全部功能，高效备考
        </p>
      </div>

      {/* Current status */}
      {isVip && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="p-4 text-center">
            <Sparkles className="h-6 w-6 text-amber-500 mx-auto mb-2" />
            <p className="font-semibold text-amber-800">您已是会员</p>
            {vipExpireAt && (
              <p className="text-sm text-amber-600 mt-1">
                有效期至 {new Date(vipExpireAt).toLocaleDateString("zh-CN")}
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Feature comparison */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">功能对比</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left p-4 font-medium text-gray-500">
                  功能
                </th>
                <th className="text-center p-4 font-medium text-gray-500">
                  免费版
                </th>
                <th className="text-center p-4 font-medium text-amber-600">
                  会员版
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                { feature: "每日刷卡", free: "30张/天", vip: "无限" },
                { feature: "完整解析", free: "基础", vip: "完整" },
                { feature: "错题本", free: "限定", vip: "全部" },
                { feature: "连续打卡", free: "支持", vip: "支持" },
                { feature: "学习统计", free: "基础", vip: "详细" },
              ].map((row, i) => (
                <tr key={i} className="border-b border-gray-50">
                  <td className="p-4 text-gray-900">{row.feature}</td>
                  <td className="text-center p-4 text-gray-500">
                    {row.free}
                  </td>
                  <td className="text-center p-4 text-amber-600 font-medium">
                    {row.vip}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Pricing */}
      <Card className="border-primary-200 bg-gradient-to-b from-primary-50 to-white">
        <CardContent className="p-6 text-center">
          <p className="text-sm text-gray-500 mb-2">月度会员</p>
          <p className="text-4xl font-bold text-gray-900">
            ¥9.9
            <span className="text-base font-normal text-gray-500">/月</span>
          </p>
          <p className="text-xs text-gray-400 mt-1">
            每天不到3毛钱，无限刷题备考
          </p>

          {!isVip ? (
            <Button
              className="w-full mt-4 h-12 text-base font-semibold bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
              onClick={handlePay}
              disabled={paying}
            >
              <Crown className="mr-2 h-5 w-5" />
              {paying ? "支付中..." : "立即开通"}
            </Button>
          ) : (
            <Button className="w-full mt-4" disabled>
              <Check className="mr-2 h-4 w-4" />
              已开通
            </Button>
          )}

          {payResult && (
            <p className="text-sm text-green-600 mt-3 animate-in fade-in">
              {payResult}
            </p>
          )}

          <p className="text-xs text-gray-400 mt-3">
            * 模拟支付，点击即开通
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
