import {useEffect, useState} from 'react';
import {
  FlatList,
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Header from '../components/Header';
import {useStore} from '../contexts/store';
import Button from '../components/Button';
import {useNavigation} from '@react-navigation/native';
import ShippingAddress from '../components/ShippingAddress';
import DefaultComponentsThemes from '../defaultComponentsThemes';
import {useTranslation} from 'react-i18next';
import {v4 as uuidv4} from 'uuid';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import paypalApi from '../apis/paypalApi';
import queryString from 'query-string';
import WebView from 'react-native-webview';
import {theme} from '../core/theme';
import Icon1 from 'react-native-vector-icons/Fontisto';
import {
  Adresse,
  Commande,
  ManageEventsParamList,
  Panier,
  User,
} from '../contexts/types';
import {StackNavigationProp} from '@react-navigation/stack';
import {BacktoHome} from '../components/BacktoHome';

type OrderDoneProps = StackNavigationProp<
  ManageEventsParamList,
  'CommandesEffectuees'
>;

export const Checkout = () => {
  const currentUser = auth().currentUser;
  let address: Adresse = {
    city: '',
    province: '',
    id: '',
    address_line_1: '',
    address_line_2: '',
    postalCode: '',
    userId: '',
    countryCode: '',
  };
  const {t, i18n} = useTranslation();
  const [state] = useStore();
  const navigation = useNavigation<OrderDoneProps>();
  const [shippingAddress, setShippingAddress] = useState(address);
  const defaultStyles = DefaultComponentsThemes();
  const [hasAdresse, setHasAdresse] = useState(false);
  const [total, setTotal] = useState(0);
  const [carts, setCarts] = useState<Panier[]>([]);
  const [paypalUrl, setPaypalUrl] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const currencyCode = state.currency.toString();
  const [items, setItems] = useState<any[]>([]);
  const [totalTax, setTotalTax] = useState(0);
  const [modifierAdresse, setModifierAdresse] = useState(false);
  const [paymentType, setPaymentType] = useState('');

  const paymentList = [
    {code: '1', label: t('PaymentList.Paypal')},
    {code: '2', label: t('PaymentList.Card')},
  ];

  const selectedLanguageCode = i18n.language;
  let languageDate = selectedLanguageCode === 'fr' ? 'fr-fr' : 'en-GB';
  let dateDelivered = new Date();
  dateDelivered.setDate(dateDelivered.getDate() + 5);
  const dateformat = dateDelivered
    .toLocaleDateString(languageDate, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
    .split('/')
    .reverse()
    .join('');

  useEffect(() => {
    const usersRef = firestore().collection('users');
    auth().onAuthStateChanged(user => {
      if (user) {
        usersRef
          .doc(user.uid)
          .get()
          .then(document => {
            const userData = document.data() as User;
            setName(userData.displayName);
            setEmail(userData.email);
            setPhone(userData.phoneNumber);
          });
      }
    });
  }, []);

  useEffect(() => {
    firestore()
      .collection('addresses')
      .where('userId', '==', currentUser?.uid)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(documentSnapshot => {
          setHasAdresse(true);
          setShippingAddress(documentSnapshot.data() as Adresse);
        });
      });
  }, [currentUser?.uid]);

  useEffect(() => {
    firestore()
      .collection('carts')
      .where('userId', '==', currentUser?.uid)
      .where('paid', '==', false)
      .get()
      .then(querySnapshot => {
        let tot = 0;
        let cart: Panier[] = [];
        let itemProduct: any[] = [];
        let tax = 0;
        querySnapshot.forEach(documentSnapshot => {
          let panier = documentSnapshot.data() as Panier;
          panier.statut = '1';
          panier.dateDelivered = dateformat;
          cart.push(panier);
          tot += panier.totalPrice;
          const taxUnit = Number(panier.tax.toFixed(2));
          tax += Number((taxUnit * panier.qty).toFixed(2));
          const item = {
            name: panier.name,
            description: panier.description,
            quantity: panier.qty,
            unit_amount: {currency_code: panier.devise, value: panier.prix},
            tax: {currency_code: panier.devise, value: taxUnit},
          };
          itemProduct.push(item);
        });
        setTotalTax(tax);
        setTotal(tot);
        setCarts(cart);
        setItems(itemProduct);
      });
  }, [currentUser?.uid]);

  const ProceedPay = async () => {
    if (paymentType == '1') {
      await onPressPaypal();
    } else {
      const paymentTotal = Number((total + totalTax).toFixed(2));
      const uid = uuidv4();
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
      };
      navigation.navigate('PaymentScreen', {
        mnt: paymentTotal.toString(),
        item: commande,
        type: 'commande',
      });
    }
  };

  const onPressPaypal = async () => {
    try {
      const paymentTotal = Number((total + totalTax).toFixed(2)); // 6.7
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
      };
      console.log(dataDetail.purchase_units);
      console.log(dataDetail.purchase_units[0].items);
      console.log(dataDetail.purchase_units[0].amount);
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
      const res = await paypalApi.capturePayment(id, accessToken);
      console.log('capturePayment res++++', res);
      console.log('Payment sucessfull...!!!');
      clearPaypalState();
      const uid = uuidv4();
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
      };
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
              carts.map(panier => {
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
                    console.log('Paniers updated!');
                  });
              });
              console.log('Commandes added!');
              navigation.navigate('CommandesEffectuees', {
                item: commande as Commande,
              });
            });
        });
    } catch (error) {
      console.log('error raised in payment capture', error);
    }
  };

  const handleAddressInputChange = (address: any) => {
    setShippingAddress(address)
  }

  const modifiyShippingAddresse = () => {
    setHasAdresse(false);
    setModifierAdresse(true);
  };

  const cancelShippingAddresse = () => {
    setHasAdresse(true);
    setModifierAdresse(false);
  };

  const clearPaypalState = () => {
    setPaypalUrl('');
    setAccessToken('');
  };

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
    {key: 'header', component: <Header>{t('Checkout.title')}</Header>},
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
            {hasAdresse && !modifierAdresse && (
              <TouchableOpacity onPress={modifiyShippingAddresse}>
                <Text style={{color: theme.colors.primary}}>
                  {' '}
                  {t('Global.Modify')}
                </Text>
              </TouchableOpacity>
            )}
            {!hasAdresse && modifierAdresse && (
              <TouchableOpacity onPress={cancelShippingAddresse}>
                <Text style={{color: theme.colors.primary}}>
                  {' '}
                  {t('Global.Cancel')}
                </Text>
              </TouchableOpacity>
            )}
          </View>
          {hasAdresse ? (
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
          ) : (
            <ShippingAddress  shippingAddress={shippingAddress} onChange={handleAddressInputChange} />
          )}
        </View>
      ),
    },
    {
      key: 'payment',
      component: paymentList.map((payment: any, index: number) => {
        const selectedPayment = payment.code === paymentType;
        return (
          <View key={index}>
            <TouchableOpacity
              style={defaultStyles.itemContainer}
              onPress={() => setPaymentType(payment.code)}>
              <View style={defaultStyles.touchableStyle}>
                {selectedPayment ? (
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
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
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Icon1
                      name={'radio-btn-passive'}
                      size={20}
                      color={theme.colors.primary}
                    />
                    <Text style={[defaultStyles.text, {paddingLeft: 5}]}>
                      {payment.label}
                    </Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          </View>
        );
      }),
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <BacktoHome textRoute={t('Cart.title')} />

      {/*  <View style={{flex: 1, justifyContent: 'center', alignContent: 'center'}}> */}
      <Modal visible={!!paypalUrl}>
        {/* Modal and WebView logic */}
        <TouchableOpacity style={{margin: 24}}>
          <Text>x</Text>
        </TouchableOpacity>
        <View style={{flex: 1}}>
          <WebView
            source={{uri: paypalUrl}}
            onNavigationStateChange={onUrlChange}
          />
        </View>
      </Modal>
      <FlatList
        data={data}
        renderItem={({item}) => <View>{item.component}</View>}
        keyExtractor={item => item.key}
        contentContainerStyle={[
          defaultStyles.scrollViewContent,
          {paddingBottom: 100},
        ]}
      />

      {/*  </View> */}
      <View style={styles.bottomButtonContainer}>
        <View style={defaultStyles.buttonContainer}>
          <Button
            mode="contained"
            onPress={ProceedPay} // Fonction à appeler lorsque l'utilisateur appuie sur le bouton
            style={styles.button}>
            <Text style={styles.buttonText}>{t('Checkout.PlaceOrder')}</Text>
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
};
