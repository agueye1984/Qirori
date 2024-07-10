import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Event, Invitation, ManageEventsParamList, TypeEvent} from '../contexts/types';
import DefaultComponentsThemes from '../defaultComponentsThemes';
import {DateEvent} from './DateEvent';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {useTranslation} from 'react-i18next';
import {theme} from '../core/theme';
import firestore from '@react-native-firebase/firestore';

type Props = {
  item: Invitation;
};

type ContributionsDetailsProp = StackNavigationProp<
  ManageEventsParamList,
  'ContributionsDetails'
>;

export const ContributionItem = ({item}: Props) => {
  const {i18n, t} = useTranslation();
  const defaultStyles = DefaultComponentsThemes();
  const {navigate} = useNavigation<ContributionsDetailsProp>();
  const [event, setEvent] = useState<Event>();
  const [events, setEvents] = useState<Event[]>([]);
  const [typeEvents, setTypeEvents] = useState<TypeEvent[]>([]);
  const selectedLanguageCode = i18n.language;
  let languageDate = '';
  if (selectedLanguageCode === 'fr') {
    languageDate = 'fr-fr';
  }
  if (selectedLanguageCode === 'en') {
    languageDate = 'en-GB';
  }

  useEffect(() => {
    firestore()
      .collection('events')
      // Filter results
      .get()
      .then(querySnapshot => {
        const ev: Event[]=[];
        querySnapshot.forEach(documentSnapshot => {
          ev.push(documentSnapshot.data() as Event);
        });
        setEvents(ev);
      });
  }, [events]);

  useEffect(() => {
    const even = events.find(e => e.id === item.eventId)
    setEvent(even);
  }, [events,item.eventId]);

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
const eventName = event==undefined ? '' : event.name;
  const typeEvent = typeEvents.find(e => e.id === eventName);
  let nameEvent = typeEvent === undefined ? '' : typeEvent.nameFr;
  if (selectedLanguageCode === 'en') {
    nameEvent = typeEvent === undefined ? '' : typeEvent.nameEn;
  }

  const anneeDebut = parseInt(
    event === undefined ? '0' : event.dateDebut.substring(0, 4),
  );
  const moisDebut =
    parseInt(event === undefined ? '0' : event.dateDebut.substring(4, 6)) - 1;
  const jourDebut = parseInt(
    event === undefined ? '0' : event.dateDebut.substring(6, 8),
  );
  const heureDebut = parseInt(
    event === undefined ? '0' : event.heureDebut.substring(0, 2),
  );
  const minutesDebut = parseInt(
    event === undefined ? '0' : event.heureDebut.substring(2, 4),
  );
  const dateDebut = new Date(
    anneeDebut,
    moisDebut,
    jourDebut,
    heureDebut,
    minutesDebut,
    0,
  );
  const heureFormatDebut = dateDebut.toLocaleTimeString(languageDate, {
    hour: 'numeric',
    minute: 'numeric',
    hourCycle: 'h24',
  });
  const anneeFin = parseInt(
    event === undefined ? '0' : event.dateFin.substring(0, 4),
  );
  const moisFin =
    parseInt(event === undefined ? '0' : event.dateFin.substring(4, 6)) - 1;
  const jourFin = parseInt(
    event === undefined ? '0' : event.dateFin.substring(6, 8),
  );
  const heureFin = parseInt(
    event === undefined ? '0' : event.heureFin.substring(0, 2),
  );
  const minutesFin = parseInt(
    event === undefined ? '0' : event.heureFin.substring(2, 4),
  );
  const dateFin = new Date(anneeFin, moisFin, jourFin, heureFin, minutesFin, 0);
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
  });

  let content = (
    <View style={[{marginVertical: 15}]}>
      <TouchableOpacity onPress={() => handleEventSelection(item)}>
        <View style={[styles.itemContainer]}>
          <View style={styles.row}>
            <DateEvent
              dateDebut={event === undefined ? '0' : event.dateDebut}
              flexSize={0.23}
            />
            <View style={styles.row}>
              <View style={[defaultStyles.leftSectRowContainer]}>
                <View
                  style={{
                    flexDirection: 'column',
                    flex: 4,
                    marginHorizontal: 15,
                    marginVertical: 15,
                  }}>
                  <View style={{width: 250}}>
                    <Text
                      style={[
                        defaultStyles.text,
                        {fontWeight: 'bold', fontSize: 20},
                      ]}>
                      {nameEvent}
                    </Text>
                  </View>
                  <View style={{width: 250}}>
                    <Text>
                      {t('Global.from')} {heureFormatDebut} {t('Global.to')}{' '}
                      {heureFormatFin}
                    </Text>
                  </View>
                </View>
              </View>
              <View
                style={[
                  defaultStyles.rightSectRowContainer,
                  {
                    marginHorizontal: 15,
                    marginVertical: 15,
                    alignItems: 'center',
                  },
                ]}>
                <Icon
                  name="angle-right"
                  size={20}
                  color={theme.colors.primaryText}
                />
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );

  return content;
};
