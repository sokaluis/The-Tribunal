import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Hero } from '../components/Hero'
import { CaseInput } from '../components/CaseInput'
import { TribunalTypeSelector } from '../components/TribunalTypeSelector'
import { ExampleCaseButtons } from '../components/ExampleCaseButtons'
import { HowItWorks } from '../components/HowItWorks'
import { VerdictCard } from '../components/VerdictCard'
import { useCreateTrial } from '../hooks/useCreateTrial'
import { useT } from '../i18n'
import type { TribunalType } from '../types'

const SAMPLE_CARD = {
  caseNumber: '00421',
  headline: 'THE TRIBUNAL HAS SPOKEN',
  shortCase: 'I ghosted a friend for three weeks.',
  verdict: 'Guilty, with mitigating circumstances',
  charge: 'Cowardice disguised as self-care.',
  recognized: 'You were genuinely overwhelmed.',
  rejected: 'That silence counts as communication.',
  sentence: 'Send one honest message. Under 120 words. No dramatic monologue.',
}

const SAMPLE_CASE_TEXT = "I ghosted a close friend for three weeks because I was overwhelmed and didn't want to explain myself."

export function HomePage() {
  const t = useT()
  const [caseText, setCaseText] = useState('')
  const [tribunalType, setTribunalType] = useState('relationship')
  const [tribunals, setTribunals] = useState<TribunalType[]>([])
  const { create, loading, error, clearError } = useCreateTrial()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  useEffect(() => {
    const prefilled = searchParams.get('case')
    if (prefilled) setCaseText(prefilled)
  }, [])

  useEffect(() => {
    fetch('/api/tribunals')
      .then((r) => r.json())
      .then((data) => setTribunals(data))
      .catch(console.error)
  }, [])

  const handleSubmit = async () => {
    if (!caseText.trim() || caseText.length < 10) return
    const result = await create({ caseText: caseText.trim(), tribunalType })
    if (result) {
      navigate(`/trial/${result.id}`)
    }
  }

  const handleExampleSelect = (text: string, tribunal: string) => {
    setCaseText(text)
    setTribunalType(tribunal)
    clearError()
  }

  const isValid = caseText.length >= 10 && caseText.length <= 3000

  return (
    <>
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <Hero />

        <div className="space-y-6 mb-10">
          {tribunals.length > 0 && (
            <TribunalTypeSelector
              tribunals={tribunals}
              selected={tribunalType}
              onSelect={(id) => { setTribunalType(id); clearError() }}
            />
          )}

          <CaseInput
            value={caseText}
            onChange={(v) => { setCaseText(v); clearError() }}
            onSubmit={handleSubmit}
            disabled={loading}
          />

          {error && (
            <div className="rounded-lg border border-[#dc2626]/30 bg-[rgba(220,38,38,0.06)] px-4 py-3">
              <p className="text-sm text-[#ef4444]">{error}</p>
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={!isValid || loading}
            className={[
              'w-full py-4 rounded-xl font-bold text-base transition-all duration-200 cursor-pointer',
              isValid && !loading
                ? 'bg-[#d4a853] text-[#0a0a0f] hover:bg-[#e8c477] shadow-[0_0_30px_-10px_rgba(212,168,83,0.5)]'
                : 'bg-[#14141f] text-[#4b5563] border border-[#1e1e2e] cursor-not-allowed',
            ].join(' ')}
          >
            {loading ? t('home.filing_case') : t('home.start_trial')}
          </button>

          <p className="text-center text-xs text-[#4b5563]">
            {t('home.submit_hint')}
          </p>

          <ExampleCaseButtons onSelect={handleExampleSelect} />
        </div>
      </div>

      <HowItWorks />

      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs uppercase tracking-[0.2em] text-[#6b7280] text-center mb-2 font-medium">{t('home.sample_verdict')}</p>
          <h2 className="text-3xl font-black text-[#f0ead6] text-center mb-10" style={{ fontFamily: 'Georgia, Times New Roman, serif' }}>
            {t('home.verdict_card_title')}
          </h2>
          <p className="text-center text-[#9ca3af] text-sm mb-10 max-w-md mx-auto">
            {t('home.verdict_card_desc')}
          </p>
          <div className="max-w-lg mx-auto">
            <VerdictCard
              shareCard={SAMPLE_CARD}
              score={72}
              scoreLabel="Asshole Score"
              tribunalType="relationship"
              caseText={SAMPLE_CASE_TEXT}
            />
          </div>
        </div>
      </section>

      <section className="py-16 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-black text-[#f0ead6] mb-4" style={{ fontFamily: 'Georgia, Times New Roman, serif' }}>
            {t('home.cta_title')}
          </h2>
          <p className="text-[#9ca3af] mb-8 text-sm">
            {t('home.cta_subtitle')}
          </p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="px-8 py-3.5 rounded-xl bg-[#d4a853] text-[#0a0a0f] font-bold hover:bg-[#e8c477] transition-colors cursor-pointer"
          >
            {t('home.cta_button')}
          </button>
        </div>
      </section>
    </>
  )
}
