import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { useT } from '../i18n'
import type { AppealGround, TrialStatus } from '../types'
import { formatScorePercent } from '../utils/formatScore'

interface ProfileTrial {
  id: string
  status: TrialStatus
  tribunalType: string
  caseSummary: string | null
  caseText: string
  verdict: string | null
  score: number | null
  scoreLabel: string | null
  isPublic: boolean
  appealOfId: string | null
  appealGround: AppealGround | null
  createdAt: string
  completedAt: string | null
  locale: string
}

const STATUS_LABEL_KEYS: Record<TrialStatus, string> = {
  pending: 'profile.status_pending',
  processing: 'profile.status_processing',
  completed: 'profile.status_completed',
  failed: 'profile.status_failed',
  safety_blocked: 'profile.status_safety_blocked',
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value))
}

function TrialCard({ trial }: { trial: ProfileTrial }) {
  const t = useT()
  const title = trial.verdict || t(STATUS_LABEL_KEYS[trial.status])
  const summary = trial.caseSummary || trial.caseText

  return (
    <Link
      to={`/trial/${trial.id}`}
      className="block rounded-2xl border border-[#1e1e2e] bg-[#14141f] p-4 transition-all hover:border-[#d4a853]/40 hover:bg-[#181827]"
    >
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest ${
          trial.isPublic ? 'bg-[#16a34a]/10 text-[#16a34a]' : 'bg-[#2a2a3e] text-[#9ca3af]'
        }`}>
          {trial.isPublic ? t('profile.public') : t('profile.private')}
        </span>
        <span className="rounded-full bg-[#d4a853]/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-[#d4a853]">
          {t(STATUS_LABEL_KEYS[trial.status])}
        </span>
        {trial.appealOfId && (
          <span className="rounded-full bg-[#0c0c14] px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-[#9ca3af]">
            {t('profile.appeal_tag')}
          </span>
        )}
      </div>

      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
            <p className="mb-1 text-xs uppercase tracking-widest text-[#6b7280]">
              {t(`tribunal.${trial.tribunalType}.name`)} · {formatDate(trial.createdAt)}
            </p>
          <h2 className="mb-2 text-lg font-black leading-tight text-[#f0ead6]" style={{ fontFamily: 'Georgia, Times New Roman, serif' }}>
            {title}
          </h2>
          <p className="line-clamp-2 text-sm leading-relaxed text-[#9ca3af]">{summary}</p>
          {trial.appealGround && (
            <p className="mt-2 text-xs text-[#6b7280]">
              {t('profile.grounds')} <span className="text-[#9ca3af]">{t(`appeal.ground.${trial.appealGround}`)}</span>
            </p>
          )}
        </div>
        {trial.score !== null && trial.scoreLabel && (
          <div className="shrink-0 text-right">
            <p className="text-2xl font-black text-[#d4a853]">{formatScorePercent(trial.score)}</p>
            <p className="max-w-[90px] text-[10px] uppercase leading-tight tracking-widest text-[#6b7280]">{trial.scoreLabel}</p>
          </div>
        )}
      </div>
    </Link>
  )
}

export function ProfilePage() {
  const t = useT()
  const { user, loading: authLoading, signIn } = useAuth()
  const [trials, setTrials] = useState<ProfileTrial[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) return

    let cancelled = false
    setLoading(true)
    setError(null)

    fetch('/api/profile/trials', { credentials: 'include' })
      .then(async (res) => {
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || t('errors.load_trials'))
        return data as { trials: ProfileTrial[] }
      })
      .then((data) => {
        if (!cancelled) setTrials(data.trials)
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : t('errors.load_trials'))
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [user])

  if (authLoading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center text-[#6b7280]">
        {t('profile.checking')}
      </div>
    )
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <p className="mb-2 text-xs font-medium uppercase tracking-[0.25em] text-[#6b7280]">{t('profile.private_chambers')}</p>
        <h1 className="mb-4 text-4xl font-black text-[#f0ead6]" style={{ fontFamily: 'Georgia, Times New Roman, serif' }}>
          {t('profile.sign_in_title')}
        </h1>
        <p className="mx-auto mb-8 max-w-md text-sm leading-relaxed text-[#9ca3af]">
          {t('profile.sign_in_subtitle')}
        </p>
        <button
          onClick={signIn}
          className="rounded-xl bg-[#d4a853] px-6 py-3 text-sm font-bold text-[#0a0a0f] transition-colors hover:bg-[#e8c477]"
        >
          {t('profile.sign_in_button')}
        </button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <section className="mb-8 rounded-3xl border border-[#1e1e2e] bg-[#14141f] p-6 sm:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            {user.avatarUrl ? (
              <img src={user.avatarUrl} alt="" className="h-16 w-16 rounded-2xl border border-[#2a2a3e]" />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[#2a2a3e] bg-[#0c0c14] text-2xl text-[#d4a853]">
                ⚖
              </div>
            )}
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.25em] text-[#6b7280]">{t('profile.private_profile')}</p>
              <h1 className="text-3xl font-black text-[#f0ead6]" style={{ fontFamily: 'Georgia, Times New Roman, serif' }}>
                {user.displayName}
              </h1>
              <p className="text-sm text-[#9ca3af]">{user.email}</p>
            </div>
          </div>
          <div className="rounded-2xl border border-[#1e1e2e] bg-[#0c0c14] px-4 py-3 text-left sm:text-right">
            <p className="text-[10px] uppercase tracking-widest text-[#6b7280]">{t('profile.reserved_slug')}</p>
            <p className="text-sm font-bold text-[#d4a853]">/{user.profileSlug}</p>
          </div>
        </div>
      </section>

      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-[#6b7280]">{t('profile.case_files')}</p>
          <h2 className="text-2xl font-black text-[#f0ead6]" style={{ fontFamily: 'Georgia, Times New Roman, serif' }}>
            {trials.length} {trials.length === 1 ? t('profile.owned_trial_singular') : t('profile.owned_trial_plural')}
          </h2>
        </div>
        <Link to="/" className="text-sm text-[#d4a853] transition-colors hover:text-[#e8c477]">
          {t('profile.file_new_case')}
        </Link>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-[#1e1e2e] bg-[#14141f] p-8 text-center text-sm text-[#6b7280]">
          {t('profile.retrieving')}
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-[#dc2626]/30 bg-[rgba(220,38,38,0.06)] p-5 text-sm text-[#ef4444]">
          {error}
        </div>
      ) : trials.length === 0 ? (
        <div className="rounded-2xl border border-[#1e1e2e] bg-[#14141f] p-8 text-center">
          <p className="mb-4 text-sm text-[#9ca3af]">{t('profile.no_trials')}</p>
          <Link
            to="/"
            className="inline-block rounded-xl bg-[#d4a853] px-5 py-2.5 text-sm font-bold text-[#0a0a0f] transition-colors hover:bg-[#e8c477]"
          >
            {t('profile.start_first')}
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {trials.map((trial) => (
            <TrialCard key={trial.id} trial={trial} />
          ))}
        </div>
      )}
    </div>
  )
}
