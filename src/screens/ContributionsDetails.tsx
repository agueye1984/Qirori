import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import React, { useState } from 'react'
import { ActivityIndicator, Modal, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'

import { DispatchAction } from '../contexts/reducers/store'
import { useStore } from '../contexts/store'
import { useTheme } from '../contexts/theme'
import DefaultComponentsThemes from '../defaultComponentsThemes'
import { BacktoHome } from '../components/BacktoHome'
import Header from '../components/Header'
import TextInput from '../components/TextInput'
import { v4 as uuidv4 } from 'uuid';
import { Contribution, Event, Invitation, ManageEventsParamList, Product } from '../contexts/types';
import { LocalStorageKeys } from '../constants'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { DateEvent } from '../components/DateEvent'
import Icon from 'react-native-vector-icons/FontAwesome'
import { StackNavigationProp } from '@react-navigation/stack'
import { CustomInputText } from '../components/CustomInputText'
import Button from '../components/Button'
import { WebView } from 'react-native-webview';
import Feather from 'react-native-vector-icons/Feather'
import { theme } from '../core/theme'
import { SelectList } from 'react-native-dropdown-select-list'
import { getProduct, getProducts } from '../services/ProductServices'
import { useTranslation } from 'react-i18next';

type ContributionsDetailsProp = StackNavigationProp<ManageEventsParamList, 'ContributionsDetails'>

export const ContributionsDetails = () => {
  const { i18n, t } = useTranslation();
  let initProduit: Product[] = [];
  const route = useRoute<RouteProp<ManageEventsParamList, 'ContributionsDetails'>>()
  const item = route.params.item
  const defaultStyles = DefaultComponentsThemes()
  const { ColorPallet } = useTheme()
  const navigation = useNavigation<ContributionsDetailsProp>()
  const [state, dispatch] = useStore();
  const [contribution, setContribution] = useState(t('Global.None'));
  const [nature, setNature] = useState(t('Global.None'));
  const [nomcarte, setNomCarte] = useState('');
  const [displayBtn, setDisplayBtn] = useState(false);
  const [numCarte, setNumCarte] = useState('');
  const [cvc, setCvc] = useState('');
  const [expiration, setExpiration] = useState('');
  const [montant, setMontant] = useState(0);
  const [produits, setProduits] = useState(initProduit);
  const [displayNature, setDisplayNature] = useState(false);
  const [displayArgent, setDisplayArgent] = useState(false);
  const [displayProduit, setDisplayProduit] = useState(false);
  const [userId, setUserId] = useState('')
  const [produitId, setProduitId] = useState('');
  const [showGateway, setShowGateway] = useState(false);
  const [prog, setProg] = useState(false);
  const [progClr, setProgClr] = useState('#000');
  const [accesToken, setAccesToken] = useState('');
  const [approvalUrl, setApprovalUrl] = useState('');
  const [paymentId, setPaymentId] = useState('');

  const selectedLanguageCode = i18n.language;
  let languageDate = ''
  if (selectedLanguageCode === 'fr') {
    languageDate = 'fr-fr';
  }
  if (selectedLanguageCode === 'en') {
    languageDate = 'en-GB';
  }

  const transformed = getProducts().map(({ id, name, prixUnitaire }) => ({ key: id, value: name + ': ' + prixUnitaire }));

  AsyncStorage.getItem(LocalStorageKeys.UserId)
    .then((result) => {
      if (result != null) {
        setUserId(result);
      }
    })
    .catch(error => console.log(error))

  const events = state.events.find((event) => event.id === item.eventId) as Event;
  let jourFormat: String[] = []
  let heureFormatDebut = ''
  let heureFormatFin = ''

  if (events) {
    const anneeDebut = parseInt(events.dateDebut.substring(0, 4));
    const moisDebut = parseInt(events.dateDebut.substring(4, 6)) - 1;
    const jourDebut = parseInt(events.dateDebut.substring(6, 8));
    const heureDebut = parseInt(events.heureDebut.substring(0, 2));
    const minutesDebut = parseInt(events.heureDebut.substring(2, 4));
    const dateDebut = new Date(anneeDebut, moisDebut, jourDebut, heureDebut, minutesDebut, 0);

    heureFormatDebut = dateDebut.toLocaleTimeString(languageDate, {
      hour: 'numeric',
      minute: 'numeric',
      hourCycle: 'h24',

    })
    jourFormat = dateDebut.toLocaleTimeString(languageDate, {
      weekday: 'long',
    }).split(' ')
    const anneeFin = parseInt(events.dateFin.substring(0, 4));
    const moisFin = parseInt(events.dateFin.substring(4, 6)) - 1;
    const jourFin = parseInt(events.dateFin.substring(6, 8));
    const heureFin = parseInt(events.heureFin.substring(0, 2));
    const minutesFin = parseInt(events.heureFin.substring(2, 4));
    const dateFin = new Date(anneeFin, moisFin, jourFin, heureFin, minutesFin, 0);
    heureFormatFin = dateFin.toLocaleTimeString(languageDate, {
      hour: 'numeric',
      minute: 'numeric',
      hourCycle: 'h24'
    })
  }


  const makeContributions = (invite: Invitation) => {
    let contributions;
    if (contribution == t('Global.Yes')) {
      if (nature == t('Global.Argent')) {
        contributions = {
          id: uuidv4(),
          eventId: item.eventId,
          userId: userId,
          contribution: contribution,
          nature: nature,
          montant: montant
        }
      }
      if (nature == t('Global.Nature')) {
        contributions = {
          id: uuidv4(),
          eventId: item.eventId,
          userId: userId,
          contribution: contribution,
          nature: nature,
          Produits: produits,
          montant: montant
        }
      }
    }
    console.log(contributions);
    dispatch({
      type: DispatchAction.ADD_DONATION,
      payload: contributions,
    })
    navigation.navigate('Contributions' as never);
  };
  const styles = StyleSheet.create({
    section: {
      marginHorizontal: 20,
      paddingVertical: 20,
    },
    buttonsContainer: {
      paddingBottom: 50,
    },
    error: {
      ...defaultStyles.text,
      color: ColorPallet.error,
      fontWeight: 'bold',
    },
    detailsTitle: {
      ...defaultStyles.text,
      ...defaultStyles.requestDetailsTitle,
    },
    itemContainer: {
      height: 70,
      marginHorizontal: 5,
      borderWidth: 0.3,
      flex: 1,
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
      borderBottomRightRadius: 10,
      borderBottomLeftRadius: 10,
      backgroundColor: 'white',
    },
    itemContainerForm: {
      height: 40,
      marginHorizontal: 5,
      borderWidth: 0.3,
      flex: 1,
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
      borderBottomRightRadius: 10,
      borderBottomLeftRadius: 10,
    },
    mapview: {
      height: 300,
      marginHorizontal: 5,
      flex: 1,
    },
    row: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    container: {
      minHeight: 50,
      marginVertical: 10,
      borderWidth: 2,
      borderColor: ColorPallet.lightGray,
      borderRadius: 4,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    containerStyleName: {
      borderColor: ColorPallet.lightGray,
      borderWidth: 1,
    },
    containerWebview: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#fff',
    },
    btnCon: {
      height: 45,
      width: '70%',
      elevation: 1,
      backgroundColor: '#00457C',
      borderRadius: 3,
    },
    btn: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    btnTxt: {
      color: '#fff',
      fontSize: 18,
    },
    webViewCon: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
    wbHead: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#f9f9f9',
      zIndex: 25,
      elevation: 2,
    },
    textInput: {
      padding: 5,
      marginTop: 5,
      backgroundColor: 'grey',
      fontSize: 16,
    },
    button: {
      margin: 10,
      padding: 10,
      backgroundColor: '#1E6738',
      borderRadius: 10,
      borderWidth: 1,
      borderColor: '#fff',
    },
    buttonText: {
      color: 'white',
      alignSelf: 'center',
      fontWeight: '600',
    },
    description: {
      paddingTop: 5,
      fontSize: 12,
      color: 'black',
    },
    wrapper: {
      padding: 10,
    },
    errorText: {
      color: 'red',
    },
  })

  const getContributionOuiNon = (value: string) => {
    setDisplayBtn(false);
    if (value == t('Global.Yes')) {
      setContribution(t('Global.No'));
      setDisplayNature(false);
    } else if (value == t('Global.No')) {
      setContribution(t('Global.None'));
      setDisplayNature(false);
    }
    else {
      setContribution(t('Global.Yes'));
      setDisplayNature(true);
    }

  }

  const getNatureOuiNon = (value: string) => {
    setDisplayArgent(false);
    setDisplayBtn(false);
    setMontant(0);
    setProduits(initProduit);
    if (value == t('Global.Argent')) {
      setNature(t('Global.Nature'));
      setDisplayBtn(true);
      setDisplayProduit(true);
    } else if (value == t('Global.Nature')) {
      setNature(t('Global.None'));
      setDisplayProduit(false);
    }
    else {
      setNature(t('Global.Argent'));
      setDisplayBtn(true);
      setDisplayArgent(true);
    }

  }

  function onMessage(e: any) {
    let data = e.nativeEvent.data;
    setShowGateway(false);
    console.log(data);
    let payment = JSON.parse(data);
    if (payment.status === 'COMPLETED') {
      console.log('PAYMENT MADE SUCCESSFULLY!');
    } else {
      console.log('PAYMENT FAILED. PLEASE TRY AGAIN.');
    }
  }

  const addProduct = (products: Product[]) => {

    const product = state.products.find((product) => (product.id == produitId)) as Product;
    const amt = Number(montant) + Number(product.prixUnitaire);
    console.log(amt)
    setMontant(amt);
    products.push(product);
    setProduits(products);

  }

  const deleteProduct = (products: Product[], produitId: number) => {
    const amt = Number(montant) - Number(products[produitId].prixUnitaire);
    setMontant(amt);
    setProduits(products.filter((product, index) => index !== produitId));
    console.log(produits)
  }

  const submitPayment = async () => {
    setShowGateway(true)
    const dataDetail = {
      "intent": "sale",
      "payer": {
        "payment_method": "paypal"
      },
      "transactions": [{
        "amount": {
          "total": `${montant}`,
          "currency": 'CAD',
        }
      }],
      "redirect_urls": {
        "return_url": "https://example.com/return",
        "cancel_url": "https://example.com/cancel"
      }
    }

    fetch('https://api.sandbox.paypal.com/v1/oauth2/token',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          //'Authorization': `Bearer A21AAK949j1jpfkd9-3oAERKuE0Kdeme5OdHzUkiuotHnIuB1KCOk3nK5LK2ogqxCjtO1ba3f88XdvVnzqmy8Bgxbr4DH6_ag`
          'Authorization': `Basic QVQ2UzBxTFhqb2lxajFBdmVnV0FMbGFxUkRNT29UV3ZLU0RFRXM1Zzh5OUJwM0J3UDAwcktlLUlFRUkxWWZMalY4M2FLd2N3X29OZ0FFcmU6RUoxT3hJbjEwYV9QdThxNFdTdHlIekdkMktXeGdoVmJQZVc0VDh6ZzBjeW1CSE5EbUdFZEo2MDVEVjQ2MC16RFUwOGcwUWt3RTBOSTNmN1g=`
        },
        body: 'grant_type=client_credentials'
      }

    )
      .then(res => res.json())
      .then(response => {
        console.log("response", response);
        setAccesToken(response.access_token);

        fetch('https://api.sandbox.paypal.com/v1/payments/payment',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${response.access_token}`
            },
            body: JSON.stringify(dataDetail)
          }
        )
          .then(res => res.json())
          .then(response => {
            console.log("dataDetail", JSON.stringify(dataDetail));
            console.log("response", response);
            const { id, links } = response;
            const approvalUrl = links.find((data: any) => data.rel == "approval_url");
            console.log("approvalUrl", approvalUrl);
            setPaymentId(id);
            setApprovalUrl(approvalUrl.href)
          }).catch(err => {
            console.log(...err);
          })
      }).catch(err => {
        console.log(...err);
      })
  }



  return (
    <SafeAreaView>
      <BacktoHome textRoute={t('Contributions.title')} />
      <Header>{t('ContributionsDetails.title')}</Header>

      <ScrollView>
        <View style={styles.section}>
          <View style={styles.row}>
            <View style={{ flex: 1, flexDirection: 'row', }}>
              <DateEvent dateDebut={events.dateDebut} flexSize={0.87} />
            </View>
            <View style={{ flex: 4, flexDirection: 'row', }}>
              <View style={[styles.itemContainer]}>
                <View style={{ flexDirection: 'column', flex: 4, marginHorizontal: 5, marginVertical: 5 }}>
                  <View style={{ width: 250 }}>
                    <Text style={[defaultStyles.text, { fontWeight: 'bold', fontSize: 16, }]}>{jourFormat[`0`]} {t('Global.from')} {heureFormatDebut} {t('Global.to')} {heureFormatFin}</Text>
                  </View>
                  <View style={{ width: 250 }}>
                    <TouchableOpacity>
                      <View style={{ flexDirection: 'row', marginTop: 10 }}>
                        <Icon name={'calendar'} size={20} color={theme.colors.primary} />
                        <Text style={{ color: theme.colors.primary, marginHorizontal: 10 }}>{events.name}</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.section}>
          <View style={{ flexDirection: 'row', }}>
            <View style={{ marginVertical: 25 }} >
              <Text>{t('ContributionsDetails.Contribution')}</Text>
            </View>
            <View style={{ flex: 1, alignItems: 'flex-end', marginHorizontal: 10 }} >
              <TouchableOpacity onPress={() => getContributionOuiNon(contribution)} >
                <Icon name="angle-up" size={20} color={theme.colors.primary} />
              </TouchableOpacity>
              <Text style={{ fontSize: 15, color: 'black' }}>{contribution}</Text>
              <TouchableOpacity onPress={() => getContributionOuiNon(contribution)} >
                <Icon name="angle-down" size={20} color={theme.colors.primary} />
              </TouchableOpacity>
            </View>
          </View>

          {displayNature &&
            <View style={{ flexDirection: 'row', }}>
              <View style={{ marginVertical: 20 }} >
                <Text>{t('ContributionsDetails.Nature')}</Text>
              </View>
              <View style={{ flex: 1, alignItems: 'flex-end', marginHorizontal: 10 }} >
                <TouchableOpacity onPress={() => getNatureOuiNon(nature)} >
                  <Icon name="angle-up" size={20} color={theme.colors.primary} />
                </TouchableOpacity>
                <Text style={{ fontSize: 15, color: 'black' }}>{nature}</Text>
                <TouchableOpacity onPress={() => getNatureOuiNon(nature)} >
                  <Icon name="angle-down" size={20} color={theme.colors.primary} />
                </TouchableOpacity>
              </View>
            </View>
          }
          {displayArgent &&
            <SafeAreaView style={{ flex: 1 }}>
              <View style={{ height: 70 }} >
                <CustomInputText
                  value={montant.toString()}
                  setValue={(text) => setMontant(parseInt(text))}
                  containerStyle={styles.containerStyleName}
                  placeholder={t('ContributionsDetails.Montant')}
                />
              </View>
              <View>
                <Button mode="contained" onPress={submitPayment}>
                  {t('ContributionsDetails.Paypal')}
                </Button>
              </View>
              {showGateway ? (
                <Modal
                  visible={showGateway}
                  onDismiss={() => setShowGateway(false)}
                  onRequestClose={() => setShowGateway(false)}
                  animationType={"fade"}
                  transparent>
                  <View style={styles.webViewCon}>
                    <View style={styles.wbHead}>
                      <TouchableOpacity
                        style={{ padding: 13 }}
                        onPress={() => setShowGateway(false)}>
                        <Feather name={'x'} size={24} />
                      </TouchableOpacity>
                      <Text
                        style={{
                          flex: 1,
                          textAlign: 'center',
                          fontSize: 16,
                          fontWeight: 'bold',
                          color: '#00457C',
                        }}>
                        PayPal GateWay
                      </Text>
                      <View style={{ padding: 13, opacity: prog ? 1 : 0 }}>
                        <ActivityIndicator size={24} color={progClr} />
                      </View>
                    </View>
                    <WebView
                      source={{ uri: approvalUrl }}
                      style={{ flex: 1 }}

                      onLoadStart={() => {
                        setProg(true);
                        setProgClr('#000');
                      }}
                      onLoadProgress={() => {
                        setProg(true);
                        setProgClr('#00457C');
                      }}
                      onLoadEnd={() => {
                        setProg(false);
                      }}
                      onLoad={() => {
                        setProg(false);
                      }}
                      onMessage={onMessage}
                    />
                  </View>
                </Modal>
              ) : null}
            </SafeAreaView>
          }

          {displayProduit &&
            <View>
              <View>
                <Text>{t('ContributionsDetails.Produits')}</Text>
              </View>
              <View style={{ marginVertical: 10, }}>
                <Text>{t('ContributionsDetails.Montant')} : {montant}</Text>
              </View>
              <View>
                <View>
                  {/* <CustomInputText
                    value={produit}
                    setValue={(text) => setProduit(text)}
                    containerStyle={styles.containerStyleName}
                    placeholder={t('ContributionsDetails.AddProduct')}
                  /> */}
                  <SelectList
                    boxStyles={styles.container}
                    setSelected={(val: string) => setProduitId(val)}
                    data={transformed}
                    search={true}
                    save="key"
                    placeholder={t('ContributionsDetails.AddProduct')}
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
                  return <View key={index}>
                    <TouchableOpacity key={index} onPress={() => deleteProduct(produits, index)}>
                      <View style={[styles.itemContainerForm, { marginVertical: 5 }]}>
                        <Text style={{ textAlign: 'center', marginVertical: 10 }}>{product.name} : {product.prixUnitaire.toLocaleString()} {product.devise}</Text>
                      </View>
                    </TouchableOpacity>
                  </View>

                })}
              </View>
            </View>

          }
        </View>
        {displayBtn &&
          <View style={styles.section}>
            <View style={{ flexDirection: 'row' }}>
              <View style={{ marginRight: 90, alignItems: 'flex-start' }}>
                <Button mode="contained" onPress={() => navigation.navigate('Contributions' as never)}>
                  {t('Global.Cancel')}
                </Button>
              </View>
              <View style={[{ marginLeft: 90, alignItems: 'flex-end' }]}>
                <Button mode="contained" onPress={() => makeContributions(item)}>
                  {t('Global.Save')}
                </Button>
              </View>
            </View>
          </View>
        }
      </ScrollView>
    </SafeAreaView>


  )
}
