export const defaultLanguage = 'en'

export enum LocalStorageKeys {
  Onboarding = 'onboarding',
  Language = 'language',
  User = 'users',
  Events = 'events',
  UserId= 'user_id',
  Invitations = 'invitations',
  Contributions= 'contributions',
  Products= 'products',
  Services= 'services',
  Carts= 'carts',
  ContactUs= 'contactUs',
}

const lengthOfhiddenAttributes = 10
const unicodeForBulletCharacter = '\u2022'
export const hiddenField = Array(lengthOfhiddenAttributes).fill(unicodeForBulletCharacter).join('')
