import crypto from 'crypto'
import type { Request, Response } from 'express'
import { eq } from 'drizzle-orm'
import { db } from './db/index.js'
import { sessions, users, type User } from './db/schema.js'

export const SESSION_COOKIE = 'tribunal_session'
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30

export interface PublicUser {
  id: string
  email: string
  displayName: string
  profileSlug: string
  avatarUrl: string | null
}

export function nowIso(): string {
  return new Date().toISOString()
}

export function addSecondsIso(seconds: number): string {
  return new Date(Date.now() + seconds * 1000).toISOString()
}

export function generateSecretToken(byteLength = 32): string {
  return crypto.randomBytes(byteLength).toString('base64url')
}

export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('base64url')
}

export function verifyTokenHash(token: string | undefined, expectedHash: string | null): boolean {
  if (!token || !expectedHash) return false
  const actualHash = hashToken(token)
  const actual = Buffer.from(actualHash)
  const expected = Buffer.from(expectedHash)
  return actual.length === expected.length && crypto.timingSafeEqual(actual, expected)
}

export function toPublicUser(user: User): PublicUser {
  return {
    id: user.id,
    email: user.email,
    displayName: user.displayName,
    profileSlug: user.profileSlug,
    avatarUrl: user.avatarUrl,
  }
}

function parseCookies(header: string | undefined): Record<string, string> {
  if (!header) return {}
  return Object.fromEntries(
    header
      .split(';')
      .map((part) => part.trim())
      .filter(Boolean)
      .map((part) => {
        const index = part.indexOf('=')
        if (index === -1) return [part, '']
        return [part.slice(0, index), decodeURIComponent(part.slice(index + 1))]
      })
  )
}

function cookieOptions(maxAgeSeconds: number): string {
  const parts = [
    `Path=/`,
    `Max-Age=${maxAgeSeconds}`,
    `HttpOnly`,
    `SameSite=Lax`,
  ]
  if (process.env.NODE_ENV === 'production') parts.push('Secure')
  return parts.join('; ')
}

export function getSessionToken(req: Request): string | null {
  return parseCookies(req.headers.cookie)[SESSION_COOKIE] ?? null
}

export async function getCurrentUser(req: Request): Promise<PublicUser | null> {
  const token = getSessionToken(req)
  if (!token) return null

  const sessionId = hashToken(token)
  const [session] = await db.select().from(sessions).where(eq(sessions.id, sessionId)).limit(1)
  if (!session || new Date(session.expiresAt).getTime() <= Date.now()) return null

  const [user] = await db.select().from(users).where(eq(users.id, session.userId)).limit(1)
  return user ? toPublicUser(user) : null
}

export async function createSession(res: Response, userId: string): Promise<void> {
  const token = generateSecretToken()
  await db.insert(sessions).values({
    id: hashToken(token),
    userId,
    expiresAt: addSecondsIso(SESSION_MAX_AGE_SECONDS),
    createdAt: nowIso(),
  })
  res.setHeader('Set-Cookie', `${SESSION_COOKIE}=${encodeURIComponent(token)}; ${cookieOptions(SESSION_MAX_AGE_SECONDS)}`)
}

export async function destroySession(req: Request, res: Response): Promise<void> {
  const token = getSessionToken(req)
  if (token) {
    await db.delete(sessions).where(eq(sessions.id, hashToken(token)))
  }
  res.setHeader('Set-Cookie', `${SESSION_COOKIE}=; ${cookieOptions(0)}`)
}

export function sanitizeReturnTo(value: unknown): string {
  if (typeof value !== 'string' || !value.startsWith('/') || value.startsWith('//')) return '/'
  return value
}

export function getClaimToken(req: Request): string | undefined {
  const value = req.headers['x-trial-claim-token']
  return Array.isArray(value) ? value[0] : value
}

