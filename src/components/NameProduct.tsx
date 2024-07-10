import React from 'react';
import {useTranslation} from 'react-i18next';
import {View} from 'react-native';
import TextInput from './TextInput';

type Props = {
  productName: string;
  setProductName: (value: string) => void;
};

export const NameProduct = ({productName, setProductName}: Props) => {
  const {t} = useTranslation();

  return (
    <View>
      <TextInput
        label={t('AddProduct.Name')}
        returnKeyType="next"
        value={productName}
        onChangeText={text => setProductName(text)}
        autoCapitalize="none"
      />
    </View>
  );
};
