import {RouteProp, useNavigation, useRoute} from '@react-navigation/native'
import React, {useState} from 'react'
import {SafeAreaView, ScrollView, Text, View} from 'react-native'
import DefaultComponentsThemes from '../defaultComponentsThemes'
import {BacktoHome} from '../components/BacktoHome'
import Header from '../components/Header'
import {ManageEventsParamList} from '../contexts/types'
import {useTranslation} from 'react-i18next'
import Button from '../components/Button'
import firestore from '@react-native-firebase/firestore'
import {StatutPanier} from '../components/StatutPanier'
import {DatePanier} from '../components/DatePanier'

export const EditPanier = () => {
  const {i18n, t} = useTranslation()
  const route = useRoute<RouteProp<ManageEventsParamList, 'EditPanier'>>()
  const item = route.params.item
  const annee = parseInt(item.dateDelivered.substring(0, 4))
  const mois = parseInt(item.dateDelivered.substring(4, 6)) - 1
  const jour = parseInt(item.dateDelivered.substring(6, 8))
  const dateDeliv = new Date(annee, mois, jour, 0, 0, 0)
  const defaultStyles = DefaultComponentsThemes()
  const navigation = useNavigation()
  const [statut, setStatut] = useState<string>(item.statut)
  const [statutError, setStatutError] = useState('')
  const [dateDelivered, setDateDelivered] = useState<Date>(dateDeliv)
  const [dateDeliveredError, setDateDeliveredError] = useState('')
  const selectedLanguageCode = i18n.language
  let languageDate = ''
  if (selectedLanguageCode === 'fr') {
    languageDate = 'fr-fr'
  }
  if (selectedLanguageCode === 'en') {
    languageDate = 'en-GB'
  }

  const handleStatutChange = (value: string) => {
    setStatutError('')
    setStatut(value)
  }
  const handleDateDeliveredChange = (value: Date) => {
    setDateDeliveredError('')
    setDateDelivered(value)
  }

  const handleSaveProducts = async () => {
    const dateformat = dateDelivered
      .toLocaleDateString(languageDate, {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      })
      .split('/')
      .reverse()
      .join('')
    try {
      firestore()
        .collection('carts')
        .doc(item.id)
        .update({
          statut: statut,
          dateDelivered: dateformat,
        })
        .then(() => {
          console.log('Paniers updated!')
          navigation.navigate('ProductDelivering' as never)
        })
    } catch (e: unknown) {}
  }

  return (
    <SafeAreaView style={{flex: 1}}>
      <BacktoHome textRoute={t('Ventes.title')} />
      <Header>{t('AddProduct.title')}</Header>
      <ScrollView
        scrollEnabled
        showsVerticalScrollIndicator
        automaticallyAdjustKeyboardInsets={true}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={defaultStyles.scrollViewContent}>
        <View style={defaultStyles.section}>
          <StatutPanier statut={statut} setStatut={handleStatutChange} />
          {statutError && <Text style={defaultStyles.error}>statutError</Text>}
        </View>
        <View style={defaultStyles.section}>
          <DatePanier dateDelivered={dateDelivered} setDateDelivered={handleDateDeliveredChange} />
        </View>
        {dateDeliveredError != '' && <Text style={defaultStyles.error}>{dateDeliveredError}</Text>}
      </ScrollView>
      <View style={defaultStyles.bottomButtonContainer}>
        <View style={defaultStyles.buttonContainer}>
          <Button
            mode="contained"
            onPress={() => navigation.navigate('ProductDelivering' as never)}
            style={defaultStyles.button}>
            {t('Global.Cancel')}
          </Button>
          <Button mode="contained" onPress={handleSaveProducts} style={defaultStyles.button}>
            {t('Global.Modify')}
          </Button>
        </View>
      </View>
    </SafeAreaView>
  )
}
