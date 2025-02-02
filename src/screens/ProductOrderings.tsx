import React, {useEffect, useState} from 'react';
import {FlatList, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import Header from '../components/Header';
import {BacktoHome} from '../components/BacktoHome';
import {Commande} from '../contexts/types';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import DefaultComponentsThemes from '../defaultComponentsThemes';
import {theme} from '../core/theme';
import OrdersItemList from '../components/OrdersItemList';

export const ProductOrderings = () => {
  const {t} = useTranslation();
  const [commandes, setCommandes] = useState<Commande[]>([]);
  const defaultStyles = DefaultComponentsThemes();
  const currentUser = auth().currentUser;

  useEffect(() => {
    firestore()
      .collection('commandes')
      // Filter results
      .where('userId', '==', currentUser?.uid)
      .get()
      .then(querySnapshot => {
        if (querySnapshot.empty) {
          setCommandes([]);
        } else {
          const orders: Commande[] = [];
          const stat: string[] = [];
          const dateDel: string[] = [];
          querySnapshot.forEach(documentSnapshot => {
            const commande = documentSnapshot.data() as Commande;
            const carts = commande.paniers;
            console.log(carts);
            carts.sort((a, b) => a.statut.localeCompare(b.statut));
            const statut = carts[0].statut;

            console.log(statut);
            const dateDelivered = carts[0].dateDelivered;

            stat.push(statut);
            dateDel.push(dateDelivered);
            const order = {
              ...commande,
              statut: statut,
              dateDelivered: dateDelivered,
            };
            orders.push(order);
          });
          setCommandes(orders);
        }
      });
  }, [currentUser?.uid]);
  // console.log(commandes)
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
      <Header>{t('ProductOrderings.title')}</Header>
      <View style={styles.addEventButtonContainer}>
        {commandes.length === 0 && (
          <Text
            style={[
              defaultStyles.text,
              {
                marginVertical: 50,
                paddingHorizontal: 10,
                textAlign: 'center',
              },
            ]}>
            {t('ProductOrderings.EmptyList')}
          </Text>
        )}
      </View>
      <FlatList
        data={commandes}
        renderItem={({item, index}) => (
          <OrdersItemList
            key={index.toString()}
            order={item}
            color={theme.colors.black}
          />
        )}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.flatListContainer}
      />
    </SafeAreaView>
  );
};
