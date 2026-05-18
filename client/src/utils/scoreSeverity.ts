export type ScoreSeverity = 'low' | 'moderate' | 'high'

export interface ScoreSeverityColors {
  severity: ScoreSeverity
  bg: string
  text: string
  border: string
  accent: string
}

const LOW: ScoreSeverityColors = {
  severity: 'low',
  bg: 'rgba(22,163,74,0.1)',
  text: '#16a34a',
  border: 'rgba(22,163,74,0.3)',
  accent: '#16a34a',
}

const MODERATE: ScoreSeverityColors = {
  severity: 'moderate',
  bg: 'rgba(217,119,6,0.1)',
  text: '#d97706',
  border: 'rgba(217,119,6,0.3)',
  accent: '#d97706',
}

const HIGH: ScoreSeverityColors = {
  severity: 'high',
  bg: 'rgba(220,38,38,0.1)',
  text: '#dc2626',
  border: 'rgba(220,38,38,0.3)',
  accent: '#dc2626',
}

function clampScore(score: number): number {
  if (!Number.isFinite(score)) return 0
  return Math.min(100, Math.max(0, Math.round(score)))
}

export function getScoreSeverity(score: number): ScoreSeverity {
  const s = clampScore(score)
  if (s <= 39) return 'low'
  if (s <= 69) return 'moderate'
  return 'high'
}

export function getScoreSeverityColors(score: number): ScoreSeverityColors {
  const severity = getScoreSeverity(score)
  if (severity === 'low') return LOW
  if (severity === 'moderate') return MODERATE
  return HIGH
}
