import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import type { Locale } from '@the-tribunal/contracts'
import { DEFAULT_LOCALE, parseLocale } from '@the-tribunal/contracts'
import { applyDocumentMeta } from './meta'
import { interpolate, t } from './translate'

const STORAGE_KEY = 'tribunal_locale'

interface LocaleContextValue {
  /** The currently active locale. Defaults to `'en'`. */
  locale: Locale
  /** Set the active locale. Persists to `localStorage` and updates document metadata. */
  setLocale: (locale: Locale) => void
  /**
   * Translate a dictionary key into the active locale.
   * Falls back key-by-key to English, then returns the raw key if neither dictionary has it.
   *
   * @param key    Dictionary key (e.g. `'home.start_trial'`).
   * @param params Optional record of `{placeholder}` values to interpolate into the result.
   */
  t: (key: string, params?: Record<string, string | number>) => string
}

const LocaleContext = createContext<LocaleContextValue | null>(null)

/**
 * Provider that initialises locale from `localStorage`
 * and keeps document metadata in sync on every change.
 *
 * Must wrap the application root *outside* the router so all descendants
 * can call {@link useLocale} / {@link useT}.
 */
export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    if (typeof window === 'undefined') return DEFAULT_LOCALE
    try {
      return parseLocale(localStorage.getItem(STORAGE_KEY))
    } catch {
      return DEFAULT_LOCALE
    }
  })

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next)
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      /* quota exceeded — silently ignore */
    }
  }, [])

  // Keep document metadata in sync whenever the locale changes.
  useEffect(() => {
    applyDocumentMeta(locale)
  }, [locale])

  const translate = useCallback(
    (key: string, params?: Record<string, string | number>) => {
      const raw = t(key, locale)
      return params ? interpolate(raw, params) : raw
    },
    [locale],
  )

  const value = useMemo<LocaleContextValue>(
    () => ({ locale, setLocale, t: translate }),
    [locale, setLocale, translate],
  )

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  )
}

/**
 * Read the current locale and a `setLocale` callback, plus the `t` translation
 * helper. Throws if called outside a {@link LocaleProvider}.
 */
export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext)
  if (!ctx) {
    throw new Error('useLocale must be used inside a <LocaleProvider>')
  }
  return ctx
}

/**
 * Convenience hook that returns only the `t` translation function
 * bound to the active locale.
 */
export function useT(): (
  key: string,
  params?: Record<string, string | number>,
) => string {
  const { t } = useLocale()
  return t
}
