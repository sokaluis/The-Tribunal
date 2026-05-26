import type { Locale } from '@the-tribunal/contracts'
import { t } from '../i18n/index.js'

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

/** Legacy English-only constants — preserved for backward compatibility. */
export const SAFETY_MESSAGE = t('safety.crisis_message', 'en')

/** Legacy English-only constants — preserved for backward compatibility. */
export const CONTENT_POLICY_MESSAGE = t('safety.content_policy_message', 'en')

/** Locale-aware safety message for the pipeline. */
export function getSafetyMessage(locale?: Locale): string {
  return t('safety.crisis_message', locale)
}

/** Locale-aware content policy message for the pipeline. */
export function getContentPolicyMessage(locale?: Locale): string {
  return t('safety.content_policy_message', locale)
}
