import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import DefaultComponentsThemes from '../defaultComponentsThemes';
import Header from '../components/Header';
import React, {useEffect, useState} from 'react';
import {User} from '../contexts/types';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/AntDesign';
import {theme} from '../core/theme';
import Icon1 from 'react-native-vector-icons/MaterialIcons';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {LargeButton} from '../components/LargeButton';
import AdminLists from '../components/AdminLists';

const Administrators = () => {
  const {t} = useTranslation();
  const navigation = useNavigation();
  const [admins, setAdmins] = useState<User[]>([]);

  useEffect(() => {
    firestore()
      .collection('users')
      .where('profilId', '==', '1')
      .get()
      .then(querySnapshot => {
        if (querySnapshot.empty) {
          setAdmins([]);
        } else {
          const users: User[] = [];
          querySnapshot.forEach(documentSnapshot => {
            users.push(documentSnapshot.data() as User);
          });
          setAdmins(users);
        }
      });
  }, [admins]);

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
    <SafeAreaView style={styles.container}>
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
      <Header>{t('DashboardList.Administrators')}</Header>
      <View style={styles.addEventButtonContainer}>
        <LargeButton
          isPrimary
          title={t('Administrators.AddButtonText')}
          action={() => navigation.navigate('AddAdmin' as never)}
        />
      </View>
      <FlatList
        data={admins}
        renderItem={({item}) => (
          <AdminLists user={item} color={theme.colors.black} />
        )}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.flatListContainer}
      />
    </SafeAreaView>
  );
};

export default Administrators;
