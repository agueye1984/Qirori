import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {ManageEventsParamList, Panier, User} from '../contexts/types';
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
import {
  widthPercentageToDP as widthToDp,
  heightPercentageToDP as heightToDp,
} from 'react-native-responsive-screen';
import {CategoryList} from '../components/CategoryList';
import defaultComponentsThemes from '../defaultComponentsThemes';
import {useTheme} from '../contexts/theme';
import {useTranslation} from 'react-i18next';
import {TextInput} from 'react-native-paper';
import Icon from 'react-native-vector-icons/AntDesign';
import { StackNavigationProp } from '@react-navigation/stack';

type serviceOfferProp = StackNavigationProp<
  ManageEventsParamList,
  'ServicesOffertsList'
>;

export const ProductDetails = () => {
  const route = useRoute<RouteProp<ManageEventsParamList, 'ProductDetails'>>();
  const {item} = route.params;
  const navigation = useNavigation<serviceOfferProp>();
  const [quantity, setQuantity] = useState('1');
  const [state, dispatch] = useStore();
  const [userId, setUserId] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const {t} = useTranslation();
  const [panier, setPanier] = useState<Panier>();
  const category = CategoryList(t).find(cat => cat.id === item.category);
  const defaultStyles = defaultComponentsThemes();
  const {ColorPallet} = useTheme();
  const [isStock, setIsStock] = useState(false);
  const [stock, setStock] = useState(0);
  const [nbrProduct, setNbreProduct] = useState(0);

  const getNbrProducts = () => {
    firestore()
      .collection('carts')
      .where('product', '==', item.id)
      .get()
      .then(querySnapshot => {
        let nbr = 0;
        querySnapshot.forEach(documentSnapshot => {
          const cart = documentSnapshot.data() as Panier;
          nbr += cart.qty;
        });
        const nbRestant = item.quantite - nbrProduct;
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
      .ref(item.images)
      .getDownloadURL()
      .then(url => setImageUrl(url));
  }, [item.images]);

  useEffect(() => {
    getNbrProducts();
  }, [nbrProduct]);

  const price = item.prixUnitaire as number;

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
    stock: {
      fontSize: widthToDp(3.4),
      color: theme.colors.error,
      marginTop: 3,
    },
  });

  const addToCart = () => {
    firestore()
      .collection('carts')
      // Filter results
      .where('userId', '==', userId)
      .where('product', '==', item.id)
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
              product: item.id,
              qty: parseInt(quantity),
              totalPrice: parseInt(quantity) * item.prixUnitaire,
              paid: false,
              userId: userId,
              name: item.name,
              description: item.description,
              prix: item.prixUnitaire,
              devise: item.devise,
              tax: item.prixUnitaire * 0.14975,
              images: item.images,
              vendorId: item.userId,
              dateDelivered: '',
              statut: '',
              commandeId: '',
            })
            .then(() => {
              console.log('Cart added!');
              navigation.navigate('ServicesOffertsList', {
                item: item.category,
              });
            });
        } else {
          querySnapshot.forEach(documentSnapshot => {
            const panier = documentSnapshot.data() as Panier;
            firestore()
              .collection('carts')
              .doc(panier.id)
              .update({
                id: panier.id,
                product: item.id,
                qty: parseInt(quantity),
                totalPrice: parseInt(quantity) * item.prixUnitaire,
                paid: false,
                userId: userId,
                name: item.name,
                description: item.description,
                prix: item.prixUnitaire,
                devise: item.devise,
                tax: item.prixUnitaire * 0.14975,
                images: item.images,
              })
              .then(() => {
                console.log('Cart updated!');
                navigation.navigate('ServicesOffertsList', {
                  item: item.category,
                });
              });
          });
        }
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
          {t('AddService.Category')} :{' '}
          {category == undefined ? '' : category.name}
        </Text>
        <Text style={styles.title}>
          {t('AddProduct.Description')} : {item.description}
        </Text>
        <Text style={styles.price}>
          {t('AddProduct.PrixUnitaire')} : {price + ' ' + item.devise}
        </Text>
        {isStock ? (
          <Text style={styles.stock}>
            {stock} {t('BuyProduct.Stock')}
          </Text>
        ) : (
          <Text style={styles.stock}>{t('BuyProduct.NoStock')}</Text>
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
