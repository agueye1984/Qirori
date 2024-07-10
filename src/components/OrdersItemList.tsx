import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  ScrollView,
} from 'react-native';
import storage from '@react-native-firebase/storage';
import {
  Commande,
  Event,
  Invitation,
  ManageEventsParamList,
  Offre,
  Service,
  User,
} from '../contexts/types';
import {useTranslation} from 'react-i18next';
import {Swipeable} from 'react-native-gesture-handler';
import {useTheme} from '../contexts/theme';
import Icon from 'react-native-vector-icons/FontAwesome';
import {StackNavigationProp} from '@react-navigation/stack';
import {useNavigation} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import {CategoryList} from './CategoryList';
import {StatusList} from './StatusList';
import {i18n} from '../localization';
import {heightPercentageToDP as heightToDp} from 'react-native-responsive-screen';

type Props = {
  order: Commande;
  statut: string;
  dateDelivered: string;
  color: string;
};

type ratingProps = StackNavigationProp<
  ManageEventsParamList,
  'RatingScreen'
>;

const OrdersItemList = ({order,statut, dateDelivered, color}: Props) => {
  const {t} = useTranslation();
  const navigation = useNavigation<ratingProps>();
  const {ColorPallet} = useTheme();
  const [users, setUsers] = useState<User[]>([]);
  const [nbItems, setNbItems] = useState(0);
  const [amount, setAmount] = useState(0);
  const status = StatusList(t).find(stat => stat.id === statut);
  const dateDeliver =
  dateDelivered === undefined ? '' : dateDelivered;
  let dateLivery = dateDeliver;
  if (dateLivery != '') {
    const annee = parseInt(dateDeliver.substring(0, 4));
    const mois = parseInt(dateDeliver.substring(4, 6)) - 1;
    const jour = parseInt(dateDeliver.substring(6, 8));
    const date = new Date(annee, mois, jour, 0, 0, 0);

    const selectedLanguageCode = i18n.language;
    dateLivery = date.toLocaleDateString(selectedLanguageCode, {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }

  useEffect(() => {
    let nb = 0;
    let amount = 0;
    let taxAmt = 0;
    order.paniers.map(panier => {
      nb += parseInt(panier.qty.toString());
      
      taxAmt +=  parseFloat(panier.qty.toString())*parseFloat(panier.tax.toString());
      console.log(taxAmt.toFixed(2));
      // const taxAmt = Number((panier.tax*panier.qty).toFixed(2));
      amount += parseFloat(panier.totalPrice.toString())+parseFloat(taxAmt.toFixed(2));
     // console.log(amount);
    });
    setNbItems(nb);
    setAmount(amount);
  }, [order]);

  const styles = StyleSheet.create({
    contactCon: {
      flexDirection: 'row',
      padding: 5,
      borderBottomWidth: 0.5,
      borderBottomColor: '#d9d9d9',
    },
    imgCon: {},
    placeholder: {
      width: 55,
      height: 55,
      borderRadius: 30,
      overflow: 'hidden',
      backgroundColor: '#d9d9d9',
      alignItems: 'center',
      justifyContent: 'center',
      color: color,
    },
    contactDat: {
      justifyContent: 'center',
      paddingLeft: 5,
    },
    txt: {
      fontSize: 16,
      color: color,
    },
    name: {
      fontSize: 16,
      color: ColorPallet.primary,
      fontWeight: 'bold',
    },
    phoneNumber: {
      color: '#888',
    },
    thumb: {
      height: 50,
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
      borderBottomLeftRadius: 16,
      borderBottomRightRadius: 16,
      width: 50,
    },
    deleteContainer: {
      marginVertical: 5,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
      paddingHorizontal: 34,
      backgroundColor: ColorPallet.error,
    },
    editContainer: {
      marginVertical: 5,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
      paddingHorizontal: 34,
      backgroundColor: ColorPallet.primary,
    },
    container: {
      shadowColor: '#000',
      borderRadius: 10,
      marginBottom: heightToDp(4),
      shadowOffset: {
        width: 2,
        height: 5,
      },
    },
  });

  const handleNotation = () => {
    navigation.navigate('RatingScreen', {item: order});
  };


  const RightSwipeActions = (order: Commande) => {
    const avis = order.avis === undefined ? "" : order.avis
    console.log(order)
    if(order.statut==='1' && avis.length===0){
      return (
        <Pressable
        onPress={() => handleNotation()}
          style={({pressed}) => [
            styles.editContainer,
            pressed && {opacity: 0.8},
          ]}>
          <Icon name="star" size={30} color={ColorPallet.white} />
        </Pressable>
        );
    }
  };

  return (
    <Swipeable renderRightActions={()=>RightSwipeActions(order)}>
        <View style={styles.contactCon}>
          <View style={styles.contactDat}>
            <View style={{flexDirection: 'row'}}>
              <Text style={styles.name}>
                {t('ProductOrderings.nbItems')} :{' '}
              </Text>
              <Text style={styles.txt}>{nbItems} </Text>
              <Text style={styles.name}>
                {t('ProductOrderings.TotalAmount')} :{' '}
              </Text>
              <Text style={styles.txt}>{amount} </Text>
            </View>
            <View style={{flexDirection: 'row'}}>
              <Text style={styles.name}>
                {t('ProductOrderings.DateDelivered')} :{' '}
              </Text>
              <Text style={styles.txt}>{dateLivery} </Text>
            </View>
            <View style={{flexDirection: 'row'}}>
              <Text style={styles.name}>{t('ProductOrderings.Status')} : </Text>
              <Text style={styles.txt}>
                {status === undefined ? '' : status.name}{' '}
              </Text>
            </View>
          </View>
      </View>
      </Swipeable>
  );
};

export default OrdersItemList;
