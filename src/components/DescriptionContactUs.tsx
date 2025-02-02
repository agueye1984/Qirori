import React from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet, Text, View} from 'react-native';
import DefaultComponentsThemes from '../defaultComponentsThemes';
import { TextInput as PaperTextInput } from 'react-native-paper';
import {theme} from '../core/theme';

type Props = {
  contactUsDescription: string;
  setContactUsDescription: (value: string) => void;
  maxLength?: number;
};

export const DescriptionContactUs = ({
  contactUsDescription,
  setContactUsDescription,
  maxLength,
}: Props) => {
  const {t} = useTranslation();
  const defaultStyles = DefaultComponentsThemes();

  const styles = StyleSheet.create({
    detailsTitle: {
      ...defaultStyles.text,
      ...defaultStyles.requestDetailsTitle,
    },
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
        <PaperTextInput
          label={t('Global.Message')}
          returnKeyType="next"
          value={contactUsDescription}
          onChangeText={text => setContactUsDescription(text)}
          autoCapitalize="none"
          multiline={true}
          maxLength={maxLength}
          numberOfLines={10}
        />
      </View>
      <View>
        {maxLength && (
          <Text style={styles.characterText}>
            {contactUsDescription.length}/{maxLength}{' '}
            {t('AddEvent.CharacterCount')}
          </Text>
        )}
      </View>
    </View>
  );
};
