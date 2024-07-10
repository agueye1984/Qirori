import {RouteProp, useNavigation, useRoute} from '@react-navigation/native'
import React, {useEffect, useState} from 'react'
import {ScrollView, Text, View} from 'react-native'
import DefaultComponentsThemes from '../defaultComponentsThemes'
import {BacktoHome} from '../components/BacktoHome'
import Header from '../components/Header'
import {Location, ManageEventsParamList, TypeEvent} from '../contexts/types'
import {descriptionValidator, localisationValidator, nameSectionValidator} from '../core/utils'
import {NameSection} from '../components/NameSection'
import {DescriptionSection} from '../components/DescriptionSection'
import {EmplacementSection} from '../components/EmplacementSection'
import {StackNavigationProp} from '@react-navigation/stack'
import Button from '../components/Button'
import {SafeAreaView} from 'react-native-safe-area-context'
import {useTranslation} from 'react-i18next'
import firestore from '@react-native-firebase/firestore'
import {DateHeureSectionEdit} from '../components/DateHeureSectionEdit'
import {v4 as uuidv4} from 'uuid'
import auth from '@react-native-firebase/auth'

type editEventProps = StackNavigationProp<ManageEventsParamList, 'EventDetails'>

export const EditEvent = () => {
  const currentUser = auth().currentUser
  const {i18n, t} = useTranslation()
  const route = useRoute<RouteProp<ManageEventsParamList, 'EditEvent'>>()
  const defaultStyles = DefaultComponentsThemes()
  const navigation = useNavigation<editEventProps>()
  const item = route.params.item
  const [eventName, setEventName] = useState<string>(item.name)
  const [eventDescription, setEventDescription] = useState<string>(item.description)
  const [eventLocalisation, setEventLocalisation] = useState<Location>(item.localisation)
  const [boutonActif, setBoutonActif] = useState(false)

  const dateDebFormat =
    item.dateDebut.substring(0, 4) + '-' + item.dateDebut.substring(4, 6) + '-' + item.dateDebut.substring(6, 8)
  const heurDebFormat = dateDebFormat + ' ' + item.heureDebut.substring(0, 2) + ':' + item.heureDebut.substring(2, 4)
  const dateFinFormat =
    item.dateFin.substring(0, 4) + '-' + item.dateFin.substring(4, 6) + '-' + item.dateFin.substring(6, 8)
  const heurFinFormat = dateFinFormat + ' ' + item.heureFin.substring(0, 2) + ':' + item.heureFin.substring(2, 4)
  console.log(dateDebFormat)
  const [dateDebut, setDateDebut] = useState<Date>(new Date(dateDebFormat))
  const [heureDebut, setHeureDebut] = useState<Date>(new Date(heurDebFormat))
  const [dateFin, setDateFin] = useState<Date>(new Date(dateFinFormat))
  const [heureFin, setHeureFin] = useState<Date>(new Date(heurFinFormat))
  const [nameError, setNameError] = useState('')
  const [descriptionError, setDescriptionError] = useState('')
  const [localisationError, setLocalisationError] = useState('')
  const selectedLanguageCode = i18n.language
  const [dateError, setDateError] = useState('')

  let initial = {
    key: '',
    value: t('Dropdown.Event'),
  }
  const [current, setCurrent] = useState(initial)
  let languageDate = ''
  if (selectedLanguageCode === 'fr') {
    languageDate = 'fr-fr'
  }
  if (selectedLanguageCode === 'en') {
    languageDate = 'en-GB'
  }

  useEffect(() => {
    var db = firestore()
    var typeEventsRef = db.collection('type_events')
    let query = typeEventsRef.where('nameEn', '!=', '')
    if (selectedLanguageCode == 'fr') {
      query = typeEventsRef.where('nameFr', '!=', '')
    }
    query.get().then((querySnapshot) => {
      querySnapshot.forEach((documentSnapshot) => {
        const typeEvt = documentSnapshot.data() as TypeEvent
        if (typeEvt.id === item.name) {
          if (selectedLanguageCode == 'fr') {
            initial = {
              key: typeEvt.id,
              value: typeEvt.nameFr,
            }
            setCurrent(initial)
          } else {
            initial = {
              key: typeEvt.id,
              value: typeEvt.nameEn,
            }
            setCurrent(initial)
          }
        }
      })
    })
  }, [])

  const handleNameChange = (value: string) => {
    setEventName(value)
  }
  const handleDescriptionChange = (value: string) => {
    setEventDescription(value)
  }

  const handleLocalisationChange = (value: Location) => {
    setEventLocalisation(value)
  }

  const handleDateDebutChange = (value: Date) => {
    setDateDebut(value)
  }

  const handleHeureDebutChange = (value: Date) => {
    setHeureDebut(value)
  }

  const handleDateFinChange = (value: Date) => {
    setDateFin(value)
  }

  const handleHeureFinChange = (value: Date) => {
    setHeureFin(value)
  }

  const estUUID = (uuid: string) => {
    const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    return uuidPattern.test(uuid)
  }

  const handleSaveEvents = async () => {
    setBoutonActif(true)
    try {
      const nameEmpty = nameSectionValidator(eventName, t)
      const descriptionEmpty = descriptionValidator(eventDescription, t)
      const locateEmpty = localisationValidator(eventLocalisation, t)

      if (nameEmpty || descriptionEmpty || locateEmpty) {
        setNameError(nameEmpty)
        setDescriptionError(descriptionEmpty)
        setLocalisationError(locateEmpty)
        setBoutonActif(false)
      } else {
        const dateformatDebut = dateDebut
          .toLocaleDateString(languageDate, {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
          })
          .split('/')
          .reverse()
          .join('')
        const heureFormatDebut = heureDebut
          .toLocaleTimeString(languageDate, {
            hour: 'numeric',
            minute: 'numeric',
            hourCycle: 'h24',
          })
          .split(':')
          .join('')
        const dateformatFin = dateFin
          .toLocaleDateString(languageDate, {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
          })
          .split('/')
          .reverse()
          .join('')
        const heureFormatFin = heureFin
          .toLocaleTimeString(languageDate, {
            hour: 'numeric',
            minute: 'numeric',
            hourCycle: 'h24',
          })
          .split(':')
          .join('')
        const dateDeb = dateformatDebut + heureFormatDebut
        const dateF = dateformatFin + heureFormatFin
        console.log(dateDeb)
        console.log(dateF)
        if (dateDeb > dateF) {
          setDateError(t('Global.DateDGTDateF'))
          setBoutonActif(false)
        } else {
          const uid = uuidv4()
          let eventType = eventName
          if (!estUUID(eventType)) {
            let nameFr = ''
            let nameEn = ''
            if (selectedLanguageCode === 'fr') {
              nameFr = eventType
            } else {
              nameEn = eventType
            }
            eventType = uid
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
              })
          }
          firestore()
            .collection('events')
            .doc(item.id)
            .update({
              name: eventName,
              description: eventDescription,
              dateDebut: dateformatDebut,
              heureDebut: heureFormatDebut,
              dateFin: dateformatFin,
              heureFin: heureFormatFin,
              localisation: eventLocalisation,
            })
            .then(() => {
              console.log('Event updated!')
              setBoutonActif(false)
              navigation.navigate('Events' as never)
            })
        }
      }
    } catch (e: unknown) {
      setBoutonActif(false)
    }
  }

  return (
    <SafeAreaView style={{flex: 1}}>
      <BacktoHome textRoute={t('Events.title')} />
      <Header>{t('AddEvent.titleModify')}</Header>
      <ScrollView
        scrollEnabled
        showsVerticalScrollIndicator
        automaticallyAdjustKeyboardInsets={true}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={defaultStyles.scrollViewContent}>
        <View style={defaultStyles.section}>
          <NameSection eventName={eventName} setEventName={handleNameChange} current={current} error={nameError} />
        </View>
        <View style={defaultStyles.section}>
          <DescriptionSection
            maxLength={200}
            eventDescription={eventDescription}
            setEventDescription={handleDescriptionChange}
            error={descriptionError}
          />
        </View>
        <View style={defaultStyles.section}>
          <DateHeureSectionEdit
            dateDeb={dateDebut}
            heureDeb={heureDebut}
            dateF={dateFin}
            heureF={heureFin}
            setDateDeb={handleDateDebutChange}
            setHeureDeb={handleHeureDebutChange}
            setDateF={handleDateFinChange}
            setHeureF={handleHeureFinChange}
          />
        </View>
        {dateError && <Text style={defaultStyles.error}>{dateError}</Text>}
        <View style={defaultStyles.section}>
          <EmplacementSection
            eventLocalisation={eventLocalisation}
            setEventLocalisation={handleLocalisationChange}
            error={localisationError}
          />
        </View>
      </ScrollView>
      <View style={defaultStyles.bottomButtonContainer}>
        <View style={defaultStyles.buttonContainer}>
          <Button mode="contained" onPress={() => navigation.navigate('Events' as never)} style={defaultStyles.button}>
            {t('Global.Cancel')}
          </Button>
          <Button mode="contained" onPress={handleSaveEvents} style={defaultStyles.button} disabled={boutonActif}>
            {t('Global.Modify')}
          </Button>
        </View>
      </View>
    </SafeAreaView>
  )
}
