import React from 'react';
import {View, SafeAreaView, FlatList} from 'react-native';
import {useTranslation} from 'react-i18next';
import Header from '../components/Header';
import {BacktoHome} from '../components/BacktoHome';
import {ManageEventsParamList} from '../contexts/types';
import {useNavigation} from '@react-navigation/native';
import {CategoryList} from '../components/CategoryList';
import {CategoryView} from '../components/CategoryView';
import {StackNavigationProp} from '@react-navigation/stack';

type serviceOfferProp = StackNavigationProp<
  ManageEventsParamList,
  'ServicesOffertsList'
>;

export const RequestService = () => {
  const {t} = useTranslation();
  const categories = CategoryList(t);
  const navigation = useNavigation<serviceOfferProp>();

  return (
    <SafeAreaView>
       <BacktoHome textRoute={t('HomeScreen.title')} />
      <Header>{t('Achats.title')}</Header>
      <View>
        <FlatList
          style={{margin: 5}}
          data={categories}
          numColumns={2}
          keyExtractor={(item, index) => item.id}
          renderItem={item => (
            <CategoryView
              name={item.item.name}
              key={item.index.toString()}
              onPress={() => {
                navigation.navigate('ServicesOffertsList', {
                  item: item.item.id,
                });
              }}
            />
          )}
        />
      </View>
    </SafeAreaView>
  );
};
