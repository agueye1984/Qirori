import {uuid} from '@aries-framework/core/build/utils/uuid'
import {Accueil} from '../contexts/types'

export const AccueilList = (t: any): Accueil[] => {
  return [
    {
      id: uuid(),
      title: t('AccueilList.Evenements'),
      route : 'Events',
      images: 'Icon1:event',
    },
    {
        id: uuid(),
        title: t('AccueilList.Invitations'),
        route : 'Invitations',
        images: 'Icon2:envelope-letter',
    },
    {
        id: uuid(),
        title: t('AccueilList.Contributions'),
        route : 'Contributions',
        images: 'Icon:money',
    },
    {
        id: uuid(),
        title: t('AccueilList.Ventes'),
        route : 'Ventes',
        images: 'Icon3:hand-holding-usd',
    },
    {
        id: uuid(),
        title: t('AccueilList.Achats'),
        route : 'Achats',
        images: 'Icon:shopping-cart',
    },
  ]
}
