import React from 'react'
import {useTranslation} from 'react-i18next'
import {View} from 'react-native'
import TextInput from './TextInput'


type Props = {
  contactUsName: string
  setContactUsName: (value: string) => void
}

export const NameContactUs = ({contactUsName, setContactUsName}: Props) => {
  const {t} = useTranslation()

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
