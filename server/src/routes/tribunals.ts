import { Router } from 'express'
import { parseLocale } from '@the-tribunal/contracts'
import { TRIBUNALS } from '../tribunals.js'
import { t } from '../i18n/index.js'
import type { TribunalId } from '../tribunals.js'

const router = Router()

router.get('/', (req, res) => {
  const locale = parseLocale(req.query.locale)
  const list = Object.values(TRIBUNALS).map((tr) => {
    const id = tr.id as TribunalId
    return {
      id: tr.id,
      name: t(`tribunal.${id}.name`, locale),
      description: t(`tribunal.${id}.description`, locale),
      icon: tr.icon,
      tone: t(`tribunal.${id}.tone`, locale),
      scoreLabel: t(`tribunal.${id}.score_label`, locale),
      possibleVerdicts: tr.possibleVerdicts,
      panelAgents: tr.panelAgents.map((a) => ({ name: a.name, role: a.role })),
    }
  })
  res.json(list)
})

export default router
