import React, {useEffect, useState} from 'react';
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import Header from '../components/Header';
import {BacktoHome} from '../components/BacktoHome';
import {EventItemList} from '../components/EventItemList';
import {Event} from '../contexts/types';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export const EventsList = () => {
  const {t} = useTranslation();
  const currentUser = auth().currentUser;
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('events')
      .where('userId', '==', currentUser?.uid)
      .orderBy('dateDebut', 'asc') // Tri croissant
      .onSnapshot(
        querySnapshot => {
          if (!querySnapshot || querySnapshot.empty) {
            setEvents([]); // Aucun événement
            return;
          }
          const newEvents: Event[] = [];
          querySnapshot.forEach(documentSnapshot => {
            const eventData = documentSnapshot.data() as Event;
            eventData.id = documentSnapshot.id; // Ajouter l'id du document
            newEvents.push(eventData);
          });
          setEvents(newEvents);
        },
        error => {
          console.error(
            'Erreur lors de la récupération des événements :',
            error,
          );
          setEvents([]);
        },
      );

    return () => unsubscribe();
  }, [currentUser?.uid]);

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
    rowCenter: {
      //flex: 1, // Pour que l'icône occupe de l'espace
      justifyContent: 'center', // Centré verticalement
      alignItems: 'center', // Centré horizontalement
    },
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
      <Header>{t('SettingsList.EventsList')}</Header>
      <FlatList
        data={events}
        renderItem={({item}) => <EventItemList item={item} />}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.flatListContainer}
      />
    </SafeAreaView>
  );
};
