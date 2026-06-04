"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Flame, Brain, TrendingUp, Calendar } from "lucide-react";

interface StatsData {
  totalReviewed: number;
  totalCorrect: number;
  accuracy: number;
  streakDays: number;
  last7Days: { date: string; count: number; correct: number }[];
}

export default function StatsPage() {
  const [data, setData] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/stats");
        const stats = await res.json();
        setData(stats);
      } catch (err) {
        console.error("Failed to fetch stats:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-pulse text-gray-400">加载中...</div>
      </div>
    );
  }

  const maxCount = Math.max(1, ...(data?.last7Days.map((d) => d.count) ?? [1]));

  return (
    <div className="space-y-6 pt-2">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-gray-900">学习统计</h1>
        <p className="text-sm text-gray-500 mt-1">查看你的学习数据</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-3">
        <Card>
          <CardContent className="p-4 text-center">
            <Brain className="h-5 w-5 text-primary-500 mx-auto mb-1" />
            <p className="text-2xl font-bold text-gray-900">
              {data?.totalReviewed ?? 0}
            </p>
            <p className="text-xs text-gray-500">总学习数</p>
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
            <Calendar className="h-5 w-5 text-purple-500 mx-auto mb-1" />
            <p className="text-2xl font-bold text-gray-900">
              {(data?.last7Days ?? []).filter((d) => d.count > 0).length}
            </p>
            <p className="text-xs text-gray-500">活跃天数(7天)</p>
          </CardContent>
        </Card>
      </div>

      {/* 7-day chart */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">最近7天学习记录</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end justify-between gap-1 h-32">
            {(data?.last7Days ?? []).map((day, i) => {
              const heightPct = Math.round((day.count / maxCount) * 100);
              return (
                <div
                  key={i}
                  className="flex-1 flex flex-col items-center gap-1"
                >
                  <div className="w-full flex flex-col justify-end" style={{ height: "100px" }}>
                    <div
                      className="w-full bg-primary-400 rounded-t-sm transition-all duration-300 min-h-[2px]"
                      style={{ height: `${Math.max(heightPct, 3)}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-gray-400 leading-tight text-center">
                    {day.date}
                  </span>
                </div>
              );
            })}
          </div>
          {/* Legend */}
          <div className="flex items-center justify-center gap-4 mt-4 text-xs text-gray-400">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-sm bg-primary-400" />
              学习数量
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-sm bg-green-400" />
              正确数量
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Daily detail list */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">每日详情</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {(data?.last7Days ?? [])
              .slice()
              .reverse()
              .map((day, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"
                >
                  <span className="text-sm text-gray-600">{day.date}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-500">
                      刷题{" "}
                      <span className="font-medium text-gray-900">
                        {day.count}
                      </span>{" "}
                      张
                    </span>
                    <span className="text-sm text-gray-500">
                      正确{" "}
                      <span className="font-medium text-green-600">
                        {day.correct}
                      </span>{" "}
                      张
                    </span>
                    <span className="text-sm text-gray-500">
                      正确率{" "}
                      <span className="font-medium text-primary-600">
                        {day.count > 0
                          ? Math.round((day.correct / day.count) * 100)
                          : 0}
                        %
                      </span>
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
