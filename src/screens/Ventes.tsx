import React from 'react';
import {SafeAreaView, ScrollView, StyleSheet, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import Header from '../components/Header';
import {BacktoHome} from '../components/BacktoHome';
import {VentesList} from '../components/VentesList';
import {useNavigation} from '@react-navigation/native';
import {Accueil} from '../contexts/types';
import {VentesItem} from '../components/VentesItem';

export const Ventes = () => {
  const {t} = useTranslation();
  const vente = VentesList(t);
  const {navigate} = useNavigation();

  function handleSelection(item: Accueil) {
    navigate(item.route as never);
  }

  const styles = StyleSheet.create({
    img: {
      width: '30%',
      resizeMode: 'contain',
      paddingRight: 50,
    },
    row: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
  });

  return (
    <SafeAreaView style={{flex: 1}}>
      <ScrollView style={{padding: 10}}>
        <BacktoHome textRoute={t('HomeScreen.title')} />

        <Header>{t('Ventes.title')}</Header>

        <View
          style={{justifyContent: 'center', alignContent: 'center', flex: 1}}>
          <View style={{padding: 10}}>
            {vente.map((item: Accueil) => {
              return (
                <VentesItem
                  key={item.id}
                  item={item}
                  action={() => handleSelection(item)}
                />
              );
            })}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
