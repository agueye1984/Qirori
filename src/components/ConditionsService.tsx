import React from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet, Text, View} from 'react-native';
import TextInput from './TextInput';
import {theme} from '../core/theme';

type Props = {
  serviceCondition: string;
  setServiceCondition: (value: string) => void;
  maxLength?: number;
};

export const ConditionsService = ({
  serviceCondition,
  setServiceCondition,
  maxLength,
}: Props) => {
  const {t} = useTranslation();

  const styles = StyleSheet.create({
    characterText: {
      textAlign: 'right',
      color: theme.colors.primaryText,
      fontSize: 14,
      justifyContent: 'flex-start',
    },
  });

  return (
    <View>
      <View>
        <TextInput
          label={t('AddService.Conditions')}
          returnKeyType="next"
          value={serviceCondition}
          onChangeText={text => setServiceCondition(text)}
          autoCapitalize="none"
          multiline={true}
          maxLength={maxLength}
          numberOfLines={5}
        />
      </View>
      <View>
        {maxLength && (
          <Text style={styles.characterText}>
            {serviceCondition.length}/{maxLength}{' '}
            {t('AddEvent.CharacterCount')}
          </Text>
        )}
      </View>
    </View>
  );
};
