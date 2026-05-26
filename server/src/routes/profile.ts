import { Router } from 'express'
import { desc, eq } from 'drizzle-orm'
import { parseLocale } from '@the-tribunal/contracts'
import { db } from '../db/index.js'
import { trials } from '../db/schema.js'
import { getCurrentUser } from '../auth.js'

const router = Router()

router.get('/trials', async (req, res) => {
  try {
    const user = await getCurrentUser(req)
    if (!user) {
      res.status(401).json({ error: 'Sign in required' })
      return
    }

    const rows = await db
      .select()
      .from(trials)
      .where(eq(trials.userId, user.id))
      .orderBy(desc(trials.createdAt))

    res.json({
      trials: rows.map((trial) => ({
        id: trial.id,
        status: trial.status,
        tribunalType: trial.tribunalType,
        caseSummary: trial.caseSummary,
        caseText: trial.caseText,
        verdict: trial.verdict,
        score: trial.score,
        scoreLabel: trial.scoreLabel,
        locale: parseLocale(trial.locale),
        isPublic: trial.isPublic === 1,
        appealOfId: trial.appealOfId,
        appealGround: trial.appealGround,
        createdAt: trial.createdAt,
        completedAt: trial.completedAt,
      })),
    })
  } catch (err) {
    console.error('[GET /profile/trials]', err)
    res.status(500).json({ error: 'Failed to load profile trials' })
  }
})

export default router
