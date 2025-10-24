import React, { useState } from 'react';
import {StyleSheet, Text, View} from 'react-native';
import DefaultComponentsThemes from '../defaultComponentsThemes';
import {i18n} from '../localization';
import {TextInput as PaperTextInput} from 'react-native-paper';
import DatePicker from 'react-native-date-picker';
import { useTranslation } from 'react-i18next';
import { theme } from '../core/theme';

type Props = {
  dateDelivered: Date;
  setDateDelivered: (value: Date) => void;
};

export const DatePanier = ({dateDelivered, setDateDelivered}: Props) => {
  const {t} = useTranslation();
  const defaultStyles = DefaultComponentsThemes();
  const [dateDebut, setDateDebut] = useState<Date>(dateDelivered);
  const [openDateDebut, setOpenDateDebut] = useState(false);
  const selectedLanguageCode = i18n.language;
  let languageDate = 'fr-fr';
  if (selectedLanguageCode == 'en') {
    languageDate = 'en-GB';
  }

  let dateFormatDebut = dateDebut.toLocaleDateString(languageDate, {
    year: 'numeric',
    day: '2-digit',
    month: 'short',
    timeZone: 'UTC',
  });

  console.log(dateFormatDebut)

  const handleOpenDateDebutChange = () => {
    setOpenDateDebut(true);
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

  let content = (
    <View>
      <View style={styles.inputGroup}>
          <Text style={styles.label}>{t('ProductDelivering.DateDelivered')}</Text>
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
              setDateDelivered(text);
            }}
            onConfirm={date => {
              setOpenDateDebut(false);
              setDateDebut(date);
              setDateDelivered(date);
            }}
            onCancel={() => {
              setOpenDateDebut(false);
            }}
            confirmText={t('Global.Confirm')}
            cancelText={t('Global.Cancel')}
            title={t('Global.SelectDate')}
          />
        </View>
    </View>
  );

  return content;
};
