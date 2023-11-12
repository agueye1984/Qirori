import React from 'react'
import {useTranslation} from 'react-i18next'
import { View} from 'react-native'
import TextInput from './TextInput'


type Props = {
  productPrixUnitaire: string
  setProductPrixUnitaire: (value: string) => void
}

export const PrixUnitaireProduct = ({productPrixUnitaire, setProductPrixUnitaire}: Props) => {
  const {t} = useTranslation()

  return (
    <View>
      <TextInput
        label={t('AddProduct.PrixUnitaire')}
        returnKeyType="next"
        value={productPrixUnitaire}
        onChangeText={text => setProductPrixUnitaire(text)}
        autoCapitalize="none"
        keyboardType='number-pad'
      />
    </View>
  )
}
