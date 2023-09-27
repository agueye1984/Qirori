import React from 'react'
import {useTranslation} from 'react-i18next'
import {Button, StyleSheet, Text, View, ViewStyle} from 'react-native'
import DefaultComponentsThemes from '../defaultComponentsThemes'
import { CustomInputText } from './CustomInputText'
import TextInput from './TextInput'
import {MediaType, launchImageLibrary} from 'react-native-image-picker';


type Props = {
  productImage: string
  setProductImage: (value: string) => void
  containerStyles?: ViewStyle
}

export const ImageProduct = ({productImage, setProductImage, containerStyles}: Props) => {
  const {t} = useTranslation()
  const defaultStyles = DefaultComponentsThemes()
  const styles = StyleSheet.create({
    detailsTitle: {
      ...defaultStyles.text,
      ...defaultStyles.requestDetailsTitle,
    },
  })

  const openImagePicker = () => {
    const options = {
      mediaType: 'photo' as MediaType,
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorMessage) {
        console.log('Image picker error: ', response.errorMessage);
      } else {
        let imageUri = response.assets?.[0]?.uri as string;
        setProductImage(imageUri);
      }
    });
  };

  return (
    <View>
      <Button title="Choose from Device" onPress={openImagePicker} />
    </View>
  )
}
