import { Router } from 'express'
import { z } from 'zod'
import { nanoid } from 'nanoid'
import { and, eq } from 'drizzle-orm'
import crypto from 'crypto'
import { db } from '../db/index.js'
import { oauthAccounts, oauthStates, trials, users } from '../db/schema.js'
import {
  addSecondsIso,
  createSession,
  destroySession,
  generateSecretToken,
  getCurrentUser,
  hashToken,
  nowIso,
  sanitizeReturnTo,
  verifyTokenHash,
} from '../auth.js'

const router = Router()

const GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth'
const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token'
const GOOGLE_USERINFO_URL = 'https://www.googleapis.com/oauth2/v3/userinfo'
const OAUTH_STATE_TTL_SECONDS = 10 * 60

const ClaimTrialsSchema = z.object({
  claims: z.array(z.object({
    id: z.string().min(1),
    claimToken: z.string().min(1),
  })).max(100),
})

interface GoogleTokenResponse {
  access_token?: string
  error?: string
}

interface GoogleUserInfo {
  sub: string
  email: string
  email_verified: boolean
  name?: string
  picture?: string
}

function requireGoogleEnv() {
  const clientId = process.env.GOOGLE_CLIENT_ID
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET
  const redirectUri = process.env.GOOGLE_REDIRECT_URI
  if (!clientId || !clientSecret || !redirectUri) {
    throw new Error('Google OAuth is not configured')
  }
  return { clientId, clientSecret, redirectUri }
}

function codeChallenge(verifier: string): string {
  return crypto.createHash('sha256').update(verifier).digest('base64url')
}

function slugify(value: string): string {
  const base = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return base || `user-${nanoid(6)}`
}

function appRedirect(path: string): string {
  return new URL(path, process.env.APP_BASE_URL || 'http://localhost:5173').toString()
}

async function uniqueProfileSlug(seed: string): Promise<string> {
  const base = slugify(seed)
  for (let i = 0; i < 20; i += 1) {
    const candidate = i === 0 ? base : `${base}-${i + 1}`
    const [existing] = await db.select().from(users).where(eq(users.profileSlug, candidate)).limit(1)
    if (!existing) return candidate
  }
  return `${base}-${nanoid(8)}`
}

async function findOrCreateGoogleUser(profile: GoogleUserInfo): Promise<typeof users.$inferSelect> {
  const now = nowIso()
  const [account] = await db
    .select()
    .from(oauthAccounts)
    .where(and(eq(oauthAccounts.provider, 'google'), eq(oauthAccounts.providerAccountId, profile.sub)))
    .limit(1)

  if (account) {
    const [user] = await db.select().from(users).where(eq(users.id, account.userId)).limit(1)
    if (!user) throw new Error('OAuth account has no user')
    await db.update(users).set({
      email: profile.email,
      displayName: profile.name || user.displayName,
      avatarUrl: profile.picture ?? user.avatarUrl,
      updatedAt: now,
    }).where(eq(users.id, user.id))
    return { ...user, email: profile.email, displayName: profile.name || user.displayName, avatarUrl: profile.picture ?? user.avatarUrl, updatedAt: now }
  }

  const [existingUser] = await db.select().from(users).where(eq(users.email, profile.email)).limit(1)
  const user = existingUser ?? {
    id: nanoid(12),
    email: profile.email,
    displayName: profile.name || profile.email.split('@')[0],
    profileSlug: await uniqueProfileSlug(profile.name || profile.email.split('@')[0]),
    avatarUrl: profile.picture ?? null,
    createdAt: now,
    updatedAt: now,
  }

  if (!existingUser) {
    await db.insert(users).values(user)
  } else {
    await db.update(users).set({
      displayName: profile.name || existingUser.displayName,
      avatarUrl: profile.picture ?? existingUser.avatarUrl,
      updatedAt: now,
    }).where(eq(users.id, existingUser.id))
  }

  await db.insert(oauthAccounts).values({
    id: nanoid(12),
    userId: user.id,
    provider: 'google',
    providerAccountId: profile.sub,
    email: profile.email,
    createdAt: now,
    updatedAt: now,
  })

  return user
}

router.get('/google/start', async (req, res) => {
  try {
    const { clientId, redirectUri } = requireGoogleEnv()
    const state = generateSecretToken(24)
    const verifier = generateSecretToken(48)
    const returnTo = sanitizeReturnTo(req.query.returnTo)
    const now = nowIso()

    await db.insert(oauthStates).values({
      id: hashToken(state),
      codeVerifier: verifier,
      returnTo,
      expiresAt: addSecondsIso(OAUTH_STATE_TTL_SECONDS),
      createdAt: now,
    })

    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: 'openid email profile',
      state,
      code_challenge: codeChallenge(verifier),
      code_challenge_method: 'S256',
    })

    res.redirect(`${GOOGLE_AUTH_URL}?${params.toString()}`)
  } catch (err) {
    console.error('[GET /auth/google/start]', err)
    res.status(500).json({ error: 'Google sign-in is not configured' })
  }
})

router.get('/google/callback', async (req, res) => {
  try {
    const { clientId, clientSecret, redirectUri } = requireGoogleEnv()
    const code = typeof req.query.code === 'string' ? req.query.code : null
    const state = typeof req.query.state === 'string' ? req.query.state : null
    if (!code || !state) {
      res.redirect(appRedirect('/?auth_error=missing_oauth_response'))
      return
    }

    const stateId = hashToken(state)
    const [storedState] = await db.select().from(oauthStates).where(eq(oauthStates.id, stateId)).limit(1)
    await db.delete(oauthStates).where(eq(oauthStates.id, stateId))
    if (!storedState || new Date(storedState.expiresAt).getTime() <= Date.now()) {
      res.redirect(appRedirect('/?auth_error=expired_oauth_state'))
      return
    }

    const tokenRes = await fetch(GOOGLE_TOKEN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
        code,
        code_verifier: storedState.codeVerifier,
      }),
    })
    const tokenJson = await tokenRes.json() as GoogleTokenResponse
    if (!tokenRes.ok || !tokenJson.access_token) {
      console.error('[Google OAuth] token error:', tokenJson)
      res.redirect(appRedirect('/?auth_error=token_exchange_failed'))
      return
    }

    const profileRes = await fetch(GOOGLE_USERINFO_URL, {
      headers: { Authorization: `Bearer ${tokenJson.access_token}` },
    })
    const profile = await profileRes.json() as GoogleUserInfo
    if (!profileRes.ok || !profile.email_verified) {
      res.redirect(appRedirect('/?auth_error=email_not_verified'))
      return
    }

    const user = await findOrCreateGoogleUser(profile)
    await createSession(res, user.id)
    res.redirect(appRedirect(storedState.returnTo))
  } catch (err) {
    console.error('[GET /auth/google/callback]', err)
    res.redirect(appRedirect('/?auth_error=sign_in_failed'))
  }
})

router.get('/me', async (req, res) => {
  const user = await getCurrentUser(req)
  res.json({ user })
})

router.post('/logout', async (req, res) => {
  await destroySession(req, res)
  res.json({ success: true })
})

router.post('/claim-trials', async (req, res) => {
  try {
    const user = await getCurrentUser(req)
    if (!user) {
      res.status(401).json({ error: 'Sign in required' })
      return
    }

    const parsed = ClaimTrialsSchema.safeParse(req.body)
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.issues[0]?.message ?? 'Invalid claims' })
      return
    }

    const claimedIds: string[] = []
    for (const claim of parsed.data.claims) {
      const [trial] = await db.select().from(trials).where(eq(trials.id, claim.id)).limit(1)
      if (!trial) continue
      if (trial.userId === user.id) {
        claimedIds.push(trial.id)
        continue
      }
      if (trial.userId || !verifyTokenHash(claim.claimToken, trial.claimTokenHash)) continue
      await db.update(trials).set({ userId: user.id, claimTokenHash: null }).where(eq(trials.id, trial.id))
      claimedIds.push(trial.id)
    }

    res.json({ claimedIds })
  } catch (err) {
    console.error('[POST /auth/claim-trials]', err)
    res.status(500).json({ error: 'Failed to claim trials' })
  }
})

export default router
