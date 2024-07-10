import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Image, Pressable} from 'react-native';
import storage from '@react-native-firebase/storage';
import {ManageEventsParamList, Offre, Service} from '../contexts/types';
import {useTranslation} from 'react-i18next';
import {Swipeable} from 'react-native-gesture-handler';
import {useTheme} from '../contexts/theme';
import Icon from 'react-native-vector-icons/FontAwesome';
import {StackNavigationProp} from '@react-navigation/stack';
import {useNavigation} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import { CategoryList } from './CategoryList';

type Props = {
  service: Service;
  color: string;
};

type EditServiceProps = StackNavigationProp<
  ManageEventsParamList,
  'EditService'
>;

const ServiceLists = ({service, color}: Props) => {
  const {t} = useTranslation();
  const {ColorPallet} = useTheme();
  const navigation = useNavigation<EditServiceProps>();
  const [imageUrl, setImageUrl] = useState('');

  const category = CategoryList(t).find(product => product.id == service.category);

   useEffect(() => {
    const getImages = async () => {
      const url = await storage().ref(service.images).getDownloadURL();
      setImageUrl(url);
    };
      getImages();
  }, [service.images]); 

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

  const handleDelete = async () => {
    firestore()
      .collection('services')
      .doc(service.id)
      .delete()
      .then(() => {
        console.log('Services deleted!');
      });
  };

  const handleEdit = () => {
    navigation.navigate('EditService', {item: service});
  };

  const RightSwipeActions = () => {
    return (
      <>
        <Pressable
          onPress={() => handleDelete()}
          style={({pressed}) => [
            styles.deleteContainer,
            pressed && {opacity: 0.8},
          ]}>
          <Icon name="trash" size={30} color={ColorPallet.white} />
        </Pressable>
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
            {t('AddService.Category')} : {category?.name}{' '}
            {t('AddProduct.Name')} : {service.name}{' '}
          </Text>
          {service.offres.map((item: Offre, index: number) => {
            return (
              <Text style={styles.name} key={index}>
                {t('AddService.Offre')} {index + 1} : {item.name}{' '}
                {t('AddProduct.PrixUnitaire')} : {item.montant}{' '}
                {t('AddProduct.Devise')} : {item.devise}{' '}
              </Text>
            );
          })}
          <Text style={styles.name}>
            {t('AddProduct.Description')} : {service.description}
          </Text>
        </View>
      </View>
    </Swipeable>
  );
};

export default ServiceLists;
