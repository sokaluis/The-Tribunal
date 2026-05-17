const EXAMPLES = [
  { label: 'Ghosted a friend', text: 'I ghosted a close friend for three weeks because I was overwhelmed and didn\'t know how to explain myself.', tribunal: 'relationship' },
  { label: 'Lied to be kind', text: 'I told a friend their creative project was great when I actually thought it was mediocre, to avoid hurting them.', tribunal: 'moral' },
  { label: 'Domain before idea', text: 'I bought a domain for a startup idea before I knew what the product was, who the customer was, or whether anyone would want it.', tribunal: 'idea' },
  { label: 'Productivity take', text: 'Most productivity advice is secular religion for anxious people. It doesn\'t make you more effective. It just lets you feel virtuous about being busy.', tribunal: 'opinion' },
  { label: 'Roast my life choice', text: 'I moved to a new city for a relationship that ended three months later, and now I\'m pretending I moved for the \'opportunities\'.', tribunal: 'roast' },
]

interface Props {
  onSelect: (text: string, tribunal: string) => void
}

export function ExampleCaseButtons({ onSelect }: Props) {
  return (
    <div className="w-full">
      <p className="text-xs uppercase tracking-widest text-[#6b7280] mb-3 font-medium">Or try one of these</p>
      <div className="flex flex-wrap gap-2">
        {EXAMPLES.map((ex) => (
          <button
            key={ex.label}
            onClick={() => onSelect(ex.text, ex.tribunal)}
            className="text-xs border border-[#1e1e2e] rounded-full px-4 py-1.5 text-[#9ca3af] hover:text-[#f0ead6] hover:border-[#2a2a3e] hover:bg-[#14141f] transition-all duration-200 cursor-pointer"
          >
            {ex.label}
          </button>
        ))}
      </div>
    </div>
  )
}
