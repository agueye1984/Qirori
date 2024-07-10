import {Image, SafeAreaView, ScrollView, TouchableOpacity, View} from 'react-native'
import {useTranslation} from 'react-i18next'
import DefaultComponentsThemes from '../defaultComponentsThemes'
import Header from '../components/Header'
import React from 'react'
import {Accueil} from '../contexts/types'
import {useNavigation} from '@react-navigation/native'
import Icon from 'react-native-vector-icons/AntDesign'
import {theme} from '../core/theme'
import {DashboardList} from '../components/DashboardList'
import {DashboardItem} from '../components/DashboardItem'
import auth from '@react-native-firebase/auth'

const Dashboard = () => {
  const {t} = useTranslation()
  const defaultStyles = DefaultComponentsThemes()
  const dashboard = DashboardList(t)
  const {navigate} = useNavigation()

  function handleSelection(item: Accueil) {
    navigate(item.route as never)
  }

  const logout = () => {
    auth()
      .signOut()
      .then(() => navigate('LoginScreen' as never))
  }


  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={defaultStyles.row}>
        <View style={defaultStyles.leftSectRowContainer}>
          <Image source={require('../assets/logo.png')} style={{width: 60, height: 60}} />
        </View>
        <View style={defaultStyles.rightSectRowContainer}>
          <View style={{paddingRight: 5, paddingBottom: 7}}>
            <TouchableOpacity onPress={logout}>
              <Icon name={'logout'} color={theme.colors.primary} size={30} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <Header>{t('HomeScreen.title')}</Header>
      <ScrollView
        scrollEnabled
        showsVerticalScrollIndicator
        automaticallyAdjustKeyboardInsets={true}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={defaultStyles.scrollViewContent}>
        <View style={{justifyContent: 'center', alignContent: 'center', flex: 1}}>
          <View style={{padding: 10}}>
            {dashboard.map((item: Accueil) => {
              return <DashboardItem key={item.id} item={item} action={() => handleSelection(item)} />
            })}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Dashboard
