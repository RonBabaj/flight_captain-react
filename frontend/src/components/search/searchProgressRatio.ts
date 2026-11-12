import type { SearchProgress } from '../../types';

/**
 * Maps live provider completion (+ optional elapsed time) to a 0–1 progress ratio.
 * Monotonic intent: callers should only animate upward within a single search.
 */
export function searchProgressRatio(
  progress: SearchProgress | null | undefined,
  elapsedMs = 0,
): number {
  const done = Math.max(0, progress?.providersDone ?? 0);
  const total = Math.max(0, progress?.providersTotal ?? 0);
  const phase = progress?.phase || 'searching';
  const providerShare = total > 0 ? Math.min(1, done / total) : 0;

  // Soft crawl so the bar moves before the first provider reports.
  const soft = Math.min(0.72, 0.06 + (Math.max(0, elapsedMs) / 90_000) * 0.66);

  if (phase === 'finalizing') {
    // All providers back — hold near the end until COMPLETE clears the banner.
    return Math.max(0.92, soft, 0.92 + 0.06 * providerShare);
  }

  // Searching: 6% → ~88% as providers finish; soft crawl fills gaps.
  const fromProviders = 0.06 + providerShare * 0.82;
  return Math.min(0.9, Math.max(fromProviders, soft));
}
