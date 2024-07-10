import React, {useEffect, useState} from 'react';
import {
  Text,
  Image,
  View,
  StyleSheet,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import Icon1 from 'react-native-vector-icons/FontAwesome';
import {useTheme} from '../contexts/theme';
import {
  ManageEventsParamList,
  Offre,
  Panier,
  Service,
  User,
} from '../contexts/types';
import {useTranslation} from 'react-i18next';
import {theme} from '../core/theme';
import Icon2 from 'react-native-vector-icons/Fontisto';
import defaultComponentsThemes from '../defaultComponentsThemes';
import storage from '@react-native-firebase/storage';
import {CategoryList} from './CategoryList';
import {useNavigation} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {v4 as uuidv4} from 'uuid';
import {StackNavigationProp} from '@react-navigation/stack';
import {
  widthPercentageToDP as widthToDp,
  heightPercentageToDP as heightToDp,
} from 'react-native-responsive-screen';
import {TextInput} from 'react-native-paper';
import {useStore} from '../contexts/store';
import { offreValidator } from '../core/utils';
//import TextInput from './TextInput';

type Props = {
  service: Service;
  onPress: () => void;
  image: string;
};

type serviceOfferProp = StackNavigationProp<
  ManageEventsParamList,
  'ServicesOffertsList'
>;

export const ServiceView = ({service, image, onPress}: Props) => {
  const {ColorPallet} = useTheme();
  const {t} = useTranslation();
  const defaultStyles = defaultComponentsThemes();
  const [quantity, setQuantity] = useState('1');
  const [imageUrl, setImageUrl] = useState('');
  const [offreId, setOffreId] = useState('');
  const [userId, setUserId] = useState('');
  const navigation = useNavigation<serviceOfferProp>();
  const category = CategoryList(t).find(cat => cat.id === service.category);
  const [state] = useStore();
  const currencyCode = state.currency.toString();
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
      .ref(image)
      .getDownloadURL()
      .then(url => setImageUrl(url));
  }, [image]);

  const setSelectedOffre = (id: string) => {
    setOffreId(id);
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
          const offre = service.offres.find(
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
                name: service.name,
                description: service.description,
                prix: offreMontant,
                devise: devise,
                tax: offreMontant * 0.14975,
                images: service.images,
                vendorId: service.userId,
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
                  name: service.name,
                  description: service.description,
                  prix: offreMontant,
                  devise: devise,
                  tax: offreMontant * 0.14975,
                  images: service.images,
                })
                .then(() => {
                  console.log('Cart updated!');
                });
            });
          }
        });
      navigation.navigate('ServicesOffertsList', {
        item: service.category,
      });
    }
  };

  const styles = StyleSheet.create({
    card: {
      backgroundColor: 'white',
      borderRadius: 16,
      shadowOpacity: 0.2,
      shadowRadius: 4,
      shadowColor: 'black',
      shadowOffset: {
        height: 0,
        width: 0,
      },
      elevation: 1,
      marginVertical: 20,
    },
    thumb: {
      height: 300,
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
      width: 300,
    },
    infoContainer: {
      padding: 16,
    },
    name: {
      fontSize: 22,
      fontWeight: 'bold',
    },
    price: {
      fontSize: widthToDp(4),
      fontWeight: 'bold',
    },
    itemContainerForm: {
      height: 70,
      marginHorizontal: 15,
      borderWidth: 0.5,
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
      borderBottomRightRadius: 10,
      borderBottomLeftRadius: 10,
      backgroundColor: 'white',
    },
    column: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    container: {
      shadowColor: '#000',
      borderRadius: 10,
      marginBottom: heightToDp(4),
      shadowOffset: {
        width: 2,
        height: 5,
      },
      marginVertical: 5,
    },
    image: {
      height: heightToDp(40),
      borderRadius: 7,
      marginBottom: heightToDp(2),
    },
    title: {
      fontSize: widthToDp(3.7),
      fontWeight: 'bold',
    },
    priceContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: heightToDp(3),
    },
    category: {
      fontSize: widthToDp(3.4),
      color: '#828282',
      marginTop: 3,
    },
    stock: {
      fontSize: widthToDp(3.4),
      color: theme.colors.error,
      marginTop: 3,
    },
    itemContainer: {
      marginHorizontal: 15,
      //borderBottomWidth: 0.2,
      // borderBottomStyle: 'solid',
      paddingBottom: 10,
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
  });

  return (
    <View>
      <View style={styles.container}>
        <TouchableOpacity style={styles.card} onPress={onPress}>
          <Image
            style={styles.image}
            source={
              imageUrl === ''
                ? require('../../assets/No_image_available.svg.png')
                : {uri: imageUrl}
            }
          />
          <Text style={styles.name}>{service.name}</Text>
          <Text style={styles.title}>
            {category == undefined ? '' : category.name}
          </Text>
          <Text style={styles.category}>
            {service.conditions == undefined ? '' : service.conditions}
          </Text>
          <View style={styles.infoContainer}>
            {service.offres.map((offer: any, index: number) => {
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
        </TouchableOpacity>
      </View>
      <View style={[styles.itemContainerForm, {flexDirection: 'row'}]}>
        <View style={{flexDirection: 'row'}}>
          <View style={{marginHorizontal: 10, marginVertical: 25}}>
            <Text>{t('BuyProduct.Quantity')}</Text>
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
        <View style={{flexDirection: 'row', marginLeft: 50}}>
          <TouchableOpacity style={styles.card} onPress={addToCart}>
            <Icon
              name={'shoppingcart'}
              color={theme.colors.primary}
              size={30}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
