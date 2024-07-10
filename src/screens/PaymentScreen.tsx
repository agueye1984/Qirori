import React, {useState} from 'react'
import {View, SafeAreaView, StyleSheet, Text, Alert} from 'react-native'
import {CardField, useStripe, StripeProvider, CardFieldInput} from '@stripe/stripe-react-native'
import {BacktoHome} from '../components/BacktoHome'
import {useTranslation} from 'react-i18next'
import {StackNavigationProp} from '@react-navigation/stack'
import {ManageEventsParamList, Panier} from '../contexts/types'
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native'
import {useStore} from '../contexts/store'
import Header from '../components/Header'
import Button from '../components/Button'
import axios from 'axios'
import firestore from '@react-native-firebase/firestore'
import Config from 'react-native-config'

type PaymentScreenProp = StackNavigationProp<ManageEventsParamList, 'PaymentScreen'>

const PaymentScreen = () => {
  const {confirmPayment} = useStripe()
  const [clientSecret, setClientSecret] = useState('')
  const {t} = useTranslation()
  const route = useRoute<RouteProp<ManageEventsParamList, 'PaymentScreen'>>()
  const item = route.params.item
  const montant = route.params.mnt
  const type = route.params.type
  const amount = Number(parseFloat(montant) * 100).toFixed(0)
  const [state] = useStore()
  const [cardDetails, setCardDetails] = useState<CardFieldInput.Details | null>(null)
  const navigation = useNavigation<PaymentScreenProp>()

  const styles = StyleSheet.create({
    section: {
      marginHorizontal: 15,
      paddingVertical: 5,
    },
  })

  const fetchClientSecret = async () => {
    try {
      const response = await axios.post('https://us-central1-qirori-6a834.cloudfunctions.net/createPaymentIntent', {
        amount: parseInt(amount),
        currency: state.currency.toString(),
      })
      return response.data.clientSecret
    } catch (error) {
      console.error('Error fetching client secret:', error)
      return null
    }
  }

  const handlePayPress = async () => {
    if (!cardDetails?.complete) {
      Alert.alert('Error', 'Please enter complete card details')
      return
    }

    const clientSecret = await fetchClientSecret()
    if (!clientSecret) return

    const billingDetails = {
      name: 'Test Name',
    } //

    try {
      const {error, paymentIntent} = await confirmPayment(clientSecret, {
        paymentMethodType: 'Card',
        paymentMethodData: {
          billingDetails,
        },
      })

      if (error) {
        Alert.alert('Error', error.message)
      } else if (paymentIntent) {
        if (type === 'contribution') {
          firestore()
            .collection('contributions')
            .doc(item.id)
            .set({
              id: item.id,
              eventId: item.eventId,
              userId: item.userId,
              contribution: item.contribution,
              nature: item.nature,
              montant: montant,
              paymentId: paymentIntent.id,
            })
            .then(() => {
              console.log('Contributions added!')
              navigation.navigate('Contributions' as never)
              Alert.alert('Success', 'Payment successful' + paymentIntent.id)
            })
        }
        if (type === 'commande') {
          const commande = {...item, paymentId: paymentIntent?.id, orderId: paymentIntent?.id}
          firestore()
            .collection('addresses')
            .doc(item.id)
            .set(item.adresse)
            .then(() => {
              console.log('adama')
              firestore()
                .collection('commandes')
                .doc(item.id)
                .set(commande)
                .then(() => {
                  console.log('adama1')
                  item.paniers.map((panier: Panier) => {
                    firestore()
                      .collection('carts')
                      .doc(panier.id)
                      .update({
                        paid: true,
                        statut: '1',
                        dateDelivered: panier.dateDelivered,
                        commandeId: panier.id,
                      })
                      .then(() => {
                        console.log('Paniers updated!')
                      })
                  })
                  console.log('Commandes added!')
                  navigation.navigate('CommandesEffectuees', {item: item})
                  Alert.alert('Success', 'Payment successful' + paymentIntent.id)
                })
            })
        }
      }
    } catch (e) {
      console.error(e)
      Alert.alert('Error', 'Payment failed')
    }
  }

  return (
    <SafeAreaView>
      <BacktoHome textRoute={t('Global.Back')} />
      <Header>{type === 'contribution' ? t('ContributionsDetails.title') : t('Checkout.title')}</Header>
      <View style={styles.section}>
        <Text>
          {type === 'contribution' ? t('ContributionsDetails.Montant') : t('Checkout.AmountToPay')} : {montant}
        </Text>
      </View>
      <View style={styles.section}>
        <StripeProvider publishableKey={Config.STRIPE_KEY_PUBLIC === undefined ? '' : Config.STRIPE_KEY_PUBLIC}>
          <View>
            <CardField
              postalCodeEnabled={false}
              placeholders={{
                number: '4242 4242 4242 4242',
              }}
              cardStyle={{
                backgroundColor: '#FFFFFF',
                textColor: '#000000',
              }}
              style={{
                width: '100%',
                height: 50,
                marginVertical: 30,
              }}
              onCardChange={(cardDetails) => {
                setCardDetails(cardDetails)
              }}
            />
          </View>
        </StripeProvider>
        <View style={styles.section}>
          <Button mode="contained" onPress={handlePayPress}>
            {t('Global.Paid')}
          </Button>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default PaymentScreen
