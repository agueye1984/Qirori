import React, {useEffect, useState} from 'react'
import {SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native'
import {useTranslation} from 'react-i18next'
import Header from '../components/Header'
import {useNavigation} from '@react-navigation/native'
import {BacktoHome} from '../components/BacktoHome'
import {EventItem} from '../components/EventItem'
import {Event, User} from '../contexts/types'
import {EmptyList} from '../components/EmptyList'
import {useStore} from '../contexts/store'
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
import {LargeButton} from '../components/LargeButton'
import {theme} from '../core/theme'
import Icon from 'react-native-vector-icons/FontAwesome'

export const Events = () => {
  const {t} = useTranslation()
  const navigation = useNavigation()
  const [userId, setUserId] = useState('')
  const [events, setEvents] = useState<Event[]>([])

  useEffect(() => {
    const usersRef = firestore().collection('users')
    auth().onAuthStateChanged((user) => {
      if (user) {
        usersRef
          .doc(user.uid)
          .get()
          .then((document) => {
            const userData = document.data() as User
            setUserId(userData.id)
          })
          .catch((error) => {
            console.log('error1 ' + error)
          })
      }
    })
  }, [])

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('events')
      .where('userId', '==', userId)
      .onSnapshot(querySnapshot => {
        if (querySnapshot.empty) {
          setEvents([]);
        } else {
          const newEvents: Event[] = [];
          querySnapshot.forEach(documentSnapshot => {
            const eventData = documentSnapshot.data() as Event;
            eventData.id = documentSnapshot.id; // ajouter l'id du document
            newEvents.push(eventData);
          });
          setEvents(newEvents);
        }
      });

    // Nettoyage de l'écouteur lors du démontage du composant
    return () => unsubscribe();
  }, [userId]);


 /*  useEffect(() => {
    firestore()
      .collection('events')
      // Filter results
      .where('userId', '==', userId)
      .get()
      .then((querySnapshot) => {
        if (querySnapshot.empty) {
          setEvent([])
        } else {
          const events: Event[] = []
          querySnapshot.forEach((documentSnapshot) => {
            events.push(documentSnapshot.data() as Event)
          })
          setEvent(events)
        }
      })
  }, [userId, event]) */

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
  })

  return (
    <SafeAreaView>
      <BacktoHome textRoute={t('HomeScreen.title')} />

      <Header>{t('Events.title')}</Header>
      <View style={styles.rowCenter}>
        <TouchableOpacity onPress={() => navigation.navigate('AddEvent' as never)}>
          <Icon name={'calendar-plus-o'} color={theme.colors.primary} size={60} />
        </TouchableOpacity>
      </View>
      <View style={{justifyContent: 'center', alignContent: 'center'}}>
        <ScrollView style={{padding: 10}} scrollEnabled>
          {events.map((item: Event, index: number) => {
            return <EventItem key={index.toString()} item={item} />
          })}
        </ScrollView>
      </View>
    </SafeAreaView>
  )
}
