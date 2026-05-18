const HIGH_RISK_PATTERNS = [
  /\bsuicid(e|al|e ideation)\b/i,
  /\bself.?harm\b/i,
  /\bkill (myself|yourself|himself|herself|themselves)\b/i,
  /\bwant to die\b/i,
  /\bending (my|their) life\b/i,
  /\boverdos(e|ing)\b/i,
  /\bcut(ting)? (myself|yourself)\b/i,
  /\babuse (a child|children|minors)\b/i,
  /\bsexual abuse\b/i,
  /\bchild (porn|exploitation|abuse)\b/i,
  /\bthreat(en)? to (kill|hurt|harm)\b/i,
  /\bbomb\b.*\b(threat|build|make)\b/i,
]

export interface SafetyCheckResult {
  safe: boolean
  reason?: string
}

export function quickKeywordCheck(text: string): SafetyCheckResult {
  for (const pattern of HIGH_RISK_PATTERNS) {
    if (pattern.test(text)) {
      return { safe: false, reason: 'high-risk keyword detected' }
    }
  }
  return { safe: true }
}

export const SAFETY_RESOURCES = [
  { label: '988 Suicide & Crisis Lifeline', value: 'Call or text 988 (US)' },
  { label: 'Crisis Text Line', value: 'Text HOME to 741741 (US)' },
  { label: 'International Association for Suicide Prevention', value: 'https://www.iasp.info/resources/Crisis_Centres/' },
  { label: 'Emergency Services', value: 'Call your local emergency number (911, 999, 112)' },
]

export const SAFETY_MESSAGE =
  "We noticed your submission touches on something serious, and The Tribunal is not the right place for it. " +
  "If you or someone you know is struggling, please reach out to a crisis resource or trusted person. " +
  "You don't have to face this alone."

export const CONTENT_POLICY_MESSAGE =
  "The Tribunal can't hear this case. Submissions that promote hatred, violence against groups, or harmful extremist content fall outside what this court adjudicates."
