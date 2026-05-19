export function formatScorePercent(score: number): string {
  if (!Number.isFinite(score)) return '0%'
  const clamped = Math.min(100, Math.max(0, Math.round(score)))
  return `${clamped}%`
}
