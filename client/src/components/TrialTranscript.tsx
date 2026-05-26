import type { TrialResult } from '../types'
import { PanelJudgmentCard } from './PanelJudgmentCard'
import { useT } from '../i18n'

interface Props {
  trial: TrialResult
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] uppercase tracking-[0.2em] text-[#6b7280] mb-4 font-medium text-center">{children}</p>
  )
}

function ArgumentCard({ title, argument, accentColor }: { title: string; argument: string; accentColor: string }) {
  return (
    <div className="rounded-xl border border-[#1e1e2e] bg-[#14141f] overflow-hidden h-full">
      <div
        className="px-5 py-3 border-b border-[#1e1e2e]"
        style={{ borderLeftWidth: 3, borderLeftColor: accentColor, borderLeftStyle: 'solid' }}
      >
        <p className="text-xs font-bold text-[#9ca3af] uppercase tracking-wider">{title}</p>
      </div>
      <div className="px-5 py-4">
        <p className="text-sm text-[#d4cbb8] leading-relaxed">{argument}</p>
      </div>
    </div>
  )
}

export function ArgumentsSection({ trial }: { trial: TrialResult }) {
  const t = useT()
  if (!trial.prosecution.argument && !trial.defense.argument) return null
  return (
    <section>
      <SectionLabel>{t('transcript.arguments')}</SectionLabel>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <ArgumentCard
          title={trial.prosecution.title}
          argument={trial.prosecution.argument}
          accentColor="#dc2626"
        />
        <ArgumentCard
          title={trial.defense.title}
          argument={trial.defense.argument}
          accentColor="#16a34a"
        />
      </div>
    </section>
  )
}

export function PanelSection({ trial }: { trial: TrialResult }) {
  const t = useT()
  if (trial.panelJudgments.length === 0) return null
  return (
    <section>
      <SectionLabel>{t('transcript.panel')}</SectionLabel>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
        {trial.panelJudgments.map((j, i) => (
          <PanelJudgmentCard key={j.agentName} judgment={j} index={i} />
        ))}
      </div>
    </section>
  )
}

export function CaseSection({ trial }: { trial: TrialResult }) {
  const t = useT()
  return (
    <section>
      <SectionLabel>{t('transcript.case')}</SectionLabel>
      <div className="mx-auto max-w-2xl rounded-xl border border-[#1e1e2e] bg-[#14141f] p-6">
        <p className="text-sm text-[#d4cbb8] leading-relaxed whitespace-pre-wrap">{trial.caseText}</p>
      </div>
    </section>
  )
}

export function RulingSection({ trial }: { trial: TrialResult }) {
  const t = useT()
  if (!trial.finalReasoning) return null
  return (
    <section>
      <SectionLabel>{t('transcript.ruling')}</SectionLabel>
      <div className="mx-auto rounded-xl border border-[#1e1e2e] bg-[#14141f] p-6">
        <p className="text-sm text-[#d4cbb8] leading-relaxed text-center">{trial.finalReasoning}</p>
      </div>
    </section>
  )
}

export function TrialTranscript({ trial }: Props) {
  return (
    <div className="space-y-12">
      <ArgumentsSection trial={trial} />
      <PanelSection trial={trial} />
      <RulingSection trial={trial} />
    </div>
  )
}
