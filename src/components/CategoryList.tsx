import {uuid} from '@aries-framework/core/build/utils/uuid'
import {Category} from '../contexts/types'

export const CategoryList = (t: any): Category[] => {
  return [
    {
      id: '1',
      name: t('CategoryList.Music'),
      
    },
    {
        id: '2',
        name: t('CategoryList.Photos'),
        
      },
      {
        id: '3',
        name: t('CategoryList.Meals'),
        
      },
      {
        id: '4',
        name: t('CategoryList.Drink'),
        
      },
      {
        id: '5',
        name: t('CategoryList.Dress'),
        
      },
      {
        id: '6',
        name: t('CategoryList.Transport'),
        
      },
  ]
}
