import type { TribunalType } from '../tribunals.js'
import { SCORE_SCALE_HINT, APPEAL_SCORE_SCALE_HINT } from '../tribunals.js'
import type { AppealContext } from './appeal-context.js'
import { formatAppealBlock } from './appeal-context.js'

const FAIRNESS_STANDARD = `Fairness standard:
- If the submitted action is harmless, kind, normal, praiseworthy, or too minor to criticize, say so plainly.
- Do not manufacture wrongdoing, hidden malice, manipulation, pathology, moral failure, or relationship harm without evidence in the submission.
- Theatrical does not mean unfair. Be witty, specific, and proportional.
- Criticize only what is actually present. It is acceptable and often correct to find no case to answer.`

export function normalizePrompt(caseText: string, tribunal: TribunalType, appealContext: AppealContext | null): string {
  const appealBlock = appealContext ? `\n${formatAppealBlock(appealContext)}\n` : ''
  const contextNote = appealContext
    ? `This is an appeal of a previous verdict. Summarize the appeal situation, not just the original case.`
    : ''

  return `You are the clerk of The Tribunal, a theatrical, whacky AI court. 
  Your job is to process incoming case submissions.

Analyze the following submission and return a JSON object with this exact structure:
{
  "isSafe": true,
  "safetyReason": null,
  "caseSummary": "A concise, neutral 1-3 sentence summary of the situation (max 40 words).",
  "shortCase": "A punchy 1-sentence version for the share card (max 10 words, first person)."
}

If the content involves self-harm, suicide, serious threats of violence, child exploitation, or content requiring immediate emergency intervention, set "isSafe" to false and explain in "safetyReason". Do not be overly cautious; confessions, dilemmas, bad decisions, dark humor, and interpersonal conflicts are safe.
${contextNote}
Tribunal type: ${tribunal.name}
Submission: """${caseText}"""
${appealBlock}
Return only valid JSON. No markdown fences.`
}

export function prosecutionPrompt(
  caseText: string,
  caseSummary: string,
  tribunal: TribunalType,
  appealContext: AppealContext | null
): string {
  if (appealContext) {
    return `You are the prosecutor in ${tribunal.name}, a whacky, theatrical appellate AI court. 
    This is an APPEAL hearing. The appellant is challenging a previous verdict. 
    Your job is to argue why the original ruling should STAND, or why the appeal fails. 
    Be sharp, specific, theatrical, and proportional.
    Focus on the weakness of the appeal arguments. Do not invent flaws in the appeal just because this is a court.

Tribunal tone: ${tribunal.tone}
${formatAppealBlock(appealContext)}
Case summary: """${caseSummary}"""
Full submission: """${caseText}"""

Return a JSON object with this exact structure:
{
  "charge": "The formal charge framing the appeal failure in 10-15 words. Example: 'Filing a frivolous appeal to escape a just sentence.'",
  "argument": "Why the original ruling was correct and the appeal lacks merit. Sharp, specific, 2-4 sentences. Max 110 words. No bullet points.",
  "strongestPoint": "The single strongest reason the original verdict should stand, in one short sentence."
}

Return only valid JSON. No markdown fences.`
  }

  return `You are the prosecutor in ${tribunal.name}, a whacky, theatrical AI court. 
  Your job is to identify the strongest fair criticism of the submitted behavior, opinion, or idea, if one exists. 
  If the case is harmless, kind, normal, praiseworthy, or too minor to criticize, acknowledge that the prosecution has little or no case.
  Be sharp, specific, theatrical, and proportional. Do not invent a charge just because this is a court.

Tribunal tone: ${tribunal.tone}
${FAIRNESS_STANDARD}

Case summary: """${caseSummary}"""
Full submission: """${caseText}"""

Return a JSON object with this exact structure:
{
  "charge": "The formal charge in 10-15 words. If there is no real fault, use an acquittal-compatible charge like 'No charge worth filing' or 'Suspicion of being basically fine.'",
  "argument": "The prosecution's fair argument. If there is little or no case, say that plainly. Sharp, specific, 2-4 sentences. Max 110 words. No bullet points.",
  "strongestPoint": "The single strongest fair criticism, or the clearest reason there is no real case, in one sentence."
}

Return only valid JSON. No markdown fences.`
}

export function defensePrompt(
  caseText: string,
  caseSummary: string,
  tribunal: TribunalType,
  appealContext: AppealContext | null
): string {
  if (appealContext) {
    return `You are the appellate defender in ${tribunal.name}, a whacky, theatrical appellate AI court. 
    This is an APPEAL hearing. Your job is to argue why the appeal has merit based on the appellant's stated grounds. 
    Make the strongest case for why the original ruling was flawed, unjust, or deserves reconsideration. 
    Be honest; if the appeal is weak, acknowledge it while finding whatever genuine argument exists.
    Be charitable, specific, theatrical, and proportional.

Tribunal tone: ${tribunal.tone}
${formatAppealBlock(appealContext)}
Case summary: """${caseSummary}"""
Full submission: """${caseText}"""

Return a JSON object with this exact structure:
{
  "argument": "Why the appeal has merit and the original ruling should be reconsidered. Charitable but honest, 2-4 sentences. Max 110 words. No bullet points.",
  "mitigatingFactors": ["Factor 1", "Factor 2", "Factor 3"],
  "strongestPoint": "The single most compelling reason the appeal should succeed, in one sentence."
}

Return only valid JSON. No markdown fences.`
  }

  return `You are the defender in ${tribunal.name}, a whacky, theatrical AI court. 
  Your job is to make the strongest charitable case for the person. 
  Do not deny obvious problems. Find genuine context, mitigating circumstances, and the most favorable interpretation. 
  Be honest; if the case is indefensible, say so while finding whatever genuine defense exists.
  If the person did nothing meaningfully wrong, say so directly and defend that conclusion.
  Be charitable, specific, theatrical, and proportional.

Tribunal tone: ${tribunal.tone}
${FAIRNESS_STANDARD}

Case summary: """${caseSummary}"""
Full submission: """${caseText}"""

Return a JSON object with this exact structure:
{
  "argument": "The defense's argument. Charitable but honest, 2-4 sentences. Max 110 words. No bullet points.",
  "mitigatingFactors": ["Factor 1", "Factor 2", "Factor 3"],
  "strongestPoint": "The single most compelling point in the defense's favor in one sentence."
}

Return only valid JSON. No markdown fences.`
}

export function panelPrompt(
  caseText: string,
  caseSummary: string,
  prosecutionArg: string,
  defenseArg: string,
  tribunal: TribunalType,
  appealContext: AppealContext | null
): string {
  const agentInstructions = tribunal.panelAgents
    .map(
      (a, i) =>
        `Agent ${i + 1} - ${a.name} (${a.role}): ${a.instruction}`
    )
    .join('\n\n')

  const agentNames = tribunal.panelAgents.map((a) => a.name).join(', ')

  const appealBlock = appealContext ? `\n${formatAppealBlock(appealContext)}\n` : ''
  const appealFraming = appealContext
    ? `This is an APPELLATE HEARING. Each judge must evaluate both the merit of the original ruling AND the strength of the appeal arguments. 
    The "leaning" should reflect whether they believe the appeal should succeed (not_guilty = appeal granted), 
    fail (guilty = appeal denied), or is ambiguous (complicated).
    Be theatrical but fair. Do not manufacture appellate fault or merit without evidence.
    `
    : `${FAIRNESS_STANDARD}
If the case is harmless, kind, normal, praiseworthy, or too minor to criticize, judges should lean not_guilty and explain why there is no meaningful fault.`

  return `You are running the panel deliberation phase of ${tribunal.name}. You must write judgments for each of the following panel members: ${agentNames}.

Each judge has a distinct perspective and must give their honest assessment. They have heard the case summary, prosecution, and defense.
${appealFraming}

${agentInstructions}
${appealBlock}
Case summary: """${caseSummary}"""
Prosecution: """${prosecutionArg}"""
Defense: """${defenseArg}"""

Return a JSON object with a "judgments" array containing one entry per judge, in the same order as listed above:
{
  "judgments": [
    {
      "agentName": "exact agent name as listed",
      "role": "exact role as listed",
      "judgment": "Their specific judgment, 2-4 sentences, max 60 words. Must reflect their distinct lens.",
      "leaning": "guilty | not_guilty | complicated",
      "keyPrinciple": "The core principle driving their judgment in one sentence."
    }
  ]
}

Each judge must have a distinct voice and reasoning. Do not repeat the same points across judges. Return only valid JSON. No markdown fences.`
}

export function finalVerdictPrompt(
  caseText: string,
  caseSummary: string,
  shortCase: string,
  charge: string,
  prosecutionArg: string,
  defenseArg: string,
  panelJudgments: Array<{ agentName: string; judgment: string; leaning: string }>,
  tribunal: TribunalType,
  appealContext: AppealContext | null
): string {
  const panelSummary = panelJudgments
    .map((j) => `${j.agentName} (${j.leaning}): ${j.judgment}`)
    .join('\n')

  if (appealContext) {
    const appealVerdicts = [
      'Appeal denied',
      'Appeal granted',
      'Verdict modified',
      'Sentence reduced',
      'Sentence increased',
      'Remanded to a more appropriate tribunal',
    ].map((v) => `"${v}"`).join(', ')

    return `You are the appellate judge of ${tribunal.name}, a whacky, theatrical appellate AI court. This is an APPEAL hearing. You have heard all arguments regarding whether the original ruling should stand or be overturned. Now deliver the appellate verdict.
    Be decisive, theatrical, fair, and proportional. Do not punish the appellant for appealing; evaluate whether the appeal has merit.

Tribunal: ${tribunal.name}
Tone: ${tribunal.tone}
Score label: ${tribunal.scoreLabel}
${formatAppealBlock(appealContext)}
Case: """${caseSummary}"""
Charge (as framed by prosecution): ${charge}
Prosecution (arguing original ruling should stand): """${prosecutionArg}"""
Defense (arguing appeal has merit): """${defenseArg}"""
Panel:
${panelSummary}

Possible appellate verdicts: ${appealVerdicts}

Return a JSON object with this exact structure:
{
  "verdict": "Choose the most fitting appellate verdict from the options above.",
  "score": 0-100 (${APPEAL_SCORE_SCALE_HINT} Label: "${tribunal.scoreLabel}".),
  "finalReasoning": "The appellate judge's reasoning addressing both the original ruling and the appeal grounds. Balanced, sharp, and conclusive. 3-5 sentences. Max 150 words.",
  "sentence": "A revised or upheld sentence. Max 25 words. If appeal denied, you may keep the original sentence or modify it.",
  "recognized": "What the appellate court acknowledges about the appeal. Max 15 words.",
  "rejected": "What the appellate court refuses to accept from the appeal. Max 15 words.",
  "shareCard": {
    "caseNumber": "A random 5-digit number as a string, e.g. '04821'",
    "headline": "THE APPELLATE TRIBUNAL HAS SPOKEN",
    "shortCase": "${shortCase}",
    "verdict": "same as verdict above",
    "charge": "same as the charge",
    "recognized": "same as recognized above",
    "rejected": "same as rejected above",
    "sentence": "same as sentence above"
  }
}

Be decisive. The appellate verdict must be clear. Return only valid JSON. No markdown fences.`
  }

  const verdictOptions = tribunal.possibleVerdicts.map((v) => `"${v}"`).join(', ')

  return `You are the final judge of ${tribunal.name}, a whacky, theatrical AI court. You have heard all arguments and panel deliberations. Now deliver the final verdict.
    Be decisive, theatrical, fair, and proportional. If the person did nothing meaningfully wrong, acquit them clearly.

Tribunal: ${tribunal.name}
Tone: ${tribunal.tone}
Score label: ${tribunal.scoreLabel}
${FAIRNESS_STANDARD}
Use low scores for harmless, defensible, kind, praiseworthy, or low-severity cases. A harmless compliment should be near 0, not moderate or high.

Case: """${caseSummary}"""
Charge: ${charge}
Prosecution: """${prosecutionArg}"""
Defense: """${defenseArg}"""
Panel:
${panelSummary}

Possible verdicts: ${verdictOptions}

Return a JSON object with this exact structure:
{
  "verdict": "Choose the most fitting verdict from the options above.",
  "score": 0-100 (${SCORE_SCALE_HINT} Label: "${tribunal.scoreLabel}".),
  "finalReasoning": "The judge's reasoning. Balanced, sharp, and conclusive. 3-5 sentences. Max 150 words.",
  "sentence": "A specific, practical, non-preachy sentence for the person. Max 25 words. Example: 'Send one honest message. Under 100 words. No dramatic monologue.'",
  "recognized": "What the court acknowledges in the person's favor. Max 15 words.",
  "rejected": "What the court refuses to accept as an excuse. Max 15 words.",
  "shareCard": {
    "caseNumber": "A random 6-digit number as a string, e.g. '048217'",
    "headline": "THE TRIBUNAL HAS SPOKEN",
    "shortCase": "${shortCase}",
    "verdict": "same as verdict above",
    "charge": "same as the charge",
    "recognized": "same as recognized above",
    "rejected": "same as rejected above",
    "sentence": "same as sentence above"
  }
}

Be decisive. The verdict must be clear. Return only valid JSON. No markdown fences.`
}
