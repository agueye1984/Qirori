import React from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import DefaultComponentsThemes from '../defaultComponentsThemes';
import {useTheme} from '../contexts/theme';

import {useTranslation} from 'react-i18next';
import Header from '../components/Header';
import {BacktoHome} from '../components/BacktoHome';
import {VentesList} from '../components/VentesList';
import {useNavigation} from '@react-navigation/native';
import {Accueil, Product, Service} from '../contexts/types';
import {VentesItem} from '../components/VentesItem';
import {useStore} from '../contexts/store';
import {DataTable} from 'react-native-paper';
import {Table, Row} from 'react-native-table-component';
import {theme} from '../core/theme';

export const Services = () => {
  const defaultStyles = DefaultComponentsThemes();
  const {ColorPallet} = useTheme();
  const {t} = useTranslation();
  const vente = VentesList(t);
  const {navigate} = useNavigation();
  const [state] = useStore();

  console.log(state.services)

  const tableData = {
    tableHead: [
      'Crypto Name',
      'Crypto Symbol',
      'Current Value',
      'Movement',
      'Mkt Cap',
      'Description',
    ],
    widthArr: [140, 160, 180, 120, 220, 540],
  };

  function handleSelection(item: Accueil) {
    navigate(item.route as never);
  }

  const styles = StyleSheet.create({
    img: {
      width: '30%',
      resizeMode: 'contain',
      paddingRight: 50,
    },
    container: {flex: 1, paddingTop: 10, paddingHorizontal: 15},
    head: {height: 44, backgroundColor: theme.colors.primary, color: 'white'},
    row: {height: 40},
    headText: {
      fontSize: 12,
      fontWeight: 'bold',
      textAlign: 'center',
      color: 'white',
    },
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
    },
    contactDat: {
      flex: 1,
      justifyContent: 'center',
      paddingLeft: 5,
    },
    txt: {
      fontSize: 18,
    },
    name: {
      fontSize: 16,
    },
    phoneNumber: {
      color: '#888',
    },
  });

  return (
    <SafeAreaView >
      <BacktoHome textRoute={t('Ventes.title')} />
      <Header>{t('Products.title')}</Header>
      <View style={{justifyContent: 'center', alignContent: 'center', flex: 1}}>
        <View style={{padding: 10}}>
          <View style={styles.container}>
            {state.services.map((item: Service, index: number) => {
              return (
                <View key={index} style={styles.contactCon}>
                  <View style={styles.imgCon}>
                    <View style={styles.placeholder}>
                      <Image source={{uri: item.images}} />
                    </View>
                  </View>
                  <View style={styles.contactDat}>
                    <Text style={styles.name}>{item.category}</Text>
                    <Text style={styles.phoneNumber}>{item.name}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};
