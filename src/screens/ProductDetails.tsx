import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {Category, ManageEventsParamList} from '../contexts/types';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
  Dimensions,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import {BacktoHome} from '../components/BacktoHome';
import {theme} from '../core/theme';
import {useEffect, useState} from 'react';
import Button from '../components/Button';
import storage from '@react-native-firebase/storage';
import auth from '@react-native-firebase/auth';
import {widthPercentageToDP as widthToDp} from 'react-native-responsive-screen';
import defaultComponentsThemes from '../defaultComponentsThemes';
import {useTheme} from '../contexts/theme';
import {useTranslation} from 'react-i18next';
import {StackNavigationProp} from '@react-navigation/stack';
import {addToCartService} from '../services/CartsServices';
import {getRecordById} from '../services/FirestoreServices';
import {useStore} from '../contexts/store';
import Icon2 from 'react-native-vector-icons/Fontisto';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import Stepper from '../components/Stepper';

type serviceOfferProp = StackNavigationProp<
  ManageEventsParamList,
  'ServicesOffertsList'
>;

export const ProductDetails = () => {
  const currentUser = auth().currentUser;
  const [state] = useStore();
  const route = useRoute<RouteProp<ManageEventsParamList, 'ProductDetails'>>();
  const {item} = route.params;
  const navigation = useNavigation<serviceOfferProp>();
  const [quantity, setQuantity] = useState(1);
  const {t, i18n} = useTranslation();
  const [category, setCategory] = useState<Category>();
  const defaultStyles = defaultComponentsThemes();
  const {ColorPallet} = useTheme();
  const [imagesUrl, setImagesUrl] = useState<string[]>([]);
  const [formuleId, setFormuleId] = useState('');
  const [offreError, setOffreError] = useState('');
  const [loading, setLoading] = useState(true);
  const devise = state.currency.toString();
  const [activeSlide, setActiveSlide] = useState(0);
  const [loadedOffers, setLoadedOffers] = useState<{[key: string]: string}>({});
  const selectedLanguage = i18n.language;

  useEffect(() => {
    const getImages = async () => {
      try {
        const tabUrl: string[] = [];
        for (const imageServ of item.images) {
          const url = await storage().ref(imageServ).getDownloadURL();
          tabUrl.push(url);
        }
        console.log('Fetched URLs:', tabUrl);
        setImagesUrl(tabUrl);
      } catch (error) {
        console.error('Error fetching image URLs:', error);
      } finally {
        setLoading(false);
      }
    };
    getImages();
  }, [item.images]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cat = (await getRecordById(
          'categories',
          item.category,
        )) as Category;
        setCategory(cat);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [item.category]);

  useEffect(() => {
    const loadOffers = async () => {
      const newLoadedOffers = {...loadedOffers};
      for (const formula of item.formules) {
        if (!newLoadedOffers[formula.formuleId]) {
          const formule = await getRecordById('formules', formula.formuleId);
          newLoadedOffers[formula.formuleId] = formule?.name;
        }
      }
      setLoadedOffers(newLoadedOffers);
    };
    loadOffers();
  }, [item.formules]);

  const handleAddToCart = () => {
    if (formuleId === 'All' || formuleId === '') {
      setOffreError(t('Global.OffreErrorEmpty'));
    } else {
      setOffreError('');
      addToCartService(
        formuleId,
        item,
        quantity.toString(),
        currentUser,
        navigation,
        'products',
      );
    }
  };

  const increment = () => setQuantity(quantity + 1);
  const decrement = () => setQuantity(quantity > 0 ? quantity - 1 : 0); // Évite les nombres négatifs
  const handleQuantity = (text: string) => {
    const parsed = parseInt(text, 10);
    setQuantity(isNaN(parsed) ? 0 : parsed);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'white',
    },
    carouselContainer: {
      flexGrow: 0, // Fixe la hauteur pour le carousel uniquement
      marginBottom: 20,
    },
    image: {
      height: Dimensions.get('window').width - 60,
      width: Dimensions.get('window').width - 60,
      borderRadius: 7,
    },
    slide: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    contentContainer: {
      paddingHorizontal: 16,
      flexGrow: 1,
      paddingBottom: 20,
    },
    section: {
      marginHorizontal: 15,
      paddingVertical: 5,
    },
    text: {
      fontSize: 16,
      marginBottom: 10,
    },
    infoContainer: {
      padding: 16,
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
      marginLeft: 150,
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
    name: {
      fontSize: 18,
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
    container1: {
      flex: 1, // Prend tout l'espace disponible
      paddingTop: 20,
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

  const renderItem = ({item}: {item: string}) => (
    <View style={styles.slide}>
      <Image source={{uri: item}} style={styles.image} />
    </View>
  );

  return (
    <SafeAreaView style={styles.container1}>
      <BacktoHome textRoute={t('BuyProduct.title')} />
      <View style={styles.carouselContainer}>
        {loading ? (
          <ActivityIndicator size="large" color={theme.colors.primary} />
        ) : (
          <View>
            <Carousel
              data={imagesUrl}
              renderItem={renderItem}
              sliderWidth={Dimensions.get('window').width}
              itemWidth={Dimensions.get('window').width - 60}
              autoplay={true}
              loop={true}
              onSnapToItem={index => setActiveSlide(index)} // Met à jour l'index pour la pagination
            />
            <Pagination
              dotsLength={imagesUrl.length}
              activeDotIndex={activeSlide} // Met à jour la pagination selon le slide actif
              containerStyle={styles.paginationContainer}
              dotStyle={styles.dot}
              inactiveDotStyle={styles.inactiveDot}
              inactiveDotOpacity={0.4}
              inactiveDotScale={0.6}
            />
          </View>
        )}
      </View>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={{marginVertical: 10}}>
          <Text style={styles.text}>
            <Text style={styles.name}>{t('AddProduct.Name')} :</Text>{' '}
            {item.name}
          </Text>
          <Text style={styles.text}>
            <Text style={styles.name}>{t('AddService.Category')} :</Text>{' '}
            {selectedLanguage === 'fr' ? category?.nameFr : category?.nameEn}{' '}
          </Text>
          <Text style={styles.text}>
            <Text style={styles.name}>{t('AddProduct.Description')} :</Text>{' '}
            {item.description}
          </Text>
        </View>
        <View style={{marginVertical: 10}}>
          {item.formules.map((item: any, index: number) => {
            const tabOffer = loadedOffers[item.formuleId] || '';
            const selectedOffre = item.id === formuleId;
            const totalPrice = parseInt(item.amount) * quantity! + ' ' + devise;
            return (
              <TouchableOpacity
                style={styles.itemContainer}
                onPress={() => setFormuleId(item.id)}
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
                      {tabOffer} {t('Global.Prix')} : {item.amount} {devise}{' '}
                      {t('Global.Total')} : {totalPrice}
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
                      {tabOffer} {t('Global.Prix')} : {item.amount} {devise}{' '}
                      {t('Global.Total')} : {totalPrice}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
          {offreError && (
            <Text style={styles.error}>{t('Global.OfferChoose')}</Text>
          )}
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
      </ScrollView>
    </SafeAreaView>
  );
};
