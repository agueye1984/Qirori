import React from 'react';
import { useTranslation } from 'react-i18next';
import { View, StyleSheet } from 'react-native';
import {TextInput as PaperTextInput} from 'react-native-paper';
import { theme } from '../core/theme';

interface SearchBarProps {
  setSearchQuery: (query: string) => void;
}

const SearchBarQuery: React.FC<SearchBarProps> = ({ setSearchQuery }) => {
  const {t} = useTranslation()
  return (
    <View style={styles.container}>
      <PaperTextInput
        style={styles.input}
        placeholder={t('Global.Search')+'...'}
        returnKeyType="done"
        onChangeText={(text) => setSearchQuery(text)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  input: {
    backgroundColor: theme.colors.surface,
  },
});

export default SearchBarQuery;
