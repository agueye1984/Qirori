import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import React, {useEffect, useState} from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import DefaultComponentsThemes from '../defaultComponentsThemes';
import {BacktoHome} from '../components/BacktoHome';
import Header from '../components/Header';
import {v4 as uuidv4} from 'uuid';
import {Location, ManageEventsParamList, TypeEvent} from '../contexts/types';
import {NameSection} from '../components/NameSection';
import {DescriptionSection} from '../components/DescriptionSection';
import {DateHeureSection} from '../components/DateHeureSection';
import {EmplacementSection} from '../components/EmplacementSection';
import Button from '../components/Button';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  descriptionValidator,
  localisationValidator,
  nameSectionValidator,
} from '../core/utils';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { getRecordById } from '../services/FirestoreServices';

const parseDateYYYYMMDD = (dateString: string): Date => {
  const year = parseInt(dateString.substring(0, 4), 10);
  const month = parseInt(dateString.substring(4, 6), 10) - 1; // Les mois commencent à 0
  const day = parseInt(dateString.substring(6, 8), 10);

  return new Date(year, month, day);
};

const parseTimeHHMM = (timeString: string, date: Date = new Date()): Date => {
  const hours = parseInt(timeString.substring(0, 2), 10);
  const minutes = parseInt(timeString.substring(2, 4), 10);

  const resultDate = new Date(date); // Crée une copie de la date donnée
  resultDate.setHours(hours, minutes, 0, 0); // Définit les heures et minutes
  return resultDate;
};

export const AddEvent = () => {
  // Vérifier si nous sommes en mode modification
  const route = useRoute<RouteProp<ManageEventsParamList, 'AddEvent'>>();
  const isEditing = route.params?.isEditing || false;
  const eventToEdit = route.params?.item || null;
  const currentUser = auth().currentUser;
  const initLocate: Location = {placeId: '', description: ''};
  const {i18n, t} = useTranslation();
  const defaultStyles = DefaultComponentsThemes();
  const navigation = useNavigation();
  const [eventName, setEventName] = useState<string>(eventToEdit?.name || '');
  const [eventDescription, setEventDescription] = useState<string>(
    eventToEdit?.description || '',
  );
  const [eventLocalisation, setEventLocalisation] = useState<Location>(
    eventToEdit?.localisation || initLocate,
  );
  const [dateDebut, setDateDebut] = useState<Date>(
    eventToEdit?.dateDebut ? parseDateYYYYMMDD(eventToEdit.dateDebut) : new Date(),
  );
  const [heureDebut, setHeureDebut] = useState<Date>(
    eventToEdit?.heureDebut ? parseTimeHHMM(eventToEdit.heureDebut) : new Date(),
  );
  const [dateFin, setDateFin] = useState<Date>(
    eventToEdit?.dateFin ? parseDateYYYYMMDD(eventToEdit.dateFin) : new Date(),
  );
  const [heureFin, setHeureFin] = useState<Date>(
    eventToEdit?.heureFin ? parseTimeHHMM(eventToEdit.heureFin) : new Date(),
  );
  const [nameError, setNameError] = useState('');
  const [descriptionError, setDescriptionError] = useState('');
  const [localisationError, setLocalisationError] = useState('');
  const [dateError, setDateError] = useState('');
  const selectedLanguageCode = i18n.language;
  const [boutonActif, setBoutonActif] = useState(false);
  let initial = {
    key: '',
    value: t('Dropdown.Event'),
  }
  const [current, setCurrent] = useState(initial)
  let languageDate = '';
  if (selectedLanguageCode === 'fr') {
    languageDate = 'fr-fr';
  }
  if (selectedLanguageCode === 'en') {
    languageDate = 'en-GB';
  }

  useEffect(() => {
    const fetchData = async () => {
      const typeEvent = (await getRecordById(
        'type_events',
        eventName,
      )) as TypeEvent;
      let eventType = {
        key: typeEvent.id,
        value: typeEvent.nameFr,
      }
      if (selectedLanguageCode == 'en') {
        eventType = {
          key: typeEvent.id,
          value: typeEvent.nameEn,
        }
      } 
      setCurrent(eventType)
    };
    if(eventName!==''){
      fetchData();
    }
    
  }, [eventName])
  const handleNameChange = (value: string) => {
    setEventName(value);
  };
  const handleDescriptionChange = (value: string) => {
    setEventDescription(value);
  };

  const handleLocalisationChange = (value: Location) => {
    setEventLocalisation(value);
  };

  const handleDateDebutChange = (value: Date) => {
    setDateDebut(value);
  };

  const handleHeureDebutChange = (value: Date) => {
    setHeureDebut(value);
  };

  const handleDateFinChange = (value: Date) => {
    setDateFin(value);
  };

  const handleHeureFinChange = (value: Date) => {
    setHeureFin(value);
  };

  const estUUID = (uuid: string) => {
    const uuidPattern =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidPattern.test(uuid);
  };

  const formatFirestoreDate = (valueDate: Date) => {
    return valueDate
      .toLocaleDateString(languageDate, {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      })
      .split('/')
      .reverse()
      .join('');
  };

  const formatFirestoreTime = (valueTime: Date) => {
    return valueTime
      .toLocaleDateString(languageDate, {
        hour: 'numeric',
        minute: 'numeric',
        hourCycle: 'h24',
      })
      .split(':')
      .join('');
  };

  const handleSaveEvents = async () => {
    setBoutonActif(true);
    try {
      const nameEmpty = nameSectionValidator(eventName, t);
      const descriptionEmpty = descriptionValidator(eventDescription, t);
      const locateEmpty = localisationValidator(eventLocalisation, t);

      if (nameEmpty || descriptionEmpty || locateEmpty) {
        setNameError(nameEmpty);
        setDescriptionError(descriptionEmpty);
        setLocalisationError(locateEmpty);
        setBoutonActif(false);
        return;
      } else {
        // Format des dates et heures
        const dateformatDebut = formatFirestoreDate(dateDebut);
        const heureFormatDebut = formatFirestoreTime(heureDebut).split(' ')[1];
        const dateformatFin = formatFirestoreDate(dateFin);
        const heureFormatFin = formatFirestoreTime(heureFin).split(' ')[1];
        const dateDeb = dateformatDebut + heureFormatDebut;
        const dateF = dateformatFin + heureFormatFin;
        if (dateDeb > dateF) {
          setDateError(t('Global.DateDGTDateF'));
          setBoutonActif(false);
        } else {
          const idTypeEvt = uuidv4();
          let eventType = eventName;
          if (!estUUID(eventType)) {
            let nameFr = '';
            let nameEn = '';
            if (selectedLanguageCode === 'fr') {
              nameFr = eventType;
            } else {
              nameEn = eventType;
            }
            eventType = idTypeEvt;
            const typeEvent = {
              id: idTypeEvt,
              nameFr: nameFr,
              nameEn: nameEn,
              userId: currentUser?.uid,
            };
            await firestore()
              .collection('type_events')
              .doc(idTypeEvt)
              .set(typeEvent);
            console.log('Type Event added!');
          }
          const updatedEvent = {
            name: eventType,
            description: eventDescription,
            dateDebut: dateformatDebut,
            heureDebut: heureFormatDebut,
            dateFin: dateformatFin,
            heureFin: heureFormatFin,
            localisation: eventLocalisation,
          };
          if (isEditing && eventToEdit?.id) {
            await firestore()
              .collection('events')
              .doc(eventToEdit.id)
              .update(updatedEvent);
            console.log('Event updated!');
          } else {
            const uid = uuidv4();
            await firestore()
              .collection('events')
              .doc(uid)
              .set({
                id: uid,
                ...updatedEvent,
                userId: currentUser?.uid,
              });
            console.log('Event created!');
          }
          setBoutonActif(false);
          navigation.navigate('Events' as never);
        }
      }
    } catch (error) {
      console.error(error);
      setBoutonActif(false);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    scrollContent: {
      flexGrow: 1,
      paddingBottom: 20,
    },
    section: {
      marginVertical: 10,
      padding: 10,
      backgroundColor: 'white',
      borderRadius: 8,
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    scrollViewContainer: {
      flexGrow: 1,
      paddingHorizontal: 20,
      paddingBottom: 100, // Espace pour éviter que le dernier champ soit masqué
    },
    bottomButtonContainer: {
      position: 'absolute',
      bottom: 0,
      width: '100%',
      padding: 20,
      backgroundColor: '#fff',
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <BacktoHome textRoute={t('Events.title')} />
        <Header>{isEditing ? t('AddEvent.titleModify') : t('AddEvent.title')}</Header>
        <ScrollView
          scrollEnabled
          showsVerticalScrollIndicator
          automaticallyAdjustKeyboardInsets
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scrollViewContainer}>
          <View style={styles.section}>
            <NameSection
              eventName={eventName}
              setEventName={handleNameChange}
              current={current}
              error={nameError}
            />
          </View>
          <View style={styles.section}>
            <DescriptionSection
              maxLength={200}
              eventDescription={eventDescription}
              setEventDescription={handleDescriptionChange}
              error={descriptionError}
            />
          </View>
          <View style={styles.section}>
            <DateHeureSection
              dateDeb={dateDebut}
              heureDeb={heureDebut}
              dateF={dateFin}
              heureF={heureFin}
              setDateDeb={handleDateDebutChange}
              setHeureDeb={handleHeureDebutChange}
              setDateF={handleDateFinChange}
              setHeureF={handleHeureFinChange}
            />
          </View>
          {dateError && <Text style={defaultStyles.error}>{dateError}</Text>}
          <View style={styles.section}>
            <EmplacementSection
              eventLocalisation={eventLocalisation}
              setEventLocalisation={handleLocalisationChange}
              error={localisationError}
              label={t('AddEvent.Emplacement')}
            />
          </View>
        </ScrollView>
        <View style={styles.bottomButtonContainer}>
          <View style={defaultStyles.buttonContainer}>
            <Button
              mode="contained"
              onPress={() => navigation.navigate('Events' as never)}
              style={defaultStyles.button}>
              {t('Global.Cancel')}
            </Button>
            <Button
              mode="contained"
              onPress={handleSaveEvents}
              style={defaultStyles.button}
              disabled={boutonActif}>
              {isEditing ? t('Global.Modify') : t('Global.Create')}
            </Button>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
