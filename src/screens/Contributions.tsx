import React, {useEffect, useState} from 'react'
import {SafeAreaView, ScrollView, Text, View} from 'react-native'
import DefaultComponentsThemes from '../defaultComponentsThemes'
import {useTranslation} from 'react-i18next'
import Header from '../components/Header'
import {Invitation, User} from '../contexts/types'
import {BacktoHome} from '../components/BacktoHome'
import {ContributionItem} from '../components/ContributionItem'
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'

export const Contributions = () => {
  const defaultStyles = DefaultComponentsThemes()
  const {t} = useTranslation()
  const [telephone, setTelephone] = useState('')
  const [invitations, setInvitations] = useState<Invitation[]>([])

  useEffect(() => {
    const usersRef = firestore().collection('users')
    auth().onAuthStateChanged((user) => {
      if (user) {
        usersRef
          .doc(user.uid)
          .get()
          .then((document) => {
            const userData = document.data() as User
            setTelephone(userData.phoneNumber)
          })
          .catch((error) => {
            console.log('error1 ' + error)
          })
      }
    })
  }, [])

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('invitations')
      .where('numeroTelephone', '==', telephone)
      .where('closeDonation', '==', false)
      .onSnapshot((querySnapshot) => {
        if (querySnapshot.empty) {
          setInvitations([])
        } else {
          const newInvitations: Invitation[] = []
          querySnapshot.forEach((documentSnapshot) => {
            const invitationData = documentSnapshot.data() as Invitation
            invitationData.id = documentSnapshot.id // ajouter l'id du document
            newInvitations.push(invitationData)
          })
          setInvitations(newInvitations)
        }
      })
    // Nettoyage de l'écouteur lors du démontage du composant
    return () => unsubscribe()
  }, [telephone])

  return (
    <SafeAreaView>
      <BacktoHome textRoute={t('HomeScreen.title')} />
      <Header>{t('Contributions.title')}</Header>
      <View style={{justifyContent: 'center', alignContent: 'center'}}>
        {invitations.length === 0 && (
          <Text
            style={[
              defaultStyles.text,
              {
                marginVertical: 50,
                paddingHorizontal: 10,
                textAlign: 'center',
              },
            ]}>
            {t('Contributions.EmptyList')}
          </Text>
        )}
        <ScrollView
          scrollEnabled
          showsVerticalScrollIndicator
          automaticallyAdjustKeyboardInsets={true}
          keyboardShouldPersistTaps="handled">
          {invitations.map((item: Invitation, index: number) => {
            return <ContributionItem key={index.toString()} item={item} />
          })}
        </ScrollView>
      </View>
    </SafeAreaView>
  )
}
