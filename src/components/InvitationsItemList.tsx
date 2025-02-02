import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';
import {Event, TypeEvent, User} from '../contexts/types';
import {useTranslation} from 'react-i18next';
import {useTheme} from '../contexts/theme';
import {DateEvent} from './DateEvent';
import {getRecordById} from '../services/FirestoreServices';
import {parseDateTime} from '../services/EventsServices';

type Props = {
  item: any;
};

const InvitationsItemList = ({item}: Props) => {
  const {t, i18n} = useTranslation();
  const {ColorPallet} = useTheme();
  const [event, setEvent] = useState<Event>();
  const [nameEvent, setNameEvent] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  let presence = item.reponse;
  const nbEnfants = item.nbrEnfants == undefined ? 0 : item.nbrEnfants;
  const nbrPerson = item.nbrAdultes + nbEnfants;
  if (item.reponse == '') {
    presence = t('Events.Maybe');
  }
  const {width} = Dimensions.get('window');
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
      const evt = (await getRecordById('events', item.eventId)) as Event;
      setEvent(evt);
    };

    fetchEvent();
  }, [item.eventId]);

  useEffect(() => {
    const fetchUser = async () => {
      const user = (await getRecordById('users', item.userId)) as User;
      setUserName(user.displayName);
    };

    fetchUser();
  }, [item.userId]);

  useEffect(() => {
    const fetchTypeEvent = async () => {
      const typeEvent = (await getRecordById(
        'type_events',
        event?.name,
      )) as TypeEvent;
      const name =
        selectedLanguageCode === 'en' ? typeEvent.nameEn : typeEvent.nameFr;
      setNameEvent(name);
    };
    if (event !== undefined) {
      fetchTypeEvent();
    }
  }, [event?.name, selectedLanguageCode]);

  const dateDebut = parseDateTime(
    event === undefined ? '' : event.dateDebut,
    event === undefined ? '' : event.heureDebut,
  );
  const heureFormatDebut = dateDebut.toLocaleTimeString(languageDate, {
    hour: 'numeric',
    minute: 'numeric',
    hourCycle: 'h24',
  });

  const dateFin = parseDateTime(
    event === undefined ? '' : event.dateFin,
    event === undefined ? '' : event.heureFin,
  );
  const heureFormatFin = dateFin.toLocaleTimeString(languageDate, {
    hour: 'numeric',
    minute: 'numeric',
    hourCycle: 'h24',
  });

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
      // color: color,
    },
    contactDat: {
      flex: 1,
      justifyContent: 'center',
      paddingLeft: 5,
    },
    txt: {
      fontSize: 16,
      //  color: color,
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
  });

  return (
    <View style={styles.eventItemContainer}>
      <View style={styles.eventContent}>
        <View style={styles.dateContainer}>
          <DateEvent
            dateDebut={event === undefined ? '0' : event.dateDebut}
            flexSize={0.23}
          />
        </View>
        <View style={styles.detailsContainer}>
          <View style={styles.textContainer}>
            <Text style={styles.eventTitle}>{nameEvent}</Text>
            <Text style={styles.eventTime}>
              {t('Global.from')} {heureFormatDebut} {t('Global.to')}{' '}
              {heureFormatFin}
            </Text>
            <Text style={styles.eventTitle}>{}</Text>
            <Text style={styles.txt}>
              <Text style={[styles.txt, {fontWeight: 'bold'}]}>
                {t('InvitationsList.userTitle')}:
              </Text>{' '}
              {userName}
            </Text>
            <Text style={styles.txt}>
              <Text style={[styles.txt, {fontWeight: 'bold'}]}>
                {t('InvitationsList.presenceTitle')}:
              </Text>{' '}
              {presence}
            </Text>
            <Text style={styles.txt}>
              <Text style={[styles.txt, {fontWeight: 'bold'}]}>
                {t('InvitationsList.nbrPersonTitle')}:
              </Text>{' '}
              {nbrPerson}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default InvitationsItemList;
