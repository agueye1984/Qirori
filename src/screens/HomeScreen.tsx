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
import {LargeButton} from '../components/LargeButton'
import Icon1 from 'react-native-vector-icons/AntDesign'

const HomeScreen = () => {
  const {t} = useTranslation()
  const defaultStyles = DefaultComponentsThemes()
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
    img: {
      width: '30%',
      resizeMode: 'contain',
      paddingRight: 50,
    },
    row: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    rowCenter: {
      flex: 1, // Pour que l'icône occupe de l'espace
      justifyContent: 'center', // Centré verticalement
      alignItems: 'center', // Centré horizontalement
    },
  })
  return (
    <SafeAreaView>
      <ScrollView style={{padding: 10}}>
        <View style={styles.row}>
          <View style={defaultStyles.leftSectRowContainer}>
            <Image source={require('../assets/logo.png')} style={{width: 80, height: 80}} />
          </View>
          <View style={defaultStyles.rightSectRowContainer}>
            <TouchableOpacity onPress={logout}>
              <Icon1 name={'logout'} color={theme.colors.primary} size={50} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.rowCenter}>
          <TouchableOpacity onPress={() => navigate('AddEvent' as never)}>
            <Icon name={'calendar-plus-o'} color={theme.colors.primary} size={60} />
          </TouchableOpacity>
        </View>
        <Header>{t('HomeScreen.title')}</Header>
        <View style={{justifyContent: 'center', alignContent: 'center', flex: 1}}>
          <View style={{padding: 10}}>
            {accueil.map((item: Accueil) => {
              return <AccueilItem key={item.id} item={item} action={() => handleSelection(item)} />
            })}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default HomeScreen
