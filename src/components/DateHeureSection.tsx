import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {PixelRatio, StyleSheet, Text, View} from 'react-native';
import DefaultComponentsThemes from '../defaultComponentsThemes';
import TextInput from '../components/TextInput';
import DatePicker from 'react-native-date-picker';
import {CustomInputTextDate} from './CustomInputTextDate';
import {i18n} from '../localization';

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
  console.log(dateDeb)
  let sizeDateDeb = 15;
  let sizeDateFin = 40;
  let languageDate = 'fr-fr';
  if (selectedLanguageCode=='en'){
    sizeDateDeb = 15;
    sizeDateFin = 23;
    languageDate = 'en-GB';
  }

  let dateFormatDebut = dateDebut.toLocaleDateString(languageDate, {
    year: 'numeric',
    day: '2-digit',
    month: 'short',
    timeZone: "UTC"
  });
  console.log(dateFormatDebut)
  let heureFormatDebut = heureDebut.toLocaleTimeString(languageDate, {
    hour: 'numeric',
    minute: 'numeric',
    timeZone: "UTC"
  });
  let dateFormatFin = dateFin.toLocaleDateString(languageDate, {
    year: 'numeric',
    day: '2-digit',
    month: 'short',
    timeZone: "UTC"
  });
  let heureFormatFin = heureFin.toLocaleTimeString(languageDate, {
    hour: 'numeric',
    minute: 'numeric',
    timeZone: "UTC"
  });

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
  });

  return (
    <View>
      <Text style={styles.detailsTitle}>{t('AddEvent.DateHeure')}</Text>
      <View style={{flexDirection: 'row'}}>
        <View style={{marginVertical: 25, marginRight:sizeDateDeb}}>
          <Text style={styles.detailsTitle}>{t('AddEvent.DateDebut')}</Text>
        </View>
        <View>
          <TextInput
            returnKeyType="next"
            value={dateFormatDebut}
            onChangeText={handleOpenDateDebutChange}
            autoCapitalize="none"
            onFocus={handleOpenDateDebutChange}
            onPressIn={handleOpenDateDebutChange}
          />

          <DatePicker
            modal
            open={openDateDebut}
            mode="date"
            date={dateDebut}
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
          />
        </View>
        <View style={{marginLeft: 25}}>
          <TextInput
            returnKeyType="next"
            value={heureFormatDebut}
            onChangeText={handleOpenHeureDebutChange}
            autoCapitalize="none"
            onFocus={handleOpenHeureDebutChange}
            onPressIn={handleOpenHeureDebutChange}
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
          />
        </View>
      </View>
      <View style={{flexDirection: 'row'}}>
        <View style={{marginVertical: 25, marginRight:sizeDateFin}}>
          <Text style={styles.detailsTitle}>{t('AddEvent.DateFin')}</Text>
        </View>
        <View>
          <TextInput
            returnKeyType="next"
            value={dateFormatFin}
            onChangeText={handleOpenDateFinChange}
            autoCapitalize="none"
            onFocus={handleOpenDateFinChange}
            onPressIn={handleOpenDateFinChange}
          />
          <DatePicker
            modal
            open={openDateFin}
            mode="date"
            date={dateFin}
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
          />
        </View>
        <View style={{marginLeft: 25}}>
          <TextInput
            returnKeyType="next"
            value={heureFormatFin}
            onChangeText={handleOpenHeureFinChange}
            autoCapitalize="none"
            onFocus={handleOpenHeureFinChange}
            onPressIn={handleOpenHeureFinChange}
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
          />
        </View>
      </View>
    </View>
  );
};
