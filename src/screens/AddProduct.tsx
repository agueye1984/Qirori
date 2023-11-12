import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {SafeAreaView, ScrollView, StyleSheet, Text, View} from 'react-native';
import {DispatchAction} from '../contexts/reducers/store';
import {useStore} from '../contexts/store';
import {useTheme} from '../contexts/theme';
import DefaultComponentsThemes from '../defaultComponentsThemes';
import {BacktoHome} from '../components/BacktoHome';
import Header from '../components/Header';
import {v4 as uuidv4} from 'uuid';
import {Product, User} from '../contexts/types';
import {LocalStorageKeys} from '../constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {NameProduct} from '../components/NameProduct';
import {DescriptionProduct} from '../components/DescriptionProduct';
import {QuantiteProduct} from '../components/QuantiteProduct';
import {PrixUnitaireProduct} from '../components/PrixUnitaireProduct';
import {DeviseProduct} from '../components/DeviseProduct';
import {ImageProduct} from '../components/ImageProduct';
import {theme} from '../core/theme';
import {useTranslation} from 'react-i18next';
import Button from '../components/Button';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import {
  descriptionValidator,
  deviseValidator,
  imageValidator,
  nameSectionValidator,
  prixUnitaireValidator,
  quantiteValidator,
} from '../core/utils';

export const AddProduct = () => {
  const {t} = useTranslation();
  const [, dispatch] = useStore();
  const defaultStyles = DefaultComponentsThemes();
  const {ColorPallet} = useTheme();
  const navigation = useNavigation();
  const [productName, setProductName] = useState<string>('');
  const [nameError, setNameError] = useState('');
  const [productDescription, setProductDescription] = useState<string>('');
  const [descriptionError, setDescriptionError] = useState('');
  const [productDevise, setProductDevise] = useState<string>('');
  const [deviseError, setDeviseError] = useState('');
  const [productImage, setProductImage] = useState<string>('');
  const [imageError, setImageError] = useState('');
  const [productPrixUnitaire, setProductPrixUnitaire] = useState<string>('');
  const [prixUnitaireError, setPrixUnitaireError] = useState('');
  const [productQuantite, setProductQuantite] = useState<string>('');
  const [quantiteError, setQuantiteError] = useState('');
  const [userId, setUserId] = useState('');
  const [defaultVal, setDefaultVal] = useState({key: '', value: t('Dropdown.Select')});

  useEffect(() => {
    const usersRef = firestore().collection('users');
    auth().onAuthStateChanged(user => {
      if (user) {
        console.log(user);
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
    setNameError('');
    setProductName(value);
  };
  const handleDescriptionChange = (value: string) => {
    setDescriptionError('');
    setProductDescription(value);
  };

  const handleQuantiteChange = (value: string) => {
    setQuantiteError('');
    setProductQuantite(value);
  };

  const handlePrixUnitaireChange = (value: string) => {
    setPrixUnitaireError('');
    setProductPrixUnitaire(value);
  };

  const handleDeviseChange = (value: string) => {
    setDeviseError('');
    if(value===''){
      setDefaultVal({key: '', value: t('Dropdown.Select')})
    }
    setProductDevise(value);
  };
  const handleImageChange = (value: string) => {
    setImageError('');
    setProductImage(value);
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
    input: {
      flex: 1,
      textAlignVertical: 'top',
      fontSize: 16,
      height: '100%',
      color: theme.colors.primaryText,
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
  });

  const handleSaveProducts = async () => {
    try {
      const nameEmpty = nameSectionValidator(productName, t);
      const descriptionEmpty = descriptionValidator(productDescription, t);
      const quantiteEmpty = quantiteValidator(productQuantite, t);
      const deviseEmpty = deviseValidator(productDevise, t);
      const prixUnitaireEmpty = prixUnitaireValidator(productPrixUnitaire, t);
      const imageEmpty = imageValidator(productImage, t);

      if (
        nameEmpty ||
        descriptionEmpty ||
        quantiteEmpty ||
        deviseEmpty ||
        prixUnitaireEmpty ||
        imageEmpty
      ) {
        setNameError(nameEmpty);
        setDescriptionError(descriptionEmpty);
        setQuantiteError(quantiteEmpty);
        setDeviseError(deviseEmpty);
        setPrixUnitaireError(prixUnitaireEmpty);
        setImageError(imageEmpty);
      } else {
        const uid = uuidv4();
        // const filename = productImage.substring(productImage.lastIndexOf('/'+1));
        const filename = productImage.split('/').pop();
        //console.log(newPath);
        console.log('adama3' + filename);
        const task = storage().ref(filename).putFile(productImage);
        try {
          await task;
        } catch (e) {
          console.error(e);
        }

        firestore()
          .collection('products')
          .doc(uid)
          .set({
            id: uid,
            name: productName,
            description: productDescription,
            devise: productDevise,
            quantite: parseInt(productQuantite),
            prixUnitaire: parseInt(productPrixUnitaire),
            images: filename,
            userId: userId,
          })
          .then(() => {
            console.log('Product added!');
            navigation.navigate('Ventes' as never);
          });
        /*const fileName = productImage.split('/').pop();
      console.log('productImage is ', productImage);
      console.log('Filename is ', fileName);
      const newPath = `${fs.DocumentDirectoryPath}/${fileName}`; // You don't really need the `'file://` prefix
      console.log(newPath);
      fs.copyFile(productImage, newPath)
        .then(success => {
          console.log('IMG COPIED!');
          console.log(newPath);
        })
        .catch(err => {
          console.log(err.message);
        });

      const userId = await AsyncStorage.getItem(LocalStorageKeys.UserId);
      let product: Product = {
        id: uuidv4(),
        name: productName,
        description: productDescription,
        devise: productDevise,
        quantite: parseInt(productQuantite),
        prixUnitaire: parseInt(productPrixUnitaire),
        images: newPath,
        userId: userId,
      };
      dispatch({
                type: DispatchAction.ADD_PRODUCT,
                payload: product,
            })
            navigation.navigate('Ventes' as never)*/
      }
    } catch (e: unknown) {}
  };

  return (
    <SafeAreaView>
      <BacktoHome textRoute={t('Ventes.title')} />
      <Header>{t('AddProduct.title')}</Header>
      <ScrollView automaticallyAdjustKeyboardInsets={true}>
        <View style={styles.section}>
          <NameProduct
            productName={productName}
            setProductName={handleNameChange}
          />
      
        </View>
        {nameError !='' && (
            <Text style={styles.error}>{nameError}</Text>
          )}
        <View style={styles.section}>
          <DescriptionProduct
            maxLength={200}
            productDescription={productDescription}
            setProductDescription={handleDescriptionChange}
          />
         
        </View>
        {descriptionError !='' && (
            <Text style={styles.error}>{descriptionError}</Text>
          )}
        <View style={styles.section}>
          <QuantiteProduct
            productQuantite={productQuantite}
            setProductQuantite={handleQuantiteChange}
          />
        </View>
        {quantiteError !='' && (
            <Text style={styles.error}>{quantiteError}</Text>
          )}
        <View style={styles.section}>
          <PrixUnitaireProduct
            productPrixUnitaire={productPrixUnitaire}
            setProductPrixUnitaire={handlePrixUnitaireChange}
          />
        </View>
        {prixUnitaireError !='' && (
            <Text style={styles.error}>{prixUnitaireError}</Text>
          )}
        <View style={styles.section}>
          <DeviseProduct
            productDevise={productDevise}
            setProductDevise={handleDeviseChange}
            current={defaultVal}
          />
        </View>
        {deviseError !='' && (
            <Text style={styles.error}>{deviseError}</Text>
          )}
        <View style={styles.section}>
          <ImageProduct
            productImage={productImage}
            setProductImage={handleImageChange}
          />
        </View>
        {imageError !='' && (
            <Text style={styles.error}>{imageError}</Text>
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
