import { useT } from '../i18n'

export function HowItWorks() {
  const t = useT()

  const STEPS = [
    {
      num: '01',
      title: t('how.step_1_title'),
      body: t('how.step_1_body'),
    },
    {
      num: '02',
      title: t('how.step_2_title'),
      body: t('how.step_2_body'),
    },
    {
      num: '03',
      title: t('how.step_3_title'),
      body: t('how.step_3_body'),
    },
  ]

  return (
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <p className="text-xs uppercase tracking-[0.2em] text-[#6b7280] text-center mb-2 font-medium">{t('how.section_label')}</p>
        <h2 className="text-3xl font-black text-[#f0ead6] text-center mb-12" style={{ fontFamily: 'Georgia, Times New Roman, serif' }}>
          {t('how.title')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {STEPS.map((step, i) => (
            <div
              key={step.num}
              className="rounded-xl border border-[#1e1e2e] bg-[#14141f] p-6 animate-fade-in-up"
              style={{ animationDelay: `${i * 100}ms`, opacity: 0, animationFillMode: 'forwards' }}
            >
              <p className="text-3xl font-black text-[#d4a853]/30 mb-3" style={{ fontFamily: 'Georgia, Times New Roman, serif' }}>
                {step.num}
              </p>
              <h3 className="text-base font-bold text-[#f0ead6] mb-2">{step.title}</h3>
              <p className="text-sm text-[#9ca3af] leading-relaxed">{step.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
