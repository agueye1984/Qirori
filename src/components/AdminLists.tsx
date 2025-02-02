import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {User} from '../contexts/types';
import {useTranslation} from 'react-i18next';
import {useTheme} from '../contexts/theme';

type Props = {
  user: User;
  color: string;
};

const AdminLists = ({user, color}: Props) => {
  const {t} = useTranslation();
  const {ColorPallet} = useTheme();

  const styles = StyleSheet.create({
    contactCon: {
      flex: 1,
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
      flex: 1,
      justifyContent: 'center',
      paddingLeft: 5,
    },
    txt: {
      fontSize: 18,
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
    orderCard: {
      backgroundColor: '#f8f9fa',
      marginVertical: 10,
      padding: 15,
      borderRadius: 8,
    },
    orderId: {fontWeight: 'bold', fontSize: 16},
    customer: {marginVertical: 5},
    address: {color: '#6c757d'},
  });

  return (
    <View style={styles.orderCard}>
      <Text style={styles.customer}>
        <Text style={styles.orderId}>{t('Administrators.Name')} : </Text>
        {user.displayName}
      </Text>
      <Text style={styles.customer}>
        <Text style={styles.orderId}>{t('Administrators.Phone')} : </Text>
        {user.phoneNumber}
      </Text>
      <Text style={styles.address}>
        <Text style={styles.orderId}>{t('Administrators.Email')} : </Text>
        {user.email}
      </Text>
    </View>
  );
};

export default AdminLists;
