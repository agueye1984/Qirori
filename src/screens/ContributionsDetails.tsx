import {RouteProp, useNavigation, useRoute} from '@react-navigation/native'
import React, {useEffect, useState} from 'react'
import {Modal, SafeAreaView, Text, TouchableOpacity, View} from 'react-native'
import {ScrollView} from 'react-native-gesture-handler'
import DefaultComponentsThemes from '../defaultComponentsThemes'
import {BacktoHome} from '../components/BacktoHome'
import Header from '../components/Header'
import {v4 as uuidv4} from 'uuid'
import {Event, ManageEventsParamList, Product, TypeEvent} from '../contexts/types'
import {DateEvent} from '../components/DateEvent'
import Icon from 'react-native-vector-icons/FontAwesome'
import {StackNavigationProp} from '@react-navigation/stack'
import {CustomInputText} from '../components/CustomInputText'
import Button from '../components/Button'
import {WebView} from 'react-native-webview'
import {theme} from '../core/theme'
import {SelectList} from 'react-native-dropdown-select-list'
import {useTranslation} from 'react-i18next'
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
import paypalApi from '../apis/paypalApi'
import queryString from 'query-string'
import {useStore} from '../contexts/store'
import Icon1 from 'react-native-vector-icons/Fontisto'
import {getAllRecords, getRecordById} from '../services/FirestoreServices'

type ContributionsDetailsProp = StackNavigationProp<ManageEventsParamList, 'ContributionsDetails'>

export const ContributionsDetails = () => {
  const currentUser = auth().currentUser
  const {i18n, t} = useTranslation()
  let initProduit: Product[] = []
  const route = useRoute<RouteProp<ManageEventsParamList, 'ContributionsDetails'>>()
  const item = route.params.item
  const defaultStyles = DefaultComponentsThemes()
  const navigation = useNavigation<ContributionsDetailsProp>()
  const [contribution, setContribution] = useState(t('Global.None'))
  const [nature, setNature] = useState(t('Global.None'))
  const [displayBtn, setDisplayBtn] = useState(false)
  const [montant, setMontant] = useState('')
  const [produits, setProduits] = useState(initProduit)
  const [displayNature, setDisplayNature] = useState(false)
  const [displayArgent, setDisplayArgent] = useState(false)
  const [displayProduit, setDisplayProduit] = useState(false)
  const [produitId, setProduitId] = useState('')
  const [paypalUrl, setPaypalUrl] = useState('')
  const [accessToken, setAccessToken] = useState('')
  const [devise, setDevise] = useState<string>('')
  const [state] = useStore()
  const [paymentType, setPaymentType] = useState('')
  const [products, setProducts] = useState<any[]>([])
  const [eventName, setEventName] = useState<string>('')
  const [heureFormatDebut, setHeureFormatDebut] = useState<string>('')
  const [heureFormatFin, setHeureFormatFin] = useState<string>('')
  const [jourFormat, setJourFormat] = useState<string[]>([])
  const [dateDebut, setDateDebut] = useState<string>('')

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

  useEffect(() => {
    setDevise(state.currency.toString())
  }, [state.currency])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const event = (await getRecordById('events', item.eventId)) as Event
        const anneeDebut = parseInt(event.dateDebut.substring(0, 4))
        const moisDebut = parseInt(event.dateDebut.substring(4, 6)) - 1
        const jourDebut = parseInt(event.dateDebut.substring(6, 8))
        const heureDebut = parseInt(event.heureDebut.substring(0, 2))
        const minutesDebut = parseInt(event.heureDebut.substring(2, 4))
        const dateDeb = new Date(anneeDebut, moisDebut, jourDebut, heureDebut, minutesDebut, 0)
        setDateDebut(event.dateDebut)
        setHeureFormatDebut(
          dateDeb.toLocaleTimeString(languageDate, {
            hour: 'numeric',
            minute: 'numeric',
            hourCycle: 'h24',
          })
        )
        setJourFormat(
          dateDeb
            .toLocaleTimeString(languageDate, {
              weekday: 'long',
            })
            .split(' ')
        )
        const anneeFin = parseInt(event.dateFin.substring(0, 4))
        const moisFin = parseInt(event.dateFin.substring(4, 6)) - 1
        const jourFin = parseInt(event.dateFin.substring(6, 8))
        const heureFin = parseInt(event.heureFin.substring(0, 2))
        const minutesFin = parseInt(event.heureFin.substring(2, 4))
        const dateFin = new Date(anneeFin, moisFin, jourFin, heureFin, minutesFin, 0)
        setHeureFormatFin(
          dateFin.toLocaleTimeString(languageDate, {
            hour: 'numeric',
            minute: 'numeric',
            hourCycle: 'h24',
          })
        )
        const typeEvent = (await getRecordById('type_events', event.name)) as TypeEvent
        let evenName = typeEvent.nameFr
        if (selectedLanguageCode === 'en') {
          evenName = typeEvent.nameEn
        }
        setEventName(evenName)
        const data = await getAllRecords('products')
        let prod = {
          key: '',
          value: t('Dropdown.Product'),
        }
        const newProd = data.map((record) => ({
          key: record.id,
          value: record.data.name + ': ' + record.data.prixUnitaire,
        }))
        newProd.push(prod)
        newProd.sort((a, b) => a.value.toLowerCase().localeCompare(b.value.toLowerCase()))
        setProducts(newProd)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [item.eventId, languageDate])

  const makeContributions = async () => {
    const uid = uuidv4()
    if (contribution == t('Global.Yes')) {
      if (nature == t('Global.Argent')) {
        console.log(devise)
        const donation = {
          id: uid,
          eventId: item.eventId,
          userId: currentUser?.uid,
          contribution: contribution,
          nature: nature,
          montant: montant,
        }
        if (paymentType == '1') {
          await onPressPaypal()
        } else {
          navigation.navigate('PaymentScreen', {mnt: montant, item: donation, type: 'contribution'})
        }
      }
      if (nature == t('Global.Nature')) {
        firestore()
          .collection('contributions')
          .doc(uid)
          .set({
            id: uid,
            eventId: item.eventId,
            userId: currentUser?.uid,
            contribution: contribution,
            nature: nature,
            Produits: produits,
            montant: montant,
          })
          .then(() => {
            console.log('Contributions added!')
            navigation.navigate('Contributions' as never)
          })
      }
    }
  }

  const setSelectedPayment = (type: string) => {
    setPaymentType(type)
  }

  const getContributionOuiNon = (value: string) => {
    if (value == t('Global.Yes')) {
      setContribution(t('Global.No'))
      setDisplayNature(false)
      setDisplayBtn(true)
    }
    if (value == t('Global.No')) {
      setContribution(t('Global.Yes'))
      setDisplayNature(true)
      setDisplayBtn(false)
    }
  }

  const getNatureOuiNon = (value: string) => {
    setDisplayBtn(true)
    setMontant('')
    setProduits(initProduit)
    if (value == t('Global.Argent')) {
      setNature(t('Global.Nature'))
      setDisplayProduit(true)
      setDisplayArgent(false)
    }
    if (value == t('Global.Nature')) {
      setNature(t('Global.Argent'))
      setDisplayArgent(true)
      setDisplayProduit(false)
    }
  }

  const handleMontant = (value: string) => {
    setMontant(value)
  }

  const addProduct = async (products: Product[]) => {
    const prod = (await getRecordById('products', produitId)) as Product
    const amt = Number(montant) + Number(prod.prixUnitaire)
    setMontant(amt.toString())
    products.push(prod)
    setProduits(products)
  }

  const deleteProduct = (products: Product[], produitId: number) => {
    const amt = Number(montant) - Number(products[produitId].prixUnitaire)
    setMontant(amt.toString())
    setProduits(products.filter((product, index) => index !== produitId))
  }

  const onPressPaypal = async () => {
    try {
      const dataDetail = {
        intent: 'CAPTURE',
        purchase_units: [
          {
            items: [
              {
                name: t('Contributions.title') + ' ' + eventName,
                description: t('Contributions.title') + ' ' + eventName,
                quantity: '1',
                unit_amount: {
                  currency_code: '' + devise + '',
                  value: '' + montant + '',
                },
              },
            ],
            amount: {
              currency_code: '' + devise + '',
              value: '' + montant + '',
              breakdown: {
                item_total: {
                  currency_code: '' + devise + '',
                  value: '' + montant + '',
                },
              },
            },
          },
        ],
        application_context: {
          return_url: 'https://example.com/return',
          cancel_url: 'https://example.com/cancel',
        },
      }
      console.log(dataDetail.purchase_units)
      console.log(dataDetail.purchase_units[0].items)
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
      const res = paypalApi.capturePayment(id, accessToken)
      console.log('capturePayment res++++', res)
      console.log('Payment sucessfull...!!!')
      clearPaypalState()
      const uid = uuidv4()
      firestore()
        .collection('contributions')
        .doc(uid)
        .set({
          id: uid,
          eventId: item.eventId,
          userId: currentUser?.uid,
          contribution: contribution,
          nature: nature,
          montant: montant,
        })
        .then(() => {
          console.log('Contributions added!')
          navigation.navigate('Contributions' as never)
        })
    } catch (error) {
      console.log('error raised in payment capture', error)
    }
  }

  const clearPaypalState = () => {
    setPaypalUrl('')
    setAccessToken('')
  }

  return (
    <SafeAreaView style={{flex: 1}}>
      <BacktoHome textRoute={t('Contributions.title')} />
      <Header>{t('ContributionsDetails.title')}</Header>

      <ScrollView
        scrollEnabled
        showsVerticalScrollIndicator
        automaticallyAdjustKeyboardInsets={true}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={defaultStyles.scrollViewContent}>
        <View style={defaultStyles.section}>
          <View style={defaultStyles.row}>
            <View style={{flex: 1, flexDirection: 'row'}}>
              <DateEvent dateDebut={dateDebut} flexSize={0.87} />
            </View>
            <View style={{flex: 4, flexDirection: 'row'}}>
              <View style={[defaultStyles.itemContainerDateEvent]}>
                <View
                  style={{
                    flexDirection: 'column',
                    flex: 4,
                    marginHorizontal: 5,
                    marginVertical: 5,
                  }}>
                  <View style={{width: 250}}>
                    <Text style={[defaultStyles.text, {fontWeight: 'bold', fontSize: 16}]}>
                      {jourFormat['0']} {t('Global.from')} {heureFormatDebut} {t('Global.to')} {heureFormatFin}
                    </Text>
                  </View>
                  <View style={{width: 250}}>
                    <TouchableOpacity>
                      <View style={{flexDirection: 'row', marginTop: 10}}>
                        <Icon name={'calendar'} size={20} color={theme.colors.primary} />
                        <Text
                          style={{
                            color: theme.colors.primary,
                            marginHorizontal: 10,
                          }}>
                          {eventName}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
        <View style={defaultStyles.section}>
          <View style={{flexDirection: 'row'}}>
            <View style={[defaultStyles.labelContainer, {marginVertical: 5}]}>
              <Text>{t('ContributionsDetails.Contribution')}</Text>
            </View>
            <View style={{flex: 1, alignItems: 'flex-end', marginHorizontal: 10}}>
              <TouchableOpacity
                style={[defaultStyles.switchContainer, defaultStyles.switchEnabled]}
                onPress={() => getContributionOuiNon(t('Global.No'))}>
                <View style={defaultStyles.iconTextContainer}>
                  <Icon1 name="check" size={20} color="#000000" />
                  <Text style={defaultStyles.switchTextDark}> {t('Global.Yes')}</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={[defaultStyles.switchContainer, defaultStyles.switchDisabled]}
                onPress={() => getContributionOuiNon(t('Global.Yes'))}>
                <View style={defaultStyles.iconTextContainer}>
                  <Text style={defaultStyles.switchText}>{t('Global.No')} </Text>
                  <Icon1 name="close" size={20} color="#ffffff" />
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {displayNature && (
            <View style={{flexDirection: 'row'}}>
              <View style={[defaultStyles.labelContainer, {marginVertical: 40}]}>
                <Text>{t('ContributionsDetails.Nature')}</Text>
              </View>
              <View style={{flex: 1, alignItems: 'flex-end', marginHorizontal: 10}}>
                <TouchableOpacity
                  style={[defaultStyles.switchContainer, defaultStyles.switchEnabled]}
                  onPress={() => getNatureOuiNon(t('Global.Argent'))}>
                  <View style={defaultStyles.iconTextContainer}>
                    <Icon1 name="check" size={20} color="#000000" />
                    <Text style={defaultStyles.switchTextDark}> {t('Global.Nature')}</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[defaultStyles.switchContainer, defaultStyles.switchDisabled]}
                  onPress={() => getNatureOuiNon(t('Global.Nature'))}>
                  <View style={defaultStyles.iconTextContainer}>
                    <Text style={defaultStyles.switchText}>{t('Global.Argent')} </Text>
                    <Icon1 name="close" size={20} color="#ffffff" />
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          )}
          {displayArgent && (
            <SafeAreaView>
              <View style={defaultStyles.section}>
                <CustomInputText
                  value={montant.toString()}
                  setValue={(text) => handleMontant(text)}
                  containerStyle={defaultStyles.containerStyleName}
                  placeholder={t('ContributionsDetails.Montant')}
                />
              </View>
              <Modal visible={!!paypalUrl}>
                <TouchableOpacity onPress={clearPaypalState} style={{margin: 24}}>
                  <Text>Closed</Text>
                </TouchableOpacity>
                <View style={{flex: 1}}>
                  <WebView source={{uri: paypalUrl}} onNavigationStateChange={onUrlChange} />
                </View>
              </Modal>
              {paymentList.map((payment, index: number) => {
                const selectedPayment = payment.code === paymentType
                return (
                  <View key={index}>
                    <TouchableOpacity
                      style={defaultStyles.itemContainer}
                      onPress={() => setSelectedPayment(payment.code)}>
                      <View style={defaultStyles.touchableStyle}>
                        {selectedPayment ? (
                          <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <Icon1 name={'radio-btn-active'} size={20} color={theme.colors.primary} />
                            <Text style={[defaultStyles.text, {paddingLeft: 5, fontWeight: 'bold'}]}>
                              {payment.label}
                            </Text>
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
          )}

          {displayProduit && (
            <View>
              <View>
                <Text>{t('ContributionsDetails.Produits')}</Text>
              </View>
              <View style={{marginVertical: 10}}>
                <Text>
                  {t('ContributionsDetails.Montant')} : {montant}
                </Text>
              </View>
              <View>
                <View>
                  <SelectList
                    boxStyles={defaultStyles.container}
                    setSelected={(val: string) => setProduitId(val)}
                    data={products}
                    search={true}
                    save="key"
                    placeholder={t('Dropdown.Product')}
                    defaultOption={{key: '', value: t('Dropdown.Product')}}
                  />
                </View>
                <View>
                  <Button mode="contained" onPress={() => addProduct(produits)}>
                    {t('Global.Add')}
                  </Button>
                </View>
              </View>
              <View>
                {produits.map((product: Product, index: number) => {
                  return (
                    <View key={index}>
                      <TouchableOpacity key={index} onPress={() => deleteProduct(produits, index)}>
                        <View style={[defaultStyles.itemContainerForm, {marginVertical: 5}]}>
                          <Text style={{textAlign: 'center', marginVertical: 10}}>
                            {product.name} : {product.prixUnitaire.toLocaleString()} {product.devise}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  )
                })}
              </View>
            </View>
          )}
        </View>
      </ScrollView>
      {displayBtn && (
        <View style={defaultStyles.bottomButtonContainer}>
          <View style={defaultStyles.buttonContainer}>
            <Button
              mode="contained"
              onPress={() => navigation.navigate('Contributions' as never)}
              style={defaultStyles.button}>
              {t('Global.Cancel')}
            </Button>
            <Button mode="contained" onPress={makeContributions} style={defaultStyles.button}>
              {t('Global.Save')}
            </Button>
          </View>
        </View>
      )}
    </SafeAreaView>
  )
}
