import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import DefaultComponentsThemes from '../defaultComponentsThemes';
import {BacktoHome} from '../components/BacktoHome';
import Header from '../components/Header';
import {v4 as uuidv4} from 'uuid';
import {useTranslation} from 'react-i18next';
import Button from '../components/Button';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {
  categoryValidator,
  productValidator,
  serviceValidator,
  typeValidator,
} from '../core/utils';
import {useStore} from '../contexts/store';
import {CategoryService} from '../components/CategoryService';
import {ManageEventsParamList} from '../contexts/types';
import {SelectList} from 'react-native-dropdown-select-list';
import {useTheme} from '../contexts/theme';
import {theme} from '../core/theme';
import {getFilteredRecords, getRecordById} from '../services/FirestoreServices';
import { TextInput as PaperTextInput } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { StackNavigationProp } from '@react-navigation/stack';

type prodServEventProps = StackNavigationProp<
  ManageEventsParamList,
  'ProdServEvents'
>;

export const AddProdServEvent = () => {
  const route = useRoute<RouteProp<ManageEventsParamList, 'AddProdServEvent'>>();
  const eventId = route.params?.id || '';
  const isEditing = route.params?.isEditing || false;
  const prodServEventToEdit = route.params?.item || null;

  const {t, i18n} = useTranslation();
  const defaultStyles = DefaultComponentsThemes();
  const navigation = useNavigation<prodServEventProps>();
  const [serviceCategory, setServiceCategory] = useState<string>(prodServEventToEdit?.category || '');
  const [categoryError, setCategoryError] = useState('');
  const [productError, setProductError] = useState('');
  const [typeError, setTypeError] = useState('');
  const [boutonActif, setBoutonActif] = useState(false);
  const [typeProdServ, setTypeProdServ] = useState<string>(prodServEventToEdit?.type || '');
  
  const {ColorPallet} = useTheme();
  const selectedLanguageCode = i18n.language;
  const [state] = useStore();
  const devise = state.currency;
  const types: any[] = [
    {
      key: '1',
      value: t('Type.Product'),
    },
    {
      key: '2',
      value: t('Type.Service'),
    },
  ];
  const [categories, setCategories] = useState<string[]>([]);
  const [productVisible, setProductVisible] = useState(false);
  const [serviceVisible, setServiceVisible] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [product, setProduct] = useState(prodServEventToEdit?.formule || '');
  
  const [service, setService] = useState(prodServEventToEdit?.formule || '');
  const [customProdServ, setCustomProdServ] = useState('');
  const [prodServError, setProdServError] = useState('');

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('categories')
      .onSnapshot(querySnapshot => {
        if (querySnapshot.empty) {
          setCategories([]);
        } else {
          const newCat: string[] = [];
          querySnapshot.forEach(documentSnapshot => {
            newCat.push(documentSnapshot.id);
          });
          setCategories(newCat);
        }
      });

    // Nettoyage de l'écouteur lors du démontage du composant
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getFilteredRecords(
        'products',
        'category',
        serviceCategory,
      );
      
      const uniqueOffers: Record<string, any> = {};
      for (const record of data) {
        for (const formula of record.data.formules) {
          const formule = await getRecordById(
            'formules',
            formula.formuleId,
          );
          const name = formule?.name;
          const offer = {
            key: formula.id,
            value:
              '(' +
              record.data.name +
              ') ' +
              name +
              ' Prix: ' +
              formula.amount +
              ' ' +
              devise,
          };
          if (!uniqueOffers[offer.key]) {
            uniqueOffers[offer.key] = offer; // Ajouter l'offre si la clé n'existe pas encore
          }
        }
      }
      const sortedOffers = Object.values(uniqueOffers).sort((a, b) =>
          a.value.toLowerCase().localeCompare(b.value.toLowerCase()),
        );
        setProducts(sortedOffers);
    }
    fetchData();
  }, [selectedLanguageCode,devise,serviceCategory]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getFilteredRecords(
        'services',
        'category',
        serviceCategory,
      );
      const uniqueOffers: Record<string, any> = {};
      for (const record of data) {
        for (const formula of record.data.formules) {
          const formule = await getRecordById(
            'formules',
            formula.formuleId,
          );
          const offer = { key: formula.id.toString(), value: formule?.name +' Prix: ' + formula.amount +' ' +devise};
          if (!uniqueOffers[offer.key]) {
            uniqueOffers[offer.key] = offer; // Ajouter l'offre si la clé n'existe pas encore
          }
        }
      }
      const sortedOffers = Object.values(uniqueOffers).sort((a, b) =>
          a.value.toLowerCase().localeCompare(b.value.toLowerCase()),
        );
        setServices(sortedOffers);
      }
    
    fetchData();
  }, [selectedLanguageCode,devise,serviceCategory]);


  const handleCategoryChange = (value: string) => {
    setCategoryError('');
    setServiceCategory(value);
  };

  const handleTypeProdServChange = (value: string) => {
    if(value==='1'){
      setProductVisible(true)
      setServiceVisible(false)
      setService('')
    } else{
      setProductVisible(false)
      setServiceVisible(true)
      setProduct('')
    }
    setTypeProdServ(value);
    setTypeError('')
  };

  const handleProductChange = (value: string) => {
    setProduct(value)
    setProductError('')
  };

  const handleServiceChange = (value: string) => {
    setService(value)
    setProductError('')
  };

  const handleCustomProdChange = (value: string) => {
    setCustomProdServ(value);
  };

  

  const handleSaveProducts = async () => {
    const categoryEmpty = categoryValidator(serviceCategory, t);
    const typeEmpty = typeValidator(typeProdServ, t);
    let formuleEmpty='';
    let formule = ''
    if(typeEmpty===''){
      if(typeProdServ==='1'){
        formuleEmpty = productValidator(product, t);
        formule = product;
      } else{
        formuleEmpty = serviceValidator(service, t);
        formule = service;
      }
    }
    
    if (categoryEmpty || typeEmpty  || formuleEmpty) {
      setCategoryError(categoryEmpty);
      setProdServError(formuleEmpty)
      setTypeError(typeEmpty)
    } else {
      const updatedProdServEvent = {
        eventId: eventId,
        category: serviceCategory,
        type: typeProdServ,
        formule: formule,
        custom: customProdServ,
      };
      if (isEditing && prodServEventToEdit?.id) {
            await firestore()
              .collection('prod_serv_events')
              .doc(prodServEventToEdit.id)
              .update(updatedProdServEvent);
            console.log('Product Service updated!');
          } else {
            const uid = uuidv4();
            await firestore()
              .collection('prod_serv_events')
              .doc(uid)
              .set({
                id: uid,
                ...updatedProdServEvent,
              });
            console.log('Product Service Event created!');
          }
          setBoutonActif(false);
          navigation.navigate('ProdServEvents', {id: eventId })
    }
  };

  const styles = StyleSheet.create({
    container: {
      minHeight: 50,
      marginVertical: 10,
      borderWidth: 1,
      borderColor: 'grey',
      borderRadius: 4,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
    },
    buttonStyle: {
      flex: 1,
      width: '100%',
      height: '100%',
      backgroundColor: 'transparent',
    },
    text: {
      textAlign: 'left',
    },
    dropdownStyle: {
      borderColor: ColorPallet.lightGray,
      borderBottomWidth: 2,
      borderLeftWidth: 2,
      borderRightWidth: 2,
      borderStyle: 'solid',
      borderBottomLeftRadius: 4,
      maring: '0',
      borderBottomRightRadius: 4,
    },
    input: {
     // width: 70,
      backgroundColor: theme.colors.surface,
      width: '100%', // Prend toute la largeur du conteneur
    },
    selectedContainer: {
      marginTop: 20,
    },
    selectedLabel: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    selectedItem: {
      fontSize: 14,
      marginTop: 5,
    },
    formulaItem: {
      borderWidth: 1,
      borderColor: '#ccc',
      padding: 10,
      borderRadius: 5,
      marginTop: 10,
    },
    formulaText: {
      fontSize: 16,
    },
    deleteContainer: {
      marginVertical: 5,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
      paddingHorizontal: 34,
      backgroundColor: ColorPallet.error,
    },
    customRegionContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 10,
    },
    textInput: {
      borderWidth: 1,
      borderColor: '#ccc',
      padding: 8,
      marginRight: 10,
      flex: 1,
    },
    imageWrapper: {
      position: 'relative',
      marginRight: 10,
      //marginBottom: 10,
      width: 100,
      height: 30,
    },
    image: {
      width: '100%',
      height: '100%',
      borderRadius: 8,
    },
    replaceButton: {
      position: 'absolute',
      top: 5,
      left: 5,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      padding: 5,
      borderRadius: 15,
      zIndex: 1, // S'assurer que l'icône est au-dessus de l'image
    },
    removeButton: {
      position: 'absolute',
      top: 5,
      right: 5,
      backgroundColor: 'rgba(255, 0, 0, 0.7)',
      padding: 5,
      borderRadius: 15,
      zIndex: 1, // S'assurer que l'icône est au-dessus de l'image
    },
    multiSelectContainer: {
      /* borderWidth: 1,
      borderColor: 'grey',
      borderRadius: 5, */
      minHeight: 50,
      marginVertical: 10,
      borderWidth: 1,
      borderColor: 'grey',
      borderRadius: 4,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
    },
    multiSelectMainWrapper: {
      borderWidth: 1,
      borderColor: 'grey',
      borderRadius: 5,
    },
    multiSelectInputGroup: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    multiSelectText: {
      textAlign: 'center',
    },
    errorBorder: {
      borderColor: 'red', // Bordure rouge en cas d'erreur
      borderWidth:1
    },
  });

  const data = [
    {key: 'header', component: <Header>{isEditing ? t('AddProdServ.EditFormProdServ') : t('AddProdServ.AddFormProdServ')}</Header>},
    {
      key: 'error',
      component: <Text style={defaultStyles.error}>{productError}</Text>,
    },
    {
      key: 'category',
      component: (
        <View style={defaultStyles.section}>
          <CategoryService
            categoryService={serviceCategory}
            setCategoryService={handleCategoryChange}
            error={categoryError}
            categoryVendeur={categories}
          />
           {categoryError && (
            <Text style={defaultStyles.error}>
              {categoryError}
            </Text>
          )}
        </View>
      ),
    },
    {
      key: 'type',
      component: (
        <View style={defaultStyles.section}>
          <SelectList
              key={typeProdServ}
              //boxStyles={styles.container}
              boxStyles={
                typeError ? { ...styles.container, ...styles.errorBorder } : styles.container
              }
              setSelected={handleTypeProdServChange}
              data={types}
              search={true}
              save="key"
              placeholder={t('Dropdown.Type')}
              dropdownTextStyles={{backgroundColor: theme.colors.surface}}
             // inputStyles={{backgroundColor: theme.colors.surface}}
              inputStyles={
                typeError
                  ? { backgroundColor: theme.colors.surface, color: 'red' } // Placeholder en rouge en cas d'erreur
                  : {backgroundColor: theme.colors.surface}
              }
              defaultOption={
                typeProdServ
                  ? types.find(typ => typ.key === typeProdServ)
                  : undefined
              }
            />
            {typeError && (
            <Text style={defaultStyles.error}>
              {typeError}
            </Text>
          )}
        </View>
      ),
    },
    {
      key: 'produit_service',
      component: (
        <View style={defaultStyles.section}>
          {productVisible && (
            <SelectList
              key={product}
              //boxStyles={styles.container}
              boxStyles={
                prodServError ? { ...styles.container, ...styles.errorBorder } : styles.container
              }
              setSelected={handleProductChange}
              data={products}
              search={true}
              save="key"
              placeholder={t('Dropdown.Product')}
              dropdownTextStyles={{backgroundColor: theme.colors.surface}}
              //inputStyles={{backgroundColor: theme.colors.surface}}
              inputStyles={
                prodServError
                  ? { backgroundColor: theme.colors.surface, color: 'red' } // Placeholder en rouge en cas d'erreur
                  : {backgroundColor: theme.colors.surface}
              }
              defaultOption={
                product
                  ? products.find(prod => prod.key === product)
                  : undefined
              }
            />
          )}
          {serviceVisible && (
             <SelectList
             key={service}
            // boxStyles={styles.container}
            boxStyles={
              prodServError ? { ...styles.container, ...styles.errorBorder } : styles.container
            }
             setSelected={handleServiceChange}
             data={services}
             search={true}
             save="key"
             placeholder={t('Dropdown.Service')}
             dropdownTextStyles={{backgroundColor: theme.colors.surface}}
             //inputStyles={{backgroundColor: theme.colors.surface}}
             inputStyles={
              prodServError
                ? { backgroundColor: theme.colors.surface, color: 'red' } // Placeholder en rouge en cas d'erreur
                : {backgroundColor: theme.colors.surface}
            }
             defaultOption={
              service
                 ? services.find(serv => serv.key === service)
                 : undefined
             }
           />
          )}
          {prodServError && (
            <Text style={defaultStyles.error}>
              {prodServError}
            </Text>
          )}
        </View>
      ),
    },
    {
      key: 'custom_prod_serv',
      component: (
        <View style={defaultStyles.section}>
          <PaperTextInput
            label={t('AddProdServ.Custom')}
            // style={styles.textInput}
            // placeholder={t('AddService.Offre')}
            value={customProdServ}
            onChangeText={handleCustomProdChange}
            style={styles.input}
            autoCapitalize="none"
            returnKeyType="done"
          />
        </View>
      ),
    }
  ];


  return (
    <SafeAreaView style={{flex: 1}}>
      <BacktoHome textRoute={t('Events.title')} />
      <FlatList
        data={data}
        renderItem={({item}) => <View>{item.component}</View>}
        keyExtractor={item => item.key}
        contentContainerStyle={defaultStyles.scrollViewContent}
      />
      <View style={defaultStyles.bottomButtonContainer}>
        <View style={defaultStyles.buttonContainer}>
          <Button
            mode="contained"
            onPress={() => navigation.navigate('ProdServEvents', {id: eventId })}
            style={defaultStyles.button}>
            {t('Global.Cancel')}
          </Button>
          <Button
            mode="contained"
            onPress={handleSaveProducts}
            style={defaultStyles.button}
            disabled={boutonActif}>
            {isEditing ? t('Global.Modify') : t('Global.Create')}
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
};
