import React, {useContext, useEffect, useMemo, useState} from 'react'
import {View, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity} from 'react-native'
import {ManageEventsParamList, Offre, Product, Service, User} from '../contexts/types'
import {StackNavigationProp} from '@react-navigation/stack'
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native'
import {useStore} from '../contexts/store'
import Header from '../components/Header'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {LocalStorageKeys} from '../constants'
import {useTranslation} from 'react-i18next'
import {widthPercentageToDP as widthToDp} from 'react-native-responsive-screen'
import Button from '../components/Button'
import {ServiceView} from '../components/ServiceView'
import firestore from '@react-native-firebase/firestore'
import auth from '@react-native-firebase/auth'
import Icon from 'react-native-vector-icons/AntDesign'
import {theme} from '../core/theme'
import {ProductView} from '../components/ProductView'
import {Text} from 'react-native-paper'
import {ProductServiceView} from '../components/ProductServiceView'
import {conditionValidator} from '../core/utils'
import {SearchBar} from '../components/SearchBar'
import {BacktoHome} from '../components/BacktoHome'
import {SearchAchat} from '../components/SearchAchat'
import DefaultComponentsThemes from '../defaultComponentsThemes'

type productDetailsProp = StackNavigationProp<ManageEventsParamList, 'ServiceDetails'>

export const ServicesOffertsList = () => {
  let qty = 0
  let achatProduit = {
    id: '',
    name: '',
    description: '',
    images: '',
    type: '',
    prix: '',
    devise: '',
    offres: [
      {
        id: '',
        name: '',
        montant: 0,
        devise: '',
      },
    ],
    conditions: '',
    category: '',
    stock: 0,
  }
  let prodServ: any[] = []
  const {t} = useTranslation()
  const navigation = useNavigation<productDetailsProp>()
  const [userId, setUserId] = useState('')
  const [serviceProduct, setServiceProduct] = useState<any[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const route = useRoute<RouteProp<ManageEventsParamList, 'ServicesOffertsList'>>()
  const categoryId = route.params.item
  const [searchPlaceholder, setSearchPlaceholder] = useState(t('Global.Search'))
  const defaultStyles = DefaultComponentsThemes()

  const getProducts = () => {
    firestore()
      .collection('products')
      .where('category', '==', categoryId)
      .get()
      .then((querySnapshot) => {
        const prod: Product[] = []
        querySnapshot.forEach((documentSnapshot) => {
          const product = documentSnapshot.data() as Product
          achatProduit = {
            id: product.id,
            name: product.name,
            description: product.description,
            images: product.images,
            type: 'product',
            prix: product.prixUnitaire.toString(),
            devise: product.devise,
            offres: [
              {
                id: '',
                name: '',
                montant: 0,
                devise: '',
              },
            ],
            conditions: '',
            category: product.category,
            stock: 0,
          }
          prodServ.push(achatProduit)
          prod.push(product)
        })
        setServiceProduct(prodServ)
        setProducts(prod)
      })
  }

  const getServices = () => {
    firestore()
      .collection('services')
      .where('category', '==', categoryId)
      .get()
      .then((querySnapshot) => {
        const serv: Service[] = []
        querySnapshot.forEach((documentSnapshot) => {
          const service = documentSnapshot.data() as Service
          achatProduit = {
            id: service.id,
            name: service.name,
            description: service.description,
            images: service.images,
            type: 'service',
            prix: '',
            devise: '',
            offres: service.offres,
            conditions: service.conditions,
            category: service.category,
            stock: 0,
          }
          prodServ.push(achatProduit)
          serv.push(service)
        })
        setServiceProduct(prodServ)
        setServices(serv)
      })
  }
  useEffect(() => {
    getProducts()
  }, [categoryId])

  useEffect(() => {
    getServices()
  }, [categoryId])

  console.log(products)

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: widthToDp(90),
      marginTop: 10,
    },
    total: {
      borderTopWidth: 1,
      paddingTop: 10,
      borderTopColor: '#E5E5E5',
      marginBottom: 10,
    },
    cartTotalText: {
      fontSize: widthToDp(4.5),
      color: '#989899',
    },
    addToCart: {
      position: 'absolute',
      bottom: 30,
      right: 10,
      backgroundColor: '#C37AFF',
      width: widthToDp(12),
      height: widthToDp(12),
      borderRadius: widthToDp(10),
      alignItems: 'center',
      padding: widthToDp(2),
      justifyContent: 'center',
    },
    products: {
      flex: 1,
      flexDirection: 'row',
      flexWrap: 'wrap',
      width: widthToDp(100),
      paddingHorizontal: widthToDp(4),
      justifyContent: 'space-between',
    },
    bottomButtonContainer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: '#fff', // Adjust background color as needed
      padding: 15,
      borderTopWidth: 1,
      borderColor: '#ccc', // Optional: Add a border color
    },
    scrollViewContent: {
      flexGrow: 1,
      paddingBottom: 80, // Add padding to the bottom to make space for the fixed button
    },
    cartCount: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 16,
    },
    button: {
      flex: 1,
      marginHorizontal: 10,
    },
  })

  const search = (text: string) => {
    console.log(text)
    if (text === '' || text === null) {
      getProducts()
      getServices()
    } else {
      const filteredProduct = products.filter((item) => {
        return Object.values(item.name).join('').includes(text)
      })
      if (filteredProduct.length == 0) {
        const filteredServices = services.filter((item) => {
          return Object.values(item.name).join('').includes(text)
        })
        if (filteredProduct.length == 0) {
          setProducts(filteredProduct)
          setServices(filteredServices)
        } else {
          setServices(filteredServices)
        }
      } else {
        setProducts(filteredProduct)
      }
    }
  }

  return (
    <SafeAreaView style={[styles.container]}>
      <BacktoHome textRoute={t('Achats.title')} />
      <Header>{t('BuyProduct.title')}</Header>
      <SearchAchat searchPlaceholder={searchPlaceholder} onChangeText={(text) => search(text)} />
      {products.length === 0 && services.length === 0 && (
        <Text
          style={[
            defaultStyles.text,
            {
              marginVertical: 50,
              paddingHorizontal: 10,
              textAlign: 'center',
            },
          ]}>
          {t('Global.EmptyList')}
        </Text>
      )}
      <ScrollView
        automaticallyAdjustKeyboardInsets={true}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.scrollViewContent}>
        {products.map((item, index) => (
          <ProductView
            key={index}
            product={item}
            //image={require('../../assets/No_image_available.svg.png')}
            image={item.images}
            onPress={() => {
              navigation.navigate('ProductDetails', {
                item: item,
              })
            }}
          />
        ))}
        {services.map((item, index) => (
          <ServiceView
            key={index}
            service={item}
            //image={require('../../assets/No_image_available.svg.png')}
            image={item.images}
            onPress={() => {
              navigation.navigate('ServiceDetails', {
                item: item,
              })
            }}
          />
        ))}
      </ScrollView>
      <View style={styles.bottomButtonContainer}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
        <Button mode="contained" onPress={() => navigation.navigate('Achats' as never)} style={styles.button}>
          {t('Global.Back')}
        </Button>
        <Button mode="contained" onPress={() => navigation.navigate('Cart' as never)} style={styles.button}>
          {t('BuyProduct.Cart')}
        </Button>
        </View>
      </View>
      {/* SchrollView is used in order to scroll the content */}

      {/* Creating a seperate view to show the total amount and checkout button */}
    </SafeAreaView>
  )
}
