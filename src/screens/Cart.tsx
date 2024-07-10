import {SafeAreaView, ScrollView, Text, View} from 'react-native'
import {t} from 'i18next'
import Header from '../components/Header'
import CartItem from '../components/CartItem'
import {Button} from 'react-native-paper'
import {useNavigation} from '@react-navigation/native'
import {useEffect, useState} from 'react'
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
import {Panier} from '../contexts/types'
import Paragraph from '../components/Paragraph'
import CartItemOffre from '../components/CartItemOffre'
import DefaultComponentsThemes from '../defaultComponentsThemes'

export const Cart = () => {
  const currentUser = auth().currentUser
  const navigation = useNavigation()
  const [total, setTotal] = useState(0)
  const [totalTaxe, setTotalTaxe] = useState(0)
  const [carts, setCarts] = useState<Panier[]>([])
  const defaultStyles = DefaultComponentsThemes()

  const getCarts = () => {
    firestore()
      .collection('carts')
      // Filter results
      .where('userId', '==', currentUser?.uid)
      .where('paid', '==', false)
      .get()
      .then((querySnapshot) => {
        let tot = 0
        let tax = 0
        let cart: Panier[] = []
        querySnapshot.forEach((documentSnapshot) => {
          const panier = documentSnapshot.data() as Panier
          cart.push(panier)
          tot += panier.totalPrice
          const taxUnit = Number(panier.tax.toFixed(2))
          const taxTot = taxUnit * panier.qty
          tax = Number((tax + taxTot).toFixed(2))
        })
        setCarts(cart)
        setTotal(tot)
        setTotalTaxe(Number(tax.toFixed(2)))
      })
  }

  useEffect(() => {
    getCarts()
  }, [currentUser?.uid])

  return (
    <SafeAreaView style={{flex: 1}}>
      {/* SchrollView is used in order to scroll the content */}
      <ScrollView
        scrollEnabled
        showsVerticalScrollIndicator
        automaticallyAdjustKeyboardInsets={true}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={defaultStyles.scrollViewContent}>
        <Header>{t('Cart.title')}</Header>

        {carts.map((panier, index) => {
          if (panier.product != undefined) {
            return <CartItem key={index} panier={panier} />
          } else {
            return <CartItemOffre key={index} panier={panier} />
          }
        })}
      </ScrollView>
      {carts.length > 0 ? (
        <View style={defaultStyles.bottomButtonContainer}>
          <View style={defaultStyles.rowCart}>
            <Text style={defaultStyles.cartTotalText}>{t('Cart.Subtotal')}</Text>

            {/* Showing Cart Total */}
            <Text
              style={[
                defaultStyles.cartTotalText,
                {
                  color: '#4C4C4C',
                },
              ]}>
              {/* Dividing the total by 100 because Medusa doesn't store numbers in decimal */}
              {total}
            </Text>
          </View>
          <View style={defaultStyles.rowCart}>
            <Text style={defaultStyles.cartTotalText}>{t('Cart.tax')}</Text>

            {/* Showing Cart Total */}
            <Text
              style={[
                defaultStyles.cartTotalText,
                {
                  color: '#4C4C4C',
                },
              ]}>
              {/* Dividing the total by 100 because Medusa doesn't store numbers in decimal */}
              {totalTaxe}
            </Text>
          </View>
          <View style={[defaultStyles.rowCart, defaultStyles.total]}>
            <Text style={defaultStyles.cartTotalText}>{t('Cart.Total')}</Text>
            <Text
              style={[
                defaultStyles.cartTotalText,
                {
                  color: '#4C4C4C',
                },
              ]}>
              {/* Calculating the total */}
              {Number((total + totalTaxe).toFixed(2))}
            </Text>
          </View>

          <View style={{flexDirection: 'row', justifyContent: 'space-between', width: '100%', padding: 10}}>
            <View style={{width: 150}}>
              <Button mode="contained" onPress={() => navigation.goBack()} style={defaultStyles.button}>
                {t('Global.Back')}
              </Button>
            </View>
            {carts.length > 0 && (
              <View style={{width: 220}}>
                <Button
                  mode="contained"
                  onPress={() => navigation.navigate('Checkout' as never)}
                  style={defaultStyles.button}>
                  {t('Cart.Checkout')}
                </Button>
              </View>
            )}
          </View>
        </View>
      ) : (
        <View style={defaultStyles.bottomButtonContainer}>
          <Paragraph>{t('Cart.EmptyCart')}</Paragraph>
          <Button mode="contained" onPress={() => navigation.goBack()}>
            {t('Global.Back')}
          </Button>
        </View>
      )}
      {/* Creating a seperate view to show the total amount and checkout button */}
    </SafeAreaView>
  )
}
