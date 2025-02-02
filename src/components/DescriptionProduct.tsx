import React from 'react';
import {useTranslation} from 'react-i18next';
import {Keyboard, NativeSyntheticEvent, StyleSheet, Text, TextInputKeyPressEventData, View} from 'react-native';
import {theme} from '../core/theme';
import { TextInput as PaperTextInput } from 'react-native-paper';
import DefaultComponentsThemes from '../defaultComponentsThemes';

type Props = {
  productDescription: string;
  setProductDescription: (value: string) => void;
  maxLength?: number;
  error: string;
};

export const DescriptionProduct = ({
  productDescription,
  setProductDescription,
  maxLength,
  error
}: Props) => {
  const {t} = useTranslation();
  const defaultStyles = DefaultComponentsThemes();

  const styles = StyleSheet.create({
    characterText: {
      textAlign: 'right',
      color: theme.colors.primaryText,
      fontSize: 14,
      justifyContent: 'flex-start',
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

  const handleKeyPress = (event: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
    if (event.nativeEvent.key === 'Enter') {
      Keyboard.dismiss(); // Masquer le clavier
    }
  };

  return (
    <View style={defaultStyles.sectionStyle}>
      <View>
        <PaperTextInput
          label={t('AddProduct.Description')}
          returnKeyType="done"
          value={productDescription}
          onChangeText={text => setProductDescription(text)}
          autoCapitalize="none"
          multiline={true}
          maxLength={maxLength}
          numberOfLines={4}
          style={error ? [styles.input, styles.inputError] : styles.input }
          onSubmitEditing={Keyboard.dismiss}
          onKeyPress={handleKeyPress} // Interception de la touche "Entrée"
        />
      </View>
      <View>
        {maxLength && (
          <Text style={styles.characterText}>
            {productDescription.length}/{maxLength}{' '}
            {t('AddEvent.CharacterCount')}
          </Text>
        )}
      </View>
    </View>
  );
};
