import { useState } from 'react'
import type { AppealGround } from '../types'
import { getTrialClaimToken, saveTrialClaim } from '../utils/trialClaims'

interface AppealParams {
  trialId: string
  tribunalType: string
  appealGround: AppealGround
  appealText: string
}

export function useAppeal() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const appeal = async ({ trialId, tribunalType, appealGround, appealText }: AppealParams): Promise<{ id: string } | null> => {
    setLoading(true)
    setError(null)
    try {
      const claimToken = getTrialClaimToken(trialId)
      const res = await fetch(`/api/trials/${trialId}/appeal`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...(claimToken ? { 'X-Trial-Claim-Token': claimToken } : {}),
        },
        body: JSON.stringify({ tribunalType, appealGround, appealText }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Failed to file appeal')
        return null
      }
      const result = data as { id: string; claimToken?: string }
      saveTrialClaim(result.id, result.claimToken)
      return { id: result.id }
    } catch {
      setError('Network error. Please try again.')
      return null
    } finally {
      setLoading(false)
    }
  }

  return { appeal, loading, error, clearError: () => setError(null) }
}
