import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import React, { useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'

import { LargeButton } from '../components/LargeButton'
import { DispatchAction } from '../contexts/reducers/store'
import { useStore } from '../contexts/store'
import { useTheme } from '../contexts/theme'
import DefaultComponentsThemes from '../defaultComponentsThemes'
SafeAreaView
import { BacktoHome } from '../components/BacktoHome'
import Header from '../components/Header'
import TextInput from '../components/TextInput'
import DatePicker from 'react-native-date-picker'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { v4 as uuidv4 } from 'uuid';
import { AgeEnfant, Event, Invitation, ManageEventsParamList } from '../contexts/types';
import { dateDebutValidator, dateFinValidator, descriptionValidator, heureDebutValidator, heureFinValidator, localisationValidator, nameValidator } from '../core/utils'
import { LocalStorageKeys } from '../constants'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { DateEvent } from '../components/DateEvent'
import Icon from 'react-native-vector-icons/FontAwesome'
import * as AddCalendarEvent from 'react-native-add-calendar-event';
import { AddEvent } from './AddEvent'
import MapView, { Marker } from 'react-native-maps'
import { StackNavigationProp } from '@react-navigation/stack'
import { SelectList } from 'react-native-dropdown-select-list'
import { CustomInputText } from '../components/CustomInputText'
import { theme } from '../core/theme'
import Button from '../components/Button'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'

interface Age {
  age: number
}

export const InvitationDetails = () => {
  const { i18n, t } = useTranslation();
  let initAge: string[] = [];
  const route = useRoute<RouteProp<ManageEventsParamList, 'InvitationDetails'>>()
  const item = route.params.item
  const defaultStyles = DefaultComponentsThemes()
  const { ColorPallet } = useTheme()
  const navigation = useNavigation()
  const [state, dispatch] = useStore();
  const [presence, setPresence] = useState(t('Global.Yes'));
  const [nbAdult, setNbAdult] = useState(0);
  const [nbKid, setNbKid] = useState(0);
  const [displayBtn, setDisplayBtn] = useState(false);
  const [ageKid, setAgeKid] = useState(initAge);
  const [displayNo, setDisplayNo] = useState(true);
  const selectedLanguageCode = i18n.language;
    let languageDate = ''
    if(selectedLanguageCode==='fr'){
        languageDate = 'fr-fr';
    }
    if(selectedLanguageCode==='en'){
        languageDate = 'en-GB';
    }
  let filteredNumbers: number[] = [];

  const events = state.events.find((event) => event.id === item.eventId) as Event;
  let jourFormat: String[] = []
  let heureFormatDebut = ''
  let heureFormatFin = ''

  if (events) {
    const anneeDebut = parseInt(events.dateDebut.substring(0, 4));
    const moisDebut = parseInt(events.dateDebut.substring(4, 6)) - 1;
    const jourDebut = parseInt(events.dateDebut.substring(6, 8));
    const heureDebut = parseInt(events.heureDebut.substring(0, 2));
    const minutesDebut = parseInt(events.heureDebut.substring(2, 4));
    const dateDebut = new Date(anneeDebut, moisDebut, jourDebut, heureDebut, minutesDebut, 0);
    heureFormatDebut = dateDebut.toLocaleTimeString(languageDate, {
      hour: 'numeric',
      minute: 'numeric',
      hourCycle: 'h24',

    })
    jourFormat = dateDebut.toLocaleTimeString(languageDate, {
      weekday: 'long',
    }).split(' ')
    const anneeFin = parseInt(events.dateFin.substring(0, 4));
    const moisFin = parseInt(events.dateFin.substring(4, 6)) - 1;
    const jourFin = parseInt(events.dateFin.substring(6, 8));
    const heureFin = parseInt(events.heureFin.substring(0, 2));
    const minutesFin = parseInt(events.heureFin.substring(2, 4));
    const dateFin = new Date(anneeFin, moisFin, jourFin, heureFin, minutesFin, 0);
    heureFormatFin = dateFin.toLocaleTimeString(languageDate, {
      hour: 'numeric',
      minute: 'numeric',
      hourCycle: 'h24'
    })
  }


  const reponseInvitations = (invite: Invitation) => {

    let invitations: Invitation = {
      ...invite,
      reponse: presence,
    }
    if (presence == t('Global.Yes')) {


      let ageEnfant = {}
      let newAgeEnfant: AgeEnfant[] = [];

      let newAge = [...(invite.AgeEnfants as AgeEnfant[])]

      for (let i = 0; i < nbKid; i++) {
        ageEnfant = {
          age: ageKid[i]
        }
        newAgeEnfant.push(ageEnfant as AgeEnfant)
        newAge.push(ageEnfant as AgeEnfant)
      }
      console.log(newAge)
      const newAges = [newAgeEnfant, ...(invite.AgeEnfants as AgeEnfant[])]
      console.log(invite.AgeEnfants)

      invitations = {
        ...invite,
        nbrAdultes: nbAdult,
        nbrEnfants: nbKid,
        reponse: presence,
        AgeEnfants: newAge,
      }
      console.log(invitations.AgeEnfants)
    }
    dispatch({
      type: DispatchAction.UPDATE_INVITE,
      payload: invitations,
    })
    navigation.navigate('Invitations' as never);
  };

  const styles = StyleSheet.create({
    section: {
      marginHorizontal: 20,
      paddingVertical: 20,
    },
    buttonsContainer: {
      paddingBottom: 50,
    },
    error: {
      ...defaultStyles.text,
      color: ColorPallet.error,
      fontWeight: 'bold',
    },
    detailsTitle: {
      ...defaultStyles.text,
      ...defaultStyles.requestDetailsTitle,
    },
    itemContainer: {
      height: 70,
      marginHorizontal: 5,
      borderWidth: 0.3,
      flex: 1,
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
      borderBottomRightRadius: 10,
      borderBottomLeftRadius: 10,
      backgroundColor: 'white',
    },
    itemContainerForm: {
      height: '100%',
      marginHorizontal: 5,
      borderWidth: 0.3,
      flex: 1,
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
      borderBottomRightRadius: 10,
      borderBottomLeftRadius: 10,
    },
    mapview: {
      height: 300,
      marginHorizontal: 5,
      flex: 1,
    },
    row: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    container: {
      minHeight: 50,
      marginVertical: 10,
      borderWidth: 2,
      borderColor: ColorPallet.lightGray,
      borderRadius: 4,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    containerStyleName: {
      borderColor: ColorPallet.lightGray,
      borderWidth: 1,
      backgroundColor:'white'
    },
  })

  const getPresenceOuiNon = (value: string) => {
    if (value == t('Global.Yes')) {
      setPresence(t('Global.No'));
      setDisplayNo(false);
    }
    else {
      setPresence(t('Global.Yes'));
      setDisplayNo(true);
    }
    setDisplayBtn(true);
  }

  const incrementAdult = (value: number) => {
    value += 1;
    setNbAdult(value);
    setDisplayBtn(true);
  }
  const decrementAdult = (value: number) => {
    value -= 1;
    setDisplayBtn(true);
    if (value <= 0) {
      value = 0;
      setDisplayBtn(false);
    }
    setNbAdult(value);
  }

  const incrementKid = (value: number) => {
    value += 1;
    setNbKid(value);
    setDisplayBtn(true);
  }
  const decrementKid = (value: number) => {
    value -= 1;
    setDisplayBtn(true);
    if (value <= 0) {
      value = 0;
    }
    setNbKid(value);
  }

  const handleAgeKid = (index: number, value: string) => {
    initAge[index] = value
    const newArray = [...ageKid];
    newArray[index] = value
    setAgeKid(newArray)
  }
  for (let i = 0; i < nbKid; i++) {
    filteredNumbers.push(i);
  }

  return (
    <SafeAreaView>
      <BacktoHome textRoute={t('Invitations.title')} />
      <Header>{t('InvitationsDetails.title')}</Header>

      <ScrollView>
        <View style={styles.section}>
          <View style={styles.row}>
            <View style={{ flex: 1, flexDirection: 'row', }}>
              <DateEvent dateDebut={events.dateDebut} flexSize={0.87} />
            </View>
            <View style={{ flex: 4, flexDirection: 'row', }}>
              <View style={[styles.itemContainer]}>
                <View style={{ flexDirection: 'column', flex: 4, marginHorizontal: 5, marginVertical: 5 }}>
                  <View style={{ width: 250 }}>
                    <Text style={[defaultStyles.text, { fontWeight: 'bold', fontSize: 16, }]}>{jourFormat[`0`]} {t('Global.from')} {heureFormatDebut} {t('Global.to')} {heureFormatFin}</Text>
                  </View>
                  <View style={{ width: 250 }}>
                    <TouchableOpacity>
                      <View style={{ flexDirection: 'row', marginTop: 10 }}>
                        <Icon name={'calendar'} size={20} color={theme.colors.primary} />
                        <Text style={{ color: theme.colors.primary, marginHorizontal:10 }}>{events.name}</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.section}>
          <View style={[styles.itemContainerForm]}>
            <View style={{ flexDirection: 'row', }}>
              <View style={{ marginVertical: 25, marginHorizontal: 15, flex: 1 }} >
                <Text>{t('InvitationsDetails.Presence')}</Text>
              </View>
              <View style={{ flex: 1, alignItems: 'flex-end', marginHorizontal: 10 }} >
                <TouchableOpacity onPress={() => getPresenceOuiNon(presence)} >
                  <Icon name="angle-up" size={20} color={theme.colors.primaryText} />
                </TouchableOpacity>
                <Text style={{ fontSize: 15, color: 'black' }}>{presence}</Text>
                <TouchableOpacity onPress={() => getPresenceOuiNon(presence)} >
                  <Icon name="angle-down" size={20} color={theme.colors.primaryText} />
                </TouchableOpacity>
              </View>
            </View>
            {displayNo &&
              <View style={[styles.itemContainerForm, { marginHorizontal: 20 }]}>
                <View style={{ alignItems: 'center' }} >
                  <Text>{t('InvitationsDetails.nbrPersons')}</Text>
                </View>
              </View>
            }

            {displayNo &&
              <View style={{ flexDirection: 'row', }}>
                <View style={{ marginVertical: 25, marginHorizontal: 15, flex: 1 }} >
                  <Text>{t('InvitationsDetails.Adults')}</Text>
                </View>
                <View style={{ flex: 1, alignItems: 'flex-end', marginHorizontal: 10 }} >
                  <View>
                    <TouchableOpacity onPress={() => incrementAdult(nbAdult)} >
                      <Icon name="angle-up" size={20} color={theme.colors.primaryText} />
                    </TouchableOpacity>
                    <Text style={{ fontSize: 15, color: 'black' }}>{nbAdult}</Text>
                    <TouchableOpacity onPress={() => decrementAdult(nbAdult)} >
                      <Icon name="angle-down" size={20} color={theme.colors.primaryText} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            }
            {displayNo &&
              <View style={{ flexDirection: 'row', }}>
                <View style={{ marginVertical: 25, marginHorizontal: 15, flex: 1 }} >
                  <Text>{t('InvitationsDetails.KidsOver17')}</Text>
                </View>
                <View style={{ flex: 1, alignItems: 'flex-end', marginHorizontal: 10 }} >
                  <View>
                    <TouchableOpacity onPress={() => incrementKid(nbKid)} >
                      <Icon name="angle-up" size={20} color={theme.colors.primaryText} />
                    </TouchableOpacity>
                    <Text style={{ fontSize: 15, color: 'black' }}>{nbKid}</Text>
                    <TouchableOpacity onPress={() => decrementKid(nbKid)} >
                      <Icon name="angle-down" size={20} color={theme.colors.primaryText} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            }
            {filteredNumbers.map((index: number) => {
              return <View style={{ flexDirection: 'row', }} key={index}>
                <View style={{ marginVertical: 25, marginHorizontal: 15, flex: 1 }} >
                  <Text>{t('InvitationsDetails.KidsAge')} {index + 1}</Text>
                </View>
                <View style={{ flex: 1, alignItems: 'flex-end', marginHorizontal: 10, height: 70 }} >
                  <CustomInputText
                    key={index}
                    value={initAge[index]}
                    setValue={(text) => handleAgeKid(index, text)}
                    containerStyle={styles.containerStyleName}

                  />
                </View>
              </View>
            })}
          </View>
        </View>
        {displayBtn &&
        <View style={styles.section}>
        <View style={{ flexDirection: 'row'}}>
            <View style={{ marginRight: 80, alignItems: 'flex-start' }}>
              <Button mode="contained" onPress={() => navigation.navigate('Invitations' as never)}>
                {t('Global.Cancel')}
              </Button>
            </View>
            <View style={[{ marginLeft: 80, alignItems: 'flex-end' }]}>
              <Button mode="contained" onPress={() => reponseInvitations(item)}>
                {t('Global.Create')}
              </Button>
            </View>
          </View>
        </View>
        }
      </ScrollView>
    </SafeAreaView>


  )
}
