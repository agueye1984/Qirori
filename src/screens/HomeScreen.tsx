import {Image, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native'
import {useTranslation} from 'react-i18next'
import DefaultComponentsThemes from '../defaultComponentsThemes'
import Header from '../components/Header'
import React from 'react'
import {AccueilList} from '../components/AccueilList'
import {Accueil} from '../contexts/types'
import {useNavigation} from '@react-navigation/native'
import {AccueilItem} from '../components/AccueilItem'
import Icon from 'react-native-vector-icons/FontAwesome'
import {theme} from '../core/theme'
import auth from '@react-native-firebase/auth'
import Icon1 from 'react-native-vector-icons/AntDesign'

const HomeScreen = () => {
  const {t} = useTranslation()
  const accueil = AccueilList(t)
  const {navigate} = useNavigation()

  function handleSelection(item: Accueil) {
    navigate(item.route as never)
  }

  const logout = () => {
    auth()
      .signOut()
      .then(() => navigate('LoginScreen' as never))
  }

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
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        {/* Header Row */}
        <View style={styles.headerRow}>
          <Image source={require('../assets/logo.png')} style={styles.logo} />
          <TouchableOpacity onPress={logout}>
            <Icon1 name="logout" color={theme.colors.primary} size={50} />
          </TouchableOpacity>
        </View>

        {/* Add Event Button */}
        <View style={styles.centeredRow}>
          <TouchableOpacity onPress={() => navigate('AddEvent' as never)}>
            <Icon name="calendar-plus-o" color={theme.colors.primary} size={60} />
          </TouchableOpacity>
        </View>

        {/* Title */}
        <Header>{t('HomeScreen.title')}</Header>

        {/* Content */}
        <View style={styles.content}>
          {accueil.map((item: Accueil) => (
            <AccueilItem key={item.id} item={item} action={() => handleSelection(item)} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
    
  )
}

export default HomeScreen
