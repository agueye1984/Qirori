import {uuid} from '@aries-framework/core/build/utils/uuid'
import {Accueil} from '../contexts/types'

export const VentesList = (t: any): Accueil[] => {
  return [
    {
      id: uuid(),
      title: t('VentesList.AddProduct'),
      route : 'AddProduct',
      images: 'Icon:cube',
    },
    {
        id: uuid(),
        title: t('VentesList.ListProducts'),
        route : 'Products',
        images: 'Icon:list',
    },
    {
        id: uuid(),
        title: t('VentesList.AddService'),
        route : 'AddService',
        images: 'Icon1:offer',
    },
    {
        id: uuid(),
        title: t('VentesList.ListServices'),
        route : 'Services',
        images: 'Icon:list',
    },
  ]
}
