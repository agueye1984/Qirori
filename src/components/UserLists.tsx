import React from 'react';
import {View, Text, StyleSheet, Pressable} from 'react-native';
import { User} from '../contexts/types';
import {useTranslation} from 'react-i18next';
import {Swipeable} from 'react-native-gesture-handler';
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

  const RightSwipeActions = (actif: boolean) => {
    if(actif===true){
      return (
        <Pressable
          onPress={() => handleDesactive()}
          style={({pressed}) => [
            styles.editContainer,
            pressed && {opacity: 0.8},
          ]}>
          <Icon name="lock" size={30} color={ColorPallet.white} />
        </Pressable>
        );
    } else {
      return (
        <Pressable
          onPress={() => handleActive()}
          style={({pressed}) => [
            styles.editContainer,
            pressed && {opacity: 0.8},
          ]}>
          <Icon name="unlock" size={30} color={ColorPallet.white} />
        </Pressable>
        );
    }
  };

  return (
     <Swipeable renderRightActions={() => RightSwipeActions(user.actif)}> 
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
     </Swipeable> 
  );
};

export default UserLists;
