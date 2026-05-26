import { useState } from 'react'
import { saveTrialClaim } from '../utils/trialClaims'
import { useLocale } from '../i18n'

interface CreateTrialOptions {
  caseText: string
  tribunalType: string
}

interface CreateTrialResult {
  id: string
  status: string
  claimToken?: string
}

export function useCreateTrial() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { locale, t } = useLocale()

  const create = async (options: CreateTrialOptions): Promise<CreateTrialResult | null> => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/trials', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...options, locale }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || t('errors.start_trial'))
        return null
      }
      const result = data as CreateTrialResult
      saveTrialClaim(result.id, result.claimToken)
      return result
    } catch {
      setError(t('errors.network'))
      return null
    } finally {
      setLoading(false)
    }
  }

  return { create, loading, error, clearError: () => setError(null) }
}
