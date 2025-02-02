import React, {useEffect, useState} from 'react';
import {FlatList, SafeAreaView, StyleSheet, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import Header from '../components/Header';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {
  ManageEventsParamList,
  ProdServEvent,
  Event,
  TypeEvent,
} from '../contexts/types';
import {theme} from '../core/theme';
import firestore from '@react-native-firebase/firestore';
import {LargeButton} from '../components/LargeButton';
import Paragraph from '../components/Paragraph';
import ProdServEventLists from '../components/ProdServEventLists';
import {StackNavigationProp} from '@react-navigation/stack';
import {BacktoHome} from '../components/BacktoHome';
import {getRecordById} from '../services/FirestoreServices';

type AddProdServEventProps = StackNavigationProp<
  ManageEventsParamList,
  'AddProdServEvent'
>;

export const ProdServEvents = () => {
  const route = useRoute<RouteProp<ManageEventsParamList, 'ProdServEvents'>>();
  const eventId = route.params?.id || '';
  const {t, i18n} = useTranslation();
  const navigation = useNavigation<AddProdServEventProps>();
  const [prodServEvents, setProdServEvents] = useState<ProdServEvent[]>([]);
  const selectLanguage = i18n.language;
  const [eventName, setEventName] = useState<string>('');

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('prod_serv_events')
      .where('eventId', '==', eventId)
      .onSnapshot(querySnapshot => {
        if (querySnapshot.empty) {
          setProdServEvents([]);
        } else {
          const prodServEvent: ProdServEvent[] = [];
          querySnapshot.forEach(documentSnapshot => {
            prodServEvent.push(documentSnapshot.data() as ProdServEvent);
          });
          setProdServEvents(prodServEvent);
        }
      });

    // Nettoyage de l'écouteur lors du démontage du composant
    return () => unsubscribe();
  }, [eventId]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const event = (await getRecordById('events', eventId)) as Event;
        const typeEvent = (await getRecordById(
          'type_events',
          event.name,
        )) as TypeEvent;
        let evenName = typeEvent.nameFr;
        if (selectLanguage === 'en') {
          evenName = typeEvent.nameEn;
        }
        setEventName(evenName);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [eventId]);

  const styles = StyleSheet.create({
    container: {
      flex: 1, // Prend tout l'espace disponible
      paddingTop: 20,
    },
    buttonsContainer: {
      paddingBottom: 50,
      paddingTop: 50,
    },
  });

  return (
    <SafeAreaView style={[styles.container]}>
      <BacktoHome textRoute={eventName} />
      <Header>{t('AddProdServ.title')}</Header>

      <View style={{flex: 1, justifyContent: 'center', alignContent: 'center'}}>
        <LargeButton
          isPrimary
          title={t('AddProdServ.Add')}
          action={() =>
            navigation.navigate('AddProdServEvent', {
              isEditing: false,
              id: eventId,
            })
          }
        />
        <Header>{t('AddProdServ.List')}</Header>

        {prodServEvents.length === 0 && (
          <Paragraph>{t('AddProdServ.EmptyList')}</Paragraph>
        )}
        <FlatList
          data={prodServEvents}
          renderItem={({item}) => (
            <ProdServEventLists
              prodServEvent={item}
              color={theme.colors.black}
            />
          )}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={{padding: 10}}
        />
      </View>
    </SafeAreaView>
  );
};
