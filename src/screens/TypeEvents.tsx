import React, {useEffect, useState} from 'react';
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import Header from '../components/Header';
import {useNavigation} from '@react-navigation/native';
import {TypeEvent} from '../contexts/types';
import Icon from 'react-native-vector-icons/AntDesign';
import {theme} from '../core/theme';
import Icon1 from 'react-native-vector-icons/MaterialIcons';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import TypeEventLists from '../components/TypeEventLists';
import {LargeButton} from '../components/LargeButton';

export const TypeEvents = () => {
  const {t} = useTranslation();
  const navigation = useNavigation();
  const [typeEvents, setTypeEvents] = useState<TypeEvent[]>([]);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('type_events')
      .onSnapshot(querySnapshot => {
        if (querySnapshot.empty) {
          setTypeEvents([]);
        } else {
          const newTypeEvent: TypeEvent[] = [];
          querySnapshot.forEach(documentSnapshot => {
            const typeEventData = documentSnapshot.data() as TypeEvent;
            typeEventData.id = documentSnapshot.id; // ajouter l'id du document
            newTypeEvent.push(typeEventData);
          });
          setTypeEvents(newTypeEvent);
        }
      });

    // Nettoyage de l'écouteur lors du démontage du composant
    return () => unsubscribe();
  }, []);

  const logout = () => {
    auth()
      .signOut()
      .then(() => navigation.navigate('LoginScreen' as never));
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1, // Prend tout l'espace disponible
      paddingTop: 20,
    },
    headerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
      padding: 20,
    },
    addEventButtonContainer: {
      alignItems: 'center',
      marginVertical: 15,
    },
    flatListContainer: {
      paddingBottom: 20,
    },
  });

  return (
    <SafeAreaView style={[styles.container]}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon1
            name={'arrow-back-ios'}
            color={theme.colors.primary}
            size={30}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={logout}>
          <Icon name="logout" color={theme.colors.primary} size={30} />
        </TouchableOpacity>
      </View>
      <Header>{t('TypeEvents.title')}</Header>
      <View style={styles.addEventButtonContainer}>
        <LargeButton
          isPrimary
          title={t('TypeEvents.AddButtonText')}
          action={() => navigation.navigate('AddTypeEvent' as never)}
        />
      </View>
      <Header>{t('TypeEvents.List')}</Header>
      <FlatList
        data={typeEvents}
        renderItem={({item}) => (
          <TypeEventLists typeEvent={item} color={theme.colors.black} />
        )}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.flatListContainer}
      />
      
    </SafeAreaView>
  );
};
