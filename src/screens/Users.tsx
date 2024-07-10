import {Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import {useTranslation} from 'react-i18next'
import DefaultComponentsThemes from '../defaultComponentsThemes'
import Header from '../components/Header'
import React, {useEffect, useState} from 'react'
import {Accueil, User} from '../contexts/types'
import {useNavigation} from '@react-navigation/native'
import Icon from 'react-native-vector-icons/AntDesign'
import {theme} from '../core/theme'
import {DashboardList} from '../components/DashboardList'
import {DashboardItem} from '../components/DashboardItem'
import Icon1 from 'react-native-vector-icons/MaterialIcons'
import auth from '@react-native-firebase/auth'
import {LargeButton} from '../components/LargeButton'
import firestore from '@react-native-firebase/firestore'
import UserLists from '../components/UserLists'

const Users = () => {
  const {t} = useTranslation()
  const defaultStyles = DefaultComponentsThemes()
  const navigation = useNavigation()
  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    firestore()
      .collection('users')
      .where('profilId', '==', '2')
      .get()
      .then((querySnapshot) => {
        if (querySnapshot.empty) {
          setUsers([])
        } else {
          const users: User[] = []
          querySnapshot.forEach((documentSnapshot) => {
            users.push(documentSnapshot.data() as User)
          })
          setUsers(users)
        }
      })
  }, [users])

  const logout = () => {
    auth()
      .signOut()
      .then(() => navigation.navigate('LoginScreen' as never))
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
  })
  return (
    <SafeAreaView>
      <View style={{padding: 20}}>
        <View style={styles.row}>
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
      <Header>{t('DashboardList.Users')}</Header>
      <View style={{justifyContent: 'center', alignContent: 'center'}}>
        <ScrollView style={{padding: 10}} scrollEnabled>
          {users.map((item: User, index: number) => {
            return <UserLists key={index.toString()} user={item} color={theme.colors.black} />
          })}
        </ScrollView>
      </View>
    </SafeAreaView>
  )
}

export default Users
