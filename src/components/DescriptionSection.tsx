import React from 'react'
import {useTranslation} from 'react-i18next'
import {StyleSheet, Text, View} from 'react-native'
import DefaultComponentsThemes from '../defaultComponentsThemes'
import { CustomInputText } from './CustomInputText'


type Props = {
  eventDescription: string
  setEventDescription: (value: string) => void
  maxLength?: number
}

export const DescriptionSection = ({
  eventDescription,
  setEventDescription,
  maxLength,
}: Props) => {
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
      <Text style={styles.detailsTitle}>{t('AddEvent.Description')}</Text>
      <CustomInputText
        value={eventDescription}
        setValue={setEventDescription}
        placeholder={t('AddEvent.Description')}
        containerStyle={{minHeight: 100}}
        maxLength={maxLength}
        multiline={true}
      />
    </View>
  )
}
