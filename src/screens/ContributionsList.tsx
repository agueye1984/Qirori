import React, {useEffect, useState} from 'react'
import {FlatList, SafeAreaView, StyleSheet, Text, View} from 'react-native'
import DefaultComponentsThemes from '../defaultComponentsThemes'
import {useTranslation} from 'react-i18next'
import Header from '../components/Header'
import {Contribution, Event} from '../contexts/types'
import {BacktoHome} from '../components/BacktoHome'
import auth from '@react-native-firebase/auth'
import ContributionItemList from '../components/ContributionItemList'
import firestore from '@react-native-firebase/firestore';

export const ContributionsList = () => {
  const currentUser = auth().currentUser
  const defaultStyles = DefaultComponentsThemes()
  const {t} = useTranslation()
  const [contributions, setContributions] = useState<any[]>([]);

  useEffect(() => {
    const fetchContributions = async () => {
      try {
        const contributionSnapshot = await firestore()
          .collection('contributions')
          .get();
        if (contributionSnapshot.empty) {
          setContributions([]);
          return;
        }
  
        const contributions: Contribution[] = [];
        const eventIds = new Set<string>();
  
        contributionSnapshot.forEach(doc => {
          const inviteData = doc.data() as Contribution;
          inviteData.id = doc.id; // Ajouter l'id du document
          contributions.push(inviteData);
          eventIds.add(inviteData.eventId); // Collecter les eventIds
        });
  
        const eventPromises = Array.from(eventIds).map(eventId =>
          firestore().collection('events').doc(eventId).get()
        );
  
        const eventSnapshots = await Promise.all(eventPromises);
        const validEvents = eventSnapshots
          .map(eventDoc => {
            const eventData = eventDoc.data() as Event;
            return eventData && eventData.userId == currentUser?.uid ? eventData.id : null;
          })
          .filter(id => id !== null);
  
        // Filtrer les contributions correspondant aux événements valides
        const filteredContributions = contributions.filter(donation =>
          validEvents.includes(donation.eventId)
        );
  
        setContributions(filteredContributions);
      } catch (error) {
        console.error('Error fetching invitations or events:', error);
      }
    };
  
    fetchContributions();
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
      <Header>{t('ContributionsList.title')}</Header>
      <View style={styles.addEventButtonContainer}>
        {contributions.length === 0 && (
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
        data={contributions}
        renderItem={({item}) => <ContributionItemList item={item} />}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.flatListContainer}
      />
    </SafeAreaView>
  );
}
