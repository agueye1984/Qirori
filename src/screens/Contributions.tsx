import React, { useEffect, useState } from 'react'
import {Image, SafeAreaView, ScrollView, StyleSheet, Text, View} from 'react-native'
import DefaultComponentsThemes from '../defaultComponentsThemes'
import { useTranslation } from 'react-i18next'
import Header from '../components/Header'
import { useStore } from '../contexts/store'
import { LocalStorageKeys } from '../constants'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Invitation, User } from '../contexts/types'
import { BacktoHome } from '../components/BacktoHome'
import { ContributionItem } from '../components/ContributionItem';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';


export const Contributions = () => {
  const defaultStyles = DefaultComponentsThemes();
  const { t } = useTranslation();
  const [state] = useStore();
  const [userId, setUserId] = useState('')
  const [telephone, setTelephone] = useState('')
  const [invitation, setInvitation] = useState<Invitation[]>([]);

  useEffect(() => {
    const usersRef = firestore().collection('users');
    auth().onAuthStateChanged(user => {
      if (user) {
        usersRef
        .doc(user.uid)
          .get()
          .then(document => {
            const userData = document.data() as User;
            setTelephone(userData.phone);
          })
          .catch(error => {
            console.log('error1 ' + error);
          });
      }
    });
  }, [])

  useEffect(() => {
    firestore()
      .collection('invitations')
      // Filter results
      .where('numeroTelephone', '==', telephone)
      .where('closeDonation', '==', false)
      .get()
      .then(querySnapshot => {
        if (querySnapshot.empty) {
          setInvitation([]);
        } else {
          const invitations: Invitation[] = [];
          querySnapshot.forEach(documentSnapshot => {
            invitations.push(documentSnapshot.data() as Invitation);
          });
          setInvitation(invitations);
        }
      });
  }, [invitation])
  const invitations = invitation;

 /* AsyncStorage.getItem(LocalStorageKeys.UserId)
    .then((result) => {
      if (result != null) {
        setUserId(result);
      }
    })
    .catch(error => console.log(error))

  const users = state.user.find((user) => user.id === userId) as User;
  let invitations: Invitation[] = [];
  if(users){
    const telephone = users.phone
    //invitations = state.invitations.filter((invitation) => invitation.numeroTelephone === telephone && invitation.closeDonation) as Invitation[]
    invitations =  state.invitations.filter((invitation) => (invitation.numeroTelephone == telephone && invitation.closeDonation==false));
  }*/

  const styles = StyleSheet.create({
    img: {
      width: '30%',
      resizeMode: 'contain',
      paddingRight: 50,
    },
    row: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
  })

  return (
    <SafeAreaView>
    <BacktoHome textRoute={t('HomeScreen.title')} />
    <Header>{t('Contributions.title')}</Header>
    <View style={{ justifyContent: 'center', alignContent: 'center' }}>
      {invitations.length === 0 && (
        <Text
        style={[
          defaultStyles.text,
          {
            marginVertical: 50,
            paddingHorizontal: 10,
            textAlign:'center',
          },
        ]}>
        {t('Contributions.EmptyList')}
      </Text>
      )}
      <ScrollView style={{ padding: 10 }}>
        {invitations.map((item: Invitation, index: number) => {
          return <ContributionItem key={index.toString()} item={item} />
        })}
      </ScrollView>
    </View>
  </SafeAreaView>
  )}
