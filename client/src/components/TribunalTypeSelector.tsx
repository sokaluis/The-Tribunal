import type { TribunalType } from '../types'
import { TribunalSelectorGrid } from './TribunalSelectorGrid'

interface Props {
  tribunals: TribunalType[]
  selected: string
  onSelect: (id: string) => void
}

export function TribunalTypeSelector({ tribunals, selected, onSelect }: Props) {
  return (
    <div className="w-full">
      <p className="text-xs uppercase tracking-widest text-[#9ca3af] mb-3 font-medium">Choose your court</p>
      <TribunalSelectorGrid
        tribunals={tribunals}
        selected={selected}
        onSelect={onSelect}
      />
    </div>
  )
}
