import React from 'react'
import {useTranslation} from 'react-i18next'
import {StyleSheet, Text, View, ViewStyle} from 'react-native'
import DefaultComponentsThemes from '../defaultComponentsThemes'
import { CustomInputText } from './CustomInputText'
import TextInput from './TextInput'


type Props = {
  productPrixUnitaire: string
  setProductPrixUnitaire: (value: string) => void
  containerStyles?: ViewStyle
}

export const PrixUnitaireProduct = ({productPrixUnitaire, setProductPrixUnitaire, containerStyles}: Props) => {
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
        label={t('AddProduct.PrixUnitaire')}
        returnKeyType="next"
        value={productPrixUnitaire}
        onChangeText={text => setProductPrixUnitaire(text)}
        autoCapitalize="none"
      />
    </View>
  )
}
