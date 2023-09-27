import React from 'react'
import {useTranslation} from 'react-i18next'
import {StyleSheet, Text, View, ViewStyle} from 'react-native'
import DefaultComponentsThemes from '../defaultComponentsThemes'
import { CustomInputText } from './CustomInputText'
import TextInput from './TextInput'


type Props = {
  productName: string
  setProductName: (value: string) => void
  containerStyles?: ViewStyle
}

export const NameProduct = ({productName, setProductName, containerStyles}: Props) => {
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
        label={t('AddProduct.Name')}
        returnKeyType="next"
        value={productName}
        onChangeText={text => setProductName(text)}
        autoCapitalize="none"
      />
    </View>
  )
}
