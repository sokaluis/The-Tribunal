import type { Locale } from '@the-tribunal/contracts'
import { t, interpolate } from '../i18n/index.js'
import type { AppealGround } from '../types.js'

export interface AppealContext {
  originalCaseText: string
  originalTribunalType: string
  originalCharge: string
  originalVerdict: string
  originalFinalReasoning: string
  originalSentence: string
  newTribunalType: string
  appealGround: AppealGround
  appealText: string
}

/**
 * Resolve a human-readable label for the given appeal ground in the requested locale.
 * Falls back to English key-by-key.
 */
export function getAppealGroundLabel(ground: AppealGround, locale?: Locale): string {
  return t(`appeal.ground.${ground}`, locale)
}

export function formatAppealBlock(ctx: AppealContext, locale?: Locale): string {
  const l = locale
  const parts = [
    `\n--- ${t('appeal.context_section_header', l)} ---`,
    t('appeal.context_header', l),
    ``,
    interpolate(t('appeal.context_original_tribunal', l), { type: t(`tribunal.${ctx.originalTribunalType}.name`, l) }),
    interpolate(t('appeal.context_original_charge', l), { charge: ctx.originalCharge }),
    interpolate(t('appeal.context_original_verdict', l), { verdict: ctx.originalVerdict }),
    `${t('appeal.context_original_reasoning', l)} """${ctx.originalFinalReasoning}"""`,
    interpolate(t('appeal.context_original_sentence', l), { sentence: ctx.originalSentence }),
    ``,
    interpolate(t('appeal.context_appeal_ground', l), { ground: getAppealGroundLabel(ctx.appealGround, l) }),
  ]

  if (ctx.appealText) {
    parts.push(`${t('appeal.context_appellant_explanation', l)} """${ctx.appealText}"""`)
  }

  parts.push(interpolate(t('appeal.context_new_tribunal', l), { type: t(`tribunal.${ctx.newTribunalType}.name`, l) }))
  parts.push(`--- ${t('appeal.context_section_header', l)} ---\n`)

  return parts.join('\n')
}
