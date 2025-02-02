import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {
  Commande,
  ManageEventsParamList,
  User,
} from '../contexts/types';
import {useTranslation} from 'react-i18next';
import {useTheme} from '../contexts/theme';
import {StackNavigationProp} from '@react-navigation/stack';
import {useNavigation} from '@react-navigation/native';
import {StatusList} from './StatusList';
import {i18n} from '../localization';
import {heightPercentageToDP as heightToDp} from 'react-native-responsive-screen';
import { useStore } from '../contexts/store';

type Props = {
  order: Commande;
  color: string;
};

type ratingProps = StackNavigationProp<ManageEventsParamList, 'RatingScreen'>;

const OrdersItemList = ({order, color}: Props) => {

  const {t} = useTranslation();
  const navigation = useNavigation<ratingProps>();
  const {ColorPallet} = useTheme();
  const [nbItems, setNbItems] = useState(0);
  const [amount, setAmount] = useState(0);
  const [state] = useStore();
  const devise = state.currency.toString();
  const status = StatusList(t).find(stat => stat.id === order.statut);
  const dateDeliver = order.dateDelivered;
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

      taxAmt +=
        parseFloat(panier.qty.toString()) * parseFloat(panier.tax.toString());
      // const taxAmt = Number((panier.tax*panier.qty).toFixed(2));
      amount +=
        parseFloat(panier.totalPrice.toString()) +
        parseFloat(taxAmt.toFixed(2));
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
    imageWrapper: {
      position: 'relative',
      marginRight: 10,
      //marginBottom: 10,
      width: 100,
      height: 30,
      flexDirection: 'row', // Aligner les icônes en ligne
      alignItems: 'center', // Centrer verticalement les icônes
    },
    buttonContainer: {
      position: 'absolute',
      top: 5,
      left: 0,
      right: 0,
      flexDirection: 'row', // Aligner les boutons horizontalement
      justifyContent: 'space-between', // Espacer les boutons uniformément
    },
    removeButton: {
      backgroundColor: 'rgba(255, 0, 0, 0.7)',
      padding: 5,
      borderRadius: 15,
      zIndex: 1,
    },
    replaceButton: {
      backgroundColor: 'rgba(0, 0, 255, 0.7)',
      padding: 5,
      borderRadius: 15,
      zIndex: 1,
    },
    copyButton: {
      backgroundColor: ColorPallet.primary,
      padding: 5,
      borderRadius: 15,
      zIndex: 1,
    },
    formulaItem: {
      borderWidth: 1,
      borderColor: '#ccc',
      padding: 10,
      borderRadius: 5,
      marginTop: 10,
    },
    orderCard: {
      backgroundColor: '#f8f9fa',
      marginVertical: 10,
      padding: 15,
      borderRadius: 8,
    },
    orderId: { fontWeight: 'bold', fontSize: 16 },
    customer: { marginVertical: 5 },
    address: { color: '#6c757d' },
    total: { fontWeight: 'bold' },
    statusContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    status: { fontSize: 14, color: '#495057' },
    changeStatusButton: {
      backgroundColor: '#007bff',
      padding: 8,
      borderRadius: 5,
    },
    buttonText: { color: '#fff' },
  });

  const handleNotation = () => {
    navigation.navigate('RatingScreen', {item: order});
  };

  return (
    <View style={styles.orderCard}>
     {/*  <Text style={styles.customer}><Text style={styles.orderId}>ID :</Text> CMD {1}</Text> */}
      <Text style={styles.customer}><Text style={styles.orderId}>{t('ProductOrderings.nbItems')} :</Text> {nbItems}</Text>
      <Text style={styles.customer}><Text style={styles.total}>{t('ProductOrderings.TotalAmount')} :</Text> {amount} {devise}</Text>
      <Text style={styles.customer}><Text style={styles.total}>{t('ProductOrderings.DateDelivered')} : </Text>{dateLivery}</Text>
      <View style={styles.statusContainer}>
        <Text style={styles.status}><Text style={styles.total}>{t('ProductOrderings.Status')} : </Text>{status.name}</Text>
        <TouchableOpacity
          style={styles.changeStatusButton}
          onPress={() => handleNotation()}
        >
          <Text style={styles.buttonText}>{t('Global.Rating')}</Text>
        </TouchableOpacity>
      </View>
    </View>
     
  );
};

export default OrdersItemList;
