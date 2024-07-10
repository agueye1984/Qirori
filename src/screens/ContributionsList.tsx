import React, {useEffect, useState} from 'react'
import {SafeAreaView, ScrollView, Text, View} from 'react-native'
import DefaultComponentsThemes from '../defaultComponentsThemes'
import {useTranslation} from 'react-i18next'
import Header from '../components/Header'
import {Event} from '../contexts/types'
import {BacktoHome} from '../components/BacktoHome'
import auth from '@react-native-firebase/auth'
import {theme} from '../core/theme'
import ContributionItemList from '../components/ContributionItemList'
import {getFilteredRecords} from '../services/FirestoreServices'

export const ContributionsList = () => {
  const currentUser = auth().currentUser
  const defaultStyles = DefaultComponentsThemes()
  const {t} = useTranslation()
  const [event, setEvent] = useState<Event[]>([])

  useEffect(() => {
    // Exemple d'utilisation de la fonction getFilteredRecords
    const fetchData = async () => {
      try {
        const data = await getFilteredRecords('events', 'userId', currentUser?.uid)
        const newEvent = data.map((record) => record.data as Event)
        console.log(newEvent.length)
        setEvent(newEvent)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    fetchData()
  }, [currentUser?.uid])

  return (
    <SafeAreaView>
      <BacktoHome textRoute={t('Settings.title')} />
      <Header>{t('ContributionsList.title')}</Header>
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
            {t('Contributions.EmptyList')}
          </Text>
        )}
         <ScrollView
        scrollEnabled
        showsVerticalScrollIndicator
        automaticallyAdjustKeyboardInsets={true}
        keyboardShouldPersistTaps="handled">
          {event.map((item: Event, index: number) => {
            return <ContributionItemList key={index.toString()} event={item} />
          })}
        </ScrollView>
      </View>
    </SafeAreaView>
  )
}
