import {RouteProp, useNavigation, useRoute} from '@react-navigation/native'
import React, {useEffect, useState} from 'react'
import {SafeAreaView, ScrollView, Text, View} from 'react-native'
import Header from '../components/Header'
import {ManageEventsParamList, User} from '../contexts/types'
import {useTranslation} from 'react-i18next'
import {heightPercentageToDP as heightToDp} from 'react-native-responsive-screen'
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
import CartItemOrder from '../components/CartItemOrder'
import {Paragraph} from 'react-native-paper'
import {BacktoShop} from '../components/BacktoShop'
import DefaultComponentsThemes from '../defaultComponentsThemes'

export const CommandesEffectuees = () => {
  const currentUser = auth().currentUser
  const route = useRoute<RouteProp<ManageEventsParamList, 'CommandesEffectuees'>>()
  const item = route.params.item
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const {t, i18n} = useTranslation()
  const shippingAddress = item.adresse
  const carts = item.paniers
  const navigation = useNavigation()
  const defaultStyles = DefaultComponentsThemes()
  const dateDelivered = item.dateDelivered === undefined ? '' : item.dateDelivered
  let dateLivery = dateDelivered
  if (dateLivery != '') {
    const annee = parseInt(dateDelivered.substring(0, 4))
    const mois = parseInt(dateDelivered.substring(4, 6)) - 1
    const jour = parseInt(dateDelivered.substring(6, 8))
    const date = new Date(annee, mois, jour, 0, 0, 0)

    const selectedLanguageCode = i18n.language
    dateLivery = date.toLocaleDateString(selectedLanguageCode, {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

  useEffect(() => {
    const usersRef = firestore().collection('users')
    auth().onAuthStateChanged((user) => {
      if (user) {
        usersRef
          .doc(user.uid)
          .get()
          .then((document) => {
            const userData = document.data() as User
            setName(userData.displayName)
            setEmail(userData.email)
            setPhone(userData.phoneNumber)
          })
          .catch((error) => {
            console.log('error1 ' + error)
          })
      }
    })
  }, [])

  return (
    <SafeAreaView>
      <BacktoShop textRoute={t('Achats.title')} goBack={() => navigation.navigate('Achats' as never)} />
      <Header>{t('Order.title')}</Header>
      <View style={defaultStyles.address}>
        <View style={{marginTop: heightToDp(1), marginBottom: heightToDp(1)}}>
          <Paragraph>
            {t('Order.paragraph')} : {dateLivery}
          </Paragraph>
        </View>
      </View>
      <View style={defaultStyles.address}>
        <Text style={defaultStyles.title}>{t('Checkout.InfoPersonal')}</Text>
        <View style={{marginTop: heightToDp(1), marginBottom: heightToDp(1)}}>
          <View style={[defaultStyles.itemContainerForm]}>
            <Text style={{marginVertical: 15, marginLeft: 5}}>
              {t('Checkout.Name')} : {name} {t('Checkout.Email')} : {email}
            </Text>
            <Text style={{marginVertical: 15, marginLeft: 5}}>
              {t('Checkout.Phone')} : {phone}
            </Text>
          </View>
        </View>
      </View>
      <View style={defaultStyles.address}>
        <Text style={defaultStyles.title}>{t('Checkout.ShippingAddress')}</Text>
        <View style={{marginTop: heightToDp(1), marginBottom: heightToDp(1)}}>
          <View style={[defaultStyles.itemContainerForm1]}>
            <Text style={{marginVertical: 15, marginLeft: 5}}>
              {t('Checkout.AdresseLine1')} : {shippingAddress.address_line_1}
            </Text>
            <Text style={{marginVertical: 15, marginLeft: 5}}>
              {t('Checkout.AdresseLine2')} : {shippingAddress.address_line_2}
            </Text>
            <Text style={{marginVertical: 15, marginLeft: 5}}>
              {t('Checkout.City')} : {shippingAddress.city} {t('Checkout.Province')} : {shippingAddress.province}
            </Text>
            <Text style={{marginVertical: 15, marginLeft: 5}}>
              {t('Checkout.PostalCode')} : {shippingAddress.postalCode}
            </Text>
          </View>
        </View>
      </View>
      <View style={defaultStyles.address}>
        <Text style={defaultStyles.title}>{t('Cart.items')}</Text>
        <ScrollView
          scrollEnabled
          showsVerticalScrollIndicator
          automaticallyAdjustKeyboardInsets={true}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={defaultStyles.scrollViewContent}>
          {carts.map((panier, index) => (
            <CartItemOrder key={index} panier={panier} />
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  )
}
