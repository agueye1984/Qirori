import {uuid} from '@aries-framework/core/build/utils/uuid'
import {Accueil} from '../contexts/types'

export const SettingsList = (t: any): Accueil[] => {
  return [
    {
      id: uuid(),
      title: t('SettingsList.Settings'),
      route : 'Setting',
      images: 'Icon3:setting',
    },
    {
        id: uuid(),
        title: t('SettingsList.ContributionsList'),
        route : 'ContributionsList',
        images: 'Icon:money',
    },
    {
      id: uuid(),
      title: t('SettingsList.InvitationsList'),
      route : 'InvitationsList',
      images: 'Icon2:envelope-letter',
  },
    {
      id: uuid(),
      title: t('SettingsList.ProductOrderings'),
      route : 'ProductOrderings',
      images: 'Icon1:hand-holding-usd',
  },
    {
      id: uuid(),
      title: t('SettingsList.ProductDelivering'),
      route : 'ProductDelivering',
      images: 'Icon:shopping-cart',
  },
  ]
}
