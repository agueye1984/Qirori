import {Category} from '../contexts/types'

export const StatusList = (t: any): Category[] => {
  return [
    {
      id: '1',
      name: t('StatusList.Paid'),
    },
    {
      id: '2',
      name: t('StatusList.BeingProcessed'),
    },
    {
      id: '3',
      name: t('StatusList.ReadyToShip'),
    },
    {
      id: '4',
      name: t('StatusList.Shipped'),
    },
    {
      id: '5',
      name: t('StatusList.Livery'),
    },
    {
      id: '6',
      name: t('StatusList.Closed'),
    },
  ]
}
