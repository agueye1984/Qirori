import React from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet, View} from 'react-native';
import { theme } from '../core/theme';
import DefaultComponentsThemes from '../defaultComponentsThemes';
import { TextInput as PaperTextInput } from 'react-native-paper';

type Props = {
  productPrixUnitaire: string;
  setProductPrixUnitaire: (value: string) => void;
  error: string;
};

export const PrixUnitaireProduct = ({
  productPrixUnitaire,
  setProductPrixUnitaire,
  error
}: Props) => {
  const {t} = useTranslation();
  const defaultStyles = DefaultComponentsThemes();

  const styles = StyleSheet.create({
    container: {
      width: '100%',
      padding: 10,
      backgroundColor: '#f5f5f5',
      borderRadius: 8,
    },
    inputStyle: {
      paddingVertical: 16,
      paddingHorizontal: 16,
      backgroundColor: 'white',
      borderRadius: 20,
      color: 'black',
      fontSize: 16,
    },
    predictionsContainer: {
      backgroundColor: 'white',
      padding: 10,
      // borderBottomLeftRadius: 10,
      // borderBottomRightRadius: 10
    },
    predictionRow: {
      paddingBottom: 15,
      marginBottom: 15,
      borderBottomColor: 'black',
      borderBottomWidth: 1,
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

  return (
    <View style={defaultStyles.sectionStyle}>
      <PaperTextInput
        label={t('AddProduct.PrixUnitaire')}
        returnKeyType="done"
        value={productPrixUnitaire}
        onChangeText={text => setProductPrixUnitaire(text)}
        autoCapitalize="none"
        keyboardType="number-pad"
        style={error ? [styles.input, styles.inputError] : styles.input }
      />
    </View>
  );
};
