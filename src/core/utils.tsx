import {TFunction} from 'i18next'

export const emailValidator = (email: string, t: TFunction<'translation', undefined>) => {
  const re = /\S+@\S+\.\S+/;
  
  if (!email || email.length <= 0) return t('RegisterScreen.EmailErrorEmpty');
  if (!re.test(email)) return t('RegisterScreen.EmailError');

  return '';
};

export const passwordValidator = (password: string, t: TFunction<'translation', undefined>) => {
  if (!password || password.length <= 0) return t('RegisterScreen.PasswordErrorEmpty');
  const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!re.test(password)) return t('RegisterScreen.PasswordError');
  return '';
};

export const nameValidator = (name: string, t: TFunction<'translation', undefined>) => {
  if (!name || name.length <= 0) return t('RegisterScreen.NameErrorEmpty');

  return '';
};

export const retapePasswordValidator = (retapePassword: string, t: TFunction<'translation', undefined>) => {
  if (!retapePassword || retapePassword.length <= 0) return t('RegisterScreen.RetapePasswordErrorEmpty');
  const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!re.test(retapePassword)) return t('RegisterScreen.RetapePasswordError');

  return '';
};

export const phoneValidator = (phone: string, t: TFunction<'translation', undefined>) => {
  if (!phone || phone.length <= 0) return t('RegisterScreen.PhoneErrorEmpty');
  const re = /^[\+]?[0-9]{11}$/;
  if (!re.test(phone)) return t('RegisterScreen.PhoneError');
  return '';
};

export const descriptionValidator = (description: string, t: TFunction<'translation', undefined>) => {
  if (!description || description.length <= 0) return t('AddEvent.DescriptionErrorEmpty');

  return '';
};

export const dateDebutValidator = (dateDebut: string, t: TFunction<'translation', undefined>) => {
  if (!dateDebut || dateDebut.length <= 0) return t('AddEvent.DateDebutErrorEmpty');

  return '';
};

export const heureDebutValidator = (heureDebut: string, t: TFunction<'translation', undefined>) => {
  if (!heureDebut || heureDebut.length <= 0) return t('AddEvent.HeureDebutErrorEmpty');

  return '';
};

export const dateFinValidator = (dateFin: string, t: TFunction<'translation', undefined>) => {
  if (!dateFin || dateFin.length <= 0) return t('AddEvent.DateFinErrorEmpty');

  return '';
};

export const heureFinValidator = (name: string, t: TFunction<'translation', undefined>) => {
  if (!name || name.length <= 0) return t('AddEvent.NameErrorEmpty');

  return '';
};

export const localisationValidator = (localisation: string, t: TFunction<'translation', undefined>) => {
  if (!localisation || localisation.length <= 0) return t('AddEvent.localisationErrorEmpty');

  return '';
};
