import React, {useEffect, useState} from 'react';
import {SafeAreaView, ScrollView, StyleSheet, Text, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import Header from '../components/Header';
import {BacktoHome} from '../components/BacktoHome';
import {Commande, Panier, User} from '../contexts/types';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import DefaultComponentsThemes from '../defaultComponentsThemes';
import {theme} from '../core/theme';
import OrdersItemList from '../components/OrdersItemList';

export const ProductOrderings = () => {
  const {t} = useTranslation();
  const [userId, setUserId] = useState('');
  const [commandes, setCommandes] = useState<Commande[]>([]);
  const [carts, setCarts] = useState<Panier[]>([]);
  const [statut, setStatut] = useState<string[]>([]);
  const [dateDelivered, setDateDelivered] = useState<string[]>([]);
  const defaultStyles = DefaultComponentsThemes();

  const getCarts = ()  => {
    firestore()
      .collection('carts')
      // Filter results
      .where('userId', '==', userId)
      .get()
      .then(querySnapshot => {
        const cart: Panier[] = [];
        querySnapshot.forEach(documentSnapshot => {
          cart.push(documentSnapshot.data() as Panier)
        });
        setCarts(cart);
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

  }, []);

  useEffect(() => {
    firestore()
      .collection('commandes')
      // Filter results
      .where('userId', '==', userId)
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
            carts.sort((a, b) => a.statut.localeCompare(b.statut));
            const statut = carts[0].statut;
            const dateDelivered = carts[0].dateDelivered;
            orders.push(commande);
            stat.push(statut);
            dateDel.push(dateDelivered);
          });
          setCommandes(orders);
          setStatut(stat);
          setDateDelivered(dateDel);
        }
      });
  }, [userId]);

  console.log(statut)

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
    },
  });

  return (
    <SafeAreaView style={[styles.container]}>
      <BacktoHome textRoute={t('Settings.title')} />
      <Header>{t('ProductOrderings.title')}</Header>

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
          {t('Invitations.EmptyList')}
        </Text>
      )}

      <ScrollView scrollEnabled showsVerticalScrollIndicator>
        {commandes.map((item: Commande, index: number) => (
          <OrdersItemList
            key={index.toString()}
            order={item}
            statut={statut[index]}
            dateDelivered={dateDelivered[index]}
            color={theme.colors.black}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};
