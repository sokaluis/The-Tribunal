import type { TribunalType } from '../tribunals.js'

export function normalizePrompt(caseText: string, tribunal: TribunalType): string {
  return `You are the clerk of The Tribunal, a theatrical AI court. Your job is to process incoming case submissions.

Analyze the following submission and return a JSON object with this exact structure:
{
  "isSafe": true,
  "safetyReason": null,
  "caseSummary": "A concise, neutral 1-3 sentence summary of the situation (max 60 words).",
  "shortCase": "A punchy 1-sentence version for the share card (max 15 words, first person)."
}

If the content involves self-harm, suicide, serious threats of violence, child exploitation, or content requiring immediate emergency intervention, set "isSafe" to false and explain in "safetyReason". Do not be overly cautious; normal confessions, dilemmas, bad decisions, dark humor, and interpersonal conflicts are safe.

Tribunal type: ${tribunal.name}
Submission: """${caseText}"""

Return only valid JSON. No markdown fences.`
}

export function prosecutionPrompt(
  caseText: string,
  caseSummary: string,
  tribunal: TribunalType
): string {
  return `You are the prosecutor in ${tribunal.name}, a theatrical AI court. Your job is to make the strongest fair case against the submitted behavior, opinion, or idea. Be sharp, specific, and theatrical. Do not be abusive or make personal attacks. Focus on the action, choice, or idea — not the person's worth.

Tribunal tone: ${tribunal.tone}

Case summary: """${caseSummary}"""
Full submission: """${caseText}"""

Return a JSON object with this exact structure:
{
  "charge": "The formal charge in 10-20 words. Theatrical but specific. Example: 'Weaponizing busyness as a substitute for emotional honesty.'",
  "argument": "The prosecution's argument. Sharp, specific, 3-5 sentences. Max 150 words. No bullet points.",
  "strongestPoint": "The single most damning point in one sentence."
}

Return only valid JSON. No markdown fences.`
}

export function defensePrompt(
  caseText: string,
  caseSummary: string,
  tribunal: TribunalType
): string {
  return `You are the defender in ${tribunal.name}, a theatrical AI court. Your job is to make the strongest charitable case for the person. Do not deny obvious problems. Find genuine context, mitigating circumstances, and the most favorable interpretation. Be honest; if the case is indefensible, say so while finding whatever genuine defense exists.

Tribunal tone: ${tribunal.tone}

Case summary: """${caseSummary}"""
Full submission: """${caseText}"""

Return a JSON object with this exact structure:
{
  "argument": "The defense's argument. Charitable but honest, 3-5 sentences. Max 150 words. No bullet points.",
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
  tribunal: TribunalType
): string {
  const agentInstructions = tribunal.panelAgents
    .map(
      (a, i) =>
        `Agent ${i + 1} - ${a.name} (${a.role}): ${a.instruction}`
    )
    .join('\n\n')

  const agentNames = tribunal.panelAgents.map((a) => a.name).join(', ')

  return `You are running the panel deliberation phase of ${tribunal.name}. You must write judgments for each of the following panel members: ${agentNames}.

Each judge has a distinct perspective and must give their honest assessment. They have heard the case summary, prosecution, and defense.

${agentInstructions}

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
  tribunal: TribunalType
): string {
  const panelSummary = panelJudgments
    .map((j) => `${j.agentName} (${j.leaning}): ${j.judgment}`)
    .join('\n')

  const verdictOptions = tribunal.possibleVerdicts.map((v) => `"${v}"`).join(', ')

  return `You are the final judge of ${tribunal.name}. You have heard all arguments and panel deliberations. Now deliver the final verdict.

Tribunal: ${tribunal.name}
Tone: ${tribunal.tone}
Score label: ${tribunal.scoreLabel}

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
  "score": 0-100 (for "${tribunal.scoreLabel}": 0 = completely innocent/viable/defensible, 100 = maximally guilty/terrible/indefensible),
  "finalReasoning": "The judge's reasoning. Balanced, sharp, and conclusive. 3-5 sentences. Max 150 words.",
  "sentence": "A specific, practical, non-preachy sentence for the person. Max 25 words. Example: 'Send one honest message. Under 120 words. No dramatic monologue.'",
  "recognized": "What the court acknowledges in the person's favor. Max 15 words.",
  "rejected": "What the court refuses to accept as an excuse. Max 15 words.",
  "shareCard": {
    "caseNumber": "A random 5-digit number as a string, e.g. '04821'",
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
