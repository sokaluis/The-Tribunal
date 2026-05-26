import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { VerdictCard } from '../components/VerdictCard'
import { ShareButtons } from '../components/ShareButtons'
import { useT } from '../i18n'
import type { ShareCard } from '../types'

type GallerySort = 'latest' | 'condemned' | 'vindicated' | 'contested'

const SORT_KEYS: Record<GallerySort, string> = {
  latest: 'gallery.sort_latest',
  condemned: 'gallery.sort_condemned',
  vindicated: 'gallery.sort_vindicated',
  contested: 'gallery.sort_contested',
}

interface GalleryVerdict {
  id: string
  tribunalType: string
  verdict: string
  score: number
  scoreLabel: string
  caseSummary: string
  caseText?: string
  shareCard: ShareCard
  locale: string
}

export function GalleryPage() {
  const t = useT()
  const [sort, setSort] = useState<GallerySort>('latest')
  const [verdicts, setVerdicts] = useState<GalleryVerdict[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetch(`/api/gallery?sort=${sort}`)
      .then((r) => r.json())
      .then((data) => {
        setVerdicts(data.verdicts || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [sort])

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-4">
        <Link to="/" className="text-xs text-[#6b7280] hover:text-[#9ca3af] transition-colors">
          {t('nav.back_new_trial')}
        </Link>
      </div>

      <div className="text-center mb-12">
        <p className="text-xs uppercase tracking-[0.2em] text-[#6b7280] mb-2 font-medium">{t('gallery.public_verdicts')}</p>
        <h1 className="text-4xl font-black text-[#f0ead6] mb-3" style={{ fontFamily: 'Georgia, Times New Roman, serif' }}>
          {t('gallery.title')}
        </h1>
        <p className="text-[#9ca3af] text-sm max-w-md mx-auto">
          {t('gallery.subtitle')}
        </p>
      </div>

      <div className="flex flex-col items-center gap-3 mb-10">
        <p className="text-[10px] uppercase tracking-widest text-[#6b7280] font-medium">{t('gallery.sort')}</p>
        <div className="flex gap-2 justify-center flex-wrap">
          {(Object.keys(SORT_KEYS) as GallerySort[]).map((s) => (
            <button
              key={s}
              onClick={() => setSort(s)}
              className={[
                'px-4 py-2 rounded-full text-xs font-medium transition-all cursor-pointer border',
                sort === s
                  ? 'bg-[#d4a853]/10 border-[#d4a853]/40 text-[#d4a853]'
                  : 'border-[#1e1e2e] text-[#9ca3af] hover:border-[#2a2a3e] hover:text-[#f0ead6]',
              ].join(' ')}
            >
              {t(SORT_KEYS[s])}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 text-[#6b7280]">
          <div className="text-3xl mb-4 animate-pulse-slow">⚖</div>
          <p className="text-sm">{t('gallery.loading')}</p>
        </div>
      ) : verdicts.length === 0 ? (
        <div className="text-center py-20 text-[#6b7280]">
          <p className="text-sm">{t('gallery.empty')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
          {verdicts.map((v) => (
            <div key={v.id} className="animate-fade-in-up">
              <Link to={`/trial/${v.id}`} className="block rounded-2xl transition-opacity hover:opacity-90">
                <VerdictCard
                  shareCard={v.shareCard}
                  score={v.score}
                  scoreLabel={v.scoreLabel}
                  tribunalType={v.tribunalType}
                  caseText={v.caseText}
                />
              </Link>
              <div className="mt-3 px-1 flex items-center justify-between gap-2">
                <p className="text-xs text-[#6b7280] italic max-w-[200px] truncate">"{v.caseSummary}"</p>
                <Link
                  to={`/trial/${v.id}`}
                  className="text-xs text-[#d4a853] hover:text-[#e8c477] transition-colors shrink-0"
                >
                  {t('gallery.view_case')}
                </Link>
              </div>
              <div className="mt-2 px-1">
                <ShareButtons verdict={v} />
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="text-center mt-16 py-12 border-t border-[#1e1e2e]">
        <p className="text-[#6b7280] text-sm mb-6">{t('gallery.ready')}</p>
        <Link
          to="/"
          className="inline-block px-8 py-3.5 rounded-xl bg-[#d4a853] text-[#0a0a0f] font-bold hover:bg-[#e8c477] transition-colors"
        >
          {t('gallery.file_case')}
        </Link>
      </div>
    </div>
  )
}
