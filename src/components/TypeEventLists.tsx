import React from 'react';
import {View, Text, StyleSheet, Pressable} from 'react-native';
import {ManageEventsParamList, TypeEvent} from '../contexts/types';
import {useTranslation} from 'react-i18next';
import {useTheme} from '../contexts/theme';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import firestore from '@react-native-firebase/firestore';

type Props = {
  typeEvent: TypeEvent;
  color: string;
};

type AddTypeEventProps = StackNavigationProp<
  ManageEventsParamList,
  'AddTypeEvent'
>;

const TypeEventLists = ({typeEvent, color}: Props) => {
  const {t} = useTranslation();
  const {ColorPallet} = useTheme();
  const navigation = useNavigation<AddTypeEventProps>();

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
      color: color,
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
    copyContainer: {
      marginVertical: 5,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
      paddingHorizontal: 5,
      backgroundColor: ColorPallet.link,
    },
    statusContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    orderCard: {
      backgroundColor: '#f8f9fa',
      marginVertical: 10,
      padding: 15,
      borderRadius: 8,
    },
    orderId: {fontWeight: 'bold', fontSize: 16},
    customer: {marginVertical: 5},
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
  });

  const handleDelete = () => {
    firestore()
      .collection('type_events')
      .doc(typeEvent.id)
      .delete()
      .then(() => {
        console.log('Type event deleted!');
      });
  };

  const handleEdit = () => {
    navigation.navigate('AddTypeEvent', {item: typeEvent, isEditing: true});
  };

  return (
    <View style={styles.orderCard}>
      <Text style={styles.customer}>
        <Text style={styles.orderId}>{t('AddTypeEvent.NameFr')} : </Text>
        {typeEvent.nameFr}
      </Text>
      <Text style={styles.customer}>
        <Text style={styles.orderId}>{t('AddTypeEvent.NameEn')} : </Text>
        {typeEvent.nameEn}
      </Text>
      <View style={styles.imageWrapper}>
        <View style={styles.buttonContainer}>
          <Pressable
            onPress={() => handleEdit()}
            style={({pressed}) => [
              styles.editContainer,
              pressed && {opacity: 0.8},
            ]}>
            <Icon name="edit" size={30} color={ColorPallet.white} />
          </Pressable>
          <Pressable
            onPress={() => handleDelete()}
            style={({pressed}) => [
              styles.deleteContainer,
              pressed && {opacity: 0.8},
            ]}>
            <Icon name="trash" size={30} color={ColorPallet.white} />
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default TypeEventLists;
