import { Router } from 'express'
import { db } from '../db/index.js'
import { trials, panelJudgments } from '../db/schema.js'
import { eq, and, desc, inArray } from 'drizzle-orm'
import { SAMPLE_VERDICTS } from '../samples.js'
import {
  parseGallerySort,
  computePanelDisagreement,
  sortGalleryVerdicts,
} from '../gallery-sort.js'

const router = Router()

router.get('/', async (req, res) => {
  try {
    const sort = parseGallerySort(req.query.sort ?? req.query.filter)

    const dbTrials = await db
      .select()
      .from(trials)
      .where(and(eq(trials.status, 'completed'), eq(trials.isPublic, 1)))
      .orderBy(desc(trials.createdAt))
      .limit(20)

    const trialIds = dbTrials.map((t) => t.id)
    const panelRows =
      trialIds.length > 0
        ? await db
            .select()
            .from(panelJudgments)
            .where(inArray(panelJudgments.trialId, trialIds))
        : []

    const leaningsByTrial = new Map<string, Array<'guilty' | 'not_guilty' | 'complicated'>>()
    for (const row of panelRows) {
      const leaning = row.leaning as 'guilty' | 'not_guilty' | 'complicated'
      const list = leaningsByTrial.get(row.trialId) ?? []
      list.push(leaning)
      leaningsByTrial.set(row.trialId, list)
    }

    const realVerdicts = dbTrials
      .filter((t) => t.shareCardJson)
      .map((t) => {
        const leanings = leaningsByTrial.get(t.id) ?? []
        return {
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
          panelDisagreement: computePanelDisagreement(leanings),
        }
      })

    const samples = SAMPLE_VERDICTS.map((s) => ({
      ...s,
      panelDisagreement: 0,
    }))

    const sorted = sortGalleryVerdicts([...realVerdicts, ...samples], sort).slice(0, 20)

    const verdicts = sorted.map(({ panelDisagreement: _d, ...rest }) => rest)

    res.json({ verdicts, total: verdicts.length, realCount: realVerdicts.length, sort })
  } catch (err) {
    console.error('[GET /gallery]', err)
    res.status(500).json({ error: 'Failed to load gallery' })
  }
})

export default router
