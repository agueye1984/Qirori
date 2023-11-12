import React from 'react'
import {useTranslation} from 'react-i18next'
import {View} from 'react-native'
import TextInput from './TextInput'


type Props = {
  eventName: string
  setEventName: (value: string) => void
  error: string
}

export const NameSection = ({eventName, setEventName, error}: Props) => {
  const {t} = useTranslation()

  return (
    <View>
      <TextInput
        label={t('AddEvent.Name')}
        returnKeyType="next"
        value={eventName}
        onChangeText={text => setEventName(text)}
        autoCapitalize="none"
        error={!!error}
        errorText={error}
      />
    </View>
  )
}
