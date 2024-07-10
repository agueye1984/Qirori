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
  const {ColorPallet} = useTheme()


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
  });


  return (
      <View style={styles.contactCon}>
        <View style={styles.contactDat}>
        <View style={{flexDirection: 'row'}}>
          <Text style={styles.name}>{t('Administrators.Name')} : </Text>
          <Text style={styles.txt}>{user.displayName} </Text>
        </View>
        <View style={{flexDirection: 'row'}}>
          <Text style={styles.name}>{t('Administrators.Phone')} : </Text>
          <Text style={styles.txt}>{user.phoneNumber} </Text>
        </View>
        <View style={{flexDirection: 'row'}}>
          <Text style={styles.name}>{t('Administrators.Email')} : </Text>
          <Text style={styles.txt}>{user.email}</Text>
        </View>
        </View>
      </View>
  );
};

export default AdminLists;
