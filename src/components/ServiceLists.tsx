import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useStore} from '../contexts/store';
import {useTheme} from '../contexts/theme';
import {
  Category,
  Formula,
  ManageEventsParamList,
  Service,
  TypePrix,
} from '../contexts/types';
import storage from '@react-native-firebase/storage';
import {getRecordById} from '../services/FirestoreServices';
import Carousel from 'react-native-snap-carousel';
import firestore from '@react-native-firebase/firestore';
import Icon1 from 'react-native-vector-icons/MaterialIcons';

type Props = {
  service: Service;
  color: string;
};

type AddServiceProps = StackNavigationProp<
  ManageEventsParamList,
  'AddService'
>;

const ServiceLists = ({service, color}: Props) => {
  const {t, i18n} = useTranslation();
  const {ColorPallet} = useTheme();
  const navigation = useNavigation<AddServiceProps>();
  const [imagesUrl, setImagesUrl] = useState<string[]>([]);
  const [loadedOffers, setLoadedOffers] = useState<{[key: string]: string}>(
    {},
  );
  const [category, setCategory] = useState<Category>();
  const [state] = useStore();
  const devise = state.currency.toString();
  const selectedLanguage = i18n.language;


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
  }, [service.category]);

  useEffect(() => {
    const getImages = async () => {
      const tabUrl: string[] = [];
      for (const imageServ of service.images) {
        const url = await storage().ref(imageServ).getDownloadURL();
        tabUrl.push(url);
      }
      setImagesUrl(tabUrl);
    };
    getImages();
  }, [service.images]);

  useEffect(() => {
    const loadOffers = async () => {
      const newLoadedOffers = {...loadedOffers};
      for (const formula of service.formules) {
        if (!newLoadedOffers[formula.formuleId]) {
          const formule = await getRecordById('formules', formula.formuleId);
          const typePrix = await getRecordById('type_prix', formula.priceType) as TypePrix;
          const namePrix = selectedLanguage === 'fr' ? typePrix.nameFr : typePrix.nameEn;
          newLoadedOffers[formula.formuleId] = formule?.name +'#'+namePrix;
        }
      }
      setLoadedOffers(newLoadedOffers);
    };
    loadOffers();
  }, [service.formules]);

  const renderItem = ({item}: any) => {
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
      // borderBottomWidth: 0.5,
      borderBottomColor: '#d9d9d9',
    },
    imgCon: {},
    contactDat: {
      flex: 1,
      justifyContent: 'center',
      paddingLeft: 5,
    },
    name: {
      fontSize: 16,
      color: color,
    },
    deleteContainer: {
      marginVertical: 5,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
      paddingHorizontal: 5,
      backgroundColor: ColorPallet.error,
    },
    editContainer: {
      marginVertical: 5,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
      paddingHorizontal: 5,
      backgroundColor: ColorPallet.primary,
    },
    copyContainer: {
      marginVertical: 5,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
      paddingHorizontal: 5,
      backgroundColor: ColorPallet.link,
    },
    slide: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    image: {
      width: 50,
      height: 250 * 0.75, // Adjust according to your aspect ratio
    },
    wrapper: {},
    imageWrapper: {
      position: 'relative',
      marginRight: 10,
      //marginBottom: 10,
      width: 100,
      height: 30,
      flexDirection: 'row', // Aligner les icônes en ligne
      alignItems: 'center', // Centrer verticalement les icônes
    },
    buttonContainer: {
      position: 'absolute',
      top: 5,
      left: 0,
      right: 0,
      flexDirection: 'row', // Aligner les boutons horizontalement
      justifyContent: 'space-between', // Espacer les boutons uniformément
    },
    removeButton: {
      backgroundColor: 'rgba(255, 0, 0, 0.7)',
      padding: 5,
      borderRadius: 15,
      zIndex: 1,
    },
    replaceButton: {
      backgroundColor: 'rgba(0, 0, 255, 0.7)',
      padding: 5,
      borderRadius: 15,
      zIndex: 1,
    },
    copyButton: {
      backgroundColor: ColorPallet.primary,
      padding: 5,
      borderRadius: 15,
      zIndex: 1,
    },
    formulaItem: {
      borderWidth: 1,
      borderColor: '#ccc',
      padding: 10,
      borderRadius: 5,
      marginTop: 10,
    },
  });

  const handleEdit = () => {
    navigation.navigate('AddService', {item: service, isEditing: true});
  };

  const handleDelete = () => {
    firestore()
      .collection('services')
      .doc(service.id)
      .delete()
      .then(() => {
        console.log('Services deleted!');
      });
  };

  const handleDuplicate = () => {
    navigation.navigate('AddService', {item: service, isEditing: false});
  };

  return (
    <View style={styles.formulaItem}>
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
            {t('AddService.Category')} :{' '}
            {selectedLanguage === 'fr' ? category?.nameFr : category?.nameEn}{' '}
            {t('AddProduct.Name')} : {service.name}{' '}
          </Text>
          {service.formules.map((item: Formula, index: number) => {
            const offer = loadedOffers[item.id] || '';
            const tabOffer = offer.split('#')
            return (
              <View key={index}>
                <Text style={styles.name} key={index}>
                  {t('AddService.Formula')} {index + 1} : {tabOffer[0]}{' '}
                </Text>
                <Text style={styles.name} key={index + 1}>
                  {t('AddProduct.PrixUnitaire')} : {item.amount} {devise}{' '}
                  {tabOffer[1]}{' '}
                </Text>
              </View>
            );
          })}
          <Text style={styles.name}>
            {t('AddProduct.Description')} : {service.description}
          </Text>
          <View style={styles.imageWrapper}>
            <View style={styles.buttonContainer}>
              {/* Bouton pour remplacer l'image */}
              <Pressable
                onPress={() => handleEdit()}
                style={styles.replaceButton}>
                <Icon1 name="edit" size={20} color="white" />
              </Pressable>
              {/* Bouton pour supprimer l'image */}
              <Pressable
                onPress={() => handleDelete()}
                style={styles.removeButton}>
                <Icon1 name="delete" size={20} color="white" />
              </Pressable>
              {/* Bouton pour dupliquer l'image */}
              <Pressable
                onPress={() => handleDuplicate()}
                style={styles.copyButton}>
                <Icon name="copy" size={20} color="white" />
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default ServiceLists;
