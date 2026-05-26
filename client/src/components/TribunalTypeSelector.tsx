import type { TribunalType } from '../types'
import { TribunalSelectorGrid } from './TribunalSelectorGrid'
import { useT } from '../i18n'

interface Props {
  tribunals: TribunalType[]
  selected: string
  onSelect: (id: string) => void
}

export function TribunalTypeSelector({ tribunals, selected, onSelect }: Props) {
  const t = useT()

  return (
    <div className="w-full">
      <p className="text-xs uppercase tracking-widest text-[#9ca3af] mb-3 font-medium">{t('tribunal.choose_court')}</p>
      <TribunalSelectorGrid
        tribunals={tribunals}
        selected={selected}
        onSelect={onSelect}
      />
    </div>
  )
}
