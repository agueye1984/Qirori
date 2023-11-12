import React, {useEffect, useState} from 'react';
import {SafeAreaView, ScrollView, View} from 'react-native';
SafeAreaView;
import {useTranslation} from 'react-i18next';
import Header from '../components/Header';
import {useNavigation} from '@react-navigation/native';
import {BacktoHome} from '../components/BacktoHome';
import {EventItem} from '../components/EventItem';
import {Event, User} from '../contexts/types';
import {EmptyList} from '../components/EmptyList';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {LocalStorageKeys} from '../constants';
import {getEventsByUser} from '../services/EventsServices';
import {useStore} from '../contexts/store';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export const Events = () => {
  const {t} = useTranslation();
  const navigation = useNavigation();
  const [userId, setUserId] = useState('');
  const [event, setEvent] = useState<Event[]>([]);
  const [state] = useStore();

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
    .collection('events')
    // Filter results
    .where('userId', '==', userId)
    .get()
    .then(querySnapshot => {
      if (querySnapshot.empty) {
        setEvent([]);
      } else {
        const events: Event[] = [];
        querySnapshot.forEach(documentSnapshot => {
          events.push(documentSnapshot.data() as Event);
        });
        setEvent(events);
      }
    });
  }, [event]);

  const events = event;
  //events = state.events.filter((event) => (event.userId == userId));

  return (
    <SafeAreaView>
      <BacktoHome textRoute={t('HomeScreen.title')} />
      <Header>{t('Events.title')}</Header>
      <View style={{justifyContent: 'center', alignContent: 'center'}}>
        {events.length === 0 && (
          <EmptyList
            body={t('Events.EmptyList')}
            actionLabel={t('Events.AddButtonText')}
            action={() => navigation.navigate('AddEvent' as never)}
          />
        )}
        <ScrollView style={{padding: 10}} scrollEnabled>
          {events.map((item: Event, index: number) => {
            return <EventItem key={index.toString()} item={item} />;
          })}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};
