import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Image, Pressable} from 'react-native';
import storage from '@react-native-firebase/storage';
import {Category, Product} from '../contexts/types';
import {useTranslation} from 'react-i18next';
import {useTheme} from '../contexts/theme';
import Icon from 'react-native-vector-icons/FontAwesome';
import firestore from '@react-native-firebase/firestore';
import Carousel from 'react-native-snap-carousel';
import { useStore } from '../contexts/store';
import { getRecordById } from '../services/FirestoreServices';

type Props = {
  product: Product;
  color: string;
};

const ProduitLists = ({product, color}: Props) => {
  const {t, i18n} = useTranslation();
  const {ColorPallet} = useTheme();
  const [state] = useStore();
  const devise = state.currency.toString();
  const selectedLanguage = i18n.language;
  const [imagesUrl, setImagesUrl] = useState<string[]>([]);
  const [category, setCategory] = useState<Category>();
  const [loadedOffers, setLoadedOffers] = useState<{[key: string]: string}>(
    {},
  );


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
  }, [product.category]);

  useEffect(() => {
    const getImages = async () => {
      const tabUrl: string[] = [];
      for (const imageServ of product.images) {
       // console.log(imageServ);
        const url = await storage().ref(imageServ).getDownloadURL();
       //console.log(url);
        tabUrl.push(url);
      }
      setImagesUrl(tabUrl);
    };
    getImages();
  }, [product.images]);

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
    loadOffers();
  }, [product.formules]);

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
      fontWeight:'bold',
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
      paddingHorizontal: 4,
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

  const handleDesactive = () => {
    firestore()
    .collection('products')
    .doc(product.id)
      .update({
        actif: false,
      })
      .then(() => {
        console.log('Users updated!');
      });
  };

  const handleActive = () => {
    firestore()
      .collection('products')
      .doc(product.id)
      .update({
        actif: true,
      })
      .then(() => {
        console.log('Users updated!');
      });
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
            {t('AddProduct.Name')} : {product.name}{' '}
          </Text>
          {product.formules.map((item: any, index: number) => {
            const tabOffer = loadedOffers[item.formuleId] || '';
            return (
              <View key={index}>
                 <Text style={styles.txt} key={index}>
                 {t('AddService.Formula')} {index + 1}
                </Text>
                <Text style={styles.name} key={index+1}>
                  {tabOffer}
                </Text>
                <Text style={styles.name} key={index + 2}>
                  {t('AddProduct.PrixUnitaire')}: {item.amount} {devise}
                </Text>
                <Text style={styles.name} key={index + 3}>
                  {t('AddProduct.Quantite')}: {item.quantity}
                </Text>
              </View>
            );
          })}
          <Text style={styles.name}>
            {t('AddProduct.Description')} : {product.description}
          </Text>
          <View style={styles.imageWrapper}>
            <View style={styles.buttonContainer}>
            {product.actif ? (
            <Pressable
              onPress={() => handleDesactive()}
              style={({pressed}) => [
                styles.editContainer,
                pressed && {opacity: 0.8},
              ]}>
              <Icon name="lock" size={30} color={ColorPallet.white} />
            </Pressable>
          ) : (
            <Pressable
              onPress={() => handleActive()}
              style={({pressed}) => [
                styles.editContainer,
                pressed && {opacity: 0.8},
              ]}>
              <Icon name="unlock" size={30} color={ColorPallet.white} />
            </Pressable>
          )}
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default ProduitLists;
