import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet, Text, View} from 'react-native';
import DefaultComponentsThemes from '../defaultComponentsThemes';
import DatePicker from 'react-native-date-picker';
import {i18n} from '../localization';
import {TextInput as PaperTextInput} from 'react-native-paper';
import {theme} from '../core/theme';

type Props = {
  dateDeb: Date;
  heureDeb: Date;
  dateF: Date;
  heureF: Date;
  setDateDeb: (value: Date) => void;
  setHeureDeb: (value: Date) => void;
  setDateF: (value: Date) => void;
  setHeureF: (value: Date) => void;
};



export const DateHeureSection = ({
  dateDeb,
  heureDeb,
  dateF,
  heureF,
  setDateDeb,
  setHeureDeb,
  setDateF,
  setHeureF,
}: Props) => {
  const {t} = useTranslation();
  const defaultStyles = DefaultComponentsThemes();
  const [dateDebut, setDateDebut] = useState<Date>(dateDeb);
  const [heureDebut, setHeureDebut] = useState<Date>(heureDeb);
  const [dateFin, setDateFin] = useState<Date>(dateF);
  const [heureFin, setHeureFin] = useState<Date>(heureF);
  const [openDateDebut, setOpenDateDebut] = useState(false);
  const [openHeureDebut, setOpenHeureDebut] = useState(false);
  const [openDateFin, setOpenDateFin] = useState(false);
  const [openHeureFin, setOpenHeureFin] = useState(false);
  const selectedLanguageCode = i18n.language;
  let languageDate = 'fr-FR';
  if (selectedLanguageCode === 'en') {
    languageDate = 'en-US';
  }
  
  const timezones = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';

  const dateOptions: Intl.DateTimeFormatOptions = { dateStyle: 'medium', timeZone: timezones };
const timeOptions: Intl.DateTimeFormatOptions = { timeStyle: 'short', timeZone: timezones };

const safeFormatDate = (date: any, options: Intl.DateTimeFormatOptions): string => {
  if (!date || isNaN(new Date(date).getTime())) {
    return t('Invalid date'); // ou un autre texte traduisible
  }
  return new Intl.DateTimeFormat(languageDate, options).format(new Date(date));
};

const dateFormatDebut = safeFormatDate(dateDebut, dateOptions);
const heureFormatDebut = safeFormatDate(heureDebut, timeOptions);
const dateFormatFin = safeFormatDate(dateFin, dateOptions);
const heureFormatFin = safeFormatDate(heureFin, timeOptions);

  const handleOpenDateDebutChange = () => {
    setOpenDateDebut(true);
  };

  const handleOpenHeureDebutChange = () => {
    setOpenHeureDebut(true);
  };

  const handleOpenDateFinChange = () => {
    setOpenDateFin(true);
  };

  const handleOpenHeureFinChange = () => {
    setOpenHeureFin(true);
  };

  const styles = StyleSheet.create({
    detailsTitle: {
      ...defaultStyles.text,
      ...defaultStyles.requestDetailsTitle,
    },
    /*  container: {
      flex: 1,
     // padding: 16,
    }, */
    /*  row: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: 10,
    }, */
    labelContainer: {
      width: 100, // Ajustez cette valeur pour correspondre à la longueur de vos textes
    },
    inputContainer: {
      flex: 1,
      flexDirection: 'column',
    },
    textInput: {
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 5,
      padding: 10,
      marginBottom: 10,
      // width: '100%', // Assure que l'input prend toute la largeur du conteneur parent
      overflow: 'hidden', // Évite les débordements
      textAlignVertical: 'center', // Centrage vertical
    },
    container: {
      padding: 10,
      backgroundColor: '#fff',
      borderRadius: 8,
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between', // Répartit uniformément
      alignItems: 'center', // Assure l'alignement vertical
      marginBottom: 15,
    },
    inputGroup: {
      flex: 1, // Assure un espacement uniforme
      //marginHorizontal: 8, // Ajoute un espace entre les colonnes
      marginTop:15
    },
    label: {
      fontSize: 14,
      fontWeight: 'bold',
      marginBottom: 5,
    },
    title: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 15,
    },
    input: {
      width: '100%', // Prend toute la largeur du conteneur
      marginBottom: 15,
      //height: 50,
      backgroundColor: theme.colors.surface,
      borderRadius: 4,
      paddingHorizontal: 10,
    },
    inputError: {
      borderColor: 'red',
      borderWidth: 1,
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.detailsTitle}>{t('AddEvent.DateHeure')}</Text>
      <View style={[styles.row, {gap: 16}]}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>{t('AddEvent.DateDebut')}</Text>
          <PaperTextInput
            returnKeyType="done"
            value={dateFormatDebut}
            onChangeText={handleOpenDateDebutChange}
            autoCapitalize="none"
            onFocus={handleOpenDateDebutChange}
            onPressIn={handleOpenDateDebutChange}
            numberOfLines={1} // Force une seule ligne
            style={styles.input}
          />
          <DatePicker
            modal
            open={openDateDebut}
            mode="date"
            date={dateDebut}
            locale={languageDate}
            onDateChange={text => {
              setDateDebut(text);
              setDateDeb(text);
            }}
            onConfirm={date => {
              setOpenDateDebut(false);
              setDateDebut(date);
              setDateDeb(date);
            }}
            onCancel={() => {
              setOpenDateDebut(false);
            }}
            confirmText={t('Global.Confirm')}
            cancelText={t('Global.Cancel')}
            title={t('Global.SelectDate')}
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>{t('AddEvent.HeureDebut')}</Text>
          <PaperTextInput
            returnKeyType="done"
            value={heureFormatDebut}
            onChangeText={handleOpenHeureDebutChange}
            autoCapitalize="none"
            onFocus={handleOpenHeureDebutChange}
            onPressIn={handleOpenHeureDebutChange}
            numberOfLines={1} // Force une seule ligne
            style={styles.input}
          />
          <DatePicker
            modal
            open={openHeureDebut}
            mode="time"
            date={heureDebut}
            onDateChange={text => {
              setHeureDebut(text);
              setHeureDeb(text);
            }}
            onConfirm={date => {
              setOpenHeureDebut(false);
              setHeureDebut(date);
              setHeureDeb(date);
            }}
            onCancel={() => {
              setOpenHeureDebut(false);
            }}
            confirmText={t('Global.Confirm')}
            cancelText={t('Global.Cancel')}
            title={t('Global.SelectTime')}
          />
        </View>
      </View>
      <View style={[styles.row, {gap: 16}]}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>{t('AddEvent.DateFin')}</Text>
          <PaperTextInput
            returnKeyType="done"
            value={dateFormatFin}
            onChangeText={handleOpenDateFinChange}
            autoCapitalize="none"
            onFocus={handleOpenDateFinChange}
            onPressIn={handleOpenDateFinChange}
            numberOfLines={1} // Force une seule ligne
            style={styles.input}
          />
          <DatePicker
             modal
             open={openDateFin}
             mode="date"
             date={dateFin}
             locale={languageDate}
             onDateChange={text => {
               setDateFin(text);
               setDateF(text);
             }}
             onConfirm={date => {
               setOpenDateFin(false);
               setDateFin(date);
               setDateF(date);
             }}
             onCancel={() => {
               setOpenDateFin(false);
             }}
             confirmText={t('Global.Confirm')}
             cancelText={t('Global.Cancel')}
             title={t('Global.SelectDate')}
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>{t('AddEvent.HeureFin')}</Text>
          <PaperTextInput
            returnKeyType="done"
            value={heureFormatFin}
            onChangeText={handleOpenHeureFinChange}
            autoCapitalize="none"
            onFocus={handleOpenHeureFinChange}
            onPressIn={handleOpenHeureFinChange}
            numberOfLines={1} // Force une seule ligne
            style={styles.input}
          />
          <DatePicker
            modal
            open={openHeureFin}
            mode="time"
            date={heureFin}
            onDateChange={text => {
              setHeureFin(text);
              setHeureF(text);
            }}
            onConfirm={date => {
              setOpenHeureFin(false);
              setHeureFin(date);
              setHeureF(date);
            }}
            onCancel={() => {
              setOpenHeureFin(false);
            }}
            confirmText={t('Global.Confirm')}
            cancelText={t('Global.Cancel')}
            title={t('Global.SelectTime')}
          />
        </View>
      </View>
    </View>
  );
};
