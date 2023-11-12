import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { Navigation } from '../types.js';
import { ManageEventsParamList, Panier, Product, Service } from '../contexts/types';
import { ProductView } from '../components/ProductView';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
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
import { ServiceView } from '../components/ServiceView';

type Props = {
  heading?: string
  rightLabel?: string
  renderRight?: () => React.ReactNode
  subLabel?: string
}

type productDetailsProp = StackNavigationProp<ManageEventsParamList, 'ServiceDetails'>

export const ServicesOffertsList = () => {
  let qty = 0;
  const { t } = useTranslation();
  const [state] = useStore();
  const navigation = useNavigation<productDetailsProp>()
  const [userId, setUserId] = useState('')
  const [quantity, setQuantity] = useState(qty);
  const [services, setServices] = useState<Service[]>([]);
  const route = useRoute<RouteProp<ManageEventsParamList, 'ServicesOffertsList'>>();
  const categoryId = route.params.item;

  useEffect(() => {
    AsyncStorage.getItem(LocalStorageKeys.UserId)
      .then((result) => {
        if (result != null) {
          setUserId(result);
        }
      })
      .catch(error => console.log(error))
    const services = state.services.filter((serv) => serv.category === categoryId);
    console.log(state.services)
    console.log(categoryId)
   setServices(services);
  }, [])
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

  return (
    <SafeAreaView style={[styles.container]}>
      {/* SchrollView is used in order to scroll the content */}
      <ScrollView scrollEnabled>
        <Header>{t('RequestService.title')}</Header>
        {services.map((item, index) => (
          <ServiceView
            key={index}
            service={item}
            //image={require('../../assets/No_image_available.svg.png')}
            image={item.images}
            onPress={() => {
              navigation.navigate('ServiceDetails', {
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