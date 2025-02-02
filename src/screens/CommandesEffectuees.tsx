import {RouteProp, useNavigation, useRoute} from '@react-navigation/native'
import React, {useEffect, useState} from 'react'
import {FlatList, SafeAreaView, StyleSheet, Text, View} from 'react-native'
import Header from '../components/Header'
import {ManageEventsParamList, User} from '../contexts/types'
import {useTranslation} from 'react-i18next'
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
import CartItemOrder from '../components/CartItemOrder'
import {Paragraph} from 'react-native-paper'
import {BacktoShop} from '../components/BacktoShop'
import DefaultComponentsThemes from '../defaultComponentsThemes'
import { theme } from '../core/theme'

export const CommandesEffectuees = () => {
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

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f5f5f5',
    },
    button: {
      width: '90%',
      paddingVertical: 15,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.primary,
      alignSelf: 'center',
    },
    buttonText: {
      fontSize: 16,
      color: '#fff',
      textAlign: 'center',
    },
    bottomButtonContainer: {
      padding: 10,
      borderTopWidth: 1,
      borderColor: '#ccc',
      backgroundColor: '#fff',
    },
    eventItemContainer: {
      marginVertical: 10,
      padding: 15,
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 8,
      backgroundColor: '#f9f9f9',
      // Ajoutez ces styles pour l'espacement
      marginHorizontal: 10, // Assure un espacement des côtés gauche/droit
    },
    label: {
      fontSize: 14,
      fontWeight: 'bold',
    },
    label1: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    labelContainer: {
      flex: 1,
    },
    container1: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 5,
      backgroundColor: '#f5f5f5',
      borderRadius: 8,
      marginVertical: 5,
      marginHorizontal: 10,
    },
  });

  const data = [
    {key: 'header', component: <Header>{t('Order.title')}</Header>},
    {key: 'dateDelivered', component: (
      <View style={defaultStyles.section}>
        <View style={styles.container1}>
        <Paragraph>
            {t('Order.paragraph')} : {dateLivery}
          </Paragraph>
          </View>
      </View>
    )
    
    },
    {
      key: 'info',
      component: (
        <View style={defaultStyles.section}>
          <View style={styles.container1}>
            <Text style={styles.label1}>{t('Checkout.InfoPersonal')}</Text>
          </View>
          <View style={defaultStyles.itemContainerFormInvite}>
            <View style={styles.container1}>
              <View style={styles.labelContainer}>
                <Text>
                  <Text style={styles.label}>{t('Checkout.Name')} : </Text>
                  {name}
                </Text>
              </View>
            </View>
            <View style={styles.container1}>
              <View style={styles.labelContainer}>
                <Text>
                  <Text style={styles.label}>{t('Checkout.Email')} : </Text>
                  {email}
                </Text>
              </View>
            </View>
            <View style={styles.container1}>
              <View style={styles.labelContainer}>
                <Text>
                  <Text style={styles.label}>{t('Checkout.Phone')} : </Text>
                  {phone}
                </Text>
              </View>
            </View>
          </View>
        </View>
      ),
    },
    {
      key: 'shipping',
      component: (
        <View style={defaultStyles.section}>
          <View style={styles.container1}>
            <Text style={styles.label1}>{t('Checkout.ShippingAddress')}</Text>
          </View>
          <View style={defaultStyles.itemContainerFormInvite}>
            <View style={styles.container1}>
              <View style={styles.labelContainer}>
                <Text>
                  <Text style={styles.label}>
                    {t('Checkout.AdresseLine1')} :{' '}
                  </Text>
                  {shippingAddress.address_line_1}
                </Text>
              </View>
            </View>
            <View style={styles.container1}>
              <View style={styles.labelContainer}>
                <Text>
                  <Text style={styles.label}>
                    {t('Checkout.AdresseLine2')} :{' '}
                  </Text>
                  {shippingAddress.address_line_2}
                </Text>
              </View>
            </View>
            <View style={styles.container1}>
              <View style={styles.labelContainer}>
                <Text>
                  <Text style={styles.label}>{t('Checkout.City')} : </Text>
                  {shippingAddress.city}
                </Text>
              </View>
            </View>
            <View style={styles.container1}>
              <View style={styles.labelContainer}>
                <Text>
                  <Text style={styles.label}>{t('Checkout.Province')} : </Text>
                  {shippingAddress.province}
                </Text>
              </View>
            </View>
            <View style={styles.container1}>
              <View style={styles.labelContainer}>
                <Text>
                  <Text style={styles.label}>
                    {t('Checkout.PostalCode')} :{' '}
                  </Text>
                  {shippingAddress.postalCode}
                </Text>
              </View>
            </View>
          </View>
        </View>
      ),
    },
    {
      key: 'paniers',
      component:  (
        <View style={defaultStyles.section}>
          <View style={styles.container1}>
            <Text style={styles.label1}>{t('Cart.items')}</Text>
          </View>
          {carts.map((panier, index) => (
            <CartItemOrder key={index} panier={panier} />
          ))}
        </View>
        ),
    },
  ];


  return (
    <SafeAreaView style={styles.container}>
      <BacktoShop textRoute={t('Achats.title')} goBack={() => navigation.navigate('Achats' as never)} />
      <FlatList
        data={data}
        renderItem={({item}) => <View>{item.component}</View>}
        keyExtractor={item => item.key}
        contentContainerStyle={[
          defaultStyles.scrollViewContent,
          {paddingBottom: 100},
        ]}
      />
    </SafeAreaView>
  )
}
