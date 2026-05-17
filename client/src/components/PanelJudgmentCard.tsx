import type { PanelJudgment } from '../types'

const LEANING_CONFIG = {
  guilty: {
    label: 'Guilty',
    bg: 'rgba(220,38,38,0.08)',
    border: 'rgba(220,38,38,0.25)',
    dot: '#dc2626',
    text: '#ef4444',
  },
  not_guilty: {
    label: 'Not Guilty',
    bg: 'rgba(22,163,74,0.08)',
    border: 'rgba(22,163,74,0.25)',
    dot: '#16a34a',
    text: '#22c55e',
  },
  complicated: {
    label: 'Complicated',
    bg: 'rgba(217,119,6,0.08)',
    border: 'rgba(217,119,6,0.25)',
    dot: '#d97706',
    text: '#f59e0b',
  },
}

interface Props {
  judgment: PanelJudgment
  index: number
}

export function PanelJudgmentCard({ judgment, index }: Props) {
  const config = LEANING_CONFIG[judgment.leaning]

  return (
    <div
      className="rounded-xl p-4 border animate-fade-in-up"
      style={{
        background: config.bg,
        borderColor: config.border,
        animationDelay: `${index * 80}ms`,
        opacity: 0,
        animationFillMode: 'forwards',
      }}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <p className="font-bold text-[#f0ead6] text-sm">{judgment.agentName}</p>
          <p className="text-xs text-[#6b7280]">{judgment.role}</p>
        </div>
        <span
          className="shrink-0 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full"
          style={{ background: config.border, color: config.text }}
        >
          {config.label}
        </span>
      </div>
      <p className="text-sm text-[#d4cbb8] leading-relaxed mb-2">{judgment.judgment}</p>
      <div className="flex items-center gap-1.5">
        <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: config.dot }} />
        <p className="text-xs text-[#9ca3af] italic">{judgment.keyPrinciple}</p>
      </div>
    </div>
  )
}
