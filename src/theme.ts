export interface ColorSheme {
  dark: Theme
  light: Theme
}

export interface Theme {
  ColorPallet: ColorPallet
}

const NotificationColors: NotificationColors = {
  success: '#FFFFFF',
  successBorder: '#5B8046',
  successIcon: '#5B8046',
  successText: '#000000',
  info: '#FFFFFF',
  infoBorder: '#0099FF',
  infoIcon: '#0099FF',
  infoText: '#000000',
  warn: '#FFFFFF',
  warnBorder: '#D8AF3B',
  warnIcon: '#D8AF3B',
  warnText: '#000000',
  error: '#FFFFFF',
  errorBorder: '#F8DCD8',
  errorIcon: '#F8DCD8',
  errorText: '#000000',
}

interface NotificationColors {
  success: string
  successBorder: string
  successIcon: string
  successText: string
  info: string
  infoBorder: string
  infoIcon: string
  infoText: string
  warn: string
  warnBorder: string
  warnIcon: string
  warnText: string
  error: string
  errorBorder: string
  errorIcon: string
  errorText: string
}

interface ColorPallet {
  primaryBackground: string
  primaryText: string
  primary: string
  secondary: string
  titleHighlight: string
  white: string
  lightGray: string
  darkGray: string
  success: string
  warning: string
  error: string
  link: string
  notification: NotificationColors
}

const ColorPalletLight: ColorPallet = {
  primaryBackground: '#F2EFEF',
  primaryText: '#223654',
  //primary: '#095797',
  primary: '#E37627',
  secondary: '#0C2550',
  titleHighlight: '#E58271',
  white: '#FFFFFF',
  lightGray: '#b8b8b8',
  darkGray: '#454545',
  success: '#5B8046',
  warning: '#D8AF3B',
  error: '#CB381F',
  link: '#095797',
  notification: NotificationColors,
}

const ColorPalletDark: ColorPallet = {
  primaryBackground: '#575757',
  primaryText: '#FFFFFF',
  // primary: '#095797',
  primary: '#E37627',
  secondary: '#0C2550',
  titleHighlight: '#E58271',
  white: '#FFFFFF',
  lightGray: '#b8b8b8',
  darkGray: '#525252',
  success: '#5B8046',
  warning: '#D8AF3B',
  error: '#CB381F',
  link: '#095797',
  notification: NotificationColors,
}

const themeLight: Theme = {
  ColorPallet: ColorPalletLight,
}

const themeDark: Theme = {
  ColorPallet: ColorPalletDark,
}

export const defaultColorSheme: ColorSheme = {
  dark: themeDark,
  light: themeLight,
}

export const appColors = {
  //primary: '#00C569',
  primary: '#E37627',
  secondary: '#fff',
  white: '#ffffff',
  black: '#000',
  yellow: '#FFC107',
  redOrange: '#FF3D00',
  red: '#E80057',
  darkGray: '#929292',
  lightGray: '#DDDDDD',
  gray: '#BEBEBE',
  lightGreen: 'rgba(0,197,105, 0.2)',
}
export const shadow = {
  shadowColor: '#000',
  shadowOffset: {
    width: 0,
    height: 2,
  },
  //shadowOpacity: 0.25,
  shadowRadius: 3.84,
  elevation: 2,
}
