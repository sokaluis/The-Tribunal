import { Link } from 'react-router-dom'
import { useT } from '../i18n'

interface Props {
  message?: string
  onRetry?: () => void
  caseText?: string
}

export function ErrorState({ message, onRetry, caseText }: Props) {
  const t = useT()
  const retryUrl = caseText
    ? `/?case=${encodeURIComponent(caseText)}`
    : '/'

  return (
    <div className="max-w-md mx-auto py-16 px-4 text-center animate-fade-in">
      <div className="text-4xl mb-6">⚖</div>
      <h2 className="text-xl font-bold text-[#f0ead6] mb-3">{t('error.title')}</h2>
      <p className="text-[#9ca3af] text-sm mb-8 leading-relaxed">
        {message || t('error.default_message')}
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-5 py-2.5 rounded-lg bg-[#d4a853] text-[#0a0a0f] font-bold text-sm hover:bg-[#e8c477] transition-colors cursor-pointer"
          >
            {t('error.retry')}
          </button>
        )}
        <Link
          to={retryUrl}
          className="px-5 py-2.5 rounded-lg border border-[#1e1e2e] text-[#9ca3af] hover:text-[#f0ead6] hover:border-[#2a2a3e] transition-colors text-sm"
        >
          {t('error.file_new_case')}
        </Link>
      </div>
    </div>
  )
}
