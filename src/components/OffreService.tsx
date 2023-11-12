import React from 'react'
import {useTranslation} from 'react-i18next'
import {View} from 'react-native'
import TextInput from './TextInput'


type Props = {
  offreService: string
  setOffreService: (value: string) => void
}

export const OffreService = ({offreService, setOffreService}: Props) => {
  const {t} = useTranslation()

  return (
    <View>
      <TextInput
        label={t('AddService.AddOffre')}
        returnKeyType="next"
        value={offreService}
        onChangeText={text => setOffreService(text)}
        autoCapitalize="none"
      />
    </View>
  )
}
