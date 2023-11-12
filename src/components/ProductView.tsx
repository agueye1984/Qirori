import React, { useEffect, useState } from 'react';
import { Text, Image, View, StyleSheet, TouchableOpacity, ImageSourcePropType } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import Icon1 from 'react-native-vector-icons/FontAwesome';
import { useTheme } from '../contexts/theme';
import { Panier, Product } from '../contexts/types';
import { v4 as uuidv4 } from 'uuid';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LocalStorageKeys } from '../constants';
import { useStore } from '../contexts/store';
import { DispatchAction } from '../contexts/reducers/store';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { theme } from '../core/theme';
import storage from '@react-native-firebase/storage';


type Props = {
  product: Product
  onPress: () => void
  image: string
}

export const ProductView = ({ product,image, onPress }: Props) => {
  const { ColorPallet } = useTheme();
  const [quantity, setQuantity] = useState(1);
  const [state, dispatch] = useStore();
  const [userId, setUserId] = useState('');
  const navigation = useNavigation();
  const { t } = useTranslation();
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    storage().ref(image).getDownloadURL().then( url => setImageUrl(url))
  }, [imageUrl]);
console.log(imageUrl)
  AsyncStorage.getItem(LocalStorageKeys.UserId)
    .then((result) => {
      if (result != null) {
        setUserId(result);
      }
    })
    .catch(error => console.log(error))

  const addToCart = () => {
    const findCart = state.carts.find((req) => req.product === product.id && req.userId === userId && !req.paid);
    let idCart = uuidv4();
    let displayAction = DispatchAction.ADD_CART;
    if (findCart != null) {
      idCart = findCart.id;
      displayAction = DispatchAction.UPDATE_CART;
    }
    let cart: Panier = {
      id: idCart,
      product: product.id,
      qty: quantity,
      totalPrice: quantity * product.prixUnitaire,
      paid: false,
      userId: userId
    }
    dispatch({
      type: displayAction,
      payload: cart,
    })
    navigation.navigate('BuyProduct' as never)
  }

  const increment = (value: number) => {
    value += 1;
    setQuantity(value);
  }
  const decrement = (value: number) => {
    value -= 1;
    if (value <= 1) {
      value = 1;
    }
    setQuantity(value);
  }

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
      <View style={{ flexDirection: 'row' }}>
      
      <TouchableOpacity style={styles.card} onPress={onPress}>
        <Image
          style={styles.thumb}
          source={imageUrl==='' ? require('../../assets/No_image_available.svg.png') : {uri:imageUrl}} 
        />
        <View style={styles.infoContainer}>
          <Text style={styles.name}>{product.name}</Text>
          <Text style={styles.price}>{product.prixUnitaire.toLocaleString(undefined, { maximumFractionDigits: 2 }) + ' ' + product.devise}</Text>
        </View>
      </TouchableOpacity>
      </View>
      <View style={[styles.itemContainerForm, { flexDirection: 'row'}]}>
        <View style={{ flexDirection: 'row' }}>
          <View style={{ marginHorizontal: 10, marginVertical: 25 }}>
            <Text>{t('BuyProduct.Quantity')}</Text>
          </View>
          <View style={{ marginHorizontal: 10 , marginLeft:50 }}>
            <TouchableOpacity onPress={() => increment(quantity)} >
              <Icon1 name="angle-up" size={20} color={theme.colors.primaryText} />
            </TouchableOpacity>
            <Text style={{ fontSize: 15, color: 'black' }}>{quantity}</Text>
            <TouchableOpacity onPress={() => decrement(quantity)} >
              <Icon1 name="angle-down" size={20} color={theme.colors.primaryText} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ flexDirection: 'row', marginLeft:100 }}>
          <TouchableOpacity style={styles.card} onPress={addToCart}>
            <Icon
              name={'shoppingcart'}
              color={theme.colors.primary}
              size={30}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}