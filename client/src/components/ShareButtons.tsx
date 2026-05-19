import { useState, useRef, useCallback, useEffect } from 'react'
import { toPng } from 'html-to-image'
import { VerdictCard, type VerdictOrientation } from './VerdictCard'
import type { ShareCard } from '../types'
import { formatScorePercent } from '../utils/formatScore'

export interface ShareableVerdict {
  shareCard: ShareCard
  score: number
  scoreLabel: string
  tribunalType: string
  caseText?: string
}

interface Props {
  verdict: ShareableVerdict
}

export function ShareButtons({ verdict }: Props) {
  const [copied, setCopied] = useState(false)
  const [copyError, setCopyError] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const [showOrientationPicker, setShowOrientationPicker] = useState(false)
  const [exportOrientation, setExportOrientation] = useState<VerdictOrientation | null>(null)

  const exportRef = useRef<HTMLDivElement>(null)

  const copyText = () => {
    const sc = verdict.shareCard
    const text = [
      '⚖ THE TRIBUNAL HAS SPOKEN',
      '',
      `Case: "${verdict.caseText ?? sc.shortCase}"`,
      `Tribunal: ${verdict.tribunalType.charAt(0).toUpperCase() + verdict.tribunalType.slice(1)} Tribunal`,
      '',
      `Verdict: ${sc.verdict}`,
      `Score: ${formatScorePercent(verdict.score)} (${verdict.scoreLabel})`,
      '',
      `Charge: ${sc.charge}`,
      `The court recognizes: ${sc.recognized}`,
      `The court rejects: ${sc.rejected}`,
      '',
      `Sentence: ${sc.sentence}`,
      '',
      'Tried at thetribunal.app',
    ].join('\n')

    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }).catch(() => {
      setCopyError(true)
      setTimeout(() => setCopyError(false), 2000)
    })
  }

  const captureAndDownload = useCallback(async () => {
    if (!exportOrientation || !exportRef.current) return
    setDownloading(true)
    try {
      const dataUrl = await toPng(exportRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: '#0a0a0f',
      })
      const link = document.createElement('a')
      link.download = `tribunal-verdict-${verdict.shareCard.caseNumber}-${exportOrientation}.png`
      link.href = dataUrl
      link.click()
    } catch (err) {
      console.error('Failed to export card:', err)
    } finally {
      setDownloading(false)
      setExportOrientation(null)
    }
  }, [exportOrientation, verdict.shareCard.caseNumber])

  useEffect(() => {
    if (!exportOrientation) return
    const frame = requestAnimationFrame(() => {
      captureAndDownload()
    })
    return () => cancelAnimationFrame(frame)
  }, [exportOrientation, captureAndDownload])

  const startDownload = (orientation: VerdictOrientation) => {
    setShowOrientationPicker(false)
    setExportOrientation(orientation)
  }

  return (
    <>
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={copyText}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[#1e1e2e] text-sm text-[#9ca3af] hover:text-[#f0ead6] hover:border-[#2a2a3e] transition-all cursor-pointer"
        >
          {copied ? '✓ Copied!' : copyError ? 'Copy failed' : '📋 Copy verdict'}
        </button>

        <div className="relative">
          <button
            onClick={() => setShowOrientationPicker((p) => !p)}
            disabled={downloading}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[#1e1e2e] text-sm text-[#9ca3af] hover:text-[#f0ead6] hover:border-[#2a2a3e] transition-all cursor-pointer disabled:opacity-50"
          >
            {downloading ? '⏳ Generating...' : '⬇ Download card'}
          </button>
          {showOrientationPicker && (
            <div className="absolute left-0 bottom-full mb-1.5 z-50 rounded-xl border border-[#2a2a3e] bg-[#0f0f1a] overflow-hidden shadow-2xl min-w-[180px]">
              <button
                onClick={() => startDownload('horizontal')}
                className="w-full text-left px-4 py-3 text-sm text-[#9ca3af] hover:text-[#f0ead6] hover:bg-[#14141f] transition-colors cursor-pointer border-b border-[#1e1e2e]"
              >
                <span className="block text-xs font-medium text-[#f0ead6] mb-0.5">Horizontal</span>
                <span className="text-[11px] text-[#6b7280]">Wide format (900 x ~300px)</span>
              </button>
              <button
                onClick={() => startDownload('vertical')}
                className="w-full text-left px-4 py-3 text-sm text-[#9ca3af] hover:text-[#f0ead6] hover:bg-[#14141f] transition-colors cursor-pointer"
              >
                <span className="block text-xs font-medium text-[#f0ead6] mb-0.5">Vertical</span>
                <span className="text-[11px] text-[#6b7280]">Tall format (520 x ~680px)</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {exportOrientation && (
        <div
          style={{ position: 'fixed', left: '-9999px', top: '0', pointerEvents: 'none' }}
          aria-hidden="true"
        >
          <VerdictCard
            ref={exportRef}
            shareCard={verdict.shareCard}
            score={verdict.score}
            scoreLabel={verdict.scoreLabel}
            tribunalType={verdict.tribunalType}
            caseText={verdict.caseText}
            orientation={exportOrientation}
            forExport
          />
        </div>
      )}
    </>
  )
}
