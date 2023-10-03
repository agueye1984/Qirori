import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { DispatchAction } from '../contexts/reducers/store';
import { useStore } from '../contexts/store';
import { useTheme } from '../contexts/theme';
import DefaultComponentsThemes from '../defaultComponentsThemes';
import { BacktoHome } from '../components/BacktoHome';
import Header from '../components/Header';
import { v4 as uuidv4 } from 'uuid';
import { Event } from '../contexts/types';
import { LocalStorageKeys } from '../constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NameSection } from '../components/NameSection';
import { DescriptionSection } from '../components/DescriptionSection';
import { DateHeureSection } from '../components/DateHeureSection';
import { EmplacementSection } from '../components/EmplacementSection';
import { theme } from '../core/theme';
import Button from '../components/Button';
import { SafeAreaView } from 'react-native-safe-area-context';
//import { ScrollView } from 'react-native-virtualized-view';

export const AddEvent = () => {
  const { i18n, t } = useTranslation();
  const [, dispatch] = useStore();
  const defaultStyles = DefaultComponentsThemes();
  const { ColorPallet } = useTheme();
  const navigation = useNavigation();
  const [eventName, setEventName] = useState<string>('');
  const [nameDirty, setNameDirty] = useState(false);
  const [eventDescription, setEventDescription] = useState<string>('');
  const [descriptionDirty, setDescriptionDirty] = useState(false);
  const [eventLocalisation, setEventLocalisation] = useState<string>('');
  const [localisationDirty, setLocalisationDirty] = useState(false);
  const [dateDebut, setDateDebut] = useState<Date>(new Date());
  const [heureDebut, setHeureDebut] = useState<Date>(new Date());
  const [dateFin, setDateFin] = useState<Date>(new Date());
  const [heureFin, setHeureFin] = useState<Date>(new Date());
  const selectedLanguageCode = i18n.language;
    let languageDate = ''
    if(selectedLanguageCode==='fr'){
        languageDate = 'fr-fr';
    }
    if(selectedLanguageCode==='en'){
        languageDate = 'en-GB';
    }


  const handleNameChange = (value: string) => {
    setNameDirty(true);
    setEventName(value);
  }
  const handleDescriptionChange = (value: string) => {
    setDescriptionDirty(true);
    setEventDescription(value);
  }

  const handleLocalisationChange = (value: string) => {
    setLocalisationDirty(true);
    setEventLocalisation(value);
  }

  const handleDateDebutChange = (value: Date) => {
    setDateDebut(value);
  }

  const handleHeureDebutChange = (value: Date) => {
    setHeureDebut(value);
  }

  const handleDateFinChange = (value: Date) => {
    setDateFin(value);
  }

  const handleHeureFinChange = (value: Date) => {
    setHeureFin(value);
  }

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
    containerStyleName: {
      borderColor: eventName.trim().length === 0 && nameDirty ? ColorPallet.error : ColorPallet.lightGray,
      borderWidth: eventName.trim().length === 0 && nameDirty ? 2 : 1,
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
  })

  const handleSaveEvents = async () => {
    try {
      const dateformatDebut = dateDebut.toLocaleDateString(languageDate, {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }).split('/').reverse().join('');
      const heureFormatDebut = heureDebut.toLocaleTimeString(languageDate, {
        hour: 'numeric',
        minute: 'numeric',
        hourCycle: 'h24'
      }).split(':').join('');
      const dateformatFin = dateFin.toLocaleDateString(languageDate, {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }).split('/').reverse().join('');
      const heureFormatFin = heureFin.toLocaleTimeString(languageDate, {
        hour: 'numeric',
        minute: 'numeric',
        hourCycle: 'h24'
      }).split(':').join('');
      const userId = await AsyncStorage.getItem(LocalStorageKeys.UserId);
      let event: Event = {
        id: uuidv4(),
        name: eventName,
        description: eventDescription,
        dateDebut: dateformatDebut,
        heureDebut: heureFormatDebut,
        dateFin: dateformatFin,
        heureFin: heureFormatFin,
        localisation: eventLocalisation,
        userId: userId
      };

      dispatch({
        type: DispatchAction.ADD_EVENT,
        payload: event,
      });
      navigation.navigate('Events' as never);
    } catch (e: unknown) {

    }

  }

  return (
    <SafeAreaView>
      <BacktoHome textRoute={t('Events.title')} />
      <Header>{t('AddEvent.title')}</Header>

      <ScrollView scrollEnabled>
        <View style={styles.section}>
          <NameSection
            eventName={eventName}
            setEventName={handleNameChange}
            containerStyles={styles.containerStyleName}
          />
          {eventName.length === 0 && nameDirty && <Text style={styles.error}>{t('Global.NameErrorEmpty')}</Text>}
        </View>
        <View style={styles.section}>
          <DescriptionSection
            maxLength={200}
            eventDescription={eventDescription}
            setEventDescription={handleDescriptionChange}
          />
          {eventDescription.length === 0 && descriptionDirty && <Text style={styles.error}>{t('Global.DescriptionErrorEmpty')}</Text>}
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
            containerStyles={styles.containerStyleName}
          />
        </View>
        {eventLocalisation.length === 0 && localisationDirty && <Text style={styles.error}>{t('Global.LocalisationErrorEmpty')}</Text>}
        <View style={[styles.section]}>
          <View style={styles.row}>
            <View style={{ marginRight: 90, alignItems: 'flex-start' }}>
              <Button mode="contained" onPress={() => navigation.navigate('Events' as never)}>
                {t('Global.Cancel')}
              </Button>
            </View>
            <View style={[{ marginLeft: 90, alignItems: 'flex-end' }]}>
              <Button mode="contained" onPress={handleSaveEvents}>
                {t('Global.Create')}
              </Button>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
