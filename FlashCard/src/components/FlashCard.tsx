"use client";

import { cn } from "@/lib/utils";

interface FlashCardProps {
  question: string;
  answer: string;
  explanation: string;
  source: string;
  category: string;
  province: string;
  flipped: boolean;
  onFlip: () => void;
}

export function FlashCard({
  question,
  answer,
  explanation,
  source,
  category,
  province,
  flipped,
  onFlip,
}: FlashCardProps) {
  return (
    <div
      className="flip-container w-full cursor-pointer select-none"
      style={{ minHeight: "320px" }}
      onClick={onFlip}
    >
      <div className={cn("flip-card", flipped && "flipped")}>
        {/* Front */}
        <div className="flip-front rounded-2xl border border-gray-200 bg-white p-6 flex flex-col items-center justify-center shadow-sm min-h-[320px]">
          <div className="flex items-center gap-2 mb-4">
            <span className="inline-flex items-center rounded-full bg-primary-50 px-2.5 py-0.5 text-xs font-medium text-primary-700">
              {category}
            </span>
            <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
              {province}
            </span>
          </div>
          <p className="text-lg font-medium text-center text-gray-900 leading-relaxed">
            {question}
          </p>
          <p className="mt-6 text-sm text-gray-400">点击卡片翻转查看答案</p>
        </div>

        {/* Back */}
        <div className="flip-back rounded-2xl border border-gray-200 bg-white p-6 flex flex-col justify-center shadow-sm min-h-[320px]">
          <div className="mb-4">
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
              答案
            </span>
            <p className="mt-1 text-xl font-bold text-primary-700">
              {answer}
            </p>
          </div>

          <div className="mb-4">
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
              解析
            </span>
            <p className="mt-1 text-sm text-gray-600 leading-relaxed">
              {explanation}
            </p>
          </div>

          <div>
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
              来源
            </span>
            <p className="mt-1 text-sm text-gray-500">{source}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
