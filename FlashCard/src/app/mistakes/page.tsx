"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { BookOpen, Eye, Play } from "lucide-react";

interface MistakeItem {
  id: string;
  cardId: string;
  question: string;
  answer: string;
  explanation: string;
  source: string;
  category: string;
  province: string;
  reviewCount: number;
  lastReviewedAt: string;
}

export default function MistakesPage() {
  const [mistakes, setMistakes] = useState<MistakeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCard, setSelectedCard] = useState<MistakeItem | null>(null);

  useEffect(() => {
    async function fetchMistakes() {
      try {
        const res = await fetch("/api/mistakes");
        const data = await res.json();
        setMistakes(data.mistakes ?? []);
      } catch (err) {
        console.error("Failed to fetch mistakes:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchMistakes();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-pulse text-gray-400">加载中...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4 pt-2">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">错题本</h1>
          <p className="text-sm text-gray-500">
            共 {mistakes.length} 道错题
          </p>
        </div>
        {mistakes.length > 0 && (
          <Link href="/study?mode=mistakes">
            <Button size="sm" className="gap-1">
              <Play className="h-4 w-4" />
              刷错题
            </Button>
          </Link>
        )}
      </div>

      {/* Empty state */}
      {mistakes.length === 0 && (
        <div className="flex flex-col items-center justify-center min-h-[40vh] space-y-4">
          <div className="rounded-full bg-green-100 p-4">
            <BookOpen className="h-8 w-8 text-green-500" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900">暂无错题</h2>
          <p className="text-sm text-gray-500 text-center">
            太棒了！你还没有答错的题目，继续保持！
          </p>
          <Link href="/study">
            <Button>去刷题</Button>
          </Link>
        </div>
      )}

      {/* Mistake list */}
      <div className="space-y-3">
        {mistakes.map((item) => (
          <Card
            key={item.id}
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setSelectedCard(item)}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="inline-flex items-center rounded-full bg-primary-50 px-2 py-0.5 text-xs font-medium text-primary-700">
                      {item.category}
                    </span>
                    <span className="text-xs text-gray-400">
                      错{item.reviewCount}次
                    </span>
                  </div>
                  <p className="text-sm font-medium text-gray-900 line-clamp-2">
                    {item.question}
                  </p>
                </div>
                <Eye className="h-4 w-4 text-gray-300 flex-shrink-0 mt-1" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detail dialog */}
      <Dialog
        open={!!selectedCard}
        onOpenChange={(open) => !open && setSelectedCard(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>卡片详情</DialogTitle>
          </DialogHeader>
          {selectedCard && (
            <div className="space-y-4">
              <div>
                <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                  题目
                </span>
                <p className="mt-1 text-sm font-medium text-gray-900">
                  {selectedCard.question}
                </p>
              </div>
              <div>
                <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                  答案
                </span>
                <p className="mt-1 text-base font-bold text-primary-700">
                  {selectedCard.answer}
                </p>
              </div>
              <div>
                <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                  解析
                </span>
                <p className="mt-1 text-sm text-gray-600">
                  {selectedCard.explanation}
                </p>
              </div>
              <div>
                <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                  来源
                </span>
                <p className="mt-1 text-sm text-gray-500">
                  {selectedCard.source}
                </p>
              </div>
              <div className="flex gap-2">
                <span className="inline-flex items-center rounded-full bg-primary-50 px-2.5 py-0.5 text-xs font-medium text-primary-700">
                  {selectedCard.category}
                </span>
                <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
                  {selectedCard.province}
                </span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
