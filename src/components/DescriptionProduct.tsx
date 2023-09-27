import React from 'react'
import {useTranslation} from 'react-i18next'
import {StyleSheet, Text, View} from 'react-native'
import DefaultComponentsThemes from '../defaultComponentsThemes'
import { CustomInputText } from './CustomInputText'
import TextInput from './TextInput'
import { useTheme } from '../contexts/theme'
import { theme } from '../core/theme'


type Props = {
  productDescription: string
  setProductDescription: (value: string) => void
  maxLength?: number
}

export const DescriptionProduct = ({
  productDescription,
  setProductDescription,
  maxLength,
}: Props) => {
  const {t} = useTranslation()
  const defaultStyles = DefaultComponentsThemes()
  const {ColorPallet} = useTheme()

  const styles = StyleSheet.create({
    detailsTitle: {
      ...defaultStyles.text,
      ...defaultStyles.requestDetailsTitle,
    },
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
        label={t('AddProduct.Description')}
        returnKeyType="next"
        value={productDescription}
        onChangeText={text => setProductDescription(text)}
        autoCapitalize="none"
        multiline={true}
        maxLength={maxLength}
        numberOfLines={4}
      />
    </View>
    <View>
      {maxLength && (
        <Text style={styles.characterText}>
          {productDescription.length}/{maxLength} {t('AddEvent.CharacterCount')}
        </Text>
      )}
    </View>
    </View>
  )
}
