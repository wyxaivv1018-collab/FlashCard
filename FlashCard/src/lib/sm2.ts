/**
 * Simplified SM-2 spaced repetition algorithm.
 *
 * Only two ratings:
 * - 1 ("没记住") → repeat in 10 minutes
 * - 4 ("记住了") → intervals scale by reviewCount:
 *   - First time (reviewCount=0): 1 day
 *   - Second time: 3 days
 *   - Third+ time: 7 days
 */

export const RATING_AGAIN = 1;
export const RATING_GOOD = 4;

export function computeNextReview(rating: number, currentReviewCount: number): Date {
  const now = new Date();

  if (rating === 1) {
    // Review again in 10 minutes
    return new Date(now.getTime() + 10 * 60 * 1000);
  }

  if (rating === 4) {
    const intervals = [1, 3, 7]; // days for reviewCount 0, 1, 2+
    const index = Math.min(currentReviewCount, intervals.length - 1);
    const days = intervals[index];
    const next = new Date(now);
    next.setDate(next.getDate() + days);
    return next;
  }

  // Fallback: 1 day
  const next = new Date(now);
  next.setDate(next.getDate() + 1);
  return next;
}
