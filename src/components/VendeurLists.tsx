import React, { useEffect, useState } from 'react';
import {View, Text, StyleSheet, Pressable} from 'react-native';
import {Category, User, Vendeur} from '../contexts/types';
import {useTranslation} from 'react-i18next';
import {useTheme} from '../contexts/theme';
import Icon from 'react-native-vector-icons/FontAwesome';
import firestore from '@react-native-firebase/firestore';
import { getRecordById } from '../services/FirestoreServices';
import axios from 'axios';

type Props = {
  vendeur: Vendeur;
  color: string;
};

const VendeurLists = ({vendeur, color}: Props) => {
  const {t, i18n} = useTranslation();
  const {ColorPallet} = useTheme();
  const [categoryName, setCategoryName] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [zoneNames, setZoneNames] = useState<string[]>([]);
  const selectedLanguage = i18n.language;
  const adresse= vendeur.adresse.description;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tabCat: string[] = []
        for (const categ of vendeur.category) {

         
        const cat = (await getRecordById(
          'categories',
          categ,
        )) as Category;
        //console.log(cat)
        tabCat.push(selectedLanguage ==='fr' ? cat.nameFr: cat.nameEn)
        
      }
      setCategoryName(tabCat.join(','));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [vendeur.category]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        
        const user = (await getRecordById(
          'users',
          vendeur.userId,
        )) as User;
        setUserName(user.displayName);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [vendeur.userId]);

  useEffect(() => {

   
    const fetchData = async () => {
      const tabNames: string[] = [];
      for (const geonameId of vendeur.zone) {
        const apiUrl = `http://api.geonames.org/childrenJSON?geonameId=${geonameId}&username=amadagueye&lang=${selectedLanguage}`;
        try {
          const result = await axios.request({
            method: 'get',
            url: apiUrl,
          });
          if (result) {
            tabNames.push(result.data.geonames[0].name)
          }
        } catch (e) {
          console.log('Error ' + e);
        }
      }
      setZoneNames(tabNames);
    };
    fetchData();

  }, [vendeur.zone]);

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
      color: ColorPallet.primary,
      fontWeight: 'bold',
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
    orderCard: {
      backgroundColor: '#f8f9fa',
      marginVertical: 10,
      padding: 15,
      borderRadius: 8,
    },
    orderId: {fontWeight: 'bold', fontSize: 16},
    customer: {marginVertical: 5},
    address: {color: '#6c757d'},
    imageWrapper: {
      position: 'relative',
      marginRight: 10,
      //marginBottom: 10,
      width: 100,
      height: 30,
      flexDirection: 'row', // Aligner les icônes en ligne
      alignItems: 'center', // Centrer verticalement les icônes
    },
    buttonContainer: {
      position: 'absolute',
      top: 5,
      left: 0,
      right: 0,
      flexDirection: 'row', // Aligner les boutons horizontalement
      justifyContent: 'space-between', // Espacer les boutons uniformément
    },
    statusContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
  });

  const handleDesactive = () => {
    firestore()
      .collection('vendeurs')
      .doc(vendeur.id)
      .update({
        actif: false,
      })
      .then(() => {
        console.log('vendeurs updated!');
      });
  };

  const handleActive = () => {
    firestore()
      .collection('vendeurs')
      .doc(vendeur.id)
      .update({
        actif: true,
      })
      .then(() => {
        console.log('vendeurs updated!');
      });
  };

  return (
    <View style={styles.orderCard}>
       <Text style={styles.customer}>
        <Text style={styles.orderId}>{t('AddService.Category')} : </Text>
        {categoryName}
      </Text>
      <Text style={styles.customer}>
        <Text style={styles.orderId}>{t('AddProduct.Name')} : </Text>
        {userName}
      </Text>
      <Text style={styles.customer}>
        <Text style={styles.orderId}>{t('AddService.Zone')} : </Text>
        {zoneNames.join(', ')}
      </Text>
      <Text style={styles.address}>
        <Text style={styles.orderId}>{t('Vendeur.Adresse')} : </Text>
        {adresse}
      </Text>
      <View style={styles.statusContainer}>
      {vendeur.actif ? (
            <Pressable
              onPress={() => handleDesactive()}
              style={({pressed}) => [
                styles.editContainer,
                pressed && {opacity: 0.8},
              ]}>
              <Icon name="lock" size={30} color={ColorPallet.white} />
            </Pressable>
          ) : (
            <Pressable
              onPress={() => handleActive()}
              style={({pressed}) => [
                styles.editContainer,
                pressed && {opacity: 0.8},
              ]}>
              <Icon name="unlock" size={30} color={ColorPallet.white} />
            </Pressable>
          )}
      </View>
    </View>
  );
};

export default VendeurLists;
