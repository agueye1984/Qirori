import React, { useEffect, useState } from 'react'
import { SafeAreaView, ScrollView,  View } from 'react-native'
SafeAreaView
import { useTranslation } from 'react-i18next'
import Header from '../components/Header'
import { useNavigation } from '@react-navigation/native'
import { BacktoHome } from '../components/BacktoHome'
import { EventItem } from '../components/EventItem'
import { Event } from '../contexts/types'
import { EmptyList } from '../components/EmptyList'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { LocalStorageKeys } from '../constants'
import { getEventsByUser } from '../services/EventsServices'
import { useStore } from '../contexts/store'



export const Events = () => {
  const { t } = useTranslation()
  const navigation = useNavigation()
  const [userId, setUserId] = useState('')
  const [state] = useStore();
  let events: Event[]=[]

  useEffect(() => {
    AsyncStorage.getItem(LocalStorageKeys.UserId)
    .then((result)=>{
      if(result!=null){
        setUserId(result);
      }
    })
    .catch(error=>console.log(error))
    
  }, [userId])

  events = state.events.filter((event) => (event.userId == userId));

  return (
    <SafeAreaView>
      <BacktoHome textRoute={t('HomeScreen.title')} />
      <Header>{t('Events.title')}</Header>
      <View style={{ justifyContent: 'center', alignContent: 'center' }}>
        {events.length === 0 && (
          <EmptyList
            body={t('Events.EmptyList')}
            actionLabel={t('Events.AddButtonText')}
            action={() => navigation.navigate('AddEvent' as never)}
          />
        )}
        <ScrollView style={{ padding: 10 }}>
          {events.map((item: Event, index: number) => {
            return <EventItem key={index.toString()} item={item} />
          })}
        </ScrollView>
      </View>
    </SafeAreaView>
  )
}
