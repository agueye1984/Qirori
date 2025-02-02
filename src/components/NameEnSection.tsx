import React from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet, View} from 'react-native';
import { theme } from '../core/theme';
import { TextInput as PaperTextInput } from 'react-native-paper';

type Props = {
  nameEn: string;
  setNameEn: (value: string) => void;
  error: string;
};

export const NameEnSection = ({nameEn, setNameEn, error}: Props) => {
  const {t} = useTranslation();

  const styles = StyleSheet.create({
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
    <View>
    <PaperTextInput
      label={t('AddTypeEvent.NameEn')}
      returnKeyType="next"
      value={nameEn}
      onChangeText={text => setNameEn(text)}
      autoCapitalize="none"
      style={error ? [styles.input, styles.inputError] : styles.input }
        
    />
  </View>
  );
};
