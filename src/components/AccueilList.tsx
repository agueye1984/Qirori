import 'react-native-get-random-values';
import {v4 as uuidv4} from 'uuid'
import {Accueil} from '../contexts/types'

export const AccueilList = (t: any): Accueil[] => {
  return [
    {
      id: uuidv4(),
      title: t('AccueilList.Evenements'),
      route : 'Events',
      images: 'Icon1:event',
    },
    {
        id: uuidv4(),
        title: t('AccueilList.Invitations'),
        route : 'Invitations',
        images: 'Icon2:envelope-letter',
    },
    {
        id: uuidv4(),
        title: t('AccueilList.Contributions'),
        route : 'Contributions',
        images: 'Icon:money',
    },
    {
        id: uuidv4(),
        title: t('AccueilList.Ventes'),
        route : 'Ventes',
        images: 'Icon3:hand-holding-usd',
    },
    {
        id: uuidv4(),
        title: t('AccueilList.Achats'),
        route : 'Achats',
        images: 'Icon4:shopping-outline',
    },
  ]
}
