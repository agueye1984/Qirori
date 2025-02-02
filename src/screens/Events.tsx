import React, {useEffect, useState} from 'react';
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import Header from '../components/Header';
import {useNavigation} from '@react-navigation/native';
import {BacktoHome} from '../components/BacktoHome';
import {EventItem} from '../components/EventItem';
import {Event} from '../contexts/types';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {theme} from '../core/theme';
import Icon from 'react-native-vector-icons/FontAwesome';

export const Events = () => {
  const {t} = useTranslation();
  const navigation = useNavigation();
  const currentUser = auth().currentUser;
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    const getTodayInTimezone = () => {
      const today = new Date();
      // Obtenir le décalage en minutes du fuseau horaire local
      const timezoneOffset = today.getTimezoneOffset(); // Décalage en minutes
      // Ajuster l'heure pour le fuseau local
      const localDate = new Date(today.getTime() - timezoneOffset * 60 * 1000);
      return localDate.toISOString().split('T')[0].replace(/-/g, ''); // 'YYYYMMDD'
    };

    const formattedToday = getTodayInTimezone();
    console.log(formattedToday);

    const unsubscribe = firestore()
      .collection('events')
      .where('userId', '==', currentUser?.uid)
      .where('dateDebut', '>=', formattedToday) // Filtrer >= aujourd'hui
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
      <BacktoHome textRoute={t('HomeScreen.title')} />
      <Header>{t('Events.title')}</Header>
      <View style={styles.addEventButtonContainer}>
        <TouchableOpacity
          onPress={() => navigation.navigate('AddEvent' as never)}>
          <Icon
            name={'calendar-plus-o'}
            color={theme.colors.primary}
            size={60}
          />
        </TouchableOpacity>
      </View>
      <FlatList
        data={events}
        renderItem={({item}) => <EventItem item={item} />}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.flatListContainer}
      />
    </SafeAreaView>
  );
};
