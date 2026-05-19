import { useState } from 'react'
import { getTrialClaimToken } from '../utils/trialClaims'

export function usePublish(initialPublished = false) {
  const [published, setPublished] = useState(initialPublished)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const publish = async (trialId: string): Promise<boolean> => {
    setLoading(true)
    setError(null)
    try {
      const claimToken = getTrialClaimToken(trialId)
      const res = await fetch(`/api/trials/${trialId}/publish`, {
        method: 'POST',
        credentials: 'include',
        headers: claimToken ? { 'X-Trial-Claim-Token': claimToken } : undefined,
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Failed to publish')
        return false
      }
      setPublished(true)
      return true
    } catch {
      setError('Network error')
      return false
    } finally {
      setLoading(false)
    }
  }

  return { publish, published, loading, error }
}
