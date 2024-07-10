import React, { useEffect, useState } from 'react';
import {SafeAreaView, ScrollView, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import Header from '../components/Header';
import {BacktoHome} from '../components/BacktoHome';
import DefaultComponentsThemes from '../defaultComponentsThemes';
import { Panier, Product, Service, User } from '../contexts/types';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { EmptyList } from '../components/EmptyList';
import { theme } from '../core/theme';
import { useNavigation } from '@react-navigation/native';
import OrderDeliveredLists from '../components/OrderDeliveredLists';

export const ProductDelivering = () => {
  const {t} = useTranslation();
  const [userId, setUserId] = useState('');
  const [carts, setCarts] = useState<Panier[]>([]);
  const navigation = useNavigation();

  const getCarts = () => {
    firestore()
      .collection('carts')
      .where('vendorId', '==', userId)
      .where('statut', '!=', '6')
      .get()
      .then(querySnapshot => {
        if (querySnapshot.empty) {
          setCarts([]);
        } else {
          const panier: Panier[] = [];
          querySnapshot.forEach(documentSnapshot => {
            panier.push(documentSnapshot.data() as Panier);
          });
          setCarts(panier);
        }
      });
  }

  useEffect(() => {
    const usersRef = firestore().collection('users');
    auth().onAuthStateChanged(user => {
      if (user) {
        usersRef
          .doc(user.uid)
          .get()
          .then(document => {
            const userData = document.data() as User;
            setUserId(userData.id);
          })
          .catch(error => {
            console.log('error1 ' + error);
          });
      }
    });
  }, []);

  useEffect(() => {
    getCarts();
  }, [userId]);

 

  return (
    <SafeAreaView>
   <BacktoHome textRoute={t('Settings.title')} />
        <Header>{t('ProductDelivering.title')}</Header>
    <View style={{justifyContent: 'center', alignContent: 'center'}}>
      {carts.length === 0 && (
        <EmptyList
          body={t('Products.EmptyList')}
          actionLabel={t('AddProduct.title')}
          action={() => navigation.navigate('AddProduct' as never)}
        />
      )}
      <ScrollView style={{padding: 10}} scrollEnabled>
        {carts.map((item: Panier, index: number) => {
          return (
            <OrderDeliveredLists
              key={index.toString()}
              panier={item}
              color={theme.colors.black}
            />
          );
        })}
      </ScrollView>
    </View>
  </SafeAreaView>
  );
};
