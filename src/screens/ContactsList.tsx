import React, { useState } from 'react'
import { ActivityIndicator, Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import DefaultComponentsThemes from '../defaultComponentsThemes'
import { useTheme } from '../contexts/theme'
import { useTranslation } from 'react-i18next'
import Header from '../components/Header'
import { useNavigation } from '@react-navigation/native'
import { BacktoHome } from '../components/BacktoHome'
import { useStore } from '../contexts/store'
import { EventItem } from '../components/EventItem'
import { Event } from '../contexts/types'
import Paragraph from '../components/Paragraph'
import { EmptyList } from '../components/EmptyList'
import { SearchBar } from '../components/SearchBar'
import Contacts from "react-native-contacts";
import Contact from '../components/Contact'


export const ContactsList = () => {
  const contact: any[] =[];
  const { t } = useTranslation()
  const [state] = useStore()
  const navigation = useNavigation()
  const [contacts, setContacts] = useState(contact) 
  const [loading, setLoading] = useState(true)
  const [searchPlaceholder, setSearchPlaceholder] = useState(t('AddEvent.Search'))

  const loadContacts = () => {
    Contacts.getAll()
      .then(contacts => {
        setContacts(contacts)
        setLoading(false)
      })
      .catch(e => {
        setLoading(false)
      });

    Contacts.getCount().then(count => {
      setSearchPlaceholder(t('AddEvent.Search')+' '+{count}+' contacts')
    });

    Contacts.checkPermission();
  }

  const search= (text: string) => {
    const phoneNumberRegex = /\b[\+]?[(]?[0-9]{2,6}[)]?[-\s\.]?[-\s\/\.0-9]{3,15}\b/m;
    const emailAddressRegex = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;
    if (text === "" || text === null) {
      loadContacts();
    } else if (phoneNumberRegex.test(text)) {
      Contacts.getContactsByPhoneNumber(text).then(contacts => {
        setContacts(contacts)
      });
    } else if (emailAddressRegex.test(text)) {
      Contacts.getContactsByEmailAddress(text).then(contacts => {
        setContacts(contacts)
      });
    } else {
      Contacts.getContactsMatchingString(text).then(contacts => {
        setContacts(contacts)
      });
    }
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1
    },
    spinner: {
      flex: 1,
      flexDirection: 'column',
      alignContent: "center",
      justifyContent: "center"
    },
    inputStyle: {
      height: 40,
      borderColor: 'gray',
      borderWidth: 1,
      textAlign: "center"
    }
  });
  


  return (
    <SafeAreaView>
      <BacktoHome textRoute={t('InvitationsContacts.title')} />
      <Header>{t('InvitationsContacts.title')}</Header>
      <SearchBar searchPlaceholder='Search' onChangeText={text => search(text)} />
      {loading ? 
        (
          <View style={styles.spinner}>
                <ActivityIndicator size="large" color="#0000ff" />
              </View>
        )
        :
        (
          <ScrollView style={{ flex: 1 }}>
                {contacts.map(contact => {
                  return (
                    <Contact contact={contact}/>
                  );
                })}
              </ScrollView>
        )
      
      }
    
    
    </SafeAreaView>
  )
}
