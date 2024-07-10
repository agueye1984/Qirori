import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {ManageEventsParamList, Offre, Panier, User} from '../contexts/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {LocalStorageKeys} from '../constants';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
} from 'react-native';
import {BacktoHome} from '../components/BacktoHome';
import {t} from 'i18next';
import {theme} from '../core/theme';
import Icon1 from 'react-native-vector-icons/FontAwesome';
import {useEffect, useState} from 'react';
import {useStore} from '../contexts/store';
import {v4 as uuidv4} from 'uuid';
import {DispatchAction} from '../contexts/reducers/store';
import Button from '../components/Button';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { CategoryList } from '../components/CategoryList';
import {
  widthPercentageToDP as widthToDp,
  heightPercentageToDP as heightToDp,
} from 'react-native-responsive-screen';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/theme';
import defaultComponentsThemes from '../defaultComponentsThemes';
import Icon2 from 'react-native-vector-icons/Fontisto';
import { StackNavigationProp } from '@react-navigation/stack';
import {TextInput} from 'react-native-paper';
import Icon from 'react-native-vector-icons/AntDesign';
import { offreValidator } from '../core/utils';

type serviceOfferProp = StackNavigationProp<
  ManageEventsParamList,
  'ServicesOffertsList'
>;

export const ServiceDetails = () => {
  const route = useRoute<RouteProp<ManageEventsParamList, 'ServiceDetails'>>();
  const {item} = route.params;
  const navigation = useNavigation<serviceOfferProp>();
  const [quantity, setQuantity] = useState('1');
  const [state, dispatch] = useStore();
  const [userId, setUserId] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [panier, setPanier] = useState<Panier>();
  const {ColorPallet} = useTheme();
  const {t} = useTranslation();
  const defaultStyles = defaultComponentsThemes();
  const [offreId, setOffreId] = useState('');
  const currencyCode = state.currency.toString();
  const category = CategoryList(t).find(cat => cat.id === item.category);
  const [offreError, setOffreError] = useState('');

  useEffect(() => {
    const usersRef = firestore().collection('users');
    auth().onAuthStateChanged(user => {
      if (user) {
        usersRef
          .doc(user.uid)
          .get()
          .then(document => {
            const userData = document.data() as User;
            setUserId(userData.id);
          })
          .catch(error => {
            console.log('error1 ' + error);
          });
      }
    });
  }, []);

  useEffect(() => {
    storage()
      .ref(item.images)
      .getDownloadURL()
      .then(url => setImageUrl(url));
  }, [item.images]);

  //const price = item.prixUnitaire as number;

  const styles = StyleSheet.create({
    productsList: {
      backgroundColor: '#eeeeee',
    },
    productsListContainer: {
      backgroundColor: '#eeeeee',
      paddingVertical: 8,
      marginHorizontal: 8,
    },
    container: {
      backgroundColor: 'white',
      marginVertical: 25,
    },
    header: {
      backgroundColor: theme.colors.primary,
      alignItems: 'center',
      borderBottomWidth: 12,
      borderBottomColor: '#ddd',
    },
    headerText: {
      color: 'white',
      fontSize: 25,
      padding: 20,
      margin: 20,
      textAlign: 'center',
    },
    TitleText: {
      fontSize: 25,
      // padding: 20,
      marginVertical: 20,
    },
    scrollContainer: {
      flex: 1,
      paddingHorizontal: 20,
    },
    section: {
      marginHorizontal: 15,
      paddingVertical: 5,
    },
    thumb: {
      height: 390,
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
      width: 390,
    },
    name: {
      fontSize: 22,
      fontWeight: 'bold',
    },
    price: {
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 8,
    },
    title: {
      fontSize: widthToDp(3.7),
      fontWeight: 'bold',
    },
    category: {
      fontSize: widthToDp(3.4),
      color: '#828282',
      marginTop: 3,
    },
    itemContainer: {
      marginHorizontal: 15,
      //borderBottomWidth: 0.2,
      // borderBottomStyle: 'solid',
      paddingBottom: 10,
    },
    infoContainer: {
      padding: 16,
    },
    input: {
      width: 70,
      backgroundColor: theme.colors.surface,
    },
    center: {
      flexDirection: 'row',
      // backgroundColor:'#710096',
      padding: 7,
      paddingHorizontal: 10,
      borderRadius: 20,
      marginLeft: 150,
    },
    icon: {
      // color: 'white',
      margin: 2,
      marginVertical: 20,
    },
    error: {
      ...defaultStyles.text,
      color: ColorPallet.error,
      fontWeight: 'bold',
    },
    image: {
      height: heightToDp(40),
      borderRadius: 7,
      marginBottom: heightToDp(2),
    },
  });

  const addToCart = () => {
    const offreEmpty = offreValidator(offreId, t);
    if (offreEmpty != '') {
      setOffreError(offreEmpty);
    } else {
    firestore()
      .collection('carts')
      // Filter results
      .where('userId', '==', userId)
      .where('offre', '==', offreId)
      .where('paid', '==', false)
      .get()
      .then(querySnapshot => {
        let idCart = uuidv4();
        const offre = item.offres.find(
          (offre: Offre) => offre.id == offreId,
        );
        const offreMontant = offre === undefined ? 0 : offre.montant;
        const devise = offre === undefined ? currencyCode : offre.devise;
        if (querySnapshot.empty) {
          firestore()
            .collection('carts')
            .doc(idCart)
            .set({
              id: idCart,
              offre: offreId,
              qty: quantity,
              totalPrice: parseInt(quantity) * offreMontant,
              paid: false,
              userId: userId,
              name: item.name,
              description: item.description,
              prix: offreMontant,
              devise: devise,
              tax: offreMontant * 0.14975,
              images: item.images,
              vendorId: item.userId,
              dateDelivered: '',
              statut: '',
              commandeId: '',
            })
            .then(() => {
              console.log('Cart added!');
            });
        } else {
          querySnapshot.forEach(documentSnapshot => {
            const panier = documentSnapshot.data() as Panier;
            firestore()
              .collection('carts')
              .doc(panier.id)
              .update({
                id: panier.id,
                offre: offreId,
                qty: quantity,
                totalPrice: parseInt(quantity) * offreMontant,
                paid: false,
                userId: userId,
                name: item.name,
                description: item.description,
                prix: offreMontant,
                devise: devise,
                tax: offreMontant * 0.14975,
                images: item.images,
              })
              .then(() => {
                console.log('Cart updated!');
              });
          });
        }
      });
    navigation.navigate('ServicesOffertsList', {
      item: item.category,
    });
  }
  };

  const increment = (value: string) => {
    let val = parseInt(value);
    val += 1;
    setQuantity(val.toString());
  };
  const decrement = (value: string) => {
    let val = parseInt(value);
    val -= 1;
    if (val <= 1) {
      val = 1;
    }
    setQuantity(val.toString());
  };
  const setSelectedOffre = (id: string) => {
    setOffreId(id);
  };

  return (
    <SafeAreaView>
      <BacktoHome textRoute={t('BuyProduct.title')} />
      <View style={styles.section}>
        <Image
          style={styles.image}
          source={
            imageUrl === ''
              ? require('../../assets/No_image_available.svg.png')
              : {uri: imageUrl}
          }
        />
        <Text style={styles.name}>
          {t('AddProduct.Name')} : {item.name}
        </Text>
        <Text style={styles.title}>
        {t('AddService.Category')} : {category == undefined ? '' : category.name}
          </Text>
        <Text style={styles.title}>
          {t('AddProduct.Description')} : {item.description}
        </Text>
        <Text style={styles.category}>
            {item.conditions == undefined ? '' : item.conditions}
          </Text>
          <View style={styles.infoContainer}>
            {item.offres.map((offer: any, index: number) => {
              const selectedOffre = offer.id === offreId;
              return (
                <TouchableOpacity
                  style={styles.itemContainer}
                  onPress={() => setSelectedOffre(offer.id)}
                  key={index.toString()}>
                  {selectedOffre ? (
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <Icon2
                        name={'radio-btn-active'}
                        size={20}
                        color={ColorPallet.primary}
                      />
                      <Text
                        style={[
                          defaultStyles.text,
                          {paddingLeft: 5, fontWeight: 'bold'},
                        ]}>
                        {offer.name} : {offer.montant} {offer.devise}
                      </Text>
                    </View>
                  ) : (
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <Icon2
                        name={'radio-btn-passive'}
                        size={20}
                        color={ColorPallet.primary}
                      />
                      <Text style={[defaultStyles.text, {paddingLeft: 5}]}>
                        {offer.name} : {offer.montant} {offer.devise}
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
          {offreError && (
                <Text style={styles.error}>{t('Global.OfferChoose')}</Text>
              )}
        <View style={{flexDirection: 'row'}}>
          <View style={{marginHorizontal: 5, marginVertical: 25}}>
            <Text style={styles.price}>{t('BuyProduct.Quantity')}</Text>
          </View>
          <View style={styles.center}>
            <TouchableOpacity onPress={() => decrement(quantity)}>
              <Icon name="minus" size={18} style={styles.icon} />
            </TouchableOpacity>
            <TextInput
              value={quantity.toString()}
              onChangeText={text => setQuantity(text)}
              autoCapitalize="none"
              keyboardType="number-pad"
              style={styles.input}
              selectionColor={theme.colors.primary}
              underlineColor="transparent"
              mode="outlined"
            />
            <TouchableOpacity onPress={() => increment(quantity)}>
              <Icon name="plus" size={18} style={styles.icon} />
            </TouchableOpacity>
          </View>
        </View>
        <Button mode="contained" onPress={addToCart}>
          {t('BuyProduct.AddToCart')}
        </Button>
      </View>
    </SafeAreaView>
  );
};
