import React, {useEffect, useState} from 'react';
import {Text, Image, View, StyleSheet, TouchableOpacity} from 'react-native';
import {
  Category,
  ManageEventsParamList,
  Product,
} from '../contexts/types';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {theme} from '../core/theme';
import storage from '@react-native-firebase/storage';
import auth from '@react-native-firebase/auth';
import {
  widthPercentageToDP as widthToDp,
  heightPercentageToDP as heightToDp,
} from 'react-native-responsive-screen';
import {StackNavigationProp} from '@react-navigation/stack';
import {addToCartService} from '../services/CartsServices';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import {
  getNbrProductsByFormule,
  getRecordById,
} from '../services/FirestoreServices';
import Icon2 from 'react-native-vector-icons/Fontisto';
import {useStore} from '../contexts/store';
import {useTheme} from '../contexts/theme';
import defaultComponentsThemes from '../defaultComponentsThemes';
import Stepper from './Stepper';
import Button from './Button';

type Props = {
  product: Product;
  onPress: () => void;
  image: string[];
  participantCount: number;
  selectFormule: string;
};

type serviceOfferProp = StackNavigationProp<
  ManageEventsParamList,
  'ServicesOffertsList'
>;

export const ProductView = ({
  product,
  onPress,
  image,
  participantCount,
  selectFormule,
}: Props) => {
  const currentUser = auth().currentUser;
  const [state] = useStore();
  const navigation = useNavigation<serviceOfferProp>();
  const {t, i18n} = useTranslation();
  const [imagesUrl, setImagesUrl] = useState<string[]>([]);
  const [category, setCategory] = useState<Category>();
  const [formuleId, setFormuleId] = useState(selectFormule);
  const [quantity, setQuantity] = useState(participantCount);
  const [offreError, setOffreError] = useState('');
  const {ColorPallet} = useTheme();
  const defaultStyles = defaultComponentsThemes();
  const [loadedOffers, setLoadedOffers] = useState<{[key: string]: string}>({});
  const [stockPerFormule, setStockPerFormule] = useState<{
    [key: string]: number;
  }>({});
  const devise = state.currency.toString();
  const selectedLanguage = i18n.language;

  useEffect(() => {
    setQuantity(participantCount);
  }, [participantCount]);

  useEffect(() => {
    setFormuleId(selectFormule);
  }, [selectFormule]);

  useEffect(() => {
    const getImages = async () => {
      const tabUrl: string[] = [];
      for (const imageServ of image) {
        const url = await storage().ref(imageServ).getDownloadURL();
        tabUrl.push(url);
      }
      setImagesUrl(tabUrl);
    };
    getImages();
  }, [image]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cat = (await getRecordById(
          'categories',
          product.category,
        )) as Category;
        setCategory(cat);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [product]);

  useEffect(() => {
    const loadOffers = async () => {
      const newLoadedOffers = {...loadedOffers};
      for (const formula of product.formules) {
        if (!newLoadedOffers[formula.formuleId]) {
          const formule = await getRecordById('formules', formula.formuleId);
          newLoadedOffers[formula.formuleId] = formule?.name;
        }
      }
      setLoadedOffers(newLoadedOffers);
    };
    const fetchStockForFormules = async () => {
      const stockData: {[key: string]: number} = {};
      for (const formula of product.formules) {
        const stockPanier = await getNbrProductsByFormule(formula.id);
        stockData[formula.id] = formula.quantity - stockPanier;
      }
      setStockPerFormule(stockData);
    };

    loadOffers();
    fetchStockForFormules();
  }, [product]);

  const setSelectedOffre = (id: string) => {
    setOffreError('');
    setFormuleId(id);
  };

  const handleAddToCart = async () => {
    if (formuleId === 'All' || formuleId === '') {
      setOffreError(t('Global.OffreErrorEmpty'));
    } else {
      setOffreError('');
      addToCartService(
        formuleId,
        product,
        quantity.toString(),
        currentUser,
        navigation,
        'products',
      );
      const newStockForFormule = await getNbrProductsByFormule(formuleId);
      const formule = product.formules.find((f: any) => f.id === formuleId);

      const totalStock = formule.quantity;
      setStockPerFormule(prevStock => ({
        ...prevStock,
        [formuleId]: totalStock - newStockForFormule, // Mettre à jour le stock pour la formule sélectionnée
      }));
    }
  };

  const increment = () => setQuantity(quantity + 1);
  const decrement = () => setQuantity(quantity > 0 ? quantity - 1 : 0); // Évite les nombres négatifs
  const handleQuantity = (text: string) => {
    const parsed = parseInt(text, 10);
    setQuantity(isNaN(parsed) ? 0 : parsed);
  };

  const styles = StyleSheet.create({
    card: {
      //backgroundColor: 'white',
      borderRadius: 16,
      // shadowOpacity: 0.2,
      // shadowRadius: 4,
      //shadowColor: 'black',
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
      flex: 1,
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
      width: '100%', // Assurez-vous que l'image prend toute la largeur
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
      paddingBottom: 10,
    },
    input: {
      width: 70,
      backgroundColor: theme.colors.surface,
    },
    center: {
      flexDirection: 'row',
      padding: 7,
      paddingHorizontal: 10,
      borderRadius: 20,
    },
    icon: {
      margin: 2,
      marginVertical: 20,
    },
    error: {
      ...defaultStyles.text,
      color: ColorPallet.error,
      fontWeight: 'bold',
    },
    slide: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    paginationContainer: {
      paddingVertical: 10,
    },
    dot: {
      width: 10,
      height: 10,
      borderRadius: 5,
      marginHorizontal: 8,
      backgroundColor: 'rgba(0, 0, 0, 0.92)',
    },
    inactiveDot: {
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    container2: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 16,
      backgroundColor: '#f5f5f5',
      borderRadius: 8,
      marginVertical: 8,
    },
    labelContainer: {
      flex: 1,
    },
    label: {
      fontSize: 14,
      fontWeight: 'bold',
    },
  });

  const renderItem = ({item}: {item: string}) => {
    //console.log('Rendering item:', item);
    return (
      <View style={styles.slide}>
        <Image
          source={
            item === ''
              ? require('../../assets/No_image_available.svg.png')
              : {uri: item}
          }
          style={styles.image}
        />
      </View>
    );
  };

  return (
    <View>
      <View style={styles.container}>
        <TouchableOpacity style={styles.card} onPress={onPress}>
          <Carousel
            data={imagesUrl}
            renderItem={renderItem}
            sliderWidth={widthToDp(100)}
            itemWidth={widthToDp(100)}
            autoplay={false}
            loop={false}
          />
          <Pagination
            dotsLength={image.length}
            activeDotIndex={0}
            containerStyle={styles.paginationContainer}
            dotStyle={styles.dot}
            inactiveDotStyle={styles.inactiveDot}
          />
          <Text style={styles.name}>{product.name}</Text>
          <Text style={styles.title}>
            {selectedLanguage === 'fr' ? category?.nameFr : category?.nameEn}{' '}
          </Text>
          <View style={styles.infoContainer}>
            {product.formules.map((item, index) => {
              const isSelected = item.id === formuleId;
              const totalPrice = `${parseInt(item.amount) * quantity} ${
                state.currency
              }`;
              const tabOffer = loadedOffers[item.formuleId] || '';
              const stockForThisFormule = stockPerFormule[item.id] || 0;

              return (
                <TouchableOpacity
                  style={styles.itemContainer}
                  onPress={() => setSelectedOffre(item.id)}
                  key={index.toString()}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Icon2
                      name={
                        isSelected ? 'radio-btn-active' : 'radio-btn-passive'
                      }
                      size={20}
                      color={ColorPallet.primary}
                    />
                    <Text style={[defaultStyles.text, {paddingLeft: 5}]}>
                      {tabOffer} | {t('Global.Prix')} : {item.amount} {devise} |{' '}
                      {t('Global.Stock')} : {stockForThisFormule} |{' '}
                      {t('Global.Total')} : {totalPrice}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
            {offreError && <Text style={styles.error}>{offreError}</Text>}
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.container2}>
        <View style={styles.labelContainer}>
          <Text style={styles.label}>
            <Text style={styles.price}>{t('BuyProduct.Quantity')}</Text>
          </Text>
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Stepper
            value={quantity}
            onIncrement={increment}
            onDecrement={decrement}
            onChange={handleQuantity}
          />
        </View>
      </View>
      <Button mode="contained" onPress={handleAddToCart}>
          {t('BuyProduct.AddToCart')}
        </Button>
    </View>
  );
};
