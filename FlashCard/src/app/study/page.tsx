"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { FlashCard } from "@/components/FlashCard";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ProgressBar";
import { CheckCircle, XCircle, Crown, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface CardData {
  id: string;
  question: string;
  answer: string;
  explanation: string;
  source: string;
  category: string;
  province: string;
}

interface StudyState {
  cards: CardData[];
  currentIndex: number;
  completed: boolean;
  limitReached: boolean;
  limitMessage: string;
  todayReviewed: number;
  dailyLimit: number;
  isVip: boolean;
  flipped: boolean;
}

function StudyContent() {
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode"); // "mistakes" or null

  const [state, setState] = useState<StudyState>({
    cards: [],
    currentIndex: 0,
    completed: false,
    limitReached: false,
    limitMessage: "",
    todayReviewed: 0,
    dailyLimit: 30,
    isVip: false,
    flipped: false,
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchCards = useCallback(async () => {
    setLoading(true);
    try {
      if (mode === "mistakes") {
        const res = await fetch("/api/mistakes");
        const data = await res.json();
        const cards = (data.mistakes ?? []).map((m: any) => ({
          id: m.cardId,
          question: m.question,
          answer: m.answer,
          explanation: m.explanation,
          source: m.source,
          category: m.category,
          province: m.province,
        }));
        setState((prev) => ({
          ...prev,
          cards,
          currentIndex: 0,
          completed: cards.length === 0,
          flipped: false,
        }));
      } else {
        const res = await fetch("/api/review/today");
        const data = await res.json();
        setState((prev) => ({
          ...prev,
          cards: data.cards ?? [],
          currentIndex: 0,
          completed: (data.cards ?? []).length === 0,
          todayReviewed: data.todayReviewed ?? 0,
          dailyLimit: data.dailyLimit ?? 30,
          isVip: data.isVip ?? false,
          flipped: false,
        }));
      }
    } catch (err) {
      console.error("Failed to fetch cards:", err);
    } finally {
      setLoading(false);
    }
  }, [mode]);

  useEffect(() => {
    fetchCards();
  }, [fetchCards]);

  const handleFlip = useCallback(() => {
    setState((prev) => {
      if (prev.flipped) return prev;
      return { ...prev, flipped: true };
    });
  }, []);

  const handleRating = async (rating: 1 | 4) => {
    if (submitting) return;

    const card = state.cards[state.currentIndex];
    if (!card) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/review/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cardId: card.id, rating }),
      });
      const result = await res.json();

      if (result.limitReached) {
        setState((prev) => ({
          ...prev,
          limitReached: true,
          limitMessage: result.message,
        }));
        setSubmitting(false);
        return;
      }

      const nextIndex = state.currentIndex + 1;
      const isCompleted = nextIndex >= state.cards.length;

      setState((prev) => ({
        ...prev,
        currentIndex: nextIndex,
        completed: isCompleted,
        flipped: false,
        todayReviewed: prev.todayReviewed + 1,
      }));
    } catch (err) {
      console.error("Submit error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-pulse text-gray-400">加载中...</div>
      </div>
    );
  }

  // Limit reached
  if (state.limitReached) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 px-4">
        <div className="rounded-full bg-orange-100 p-4">
          <Crown className="h-10 w-10 text-orange-500" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 text-center">
          今日额度已用完
        </h2>
        <p className="text-gray-500 text-center">{state.limitMessage}</p>
        <Link href="/vip">
          <Button className="gap-2" size="lg">
            <Crown className="h-4 w-4" />
            开通会员
          </Button>
        </Link>
        <Link href="/" className="text-sm text-primary-600 hover:underline">
          返回首页
        </Link>
      </div>
    );
  }

  // Completed
  if (state.completed) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 px-4">
        <div className="rounded-full bg-green-100 p-4">
          <CheckCircle className="h-10 w-10 text-green-500" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 text-center">
          今日已完成
        </h2>
        <p className="text-gray-500 text-center">
          你已经完成了所有待复习的卡片，继续保持！
        </p>
        <div className="flex gap-3">
          <Link href="/">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              返回首页
            </Button>
          </Link>
          <Button
            onClick={fetchCards}
            variant="default"
            className="gap-2"
          >
            刷新卡片
          </Button>
        </div>
      </div>
    );
  }

  const currentCard = state.cards[state.currentIndex];
  if (!currentCard) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-400">暂无卡片</p>
      </div>
    );
  }

  const progressPct = Math.round(
    ((state.currentIndex) / state.cards.length) * 100
  );

  return (
    <div className="space-y-4 pt-2">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link href="/" className="text-gray-400 hover:text-gray-600">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-lg font-semibold text-gray-900">
          {mode === "mistakes" ? "错题复习" : "刷卡学习"}
        </h1>
        <span className="text-sm text-gray-400">
          {state.currentIndex + 1} / {state.cards.length}
        </span>
      </div>

      {/* Progress */}
      <ProgressBar value={progressPct} />

      {/* Progress info */}
      <div className="flex justify-between text-xs text-gray-400">
        <span>
          今日已刷 {state.todayReviewed} / {state.dailyLimit} 张
        </span>
        {!state.isVip && (
          <Link
            href="/vip"
            className="text-orange-500 hover:underline flex items-center gap-1"
          >
            <Crown className="h-3 w-3" />
            开通会员无限刷
          </Link>
        )}
      </div>

      {/* FlashCard */}
      <FlashCard
        question={currentCard.question}
        answer={currentCard.answer}
        explanation={currentCard.explanation}
        source={currentCard.source}
        category={currentCard.category}
        province={currentCard.province}
        flipped={state.flipped}
        onFlip={handleFlip}
      />

      {/* After flip: action buttons */}
      {state.flipped && (
        <div className="flex gap-3 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <Button
            variant="outline"
            className="flex-1 h-14 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
            onClick={() => handleRating(1)}
            disabled={submitting}
          >
            <XCircle className="mr-2 h-5 w-5" />
            没记住
          </Button>
          <Button
            className="flex-1 h-14 bg-green-600 hover:bg-green-700 text-white"
            onClick={() => handleRating(4)}
            disabled={submitting}
          >
            <CheckCircle className="mr-2 h-5 w-5" />
            记住了
          </Button>
        </div>
      )}

      {!state.flipped && (
        <p className="text-center text-sm text-gray-400">
          👆 点击卡片翻转查看答案
        </p>
      )}
    </div>
  );
}

export default function StudyPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-pulse text-gray-400">加载中...</div>
        </div>
      }
    >
      <StudyContent />
    </Suspense>
  );
}
