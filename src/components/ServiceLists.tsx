import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
} from 'react-native';
import storage from '@react-native-firebase/storage';
import {
  Formula,
  ManageEventsParamList,
  Service,
  TypeOffre,
} from '../contexts/types';
import {useTranslation} from 'react-i18next';
import {Swipeable} from 'react-native-gesture-handler';
import {useTheme} from '../contexts/theme';
import Icon from 'react-native-vector-icons/FontAwesome';
import {StackNavigationProp} from '@react-navigation/stack';
import {useNavigation} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import {CategoryList} from './CategoryList';
import Carousel from 'react-native-snap-carousel';
import {getRecordById} from '../services/FirestoreServices';
import {useStore} from '../contexts/store';

type Props = {
  service: Service;
  color: string;
};

type EditServiceProps = StackNavigationProp<
  ManageEventsParamList,
  'EditService'
>;

const ServiceLists = ({service, color}: Props) => {
  const {t} = useTranslation();
  const {ColorPallet} = useTheme();
  const navigation = useNavigation<EditServiceProps>();
  const [imagesUrl, setImagesUrl] = useState<string[]>([]);
  const [loadedOffers, setLoadedOffers] = useState<{[key: number]: string[]}>(
    {},
  );
  const [state] = useStore();
  const devise = state.currency.toString();

  const category = CategoryList(t).find(
    product => product.id == service.category,
  );

  useEffect(() => {
    const getImages = async () => {
      const tabUrl: string[] = [];
      for (const imageServ of service.images) {
        const url = await storage().ref(imageServ).getDownloadURL();
        tabUrl.push(url);
      }
      console.log('Fetched URLs:', tabUrl); // Vérifiez les URLs des images
      setImagesUrl(tabUrl);
    };
    getImages();
  }, [service.images]);

  useEffect(() => {
    const loadOffers = async () => {
      const newLoadedOffers = {...loadedOffers};
      for (const formula of service.formules) {
        if (!newLoadedOffers[formula.id]) {
          const tabOffer: string[] = [];
          for (const offer of formula.offers) {
            const typeOffre = (await getRecordById(
              'type_offres',
              offer,
            )) as TypeOffre;
            tabOffer.push(typeOffre.nameFr);
          }
          newLoadedOffers[formula.id] = tabOffer;
        }
      }
      setLoadedOffers(newLoadedOffers);
    };

    loadOffers();
  }, [service.formules]);

  const renderItem = ({item}: any) => {
    console.log('Rendering item:', item);
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

  const styles = StyleSheet.create({
    contactCon: {
      flex: 1,
      flexDirection: 'row',
      padding: 5,
      borderBottomWidth: 0.5,
      borderBottomColor: '#d9d9d9',
    },
    imgCon: {},
    placeholder: {
      width: 55,
      height: 55,
      borderRadius: 30,
      overflow: 'hidden',
      backgroundColor: '#d9d9d9',
      alignItems: 'center',
      justifyContent: 'center',
      color: color,
    },
    contactDat: {
      flex: 1,
      justifyContent: 'center',
      paddingLeft: 5,
    },
    txt: {
      fontSize: 18,
      color: color,
    },
    name: {
      fontSize: 16,
      color: color,
    },
    phoneNumber: {
      color: '#888',
    },
    thumb: {
      height: 50,
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
      borderBottomLeftRadius: 16,
      borderBottomRightRadius: 16,
      width: 50,
    },
    deleteContainer: {
      marginVertical: 5,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
      paddingHorizontal: 34,
      backgroundColor: ColorPallet.error,
    },
    editContainer: {
      marginVertical: 5,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
      paddingHorizontal: 34,
      backgroundColor: ColorPallet.primary,
    },
    slide: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    image: {
      width: 50,
      height: 120 * 0.75, // Adjust according to your aspect ratio
    },
    wrapper: {},
  });

  const handleDelete = async () => {
    firestore()
      .collection('services')
      .doc(service.id)
      .delete()
      .then(() => {
        console.log('Services deleted!');
      });
  };

  const handleEdit = () => {
    navigation.navigate('EditService', {item: service});
  };

  const RightSwipeActions = () => {
    return (
      <>
        <Pressable
          onPress={() => handleDelete()}
          style={({pressed}) => [
            styles.deleteContainer,
            pressed && {opacity: 0.8},
          ]}>
          <Icon name="trash" size={30} color={ColorPallet.white} />
        </Pressable>
        <Pressable
          onPress={() => handleEdit()}
          style={({pressed}) => [
            styles.editContainer,
            pressed && {opacity: 0.8},
          ]}>
          <Icon name="edit" size={30} color={ColorPallet.white} />
        </Pressable>
      </>
    );
  };

  return (
    <Swipeable renderRightActions={RightSwipeActions}>
      <View style={styles.contactCon}>
        <View style={styles.imgCon}>
          <Carousel
            data={imagesUrl}
            renderItem={renderItem}
            sliderWidth={50}
            itemWidth={50}
            autoplay={true}
            loop={true}
          />
        </View>
        <View style={styles.contactDat}>
          <Text style={styles.name}>
            {t('AddService.Category')} : {category?.name} {t('AddProduct.Name')}{' '}
            : {service.name}{' '}
          </Text>
          {service.formules.map((item: Formula, index: number) => {
            const tabOffer = loadedOffers[item.id] || [];
            return (
              <View>
                <Text style={styles.name} key={index}>
                  {t('AddService.Formula')} {index + 1} : {tabOffer.join('+')}{' '}
                </Text>
                <Text style={styles.name} key={index + 1}>
                  {t('AddProduct.PrixUnitaire')} : {item.amount} {devise}{' '}
                  {item.priceType === '1'
                    ? t('TypePrix.Unit')
                    : t('TypePrix.Person')}{' '}
                </Text>
              </View>
            );
          })}
          <Text style={styles.name}>
            {t('AddProduct.Description')} : {service.description}
          </Text>
        </View>
      </View>
    </Swipeable>
  );
};

export default ServiceLists;
