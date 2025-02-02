import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Event, ManageEventsParamList, TypeEvent} from '../contexts/types';
import {DateEvent} from './DateEvent';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {useTranslation} from 'react-i18next';
import {theme} from '../core/theme';
import firestore from '@react-native-firebase/firestore';
import {parseDateTime} from '../services/EventsServices';

type Props = {
  item: Event;
};

type eventDetailsProp = StackNavigationProp<
  ManageEventsParamList,
  'EventDetails'
>;

export const EventItem = ({item}: Props) => {
  const {i18n, t} = useTranslation();
  const {navigate} = useNavigation<eventDetailsProp>();
  const [typeEventName, setTypeEventName] = useState<string>('');
  const {width} = Dimensions.get('window');

  const selectedLanguageCode = i18n.language;
  let languageDate = '';
  if (selectedLanguageCode === 'fr') {
    languageDate = 'fr-fr';
  }
  if (selectedLanguageCode === 'en') {
    languageDate = 'en-GB';
  }
  const dateDebut = parseDateTime(item.dateDebut, item.heureDebut);
  const heureFormatDebut = dateDebut.toLocaleTimeString(languageDate, {
    hour: 'numeric',
    minute: 'numeric',
    hourCycle: 'h24',
  });

  const dateFin = parseDateTime(item.dateFin, item.heureFin);
  const heureFormatFin = dateFin.toLocaleTimeString(languageDate, {
    hour: 'numeric',
    minute: 'numeric',
    hourCycle: 'h24',
  });

  useEffect(() => {
    const fetchTypeEvent = async () => {
      try {
        const querySnapshot = await firestore()
          .collection('type_events')
          .where('id', '==', item.name) // Filtrer directement dans la requête Firestore
          .get();

        if (!querySnapshot.empty) {
          const typeEvent = querySnapshot.docs[0].data() as TypeEvent; // Récupérer le premier document
          const name =
            selectedLanguageCode === 'en' ? typeEvent.nameEn : typeEvent.nameFr;
          setTypeEventName(name); // Stocker le nom directement
        } else {
          setTypeEventName(''); // Si aucun résultat trouvé
        }
      } catch (error) {
        console.error('Error fetching type event:', error);
        setTypeEventName(''); // Gérer les erreurs
      }
    };

    fetchTypeEvent();
  }, [item.name, selectedLanguageCode]);

  const handleEventSelection = (item: Event) => {
    navigate('EventDetails', {item: item});
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
    eventAdress: {
      fontSize: width > 400 ? 14 : 12, // Dynamically adjust font size based on screen width
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
      <TouchableOpacity onPress={() => handleEventSelection(item)}>
        <View style={styles.eventContent}>
          <View style={styles.dateContainer}>
            <DateEvent dateDebut={item.dateDebut} flexSize={0.23} />
          </View>
          <View style={styles.detailsContainer}>
            <View style={styles.textContainer}>
              <Text style={styles.eventTitle}>{typeEventName}</Text>
              <Text style={styles.eventTime}>
                {t('Global.from')} {heureFormatDebut} {t('Global.to')}{' '}
                {heureFormatFin}
              </Text>
              <Text style={styles.eventAdress}>{item.localisation.description}</Text>
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
