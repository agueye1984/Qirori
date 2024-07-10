import React, {useEffect, useState} from 'react';
import {Text, Image, View, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import Icon1 from 'react-native-vector-icons/FontAwesome';
import {useTheme} from '../contexts/theme';
import {
  ManageEventsParamList,
  Offre,
  Panier,
  Service,
  User,
} from '../contexts/types';
import {useTranslation} from 'react-i18next';
import {theme} from '../core/theme';
import Icon2 from 'react-native-vector-icons/Fontisto';
import defaultComponentsThemes from '../defaultComponentsThemes';
import storage from '@react-native-firebase/storage';
import {CategoryList} from './CategoryList';
import {useNavigation} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {v4 as uuidv4} from 'uuid';
import {StackNavigationProp} from '@react-navigation/stack';
import {ServiceView} from './ServiceView';
import {ProductView} from './ProductView';

type Props = {
  service: any;
  image: string;
};

type serviceOfferProp = StackNavigationProp<
  ManageEventsParamList,
  'ServicesOffertsList'
>;

export const ProductServiceView = ({service, image}: Props) => {
  const {ColorPallet} = useTheme();
  const {t} = useTranslation();
  const defaultStyles = defaultComponentsThemes();
  const [quantity, setQuantity] = useState(1);
  const [imageUrl, setImageUrl] = useState('');
  const [offreId, setOffreId] = useState('');
  const [userId, setUserId] = useState('');
  const navigation = useNavigation<serviceOfferProp>();
  const category = CategoryList(t).find(cat => cat.id === service.category);

  console.log(service.type);
  console.log(category);

  useEffect(() => {
    const usersRef = firestore().collection('users');
    auth().onAuthStateChanged(user => {
      if (user) {
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

  useEffect(() => {
    storage()
      .ref(image)
      .getDownloadURL()
      .then(url => setImageUrl(url));
  }, [image]);

  const setSelectedOffre = (id: string) => {
    setOffreId(id);
  };

  const increment = (value: number) => {
    value += 1;
    setQuantity(value);
  };
  const decrement = (value: number) => {
    value -= 1;
    if (value <= 1) {
      value = 1;
    }
    setQuantity(value);
  };

  const addToCart = () => {
    firestore()
      .collection('carts')
      // Filter results
      .where('userId', '==', userId)
      .where('offre', '==', offreId)
      .where('paid', '==', false)
      .get()
      .then(querySnapshot => {
        let idCart = uuidv4();
        const offre = service.offres.find(
          (offre: Offre) => offre.id == offreId,
        );
        const offreMontant = offre === undefined ? 0 : offre.montant;
        if (querySnapshot.empty) {
          firestore()
            .collection('carts')
            .doc(idCart)
            .set({
              id: idCart,
              offre: offreId,
              qty: quantity,
              totalPrice: quantity * offreMontant,
              paid: false,
              userId: userId,
            })
            .then(() => {
              console.log('Cart added!');
            });
        } else {
          querySnapshot.forEach(documentSnapshot => {
            const panier = documentSnapshot.data() as Panier;
            firestore()
              .collection('carts')
              .doc(panier.id)
              .update({
                id: panier.id,
                offre: offreId,
                qty: quantity,
                totalPrice: quantity * offreMontant,
                paid: false,
                userId: userId,
              })
              .then(() => {
                console.log('Cart updated!');
              });
          });
        }
      });
    navigation.navigate('ServicesOffertsList', {
      item: service.category,
    });
  };

  const styles = StyleSheet.create({
    card: {
      backgroundColor: 'white',
      borderRadius: 16,
      shadowOpacity: 0.2,
      shadowRadius: 4,
      shadowColor: 'black',
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
    },
    name: {
      fontSize: 22,
      fontWeight: 'bold',
    },
    price: {
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 8,
    },
    itemContainerForm: {
      height: 70,
      marginHorizontal: 5,
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
  });

  return (
    <View>
      <View>
        {service.type === 'service' && (
          <ServiceView
            service={service}
            image={service.images}
            onPress={() => {
              navigation.navigate('ServiceDetails', {
                item: service,
              });
            }}
          />
        )}

        {service.type === 'product' && (
          <ProductView
            product={service}
            image={service.images}
            onPress={() => {
              navigation.navigate('ProductDetails', {
                item: service,
              });
            }}
          />
        )}
      </View>
    </View>
  );
};
