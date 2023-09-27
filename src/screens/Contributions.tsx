import React, { useState } from 'react'
import {Image, SafeAreaView, ScrollView, StyleSheet, Text, View} from 'react-native'
import DefaultComponentsThemes from '../defaultComponentsThemes'
import { useTranslation } from 'react-i18next'
import Header from '../components/Header'
import { useStore } from '../contexts/store'
import { LocalStorageKeys } from '../constants'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Invitation, User } from '../contexts/types'
import { BacktoHome } from '../components/BacktoHome'
import { ContributionItem } from '../components/ContributionItem'


export const Contributions = () => {
  const defaultStyles = DefaultComponentsThemes();
  const { t } = useTranslation();
  const [state] = useStore();
  const [userId, setUserId] = useState('')

  AsyncStorage.getItem(LocalStorageKeys.UserId)
    .then((result) => {
      if (result != null) {
        setUserId(result);
      }
    })
    .catch(error => console.log(error))

  const users = state.user.find((user) => user.id === userId) as User;
  let invitations: Invitation[] = [];
  if(users){
    const telephone = users.telephone
    //invitations = state.invitations.filter((invitation) => invitation.numeroTelephone === telephone && invitation.closeDonation) as Invitation[]
    invitations =  state.invitations.filter((invitation) => (invitation.numeroTelephone == telephone && invitation.closeDonation==false));
    console.log(invitations);
  }

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
