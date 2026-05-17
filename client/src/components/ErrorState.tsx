import { Link } from 'react-router-dom'

interface Props {
  message?: string
  onRetry?: () => void
  caseText?: string
}

export function ErrorState({ message, onRetry, caseText }: Props) {
  const retryUrl = caseText
    ? `/?case=${encodeURIComponent(caseText)}`
    : '/'

  return (
    <div className="max-w-md mx-auto py-16 px-4 text-center animate-fade-in">
      <div className="text-4xl mb-6">⚖</div>
      <h2 className="text-xl font-bold text-[#f0ead6] mb-3">The court is in disarray.</h2>
      <p className="text-[#9ca3af] text-sm mb-8 leading-relaxed">
        {message || 'Something went wrong during the trial. The evidence has been misplaced. Please try again.'}
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-5 py-2.5 rounded-lg bg-[#d4a853] text-[#0a0a0f] font-bold text-sm hover:bg-[#e8c477] transition-colors cursor-pointer"
          >
            Retry
          </button>
        )}
        <Link
          to={retryUrl}
          className="px-5 py-2.5 rounded-lg border border-[#1e1e2e] text-[#9ca3af] hover:text-[#f0ead6] hover:border-[#2a2a3e] transition-colors text-sm"
        >
          File a new case
        </Link>
      </div>
    </div>
  )
}
