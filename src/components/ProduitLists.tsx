import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Image, Pressable} from 'react-native';
import storage from '@react-native-firebase/storage';
import {ManageEventsParamList, Product} from '../contexts/types';
import {useTranslation} from 'react-i18next';
import {Swipeable} from 'react-native-gesture-handler';
import {useTheme} from '../contexts/theme';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import firestore from '@react-native-firebase/firestore';

type Props = {
  product: Product;
  color: string;
};

type EditProductProps = StackNavigationProp<
  ManageEventsParamList,
  'EditProduct'
>;

const ProduitLists = ({product, color}: Props) => {
  const {t} = useTranslation();
  const {ColorPallet} = useTheme();
  const navigation = useNavigation<EditProductProps>();
  const [imageUrl, setImageUrl] = useState<string>('');

  useEffect(() => {
    const getImages = async () => {
      const url = await storage().ref(product.images).getDownloadURL();
      setImageUrl(url);
    };
      getImages();
  }, [product.images]); 

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
      color: color,
    },
    contactDat: {
      flex: 1,
      justifyContent: 'center',
      paddingLeft: 5,
    },
    txt: {
      fontSize: 18,
      color: color,
    },
    name: {
      fontSize: 16,
      color: color,
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
      paddingHorizontal: 34,
      backgroundColor: ColorPallet.error,
    },
    editContainer: {
      marginVertical: 5,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
      paddingHorizontal: 34,
      backgroundColor: ColorPallet.primary,
    },
  });

  const handleDesactive = () => {
    firestore()
    .collection('products')
    .doc(product.id)
      .update({
        actif: false,
      })
      .then(() => {
        console.log('Users updated!');
      });
  };

  const handleActive = () => {
    firestore()
      .collection('products')
      .doc(product.id)
      .update({
        actif: true,
      })
      .then(() => {
        console.log('Users updated!');
      });
  };

  const RightSwipeActions = (actif: boolean) => {
    if(actif===true){
      return (
        <Pressable
          onPress={() => handleDesactive()}
          style={({pressed}) => [
            styles.editContainer,
            pressed && {opacity: 0.8},
          ]}>
          <Icon name="lock" size={30} color={ColorPallet.white} />
        </Pressable>
        );
    } else {
      return (
        <Pressable
          onPress={() => handleActive()}
          style={({pressed}) => [
            styles.editContainer,
            pressed && {opacity: 0.8},
          ]}>
          <Icon name="unlock" size={30} color={ColorPallet.white} />
        </Pressable>
        );
    }
  };

  return (
    <Swipeable renderRightActions={()=>RightSwipeActions(product.actif)}>
      <View style={styles.contactCon}>
        <View style={styles.imgCon}>
          <Image
            style={styles.thumb}
            source={
              imageUrl === ''
                ? require('../../assets/No_image_available.svg.png')
                : {uri: imageUrl}
            }
          />
        </View>
        <View style={styles.contactDat}>
          <Text style={styles.name}>
            {t('AddProduct.Name')} : {product.name} {t('AddProduct.Quantite')} :{' '}
            {product.quantite}{' '}
          </Text>
          <Text style={styles.name}>
            {t('AddProduct.PrixUnitaire')} : {product.prixUnitaire}{' '}
            {t('AddProduct.Devise')} : {product.devise}{' '}
          </Text>
          <Text style={styles.name}>
            {t('AddProduct.Description')} : {product.description}
          </Text>
        </View>
      </View>
    </Swipeable>
  );
};

export default ProduitLists;
