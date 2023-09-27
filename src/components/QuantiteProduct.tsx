import React from 'react'
import {useTranslation} from 'react-i18next'
import {StyleSheet, Text, View, ViewStyle} from 'react-native'
import DefaultComponentsThemes from '../defaultComponentsThemes'
import { CustomInputText } from './CustomInputText'
import TextInput from './TextInput'


type Props = {
  productQuantite: string
  setProductQuantite: (value: string) => void
  containerStyles?: ViewStyle
}

export const QuantiteProduct = ({productQuantite, setProductQuantite, containerStyles}: Props) => {
  const {t} = useTranslation()
  const defaultStyles = DefaultComponentsThemes()
  const styles = StyleSheet.create({
    detailsTitle: {
      ...defaultStyles.text,
      ...defaultStyles.requestDetailsTitle,
    },
  })

  return (
    <View>
      <TextInput
        label={t('AddProduct.Quantite')}
        returnKeyType="next"
        value={productQuantite}
        onChangeText={text => setProductQuantite(text)}
        autoCapitalize="none"
      />
    </View>
  )
}
