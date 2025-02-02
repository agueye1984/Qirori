import {v4 as uuidv4} from 'uuid';
import {Accueil} from '../contexts/types';

export const DashboardList = (t: any): Accueil[] => {
  return [
    {
      id: uuidv4(),
      title: t('DashboardList.Dashboards'),
      route: 'Dashboards',
      images: 'Icon:dashboard',
    },
    {
      id: uuidv4(),
      title: t('DashboardList.Administrators'),
      route: 'Administrators',
      images: 'Icon1:admin-panel-settings',
    },
    {
      id: uuidv4(),
      title: t('DashboardList.Users'),
      route: 'Users',
      images: 'Icon:users',
    },
    {
      id: uuidv4(),
      title: t('DashboardList.Products'),
      route: 'ManageProducts',
      images: 'Icon:shopping-basket',
    },
    {
      id: uuidv4(),
      title: t('DashboardList.Categories'),
      route: 'ManageCategories',
      images: 'Icon4:appstore-o',
    },
    {
      id: uuidv4(),
      title: t('DashboardList.TypeOffres'),
      route: 'ManageTypeOffres',
      images: 'Icon3:gifts',
    },
    {
      id: uuidv4(),
      title: t('DashboardList.TypeEvents'),
      route: 'TypeEvents',
      images: 'Icon:birthday-cake',
    },
    {
      id: uuidv4(),
      title: t('DashboardList.TypePrix'),
      route: 'ManageTypePrix',
      images: 'Icon3:hand-holding-usd',
    },
    {
      id: uuidv4(),
      title: t('DashboardList.ValidationVendeur'),
      route: 'ManageVendeur',
      images: 'Icon1:shopping-basket',
    },
  ];
};
