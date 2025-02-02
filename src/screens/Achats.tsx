import React, {useEffect, useState} from 'react';
import {View, SafeAreaView, FlatList, StyleSheet} from 'react-native';
import {useTranslation} from 'react-i18next';
import Header from '../components/Header';
import {BacktoHome} from '../components/BacktoHome';
import {Category, ManageEventsParamList} from '../contexts/types';
import {useNavigation} from '@react-navigation/native';
import {CategoryView} from '../components/CategoryView';
import {StackNavigationProp} from '@react-navigation/stack';
import firestore from '@react-native-firebase/firestore';

type serviceOfferProp = StackNavigationProp<
  ManageEventsParamList,
  'ServicesOffertsList'
>;

export const Achats = () => {
  const {t, i18n} = useTranslation();
  const navigation = useNavigation<serviceOfferProp>();
  const selectLangue = i18n.language;
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('categories')
      .onSnapshot(querySnapshot => {
        if (querySnapshot.empty) {
          setCategories([]);
        } else {
          const newCat: Category[] = [];
          querySnapshot.forEach(documentSnapshot => {
            const catData = documentSnapshot.data() as Category;
            catData.id = documentSnapshot.id; // ajouter l'id du document
            newCat.push(catData);
          });
          setCategories(newCat);
        }
      });

    // Nettoyage de l'écouteur lors du démontage du composant
    return () => unsubscribe();
  }, []);

  const styles = StyleSheet.create({
    container: {
      flex: 1, // Prend tout l'espace disponible
      paddingTop: 20,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <BacktoHome textRoute={t('HomeScreen.title')} />
      <Header>{t('Achats.title')}</Header>
      <View style={{flex: 1, justifyContent: 'center', alignContent: 'center'}}>
        <FlatList
          style={{margin: 5}}
          data={categories}
          numColumns={1}
          keyExtractor={item => item.id}
          renderItem={item => (
            <CategoryView
              name={selectLangue === 'fr' ? item.item.nameFr : item.item.nameEn}
              key={item.index}
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
