import {useNavigation} from '@react-navigation/native'
import {useTranslation} from 'react-i18next'
import React, {useState} from 'react'
import {ScrollView, Text, View} from 'react-native'
import DefaultComponentsThemes from '../defaultComponentsThemes'
import {BacktoHome} from '../components/BacktoHome'
import Header from '../components/Header'
import {v4 as uuidv4} from 'uuid'
import {Location} from '../contexts/types'
import {NameSection} from '../components/NameSection'
import {DescriptionSection} from '../components/DescriptionSection'
import {DateHeureSection} from '../components/DateHeureSection'
import {EmplacementSection} from '../components/EmplacementSection'
import Button from '../components/Button'
import {SafeAreaView} from 'react-native-safe-area-context'
import {descriptionValidator, localisationValidator, nameSectionValidator} from '../core/utils'
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'

export const AddEvent = () => {
  const currentUser = auth().currentUser
  const initLocate: Location = {placeId: '', description: ''}
  const {i18n, t} = useTranslation()
  const defaultStyles = DefaultComponentsThemes()
  const navigation = useNavigation()
  const [eventName, setEventName] = useState<string>('')
  const [eventDescription, setEventDescription] = useState<string>('')
  const [eventLocalisation, setEventLocalisation] = useState<Location>(initLocate)
  const [dateDebut, setDateDebut] = useState<Date>(new Date())
  const [heureDebut, setHeureDebut] = useState<Date>(new Date())
  const [dateFin, setDateFin] = useState<Date>(new Date())
  const [heureFin, setHeureFin] = useState<Date>(new Date())
  const [nameError, setNameError] = useState('')
  const [descriptionError, setDescriptionError] = useState('')
  const [localisationError, setLocalisationError] = useState('')
  const [dateError, setDateError] = useState('')
  const selectedLanguageCode = i18n.language
  const [boutonActif, setBoutonActif] = useState(false)
  let current = {
    key: '',
    value: t('Dropdown.Event'),
  }

  let languageDate = ''
  if (selectedLanguageCode === 'fr') {
    languageDate = 'fr-fr'
  }
  if (selectedLanguageCode === 'en') {
    languageDate = 'en-GB'
  }

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
            console.log(eventType)
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
            .doc(uid)
            .set({
              id: uid,
              name: eventType,
              description: eventDescription,
              dateDebut: dateformatDebut,
              heureDebut: heureFormatDebut,
              dateFin: dateformatFin,
              heureFin: heureFormatFin,
              localisation: eventLocalisation,
              userId: currentUser?.uid,
            })
            .then(() => {
              console.log('Event added!')
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
      <Header>{t('AddEvent.title')}</Header>

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
          <DateHeureSection
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
            {t('Global.Create')}
          </Button>
        </View>
      </View>
    </SafeAreaView>
  )
}
