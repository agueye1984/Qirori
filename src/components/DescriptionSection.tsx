import React from 'react'
import {useTranslation} from 'react-i18next'
import {StyleSheet, Text, View} from 'react-native'
import TextInput from './TextInput'
import { theme } from '../core/theme'


type Props = {
  eventDescription: string
  setEventDescription: (value: string) => void
  maxLength?: number
  error: string
}

export const DescriptionSection = ({
  eventDescription,
  setEventDescription,
  maxLength,
  error,
}: Props) => {
  const {t} = useTranslation()

  const styles = StyleSheet.create({
    characterText: {
      textAlign: 'right',
      color: theme.colors.primaryText,
      fontSize: 14,
      justifyContent: 'flex-start',
    },
  })

  return (
    <View>
    <View>
      <TextInput
        label={t('AddEvent.Description')}
        returnKeyType="next"
        value={eventDescription}
        onChangeText={text => setEventDescription(text)}
        autoCapitalize="none"
        multiline={true}
        maxLength={maxLength}
        numberOfLines={4}
        error={!!error}
        errorText={error}
      />
    </View>
    <View>
      {maxLength && (
        <Text style={styles.characterText}>
          {eventDescription.length}/{maxLength} {t('AddEvent.CharacterCount')}
        </Text>
      )}
    </View>
    </View>
  )
}
