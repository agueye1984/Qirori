import React, { useEffect, useState } from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image, Pressable} from 'react-native';
import { theme } from '../core/theme';
import storage from '@react-native-firebase/storage';
import { Product } from '../contexts/types';
import { useTranslation } from 'react-i18next';
import { Swipeable } from 'react-native-gesture-handler';
import { useTheme } from '../contexts/theme';
import Icon from 'react-native-vector-icons/FontAwesome';

type Props = {
  product: Product
    color: string
  }

const ProductLists = ({product, color}: Props) => {
  const {t} = useTranslation();
  const {ColorPallet} = useTheme()
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    storage().ref(product.images).getDownloadURL().then( url => setImageUrl(url))
  }, [imageUrl]);

  const styles = StyleSheet.create({
    contactCon: {
      flex: 1,
      flexDirection: 'row',
      padding: 5,
      borderBottomWidth: 0.5,
      borderBottomColor: '#d9d9d9',
    },
    imgCon: {},
    placeholder: {
      width: 55,
      height: 55,
      borderRadius: 30,
      overflow: 'hidden',
      backgroundColor: '#d9d9d9',
      alignItems: 'center',
      justifyContent: 'center',
      color:color,
    },
    contactDat: {
      flex: 1,
      justifyContent: 'center',
      paddingLeft: 5,
    },
    txt: {
      fontSize: 18,
      color:color,
    },
    name: {
      fontSize: 16,
      color:color,
    },
    phoneNumber: {
      color: '#888',
    },
    thumb: {
      height: 50,
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
      borderBottomLeftRadius: 16,
      borderBottomRightRadius: 16,
      width: 50,
    },
    deleteContainer: {
      marginVertical: 5,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
      paddingVertical: 50,
      paddingHorizontal: 34,
      backgroundColor: ColorPallet.error,
    },
    editContainer: {
      marginVertical: 5,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
      paddingVertical: 50,
      paddingHorizontal: 34,
      backgroundColor: ColorPallet.primary,
    },
  });

  const handleDelete = () => {
    
  }

  const RightSwipeActions = () => {
    return (
      <>
      <Pressable onPress={() => handleDelete()} style={({pressed}) => [styles.deleteContainer, pressed && {opacity: 0.8}]}>
        <Icon name="trash" size={24} color={ColorPallet.white} />
      </Pressable>
      <Pressable onPress={() => handleDelete()} style={({pressed}) => [styles.editContainer, pressed && {opacity: 0.8}]}>
      <Icon name="edit" size={24} color={ColorPallet.white} />
    </Pressable>
    </>
    )
  }

  return (
    <Swipeable renderRightActions={RightSwipeActions}>
    <View style={styles.contactCon}>
      <View style={styles.imgCon}>
        <Image
          style={styles.thumb}
          source={imageUrl==='' ? require('../../assets/No_image_available.svg.png') : {uri:imageUrl}} 
        />
      </View>
      <View style={styles.contactDat}>
        <Text style={styles.name}>{t('AddProduct.Name')} : {product.name} {t('AddProduct.Quantite')} : {product.quantite} </Text>
        <Text style={styles.name}>{t('AddProduct.PrixUnitaire')} : {product.prixUnitaire} {t('AddProduct.Devise')} : {product.devise} </Text>
        <Text style={styles.name}>{t('AddProduct.Description')} : {product.description}</Text>
      </View>
    </View>
    </Swipeable>
  );
};

export default ProductLists;