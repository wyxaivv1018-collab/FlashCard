"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProgressBar } from "@/components/ProgressBar";
import {
  Brain,
  Flame,
  TrendingUp,
  BookOpen,
  ArrowRight,
} from "lucide-react";

interface HomeData {
  todayPending: number;
  todayDone: number;
  streakDays: number;
  accuracy: number;
  totalReviewed: number;
}

export default function HomePage() {
  const [data, setData] = useState<HomeData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [statsRes, reviewRes] = await Promise.all([
          fetch("/api/stats"),
          fetch("/api/review/today"),
        ]);
        const stats = await statsRes.json();
        const review = await reviewRes.json();

        setData({
          todayPending: review.total ?? 0,
          todayDone: review.todayReviewed ?? 0,
          streakDays: stats.streakDays ?? 0,
          accuracy: stats.accuracy ?? 0,
          totalReviewed: stats.totalReviewed ?? 0,
        });
      } catch (err) {
        console.error("Failed to fetch home data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-pulse text-gray-400">加载中...</div>
      </div>
    );
  }

  const todayTotal = 30;
  const todayDone = data?.todayDone ?? 0;
  const progressPct = Math.min(100, Math.round((todayDone / todayTotal) * 100));

  return (
    <div className="space-y-6 pt-2">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-xl font-bold text-gray-900">时政闪卡</h1>
        <p className="text-sm text-gray-500 mt-1">每天刷一刷，时政轻松记</p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-3 gap-3">
        <Card>
          <CardContent className="p-4 text-center">
            <Flame className="h-5 w-5 text-orange-500 mx-auto mb-1" />
            <p className="text-2xl font-bold text-gray-900">
              {data?.streakDays ?? 0}
            </p>
            <p className="text-xs text-gray-500">连续打卡</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Brain className="h-5 w-5 text-primary-500 mx-auto mb-1" />
            <p className="text-2xl font-bold text-gray-900">
              {data?.totalReviewed ?? 0}
            </p>
            <p className="text-xs text-gray-500">总刷卡数</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-5 w-5 text-green-500 mx-auto mb-1" />
            <p className="text-2xl font-bold text-gray-900">
              {data?.accuracy ?? 0}%
            </p>
            <p className="text-xs text-gray-500">正确率</p>
          </CardContent>
        </Card>
      </div>

      {/* Today progress */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">今日进度</CardTitle>
        </CardHeader>
        <CardContent>
          <ProgressBar
            value={progressPct}
            label={`今日已刷 ${todayDone} / ${todayTotal} 张`}
          />
          {todayDone >= todayTotal && (
            <p className="text-sm text-orange-500 mt-2">
              今日免费额度已用完，开通会员可无限刷题
            </p>
          )}
        </CardContent>
      </Card>

      {/* Action buttons */}
      <div className="space-y-3">
        <Link href="/study" className="block">
          <Button className="w-full h-14 text-base font-semibold" size="lg">
            <Brain className="mr-2 h-5 w-5" />
            开始学习
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>

        <Link href="/study?mode=mistakes" className="block">
          <Button
            variant="outline"
            className="w-full h-11 text-sm"
            size="lg"
          >
            <BookOpen className="mr-2 h-4 w-4" />
            复习错题
          </Button>
        </Link>
      </div>

      {/* Quick tip */}
      <div className="rounded-lg bg-primary-50 p-4">
        <p className="text-sm text-primary-800">
          💡 提示：完成每日任务可保持连续打卡记录。开通会员享受无限刷题和完整解析。
        </p>
      </div>
    </div>
  );
}
