import React from 'react';
import {useTranslation} from 'react-i18next';
import {View} from 'react-native';
import TextInput from './TextInput';

type Props = {
  nameEn: string;
  setNameEn: (value: string) => void;
};

export const NameEnSection = ({nameEn, setNameEn}: Props) => {
  const {t} = useTranslation();

  return (
    <View>
    <TextInput
      label={t('AddTypeEvent.NameEn')}
      returnKeyType="next"
      value={nameEn}
      onChangeText={text => setNameEn(text)}
      autoCapitalize="none"
    />
  </View>
  );
};
