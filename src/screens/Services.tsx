import React, {useEffect, useState} from 'react';
import {SafeAreaView, View, FlatList, StyleSheet} from 'react-native';
import {useTranslation} from 'react-i18next';
import Header from '../components/Header';
import {BacktoHome} from '../components/BacktoHome';
import {useNavigation} from '@react-navigation/native';
import {Service, Vendeur} from '../contexts/types';
import {theme} from '../core/theme';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {EmptyList} from '../components/EmptyList';
import ServiceLists from '../components/ServiceLists';

export const Services = () => {
  const {t} = useTranslation();
  const navigation = useNavigation();
  const currentUser = auth().currentUser;
  const [service, setService] = useState<Service[]>([]);
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
            cat.push(vendeur.category);
          });
          setCategorieVendeur(cat);
        }
      });
    return () => unsubscribe();
  }, [currentUser?.uid]);

  useEffect(() => {
    if (categorieVendeur.length === 0 || !currentUser?.uid) {
      setService([]);
      return; // Si aucune catégorie n'est définie, évitez d'effectuer une requête
    }
    const unsubscribe = firestore()
      .collection('services')
      .where('userId', '==', currentUser?.uid)
      .where('category', 'in', categorieVendeur)
      .onSnapshot(querySnapshot => {
        if (querySnapshot.empty) {
          setService([]);
        } else {
          const services: Service[] = [];
          querySnapshot.forEach(documentSnapshot => {
            services.push(documentSnapshot.data() as Service);
          });
          setService(services);
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
      <Header>{t('Services.title')}</Header>
      <View style={{flex: 1, justifyContent: 'center', alignContent: 'center'}}>
        {service.length === 0 ? (
          <EmptyList
            body={t('Services.EmptyList')}
            actionLabel={t('AddService.title')}
            action={() => navigation.navigate('AddService' as never)}
          />
        ) : (
          <FlatList
            data={service}
            renderItem={({item}) => (
              <ServiceLists service={item} color={theme.colors.black} />
            )}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={{padding: 10}}
          />
        )}
      </View>
    </SafeAreaView>
  );
};
