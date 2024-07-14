import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View, Button, Image, ScrollView, StyleSheet } from 'react-native';
import ImagePicker, { launchImageLibrary, ImagePickerResponse, MediaType } from 'react-native-image-picker';

type Props = {
    setServiceImages: (value: any[]) => void;
  };

const MultiImagePicker = ({setServiceImages}: Props) => {
  const {t} = useTranslation();
  const [images, setImages] = useState<string[]>([]);

  const handleChooseImages = () => {
    const options = {
      mediaType: 'photo' as MediaType,
      selectionLimit: 10, // Limite de sélection d'images
    };
  
    launchImageLibrary(options, (response: ImagePickerResponse) => {
      if (response.didCancel) {
        console.log('L\'utilisateur a annulé la sélection des images');
      } else if (response.errorCode) {
        console.log('Erreur: ', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        const selectedImages = response.assets
          .map(asset => asset.uri)
          .filter(uri => uri !== undefined) as string[]; // Utilisation de filter pour exclure les undefined
  
        setImages((prevImages) => [...prevImages, ...selectedImages]);
        setServiceImages(selectedImages)
      }
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Button title={t('Global.ChooseImages')} onPress={handleChooseImages} />
      <View style={styles.imageContainer}>
        {images.map((imageUri, index) => (
          <Image key={index} source={{ uri: imageUri }} style={styles.image} />
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 20,
  },
  image: {
    width: 100,
    height: 100,
    marginRight: 10,
    marginBottom: 10,
  },
});

export default MultiImagePicker;
