import React, { useState } from 'react';
import {StyleSheet, Text, View} from 'react-native';
import DefaultComponentsThemes from '../defaultComponentsThemes';
import {i18n} from '../localization';
import TextInput from '../components/TextInput';
import DatePicker from 'react-native-date-picker';
import { useTranslation } from 'react-i18next';

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
  let sizeDateDeb = 15;
  let sizeDateFin = 40;
  let languageDate = 'fr-fr';
  if (selectedLanguageCode == 'en') {
    sizeDateDeb = 15;
    sizeDateFin = 23;
    languageDate = 'en-GB';
  }

  let dateFormatDebut = dateDebut.toLocaleDateString(languageDate, {
    year: 'numeric',
    day: '2-digit',
    month: 'short',
    timeZone: 'UTC',
  });

  const handleOpenDateDebutChange = () => {
    setOpenDateDebut(true);
  };

  const styles = StyleSheet.create({
    detailsTitle: {
      ...defaultStyles.text,
      ...defaultStyles.requestDetailsTitle,
    },
  });

  let content = (
    <View>
      <View style={{flexDirection: 'row'}}>
      <View style={{marginVertical: 25, marginRight: sizeDateDeb}}>
          <Text style={styles.detailsTitle}>{t('ProductDelivering.DateDelivered')}</Text>
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
          />
        </View>
      </View>
    </View>
  );

  return content;
};
