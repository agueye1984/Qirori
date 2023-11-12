import React from 'react'
import {useTranslation} from 'react-i18next'
import {StyleSheet, Text, View, ViewStyle} from 'react-native'
import DefaultComponentsThemes from '../defaultComponentsThemes'
import { CustomInputText } from './CustomInputText'
import TextInput from './TextInput'


type Props = {
  productQuantite: string
  setProductQuantite: (value: string) => void
}

export const QuantiteProduct = ({productQuantite, setProductQuantite}: Props) => {
  const {t} = useTranslation()

  return (
    <View>
      <TextInput
        label={t('AddProduct.Quantite')}
        returnKeyType="next"
        value={productQuantite}
        onChangeText={text => setProductQuantite(text)}
        autoCapitalize="none"
        keyboardType='number-pad'
      />
    </View>
  )
}
