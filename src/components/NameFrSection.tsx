import React from 'react'
import {useTranslation} from 'react-i18next'
import {View} from 'react-native'
import TextInput from './TextInput'

type Props = {
  nameFr: string
  setNameFr: (value: string) => void
}

export const NameFrSection = ({nameFr, setNameFr}: Props) => {
  const {t} = useTranslation()

  return (
    <View>
      <TextInput
        label={t('AddTypeEvent.NameFr')}
        returnKeyType="next"
        value={nameFr}
        onChangeText={(text) => setNameFr(text)}
        autoCapitalize="none"
      />
    </View>
  )
}
