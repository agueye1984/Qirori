import React, {useContext, useEffect, useState} from 'react';
import {Text, Image, View, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import Icon1 from 'react-native-vector-icons/FontAwesome';
import {ManageEventsParamList, Panier, Product, User} from '../contexts/types';
import {v4 as uuidv4} from 'uuid';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {LocalStorageKeys} from '../constants';
import {useStore} from '../contexts/store';
import {DispatchAction} from '../contexts/reducers/store';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {theme} from '../core/theme';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {CategoryList} from './CategoryList';
import {
  widthPercentageToDP as widthToDp,
  heightPercentageToDP as heightToDp,
} from 'react-native-responsive-screen';
import {TextInput} from 'react-native-paper';
import { StackNavigationProp } from '@react-navigation/stack';

type Props = {
  product: Product;
  onPress: () => void;
  image: string;
};

type serviceOfferProp = StackNavigationProp<
  ManageEventsParamList,
  'ServicesOffertsList'
>;

export const ProductView = ({product, image, onPress}: Props) => {
  const [quantity, setQuantity] = useState('1');
  const [userId, setUserId] = useState('');
  const navigation = useNavigation<serviceOfferProp>();
  const {t} = useTranslation();
  const [imageUrl, setImageUrl] = useState('');
  const [nbrProduct, setNbreProduct] = useState(0);
  const [isStock, setIsStock] = useState(false);
  const [stock, setStock] = useState(0);
  const category = CategoryList(t).find(cat => cat.id === product.category);

  const getNbrProducts = () => {
    firestore()
      .collection('carts')
      .where('product', '==', product.id)
      .get()
      .then(querySnapshot => {
        let nbr = 0;
        querySnapshot.forEach(documentSnapshot => {
          const cart = documentSnapshot.data() as Panier;
          nbr += cart.qty;
        });
        const nbRestant = product.quantite - nbrProduct;
        setIsStock(false);
        if (nbRestant > 0) {
          setIsStock(true);
        }

        setStock(nbRestant);
        setNbreProduct(nbr);
      });
  };

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

  useEffect(() => {
    getNbrProducts();
  }, [nbrProduct]);

  const addToPanier = () => {
    firestore()
      .collection('carts')
      // Filter results
      .where('userId', '==', userId)
      .where('product', '==', product.id)
      .where('paid', '==', false)
      .get()
      .then(querySnapshot => {
        let idCart = uuidv4();
        if (querySnapshot.empty) {
          firestore()
            .collection('carts')
            .doc(idCart)
            .set({
              id: idCart,
              product: product.id,
              qty: parseInt(quantity),
              totalPrice: parseInt(quantity) * product.prixUnitaire,
              paid: false,
              userId: userId,
              name: product.name,
              description: product.description,
              prix: product.prixUnitaire,
              devise: product.devise,
              tax: product.prixUnitaire * 0.14975,
              images: product.images,
              vendorId: product.userId,
              dateDelivered: '',
              statut: '',
              commandeId: '',
            })
            .then(() => {
              console.log('Cart added!');
              getNbrProducts();
            });
        } else {
          querySnapshot.forEach(documentSnapshot => {
            const panier = documentSnapshot.data() as Panier;
            firestore()
              .collection('carts')
              .doc(panier.id)
              .update({
                id: panier.id,
                product: product.id,
                qty: parseInt(quantity),
                totalPrice: parseInt(quantity) * product.prixUnitaire,
                paid: false,
                userId: userId,
                name: product.name,
                description: product.description,
                prix: product.prixUnitaire,
                devise: product.devise,
                tax: product.prixUnitaire * 0.14975,
                images: product.images,
                vendorId: product.userId,
                dateDelivered: '',
                statut: '',
              })
              .then(() => {
                getNbrProducts();
                console.log('Cart updated!');
              });
          });
        }
      });

      navigation.navigate('ServicesOffertsList', {
        item: category===undefined ? '':category.id,
      });
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

  const styles = StyleSheet.create({
    card: {
      backgroundColor: 'white',
      borderRadius: 16,
      shadowOpacity: 0.1,
      shadowRadius: 4,
      shadowColor: 'black',
      shadowOffset: {
        height: 0,
        width: 0,
      },
      elevation: 1,
      marginVertical: 5,
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
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 8,
    },
    itemContainerForm: {
      height: 70,
      marginHorizontal: 5,
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
      marginVertical: 15,
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
          <Text style={styles.name}>{product.name}</Text>
          <Text style={styles.title}>
            {category == undefined ? '' : category.name}
          </Text>
          <Text style={styles.price}>
            {product.prixUnitaire.toLocaleString(undefined, {
              maximumFractionDigits: 2,
            }) +
              ' ' +
              product.devise}
          </Text>
          {isStock ? (
            <Text style={styles.stock}>
              {stock} {t('BuyProduct.Stock')}
            </Text>
          ) : (
            <Text style={styles.stock}>{t('BuyProduct.NoStock')}</Text>
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

        <View style={{flexDirection: 'row', marginLeft: 100}}>
          {isStock ? (
            <TouchableOpacity style={styles.card} onPress={addToPanier}>
              <Icon
                name={'shoppingcart'}
                color={theme.colors.primary}
                size={30}
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.card} disabled={isStock}>
              <Icon
                name={'shoppingcart'}
                color={theme.colors.primary}
                size={30}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};
