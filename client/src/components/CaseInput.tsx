import { useT } from '../i18n'

const PLACEHOLDER_EXAMPLES = [
  'I ghosted a friend for three weeks because I was overwhelmed and didn\'t want to explain myself.',
  'I lied to avoid hurting someone\'s feelings about something they worked really hard on.',
  'I bought a domain for a startup idea before knowing what the product was going to be.',
  'Most productivity advice is secular religion for anxious people.',
  'I said yes to something I didn\'t want to do and then resented the person for asking.',
]

interface Props {
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
  disabled?: boolean
}

const MIN_CHARS = 10
const MAX_CHARS = 3000

export function CaseInput({ value, onChange, onSubmit, disabled }: Props) {
  const t = useT()
  const len = value.length
  const isValid = len >= MIN_CHARS && len <= MAX_CHARS
  const placeholder = PLACEHOLDER_EXAMPLES[0]

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey) && isValid && !disabled) {
      onSubmit()
    }
  }

  return (
    <div className="w-full">
      <div className="relative">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value.slice(0, MAX_CHARS))}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          rows={5}
          className={[
            'w-full rounded-xl border bg-[#14141f] text-[#f0ead6] placeholder-[#4b5563] resize-none',
            'px-5 py-4 text-base leading-relaxed outline-none transition-all duration-200',
            'focus:border-[#d4a853]/60 focus:shadow-[0_0_0_2px_rgba(212,168,83,0.15)]',
            disabled ? 'opacity-50 cursor-not-allowed' : '',
            'border-[#2a2a3e]',
          ].join(' ')}
        />
        <div className={`absolute bottom-3 right-4 text-xs font-mono ${len > MAX_CHARS * 0.9 ? 'text-[#d97706]' : 'text-[#4b5563]'}`}>
          {len}/{MAX_CHARS}
        </div>
      </div>
      {len > 0 && len < MIN_CHARS && (
        <p className="text-xs text-[#d97706] mt-1.5 ml-1">{t('case.min_chars', { count: MIN_CHARS })}</p>
      )}
    </div>
  )
}
