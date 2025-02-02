import React from 'react';
import {View, Text, StyleSheet, Pressable} from 'react-native';
import {User} from '../contexts/types';
import {useTranslation} from 'react-i18next';
import {useTheme} from '../contexts/theme';
import Icon from 'react-native-vector-icons/FontAwesome';
import firestore from '@react-native-firebase/firestore';

type Props = {
  user: User;
  color: string;
};

const UserLists = ({user, color}: Props) => {
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
      paddingHorizontal: 5,
      backgroundColor: ColorPallet.error,
    },
    editContainer: {
      marginVertical: 5,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
      paddingHorizontal: 5,
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
    statusContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
  });

  const handleDesactive = () => {
    firestore()
      .collection('users')
      .doc(user.id)
      .update({
        actif: false,
      })
      .then(() => {
        console.log('Users updated!');
      });
  };

  const handleActive = () => {
    firestore()
      .collection('users')
      .doc(user.id)
      .update({
        actif: true,
      })
      .then(() => {
        console.log('Users updated!');
      });
  };

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
      <View style={styles.statusContainer}>
      {user.actif ? (
            <Pressable
              onPress={() => handleDesactive()}
              style={({pressed}) => [
                styles.editContainer,
                pressed && {opacity: 0.8},
              ]}>
              <Icon name="lock" size={30} color={ColorPallet.white} />
            </Pressable>
          ) : (
            <Pressable
              onPress={() => handleActive()}
              style={({pressed}) => [
                styles.editContainer,
                pressed && {opacity: 0.8},
              ]}>
              <Icon name="unlock" size={30} color={ColorPallet.white} />
            </Pressable>
          )}
      </View>
    </View>
  );
};

export default UserLists;
