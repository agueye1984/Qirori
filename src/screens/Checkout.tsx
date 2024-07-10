import {useEffect, useState} from 'react'
import {Adresse, Commande, ManageEventsParamList, Panier, User} from '../contexts/types'
import {Modal, SafeAreaView, ScrollView, Text, TouchableOpacity, View} from 'react-native'
import Header from '../components/Header'
import {useStore} from '../contexts/store'
import Button from '../components/Button'
import {heightPercentageToDP as heightToDp} from 'react-native-responsive-screen'
import {useNavigation} from '@react-navigation/native'
import ShippingAddress from '../components/ShippingAddress'
import DefaultComponentsThemes from '../defaultComponentsThemes'
import {useTranslation} from 'react-i18next'
import {v4 as uuidv4} from 'uuid'
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
import paypalApi from '../apis/paypalApi'
import queryString from 'query-string'
import WebView from 'react-native-webview'
import {StackNavigationProp} from '@react-navigation/stack'
import {theme} from '../core/theme'
import Icon1 from 'react-native-vector-icons/Fontisto'

type OrderDoneProps = StackNavigationProp<ManageEventsParamList, 'CommandesEffectuees'>

export const Checkout = () => {
  const currentUser = auth().currentUser
  let address: Adresse = {
    city: '',
    province: '',
    id: '',
    address_line_1: '',
    address_line_2: '',
    postalCode: '',
    userId: '',
    countryCode: '',
  }
  const {t, i18n} = useTranslation()
  const [state] = useStore()
  const navigation = useNavigation<OrderDoneProps>()
  const [shippingAddress, setShippingAddress] = useState(address)
  const defaultStyles = DefaultComponentsThemes()
  const [hasAdresse, setHasAdresse] = useState(false)
  const [total, setTotal] = useState(0)
  const [carts, setCarts] = useState<Panier[]>([])
  const [paypalUrl, setPaypalUrl] = useState('')
  const [accessToken, setAccessToken] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const currencyCode = state.currency.toString()
  const [items, setItems] = useState<any[]>([])
  const [totalTax, setTotalTax] = useState(0)
  const [modifierAdresse, setModifierAdresse] = useState(false)
  const [paymentType, setPaymentType] = useState('')

  const paymentList: any[] = [
    {
      code: '1',
      label: t('PaymentList.Paypal'),
    },
    {
      code: '2',
      label: t('PaymentList.Card'),
    },
  ]
  const selectedLanguageCode = i18n.language
  let languageDate = ''
  if (selectedLanguageCode === 'fr') {
    languageDate = 'fr-fr'
  }
  if (selectedLanguageCode === 'en') {
    languageDate = 'en-GB'
  }
  let dateDelivered = new Date()
  dateDelivered.setDate(dateDelivered.getDate() + 5)
  const dateformat = dateDelivered
    .toLocaleDateString(languageDate, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
    .split('/')
    .reverse()
    .join('')

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

  useEffect(() => {
    firestore()
      .collection('addresses')
      // Filter results
      .where('userId', '==', currentUser?.uid)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((documentSnapshot) => {
          setHasAdresse(true)
          setShippingAddress(documentSnapshot.data() as Adresse)
        })
      })
  }, [currentUser?.uid])

  useEffect(() => {
    firestore()
      .collection('carts')
      // Filter results
      .where('userId', '==', currentUser?.uid)
      .where('paid', '==', false)
      .get()
      .then((querySnapshot) => {
        let tot = 0
        let cart: Panier[] = []
        let itemProduct: any[] = []
        let tax = 0
        querySnapshot.forEach((documentSnapshot) => {
          let panier = documentSnapshot.data() as Panier
          panier.statut = '1'
          panier.dateDelivered = dateformat
          cart.push(panier)
          tot += panier.totalPrice
          const taxUnit = Number(panier.tax.toFixed(2))
          tax += Number((taxUnit * panier.qty).toFixed(2))
          const item: any = {
            name: panier.name,
            description: panier.description,
            quantity: panier.qty,
            unit_amount: {
              currency_code: panier.devise,
              value: panier.prix,
            },
            tax: {
              currency_code: panier.devise,
              value: taxUnit,
            },
          }
          itemProduct.push(item)
        })
        setTotalTax(tax)
        setTotal(tot)
        setCarts(cart)
        setItems(itemProduct)
      })
  }, [currentUser?.uid])

  const setSelectedPayment = (type: string) => {
    setPaymentType(type)
  }

  const handleAddressInputChange = (address: any) => {
    setShippingAddress(address)
  }

  const ProceedPay = async () => {
    if (paymentType == '1') {
      await onPressPaypal()
    } else {
      const paymentTotal = Number((total + totalTax).toFixed(2))
      const uid = uuidv4()
      const commande = {
        id: uid,
        paniers: carts,
        adresse: shippingAddress,
        paymentId: '',
        orderId: '',
        userId: currentUser?.uid,
        statut: '1',
        dateDelivered: dateformat,
        rating: 0,
        avis: '',
      }
      navigation.navigate('PaymentScreen', {mnt: paymentTotal.toString(), item: commande, type: 'commande'})
    }
  }

  const onPressPaypal = async () => {
    try {
      const paymentTotal = Number((total + totalTax).toFixed(2)) // 6.7
      const dataDetail = {
        intent: 'CAPTURE',
        purchase_units: [
          {
            items: items,
            amount: {
              currency_code: currencyCode,
              value: '' + Number(paymentTotal.toFixed(2)) + '',
              breakdown: {
                item_total: {
                  currency_code: currencyCode,
                  value: '' + Number(total.toFixed(2)) + '',
                },
                tax_total: {
                  currency_code: currencyCode,
                  value: '' + Number(totalTax.toFixed(2)) + '',
                },
              },
            },
            shipping: {
              type: 'SHIPPING',
              address: {
                address_line_1: shippingAddress.address_line_1,
                address_line_2: shippingAddress.address_line_2,
                admin_area_2: shippingAddress.city,
                admin_area_1: shippingAddress.province,
                postal_code: shippingAddress.postalCode,
                country_code: shippingAddress.countryCode,
              },
            },
          },
        ],
        shippingAddress: shippingAddress,
        application_context: {
          return_url: 'https://example.com/return',
          cancel_url: 'https://example.com/cancel',
        },
      }
      console.log(dataDetail.purchase_units)
      console.log(dataDetail.purchase_units[0].items)
      console.log(dataDetail.purchase_units[0].amount)
      const token = (await paypalApi.generateToken()) as unknown as string
      const res = (await paypalApi.createOrder(token, dataDetail)) as unknown as any
      setAccessToken(token)
      console.log('res++++++', res)
      if (res?.links) {
        const findUrl = res.links.find((data: {rel: string}) => data?.rel == 'approve')
        console.log('findUrl++++++', findUrl)
        setPaypalUrl(findUrl.href)
      }
    } catch (error) {
      console.log('error', error)
    }
  }

  const onUrlChange = (webviewState: any) => {
    console.log('webviewStatewebviewState', webviewState)
    if (webviewState.url.includes('https://example.com/cancel')) {
      clearPaypalState()
      return
    }
    if (webviewState.url.includes('https://example.com/return')) {
      const urlValues = queryString.parseUrl(webviewState.url)
      console.log('my urls value', urlValues)
      const {token} = urlValues.query
      if (token) {
        paymentSucess(token)
      }
    }
  }

  const paymentSucess = async (id: any) => {
    try {
      const res = await paypalApi.capturePayment(id, accessToken)
      console.log('capturePayment res++++', res)
      console.log('Payment sucessfull...!!!')
      clearPaypalState()
      const uid = uuidv4()
      const commande = {
        id: uid,
        paniers: carts,
        adresse: shippingAddress,
        paymentId: id,
        orderId: id,
        userId: currentUser?.uid,
        statut: '1',
        dateDelivered: dateformat,
        rating: 0,
        avis: '',
      }
      firestore()
        .collection('addresses')
        .doc(uid)
        .set(shippingAddress)
        .then(() => {
          firestore()
            .collection('commandes')
            .doc(uid)
            .set(commande)
            .then(() => {
              carts.map((panier) => {
                firestore()
                  .collection('carts')
                  .doc(panier.id)
                  .update({
                    paid: true,
                    statut: '1',
                    dateDelivered: dateformat,
                    commandeId: uid,
                  })
                  .then(() => {
                    console.log('Paniers updated!')
                  })
              })
              console.log('Commandes added!')
              navigation.navigate('CommandesEffectuees', {item: commande as Commande})
            })
        })
    } catch (error) {
      console.log('error raised in payment capture', error)
    }
  }

  const modifiyShippingAddresse = () => {
    setHasAdresse(false)
    setModifierAdresse(true)
  }

  const cancelShippingAddresse = () => {
    setHasAdresse(true)
    setModifierAdresse(false)
  }

  const clearPaypalState = () => {
    setPaypalUrl('')
    setAccessToken('')
  }

  return (
    <SafeAreaView style={{flex: 1}}>
      <Header>{t('Checkout.title')}</Header>
      <ScrollView
        scrollEnabled
        showsVerticalScrollIndicator
        automaticallyAdjustKeyboardInsets={true}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={defaultStyles.scrollViewContent}>
        <View style={defaultStyles.address}>
          <Text style={defaultStyles.titleCheckout}>{t('Checkout.InfoPersonal')}</Text>
          <View style={{marginTop: heightToDp(1), marginBottom: heightToDp(1)}}>
            <View style={[defaultStyles.itemContainerFormCheckout]}>
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
          <Text style={defaultStyles.titleCheckout}>{t('Checkout.ShippingAddress')}</Text>
          {hasAdresse && !modifierAdresse && (
            <TouchableOpacity onPress={modifiyShippingAddresse}>
              <Text style={{color: theme.colors.primary}}> {t('Global.Modify')}</Text>
            </TouchableOpacity>
          )}
          {!hasAdresse && modifierAdresse && (
            <TouchableOpacity onPress={cancelShippingAddresse}>
              <Text style={{color: theme.colors.primary}}> {t('Global.Cancel')}</Text>
            </TouchableOpacity>
          )}

          {hasAdresse ? (
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
          ) : (
            <ShippingAddress onChange={handleAddressInputChange} />
          )}
        </View>

        <SafeAreaView>
          <View style={defaultStyles.payment}>
            <Text style={defaultStyles.titleCheckout}>{t('Checkout.Payment')}</Text>
            <View style={{marginTop: heightToDp(2), marginBottom: heightToDp(2)}}>
              <Text>
                {t('Checkout.AmountToPay')} {Number((total + totalTax).toFixed(2))}
              </Text>
            </View>
          </View>
          <Modal visible={!!paypalUrl}>
            <TouchableOpacity onPress={clearPaypalState} style={{margin: 24}}>
              <Text>x</Text>
            </TouchableOpacity>
            <View style={{flex: 1}}>
              <WebView source={{uri: paypalUrl}} onNavigationStateChange={onUrlChange} />
            </View>
          </Modal>
          {paymentList.map((payment, index: number) => {
            const selectedPayment = payment.code === paymentType
            return (
              <View key={index}>
                <TouchableOpacity style={defaultStyles.itemContainer} onPress={() => setSelectedPayment(payment.code)}>
                  <View style={defaultStyles.touchableStyle}>
                    {selectedPayment ? (
                      <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Icon1 name={'radio-btn-active'} size={20} color={theme.colors.primary} />
                        <Text style={[defaultStyles.text, {paddingLeft: 5, fontWeight: 'bold'}]}>{payment.label}</Text>
                      </View>
                    ) : (
                      <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Icon1 name={'radio-btn-passive'} size={20} color={theme.colors.primary} />
                        <Text style={[defaultStyles.text, {paddingLeft: 5}]}>{payment.label}</Text>
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              </View>
            )
          })}
        </SafeAreaView>
      </ScrollView>
      <View style={defaultStyles.bottomButtonContainer}>
        <View style={defaultStyles.buttonContainer}>
          <View style={{width: 150}}>
            <Button mode="contained" onPress={() => navigation.navigate('Cart' as never)} style={defaultStyles.button}>
              {t('Global.Back')}
            </Button>
          </View>
          <View style={{width: 220}}>
            <Button mode="contained" onPress={ProceedPay} style={defaultStyles.button}>
              {t('Checkout.PlaceOrder')}
            </Button>
          </View>
        </View>
      </View>
    </SafeAreaView>
  )
}
