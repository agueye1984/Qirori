import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {DispatchAction} from '../contexts/reducers/store';
import {useStore} from '../contexts/store';
import {useTheme} from '../contexts/theme';
import DefaultComponentsThemes from '../defaultComponentsThemes';
import {BacktoHome} from '../components/BacktoHome';
import Header from '../components/Header';
import {Event, Location, ManageEventsParamList, User} from '../contexts/types';
import {
  descriptionValidator,
  localisationValidator,
  nameSectionValidator,
} from '../core/utils';
import {LocalStorageKeys} from '../constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {NameSection} from '../components/NameSection';
import {DescriptionSection} from '../components/DescriptionSection';
import {DateHeureSection} from '../components/DateHeureSection';
import {EmplacementSection} from '../components/EmplacementSection';
import {StackNavigationProp} from '@react-navigation/stack';
import {theme} from '../core/theme';
import Button from '../components/Button';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTranslation} from 'react-i18next';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

type editEventProps = StackNavigationProp<
  ManageEventsParamList,
  'EventDetails'
>;

export const EditEvent = () => {
  const {i18n, t} = useTranslation();
  const route = useRoute<RouteProp<ManageEventsParamList, 'EditEvent'>>();
  const [state, dispatch] = useStore();
  const defaultStyles = DefaultComponentsThemes();
  const {ColorPallet} = useTheme();
  const navigation = useNavigation<editEventProps>();
  const item = route.params.item;
  console.log(item)
  const [eventName, setEventName] = useState<string>(item.name);
  const [eventDescription, setEventDescription] = useState<string>(
    item.description,
  );
  const [eventLocalisation, setEventLocalisation] = useState<Location>(
    item.localisation,
  );
  const dateDebFormat =
    item.dateDebut.substring(0, 4) +
    '-' +
    item.dateDebut.substring(4, 6) +
    '-' +
    item.dateDebut.substring(6, 8);
  const heurDebFormat =
    dateDebFormat +
    ' ' +
    item.heureDebut.substring(0, 2) +
    ':' +
    item.heureDebut.substring(2, 4);
  const dateFinFormat =
    item.dateFin.substring(0, 4) +
    '-' +
    item.dateFin.substring(4, 6) +
    '-' +
    item.dateFin.substring(6, 8);
  const heurFinFormat =
    dateFinFormat +
    ' ' +
    item.heureFin.substring(0, 2) +
    ':' +
    item.heureFin.substring(2, 4);
    console.log(dateDebFormat)
  const [dateDebut, setDateDebut] = useState<Date>(new Date(dateDebFormat));
  const [heureDebut, setHeureDebut] = useState<Date>(new Date(heurDebFormat));
  const [dateFin, setDateFin] = useState<Date>(new Date(dateFinFormat));
  const [heureFin, setHeureFin] = useState<Date>(new Date(heurFinFormat));
  const [nameError, setNameError] = useState('');
  const [descriptionError, setDescriptionError] = useState('');
  const [localisationError, setLocalisationError] = useState('');
  console.log(dateDebut)
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
      flex: 1,
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
        firestore()
          .collection('events')
          .doc(item.id)
          .update({
            name: eventName,
            description: eventDescription,
            dateDebut: dateformatDebut,
            heureDebut: heureFormatDebut,
            dateFin: dateformatFin,
            heureFin: heureFormatFin,
            localisation: eventLocalisation,
          })
          .then(() => {
            console.log(eventName);
            console.log('Event updated!');
            navigation.navigate('Events' as never);
          });
        /*const userId = await AsyncStorage.getItem(LocalStorageKeys.UserId);
      let event: Event = {
        id: item.id,
        name: eventName,
        description: eventDescription,
        dateDebut: dateformatDebut,
        heureDebut: heureFormatDebut,
        dateFin: dateformatFin,
        heureFin: heureFormatFin,
        localisation: eventLocalisation,
        userId: userId
      }
      dispatch({
        type: DispatchAction.UPDATE_EVENT,
        payload: event,
      })
      navigation.navigate('Events' as never)*/
      }
    } catch (e: unknown) {}
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <BacktoHome textRoute={t('Events.title')} />
      <Header>{t('AddEvent.titleModify')}</Header>

      <ScrollView scrollEnabled>
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
      <View style={styles.section}>
        <View style={styles.row}>
          <View style={{marginRight: 80, alignItems: 'flex-start'}}>
            <Button
              mode="contained"
              onPress={() => navigation.navigate('Events' as never)}>
              {t('Global.Cancel')}
            </Button>
          </View>
          <View style={[{marginLeft: 80, alignItems: 'flex-end'}]}>
            <Button mode="contained" onPress={handleSaveEvents}>
              {t('Global.Modify')}
            </Button>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};
