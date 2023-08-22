import React from 'react'
import {useTranslation} from 'react-i18next'
import {StyleSheet, Text, View, ViewStyle} from 'react-native'
import DefaultComponentsThemes from '../defaultComponentsThemes'
import { CustomInputText } from './CustomInputText'
import TextInput from './TextInput'


type Props = {
  eventName: string
  setEventName: (value: string) => void
  containerStyles?: ViewStyle
}

export const NameSection = ({eventName, setEventName, containerStyles}: Props) => {
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
        label={t('AddEvent.Name')}
        returnKeyType="next"
        value={eventName}
        onChangeText={text => setEventName(text)}
        autoCapitalize="none"
      />
    </View>
  )
}
