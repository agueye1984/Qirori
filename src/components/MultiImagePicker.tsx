import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View, Button, Image, ScrollView, StyleSheet, Pressable, Alert } from 'react-native';
import { launchImageLibrary, ImagePickerResponse, MediaType } from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/MaterialIcons';

type Props = {
  servicesImages: string[];
  setServiceImages: (value: string[]) => void;
};

const MultiImagePicker = ({ servicesImages, setServiceImages }: Props) => {
  const { t } = useTranslation();
  const [images, setImages] = useState<string[]>(servicesImages);

  useEffect(() => {
    setImages(servicesImages);
  }, [servicesImages]);

  const handleChooseImage = (replaceIndex?: number) => {
    const options = {
      mediaType: 'photo' as MediaType,
      selectionLimit: replaceIndex==undefined ? 10: 1,
    };

    launchImageLibrary(options, (response: ImagePickerResponse) => {
      if (response.didCancel) {
        console.log("L'utilisateur a annulé la sélection des images");
      } else if (response.errorCode) {
        console.log("Erreur: ", response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
       const selectedImageUris = response.assets
       .map(asset => asset.uri)
       .filter(uri => uri !== undefined) as string[]; 
        
        if (selectedImageUris) {
          if (replaceIndex !== undefined) {
            const updatedImages = [...images];
            updatedImages[replaceIndex] = selectedImageUris[0];
            setImages(updatedImages);
            setServiceImages(updatedImages);
          } else {
            setImages((prevImages) => [...prevImages, ...selectedImageUris]);  // Ajouter toutes les images sélectionnées
            setServiceImages([...servicesImages, ...selectedImageUris]);
          }
        }
      }
    });
  };

  const handleRemoveImage = (index: number) => {
    Alert.alert(
      t('Global.ConfirmDelete'),
      t('Global.AreYouSureDeleteImage'),
      [
        { text: t('Global.Cancel'), style: 'cancel' },
        {
          text: t('Global.Delete'),
          style: 'destructive',
          onPress: () => {
            const updatedImages = images.filter((_, i) => i !== index);
            setImages(updatedImages);
            setServiceImages(updatedImages);
          },
        },
      ]
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Button title={t('Global.ChooseImages')} onPress={() => handleChooseImage()} />
      <View style={styles.imageContainer}>
        {images.map((imageUri, index) => (
          <View key={index} style={styles.imageWrapper}>
            {/* Bouton pour remplacer l'image */}
            <Pressable onPress={() => handleChooseImage(index)} style={styles.replaceButton}>
              <Icon name="edit" size={20} color="white" />
            </Pressable>
            {/* Affichage de l'image */}
            <Image source={{ uri: imageUri }} style={styles.image} />
            {/* Bouton pour supprimer l'image */}
            <Pressable onPress={() => handleRemoveImage(index)} style={styles.removeButton}>
              <Icon name="delete" size={20} color="white" />
            </Pressable>
          </View>
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
  imageWrapper: {
    position: 'relative',
    marginRight: 10,
    marginBottom: 10,
    width: 100,
    height: 100,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  replaceButton: {
    position: 'absolute',
    top: 5,
    left: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 5,
    borderRadius: 15,
    zIndex: 1, // S'assurer que l'icône est au-dessus de l'image
  },
  removeButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(255, 0, 0, 0.7)',
    padding: 5,
    borderRadius: 15,
    zIndex: 1, // S'assurer que l'icône est au-dessus de l'image
  },
});

export default MultiImagePicker;
