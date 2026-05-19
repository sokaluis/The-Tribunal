import { useState, useEffect, useCallback } from 'react'
import type { TrialResponse } from '../types'
import { getTrialClaimToken } from '../utils/trialClaims'

const TERMINAL_STATUSES = new Set(['completed', 'failed', 'safety_blocked'])
const POLL_INTERVAL = 2000

export function useTrial(id: string | undefined) {
  const [data, setData] = useState<TrialResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTrial = useCallback(async (): Promise<boolean> => {
    if (!id) return true
    try {
      const claimToken = getTrialClaimToken(id)
      const res = await fetch(`/api/trials/${id}`, {
        credentials: 'include',
        headers: claimToken ? { 'X-Trial-Claim-Token': claimToken } : undefined,
      })
      if (res.status === 404) {
        setError('Trial not found')
        setLoading(false)
        return true
      }
      if (!res.ok) {
        setError('Failed to load trial')
        setLoading(false)
        return true
      }
      const json: TrialResponse = await res.json()
      setData(json)
      setLoading(false)
      return TERMINAL_STATUSES.has(json.status)
    } catch {
      setError('Network error while loading trial')
      setLoading(false)
      return true
    }
  }, [id])

  useEffect(() => {
    if (!id) return

    setData(null)
    setLoading(true)
    setError(null)

    let stopped = false
    let timeoutId: ReturnType<typeof setTimeout>

    const poll = async () => {
      if (stopped) return
      const done = await fetchTrial()
      if (!done && !stopped) {
        timeoutId = setTimeout(poll, POLL_INTERVAL)
      }
    }

    poll()

    return () => {
      stopped = true
      clearTimeout(timeoutId)
    }
  }, [id, fetchTrial])

  return { data, loading, error }
}
