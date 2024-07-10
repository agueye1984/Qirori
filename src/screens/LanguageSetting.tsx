import React from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet, View} from 'react-native';
import LanguageSelector from '../components/LanguageSelector';
import {SafeAreaView} from 'react-native-safe-area-context';
import {BacktoHome} from '../components/BacktoHome';
import Header from '../components/Header';

export const LanguageSetting = () => {
  const {t} = useTranslation();

  const styles = StyleSheet.create({
    section: {
      marginHorizontal: 20,
      paddingVertical: 20,
    },
    row: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    itemContainerForm: {
      height: 50,
      marginHorizontal: 5,
      borderWidth: 0.4,
      //flex: 1,
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
      borderBottomRightRadius: 10,
      borderBottomLeftRadius: 10,
    },

    itemContainerForm1: {
      height: 250,
      marginHorizontal: 5,
      borderWidth: 0.4,
      //flex: 1,
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
      borderBottomRightRadius: 10,
      borderBottomLeftRadius: 10,
    },
    itemSeparator: {
      //height: 40,
      marginHorizontal: 15,
      alignItems: 'center',
      justifyContent: 'center',
      borderBottomWidth: 0.2,
    },
  });

  return (
    <SafeAreaView>
      <BacktoHome textRoute={t('Setting.title')} />
      <Header>{t('Setting.LanguageSetting')}</Header>
      <View style={styles.section}>
        <LanguageSelector />
      </View>
    </SafeAreaView>
  );
};
