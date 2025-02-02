import React, {useEffect, useState} from 'react'
import {
  ActivityIndicator,
  Dimensions,
  PermissionsAndroid,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import {useTranslation} from 'react-i18next'
import Header from '../components/Header'
import {BacktoHome} from '../components/BacktoHome'
import {SearchBar} from '../components/SearchBar'
import Contacts from 'react-native-contacts'
import Contact from '../components/Contact'
import Button from '../components/Button'
import {theme} from '../core/theme'
import Icon from 'react-native-vector-icons/MaterialIcons'
import {StackNavigationProp} from '@react-navigation/stack'
import {ManageEventsParamList} from '../contexts/types'
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native'
import {v4 as uuidv4} from 'uuid'
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
import DefaultComponentsThemes from '../defaultComponentsThemes'

type eventDetailsProp = StackNavigationProp<ManageEventsParamList, 'EventDetails'>

export const ContactsList = () => {
  const currentUser = auth().currentUser
  const route = useRoute<RouteProp<ManageEventsParamList, 'ContactsList'>>()
  const item = route.params.item
  const contact: any[] = []
  const recordCheck: any[] = []
  const {t} = useTranslation()
  const [contacts, setContacts] = useState(contact)
  const [loading, setLoading] = useState(true)
  const [searchPlaceholder, setSearchPlaceholder] = useState(t('Global.Search'))
  const [checked, setChecked] = useState(false)
  const [recordChecked, setRecordChecked] = useState(recordCheck)
  const navigation = useNavigation<eventDetailsProp>()
  const defaultStyles = DefaultComponentsThemes()
  const {width, height} = Dimensions.get('window');

  useEffect(() => {
    if (Platform.OS === 'android') {
      PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS, {
        title: 'Contacts',
        message: 'This app would like to view your contacts.',
        buttonPositive: 'Please accept bare mortal',
      }).then(() => {
        loadContacts()
      })
    } else {
      loadContacts()
    }
  }, [])

  const handleChecked = (contact: any, contIndex: number, record: string, checked: boolean, recordChecked: any[]) => {
    if (recordChecked === undefined) {
      recordChecked = []
    }
    const updCont = {...contact, checked: !checked}
    const newContacts = [...contacts]
    newContacts[contIndex] = updCont
    setContacts(newContacts)
    if (checked) {
      var index = recordChecked.indexOf(record)
      recordChecked.splice(index, 1)
    } else {
      recordChecked.push(record)
    }
    setRecordChecked(recordChecked)
  }

  const loadContacts = () => {
    Contacts.getAll()
      .then((contacts) => {
        const cont = contacts.filter((a) => a.phoneNumbers[0] != null)
        const newContact: any[] = []
        cont.map((contact: any, index: number) => {
          if (recordChecked.includes(contact.recordID)) {
            const newCont = {...contact, checked: true}
            contact = newCont
          }
          newContact.push(contact)
        })
        newContact.sort((a, b) => a.givenName.toLowerCase().localeCompare(b.givenName.toLowerCase()))
        setContacts(newContact)
        setLoading(false)
      })
      .catch((e) => {
        setLoading(false)
        console.warn('Permission to access contacts was denied')
      })

    Contacts.getCount().then((count) => {
      setSearchPlaceholder(t('Global.Search') + ' ' + count.toString() + ' contacts')
    })

    Contacts.checkPermission()
  }

  const search = (text: string) => {
    const phoneNumberRegex = /\b[\+]?[(]?[0-9]{2,6}[)]?[-\s\.]?[-\s\/\.0-9]{3,15}\b/m
    const emailAddressRegex =
      /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i
    if (text === '' || text === null) {
      loadContacts()
    } else if (phoneNumberRegex.test(text)) {
      Contacts.getContactsByPhoneNumber(text).then((contacts) => {
        const cont = contacts.filter((a) => a.phoneNumbers != null)
        const newContact: any[] = []
        cont.map((contact: any, index: number) => {
          if (recordChecked.includes(contact.recordID)) {
            const newCont = {...contact, checked: true}
            contact = newCont
          }
          newContact.push(contact)
        })
        newContact.sort((a, b) => a.givenName.toLowerCase().localeCompare(b.givenName.toLowerCase()))
        setContacts(newContact)
      })
    } else if (emailAddressRegex.test(text)) {
      Contacts.getContactsByEmailAddress(text).then((contacts) => {
        const cont = contacts.filter((a) => a.phoneNumbers != null)
        const newContact: any[] = []
        cont.map((contact: any, index: number) => {
          if (recordChecked.includes(contact.recordID)) {
            const newCont = {...contact, checked: true}
            contact = newCont
          }
          newContact.push(contact)
        })
        newContact.sort((a, b) => a.givenName.toLowerCase().localeCompare(b.givenName.toLowerCase()))
        setContacts(newContact)
      })
    } else {
      Contacts.getContactsMatchingString(text).then((contacts) => {
        const cont = contacts.filter((a) => a.phoneNumbers != null)
        const newContact: any[] = []
        cont.map((contact: any, index: number) => {
          if (recordChecked.includes(contact.recordID)) {
            const newCont = {...contact, checked: true}
            contact = newCont
          }
          newContact.push(contact)
        })
        newContact.sort((a, b) => a.givenName.toLowerCase().localeCompare(b.givenName.toLowerCase()))
        setContacts(newContact)
      })
    }
  }

  const checkedAllContacts = (contacts: any, checked: boolean) => {
    let contactsChecked: any[] = []
    let recordCheck: any[] = []
    contacts.map((contact: any) => {
      if (checked) {
        const newCont = {...contact, checked: false}
        contactsChecked.push(newCont)
        var index = recordChecked.indexOf(contact.recordID)
        recordCheck.splice(index, 1)
      } else {
        const newCont = {...contact, checked: true}
        contactsChecked.push(newCont)
        recordCheck.push(contact.recordID)
      }
    })
    setChecked(!checked)
    setContacts(contactsChecked)
    setRecordChecked(recordCheck)
  }

  

  const inviteContact = async () => {
    recordChecked.map((record) => {
      const contact = contacts.find((cont) => cont.recordID === record)
      const numTelephone = contact.phoneNumbers[0] == null ? '' : contact.phoneNumbers[0].number
      const uid = uuidv4()
      const ageEnfants: any[] = []
      firestore()
        .collection('invitations')
        // Filter results
        .where('numeroTelephone', '==', numTelephone)
        .where('eventId', '==', item.id)
        .get()
        .then((querySnapshot) => {
          if (querySnapshot.empty) {
            firestore()
              .collection('invitations')
              .doc(uid)
              .set({
                id: uid,
                eventId: item.id,
                numeroTelephone: numTelephone,
                userId: currentUser?.uid,
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
    })
    navigation.navigate('EventDetails', {item: item})
  }

  const responsiveStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f8f8f8', // Couleur de fond générale
      paddingHorizontal: width * 0.05, // 5% de la largeur de l'écran
      paddingTop: height * 0.02, // 2% de la hauteur de l'écran
    },
    header: {
      marginBottom: height * 0.02,
    },
    searchBar: {
      marginBottom: height * 0.02,
    },
    selectAllContainer: {
      paddingVertical: height * 0.02,
    },
    selectAllText: {
      fontWeight: 'bold',
      fontSize: width * 0.04, // Taille de police relative à la largeur
    },
    contactRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: height * 0.01,
    },
    checkBox: {
      marginRight: width * 0.02,
    },
    spinner: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    scrollViewContent: {
      paddingBottom: height * 0.1, // Espace pour éviter les chevauchements
    },
    bottomButtonContainer: {
      paddingHorizontal: width * 0.05,
      paddingVertical: height * 0.02,
      backgroundColor: '#fff',
      borderTopWidth: 1,
      borderTopColor: '#ddd',
    },
    buttonContainer: {
      flex: 1,
    },
  });
  

  return (
    <SafeAreaView style={responsiveStyles.container}>
  <BacktoHome textRoute={t('InvitationsContacts.title')} />
  <Header>{t('InvitationsContacts.title')}</Header>
  <SearchBar
    searchPlaceholder={searchPlaceholder}
    onChangeText={(text) => search(text)}
  />
  <View style={responsiveStyles.selectAllContainer}>
    <TouchableOpacity onPress={() => checkedAllContacts(contacts, checked)}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        {checked ? (
          <Icon name="check-box" size={20} color={theme.colors.primary} style={responsiveStyles.checkBox} />
        ) : (
          <Icon name="check-box-outline-blank" size={20} color={theme.colors.black} style={responsiveStyles.checkBox} />
        )}
        <Text
          style={[
            responsiveStyles.selectAllText,
            {color: checked ? theme.colors.primary : theme.colors.black},
          ]}>
          {t('Global.AllSelect')}
        </Text>
      </View>
    </TouchableOpacity>
  </View>
  {loading ? (
    <View style={responsiveStyles.spinner}>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  ) : (
    <ScrollView
      contentContainerStyle={responsiveStyles.scrollViewContent}
      keyboardShouldPersistTaps="handled">
      {contacts.map((contact, index) => (
        <View key={index} style={responsiveStyles.contactRow}>
          <TouchableOpacity
            onPress={() => handleChecked(contact, index, contact.recordID, contact.checked, recordChecked)}
            style={responsiveStyles.checkBox}>
            <Icon
              name={contact.checked ? 'check-box' : 'check-box-outline-blank'}
              size={20}
              color={contact.checked ? theme.colors.primary : theme.colors.black}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleChecked(contact, index, contact.recordID, contact.checked, recordChecked)}
            style={{flex: 1}}>
            <Contact
              contact={contact}
              color={contact.checked ? theme.colors.primary : theme.colors.black}
            />
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  )}
  <View style={responsiveStyles.bottomButtonContainer}>
    <Button mode="contained" onPress={inviteContact}>
      {t('InvitationsContacts.Invitee')}
    </Button>
  </View>
</SafeAreaView>

  )
}
