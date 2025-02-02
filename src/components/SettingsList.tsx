import {v4 as uuidv4} from 'uuid'
import {Accueil} from '../contexts/types';

const settingsData = [
  {
    title: 'SettingsList.Settings',
    route: 'Setting',
    images: 'Icon3:setting',
  },
  {
    title: 'SettingsList.EventsList',
    route: 'EventsList',
    images: 'Icon4:event',
  },
  {
    title: 'SettingsList.ContributionsList',
    route: 'ContributionsList',
    images: 'Icon:money',
  },
  {
    title: 'SettingsList.InvitationsList',
    route: 'InvitationsList',
    images: 'Icon2:envelope-letter',
  },
  {
    title: 'SettingsList.ProductOrderings',
    route: 'ProductOrderings',
    images: 'Icon1:hand-holding-usd',
  },
  {
    title: 'SettingsList.ProductDelivering',
    route: 'ProductDelivering',
    images: 'Icon:shopping-cart',
  },
  {
    title: 'SettingsList.ValidationVendeur',
    route: 'ValidationVendeur',
    images: 'Icon5:basket-check-outline',
  },
];

export const SettingsList = (t: any): Accueil[] =>
  settingsData.map(item => ({
    ...item,
    id: uuidv4(),
    title: t(item.title),
  }));
