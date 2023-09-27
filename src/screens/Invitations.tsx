import React, { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import DefaultComponentsThemes from '../defaultComponentsThemes';
import { useTheme } from '../contexts/theme';
SafeAreaView;
import { useTranslation } from 'react-i18next';
import Header from '../components/Header';
import { StackNavigationProp } from '@react-navigation/stack';
import { Invitation, ManageEventsParamList, User } from '../contexts/types';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useStore } from '../contexts/store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LocalStorageKeys } from '../constants';
import { BacktoHome } from '../components/BacktoHome';
import { EmptyList } from '../components/EmptyList';
import { EventItem } from '../components/EventItem';
import { InvitationItem } from '../components/InvitationItem';
import { SafeAreaView } from 'react-native-safe-area-context';


export const Invitations = () => {
  const defaultStyles = DefaultComponentsThemes();
  const { ColorPallet } = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation()
  const [state] = useStore();
  const [userId, setUserId] = useState('')

  useEffect(() => {
  AsyncStorage.getItem(LocalStorageKeys.UserId)
    .then((result) => {
      if (result != null) {
        setUserId(result);
      }
    })
    .catch(error => console.log(error))
  }, [userId])
  const users = state.user.find((user) => user.id === userId) as User;
  let invitations: Invitation[] = [];
  if(users){
    const telephone = users.telephone
    invitations = state.invitations.filter((invitation) => invitation.numeroTelephone === telephone) as Invitation[]
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
    <Header>{t('Invitations.title')}</Header>
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
        {t('Invitations.EmptyList')}
      </Text>
      )}
      <ScrollView style={{ padding: 10 }}>
        {invitations.map((item: Invitation, index: number) => {
          return <InvitationItem key={index.toString()} item={item} />
        })}
      </ScrollView>
    </View>
  </SafeAreaView>
  )
}
