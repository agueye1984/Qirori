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
import {useStore} from '../contexts/store';
import {useTheme} from '../contexts/theme';
import {
  Category,
  ManageEventsParamList,
  ProdServEvent,
} from '../contexts/types';
import storage from '@react-native-firebase/storage';
import {
  getFilteredArrayRecords,
  getRecordById,
} from '../services/FirestoreServices';
import Carousel from 'react-native-snap-carousel';
import firestore from '@react-native-firebase/firestore';
import Icon1 from 'react-native-vector-icons/MaterialIcons';

type Props = {
  prodServEvent: ProdServEvent;
  color: string;
};

type AddProdServEventProps = StackNavigationProp<
  ManageEventsParamList,
  'AddProdServEvent'
>;

const ProdServEventLists = ({prodServEvent, color}: Props) => {
  const {t, i18n} = useTranslation();
  const {ColorPallet} = useTheme();
  const navigation = useNavigation<AddProdServEventProps>();
  const [category, setCategory] = useState<Category>();
  const [name, setName] = useState<string>('');
  const [offre, setOffre] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [typeName, setTypeName] = useState<string>('');
  const [state] = useStore();
  const devise = state.currency.toString();
  const selectedLanguage = i18n.language;
 // console.log(prodServEvent.type)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cat = (await getRecordById(
          'categories',
          prodServEvent.category,
        )) as Category;
        setCategory(cat);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [prodServEvent.category]);

  useEffect(() => {
    const fetchData1 = async () => {
      try {
        let documentName = 'products';
        setTypeName(t('Type.Product'));
        if (prodServEvent.type === '2') {
          documentName = 'services';
          setTypeName(t('Type.Service'));
        }
        let data = await getFilteredArrayRecords(
          documentName,
          'formulesId',
          prodServEvent.formule,
        );
        const newServ = data.map(record => record.data as any);
  
        for (const serv of newServ) {
          
          const tabUrl: string[] = [];
          for (const imageServ of serv.images) {
            
            const url = await storage().ref(imageServ).getDownloadURL();
            tabUrl.push(url);
          }
          const formule = serv.formules.find(
            (f: any) => f.id === prodServEvent.formule,
          );

          const form = await getRecordById('formules',formule.formuleId);
          //setOffre(form?.name);
          setOffre(form?.name+' Prix: ' + formule.amount +' ' +devise);
          
          
          setName(serv.name);
          setDescription(serv.description);
          setImageUrls(tabUrl);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData1();
  }, [prodServEvent]);

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
     navigation.navigate('AddProdServEvent', {isEditing: true, id: prodServEvent.eventId, item: prodServEvent });
  };

  const handleDelete = () => {
    firestore()
      .collection('prod_serv_events')
      .doc(prodServEvent.id)
      .delete()
      .then(() => {
        console.log('Prod Serv Events deleted!');
      });
  };

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

  return (
    <View style={styles.formulaItem}>
      <View style={styles.contactCon}>
        <View style={styles.imgCon}>
          <Carousel
            data={imageUrls}
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
            {selectedLanguage === 'fr' ? category?.nameFr : category?.nameEn}
          </Text>
          <Text style={styles.name}>
            {t('AddProdServ.type')} : {typeName}{' '}
          </Text>
          <Text style={styles.name}>
            {t('AddProduct.Name')} : {name}
          </Text>
          <Text style={styles.name}>
            {t('AddProduct.Description')} : {description}
          </Text>
          <Text style={styles.name}>
            {offre}
          </Text>
          <Text style={styles.name}>
            {prodServEvent.custom}
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
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default ProdServEventLists;
