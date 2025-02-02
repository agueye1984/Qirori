import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import DefaultComponentsThemes from '../defaultComponentsThemes';
import Header from '../components/Header';
import React from 'react';
import {Accueil} from '../contexts/types';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/AntDesign';
import {theme} from '../core/theme';
import {DashboardList} from '../components/DashboardList';
import {DashboardItem} from '../components/DashboardItem';
import auth from '@react-native-firebase/auth';

const Dashboard = () => {
  const {t} = useTranslation();
  const dashboard = DashboardList(t);
  const {navigate} = useNavigation();

  function handleSelection(item: Accueil) {
    navigate(item.route as never);
  }

  const logout = () => {
    auth()
      .signOut()
      .then(() => navigate('LoginScreen' as never));
  };

  const styles = StyleSheet.create({
    safeContainer: {
      flex: 1,
      backgroundColor: '#fff',
    },
    scrollContainer: {
      padding: 10,
      flexGrow: 1,
    },
    headerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
    },
    logo: {
      width: 50,
      height: 50,
    },
    centeredRow: {
      alignItems: 'center',
      marginVertical: 20,
    },
    content: {
      flex: 1,
      paddingHorizontal: 10,
    },
  });

  return (
    <SafeAreaView style={styles.safeContainer}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled">
        <View style={styles.headerRow}>
          <Image source={require('../assets/logo.png')} style={styles.logo} />
          <TouchableOpacity onPress={logout}>
            <Icon name="logout" color={theme.colors.primary} size={30} />
          </TouchableOpacity>
        </View>
        <Header>{t('HomeScreen.title')}</Header>
        <View style={styles.content}>
          {dashboard.map((item: Accueil) => (
            <DashboardItem
              key={item.id}
              item={item}
              action={() => handleSelection(item)}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Dashboard;
