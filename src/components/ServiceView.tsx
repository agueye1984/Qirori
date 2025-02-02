import React, {useEffect, useState} from 'react';
import {Text, Image, View, StyleSheet, TouchableOpacity} from 'react-native';
import {useTheme} from '../contexts/theme';
import {
  Category,
  ManageEventsParamList,
  ScheduleState,
  Service,
  TypePrix,
} from '../contexts/types';
import {useTranslation} from 'react-i18next';
import {theme} from '../core/theme';
import Icon2 from 'react-native-vector-icons/Fontisto';
import defaultComponentsThemes from '../defaultComponentsThemes';
import storage from '@react-native-firebase/storage';
import {useNavigation} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import {StackNavigationProp} from '@react-navigation/stack';
import {
  widthPercentageToDP as widthToDp,
  heightPercentageToDP as heightToDp,
} from 'react-native-responsive-screen';
import {useStore} from '../contexts/store';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import {getRecordById} from '../services/FirestoreServices';
import {GetWeekendList} from './WeekendList';
import {addToCartService} from '../services/CartsServices';
import Stepper from './Stepper';
import Button from './Button';

type Props = {
  service: Service;
  images: string[];
  participantCount: number;
  onPress: () => void;
  selectFormule: string;
};

type serviceOfferProp = StackNavigationProp<
  ManageEventsParamList,
  'ServicesOffertsList'
>;

interface GroupedSchedule {
  startTime: string;
  endTime: string;
  capacity: string;
  days: string[];
}

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

export const ServiceView = ({
  service,
  images,
  participantCount,
  onPress,
  selectFormule,
}: Props) => {
  const currentUser = auth().currentUser;
  const {ColorPallet} = useTheme();
  const {t, i18n} = useTranslation();
  const defaultStyles = defaultComponentsThemes();
  const [quantity, setQuantity] = useState(participantCount);
  const [formuleId, setFormuleId] = useState(selectFormule);
  const navigation = useNavigation<serviceOfferProp>();
  //const category = CategoryList(t).find(cat => cat.id === service.category);
  const [category, setCategory] = useState<Category>();
  const [state] = useStore();
  const [offreError, setOffreError] = useState('');
  const [imagesUrl, setImagesUrl] = useState<string[]>([]);
  const [activeSlide, setActiveSlide] = useState(0);
  const [loadedTypePrix, setLoadedTypePrix] = useState<{
    [key: string]: string[];
  }>({});

  const selectedLanguage = i18n.language;
  const [loadedOffers, setLoadedOffers] = useState<{[key: string]: string}>({});
  const devise = state.currency.toString();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cat = (await getRecordById(
          'categories',
          service.category,
        )) as Category;
        setCategory(cat);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [service]);

  useEffect(() => {
    const getImages = async () => {
      const tabUrl: string[] = [];
      for (const imageServ of images) {
        const url = await storage().ref(imageServ).getDownloadURL();
        tabUrl.push(url);
      }
      setImagesUrl(tabUrl);
    };
    getImages();
  }, [images]);

  useEffect(() => {
    setQuantity(participantCount);
  }, [participantCount]);

  useEffect(() => {
    setFormuleId(selectFormule);
  }, [selectFormule]);

  useEffect(() => {
    const loadOffers = async () => {
      const newLoadedOffers = {...loadedOffers};
      for (const formula of service.formules) {
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
  }, [service.formules]);

  const setSelectedOffre = (id: string) => {
    //console.log(id)
    setOffreError('');
    setFormuleId(id);
  };

  const increment = () => setQuantity(quantity + 1);
  const decrement = () => setQuantity(quantity > 0 ? quantity - 1 : 0); // Évite les nombres négatifs
  const handleQuantity = (text: string) => {
    const parsed = parseInt(text, 10);
    setQuantity(isNaN(parsed) ? 0 : parsed);
  };

  const handleAddToCart = () => {
    if (formuleId === 'All' || formuleId === '') {
      setOffreError(t('Global.OffreErrorEmpty'));
    } else {
      setOffreError('');
      addToCartService(
        formuleId,
        service,
        quantity.toString(),
        currentUser,
        navigation,
        'services',
      );
    }
  };

  const styles = StyleSheet.create({
    card: {
      //backgroundColor: 'white',
      borderRadius: 16,
      //shadowOpacity: 0.2,
      // shadowRadius: 4,
      // shadowColor: 'black',
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
            onSnapToItem={index => setActiveSlide(index)} // Met à jour l'index pour la pagination
          />
          <Pagination
            dotsLength={images.length}
            activeDotIndex={activeSlide} // Met à jour la pagination selon le slide actif
            containerStyle={styles.paginationContainer}
            dotStyle={styles.dot}
            inactiveDotStyle={styles.inactiveDot}
            inactiveDotOpacity={0.4}
            inactiveDotScale={0.6}
          />
          <Text style={styles.name}>{service.name}</Text>
          <Text style={styles.title}>
            {selectedLanguage === 'fr' ? category?.nameFr : category?.nameEn}{' '}
          </Text>
          {groupSchedule(service.conditions).map((group, idx) => (
            <Text key={idx}>
              {group.days.join(', ')}: {group.startTime} - {group.endTime},{' '}
              {t('WeekSchedule.Capacity')}: {group.capacity}
            </Text>
          ))}
          <View style={styles.infoContainer}>
            {service.formules.map((item: any, index: number) => {
              const offer = loadedOffers[item.formuleId] || '';
              const tabOffer = offer.split('#');
              const selectedOffre = item.id === formuleId;
              const totalPrice =
                parseInt(item.amount) * quantity! + ' ' + devise;
              return (
                <TouchableOpacity
                  style={styles.itemContainer}
                  onPress={() => setSelectedOffre(item.id)}
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
                        {tabOffer[0]} : {item.amount} {devise} {tabOffer[1]}{' '}
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
                        {tabOffer[0]} : {item.amount} {devise} {tabOffer[1]}{' '}
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
