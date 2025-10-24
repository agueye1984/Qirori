import React, {useEffect, useState} from 'react';
import {FlatList, SafeAreaView, StyleSheet, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import Header from '../components/Header';
import {BacktoHome} from '../components/BacktoHome';
import {useNavigation} from '@react-navigation/native';
import {Product, Vendeur} from '../contexts/types';
import {theme} from '../core/theme';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import ProductLists from '../components/ProductLists';
import {EmptyList} from '../components/EmptyList';

export const Products = () => {
  const {t} = useTranslation();
  const navigation = useNavigation();
  const [product, setProduct] = useState<Product[]>([]);
  const currentUser = auth().currentUser;
  const [categorieVendeur, setCategorieVendeur] = useState<string[]>([]);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('vendeurs')
      .where('actif', '==', true)
      .where('userId', '==', currentUser?.uid)
      .onSnapshot(querySnapshot => {
        const cat: string[] = [];
        if (querySnapshot.empty) {
          setCategorieVendeur(cat);
        } else {
          querySnapshot.forEach(documentSnapshot => {
            const vendeur = documentSnapshot.data() as Vendeur;
            cat.push(...vendeur.category);
          });
          setCategorieVendeur(cat);
        }
      });
    return () => unsubscribe();
  }, [currentUser?.uid]);

  useEffect(() => {
    if (categorieVendeur.length === 0 || !currentUser?.uid) {
      setProduct([]);
      return; // Si aucune catégorie n'est définie, évitez d'effectuer une requête
    }
    const unsubscribe = firestore()
      .collection('products')
      .where('userId', '==', currentUser?.uid)
      .where('category', 'in', categorieVendeur)
      .onSnapshot(querySnapshot => {
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

    // Nettoyage de l'écouteur lors du démontage du composant
    return () => unsubscribe();
  }, [currentUser?.uid, categorieVendeur]);

  const styles = StyleSheet.create({
    container: {
      flex: 1, // Prend tout l'espace disponible
      paddingTop: 20,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <BacktoHome textRoute={t('Ventes.title')} />
      <Header>{t('Products.title')}</Header>
      <View style={{flex: 1, justifyContent: 'center', alignContent: 'center'}}>
        {product.length === 0 ? (
          <EmptyList
            body={t('Products.EmptyList')}
            actionLabel={t('AddProduct.title')}
            action={() => navigation.navigate('AddProduct' as never)}
          />
        ) : (
          <FlatList
            data={product}
            renderItem={({item}) => (
              <ProductLists product={item} color={theme.colors.black} />
            )}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={{padding: 10}}
          />
        )}
      </View>
    </SafeAreaView>
  );
};
