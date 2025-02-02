import React, {useEffect, useState} from 'react';
import {Dimensions, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Event, Invitation, ManageEventsParamList, TypeEvent} from '../contexts/types';
import {DateEvent} from './DateEvent';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {useTranslation} from 'react-i18next';
import {theme} from '../core/theme';
import { getRecordById } from '../services/FirestoreServices';
import { parseDateTime } from '../services/EventsServices';

type Props = {
  item: Invitation;
};

type ContributionsDetailsProp = StackNavigationProp<
  ManageEventsParamList,
  'ContributionsDetails'
>;

export const ContributionItem = ({item}: Props) => {
  const {i18n, t} = useTranslation();
  const {navigate} = useNavigation<ContributionsDetailsProp>();
  const [event, setEvent] = useState<Event>();
  const [nameEvent, setNameEvent] = useState<string>('');
  const { width } = Dimensions.get('window');
  const selectedLanguageCode = i18n.language;
  let languageDate = '';
  if (selectedLanguageCode === 'fr') {
    languageDate = 'fr-fr';
  }
  if (selectedLanguageCode === 'en') {
    languageDate = 'en-GB';
  }

  useEffect(() => {
    const fetchEvent = async () => {
      const event = (await getRecordById(
        'events',
        item.eventId,
      )) as Event;
      setEvent(event);
    }
    
    fetchEvent();
  }, [item.eventId]);

  useEffect(() => {
    const fetchTypeEvent = async () => {
      const typeEvent = (await getRecordById(
        'type_events',
        event?.name,
      )) as TypeEvent;
      const name =
            selectedLanguageCode === 'en' ? typeEvent.nameEn : typeEvent.nameFr;
      setNameEvent(name)
    }
    if(event!==undefined){
      fetchTypeEvent();
    }
  }, [event?.name,selectedLanguageCode]);


  const dateDebut = parseDateTime(event === undefined ? '' : event.dateDebut, event === undefined ? '' : event.heureDebut);
  const heureFormatDebut = dateDebut.toLocaleTimeString(languageDate, {
    hour: 'numeric',
    minute: 'numeric',
    hourCycle: 'h24',
  });
  const dateFin = parseDateTime(event === undefined ? '' : event.dateFin, event === undefined ? '' : event.heureFin);
  const heureFormatFin = dateFin.toLocaleTimeString(languageDate, {
    hour: 'numeric',
    minute: 'numeric',
    hourCycle: 'h24',
  });

  const handleEventSelection = (item: Invitation) => {
    navigate('ContributionsDetails', {item: item});
  };

  const styles = StyleSheet.create({
    itemContainer: {
      height: 70,
      marginHorizontal: 15,
      borderWidth: 0.3,
      flex: 1,
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
      borderBottomRightRadius: 10,
      borderBottomLeftRadius: 10,
      backgroundColor: 'white',
    },
    touchableStyle: {
      flexDirection: 'row',
      flex: 1,
      alignItems: 'center',
      justifyContent: 'space-between',
      height: '100%',
      width: '100%',
    },
    image: {
      width: 35,
      height: 35,
      marginBottom: 10,
    },
    row: {
      flexDirection: 'row',
      flex: 1,
    },
    eventItemContainer: {
      marginVertical: 10,
      padding: 15,
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 8,
      backgroundColor: '#f9f9f9',
      // Ajoutez ces styles pour l'espacement
      marginHorizontal: 10, // Assure un espacement des côtés gauche/droit
    },
    eventContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    dateContainer: {
      flex: 1,
    },
    detailsContainer: {
      flex: 3,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginLeft: 15,
    },
    textContainer: {
      flex: 1,
    },
    eventTitle: {
      fontSize: width > 400 ? 18 : 16, // Dynamically adjust font size based on screen width
      fontWeight: 'bold',
      color: '#333',
      marginBottom: 5,
    },
    eventTime: {
      fontSize: 14,
      color: '#666',
    },
    iconContainer: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    eventAdress: {
      fontSize: width > 400 ? 14 : 12, // Dynamically adjust font size based on screen width
      fontWeight: 'bold',
      color: '#333',
      marginBottom: 5,
    },
  });

  return (
    <View style={styles.eventItemContainer}>
      <TouchableOpacity onPress={() => handleEventSelection(item)}>
        <View style={styles.eventContent}>
        <View style={styles.dateContainer}>
            <DateEvent dateDebut={event === undefined ? '0' : event.dateDebut} flexSize={0.23} />
          </View>
          <View style={styles.detailsContainer}>
            <View style={styles.textContainer}>
              <Text style={styles.eventTitle}>{nameEvent}</Text>
              <Text style={styles.eventTime}>
                {t('Global.from')} {heureFormatDebut} {t('Global.to')} {heureFormatFin}
              </Text>
              <Text style={styles.eventAdress}>{event?.localisation.description}</Text>
            </View>
            <View style={styles.iconContainer}>
              <Icon
                name="angle-right"
                size={20}
                color={theme.colors.primaryText}
              />
            </View>
          </View>
        </View>
        
      </TouchableOpacity>
    </View>
  );
};
