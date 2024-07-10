import {RouteProp, useNavigation, useRoute} from '@react-navigation/native'
import React, {useEffect, useState} from 'react'
import {Text, TouchableOpacity, View} from 'react-native'
import {ScrollView} from 'react-native-gesture-handler'
import DefaultComponentsThemes from '../defaultComponentsThemes'
import {BacktoHome} from '../components/BacktoHome'
import Header from '../components/Header'
import {AgeEnfant, Event, Invitation, ManageEventsParamList, TypeEvent} from '../contexts/types'
import {DateEvent} from '../components/DateEvent'
import Icon from 'react-native-vector-icons/FontAwesome'
import {CustomInputText} from '../components/CustomInputText'
import {theme} from '../core/theme'
import Button from '../components/Button'
import {SafeAreaView} from 'react-native-safe-area-context'
import {useTranslation} from 'react-i18next'
import firestore from '@react-native-firebase/firestore'
import Icon1 from 'react-native-vector-icons/MaterialCommunityIcons'
import {TextInput} from 'react-native-paper'
import { getRecordById } from '../services/FirestoreServices'

export const InvitationDetails = () => {
  let filteredNumbers: number[] = []
  const {i18n, t} = useTranslation()
  const route = useRoute<RouteProp<ManageEventsParamList, 'InvitationDetails'>>()
  const item = route.params.item
  const defaultStyles = DefaultComponentsThemes()
  const navigation = useNavigation()
  const [presence, setPresence] = useState('')
  const [nbAdult, setNbAdult] = useState('0')
  const [nbKid, setNbKid] = useState('0')
  const [displayBtn, setDisplayBtn] = useState(false)
  const [displayNo, setDisplayNo] = useState(false)
  const [initAge, setInitAge] = useState(Array(filteredNumbers.length).fill(''))
  const [ageKid, setAgeKid] = useState(Array(filteredNumbers.length).fill(''))
  const [eventName, setEventName] = useState<string>('')
  const [heureFormatDebut, setHeureFormatDebut] = useState<string>('')
  const [heureFormatFin, setHeureFormatFin] = useState<string>('')
  const [jourFormat, setJourFormat] = useState<string[]>([])
  const [dateDebut, setDateDebut] = useState<string>('')
  const selectedLanguageCode = i18n.language
  let languageDate = ''
  if (selectedLanguageCode === 'fr') {
    languageDate = 'fr-fr'
  }
  if (selectedLanguageCode === 'en') {
    languageDate = 'en-GB'
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const event = (await getRecordById('events', item.eventId)) as Event
        const anneeDebut = parseInt(event.dateDebut.substring(0, 4))
        const moisDebut = parseInt(event.dateDebut.substring(4, 6)) - 1
        const jourDebut = parseInt(event.dateDebut.substring(6, 8))
        const heureDebut = parseInt(event.heureDebut.substring(0, 2))
        const minutesDebut = parseInt(event.heureDebut.substring(2, 4))
        const dateDeb = new Date(anneeDebut, moisDebut, jourDebut, heureDebut, minutesDebut, 0)
        setDateDebut(event.dateDebut)
        setHeureFormatDebut(
          dateDeb.toLocaleTimeString(languageDate, {
            hour: 'numeric',
            minute: 'numeric',
            hourCycle: 'h24',
          })
        )
        setJourFormat(
          dateDeb
            .toLocaleTimeString(languageDate, {
              weekday: 'long',
            })
            .split(' ')
        )
        const anneeFin = parseInt(event.dateFin.substring(0, 4))
        const moisFin = parseInt(event.dateFin.substring(4, 6)) - 1
        const jourFin = parseInt(event.dateFin.substring(6, 8))
        const heureFin = parseInt(event.heureFin.substring(0, 2))
        const minutesFin = parseInt(event.heureFin.substring(2, 4))
        const dateFin = new Date(anneeFin, moisFin, jourFin, heureFin, minutesFin, 0)
        setHeureFormatFin(
          dateFin.toLocaleTimeString(languageDate, {
            hour: 'numeric',
            minute: 'numeric',
            hourCycle: 'h24',
          })
        )
        const typeEvent = (await getRecordById('type_events', event.name)) as TypeEvent
        let evenName = typeEvent.nameFr
        if (selectedLanguageCode === 'en') {
          evenName = typeEvent.nameEn
        }
        setEventName(evenName)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [item.eventId, languageDate])

  const reponseInvitations = (invite: Invitation) => {
    if (presence == t('Global.Yes')) {
      let ageEnfant = {}
      let newAgeEnfant: AgeEnfant[] = []

      let newAge = [...(invite.AgeEnfants as AgeEnfant[])]

      for (let i = 0; i < parseInt(nbKid); i++) {
        ageEnfant = {
          age: ageKid[i],
        }
        newAgeEnfant.push(ageEnfant as AgeEnfant)
        newAge.push(ageEnfant as AgeEnfant)
      }
      firestore()
        .collection('invitations')
        .doc(item.id)
        .update({
          nbrAdultes: nbAdult,
          nbrEnfants: nbKid,
          reponse: presence,
          AgeEnfants: newAge,
        })
        .then(() => {
          console.log('Invitations updated!')
        })
    } else {
      firestore()
        .collection('invitations')
        .doc(item.id)
        .update({
          reponse: presence,
        })
        .then(() => {
          console.log('Invitations updated!')
        })
    }
    navigation.navigate('Invitations' as never)
  }

  const getPresenceOuiNon = (value: string) => {
    if (value == t('Global.Yes')) {
      setPresence(t('Global.No'))
      setDisplayNo(false)
      setDisplayBtn(true)
    } 
    if (value == t('Global.No')) {
      setPresence(t('Global.Yes'))
      setDisplayNo(true)
      setDisplayBtn(false)
      if(parseInt(nbAdult)>0){
        setDisplayBtn(true)
      }
    }
  }

  const incrementAdult = (value: string) => {
    const numericValue = value.replace(/[^0-9]/g, '0')
    const val = parseInt(numericValue) +1
    setNbAdult(val.toString())
    setDisplayBtn(true)
  }
  const decrementAdult = (value: string) => {
    const numericValue = value.replace(/[^0-9]/g, '0')
    let val = parseInt(numericValue) -1
    setDisplayBtn(true)
    if (val <= 0) {
      val = 0
      setDisplayBtn(false)
    }
    setNbAdult(val.toString())
  }

  const handleNbAdult = (value: string) => {
    const numericValue = value.replace(/[^0-9]/g, '')
    setNbAdult(numericValue)
  }

  const handleNbKid = (value: string) => {
    const numericValue = value.replace(/[^0-9]/g, '')
    setNbKid(numericValue)
  }

  const incrementKid = (value: string) => {
    const numericValue = value.replace(/[^0-9]/g, '0')
    const val = parseInt(numericValue) +1
    setNbKid(val.toString())
    setDisplayBtn(true)
  }
  const decrementKid = (value: string) => {
    const numericValue = value.replace(/[^0-9]/g, '0')
    let val = parseInt(numericValue) -1
    setDisplayBtn(true)
    if (val <= 0) {
      val = 0
    }
    setNbKid(val.toString())
  }

  const handleAgeKid = (index: number, value: string) => {
    const numericValue = value.replace(/[^0-9]/g, '')
    const newInitAge = [...initAge]
    newInitAge[index] = numericValue
    setInitAge(newInitAge)

    const newAgeKid = [...ageKid]
    newAgeKid[index] = numericValue
    setAgeKid(newAgeKid)

    console.log(numericValue)
  }

  for (let i = 0; i < parseInt(nbKid); i++) {
    filteredNumbers.push(i)
  }

  return (
    <SafeAreaView style={{flex: 1}}>
      <BacktoHome textRoute={t('Invitations.title')} />
      <Header>{t('InvitationsDetails.title')}</Header>

      <ScrollView automaticallyAdjustKeyboardInsets={true} keyboardShouldPersistTaps="handled" contentContainerStyle={defaultStyles.scrollViewContent}>
        <View style={defaultStyles.section}>
          <View style={defaultStyles.row}>
            <View style={{flex: 1, flexDirection: 'row'}}>
              <DateEvent dateDebut={dateDebut} flexSize={0.87} />
            </View>
            <View style={{flex: 4, flexDirection: 'row'}}>
              <View style={[defaultStyles.itemContainerDateEvent]}>
                <View
                  style={{
                    flexDirection: 'column',
                    flex: 4,
                    marginHorizontal: 5,
                    marginVertical: 5,
                  }}>
                  <View style={{width: 250}}>
                    <Text style={[defaultStyles.text, {fontWeight: 'bold', fontSize: 16}]}>
                      {jourFormat['0']} {t('Global.from')} {heureFormatDebut} {t('Global.to')} {heureFormatFin}
                    </Text>
                  </View>
                  <View style={{width: 250}}>
                    <TouchableOpacity>
                      <View style={{flexDirection: 'row', marginTop: 10}}>
                        <Icon name={'calendar'} size={20} color={theme.colors.primary} />
                        <Text
                          style={{
                            color: theme.colors.primary,
                            marginHorizontal: 10,
                          }}>
                          {eventName}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
        <View style={defaultStyles.section}>
          <View style={[defaultStyles.itemContainerFormInvite]}>
            <View style={{flexDirection: 'row'}}>
            <View style={[defaultStyles.labelContainer, {marginVertical: 25, marginHorizontal:15}]}>
                <Text>{t('InvitationsDetails.Presence')}</Text>
              </View>
              <View style={{flex: 1, alignItems: 'flex-end', marginHorizontal: 10}}>
                <TouchableOpacity
                  style={[defaultStyles.switchContainer, defaultStyles.switchEnabled]}
                  onPress={() => getPresenceOuiNon(t('Global.No'))}>
                  <View style={defaultStyles.iconTextContainer}>
                        <Icon1 name="check" size={20} color="#000000" />
                        <Text style={defaultStyles.switchTextDark}> {t('Global.Yes')}</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[defaultStyles.switchContainer, defaultStyles.switchDisabled]}
                  onPress={() => getPresenceOuiNon(t('Global.Yes'))}>
                  <View style={defaultStyles.iconTextContainer}>
                        <Text style={defaultStyles.switchText}>{t('Global.No')} </Text>
                        <Icon1 name="close" size={20} color="#ffffff" />
                  </View>
                </TouchableOpacity>
              </View>
            </View>
            {displayNo && (
              <View style={[defaultStyles.itemContainerFormInvite, {marginHorizontal: 20}]}>
                <View style={{alignItems: 'center'}}>
                  <Text>{t('InvitationsDetails.nbrPersons')}</Text>
                </View>
              </View>
            )}

            {displayNo && (
              <View style={{flexDirection: 'row'}}>
                <View style={[defaultStyles.labelContainer, {marginVertical: 25, marginHorizontal:15}]}>
                  <Text>{t('InvitationsDetails.Adults')}</Text>
                </View>
                <View
                  style={{
                    flex: 1,
                    alignItems: 'flex-end',
                    marginHorizontal: 10,
                  }}>
                  <View style={defaultStyles.center}>
                    <TouchableOpacity onPress={() => decrementAdult(nbAdult)}>
                      <Icon name="minus" size={18} style={defaultStyles.icon} />
                    </TouchableOpacity>
                    <TextInput
                      value={nbAdult.toString()}
                      onChangeText={(text) => handleNbAdult(text)}
                      autoCapitalize="none"
                      keyboardType="numeric"
                      style={defaultStyles.input}
                      selectionColor={theme.colors.primary}
                      underlineColor="transparent"
                      mode="outlined"
                    />
                     <TouchableOpacity onPress={() => incrementAdult(nbAdult)}>
                      <Icon name="plus" size={18} style={defaultStyles.icon} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
            {displayNo && (
              <View style={{flexDirection: 'row'}}>
                <View style={[defaultStyles.labelContainer, {marginVertical: 25, marginHorizontal:15}]}>
                  <Text>{t('InvitationsDetails.KidsOver17')}</Text>
                </View>
                <View
                  style={{
                    flex: 1,
                    alignItems: 'flex-end',
                    marginHorizontal: 10,
                  }}>
                 <View style={defaultStyles.center}>
                    <TouchableOpacity onPress={() => decrementKid(nbKid)}>
                      <Icon name="minus" size={18} style={defaultStyles.icon} />
                    </TouchableOpacity>
                    <TextInput
                      value={nbKid.toString()}
                      onChangeText={(text) => handleNbKid(text)}
                      autoCapitalize="none"
                      keyboardType="numeric"
                      style={defaultStyles.input}
                      selectionColor={theme.colors.primary}
                      underlineColor="transparent"
                      mode="outlined"
                    />
                     <TouchableOpacity onPress={() => incrementKid(nbKid)}>
                      <Icon name="plus" size={18} style={defaultStyles.icon} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
            {displayNo && filteredNumbers.map((index: number) => {
              return (
                <View style={{flexDirection: 'row'}} key={index}>
                  <View style={{marginVertical: 25, marginHorizontal: 15, flex: 1}}>
                    <Text>
                      {t('InvitationsDetails.KidsAge')} {index + 1}
                    </Text>
                  </View>
                  <View
                    style={{
                      flex: 1,
                      alignItems: 'flex-end',
                      marginHorizontal: 40,
                      height: 70,
                    }}>
                    <CustomInputText
                      key={index}
                      value={initAge[index]}
                      setValue={(text) => handleAgeKid(index, text)}
                      containerStyle={defaultStyles.containerStyleName}
                      keyboardType="numeric"
                    />
                  </View>
                </View>
              )
            })}
          </View>
        </View>
       
      </ScrollView>
      {displayBtn && (
        <View style={defaultStyles.bottomButtonContainer}>
       <View style={defaultStyles.buttonContainer}>
          <Button mode="contained" onPress={() => navigation.navigate('Invitations' as never)} style={defaultStyles.button}>
            {t('Global.Cancel')}
          </Button>
          <Button mode="contained" onPress={() => reponseInvitations(item)} style={defaultStyles.button}>
            {t('Global.Confirm')}
          </Button>
        </View>
      </View>
         
        )}
    </SafeAreaView>
  )
}
