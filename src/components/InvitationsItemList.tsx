import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Image, Pressable, ScrollView} from 'react-native';
import storage from '@react-native-firebase/storage';
import {
  Event,
  Invitation,
  ManageEventsParamList,
  Offre,
  Service,
  TypeEvent,
  User,
} from '../contexts/types';
import {useTranslation} from 'react-i18next';
import {Swipeable} from 'react-native-gesture-handler';
import {useTheme} from '../contexts/theme';
import Icon from 'react-native-vector-icons/FontAwesome';
import {StackNavigationProp} from '@react-navigation/stack';
import {useNavigation} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import {CategoryList} from './CategoryList';

type Props = {
  event: Event;
  color: string;
};

const InvitationsItemList = ({event, color}: Props) => {
  const {t,i18n} = useTranslation();
  const {ColorPallet} = useTheme();
  const [users, setUsers] = useState<User[]>([]);
  const [invitations, setInvitations] = useState<any[]>([]);
  const [typeEvents, setTypeEvents] = useState<TypeEvent[]>([]);
  const selectedLanguageCode = i18n.language;
  let invitationList = {
    eventName: '',
    userName: '',
    presence: '',
    nbrPerson: 0,
  };

  useEffect(() => {
    firestore()
      .collection('users')
      .get()
      .then(querySnapshot => {
        const user: User[] = [];
        querySnapshot.forEach(documentSnapshot => {
          user.push(documentSnapshot.data() as User);
        });
        setUsers(user);
      });
  }, []);

  useEffect(() => {
    firestore()
    .collection('type_events')
    .get()
    .then(querySnapshot => {
      const events: TypeEvent[] = [];
      querySnapshot.forEach(documentSnapshot => {
        events.push(documentSnapshot.data() as TypeEvent);
      });
      setTypeEvents(events);
    });
  }, []);

  useEffect(() => {
    firestore()
      .collection('invitations')
      // Filter results
      .where('eventId', '==', event.id)
      .get()
      .then(querySnapshot => {
        const invitation: any[] = [];
        querySnapshot.forEach(documentSnapshot => {
          const invite = documentSnapshot.data() as Invitation;
          const user = users.find(e => e.id === invite.userId);
          const userName = user === undefined ? '' : user.displayName;
          let presence = invite.reponse;
          const nbEnfants =
            invite.nbrEnfants == undefined ? 0 : invite.nbrEnfants;
          const nbrPerson = invite.nbrAdultes + nbEnfants;
          if (invite.reponse == '') {
            presence = t('Events.Maybe');
          }
          const typeEvent = typeEvents.find(e => e.id === event.name);
          console.log(typeEvent)
          console.log(typeEvents)
          let nameEvent = typeEvent === undefined ? '' : typeEvent.nameFr;
          if (selectedLanguageCode === 'en') {
            nameEvent = typeEvent === undefined ? '' : typeEvent.nameEn;
          }
          invitationList = {
            eventName: nameEvent,
            userName: userName,
            presence: presence,
            nbrPerson: nbrPerson,
          };
          invitation.push(invitationList);
        });
        setInvitations(invitation);
        // console.log(donations);
      });
  }, [event, users, typeEvents]);

  const styles = StyleSheet.create({
    contactCon: {
      flex: 1,
      flexDirection: 'row',
      padding: 5,
      borderBottomWidth: 0.5,
      borderBottomColor: '#d9d9d9',
    },
    imgCon: {},
    placeholder: {
      width: 55,
      height: 55,
      borderRadius: 30,
      overflow: 'hidden',
      backgroundColor: '#d9d9d9',
      alignItems: 'center',
      justifyContent: 'center',
      color: color,
    },
    contactDat: {
      flex: 1,
      justifyContent: 'center',
      paddingLeft: 5,
    },
    txt: {
      fontSize: 16,
      color: color,
    },
    name: {
      fontSize: 16,
      color: ColorPallet.primary,
      fontWeight: 'bold',
    },
    phoneNumber: {
      color: '#888',
    },
    thumb: {
      height: 50,
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
      borderBottomLeftRadius: 16,
      borderBottomRightRadius: 16,
      width: 50,
    },
    deleteContainer: {
      marginVertical: 5,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
      paddingHorizontal: 34,
      backgroundColor: ColorPallet.error,
    },
    editContainer: {
      marginVertical: 5,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
      paddingHorizontal: 34,
      backgroundColor: ColorPallet.primary,
    },
  });
  return (
    <ScrollView style={{padding: 10}} scrollEnabled>
  {invitations.map((invitation: any, index: number) => {
      return (
        <View style={styles.contactCon} key={index.toString()}>
          <View style={styles.contactDat}>
            <View style={{flexDirection: 'row'}}>
              <Text style={styles.name}>
                {t('InvitationsList.eventTitle')} :{' '}
              </Text>
              <Text style={styles.txt}>{invitation.eventName} </Text>
              <Text style={styles.name}>
                {t('InvitationsList.userTitle')} :{' '}
              </Text>
              <Text style={styles.txt}>{invitation.userName} </Text>
            </View>
            <View style={{flexDirection: 'row'}}>
              <Text style={styles.name}>
                {t('InvitationsList.presenceTitle')} :{' '}
              </Text>
              <Text style={styles.txt}>{invitation.presence} </Text>
              <Text style={styles.name}>
                {t('InvitationsList.nbrPersonTitle')} :{' '}
              </Text>
              <Text style={styles.txt}>{invitation.nbrPerson} </Text>
            </View>
          </View>
        </View>
      );
    })
  }
  </ScrollView>
  );
};

export default InvitationsItemList;
