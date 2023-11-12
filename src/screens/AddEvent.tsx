import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {DispatchAction} from '../contexts/reducers/store';
import {useStore} from '../contexts/store';
import {useTheme} from '../contexts/theme';
import DefaultComponentsThemes from '../defaultComponentsThemes';
import {BacktoHome} from '../components/BacktoHome';
import Header from '../components/Header';
import {v4 as uuidv4} from 'uuid';
import {Event, Location, User} from '../contexts/types';
import {LocalStorageKeys} from '../constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {NameSection} from '../components/NameSection';
import {DescriptionSection} from '../components/DescriptionSection';
import {DateHeureSection} from '../components/DateHeureSection';
import {EmplacementSection} from '../components/EmplacementSection';
import {theme} from '../core/theme';
import Button from '../components/Button';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  descriptionValidator,
  localisationValidator,
  nameSectionValidator,
} from '../core/utils';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export const AddEvent = () => {
  const initLocate: Location = {placeId: '', description: ''};
  const {i18n, t} = useTranslation();
  const [, dispatch] = useStore();
  const defaultStyles = DefaultComponentsThemes();
  const {ColorPallet} = useTheme();
  const navigation = useNavigation();
  const [eventName, setEventName] = useState<string>('');
  const [eventDescription, setEventDescription] = useState<string>('');
  const [eventLocalisation, setEventLocalisation] =
    useState<Location>(initLocate);
  const [dateDebut, setDateDebut] = useState<Date>(new Date());
  const [heureDebut, setHeureDebut] = useState<Date>(new Date());
  const [dateFin, setDateFin] = useState<Date>(new Date());
  const [heureFin, setHeureFin] = useState<Date>(new Date());
  const [nameError, setNameError] = useState('');
  const [descriptionError, setDescriptionError] = useState('');
  const [localisationError, setLocalisationError] = useState('');
  const [userId, setUserId] = useState('');

  useEffect(() => {
    const usersRef = firestore().collection('users');
    auth().onAuthStateChanged(user => {
      if (user) {
        console.log(user)
        usersRef
          .doc(user.uid)
          .get()
          .then(document => {
            const userData = document.data() as User;
            setUserId(userData.id);
          })
          .catch(error => {
            console.log('error1 ' + error);
          });
      }
    });
  }, []);

  const selectedLanguageCode = i18n.language;
  let languageDate = '';
  if (selectedLanguageCode === 'fr') {
    languageDate = 'fr-fr';
  }
  if (selectedLanguageCode === 'en') {
    languageDate = 'en-GB';
  }

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

  const styles = StyleSheet.create({
    section: {
      marginHorizontal: 10,
      paddingVertical: 10,
    },
    buttonsContainer: {
      paddingBottom: 50,
    },
    error: {
      ...defaultStyles.text,
      color: ColorPallet.error,
      fontWeight: 'bold',
    },
    itemContainer: {
      borderTopWidth: 0.2,
      borderTopStyle: 'solid',
    },
    row: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    input: {
      textAlignVertical: 'top',
      fontSize: 16,
      height: '100%',
      color: theme.colors.primaryText,
    },
    container: {
      minHeight: 50,
      marginTop: 10,
      marginBottom: 10,
      paddingHorizontal: 10,
      borderWidth: 1,
      borderColor: ColorPallet.lightGray,
      borderRadius: 4,
    },
  });

  const handleSaveEvents = async () => {
    try {
      const nameEmpty = nameSectionValidator(eventName, t);
      const descriptionEmpty = descriptionValidator(eventDescription, t);
      const locateEmpty = localisationValidator(eventLocalisation, t);

      if (nameEmpty || descriptionEmpty || locateEmpty) {
        setNameError(nameEmpty);
        setDescriptionError(descriptionEmpty);
        setLocalisationError(locateEmpty);
      } else {
        const dateformatDebut = dateDebut
          .toLocaleDateString(languageDate, {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            timeZone: "UTC"
          })
          .split('/')
          .reverse()
          .join('');
        const heureFormatDebut = heureDebut
          .toLocaleTimeString(languageDate, {
            hour: 'numeric',
            minute: 'numeric',
            hourCycle: 'h24',
            timeZone: "UTC"
          })
          .split(':')
          .join('');
        const dateformatFin = dateFin
          .toLocaleDateString(languageDate, {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            timeZone: "UTC"
          })
          .split('/')
          .reverse()
          .join('');
        const heureFormatFin = heureFin
          .toLocaleTimeString(languageDate, {
            hour: 'numeric',
            minute: 'numeric',
            hourCycle: 'h24',
            timeZone: "UTC"
          })
          .split(':')
          .join('');
          const uid = uuidv4();
        firestore()
          .collection('events')
          .doc(uid)
          .set({
            id: uid,
            name: eventName,
            description: eventDescription,
            dateDebut: dateformatDebut,
            heureDebut: heureFormatDebut,
            dateFin: dateformatFin,
            heureFin: heureFormatFin,
            localisation: eventLocalisation,
            userId: userId,
          })
          .then(() => {
            console.log('Event added!');
            navigation.navigate('Events' as never);
          });
        /* const userId = await AsyncStorage.getItem(LocalStorageKeys.UserId);
        let event: Event = {
          id: uuidv4(),
          name: eventName,
          description: eventDescription,
          dateDebut: dateformatDebut,
          heureDebut: heureFormatDebut,
          dateFin: dateformatFin,
          heureFin: heureFormatFin,
          localisation: eventLocalisation,
          userId: userId,
        };

        dispatch({
          type: DispatchAction.ADD_EVENT,
          payload: event,
        });
        navigation.navigate('Events' as never);*/
      }
    } catch (e: unknown) {}
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <BacktoHome textRoute={t('Events.title')} />
      <Header>{t('AddEvent.title')}</Header>

      <ScrollView scrollEnabled automaticallyAdjustKeyboardInsets={true}>
        <View style={styles.section}>
          <NameSection
            eventName={eventName}
            setEventName={handleNameChange}
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
        <View style={styles.section}>
          <EmplacementSection
            eventLocalisation={eventLocalisation}
            setEventLocalisation={handleLocalisationChange}
            error={localisationError}
          />
        </View>
      </ScrollView>
      <View style={[styles.section]}>
        <View style={styles.row}>
          <View style={{marginRight: 90, alignItems: 'flex-start'}}>
            <Button
              mode="contained"
              onPress={() => navigation.navigate('Events' as never)}>
              {t('Global.Cancel')}
            </Button>
          </View>
          <View style={[{marginLeft: 90, alignItems: 'flex-end'}]}>
            <Button mode="contained" onPress={handleSaveEvents}>
              {t('Global.Create')}
            </Button>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};
