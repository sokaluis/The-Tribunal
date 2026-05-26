import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppeal } from '../hooks/useAppeal'
import { useT } from '../i18n'
import { APPEAL_GROUNDS } from '../types'
import type { TribunalType, AppealGround } from '../types'
import { TribunalSelectorGrid } from './TribunalSelectorGrid'

interface Props {
  trialId: string
  currentTribunalType: string
  tribunals: TribunalType[]
}

export function AppealSelector({ trialId, currentTribunalType, tribunals }: Props) {
  const t = useT()
  const [open, setOpen] = useState(false)
  const [selectedTribunal, setSelectedTribunal] = useState<string | null>(null)
  const [selectedGround, setSelectedGround] = useState<AppealGround | null>(null)
  const [appealText, setAppealText] = useState('')
  const { appeal, loading, error } = useAppeal()
  const navigate = useNavigate()

  const handleSubmit = async () => {
    if (!selectedTribunal || !selectedGround) return
    const result = await appeal({
      trialId,
      tribunalType: selectedTribunal,
      appealGround: selectedGround,
      appealText,
    })
    if (result) {
      navigate(`/trial/${result.id}`)
    }
  }

  const canSubmit = selectedTribunal && selectedGround && !loading

  if (!open) {
    return (
      <div className="text-center">
        <button
          onClick={() => setOpen(true)}
          className="text-sm text-[#9ca3af] hover:text-[#d4a853] transition-colors border border-[#1e1e2e] rounded-lg px-5 py-2.5 hover:border-[#d4a853]/30 cursor-pointer"
        >
          {t('appeal.button')}
        </button>
      </div>
    )
  }

  return (
    <div className="animate-fade-in-up rounded-xl border border-[#1e1e2e] bg-[#14141f] p-5">
      <p className="text-xs uppercase tracking-widest text-[#6b7280] mb-5 font-medium text-center">
        {t('appeal.title')}
      </p>

      {error && (
        <p className="text-xs text-[#dc2626] mb-3 text-center">{error}</p>
      )}

      <div className="mb-5">
        <p className="text-xs text-[#9ca3af] mb-1 font-medium">{t('appeal.choose_court')}</p>
        <p className="text-[11px] text-[#6b7280] mb-3">
          {t('appeal.choose_court_hint')}
        </p>
        <TribunalSelectorGrid
          tribunals={tribunals}
          selected={selectedTribunal}
          onSelect={setSelectedTribunal}
          disabled={loading}
          getBadge={(trib) => (trib.id === currentTribunalType ? t('appeal.current_court') : null)}
        />
      </div>

      <div className="mb-5">
        <p className="text-xs text-[#9ca3af] mb-2 font-medium">{t('appeal.grounds')}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {APPEAL_GROUNDS.map((ground) => (
            <button
              key={ground}
              onClick={() => setSelectedGround(ground)}
              disabled={loading}
              className={`rounded-lg border px-3 py-2.5 text-left transition-all cursor-pointer disabled:opacity-50 ${
                selectedGround === ground
                  ? 'border-[#d4a853]/60 bg-[#d4a853]/10'
                  : 'border-[#1e1e2e] hover:border-[#d4a853]/40 hover:bg-[#d4a853]/5'
              }`}
            >
              <div className="text-xs text-[#f0ead6]">{t(`appeal.ground.${ground}`)}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="mb-5">
        <p className="text-xs text-[#9ca3af] mb-2 font-medium">
          {t('appeal.explain')} <span className="text-[#4b5563]">{t('appeal.explain_hint')}</span>
        </p>
        <textarea
          value={appealText}
          onChange={(e) => setAppealText(e.target.value)}
          placeholder={t('appeal.placeholder')}
          maxLength={1000}
          disabled={loading}
          rows={3}
          className="w-full rounded-lg border border-[#1e1e2e] bg-[#0c0c14] text-sm text-[#f0ead6] placeholder-[#4b5563] p-3 resize-none focus:outline-none focus:border-[#d4a853]/40 disabled:opacity-50"
        />
        <p className="text-[10px] text-[#4b5563] mt-1 text-right">{appealText.length}/1000</p>
      </div>

      <div className="flex items-center justify-center gap-3">
        <button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="text-sm font-medium text-[#d4a853] border border-[#d4a853]/40 rounded-lg px-5 py-2 hover:bg-[#d4a853]/10 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading ? t('appeal.filing') : t('appeal.submit')}
        </button>
        <button
          onClick={() => setOpen(false)}
          disabled={loading}
          className="text-xs text-[#6b7280] hover:text-[#9ca3af] transition-colors cursor-pointer disabled:opacity-50"
        >
          {t('appeal.cancel')}
        </button>
      </div>
    </div>
  )
}
