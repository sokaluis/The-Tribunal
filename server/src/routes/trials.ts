import { Router } from 'express'
import { z } from 'zod'
import { nanoid } from 'nanoid'
import { db } from '../db/index.js'
import { trials, trialTurns, panelJudgments } from '../db/schema.js'
import { eq } from 'drizzle-orm'
import { TRIBUNAL_IDS } from '../tribunals.js'
import { runPipeline, SAFETY_RESOURCES } from '../pipeline/index.js'
import type { TrialResponse } from '../types.js'
import { APPEAL_GROUNDS } from '../types.js'
import {
  generateSecretToken,
  getClaimToken,
  getCurrentUser,
  hashToken,
  verifyTokenHash,
  type PublicUser,
} from '../auth.js'

const router = Router()

const CreateTrialSchema = z.object({
  caseText: z.string().min(10, 'Case must be at least 10 characters').max(3000, 'Case must be at most 3000 characters'),
  tribunalType: z.enum(TRIBUNAL_IDS as [string, ...string[]]),
})

const AppealSchema = z.object({
  tribunalType: z.enum(TRIBUNAL_IDS as [string, ...string[]]),
  appealGround: z.enum(APPEAL_GROUNDS as unknown as [string, ...string[]]),
  appealText: z.string().max(1000, 'Appeal text must be at most 1000 characters').optional().default(''),
})

function buildTrialResponse(
  trial: typeof trials.$inferSelect,
  panelRows: typeof panelJudgments.$inferSelect[],
  turns: typeof trialTurns.$inferSelect[],
  options: { exposeAppealOfId?: boolean } = {}
): TrialResponse {
  if (trial.status === 'pending' || trial.status === 'processing') {
    return {
      id: trial.id,
      status: trial.status,
      currentStep: (trial.currentStep as 'normalizing' | 'prosecuting' | 'judging' | 'finalizing' | null) ?? null,
    }
  }

  if (trial.status === 'failed') {
    return {
      id: trial.id,
      status: 'failed',
      error: 'Something went wrong during the trial. Please try again.',
    }
  }

  if (trial.status === 'safety_blocked') {
    return {
      id: trial.id,
      status: 'safety_blocked',
      safetyMessage: trial.safetyMessage ?? 'This submission could not be processed.',
      safetyType: (trial.safetyType as 'crisis' | 'content_policy' | null) ?? 'crisis',
      resources: trial.safetyType === 'content_policy' ? [] : SAFETY_RESOURCES,
    }
  }

  const prosecuteTurn = turns.find((t) => t.phase === 'prosecute')
  const defendTurn = turns.find((t) => t.phase === 'defend')

  const shareCard = trial.shareCardJson ? JSON.parse(trial.shareCardJson) : null

  return {
    id: trial.id,
    caseText: trial.caseText,
    caseSummary: trial.caseSummary ?? '',
    tribunalType: trial.tribunalType,
    createdAt: trial.createdAt,
    completedAt: trial.completedAt,
    status: 'completed',
    charge: trial.charge ?? '',
    verdict: trial.verdict ?? '',
    score: trial.score ?? 0,
    scoreLabel: trial.scoreLabel ?? '',
    prosecution: {
      title: 'The case against you',
      argument: prosecuteTurn ? JSON.parse(prosecuteTurn.contentJson).argument : '',
    },
    defense: {
      title: 'The best defense',
      argument: defendTurn ? JSON.parse(defendTurn.contentJson).argument : '',
    },
    panelJudgments: panelRows.map((p) => ({
      agentName: p.agentName,
      role: p.role,
      judgment: p.judgment,
      leaning: p.leaning as 'guilty' | 'not_guilty' | 'complicated',
      keyPrinciple: p.keyPrinciple,
    })),
    finalReasoning: trial.finalReasoning ?? '',
    sentence: trial.sentence ?? '',
    shareCard,
    appealOfId: options.exposeAppealOfId === false ? null : trial.appealOfId,
    appealGround: trial.appealGround as typeof APPEAL_GROUNDS[number] | null,
    appealText: trial.appealText ?? null,
    isPublic: trial.isPublic === 1,
  }
}

function canAccessTrial(
  trial: typeof trials.$inferSelect,
  user: PublicUser | null,
  claimToken: string | undefined
): boolean {
  return trial.isPublic === 1 ||
    (!!user && trial.userId === user.id) ||
    verifyTokenHash(claimToken, trial.claimTokenHash)
}

function canMutateTrial(
  trial: typeof trials.$inferSelect,
  user: PublicUser | null,
  claimToken: string | undefined
): boolean {
  return (!!user && trial.userId === user.id) || verifyTokenHash(claimToken, trial.claimTokenHash)
}

router.post('/', async (req, res) => {
  try {
    const user = await getCurrentUser(req)
    const body = CreateTrialSchema.safeParse(req.body)
    if (!body.success) {
      res.status(400).json({ error: body.error.issues[0]?.message ?? 'Invalid input' })
      return
    }

    const { caseText, tribunalType } = body.data
    const id = nanoid(12)
    const createdAt = new Date().toISOString()
    const claimToken = user ? null : generateSecretToken()

    await db.insert(trials).values({
      id,
      userId: user?.id ?? null,
      claimTokenHash: claimToken ? hashToken(claimToken) : null,
      caseText,
      tribunalType,
      status: 'pending',
      createdAt,
      pipelineVersion: '1.0',
    })

    setImmediate(() => {
      runPipeline(id).catch((err) => {
        console.error(`[Route] Unhandled pipeline error for ${id}:`, err)
      })
    })

    res.status(202).json({ id, status: 'pending', ...(claimToken ? { claimToken } : {}) })
  } catch (err) {
    console.error('[POST /trials]', err)
    res.status(500).json({ error: 'Failed to create trial' })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const user = await getCurrentUser(req)
    const claimToken = getClaimToken(req)
    const [trial] = await db.select().from(trials).where(eq(trials.id, req.params.id)).limit(1)
    if (!trial) {
      res.status(404).json({ error: 'Trial not found' })
      return
    }
    if (!canAccessTrial(trial, user, claimToken)) {
      res.status(404).json({ error: 'Trial not found' })
      return
    }

    let panelRows: typeof panelJudgments.$inferSelect[] = []
    let turns: typeof trialTurns.$inferSelect[] = []
    if (trial.status === 'completed') {
      ;[panelRows, turns] = await Promise.all([
        db.select().from(panelJudgments).where(eq(panelJudgments.trialId, trial.id)),
        db.select().from(trialTurns).where(eq(trialTurns.trialId, trial.id)),
      ])
    }

    let exposeAppealOfId = true
    if (trial.appealOfId) {
      const [original] = await db.select().from(trials).where(eq(trials.id, trial.appealOfId)).limit(1)
      exposeAppealOfId = !!original && canAccessTrial(original, user, claimToken)
    }

    const response = buildTrialResponse(trial, panelRows, turns, { exposeAppealOfId })
    res.json(response)
  } catch (err) {
    console.error('[GET /trials/:id]', err)
    res.status(500).json({ error: 'Failed to fetch trial' })
  }
})

router.post('/:id/appeal', async (req, res) => {
  try {
    const user = await getCurrentUser(req)
    const claimToken = getClaimToken(req)
    const [original] = await db.select().from(trials).where(eq(trials.id, req.params.id)).limit(1)
    if (!original) {
      res.status(404).json({ error: 'Original trial not found' })
      return
    }
    if (!canAccessTrial(original, user, claimToken)) {
      res.status(404).json({ error: 'Original trial not found' })
      return
    }
    if (original.status !== 'completed') {
      res.status(400).json({ error: 'Only completed trials can be appealed' })
      return
    }
    const hasOriginalClaim = verifyTokenHash(claimToken, original.claimTokenHash)
    if (original.isPublic === 1 && !user && !hasOriginalClaim) {
      res.status(401).json({ error: 'Sign in to appeal public trials' })
      return
    }

    const body = AppealSchema.safeParse(req.body)
    if (!body.success) {
      res.status(400).json({ error: body.error.issues[0]?.message ?? 'Invalid appeal input' })
      return
    }

    const { tribunalType, appealGround, appealText } = body.data

    const id = nanoid(12)
    const createdAt = new Date().toISOString()
    const newClaimToken = user ? null : generateSecretToken()

    await db.insert(trials).values({
      id,
      userId: user?.id ?? null,
      claimTokenHash: newClaimToken ? hashToken(newClaimToken) : null,
      caseText: original.caseText,
      tribunalType,
      status: 'pending',
      appealOfId: original.id,
      appealGround,
      appealText: appealText || null,
      createdAt,
      pipelineVersion: '1.0',
    })

    setImmediate(() => {
      runPipeline(id).catch((err) => {
        console.error(`[Route] Unhandled pipeline error for appeal ${id}:`, err)
      })
    })

    res.status(202).json({ id, status: 'pending', ...(newClaimToken ? { claimToken: newClaimToken } : {}) })
  } catch (err) {
    console.error('[POST /trials/:id/appeal]', err)
    res.status(500).json({ error: 'Failed to create appeal' })
  }
})

router.post('/:id/publish', async (req, res) => {
  try {
    const user = await getCurrentUser(req)
    const claimToken = getClaimToken(req)
    const [trial] = await db.select().from(trials).where(eq(trials.id, req.params.id)).limit(1)
    if (!trial) {
      res.status(404).json({ error: 'Trial not found' })
      return
    }
    if (trial.status !== 'completed') {
      res.status(400).json({ error: 'Only completed trials can be published' })
      return
    }
    if (!canMutateTrial(trial, user, claimToken)) {
      res.status(404).json({ error: 'Trial not found' })
      return
    }
    await db.update(trials).set({ isPublic: 1 }).where(eq(trials.id, trial.id))
    res.json({ success: true })
  } catch (err) {
    console.error('[POST /trials/:id/publish]', err)
    res.status(500).json({ error: 'Failed to publish trial' })
  }
})

export default router
