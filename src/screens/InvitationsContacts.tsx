import React, {useEffect, useRef, useState} from 'react'
import {SafeAreaView, StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import {useTheme} from '../contexts/theme'
import {useTranslation} from 'react-i18next'
import Header from '../components/Header'
import {StackNavigationProp} from '@react-navigation/stack'
import {ManageEventsParamList, TypeEvent, User} from '../contexts/types'
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native'
import {BacktoHome} from '../components/BacktoHome'
import Icon from 'react-native-vector-icons/FontAwesome'
import {CustomInputText} from '../components/CustomInputText'
import {v4 as uuidv4} from 'uuid'
import {theme} from '../core/theme'
import Button from '../components/Button'
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
import {phoneValidator} from '../core/utils'
import DefaultComponentsThemes from '../defaultComponentsThemes'
import PhoneInput from 'react-native-phone-number-input'

type eventDetailsProp = StackNavigationProp<ManageEventsParamList, 'EventDetails'>

export const InvitationsContacts = () => {
  const {ColorPallet} = useTheme()
  const {i18n, t} = useTranslation()
  const route = useRoute<RouteProp<ManageEventsParamList, 'InvitationsContacts'>>()
  const item = route.params.item
  const navigation = useNavigation<eventDetailsProp>()
  const [toggle, setToggle] = useState(false)
  const [numTelephone, setNumTelephone] = useState<string>('')
  const [phoneError, setPhoneError] = useState('')
  const [userId, setUserId] = useState('')
  const [typeEvents, setTypeEvents] = useState<TypeEvent[]>([])
  const defaultStyles = DefaultComponentsThemes()
  const selectedLanguageCode = i18n.language
  const phoneInput = useRef<PhoneInput>(null)
  let langue = 'fra'
  if (selectedLanguageCode=='en'){
    langue = 'eng'
  }

  useEffect(() => {
    const usersRef = firestore().collection('users')
    auth().onAuthStateChanged((user) => {
      if (user) {
        usersRef
          .doc(user.uid)
          .get()
          .then((document) => {
            const userData = document.data() as User
            setUserId(userData.id)
          })
          .catch((error) => {
            console.log('error1 ' + error)
          })
      }
    })
  }, [])

  useEffect(() => {
    firestore()
      .collection('type_events')
      .get()
      .then((querySnapshot) => {
        const events: TypeEvent[] = []
        querySnapshot.forEach((documentSnapshot) => {
          events.push(documentSnapshot.data() as TypeEvent)
        })
        setTypeEvents(events)
      })
  }, [])

  const typeEvent = typeEvents.find((e) => e.id === item.name)
  let nameEvent = typeEvent === undefined ? '' : typeEvent.nameFr
  if (selectedLanguageCode === 'en') {
    nameEvent = typeEvent === undefined ? '' : typeEvent.nameEn
  }

  const getToggleOnOff = (toggle: boolean) => {
    setToggle(toggle)
  }

  const handleNumTelephone = (value: string) => {
    setNumTelephone(value)
  }

  const goToContactList = () => {
    navigation.navigate('ContactsList', {item: item})
  }

  const handleSaveInvitations = async () => {
    const phoneError = phoneValidator(numTelephone, t)
    if (phoneError) {
      setPhoneError(phoneError)
    } else {
      firestore()
        .collection('invitations')
        // Filter results
        .where('numeroTelephone', '==', numTelephone)
        .where('eventId', '==', item.id)
        .get()
        .then((querySnapshot) => {
          if (querySnapshot.empty) {
            const uid = uuidv4()
            const ageEnfants: any[] = []
            firestore()
              .collection('invitations')
              .doc(uid)
              .set({
                id: uid,
                eventId: item.id,
                numeroTelephone: numTelephone,
                userId: userId,
                reponse: '',
                nbrAdultes: 0,
                nbrEnfants: 0,
                closeDonation: false,
                AgeEnfants: ageEnfants,
              })
              .then(() => {
                console.log('Invitation added!')
              })
          }
        })

      navigation.navigate('EventDetails', {item: item})
    }
  }

  const styles = StyleSheet.create({
    section: {
      marginHorizontal: 10,
      paddingVertical: 10,
    },
    detailsTitle: {
      color: ColorPallet.lightGray,
      fontSize: 16,
    },
    itemContainer: {
      height: 110,
      marginHorizontal: 5,
      borderWidth: 0.3,
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
      borderBottomRightRadius: 10,
      borderBottomLeftRadius: 10,
    },
    row: {
      flexDirection: 'row',
    },
    itemSeparator: {
      height: 75,
      marginHorizontal: 15,
      alignItems: 'center',
      justifyContent: 'center',
      borderBottomWidth: 0.4,
    },
    containerStyleName: {
      borderColor: ColorPallet.lightGray,
      borderWidth: 1,
      backgroundColor: 'white',
      width: 250,
    },
    error: {
      ...defaultStyles.text,
      color: ColorPallet.error,
      fontWeight: 'bold',
    },
  })

  return (
    <SafeAreaView>
      <BacktoHome textRoute={nameEvent} />
      <Header>{t('InvitationsContacts.title')}</Header>
      <View>
        <View style={styles.section}>
          <Text style={[styles.detailsTitle, {marginTop: 15, marginLeft: 10}]}>{t('InvitationsContacts.Share')}</Text>
          <View style={[styles.itemContainer, {marginTop: 15}]}>
            <View style={styles.row}>
              <View style={{marginVertical: 10, marginHorizontal: 15}}>
                <Text>{t('InvitationsContacts.Everyone')}</Text>
              </View>
              <View style={{marginVertical: 10, marginLeft: 150}}>
                {toggle ? (
                  <TouchableOpacity onPress={() => getToggleOnOff(false)}>
                    <Icon name={'toggle-on'} color={theme.colors.primary} size={20} />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity onPress={() => getToggleOnOff(true)}>
                    <Icon name={'toggle-off'} color={ColorPallet.lightGray} size={20} />
                  </TouchableOpacity>
                )}
              </View>
            </View>
            <View style={[styles.itemSeparator, {flex: 0.2}]} />
            <View style={styles.row}>
              <View style={{marginVertical: 15, marginHorizontal: 15}}>
                <Text>{t('InvitationsContacts.Limit')}</Text>
              </View>
              <View style={{marginVertical: 15, marginLeft: 200}}>
                <Text>{t('InvitationsContacts.Nos')}</Text>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={[styles.detailsTitle, {marginTop: 15, marginLeft: 10}]}>{t('InvitationsContacts.Invite')}</Text>
          <View style={[styles.itemContainer, {marginTop: 15}]}>
            <View style={styles.row}>
              <View style={{marginVertical: 10, marginHorizontal: 15}}>
                <TouchableOpacity onPress={goToContactList}>
                  <Text>{t('InvitationsContacts.FromContacts')}</Text>
                </TouchableOpacity>
              </View>
              <View style={{marginVertical: 10, marginLeft: 200}}>
                <TouchableOpacity onPress={goToContactList}>
                  <Icon name={'angle-right'} color={ColorPallet.darkGray} size={20} />
                </TouchableOpacity>
              </View>
            </View>
            <View style={[styles.itemSeparator, {flex: 0.2}]} />
            <View style={styles.row}>
              <View style={{margin: 5}}>
                <PhoneInput
                  ref={phoneInput}
                  defaultValue={numTelephone}
                  defaultCode="CA"
                  layout="first"
                  onChangeText={(text) => {
                    handleNumTelephone(text)
                  }}
                  onChangeFormattedText={(text) => {
                    handleNumTelephone(text)
                  }}
                  withDarkTheme
                  withShadow
                  autoFocus
                  countryPickerProps={{translation: langue}}
                  placeholder={t('InvitationsContacts.PhoneNumber')}
                  containerStyle={styles.containerStyleName}
                />
                {/* <CustomInputText
                  value={numTelephone}
                  setValue={handleNumTelephone}
                  placeholder={t('InvitationsContacts.PhoneNumber')}
                  containerStyle={styles.containerStyleName}
                /> */}
              </View>
              <View style={{margin: 5}}>
                <Button mode="contained" onPress={handleSaveInvitations}>
                  {t('InvitationsContacts.Invitee')}
                </Button>
              </View>
            </View>
            {phoneError != '' && <Text style={styles.error}>{phoneError}</Text>}
          </View>
        </View>
      </View>
    </SafeAreaView>
  )
}
