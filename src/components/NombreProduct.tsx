import React from 'react'
import {useTranslation} from 'react-i18next'
import {View} from 'react-native'
import TextInput from './TextInput'


type Props = {
  productNombre: string
  setProductNombre: (value: string) => void
}

export const NombreProduct = ({productNombre, setProductNombre}: Props) => {
  const {t} = useTranslation()

  return (
    <View>
      <TextInput
        label={t('AddProduct.Nombre')}
        returnKeyType="next"
        value={productNombre}
        onChangeText={text => setProductNombre(text)}
        autoCapitalize="none"
      />
    </View>
  )
}
