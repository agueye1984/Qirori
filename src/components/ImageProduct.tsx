import React from 'react'
import {useTranslation} from 'react-i18next'
import {Button, Image, StyleSheet, View} from 'react-native'
import DefaultComponentsThemes from '../defaultComponentsThemes'
import {MediaType, launchImageLibrary} from 'react-native-image-picker';


type Props = {
  productImage: string
  setProductImage: (value: string) => void
}

export const ImageProduct = ({productImage, setProductImage}: Props) => {
  const {t} = useTranslation()
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
      <Button title={t('Global.ChooseImage')}onPress={openImagePicker} />
      {productImage!='' && 
        <Image 
        source={{uri:productImage}} 
        style={{height:50,width:50}}/>
      }
    </View>
  )
}
