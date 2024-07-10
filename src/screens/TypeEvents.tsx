import React, {useEffect, useState} from 'react';
import {SafeAreaView, ScrollView, StyleSheet, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import Header from '../components/Header';
import {useNavigation} from '@react-navigation/native';
import {TypeEvent, User} from '../contexts/types';
import {theme} from '../core/theme';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import TypeEventLists from '../components/TypeEventLists';
import {LargeButton} from '../components/LargeButton';
import Paragraph from '../components/Paragraph';
import defaultComponentsThemes from '../defaultComponentsThemes';

export const TypeEvents = () => {
  const {t,i18n} = useTranslation();
  const navigation = useNavigation();
  const [userId, setUserId] = useState('');
  const [typeEvents, setTypeEvents] = useState<TypeEvent[]>([]);
  const defaultStyles = defaultComponentsThemes();
  const selectLanguage = i18n.language;

  useEffect(() => {
    const usersRef = firestore().collection('users');
    auth().onAuthStateChanged(user => {
      if (user) {
        usersRef
          .doc(user.uid)
          .get()
          .then(document => {
            const userData = document.data() as User;
            setUserId(userData.id);
          })
          .catch(error => {
            console.log('error1 ' + error);
          });
      }
    });
  }, []);

  useEffect(() => {
    var db = firestore()
    var typeEventsRef = db.collection("type_events") 
    let query = typeEventsRef.where('nameEn', '==', '');
    if(selectLanguage=='fr'){
      query = typeEventsRef.where('nameFr', '==', '');
    }
//    query.get().then
 // var queryByAdminOrAge= typeEventsRef.where(Filter.OR or(Filter.equalTo("nameFr", ''),Filter.equalTo("nameEn", '')));
//  console.log(queryByAdminOrAge);
//    firestore()
//      .collection('type_events')
//      .where(Filter.or(Filter('name', '==', 'Ada'), Filter('name', '==', 'Bob')))
    query.get()
      .then(querySnapshot => {
        if (querySnapshot.empty) {
          setTypeEvents([]);
        } else {
          const typeEvent: TypeEvent[] = [];
          querySnapshot.forEach(documentSnapshot => {
            typeEvent.push(documentSnapshot.data() as TypeEvent);
          });
          setTypeEvents(typeEvent);
        }
      });
  }, [userId, typeEvents]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
    },
    buttonsContainer: {
    paddingBottom: 50,
    paddingTop: 50,
  },
  });

  return (
    <SafeAreaView style={[styles.container]}>
      <Header>{t('TypeEvents.title')}</Header>
        
      <View style={{justifyContent: 'center', alignContent: 'center'}}>
      <LargeButton
          isPrimary
          title={t('TypeEvents.AddButtonText')}
          action={() => navigation.navigate('AddTypeEvent' as never)}
        />
        <Header>{t('TypeEvents.List')}</Header>
        
        {typeEvents.length === 0 && (
          <Paragraph>{t('TypeEvents.EmptyList')}</Paragraph>
        )}
        <ScrollView scrollEnabled showsVerticalScrollIndicator>
          {typeEvents.map((item: TypeEvent, index: number) => {
            return (
              <TypeEventLists
                key={index.toString()}
                typeEvent={item}
                color={theme.colors.black}
              />
            );
          })}
        </ScrollView>
        <View style={styles.buttonsContainer}>
          <LargeButton
            title={t('Global.Cancel')}
            action={() => navigation.goBack()}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};
