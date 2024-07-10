import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Image, Pressable} from 'react-native';
import storage from '@react-native-firebase/storage';
import {ManageEventsParamList, Panier, Product} from '../contexts/types';
import {useTranslation} from 'react-i18next';
import {Swipeable} from 'react-native-gesture-handler';
import {useTheme} from '../contexts/theme';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import firestore from '@react-native-firebase/firestore';

type Props = {
  panier: Panier;
  color: string;
};

type EditPanierProps = StackNavigationProp<
  ManageEventsParamList,
  'EditPanier'
>;

const OrderDeliveredLists = ({panier, color}: Props) => {
  const {t} = useTranslation();
  const {ColorPallet} = useTheme();
  const navigation = useNavigation<EditPanierProps>();
  const [imageUrl, setImageUrl] = useState<string>('');

  const getImages = async () => {
    const url = await storage().ref(panier.images).getDownloadURL();
    setImageUrl(url);
  };

  useEffect(() => {
      getImages();
  }, [panier.images]); 

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

  const handleEdit = () => {
    navigation.navigate('EditPanier', {item: panier});
  };

  const RightSwipeActions = () => {
    return (
      <>
        <Pressable
          onPress={() => handleEdit()}
          style={({pressed}) => [
            styles.editContainer,
            pressed && {opacity: 0.8},
          ]}>
          <Icon name="edit" size={30} color={ColorPallet.white} />
        </Pressable>
      </>
    );
  };

  return (
    <Swipeable renderRightActions={RightSwipeActions}>
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
            {t('AddProduct.Name')} : {panier.commandeId}
            {panier.qty}{' '}
          </Text>
          <Text style={styles.name}>
            {t('AddProduct.Name')} : {panier.name} {t('AddProduct.Quantite')} :{' '}
            {panier.qty}{' '}
          </Text>
          <Text style={styles.name}>
            {t('AddProduct.PrixUnitaire')} : {panier.prix}{' '}
            {t('AddProduct.Devise')} : {panier.devise}{' '}
          </Text>
          <Text style={styles.name}>
            {t('AddProduct.Description')} : {panier.description}
          </Text>
        </View>
      </View>
    </Swipeable>
  );
};

export default OrderDeliveredLists;
