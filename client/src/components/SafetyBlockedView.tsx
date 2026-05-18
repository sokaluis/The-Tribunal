import { Link } from 'react-router-dom'

interface Props {
  safetyMessage: string
  safetyType?: 'crisis' | 'content_policy'
  resources: Array<{ label: string; value: string }>
}

export function SafetyBlockedView({ safetyMessage, safetyType = 'crisis', resources }: Props) {
  const isCrisis = safetyType === 'crisis'

  return (
    <div className="max-w-lg mx-auto py-16 px-4 text-center animate-fade-in">
      <div className="text-4xl mb-6">{isCrisis ? '🤝' : '⚖'}</div>
      <h2 className="text-2xl font-bold text-[#f0ead6] mb-4">
        {isCrisis ? 'We see you.' : 'Case dismissed.'}
      </h2>
      <p className="text-[#9ca3af] leading-relaxed mb-8 text-sm max-w-md mx-auto">{safetyMessage}</p>

      {isCrisis && resources.length > 0 && (
        <div className="rounded-xl border border-[#1e1e2e] bg-[#14141f] p-6 text-left mb-8 space-y-4">
          <p className="text-xs uppercase tracking-widest text-[#6b7280] font-medium">If you need support</p>
          {resources.map((r) => (
            <div key={r.label} className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-[#d4a853] mt-2 shrink-0" />
              <div>
                <p className="text-sm font-medium text-[#f0ead6]">{r.label}</p>
                <p className="text-xs text-[#9ca3af]">{r.value}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <Link
        to="/"
        className={`inline-flex items-center gap-2 text-sm text-[#9ca3af] hover:text-[#f0ead6] transition-colors border border-[#1e1e2e] rounded-lg px-4 py-2.5 ${isCrisis ? '' : 'mt-0'}`}
      >
        ← Return to The Tribunal
      </Link>
    </div>
  )
}
