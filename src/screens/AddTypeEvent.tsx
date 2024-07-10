import {useNavigation} from '@react-navigation/native'
import {useTranslation} from 'react-i18next'
import React, {useState} from 'react'
import {ScrollView, Text, View} from 'react-native'
import DefaultComponentsThemes from '../defaultComponentsThemes'
import {BacktoHome} from '../components/BacktoHome'
import Header from '../components/Header'
import {v4 as uuidv4} from 'uuid'
import Button from '../components/Button'
import {SafeAreaView} from 'react-native-safe-area-context'
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
import {NameFrSection} from '../components/NameFrSection'
import {NameEnSection} from '../components/NameEnSection'
import {nameSectionValidator} from '../core/utils'

export const AddTypeEvent = () => {
  const currentUser = auth().currentUser
  const {t} = useTranslation()
  const defaultStyles = DefaultComponentsThemes()
  const navigation = useNavigation()
  const [nameFr, setNameFr] = useState<string>('')
  const [nameEn, setNameEn] = useState<string>('')
  const [boutonActif, setBoutonActif] = useState(false)
  const [nameFrError, setNameFrError] = useState('')
  const [nameEnError, setNameEnError] = useState('')

  const handleNameFrChange = (value: string) => {
    setNameFrError('')
    setNameFr(value)
  }
  const handleNameEnChange = (value: string) => {
    setNameEnError('')
    setNameEn(value)
  }

  const handleSaveTypeEvents = async () => {
    setBoutonActif(true)
    try {
      const nameFREmpty = nameSectionValidator(nameFr, t)
      const nameENEmpty = nameSectionValidator(nameEn, t)
      if (nameFREmpty || nameENEmpty) {
        setNameFrError(nameFREmpty)
        setNameEnError(nameENEmpty)
      } else {
        const uid = uuidv4()
        firestore()
          .collection('type_events')
          .doc(uid)
          .set({
            id: uid,
            nameFr: nameFr,
            nameEn: nameEn,
            userId: currentUser?.uid,
          })
          .then(() => {
            console.log('Type Event added!')
            setBoutonActif(false)
            navigation.navigate('TypeEvents' as never)
          })
      }
    } catch (e: unknown) {
      setBoutonActif(false)
    }
  }

  return (
    <SafeAreaView style={{flex: 1}}>
      <BacktoHome textRoute={t('TypeEvents.title')} />
      <Header>{t('AddTypeEvent.title')}</Header>

      <ScrollView automaticallyAdjustKeyboardInsets={true} keyboardShouldPersistTaps="handled">
        <View style={defaultStyles.section}>
          <NameFrSection nameFr={nameFr} setNameFr={handleNameFrChange} />
          {nameFrError && <Text style={defaultStyles.error}>{t('Global.NameErrorEmpty')}</Text>}
        </View>
        <View style={defaultStyles.section}>
        <NameEnSection nameEn={nameEn} setNameEn={handleNameEnChange} />
          {nameEnError && <Text style={defaultStyles.error}>{t('Global.NameErrorEmpty')}</Text>}
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
          <Button mode="contained" onPress={handleSaveTypeEvents} style={defaultStyles.button} disabled={boutonActif}>
            {t('Global.Create')}
          </Button>
        </View>
      </View>
    </SafeAreaView>
  )
}
