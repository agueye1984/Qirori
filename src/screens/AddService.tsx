import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {DispatchAction} from '../contexts/reducers/store';
import {useStore} from '../contexts/store';
import {useTheme} from '../contexts/theme';
import DefaultComponentsThemes from '../defaultComponentsThemes';
import {BacktoHome} from '../components/BacktoHome';
import Header from '../components/Header';
import {v4 as uuidv4} from 'uuid';
import {Offre, Service, User} from '../contexts/types';
import {LocalStorageKeys} from '../constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {NameProduct} from '../components/NameProduct';
import {DescriptionProduct} from '../components/DescriptionProduct';
import {ImageProduct} from '../components/ImageProduct';
import {theme} from '../core/theme';
import {useTranslation} from 'react-i18next';
import Button from '../components/Button';
import {OffreService} from '../components/OffreService';
import {CategoryService} from '../components/CategoryService';
import {PrixUnitaireProduct} from '../components/PrixUnitaireProduct';
import {DeviseProduct} from '../components/DeviseProduct';
import { CategoryList } from '../components/CategoryList';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

export const AddService = () => {
  let initOffre: Offre[] = [];
  const {t} = useTranslation();
  const [, dispatch] = useStore();
  const defaultStyles = DefaultComponentsThemes();
  const {ColorPallet} = useTheme();
  const navigation = useNavigation();
  const [serviceName, setServiceName] = useState<string>('');
  const [nameDirty, setNameDirty] = useState(false);
  const [serviceDescription, setServiceDescription] = useState<string>('');
  const [descriptionDirty, setDescriptionDirty] = useState(false);
  const [serviceImage, setServiceImage] = useState<string>('');
  const [imageDirty, setImageDirty] = useState(false);
  const [offres, setOffres] = useState(initOffre);
  const [offre, setOffre] = useState<string>('');
  const [offreDirty, setOffreDirty] = useState(false);
  const [serviceCategory, setServiceCategory] = useState<string>('');
  const [categoryDirty, setCategoryDirty] = useState(false);
  const [montant, setMontant] = useState<number>(0);
  const [montantDirty, setMontantDirty] = useState(false);
  const [devise, setDevise] = useState<string>('');
  const [deviseDirty, setDeviseDirty] = useState(false);
  const [userId, setUserId] = useState('');
  const [defaultVal, setDefaultVal] = useState({key: '', value: t('Dropdown.Select')});

  useEffect(() => {
    const usersRef = firestore().collection('users');
    auth().onAuthStateChanged(user => {
      if (user) {
        console.log(user)
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
 

  const handleNameChange = (value: string) => {
    setNameDirty(true);
    setServiceName(value);
  };
  const handleDescriptionChange = (value: string) => {
    setDescriptionDirty(true);
    setServiceDescription(value);
  };

  const handleImageChange = (value: string) => {
    setImageDirty(true);
    setServiceImage(value);
  };

  const handleOffreChange = (value: string) => {
    setOffreDirty(true);
    setOffre(value);
  };

  const handleCategoryChange = (value: string) => {
    setCategoryDirty(true);
    setServiceCategory(value);
  };

  const handleMontanthange = (value: string) => {
    const mnt = value === '' ? 0 : parseInt(value);
    setMontantDirty(true);
    setMontant(mnt);
  };

  const handleDeviseChange = (value: string) => {
    setDeviseDirty(true);
    setDevise(value);
  };

  const deleteOffre = (offres: Offre[], number: number) => {
    setOffres(offres.filter((offer, index) => index !== number));
  };

  const styles = StyleSheet.create({
    section: {
      marginHorizontal: 10,
      paddingVertical: 5,
    },
    buttonsContainer: {
      paddingBottom: 50,
    },
    error: {
      ...defaultStyles.text,
      color: ColorPallet.error,
      fontWeight: 'bold',
    },

    itemContainer: {
      borderTopWidth: 0.2,
      borderTopStyle: 'solid',
    },
    row: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    container: {
      minHeight: 50,
      marginTop: 10,
      marginBottom: 10,
      paddingHorizontal: 10,
      borderWidth: 1,
      borderColor: ColorPallet.lightGray,
      borderRadius: 4,
    },
    itemContainerForm: {
      height: 50,
      marginHorizontal: 5,
      borderWidth: 0.3,
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
      borderBottomRightRadius: 10,
      borderBottomLeftRadius: 10,
    },
    containerMain: {
      flex: 1,
      alignItems: 'center',
    },
    bottomView: {
      width: '100%',
      height: 50,
      backgroundColor: '#EE5407',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute',
      bottom: 0,
    },
    textStyle: {
      color: '#fff',
      fontSize: 18,
    },
  });

  const addOffre = (offres: Offre[]) => {
    const offer = {
      name: offre,
      montant: montant,
      devise: devise,
    };
    offres.push(offer);
    setOffre('');
    setOffreDirty(false);
    setMontant(0);
    setMontantDirty(false);
    setDefaultVal({key: '', value: t('Dropdown.Select')});
    setDeviseDirty(false);
    setOffres(offres);
  };

  const handleSaveProducts = async () => {
    try {
      const uid = uuidv4();
      const filename = serviceImage.split('/').pop();
      const task = storage().ref(filename).putFile(serviceImage);
      try {
        await task;
      } catch (e) {
        console.error(e);
      }
      firestore()
          .collection('services')
          .doc(uid)
          .set({
            id: uid,
            name: serviceName,
            description: serviceDescription,
            images: filename,
            userId: userId,
            offres: offres,
            category: serviceCategory,
          })
          .then(() => {
            console.log('Service added!');
            navigation.navigate('Ventes' as never);
          });
    } catch (e: unknown) {}
  };

  return (
    <SafeAreaView style={{flex:1}}>
      <BacktoHome textRoute={t('Ventes.title')} />
      <Header>{t('AddService.title')}</Header>
        <ScrollView scrollEnabled={true} showsVerticalScrollIndicator={true} automaticallyAdjustKeyboardInsets={true}>
          <View style={styles.section}>
            <CategoryService
              categoryService={serviceCategory}
              setCategoryService={handleCategoryChange}
            />
            {serviceCategory.length === 0 && categoryDirty && (
              <Text style={styles.error}>{t('Global.CategoryErrorEmpty')}</Text>
            )}
          </View>
          <View style={styles.section}>
            <NameProduct
              productName={serviceName}
              setProductName={handleNameChange}
            />
            {serviceName.length === 0 && nameDirty && (
              <Text style={styles.error}>{t('Global.NameErrorEmpty')}</Text>
            )}
          </View>
          <View style={styles.section}>
            <DescriptionProduct
              maxLength={200}
              productDescription={serviceDescription}
              setProductDescription={handleDescriptionChange}
            />
            {serviceDescription.length === 0 && descriptionDirty && (
              <Text style={styles.error}>
                {t('Global.DescriptionErrorEmpty')}
              </Text>
            )}
          </View>
          <View style={styles.section}>
            <Text>{t('AddService.Offre')}</Text>
            <View style={styles.row}>
              <View style={{alignSelf: 'flex-start', marginRight: 15}}>
                <OffreService
                  offreService={offre}
                  setOffreService={handleOffreChange}
                />
                {offre.length === 0 && offreDirty && (
                  <Text style={styles.error}>
                    {t('Global.OffreErrorEmpty')}
                  </Text>
                )}
                <PrixUnitaireProduct
                  productPrixUnitaire={montant === 0 ? '' : montant.toString()}
                  setProductPrixUnitaire={handleMontanthange}
                />
                {montant === 0 && montantDirty && (
                  <Text style={styles.error}>
                    {t('Global.PrixUnitaireErrorEmpty')}
                  </Text>
                )}
                <DeviseProduct
                  productDevise={devise}
                  setProductDevise={handleDeviseChange}
                  current={defaultVal}
                />
                {devise.length === 0 && deviseDirty && (
                  <Text style={styles.error}>
                    {t('Global.DeviseErrorEmpty')}
                  </Text>
                )}
              </View>
              <View style={[{alignSelf: 'flex-end', marginVertical: 75}]}>
                <Button mode="contained" onPress={() => addOffre(offres)}>
                  {t('Global.Add')}
                </Button>
              </View>
            </View>
          </View>
          <View style={styles.section}>
            {offres.map((offer: Offre, index: number) => {
              return (
                <View key={index}>
                  <TouchableOpacity
                    key={index}
                    onPress={() => deleteOffre(offres, index)}>
                    <View
                      style={[styles.itemContainerForm, {marginVertical: 5}]}>
                      <Text style={{textAlign: 'center', marginVertical: 15}}>
                        {offer.name} : {offer.montant} {offer.devise}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
          <View style={styles.section}>
            <ImageProduct
              productImage={serviceImage}
              setProductImage={handleImageChange}
            />
          </View>
          {serviceImage.length === 0 && imageDirty && (
            <Text style={styles.error}>{t('Global.ImageErrorEmpty')}</Text>
          )}
        </ScrollView>
        <View style={styles.section}>
          <View style={styles.row}>
            <View style={{marginRight: 90, alignItems: 'flex-start'}}>
              <Button
                mode="contained"
                onPress={() => navigation.navigate('Ventes' as never)}>
                {t('Global.Cancel')}
              </Button>
            </View>
            <View style={[{marginLeft: 90, alignItems: 'flex-end'}]}>
              <Button mode="contained" onPress={handleSaveProducts}>
                {t('Global.Create')}
              </Button>
            </View>
          </View>
        </View>
    </SafeAreaView>
  );
};
