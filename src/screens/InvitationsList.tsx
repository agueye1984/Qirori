import React, {useEffect, useState} from 'react';
import {SafeAreaView, ScrollView, Text, View} from 'react-native';
import DefaultComponentsThemes from '../defaultComponentsThemes';
import {useTranslation} from 'react-i18next';
import Header from '../components/Header';
import {User, Event} from '../contexts/types';
import {BacktoHome} from '../components/BacktoHome';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import InvitationsItemList from '../components/InvitationsItemList';
import { theme } from '../core/theme';

export const InvitationsList = () => {
  const defaultStyles = DefaultComponentsThemes();
  const {t} = useTranslation();
  const [userId, setUserId] = useState('');
  const [event, setEvent] = useState<Event[]>([]);

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
  }, [userId]);
 
  return (
    <SafeAreaView>
      <BacktoHome textRoute={t('HomeScreen.title')} />
      <Header>{t('Invitations.title')}</Header>
      <View style={{justifyContent: 'center', alignContent: 'center'}}>
        {event.length === 0 && (
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
         <ScrollView style={{padding: 10}} scrollEnabled>
         {event.map((item: Event, index: number) => {
            return (
              <InvitationsItemList
                key={index.toString()}
                event={item}
                color={theme.colors.black}
              />
            );
          })}

         </ScrollView>
      </View>
    </SafeAreaView>
  );
};
