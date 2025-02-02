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
  Panier,
  User,
} from '../contexts/types';
import {useTranslation} from 'react-i18next';
import {useTheme} from '../contexts/theme';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {StatusList} from './StatusList';
import {getRecordById} from '../services/FirestoreServices';

type Props = {
  panier: Panier;
  color: string;
};

type EditPanierProps = StackNavigationProp<ManageEventsParamList, 'EditPanier'>;

const OrderDeliveredLists = ({panier, color}: Props) => {
  const {t} = useTranslation();
  const navigation = useNavigation<EditPanierProps>();
  const [userName, setUserName] = useState('');
  const [userAddress, setUserAddress] = useState('');
  const status = StatusList(t).find(stat => stat.id === panier.statut);

  console.log(panier);

  useEffect(() => {
    const fetchUser = async () => {
      const user = (await getRecordById('users', panier.userId)) as User;
      setUserName(user.displayName);
    };

    fetchUser();
  }, [panier.userId]);

  useEffect(() => {
    const fetchCommande = async () => {
      const commande = (await getRecordById(
        'commandes',
        panier.commandeId,
      )) as Commande;
      setUserAddress(commande?.adresse.address_line_1);
    };

    fetchCommande();
  }, [panier.commandeId]);

  const handleEdit = () => {
    navigation.navigate('EditPanier', {item: panier});
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 10,
    },
    orderCard: {
      backgroundColor: '#f8f9fa',
      marginVertical: 10,
      padding: 15,
      borderRadius: 8,
    },
    orderId: {fontWeight: 'bold', fontSize: 16},
    customer: {marginVertical: 5},
    address: {color: '#6c757d'},
    total: {fontWeight: 'bold'},
    statusContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    status: {fontSize: 14, color: '#495057'},
    changeStatusButton: {
      backgroundColor: '#007bff',
      padding: 8,
      borderRadius: 5,
    },
    buttonText: {color: '#fff'},
  });

  return (
    <View style={styles.orderCard}>
      {/* <Text style={styles.orderId}>ID : CMD {1}</Text> */}
      <Text style={styles.customer}>
        <Text style={styles.orderId}>{t('Global.Customer')} : </Text>
        {userName}
      </Text>
      <Text style={styles.address}>
        <Text style={styles.orderId}>{t('Vendeur.Adresse')} : </Text>
        {userAddress}
      </Text>
      <Text style={styles.customer}>
        <Text style={styles.total}>{t('ProductOrderings.TotalAmount')} : </Text>
        {panier.totalPrice} {panier.devise}
      </Text>
      <View style={styles.statusContainer}>
        <Text style={styles.status}>
          <Text style={styles.total}>{t('ProductOrderings.Status')} : </Text>
          {status.name}
        </Text>
        <TouchableOpacity
          style={styles.changeStatusButton}
          onPress={() => handleEdit()}>
          <Text style={styles.buttonText}>{t('Global.Modify')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default OrderDeliveredLists;
