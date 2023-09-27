import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { Navigation } from '../types.js';
import { ManageEventsParamList, Panier, Product } from '../contexts/types';
import { ProductView } from '../components/ProductView';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { useStore } from '../contexts/store';
import Header from '../components/Header';
import { BacktoHome } from '../components/BacktoHome';
import { scale } from 'react-native-size-matters';
import { theme } from '../core/theme';
import { Container } from '../components/Container';
import { SearchBox } from '../components/SearchBox';
import { TitleComp } from '../components/TitleComp';
import { Label } from '../components/Label';
import { TouchableRipple } from 'react-native-paper';
import { shadow } from '../theme';
import Icon from 'react-native-vector-icons/AntDesign';
import { useTheme } from '../contexts/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LocalStorageKeys } from '../constants';
import { useTranslation } from 'react-i18next';
import {widthPercentageToDP as widthToDp, heightPercentageToDP as heightToDp} from 'react-native-responsive-screen';
import Button from '../components/Button';

type Props = {
  heading?: string
  rightLabel?: string
  renderRight?: () => React.ReactNode
  subLabel?: string
}

type productDetailsProp = StackNavigationProp<ManageEventsParamList, 'ProductDetails'>

export const BuyProduct = () => {
  let qty = 0;
  const { t } = useTranslation();
  const [state] = useStore();
  const { ColorPallet } = useTheme()
  const navigation = useNavigation<productDetailsProp>()
  const [userId, setUserId] = useState('')
  const [quantity, setQuantity] = useState(qty);

  useEffect(() => {
    AsyncStorage.getItem(LocalStorageKeys.UserId)
      .then((result) => {
        if (result != null) {
          setUserId(result);
        }
      })
      .catch(error => console.log(error))
    const carts = state.carts.filter((cart) => cart.userId === userId) as Panier[];
    carts.map((cart) => {
      qty += cart.qty;
      setQuantity(qty);
    });
  }, [qty, userId, quantity, state.carts])
  console.log(quantity);
  console.log(state.products);
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
      alignItems: "center",
    },
    row: {
      flexDirection: "row",
      justifyContent: "space-between",
      width: widthToDp(90),
      marginTop: 10,
    },
    total: {
      borderTopWidth: 1,
      paddingTop: 10,
      borderTopColor: "#E5E5E5",
      marginBottom: 10,
    },
    cartTotalText: {
      fontSize: widthToDp(4.5),
      color: "#989899",
    },
    addToCart: {
      position: "absolute",
      bottom: 30,
      right: 10,
      backgroundColor: "#C37AFF",
      width: widthToDp(12),
      height: widthToDp(12),
      borderRadius: widthToDp(10),
      alignItems: "center",
      padding: widthToDp(2),
      justifyContent: "center",
    },
  });


  const RenderTitle = ({ heading, rightLabel }: Props) => {
    return <TitleComp heading={heading} rightLabel={rightLabel} />;
  };

  return (
    <SafeAreaView style={[styles.container]}>
      {/* SchrollView is used in order to scroll the content */}
      <ScrollView scrollEnabled>
        <Header>{t('BuyProduct.title')}</Header>
        <View>
          <TouchableOpacity onPress={() => navigation.navigate('Cart' as never)}>
            <View style={{ flexDirection: 'row', alignItems:'center', alignSelf:'center' }}>
              <Icon
                name={'shoppingcart'}
                color={theme.colors.primary}
                size={30}
              />
              <Text style={{ color: ColorPallet.error, fontWeight: '600' }}>{quantity}</Text>
            </View>
          </TouchableOpacity>
        </View>
        {state.products.map((item, index) => (

          <ProductView
            key={index}
            product={item}
            image={require('../../assets/No_image_available.svg.png')}
            onPress={() => {
              navigation.navigate('ProductDetails', {
                item: item,
              });
            }}
          />
        ))}
      </ScrollView>
      <View>
        <View>
          <View style={styles.row}>
            <View style={{ marginRight: 80, alignItems: 'flex-start' }}>
              <Button mode="contained" onPress={() => navigation.navigate('Achats' as never)}>
                {t('Global.Back')}
              </Button>
            </View>
            <View style={[{ marginLeft: 80, alignItems: 'flex-end' }]}>
              <Button mode="contained" onPress={() => navigation.navigate('Cart' as never)}>
                {t('BuyProduct.Cart')}
              </Button>
            </View>
          </View>
        </View>
      </View>
      {/* Creating a seperate view to show the total amount and checkout button */}
    </SafeAreaView>

  );
}