import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import DefaultComponentsThemes from '../defaultComponentsThemes';
import { useTheme } from '../contexts/theme';
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
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export const Invitations = () => {
  const defaultStyles = DefaultComponentsThemes();
  const { ColorPallet } = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation()
  const [state] = useStore();
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
      .where('reponse', '==', '')
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
