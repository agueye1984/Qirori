export const defaultLanguage = 'en'

export enum LocalStorageKeys {
  Onboarding = 'onboarding',
  Language = 'language',
  User = 'users',
  Events = 'events',
  UserId= 'user_id',
}

const lengthOfhiddenAttributes = 10
const unicodeForBulletCharacter = '\u2022'
export const hiddenField = Array(lengthOfhiddenAttributes).fill(unicodeForBulletCharacter).join('')
