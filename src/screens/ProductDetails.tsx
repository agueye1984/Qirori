import { RouteProp, useNavigation, useRoute } from "@react-navigation/native"
import { ManageEventsParamList, Panier } from "../contexts/types"
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LocalStorageKeys } from "../constants";
import { Image, StyleSheet, Text, TouchableOpacity, View, SafeAreaView } from "react-native";
import { BacktoHome } from "../components/BacktoHome";
import { t } from 'i18next';
import { theme } from "../core/theme";
import { NumericFormat } from 'react-number-format';
import Icon1 from 'react-native-vector-icons/FontAwesome';
import { useTheme } from "../contexts/theme";
import { useState } from "react";
import { useStore } from "../contexts/store";
import { v4 as uuidv4 } from 'uuid';
import { DispatchAction } from "../contexts/reducers/store";
import Button from "../components/Button";

export const ProductDetails = () => {
  const route = useRoute<RouteProp<ManageEventsParamList, 'ProductDetails'>>();
  const { item } = route.params;
  const navigation = useNavigation();
  const { ColorPallet } = useTheme();
  const [quantity, setQuantity] = useState(1);
  const [state, dispatch] = useStore();
  const [userId, setUserId] = useState('');

  const price = item.prixUnitaire as number;

  const styles = StyleSheet.create({
    productsList: {
      backgroundColor: '#eeeeee',
    },
    productsListContainer: {
      backgroundColor: '#eeeeee',
      paddingVertical: 8,
      marginHorizontal: 8,
    },
    container: {
      backgroundColor: 'white',
      marginVertical: 25,
    },
    header: {
      backgroundColor: theme.colors.primary,
      alignItems: 'center',
      borderBottomWidth: 12,
      borderBottomColor: '#ddd',
    },
    headerText: {
      color: 'white',
      fontSize: 25,
      padding: 20,
      margin: 20,
      textAlign: 'center',
    },
    TitleText: {
      fontSize: 25,
      // padding: 20,
      marginVertical: 20,
    },
    scrollContainer: {
      flex: 1,
      paddingHorizontal: 20,
    },
    section: {
      marginHorizontal: 10,
      paddingVertical: 5,
    },
    thumb: {
      height: 350,
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
      width: 350,
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
  });


  AsyncStorage.getItem(LocalStorageKeys.UserId)
    .then((result) => {
      if (result != null) {
        setUserId(result);
      }
    })
    .catch(error => console.log(error))

  const addToCart = () => {
    const findCart = state.carts.find((req) => req.product === item.name && req.userId === userId && !req.paid);
    let idCart = uuidv4();
    let displayAction = DispatchAction.ADD_CART;
    if (findCart != null) {
      idCart = findCart.id;
      displayAction = DispatchAction.UPDATE_CART;
    }
    let cart: Panier = {
      id: idCart,
      product: item.name,
      qty: quantity,
      totalPrice: quantity * item.prixUnitaire,
      paid: false,
      userId: userId
    }
    console.log(findCart)
    console.log(displayAction)
    console.log(idCart)
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

  return (
    <SafeAreaView>
      <BacktoHome textRoute={t('BuyProduct.title')} />
      <View style={styles.section}>
        <Image
          style={styles.thumb}
          source={require('../../assets/No_image_available.svg.png')}
        />
        <Text style={styles.name}>{t('AddProduct.Name')} : {item.name}</Text>
        <Text style={styles.name}>{t('AddProduct.Description')} : {item.description}</Text>
        <Text style={styles.price} >{t('AddProduct.PrixUnitaire')} : {price + ' ' + item.devise}</Text>
        <View style={{ flexDirection: 'row' }}>
          <View style={{ marginHorizontal: 5, marginVertical: 25 }}>
            <Text style={styles.price} >{t('BuyProduct.Quantity')}</Text>
          </View>
          <View style={{ marginLeft: 250 }}>
            <TouchableOpacity onPress={() => increment(quantity)} >
              <Icon1 name="angle-up" size={20} color={theme.colors.primary} />
            </TouchableOpacity>
            <Text style={{ fontSize: 15, color: 'black' }}>{quantity}</Text>
            <TouchableOpacity onPress={() => decrement(quantity)} >
              <Icon1 name="angle-down" size={20} color={theme.colors.primary} />
            </TouchableOpacity>
          </View>
        </View>
        <Button mode="contained" onPress={addToCart}>
          {t('BuyProduct.AddToCart')}
        </Button>
      </View>
    </SafeAreaView>

  );

}