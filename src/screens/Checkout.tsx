import { useEffect, useState } from "react";
import { LocalStorageKeys } from "../constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Adresse, Commande, Panier, Product } from "../contexts/types";
import { FlatList, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { BacktoHome } from "../components/BacktoHome";
import Header from "../components/Header";
import { useStore } from "../contexts/store";
import CartItem from "../components/CartItem";
import { Button } from "react-native-paper";
import { widthPercentageToDP as widthToDp, heightPercentageToDP as heightToDp } from 'react-native-responsive-screen';
import { useNavigation } from "@react-navigation/native";
import ShippingAddress from "../components/ShippingAddress";
import Icon from 'react-native-vector-icons/Fontisto';
import defaultComponentsThemes from "../defaultComponentsThemes";
import { useTheme } from "../contexts/theme";
import { useTranslation } from "react-i18next";
import { v4 as uuidv4 } from 'uuid';

export const Checkout = () => {
  const { t } = useTranslation();
  const [state] = useStore();
  const navigation = useNavigation()
  const [shippingAddress, setShippingAddress] = useState({});
  const defaultStyles = defaultComponentsThemes();
  const { ColorPallet } = useTheme();
  const [paymentPaypal, setPaymentPaypal] = useState(true)
  const [accesToken, setAccesToken] = useState('');
  let total = 0
  state.carts.map((panier) => {
    total = total + panier.totalPrice;
  });
  // Styles....
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
    },
    address: {
      marginHorizontal: widthToDp(5),
    },
    payment: {
      marginHorizontal: widthToDp(5),
      marginTop: heightToDp(4),
    },
    shipping: {
      marginHorizontal: widthToDp(5),
    },
    title: {
      fontSize: widthToDp(4.5),
    },
    shippingOption: {
      marginTop: heightToDp(2),
    },
    row: {
      flexDirection: "row",
      justifyContent: "space-between",
      width: widthToDp(90),
      marginTop: 10,
    },
    section: {
      marginHorizontal: 10,
      paddingVertical: 5,
    },
  });

  const handleAddressInputChange = (address: any) => {
    setShippingAddress(address);
  };

  const placeOrder = async () => {
    let items: any[] = [];
    state.carts.map((panier) => {
      const product = state.products.find((product) => (product.id == panier.product));
      const item: any = {
        "name": product?.name,
        "description": product?.description,
        "quantity": panier.qty,
        "unit_amount": {
          "currency_code": product?.devise,
          "value": product?.prixUnitaire
        }
      }
      items.push(item);
    });
    const dataDetail = {
      "intent": "CAPTURE",
      "purchase_units": [
        {
          items,
          "amount": {
            "currency_code": "USD",
            "value": "100.00",
            "breakdown": {
              "item_total": {
                "currency_code": "USD",
                "value": "100.00"
              }
            }
          }
        }
      ],
      "application_context": {
        "return_url": "https://example.com/return",
        "cancel_url": "https://example.com/cancel"
      }
    }
    console.log(dataDetail);
    fetch('https://api.sandbox.paypal.com/v1/oauth2/token',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          //'Authorization': `Bearer A21AAK949j1jpfkd9-3oAERKuE0Kdeme5OdHzUkiuotHnIuB1KCOk3nK5LK2ogqxCjtO1ba3f88XdvVnzqmy8Bgxbr4DH6_ag`
          'Authorization': `Basic QVQ2UzBxTFhqb2lxajFBdmVnV0FMbGFxUkRNT29UV3ZLU0RFRXM1Zzh5OUJwM0J3UDAwcktlLUlFRUkxWWZMalY4M2FLd2N3X29OZ0FFcmU6RUoxT3hJbjEwYV9QdThxNFdTdHlIekdkMktXeGdoVmJQZVc0VDh6ZzBjeW1CSE5EbUdFZEo2MDVEVjQ2MC16RFUwOGcwUWt3RTBOSTNmN1g=`
        },
        body: 'grant_type=client_credentials'
      }

    )
      .then(res => res.json())
      .then(response => {
        console.log("response", response);
        setAccesToken(response.access_token);

        fetch('https://api.sandbox.paypal.com/v1/payments/payment',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${response.access_token}`
            },
            body: JSON.stringify(dataDetail)
          }
        )
          .then(res => res.json())
          .then(response => {
            console.log("dataDetail", JSON.stringify(dataDetail));
            console.log("response", response);
            const { id, links } = response;
            const approvalUrl = links.find((data: any) => data.rel == "approval_url");
            console.log("approvalUrl", approvalUrl);
          }).catch(err => {
            console.log(...err);
          })
      }).catch(err => {
        console.log(...err);
      })

    let order: Commande = {
      id: uuidv4(),
      paniers: state.carts,
      adresse: shippingAddress as Adresse,
      paymentId: "",
      orderId: "",
      userId: null
    };
    // console.log(shippingAddress);
  }


  return (
    <SafeAreaView style={styles.container}>
      <Header>Checkout</Header>
      <ScrollView>
        <View style={styles.address}>
          <Text style={styles.title}>Shipping Address</Text>
          <ShippingAddress onChange={handleAddressInputChange} />
        </View>
        <View style={styles.payment}>
          <Text style={styles.title}>Payment</Text>
          <Text>Amount Order {total + total * 0.05 + total * 0.09975}</Text>
          <View>
            <TouchableOpacity style={defaultStyles.itemContainer} onPress={handleAddressInputChange}>
              <View style={defaultStyles.touchableStyle}>
                {paymentPaypal ? (
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Icon name={'radio-btn-active'} size={20} color={ColorPallet.primary} />
                    <Text style={[defaultStyles.text, { paddingLeft: 5, fontWeight: 'bold' }]}>Paypal</Text>
                  </View>
                ) : (
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Icon name={'radio-btn-passive'} size={20} color={ColorPallet.primary} />
                    <Text style={[defaultStyles.text, { paddingLeft: 5 }]}>Other</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      <View style={styles.section}>
        <View style={[styles.row]}>
          <View style={{ marginLeft: 15, marginRight: 80, alignItems: 'flex-start' }}>
            <Button mode="contained" onPress={() => navigation.navigate('BuyProduct' as never)}>
              {t('Global.Back')}
            </Button>
          </View>
          <View style={[{ marginLeft: 80, alignItems: 'flex-end' }]}>
            <Button mode="contained" onPress={placeOrder}>
              Place Order
            </Button>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}