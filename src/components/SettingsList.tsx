import {v4 as uuidv4} from 'uuid'
import {Accueil} from '../contexts/types';

export const SettingsList = (t: any): Accueil[] => {
  return [
    {
      id: uuidv4(),
      title: t('SettingsList.Settings'),
      route: 'Setting',
      images: 'Icon3:setting',
    },
    {
      id: uuidv4(),
      title: t('SettingsList.ContributionsList'),
      route: 'ContributionsList',
      images: 'Icon:money',
    },
    {
      id: uuidv4(),
      title: t('SettingsList.InvitationsList'),
      route: 'InvitationsList',
      images: 'Icon2:envelope-letter',
    },
    {
      id: uuidv4(),
      title: t('SettingsList.ProductOrderings'),
      route: 'ProductOrderings',
      images: 'Icon1:hand-holding-usd',
    },
    {
      id: uuidv4(),
      title: t('SettingsList.ProductDelivering'),
      route: 'ProductDelivering',
      images: 'Icon:shopping-cart',
    },
  ];
};
