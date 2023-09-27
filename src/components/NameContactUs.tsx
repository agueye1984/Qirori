import React from 'react'
import {useTranslation} from 'react-i18next'
import {StyleSheet, Text, View, ViewStyle} from 'react-native'
import DefaultComponentsThemes from '../defaultComponentsThemes'
import { CustomInputText } from './CustomInputText'
import TextInput from './TextInput'


type Props = {
  contactUsName: string
  setContactUsName: (value: string) => void
  containerStyles?: ViewStyle
}

export const NameContactUs = ({contactUsName, setContactUsName, containerStyles}: Props) => {
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
        value={contactUsName}
        onChangeText={text => setContactUsName(text)}
        autoCapitalize="none"
      />
    </View>
  )
}
