import {v4 as uuidv4} from 'uuid'
import {Accueil} from '../contexts/types'

export const DashboardList = (t: any): Accueil[] => {
  return [
    {
      id: uuidv4(),
      title: t('DashboardList.Dashboards'),
      route : 'Dashboards',
      images: 'Icon:dashboard',
    },
    {
        id: uuidv4(),
        title: t('DashboardList.Administrators'),
        route : 'Administrators',
        images: 'Icon1:admin-panel-settings',
    },
    {
        id: uuidv4(),
        title: t('DashboardList.Users'),
        route : 'Users',
        images: 'Icon:users',
    },
    {
        id: uuidv4(),
        title: t('DashboardList.Products'),
        route : 'ManageProducts',
        images: 'Icon:shopping-basket',
    },
  ]
}
