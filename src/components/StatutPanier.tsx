import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet, View} from 'react-native';
import {SelectList} from 'react-native-dropdown-select-list';
import {useTheme} from '../contexts/theme';
import {theme} from '../core/theme';
import DefaultComponentsThemes from '../defaultComponentsThemes';
import {StatusList} from './StatusList';

type Props = {
  statut: string;
  setStatut: (value: string) => void;
};

export const StatutPanier = ({statut, setStatut}: Props) => {
  const {t, i18n} = useTranslation();
  const statuts = StatusList(t);
  const {ColorPallet} = useTheme();
  const [current, setCurrent] = useState({
    key: '',
    value: t('Dropdown.Statut'),
  });
  const defaultStyles = DefaultComponentsThemes();
  const selectedLanguageCode = i18n.language;
  let sizeDateFin = 100;
  if (selectedLanguageCode == 'en') {
    sizeDateFin = 80;
  }

  let transformed = statuts.map(({id, name}) => ({key: id, value: name}));

  transformed.push({key: '', value: t('Dropdown.Statut')});
  transformed.sort((a, b) =>
    a.key.toLowerCase().localeCompare(b.key.toLowerCase()),
  );

  useEffect(() => {
    transformed.map(({key, value}) => {
      if (key === statut) {
        setCurrent({key: key, value: value});
      }
    });
  }, []);
  const styles = StyleSheet.create({
    container: {
      minHeight: 50,
      marginVertical: 10,
      borderWidth: 1,
      borderColor: 'grey',
      borderRadius: 4,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
    },
    buttonStyle: {
      flex: 1,
      width: '100%',
      height: '100%',
      backgroundColor: 'transparent',
    },
    text: {
      textAlign: 'left',
    },
    dropdownStyle: {
      borderColor: ColorPallet.lightGray,
      borderBottomWidth: 2,
      borderLeftWidth: 2,
      borderRightWidth: 2,
      borderStyle: 'solid',
      borderBottomLeftRadius: 4,
      maring: '0',
      borderBottomRightRadius: 4,
    },
    detailsTitle: {
      ...defaultStyles.text,
      ...defaultStyles.requestDetailsTitle,
    },
  });

  const defaultOption = (): {key: string; value: string} | undefined => {
    if (current.key.length > 0) {
      return {key: current.key, value: current.value};
    }
    return undefined;
  };

  return (
    <View style={defaultStyles.sectionStyle}>
      <SelectList
        boxStyles={styles.container}
        setSelected={(val: string) => setStatut(val)}
        data={transformed}
        search={true}
        save="key"
        placeholder={t('Dropdown.Statut')}
        defaultOption={defaultOption()}
        dropdownTextStyles={{backgroundColor: theme.colors.surface}}
        inputStyles={{backgroundColor: theme.colors.surface}}
      />
    </View>
  );
};
