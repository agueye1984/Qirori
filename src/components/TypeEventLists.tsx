import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Image, Pressable} from 'react-native';
import storage from '@react-native-firebase/storage';
import {ManageEventsParamList, Product, TypeEvent} from '../contexts/types';
import {useTranslation} from 'react-i18next';
import {Swipeable} from 'react-native-gesture-handler';
import {useTheme} from '../contexts/theme';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import firestore from '@react-native-firebase/firestore';

type Props = {
  typeEvent: TypeEvent;
  color: string;
};

type EditTypeEventProps = StackNavigationProp<
  ManageEventsParamList,
  'EditTypeEvent'
>;

const TypeEventLists = ({typeEvent, color}: Props) => {
  const {t} = useTranslation();
  const {ColorPallet} = useTheme();
  const navigation = useNavigation<EditTypeEventProps>();
  const [imageUrl, setImageUrl] = useState<string>('');

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
    navigation.navigate('EditTypeEvent', {item: typeEvent});
  };

  const RightSwipeActions = () => {
    return (
      <>
        <Pressable
          onPress={() => handleDelete()}
          style={({pressed}) => [
            styles.deleteContainer,
            pressed && {opacity: 0.8},
          ]}>
          <Icon name="trash" size={30} color={ColorPallet.white} />
        </Pressable>
        <Pressable
          onPress={() => handleEdit()}
          style={({pressed}) => [
            styles.editContainer,
            pressed && {opacity: 0.8},
          ]}>
          <Icon name="edit" size={30} color={ColorPallet.white} />
        </Pressable>
      </>
    );
  };

  return (
    <Swipeable renderRightActions={RightSwipeActions}>
      <View style={styles.contactCon}>
      <View style={styles.contactDat}>
        <View style={{flexDirection: 'row'}}>
          <Text style={styles.name}>{t('AddTypeEvent.NameFr')} : </Text>
          <Text style={styles.txt}>{typeEvent.nameFr}</Text>
        </View>
        <View style={{flexDirection: 'row'}}>
          <Text style={styles.name}>{t('AddTypeEvent.NameEn')} : </Text>
          <Text style={styles.txt}>{typeEvent.nameEn}</Text>
        </View>
        </View>
      </View>
    </Swipeable>
  );
};

export default TypeEventLists;
