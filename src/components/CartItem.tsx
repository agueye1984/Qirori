import { View, Text, StyleSheet, Image, Pressable } from "react-native";
import React, { useState } from "react";
import { Panier, Product } from "../contexts/types";
import { theme } from "../core/theme";
import { getProduct } from "../services/ProductServices";
import { useTranslation } from "react-i18next";
import {widthPercentageToDP as widthToDp, heightPercentageToDP as heightToDp} from 'react-native-responsive-screen';
import { Swipeable } from "react-native-gesture-handler";
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import { useStore } from "../contexts/store";
import { DispatchAction } from "../contexts/reducers/store";
import { useTheme } from "../contexts/theme";

type Props = {
    panier: Panier
}

const CartItem = ({panier}: Props) => {
  const { t } = useTranslation();
  const {ColorPallet} = useTheme()
  const [state,dispatch] = useStore();
  const product = getProduct(panier.product) as Product;
  const styles = StyleSheet.create({
    container: {
      marginTop: 20,
      flexDirection: "row",
      borderBottomWidth: 1,
      paddingBottom: 10,
      borderColor: "#e6e6e6",
      width: widthToDp("90%"),
    },
    image: {
      width: 100,
      height: 100,
      borderRadius: 10,
    },
    title: {
      fontSize: widthToDp(4),
      fontWeight: "bold",
    },
    footer: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    info: {
      marginLeft: widthToDp(3),
      flexDirection: "column",
      justifyContent: "space-between",
      marginVertical: heightToDp(2),
      width: widthToDp(50),
    },
    description: {
      fontSize: widthToDp(3.5),
      color: "#8e8e93",
      marginTop: heightToDp(2),
    },
  
    price: {
      fontSize: widthToDp(4),
    },
    quantity: {
      fontSize: widthToDp(4),
    },
    deleteContainer: {
      marginVertical: 5,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
      paddingVertical: 50,
      paddingHorizontal: 34,
      backgroundColor: ColorPallet.error,
    },
  });

  const handleDelete = (panier: Panier) => {
    dispatch({
      type: DispatchAction.DELETE_CART,
      payload: panier.id,
    })
  }

  const RightSwipeActions = () => {
    return (
      <Pressable onPress={() => handleDelete(panier)} style={({pressed}) => [styles.deleteContainer, pressed && {opacity: 0.8}]}>
        <FontAwesomeIcon name="trash" size={24} color={ColorPallet.white} />
      </Pressable>
    )
  }


  return (
    <Swipeable
        renderRightActions={RightSwipeActions}>
    <View style={styles.container}>
      {/* <Image source={require('../../assets/No_image_available.svg.png')} style={styles.image} /> */}
      <View style={styles.info}>
        <View>
          <Text style={styles.title}>{product.name}</Text>
          <Text style={styles.description}>
            {product.description} • {product.prixUnitaire} {product.devise}
          </Text>
        </View>
        <View style={styles.footer}>
          <Text style={styles.price}>{panier.totalPrice} {product.devise}</Text>
          <Text style={styles.quantity}>x{panier.qty}</Text>
        </View>
      </View>
    </View>
    </Swipeable>
  );
}

export default CartItem;