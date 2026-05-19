import { eq } from 'drizzle-orm'
import { db } from './db/index.js'
import { panelJudgments, trials, trialTurns } from './db/schema.js'
import { TRIBUNALS, type TribunalId } from './tribunals.js'
import type { PanelJudgmentResult, ShareCard } from './types.js'

type SeedPanelJudgment = Omit<PanelJudgmentResult, 'agentName' | 'role'>

type SeedTurn = {
  phase: string
  agentName: string
  role: string
  contentJson: Record<string, unknown> | SeedPanelJudgment[]
  rawText: string
}

type SeedSampleTrial = {
  id: string
  caseText: string
  tribunalType: TribunalId
  caseSummary: string
  charge: string
  verdict: string
  score: number
  finalReasoning: string
  sentence: string
  shareCard: ShareCard
  createdAt: string
  turns: SeedTurn[]
  panelJudgments: SeedPanelJudgment[]
}

export const SEEDED_SAMPLE_IDS = ['sample_001', 'sample_002', 'sample_003', 'sample_004'] as const

function buildSeedPanelJudgments(sample: SeedSampleTrial): PanelJudgmentResult[] {
  const tribunal = TRIBUNALS[sample.tribunalType]
  if (!tribunal.possibleVerdicts.includes(sample.verdict)) {
    throw new Error(`Seed sample ${sample.id} uses unsupported ${tribunal.name} verdict: ${sample.verdict}`)
  }
  if (sample.panelJudgments.length !== tribunal.panelAgents.length) {
    throw new Error(`Seed sample ${sample.id} must define ${tribunal.panelAgents.length} panel judgments`)
  }

  return sample.panelJudgments.map((judgment, index) => {
    const agent = tribunal.panelAgents[index]
    return {
      agentName: agent.name,
      role: agent.role,
      ...judgment,
    }
  })
}

const SEEDED_SAMPLE_TRIALS: SeedSampleTrial[] = [
  {
    id: 'sample_001',
    tribunalType: 'relationship',
    verdict: 'Bad communication',
    charge: 'Weaponizing busyness as a substitute for emotional honesty.',
    score: 72,
    caseSummary: 'The defendant ghosted a close friend for three weeks while overwhelmed, offering no explanation.',
    caseText: "I ghosted a close friend for three weeks because I was overwhelmed and didn't want to explain myself.",
    finalReasoning:
      'The court accepts that overwhelm can make even simple replies feel expensive. But the relationship offense is not needing space; it is turning silence into the other person\'s problem to interpret. A short, honest message would have preserved dignity on both sides.',
    sentence: 'Send one honest message. Under 120 words. No dramatic monologue.',
    shareCard: {
      caseNumber: '00421',
      headline: 'THE TRIBUNAL HAS SPOKEN',
      shortCase: 'I ghosted a friend for three weeks.',
      verdict: 'Bad communication',
      charge: 'Cowardice disguised as self-care.',
      recognized: 'You were genuinely overwhelmed.',
      rejected: 'That silence counts as communication.',
      sentence: 'Send one honest message under 120 words.',
    },
    createdAt: '2026-01-14T16:00:00.000Z',
    turns: [
      {
        phase: 'normalize',
        agentName: 'Clerk',
        role: 'Clerk',
        contentJson: {
          caseSummary: 'The defendant ghosted a close friend for three weeks while overwhelmed, offering no explanation.',
          shortCase: 'I ghosted a friend for three weeks.',
        },
        rawText: 'The case concerns prolonged silence toward a close friend while the defendant was overwhelmed.',
      },
      {
        phase: 'prosecute',
        agentName: 'Prosecutor',
        role: 'Prosecutor',
        contentJson: {
          charge: 'Weaponizing busyness as a substitute for emotional honesty.',
          argument:
            'The defendant did not merely take space; they exported the emotional cost of that space onto a close friend. Three weeks of silence invites worry, self-blame, and confusion. A minimal message would have been enough to respect the relationship without requiring a full explanation.',
          strongestPoint: 'The wrongdoing is the unexplained duration, not the need for distance.',
        },
        rawText:
          'The prosecution argues that silence became a substitute for emotional honesty and made the friend carry the uncertainty.',
      },
      {
        phase: 'defend',
        agentName: 'Defender',
        role: 'Defender',
        contentJson: {
          argument:
            'The defendant was overwhelmed, not malicious. People sometimes disappear because they are ashamed of not having a polished explanation. That does not make the silence harmless, but it does make the case less about cruelty and more about repairable avoidance.',
          mitigatingFactors: ['The defendant was overwhelmed.', 'There is no evidence of intent to punish or manipulate the friend.'],
          strongestPoint: 'The behavior is fixable with a plain apology and a small communication habit.',
        },
        rawText: 'The defense emphasizes overwhelm, shame, and the absence of malicious intent.',
      },
      {
        phase: 'panel',
        agentName: 'Panel',
        role: 'Panel',
        contentJson: [
          {
            judgment: 'The silence looks less like a need for space and more like avoidance that left the friend to carry uncertainty.',
            leaning: 'guilty',
            keyPrinciple: 'Emotional overwhelm is real, but repair starts with naming it plainly.',
          },
          {
            judgment: 'Needing space is allowed; disappearing without even a small signal is the relational breach.',
            leaning: 'guilty',
            keyPrinciple: 'A boundary should not require the other person to guess whether they still matter.',
          },
          {
            judgment: 'The observable facts are simple: a close friend received no explanation for three weeks, which violates ordinary reciprocity.',
            leaning: 'complicated',
            keyPrinciple: 'Intent mitigates, but it does not erase a broken implicit social obligation.',
          },
          {
            judgment: 'The ideal relationship version of this is not constant availability; it is one gentle signal that says the bond still matters.',
            leaning: 'guilty',
            keyPrinciple: 'Care can be brief and still be real.',
          },
        ],
        rawText: 'The panel finds a real but repairable breach of relationship etiquette.',
      },
      {
        phase: 'finalize',
        agentName: 'Final Judge',
        role: 'Final Judge',
        contentJson: {
          verdict: 'Bad communication',
          score: 72,
          finalReasoning:
            'The court accepts that overwhelm can make even simple replies feel expensive. But the relationship offense is not needing space; it is turning silence into the other person\'s problem to interpret. A short, honest message would have preserved dignity on both sides.',
          sentence: 'Send one honest message. Under 120 words. No dramatic monologue.',
        },
        rawText: 'Final ruling: bad communication with mitigation, sentence limited to one honest repair message.',
      },
    ],
    panelJudgments: [
      {
        judgment: 'The silence looks less like a need for space and more like avoidance that left the friend to carry uncertainty.',
        leaning: 'guilty',
        keyPrinciple: 'Emotional overwhelm is real, but repair starts with naming it plainly.',
      },
      {
        judgment: 'Needing space is allowed; disappearing without even a small signal is the relational breach.',
        leaning: 'guilty',
        keyPrinciple: 'A boundary should not require the other person to guess whether they still matter.',
      },
      {
        judgment: 'The observable facts are simple: a close friend received no explanation for three weeks, which violates ordinary reciprocity.',
        leaning: 'complicated',
        keyPrinciple: 'Intent mitigates, but it does not erase a broken implicit social obligation.',
      },
      {
        judgment: 'The ideal relationship version of this is not constant availability; it is one gentle signal that says the bond still matters.',
        leaning: 'guilty',
        keyPrinciple: 'Care can be brief and still be real.',
      },
    ],
  },
  {
    id: 'sample_002',
    tribunalType: 'moral',
    verdict: 'Technically innocent, spiritually guilty',
    charge: 'Violating the categorical imperative with a smile.',
    score: 61,
    caseSummary: 'The defendant lied to spare a friend\'s feelings about a creative project they had worked on for months.',
    caseText: "I told a friend their creative project was great when I honestly thought it was mediocre, because I didn't want to hurt them.",
    finalReasoning:
      'The motive was kindness, and that matters. Still, a moral system that treats every uncomfortable truth as optional eventually leaves people without useful feedback. The better path was not blunt cruelty, but honest specificity: praise what is real and be careful about what is not.',
    sentence: 'Find one true thing to say. Praise it. Build from there.',
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
    createdAt: '2026-01-11T16:00:00.000Z',
    turns: [
      {
        phase: 'normalize',
        agentName: 'Clerk',
        role: 'Clerk',
        contentJson: {
          caseSummary: 'The defendant lied to spare a friend\'s feelings about a creative project they had worked on for months.',
          shortCase: 'I lied to avoid hurting someone\'s feelings.',
        },
        rawText: 'The case concerns a kind motive expressed through dishonest praise.',
      },
      {
        phase: 'prosecute',
        agentName: 'Prosecutor',
        role: 'Prosecutor',
        contentJson: {
          charge: 'Violating the categorical imperative with a smile.',
          argument:
            'The defendant chose comfort over respect. A friend who worked for months deserved feedback anchored in reality, not a pleasant fog. The lie may have avoided one painful conversation, but it also denied the friend information they could use.',
          strongestPoint: 'False praise treats the friend as too fragile for truth and too distant for trust.',
        },
        rawText: 'The prosecution argues that dishonest praise is still dishonest, even with kind motives.',
      },
      {
        phase: 'defend',
        agentName: 'Defender',
        role: 'Defender',
        contentJson: {
          argument:
            'The defendant was trying to protect someone who cared deeply about the work. Not every social exchange requires a full critical review. The real failure was lack of nuance, not moral corruption.',
          mitigatingFactors: ['The motive was compassion.', 'The friend did not explicitly ask for rigorous critique.'],
          strongestPoint: 'A softer truthful answer was available, but the defendant was not acting selfishly.',
        },
        rawText: 'The defense argues for mitigation because the lie was protective rather than exploitative.',
      },
      {
        phase: 'panel',
        agentName: 'Panel',
        role: 'Panel',
        contentJson: [
          {
            judgment: 'The immediate consequence was comfort, but the longer-term cost is worse feedback and less trust.',
            leaning: 'complicated',
            keyPrinciple: 'Kind motives still need useful consequences.',
          },
          {
            judgment: 'The lie fails as a universal rule, but the motive keeps this out of villain territory.',
            leaning: 'complicated',
            keyPrinciple: 'Kindness should constrain truth, not replace it.',
          },
          {
            judgment: 'The virtuous answer would have been specific, gentle, and honest.',
            leaning: 'guilty',
            keyPrinciple: 'Courage and kindness are meant to cooperate.',
          },
          {
            judgment: 'The defendant controlled their own speech and chose ease over a reasoned, truthful response.',
            leaning: 'complicated',
            keyPrinciple: 'Virtue is practiced in the uncomfortable moment, not after it passes.',
          },
        ],
        rawText: 'The panel treats the act as a minor moral fault with substantial mitigation.',
      },
      {
        phase: 'finalize',
        agentName: 'Final Judge',
        role: 'Final Judge',
        contentJson: {
          verdict: 'Technically innocent, spiritually guilty',
          score: 61,
          finalReasoning:
            'The motive was kindness, and that matters. Still, a moral system that treats every uncomfortable truth as optional eventually leaves people without useful feedback. The better path was not blunt cruelty, but honest specificity: praise what is real and be careful about what is not.',
          sentence: 'Find one true thing to say. Praise it. Build from there.',
        },
        rawText: 'Final ruling: minor moral fault, corrected through specific truthful praise.',
      },
    ],
    panelJudgments: [
      {
        judgment: 'The immediate consequence was comfort, but the longer-term cost is worse feedback and less trust.',
        leaning: 'complicated',
        keyPrinciple: 'Kind motives still need useful consequences.',
      },
      {
        judgment: 'The lie fails as a universal rule, but the motive keeps this out of villain territory.',
        leaning: 'complicated',
        keyPrinciple: 'Kindness should constrain truth, not replace it.',
      },
      {
        judgment: 'The virtuous answer would have been specific, gentle, and honest.',
        leaning: 'guilty',
        keyPrinciple: 'Courage and kindness are meant to cooperate.',
      },
      {
        judgment: 'The defendant controlled their own speech and chose ease over a reasoned, truthful response.',
        leaning: 'complicated',
        keyPrinciple: 'Virtue is practiced in the uncomfortable moment, not after it passes.',
      },
    ],
  },
  {
    id: 'sample_003',
    tribunalType: 'idea',
    verdict: 'Guilty of founder delusion',
    charge: 'Mistaking enthusiasm for a market.',
    score: 78,
    caseSummary: 'The defendant purchased a domain name for a startup before defining the product, target user, or revenue model.',
    caseText: "I bought a domain for a startup idea before I knew what the product was, who the customer was, or whether anyone would want it.",
    finalReasoning:
      'Buying a domain is not a crime; confusing it with validation is. The idea may still become something useful, but the current evidence is only excitement plus a receipt. The court orders contact with reality before any further ceremonial entrepreneurship.',
    sentence: 'Talk to five potential users before buying another domain.',
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
    createdAt: '2026-01-15T16:00:00.000Z',
    turns: [
      {
        phase: 'normalize',
        agentName: 'Clerk',
        role: 'Clerk',
        contentJson: {
          caseSummary: 'The defendant purchased a domain name for a startup before defining the product, target user, or revenue model.',
          shortCase: 'I bought a domain before knowing what the product was.',
        },
        rawText: 'The case concerns premature startup symbolism before customer or product clarity.',
      },
      {
        phase: 'prosecute',
        agentName: 'Prosecutor',
        role: 'Prosecutor',
        contentJson: {
          charge: 'Mistaking enthusiasm for a market.',
          argument:
            'The defendant performed the aesthetics of a startup before doing the work of discovering a problem. A domain can feel like momentum, but it answers none of the essential questions: who hurts, what they need, and why this solution should exist.',
          strongestPoint: 'The purchase created emotional commitment without evidence.',
        },
        rawText: 'The prosecution argues the domain was symbolic momentum masquerading as validation.',
      },
      {
        phase: 'defend',
        agentName: 'Defender',
        role: 'Defender',
        contentJson: {
          argument:
            'A cheap domain can be a harmless motivational artifact. Many projects begin with playful commitment before clarity arrives. The problem is not the purchase itself, but letting the purchase substitute for discovery.',
          mitigatingFactors: ['The likely cost was low.', 'Early enthusiasm can help people start.'],
          strongestPoint: 'The act is silly only if it becomes a substitute for user research.',
        },
        rawText: 'The defense distinguishes harmless inspiration from genuine founder delusion.',
      },
      {
        phase: 'panel',
        agentName: 'Panel',
        role: 'Panel',
        contentJson: [
          {
            judgment: 'No customer, market, or willingness to pay has entered the room; the domain proves availability, not demand.',
            leaning: 'guilty',
            keyPrinciple: 'Markets validate pain, not vibes or URLs.',
          },
          {
            judgment: 'This is recoverable if the next move is interviews, not branding.',
            leaning: 'complicated',
            keyPrinciple: 'A bad first step can be rescued by a concrete next step.',
          },
          {
            judgment: 'A user cannot tell what problem this solves yet, because the product and target audience are still undefined.',
            leaning: 'guilty',
            keyPrinciple: 'A business idea needs a user pain before it needs a name.',
          },
          {
            judgment: 'The name may become useful later, but positioning cannot carry a concept that has no customer promise.',
            leaning: 'complicated',
            keyPrinciple: 'A memorable hook should clarify value, not hide missing substance.',
          },
        ],
        rawText: 'The panel finds premature branding with a straightforward corrective path.',
      },
      {
        phase: 'finalize',
        agentName: 'Final Judge',
        role: 'Final Judge',
        contentJson: {
          verdict: 'Guilty of founder delusion',
          score: 78,
          finalReasoning:
            'Buying a domain is not a crime; confusing it with validation is. The idea may still become something useful, but the current evidence is only excitement plus a receipt. The court orders contact with reality before any further ceremonial entrepreneurship.',
          sentence: 'Talk to five potential users before buying another domain.',
        },
        rawText: 'Final ruling: guilty of premature startup theater, sentenced to user interviews.',
      },
    ],
    panelJudgments: [
      {
        judgment: 'No customer, market, or willingness to pay has entered the room; the domain proves availability, not demand.',
        leaning: 'guilty',
        keyPrinciple: 'Markets validate pain, not vibes or URLs.',
      },
      {
        judgment: 'This is recoverable if the next move is interviews, not branding.',
        leaning: 'complicated',
        keyPrinciple: 'A bad first step can be rescued by a concrete next step.',
      },
      {
        judgment: 'A user cannot tell what problem this solves yet, because the product and target audience are still undefined.',
        leaning: 'guilty',
        keyPrinciple: 'A business idea needs a user pain before it needs a name.',
      },
      {
        judgment: 'The name may become useful later, but positioning cannot carry a concept that has no customer promise.',
        leaning: 'complicated',
        keyPrinciple: 'A memorable hook should clarify value, not hide missing substance.',
      },
    ],
  },
  {
    id: 'sample_004',
    tribunalType: 'opinion',
    verdict: 'Reasonable, with caveats',
    charge: 'Smuggling a valid critique inside a provocative overstatement.',
    score: 44,
    caseSummary: 'The defendant argued that most productivity advice is secular religion for anxious people.',
    caseText: "Most productivity advice is secular religion for anxious people. It doesn't make you more effective. It just lets you feel virtuous about being busy.",
    finalReasoning:
      'The critique has a real target: some productivity culture does reward ritual over results. But the argument weakens itself by flattening a broad field into a dunk. The court finds the thesis promising, the framing theatrical, and the remedy obvious: define the subset you mean and argue from evidence.',
    sentence: 'Make the actual argument. It\'s stronger without the performance.',
    shareCard: {
      caseNumber: '03612',
      headline: 'THE TRIBUNAL HAS SPOKEN',
      shortCase: 'Most productivity advice is secular religion for anxious people.',
      verdict: 'Reasonable, with caveats',
      charge: 'Smuggling a valid critique inside a provocative overstatement.',
      recognized: 'The underlying critique has genuine merit.',
      rejected: 'That cynicism substitutes for a better alternative.',
      sentence: 'Make the actual argument. It\'s stronger without the performance.',
    },
    createdAt: '2026-01-13T16:00:00.000Z',
    turns: [
      {
        phase: 'normalize',
        agentName: 'Clerk',
        role: 'Clerk',
        contentJson: {
          caseSummary: 'The defendant argued that most productivity advice is secular religion for anxious people.',
          shortCase: 'Most productivity advice is secular religion for anxious people.',
        },
        rawText: 'The case concerns a provocative critique of productivity advice and its framing.',
      },
      {
        phase: 'prosecute',
        agentName: 'Prosecutor',
        role: 'Prosecutor',
        contentJson: {
          charge: 'Smuggling a valid critique inside a provocative overstatement.',
          argument:
            'The defendant has mistaken a sharp sentence for a complete argument. Some productivity advice is performative, but "most" is doing too much work without evidence. The religious metaphor adds heat while making the claim easier to dismiss.',
          strongestPoint: 'The argument overclaims and then hides behind style.',
        },
        rawText: 'The prosecution argues that the critique is weakened by overstatement and theatrics.',
      },
      {
        phase: 'defend',
        agentName: 'Defender',
        role: 'Defender',
        contentJson: {
          argument:
            'The claim points at something recognizable: productivity systems can become rituals of self-soothing rather than tools for effectiveness. The defendant should be credited for identifying the pattern, even if the wording needs discipline.',
          mitigatingFactors: ['The core critique is intelligible.', 'The provocation may help expose a real cultural pattern.'],
          strongestPoint: 'The argument has a useful thesis buried under unnecessary swagger.',
        },
        rawText: 'The defense argues that the core claim is plausible despite poor framing.',
      },
      {
        phase: 'panel',
        agentName: 'Panel',
        role: 'Panel',
        contentJson: [
          {
            judgment: 'The conclusion does not follow cleanly from the premises because "most" is doing too much unsupported work.',
            leaning: 'complicated',
            keyPrinciple: 'A sharp claim still needs a valid bridge from evidence to conclusion.',
          },
          {
            judgment: 'Critiques of self-help and productivity culture have historical precedent, but the argument needs context to avoid sounding merely cynical.',
            leaning: 'complicated',
            keyPrinciple: 'Historical context can turn a dunk into an argument.',
          },
          {
            judgment: 'The word "most" creates an evidentiary burden the defendant has not met.',
            leaning: 'guilty',
            keyPrinciple: 'Broad claims require broad support.',
          },
          {
            judgment: 'The strongest version is about ritualized productivity content, not productivity advice as a whole.',
            leaning: 'complicated',
            keyPrinciple: 'A provocative claim should still survive its calmest restatement.',
          },
        ],
        rawText: 'The panel credits the insight but objects to the overbroad framing.',
      },
      {
        phase: 'finalize',
        agentName: 'Final Judge',
        role: 'Final Judge',
        contentJson: {
          verdict: 'Reasonable, with caveats',
          score: 44,
          finalReasoning:
            'The critique has a real target: some productivity culture does reward ritual over results. But the argument weakens itself by flattening a broad field into a dunk. The court finds the thesis promising, the framing theatrical, and the remedy obvious: define the subset you mean and argue from evidence.',
          sentence: 'Make the actual argument. It\'s stronger without the performance.',
        },
        rawText: 'Final ruling: the opinion has merit but needs narrower claims and less performance.',
      },
    ],
    panelJudgments: [
      {
        judgment: 'The conclusion does not follow cleanly from the premises because "most" is doing too much unsupported work.',
        leaning: 'complicated',
        keyPrinciple: 'A sharp claim still needs a valid bridge from evidence to conclusion.',
      },
      {
        judgment: 'Critiques of self-help and productivity culture have historical precedent, but the argument needs context to avoid sounding merely cynical.',
        leaning: 'complicated',
        keyPrinciple: 'Historical context can turn a dunk into an argument.',
      },
      {
        judgment: 'The word "most" creates an evidentiary burden the defendant has not met.',
        leaning: 'guilty',
        keyPrinciple: 'Broad claims require broad support.',
      },
      {
        judgment: 'The strongest version is about ritualized productivity content, not productivity advice as a whole.',
        leaning: 'complicated',
        keyPrinciple: 'A provocative claim should still survive its calmest restatement.',
      },
    ],
  },
]

export async function seedSampleTrials() {
  for (const sample of SEEDED_SAMPLE_TRIALS) {
    const tribunal = TRIBUNALS[sample.tribunalType]
    const samplePanelJudgments = buildSeedPanelJudgments(sample)

    await db
      .insert(trials)
      .values({
        id: sample.id,
        userId: null,
        claimTokenHash: null,
        caseText: sample.caseText,
        tribunalType: sample.tribunalType,
        status: 'completed',
        currentStep: null,
        caseSummary: sample.caseSummary,
        charge: sample.charge,
        verdict: sample.verdict,
        score: sample.score,
        scoreLabel: tribunal.scoreLabel,
        finalReasoning: sample.finalReasoning,
        sentence: sample.sentence,
        shareCardJson: JSON.stringify(sample.shareCard),
        safetyMessage: null,
        safetyType: null,
        appealOfId: null,
        appealGround: null,
        appealText: null,
        isPublic: 1,
        modelUsed: 'seeded-sample',
        pipelineVersion: 'sample-1.0',
        rawLlmResponses: JSON.stringify([]),
        errorMessage: null,
        createdAt: sample.createdAt,
        completedAt: sample.createdAt,
      })
      .onConflictDoUpdate({
        target: trials.id,
        set: {
          userId: null,
          claimTokenHash: null,
          caseText: sample.caseText,
          tribunalType: sample.tribunalType,
          status: 'completed',
          currentStep: null,
          caseSummary: sample.caseSummary,
          charge: sample.charge,
          verdict: sample.verdict,
          score: sample.score,
          scoreLabel: tribunal.scoreLabel,
          finalReasoning: sample.finalReasoning,
          sentence: sample.sentence,
          shareCardJson: JSON.stringify(sample.shareCard),
          safetyMessage: null,
          safetyType: null,
          appealOfId: null,
          appealGround: null,
          appealText: null,
          isPublic: 1,
          modelUsed: 'seeded-sample',
          pipelineVersion: 'sample-1.0',
          rawLlmResponses: JSON.stringify([]),
          errorMessage: null,
          createdAt: sample.createdAt,
          completedAt: sample.createdAt,
        },
      })

    await db.delete(trialTurns).where(eq(trialTurns.trialId, sample.id))
    await db.delete(panelJudgments).where(eq(panelJudgments.trialId, sample.id))

    await db.insert(trialTurns).values(
      sample.turns.map((turn) => ({
        trialId: sample.id,
        phase: turn.phase,
        agentName: turn.agentName,
        role: turn.role,
        contentJson: JSON.stringify(turn.phase === 'panel' ? samplePanelJudgments : turn.contentJson),
        rawText: turn.rawText,
        createdAt: sample.createdAt,
      }))
    )

    await db.insert(panelJudgments).values(
      samplePanelJudgments.map((judgment) => ({
        trialId: sample.id,
        agentName: judgment.agentName,
        role: judgment.role,
        judgment: judgment.judgment,
        leaning: judgment.leaning,
        keyPrinciple: judgment.keyPrinciple,
      }))
    )
  }
}
