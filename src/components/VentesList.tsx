import {v4 as uuidv4} from 'uuid'
import {Accueil} from '../contexts/types';

export const VentesList = (t: any): Accueil[] => {
  return [
    {
      id: uuidv4(),
      title: t('VentesList.AddProduct'),
      route: 'AddProduct',
      images: 'Icon:cube',
    },
    {
      id: uuidv4(),
      title: t('VentesList.ListProducts'),
      route: 'Products',
      images: 'Icon:list',
    },
    {
      id: uuidv4(),
      title: t('VentesList.AddService'),
      route: 'AddService',
      images: 'Icon1:offer',
    },
    {
      id: uuidv4(),
      title: t('VentesList.ListServices'),
      route: 'Services',
      images: 'Icon:list',
    },
  ];
};
