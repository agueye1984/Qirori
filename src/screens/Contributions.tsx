import React, {useEffect, useState} from 'react';
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import DefaultComponentsThemes from '../defaultComponentsThemes';
import {useTranslation} from 'react-i18next';
import Header from '../components/Header';
import {Invitation, User, Event} from '../contexts/types';
import {BacktoHome} from '../components/BacktoHome';
import {ContributionItem} from '../components/ContributionItem';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export const Contributions = () => {
  const defaultStyles = DefaultComponentsThemes();
  const {t} = useTranslation();
  const [telephone, setTelephone] = useState('');
  const [invitations, setInvitations] = useState<Invitation[]>([]);

  useEffect(() => {
    const usersRef = firestore().collection('users');
    auth().onAuthStateChanged(user => {
      if (user) {
        usersRef
          .doc(user.uid)
          .get()
          .then(document => {
            const userData = document.data() as User;
            setTelephone(userData.phoneNumber);
          })
          .catch(error => {
            console.log('error1 ' + error);
          });
      }
    });
  }, []);

  useEffect(() => {
    const getTodayInTimezone = () => {
      const today = new Date();
      // Obtenir le décalage en minutes du fuseau horaire local
      const timezoneOffset = today.getTimezoneOffset(); // Décalage en minutes
      // Ajuster l'heure pour le fuseau local
      const localDate = new Date(today.getTime() - timezoneOffset * 60 * 1000);
      return localDate.toISOString().split('T')[0].replace(/-/g, ''); // 'YYYYMMDD'
    };
    const formattedToday = getTodayInTimezone();
    const fetchInvitations = async () => {
      try {
        const invitationSnapshot = await firestore()
          .collection('invitations')
          .where('numeroTelephone', '==', telephone)
          .where('closeDonation', '==', false)
          .get();

        if (invitationSnapshot.empty) {
          setInvitations([]);
          return;
        }

        const invitations: Invitation[] = [];
        const eventIds = new Set<string>();

        invitationSnapshot.forEach(doc => {
          const inviteData = doc.data() as Invitation;
          inviteData.id = doc.id; // Ajouter l'id du document
          invitations.push(inviteData);
          eventIds.add(inviteData.eventId); // Collecter les eventIds
        });
        console.log(invitations)
        const eventPromises = Array.from(eventIds).map(eventId =>
          firestore().collection('events').doc(eventId).get(),
        );

        const eventSnapshots = await Promise.all(eventPromises);
        const validEvents = eventSnapshots
          .map(eventDoc => {
            const eventData = eventDoc.data() as Event;
            return eventData && eventData.dateDebut >= formattedToday
              ? eventData.id
              : null;
          })
          .filter(id => id !== null);

        // Filtrer les invitations correspondant aux événements valides
        const filteredInvitations = invitations.filter(invite =>
          validEvents.includes(invite.eventId),
        );

        setInvitations(filteredInvitations);
      } catch (error) {
        console.error('Error fetching invitations or events:', error);
      }
    };

    fetchInvitations();
  }, [telephone]);

  console.log(invitations)

  const styles = StyleSheet.create({
    container: {
      flex: 1, // Prend tout l'espace disponible
      paddingTop: 20,
    },
    addEventButtonContainer: {
      alignItems: 'center',
      marginVertical: 15,
    },
    flatListContainer: {
      paddingBottom: 20,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <BacktoHome textRoute={t('HomeScreen.title')} />
      <Header>{t('Contributions.title')}</Header>
      <View style={styles.addEventButtonContainer}>
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
      </View>
      <FlatList
        data={invitations}
        renderItem={({item}) => <ContributionItem item={item} />}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.flatListContainer}
      />
    </SafeAreaView>
  );
};
