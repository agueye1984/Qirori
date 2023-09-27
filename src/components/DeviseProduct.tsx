import React, { useEffect, useState } from 'react'
import {useTranslation} from 'react-i18next'
import {StyleSheet, Text, View, ViewStyle} from 'react-native'
import DefaultComponentsThemes from '../defaultComponentsThemes'
import TextInput from './TextInput'
import { SelectList } from 'react-native-dropdown-select-list'
import { useTheme } from '../contexts/theme'
import { getSupportedCurrencies } from 'react-native-format-currency'
import { theme } from '../core/theme';


type Props = {
  productDevise: string
  setProductDevise: (value: string) => void
  containerStyles?: ViewStyle
}

export const DeviseProduct = ({productDevise, setProductDevise, containerStyles}: Props) => {
  const {t} = useTranslation()
  const defaultStyles = DefaultComponentsThemes()
  const {ColorPallet} = useTheme()

 //const data = getSupportedCurrencies();

 const transformed = getSupportedCurrencies().map(({ code , name }) => ({ key: code, value: code+': '+name}));

  const styles = StyleSheet.create({
    container: {
      minHeight: 50,
      marginVertical: 10,
      borderWidth: 2,
      borderColor: ColorPallet.lightGray,
      borderRadius: 4,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      ...containerStyles,
      backgroundColor: theme.colors.surface,
    },
    buttonStyle: {
      flex: 1,
      width: '100%',
      height: '100%',
      backgroundColor: 'transparent',
    },
    text: {
      textAlign: 'left',
    },
    dropdownStyle: {
      borderColor: ColorPallet.lightGray,
      borderBottomWidth: 2,
      borderLeftWidth: 2,
      borderRightWidth: 2,
      borderStyle: 'solid',
      borderBottomLeftRadius: 4,
      maring: '0',
      borderBottomRightRadius: 4,
    },
  })

  return (
    <View>
      <SelectList
          boxStyles={styles.container}
          setSelected={(val: string) => setProductDevise(val)}
          data={transformed}
          search={true}
          save="key"
          placeholder={t('Dropdown.Select')}
        />
        

    </View>
  )
}
