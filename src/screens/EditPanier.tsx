import {RouteProp, useNavigation, useRoute} from '@react-navigation/native'
import React, {useState} from 'react'
import {SafeAreaView, ScrollView, StyleSheet, Text, View} from 'react-native'
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

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    scrollContent: {
      flexGrow: 1,
      paddingBottom: 20,
    },
    section: {
      marginVertical: 10,
      padding: 10,
      backgroundColor: 'white',
      borderRadius: 8,
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    scrollViewContainer: {
      flexGrow: 1,
      paddingHorizontal: 20,
      paddingBottom: 100, // Espace pour éviter que le dernier champ soit masqué
    },
    bottomButtonContainer: {
      position: 'absolute',
      bottom: 0,
      width: '100%',
      padding: 20,
      backgroundColor: '#fff',
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <BacktoHome textRoute={t('ProductDelivering.title')} />
      <Header>{t('Global.Modify')}</Header>
      <ScrollView
        scrollEnabled
        showsVerticalScrollIndicator
        automaticallyAdjustKeyboardInsets={true}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.scrollViewContainer}>
        <View style={styles.section}>
          <StatutPanier statut={statut} setStatut={handleStatutChange} />
          {statutError && <Text style={defaultStyles.error}>statutError</Text>}
        </View>
        <View style={styles.section}>
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
