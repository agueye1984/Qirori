import React from 'react'
import {useTranslation} from 'react-i18next'
import {StyleSheet, Text, View, ViewStyle} from 'react-native'
import DefaultComponentsThemes from '../defaultComponentsThemes'
import { CustomInputText } from './CustomInputText'


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
      <Text style={styles.detailsTitle}>{t('AddEvent.Name')}</Text>
      <CustomInputText
        value={eventName}
        setValue={setEventName}
        placeholder={t('AddEvent.Name')}
        containerStyle={containerStyles}
      />
    </View>
  )
}
