import React, {useEffect, useState} from 'react';
import {FlatList, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import DefaultComponentsThemes from '../defaultComponentsThemes';
import {useTranslation} from 'react-i18next';
import Header from '../components/Header';
import {Event, Invitation} from '../contexts/types';
import {BacktoHome} from '../components/BacktoHome';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import InvitationsItemList from '../components/InvitationsItemList';

export const InvitationsList = () => {
  const defaultStyles = DefaultComponentsThemes();
  const {t} = useTranslation();
  const currentUser = auth().currentUser;
  const [invitations, setInvitations] = useState<any[]>([]);

  useEffect(() => {
    const fetchInvitations = async () => {
      try {
        const invitationSnapshot = await firestore()
          .collection('invitations')
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

        const eventPromises = Array.from(eventIds).map(eventId =>
          firestore().collection('events').doc(eventId).get(),
        );

        const eventSnapshots = await Promise.all(eventPromises);
        const validEvents = eventSnapshots
          .map(eventDoc => {
            const eventData = eventDoc.data() as Event;
            return eventData && eventData.userId == currentUser?.uid
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
  }, [currentUser?.uid]);

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
      <BacktoHome textRoute={t('Settings.title')} />
      <Header>{t('InvitationsList.title')}</Header>
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
            {t('Invitations.EmptyList')}
          </Text>
        )}
      </View>
      <FlatList
        data={invitations}
        renderItem={({item}) => <InvitationsItemList item={item} />}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.flatListContainer}
      />
    </SafeAreaView>
  );
};
