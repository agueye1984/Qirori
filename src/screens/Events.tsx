import React from 'react'
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import DefaultComponentsThemes from '../defaultComponentsThemes'
import { useTheme } from '../contexts/theme'
import BackgroundContents from '../components/BackgroundContents'
import { useTranslation } from 'react-i18next'
import Header from '../components/Header'
import { useNavigation } from '@react-navigation/native'
import { BacktoHome } from '../components/BacktoHome'
import { useStore } from '../contexts/store'
import { EventItem } from '../components/EventItem'
import { Event } from '../contexts/types'
import Paragraph from '../components/Paragraph'
import { EmptyList } from '../components/EmptyList'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { LocalStorageKeys } from '../constants'



export const Events = () => {
  const { t } = useTranslation()
  const [state] = useStore()
  const navigation = useNavigation()

  console.log(state)

  return (
    <BackgroundContents>
      <BacktoHome textRoute={t('HomeScreen.title')} />
      <Header>{t('Events.title')}</Header>
      <View style={{ justifyContent: 'center', alignContent: 'center' }}>
        {state.events.length === 0 && (
          <EmptyList
            body={t('Events.EmptyList')}
            actionLabel={t('Events.AddButtonText')}
            action={() => navigation.navigate('AddEvent' as never)}
          />
        )}
        <ScrollView style={{ padding: 10 }}>
          {state.events.map((item: Event, index: number) => {
            return <EventItem key={index.toString()} item={item} />
          })}
        </ScrollView>
      </View>
    </BackgroundContents>
  )
}
