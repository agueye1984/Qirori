import {SafeAreaView, ScrollView, TouchableOpacity, View} from 'react-native'
import {useTranslation} from 'react-i18next'
import DefaultComponentsThemes from '../defaultComponentsThemes'
import Header from '../components/Header'
import React, {useEffect, useState} from 'react'
import {User} from '../contexts/types'
import {useNavigation} from '@react-navigation/native'
import Icon from 'react-native-vector-icons/AntDesign'
import {theme} from '../core/theme'
import Icon1 from 'react-native-vector-icons/MaterialIcons'
import firestore from '@react-native-firebase/firestore'
import auth from '@react-native-firebase/auth'
import {LargeButton} from '../components/LargeButton'
import AdminLists from '../components/AdminLists'

const Administrators = () => {
  const {t} = useTranslation()
  const defaultStyles = DefaultComponentsThemes()
  const navigation = useNavigation()
  const [admins, setAdmins] = useState<User[]>([])

  useEffect(() => {
    firestore()
      .collection('users')
      .where('profilId', '==', '1')
      .get()
      .then((querySnapshot) => {
        if (querySnapshot.empty) {
          setAdmins([])
        } else {
          const users: User[] = []
          querySnapshot.forEach((documentSnapshot) => {
            users.push(documentSnapshot.data() as User)
          })
          setAdmins(users)
        }
      })
  }, [admins])

  const logout = () => {
    auth()
      .signOut()
      .then(() => navigation.navigate('LoginScreen' as never))
  }

  return (
    <SafeAreaView>
      <View style={{padding: 20}}>
        <View style={defaultStyles.row}>
          <View style={defaultStyles.leftSectRowContainer}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Icon1 name={'arrow-back-ios'} color={theme.colors.primary} size={30} />
            </TouchableOpacity>
          </View>
          <View style={defaultStyles.rightSectRowContainer}>
            <View style={{paddingRight: 5, paddingBottom: 7}}>
              <TouchableOpacity onPress={logout}>
                <Icon name={'logout'} color={theme.colors.primary} size={30} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
      <Header>{t('DashboardList.Administrators')}</Header>
      <View style={{justifyContent: 'center', alignContent: 'center'}}>
        <LargeButton
          isPrimary
          title={t('Administrators.AddButtonText')}
          action={() => navigation.navigate('AddAdmin' as never)}
        />

        <ScrollView
          scrollEnabled
          showsVerticalScrollIndicator
          automaticallyAdjustKeyboardInsets={true}
          keyboardShouldPersistTaps="handled">
          {admins.map((item: User, index: number) => {
            return <AdminLists key={index.toString()} user={item} color={theme.colors.black} />
          })}
        </ScrollView>
      </View>
    </SafeAreaView>
  )
}

export default Administrators
