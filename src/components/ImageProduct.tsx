import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Button, Image, View} from 'react-native';
import {MediaType, launchImageLibrary} from 'react-native-image-picker';

type Props = {
  productImage: string;
  setProductImage: (value: string) => void;
  imageUrl?: string;
};

export const ImageProduct = ({
  productImage,
  setProductImage,
  imageUrl,
}: Props) => {
  const {t} = useTranslation();
  const [imageDisplay, setImageDisplay] = useState<string>('');

  useEffect(() => {
    setImageDisplay(imageUrl === undefined ? '' : imageUrl);
  }, [imageUrl]); 

  const openImagePicker = () => {
    const options = {
      mediaType: 'photo' as MediaType,
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
    };

    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorMessage) {
        console.log('Image picker error: ', response.errorMessage);
      } else {
        let imageUri = response.assets?.[0]?.uri as string;
        setProductImage(imageUri);
        imageUrl = imageUri;
        console.log(imageUrl);
        setImageDisplay(imageUri);
      }
    });
  };

  return (
    <View>
      <Button title={t('Global.ChooseImage')} onPress={openImagePicker} />
      {imageDisplay != '' && (
        <Image
          source={
            imageDisplay === ''
              ? require('../../assets/No_image_available.svg.png')
              : {uri: imageDisplay}
          }
          style={{height: 200, width: 400}}
        />
      )}
    </View>
  );
};
