const STORAGE_KEY = 'tribunal_trial_claims'

export interface StoredTrialClaim {
  id: string
  claimToken: string
}

function readClaims(): Record<string, string> {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function writeClaims(claims: Record<string, string>) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(claims))
}

export function saveTrialClaim(id: string, claimToken: string | undefined) {
  if (!claimToken) return
  const claims = readClaims()
  claims[id] = claimToken
  writeClaims(claims)
}

export function getTrialClaimToken(id: string | undefined): string | null {
  if (!id) return null
  return readClaims()[id] ?? null
}

export function getStoredTrialClaims(): StoredTrialClaim[] {
  return Object.entries(readClaims()).map(([id, claimToken]) => ({ id, claimToken }))
}

export function removeTrialClaims(ids: string[]) {
  if (ids.length === 0) return
  const claims = readClaims()
  for (const id of ids) {
    delete claims[id]
  }
  writeClaims(claims)
}

