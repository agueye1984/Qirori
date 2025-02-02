import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {
  Category,
  ManageEventsParamList,
  ScheduleState,
  TypePrix,
} from '../contexts/types';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
  ActivityIndicator,
  Dimensions,
  ScrollView,
} from 'react-native';
import {BacktoHome} from '../components/BacktoHome';
import {theme} from '../core/theme';
import {useEffect, useState} from 'react';
import storage from '@react-native-firebase/storage';
import auth from '@react-native-firebase/auth';
import {useTranslation} from 'react-i18next';
import {useTheme} from '../contexts/theme';
import defaultComponentsThemes from '../defaultComponentsThemes';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import Button from '../components/Button';
import Icon2 from 'react-native-vector-icons/Fontisto';
import {StackNavigationProp} from '@react-navigation/stack';
import {getRecordById} from '../services/FirestoreServices';
import {useStore} from '../contexts/store';
import {GetWeekendList} from '../components/WeekendList';
import {addToCartService} from '../services/CartsServices';
import Stepper from '../components/Stepper';

interface GroupedSchedule {
  startTime: string;
  endTime: string;
  capacity: string;
  days: string[];
}

type serviceOfferProp = StackNavigationProp<
  ManageEventsParamList,
  'ServicesOffertsList'
>;

const groupSchedule = (schedule: ScheduleState): GroupedSchedule[] => {
  const grouped: {[key: string]: GroupedSchedule} = {};
  const {t} = useTranslation();
  const daysNames = GetWeekendList(t);

  for (const [day, {startTime, endTime, capacity}] of Object.entries(
    schedule,
  )) {
    const key = `${startTime}-${endTime}-${capacity}`;
    if (!grouped[key]) {
      grouped[key] = {startTime, endTime, capacity, days: []};
    }
    grouped[key].days.push(daysNames[day]);
  }

  return Object.values(grouped);
};

export const ServiceDetails = () => {
  const currentUser = auth().currentUser;
  const route = useRoute<RouteProp<ManageEventsParamList, 'ServiceDetails'>>();
  const item = route.params.item;
  const navigation = useNavigation<serviceOfferProp>();
  const [quantity, setQuantity] = useState(1);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const {t, i18n} = useTranslation();
  const [category, setCategory] = useState<Category>();
  const defaultStyles = defaultComponentsThemes();
  const {ColorPallet} = useTheme();
  const [formuleId, setFormuleId] = useState('');
  const [offreError, setOffreError] = useState('');
  const [activeSlide, setActiveSlide] = useState(0);
  const selectedLanguage = i18n.language;
  const [loadedOffers, setLoadedOffers] = useState<{[key: string]: string}>({});
  const [state] = useStore();

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
    const getImages = async () => {
      try {
        const tabUrl: string[] = [];
        for (const imageServ of item.images) {
          const url = await storage().ref(imageServ).getDownloadURL();
          tabUrl.push(url);
        }
        console.log('Fetched URLs:', tabUrl);
        setImageUrls(tabUrl);
      } catch (error) {
        console.error('Error fetching image URLs:', error);
      } finally {
        setLoading(false);
      }
    };
    getImages();
  }, [item.images]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
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
    text: {
      fontSize: 18,
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
    price: {
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 8,
    },
    name: {
      fontSize: 18,
      fontWeight: 'bold',
    },
  });

  const renderItem = ({item}: {item: string}) => (
    <View style={styles.slide}>
      <Image source={{uri: item}} style={styles.image} />
    </View>
  );

  const handleAddToCart = () => {
    if (formuleId === 'All' || formuleId === '') {
      setOffreError(t('Global.OffreErrorEmpty'));
    } else {
      addToCartService(
        formuleId,
        item,
        quantity.toString(),
        currentUser,
        navigation,
        'services',
      );
    }
  };

  useEffect(() => {
    const loadOffers = async () => {
      const newLoadedOffers = {...loadedOffers};
      for (const formula of item.formules) {
        if (!newLoadedOffers[formula.formuleId]) {
          const formule = await getRecordById('formules', formula.formuleId);
          const typePrix = (await getRecordById(
            'type_prix',
            formula.priceType,
          )) as TypePrix;
          const namePrix =
            selectedLanguage === 'fr' ? typePrix.nameFr : typePrix.nameEn;
          newLoadedOffers[formula.formuleId] = formule?.name + '#' + namePrix;
        }
      }
      setLoadedOffers(newLoadedOffers);
    };

    loadOffers();
  }, [item.formules]);

  const increment = () => setQuantity(quantity + 1);
  const decrement = () => setQuantity(quantity > 0 ? quantity - 1 : 0); // Évite les nombres négatifs
  const handleQuantity = (text: string) => {
    const parsed = parseInt(text, 10);
    setQuantity(isNaN(parsed) ? 0 : parsed);
  };

  return (
    <SafeAreaView style={styles.container}>
      <BacktoHome textRoute={t('BuyProduct.title')} />

      {/* Carousel en haut */}
      <View style={styles.carouselContainer}>
        {loading ? (
          <ActivityIndicator size="large" color={theme.colors.primary} />
        ) : (
          <View>
            <Carousel
              data={imageUrls}
              renderItem={renderItem}
              sliderWidth={Dimensions.get('window').width}
              itemWidth={Dimensions.get('window').width - 60}
              autoplay={false}
              loop={false}
              onSnapToItem={index => setActiveSlide(index)} // Met à jour l'index pour la pagination
            />
            <Pagination
              dotsLength={imageUrls.length}
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

      {/* Contenu défilable en dessous */}
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
          {groupSchedule(item.conditions).map((group, idx) => (
            <Text key={idx}>
              {group.days.join(', ')}: {group.startTime} - {group.endTime},{' '}
              {t('WeekSchedule.Capacity')}: {group.capacity}
            </Text>
          ))}
        </View>
        {/* Formules et autres contenus */}
        <View style={styles.infoContainer}>
          {item.formules.map((formule: any, index: number) => {
            const offer = loadedOffers[formule.formuleId] || '';
            const tabOffer = offer.split('#');
            const selectedOffre = formule.id === formuleId;
            const totalPrice =
              parseInt(formule.amount) * quantity! +
              ' ' +
              state.currency.toString();
            return (
              <TouchableOpacity
                style={styles.itemContainer}
                onPress={() => setFormuleId(formule.id)}
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
                      {tabOffer[0]} : {formule.amount}{' '}
                      {state.currency.toString()} {tabOffer[1]}{' '}
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
                      {tabOffer[0]} : {formule.amount}{' '}
                      {state.currency.toString()} {tabOffer[1]}{' '}
                      {t('Global.Total')} : {totalPrice}
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

        {/* Sélection de la quantité */}
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

        {/* Bouton d'ajout au panier */}
        <Button mode="contained" onPress={handleAddToCart}>
          {t('BuyProduct.AddToCart')}
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
};
