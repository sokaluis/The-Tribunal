export const GALLERY_SORTS = ['latest', 'condemned', 'vindicated', 'contested'] as const
export type GallerySort = (typeof GALLERY_SORTS)[number]

export interface GalleryVerdictItem {
  id: string
  score: number
  createdAt: string
  panelDisagreement?: number
}

const LEGACY_SORT_ALIASES: Record<string, GallerySort> = {
  recent: 'latest',
  guilty: 'condemned',
  innocent: 'vindicated',
  divisive: 'contested',
}

export function parseGallerySort(value: unknown): GallerySort {
  if (typeof value !== 'string') return 'latest'
  if ((GALLERY_SORTS as readonly string[]).includes(value)) {
    return value as GallerySort
  }
  return LEGACY_SORT_ALIASES[value] ?? 'latest'
}

type PanelLeaning = 'guilty' | 'not_guilty' | 'complicated'

export function computePanelDisagreement(leanings: PanelLeaning[]): number {
  if (leanings.length === 0) return 0
  let guilty = 0
  let notGuilty = 0
  let complicated = 0
  for (const l of leanings) {
    if (l === 'guilty') guilty++
    else if (l === 'not_guilty') notGuilty++
    else complicated++
  }
  const total = leanings.length
  const maxCount = Math.max(guilty, notGuilty, complicated)
  return 1 - maxCount / total
}

export function contestedSortKey(score: number, panelDisagreement: number): number {
  if (panelDisagreement > 0) {
    return panelDisagreement * 1000 - Math.abs(50 - score)
  }
  return 100 - Math.abs(50 - score)
}

export function sortGalleryVerdicts<T extends GalleryVerdictItem>(items: T[], sort: GallerySort): T[] {
  const copy = [...items]
  switch (sort) {
    case 'latest':
      return copy.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
    case 'condemned':
      return copy.sort((a, b) => b.score - a.score)
    case 'vindicated':
      return copy.sort((a, b) => a.score - b.score)
    case 'contested':
      return copy.sort((a, b) => {
        const keyA = contestedSortKey(a.score, a.panelDisagreement ?? 0)
        const keyB = contestedSortKey(b.score, b.panelDisagreement ?? 0)
        return keyB - keyA
      })
    default:
      return copy
  }
}
