import React from 'react'
import {useTranslation} from 'react-i18next'
import {StyleSheet, Text, TextInput, View, ViewStyle} from 'react-native'

import {useTheme} from '../contexts/theme'

type Props = {
  value: string
  placeholder?: string
  multiline?: boolean
  containerStyle?: ViewStyle
  maxLength?: number
  setOpenDate?: () => void
}

export const CustomInputTextDate = ({
  value,
  placeholder,
  containerStyle,
  setOpenDate,
}: Props) => {
  const {ColorPallet} = useTheme()
  const {t} = useTranslation()
  const styles = StyleSheet.create({
    container: {
      minHeight: 50,
      marginTop: 10,
      marginBottom: 10,
      paddingHorizontal: 10,
      borderWidth: 1,
      borderColor: ColorPallet.lightGray,
      borderRadius: 4,
    },
    input: {
      flex: 1,
      textAlignVertical: 'top',
      fontSize: 16,
      height: '100%',
      color: ColorPallet.primaryText,
    },
    characterText: {
      textAlign: 'right',
      color: ColorPallet.primaryText,
      fontSize: 14,
      justifyContent: 'flex-start',
    },
  })
  return (
    <View>
      <View style={[styles.container, containerStyle]}>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={setOpenDate}
          placeholder={placeholder}
          blurOnSubmit={false}
          onFocus={setOpenDate}
          onPressIn={setOpenDate}
        />
      </View>
    </View>
  )
}
