import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import DefaultComponentsThemes from '../defaultComponentsThemes';
import {BacktoHome} from '../components/BacktoHome';
import Header from '../components/Header';
import {v4 as uuidv4} from 'uuid';
import {
  Event,
  ManageEventsParamList,
  ProdServEvent,
  TypeEvent,
} from '../contexts/types';
import {DateEvent} from '../components/DateEvent';
import Icon from 'react-native-vector-icons/FontAwesome';
import {StackNavigationProp} from '@react-navigation/stack';
import Button from '../components/Button';
import {WebView} from 'react-native-webview';
import {theme} from '../core/theme';
import {SelectList} from 'react-native-dropdown-select-list';
import {useTranslation} from 'react-i18next';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import paypalApi from '../apis/paypalApi';
import queryString from 'query-string';
import {useStore} from '../contexts/store';
import Icon1 from 'react-native-vector-icons/Fontisto';
import {
  getAllRecords,
  getFilteredArrayRecords,
  getRecordById,
} from '../services/FirestoreServices';
import {parseDateTime} from '../services/EventsServices';
import {useTheme} from '../contexts/theme';
import CustomSwitch from '../components/CustomSwitch';
import CustomSwitchType from '../components/CustomSwitchType';
import {TextInput as PaperTextInput} from 'react-native-paper';
import {
  addToCartService,
  deleteFromCartService,
} from '../services/CartsServices';

type ContributionsDetailsProp = StackNavigationProp<
  ManageEventsParamList,
  'ContributionsDetails'
>;

export const ContributionsDetails = () => {
  const currentUser = auth().currentUser;
  const {i18n, t} = useTranslation();
  let initProduit: any[] = [];
  const route =
    useRoute<RouteProp<ManageEventsParamList, 'ContributionsDetails'>>();
  const item = route.params.item;
  const defaultStyles = DefaultComponentsThemes();
  const navigation = useNavigation<ContributionsDetailsProp>();
  const [contribution, setContribution] = useState(t('Global.None'));
  const [nature, setNature] = useState(t('Global.None'));
  const [displayBtn, setDisplayBtn] = useState(true);
  const [montant, setMontant] = useState('0');
  const [produits, setProduits] = useState(initProduit);
  const [displayNature, setDisplayNature] = useState(false);
  const [displayArgent, setDisplayArgent] = useState(false);
  const [displayProduit, setDisplayProduit] = useState(false);
  const [produitId, setProduitId] = useState('');
  const [paypalUrl, setPaypalUrl] = useState('');
  const [accessToken, setAccessToken] = useState('');
  //const [devise, setDevise] = useState<string>('')
  const [state] = useStore();
  const devise = state.currency;
  const [paymentType, setPaymentType] = useState('');
  const [products, setProducts] = useState<any[]>([]);
  const [eventName, setEventName] = useState<string>('');
  const [heureFormatDebut, setHeureFormatDebut] = useState<string>('');
  const [heureFormatFin, setHeureFormatFin] = useState<string>('');
  const [jourFormat, setJourFormat] = useState<string[]>([]);
  const [dateDebut, setDateDebut] = useState<string>('');
  const [typeNature, setTypeNature] = useState('');
  const [formulesIds, setFormulesIds] = useState<string[]>([]);
  const {ColorPallet} = useTheme();
  const {width} = Dimensions.get('window');
  const paymentList: any[] = [
    {
      code: '1',
      label: t('PaymentList.Paypal'),
    },
    {
      code: '2',
      label: t('PaymentList.Card'),
    },
  ];

  const selectedLanguageCode = i18n.language;
  let languageDate = '';
  if (selectedLanguageCode === 'fr') {
    languageDate = 'fr-fr';
  }
  if (selectedLanguageCode === 'en') {
    languageDate = 'en-GB';
  }

  const getFormules = async () => {
    if (typeNature === '1') {
      getFormulesProduct();
    }
    if (typeNature === '2') {
      getFormulesService();
    }
  };

  const getFormulesProduct = async () => {
    const data = await getAllRecords('products');
    const uniqueOffers: Record<string, any> = {};
    for (const record of data) {
      for (const formula of record.data.formules) {
        const formule = await getRecordById('formules', formula.formuleId);
        const name = formule?.name;
        const offer = {
          key: formula.id,
          value:
            '(' +
            record.data.name +
            ') ' +
            name +
            ' Prix: ' +
            formula.amount +
            ' ' +
            devise,
        };
        if (!uniqueOffers[offer.key]) {
          uniqueOffers[offer.key] = offer; // Ajouter l'offre si la clé n'existe pas encore
        }
      }
    }
    const sortedOffers = Object.values(uniqueOffers).sort((a, b) =>
      a.value.toLowerCase().localeCompare(b.value.toLowerCase()),
    );
    setProducts(sortedOffers);
  };

  const getFormulesService = async () => {
    const data = await getAllRecords('services');
    const uniqueOffers: Record<string, any> = {};
    for (const record of data) {
      for (const formula of record.data.formules) {
        
        const formule = await getRecordById('formules', formula.formuleId);
        const name = formule?.name;
        const offer = {
          key: formula.id,
          value: name + ' Prix: ' + formula.amount + ' ' + devise,
        };
        if (!uniqueOffers[offer.key]) {
          uniqueOffers[offer.key] = offer; // Ajouter l'offre si la clé n'existe pas encore
        }
      }
    }
    const sortedOffers = Object.values(uniqueOffers).sort((a, b) =>
      a.value.toLowerCase().localeCompare(b.value.toLowerCase()),
    );
    setProducts(sortedOffers);
  };

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('prod_serv_events')
      .where('eventId', '==', item.eventId)
      .where('type', '==', typeNature)
      .onSnapshot(querySnapshot => {
        console.log(querySnapshot.empty);
        if (querySnapshot.empty) {
          getFormules();
        } else {
          const tabFormules: string[] = [];
          querySnapshot.forEach(documentSnapshot => {
            const prodEventData = documentSnapshot.data() as ProdServEvent;
            tabFormules.push(prodEventData.formule);
          });
          console.log(tabFormules);
          setFormulesIds(tabFormules);
        }
      });
   
    // Nettoyage de l'écouteur lors du démontage du composant
    return () => unsubscribe();
  }, [item.eventId, typeNature]);

  useEffect(() => {
    const fetchProducts = async () => {
      const newOffre: any[] = [];
      for (const formuleId of formulesIds) {
        let documentName = 'products';
        if (typeNature === '2') {
          documentName = 'services';
        }
        let data = await getFilteredArrayRecords(
          documentName,
          'formulesId',
          formuleId,
        );
        console.log(formuleId);

        const newServ = data.map(record => record.data as any);

        for (const serv of newServ) {
          const formule = serv.formules.find((f: any) => f.id === formuleId);
          const form = await getRecordById('formules', formule.formuleId);
          const offer = {
            key: formuleId,
            value: form?.name + ' Prix: ' + formule.amount + ' ' + devise,
          };
          newOffre.push(offer);
        }
      }
      setProducts(newOffre);
    };
    fetchProducts();
  }, [formulesIds, typeNature]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const event = (await getRecordById('events', item.eventId)) as Event;
        const dateDeb = parseDateTime(event.dateDebut, event.heureDebut);
        setDateDebut(event.dateDebut);
        setHeureFormatDebut(
          dateDeb.toLocaleTimeString(languageDate, {
            hour: 'numeric',
            minute: 'numeric',
            hourCycle: 'h24',
          }),
        );
        setJourFormat(
          dateDeb
            .toLocaleTimeString(languageDate, {
              weekday: 'long',
            })
            .split(' '),
        );
        const dateFin = parseDateTime(event.dateFin, event.heureFin);
        setHeureFormatFin(
          dateFin.toLocaleTimeString(languageDate, {
            hour: 'numeric',
            minute: 'numeric',
            hourCycle: 'h24',
          }),
        );
        const typeEvent = (await getRecordById(
          'type_events',
          event.name,
        )) as TypeEvent;
        let evenName = typeEvent.nameFr;
        if (selectedLanguageCode === 'en') {
          evenName = typeEvent.nameEn;
        }
        setEventName(evenName);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [item.eventId, languageDate]);

  const makeContributions = async () => {
    const uid = uuidv4();

    if (contribution == t('Global.Yes')) {
      if (nature == t('Global.Argent')) {
        if (paymentType == '1') {
          await onPressPaypal();
        } else {
          const donation = {
            id: uid,
            eventId: item.eventId,
            userId: currentUser?.uid,
            contribution: contribution,
            nature: nature,
            montant: montant,
          };
          navigation.navigate('PaymentScreen', {
            mnt: montant,
            item: donation,
            type: 'contribution',
          });
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
            console.log('Contributions added!');
            navigation.navigate('Cart' as never);
          });
      }
    } else {
      const updateDonation = {
        id: uid,
        eventId: item.eventId,
        userId: currentUser?.uid,
        contribution: contribution,
        nature: nature,
        montant: montant,
        Produits: produits,
      };
      await firestore()
        .collection('contributions')
        .doc(uid)
        .set(updateDonation);
      console.log('Contributions added!');
      navigation.navigate('Contributions' as never);
    }
  };

  const setSelectedPayment = (type: string) => {
    setPaymentType(type);
  };

  const getContributionOuiNon = (value: boolean) => {
    if (value === false) {
      setContribution(t('Global.No'));
      setDisplayNature(false);
      setDisplayBtn(true);
    }
    if (value === true) {
      setContribution(t('Global.Yes'));
      setDisplayNature(true);
      setDisplayBtn(false);
    }
    setDisplayProduit(false);
  };

  const getNatureOuiNon = (value: boolean) => {
    setDisplayBtn(true);
    setMontant('0');
    setProduits(initProduit);
    if (value === false) {
      setNature(t('Global.Nature'));
      setDisplayProduit(true);
      setDisplayArgent(false);
    }
    if (value === true) {
      setNature(t('Global.Argent'));
      setDisplayArgent(true);
      setDisplayProduit(false);
    }
  };

  
  const getTypeNatureOuiNon = (value: string) => {
    setDisplayBtn(true);
    setMontant('0');
    setProduits(initProduit);
    if (value == t('Type.Product')) {
      setTypeNature('2');
    }
    if (value == t('Type.Service')) {
      setTypeNature('1');
    }
  };

  const handleMontant = (value: string) => {
    setMontant(value);
  };

  const extractAmountFromValue = (value: string): string | null => {
    const regex = /Prix: (\d+\.?\d*)/; // RegEx pour capturer le montant après "Prix: "
    const match = value.match(regex); // Recherche du montant dans la chaîne
    console.log(match);
    if (match && match[1]) {
      return match[1]; // Retourne le montant trouvé
    }

    return null; // Si aucun montant n'est trouvé
  };

  const addProduct = async (productss: any[]) => {
    let documentName = 'products';
    if (typeNature === '2') {
      documentName = 'services';
    }
    // Filtrer les produits correspondants
    const filteredProducts = products.filter(
      product => product.key === produitId,
    );

    if (filteredProducts.length > 0) {
      // Ajouter les produits filtrés à la liste existante
      productss.push(...filteredProducts);
      const records = await getFilteredArrayRecords(
        documentName,
        'formulesId',
        produitId,
      );
      const firstRecord = records.length > 0 ? records[0] : null;

      if (firstRecord) {
        addToCartService(
          produitId,
          firstRecord.data,
          '1',
          currentUser,
          null,
          documentName,
        );
      }
      // Mettre à jour le montant pour chaque produit ajouté
      const updatedMontant = filteredProducts.reduce((total, product) => {
        console.log(`Fin ${product.key}`);
        console.log(`Fin ${product.value}`);
        const amount = extractAmountFromValue(product.value);
        return total + Number(amount);
      }, Number(montant));

      setMontant(updatedMontant.toString());
      setProduits(productss);
      setProduitId('');
    }
  };

  const deleteProduct = async (products: any[], produitId: string) => {
    const formule = products.find((f: any) => f.key === produitId);
    console.log(produitId);
    console.log(formule);
    if (formule !== undefined) {
      const amount = extractAmountFromValue(formule.value);
      const amt = Number(montant) - Number(amount);
      setMontant(amt.toString());
      setProduits(products.filter((f: any) => f.key !== produitId));
      await deleteFromCartService(produitId, currentUser?.uid || '');
    }
  };

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
      };
      console.log(dataDetail.purchase_units);
      console.log(dataDetail.purchase_units[0].items);
      const token = (await paypalApi.generateToken()) as unknown as string;
      const res = (await paypalApi.createOrder(
        token,
        dataDetail,
      )) as unknown as any;
      setAccessToken(token);
      console.log('res++++++', res);
      if (res?.links) {
        const findUrl = res.links.find(
          (data: {rel: string}) => data?.rel == 'approve',
        );
        console.log('findUrl++++++', findUrl);
        setPaypalUrl(findUrl.href);
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  const onUrlChange = (webviewState: any) => {
    console.log('webviewStatewebviewState', webviewState);
    if (webviewState.url.includes('https://example.com/cancel')) {
      clearPaypalState();
      return;
    }
    if (webviewState.url.includes('https://example.com/return')) {
      const urlValues = queryString.parseUrl(webviewState.url);
      console.log('my urls value', urlValues);
      const {token} = urlValues.query;
      if (token) {
        paymentSucess(token);
      }
    }
  };

  const paymentSucess = async (id: any) => {
    try {
      const res = paypalApi.capturePayment(id, accessToken);
      console.log('capturePayment res++++', res);
      console.log('Payment sucessfull...!!!');
      clearPaypalState();
      const uid = uuidv4();
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
          console.log('Contributions added!');
          navigation.navigate('Contributions' as never);
        });
    } catch (error) {
      console.log('error raised in payment capture', error);
    }
  };

  const clearPaypalState = () => {
    setPaypalUrl('');
    setAccessToken('');
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
    itemContainerContribution: {
      height: 120,
      marginHorizontal: 5,
      borderWidth: 0.3,
      flex: 1,
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
      borderBottomRightRadius: 10,
      borderBottomLeftRadius: 10,
      backgroundColor: 'white',
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
      flex: 1, // Prend tout l'espace disponible
      paddingTop: 20,
    },
    eventContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    dateContainer: {
      flex: 1,
    },
    detailsContainer: {
      flex: 3,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginLeft: 15,
    },
    textContainer: {
      flex: 1,
    },
    eventTitle: {
      fontSize: width > 400 ? 18 : 16, // Dynamically adjust font size based on screen width
      fontWeight: 'bold',
      color: '#333',
      marginBottom: 5,
    },
    eventTime: {
      fontSize: 14,
      color: '#666',
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
    labelContainer: {
      flex: 1,
    },
    container1: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 16,
      backgroundColor: '#f5f5f5',
      borderRadius: 8,
      marginVertical: 8,
    },
    input: {
      // width: 70,
      backgroundColor: theme.colors.surface,
      //width: '100%', // Prend toute la largeur du conteneur
    },
  });

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
          <View style={styles.eventItemContainer}>
            <View style={styles.eventContent}>
              <View style={styles.dateContainer}>
                <DateEvent dateDebut={dateDebut} flexSize={0.23} />
              </View>
              <View style={styles.detailsContainer}>
                <View style={styles.textContainer}>
                  <Text style={styles.eventTime}>
                    {jourFormat['0']} {t('Global.from')} {heureFormatDebut}{' '}
                    {t('Global.to')} {heureFormatFin}
                  </Text>
                  <TouchableOpacity>
                    <View style={{flexDirection: 'row', marginTop: 10}}>
                      <Icon
                        name={'calendar'}
                        size={20}
                        color={theme.colors.primary}
                      />
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
        <View style={defaultStyles.section}>
          <View style={[defaultStyles.itemContainerFormInvite]}>
            <CustomSwitch
              label={t('ContributionsDetails.Contribution')}
              onValueChange={value => getContributionOuiNon(value)}
            />
            {displayNature && (
              <CustomSwitchType
                label={t('ContributionsDetails.Nature')}
                onValueChange={value => getNatureOuiNon(value)}
              />
            )}
            {displayProduit && (
              <View>
                <View style={styles.container1}>
                  <View style={styles.labelContainer}>
                    <Text style={styles.label}>
                      {t('ContributionsDetails.TypeNature')}
                    </Text>
                  </View>
                  <View style={{alignItems: 'center'}}>
                    <TouchableOpacity
                      style={[
                        defaultStyles.switchContainer,
                        defaultStyles.switchEnabled,
                      ]}
                      onPress={() => getTypeNatureOuiNon(t('Type.Service'))}>
                      <View style={defaultStyles.iconTextContainer}>
                        <Text style={defaultStyles.switchText}>
                          {' '}
                          {t('Type.Product')}
                        </Text>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        defaultStyles.switchContainer,
                        defaultStyles.switchDisabled,
                      ]}
                      onPress={() => getTypeNatureOuiNon(t('Type.Product'))}>
                      <View style={defaultStyles.iconTextContainer}>
                        <Text style={defaultStyles.switchText}>
                          {t('Type.Service')}{' '}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={styles.container1}>
                  <View style={styles.labelContainer}>
                    <Text style={styles.label}>
                      {t('ContributionsDetails.Montant')} : {montant} {devise}
                    </Text>
                  </View>
                </View>
                <View>
                  <SelectList
                    key={produitId}
                    boxStyles={defaultStyles.container}
                    setSelected={(val: string) => setProduitId(val)}
                    data={products}
                    search={true}
                    save="key"
                    placeholder={t('Dropdown.Product')}
                    defaultOption={
                      produitId
                        ? products.find(typ => typ.key === produitId)
                        : undefined
                    }
                  />
                </View>
                <View>
                  <Button mode="contained" onPress={() => addProduct(produits)}>
                    {t('Global.Add')}
                  </Button>
                </View>
                <View>
                  {produits.map((product: any, index: number) => {
                    return (
                      <View key={index}>
                        <TouchableOpacity
                          key={index}
                          onPress={() => deleteProduct(produits, product.key)}>
                          <View
                            style={[
                              defaultStyles.itemContainerForm,
                              {marginVertical: 5},
                            ]}>
                            <Text
                              style={{textAlign: 'center', marginVertical: 10}}>
                              {product.value}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      </View>
                    );
                  })}
                </View>
              </View>
            )}
          </View>

          {displayArgent && (
            <SafeAreaView>
              <View style={defaultStyles.section}>
                <PaperTextInput
                  value={montant.toString()}
                  onChangeText={text => handleMontant(text)}
                  style={styles.input}
                  autoCapitalize="none"
                  returnKeyType="done"
                />
              </View>
              <Modal visible={!!paypalUrl}>
                <TouchableOpacity
                  onPress={clearPaypalState}
                  style={{margin: 24}}>
                  <Text>Closed</Text>
                </TouchableOpacity>
                <View style={{flex: 1}}>
                  <WebView
                    source={{uri: paypalUrl}}
                    onNavigationStateChange={onUrlChange}
                  />
                </View>
              </Modal>
              {paymentList.map((payment, index: number) => {
                const selectedPayment = payment.code === paymentType;
                return (
                  <View key={index}>
                    <TouchableOpacity
                      style={defaultStyles.itemContainer}
                      onPress={() => setSelectedPayment(payment.code)}>
                      <View style={defaultStyles.touchableStyle}>
                        {selectedPayment ? (
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                            }}>
                            <Icon1
                              name={'radio-btn-active'}
                              size={20}
                              color={theme.colors.primary}
                            />
                            <Text
                              style={[
                                defaultStyles.text,
                                {paddingLeft: 5, fontWeight: 'bold'},
                              ]}>
                              {payment.label}
                            </Text>
                          </View>
                        ) : (
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                            }}>
                            <Icon1
                              name={'radio-btn-passive'}
                              size={20}
                              color={theme.colors.primary}
                            />
                            <Text
                              style={[defaultStyles.text, {paddingLeft: 5}]}>
                              {payment.label}
                            </Text>
                          </View>
                        )}
                      </View>
                    </TouchableOpacity>
                  </View>
                );
              })}
            </SafeAreaView>
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
            <Button
              mode="contained"
              onPress={makeContributions}
              style={defaultStyles.button}>
              {t('Global.Save')}
            </Button>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};
