import React, {useEffect, useState} from 'react';
import {FlatList, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import Header from '../components/Header';
import {BacktoHome} from '../components/BacktoHome';
import DefaultComponentsThemes from '../defaultComponentsThemes';
import {Panier} from '../contexts/types';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {theme} from '../core/theme';
import OrderDeliveredLists from '../components/OrderDeliveredLists';

export const ProductDelivering = () => {
  const {t} = useTranslation();
  const [carts, setCarts] = useState<Panier[]>([]);
  const defaultStyles = DefaultComponentsThemes();

  const currentUser = auth().currentUser;

  useEffect(() => {
    const getCarts = () => {
      firestore()
        .collection('carts')
        .where('vendorId', '==', currentUser?.uid)
        .where('statut', '!=', '6')
        // .where('commandeId', '!=', '')
        .get()
        .then(querySnapshot => {
          if (querySnapshot.empty) {
            setCarts([]);
          } else {
            const panier: Panier[] = [];
            querySnapshot.forEach(documentSnapshot => {
              const cart = documentSnapshot.data() as Panier;
              if (cart.commandeId != '') {
                panier.push(cart);
              }
              //  panier.push(documentSnapshot.data() as Panier);
            });
            setCarts(panier);
          }
        });
    };
    getCarts();
  }, [currentUser?.uid]);

  const styles = StyleSheet.create({
    container: {
      flex: 1, // Prend tout l'espace disponible
      paddingTop: 20,
    },
    addEventButtonContainer: {
      alignItems: 'center',
      marginVertical: 15,
    },
    flatListContainer: {
      paddingBottom: 20,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <BacktoHome textRoute={t('Settings.title')} />
      <Header>{t('ProductDelivering.title')}</Header>
      <View style={styles.addEventButtonContainer}>
        {carts.length === 0 && (
          <Text
            style={[
              defaultStyles.text,
              {
                marginVertical: 50,
                paddingHorizontal: 10,
                textAlign: 'center',
              },
            ]}>
            {t('ProductDelivering.EmptyList')}
          </Text>
        )}
      </View>
      <FlatList
        data={carts}
        renderItem={({item}) => (
          <OrderDeliveredLists panier={item} color={theme.colors.black} />
        )}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.flatListContainer}
      />
    </SafeAreaView>
  );
};
