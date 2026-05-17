import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppeal } from '../hooks/useAppeal'
import type { TribunalType } from '../types'

interface Props {
  trialId: string
  currentTribunalType: string
  tribunals: TribunalType[]
}

const ICONS: Record<string, string> = {
  moral: '⚖',
  relationship: '💬',
  idea: '💡',
  opinion: '🔥',
  roast: '😤',
}

export function AppealSelector({ trialId, currentTribunalType, tribunals }: Props) {
  const [open, setOpen] = useState(false)
  const { appeal, loading, error } = useAppeal()
  const navigate = useNavigate()

  const available = tribunals.filter((t) => t.id !== currentTribunalType)

  const handleAppeal = async (tribunalType: string) => {
    const result = await appeal(trialId, tribunalType)
    if (result) {
      navigate(`/trial/${result.id}`)
    }
  }

  return (
    <div className="text-center">
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="text-sm text-[#9ca3af] hover:text-[#d4a853] transition-colors border border-[#1e1e2e] rounded-lg px-5 py-2.5 hover:border-[#d4a853]/30 cursor-pointer"
        >
          ⚖ Appeal this verdict in another court
        </button>
      ) : (
        <div className="animate-fade-in-up rounded-xl border border-[#1e1e2e] bg-[#14141f] p-5">
          <p className="text-xs uppercase tracking-widest text-[#6b7280] mb-4 font-medium">Choose your court of appeal</p>
          {error && (
            <p className="text-xs text-[#dc2626] mb-3">{error}</p>
          )}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
            {available.map((t) => (
              <button
                key={t.id}
                onClick={() => handleAppeal(t.id)}
                disabled={loading}
                className="rounded-lg border border-[#1e1e2e] p-3 text-left hover:border-[#d4a853]/40 hover:bg-[#d4a853]/5 transition-all cursor-pointer disabled:opacity-50"
              >
                <div className="text-lg mb-1">{ICONS[t.id]}</div>
                <div className="text-xs font-bold text-[#f0ead6] mb-0.5">{t.name.replace(' Tribunal', '')}</div>
                <div className="text-[10px] text-[#6b7280]">{t.scoreLabel}</div>
              </button>
            ))}
          </div>
          <button
            onClick={() => setOpen(false)}
            className="text-xs text-[#6b7280] hover:text-[#9ca3af] transition-colors cursor-pointer"
          >
            Cancel
          </button>
          {loading && (
            <p className="text-xs text-[#d4a853] mt-2 animate-pulse-slow">Filing appeal...</p>
          )}
        </div>
      )}
    </div>
  )
}
