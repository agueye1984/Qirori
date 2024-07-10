import React from 'react';
import {View, SafeAreaView, ScrollView} from 'react-native';
import {useTranslation} from 'react-i18next';
import Header from '../components/Header';
import {BacktoHome} from '../components/BacktoHome';
import {SettingsList} from '../components/SettingsList';
import {Accueil} from '../contexts/types';
import {SettingsItem} from '../components/SettingsItem';
import {useNavigation} from '@react-navigation/native';

export const Settings = () => {
  const {t} = useTranslation();
  const settings = SettingsList(t);
  const {navigate} = useNavigation();

  function handleSelection(item: Accueil) {
    navigate(item.route as never);
  }
  return (
    <SafeAreaView style={{flex: 1}}>
      <ScrollView style={{padding: 10}}>
        <BacktoHome textRoute={t('HomeScreen.title')} />
        <Header>{t('Settings.title')}</Header>
        <View
          style={{justifyContent: 'center', alignContent: 'center', flex: 1}}>
          <View style={{padding: 10}}>
            {settings.map((item: Accueil) => {
              return (
                <SettingsItem
                  key={item.id}
                  item={item}
                  action={() => handleSelection(item)}
                />
              );
            })}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
