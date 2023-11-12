import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  FlatList,
} from 'react-native';
import DefaultComponentsThemes from '../defaultComponentsThemes';
import {useTheme} from '../contexts/theme';

import {useTranslation} from 'react-i18next';
import Header from '../components/Header';
import {BacktoHome} from '../components/BacktoHome';
import {SettingsList} from '../components/SettingsList';
import {Accueil, ManageEventsParamList} from '../contexts/types';
import {SettingsItem} from '../components/SettingsItem';
import {useNavigation} from '@react-navigation/native';
import {CategoryList} from '../components/CategoryList';
import {CategoryView} from '../components/CategoryView';
import { StackNavigationProp } from '@react-navigation/stack';

type serviceOfferProp = StackNavigationProp<ManageEventsParamList, 'ServicesOffertsList'>

export const RequestService = () => {
  const defaultStyles = DefaultComponentsThemes();
  const {ColorPallet} = useTheme();
  const {t} = useTranslation();
  const categories = CategoryList(t);
  const navigation = useNavigation<serviceOfferProp>()

  const styles = StyleSheet.create({
    img: {
      width: '30%',
      resizeMode: 'contain',
      paddingRight: 50,
    },
    row: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
  });

  return (
    <SafeAreaView>
      <BacktoHome textRoute={t('HomeScreen.title')} />
      <Header>{t('RequestService.title')}</Header>
      <View>
        <FlatList
          style={{margin: 5}}
          data={categories}
          numColumns={2}
          keyExtractor={(item, index) => item.id}
          renderItem={item => <CategoryView name={item.item.name} onPress={() => {
            navigation.navigate('ServicesOffertsList', {
              item: item.item.id,
            });
          }}/>}
        />
      </View>
    </SafeAreaView>
  );
};
