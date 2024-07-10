import {RouteProp, useNavigation, useRoute} from '@react-navigation/native'
import {useTranslation} from 'react-i18next'
import React, {useState} from 'react'
import {ScrollView, View} from 'react-native'
import DefaultComponentsThemes from '../defaultComponentsThemes'
import {BacktoHome} from '../components/BacktoHome'
import Header from '../components/Header'
import {ManageEventsParamList} from '../contexts/types'
import Button from '../components/Button'
import {SafeAreaView} from 'react-native-safe-area-context'
import firestore from '@react-native-firebase/firestore'
import {NameFrSection} from '../components/NameFrSection'
import {NameEnSection} from '../components/NameEnSection'

export const EditTypeEvent = () => {
  const route = useRoute<RouteProp<ManageEventsParamList, 'EditTypeEvent'>>()
  const item = route.params.item
  const {t} = useTranslation()
  const defaultStyles = DefaultComponentsThemes()
  const navigation = useNavigation()
  const [nameFr, setNameFr] = useState<string>(item.nameFr)
  const [nameEn, setNameEn] = useState<string>(item.nameEn)

  const handleNameFrChange = (value: string) => {
    setNameFr(value)
  }
  const handleNameEnChange = (value: string) => {
    setNameEn(value)
  }

  const handleSaveTypeEvents = async () => {
    try {
      firestore()
        .collection('type_events')
        .doc(item.id)
        .update({
          nameFr: nameFr,
          nameEn: nameEn,
        })
        .then(() => {
          console.log('Type Event updated!')
          navigation.navigate('TypeEvents' as never)
        })
    } catch (e: unknown) {}
  }

  return (
    <SafeAreaView style={{flex: 1}}>
      <BacktoHome textRoute={t('TypeEvents.title')} />
      <Header>{t('EditTypeEvent.title')}</Header>

      <ScrollView scrollEnabled automaticallyAdjustKeyboardInsets={true}>
        <View style={defaultStyles.section}>
          <NameFrSection nameFr={nameFr} setNameFr={handleNameFrChange} />
        </View>
        <View style={defaultStyles.section}>
          <NameEnSection nameEn={nameEn} setNameEn={handleNameEnChange} />
        </View>
      </ScrollView>
      <View style={defaultStyles.bottomButtonContainer}>
        <View style={defaultStyles.buttonContainer}>
          <Button
            mode="contained"
            onPress={() => navigation.navigate('TypeEvents' as never)}
            style={defaultStyles.button}>
            {t('Global.Cancel')}
          </Button>
          <Button mode="contained" onPress={handleSaveTypeEvents} style={defaultStyles.button}>
            {t('Global.Modify')}
          </Button>
        </View>
      </View>
    </SafeAreaView>
  )
}
