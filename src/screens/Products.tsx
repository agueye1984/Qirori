import React, {useEffect, useState} from 'react';
import {SafeAreaView, ScrollView, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import Header from '../components/Header';
import {BacktoHome} from '../components/BacktoHome';
import {useNavigation} from '@react-navigation/native';
import {Product, User} from '../contexts/types';
import {theme} from '../core/theme';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import ProductLists from '../components/ProductLists';
import {EmptyList} from '../components/EmptyList';

export const Products = () => {
  const {t} = useTranslation();
  const navigation = useNavigation();
  const [userId, setUserId] = useState('');
  const [product, setProduct] = useState<Product[]>([]);

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
    firestore()
      .collection('products')
      .where('userId', '==', userId)
      .get()
      .then(querySnapshot => {
        if (querySnapshot.empty) {
          setProduct([]);
        } else {
          const products: Product[] = [];
          querySnapshot.forEach(documentSnapshot => {
            products.push(documentSnapshot.data() as Product);
          });
          setProduct(products);
        }
      });
  }, [product]);

  return (
    <SafeAreaView>
      <BacktoHome textRoute={t('Ventes.title')} />
      <Header>{t('Products.title')}</Header>
      <View style={{justifyContent: 'center', alignContent: 'center'}}>
        {product.length === 0 && (
          <EmptyList
            body={t('Products.EmptyList')}
            actionLabel={t('AddProduct.title')}
            action={() => navigation.navigate('AddProduct' as never)}
          />
        )}
        <ScrollView style={{padding: 10}} scrollEnabled>
          {product.map((item: Product, index: number) => {
            return (
              <ProductLists
                key={index.toString()}
                product={item}
                color={theme.colors.black}
              />
            );
          })}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};
