import type { Locale } from '@the-tribunal/contracts'
import { t } from './translate'

const META_SELECTORS = [
  { key: 'meta.description', selector: 'meta[name="description"]', attr: 'content' as const },
  { key: 'meta.og_description', selector: 'meta[property="og:description"]', attr: 'content' as const },
  { key: 'meta.og_title', selector: 'meta[property="og:title"]', attr: 'content' as const },
]

/**
 * Update document-level metadata to match the active locale.
 *
 * Called from {@link LocaleProvider} when the locale changes.
 * Sets `document.documentElement.lang`, the page `<title>`,
 * and matching `<meta>` description / OG tags from the dictionary.
 * Only runs in the browser; no-op on the server.
 */
export function applyDocumentMeta(locale: Locale): void {
  if (typeof document === 'undefined') return

  document.documentElement.lang = locale

  const title = t('meta.title', locale)
  if (title !== 'meta.title') document.title = title

  for (const { key, selector, attr } of META_SELECTORS) {
    const value = t(key, locale)
    if (value === key) continue
    const el = document.querySelector<HTMLMetaElement>(selector)
    if (el) el.setAttribute(attr, value)
  }
}
