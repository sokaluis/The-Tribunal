import { useState } from 'react'

interface CreateTrialOptions {
  caseText: string
  tribunalType: string
}

interface CreateTrialResult {
  id: string
  status: string
}

export function useCreateTrial() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const create = async (options: CreateTrialOptions): Promise<CreateTrialResult | null> => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/trials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(options),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Failed to start trial')
        return null
      }
      return data as CreateTrialResult
    } catch {
      setError('Network error. Please try again.')
      return null
    } finally {
      setLoading(false)
    }
  }

  return { create, loading, error, clearError: () => setError(null) }
}
