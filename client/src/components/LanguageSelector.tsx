import { useLocale } from '../i18n'
import type { Locale } from '@the-tribunal/contracts'
import { SUPPORTED_LOCALES } from '@the-tribunal/contracts'

const LOCALE_LABELS: Record<Locale, string> = {
  en: 'EN',
  es: 'ES',
}

export function LanguageSelector() {
  const { locale, setLocale } = useLocale()

  return (
    <div className="flex items-center gap-0.5 rounded-lg border border-[#1e1e2e] bg-[#0c0c14] p-0.5">
      {SUPPORTED_LOCALES.map((lang) => {
        const isActive = lang === locale
        return (
          <button
            key={lang}
            onClick={() => setLocale(lang)}
            className={[
              'px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer',
              isActive
                ? 'bg-[#d4a853] text-[#0a0a0f]'
                : 'text-[#4b5563] hover:text-[#9ca3af]',
            ].join(' ')}
            aria-label={`Switch to ${lang === 'en' ? 'English' : 'Spanish'}`}
            aria-pressed={isActive}
          >
            {LOCALE_LABELS[lang]}
          </button>
        )
      })}
    </div>
  )
}
