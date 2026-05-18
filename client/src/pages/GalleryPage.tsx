import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { VerdictCard } from '../components/VerdictCard'
import { ShareButtons } from '../components/ShareButtons'
import type { ShareCard } from '../types'

type Filter = 'recent' | 'guilty' | 'innocent' | 'divisive'

const FILTERS: Array<{ id: Filter; label: string }> = [
  { id: 'recent', label: 'Most recent' },
  { id: 'guilty', label: 'Most guilty' },
  { id: 'innocent', label: 'Most redeemable' },
  { id: 'divisive', label: 'Most divisive' },
]

interface GalleryVerdict {
  id: string
  tribunalType: string
  verdict: string
  score: number
  scoreLabel: string
  caseSummary: string
  caseText?: string
  shareCard: ShareCard
}

export function GalleryPage() {
  const [filter, setFilter] = useState<Filter>('recent')
  const [verdicts, setVerdicts] = useState<GalleryVerdict[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetch(`/api/gallery?filter=${filter}`)
      .then((r) => r.json())
      .then((data) => {
        setVerdicts(data.verdicts || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [filter])

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-4">
        <Link to="/" className="text-xs text-[#6b7280] hover:text-[#9ca3af] transition-colors">
          ← New trial
        </Link>
      </div>

      <div className="text-center mb-12">
        <p className="text-xs uppercase tracking-[0.2em] text-[#6b7280] mb-2 font-medium">Public verdicts</p>
        <h1 className="text-4xl font-black text-[#f0ead6] mb-3" style={{ fontFamily: 'Georgia, Times New Roman, serif' }}>
          The Gallery
        </h1>
        <p className="text-[#9ca3af] text-sm max-w-md mx-auto">
          A collection of cases the court has already ruled on.
        </p>
      </div>

      <div className="flex gap-2 justify-center mb-10 flex-wrap">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={[
              'px-4 py-2 rounded-full text-xs font-medium transition-all cursor-pointer border',
              filter === f.id
                ? 'bg-[#d4a853]/10 border-[#d4a853]/40 text-[#d4a853]'
                : 'border-[#1e1e2e] text-[#9ca3af] hover:border-[#2a2a3e] hover:text-[#f0ead6]',
            ].join(' ')}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-20 text-[#6b7280]">
          <div className="text-3xl mb-4 animate-pulse-slow">⚖</div>
          <p className="text-sm">Retrieving case files...</p>
        </div>
      ) : verdicts.length === 0 ? (
        <div className="text-center py-20 text-[#6b7280]">
          <p className="text-sm">No cases have been filed yet.</p>
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
                  View full case →
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
        <p className="text-[#6b7280] text-sm mb-6">Ready to face judgment?</p>
        <Link
          to="/"
          className="inline-block px-8 py-3.5 rounded-xl bg-[#d4a853] text-[#0a0a0f] font-bold hover:bg-[#e8c477] transition-colors"
        >
          File your case
        </Link>
      </div>
    </div>
  )
}
