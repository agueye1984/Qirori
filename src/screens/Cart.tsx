import { useEffect, useState } from "react";
import { LocalStorageKeys } from "../constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Panier, Product } from "../contexts/types";
import { FlatList, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { BacktoHome } from "../components/BacktoHome";
import { t } from "i18next";
import Header from "../components/Header";
import { useStore } from "../contexts/store";
import CartItem from "../components/CartItem";
import { Button } from "react-native-paper";
import { widthPercentageToDP as widthToDp } from 'react-native-responsive-screen';
import { useNavigation } from "@react-navigation/native";

export const Cart = () => {
  const [state] = useStore();
  const navigation = useNavigation()
  let total = 0
  state.carts.map((panier) => {
    total = total + panier.totalPrice;
  });
  // Styles....
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
    section: {
      marginHorizontal: 10,
      paddingVertical: 5,
    },
  });
  console.log(state.carts)
  const checkout = () => {

  }


  return (
    <SafeAreaView style={[styles.container]}>
      {/* SchrollView is used in order to scroll the content */}
      <ScrollView scrollEnabled>
        <Header>{t('Cart.title')}</Header>

        {state.carts.map((panier, index) => (

          <CartItem key={index} panier={panier} />
        ))}
      </ScrollView>
      <View>
        <View style={styles.row}>
          <Text style={styles.cartTotalText}>Items</Text>

          {/* Showing Cart Total */}
          <Text
            style={[
              styles.cartTotalText,
              {
                color: "#4C4C4C",
              },
            ]}
          >
            {/* Dividing the total by 100 because Medusa doesn't store numbers in decimal */}
            {total}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.cartTotalText}>TPS</Text>

          {/* Showing Cart Total */}
          <Text
            style={[
              styles.cartTotalText,
              {
                color: "#4C4C4C",
              },
            ]}
          >
            {/* Dividing the total by 100 because Medusa doesn't store numbers in decimal */}
            {total * 0.05}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.cartTotalText}>TFQ</Text>

          {/* Showing Cart Total */}
          <Text
            style={[
              styles.cartTotalText,
              {
                color: "#4C4C4C",
              },
            ]}
          >
            {/* Dividing the total by 100 because Medusa doesn't store numbers in decimal */}
            {total * 0.09975}
          </Text>
        </View>
        <View style={[styles.row, styles.total]}>
          <Text style={styles.cartTotalText}>Total</Text>
          <Text
            style={[
              styles.cartTotalText,
              {
                color: "#4C4C4C",
              },
            ]}
          >
            {/* Calculating the total */}
            {total + total * 0.09975 + total * 0.05}
          </Text>
        </View>
        <View style={styles.section}>
          <View style={styles.row}>
            <View style={{ marginRight: 80, alignItems: 'flex-start' }}>
              <Button mode="contained" onPress={() => navigation.navigate('BuyProduct' as never)}>
                {t('Global.Back')}
              </Button>
            </View>
            <View style={[{ marginLeft: 80, alignItems: 'flex-end' }]}>
              <Button mode="contained" onPress={() => navigation.navigate('Checkout' as never)}>
                {state.carts.length > 0 ? "Checkout" : "Empty Cart"}
              </Button>
            </View>
          </View>
        </View>
      </View>
      {/* Creating a seperate view to show the total amount and checkout button */}
    </SafeAreaView>

  );
}