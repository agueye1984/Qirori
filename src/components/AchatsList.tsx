import {uuid} from '@aries-framework/core/build/utils/uuid'
import {Accueil} from '../contexts/types'

export const AchatsList = (t: any): Accueil[] => {
  return [
    {
      id: uuid(),
      title: t('AchatsList.BuyProduct'),
      route : 'BuyProduct',
      images: 'Icon:cube',
    },
    {
        id: uuid(),
        title: t('AchatsList.RequestService'),
        route : 'RequestService',
        images: 'Icon1:headset-mic',
    },
  ]
}
