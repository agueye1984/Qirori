import {TFunction} from 'i18next'
import { Location } from '../contexts/types';

export const emailValidator = (email: string, t: TFunction<'translation', undefined>) => {
  const re = /\S+@\S+\.\S+/;
  
  if (!email || email.length <= 0) return t('Global.EmailErrorEmpty');
  if (!re.test(email)) return t('Global.EmailError');

  return '';
};

export const passwordValidator = (password: string, t: TFunction<'translation', undefined>) => {
  if (!password || password.length <= 0) return t('Global.PasswordErrorEmpty');
  const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!re.test(password)) return t('Global.PasswordError');
  return '';
};

export const nameValidator = (name: string, t: TFunction<'translation', undefined>) => {
  if (!name || name.length <= 0 ) return t('Global.NameErrorEmpty');

  return '';
};

export const nameSectionValidator = (name: string, t: TFunction<'translation', undefined>) => {
  if (!name || name.length <= 0 ) return t('Global.NameSectionErrorEmpty');

  return '';
};

export const retapePasswordValidator = (retapePassword: string, t: TFunction<'translation', undefined>) => {
  if (!retapePassword || retapePassword.length <= 0) return t('Global.RetapePasswordErrorEmpty');
  const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!re.test(retapePassword)) return t('Global.RetapePasswordError');

  return '';
};

export const phoneValidator = (phone: string, t: TFunction<'translation', undefined>) => {
  if (!phone || phone.length <= 0) return t('Global.PhoneErrorEmpty');
  const re = /^[\+]?[0-9]{11}$/;
  if (!re.test(phone)) return t('Global.PhoneError');
  return '';
};

export const descriptionValidator = (description: string, t: TFunction<'translation', undefined>) => {
  if (!description || description.length <= 0) return t('Global.DescriptionErrorEmpty');

  return '';
};

export const dateDebutValidator = (dateDebut: string, t: TFunction<'translation', undefined>) => {
  if (!dateDebut || dateDebut.length <= 0) return t('Global.DateDebutErrorEmpty');

  return '';
};

export const heureDebutValidator = (heureDebut: string, t: TFunction<'translation', undefined>) => {
  if (!heureDebut || heureDebut.length <= 0) return t('Global.HeureDebutErrorEmpty');

  return '';
};

export const dateFinValidator = (dateFin: string, t: TFunction<'translation', undefined>) => {
  if (!dateFin || dateFin.length <= 0) return t('Global.DateFinErrorEmpty');

  return '';
};

export const heureFinValidator = (name: string, t: TFunction<'translation', undefined>) => {
  if (!name || name.length <= 0) return t('Global.NameErrorEmpty');

  return '';
};

export const localisationValidator = (localisation: Location, t: TFunction<'translation', undefined>) => {
  if (!localisation.placeId || localisation.placeId.length <= 0) return t('Global.LocalisationErrorEmpty');

  return '';
};

export const prixUnitaireValidator = (prixUnitaire: string, t: TFunction<'translation', undefined>) => {
  if (!prixUnitaire || prixUnitaire.length <= 0) return t('Global.PrixUnitaireErrorEmpty');

  return '';
};

export const quantiteValidator = (quantite: string, t: TFunction<'translation', undefined>) => {
  if (!quantite || quantite.length <= 0) return t('Global.QuantiteErrorEmpty');

  return '';
};



export const deviseValidator = (devise: string, t: TFunction<'translation', undefined>) => {
  if (!devise || devise.length <= 0) return t('Global.DeviseErrorEmpty');

  return '';
};

export const imageValidator = (image: string, t: TFunction<'translation', undefined>) => {
  if (!image || image.length <= 0) return t('Global.ImageErrorEmpty');

  return '';
};

export const categoryValidator = (category: string, t: TFunction<'translation', undefined>) => {
  if (!category || category.length <= 0) return t('Global.CategoryErrorEmpty');

  return '';
};

export const offreValidator = (offre: string, t: TFunction<'translation', undefined>) => {
  if (!offre || offre.length <= 0) return t('Global.OffreErrorEmpty');

  return '';
};