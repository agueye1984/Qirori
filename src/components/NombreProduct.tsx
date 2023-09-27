import React from 'react'
import {useTranslation} from 'react-i18next'
import {StyleSheet, Text, View, ViewStyle} from 'react-native'
import DefaultComponentsThemes from '../defaultComponentsThemes'
import { CustomInputText } from './CustomInputText'
import TextInput from './TextInput'


type Props = {
  productNombre: string
  setProductNombre: (value: string) => void
  containerStyles?: ViewStyle
}

export const NombreProduct = ({productNombre, setProductNombre, containerStyles}: Props) => {
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
        label={t('AddProduct.Nombre')}
        returnKeyType="next"
        value={productNombre}
        onChangeText={text => setProductNombre(text)}
        autoCapitalize="none"
      />
    </View>
  )
}