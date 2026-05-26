import type { Locale } from '@the-tribunal/contracts'
import { DEFAULT_LOCALE } from '@the-tribunal/contracts'
import { en } from './dictionaries/en'
import { es } from './dictionaries/es'

const dictionaries: Record<Locale, Record<string, string>> = { en, es }

/**
 * Look up a translation key with key-by-key English fallback.
 *
 * When a key is missing from the active dictionary, the English dictionary
 * is tried next. If the key is missing from both, the key itself is returned.
 */
export function t(key: string, locale?: Locale): string {
  const dict = dictionaries[locale ?? DEFAULT_LOCALE] ?? dictionaries[DEFAULT_LOCALE]
  return dict[key] ?? dictionaries[DEFAULT_LOCALE][key] ?? key
}

/**
 * Replace `{param}` placeholders in a template string with the provided values.
 *
 * @example interpolate('Need at least {count} chars.', { count: 10 })
 */
export function interpolate(
  template: string,
  values: Record<string, string | number>,
): string {
  return template.replace(/\{(\w+)\}/g, (_, key) =>
    String(key in values ? values[key] : `{${key}}`),
  )
}
