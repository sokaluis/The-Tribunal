import { Router } from 'express'
import { db } from '../db/index.js'
import { trials } from '../db/schema.js'
import { eq, and, desc } from 'drizzle-orm'

const router = Router()

const SAMPLE_VERDICTS = [
  {
    id: 'sample_001',
    tribunalType: 'relationship',
    verdict: 'Guilty, with mitigating circumstances',
    charge: 'Weaponizing busyness as a substitute for emotional honesty.',
    score: 72,
    scoreLabel: 'Relationship Damage Score',
    caseSummary: 'The defendant ghosted a close friend for three weeks while overwhelmed, offering no explanation.',
    caseText: "I ghosted a close friend for three weeks because I was overwhelmed and didn't want to explain myself.",
    sentence: 'Send one honest message. Under 120 words. No dramatic monologue.',
    isExample: true,
    shareCard: {
      caseNumber: '00421',
      headline: 'THE TRIBUNAL HAS SPOKEN',
      shortCase: 'I ghosted a friend for three weeks.',
      verdict: 'Guilty, with mitigating circumstances',
      charge: 'Cowardice disguised as self-care.',
      recognized: 'You were genuinely overwhelmed.',
      rejected: 'That silence counts as communication.',
      sentence: 'Send one honest message under 120 words.',
    },
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'sample_002',
    tribunalType: 'moral',
    verdict: 'Technically innocent, spiritually guilty',
    charge: 'Violating the categorical imperative with a smile.',
    score: 61,
    scoreLabel: 'Moral Score',
    caseSummary: 'The defendant lied to spare a friend\'s feelings about a creative project they had worked on for months.',
    caseText: "I told a friend their creative project was great when I honestly thought it was mediocre, because I didn't want to hurt them.",
    sentence: 'Find one true thing to say. Praise it. Build from there.',
    isExample: true,
    shareCard: {
      caseNumber: '01837',
      headline: 'THE TRIBUNAL HAS SPOKEN',
      shortCase: 'I lied to avoid hurting someone\'s feelings.',
      verdict: 'Technically innocent, spiritually guilty',
      charge: 'Violating the categorical imperative with a smile.',
      recognized: 'Your motive was kindness.',
      rejected: 'That kindness was conditional on your comfort.',
      sentence: 'Find one true thing to say. Praise it. Build from there.',
    },
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    id: 'sample_003',
    tribunalType: 'idea',
    verdict: 'Guilty of founder delusion',
    charge: 'Mistaking enthusiasm for a market.',
    score: 78,
    scoreLabel: 'Viability Score',
    caseSummary: 'The defendant purchased a domain name for a startup before defining the product, target user, or revenue model.',
    caseText: "I bought a domain for a startup idea before I knew what the product was, who the customer was, or whether anyone would want it.",
    sentence: 'Talk to five potential users before buying another domain.',
    isExample: true,
    shareCard: {
      caseNumber: '02954',
      headline: 'THE TRIBUNAL HAS SPOKEN',
      shortCase: 'I bought a domain before knowing what the product was.',
      verdict: 'Guilty of founder delusion',
      charge: 'Mistaking enthusiasm for a market.',
      recognized: 'The energy is real.',
      rejected: 'That a domain name is a business plan.',
      sentence: 'Talk to five potential users before buying another domain.',
    },
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    id: 'sample_004',
    tribunalType: 'opinion',
    verdict: 'Mostly correct, badly framed',
    charge: 'Smuggling a valid critique inside a provocative overstatement.',
    score: 44,
    scoreLabel: 'Argument Strength',
    caseSummary: 'The defendant argued that most productivity advice is secular religion for anxious people.',
    caseText: "Most productivity advice is secular religion for anxious people. It doesn't make you more effective. It just lets you feel virtuous about being busy.",
    sentence: 'Make the actual argument. It\'s stronger without the performance.',
    isExample: true,
    shareCard: {
      caseNumber: '03612',
      headline: 'THE TRIBUNAL HAS SPOKEN',
      shortCase: 'Most productivity advice is secular religion for anxious people.',
      verdict: 'Mostly correct, badly framed',
      charge: 'Smuggling a valid critique inside a provocative overstatement.',
      recognized: 'The underlying critique has genuine merit.',
      rejected: 'That cynicism substitutes for a better alternative.',
      sentence: 'Make the actual argument. It\'s stronger without the performance.',
    },
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
]

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
