import { Router } from 'express'
import { db } from '../db/index.js'
import { trials } from '../db/schema.js'
import { eq, and, desc } from 'drizzle-orm'
import { SAMPLE_VERDICTS } from '../samples.js'

const router = Router()

router.get('/', async (req, res) => {
  try {
    const { filter } = req.query

    const dbTrials = await db
      .select()
      .from(trials)
      .where(and(eq(trials.status, 'completed'), eq(trials.isPublic, 1)))
      .orderBy(desc(trials.createdAt))
      .limit(20)

    const realVerdicts = dbTrials
      .filter((t) => t.shareCardJson)
      .map((t) => ({
        id: t.id,
        tribunalType: t.tribunalType,
        verdict: t.verdict ?? '',
        charge: t.charge ?? '',
        score: t.score ?? 0,
        scoreLabel: t.scoreLabel ?? '',
        caseSummary: t.caseSummary ?? '',
        caseText: t.caseText,
        sentence: t.sentence ?? '',
        isExample: false,
        shareCard: JSON.parse(t.shareCardJson!),
        createdAt: t.createdAt,
      }))

    const combined = [...realVerdicts, ...SAMPLE_VERDICTS]

    let sorted = [...combined]
    if (filter === 'guilty') sorted = sorted.sort((a, b) => b.score - a.score)
    if (filter === 'innocent') sorted = sorted.sort((a, b) => a.score - b.score)
    if (filter === 'divisive') sorted = sorted.sort(() => Math.random() - 0.5)
    if (filter === 'recent') sorted = sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    res.json({ verdicts: sorted, total: sorted.length, realCount: realVerdicts.length })
  } catch (err) {
    console.error('[GET /gallery]', err)
    res.status(500).json({ error: 'Failed to load gallery' })
  }
})

export default router
